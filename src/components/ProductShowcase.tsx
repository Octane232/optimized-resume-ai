import React from 'react';
import { FileText, Sparkles, Users, BarChart3, PenTool, Telescope, ArrowRight, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
  // Only list features that are LIVE per document spec
  const features = [
    {
      icon: FileText,
      title: 'ATS Resume Scanner & Rewriter',
      problem: 'Your resume gets filtered out before a human ever sees it.',
      solution: 'See your exact ATS score. Get a rewritten resume that passes in 60 seconds.',
      color: 'from-primary to-blue-400',
      badge: 'AI',
    },
    {
      icon: PenTool,
      title: 'Cover Letter',
      problem: 'Writing tailored cover letters for every job is exhausting.',
      solution: 'Generated automatically with your tailored resume. One input, three outputs.',
      color: 'from-amber-500 to-orange-400',
      badge: 'AI',
    },
    {
      icon: Users,
      title: 'Interview Coach',
      problem: 'You get nervous and struggle with tough interview questions.',
      solution: 'Practice with AI-powered mock interviews. Get feedback on every answer.',
      color: 'from-red-500 to-rose-400',
      badge: 'AI',
    },
    {
      icon: Telescope,
      title: 'Hidden Job Radar',
      problem: 'You only see jobs after 200 other people have already applied.',
      solution: 'Find companies hiring before they post publicly. Get alerts matched to your profile.',
      color: 'from-emerald-500 to-teal-400',
      badge: 'New',
    },
    {
      icon: Sparkles,
      title: 'LinkedIn Optimizer',
      problem: 'Recruiters can\'t find you because your profile isn\'t optimized.',
      solution: 'AI rewrites your headline and about section with keywords recruiters search for.',
      color: 'from-purple-500 to-pink-400',
      badge: 'AI',
    },
    {
      icon: BarChart3,
      title: 'Skill Gap Analyzer',
      problem: 'You don\'t know what skills you need for your target role.',
      solution: 'Compare your skills to job requirements. Get a clear roadmap to close the gaps.',
      color: 'from-cyan-500 to-blue-400',
      badge: 'AI',
    },
    {
      icon: Crosshair,
      title: 'Application Tracker',
      problem: 'Your job search is chaotic with no system.',
      solution: 'Track every application. Auto-detect ghosting after 14 days with follow-up templates.',
      color: 'from-indigo-500 to-violet-400',
      badge: null,
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">What's Live Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in stagger-1">
            <span className="text-foreground">Every tool you need to </span>
            <span className="gradient-text">land your dream job</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground animate-fade-in stagger-2">
            One platform replaces a dozen tools. All powered by AI that understands your career.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="command-card p-6 sm:p-7 group flex flex-col animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.08}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-primary to-purple-500 text-white uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>

                <p className="text-sm text-destructive/80 font-medium mb-2 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">&#10005;</span>
                  {feature.problem}
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-emerald-500">&#10003;</span>
                  {feature.solution}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Button asChild size="lg" className="saas-button h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold">
            <Link to="/auth" className="flex items-center gap-2">
              Start Free Trial — 14 Days Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;