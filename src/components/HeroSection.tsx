
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Award, Clock, Star, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const stats = [
    { icon: Users, value: '100K+', label: 'Resumes Created', color: 'text-violet-500' },
    { icon: Award, value: '98%', label: 'ATS Pass Rate', color: 'text-emerald-500' },
    { icon: Clock, value: '60s', label: 'Average Build Time', color: 'text-amber-500' }
  ];

  const features = [
    { icon: Zap, text: 'AI-Powered Writing' },
    { icon: Target, text: 'ATS Optimized' },
    { icon: Award, text: 'Professional Templates' },
    { icon: Star, text: 'Industry Approved' }
  ];

  const trustedCompanies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0">
        <div className="mesh-gradient absolute inset-0"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">
        <div className="text-center max-w-7xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 glass-morphism rounded-full mb-16 animate-reveal">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-6 w-6 text-primary opacity-20" />
              </div>
            </div>
            <span className="text-lg font-semibold text-foreground">
              #1 AI Resume Builder Platform
            </span>
            <div className="h-3 w-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Hero Headline */}
          <div className="mb-20 animate-reveal" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-display mb-10 text-balance">
              Transform Your Career with{' '}
              <span className="relative">
                <span className="gradient-text">AI-Powered</span>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl"></div>
              </span>{' '}
              Resume Intelligence
            </h1>
            <p className="text-hero text-muted-foreground mb-16 max-w-5xl mx-auto text-balance">
              Join over 100,000 professionals who've landed their dream jobs with our cutting-edge AI resume builder. 
              Create ATS-optimized, visually stunning resumes that get you noticed by top employers worldwide.
            </p>
          </div>

          {/* Enhanced CTA Section */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-24 animate-reveal" style={{ animationDelay: '0.4s' }}>
            <Button 
              asChild
              size="lg" 
              className="group gradient-bg magnetic-button px-16 py-8 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl border-0 relative overflow-hidden"
            >
              <Link to="/auth">
                <span className="relative z-10 flex items-center">
                  Build My Resume Now
                  <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="px-16 py-8 text-xl font-bold rounded-2xl border-2 glass-morphism hover:bg-primary/5 transition-all duration-300 magnetic-button"
            >
              <Link to="#features">
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 animate-reveal" style={{ animationDelay: '0.6s' }}>
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 hover:bg-primary/5 transition-all duration-300 group interactive-card">
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Advanced Stats Section */}
          <div className="bento-grid max-w-6xl mx-auto mb-24 animate-reveal" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="bento-card glass-morphism group">
                <div className="flex flex-col items-center text-center h-full justify-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-primary/20 to-primary/10`}>
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                  <div className="text-6xl font-black text-foreground mb-4">{stat.value}</div>
                  <div className="text-muted-foreground font-semibold text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Section */}
          <div className="animate-reveal" style={{ animationDelay: '1s' }}>
            <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
              <p className="text-muted-foreground mb-8 font-semibold text-xl">
                Trusted by professionals at world-class companies
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
                {trustedCompanies.map((company, index) => (
                  <div 
                    key={index} 
                    className="text-3xl font-bold text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 cursor-default hover:scale-110"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
