import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CareerDashboard: React.FC = () => {
  const trendingSkills = ['AI/ML', 'Cloud Architecture', 'Data Engineering', 'Product Analytics', 'TypeScript', 'System Design'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Career Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Your market value at a glance</p>
      </div>

      {/* Salary Graph Placeholder */}
      <div className="rounded-xl border border-border bg-card p-8 mb-6 min-h-[320px] flex flex-col items-center justify-center text-center">
        <TrendingUp className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Market Value Tracker</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          A live salary comparison graph plotting your current compensation against market averages for your role will appear here.
        </p>
      </div>

      {/* Hot Skills */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          Hot Skills This Month
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingSkills.map((skill, i) => (
            <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;
