import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-fuchsia-600/20 overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-foreground mb-1">
            Ready to land your next job faster?
          </h3>
          <p className="text-sm text-muted-foreground">
            Join 10,000+ job seekers who've already upgraded their careers with AI.
          </p>
        </div>
        <Button asChild size="lg" className="h-12 px-6 font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-600/30 shrink-0">
          <Link to="/auth">
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;
