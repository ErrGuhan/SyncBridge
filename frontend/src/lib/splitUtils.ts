/**
 * SyncBridge Cooperative — Payment Split Arithmetic Engine
 *
 * Rules (integer paise arithmetic — zero float drift):
 *   Standard split (90/5/3/2 — sourced from REVENUE_SPLIT):
 *     workerPayout   = FLOOR(total × REVENUE_SPLIT.worker)
 *     coopFee        = FLOOR(total × REVENUE_SPLIT.coopAdmin)
 *     techFund       = FLOOR(total × REVENUE_SPLIT.techFund)
 *     welfareFund    = total - workerPayout - coopFee - techFund  ← remainder, guaranteed no loss
 *   Emergency surge rule (Section 3.8):
 *     workerPayout   = FLOOR(baseAmount × REVENUE_SPLIT.worker) + surgeAmount  ← 100% surge to worker
 *     coopFee        = FLOOR(baseAmount × REVENUE_SPLIT.coopAdmin)
 *     techFund       = FLOOR(baseAmount × REVENUE_SPLIT.techFund)
 *     welfareFund    = baseAmount - FLOOR(baseAmount × REVENUE_SPLIT.worker)
 *                      - FLOOR(baseAmount × REVENUE_SPLIT.coopAdmin)
 *                      - FLOOR(baseAmount × REVENUE_SPLIT.techFund)
 *   Invariant enforced: workerPayout + coopFee + welfareFund + techFundAmount === totalAmount ALWAYS
 */

import { REVENUE_SPLIT } from './constants';

export interface CoopSplit {
  workerPayout: number;     // 90% of base (+ 100% of surge for emergency bookings)
  coopFee: number;          // 5% of base amount only
  welfareFund: number;      // 3% of base (remainder — mathematically exact)
  techFundAmount: number;   // 2% platform tech & cloud hosting
  guaranteeFund: number;    // 1% reserve from coop operations (dispute escrow)
  totalAmount: number;      // Gross charge to customer
  baseAmount: number;       // Pre-surge amount
  surgeAmount: number;      // Emergency surge delta (0 for standard bookings)
}

/**
 * Standard 90/5/3/2 split for a completed booking.
 * All arithmetic in integer paise to avoid float drift.
 * Guarantee: workerPayout + coopFee + welfareFund + techFundAmount === totalAmount exactly.
 *
 * @param totalAmount - Gross amount in INR (e.g. 1100)
 */
export function calculateCoopSplit(totalAmount: number): CoopSplit {
  const total = Math.max(0, Math.round(totalAmount));
  const workerPayout   = Math.floor(total * REVENUE_SPLIT.worker);
  const coopFee        = Math.floor(total * REVENUE_SPLIT.coopAdmin);
  const techFundAmount = Math.floor(total * REVENUE_SPLIT.techFund);
  // Remainder assignment — never drops a paisa
  const welfareFund    = total - workerPayout - coopFee - techFundAmount;
  const guaranteeFund  = Math.floor(total * 0.01);

  return {
    workerPayout,
    coopFee,
    welfareFund,
    techFundAmount,
    guaranteeFund,
    totalAmount: total,
    baseAmount: total,
    surgeAmount: 0
  };
}

/**
 * Emergency booking split (Section 3.8):
 * - Base 90/5/3/2 applied to baseAmount only
 * - 100% of surgeAmount goes to worker (not split)
 * Guarantee: workerPayout + coopFee + welfareFund + techFundAmount === baseAmount + surgeAmount exactly.
 *
 * @param baseAmount  - Standard job amount before surge (e.g. 1000)
 * @param surgeAmount - Emergency surge delta (e.g. 200 for 20% surge)
 */
export function calculateEmergencySplit(baseAmount: number, surgeAmount: number): CoopSplit {
  const base  = Math.max(0, Math.round(baseAmount));
  const surge = Math.max(0, Math.round(surgeAmount));
  const total = base + surge;

  const baseWorkerShare = Math.floor(base * REVENUE_SPLIT.worker);
  const coopFee         = Math.floor(base * REVENUE_SPLIT.coopAdmin);
  const techFundAmount  = Math.floor(base * REVENUE_SPLIT.techFund);
  const welfareBase     = base - baseWorkerShare - coopFee - techFundAmount;
  const guaranteeFund   = Math.floor(base * 0.01);

  // 100% of surge goes to worker
  const workerPayout = baseWorkerShare + surge;
  const welfareFund  = welfareBase;

  // Invariant check (development guard)
  if (workerPayout + coopFee + welfareFund + techFundAmount !== total) {
    // Should never happen — arithmetic guarantees it. Log if it does.
    console.error('[calculateEmergencySplit] INVARIANT VIOLATED:', {
      workerPayout, coopFee, welfareFund, techFundAmount, total
    });
  }

  return {
    workerPayout,
    coopFee,
    welfareFund,
    techFundAmount,
    guaranteeFund,
    totalAmount: total,
    baseAmount: base,
    surgeAmount: surge
  };
}

/**
 * Compute what a worker receives based on gross amount and whether it's an emergency.
 * Convenience wrapper used by UI components for real-time preview.
 */
export function getSplitPreview(
  grossAmount: number,
  options?: { isEmergency?: boolean; surgeMultiplier?: number }
): CoopSplit {
  const { isEmergency = false, surgeMultiplier = 1.0 } = options ?? {};

  if (!isEmergency || surgeMultiplier <= 1.0) {
    return calculateCoopSplit(grossAmount);
  }

  const baseAmount  = Math.round(grossAmount / surgeMultiplier);
  const surgeAmount = grossAmount - baseAmount;
  return calculateEmergencySplit(baseAmount, surgeAmount);
}

// Re-export legacy alias for backward compatibility
export { calculateCoopSplit as splitPayout };
