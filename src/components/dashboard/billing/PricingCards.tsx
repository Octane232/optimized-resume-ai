import { Check, Lock, Star, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type PlanId = 'starter' | 'pro';
type Billing = 'monthly' | 'yearly';

const FREE_FEATURES = [
  '3 application bundles (lifetime)',
  '3 cover letters (lifetime)',
  '2 mock interview sessions',
  '2 salary insights',
  '2 LinkedIn optimizations',
  '5 Job Radar alerts',
];

const PLANS = [
  {
    id: 'starter' as PlanId,
    label: 'Starter',
    icon: Sparkles,
    monthly: '$12', yearly: '$115',
    tagline: 'For active job seekers',
    popular: false,
    features: [
      '15 application bundles/month',
      '15 cover letters/month',
      '10 mock interview sessions/month',
      '8 salary insights/month',
      '8 LinkedIn optimizations/month',
      '8 skill gap analyses/month',
      '20 Job Radar alerts/month',
      'Application tracker',
      'Email support',
    ],
    locked: ['Docx Resume Editor (Pro only)'],
  },
  {
    id: 'pro' as PlanId,
    label: 'Pro',
    icon: Crown,
    monthly: '$29', yearly: '$278',
    tagline: 'For serious candidates',
    popular: true,
    features: [
      '40 application bundles/month',
      '40 cover letters/month',
      '30 mock interview sessions/month',
      '20 salary insights/month',
      '20 LinkedIn optimizations/month',
      '20 skill gap analyses/month',
      '60 Job Radar alerts/month',
      'Docx Resume Editor + PDF export',
      'Priority support',
      'Early access to new features',
    ],
    locked: [],
  },
];

const PricingCards = () => {
  const { tier, displayTier } = useUsageLimit();
  const { toast } = useToast();
  const [billing, setBilling] = useState<Billing>('monthly');
  const [loading, setLoading] = useState<PlanId | null>(null);

  const handleUpgrade = async (planId: PlanId) => {
    setLoading(planId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast({ title: 'Sign in required', variant: 'destructive' }); return; }
      const { data, error } = await supabase.functions.invoke('stripe-checkout', { body: { plan: planId, billing } });
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

      {/* Free tier summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-foreground">Free Plan</p>
            <p className="text-xs text-muted-foreground mt-0.5">Try it out — no card needed</p>
          </div>
          <Badge variant="outline" className="text-xs">{tier === 'free' ? 'Your Plan' : 'Free'}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {FREE_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />{f}
            </div>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="bg-muted/50 rounded-full p-1 border border-border/60 flex gap-1">
          {(['monthly', 'yearly'] as Billing[]).map((p) => (
            <button key={p} onClick={() => setBilling(p)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === p ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
              {p === 'yearly' && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5">Save 20%</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = displayTier.toLowerCase() === plan.id;
          const price = billing === 'monthly' ? plan.monthly : plan.yearly;
          const Icon = plan.icon;
          return (
            <div key={plan.id} className={`relative flex flex-col p-6 rounded-2xl border-2 bg-card hover:shadow-lg transition-all ${
              isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/10' :
              plan.popular ? 'border-primary ring-2 ring-primary/10' : 'border-border'
            }`}>
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-semibold border-0">Your Plan</Badge>
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
                  <span className="text-4xl font-extrabold text-foreground">{price}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
                {plan.locked.map((f, i) => (
                  <li key={`l${i}`} className="flex items-start gap-2.5 text-sm opacity-40">
                    <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground line-through">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-11 font-semibold gap-2 rounded-xl ${
                  isCurrent ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20' :
                  plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                  'bg-foreground text-background hover:bg-foreground/90'
                }`}
                disabled={isCurrent || loading === plan.id}
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
              >
                {isCurrent ? 'Current Plan' :
                 loading === plan.id ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</> :
                 <><Zap className="w-4 h-4" />{plan.id === 'starter' ? 'Get Starter' : 'Go Pro'}</>}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All paid plans include a 14-day free trial. No credit card required to start. Cancel anytime.
      </p>
    </div>
  );
};

export default PricingCards;
