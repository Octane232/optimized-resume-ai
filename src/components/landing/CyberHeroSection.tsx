import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageSquare, Target, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CyberHeroSection = () => {
  const capabilities = [
    { icon: Target, label: 'Job Scout', desc: 'Finds perfect matches' },
    { icon: FileText, label: 'Resume Engine', desc: 'ATS optimization' },
    { icon: MessageSquare, label: 'Interview Coach', desc: 'AI-powered prep' },
    { icon: TrendingUp, label: 'Growth Advisor', desc: 'Career trajectory' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-charcoal">
      {/* Cyber grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--lime)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--lime)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Glow orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-lime/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-electric/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-8 relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Status badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime/30 bg-lime/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-lime animate-pulse"></div>
              <span className="text-sm font-mono text-lime">POWERED BY ADVANCED AI • 50,000+ CAREERS GUIDED</span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
              <span className="text-foreground">Meet</span>
              <span className="text-lime"> Sora.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-muted-foreground mt-4">
              Your AI Career Co-Pilot
            </p>
          </motion.div>

          {/* Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light"
          >
            From job hunting to salary negotiation — Sora handles it all.
            <br />
            <span className="text-lime font-semibold">Your career, on autopilot.</span>
          </motion.p>

          {/* Sora Orb + Chat Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-12"
          >
            <div className="max-w-3xl mx-auto">
              {/* Chat Interface Preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-lime/20 via-electric/10 to-purple-500/10 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative cyber-card p-6 md:p-8">
                  {/* Sora Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/30">
                    <motion.div 
                      animate={{ 
                        boxShadow: ['0 0 20px hsl(var(--lime) / 0.3)', '0 0 40px hsl(var(--lime) / 0.6)', '0 0 20px hsl(var(--lime) / 0.3)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-lime via-electric to-purple-500 flex items-center justify-center"
                    >
                      <Sparkles className="w-6 h-6 text-charcoal-dark" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-foreground">Sora</h3>
                      <p className="text-xs text-lime font-mono">AI CAREER ASSISTANT • ONLINE</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {/* User Message */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-end"
                    >
                      <div className="bg-electric/20 border border-electric/30 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-foreground">Find me senior React roles at FAANG companies with $200k+ salary</p>
                      </div>
                    </motion.div>

                    {/* Sora Response */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-start"
                    >
                      <div className="bg-lime/10 border border-lime/30 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                        <p className="text-sm text-foreground mb-3">Found <span className="text-lime font-bold">12 matches</span> across Google, Meta, and Apple. Here's the top result:</p>
                        
                        {/* Mini Job Card */}
                        <div className="bg-charcoal-dark/50 rounded-xl p-3 border border-border/30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-foreground text-sm">Senior Frontend Engineer</p>
                              <p className="text-xs text-muted-foreground">Google • Mountain View, CA</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-lime/20 border border-lime/30 text-lime text-xs font-mono">94%</span>
                          </div>
                          <p className="text-lime font-bold text-sm">$215k - $280k</p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3">Want me to tailor your resume for this role?</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Input hint */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-charcoal-dark/50 border border-border/30"
                  >
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">Ask Sora anything about your career...</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="h-16 px-12 text-xl font-black bg-lime hover:bg-lime-glow text-charcoal-dark border-0 rounded-xl group"
            >
              <Link to="/auth">
                <Sparkles className="mr-2 h-6 w-6" />
                Meet Sora
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Capability Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="cyber-card p-4 text-center group hover:border-lime/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-lime/20 transition-colors">
                    <Icon className="w-6 h-6 text-lime" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{cap.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cap.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CyberHeroSection;
