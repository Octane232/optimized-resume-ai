import React from 'react';
import { Radar, FileText, Mic, DollarSign, Linkedin, Search, TrendingUp, Send } from 'lucide-react';

const supporting = [
  { icon: Radar, title: 'Job Radar', desc: 'Find hiring signals before public job posts appear.' },
  { icon: Search, title: 'Job Search', desc: 'Search and filter live roles in one focused workspace.' },
  { icon: FileText, title: 'Resume + ATS', desc: 'Score and tailor your resume against a real role.' },
  { icon: Mic, title: 'Interview Prep', desc: 'Technical, behavioural and situational rounds with scored feedback.' },
  { icon: Send, title: 'Cover Letters', desc: 'Create a targeted first draft based on the job.' },
  { icon: DollarSign, title: 'Salary Intelligence', desc: 'Market benchmarks plus a negotiation script for your offer.' },
  { icon: Linkedin, title: 'LinkedIn Optimizer', desc: 'Headline and summary rewritten for recruiter search.' },
  { icon: TrendingUp, title: 'Skill Gap Analyzer', desc: 'What you are missing for a target role, and how to close it.' },
];

const FeaturesSection = () => (
  <section className="py-16 sm:py-24 border-b border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
      <div className="lg:sticky lg:top-28">
        <p className="text-[11px] font-semibold uppercase text-primary mb-4">Key features</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-4">Everything you need to land your next role.</h2>
        <p className="text-muted-foreground leading-relaxed max-w-md">From early hiring signals to the final interview, Vaylance keeps your search focused and your applications relevant.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {supporting.map((f) => {
          const Icon = f.icon;
          return (
            <article key={f.title} className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-md bg-signal-soft flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
              <div><h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p></div>
            </article>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
