import React from 'react';

const logos = ['Google', 'Microsoft', 'airbnb', 'Meta', 'amazon', 'stripe', 'Notion'];

const TrustedBySection = () => (
  <section className="py-10 border-y border-border/40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-[11px] font-bold tracking-[0.25em] text-muted-foreground mb-8">
        TRUSTED BY PEOPLE AT TOP COMPANIES
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
        {logos.map((l) => (
          <span key={l} className="text-2xl sm:text-3xl font-semibold text-muted-foreground/60 hover:text-foreground transition-colors tracking-tight">
            {l}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
