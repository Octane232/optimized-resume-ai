import React from 'react';

const logos = [
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Slack', slug: 'slack' },
];

const TrustedBySection = () => (
  <section className="py-10 sm:py-12 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
        Signals tracked across companies like these
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-16 gap-y-7">
        {logos.map((l) => (
          <img
            key={l.slug}
            src={`https://cdn.simpleicons.org/${l.slug}/94a3b8`}
            alt={l.name}
            loading="lazy"
            width={28}
            height={28}
            className="h-6 sm:h-7 w-auto opacity-60 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
