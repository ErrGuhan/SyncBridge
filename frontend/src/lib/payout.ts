/**
 * SyncBridge Cooperative 90/5/3/2 Payout Utility
 * Guarantees zero-drift arithmetic:
 *   total === workerShare + coopAdminShare + welfareShare + techFundShare
 */

import { REVENUE_SPLIT } from './constants';

export interface PayoutSplit {
  workerShare:    number;  // 90%
  coopAdminShare: number;  // 5%
  welfareShare:   number;  // 3%
  techFundShare:  number;  // 2%
  // Legacy aliases (kept for backward compatibility with existing consumers)
  workerPayout:   number;  // alias for workerShare
  coopFee:        number;  // alias for coopAdminShare
  welfareFund:    number;  // alias for welfareShare
  guaranteeFund:  number;  // 1% customer guarantee reserve (from coop operations)
}

export function splitPayout(total: number): PayoutSplit {
  const roundedTotal  = Math.max(0, Math.round(total));
  const workerShare   = Math.floor(roundedTotal * REVENUE_SPLIT.worker);
  const coopAdminShare = Math.floor(roundedTotal * REVENUE_SPLIT.coopAdmin);
  const techFundShare  = Math.floor(roundedTotal * REVENUE_SPLIT.techFund);
  // Welfare absorbs remainder — no paisa is lost
  const welfareShare   = roundedTotal - workerShare - coopAdminShare - techFundShare;
  const guaranteeFund  = Math.max(1, Math.round(roundedTotal * 0.01));

  return {
    workerShare,
    coopAdminShare,
    welfareShare,
    techFundShare,
    // Legacy aliases
    workerPayout: workerShare,
    coopFee:      coopAdminShare,
    welfareFund:  welfareShare,
    guaranteeFund
  };
}
