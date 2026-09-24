import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Radar, FileCheck2, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Pro',
    price: 15,
    description: 'For an active, focused job search.',
    highlights: [
      { icon: Radar, value: '15', label: 'Job Radar alerts' },
      { icon: FileCheck2, value: '30', label: 'Resume + ATS runs' },
      { icon: Mic, value: '30', label: 'Interview sessions' },
    ],
    groups: [
      { label: 'Search', detail: '50 job searches · 15 Radar alerts' },
      { label: 'Applications', detail: '30 cover letters · 75 bullet rewrites · 10 DOCX rewrites' },
      { label: 'Career tools', detail: '15 LinkedIn · 15 skill gap · 10 salary reports' },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 29,
    description: 'For a high-volume or urgent search.',
    highlights: [
      { icon: Radar, value: '50', label: 'Job Radar alerts' },
      { icon: FileCheck2, value: '100', label: 'Resume + ATS runs' },
      { icon: Mic, value: '100', label: 'Interview sessions' },
    ],
    groups: [
      { label: 'Search', detail: '120 job searches · 50 Radar alerts' },
      { label: 'Applications', detail: '100 cover letters · 300 bullet rewrites · 50 DOCX rewrites' },
      { label: 'Career tools', detail: '50 LinkedIn · 50 skill gap · 30 salary reports' },
      { label: 'Elite extras', detail: 'Live Coach Mode · ATS review · priority support' },
    ],
    cta: 'Upgrade to Elite',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-16 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] mb-3 font-mono text-signal">PRICING</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Two plans, no surprises
        </h2>
        <p className="text-base text-muted-foreground">Create an account free to explore the workspace. A paid plan is required to run searches, scans and coaching tools.</p>
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
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {plan.highlights.map((item) => {
                const Icon = item.icon;
                return <div key={item.label} className="rounded-md bg-secondary/50 p-3"><Icon className="w-4 h-4 text-primary mb-2" /><p className="text-xl font-semibold text-foreground">{item.value}</p><p className="text-xs text-muted-foreground leading-snug">{item.label}</p></div>;
              })}
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

            <ul className="space-y-4 flex-1">
              {plan.groups.map((group) => (
                <li key={group.label} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                  <span><strong className="font-semibold text-foreground">{group.label}</strong><span className="block text-muted-foreground mt-0.5 leading-relaxed">{group.detail}</span></span>
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
