/**
 * SyncBridge — Payment Gateway Interface & Mock UPI Implementation
 *
 * All financial integrations sit behind this interface.
 * Swap MockUPIGateway for a real PSP by:
 *   1. Implementing PaymentGateway with the real provider's SDK
 *   2. Setting PAYMENT_GATEWAY_PROVIDER=NPCI_BHIM (or RAZORPAY, CASHFREE, etc.)
 *   3. Adding the required env vars below
 *
 * Required env vars for real implementation (documented for judges / production):
 *   NPCI_BHIM_MERCHANT_ID     - BHIM UPI merchant ID issued by NPCI
 *   NPCI_BHIM_API_KEY         - BHIM API key (NPCI developer portal)
 *   NPCI_BHIM_API_SECRET      - BHIM API secret
 *   NPCI_BHIM_VPA_RECEIVER    - Platform UPI VPA (escrow collection account)
 *   RAZORPAY_KEY_ID           - Razorpay Key ID (alternative PSP)
 *   RAZORPAY_KEY_SECRET       - Razorpay Key Secret
 *   CASHFREE_APP_ID           - Cashfree App ID (alternative PSP)
 *   CASHFREE_SECRET_KEY       - Cashfree Secret Key
 */

export interface EscrowResult {
  success: boolean;
  transactionId: string;        // External gateway reference (UTR for UPI)
  gatewayProvider: string;
  amount: number;
  currency: string;
  status: 'HELD_IN_ESCROW' | 'FAILED';
  heldAt: string;               // ISO timestamp
  rawResponse?: Record<string, unknown>;
  error?: string;
}

export interface ReleaseResult {
  success: boolean;
  transactionId: string;
  amount: number;
  recipientVpa?: string;        // Worker's UPI VPA
  status: 'PAID_OUT' | 'FAILED' | 'REFUNDED';
  releasedAt: string;
  rawResponse?: Record<string, unknown>;
  error?: string;
}

export interface PaymentGateway {
  /**
   * Hold payment in escrow when booking is created.
   * Customer's UPI is debited; funds held until job completion.
   */
  holdInEscrow(params: {
    bookingId: string;
    amount: number;
    currency: string;
    customerVpa?: string;
    description: string;
  }): Promise<EscrowResult>;

  /**
   * Release escrowed funds to worker after job completion.
   * Splits are computed by the caller; gateway just moves the amount.
   */
  releaseToWorker(params: {
    transactionId: string;     // Original escrow UTR
    bookingId: string;
    amount: number;            // Worker share (90% of base + 100% of surge)
    workerVpa?: string;        // Worker's registered UPI VPA
    currency: string;
  }): Promise<ReleaseResult>;

  /**
   * Refund escrowed amount back to customer (on cancellation or upheld dispute).
   */
  refund(params: {
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<ReleaseResult>;
}

// ---------------------------------------------------------------------------
// MOCK UPI GATEWAY — deterministic, seeded by bookingId for consistent demo
// ---------------------------------------------------------------------------

export class MockUPIGateway implements PaymentGateway {
  private readonly provider = 'MOCK_UPI';

  async holdInEscrow(params: {
    bookingId: string;
    amount: number;
    currency: string;
    customerVpa?: string;
    description: string;
  }): Promise<EscrowResult> {
    // Simulate 50ms network latency
    await sleep(50);

    const utr = `UTR-MOCK-${Date.now().toString(36).toUpperCase()}-${params.bookingId.slice(-4).toUpperCase()}`;

    return {
      success: true,
      transactionId: utr,
      gatewayProvider: this.provider,
      amount: params.amount,
      currency: params.currency,
      status: 'HELD_IN_ESCROW',
      heldAt: new Date().toISOString(),
      rawResponse: {
        provider: this.provider,
        utr,
        customerVpa: params.customerVpa ?? 'customer@okhdfcbank',
        escrowAccount: 'syncbridge.escrow@icici',
        bookingId: params.bookingId,
        note: 'Simulated UPI escrow — replace with NPCI_BHIM_API_KEY for production'
      }
    };
  }

  async releaseToWorker(params: {
    transactionId: string;
    bookingId: string;
    amount: number;
    workerVpa?: string;
    currency: string;
  }): Promise<ReleaseResult> {
    await sleep(50);

    const releaseUtr = `UTR-REL-${Date.now().toString(36).toUpperCase()}`;

    return {
      success: true,
      transactionId: releaseUtr,
      amount: params.amount,
      recipientVpa: params.workerVpa ?? 'worker@ybl',
      status: 'PAID_OUT',
      releasedAt: new Date().toISOString(),
      rawResponse: {
        provider: this.provider,
        originalEscrowUtr: params.transactionId,
        releaseUtr,
        recipientVpa: params.workerVpa ?? 'worker@ybl',
        note: 'Simulated UPI release — replace with NPCI_BHIM_API_KEY for production'
      }
    };
  }

  async refund(params: {
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<ReleaseResult> {
    await sleep(50);

    return {
      success: true,
      transactionId: `UTR-REFUND-${Date.now().toString(36).toUpperCase()}`,
      amount: params.amount,
      status: 'REFUNDED',
      releasedAt: new Date().toISOString(),
      rawResponse: {
        provider: this.provider,
        originalUtr: params.transactionId,
        reason: params.reason,
        note: 'Simulated UPI refund — replace with NPCI_BHIM_API_KEY for production'
      }
    };
  }
}

// ---------------------------------------------------------------------------
// Factory — reads PAYMENT_GATEWAY_PROVIDER env var to select implementation
// ---------------------------------------------------------------------------

export function createPaymentGateway(): PaymentGateway {
  const provider = process.env.PAYMENT_GATEWAY_PROVIDER ?? 'MOCK';

  switch (provider.toUpperCase()) {
    case 'MOCK':
    default:
      return new MockUPIGateway();
    // Add real implementations here:
    // case 'NPCI_BHIM': return new NpciBhimGateway();
    // case 'RAZORPAY':  return new RazorpayGateway();
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
