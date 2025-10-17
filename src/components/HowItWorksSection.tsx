
import React from 'react';
import { Upload, Bot, Download, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Enter Your Details',
      description: 'Upload your old resume or enter your information manually. Our AI will analyze your experience.',
      number: '01'
    },
    {
      icon: Bot,
      title: 'AI Generates Your Resume',
      description: 'Our advanced AI creates a tailored resume optimized for your target job title and industry.',
      number: '02'
    },
    {
      icon: Download,
      title: 'Download & Apply',
      description: 'Download your professional resume, make final edits, and start applying to your dream jobs.',
      number: '03'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Simple Process</span>
          </div>
          <h2 className="heading-lg text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create a professional resume in just three simple steps with our intelligent AI platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Premium Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-1/2 w-full h-0.5">
                  <div className="h-full w-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-gradient opacity-30"></div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
              )}
              
              <div className="relative z-10 animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                {/* Premium Step Number */}
                <div className="inline-flex items-center justify-center w-24 h-24 saas-button rounded-3xl font-extrabold text-2xl mb-10 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  {step.number}
                </div>

                {/* Enhanced Icon Container */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative glass-card p-8 rounded-2xl group-hover:scale-105 transition-all duration-300">
                      <step.icon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Premium Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:gradient-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
