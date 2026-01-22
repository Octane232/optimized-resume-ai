import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Hardcoded trending skills list
const TRENDING_SKILLS = [
  'Python', 'React', 'TypeScript', 'AI', 'Machine Learning', 'AWS', 'Kubernetes',
  'Docker', 'SQL', 'Node.js', 'Go', 'Rust', 'Next.js', 'GraphQL', 'Terraform',
  'Data Science', 'Product Management', 'Agile', 'Scrum', 'Leadership',
  'Communication', 'Problem Solving', 'Cloud Computing', 'DevOps', 'CI/CD',
  'JavaScript', 'Java', 'C++', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch',
  'Figma', 'UX Design', 'UI Design', 'System Design', 'Microservices',
  'REST API', 'Cybersecurity', 'Blockchain', 'Web3', 'Generative AI', 'LLM',
  'ChatGPT', 'Prompt Engineering', 'Data Analytics', 'Power BI', 'Tableau'
];

interface TrendingSkillBadgeProps {
  skill: string;
  onRemove: () => void;
}

const TrendingSkillBadge = ({ skill, onRemove }: TrendingSkillBadgeProps) => {
  const isTrending = TRENDING_SKILLS.some(
    ts => ts.toLowerCase() === skill.toLowerCase()
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1 pr-1 text-xs group cursor-default">
            {skill}
            {isTrending && (
              <Flame className="w-3 h-3 text-orange-500 ml-0.5" />
            )}
            <button 
              onClick={onRemove}
              className="ml-1 hover:text-destructive"
            >
              <span className="w-3 h-3 flex items-center justify-center">×</span>
            </button>
          </Badge>
        </TooltipTrigger>
        {isTrending && (
          <TooltipContent className="max-w-[200px]">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="font-medium text-orange-500">Trending Skill</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>High demand (+34% YoY)</span>
              </div>
              <p className="text-xs text-muted-foreground">+$12k avg salary impact</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrendingSkillBadge;

export { TRENDING_SKILLS };