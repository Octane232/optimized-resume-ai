
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Brain, Shield, Zap, Users, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BenefitsSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create professional resumes in minutes with our AI-powered platform',
      color: 'from-yellow-500 to-orange-500',
      delay: '0.1s'
    },
    {
      icon: Target,
      title: 'ATS Optimized',
      description: 'Get past automated screening with ATS-friendly resume formats',
      color: 'from-blue-500 to-cyan-500',
      delay: '0.2s'
    },
    {
      icon: Users,
      title: 'Expert Templates',
      description: 'Choose from templates designed by hiring professionals',
      color: 'from-purple-500 to-pink-500',
      delay: '0.3s'
    },
    {
      icon: TrendingUp,
      title: 'Career Boost',
      description: 'Increase your interview chances with data-driven improvements',
      color: 'from-emerald-500 to-teal-500',
      delay: '0.4s'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'from-red-500 to-orange-500',
      delay: '0.5s'
    },
    {
      icon: FileText,
      title: 'Multiple Formats',
      description: 'Download in PDF, Word, or plain text format instantly',
      color: 'from-indigo-500 to-purple-500',
      delay: '0.6s'
    }
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden bg-background">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-2 mb-8 animate-fade-in font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            All Features Included
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Everything you need to succeed
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Professional tools designed to get you hired faster
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-card-strong rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="glass-card-strong rounded-3xl p-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Ready to land your dream job?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join 1,200+ professionals who've already upgraded their resumes
            </p>
            <Button asChild size="lg" className="saas-button h-14 px-10 text-base font-bold group shadow-xl">
              <Link to="/auth" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
