import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  DollarSign,
  Star,
  Lock,
  Sparkles,
  BookOpen,
  Bell
} from 'lucide-react';

interface GrowthTeaserProps {
  setMode: (mode: 'hunter' | 'growth') => void;
}

const GrowthTeaser: React.FC<GrowthTeaserProps> = ({ setMode }) => {
  const upcomingFeatures = [
    {
      icon: Trophy,
      title: 'Win Logger',
      description: 'Track weekly achievements and auto-format them for performance reviews',
      color: 'hsl(262, 83%, 58%)'
    },
    {
      icon: DollarSign,
      title: 'Salary Sentinel',
      description: 'Real-time market salary comparisons with negotiation scripts',
      color: 'hsl(38, 92%, 50%)'
    },
    {
      icon: Target,
      title: 'Promotion Roadmap',
      description: 'AI-powered skill gap analysis with personalized learning paths',
      color: 'hsl(262, 83%, 58%)'
    },
    {
      icon: BookOpen,
      title: 'Course Recommendations',
      description: 'Curated courses to accelerate your career growth',
      color: 'hsl(142, 76%, 36%)'
    }
  ];

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-full pb-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(262,83%,58%)]/10 border border-[hsl(262,83%,58%)]/20 mb-6">
          <Sparkles className="w-4 h-4 text-[hsl(262,83%,58%)]" />
          <span className="text-sm font-medium text-[hsl(262,83%,58%)]">Coming Soon</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Growth Mode
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Your AI-powered career acceleration engine
        </p>
        <p className="text-muted-foreground">
          We're building something special for professionals who want to grow within their current role.
        </p>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mb-12">
        {upcomingFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="relative overflow-hidden border-dashed border-2 bg-card/50 backdrop-blur"
            >
              <div className="absolute top-3 right-3">
                <Lock className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-3 gap-6 max-w-md w-full mb-12 opacity-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">--</p>
          <p className="text-xs text-muted-foreground">Wins Logged</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">--</p>
          <p className="text-xs text-muted-foreground">Progress</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
            <Star className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">--</p>
          <p className="text-xs text-muted-foreground">Skills</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <Button 
          size="lg" 
          className="gap-2 bg-[hsl(262,83%,58%)] hover:bg-[hsl(262,83%,50%)]"
          disabled
        >
          <Bell className="w-4 h-4" />
          Get Notified When Available
        </Button>
        <p className="text-sm text-muted-foreground">
          or{' '}
          <button 
            onClick={() => setMode('hunter')}
            className="text-primary hover:underline font-medium"
          >
            continue with Hunter Mode
          </button>
        </p>
      </div>

      {/* Bottom Badge */}
      <div className="mt-12">
        <Badge variant="outline" className="text-muted-foreground">
          Expected Launch: Q3 2026
        </Badge>
      </div>
    </div>
  );
};

export default GrowthTeaser;
