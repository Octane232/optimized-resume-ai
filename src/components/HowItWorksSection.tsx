import React from 'react';
import { BellRing, Search, FileCheck2, BriefcaseBusiness } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: BellRing,
    title: 'Set your direction',
    desc: 'Add your target roles, skills and preferred locations.',
  },
  {
    num: '02',
    icon: Search,
    title: 'Find opportunities',
    desc: 'See matched roles and early hiring signals in one feed.',
  },
  {
    num: '03',
    icon: FileCheck2,
    title: 'Prepare and apply',
    desc: 'Tailor your resume, check its ATS fit and prepare your outreach.',
  },
  {
    num: '04',
    icon: BriefcaseBusiness,
    title: 'Track what happens',
    desc: 'Keep applications organized and prepare for the interview.',
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-16 sm:py-24 border-b border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12"><p className="text-[11px] font-semibold uppercase text-primary mb-3">How it works</p><h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-3">Get from where you are to where you want to be.</h2><p className="text-sm text-muted-foreground">A clear four-step process for a more focused job search.</p></div>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <li key={s.num} className="relative rounded-lg border border-border bg-background p-5">
              {index < steps.length - 1 && <span className="hidden lg:block absolute top-10 -right-5 w-5 border-t border-dashed border-primary/50" aria-hidden="true" />}
              <div className="flex items-center justify-between mb-6"><span className="w-11 h-11 flex items-center justify-center rounded-md bg-signal-soft"><Icon className="w-5 h-5 text-primary" /></span><span className="tabular text-sm font-semibold text-signal">{s.num}</span></div>
              <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
