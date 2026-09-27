import React from 'react';
import { TrendingUp, Building2, FileSignature, Users, Briefcase, LineChart } from 'lucide-react';

const stages = [
  { icon: TrendingUp, title: 'Funding', desc: 'New investment rounds and investor activity.' },
  { icon: Building2, title: 'Expansion', desc: 'New offices, facilities or market entries.' },
  { icon: FileSignature, title: 'New contract', desc: 'Large contracts or partnerships announced.' },
  { icon: Users, title: 'Hiring demand', desc: 'Growing operations or product launches.' },
  { icon: Briefcase, title: 'Job posted', desc: 'The role finally appears in public — later.' },
];

const SignalFlowSection = () => (
  <section className="py-16 sm:py-24 border-b border-border bg-secondary/40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 lg:gap-16 items-start mb-12">
        <div>
          <p className="text-[11px] font-semibold uppercase text-primary mb-4">The hiring signal comes before the job listing</p>
          <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-4">
            From business signals to your next opportunity.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            We watch what is happening in the real world, explain what it means for hiring, and help you prepare before everyone else is looking.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-signal-soft p-5 sm:p-6">
          <LineChart className="w-6 h-6 text-primary mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-2">The result</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You get signals, not just listings — so you can prepare, reach out and apply before the opportunity becomes crowded.
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.title} className="relative">
              {i < stages.length - 1 && (
                <span className="hidden lg:block absolute top-5 left-[calc(50%+2rem)] right-[-1.25rem] border-t border-dashed border-primary/40" aria-hidden="true" />
              )}
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border mb-4">
                <Icon className="w-4 h-4 text-primary" />
              </span>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

export default SignalFlowSection;
