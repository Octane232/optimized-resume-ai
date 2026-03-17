import { Check, X, Star, Shield, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const PricingCards = () => {
const { tier } = useSubscription();
const { toast } = useToast();
const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

const plans = [
{
id: 'starter' as const,
label: 'Starter',
monthlyPrice: '$12',
yearlyPrice: '$115',
period: billingCycle === 'monthly' ? '/month' : '/year',
description: 'Everything you need to get hired.',
icon: Sparkles,
popular: false,
features: [
'ATS Resume Scanner & Rewriter',
'Cover Letter Generator',
'Interview Coach — Practice Mode',
'Job Radar (20 alerts/month)',
'Application Tracker',
'LinkedIn Optimizer',
'Skill Gap Analyzer',
'50 AI credits/month',
'Email support',
],
locked: [],
},
{
id: 'pro' as const,
label: 'Pro',
monthlyPrice: '$29',
yearlyPrice: '$278',
period: billingCycle === 'monthly' ? '/month' : '/year',
description: 'Everything in Starter plus premium features.',
icon: Crown,
popular: true,
features: [
'Everything in Starter',
'Live Interview Copilot',
'Unlimited radar alerts',
'Salary Intelligence',
'Priority AI processing',
'100 AI credits/month',
'Early access to new features',
'Priority support',
],
locked: [],
},
];

const handleUpgrade = async (planId: 'starter' | 'pro') => {
setLoadingPlan(planId);
try {
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
toast({
title: 'Sign in required',
description: 'Please sign in to upgrade your plan.',
variant: 'destructive',
});
return;
}

const { data, error } = await supabase.functions.invoke('stripe-checkout', {
body: { plan: planId, billing: billingCycle },
});

if (error) throw error;
if (!data?.url) throw new Error('No checkout URL returned');

// Redirect to Stripe checkout
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

const getPrice = (plan: typeof plans[0]) =>
billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

const getSavings = (plan: typeof plans[0]) => {
if (billingCycle !== 'yearly') return null;
const monthly = parseInt(plan.monthlyPrice.replace('$', ''));
const yearly = parseInt(plan.yearlyPrice.replace('$', ''));
const saved = (monthly * 12) - yearly;
return `Save $${saved}`;
};

return (
<div className="space-y-6">
{/* Billing Toggle */}
<div className="flex justify-center">
<div className="bg-muted/50 rounded-full p-1 border border-border/60 flex gap-1">
<button
onClick={() => setBillingCycle('monthly')}
className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ billingCycle === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground' }`}
>
Monthly
</button>
<button
onClick={() => setBillingCycle('yearly')}
className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${ billingCycle === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground' }`}
>
Yearly
<Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] px-1.5">
Save 20%
</Badge>
</button>
</div>
</div>

{/* Cards */}
<div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
{plans.map((plan) => {
const isCurrent = tier === plan.id;
const isLoading = loadingPlan === plan.id;
const Icon = plan.icon;
const savings = getSavings(plan);

return (
<div
key={plan.id}
className={`relative flex flex-col p-6 rounded-2xl border-2 bg-card transition-all duration-200 hover:shadow-lg ${
plan.popular
? 'border-primary ring-2 ring-primary/10'
: 'border-border'
} ${isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/10' : ''}`}
>
{/* Badge */}
{plan.popular && !isCurrent && (
<div className="absolute -top-3 left-1/2 -translate-x-1/2">
<Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-md border-0">
<Star className="w-3 h-3 mr-1" />Most Popular
</Badge>
</div>
)}
{isCurrent && (
<div className="absolute -top-3 left-1/2 -translate-x-1/2">
<Badge className="bg-emerald-500 text-white px-3 py-1 text-xs font-semibold shadow-md border-0">
Current Plan
</Badge>
</div>
)}

{/* Header */}
<div className="text-center mb-6 pt-2">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
<Icon className="w-6 h-6 text-primary" />
</div>
<h3 className="text-xl font-bold text-foreground">{plan.label}</h3>
<p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
</div>

{/* Price */}
<div className="text-center mb-6">
<div className="flex items-baseline justify-center gap-1">
<span className="text-4xl font-extrabold text-foreground">{getPrice(plan)}</span>
<span className="text-sm text-muted-foreground">{plan.period}</span>
</div>
{savings && (
<Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
{savings}
</Badge>
)}
</div>

{/* Features */}
<ul className="space-y-2.5 flex-1 mb-6">
{plan.features.map((f, i) => (
<li key={i} className="flex items-start gap-2.5 text-sm">
<Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
<span className="text-foreground/80">{f}</span>
</li>
))}
</ul>

{/* Button */}
<Button
className={`w-full rounded-xl font-semibold h-11 gap-2 ${
isCurrent
? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-default'
: plan.popular
? 'bg-primary text-primary-foreground hover:bg-primary/90'
: 'bg-foreground text-background hover:bg-foreground/90'
}`}
disabled={isCurrent || isLoading}
onClick={() => !isCurrent && handleUpgrade(plan.id)}
>
{isCurrent ? (
'Current Plan'
) : isLoading ? (
<><Loader2 className="w-4 h-4 animate-spin" />Redirecting to Stripe…</>
) : (
<><Zap className="w-4 h-4" />Upgrade to {plan.label}</>
)}
</Button>
</div>
);
})}
</div>

<p className="text-center text-xs text-muted-foreground">
14-day free trial. Cancel anytime. No questions asked.
</p>
</div>
);
};

export default PricingCards;
