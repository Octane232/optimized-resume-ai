
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Brain, Shield, Zap, Users } from 'lucide-react';

const BenefitsSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Content',
      description: 'Generate professional, tailored content that matches your industry and experience level.',
      category: 'Core Features'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with built-in optimization.',
      category: 'Core Features'
    },
    {
      icon: Clock,
      title: 'Built in Minutes',
      description: 'Create professional resumes quickly with our streamlined, intuitive interface.',
      category: 'Efficiency'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track resume performance with detailed insights and optimization recommendations.',
      category: 'Analytics'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and SOC 2 compliance to keep your data secure.',
      category: 'Security'
    },
    {
      icon: Zap,
      title: 'Real-time Collaboration',
      description: 'Share and collaborate on resumes with mentors, career coaches, or colleagues.',
      category: 'Collaboration'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Features
          </div>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-6 text-balance">
            Everything you need to build outstanding resumes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance">
            Professional-grade tools and AI-powered features designed to help you land your dream job
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="enterprise-card p-8 group fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                {feature.category}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">250,000+</span> professionals trust our platform
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
