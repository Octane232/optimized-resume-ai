
import React from 'react';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ComingSoonSection = () => {
  const platforms = [
    { name: 'LinkedIn', logo: Linkedin },
    { name: 'Indeed', logo: null },
    { name: 'Glassdoor', logo: null },
    { name: 'Monster', logo: null },
    { name: 'ZipRecruiter', logo: null }
  ];

  return (
    <section id="enterprise" className="py-20 bg-card border-y border-border">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">Coming Soon</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Enterprise Solutions
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Team features and organization tools to help companies streamline their hiring process.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {platforms.map((platform, index) => (
              <div 
                key={index} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground"
              >
                {platform.logo && <platform.logo className="h-4 w-4" />}
                <span>{platform.name}</span>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-2xl p-6 max-w-md bg-muted/20">
            <h3 className="font-semibold mb-4 text-foreground">Get early access</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
