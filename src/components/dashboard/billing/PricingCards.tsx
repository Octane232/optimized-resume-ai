import { Check, Star, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type PlanId = 'pro' | 'elite';
type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'pro' as PlanId,
    label: 'Pro',
    icon: Sparkles,
    monthly: '$24',
    tagline: 'For active job seekers',
    popular: false,
    features: [
      '30 Job Radar Alerts / month',
      '40 Resume + ATS runs / month',
      '15 DOCX Rewrites / month',
      '40 Cover Letters / month',
      '150 Bullet Rewrites / month',
      '40 Interview Prep sessions / month',
      '20 LinkedIn Optimizations / month',
      '20 Skill Gap Analyses / month',
      '15 Salary Insights / month',
      '120 Resume Uploads / month',
      'Priority Support',
    ],
    locked: [],
  },
  {
    id: 'elite' as PlanId,
    label: 'Elite',
    icon: Crown,
    monthly: '$49',
    tagline: 'For serious candidates',
    popular: true,
    features: [
      '100 Job Radar Alerts / month',
      '150 Resume + ATS runs / month',
      '50 DOCX Rewrites / month',
      '150 Cover Letters / month',
      '400 Bullet Rewrites / month',
      '120 Interview Prep sessions / month',
      '60 LinkedIn Optimizations / month',
      '60 Skill Gap Analyses / month',
      '40 Salary Insights / month',
      '500 Resume Uploads / month',
      'Priority Support + Early Access',
      'ATS Resume Review',
      'Live Coach Mode',  // ← Added here
      'Job Application Automation — Coming Soon'
    ],
    locked: [],
  },
];

const PricingCards = () => {
  const { tier, displayTier } = useUsageLimit();
  const { toast } = useToast();
  const billing: Billing = 'monthly';
  const [loading, setLoading] = useState<PlanId | null>(null);


  const handleUpgrade = async (planId: PlanId) => {
    setLoading(planId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        toast({ title: 'Sign in required', variant: 'destructive' }); 
        return; 
      }
      const { data, error } = await supabase.functions.invoke('stripe-checkout', { 
        body: { plan: planId, billing } 
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch {
      toast({ title: 'Checkout failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = displayTier.toLowerCase() === plan.id;
          const price = plan.monthly;
          const Icon = plan.icon;
          
          return (
            <div key={plan.id} className={`relative flex flex-col p-6 rounded-lg border bg-card transition-colors ${
              isCurrent ? 'border-primary ring-2 ring-primary/10' :
              plan.popular ? 'border-primary ring-2 ring-primary/10' : 'border-border'
            }`}>
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold border-0">Your Plan</Badge>
                </div>
              )}
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold border-0">
                    <Star className="w-3 h-3 mr-1" />Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-5 pt-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.tagline}</p>
              </div>

              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">{price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Starts with a 3-day free trial</p>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-11 font-semibold gap-2 ${
                  isCurrent ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15' :
                  plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                  'bg-foreground text-background hover:bg-foreground/90'
                }`}
                disabled={isCurrent || loading === plan.id}
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
              >
                {isCurrent ? 'Current Plan' :
                 loading === plan.id ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> :
                 <><Zap className="w-4 h-4" />{tier === 'free' ? 'Start 3-day free trial' : `Get ${plan.label}`}</>}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Card required for the trial. Cancel any time before day 3 and you are not charged. Secure payment via Stripe.
      </p>
    </div>
  );
};

export default PricingCards;
