
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, TrendingUp, Sparkles, Zap, FileText, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const stats = [
    { number: '250K+', label: 'Resumes Created' },
    { number: '95%', label: 'Success Rate' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  const features = [
    'AI-powered content generation',
    'Professional templates',
    'ATS optimization',
    'One-click customization'
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Premium gradient mesh background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-80"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/20 to-emerald-400/20 dark:from-purple-500/10 dark:to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Trusted by 250,000+ professionals worldwide
                </span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight animate-fade-in">
              <span className="block text-foreground">Your career</span>
              <span className="block gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient">
                starts here
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Create professional, ATS-optimized resumes with AI in minutes. Land more interviews and get hired faster with cutting-edge technology.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-semibold group">
                <Link to="/auth" className="flex items-center">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass-card h-14 px-10 text-lg font-semibold hover:border-primary/50 transition-all">
                <Link to="#how-it-works" className="flex items-center">
                  See how it works
                </Link>
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm md:text-base text-muted-foreground group">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative glass-card-strong rounded-3xl p-10 floating-card group hover:scale-[1.02] transition-transform duration-500">
              {/* Resume Preview Mock */}
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl animate-gradient bg-[length:200%_200%]">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-5 bg-gradient-to-r from-foreground/20 to-foreground/10 rounded-lg w-40 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded-lg w-32 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-lg w-[90%] animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-4 bg-gradient-to-r from-foreground/15 to-foreground/5 rounded-lg w-[70%] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-4">
                  <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="h-4 bg-blue-400/30 rounded-lg w-full"></div>
                    <div className="h-3 bg-blue-300/20 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-blue-300/20 rounded-lg w-1/2"></div>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                    <div className="h-4 bg-purple-400/30 rounded-lg w-full"></div>
                    <div className="h-3 bg-purple-300/20 rounded-lg w-2/3"></div>
                    <div className="h-3 bg-purple-300/20 rounded-lg w-3/4"></div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute -top-6 -right-6 saas-button px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl animate-pulse">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-br-3xl"></div>
            </div>

            {/* Floating elements with animation */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-lg opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <div className="text-5xl md:text-6xl font-extrabold mb-3 gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient">
                  {stat.number}
                </div>
                <div className="text-base md:text-lg text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
