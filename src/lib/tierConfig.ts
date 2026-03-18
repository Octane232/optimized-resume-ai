// Stripe Price IDs
export const PRICE_TIERS = {
  starter: {
    name: 'Starter',
    monthlyPrice: 12,
    yearlyPrice: 115,
    stripePriceIdMonthly: 'price_1TBlYCKyMF3XY1UQ9AwOS6cd',
    stripePriceIdYearly: 'price_1TBljFKyMF3XY1UQTGH4xotU',
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 278,
    stripePriceIdMonthly: 'price_1TBlfNKyMF3XY1UQ0onq3Dv4',
    stripePriceIdYearly: 'price_1TBlltKyMF3XY1UQIlIA6mKZ',
  },
} as const;

// Feature breakdown by tier
export const TIER_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Try it out — no card needed',
    
    // Features included in free tier
    freeFeatures: [
      '5 full application bundles (resume + cover letter)',
      '3 mock interview sessions',
      '3 salary insights',
      'Basic ATS feedback',
      'Track up to 10 job applications',
    ],
    
    // Features only available in paid tiers
    paidFeatures: [
      'LinkedIn optimizer',
      'Skill gap analysis',
      'Job Radar alerts',
      'Live Interview Copilot',
    ],
  },
  
  starter: {
    name: 'Starter',
    price: 12,
    description: 'For active job seekers',
    
    // All features included in starter tier
    freeFeatures: [
      '20 application bundles/month (resume + cover letter)',
      '10 mock interview sessions/month',
      '5 salary insights/month',
      '3 LinkedIn optimizations/month',
      '10 skill gap analyses/month',
      '20 Job Radar alerts/month',
      'Track unlimited applications',
      'Email support',
    ],
    
    // Premium features not in starter (empty for now)
    paidFeatures: [
      'Live Interview Copilot', // Only available in Pro
    ],
  },
  
  pro: {
    name: 'Pro',
    price: 29,
    description: 'For serious candidates who want an edge',
    
    // All features included in pro tier
    freeFeatures: [
      '60 application bundles/month (resume + cover letter)',
      '20 mock interview sessions/month',
      '15 salary insights/month',
      '10 LinkedIn optimizations/month',
      '20 skill gap analyses/month',
      '100 Job Radar alerts/month',
      'Track unlimited applications',
      'Live Interview Copilot',
      'Priority support',
      'Early access to new features',
    ],
    
    // No additional paid features (this is the top tier)
    paidFeatures: [],
  },
  
  // Note: premium appears to be an alias for pro
  premium: {
    name: 'Pro', // Same name as pro tier
    price: 29,   // Same price as pro tier
    description: 'For serious candidates who want an edge',
    
    // Slightly different feature list (some items missing from pro)
    freeFeatures: [
      '60 application bundles/month',
      '20 mock interview sessions/month',
      '15 salary insights/month',
      '10 LinkedIn optimizations/month',
      '100 Job Radar alerts/month',
      'Live Interview Copilot',
      'Priority support',
    ],
    
    paidFeatures: [],
  },
} as const;

// Type for tier names
export type TierName = keyof typeof TIER_FEATURES;

// Helper to check if a tier exists
export const isValidTier = (tier: string): tier is TierName => {
  return tier in TIER_FEATURES;
};

// Get tier by name with safe fallback
export const getTier = (tierName: TierName | string) => {
  if (isValidTier(tierName)) {
    return TIER_FEATURES[tierName];
  }
  return TIER_FEATURES.free; // Default to free
};
