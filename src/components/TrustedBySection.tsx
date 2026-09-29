import React from 'react';

const companies = ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Stripe', 'Anthropic'];

const TrustedBySection = () => (
  <section className="border-b border-border bg-background py-10 sm:py-12">
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">
        Follow the companies shaping your market
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5 sm:justify-between">
        {companies.map((company) => (
          <span key={company} className="text-sm font-semibold text-foreground/70 sm:text-base">
            {company}
          </span>
        ))}
      </div>
      <p className="mt-7 text-xs leading-5 text-muted-foreground">Company names are examples of organizations candidates may choose to follow; no endorsement is implied.</p>
    </div>
  </section>
);

export default TrustedBySection;
