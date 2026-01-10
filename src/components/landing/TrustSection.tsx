import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, FileText, DollarSign, Sparkles } from 'lucide-react';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl lg:text-7xl font-black text-lime tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

const TrustSection = () => {
  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: '+',
      label: 'Careers Guided',
      description: 'Job seekers transformed by Sora'
    },
    {
      icon: FileText,
      value: 250000,
      suffix: '+',
      label: 'Resumes Optimized',
      description: 'ATS-ready resumes generated'
    },
    {
      icon: DollarSign,
      value: 12,
      prefix: '$',
      suffix: 'M+',
      label: 'Salary Increases',
      description: 'Negotiated for our users'
    }
  ];

  return (
    <section className="py-24 bg-charcoal-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--lime)/0.05)_0%,transparent_70%)]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-lime/30 bg-lime/5 mb-6">
            <Sparkles className="w-4 h-4 text-lime" />
            <span className="text-sm font-mono text-lime">SORA'S IMPACT</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground">
            Real Results. <span className="text-lime">Real Careers.</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center group"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-lime/10 border border-lime/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-lime/20 transition-colors">
                  <Icon className="w-8 h-8 text-lime" />
                </div>

                {/* Counter */}
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />

                {/* Label */}
                <h3 className="text-xl font-bold text-foreground mt-4 mb-2">{stat.label}</h3>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
