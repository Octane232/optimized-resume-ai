import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 12,
    yearlyPrice: 115,
    description: 'Everything you need to run a focused job search.',
    features: [
      'ATS Engine & Resume Rewrite',
      'Cover Letter Generation',
      'Interview Coach (text)',
      'Job Radar (20 alerts/month)',
      'Application Tracker',
      'LinkedIn Optimizer',
      'Skill Gap Analyzer',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
    href: '/auth',
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 278,
    description: 'Everything in Starter, plus premium features.',
    features: [
      'Everything in Starter',
      'Unlimited radar alerts',
      'Salary Intelligence',
      'Live Interview Copilot',
      'Priority AI processing',
      'Early access to new features',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
    href: '/auth',
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Two plans. Start free.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            No charge until day 15. Cancel anytime. No credit card required to start.
          </p>
        </div>

        {/* Billing toggle */}
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

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border bg-card transition-all duration-200 ${
                plan.popular
                  ? 'border-primary/50 shadow-md'
                  : 'border-border hover:border-primary/30 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-black text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground text-sm">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ~${Math.round(plan.yearlyPrice / 12)}/month billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-700" />
                    </div>
                    <span className="text-sm text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={plan.popular ? 'default' : 'outline'}
                className="w-full h-11 font-semibold gap-2"
              >
                <Link to={plan.href}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-8 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          Free plan available — no credit card required. Upgrade anytime.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
