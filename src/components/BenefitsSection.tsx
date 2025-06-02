
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: '🤖',
      title: 'AI-Powered Resume Optimization',
      description: 'Our AI analyzes job descriptions and optimizes your resume for maximum ATS compatibility and recruiter appeal.',
      badge: 'Smart Tech'
    },
    {
      icon: '🎯',
      title: 'Automatic Job Search & Matching',
      description: 'We continuously search job boards and company websites to find opportunities that perfectly match your skills and preferences.',
      badge: 'Job Search'
    },
    {
      icon: '⚡',
      title: 'One-Click Applications',
      description: 'Apply to multiple relevant positions with a single click. Our system handles the application process while you focus on preparing.',
      badge: 'Auto Apply'
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Track your application success rates, interview invitations, and optimize your job search strategy with detailed insights.',
      badge: 'Analytics'
    },
    {
      icon: '🎨',
      title: '50+ Professional Templates',
      description: 'Choose from industry-specific templates designed by career experts and loved by hiring managers worldwide.',
      badge: 'Templates'
    },
    {
      icon: '💼',
      title: 'Career Coaching & Tips',
      description: 'Get personalized interview preparation, salary negotiation tips, and career advancement strategies from our AI coach.',
      badge: 'Coaching'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Why Choose Our Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            More Than Just a Resume Builder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're your complete career partner - from crafting the perfect resume to landing your dream job. 
            Our AI-powered platform handles the entire job search process for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <Badge className="mb-4 bg-navy-100 text-navy-800 hover:bg-navy-100">
                    {benefit.badge}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Search Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-navy-600 to-navy-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
                🚀 Job Search Engine
              </Badge>
              <h3 className="text-3xl font-bold mb-4">
                We Find Jobs For You
              </h3>
              <p className="text-navy-100 mb-6 text-lg">
                Our advanced AI scans thousands of job postings daily, matches them to your profile, 
                and applies on your behalf. Wake up to interview invitations, not endless job searching.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  500+ Companies
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Daily Job Scans
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Smart Matching
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Auto Applications
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-6xl mb-4">🎯</div>
                <h4 className="text-xl font-bold mb-2">Job Search Success</h4>
                <p className="text-navy-200">
                  Our users get 3x more interviews and land jobs 60% faster than traditional job searching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
