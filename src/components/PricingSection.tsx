import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight, Zap, Sparkles, Crown, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free Trial',
    price: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Full access for 3 days. No credit card required.',
    icon: Rocket,
    features: [
      '✅ Full access to ALL features for 3 days',
      '✅ Resume Engine + ATS Score',
      '✅ Cover Letter Generation',
      '✅ LinkedIn Optimizer',
      '✅ Interview Coach',
      '✅ Job Radar Alerts',
      '✅ Skill Gap Analyzer',
      '✅ Application Tracker',
      '✅ No credit card required',
      '⏰ Trial ends after 3 days — pick a plan to continue',
    ],
    cta: 'Start Free Trial',
    popular: false,
    href: '/auth',
    tier: 'free' as const,
    badge: 'No credit card',
  },
  {
    name: 'Pro',
    price: 15,
    monthlyPrice: 15,
    yearlyPrice: 144,
    description: 'Everything you need for a serious job search.',
    icon: Sparkles,
    features: [
      '✅ Resume + ATS Engine (15 runs/month)',
      '✅ Cover Letter Generation (15/month)',
      '✅ LinkedIn Optimizer (10/month)',
      '✅ Interview Coach (20 sessions/month)',
      '✅ Job Radar Alerts (10 scans/month)',
      '✅ Skill Gap Analyzer (10 analyses/month)',
      '✅ DOCX Resume Rewrite (5/month)',
      '✅ Salary Intelligence (5 queries/month)',
      '✅ Application Tracker',
      '✅ Priority email support',
    ],
    cta: 'Start Pro Plan',
    popular: true,
    href: '/auth',
    tier: 'pro' as const,
    badge: 'Most popular',
  },
  {
    name: 'Elite',
    price: 29,
    monthlyPrice: 29,
    yearlyPrice: 278,
    description: 'Maximum power for serious job seekers.',
    icon: Crown,
    features: [
      '✅ Resume + ATS Engine (40 runs/month)',
      '✅ Cover Letter Generation (40/month)',
      '✅ LinkedIn Optimizer (30/month)',
      '✅ Interview Coach (60 sessions/month)',
      '✅ Job Radar Alerts (30 scans/month)',
      '✅ Skill Gap Analyzer (30 analyses/month)',
      '✅ DOCX Resume Rewrite (20/month)',
      '✅ Salary Intelligence (15 queries/month)',
      '✅ Application Tracker',
      '✅ Priority support + early access',
    ],
    cta: 'Start Elite Plan',
    popular: false,
    href: '/auth',
    tier: 'elite' as const,
    badge: 'Best value',
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.name === 'Free Trial') return 'Free';
    return isYearly ? `$${plan.yearlyPrice}` : `$${plan.monthlyPrice}`;
  };

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.name === 'Free Trial') return '3 days';
    return isYearly ? '/year' : '/month';
  };

  const getMonthlyEquivalent = (plan: typeof plans[0]) => {
    if (plan.name === 'Free Trial') return null;
    if (!isYearly) return null;
    return `~$${Math.round(plan.yearlyPrice / 12)}/month billed annually`;
  };

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Start free. Land your next job.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            3-day free trial — no credit card required. Get full access to everything.
          </p>
        </div>

        {/* Billing toggle - hide for free trial? No, keep it for Pro/Elite comparison */}
        <div className="flex items-center gap-3 mb-10">
          <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-11 h-6 rounded-full transition-colors ${isYearly ? 'bg-primary' : 'bg-muted'}`}
            aria-label="Toggle billing period"
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save ~20%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = getPrice(plan);
            const period = getPeriod(plan);
            const monthlyEquivalent = getMonthlyEquivalent(plan);
            
            return (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border bg-card transition-all duration-200 flex flex-col ${
                  plan.popular
                    ? 'border-primary/50 shadow-lg ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/30 hover:shadow-md'
                } ${plan.name === 'Free Trial' ? 'bg-gradient-to-br from-emerald-50/50 to-background dark:from-emerald-950/20' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                      plan.badge === 'No credit card' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : plan.badge === 'Most popular'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {plan.badge === 'Most popular' && <Star className="w-3 h-3 fill-current" />}
                      {plan.badge === 'Best value' && <Crown className="w-3 h-3" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-xl ${
                      plan.name === 'Free Trial' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      plan.name === 'Pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-foreground">
                      {price}
                    </span>
                    {price !== 'Free' && (
                      <span className="text-muted-foreground text-sm">{period}</span>
                    )}
                    {price === 'Free' && (
                      <span className="text-muted-foreground text-sm">trial</span>
                    )}
                  </div>
                  {monthlyEquivalent && (
                    <p className="text-xs text-muted-foreground mt-1">{monthlyEquivalent}</p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature, fi) => {
                    const isCheck = feature.startsWith('✅');
                    const isWarning = feature.startsWith('⏰');
                    const displayText = feature.replace(/^[✅⏰]\s*/, '');
                    
                    return (
                      <li key={fi} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCheck ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                          isWarning ? 'bg-amber-100 dark:bg-amber-900/30' : 
                          'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${
                            isCheck ? 'text-emerald-700 dark:text-emerald-400' : 
                            isWarning ? 'text-amber-700 dark:text-amber-400' : 
                            'text-gray-500'
                          }`} />
                        </div>
                        <span className="text-xs text-foreground/80 leading-relaxed">
                          {displayText}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.popular ? 'default' : 'outline'}
                  className={`w-full h-11 font-semibold gap-2 ${
                    plan.name === 'Free Trial' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                  }`}
                >
                  <Link to={plan.href}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          3-day free trial — no credit card required. Cancel anytime. Get full access to everything.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
