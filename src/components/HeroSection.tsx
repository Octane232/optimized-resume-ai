import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Social proof badge */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm font-medium text-foreground border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Join 1,200+ job seekers already using Vaylance
            </div>
          </div>

          {/* Main headline - per document spec */}
          <div className="text-center space-y-4 sm:space-y-6 animate-fade-in stagger-1">
            <h1 className="heading-xl text-balance">
              <span className="text-foreground">Your AI Career Coach</span>
              <br />
              <span className="gradient-text">That Gets You Hired</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed px-4">
              Tailor your resume to pass ATS screening, prep for interviews, and find companies 
              hiring before they post roles publicly.
            </p>
          </div>

          {/* Single CTA - per document spec */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 animate-fade-in stagger-2 px-4 sm:px-0">
            <Button asChild size="lg" className="saas-button h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold w-full sm:w-auto">
              <Link to="/auth" className="flex items-center justify-center gap-2">
                Start Free Trial — 14 Days Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Trust line */}
          <div className="flex justify-center mt-4 animate-fade-in stagger-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;