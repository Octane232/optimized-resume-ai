import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  DollarSign,
  Star,
  Send,
  History
} from 'lucide-react';

interface GrowthDashboardProps {
  setActiveTab: (tab: string) => void;
}

interface CareerWin {
  id: string;
  content: string;
  formatted_content: string | null;
  created_at: string;
}

const GrowthDashboard: React.FC<GrowthDashboardProps> = ({ setActiveTab }) => {
  const [userName, setUserName] = useState('');
  const [weeklyWin, setWeeklyWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentWins, setRecentWins] = useState<CareerWin[]>([]);
  const [winsCount, setWinsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      } else {
        setUserName(user.email?.split('@')[0] || 'there');
      }

      // Fetch recent wins
      const { data: wins, count } = await supabase
        .from('career_wins')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (wins) {
        setRecentWins(wins);
      }
      if (count !== null) {
        setWinsCount(count);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleWinSubmit = async () => {
    if (!weeklyWin.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate week number and year
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((now.getTime() - start.getTime()) / 86400000) + start.getDay() + 1) / 7);
      const year = now.getFullYear();

      // Format the win for annual review (simulated AI enhancement)
      const formattedContent = `• ${weeklyWin.trim().charAt(0).toUpperCase() + weeklyWin.trim().slice(1)}${weeklyWin.endsWith('.') ? '' : '.'}`;

      const { data: newWin, error } = await supabase
        .from('career_wins')
        .insert({
          user_id: user.id,
          content: weeklyWin.trim(),
          formatted_content: formattedContent,
          week_number: weekNumber,
          year: year,
          category: 'general'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Win Logged!",
        description: "I've formatted this for your annual review."
      });

      // Update local state
      if (newWin) {
        setRecentWins([newWin, ...recentWins.slice(0, 4)]);
        setWinsCount(prev => prev + 1);
      }
      
      setWeeklyWin('');
    } catch (error) {
      console.error('Error saving win:', error);
      toast({
        title: "Error",
        description: "Could not save your win. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsProgress = [
    { skill: 'Budget Management', current: 60, required: 100, status: 'in-progress' },
    { skill: 'Team Leadership', current: 85, required: 100, status: 'almost' },
    { skill: 'Strategic Planning', current: 100, required: 100, status: 'complete' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-20 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-48 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-48 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground">
          Let's build your career trajectory. Every win counts.
        </p>
      </div>

      {/* Priority Cards Feed */}
      <div className="space-y-4">
        {/* Win Logger - Priority High */}
        <Card className="border-l-4 border-l-[hsl(262,83%,58%)] bg-gradient-to-r from-[hsl(262,83%,58%)]/5 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-[hsl(262,83%,58%)] text-white">Weekly Check-In</Badge>
              <span className="text-xs text-muted-foreground">Friday</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(262,83%,58%)]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[hsl(262,83%,58%)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">The Win Logger</h3>
                <p className="text-muted-foreground mb-4">
                  It's Friday. What was your biggest win this week? I'll format it for your annual review.
                </p>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="e.g., Fixed a critical bug that was affecting 1000 users..."
                    value={weeklyWin}
                    onChange={(e) => setWeeklyWin(e.target.value)}
                    className="min-h-[80px] border-[hsl(262,83%,58%)]/30 focus:border-[hsl(262,83%,58%)]"
                  />
                  <Button 
                    onClick={handleWinSubmit}
                    disabled={!weeklyWin.trim() || isSubmitting}
                    className="gap-2 bg-[hsl(262,83%,58%)] hover:bg-[hsl(262,83%,50%)]"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Formatting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Log Win
                      </>
                    )}
                  </Button>
                </div>

                {/* Recent Wins */}
                {recentWins.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recent Wins</span>
                    </div>
                    <div className="space-y-2">
                      {recentWins.slice(0, 3).map((win) => (
                        <div key={win.id} className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-lg">
                          {win.formatted_content || win.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Sentinel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Salary Sentinel</h3>
                <p className="text-muted-foreground mb-4">
                  <span className="text-orange-500 font-semibold">Inflation Alert:</span> Your salary is currently <span className="font-semibold text-foreground">12% below</span> the market average for Senior Managers.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Your Salary</span>
                    <span className="text-muted-foreground">Market Average</span>
                  </div>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: '88%' }}
                    />
                    <div 
                      className="absolute right-0 top-0 h-full w-3 bg-green-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-foreground font-medium">$125,000</span>
                    <span className="text-green-500 font-medium">$142,000</span>
                  </div>
                </div>

                <Button variant="outline" className="gap-2">
                  View Negotiation Script
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotion Roadmap */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(262,83%,58%)]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[hsl(262,83%,58%)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">The Promotion Roadmap</h3>
                <p className="text-muted-foreground mb-4">
                  You're at <span className="font-semibold text-foreground">Level 4 of 5</span> to reach Director Level.
                </p>
                
                <div className="space-y-4 mb-4">
                  {skillsProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium flex items-center gap-2">
                          {item.skill}
                          {item.status === 'complete' && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                        </span>
                        <span className="text-muted-foreground">{item.current}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                            item.status === 'complete' 
                              ? 'bg-green-500' 
                              : item.status === 'almost'
                                ? 'bg-amber-500'
                                : 'bg-[hsl(262,83%,58%)]'
                          }`}
                          style={{ width: `${item.current}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="gap-2 bg-[hsl(262,83%,58%)] hover:bg-[hsl(262,83%,50%)]">
                  <BookOpen className="w-4 h-4" />
                  Find Courses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(262,83%,58%)]/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[hsl(262,83%,58%)]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{winsCount}</p>
                <p className="text-sm text-muted-foreground">Wins Logged</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">80%</p>
                <p className="text-sm text-muted-foreground">Promotion Progress</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-green-500 fill-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Skills Mastered</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrowthDashboard;
