import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CyberHeroSection = () => {
  // Sample messy HTML code for the "before" visualization
  const messyCode = `<div class="job-posting">
  <span class="title">Senior Dev</span>
  <div class="meta">
    <span>$???</span>
    <span>Location: TBD</span>
  </div>
  <p class="desc">We are looking 
  for a passionate...</p>
  <!-- 500+ more lines -->
</div>`;

  return (
    <section className="relative min-h-screen overflow-hidden bg-charcoal">
      {/* Cyber grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--lime)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--lime)/0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Glow orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-lime/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-electric/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime/[0.02] to-transparent animate-pulse"></div>

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
              <span className="text-sm font-mono text-lime">SYSTEM ONLINE • 12,400+ JOBS INDEXED</span>
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
              <span className="text-foreground">Don't Search.</span>
              <br />
              <span className="text-lime">Scout.</span>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-light"
          >
            The only job board that uses AI to clean the mess before you see it.
            <br />
            <span className="text-lime font-semibold">100% Signal. 0% Noise.</span>
          </motion.p>

          {/* The "Magic" Visual - Split Screen */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mb-12"
          >
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center max-w-4xl mx-auto">
              {/* Left - Messy HTML */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-xl blur-xl opacity-50"></div>
                <div className="relative bg-charcoal-dark border border-red-500/30 rounded-xl p-4 font-mono text-xs overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <span className="text-muted-foreground ml-2 text-[10px]">raw_greenhouse_data.html</span>
                  </div>
                  <pre className="text-red-400/70 whitespace-pre-wrap leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {messyCode}
                  </pre>
                  <div className="absolute bottom-4 left-4 right-4 h-12 bg-gradient-to-t from-charcoal-dark to-transparent"></div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3 font-mono">RAW DATA</p>
              </div>

              {/* Arrow with AI icon */}
              <div className="flex flex-col items-center justify-center py-8 md:py-0">
                <motion.div 
                  animate={{ 
                    boxShadow: ['0 0 20px hsl(var(--lime) / 0.3)', '0 0 40px hsl(var(--lime) / 0.6)', '0 0 20px hsl(var(--lime) / 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-lime/20 border-2 border-lime flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-lime" />
                </motion.div>
                <ArrowRight className="w-6 h-6 text-lime mt-2 rotate-90 md:rotate-0" />
                <span className="text-[10px] font-mono text-lime/70 mt-1">AI ENGINE</span>
              </div>

              {/* Right - Clean Job Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-lime/20 to-electric/10 rounded-xl blur-xl opacity-50"></div>
                <div className="relative cyber-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Senior Frontend Engineer</h3>
                      <p className="text-sm text-muted-foreground">Stripe • San Francisco, CA</p>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-lime/20 border border-lime/30 text-lime text-xs font-mono">
                      94% MATCH
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 rounded-md bg-electric/10 border border-electric/20 text-electric text-xs">React</span>
                    <span className="px-2 py-1 rounded-md bg-electric/10 border border-electric/20 text-electric text-xs">TypeScript</span>
                    <span className="px-2 py-1 rounded-md bg-electric/10 border border-electric/20 text-electric text-xs">Node.js</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <span className="text-lime font-bold">$180k - $220k</span>
                    <span className="text-xs text-muted-foreground font-mono">2h ago</span>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3 font-mono">REFINED OUTPUT</p>
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
                <Zap className="mr-2 h-6 w-6" />
                Access the Vault
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Quick stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-center gap-8 mt-12 text-center"
          >
            <div>
              <p className="text-2xl font-black text-lime">1,000+</p>
              <p className="text-xs text-muted-foreground font-mono">BOARDS SCANNED</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <p className="text-2xl font-black text-lime">&lt;2min</p>
              <p className="text-xs text-muted-foreground font-mono">REFRESH RATE</p>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div>
              <p className="text-2xl font-black text-lime">100%</p>
              <p className="text-xs text-muted-foreground font-mono">ATS-OPTIMIZED</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CyberHeroSection;
