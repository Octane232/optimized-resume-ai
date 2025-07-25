
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Award, Clock, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const trustedCompanies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Netflix', 'Meta'
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Resumes Created' },
    { icon: Award, value: '95%', label: 'ATS Pass Rate' },
    { icon: Clock, value: '2 min', label: 'Average Build Time' }
  ];

  const benefits = [
    'AI-powered resume writing',
    'ATS-optimized templates',
    'Professional formatting',
    'Instant PDF download'
  ];

  const scrollToTemplates = () => {
    const element = document.querySelector('#templates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/15 to-primary/25 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-primary/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Professional Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full mb-12 animate-fade-in">
            <Sparkles className="h-5 w-5 text-primary animate-glow" />
            <span className="text-sm font-semibold text-foreground/80">Leading AI Resume Builder Platform</span>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          {/* Hero Headline */}
          <div className="mb-16 animate-fade-in">
            <h1 className="text-display mb-8 text-foreground">
              Craft Professional{' '}
              <span className="gradient-text">
                AI-Powered Resumes
              </span>{' '}
              That Get Results
            </h1>
            <p className="text-hero text-muted-foreground mb-12 max-w-4xl mx-auto">
              Transform your career with intelligent resume building technology. 
              Create ATS-optimized resumes that stand out and land interviews at top companies worldwide.
            </p>
          </div>

          {/* Premium CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              className="gradient-bg hover:scale-105 text-primary-foreground px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 group border-0"
            >
              Start Building Your Resume
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-12 py-6 text-lg font-semibold rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300 transform hover:scale-105"
            >
              View Sample Resumes
            </Button>
          </div>

          {/* Professional Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center glass-effect rounded-full px-6 py-3 hover:bg-card/80 transition-all duration-300 group">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground/80">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="floating-card bg-card/70 backdrop-blur-sm border border-border rounded-3xl p-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-5xl font-bold text-foreground mb-3">{stat.value}</div>
                    <div className="text-muted-foreground font-medium text-lg">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted Companies */}
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-muted-foreground mb-12 font-medium text-lg">
              Trusted by professionals at industry-leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
              {trustedCompanies.map((company, index) => (
                <div key={index} className="text-2xl font-bold text-muted-foreground/60 hover:text-foreground/80 transition-colors duration-300 cursor-default">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
