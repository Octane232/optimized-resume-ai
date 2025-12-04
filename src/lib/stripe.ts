export const STRIPE_TIERS = {
  pro: {
    name: 'Pro',
    price_id_monthly: 'price_1SaQC1CcyAnmb029kDR4Mof6',
    price_id_yearly: 'price_1SaQDUCcyAnmb029YBXFwjjH',
    product_id: 'prod_pro', // Will be updated after fetching from Stripe
  },
  premium: {
    name: 'Premium',
    price_id_monthly: 'price_1SaQCbCcyAnmb0297JqYygrH',
    price_id_yearly: 'price_1SaQE7CcyAnmb029QOzfgiQG',
    product_id: 'prod_premium', // Will be updated after fetching from Stripe
  },
} as const;

export type StripeTier = keyof typeof STRIPE_TIERS;

export const getPriceId = (tier: StripeTier, isYearly: boolean): string => {
  return isYearly 
    ? STRIPE_TIERS[tier].price_id_yearly 
    : STRIPE_TIERS[tier].price_id_monthly;
};
