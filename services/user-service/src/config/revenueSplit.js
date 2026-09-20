/**
 * SyncBridge Cooperative — Canonical Revenue Split Constants (User Service)
 *
 * Ministry of Cooperation / NCCT (PS ID: 26089) — 90/5/3/2 Protocol
 *
 * ALL federation metrics and split arithmetic MUST read from REVENUE_SPLIT.
 *
 * Invariant: worker + coopAdmin + welfare + techFund === 1.0 (exactly)
 */

const REVENUE_SPLIT = Object.freeze({
  /** 90% — Direct worker wage */
  worker: 0.90,
  /** 5% — Cooperative admin & governance fund */
  coopAdmin: 0.05,
  /** 3% — Worker welfare & mutual insurance pool */
  welfare: 0.03,
  /** 2% — Platform tech, cloud hosting & infrastructure */
  techFund: 0.02,
});

const SPLIT_LABEL = '90/5/3/2';
const SPLIT_LABEL_DETAILED =
  '90% Worker · 5% Co-op Admin · 3% Welfare & Insurance · 2% Platform Tech';

(function validateSplitInvariant() {
  const sum =
    REVENUE_SPLIT.worker +
    REVENUE_SPLIT.coopAdmin +
    REVENUE_SPLIT.welfare +
    REVENUE_SPLIT.techFund;
  if (Math.abs(sum - 1.0) > Number.EPSILON) {
    throw new Error(
      `[FATAL] REVENUE_SPLIT ratios must sum to 1.0. Current sum: ${sum}`
    );
  }
})();

module.exports = {
  REVENUE_SPLIT,
  SPLIT_LABEL,
  SPLIT_LABEL_DETAILED,
};
