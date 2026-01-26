import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Briefcase, FileText, Target, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import VayaChatPreview from './VayaChatPreview';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
      
      {/* Floating orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none opacity-50"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-28 pb-16">
        {/* Centered Introduction */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 animate-fade-in">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Your Complete Career Platform</span>
          </div>

          {/* Main headline */}
          <div className="space-y-4 animate-fade-in stagger-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">Land Your Dream Job</span>
              <br />
              <span className="gradient-text">Faster & Smarter</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in stagger-2">
            Build ATS-optimized resumes, discover matching jobs, track applications, 
            and get AI-powered coaching — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3">
            <Button asChild size="lg" className="saas-button h-14 px-8 text-lg font-bold">
              <Link to="/auth" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold"
              onClick={() => {
                const element = document.getElementById('how-it-works');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground animate-fade-in stagger-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Free plan available • No credit card needed</span>
          </div>
        </div>

        {/* Features Grid + Chat Preview */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Left - Core Features */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Everything you need to succeed
              </h2>
              
              <div className="grid gap-3">
                {[
                  { 
                    icon: FileText,
                    title: "Resume Builder", 
                    desc: "Professional templates with real-time ATS scoring",
                    badge: null
                  },
                  { 
                    icon: Target,
                    title: "Job Scout", 
                    desc: "Discover jobs matched to your skills and experience",
                    badge: null
                  },
                  { 
                    icon: TrendingUp,
                    title: "Application Tracker", 
                    desc: "Keep track of every application in one dashboard",
                    badge: null
                  },
                  { 
                    icon: Sparkles,
                    title: "AI Resume Optimizer", 
                    desc: "Get instant suggestions to improve your match rate",
                    badge: "AI"
                  },
                  { 
                    icon: Users,
                    title: "Interview Coach", 
                    desc: "Practice with AI feedback on your answers",
                    badge: "AI"
                  },
                  { 
                    icon: Award,
                    title: "Skill Gap Analysis", 
                    desc: "See what skills you need for your target role",
                    badge: "AI"
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="command-card p-4 flex items-start gap-4 group hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-primary to-purple-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - AI Assistant Preview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Meet Vaylance AI, your career assistant
                </h2>
              </div>
              <VayaChatPreview />
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Get instant help optimizing resumes, writing cover letters, and preparing for interviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
