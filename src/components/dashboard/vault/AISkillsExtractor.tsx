import React, { useState } from 'react';
import { Sparkles, Check, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AISkillsExtractorProps {
  isPremium: boolean;
  existingSkills: string[];
  resumeSkills: string[];
  onAddSkill: (skill: string) => void;
  onUpgrade: () => void;
}

const AISkillsExtractor = ({ 
  isPremium, 
  existingSkills, 
  resumeSkills,
  onAddSkill, 
  onUpgrade 
}: AISkillsExtractorProps) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleExtract = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }

    setIsExtracting(true);
    
    // Simulate AI extraction (uses existing resume skills)
    setTimeout(() => {
      // Filter out skills already added and normalize
      const existingLower = existingSkills.map(s => s.toLowerCase());
      const newSuggestions = resumeSkills
        .filter(skill => !existingLower.includes(skill.toLowerCase()))
        .slice(0, 8);
      
      // If no skills from resume, suggest common ones
      if (newSuggestions.length === 0 && resumeSkills.length === 0) {
        setSuggestions(['Communication', 'Problem Solving', 'Team Leadership', 'Project Management']);
      } else {
        setSuggestions(newSuggestions);
      }
      
      setShowSuggestions(true);
      setIsExtracting(false);
    }, 1200);
  };

  const handleAddSuggestion = (skill: string) => {
    onAddSkill(skill);
    setSuggestions(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 text-xs gap-1.5 border-primary/30 hover:border-primary hover:bg-primary/5"
        onClick={handleExtract}
        disabled={isExtracting}
      >
        {isExtracting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        )}
        {isExtracting ? 'Extracting...' : 'AI Extract Skills'}
        {!isPremium && (
          <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">PRO</Badge>
        )}
      </Button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            Suggested from your resume:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((skill) => {
              const isAdded = existingSkills.some(
                s => s.toLowerCase() === skill.toLowerCase()
              );
              return (
                <Badge 
                  key={skill}
                  variant={isAdded ? "default" : "outline"}
                  className={`text-xs cursor-pointer transition-all ${
                    isAdded 
                      ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' 
                      : 'hover:bg-primary/10 hover:border-primary'
                  }`}
                  onClick={() => !isAdded && handleAddSuggestion(skill)}
                >
                  {isAdded ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 mr-1" />
                  )}
                  {skill}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISkillsExtractor;
