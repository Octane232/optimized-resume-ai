import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Set your direction',
    desc: 'Add your target roles, skills and preferred locations.',
  },
  {
    num: '02',
    title: 'Find opportunities',
    desc: 'See matched roles and early hiring signals in one feed.',
  },
  {
    num: '03',
    title: 'Prepare and apply',
    desc: 'Tailor your resume, check its ATS fit and prepare your outreach.',
  },
  {
    num: '04',
    title: 'Track what happens',
    desc: 'Keep applications organized and prepare for the interview.',
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-16 sm:py-24 border-b border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12"><p className="text-[11px] font-semibold uppercase text-primary mb-3">How it works</p><h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-3">Get from where you are to where you want to be.</h2><p className="text-sm text-muted-foreground">A clear four-step process for a more focused job search.</p></div>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-5">
        {steps.map((s) => (
          <li key={s.num} className="relative">
            <span className="tabular inline-flex w-9 h-9 items-center justify-center rounded-full bg-signal-soft text-sm font-semibold text-signal">{s.num}</span>
            <h3 className="text-base font-semibold text-foreground mt-3 mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
