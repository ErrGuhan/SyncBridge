/**
 * SyncBridge Cooperative 90/5/5 Payout Utility
 * Guarantees zero-drift arithmetic: total === workerShare + societyShare + welfareShare
 */

export interface PayoutSplit {
  workerShare: number;   // 90%
  societyShare: number;  // 5%
  welfareShare: number;  // 5%
  workerPayout: number;  // alias for workerShare
  coopFee: number;       // alias for societyShare
  welfareFund: number;   // alias for welfareShare
  guaranteeFund: number; // 1% customer guarantee reserve
}

export function splitPayout(total: number): PayoutSplit {
  const roundedTotal = Math.max(0, Math.round(total));
  const workerShare = Math.round(roundedTotal * 0.9);
  const remainder = roundedTotal - workerShare;
  const societyShare = Math.ceil(remainder / 2);
  const welfareShare = remainder - societyShare;
  const guaranteeFund = Math.max(1, Math.round(roundedTotal * 0.01));

  return {
    workerShare,
    societyShare,
    welfareShare,
    workerPayout: workerShare,
    coopFee: societyShare,
    welfareFund: welfareShare,
    guaranteeFund
  };
}
