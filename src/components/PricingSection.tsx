import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Pro',
    price: 15,
    description: 'Everything you need to get hired.',
    features: [
      '50 Job Searches / month',
      '75 Bullet Rewrites / month',
      '30 Resume + ATS runs',
      '30 Cover Letters',
      '15 LinkedIn Optimizations',
      '15 Skill Gap Analyses',
      '30 Interview Prep sessions',
      '10 Salary Insights',
      '15 Job Radar Alerts',
      '10 DOCX Rewrites',
      '100 Resume Uploads',
      'Priority Support'
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 29,
    description: 'For serious job seekers.',
    features: [
      '120 Job Searches / month',
      '300 Bullet Rewrites / month',
      '100 Resume + ATS runs',
      '100 Cover Letters',
      '50 LinkedIn Optimizations',
      '50 Skill Gap Analyses',
      '100 Interview Prep sessions',
      '30 Salary Insights',
      '50 Job Radar Alerts',
      '50 DOCX Rewrites',
      '500 Resume Uploads',
      'Priority Support',
      'ATS Resume Review',
      'Live Coach Mode',
      'Job Application Automation — Coming Soon'
    ],
    cta: 'Upgrade to Elite',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-12 sm:py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] mb-3 font-mono text-signal">SIMPLE, TRANSPARENT PRICING</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Choose the perfect plan for you
        </h2>
        <p className="text-muted-foreground">Pick a plan and cancel anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-5 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-5 sm:p-7 rounded-lg border bg-card transition-all flex flex-col ${
              plan.popular
                ? 'border-signal/60'
                : 'border-border hover:border-primary/30'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-md bg-signal text-signal-foreground">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className={`w-full h-11 font-semibold gap-2 mb-6 ${
                plan.popular
                  ? ''
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Link to="/auth">
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <ul className="space-y-2.5 sm:space-y-3 flex-1">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-[13px] sm:text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
