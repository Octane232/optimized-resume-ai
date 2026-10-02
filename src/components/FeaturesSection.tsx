import React from 'react';
import { Radio, FileText, PenTool, DollarSign, Mic } from 'lucide-react';

const FeaturesSection = () => (
  <section id="features" className="py-20 sm:py-24 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground max-w-2xl mb-4">
        One place to find the role and win it.
      </h2>
      <p className="text-muted-foreground max-w-[60ch] mb-12">
        Spot openings early, then get your resume, letter and interview ready for that exact role.
      </p>

      <div className="grid md:grid-cols-6 gap-4">
        <div className="md:col-span-4 rounded-xl border border-border bg-primary text-primary-foreground p-8 flex flex-col justify-between min-h-[260px]">
          <Radio className="w-6 h-6" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Job Radar</h3>
            <p className="opacity-85 max-w-md">Reads funding rounds, office openings and hiring news across every industry, and tells you why each company is likely to hire now.</p>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <FileText className="w-5 h-5 text-primary" />
          <div className="mt-8">
            <h3 className="font-semibold text-foreground mb-3">Resume + ATS score</h3>
            <div className="space-y-2 text-xs">
              {[['Meaning match', 50], ['Skills & experience', 30], ['Exact keywords', 20]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-muted-foreground mb-1"><span>{k}</span><span>{v}%</span></div>
                  <div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(v as number) * 2}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-border bg-muted p-6">
          <PenTool className="w-5 h-5 text-primary mb-6" />
          <h3 className="font-semibold text-foreground mb-2">Rewrite in your own file</h3>
          <p className="text-sm text-muted-foreground">Upload a Word resume and get it back tailored to the job, same layout.</p>
        </div>

        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6">
          <Mic className="w-5 h-5 text-primary mb-6" />
          <h3 className="font-semibold text-foreground mb-2">Interview practice</h3>
          <p className="text-sm text-muted-foreground">Answer real questions for the role and get honest feedback.</p>
        </div>

        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6">
          <DollarSign className="w-5 h-5 text-primary mb-6" />
          <h3 className="font-semibold text-foreground mb-2">Salary insights</h3>
          <p className="text-sm text-muted-foreground">See the pay range and walk in with a negotiation script.</p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
