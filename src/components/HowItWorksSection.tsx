
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
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-muted/30">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-2 mb-8 animate-fade-in font-semibold text-sm">
            <Zap className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Get hired in 3 simple steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Professional resume ready in under 5 minutes
          </p>
        </div>

        {/* Clean step cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div 
                key={index}
                className="relative glass-card-strong rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg font-black text-white text-xl">
                  {index + 1}
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="saas-button h-14 px-10 text-base font-bold group shadow-xl">
            <Link to="/auth" className="flex items-center">
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
