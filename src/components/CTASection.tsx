import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => (
  <section className="py-14 sm:py-20 border-t border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-border bg-card p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal mb-2">Next step</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
            Find the companies hiring before everyone else.
          </h3>
          <p className="text-sm text-muted-foreground">Run a Job Radar scan and tailor your resume to what you find.</p>
        </div>
        <Button asChild size="lg" className="h-12 px-6 font-semibold shrink-0 w-full sm:w-auto">
          <Link to="/auth">
            Start with Job Radar
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;
