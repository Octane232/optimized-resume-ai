
import React from 'react';
import { Book, MessageSquare, FileText, Users, Code, TrendingUp } from 'lucide-react';

const ResourcesSection = () => {
  const resources = [
    {
      icon: MessageSquare,
      title: 'Help Center',
      description: 'Get instant answers to common questions, troubleshooting guides, and step-by-step tutorials to maximize your Pitchsora experience.',
      features: ['Email Support', 'Video Tutorials', 'FAQ Database', 'Response within 24h']
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
      title: 'Template Customization',
      description: 'Customize resume templates to match your personal style with flexible formatting options and export capabilities.',
      features: ['Multiple Formats', 'Custom Colors', 'Font Options', 'PDF Export']
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your job search progress with detailed analytics, application insights, and performance metrics.',
      features: ['Application Tracking', 'Success Metrics', 'Market Insights', 'Progress Reports']
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Resources to help you succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Guides, tips, and tools to navigate your job search and career growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-2xl p-8 hover:border-foreground/20 transition-all group"
            >
              <div className="mb-6">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {resource.title}
                </h3>
              
                <p className="text-muted-foreground leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {resource.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <button className="text-foreground font-medium text-sm hover:translate-x-1 transition-transform inline-flex items-center">
                Learn more <span className="ml-1">→</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ResourcesSection;
