import React from 'react';
import { FileText, Award, FolderKanban, Tag, Trophy, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AchievementBadgesProps {
  hasResume: boolean;
  skillsCount: number;
  certificationsCount: number;
  projectsCount: number;
}

const AchievementBadges = ({ hasResume, skillsCount, certificationsCount, projectsCount }: AchievementBadgesProps) => {
  const achievements = [
    {
      id: 'resume',
      icon: FileText,
      label: 'Resume Uploaded',
      unlocked: hasResume,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      id: 'skills',
      icon: Star,
      label: 'Skill Master',
      description: '10+ skills added',
      unlocked: skillsCount >= 10,
      color: 'from-purple-500 to-pink-400',
    },
    {
      id: 'certs',
      icon: Award,
      label: 'Certified Pro',
      description: '3+ certifications',
      unlocked: certificationsCount >= 3,
      color: 'from-amber-500 to-orange-400',
    },
    {
      id: 'projects',
      icon: FolderKanban,
      label: 'Portfolio Builder',
      description: '5+ projects',
      unlocked: projectsCount >= 5,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      id: 'complete',
      icon: Trophy,
      label: 'Vault Master',
      description: 'Complete profile',
      unlocked: hasResume && skillsCount >= 10 && certificationsCount >= 3 && projectsCount >= 5,
      color: 'from-yellow-400 to-amber-500',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="command-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-foreground text-sm">Achievements</h3>
        </div>
        <span className="text-xs text-muted-foreground">{unlockedCount}/{achievements.length} unlocked</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1">
        <TooltipProvider>
          {achievements.map((achievement) => (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    achievement.unlocked 
                      ? `bg-gradient-to-br ${achievement.color} shadow-lg` 
                      : "bg-muted/50 border border-dashed border-border"
                  )}
                >
                  <achievement.icon 
                    className={cn(
                      "w-5 h-5",
                      achievement.unlocked ? "text-white" : "text-muted-foreground/50"
                    )} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{achievement.label}</p>
                {achievement.description && (
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                )}
                {!achievement.unlocked && (
                  <p className="text-xs text-amber-500 mt-1">Locked</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AchievementBadges;
