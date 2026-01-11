import React from 'react';

const TrustedBySection = () => {
  // Company names that employees use Pitchsora (displayed as text logos for clean look)
  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Apple',
    'Netflix',
    'Spotify',
    'Salesforce'
  ];

  return (
    <section className="relative py-12 overflow-hidden bg-background border-y border-border/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by professionals from
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default select-none"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
