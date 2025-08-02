
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const socialProof = [
    { metric: '250K+', label: 'Active Users' },
    { metric: '99.9%', label: 'Uptime' },
    { metric: '4.8/5', label: 'User Rating' }
  ];

  const features = [
    'AI-powered optimization',
    'ATS-friendly templates',
    'One-click customization',
    'Export to PDF/Word'
  ];

  const resumeTemplates = [
    'Modern Creative',
    'Professional Classic', 
    'Tech Minimalist',
    'Executive Bold',
    'Student Friendly',
    'Creative Portfolio'
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:to-gray-900 pt-24 pb-16 overflow-hidden">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--blue-500)/0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--purple-500)/0.08)_0%,transparent_50%)]"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border border-blue-200/50 dark:border-gray-800 rounded-full px-5 py-2 mb-8 shadow-soft fade-in-up">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Join 250,000+ job seekers
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 fade-in-up stagger-1 text-balance leading-tight">
            Create your perfect resume in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed fade-in-up stagger-2 text-balance">
            AI-powered resume builder with professional templates. Stand out from the crowd and land your dream job faster.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in-up stagger-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 px-8 text-base font-medium shadow-glow">
              <Link to="/auth">
                Start building for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Link to="#templates">
                Browse templates
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 fade-in-up stagger-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Template showcase */}
        <div className="max-w-6xl mx-auto mb-20 fade-in-up stagger-4" id="templates">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Professional Templates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose from our collection of ATS-optimized designs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resumeTemplates.map((template, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-card transition-all duration-300 hover:scale-105">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{template}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof metrics */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {socialProof.map((item, index) => (
              <div key={index} className="text-center fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.metric}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <div className="text-center fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200/50 dark:border-gray-700/50 shadow-card">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Why choose our resume builder?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">3x more interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Built in 5 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Used by 250k+ users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
