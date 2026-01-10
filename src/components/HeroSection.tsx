import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Target, Shield, Sparkles, Brain, Zap, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import SoraChatPreview from './SoraChatPreview';

const HeroSection = () => {
  const aiCapabilities = [
    { 
      icon: FileSearch, 
      label: 'Resume Analysis', 
      desc: 'Instant ATS scoring & optimization',
      color: 'from-primary to-blue-400'
    },
    { 
      icon: Target, 
      label: 'Job Matching', 
      desc: 'Find your perfect role fit',
      color: 'from-emerald-500 to-teal-400'
    },
    { 
      icon: Brain, 
      label: 'Smart Suggestions', 
      desc: 'AI-powered improvements',
      color: 'from-purple-500 to-pink-400'
    },
    { 
      icon: Zap, 
      label: 'Instant Help', 
      desc: '24/7 career guidance',
      color: 'from-amber-500 to-orange-400'
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Advanced animated background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-90"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-primary/15 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none -left-40 -top-40 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/10 via-primary/15 to-transparent rounded-full blur-3xl"></div>
      
      {/* Grid overlay for command center feel */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-32 pb-20">
        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left - Main hero content (spans 7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 command-card rounded-full px-4 py-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Meet Your AI Career Assistant</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter animate-fade-in">
                <span className="block text-foreground">Hi, I'm</span>
                <span className="block gradient-text">Sora</span>
              </h1>
              
              {/* Decorative element */}
              <div className="flex items-center gap-3 animate-fade-in stagger-1">
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-primary">Your AI Career Co-Pilot</span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl leading-relaxed max-w-xl text-muted-foreground animate-fade-in stagger-2">
              I analyze your resume, find perfect job matches, identify skill gaps, and guide you through every application. 
              Think of me as your personal career coach—available 24/7.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-3">
              <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-bold group relative overflow-hidden">
                <Link to="/auth" className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  <span>Chat with Sora</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold border-2 hover:bg-secondary/50">
                <Link to="#how-it-works" className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  See Sora in Action
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground animate-fade-in stagger-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Private & secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Instant AI responses</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span>Personalized guidance</span>
              </div>
            </div>
          </div>

          {/* Right - Sora Chat Preview (spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Sora Chat Preview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <SoraChatPreview />
            </div>

            {/* AI Capabilities Grid */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              {aiCapabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <div 
                    key={index}
                    className="command-card p-4 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${capability.color} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground mb-0.5">{capability.label}</h3>
                    <p className="text-xs text-muted-foreground">{capability.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
