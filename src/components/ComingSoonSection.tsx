
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
            Enterprise & Team Features
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            We're building team collaboration tools and bulk resume management for HR teams and recruitment agencies.
          </p>

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">Team workspaces with shared templates and brand guidelines</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">Bulk candidate resume formatting and export</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">Integration with ATS systems</p>
            </div>
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
