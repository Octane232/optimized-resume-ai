import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Mic, 
  Telescope, 
  PenTool, 
  BarChart3, 
  Crosshair, 
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'ATS Resume Scanner',
    problem: 'Your resume gets filtered out before anyone reads it.',
    solution: 'See your exact ATS score and get a rewritten resume that passes in 60 seconds.',
  },
  {
    icon: PenTool,
    title: 'Cover Letter Generator',
    problem: 'Writing a tailored cover letter for every job takes hours.',
    solution: 'Generated automatically alongside your resume. One input, done in seconds.',
  },
  {
    icon: Mic,
    title: 'Interview Coach',
    problem: 'You freeze under pressure and lose opportunities you should win.',
    solution: 'Practice with AI mock interviews. Get scored feedback on every answer.',
  },
  {
    icon: Telescope,
    title: 'Hidden Job Radar',
    problem: 'You only see roles after 200 people have already applied.',
    solution: 'Get alerts when companies raise funding — before they post any jobs publicly.',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analyzer',
    problem: 'You apply for roles without knowing what is holding you back.',
    solution: 'Compare your skills to job requirements and get a clear roadmap to close gaps.',
  },
  {
    icon: Crosshair,
    title: 'Application Tracker',
    problem: 'Your job search is scattered across tabs, notes, and memory.',
    solution: 'Track every application in one place. Get reminded when to follow up.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            Every tool you need.<br />Nothing you don't.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            One platform replaces the five tools most job seekers cobble together.
            All powered by AI that understands your specific situation.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
                  <span className="text-destructive/70 shrink-0 mt-0.5">✗</span>
                  {feature.problem}
                </p>
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  {feature.solution}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="h-12 px-8 font-semibold gap-2">
            <Link to="/auth">
              Start free — 14 days
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
