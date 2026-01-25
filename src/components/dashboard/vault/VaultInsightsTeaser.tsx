import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VaultInsightsTeaser = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    skillsGap: 0,
    marketValue: '$0',
    profileRank: 0
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's skills from vault
      const { data: vault } = await supabase
        .from('user_vault')
        .select('skills')
        .eq('user_id', user.id)
        .maybeSingle();

      const userSkills = vault?.skills || [];

      // Fetch trending job skills from scouted_jobs
      const { data: jobs } = await supabase
        .from('scouted_jobs')
        .select('skills')
        .eq('is_active', true)
        .limit(20);

      // Calculate skills gap
      const allJobSkills = new Set<string>();
      jobs?.forEach(job => {
        (job.skills || []).forEach((skill: string) => allJobSkills.add(skill.toLowerCase()));
      });
      
      const userSkillsLower = userSkills.map((s: string) => s.toLowerCase());
      const missingSkills = [...allJobSkills].filter(skill => !userSkillsLower.includes(skill));
      const skillsGap = Math.min(missingSkills.length, 10);

      // Calculate market value based on skills count and certifications
      const { data: certData } = await supabase
        .from('user_vault')
        .select('certifications')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const certCount = (certData?.certifications as any[] || []).length;
      const baseValue = 60000;
      const skillBonus = userSkills.length * 3000;
      const certBonus = certCount * 8000;
      const minValue = baseValue + skillBonus + certBonus;
      const maxValue = minValue + 35000;
      const marketValue = `$${Math.round(minValue/1000)}k-$${Math.round(maxValue/1000)}k`;

      // Calculate profile rank based on completeness
      const { data: resume } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      const hasResume = resume && resume.length > 0;
      let completenessScore = 0;
      if (hasResume) completenessScore += 30;
      if (userSkills.length >= 5) completenessScore += 25;
      else if (userSkills.length > 0) completenessScore += 10;
      if (certCount > 0) completenessScore += 20;
      
      // Convert to percentile rank (higher completeness = better rank)
      const profileRank = Math.max(5, 100 - Math.round(completenessScore * 0.8));

      setInsights({
        skillsGap,
        marketValue,
        profileRank
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="command-card p-5">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="command-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">Vault Insights</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Skills Gap</p>
          <p className="font-bold text-lg text-foreground">
            {insights.skillsGap === 0 ? 'Complete!' : `${insights.skillsGap} missing`}
          </p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Market Value</p>
          <p className="font-bold text-lg text-foreground">{insights.marketValue}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Profile Rank</p>
          <p className="font-bold text-lg text-foreground">Top {insights.profileRank}%</p>
        </div>
      </div>
    </div>
  );
};

export default VaultInsightsTeaser;
