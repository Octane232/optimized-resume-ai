
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
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in just three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-navy-200 to-navy-300 transform translate-x-1/2"></div>
              )}
              
              <div className="relative z-10 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-500 to-navy-600 text-white rounded-full font-bold text-lg mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-navy-50 rounded-lg group-hover:bg-navy-100 transition-colors duration-300">
                    <step.icon className="h-8 w-8 text-navy-600" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
