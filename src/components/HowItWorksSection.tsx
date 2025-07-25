
import React from 'react';
import { Upload, Bot, Download } from 'lucide-react';

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
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create a professional resume in just three simple steps with our intelligent AI platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Enhanced Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/50 transform translate-x-1/2 rounded-full"></div>
              )}
              
              <div className="relative z-10 animate-fade-in floating-card bg-card rounded-3xl p-8 border border-border" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Premium Step Number */}
                <div className="inline-flex items-center justify-center w-20 h-20 gradient-bg text-primary-foreground rounded-2xl font-bold text-xl mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Enhanced Icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors duration-300 border border-border">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                </div>

                {/* Premium Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
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
