// Shared credit costs (server-side mirror of ACTION_COSTS in UsageLimitContext)
export type SubscriptionTier = "free" | "starter" | "pro" | "premium";

export type UsageAction =
  | "resume_ats"
  | "cover_letter"
  | "interview_prep"
  | "salary_intel"
  | "linkedin"
  | "skill_gap"
  | "radar_alert"
  | "docx_rewrite";

export const ACTION_COSTS: Record<UsageAction, number> = {
  resume_ats: 1,
  cover_letter: 1,
  linkedin: 1,
  skill_gap: 1,
  interview_prep: 3,
  salary_intel: 2,
  radar_alert: 2,
  docx_rewrite: 3,
};

// Total monthly pool per tier
export const TIER_POOL: Record<SubscriptionTier, number> = {
  free: 25,
  starter: 80,
  pro: 250,
  premium: 600,
};
