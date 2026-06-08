import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free Trial',
    price: 0,
    trial: true,
    description: 'Try Vaylance free for 3 days.',
    features: ['Full access for 3 days', '5 Job Matches / day', '1 Resume', 'AI Cover Letter (3 / month)', 'Application Tracker'],
    cta: 'Start Free Trial',
    popular: false,
  },

  {
    name: 'Pro',
    price: 15,
    description: 'Everything you need to get hired.',
    features: ['Unlimited Job Matches', 'Unlimited Resumes', 'AI Cover Letters (Unlimited)', 'Interview Coach', 'Salary Insights'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Elite',
    price: 29,
    description: 'For serious job seekers.',
    features: ['Everything in Pro', 'Priority Support', 'ATS Resume Review', 'Job Application Automation'],
    cta: 'Start Free Trial',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24">
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
                ? 'border-violet-500/50 shadow-2xl shadow-violet-600/20 ring-1 ring-violet-500/30 scale-[1.02]'
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
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white'
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
