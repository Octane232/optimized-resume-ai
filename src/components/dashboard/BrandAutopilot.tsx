import React from 'react';
import { Pen, Lightbulb, FileEdit, Send } from 'lucide-react';

const BrandAutopilot: React.FC = () => {
  const columns = [
    { title: 'Ideas', icon: Lightbulb, count: 0, color: 'text-yellow-500' },
    { title: 'Drafts', icon: FileEdit, count: 0, color: 'text-blue-500' },
    { title: 'Posted', icon: Send, count: 0, color: 'text-emerald-500' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Brand Autopilot</h2>
        <p className="text-muted-foreground text-sm mt-1">Build your personal brand on autopilot with AI-drafted LinkedIn content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div key={col.title} className="rounded-xl border border-border bg-card p-5 min-h-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${col.color}`} />
                <h3 className="font-semibold text-foreground">{col.title}</h3>
                <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{col.count}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {col.title === 'Ideas' && 'AI will generate post ideas based on industry trends.'}
                  {col.title === 'Drafts' && 'Click a draft to review and approve before posting.'}
                  {col.title === 'Posted' && 'Your published LinkedIn posts will appear here.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandAutopilot;
