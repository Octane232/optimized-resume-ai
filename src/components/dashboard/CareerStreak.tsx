import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar, 
  Star, 
  Crown,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CareerStreakProps {
  compact?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const CareerStreak: React.FC<CareerStreakProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const { tier } = useSubscription();
  const isPremium = tier === 'premium' || tier === 'pro';

  // Simulated streak data (would come from database in production)
  const [streakData, setStreakData] = useState({
    currentStreak: 7,
    longestStreak: 14,
    totalDaysActive: 23,
    weeklyGoalProgress: 3,
    weeklyGoal: 5,
    lastActiveDate: new Date().toISOString(),
    xpEarned: 1250,
    level: 3
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-resume',
      name: 'Resume Builder',
      description: 'Create your first resume',
      icon: <CheckCircle2 className="w-4 h-4" />,
      unlocked: true
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: '7-day login streak',
      icon: <Flame className="w-4 h-4" />,
      unlocked: true
    },
    {
      id: 'goal-crusher',
      name: 'Goal Crusher',
      description: 'Hit weekly goal 4 weeks in a row',
      icon: <Target className="w-4 h-4" />,
      unlocked: false,
      progress: 2,
      target: 4
    },
    {
      id: 'application-master',
      name: 'Application Master',
      description: 'Apply to 50 jobs',
      icon: <Trophy className="w-4 h-4" />,
      unlocked: false,
      progress: 12,
      target: 50
    },
    {
      id: 'interview-ace',
      name: 'Interview Ace',
      description: 'Complete 10 mock interviews',
      icon: <Award className="w-4 h-4" />,
      unlocked: false,
      progress: 3,
      target: 10
    }
  ]);

  const xpForNextLevel = 500;
  const currentLevelXp = streakData.xpEarned % xpForNextLevel;
  const levelProgress = (currentLevelXp / xpForNextLevel) * 100;

  // Weekly days indicator
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, true, false, true, true]; // Example

  if (compact) {
    return (
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                {streakData.currentStreak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{streakData.currentStreak}</span>
                  <span className="text-sm text-muted-foreground">day streak</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Level {streakData.level} • {streakData.xpEarned} XP
                </p>
              </div>
            </div>

            {/* Week Progress */}
            <div className="flex gap-1">
              {weekDays.map((day, i) => (
                <div 
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${activeDays[i] 
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                      : 'bg-muted/50 text-muted-foreground'
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Streak Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Streak Badge */}
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                {streakData.currentStreak >= 7 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                    <Star className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </motion.div>

              <div>
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {streakData.currentStreak}
                  </motion.span>
                  <span className="text-lg text-muted-foreground">day streak</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Best: {streakData.longestStreak} days • {streakData.totalDaysActive} total days
                </p>
              </div>
            </div>

            {/* Premium XP Bonus */}
            {isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                <Zap className="w-3 h-3" />
                2x XP
              </Badge>
            )}
          </div>

          {/* Level Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium">Level {streakData.level}</span>
              </div>
              <span className="text-muted-foreground">
                {currentLevelXp} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="p-4 rounded-xl bg-muted/30 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Weekly Goal</span>
              </div>
              <span className="text-sm">
                {streakData.weeklyGoalProgress} / {streakData.weeklyGoal} applications
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(streakData.weeklyGoalProgress / streakData.weeklyGoal) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>

          {/* Week Days */}
          <div className="flex justify-between">
            {weekDays.map((day, i) => (
              <motion.div 
                key={i}
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${activeDays[i] 
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30' 
                      : 'bg-muted/50 text-muted-foreground'
                    }`}
                >
                  {activeDays[i] ? <CheckCircle2 className="w-4 h-4" /> : day}
                </div>
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h4 className="font-semibold text-sm">Achievements</h4>
            </div>
            <span className="text-xs text-muted-foreground">
              {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20' 
                    : 'bg-muted/30 border-transparent opacity-60'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-xs truncate">{achievement.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="mt-1.5">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary/50 rounded-full"
                            style={{ width: `${(achievement.progress / (achievement.target || 1)) * 100}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5">
                          {achievement.progress} / {achievement.target}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!isPremium && (
            <Button 
              className="w-full mt-4 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              size="sm"
              onClick={() => navigate('/dashboard?tab=settings')}
            >
              <Crown className="w-4 h-4" />
              Get 2x XP with Pro
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerStreak;
