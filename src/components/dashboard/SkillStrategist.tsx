import React from 'react';
import { ArrowRight, BookOpen, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SkillStrategist: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Skill-Gap Strategist</h2>
        <p className="text-muted-foreground text-sm mt-1">Your roadmap from where you are to where you want to be</p>
      </div>

      {/* Career Roadmap */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-8">
        {/* Step 1: Current */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Where you are</p>
            <p className="text-lg font-semibold text-foreground mt-1">Set your current role</p>
            <p className="text-sm text-muted-foreground">Update your profile in the Master Vault to get started.</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground/40 rotate-90" />
        </div>

        {/* Step 2: Target */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Where you want to be</p>
            <p className="text-lg font-semibold text-foreground mt-1">Set your target role</p>
            <p className="text-sm text-muted-foreground">Tell us your dream role and we'll map the gap.</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground/40 rotate-90" />
        </div>

        {/* The Gap */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">The gap</p>
            <p className="text-lg font-semibold text-foreground mt-1">Skills to learn this year</p>
            <p className="text-sm text-muted-foreground mb-3">AI will identify the exact skills you need and recommend courses.</p>
            <div className="flex flex-wrap gap-1.5">
              {['Coming soon'].map((s, i) => (
                <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillStrategist;
