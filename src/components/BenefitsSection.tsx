
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Brain, Shield, Zap, Users, Sparkles } from 'lucide-react';

const BenefitsSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Content',
      description: 'Generate professional, tailored content that matches your industry and experience level.',
      category: 'Core Features'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with built-in optimization.',
      category: 'Core Features'
    },
    {
      icon: Clock,
      title: 'Built in Minutes',
      description: 'Create professional resumes quickly with our streamlined, intuitive interface.',
      category: 'Efficiency'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track resume performance with detailed insights and optimization recommendations.',
      category: 'Analytics'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and SOC 2 compliance to keep your data secure.',
      category: 'Security'
    },
    {
      icon: Zap,
      title: 'Real-time Collaboration',
      description: 'Share and collaborate on resumes with mentors, career coaches, or colleagues.',
      category: 'Collaboration'
    }
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden bg-background">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/50"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Premium Features
            </span>
          </div>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            Everything you need to build outstanding resumes
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Professional-grade tools and AI-powered features designed to help you land your dream job
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="enterprise-card p-10 group animate-fade-in hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                {feature.category}
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-6 glass-card-strong rounded-full px-8 py-4 shadow-xl">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-background shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-4 border-background shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-4 border-background shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-4 border-background shadow-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              <span className="font-bold text-xl gradient-text bg-gradient-to-r from-blue-600 to-purple-600">250,000+</span>
              <span className="ml-2">professionals trust our platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
