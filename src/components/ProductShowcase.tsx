import React from 'react';
import { Play, CheckCircle2, BarChart3, FileSearch, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductShowcase = () => {
  const features = [
    {
      icon: FileSearch,
      title: 'Resume Engine',
      description: 'AI-powered resume analysis with real-time ATS scoring and optimization suggestions.',
      color: 'from-primary to-blue-400',
      stats: '92% ATS Score'
    },
    {
      icon: Briefcase,
      title: 'Job Finder',
      description: 'Smart job matching that finds opportunities aligned with your skills and goals.',
      color: 'from-emerald-500 to-teal-400',
      stats: '500+ Jobs/day'
    },
    {
      icon: BarChart3,
      title: 'The Vault',
      description: 'Your career command center with skills tracking, achievements, and insights.',
      color: 'from-purple-500 to-pink-400',
      stats: 'Career Growth'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">See PitchVaya in Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">Everything You Need to</span>
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A complete career platform with AI-powered tools designed to get you hired faster
          </p>
        </div>

        {/* Product Screenshots/Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="command-card rounded-3xl p-8 group animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Mock Dashboard Preview */}
                <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/50 to-muted/30 aspect-video flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  {/* Stats badge */}
                  <div className="absolute bottom-3 right-3 glass-card px-3 py-1.5 rounded-full">
                    <span className="text-xs font-bold text-primary">{feature.stats}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Included in all plans</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Play className="w-5 h-5 text-primary fill-primary" />
              </div>
              Watch Demo (2 min)
            </Button>
            <span className="text-muted-foreground">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
