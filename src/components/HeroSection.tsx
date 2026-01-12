import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Sparkles, Brain, Mic, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import SoraChatPreview from './SoraChatPreview';

const HeroSection = () => {
  const quickPrompts = [
    "Optimize my resume for a Product Manager role",
    "Find jobs matching my skills",
    "Prepare me for an interview at Google",
    "Write a cover letter for this job posting"
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
      
      {/* Floating orb - represents AI */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none opacity-60"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative pt-28 pb-16">
        {/* Centered AI Assistant Introduction */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* AI Avatar/Orb */}
          <div className="relative inline-flex flex-col items-center animate-fade-in">
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-xl"></div>
              
              {/* Main orb */}
              <div className="relative w-28 h-28 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Main headline - conversational */}
          <div className="space-y-4 animate-fade-in stagger-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">Hey, I'm </span>
              <span className="gradient-text">Helix</span>
              <span className="text-foreground"> 👋</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Your AI career assistant
            </p>
          </div>

          {/* What I can do - conversational */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in stagger-2">
            Tell me about your dream job, and I'll help you get there. I can optimize your resume, 
            find matching jobs, write cover letters, and coach you for interviews — all in one conversation.
          </p>

          {/* Main CTA - Chat input style */}
          <div className="max-w-2xl mx-auto animate-fade-in stagger-3">
            <div className="relative">
              <div className="command-card p-2 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground text-left">Ask me anything about your career...</span>
                </div>
                <Button asChild size="lg" className="saas-button h-12 px-6 font-bold shrink-0">
                  <Link to="/auth" className="flex items-center gap-2">
                    <span className="hidden sm:inline">Start Chat</span>
                    <Send className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Quick prompts */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {quickPrompts.map((prompt, index) => (
                <Link 
                  key={index}
                  to="/auth"
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground animate-fade-in stagger-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Free to start • No credit card needed</span>
          </div>
        </div>

        {/* Live Demo Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Chat Preview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Watch me in action
              </div>
              <SoraChatPreview />
            </div>

            {/* What I Help With */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                What I can help you with
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    emoji: "📝", 
                    title: "Resume Optimization", 
                    desc: "I'll analyze your resume and make it ATS-friendly in seconds"
                  },
                  { 
                    emoji: "🎯", 
                    title: "Job Matching", 
                    desc: "I find jobs that actually fit your skills and experience"
                  },
                  { 
                    emoji: "✍️", 
                    title: "Cover Letters", 
                    desc: "I write personalized cover letters for each application"
                  },
                  { 
                    emoji: "🎤", 
                    title: "Interview Prep", 
                    desc: "I'll simulate interviews and give you real-time feedback"
                  },
                  { 
                    emoji: "📊", 
                    title: "Skill Gap Analysis", 
                    desc: "I identify what skills you need for your target role"
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="command-card p-4 flex items-start gap-4 group hover:border-primary/30 transition-colors"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="w-full mt-4 h-12 font-semibold">
                <Link to="/auth" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Start a conversation with me
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
