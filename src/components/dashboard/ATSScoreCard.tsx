import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ATSScoreCardProps {
  resumeId: string;
  resumeContent: any;
}

export const ATSScoreCard = ({ resumeId, resumeContent }: ATSScoreCardProps) => {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<any>(null);
  const { toast } = useToast();

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { resumeContent, resumeId }
      });

      if (error) throw error;

      // Save score to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('resume_scores').insert({
          user_id: user.id,
          resume_id: resumeId,
          overall_score: data.overall_score,
          formatting_score: data.formatting_score,
          keywords_score: data.keywords_score,
          experience_score: data.experience_score,
          education_score: data.education_score,
          suggestions: data.suggestions,
          missing_keywords: data.missing_keywords || [],
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || []
        });
      }

      setScore(data);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed for ATS compatibility."
      });
    } catch (error: any) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge variant="destructive">Needs Work</Badge>;
  };

  if (!score) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">ATS Score</h3>
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-muted-foreground mb-4">
          Get your resume analyzed by AI to see how well it performs with Applicant Tracking Systems.
        </p>
        <Button onClick={analyzeResume} disabled={loading} className="w-full">
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">ATS Score</h3>
          </div>
          {getScoreBadge(score.overall_score)}
        </div>

        <div className="text-center">
          <div className={`text-5xl font-bold ${getScoreColor(score.overall_score)}`}>
            {score.overall_score}
          </div>
          <p className="text-muted-foreground mt-1">Overall Score</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Formatting</span>
              <span className="font-semibold">{score.formatting_score}/100</span>
            </div>
            <Progress value={score.formatting_score} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Keywords</span>
              <span className="font-semibold">{score.keywords_score}/100</span>
            </div>
            <Progress value={score.keywords_score} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Experience</span>
              <span className="font-semibold">{score.experience_score}/100</span>
            </div>
            <Progress value={score.experience_score} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Education</span>
              <span className="font-semibold">{score.education_score}/100</span>
            </div>
            <Progress value={score.education_score} />
          </div>
        </div>

        {score.strengths?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm">Strengths</h4>
            </div>
            <ul className="space-y-1">
              {score.strengths.map((strength: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {score.weaknesses?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-sm">Areas to Improve</h4>
            </div>
            <ul className="space-y-1">
              {score.weaknesses.map((weakness: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}

        {score.suggestions?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Recommendations</h4>
            </div>
            <div className="space-y-2">
              {score.suggestions.map((item: any, i: number) => (
                <div key={i} className="text-sm border-l-2 border-primary pl-3 py-1">
                  <div className="font-medium">{item.category}</div>
                  <div className="text-muted-foreground">{item.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={analyzeResume} disabled={loading} variant="outline" className="w-full">
          {loading ? "Re-analyzing..." : "Re-analyze Resume"}
        </Button>
      </div>
    </Card>
  );
};