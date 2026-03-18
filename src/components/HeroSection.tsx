import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

const HeroSection = () => {
  // Trust badges data
  const trustItems = [
    'No credit card required',
    'Cancel anytime',
    'Free for 14 days',
  ];

  // Dashboard preview stats
  const dashboardStats = [
    { label: 'ATS Score', value: '94%', color: 'text-emerald-500' },
    { label: 'Applications', value: '12', color: 'text-primary' },
    { label: 'Interviews', value: '3', color: 'text-amber-500' },
  ];

  // Dashboard preview activities
  const dashboardActivities = [
    'Resume tailored to Senior PM at Stripe',
    'Cover letter generated',
    'ATS score improved from 61% to 94%',
    'Interview prep session completed',
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-background pt-16">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Single subtle blue glow — top center only */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Platform Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          AI-powered job search platform
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
          Land your next job{' '}
          <span className="text-primary">faster</span>
          {' '}with AI
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Vaylance tailors your resume to pass ATS filters, preps you for interviews,
          and finds companies hiring before they post publicly — all in one place.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 font-semibold text-base gap-2 w-full sm:w-auto"
          >
            <Link to="/auth">
              Start free — 14 days
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 font-medium text-base w-full sm:w-auto"
          >
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          {trustItems.map((item, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              {item}
            </span>
          ))}
        </div>

        {/* Product Preview Dashboard */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="h-8 bg-muted/50 border-b border-border flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">
                vaylance.com/dashboard
              </span>
            </div>

            {/* Dashboard Stats Grid */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {dashboardStats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-muted/40 border border-border/60 text-center"
                >
                  <p className={`text-2xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Dashboard Activities */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-3">
              {dashboardActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/40"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    {activity}
                  </span>
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
