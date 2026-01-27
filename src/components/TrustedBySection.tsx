import React from 'react';

const TrustedBySection = () => {
  // Real company logos using Simple Icons CDN (free, open-source)
  const companies = [
    { name: 'Google', logo: 'https://cdn.simpleicons.org/google/4285F4' },
    { name: 'Microsoft', logo: 'https://cdn.simpleicons.org/microsoft/00A4EF' },
    { name: 'Amazon', logo: 'https://cdn.simpleicons.org/amazon/FF9900' },
    { name: 'Meta', logo: 'https://cdn.simpleicons.org/meta/0081FB' },
    { name: 'Apple', logo: 'https://cdn.simpleicons.org/apple/A2AAAD' },
    { name: 'Netflix', logo: 'https://cdn.simpleicons.org/netflix/E50914' },
    { name: 'Spotify', logo: 'https://cdn.simpleicons.org/spotify/1DB954' },
    { name: 'Salesforce', logo: 'https://cdn.simpleicons.org/salesforce/00A1E0' }
  ];

  return (
    <section className="relative py-12 overflow-hidden bg-background border-y border-border/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by professionals from
          </p>
        </div>
        
        {/* Logo scroll container */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {companies.map((company, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 px-4 py-2 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="h-6 md:h-8 w-auto dark:invert-[0.8] dark:brightness-150"
                  loading="lazy"
                />
                <span className="text-lg md:text-xl font-semibold text-muted-foreground hidden md:inline">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
