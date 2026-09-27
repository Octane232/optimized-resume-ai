import React from 'react';
import { Building2, Clock, Users, Gauge } from 'lucide-react';

const rows = [
  { company: 'Northwind Logistics', signal: 'New distribution center', why: 'Facility expansion plus operational growth', roles: ['Operations Manager', 'Warehouse Manager'], match: 92 },
  { company: 'Apex Energy', signal: '$42M funding round', why: 'Funding plus a new projects pipeline', roles: ['Project Manager', 'Mechanical Engineer'], match: 78 },
  { company: 'HealthPlus', signal: 'New regional office', why: 'Regional expansion and service growth', roles: ['Administrator', 'Nurse Manager'], match: 85 },
];

const benefits = [
  { icon: Building2, title: 'Real company intelligence', desc: 'We identify the company, its location, size and the roles it is likely to need.' },
  { icon: Clock, title: 'Why now', desc: 'You see what is driving the signal and what it means for their hiring.' },
  { icon: Users, title: 'Find contacts', desc: 'Jump to LinkedIn to find the people relevant to that opportunity.' },
  { icon: Gauge, title: 'Your fit', desc: 'See how well you match and get tailored next steps to prepare.' },
];

const HiringRadarSection = () => (
  <section id="hiring-radar" className="py-16 sm:py-24 border-b border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-10">
        <p className="text-[11px] font-semibold uppercase text-primary mb-4">Our flagship feature</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-4">Meet Hiring Radar</h2>
        <p className="text-muted-foreground leading-relaxed">
          The clearest way to discover companies that may be hiring before the job is posted — with real context, not just a list of links.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-12 items-start">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold text-foreground">Hiring Radar</h3>
            <p className="text-xs text-muted-foreground">Companies showing signs of upcoming hiring</p>
          </div>
          <div className="divide-y divide-border">
            {rows.map((r) => (
              <div key={r.company} className="p-4 sm:p-5 grid sm:grid-cols-[1.1fr_1fr_0.9fr_auto] gap-4 items-start">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.company}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.signal}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.why}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.roles.map((role) => (
                    <span key={role} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{role}</span>
                  ))}
                </div>
                <div className="text-right">
                  <p className="tabular text-base font-semibold text-primary">{r.match}%</p>
                  <p className="text-[10px] text-muted-foreground">your fit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <article key={b.title} className="flex gap-3.5">
                <span className="w-9 h-9 shrink-0 rounded-md bg-signal-soft flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default HiringRadarSection;
