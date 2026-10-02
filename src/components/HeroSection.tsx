import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, TrendingUp, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const signals = [
  { company: 'Stripe', trigger: 'Go-to-market team expansion', detail: '14 new headcount approved · New York', lead: '6 days', match: 94 },
  { company: 'Datadog', trigger: 'New EMEA office announced', detail: 'Dublin · Engineering & Sales', lead: '11 days', match: 89 },
  { company: 'Ramp', trigger: 'Series D funding closed', detail: '$150M raised · Finance & Ops roles', lead: '9 days', match: 86 },
];

const HeroSection = () => (
  <section className="pt-28 sm:pt-32 pb-16 sm:pb-24 border-b border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Early hiring intelligence
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground mb-6">
          Know who's hiring before the job is posted.
        </h1>
        <p className="text-lg text-muted-foreground max-w-[34rem] leading-relaxed mb-8">
          Vaylance tracks funding, expansion and headcount signals, then tunes your resume for the role before it goes public.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="h-12 px-6 text-base font-semibold active:scale-[0.98]">
            <Link to="/auth">Start free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 px-6 text-base font-medium">
            <a href="#how-it-works">How it works</a>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Radio className="w-4 h-4 text-primary" /> Job Radar
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
            </span>
            Live
          </span>
        </div>
        <ul className="divide-y divide-border">
          {signals.map((s) => (
            <li key={s.company} className="px-5 py-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold text-foreground">{s.company}</p>
                  <span className="text-sm font-semibold text-primary tabular-nums">{s.match}% match</span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{s.trigger}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.detail}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />Spotted {s.lead} before listing</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          Example signals · updated every 6 hours
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
