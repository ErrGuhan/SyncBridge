/**
 * SyncBridge Cooperative — Payment Split Arithmetic Engine
 *
 * Rules (integer paise arithmetic — zero float drift):
 *   Standard split (90/5/5):
 *     workerPayout  = FLOOR(total × 0.90)
 *     coopFee       = FLOOR(total × 0.05)
 *     welfareFund   = total - workerPayout - coopFee  ← remainder, guaranteed no loss
 *   Emergency surge rule (Section 3.8):
 *     workerPayout  = FLOOR(baseAmount × 0.90) + surgeAmount  ← 100% surge to worker
 *     coopFee       = FLOOR(baseAmount × 0.05)
 *     welfareFund   = baseAmount - FLOOR(baseAmount × 0.90) - FLOOR(baseAmount × 0.05)
 *   Invariant enforced: workerPayout + coopFee + welfareFund === totalAmount ALWAYS
 */

export interface CoopSplit {
  workerPayout: number;   // 90% of base (+ 100% of surge for emergency bookings)
  coopFee: number;        // 5% of base amount only
  welfareFund: number;    // 5% of base (remainder — mathematically exact)
  guaranteeFund: number;  // 1% reserve from coop operations
  totalAmount: number;    // Gross charge to customer
  baseAmount: number;     // Pre-surge amount
  surgeAmount: number;    // Emergency surge delta (0 for standard bookings)
}

/**
 * Standard 90/5/5 split for a completed booking.
 * All arithmetic in integer paise to avoid float drift.
 * Guarantee: workerPayout + coopFee + welfareFund === totalAmount exactly.
 *
 * @param totalAmount - Gross amount in INR (e.g. 1100)
 */
export function calculateCoopSplit(totalAmount: number): CoopSplit {
  const total = Math.max(0, Math.round(totalAmount));
  const workerPayout = Math.floor(total * 0.90);
  const coopFee = Math.floor(total * 0.05);
  // Remainder assignment — never drops a paisa
  const welfareFund = total - workerPayout - coopFee;
  const guaranteeFund = Math.floor(total * 0.01);

  return {
    workerPayout,
    coopFee,
    welfareFund,
    guaranteeFund,
    totalAmount: total,
    baseAmount: total,
    surgeAmount: 0
  };
}

/**
 * Emergency booking split (Section 3.8):
 * - Base 90/5/5 applied to baseAmount only
 * - 100% of surgeAmount goes to worker (not split)
 * Guarantee: workerPayout + coopFee + welfareFund === baseAmount + surgeAmount exactly.
 *
 * @param baseAmount  - Standard job amount before surge (e.g. 1000)
 * @param surgeAmount - Emergency surge delta (e.g. 200 for 20% surge)
 */
export function calculateEmergencySplit(baseAmount: number, surgeAmount: number): CoopSplit {
  const base = Math.max(0, Math.round(baseAmount));
  const surge = Math.max(0, Math.round(surgeAmount));
  const total = base + surge;

  const baseWorkerShare = Math.floor(base * 0.90);
  const coopFee = Math.floor(base * 0.05);
  const welfareBase = base - baseWorkerShare - coopFee;
  const guaranteeFund = Math.floor(base * 0.01);

  // 100% of surge goes to worker
  const workerPayout = baseWorkerShare + surge;
  const welfareFund = welfareBase;

  // Invariant check (development guard)
  if (workerPayout + coopFee + welfareFund !== total) {
    // Should never happen — arithmetic guarantees it. Log if it does.
    console.error('[calculateEmergencySplit] INVARIANT VIOLATED:', {
      workerPayout, coopFee, welfareFund, total
    });
  }

  return {
    workerPayout,
    coopFee,
    welfareFund,
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

  const baseAmount = Math.round(grossAmount / surgeMultiplier);
  const surgeAmount = grossAmount - baseAmount;
  return calculateEmergencySplit(baseAmount, surgeAmount);
}

// Re-export legacy alias for backward compatibility
export { calculateCoopSplit as splitPayout };
