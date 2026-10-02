import React from 'react';

const logos = [
  { name: 'Google', slug: 'google' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Airbnb', slug: 'airbnb' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Meta', slug: 'meta' },
  { name: 'Shopify', slug: 'shopify' },
];

const TrustedBySection = () => (
  <section className="py-10 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-muted-foreground mb-6">Used by job seekers now working at</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 items-center justify-items-center">
        {logos.map((l) => (
          <img
            key={l.slug}
            src={`https://cdn.simpleicons.org/${l.slug}/737373`}
            alt={l.name}
            loading="lazy"
            className="h-6 sm:h-7 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
