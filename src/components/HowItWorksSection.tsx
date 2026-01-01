
import React from 'react';
import { Upload, FileSearch, Target, Kanban, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Master Resume',
      description: 'Start by uploading your existing resume. This becomes your career foundation—the source of truth for all analysis.',
      icon: Upload,
      color: 'from-electric to-blue-400',
      details: ['PDF or DOCX format', 'Secure & private', 'One-time setup']
    },
    {
      number: '02',
      title: 'Paste a Job Description',
      description: 'Copy and paste any job posting you\'re interested in. Our AI instantly analyzes the match between your skills and requirements.',
      icon: Target,
      color: 'from-emerald-500 to-teal-400',
      details: ['Instant analysis', 'Keyword extraction', 'Gap identification']
    },
    {
      number: '03',
      title: 'Get Your Match Score',
      description: 'See exactly how well your resume matches the job. Identify missing keywords, skill gaps, and ATS optimization opportunities.',
      icon: FileSearch,
      color: 'from-purple-500 to-pink-400',
      details: ['Match percentage', 'Missing keywords', 'ATS readiness score']
    },
    {
      number: '04',
      title: 'Track Your Applications',
      description: 'Use Mission Control to track every application. Never lose sight of where you\'ve applied or miss a follow-up.',
      icon: Kanban,
      color: 'from-amber-500 to-orange-400',
      details: ['Kanban board', 'Follow-up reminders', 'Status tracking']
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Resume to Results in 
            <span className="gradient-text"> 4 Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pitchsora guides you from upload to hired with a clear, focused workflow designed for action.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border via-primary/30 to-border z-0 -translate-x-1/2">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 text-primary/50" />
                  </div>
                )}
                
                <div className="command-card p-6 h-full relative z-10">
                  {/* Step number */}
                  <span className="text-5xl font-black text-muted/20 absolute top-4 right-4">{step.number}</span>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                  
                  {/* Details */}
                  <ul className="space-y-1.5">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-bold">
            <Link to="/auth">
              Start Your Career Command Center
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
