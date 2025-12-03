// Stripe subscription tiers mapping
export const STRIPE_TIERS = {
  starter: {
    price_id: "price_1SaIDeEHTF7troeOBg40Odab",
    product_id: "prod_TXMxlXItsSfDWV",
    name: "Starter",
    price: 9,
  },
  professional: {
    price_id: "price_1SaIDxEHTF7troeOAy2tTCoG",
    product_id: "prod_TXMxisPE34NLhU",
    name: "Professional",
    price: 19,
  },
  enterprise: {
    price_id: "price_1SaIE9EHTF7troeOD8xQGOxW",
    product_id: "prod_TXMyxx5jjSTs5B",
    name: "Enterprise",
    price: 49,
  },
} as const;

export type SubscriptionTier = keyof typeof STRIPE_TIERS;

export const getTierByProductId = (productId: string): SubscriptionTier | null => {
  for (const [tier, data] of Object.entries(STRIPE_TIERS)) {
    if (data.product_id === productId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
};

export const getTierByPriceId = (priceId: string): SubscriptionTier | null => {
  for (const [tier, data] of Object.entries(STRIPE_TIERS)) {
    if (data.price_id === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
};
