/**
 * SyncBridge Cooperative — Canonical Revenue Split Constants (Frontend)
 *
 * Ministry of Cooperation / NCCT (PS ID: 26089) — 90/5/3/2 Protocol
 *
 * ALL frontend split arithmetic, i18n strings, and UI labels MUST derive
 * their values from REVENUE_SPLIT. Do NOT hardcode percentages anywhere.
 *
 * Invariant: worker + coopAdmin + welfare + techFund === 1.0 (exactly)
 */

export const REVENUE_SPLIT = Object.freeze({
  /** 90% — Direct worker wage */
  worker:    0.90,
  /** 5%  — Cooperative admin & governance fund */
  coopAdmin: 0.05,
  /** 3%  — Worker welfare & mutual insurance pool */
  welfare:   0.03,
  /** 2%  — Platform tech, cloud hosting & infrastructure */
  techFund:  0.02,
} as const);

/** Short label used in footers, badges, and charter references. */
export const SPLIT_LABEL = '90/5/3/2' as const;

/** Detailed single-line label for audit receipts and info banners. */
export const SPLIT_LABEL_DETAILED =
  '90% Worker · 5% Co-op Admin · 3% Welfare & Insurance · 2% Platform Tech' as const;

/** Percentage strings for UI display (avoids repeated `(x * 100).toFixed(0)` calls). */
export const SPLIT_PCT = Object.freeze({
  worker:    `${(REVENUE_SPLIT.worker    * 100).toFixed(0)}%`,  // '90%'
  coopAdmin: `${(REVENUE_SPLIT.coopAdmin * 100).toFixed(0)}%`,  // '5%'
  welfare:   `${(REVENUE_SPLIT.welfare   * 100).toFixed(0)}%`,  // '3%'
  techFund:  `${(REVENUE_SPLIT.techFund  * 100).toFixed(0)}%`,  // '2%'
} as const);

// Runtime invariant guard (tree-shaken in production by Next.js dead-code elimination)
if (process.env.NODE_ENV !== 'production') {
  const sum =
    REVENUE_SPLIT.worker +
    REVENUE_SPLIT.coopAdmin +
    REVENUE_SPLIT.welfare +
    REVENUE_SPLIT.techFund;
  if (Math.abs(sum - 1.0) > Number.EPSILON) {
    throw new Error(
      `[constants] INVARIANT VIOLATED: REVENUE_SPLIT ratios sum to ${sum}, expected 1.0`
    );
  }
}
