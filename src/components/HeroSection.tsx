
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            AI-Powered Career Platform
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your Resume,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Land Your Dream Job
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-navy-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create professional resumes with AI assistance, then let our platform automatically search and apply to jobs that match your profile. All in one seamless experience.
          </p>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <h3 className="font-semibold mb-1">AI Resume Builder</h3>
              <p className="text-sm text-navy-200">Smart suggestions and ATS optimization</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎯</span>
              </div>
              <h3 className="font-semibold mb-1">Job Matching</h3>
              <p className="text-sm text-navy-200">Find jobs that fit your skills perfectly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
              <h3 className="font-semibold mb-1">Auto Apply</h3>
              <p className="text-sm text-navy-200">Apply to multiple jobs automatically</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Build My Resume + Find Jobs
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900 px-8 py-4 text-lg">
              See How It Works
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="text-center">
            <p className="text-navy-300 mb-4">Trusted by professionals at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="text-lg font-semibold">Google</span>
              <span className="text-lg font-semibold">Microsoft</span>
              <span className="text-lg font-semibold">Apple</span>
              <span className="text-lg font-semibold">Amazon</span>
              <span className="text-lg font-semibold">Meta</span>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-6 h-6 text-navy-300" />
          </div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
