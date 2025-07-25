
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
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose AI Resume Pro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create standout resumes with AI-powered tools designed for modern professionals seeking career advancement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="floating-card bg-card rounded-3xl p-8 border border-border group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <benefit.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
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
