import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => (
  <section className="py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
        Get there before the job post does.
      </h2>
      <Button asChild size="lg" className="h-12 px-6 text-base font-semibold shrink-0 active:scale-[0.98]">
        <Link to="/auth">Start free <ArrowRight className="w-4 h-4 ml-1" /></Link>
      </Button>
    </div>
  </section>
);

export default CTASection;
