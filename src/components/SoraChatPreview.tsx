import React, { useState, useEffect } from 'react';
import { Bot, User, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Message {
  role: 'sora' | 'user';
  content: string;
  typing?: boolean;
}

const SoraChatPreview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const conversation: Message[] = [
    { 
      role: 'sora', 
      content: "Hi! I'm Helix, your AI career assistant. I see you're targeting Product Manager roles. Let me analyze your resume..." 
    },
    { 
      role: 'sora', 
      content: "Found 3 gaps: missing 'Agile', 'Roadmap', and quantified impact metrics. Want me to fix these?" 
    },
    { 
      role: 'user', 
      content: "Yes, optimize my resume for the Senior PM role at Stripe" 
    },
    { 
      role: 'sora', 
      content: "Done! Your match score jumped from 67% to 89%. I also drafted a tailored cover letter. Ready to apply?" 
    }
  ];

  useEffect(() => {
    if (currentStep < conversation.length) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, conversation[currentStep]]);
        setCurrentStep(prev => prev + 1);
      }, currentStep === 0 ? 1000 : 2500);
      return () => clearTimeout(timer);
    } else {
      // Reset after 4 seconds
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentStep(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentStep]);

  return (
    <div className="command-card p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background"></div>
        </div>
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-1.5">
            Helix
            <span className="text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded">AI</span>
          </h3>
          <p className="text-xs text-muted-foreground">Your Career Assistant</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-4 space-y-3 min-h-[220px] bg-gradient-to-b from-background to-secondary/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              message.role === 'sora' 
                ? 'bg-gradient-to-br from-primary to-purple-500' 
                : 'bg-secondary'
            }`}>
              {message.role === 'sora' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              message.role === 'sora' 
                ? 'bg-card border border-border text-foreground' 
                : 'bg-primary text-primary-foreground'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {currentStep < conversation.length && currentStep > 0 && (
          <div className="flex gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="px-4 pb-4">
        <Button asChild className="w-full saas-button h-11 font-bold group">
          <Link to="/auth">
            Start Chatting with Helix
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SoraChatPreview;
