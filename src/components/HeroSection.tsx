
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Resume Builder Platform</span>
          </div>

          {/* Main Headline */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[0.9] tracking-tight">
              Create Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                AI Resumes
              </span>{' '}
              in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Build professional, ATS-optimized resumes with our advanced AI technology. 
              <br className="hidden md:block" />
              Join thousands of professionals who landed their dream jobs.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group border-0">
              Build My Resume
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToTemplates}
              className="px-10 py-6 text-lg font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
            >
              View Templates
            </Button>
          </div>

          {/* Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-5 py-3 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 group">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted Companies */}
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
              Trusted by professionals at top companies worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {trustedCompanies.map((company, index) => (
                <div key={index} className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300 cursor-default">
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
