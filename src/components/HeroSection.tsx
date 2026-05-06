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

  const atsScore = useCountUp(94, 1400, animating);
  const applications = useCountUp(12, 1000, animating);
  const interviews = useCountUp(3, 800, animating);

  const trustItems = ['No credit card required', 'Cancel anytime', 'Free plan'];

  const dashboardStats = [
    { label: 'ATS Score', value: `${atsScore}%`, color: 'text-emerald-500' },
    { label: 'Applications', value: String(applications), color: 'text-primary' },
    { label: 'Interviews', value: String(interviews), color: 'text-amber-500' },
  ];

  const dashboardActivities = [
    'Resume tailored to Senior PM at Stripe',
    'Cover letter generated',
    'ATS score improved from 61% to 94%',
    'Interview prep session completed',
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

            <div className="p-6 grid grid-cols-3 gap-4">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <p className={`text-2xl font-black tabular-nums ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 grid grid-cols-2 gap-3">
              {dashboardActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/40"
                  style={{
                    opacity: animating ? 1 : 0,
                    transform: animating ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.4s ease ${0.6 + index * 0.15}s, transform 0.4s ease ${0.6 + index * 0.15}s`,
                  }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-muted-foreground">{activity}</span>
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
