import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';

const CTASection = () => (
  <section className="bg-vy-paper pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-vy-mist px-6 py-5 flex flex-col sm:flex-row items-center gap-5">
        <span className="w-12 h-12 rounded-full bg-vy-paper flex items-center justify-center shrink-0"><Lightbulb className="w-5 h-5 text-vy-teal" /></span>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold text-vy-deep">Find the companies before they become job listings.</p>
          <p className="text-xs text-vy-body">It's not about luck. It's about <span className="text-vy-teal">intelligence.</span></p>
        </div>
        <Link to="/auth" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-vy-deep text-vy-text text-sm font-semibold hover:bg-vy-teal transition-colors">
          Get Started Free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;
