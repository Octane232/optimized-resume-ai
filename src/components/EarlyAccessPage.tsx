import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, AlertTriangle, Clock, FileX, Ghost, Target, Brain, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import pitchsoraLogo from '@/assets/pitchsora-logo-navbar.png';

const painPoints = [
  {
    icon: FileX,
    title: "Your resume gets ignored",
    description: "You spend hours crafting a resume, but ATS systems reject it before a human ever sees it. 75% of resumes never make it past the filter.",
  },
  {
    icon: Ghost,
    title: "You apply and hear nothing",
    description: "You send 50+ applications and get ghosted. No feedback, no idea what went wrong. Just silence.",
  },
  {
    icon: Clock,
    title: "Job searching is a full-time job",
    description: "Scrolling job boards, tailoring resumes, writing cover letters, tracking applications — it's exhausting and unorganized.",
  },
  {
    icon: AlertTriangle,
    title: "Generic advice doesn't help",
    description: "Career tips online are vague and one-size-fits-all. You need specific guidance for YOUR resume, YOUR industry, YOUR goals.",
  },
];

const solutions = [
  "AI that writes ATS-optimized resumes tailored to each job",
  "Smart job matching based on your actual skills",
  "Application tracking so nothing falls through the cracks",
  "AI interview coach with real-time feedback",
  "Skill gap analysis showing exactly what you need",
  "Cover letters written in seconds, not hours",
];

const EarlyAccessPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === '23505') {
          toast.info("You're already on the list! We'll be in touch soon.");
          setSubmitted(true);
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
        toast.success("You're in! We'll notify you when we launch.");
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <img src={pitchsoraLogo} alt="Vaylance" className="h-8" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Early Access
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Job searching is broken
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-foreground">Stop getting ghosted.</span>
            <br />
            <span className="gradient-text">Start getting hired.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Vaylance is the AI career assistant that writes your resume, finds matching jobs, and coaches you through interviews — so you never job-hunt alone again.
          </p>

          {/* Email Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base flex-1"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="saas-button h-12 px-6 text-base font-bold shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary font-semibold text-lg mb-4">
              <CheckCircle2 className="w-5 h-5" />
              You're on the list! We'll be in touch.
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Free early access • No spam • Be first in line
          </p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Sound familiar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              The job market is brutal. These are the problems nobody talks about — but everyone feels.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {painPoints.map((point, i) => (
              <div
                key={i}
                className="command-card p-6 sm:p-8 group hover:border-destructive/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <point.icon className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            The Vaylance Solution
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What if your job search had an{' '}
            <span className="gradient-text">unfair advantage?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Vaylance AI handles the busywork so you can focus on what matters — landing the right job.
          </p>

          <div className="grid gap-4 text-left max-w-lg mx-auto">
            {solutions.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Second CTA */}
          <div className="mt-14">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="saas-button h-12 px-6 text-base font-bold shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Get Early Access
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-primary font-semibold text-lg">
                <CheckCircle2 className="w-5 h-5" />
                You're on the list!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vaylance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default EarlyAccessPage;
