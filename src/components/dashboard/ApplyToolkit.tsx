import React from 'react';
import { FileText, CheckCircle, Sparkles } from 'lucide-react';

const ApplyToolkit: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Apply Toolkit</h2>
        <p className="text-muted-foreground text-sm mt-1">Edit your resume with live ATS scoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[60vh]">
        {/* Left: Document Editor Placeholder */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-foreground">Resume Editor</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Select a job from The Daily Hunt to start editing your resume. Highlight any bullet point and click the ✨ wand to rewrite it with AI.
          </p>
        </div>

        {/* Right: ATS Score & Checklist */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-primary">—</span>
          </div>
          <h3 className="font-semibold text-foreground">ATS Score</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Your live ATS compatibility score and keyword checklist will appear here once you select a job to optimize for.
          </p>
          <div className="mt-6 space-y-2 text-left w-full max-w-xs">
            {['Action verbs', 'Measurable results', 'Relevant keywords', 'Clean formatting'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-muted-foreground/40" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyToolkit;
