// ===== Types =====
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
  | "resume_parse"
  | "job_search"
  | "bullet_rewrite";

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
    job_search: 0,
    bullet_rewrite: 0,
  },
  trial: {
    resume_ats: 10,
    cover_letter: 10,
    linkedin: 5,
    skill_gap: 5,
    interview_prep: 10,
    salary_intel: 5,
    radar_alert: 5,
    docx_rewrite: 5,
    resume_parse: 20,
    job_search: 10,
    bullet_rewrite: 20,
  },
  pro: {
    resume_ats: 30,
    cover_letter: 30,
    linkedin: 15,
    skill_gap: 15,
    interview_prep: 30,
    salary_intel: 10,
    radar_alert: 15,
    docx_rewrite: 10,
    resume_parse: 100,
    job_search: 50,
    bullet_rewrite: 75,
  },
  elite: {
    resume_ats: 100,
    cover_letter: 100,
    linkedin: 50,
    skill_gap: 50,
    interview_prep: 100,
    salary_intel: 30,
    radar_alert: 50,
    docx_rewrite: 50,
    resume_parse: 500,
    job_search: 120,
    bullet_rewrite: 300,
  },
};

// ===== Total Monthly Pool Per Tier (for backward compatibility) =====
export const TIER_POOL: Record<SubscriptionTier, number> = {
  free: 25,
  trial: 100,
  pro: 500,
  elite: 1500,
};

// ===== Reset Days =====
export const RESET_DAYS = 30;

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
  job_search: "Job Search",
  bullet_rewrite: "Bullet Point Rewrite",
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
  job_search: "Search for jobs across multiple platforms",
  bullet_rewrite: "AI-powered bullet point rewriting for resumes",
};

// ===== Deprecated Action Costs (kept for backward compatibility) =====
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
  job_search: 1,
  bullet_rewrite: 1,
};
