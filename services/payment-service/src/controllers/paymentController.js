const prisma = require('../lib/prisma');
const { REVENUE_SPLIT, SPLIT_LABEL, SPLIT_LABEL_DETAILED } = require('../config/revenueSplit');

/**
 * Calculate the Cooperative Revenue Split per Ministry of Cooperation / NCCT (PS ID: 26089)
 *  - 90% directly to the Worker's Bank Account (WORKER_WALLET)
 *  - 5% to the Primary Cooperative Society for administrative overhead (COOP_ADMIN_FUND)
 *  - 3% into the Worker Social Security / Mutual Aid Insurance Pool (WORKER_WELFARE_INSURANCE_FUND)
 *  - 2% into the Platform Technology & Cloud Hosting Fund (TECH_PLATFORM_FUND)
 *  - 100% of Emergency Surge Premiums routed directly to the Worker
 *
 * All arithmetic uses toFixed(2) rounding; the welfare slot absorbs any residual penny.
 *
 * @param {number} total Gross amount in INR
 * @param {boolean} [isEmergency=false] Whether booking was an emergency on-demand dispatch
 * @param {number} [emergencySurgeAmount=0] Surcharge for rapid emergency response
 */
function calculateCooperativeSplit(total, isEmergency = false, emergencySurgeAmount = 0) {
  const gross = Number(total);
  const surge = isEmergency ? Math.max(0, Number(emergencySurgeAmount)) : 0;
  const baseServiceAmount = Math.max(0, gross - surge);

  // 90% of base amount + 100% of emergency surge premium to Worker
  const baseWorker = Number((baseServiceAmount * REVENUE_SPLIT.worker).toFixed(2));
  const workerAmount = Number((baseWorker + surge).toFixed(2));

  // 5% of base amount to Primary Cooperative Society
  const coopAmount = Number((baseServiceAmount * REVENUE_SPLIT.coopAdmin).toFixed(2));

  // 2% of base amount to Platform Technology & Cloud Hosting Fund
  const techFundAmount = Number((baseServiceAmount * REVENUE_SPLIT.techFund).toFixed(2));

  // 3% of base amount to Worker Welfare & Social Security Fund (absorbs minor penny rounding)
  const welfareAmount = Number((gross - workerAmount - coopAmount - techFundAmount).toFixed(2));

  return {
    gross,
    baseServiceAmount,
    emergencySurgeAmount: surge,
    workerAmount,
    coopAmount,
    welfareAmount,
    techFundAmount,
    workerRatio:   REVENUE_SPLIT.worker,
    coopRatio:     REVENUE_SPLIT.coopAdmin,
    welfareRatio:  REVENUE_SPLIT.welfare,
    techFundRatio: REVENUE_SPLIT.techFund,
    policyStandard: `Ministry of Cooperation / NCCT (PS ID: 26089) — ${SPLIT_LABEL} Protocol`
  };
}

/**
 * Process a completed booking payment with 90/5/3/2 cooperative split.
 * POST /api/payments/process
 */
async function processBookingPayment(req, res) {
  try {
    const {
      bookingId,
      amount, // Optional override: defaults to booking.totalAmount
      paymentMethod = 'UPI',
      gatewayTransactionId
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Bad Request', message: 'bookingId is required' });
    }

    // 1. Fetch Booking and associated Worker/Cooperative info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        worker: {
          include: {
            user: true,
            cooperative: true
          }
        },
        customer: true,
        payment: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Not Found', message: 'Booking not found' });
    }

    // Check if already paid
    if (booking.payment && booking.payment.status === 'PAID_OUT') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This booking has already been successfully paid and settled',
        existingPayment: {
          transactionId: booking.payment.transactionId,
          totalAmount: booking.payment.totalAmount,
          settledAt: booking.payment.createdAt
        }
      });
    }

    // Validate booking state
    if (booking.status !== 'COMPLETED' && booking.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        error: 'Invalid State',
        message: `Payment can only be processed for COMPLETED or IN_PROGRESS bookings. Current: ${booking.status}`
      });
    }

    const totalToCharge = amount ? parseFloat(amount) : parseFloat(booking.totalAmount);
    const split = calculateCooperativeSplit(totalToCharge);
    const transactionId = gatewayTransactionId || `TXN-COOP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const workerUserId = booking.worker.userId;
    const cooperativeId = booking.worker.cooperativeId;

    // 2. ACID Transaction Execution
    const result = await prisma.$transaction(async (tx) => {
      // 2a. Find or create Worker Wallet
      let workerWallet = await tx.wallet.findFirst({
        where: { userId: workerUserId, type: 'WORKER_WALLET' }
      });
      if (!workerWallet) {
        workerWallet = await tx.wallet.create({
          data: {
            userId: workerUserId,
            cooperativeId: cooperativeId,
            type: 'WORKER_WALLET',
            balance: 0.00,
            currency: 'INR'
          }
        });
      }

      // 2b. Find or create Cooperative Administration Fund Wallet
      let coopAdminWallet = await tx.wallet.findFirst({
        where: { cooperativeId: cooperativeId, type: 'COOP_ADMIN_FUND' }
      });
      if (!coopAdminWallet) {
        coopAdminWallet = await tx.wallet.create({
          data: {
            cooperativeId: cooperativeId,
            type: 'COOP_ADMIN_FUND',
            balance: 0.00,
            currency: 'INR'
          }
        });
      }

      // 2c. Find or create Worker Welfare & Insurance Fund Wallet
      let welfareWallet = await tx.wallet.findFirst({
        where: { cooperativeId: cooperativeId, type: 'WORKER_WELFARE_INSURANCE_FUND' }
      });
      if (!welfareWallet) {
        welfareWallet = await tx.wallet.create({
          data: {
            cooperativeId: cooperativeId,
            type: 'WORKER_WELFARE_INSURANCE_FUND',
            balance: 0.00,
            currency: 'INR'
          }
        });
      }

      // 2d. Find or create Platform Technology & Cloud Hosting Fund Wallet
      let techFundWallet = await tx.wallet.findFirst({
        where: { cooperativeId: cooperativeId, type: 'TECH_PLATFORM_FUND' }
      });
      if (!techFundWallet) {
        techFundWallet = await tx.wallet.create({
          data: {
            cooperativeId: cooperativeId,
            type: 'TECH_PLATFORM_FUND',
            balance: 0.00,
            currency: 'INR'
          }
        });
      }

      // 2e. Create / Upsert Payment Record
      const payment = await tx.payment.upsert({
        where: { bookingId },
        update: {
          transactionId,
          totalAmount: split.gross,
          workerAmount: split.workerAmount,
          coopAmount: split.coopAmount,
          welfareAmount: split.welfareAmount,
          techFundAmount: split.techFundAmount,
          workerSplitRatio: split.workerRatio,
          coopSplitRatio: split.coopRatio,
          welfareSplitRatio: split.welfareRatio,
          techFundSplitRatio: split.techFundRatio,
          paymentMethod,
          status: 'PAID_OUT',
          workerPaidOutAt: new Date()
        },
        create: {
          transactionId,
          bookingId,
          cooperativeId,
          totalAmount: split.gross,
          workerAmount: split.workerAmount,
          coopAmount: split.coopAmount,
          welfareAmount: split.welfareAmount,
          techFundAmount: split.techFundAmount,
          workerSplitRatio: split.workerRatio,
          coopSplitRatio: split.coopRatio,
          welfareSplitRatio: split.welfareRatio,
          techFundSplitRatio: split.techFundRatio,
          paymentMethod,
          status: 'PAID_OUT',
          workerPaidOutAt: new Date()
        }
      });

      // 2f. Update Balances
      const updatedWorkerWallet = await tx.wallet.update({
        where: { id: workerWallet.id },
        data: { balance: { increment: split.workerAmount } }
      });

      const updatedCoopAdminWallet = await tx.wallet.update({
        where: { id: coopAdminWallet.id },
        data: { balance: { increment: split.coopAmount } }
      });

      const updatedWelfareWallet = await tx.wallet.update({
        where: { id: welfareWallet.id },
        data: { balance: { increment: split.welfareAmount } }
      });

      const updatedTechFundWallet = await tx.wallet.update({
        where: { id: techFundWallet.id },
        data: { balance: { increment: split.techFundAmount } }
      });

      // 2g. Double-entry Ledger Entries for full auditability
      await tx.walletLedger.createMany({
        data: [
          {
            walletId: workerWallet.id,
            paymentId: payment.id,
            amount: split.workerAmount,
            entryType: 'CREDIT',
            description: `Worker payout (90%) for Booking #${booking.bookingNumber}`
          },
          {
            walletId: coopAdminWallet.id,
            paymentId: payment.id,
            amount: split.coopAmount,
            entryType: 'CREDIT',
            description: `Cooperative admin & governance fund (5%) for Booking #${booking.bookingNumber}`
          },
          {
            walletId: welfareWallet.id,
            paymentId: payment.id,
            amount: split.welfareAmount,
            entryType: 'CREDIT',
            description: `Worker welfare & health mutual fund (3%) for Booking #${booking.bookingNumber}`
          },
          {
            walletId: techFundWallet.id,
            paymentId: payment.id,
            amount: split.techFundAmount,
            entryType: 'CREDIT',
            description: `Platform tech & cloud hosting fund (2%) for Booking #${booking.bookingNumber}`
          }
        ]
      });

      // 2h. Ensure Booking is marked COMPLETED if not already
      if (booking.status !== 'COMPLETED') {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'COMPLETED', completedAt: new Date() }
        });
      }

      return {
        payment,
        workerBalance:    updatedWorkerWallet.balance,
        coopBalance:      updatedCoopAdminWallet.balance,
        welfareBalance:   updatedWelfareWallet.balance,
        techFundBalance:  updatedTechFundWallet.balance
      };
    });

    // 3. Construct Transparent Cooperative Transaction Receipt
    const receipt = {
      receiptNumber: `RCP-${Date.now()}`,
      transactionId: result.payment.transactionId,
      bookingNumber: booking.bookingNumber,
      timestamp: result.payment.createdAt,
      currency: 'INR',
      splitStandard: SPLIT_LABEL_DETAILED,
      payer: {
        customerId: booking.customerId,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`
      },
      payee: {
        workerId: booking.worker.id,
        name: `${booking.worker.user.firstName} ${booking.worker.user.lastName}`,
        cooperativeName: booking.worker.cooperative?.name || 'Cooperative Federation'
      },
      financialSummary: {
        grossAmount: split.gross,
        splits: {
          workerShare: {
            ratio: `${(REVENUE_SPLIT.worker * 100).toFixed(0)}%`,
            amount: split.workerAmount,
            destination: 'WORKER_WALLET',
            description: 'Direct worker wage compensation'
          },
          cooperativeAdminFund: {
            ratio: `${(REVENUE_SPLIT.coopAdmin * 100).toFixed(0)}%`,
            amount: split.coopAmount,
            destination: 'COOP_ADMIN_FUND',
            description: 'Platform governance, cooperative administration & reserve pool'
          },
          workerWelfareInsuranceFund: {
            ratio: `${(REVENUE_SPLIT.welfare * 100).toFixed(0)}%`,
            amount: split.welfareAmount,
            destination: 'WORKER_WELFARE_INSURANCE_FUND',
            description: 'Collective insurance, healthcare, emergency mutual aid'
          },
          platformTechFund: {
            ratio: `${(REVENUE_SPLIT.techFund * 100).toFixed(0)}%`,
            amount: split.techFundAmount,
            destination: 'TECH_PLATFORM_FUND',
            description: 'Cloud hosting, platform technology & infrastructure maintenance'
          }
        },
        checksumAudit: {
          isBalanced:
            (split.workerAmount + split.coopAmount + split.welfareAmount + split.techFundAmount) ===
            split.gross,
          formula: `${split.workerAmount} (90%) + ${split.coopAmount} (5%) + ${split.welfareAmount} (3%) + ${split.techFundAmount} (2%) = ${split.gross}`
        }
      },
      paymentStatus: result.payment.status,
      paymentMethod: result.payment.paymentMethod
    };

    return res.status(200).json({
      success: true,
      message: 'Payment processed and cooperative welfare split completed successfully',
      receipt
    });
  } catch (error) {
    console.error('[processBookingPayment Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

/**
 * Fetch Payment Receipt by Booking ID or Transaction ID
 * GET /api/payments/receipt/:identifier
 */
async function getPaymentReceipt(req, res) {
  try {
    const { identifier } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { id: identifier },
          { transactionId: identifier },
          { bookingId: identifier }
        ]
      },
      include: {
        booking: {
          include: {
            customer: { select: { firstName: true, lastName: true, phone: true } },
            worker: {
              include: {
                user: { select: { firstName: true, lastName: true, phone: true } }
              }
            }
          }
        },
        ledgerEntries: true
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Not Found', message: 'Payment record not found' });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error('[getPaymentReceipt Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

module.exports = {
  processBookingPayment,
  getPaymentReceipt,
  calculateCooperativeSplit
};
