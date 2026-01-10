import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Target, FileText, MessageSquare, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SoraDemoSection = () => {
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    {
      icon: Target,
      label: 'Find Jobs',
      question: 'Find me remote Python jobs paying $150k+',
      response: 'Found 23 remote Python roles matching your criteria. Top match: Senior Python Engineer at Stripe ($155k-$195k). Your profile shows 87% keyword match. Want me to optimize your resume for this role?'
    },
    {
      icon: FileText,
      label: 'Resume Help',
      question: 'How can I improve my resume for PM roles?',
      response: 'I analyzed your resume against 500+ PM job descriptions. Key gaps: Missing metrics on impact (add "increased X by Y%"), no mention of agile methodologies, and stakeholder management keywords. Want me to rewrite your experience bullets?'
    },
    {
      icon: MessageSquare,
      label: 'Interview Prep',
      question: 'Prep me for my Amazon interview',
      response: 'Amazon uses the STAR method with Leadership Principles focus. Based on the role, expect questions on "Customer Obsession" and "Bias for Action." Let\'s practice: Tell me about a time you made a decision with incomplete data.'
    },
    {
      icon: DollarSign,
      label: 'Salary Help',
      question: 'What salary should I ask for as a senior dev in NYC?',
      response: 'Based on current market data: Senior developers in NYC average $175k-$225k base. With your 6 years experience and React/Node stack, target $195k-$210k. I can help you craft negotiation scripts when you get an offer.'
    }
  ];

  const handlePromptClick = (index: number) => {
    setActivePrompt(null);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setActivePrompt(index);
    }, 1500);
  };

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--electric)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--electric)/0.02)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-electric/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-electric/30 bg-electric/5 mb-6"
          >
            <span className="text-sm font-mono text-electric">TRY IT NOW</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-foreground mb-4"
          >
            See <span className="text-electric">Sora</span> in Action
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Click a prompt below to see how Sora responds
          </motion.p>
        </div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          {/* Chat Preview */}
          <div className="cyber-card p-6 md:p-8 mb-6">
            {/* Sora Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/30">
              <motion.div 
                animate={{ 
                  boxShadow: ['0 0 15px hsl(var(--electric) / 0.3)', '0 0 30px hsl(var(--electric) / 0.5)', '0 0 15px hsl(var(--electric) / 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-electric via-purple-500 to-lime flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground">Sora</h3>
                <p className="text-xs text-electric font-mono">DEMO MODE</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="min-h-[200px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activePrompt === null && !isTyping ? (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <p className="text-muted-foreground">Click a prompt below to start the demo</p>
                  </motion.div>
                ) : isTyping ? (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-electric"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-electric"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-electric"
                    />
                    <span className="ml-2 text-sm">Sora is thinking...</span>
                  </motion.div>
                ) : activePrompt !== null ? (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-electric/20 border border-electric/30 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-foreground">{prompts[activePrompt].question}</p>
                      </div>
                    </div>
                    
                    {/* Sora Response */}
                    <div className="flex justify-start">
                      <div className="bg-lime/10 border border-lime/30 rounded-2xl rounded-bl-md px-4 py-3 max-w-[90%]">
                        <p className="text-sm text-foreground leading-relaxed">{prompts[activePrompt].response}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Prompt Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {prompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <motion.button
                  key={prompt.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => handlePromptClick(index)}
                  className={`cyber-card p-4 text-center group hover:border-electric/50 transition-all cursor-pointer ${
                    activePrompt === index ? 'border-electric/50 bg-electric/5' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 text-electric mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-foreground">{prompt.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10"
          >
            <Button 
              asChild 
              size="lg" 
              className="h-12 px-8 text-base font-bold bg-electric hover:bg-electric-glow text-white border-0 rounded-xl group"
            >
              <Link to="/auth">
                <Send className="mr-2 h-4 w-4" />
                Start Chatting with Sora
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SoraDemoSection;
