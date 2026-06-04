import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroDashboard from '@/assets/hero-dashboard.png.asset.json';

const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (previewRef.current) observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const trustItems = ['No credit card required', 'Cancel anytime', 'Free plan'];

  return (
    <section className="relative min-h-screen flex items-center bg-background pt-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          AI-powered job search platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
          Land your next job{' '}
          <span className="text-primary">faster</span>
          {' '}with AI
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Vaylance tailors your resume to pass ATS filters, preps you for interviews,
          and finds companies hiring before they post publicly — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Button asChild size="lg" className="h-12 px-8 font-semibold text-base gap-2 w-full sm:w-auto">
            <Link to="/auth">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 font-medium text-base w-full sm:w-auto">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          {trustItems.map((item, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              {item}
            </span>
          ))}
        </div>

        {/* Product screenshot */}
        <div
          ref={previewRef}
          className="mt-20 max-w-6xl mx-auto relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="h-9 bg-muted/60 border-b border-border flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-amber-400/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
              <div className="flex-1 flex justify-center">
                <span className="px-3 py-0.5 rounded-md bg-background/60 text-[11px] text-muted-foreground font-mono">
                  vaylance.com/dashboard
                </span>
              </div>
            </div>

            <img
              src={heroDashboard.url}
              alt="Vaylance dashboard showing the Hidden Job Radar with company funding alerts and match scores"
              className="w-full h-auto block"
              loading="eager"
            />
          </div>

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-2xl" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
