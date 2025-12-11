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
import { Target, TrendingUp, BookOpen, Clock, Lock, Crown, CheckCircle } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import UpgradeModal from "./UpgradeModal";

export const SkillGapAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    userSkills: ""
  });
  const { toast } = useToast();
  const { tier, limits } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isLocked = !limits.hasSkillGap;

  const handleAnalyze = async () => {
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
      const skills = formData.userSkills.split(',').map(s => s.trim());
      
      const { data, error } = await supabase.functions.invoke('analyze-skill-gap', {
        body: {
          userSkills: skills,
          jobTitle: formData.jobTitle,
          jobDescription: formData.jobDescription
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

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      critical: "destructive",
      important: "default",
      "nice-to-have": "secondary"
    };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Premium Feature</span>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
            Skill Gap Analyzer
          </h1>
        </div>

        <Card className="max-w-lg mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Unlock Skill Gap Analyzer</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Upgrade to Premium to identify skill gaps and get personalized learning recommendations.
              </p>
            </div>

            <ul className="text-left space-y-3">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                AI-powered skill analysis
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Personalized learning paths
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Job-specific recommendations
              </li>
            </ul>

            <Button 
              onClick={() => setShowUpgradeModal(true)}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          feature="Skill Gap Analyzer"
          requiredTier="premium"
          currentTier={tier}
          limitType="feature"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Skill Gap Analysis</h3>
          </div>

          <div>
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Software Engineer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here for more accurate analysis..."
              rows={4}
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="userSkills">Your Skills * (comma-separated)</Label>
            <Textarea
              id="userSkills"
              placeholder="e.g., JavaScript, React, Node.js, Python, Docker"
              rows={3}
              value={formData.userSkills}
              onChange={(e) => setFormData({ ...formData, userSkills: e.target.value })}
            />
          </div>

          <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? "Analyzing..." : "Analyze Skill Gap"}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {analysis.match_percentage}%
              </div>
              <p className="text-muted-foreground">Skills Match</p>
              <Progress value={analysis.match_percentage} className="mt-4" />
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Matching Skills ({analysis.matching_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matching_skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-green-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                Missing Skills ({analysis.missing_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-red-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {analysis.recommendations?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Learning Recommendations
                </h4>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec: any, i: number) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold">{rec.skill}</h5>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      
                      {rec.estimated_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Clock className="w-4 h-4" />
                          <span>Estimated time: {rec.estimated_time}</span>
                        </div>
                      )}

                      {rec.learning_resources?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Learning Resources:</p>
                          <ul className="space-y-1">
                            {rec.learning_resources.map((resource: string, j: number) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
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
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};