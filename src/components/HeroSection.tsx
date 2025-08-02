
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, TrendingUp, Sparkles, Zap, FileText, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const stats = [
    { number: '250K+', label: 'Resumes Created' },
    { number: '95%', label: 'Success Rate' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  const features = [
    'AI-powered content generation',
    'Professional templates',
    'ATS optimization',
    'One-click customization'
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:to-gray-900 flex items-center overflow-hidden">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--blue-500)/0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--purple-500)/0.08)_0%,transparent_50%)]"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border border-blue-200/50 dark:border-gray-800 rounded-full px-5 py-2 mb-8 shadow-soft">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trusted by 250,000+ professionals
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your career
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                starts here
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
              Create professional, ATS-optimized resumes with AI in minutes. Land more interviews and get hired faster.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-14 px-8 text-lg font-medium shadow-glow">
                <Link to="/auth">
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link to="#how-it-works">
                  See how it works
                </Link>
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-card">
              {/* Resume Preview Mock */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-purple-200 dark:bg-purple-800 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-Generated
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 pt-12 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
