
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Search } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FileText,
      title: 'AI-Powered Resume Creation',
      description: 'Generate professional, ATS-optimized resumes tailored to specific job requirements with our advanced AI technology.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Smart Job Discovery',
      description: 'Our platform finds and presents job opportunities that match your skills, experience, and career goals.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Targeted Job Matching',
      description: 'Get matched with positions that align perfectly with your background and career aspirations.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Clock,
      title: 'Save Time & Effort',
      description: 'Streamline your job search process and focus on what matters most - preparing for interviews.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Track Your Progress',
      description: 'Monitor your job search performance with detailed analytics and insights to optimize your strategy.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: CheckCircle,
      title: 'Higher Success Rate',
      description: 'Increase your chances of landing interviews with professionally crafted resumes and strategic job targeting.',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose AI Resume Pro?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your job search with AI-powered tools designed for modern professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${benefit.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
