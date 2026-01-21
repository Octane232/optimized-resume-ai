import React from 'react';
import { Brain, Target, Shield, Zap, BarChart3, Clock, MessageCircle, Sparkles, Bot, FileSearch, PenTool, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BenefitsSection = () => {
  const aiFeatures = [
    {
      icon: MessageCircle,
      title: '24/7 AI Career Coach',
      description: 'Ask Vaylance AI anything about your job search. Get personalized advice instantly, any time.',
      color: 'from-primary to-blue-400'
    },
    {
      icon: Brain,
      title: 'Smart Resume Analysis',
      description: 'Vaylance AI reads your resume like a recruiter would, spotting issues and opportunities.',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Target,
      title: 'Job Match Scoring',
      description: 'Paste any job posting. Vaylance AI calculates your match percentage and shows gaps.',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      icon: PenTool,
      title: 'AI Content Writing',
      description: 'Vaylance AI writes tailored cover letters, rewrites bullet points, and drafts follow-ups.',
      color: 'from-amber-500 to-orange-400'
    },
    {
      icon: BarChart3,
      title: 'Skill Gap Analysis',
      description: 'Discover what skills you need for your dream role and how to acquire them.',
      color: 'from-red-500 to-rose-400'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'One click and Vaylance AI optimizes your entire resume for ATS systems.',
      color: 'from-cyan-500 to-blue-400'
    }
  ];

  const vayaCapabilities = [
    {
      question: "Analyze my resume for PM roles",
      answer: "Your resume shows strong analytical skills. I'd recommend adding more metrics to your achievements. Your ATS score is 72%—I can boost it to 90%."
    },
    {
      question: "How do I stand out for this job?",
      answer: "This role emphasizes 'cross-functional collaboration.' I found 3 experiences in your background that demonstrate this—let me highlight them."
    },
    {
      question: "Write me a cover letter",
      answer: "Done! I've written a personalized cover letter highlighting your relevant experience with their tech stack and company values."
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Can 
            <span className="gradient-text"> Vaylance AI Do?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From resume analysis to interview prep, Vaylance AI handles the heavy lifting so you can focus on landing your dream job.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="command-card p-6 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Vaylance AI Conversation Examples */}
        <div className="command-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ask Vaylance AI Anything
              </h3>
              <p className="text-muted-foreground">
                Natural conversations that give you real, actionable career advice
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {vayaCapabilities.map((cap, index) => (
                <div key={index} className="bg-background/50 border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
                  {/* User Question */}
                  <div className="flex items-start gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Users className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">"{cap.question}"</p>
                  </div>
                  
                  {/* Vaylance AI Answer */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cap.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button asChild size="lg" className="saas-button h-14 px-10 text-lg font-bold">
                <Link to="/auth">
                  Try Vaylance AI Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">100% Private</h4>
              <p className="text-sm text-muted-foreground">Your data is never shared</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Instant Responses</h4>
              <p className="text-sm text-muted-foreground">AI answers in seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Available 24/7</h4>
              <p className="text-sm text-muted-foreground">Career help anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
