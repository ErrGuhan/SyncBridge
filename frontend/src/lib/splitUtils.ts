/**
 * SyncBridge Cooperative 90/5/5 Arithmetic Engine
 * Ensures 100% mathematical consistency across all order bills, receipts, and payouts.
 *
 * Rules:
 * - Worker Direct Take-Home: 90% of total
 * - Primary Society Reserve: 5% of total
 * - Mutual Aid & Welfare Pool: Remaining balance to guarantee workerPayout + coopFee + welfareFund === totalAmount (exactly 5%)
 * - Escrow Protection Guarantee: 1% of total (funded via federation reserve)
 */

export interface CoopSplit {
  workerPayout: number;    // 90%
  coopFee: number;         // 5%
  welfareFund: number;     // 5%
  guaranteeFund: number;   // 1%
}

export function calculateCoopSplit(totalAmount: number): CoopSplit {
  const total = Math.max(0, Math.round(totalAmount));
  const workerPayout = Math.round(total * 0.90);
  const coopFee = Math.round(total * 0.05);
  // Guarantee exact zero-drift arithmetic: total = workerPayout + coopFee + welfareFund
  const welfareFund = total - workerPayout - coopFee;
  const guaranteeFund = Math.max(1, Math.round(total * 0.01));

  return {
    workerPayout,
    coopFee,
    welfareFund,
    guaranteeFund
  };
}

export { splitPayout } from './payout';

