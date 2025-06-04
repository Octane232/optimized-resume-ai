
import React from 'react';
import { Book, MessageSquare, FileText, Users, Code, TrendingUp } from 'lucide-react';

const ResourcesSection = () => {
  const resources = [
    {
      icon: MessageSquare,
      title: 'Help Center',
      description: 'Get instant answers to common questions, troubleshooting guides, and step-by-step tutorials to maximize your AI Resume Pro experience.',
      features: ['24/7 Support', 'Video Tutorials', 'FAQ Database', 'Live Chat']
    },
    {
      icon: Book,
      title: 'Career Blog',
      description: 'Stay ahead with the latest career insights, industry trends, job market analysis, and expert advice from career professionals.',
      features: ['Weekly Articles', 'Industry Insights', 'Career Tips', 'Success Stories']
    },
    {
      icon: FileText,
      title: 'Resume Examples',
      description: 'Browse through hundreds of professionally crafted resume examples across different industries and experience levels.',
      features: ['50+ Industries', 'All Experience Levels', 'ATS-Optimized', 'Download Ready']
    },
    {
      icon: Users,
      title: 'Interview Tips',
      description: 'Master your interviews with comprehensive preparation guides, common questions, and expert strategies for success.',
      features: ['Question Bank', 'Mock Interviews', 'Behavioral Tips', 'Salary Negotiation']
    },
    {
      icon: Code,
      title: 'API Documentation',
      description: 'Integrate AI Resume Pro into your applications with our comprehensive API documentation and developer resources.',
      features: ['RESTful API', 'SDKs Available', 'Code Examples', 'Webhook Support']
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your job search progress with detailed analytics, application insights, and performance metrics.',
      features: ['Application Tracking', 'Success Metrics', 'Market Insights', 'Progress Reports']
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Career Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to accelerate your career journey, from expert guidance to powerful tools and insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <resource.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {resource.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {resource.description}
              </p>

              <div className="space-y-2">
                {resource.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with AI Resume Pro's comprehensive platform and resources.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your 7-Day Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
