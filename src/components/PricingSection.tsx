import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free Trial',
    price: 0,
    trial: true,
    description: 'Experience Vaylance free for 3 days.',
    features: [
      '✅ Full access to all features for 3 days',
      '✅ 10 Resume + ATS runs',
      '✅ 10 Cover Letters',
      '✅ 10 Job Searches',
      '✅ 20 Bullet Rewrites',
      '✅ 5 LinkedIn Optimizations',
      '✅ 5 Skill Gap Analyses',
      '✅ 10 Interview Prep sessions',
      '✅ 5 Salary Insights',
      '✅ 5 Job Radar Alerts',
      '✅ 5 DOCX Rewrites',
      '✅ 20 Resume Uploads',
      '⏰ Trial ends after 3 days — upgrade to continue'
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: 15,
    trial: false,
    description: 'Everything you need to get hired.',
    features: [
      '✅ 50 Job Searches / month',
      '✅ 75 Bullet Rewrites / month',
      '✅ 30 Resume + ATS runs',
      '✅ 30 Cover Letters',
      '✅ 15 LinkedIn Optimizations',
      '✅ 15 Skill Gap Analyses',
      '✅ 30 Interview Prep sessions',
      '✅ 10 Salary Insights',
      '✅ 15 Job Radar Alerts',
      '✅ 10 DOCX Rewrites',
      '✅ 100 Resume Uploads',
      '✅ Priority Support'
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 29,
    trial: false,
    description: 'For serious job seekers.',
    features: [
      '✅ 120 Job Searches / month',
      '✅ 300 Bullet Rewrites / month',
      '✅ 100 Resume + ATS runs',
      '✅ 100 Cover Letters',
      '✅ 50 LinkedIn Optimizations',
      '✅ 50 Skill Gap Analyses',
      '✅ 100 Interview Prep sessions',
      '✅ 30 Salary Insights',
      '✅ 50 Job Radar Alerts',
      '✅ 50 DOCX Rewrites',
      '✅ 500 Resume Uploads',
      '✅ Priority Support',
      '✅ ATS Resume Review',
      '✅ Job Application Automation',
      '✅ 1-on-1 Career Coaching (2x/month)'
    ],
    cta: 'Upgrade to Elite',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold tracking-[0.25em] mb-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">SIMPLE, TRANSPARENT PRICING</p>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
          Choose the perfect plan for you
        </h2>
        <p className="text-muted-foreground">Start free and upgrade anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-7 rounded-2xl border bg-card transition-all flex flex-col ${
              plan.popular
                ? 'border-violet-500/50 shadow-2xl shadow-violet-600/20 ring-1 ring-violet-500/30 scale-[1.02] z-10'
                : 'border-border hover:border-primary/30'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                {plan.trial ? (
                  <>
                    <span className="text-4xl font-black text-foreground">3 days</span>
                    <span className="text-muted-foreground text-sm">free</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-black text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </>
                )}
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className={`w-full h-11 font-semibold gap-2 mb-6 ${
                plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              <Link to="/auth">
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <ul className="space-y-3 flex-1">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
