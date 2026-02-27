import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, Clock, FileQuestion, Ghost, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const painPoints = [
    { icon: Ghost, text: "Sending resumes into the void" },
    { icon: XCircle, text: "Getting rejected by ATS filters" },
    { icon: FileQuestion, text: "Not knowing what recruiters want" },
    { icon: TrendingDown, text: "Low interview callback rates" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Top badge */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 text-sm font-medium text-foreground border border-border">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Trusted by 1,200+ job seekers
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center space-y-4 sm:space-y-6 animate-fade-in stagger-1">
            <h1 className="heading-xl text-balance">
              <span className="text-foreground">Stop guessing.</span>
              <br />
              <span className="gradient-text">Start getting hired.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed px-4">
              Vaylance is the AI career platform that writes your resume, matches you to jobs, 
              and coaches you through interviews — so you land offers faster.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 animate-fade-in stagger-2 px-4 sm:px-0">
            <Button asChild size="lg" className="saas-button h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold w-full sm:w-auto">
              <Link to="/auth" className="flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold w-full sm:w-auto border-border hover:border-primary/50"
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>

          {/* Free badge */}
          <div className="flex justify-center mt-4 animate-fade-in stagger-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Free plan available
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                No credit card
              </span>
            </div>
          </div>

          {/* Pain Points Banner */}
          <div className="mt-14 sm:mt-20 animate-fade-in stagger-4">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Sound familiar?
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="command-card p-4 sm:p-5 flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 group-hover:bg-destructive/15 transition-colors">
                    <point.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">{point.text}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-base sm:text-lg text-foreground font-semibold">
              Vaylance fixes all of this. <span className="gradient-text">Automatically.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
