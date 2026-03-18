import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target, TrendingUp, BookOpen, Clock, Coins, Lock } from "lucide-react";
import { useUsageLimit } from "@/contexts/UsageLimitContext";

// ===== Type Definitions =====
interface FormData {
  jobTitle: string;
  jobDescription: string;
  userSkills: string;
}

interface Analysis {
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  required_skills: string[];
  recommendations: Recommendation[];
}

interface Recommendation {
  skill: string;
  priority: 'critical' | 'important' | 'nice-to-have';
  estimated_time?: string;
  learning_resources?: string[];
}

// ===== Helper Functions =====
const getPriorityBadge = (priority: string) => {
  const variants: Record<string, "default" | "destructive" | "secondary"> = {
    critical: "destructive",
    important: "default",
    "nice-to-have": "secondary"
  };
  
  return (
    <Badge variant={variants[priority] || "secondary"}>
      {priority}
    </Badge>
  );
};

// ===== Main Component =====
export const SkillGapAnalyzer = () => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { canUse, trackUsage } = useUsageLimit();

  // ===== State =====
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    userSkills: ""
  });
  const [showDetailedAdvice, setShowDetailedAdvice] = useState(false);

  // ===== Event Handlers =====
  const handleAnalyze = async () => {
    // Validate input
    if (!formData.jobTitle || !formData.userSkills) {
      toast({
        title: "Missing Information",
        description: "Please provide job title and your skills",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Parse skills from comma-separated string
      const skills = formData.userSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);

      // Call analysis function
      const { data, error } = await supabase.functions.invoke('analyze-skill-gap', {
        body: {
          userSkills: skills,
          jobTitle: formData.jobTitle,
          jobDescription: formData.jobDescription || undefined
        }
      });

      if (error) throw error;

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('skill_gaps').insert({
          user_id: user.id,
          job_title: formData.jobTitle,
          required_skills: data.required_skills,
          user_skills: skills,
          missing_skills: data.missing_skills,
          matching_skills: data.matching_skills,
          match_percentage: data.match_percentage,
          recommendations: data.recommendations
        });
      }

      // Analysis is FREE - no credit charge
      setShowDetailedAdvice(false);
      setAnalysis(data);

      toast({
        title: "Analysis Complete",
        description: "Your skill gap analysis is ready."
      });

    } catch (error: any) {
      console.error('Error analyzing skill gap:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze skills. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockDetails = async () => {
    const credited = await trackUsage('skill_gap');
    if (credited) {
      setShowDetailedAdvice(true);
    }
  };

  // ===== Render =====
  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <InputFormCard
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onAnalyze={handleAnalyze}
      />

      {/* Analysis Results */}
      {analysis && (
        <AnalysisResultsCard
          analysis={analysis}
          showDetailedAdvice={showDetailedAdvice}
          canUnlock={canUse('skill_gap')}
          onUnlock={handleUnlockDetails}
        />
      )}
    </div>
  );
};

// ===== Subcomponents =====

interface InputFormCardProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  loading: boolean;
  onAnalyze: () => Promise<void>;
}

const InputFormCard: React.FC<InputFormCardProps> = ({
  formData,
  setFormData,
  loading,
  onAnalyze,
}) => (
  <Card className="p-6">
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Skill Gap Analysis</h3>
      </div>

      {/* Job Title Input */}
      <div>
        <Label htmlFor="jobTitle">
          Job Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="jobTitle"
          placeholder="e.g., Senior Software Engineer"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
        />
      </div>

      {/* Job Description Input */}
      <div>
        <Label htmlFor="jobDescription">
          Job Description <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here for more accurate analysis..."
          rows={4}
          value={formData.jobDescription}
          onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
        />
      </div>

      {/* User Skills Input */}
      <div>
        <Label htmlFor="userSkills">
          Your Skills <span className="text-destructive">*</span>
          <span className="text-muted-foreground text-xs ml-2">(comma-separated)</span>
        </Label>
        <Textarea
          id="userSkills"
          placeholder="e.g., JavaScript, React, Node.js, Python, Docker"
          rows={3}
          value={formData.userSkills}
          onChange={(e) => setFormData({ ...formData, userSkills: e.target.value })}
        />
      </div>

      {/* Analyze Button */}
      <Button onClick={onAnalyze} disabled={loading} className="w-full">
        {loading ? "Analyzing..." : "Analyze Skill Gap"}
      </Button>
    </div>
  </Card>
);

interface AnalysisResultsCardProps {
  analysis: Analysis;
  showDetailedAdvice: boolean;
  canUnlock: boolean;
  onUnlock: () => Promise<void>;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({
  analysis,
  showDetailedAdvice,
  canUnlock,
  onUnlock,
}) => (
  <Card className="p-6">
    <div className="space-y-6">
      {/* Match Percentage */}
      <MatchPercentage percentage={analysis.match_percentage} />

      {/* Matching Skills */}
      <SkillsSection
        title="Matching Skills"
        icon={TrendingUp}
        iconColor="text-green-600"
        skills={analysis.matching_skills}
        badgeVariant="outline"
        badgeClassName="bg-green-50"
      />

      {/* Missing Skills */}
      <SkillsSection
        title="Missing Skills"
        icon={Target}
        iconColor="text-red-600"
        skills={analysis.missing_skills}
        badgeVariant="outline"
        badgeClassName="bg-red-50"
      />

      {/* Learning Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <RecommendationsSection
          recommendations={analysis.recommendations}
          showDetailed={showDetailedAdvice}
          canUnlock={canUnlock}
          onUnlock={onUnlock}
        />
      )}
    </div>
  </Card>
);

interface MatchPercentageProps {
  percentage: number;
}

const MatchPercentage: React.FC<MatchPercentageProps> = ({ percentage }) => (
  <div className="text-center">
    <div className="text-5xl font-bold text-primary mb-2">
      {percentage}%
    </div>
    <p className="text-muted-foreground">Skills Match</p>
    <Progress value={percentage} className="mt-4" />
  </div>
);

interface SkillsSectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  skills: string[];
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeClassName: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  skills,
  badgeVariant,
  badgeClassName,
}) => (
  <div>
    <h4 className="font-semibold mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      {title} ({skills.length})
    </h4>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant={badgeVariant} className={badgeClassName}>
          {skill}
        </Badge>
      ))}
    </div>
  </div>
);

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  showDetailed: boolean;
  canUnlock: boolean;
  onUnlock: () => Promise<void>;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  showDetailed,
  canUnlock,
  onUnlock,
}) => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        Learning Recommendations
      </h4>

      {!showDetailed && (
        <Button
          size="sm"
          variant="outline"
          disabled={!canUnlock}
          onClick={onUnlock}
          className="gap-1.5"
        >
          <Lock className="w-3 h-3" />
          Unlock Details
          <span className="inline-flex items-center gap-0.5 text-xs opacity-80">
            <Coins className="w-3 h-3" />1
          </span>
        </Button>
      )}
    </div>

    {/* Content */}
    {showDetailed ? (
      <DetailedRecommendations recommendations={recommendations} />
    ) : (
      <LockedRecommendations recommendations={recommendations} />
    )}
  </div>
);

interface DetailedRecommendationsProps {
  recommendations: Recommendation[];
}

const DetailedRecommendations: React.FC<DetailedRecommendationsProps> = ({
  recommendations,
}) => (
  <div className="space-y-4">
    {recommendations.map((rec, index) => (
      <Card key={index} className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h5 className="font-semibold">{rec.skill}</h5>
          {getPriorityBadge(rec.priority)}
        </div>

        {/* Estimated Time */}
        {rec.estimated_time && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Estimated time: {rec.estimated_time}</span>
          </div>
        )}

        {/* Learning Resources */}
        {rec.learning_resources && rec.learning_resources.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Learning Resources:</p>
            <ul className="space-y-1">
              {rec.learning_resources.map((resource, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span>•</span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    ))}
  </div>
);

interface LockedRecommendationsProps {
  recommendations: Recommendation[];
}

const LockedRecommendations: React.FC<LockedRecommendationsProps> = ({
  recommendations,
}) => (
  <div className="space-y-2">
    {recommendations.map((rec, index) => (
      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{rec.skill}</span>
          {getPriorityBadge(rec.priority)}
        </div>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
    ))}

    <p className="text-xs text-muted-foreground text-center mt-2">
      Unlock detailed learning paths, time estimates, and resources
    </p>
  </div>
);
