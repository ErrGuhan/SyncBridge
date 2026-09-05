const prisma = require('../lib/prisma');

/**
 * Calculate the Cooperative Welfare Tri-Split
 * @param {number} total Gross amount in INR
 */
function calculateCooperativeSplit(total) {
  const gross = Number(total);
  
  // 80% to Worker-Member
  const workerAmount = Number((gross * 0.80).toFixed(2));
  
  // 15% to Cooperative Administration & Operations
  const coopAmount = Number((gross * 0.15).toFixed(2));
  
  // 5% to Worker Welfare & Mutual Aid Insurance Fund (prevents rounding loss)
  const welfareAmount = Number((gross - workerAmount - coopAmount).toFixed(2));

  return {
    gross,
    workerAmount,
    coopAmount,
    welfareAmount,
    workerRatio: 0.8000,
    coopRatio: 0.1500,
    welfareRatio: 0.0500
  };
}

/**
 * Process a completed booking payment with 80/15/5 cooperative split.
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

      // 2d. Create / Upsert Payment Record
      const payment = await tx.payment.upsert({
        where: { bookingId },
        update: {
          transactionId,
          totalAmount: split.gross,
          workerAmount: split.workerAmount,
          coopAmount: split.coopAmount,
          welfareAmount: split.welfareAmount,
          workerSplitRatio: split.workerRatio,
          coopSplitRatio: split.coopRatio,
          welfareSplitRatio: split.welfareRatio,
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
          workerSplitRatio: split.workerRatio,
          coopSplitRatio: split.coopRatio,
          welfareSplitRatio: split.welfareRatio,
          paymentMethod,
          status: 'PAID_OUT',
          workerPaidOutAt: new Date()
        }
      });

      // 2e. Update Balances
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

      // 2f. Double-entry Ledger Entries for full auditability
      await tx.walletLedger.createMany({
        data: [
          {
            walletId: workerWallet.id,
            paymentId: payment.id,
            amount: split.workerAmount,
            entryType: 'CREDIT',
            description: `Worker payout (80%) for Booking #${booking.bookingNumber}`
          },
          {
            walletId: coopAdminWallet.id,
            paymentId: payment.id,
            amount: split.coopAmount,
            entryType: 'CREDIT',
            description: `Cooperative operating & reserve contribution (15%) for Booking #${booking.bookingNumber}`
          },
          {
            walletId: welfareWallet.id,
            paymentId: payment.id,
            amount: split.welfareAmount,
            entryType: 'CREDIT',
            description: `Worker welfare & health mutual fund (5%) for Booking #${booking.bookingNumber}`
          }
        ]
      });

      // 2g. Ensure Booking is marked COMPLETED if not already
      if (booking.status !== 'COMPLETED') {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'COMPLETED', completedAt: new Date() }
        });
      }

      return {
        payment,
        workerBalance: updatedWorkerWallet.balance,
        coopBalance: updatedCoopAdminWallet.balance,
        welfareBalance: updatedWelfareWallet.balance
      };
    });

    // 3. Construct Transparent Cooperative Transaction Receipt
    const receipt = {
      receiptNumber: `RCP-${Date.now()}`,
      transactionId: result.payment.transactionId,
      bookingNumber: booking.bookingNumber,
      timestamp: result.payment.createdAt,
      currency: 'INR',
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
            ratio: '80%',
            amount: split.workerAmount,
            destination: 'WORKER_WALLET',
            description: 'Direct worker wage compensation'
          },
          cooperativeAdminFund: {
            ratio: '15%',
            amount: split.coopAmount,
            destination: 'COOP_ADMIN_FUND',
            description: 'Platform maintenance, governance, and reserve pool'
          },
          workerWelfareInsuranceFund: {
            ratio: '5%',
            amount: split.welfareAmount,
            destination: 'WORKER_WELFARE_INSURANCE_FUND',
            description: 'Collective insurance, healthcare, emergency mutual aid'
          }
        },
        checksumAudit: {
          isBalanced: (split.workerAmount + split.coopAmount + split.welfareAmount) === split.gross,
          formula: `${split.workerAmount} (80%) + ${split.coopAmount} (15%) + ${split.welfareAmount} (5%) = ${split.gross}`
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
  getPaymentReceipt
};
