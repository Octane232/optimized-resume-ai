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
  | "bullet_rewrite";
// ===== Monthly Limits Per Feature Per Tier =====
// free  = no active subscription (trial ended / cancelled)
// trial = 3-day Stripe trial with fair-use caps
// pro   = $24/month, elite = $49/month
export const PLAN_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free: {
    resume_ats: 1,
    cover_letter: 1,
    linkedin: 0,
    skill_gap: 0,
    interview_prep: 0,
    salary_intel: 1,
    radar_alert: 0,
    docx_rewrite: 0,
    resume_parse: 2,
    bullet_rewrite: 3,
  },
  trial: {
    resume_ats: 5,
    cover_letter: 5,
    linkedin: 3,
    skill_gap: 3,
    interview_prep: 3,
    salary_intel: 3,
    radar_alert: 5,
    docx_rewrite: 3,
    resume_parse: 10,
    bullet_rewrite: 15,
  },
  pro: {
    resume_ats: 40,
    cover_letter: 40,
    linkedin: 20,
    skill_gap: 20,
    interview_prep: 40,
    salary_intel: 15,
    radar_alert: 30,
    docx_rewrite: 15,
    resume_parse: 120,
    bullet_rewrite: 150,
  },
  elite: {
    resume_ats: 150,
    cover_letter: 150,
    linkedin: 60,
    skill_gap: 60,
    interview_prep: 120,
    salary_intel: 40,
    radar_alert: 100,
    docx_rewrite: 50,
    resume_parse: 500,
    bullet_rewrite: 400,
  },
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
  bullet_rewrite: 1,
};
