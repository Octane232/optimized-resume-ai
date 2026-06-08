import React from 'react';
import { FileText, Target, PenTool, Mic, BarChart3, DollarSign } from 'lucide-react';

const features = [
  { icon: FileText, title: 'AI Resume Builder', desc: 'Create a professional, ATS-friendly resume in minutes with AI.', tone: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400' },
  { icon: Target, title: 'Smart Job Matching', desc: 'Get matched with jobs that fit your skills and experience.', tone: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400' },
  { icon: PenTool, title: 'AI Cover Letter', desc: 'Generate personalized cover letters that impress recruiters.', tone: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400' },
  { icon: Mic, title: 'Interview Coach', desc: 'Practice with AI and get real-time feedback to boost your confidence.', tone: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400' },
  { icon: BarChart3, title: 'Application Tracker', desc: 'Track your applications and never miss an opportunity.', tone: 'from-fuchsia-500/20 to-fuchsia-500/5', iconColor: 'text-fuchsia-400' },
  { icon: DollarSign, title: 'Salary Insights', desc: 'Get accurate salary data and negotiate with confidence.', tone: 'from-yellow-500/20 to-yellow-500/5', iconColor: 'text-yellow-400' },
];

const FeaturesSection = () => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold tracking-[0.25em] mb-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">POWERFUL FEATURES</p>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
          Everything you need to get hired
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Our AI tools work together to help you stand out and land more interviews.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.tone} flex items-center justify-center mb-4 border border-border/50`}>
                <Icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
