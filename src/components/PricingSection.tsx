import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Radar, FileCheck2, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Try the whole workspace, no card needed.',
    highlights: [
      { icon: FileCheck2, value: '1', label: 'Resume + ATS run' },
      { icon: FileCheck2, value: '2', label: 'Resume uploads' },
      { icon: Mic, value: '3', label: 'Bullet rewrites' },
    ],
    groups: [
      { label: 'Applications', detail: '1 run (resume + cover letter + ATS) · 2 resume uploads · 3 bullet rewrites' },
      { label: 'Career tools', detail: '1 salary report' },
      { label: 'Always included', detail: 'Full application tracker · dashboard · no credit card' },
    ],
    cta: 'Start free — no card',
    popular: false,
    free: true,
  },
  {
    name: 'Pro',
    price: 24,
    description: 'For an active, focused job search.',
    highlights: [
      { icon: Radar, value: '30', label: 'Job Radar alerts' },
      { icon: FileCheck2, value: '40', label: 'Resume + ATS runs' },
      { icon: Mic, value: '40', label: 'Interview sessions' },
    ],
    groups: [
      { label: 'Discovery', detail: '30 Radar alerts · 120 resume uploads' },
      { label: 'Applications', detail: '40 runs (resume + cover letter + ATS) · 150 bullet rewrites · 15 Word rewrites' },
      { label: 'Career tools', detail: '20 LinkedIn · 20 skill gap · 15 salary reports' },
    ],
    cta: 'Start 3-day free trial',
    popular: true,
  },
  {
    name: 'Elite',
    price: 49,
    description: 'For a high-volume or urgent search.',
    highlights: [
      { icon: Radar, value: '100', label: 'Job Radar alerts' },
      { icon: FileCheck2, value: '150', label: 'Resume + ATS runs' },
      { icon: Mic, value: '120', label: 'Interview sessions' },
    ],
    groups: [
      { label: 'Discovery', detail: '100 Radar alerts · 500 resume uploads' },
      { label: 'Applications', detail: '150 runs (resume + cover letter + ATS) · 400 bullet rewrites · 50 Word rewrites' },
      { label: 'Career tools', detail: '60 LinkedIn · 60 skill gap · 40 salary reports' },
      { label: 'Elite extras', detail: 'Live Coach Mode · ATS review · priority support' },
    ],
    cta: 'Start 3-day free trial',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-16 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] mb-3 font-mono text-signal">PRICING</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Start free. No credit card.
        </h2>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">The Free plan is yours forever and never asks for a card. Pro and Elite add a 3-day trial you can cancel any time before it ends.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-5 max-w-5xl mx-auto">
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
