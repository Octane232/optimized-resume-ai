
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Target, Brain, Shield, Briefcase, FileSearch, Database, Kanban } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const features = [
    { 
      icon: FileSearch, 
      label: 'Resume Engine', 
      desc: 'AI-powered resume analysis & optimization',
      color: 'from-electric to-blue-400'
    },
    { 
      icon: Database, 
      label: 'The Vault', 
      desc: 'Your career foundation & assets',
      color: 'from-emerald-500 to-teal-400'
    },
    { 
      icon: Kanban, 
      label: 'Mission Control', 
      desc: 'Track every application',
      color: 'from-amber-500 to-orange-400'
    },
    { 
      icon: Brain, 
      label: 'AI Briefing', 
      desc: 'Daily career intelligence',
      color: 'from-purple-500 to-pink-400'
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Advanced animated background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-90"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-electric/15 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none -left-40 -top-40 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/10 via-electric/15 to-transparent rounded-full blur-3xl"></div>
      
      {/* Grid overlay for command center feel */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-32 pb-20">
        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left - Main hero content (spans 7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 command-card rounded-full px-4 py-2 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">Your Career Command Center</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter animate-fade-in">
                <span className="block text-foreground">Take Control of</span>
                <span className="block gradient-text">Your Career</span>
              </h1>
              
              {/* Decorative element */}
              <div className="flex items-center gap-3 animate-fade-in stagger-1">
                <div className="h-1 w-16 bg-gradient-to-r from-electric to-blue-400 rounded-full"></div>
                <Target className="w-5 h-5 text-electric" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl leading-relaxed max-w-xl text-muted-foreground animate-fade-in stagger-2">
              Pitchsora is your AI-powered career intelligence platform. Upload your resume, paste job descriptions, 
              and get instant match analysis, keyword gaps, and ATS optimization—all in one focused command center.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in stagger-3">
              <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-bold group relative overflow-hidden">
                <Link to="/auth" className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  <span>Upload Your Resume</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold border-2 hover:bg-secondary/50">
                <Link to="#how-it-works" className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-electric" />
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground animate-fade-in stagger-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Your data stays private</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-electric" />
                <span>ATS-optimized results</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>Track all applications</span>
              </div>
            </div>
          </div>

          {/* Right - Feature grid (spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Feature cards in grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="command-card p-6 group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{feature.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Command Center Preview Card */}
            <div className="command-card p-6 relative overflow-hidden group animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-electric/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground">Resume Match Score</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                    <span>Ready</span>
                  </div>
                </div>
                
                {/* Score visualization */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${0.85 * 226} 226`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-foreground">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Keywords</span>
                      <span className="text-emerald-500 font-medium">12/14</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">ATS Ready</span>
                      <span className="text-electric font-medium">Yes</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Improvements</span>
                      <span className="text-amber-500 font-medium">3 found</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
