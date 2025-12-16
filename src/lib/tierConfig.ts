// Stripe price IDs mapped to tiers
export const STRIPE_PRICE_TIERS = {
  pro: {
    name: 'Pro',
    price_id_monthly: 'price_1SaQC1CcyAnmb029kDR4Mof6',
    price_id_yearly: 'price_1SaQDUCcyAnmb029YBXFwjjH',
    monthlyPrice: 12,
    yearlyPrice: 120,
  },
  premium: {
    name: 'Premium',
    price_id_monthly: 'price_1SaQCbCcyAnmb0297JqYygrH',
    price_id_yearly: 'price_1SaQE7CcyAnmb029QOzfgiQG',
    monthlyPrice: 24,
    yearlyPrice: 240,
  },
} as const;

export const TIER_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '1 resume/month',
      '1 PDF download/month',
      'Basic templates only',
      'Community support',
    ],
    lockedFeatures: [
      'AI Resume Generator',
      'Cover Letter Generator',
      'ATS Scoring',
      'Interview Prep',
      'Skill Gap Analyzer',
    ],
  },
  pro: {
    name: 'Pro',
    price: 12,
    description: 'For serious job seekers',
    features: [
      '5 resumes',
      '10 PDF downloads/month',
      '5 AI generations/month',
      'All premium templates',
      'AI Resume Generator',
      'Cover Letter Generator',
      'ATS Scoring',
      'Email support',
    ],
    lockedFeatures: [
      'Interview Prep',
      'Skill Gap Analyzer',
    ],
  },
  premium: {
    name: 'Premium',
    price: 24,
    description: 'Everything you need to land your dream job',
    features: [
      'Unlimited resumes',
      'Unlimited PDF downloads',
      'Unlimited AI generations',
      'All premium templates',
      'AI Resume Generator',
      'Cover Letter Generator',
      'Full ATS Analysis',
      'Interview Prep with AI feedback',
      'Skill Gap Analyzer',
      'Smart Job Matching',
      'Priority Support',
    ],
    lockedFeatures: [],
  },
} as const;

export type TierName = keyof typeof TIER_FEATURES;
