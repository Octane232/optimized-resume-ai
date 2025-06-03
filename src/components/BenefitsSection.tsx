
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: '🤖',
      title: 'AI-Powered Resume Optimization',
      description: 'Advanced algorithms analyze job descriptions and optimize your resume for maximum ATS compatibility and recruiter appeal.',
      badge: 'AI Technology',
      metrics: '98% ATS Pass Rate'
    },
    {
      icon: '🎯',
      title: 'Intelligent Job Matching',
      description: 'Our platform continuously scans 500+ job boards and company websites to find opportunities that perfectly match your profile.',
      badge: 'Job Discovery',
      metrics: '10,000+ Jobs Daily'
    },
    {
      icon: '⚡',
      title: 'Automated Applications',
      description: 'Apply to multiple relevant positions automatically while maintaining personalization and quality standards.',
      badge: 'Automation',
      metrics: '50+ Applications/Day'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics Dashboard',
      description: 'Track application success rates, interview conversion, and optimize your job search strategy with actionable insights.',
      badge: 'Analytics',
      metrics: 'Real-time Tracking'
    },
    {
      icon: '🎨',
      title: 'Professional Template Library',
      description: 'Access 100+ industry-specific templates designed by career experts and approved by hiring managers.',
      badge: 'Design',
      metrics: '100+ Templates'
    },
    {
      icon: '💼',
      title: 'Enterprise-Grade Career Coaching',
      description: 'Get personalized interview preparation, salary negotiation strategies, and career advancement guidance.',
      badge: 'Coaching',
      metrics: '24/7 AI Support'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
            Enterprise Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Career Acceleration Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Beyond resume building—we're your complete career partner with enterprise-grade tools 
            designed to accelerate your professional growth and job search success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white relative overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs">
                      {benefit.badge}
                    </Badge>
                    <span className="text-xs font-medium text-blue-600">{benefit.metrics}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Feature Showcase */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-6 bg-white/20 text-white hover:bg-white/20 border-white/30">
                  🚀 Advanced Job Search Engine
                </Badge>
                <h3 className="text-4xl font-bold mb-6">
                  We Don't Just Build Resumes—We Land You Jobs
                </h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Our enterprise-grade AI scans thousands of job postings daily across 500+ companies, 
                  intelligently matches them to your profile, and automatically submits applications 
                  while you sleep. Wake up to interview invitations, not endless job searching.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-sm">500+ Partner Companies</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-sm">24/7 Job Monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-sm">Smart Application Timing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-sm">Interview Scheduling</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-7xl mb-4">🎯</div>
                  <h4 className="text-2xl font-bold mb-4">Job Search Success</h4>
                  <div className="space-y-3 text-blue-100">
                    <div className="flex justify-between">
                      <span>Interview Rate:</span>
                      <span className="font-bold text-green-400">3x Higher</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to Hire:</span>
                      <span className="font-bold text-green-400">60% Faster</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salary Increase:</span>
                      <span className="font-bold text-green-400">25% Average</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
