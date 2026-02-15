import { Check, X, Star, Shield, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TIER_FEATURES } from '@/lib/tierConfig';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

const PricingCards = () => {
  const { tier } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free' as const,
      label: 'Explorer',
      price: '$0',
      period: 'forever',
      icon: Shield,
      accent: 'border-border',
      btnClass: 'bg-muted text-muted-foreground cursor-default',
      popular: false,
    },
    {
      id: 'pro' as const,
      label: 'Career Pro',
      price: billingCycle === 'monthly' ? '$12' : '$120',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      originalPrice: billingCycle === 'yearly' ? '$144' : null,
      icon: Sparkles,
      accent: 'border-primary ring-2 ring-primary/20',
      btnClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save $24' : null,
    },
    {
      id: 'premium' as const,
      label: 'Career Elite',
      price: billingCycle === 'monthly' ? '$24' : '$240',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      originalPrice: billingCycle === 'yearly' ? '$288' : null,
      icon: Crown,
      accent: 'border-border',
      btnClass: 'bg-foreground text-background hover:bg-foreground/90',
      popular: false,
      savings: billingCycle === 'yearly' ? 'Save $48' : null,
    },
  ];

  const handleUpgrade = (planId: string) => {
    // Stripe checkout will be wired here
    console.log(`[Billing] Upgrade to ${planId} — Stripe not yet configured`);
  };

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted/50 rounded-full p-1 border border-border/60 flex gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] px-1.5">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const tierInfo = TIER_FEATURES[plan.id];
          const isCurrent = tier === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-2xl border-2 bg-card transition-all duration-200 hover:shadow-lg ${
                isCurrent ? 'border-primary bg-primary/[0.02]' : plan.accent
              }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-md border-0">
                    <Star className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-semibold shadow-md border-0">
                    Your Plan
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6 pt-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tierInfo.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-sm line-through text-muted-foreground ml-1">{plan.originalPrice}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
                {plan.savings && (
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs block w-fit mx-auto">
                    {plan.savings}
                  </Badge>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {tierInfo.freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
                {tierInfo.paidFeatures?.map((f, i) => (
                  <li key={`l-${i}`} className="flex items-start gap-2.5 text-sm opacity-40">
                    <X className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="line-through text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-xl font-semibold ${isCurrent ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default' : plan.btnClass}`}
                disabled={isCurrent || plan.id === 'free'}
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
              >
                {isCurrent ? (
                  <>Current Plan</>
                ) : plan.id === 'free' ? (
                  <>Free Forever</>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1" />
                    {plan.id === 'pro' ? 'Upgrade to Pro' : 'Get Elite'}
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingCards;
