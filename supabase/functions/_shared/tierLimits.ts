// Shared feature limits (server-side mirror of usage limits)
export type SubscriptionTier = "free" | "trial" | "pro" | "elite";

export type UsageAction =
  | "resume_ats"
  | "cover_letter"
  | "interview_prep"
  | "salary_intel"
  | "linkedin"
  | "skill_gap"
  | "radar_alert"
  | "docx_rewrite"
  | "resume_parse";

// ===== Monthly Limits Per Feature Per Tier =====
export const PLAN_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free: {
    resume_ats: 0,
    cover_letter: 0,
    linkedin: 0,
    skill_gap: 0,
    interview_prep: 0,
    salary_intel: 0,
    radar_alert: 0,
    docx_rewrite: 0,
    resume_parse: 0,
  },
  pro: {
    resume_ats: 15,
    cover_letter: 15,
    linkedin: 10,
    skill_gap: 10,
    interview_prep: 20,
    salary_intel: 5,
    radar_alert: 10,
    docx_rewrite: 5,
    resume_parse: 50,
  },
  elite: {
    resume_ats: 40,
    cover_letter: 40,
    linkedin: 30,
    skill_gap: 30,
    interview_prep: 60,
    salary_intel: 15,
    radar_alert: 30,
    docx_rewrite: 20,
    resume_parse: 200,
  },
};

// ===== Total Monthly Pool Per Tier (for backward compatibility) =====
export const TIER_POOL: Record<SubscriptionTier, number> = {
  free: 25,
  pro: 250,
  elite: 600,
};

// ===== Helper Functions =====
export function getFeatureLimit(tier: SubscriptionTier, action: UsageAction): number {
  return PLAN_LIMITS[tier]?.[action] ?? 0;
}

export function hasRemainingUses(
  tier: SubscriptionTier,
  action: UsageAction,
  currentUsage: number
): boolean {
  const limit = getFeatureLimit(tier, action);
  return currentUsage < limit;
}

export function getRemainingUses(
  tier: SubscriptionTier,
  action: UsageAction,
  currentUsage: number
): number {
  const limit = getFeatureLimit(tier, action);
  return Math.max(0, limit - currentUsage);
}

export const RESET_DAYS = 30;

// ===== Feature Display Names =====
export const FEATURE_NAMES: Record<UsageAction, string> = {
  resume_ats: "Resume + ATS Optimization",
  cover_letter: "Cover Letter Generation",
  linkedin: "LinkedIn Optimizer",
  skill_gap: "Skill Gap Analyzer",
  interview_prep: "Interview Practice",
  salary_intel: "Salary Intelligence",
  radar_alert: "Job Radar Alerts",
  docx_rewrite: "DOCX Resume Rewrite",
  resume_parse: "Resume File Upload",
};

// ===== Feature Descriptions =====
export const FEATURE_DESCRIPTIONS: Record<UsageAction, string> = {
  resume_ats: "Tailored resume + cover letter + ATS score in one click",
  cover_letter: "AI-generated cover letters tailored to each job",
  linkedin: "Optimize your LinkedIn profile for recruiters",
  skill_gap: "Identify missing skills and get learning recommendations",
  interview_prep: "Practice with AI interview coach and get feedback",
  salary_intel: "Real-time salary data and negotiation tips",
  radar_alert: "Discover hidden job opportunities before they're posted",
  docx_rewrite: "AI-powered DOCX resume rewriting",
  resume_parse: "Upload and parse PDF/DOCX resume files",
};

// ===== Deprecated (kept for backward compatibility) =====
// @deprecated - Use PLAN_LIMITS and getFeatureLimit() instead
export const ACTION_COSTS: Record<UsageAction, number> = {
  resume_ats: 1,
  cover_letter: 1,
  linkedin: 1,
  skill_gap: 1,
  interview_prep: 3,
  salary_intel: 2,
  radar_alert: 2,
  docx_rewrite: 3,
  resume_parse: 0,
};
