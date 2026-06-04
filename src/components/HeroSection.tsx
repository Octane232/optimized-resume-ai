import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

const HeroSection = () => {
  const [animating, setAnimating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimating(true); },
      { threshold: 0.3 }
    );
    if (previewRef.current) observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  const matchScore = useCountUp(85, 1400, animating);
  const alertsCount = useCountUp(40, 1200, animating);
  const signalsCount = useCountUp(50, 1200, animating);

  const trustItems = ['No credit card required', 'Cancel anytime', 'Free plan'];

  const radarAlerts = [
    {
      initial: 'N',
      company: 'Nectar Social',
      round: 'Series A · $30M',
      description: 'AI-powered marketing platform raised a $30M Series A round.',
      roles: ['Product Manager', 'Software Engineer', 'Data Analyst'],
      tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      initial: 'S',
      company: 'Stilta',
      round: 'Series A · $10.5M',
      description: 'AI platform automating research behind intellectual property cases.',
      roles: ['Research Analyst', 'AI Specialist', 'Product Manager'],
      tone: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-background pt-16">
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

        {/* Animated dashboard preview */}
        <div className="mt-20 max-w-4xl mx-auto" ref={previewRef}>
          <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="h-8 bg-muted/50 border-b border-border flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">vaylance.com/dashboard</span>
            </div>

            {/* Job Radar header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Hidden Job Radar</p>
                  <p className="text-[11px] text-muted-foreground">Companies raising funding = hiring soon</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-muted/60 text-[11px] font-semibold text-foreground tabular-nums">My Alerts ({alertsCount})</span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground tabular-nums">All Signals ({signalsCount})</span>
              </div>
            </div>

            {/* Radar alert cards */}
            <div className="p-4 sm:p-6 space-y-3">
              {radarAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/60 text-left"
                  style={{
                    opacity: animating ? 1 : 0,
                    transform: animating ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.5s ease ${0.4 + index * 0.2}s, transform 0.5s ease ${0.4 + index * 0.2}s`,
                  }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${alert.tone}`}>
                    {alert.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{alert.company}</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{alert.round}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {alert.roles.map((role) => (
                        <span key={role} className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-[10px] font-medium text-foreground/80">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-primary tabular-nums leading-none">{matchScore}%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
