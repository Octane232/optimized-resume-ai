import React from 'react';
import { Upload, FileSearch, Target, Kanban, ArrowRight, CheckCircle, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload & Meet Vaya',
      description: 'Upload your resume and Vaya instantly analyzes your skills, experience, and career trajectory.',
      icon: Upload,
      color: 'from-primary to-blue-400',
      vayaQuote: '"I see you have 5 years in product management. Let me identify your strongest selling points..."',
      details: ['PDF or DOCX format', 'AI skill extraction', 'Instant analysis']
    },
    {
      number: '02',
      title: 'Vaya Finds the Gaps',
      description: 'Paste any job description. Vaya compares it against your profile and shows exactly what\'s missing.',
      icon: Target,
      color: 'from-emerald-500 to-teal-400',
      vayaQuote: '"This role needs Agile experience—I found 3 ways to highlight yours better."',
      details: ['Keyword matching', 'Gap identification', 'Match scoring']
    },
    {
      number: '03',
      title: 'AI-Powered Optimization',
      description: 'Vaya rewrites bullet points, suggests improvements, and tailors your resume for each opportunity.',
      icon: FileSearch,
      color: 'from-purple-500 to-pink-400',
      vayaQuote: '"I\'ve optimized your experience section. Your ATS score jumped from 67% to 89%!"',
      details: ['Auto-rewrite bullets', 'ATS optimization', 'Tailored versions']
    },
    {
      number: '04',
      title: 'Apply with Confidence',
      description: 'Track every application in Mission Control while Vaya reminds you when to follow up.',
      icon: Kanban,
      color: 'from-amber-500 to-orange-400',
      vayaQuote: '"You applied to Stripe 5 days ago. Want me to draft a follow-up email?"',
      details: ['Application tracking', 'Smart reminders', 'Follow-up drafts']
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            How Vaya Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your AI Guide from 
            <span className="gradient-text"> Resume to Hired</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vaya walks you through every step, providing personalized guidance and doing the heavy lifting.
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
                  
                  {/* Vaya Quote */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs text-foreground/80 italic leading-relaxed">{step.vayaQuote}</p>
                    </div>
                  </div>
                  
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
              Start Chatting with Vaya
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
