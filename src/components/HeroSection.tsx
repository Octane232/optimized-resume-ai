
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
    'Enterprise-grade security',
    'Real-time collaboration',
    'Advanced analytics',
    'API integrations'
  ];

  const trustedBy = [
    'Google', 'Microsoft', 'Stripe', 'Notion', 'Linear', 'Figma'
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-24 pb-12 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 mb-8 shadow-sm fade-in-up">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trusted by 250,000+ professionals
            </span>
          </div>

          {/* Main headline */}
          <h1 className="heading-xl text-gray-900 dark:text-white mb-6 fade-in-up stagger-1 text-balance">
            Build resumes that land interviews at{' '}
            <span className="text-blue-600 dark:text-blue-400">top companies</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed fade-in-up stagger-2 text-balance">
            Our AI-powered platform helps professionals create ATS-optimized resumes that get noticed. 
            Join thousands who've accelerated their careers.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in-up stagger-3">
            <Button asChild size="lg" className="saas-button h-12 px-8 text-base font-medium">
              <Link to="/auth">
                Start building for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-gray-300 dark:border-gray-700">
              <Link to="#demo">
                View live demo
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 fade-in-up stagger-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Product showcase */}
        <div className="max-w-5xl mx-auto mb-20 fade-in-up stagger-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Resume Builder Interface</p>
                </div>
              </div>
            </div>
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

        {/* Trusted by section */}
        <div className="text-center fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 font-medium">
            Trusted by professionals at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {trustedBy.map((company, index) => (
              <div key={index} className="text-lg font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
