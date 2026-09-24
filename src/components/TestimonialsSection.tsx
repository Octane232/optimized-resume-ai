import React from 'react';

const points = [
  { label: 'Before', text: 'Applying to a public posting alongside hundreds of other people, hours after it goes live.' },
  { label: 'With Radar', text: 'Seeing a funding round or expansion, the roles it usually creates, and who to contact first.' },
  { label: 'Then', text: 'Tailoring your own resume file to that role and checking the ATS match before you reach out.' },
];

const TestimonialsSection = () => (
  <section className="py-14 sm:py-20 border-t border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal mb-3">Why it works</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-extrabold text-foreground tracking-tight">
          Earlier beats louder.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 border border-border rounded-lg divide-y md:divide-y-0 md:divide-x divide-border bg-card">
        {points.map((p) => (
          <div key={p.label} className="p-6">
            <p className="font-mono text-xs text-muted-foreground mb-3">{p.label}</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
