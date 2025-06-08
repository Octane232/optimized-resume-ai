
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Brain } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FileText,
      title: 'AI-Powered Resume Writing',
      description: 'Generate professional resume content tailored to your industry and experience level with advanced AI technology.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'ATS-Optimized Templates',
      description: 'Choose from professionally designed templates that pass Applicant Tracking Systems and get you noticed.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'Smart Content Suggestions',
      description: 'Get intelligent recommendations for keywords, phrases, and achievements that make your resume stand out.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Clock,
      title: 'Build Resumes in Minutes',
      description: 'Create professional resumes quickly with our streamlined AI-powered builder and instant formatting.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track how your resume performs with detailed insights and optimization suggestions for better results.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: CheckCircle,
      title: 'Job Search Tools',
      description: 'Access additional features like job matching and interview preparation to complete your career journey.',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose AI Resume Pro?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create standout resumes with AI-powered tools designed for modern professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${benefit.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
