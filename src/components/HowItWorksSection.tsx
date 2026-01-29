import React from 'react';
import { Upload, FileSearch, Target, Kanban, ArrowRight, CheckCircle, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload & Meet Vaylance AI',
      description: 'Upload your resume and Vaylance AI instantly analyzes your skills, experience, and career trajectory.',
      icon: Upload,
      color: 'from-primary to-blue-400',
      aiQuote: '"I see you have 5 years in product management. Let me identify your strongest selling points..."',
      details: ['PDF or DOCX format', 'AI skill extraction', 'Instant analysis']
    },
    {
      number: '02',
      title: 'Vaylance AI Finds the Gaps',
      description: 'Paste any job description. Vaylance AI compares it against your profile and shows exactly what\'s missing.',
      icon: Target,
      color: 'from-emerald-500 to-teal-400',
      aiQuote: '"This role needs Agile experience—I found 3 ways to highlight yours better."',
      details: ['Keyword matching', 'Gap identification', 'Match scoring']
    },
    {
      number: '03',
      title: 'AI-Powered Optimization',
      description: 'Vaylance AI rewrites bullet points, suggests improvements, and tailors your resume for each opportunity.',
      icon: FileSearch,
      color: 'from-purple-500 to-pink-400',
      aiQuote: '"I\'ve optimized your experience section. Your ATS score jumped from 67% to 89%!"',
      details: ['Auto-rewrite bullets', 'ATS optimization', 'Tailored versions']
    },
    {
      number: '04',
      title: 'Apply with Confidence',
      description: 'Track every application in Mission Control while Vaylance AI reminds you when to follow up.',
      icon: Kanban,
      color: 'from-amber-500 to-orange-400',
      aiQuote: '"You applied to Stripe 5 days ago. Want me to draft a follow-up email?"',
      details: ['Application tracking', 'Smart reminders', 'Follow-up drafts']
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            How Vaylance Works
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Your AI Guide from 
            <span className="gradient-text"> Resume to Hired</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Vaylance AI walks you through every step, providing personalized guidance and doing the heavy lifting.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
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
                
                <div className="command-card p-4 sm:p-6 h-full relative z-10">
                  {/* Step number */}
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-muted/20 absolute top-3 sm:top-4 right-3 sm:right-4">{step.number}</span>
                  
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 lg:w-14 sm:h-12 lg:h-14 bg-gradient-to-br ${step.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 lg:w-7 sm:h-6 lg:h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{step.description}</p>
                  
                  {/* AI Quote */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                      <p className="text-[10px] sm:text-xs text-foreground/80 italic leading-relaxed">{step.aiQuote}</p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <ul className="space-y-1 sm:space-y-1.5">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
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
          <Button asChild size="lg" className="saas-button h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-bold">
            <Link to="/auth">
              Start with Vaylance AI
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
