
import React from 'react';
import { Upload, Bot, Download, Zap, CheckCircle, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Template',
      description: 'Select from our collection of professional, industry-specific templates designed by experts.',
      icon: FileText,
      color: 'from-blue-500 via-blue-600 to-purple-600'
    },
    {
      number: '02', 
      title: 'AI Generates Content',
      description: 'Our AI analyzes your information and generates optimized content tailored to your target role.',
      icon: Sparkles,
      color: 'from-purple-500 via-pink-600 to-purple-600'
    },
    {
      number: '03',
      title: 'Customize & Download',
      description: 'Make final adjustments, preview your resume, and download in multiple formats instantly.',
      icon: Download,
      color: 'from-emerald-500 via-blue-600 to-emerald-600'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-background">
      {/* Diagonal background sections */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent skew-y-3 transform origin-top-left"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-emerald-500/5 via-blue-500/5 to-transparent -skew-y-3 transform origin-bottom-right"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-8 py-4 mb-10 animate-fade-in hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
            <span className="text-base font-bold gradient-text bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Simple 3-Step Process
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.95] tracking-tighter animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground/40 text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide">How It Works</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,0.5)]">
              Create in Minutes
            </span>
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground/80">From blank page to professional resume in </span><span className="font-bold text-foreground">under 3 minutes</span>
          </p>
        </div>

        {/* Asymmetric stepped layout */}
        <div className="max-w-7xl mx-auto space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center animate-fade-in ${isEven ? '' : 'lg:grid-flow-dense'}`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                {/* Content side */}
                <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}>
                  <div className="inline-flex items-center gap-4 glass-card rounded-2xl px-6 py-3">
                    <div className="text-4xl font-black gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient">
                      {step.number}
                    </div>
                    <div className="h-8 w-px bg-border"></div>
                    <div className="text-sm font-bold text-muted-foreground">STEP {index + 1}</div>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black text-foreground leading-tight drop-shadow-sm">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg md:text-xl leading-relaxed text-foreground/80 font-medium">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-foreground">Fast</span>
                    </div>
                    <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-foreground">Easy</span>
                    </div>
                    <div className="flex items-center gap-2 glass-card rounded-full px-4 py-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-foreground">Professional</span>
                    </div>
                  </div>
                </div>

                {/* Visual side */}
                <div className={`relative ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                  <div className="card-3d glass-card-strong rounded-3xl p-12 relative group">
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    {/* Large icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      <div className={`w-48 h-48 bg-gradient-to-br ${step.color} rounded-[3rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-24 h-24 text-white" />
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className={`absolute top-6 right-6 w-24 h-24 bg-gradient-to-br ${step.color} opacity-20 rounded-3xl blur-2xl`}></div>
                    <div className={`absolute bottom-6 left-6 w-32 h-32 bg-gradient-to-br ${step.color} opacity-20 rounded-3xl blur-2xl`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Button asChild size="lg" className="saas-button h-16 px-12 text-lg font-bold group">
            <Link to="/auth" className="flex items-center">
              Start Creating Now
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
