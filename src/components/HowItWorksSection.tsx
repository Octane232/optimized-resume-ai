import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Radar picks up the signal',
    desc: 'A company raises money, wins a contract or opens a site. Vaylance catches it within hours.',
  },
  {
    num: '02',
    title: 'You see who to contact',
    desc: 'Likely roles, the reason they are hiring, and a direct route to the decision maker.',
  },
  {
    num: '03',
    title: 'Your resume is tailored',
    desc: 'Drop in your Word file and get it rewritten for that role, scored, and ready to send.',
  },
];

const HowItWorksSection = () => (
  <section className="py-14 sm:py-20 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground tracking-tight mb-10 sm:mb-14 max-w-xl">
        From news headline to sent application
      </h2>

      <ol className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {steps.map((s) => (
          <li key={s.num} className="bg-card p-6 sm:p-8">
            <span className="tabular text-sm font-semibold text-signal">{s.num}</span>
            <h3 className="text-base font-semibold text-foreground mt-3 mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
