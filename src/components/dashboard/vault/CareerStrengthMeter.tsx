import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerStrengthMeterProps {
  completeness: number;
  hasResume: boolean;
  skillsCount: number;
  certificationsCount: number;
  projectsCount: number;
}

const CareerStrengthMeter = ({ 
  completeness, 
  hasResume, 
  skillsCount, 
  certificationsCount,
  projectsCount
}: CareerStrengthMeterProps) => {
  const getStrengthLabel = () => {
    if (completeness >= 80) return { label: 'Excellent', color: 'text-emerald-500' };
    if (completeness >= 60) return { label: 'Strong', color: 'text-blue-500' };
    if (completeness >= 40) return { label: 'Developing', color: 'text-amber-500' };
    return { label: 'Getting Started', color: 'text-muted-foreground' };
  };

  const { label, color } = getStrengthLabel();

  const getBreakdownStatus = (condition: boolean, threshold: boolean) => {
    if (condition && threshold) return { icon: CheckCircle, color: 'text-emerald-500', status: 'Strong' };
    if (condition) return { icon: AlertCircle, color: 'text-amber-500', status: 'Needs Work' };
    return { icon: XCircle, color: 'text-muted-foreground', status: 'Missing' };
  };

  const breakdown = [
    { label: 'Resume', ...getBreakdownStatus(hasResume, hasResume) },
    { label: 'Skills', ...getBreakdownStatus(skillsCount > 0, skillsCount >= 5) },
    { label: 'Certifications', ...getBreakdownStatus(certificationsCount > 0, certificationsCount >= 2) },
    { label: 'Projects', ...getBreakdownStatus(projectsCount > 0, projectsCount >= 3) },
  ];

  // Calculate circumference for SVG ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completeness / 100) * circumference;

  return (
    <div className="command-card p-5">
      <div className="flex items-start gap-5">
        {/* Animated Ring Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--electric))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-2xl font-bold", color)}>{completeness}%</span>
          </div>
        </div>

        {/* Right side content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-foreground">Career Profile Strength</h2>
          </div>
          <p className={cn("text-sm font-medium mb-3", color)}>{label}</p>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                <span className="text-xs text-muted-foreground">{item.label}:</span>
                <span className={cn("text-xs font-medium", item.color)}>{item.status}</span>
              </div>
            ))}
          </div>

          {/* Industry benchmark - now visible to all */}
          <div className="mt-3 p-2 bg-primary/5 rounded-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-foreground">
              You're in the <span className="font-semibold text-primary">top 23%</span> of Product Managers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerStrengthMeter;