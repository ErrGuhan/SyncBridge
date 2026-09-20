/**
 * SyncBridge Cooperative — Canonical Revenue Split Constants
 *
 * Ministry of Cooperation / NCCT (PS ID: 26089) — 90/5/3/2 Protocol
 *
 * ALL payment split arithmetic MUST read from REVENUE_SPLIT.
 * Do NOT hardcode percentages anywhere else in the payment service.
 *
 * Invariant: worker + coopAdmin + welfare + techFund === 1.0 (exactly)
 */

const REVENUE_SPLIT = Object.freeze({
  /** 90% — Direct worker wage (deposited to WORKER_WALLET) */
  worker:    0.90,
  /** 5% — Cooperative admin & governance fund (COOP_ADMIN_FUND) */
  coopAdmin: 0.05,
  /** 3% — Worker welfare & mutual insurance pool (WORKER_WELFARE_INSURANCE_FUND) */
  welfare:   0.03,
  /** 2% — Platform tech, cloud hosting & infrastructure (TECH_PLATFORM_FUND) */
  techFund:  0.02,
});

/** Human-readable label for receipts, logs, and UI copy. */
const SPLIT_LABEL = '90/5/3/2';

/** Detailed human-readable label for audit receipts. */
const SPLIT_LABEL_DETAILED =
  '90% Worker · 5% Co-op Admin · 3% Welfare & Insurance · 2% Platform Tech';

/**
 * Validate the invariant at startup (fast fail if someone edits values badly).
 * Throws if the four ratios do not sum to exactly 1.0.
 */
(function validateSplitInvariant() {
  const sum =
    REVENUE_SPLIT.worker +
    REVENUE_SPLIT.coopAdmin +
    REVENUE_SPLIT.welfare +
    REVENUE_SPLIT.techFund;
  if (Math.abs(sum - 1.0) > Number.EPSILON) {
    throw new Error(
      `[revenueSplit] INVARIANT VIOLATED: split ratios sum to ${sum}, expected 1.0`
    );
  }
})();

module.exports = { REVENUE_SPLIT, SPLIT_LABEL, SPLIT_LABEL_DETAILED };
