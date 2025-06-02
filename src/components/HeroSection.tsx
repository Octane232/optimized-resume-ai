
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-navy-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build Your Perfect Resume in{' '}
              <span className="gradient-text">Minutes with AI</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Use AI to generate job-winning resumes customized for your dream role. 
              Stand out from the competition with ATS-optimized, professionally designed resumes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="gradient-bg hover:opacity-90 transition-opacity text-lg px-8 py-4">
                Try It Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500 self-center">
                No credit card required
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>ATS-Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Professional Templates</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-scale-in">
            <div className="bg-white rounded-lg shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-navy-50 to-white p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="h-4 bg-navy-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  
                  <div className="pt-4">
                    <div className="h-3 bg-navy-300 rounded w-1/2 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="h-3 bg-navy-300 rounded w-1/3 mb-2"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-navy-500 to-navy-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                AI Generated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
