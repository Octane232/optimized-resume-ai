import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Sparkles, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EngineSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Sora Scouts',
      icon: Radar,
      description: 'Sora scans 1,000+ job boards daily, filtering noise and finding roles that match YOUR skills and goals.',
      details: ['AI-powered matching', 'Real-time alerts', 'Hidden job discovery'],
      gradient: 'from-lime to-lime-glow'
    },
    {
      number: '02',
      title: 'Sora Optimizes',
      icon: Sparkles,
      description: 'Sora tailors your resume for each role, optimizing keywords and formatting to beat ATS systems.',
      details: ['ATS score boost', 'Keyword injection', 'Format optimization'],
      gradient: 'from-electric to-electric-glow'
    },
    {
      number: '03',
      title: 'Sora Coaches',
      icon: MessageSquare,
      description: 'Sora preps you for interviews with role-specific questions, feedback, and confidence-building practice.',
      details: ['Mock interviews', 'Real-time feedback', 'Salary negotiation tips'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      number: '04',
      title: 'Sora Tracks',
      icon: TrendingUp,
      description: 'Sora monitors your progress, celebrates wins, and plans your next career move strategically.',
      details: ['Application tracking', 'Growth metrics', 'Career roadmap'],
      gradient: 'from-orange-500 to-yellow-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--lime)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--lime)/0.02)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lime/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime/30 bg-lime/5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-lime" />
            <span className="text-sm font-mono text-lime">YOUR AI CO-PILOT</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4"
          >
            How <span className="text-lime">Sora</span> Works For You
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Four AI-powered stages. Your entire career journey, automated.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connector line for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-px z-10">
                    <div className="h-full bg-gradient-to-r from-lime/50 via-lime/20 to-transparent"></div>
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-lime/50" />
                  </div>
                )}
                
                <div className="cyber-card p-6 h-full hover:border-lime/50 transition-all duration-300">
                  {/* Step number */}
                  <span className="absolute top-4 right-4 text-4xl font-black text-muted/10">
                    {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-charcoal-dark" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-black text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{step.description}</p>
                  
                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime"></div>
                        <span className="text-muted-foreground font-mono">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            asChild 
            size="lg" 
            className="h-14 px-10 text-lg font-black bg-lime hover:bg-lime-glow text-charcoal-dark border-0 rounded-xl group"
          >
            <Link to="/auth">
              <Sparkles className="mr-2 h-5 w-5" />
              Start with Sora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EngineSection;
