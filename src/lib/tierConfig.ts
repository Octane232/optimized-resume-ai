// Tier pricing config (payment integration to be added)
export const PRICE_TIERS = {
  pro: {
    name: 'Pro',
    monthlyPrice: 12,
    yearlyPrice: 120,
    monthlyCredits: 30,
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 24,
    yearlyPrice: 240,
    monthlyCredits: -1, // unlimited
  },
} as const;

export const TIER_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    credits: 5,
    description: 'Get started with AI career tools',
    freeFeatures: [
      'Resume Engine scoring (unlimited)',
      'Skill Gap Analysis (what\'s missing)',
      'Job Scout (browse & discover)',
      'Application Tracker (Kanban board)',
      '5 AI credits/month',
    ],
    paidFeatures: [
      'Cover Letter Generator (1 credit)',
      'Interview Mock Sessions (1 credit)',
      'LinkedIn Optimizer (1 credit)',
      'Detailed Skill Gap Advice (1 credit)',
      'AI Bullet Rewriter (1 credit)',
    ],
  },
  pro: {
    name: 'Pro',
    price: 12,
    credits: 30,
    description: 'For serious job seekers',
    freeFeatures: [
      'Everything in Free',
      '30 AI credits/month',
      'All premium templates',
      'Email support',
    ],
    paidFeatures: [],
  },
  premium: {
    name: 'Premium',
    price: 24,
    credits: -1,
    description: 'Unlimited AI career assistant',
    freeFeatures: [
      'Everything in Pro',
      'Unlimited AI credits',
      'Priority Support',
      'Smart Job Matching',
    ],
    paidFeatures: [],
  },
} as const;

export type TierName = keyof typeof TIER_FEATURES;

// Credit costs per action
export const CREDIT_COSTS = {
  cover_letter: 1,
  interview_prep: 1,
  linkedin_optimize: 1,
  skill_gap_advice: 1,
  bullet_rewrite: 1,
  ai_resume_rewrite: 1,
} as const;
