
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Sparkles, Zap, FileText, Brain, Shield, Target, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Brain, label: 'Smart Tools', desc: 'AI-assisted writing', color: 'from-blue-500 to-purple-500' },
    { icon: Target, label: 'ATS-Ready', desc: 'Pass tracking systems', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, label: 'Quick Setup', desc: 'Start in minutes', color: 'from-emerald-500 to-blue-500' },
    { icon: Shield, label: 'Private', desc: 'Your data stays yours', color: 'from-orange-500 to-red-500' }
  ];

  const metrics = [
    { icon: Users, value: '1,200+', label: 'Users', color: 'blue' },
    { icon: TrendingUp, value: '3,400', label: 'Resumes', color: 'emerald' },
    { icon: Award, value: '4.6★', label: 'Rating', color: 'purple' },
    { icon: Clock, value: '<5 min', label: 'Avg. Time', color: 'orange' }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Advanced animated background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-90"></div>
      
      {/* Dynamic gradient orbs following mouse */}
      <div 
        className="absolute w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x * 0.02}px`,
          top: `${mousePosition.y * 0.02}px`,
        }}
      ></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-400/20 via-blue-400/20 to-transparent dark:from-emerald-500/10 dark:via-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-blue-500/5 via-purple-500/5 to-transparent skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-32 pb-20">
        {/* Top floating cards */}
        <div className="absolute top-20 right-10 glass-card rounded-2xl p-4 animate-fade-in floating-card hidden lg:block" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">ATS Pass</div>
              <div className="text-xs text-muted-foreground">Optimized</div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 left-10 glass-card rounded-2xl p-3 animate-fade-in floating-card hidden lg:block" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <div className="text-xs font-semibold text-foreground">1,200+ reviews</div>
          </div>
        </div>

        {/* Main content - Asymmetric grid layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Left - Main hero content (spans 7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 animate-fade-in hover:scale-105 transition-transform cursor-default">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-foreground">4.6</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <span className="text-sm text-muted-foreground">from 1,200+ reviews</span>
            </div>

            {/* Main headline with advanced typography */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter animate-fade-in">
                <span className="block text-foreground drop-shadow-sm">Build resumes</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,0.4)]">
                  that work
                </span>
              </h1>
              
              {/* Decorative line */}
              <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              </div>
            </div>

            {/* Subtitle with better spacing */}
            <p className="text-lg md:text-xl leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-foreground/80">Create professional resumes in minutes. Optimized for applicant tracking systems and designed to get you interviews.</span>
            </p>

            {/* CTA buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" className="saas-button h-16 px-12 text-lg font-bold group relative overflow-hidden">
                <Link to="/auth" className="flex items-center">
                  <span className="relative z-10">Start Building Free</span>
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-card h-16 px-12 text-lg font-bold hover:scale-105 transition-all border-2">
                <Link to="#how-it-works" className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>ATS-friendly</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Export as PDF</span>
              </div>
            </div>
          </div>

          {/* Right - Bento grid features (spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {/* Feature cards in bento grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="card-3d glass-card-strong rounded-3xl p-6 group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1 text-base">{feature.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Large preview card */}
            <div className="card-3d glass-card-strong rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-gradient bg-[length:200%_200%]">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-foreground/20 to-foreground/5 rounded-lg w-32 mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/5 rounded-lg w-24"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-full w-full"></div>
                  <div className="h-2 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-full w-[85%]"></div>
                  <div className="h-2 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-full w-[60%]"></div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="h-8 flex-1 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-lg"></div>
                  <div className="h-8 flex-1 bg-gradient-to-r from-purple-500/20 to-purple-500/5 rounded-lg"></div>
                </div>
              </div>

              {/* AI Badge */}
              <div className="absolute -top-3 -right-3 saas-button px-4 py-2 rounded-xl text-xs font-bold shadow-2xl">
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  <span>AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom metrics bar - Full width bento style */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className="card-3d glass-card-strong rounded-2xl p-6 text-center group animate-fade-in"
                style={{ animationDelay: `${1 + index * 0.1}s` }}
              >
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-${metric.color}-400 to-${metric.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_auto] mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-2xl animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default HeroSection;
