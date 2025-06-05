
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Award, Clock } from 'lucide-react';

const HeroSection = () => {
  const trustedCompanies = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Netflix', 'Meta'
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Clock, value: '2 min', label: 'Average Time' }
  ];

  const benefits = [
    'AI-powered resume optimization',
    'ATS-friendly templates',
    'Job-specific customization',
    'Real-time feedback'
  ];

  const scrollToTemplates = () => {
    const element = document.querySelector('#templates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Land Your{' '}
              <span className="gradient-text">
                Dream Job
              </span>{' '}
              with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-optimized resumes in minutes. Our AI analyzes job descriptions and tailors your resume for maximum impact.
            </p>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              Start Your 7-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToTemplates}
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
            >
              View Templates
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trusted Companies */}
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Trusted by professionals at top companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 dark:opacity-50">
              {trustedCompanies.map((company, index) => (
                <div key={index} className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
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
