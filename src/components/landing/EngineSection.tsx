import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Diamond, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EngineSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Scout',
      icon: Radar,
      description: 'We scan 1,000+ company boards daily, pulling raw job data from Greenhouse, Lever, and direct career pages.',
      details: ['Automated crawlers', 'Real-time detection', 'Source verified'],
      gradient: 'from-lime to-lime-glow'
    },
    {
      number: '02',
      title: 'Refine',
      icon: Diamond,
      description: 'Our AI strips the corporate fluff, extracts hidden salary data, and identifies the actual skills required.',
      details: ['Salary extraction', 'Skill parsing', 'Noise removal'],
      gradient: 'from-electric to-electric-glow'
    },
    {
      number: '03',
      title: 'Deploy',
      icon: Rocket,
      description: 'Apply with a resume tailored to exactly what the machine wants. Beat the ATS. Get interviews.',
      details: ['ATS optimization', 'Keyword matching', 'One-click apply'],
      gradient: 'from-purple-500 to-pink-500'
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
            <span className="text-sm font-mono text-lime">THE ENGINE</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4"
          >
            How the <span className="text-lime">Magic</span> Works
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Three steps. Fully automated. You just apply.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
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
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-px z-10">
                    <div className="h-full bg-gradient-to-r from-lime/50 via-lime/20 to-transparent"></div>
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-lime/50" />
                  </div>
                )}
                
                <div className="cyber-card p-6 lg:p-8 h-full hover:border-lime/50 transition-all duration-300">
                  {/* Step number */}
                  <span className="absolute top-4 right-4 text-5xl font-black text-muted/10">
                    {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-charcoal-dark" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-black text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>
                  
                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
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
              Start Scouting
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EngineSection;
