
import React from 'react';
import { Shield, Palette, Zap, FileText } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'ATS-Optimized',
      description: 'Beat applicant tracking systems with optimized formatting and keyword placement.'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from expertly designed templates that impress hiring managers.'
    },
    {
      icon: Zap,
      title: 'Fast & Easy Editing',
      description: 'Make changes in real-time with our intuitive editor and AI suggestions.'
    },
    {
      icon: FileText,
      title: 'Cover Letter Generator',
      description: 'Generate matching cover letters automatically - completely free!'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose AI Resume Pro?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get ahead of the competition with these powerful features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-navy-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
