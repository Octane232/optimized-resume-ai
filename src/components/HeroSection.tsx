
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
      {/* Modern gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--blue-100))_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--blue-900)/0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--purple-100))_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_bottom_left,hsl(var(--purple-900)/0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,hsl(var(--background))_100%)]"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-24 pb-20">
        {/* Social proof badges */}
        <div className="absolute top-10 right-10 glass-card-strong rounded-2xl p-4 animate-fade-in hidden xl:block shadow-xl" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">ATS Optimized</div>
              <div className="text-xs text-muted-foreground">98% Pass Rate</div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 left-10 glass-card-strong rounded-2xl px-4 py-3 animate-fade-in hidden xl:block shadow-lg" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <div className="ml-1 text-xs font-bold text-foreground">4.9/5</div>
          </div>
        </div>

        {/* Main content - Clean centered layout */}
        <div className="max-w-6xl mx-auto text-center space-y-12 pt-16 pb-24">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 glass-card-strong rounded-full px-6 py-3 animate-fade-in hover:scale-105 transition-transform cursor-default shadow-lg">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-sm font-bold text-foreground ml-1">4.9/5</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <span className="text-sm font-semibold text-muted-foreground">1,200+ professionals trust us</span>
          </div>

          {/* Main headline */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
              <span className="block text-foreground mb-4">AI-Powered Resume</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Builder for Winners
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Create ATS-optimized resumes in minutes. Track applications, analyze gaps, and practice interviews—all in one platform.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="saas-button h-14 px-10 text-base font-bold group shadow-xl">
              <Link to="/auth" className="flex items-center">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-base font-semibold border-2 hover:bg-muted/50">
              <Link to="#features" className="flex items-center">
                See Features
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">ATS-optimized</span>
            </div>
          </div>

          {/* Feature showcase */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="glass-card-strong rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1">{feature.label}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
