import React from 'react';
import { User, Target, Send } from 'lucide-react';

const steps = [
  { icon: User, num: 1, title: 'Create Your Profile', desc: 'Upload your resume and tell us about your experience.' },
  { icon: Target, num: 2, title: 'Get Matched', desc: 'Our AI finds the best jobs that match your profile.' },
  { icon: Send, num: 3, title: 'Apply & Get Hired', desc: 'Apply with AI-powered tools and land more interviews.' },
];

const HowItWorksSection = () => (
  <section className="py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-[0.25em] mb-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">HOW IT WORKS</p>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Get hired in 3 simple steps
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative text-center">
              <div className="relative inline-flex items-center justify-center mb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full blur-xl opacity-50" />
                <div className="relative w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
                  <Icon className="w-7 h-7 text-violet-400" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-bold text-violet-400">{s.num}</span>
                <h3 className="font-bold text-foreground">{s.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-border/60" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
