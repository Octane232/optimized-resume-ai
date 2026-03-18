import { Check, Lock, Star, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Plan definitions
const plans = [
  {
    id: 'starter' as const,
    label: 'Starter',
    monthlyPrice: '$12',
    yearlyPrice: '$115',
    tagline: 'For active job seekers',
    popular: false,
    icon: Sparkles,
    features: [
      '20 application bundles/month',
      '(tailored resume + cover letter per job)',
      '10 mock interview sessions/month',
      '5 salary insights/month',
      '3 LinkedIn optimizations/month',
      '10 skill gap analyses/month',
      '20 Job Radar alerts/month',
      'Track unlimited applications',
      'Email support',
    ],
    lockedFeatures: ['Live Interview Copilot'],
    note: 'Everything you need to consistently apply and improve',
  },
  {
    id: 'pro' as const,
    label: 'Pro',
    monthlyPrice: '$29',
    yearlyPrice: '$278',
    tagline: 'For serious candidates who want an edge',
    popular: true,
    icon: Crown,
    features: [
      '60 application bundles/month',
      '(tailored resume + cover letter per job)',
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
    lockedFeatures: [],
    note: 'Designed to help you land offers faster',
  },
];

// Type for plan IDs
type PlanId = 'starter' | 'pro';

const PricingCards = () => {
  const { tier } = useSubscription();
  const { toast } = useToast();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  // Handle upgrade button click
  const handleUpgrade = async (planId: PlanId) => {
    setLoadingPlan(planId);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to upgrade your plan',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { plan: planId, billing },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL');

      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  // Get price based on billing period
  const getPrice = (plan: typeof plans[0]) => {
    return billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  // Calculate yearly savings
  const getSavings = (plan: typeof plans[0]) => {
    if (billing !== 'yearly') return null;

    const monthlyPrice = parseInt(plan.monthlyPrice.replace('$', ''));
    const yearlyPrice = parseInt(plan.yearlyPrice.replace('$', ''));
    const savings = monthlyPrice * 12 - yearlyPrice;

    return `Save $${savings}`;
  };

  // Free tier features
  const freeFeatures = [
    '5 application bundles total',
    '3 mock interview sessions',
    '3 salary insights',
    'Track up to 10 applications',
  ];

  return (
    <div className="space-y-6">
      {/* Free Tier Summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-foreground">Free Plan</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try it out — no card needed
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {tier === 'free' ? 'Your Plan' : 'Free'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {freeFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted/50 rounded-full p-1 border border-border/60 flex gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all
              ${
                billing === 'monthly'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling('yearly')}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
              ${
                billing === 'yearly'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Yearly
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] px-1.5">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = tier === plan.id;
          const isLoading = loadingPlan === plan.id;
          const Icon = plan.icon;
          const savings = getSavings(plan);

          return (
            <div
              key={plan.id}
              className={`
                relative flex flex-col p-6 rounded-2xl border-2 bg-card transition-all hover:shadow-lg
                ${
                  isCurrent
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : plan.popular
                    ? 'border-primary ring-2 ring-primary/10'
                    : 'border-border'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-md border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-semibold shadow-md border-0">
                    Your Plan
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-5 pt-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {getPrice(plan)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {billing === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                {savings && (
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                    {savings}
                  </Badge>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-2 flex-1 mb-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`
                      flex items-start gap-2.5 text-sm
                      ${feature.startsWith('(') ? 'pl-6 -mt-1' : ''}
                    `}
                  >
                    {!feature.startsWith('(') && (
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <span
                      className={
                        feature.startsWith('(')
                          ? 'text-xs text-muted-foreground/70'
                          : 'text-foreground/80'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}

                {/* Locked Features */}
                {plan.lockedFeatures.map((feature, index) => (
                  <li
                    key={`locked-${index}`}
                    className="flex items-start gap-2.5 text-sm opacity-40"
                  >
                    <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground line-through">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Plan Note */}
              {plan.note && (
                <p className="text-xs text-muted-foreground italic text-center mb-4 mt-2">
                  {plan.note}
                </p>
              )}

              {/* CTA Button */}
              <Button
                className={`
                  w-full rounded-xl font-semibold h-11 gap-2
                  ${
                    isCurrent
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default'
                      : plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }
                `}
                disabled={isCurrent || isLoading}
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
              >
                {isCurrent ? (
                  'Current Plan'
                ) : isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {plan.id === 'starter' ? 'Get Starter' : 'Go Pro'}
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground">
        All plans include a 14-day free trial. No credit card required to start. Cancel anytime.
      </p>
    </div>
  );
};

export default PricingCards;
