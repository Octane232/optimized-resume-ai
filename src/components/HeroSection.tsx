
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10 pt-16">
        <div className="max-w-5xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium mb-8 text-blue-700">
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            Trusted by 50,000+ professionals worldwide
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            AI-Powered Career
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Acceleration Platform
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Build ATS-optimized resumes with AI, get matched to perfect jobs, and let our platform 
            automatically apply to positions while you focus on interview preparation.
          </p>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3x</div>
              <p className="text-gray-600 text-sm">More Interview Invites</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
              <p className="text-gray-600 text-sm">Faster Job Placement</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600 text-sm">Automated Job Search</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">AI</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Smart Resume Builder</h3>
              <p className="text-xs text-gray-600">ATS-optimized templates</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Job Matching</h3>
              <p className="text-xs text-gray-600">Perfect role discovery</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">⚡</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Auto Apply</h3>
              <p className="text-xs text-gray-600">Hands-free applications</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">📊</span>
              </div>
              <h3 className="font-semibold mb-1 text-gray-900">Analytics</h3>
              <p className="text-xs text-gray-600">Track your progress</p>
            </div>
          </div>
          
          {/* Enterprise Logos */}
          <div className="text-center">
            <p className="text-gray-500 mb-6 text-sm font-medium uppercase tracking-wider">Professionals from top companies trust us</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company) => (
                <span key={company} className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors cursor-pointer">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
