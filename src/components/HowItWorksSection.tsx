import React from 'react';

const steps = [
  { title: 'Spot the signal', desc: 'Radar flags a company that just raised, expanded or grew its team in your field.' },
  { title: 'Tune your resume', desc: 'We score your resume against the likely role and fix what is missing.' },
  { title: 'Reach out first', desc: 'Get a suggested contact and message, days before the job board fills up.' },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 sm:py-24 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        From signal to interview.
      </h2>
      <ol className="lg:col-span-2 border-t border-border">
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-border">
            <span className="text-sm font-semibold text-primary tabular-nums">0{i + 1}</span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
