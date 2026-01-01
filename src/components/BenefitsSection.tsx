
import React from 'react';
import { Brain, Target, Shield, Zap, BarChart3, Clock, FileSearch, Database, Kanban, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant, intelligent feedback on how well your resume matches any job description.',
      color: 'from-electric to-blue-400'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes automated tracking systems with our keyword analysis.',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      icon: BarChart3,
      title: 'Match Scoring',
      description: 'See your exact match percentage and identify gaps before you apply.',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Clock,
      title: 'Save Hours',
      description: 'Stop guessing. Get actionable insights in seconds, not hours of manual comparison.',
      color: 'from-amber-500 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your career data stays yours. We never share or sell your information.',
      color: 'from-red-500 to-rose-400'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Paste a job description and get comprehensive analysis in under 5 seconds.',
      color: 'from-cyan-500 to-blue-400'
    }
  ];

  const commandCenterFeatures = [
    {
      icon: FileSearch,
      title: 'Resume Engine',
      description: 'Analyze, optimize, and tailor your resume for every opportunity',
      stats: 'ATS Score + Keyword Gaps'
    },
    {
      icon: Database,
      title: 'The Vault',
      description: 'Your career foundation with skills, certifications, and projects',
      stats: 'Completeness Tracking'
    },
    {
      icon: Kanban,
      title: 'Mission Control',
      description: 'Track every application from applied to hired',
      stats: 'Kanban + Reminders'
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Why Pitchsora
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Career 
            <span className="gradient-text"> Command Center</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop applying blindly. Pitchsora gives you the intelligence to make every application count.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="command-card p-6 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Command Center Features */}
        <div className="command-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-electric/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Three Powerful Modules
              </h3>
              <p className="text-muted-foreground">
                Everything you need to take control of your job search
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {commandCenterFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-6 rounded-2xl bg-background/50 border border-border hover:border-primary/30 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-electric to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {feature.stats}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-bold">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
