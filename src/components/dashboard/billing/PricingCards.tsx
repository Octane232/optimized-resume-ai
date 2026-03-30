import { Check, Lock, Star, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ===== Type Definitions =====
type PlanId = 'starter' | 'pro';
type BillingPeriod = 'monthly' | 'yearly';

interface Plan {
  id: PlanId;
  label: string;
  monthlyPrice: string;
  yearlyPrice: string;
  tagline: string;
  popular: boolean;
  icon: React.ElementType;
  features: string[];
  lockedFeatures: string[];
  note: string;
}

// ===== Constants =====
const PLANS: Plan[] = [
  {
    id: 'starter',
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
    id: 'pro',
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

const FREE_TIER_FEATURES = [
  '5 application bundles total',
  '3 mock interview sessions',
  '3 salary insights',
  'Track up to 10 applications',
];

// ===== Helper Functions =====
const parsePrice = (price: string): number => {
  return parseInt(price.replace('$', ''));
};

const getPrice = (plan: Plan, billing: BillingPeriod): string => {
  return billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
};

const getSavings = (plan: Plan, billing: BillingPeriod): string | null => {
  if (billing !== 'yearly') return null;
  
  const monthlyPrice = parsePrice(plan.monthlyPrice);
  const yearlyPrice = parsePrice(plan.yearlyPrice);
  const savings = (monthlyPrice * 12) - yearlyPrice;
  
  return `Save $${savings}`;
};

const getCardBorderClass = (isCurrent: boolean, isPopular: boolean): string => {
  if (isCurrent) {
    return 'border-emerald-500 ring-2 ring-emerald-500/10';
  }
  if (isPopular) {
    return 'border-primary ring-2 ring-primary/10';
  }
  return 'border-border';
};

const getButtonClass = (isCurrent: boolean, isPopular: boolean): string => {
  if (isCurrent) {
    return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default';
  }
  if (isPopular) {
    return 'bg-primary text-primary-foreground hover:bg-primary/90';
  }
  return 'bg-foreground text-background hover:bg-foreground/90';
};

// ===== Main Component =====
const PricingCards = () => {
  // ===== Hooks =====
  const { tier } = useSubscription();
  const { toast } = useToast();

  // ===== State =====
  const [billing, setBilling] = useState<BillingPeriod>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  // ===== Event Handlers =====
  const handleUpgrade = async (planId: PlanId) => {
    setLoadingPlan(planId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to upgrade your plan',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('lemonsqueezy-checkout', {
        body: { plan: planId, billing },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL');

      // Redirect to Lemon Squeezy checkout
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

  const handleBillingChange = (period: BillingPeriod) => {
    setBilling(period);
  };

  // ===== Render =====
  return (
    <div className="space-y-6">
      {/* Free Tier Summary */}
      <FreeTierCard isCurrentTier={tier === 'free'} />

      {/* Billing Toggle */}
      <BillingToggle
        billing={billing}
        onBillingChange={handleBillingChange}
      />

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={tier === plan.id}
            isLoading={loadingPlan === plan.id}
            billing={billing}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-muted-foreground">
        All plans include a 14-day free trial. No credit card required to start. Cancel anytime.
      </p>
    </div>
  );
};

// ===== Subcomponents =====

// Free Tier Card
interface FreeTierCardProps {
  isCurrentTier: boolean;
}

const FreeTierCard: React.FC<FreeTierCardProps> = ({ isCurrentTier }) => (
  <div className="rounded-xl border border-border bg-muted/30 p-5">
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className="text-sm font-bold text-foreground">Free Plan</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Try it out — no card needed
        </p>
      </div>
      <Badge variant="outline" className="text-xs">
        {isCurrentTier ? 'Your Plan' : 'Free'}
      </Badge>
    </div>

    <div className="grid grid-cols-2 gap-1.5">
      {FREE_TIER_FEATURES.map((feature, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
          {feature}
        </div>
      ))}
    </div>
  </div>
);

// Billing Toggle
interface BillingToggleProps {
  billing: BillingPeriod;
  onBillingChange: (period: BillingPeriod) => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ billing, onBillingChange }) => (
  <div className="flex justify-center">
    <div className="bg-muted/50 rounded-full p-1 border border-border/60 flex gap-1">
      <button
        onClick={() => onBillingChange('monthly')}
        className={`
          px-5 py-2 rounded-full text-sm font-medium transition-all
          ${billing === 'monthly'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        Monthly
      </button>

      <button
        onClick={() => onBillingChange('yearly')}
        className={`
          px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
          ${billing === 'yearly'
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
);

// Plan Card
interface PlanCardProps {
  plan: Plan;
  isCurrent: boolean;
  isLoading: boolean;
  billing: BillingPeriod;
  onUpgrade: (planId: PlanId) => Promise<void>;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrent,
  isLoading,
  billing,
  onUpgrade,
}) => {
  const Icon = plan.icon;
  const price = getPrice(plan, billing);
  const savings = getSavings(plan, billing);
  const borderClass = getCardBorderClass(isCurrent, plan.popular);
  const buttonClass = getButtonClass(isCurrent, plan.popular);

  return (
    <div
      className={`
        relative flex flex-col p-6 rounded-2xl border-2 bg-card transition-all hover:shadow-lg
        ${borderClass}
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
          <span className="text-4xl font-extrabold text-foreground">{price}</span>
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
        {plan.features.map((feature, index) => {
          const isIndented = feature.startsWith('(');
          return (
            <li
              key={index}
              className={`
                flex items-start gap-2.5 text-sm
                ${isIndented ? 'pl-6 -mt-1' : ''}
              `}
            >
              {!isIndented && (
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              )}
              <span className={
                isIndented
                  ? 'text-xs text-muted-foreground/70'
                  : 'text-foreground/80'
              }>
                {feature}
              </span>
            </li>
          );
        })}

        {/* Locked Features */}
        {plan.lockedFeatures.map((feature, index) => (
          <li key={`locked-${index}`} className="flex items-start gap-2.5 text-sm opacity-40">
            <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-muted-foreground line-through">{feature}</span>
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
        className={`w-full rounded-xl font-semibold h-11 gap-2 ${buttonClass}`}
        disabled={isCurrent || isLoading}
        onClick={() => !isCurrent && onUpgrade(plan.id)}
      >
        {isCurrent ? (
          'Your Plan'
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
};

export default PricingCards;
