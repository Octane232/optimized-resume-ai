// Shared tier limits — must stay in sync with src/contexts/UsageLimitContext.tsx
export type SubscriptionTier = "free" | "starter" | "pro" | "premium";

export type UsageAction =
  | "resume_ats"
  | "cover_letter"
  | "interview_prep"
  | "salary_intel"
  | "linkedin"
  | "skill_gap"
  | "radar_alert";

export const TIER_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free:    { resume_ats: 3,  cover_letter: 3,  interview_prep: 2,  salary_intel: 2,  linkedin: 2,  skill_gap: 2,  radar_alert: 5  },
  starter: { resume_ats: 15, cover_letter: 15, interview_prep: 10, salary_intel: 8,  linkedin: 8,  skill_gap: 8,  radar_alert: 20 },
  pro:     { resume_ats: 40, cover_letter: 40, interview_prep: 30, salary_intel: 20, linkedin: 20, skill_gap: 20, radar_alert: 60 },
  premium: { resume_ats: 40, cover_letter: 40, interview_prep: 30, salary_intel: 20, linkedin: 20, skill_gap: 20, radar_alert: 60 },
};
