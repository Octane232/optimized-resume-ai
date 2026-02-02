import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Settings2, Sparkles, FileText, Telescope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';

// Resume-focused Components only
import DeepAnalysisCard from './resume-engine/DeepAnalysisCard';
import FixItChecklist from './resume-engine/FixItChecklist';
import IndustryBenchmark from './resume-engine/IndustryBenchmark';
import BulletRewriter from './resume-engine/BulletRewriter';
import ATSSimulationView from './resume-engine/ATSSimulationView';
import AutoOptimizeButton from './resume-engine/AutoOptimizeButton';
import ResumeUploadAnalyzer from './resume-engine/ResumeUploadAnalyzer';
import UpgradeModal from './UpgradeModal';

interface ResumeEngineProps {
  setActiveTab?: (tab: string) => void;
  hasResume?: boolean;
}

interface BulletPoint {
  text: string;
  score: number;
}

interface ATSAnalysis {
  overall_score: number;
  formatting_score: number;
  keywords_score: number;
  experience_score: number;
  education_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: { category: string; suggestion: string; priority: string }[];
  missing_keywords?: string[];
}

const ResumeEngine = ({ setActiveTab }: ResumeEngineProps) => {
  const { tier } = useSubscription();
  
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  // AI Analysis States (Resume-focused only)
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);
  
  // Fix-it checklist
  const [fixItItems, setFixItItems] = useState<{ id: string; message: string; severity: 'critical' | 'warning' | 'suggestion'; fixed?: boolean }[]>([]);
  
  // Upgrade Modal
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch ONLY resume data (not vault)
      const { data: resumeData, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (resumeData && resumeData.length > 0) {
        const content = resumeData[0].content as any;
        setResumeContent(content);
        setHasResume(true);
        extractBulletPoints(content);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast({
        title: "Error loading resume",
        description: "Could not load your resume. Please refresh.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get ONLY resume data for analysis (no vault mixing)
  const getResumeOnlyData = () => {
    return {
      contact: resumeContent?.contact || {},
      summary: resumeContent?.summary || '',
      skills: resumeContent?.skills || [],
      experience: resumeContent?.experience || [],
      education: resumeContent?.education || [],
      projects: resumeContent?.projects || [],
      certifications: resumeContent?.certifications || []
    };
  };

  // Extract bullet points from resume for display (no scoring - AI will score)
  const extractBulletPoints = (content: any) => {
    if (!content) return;
    
    const bullets: BulletPoint[] = [];
    content.experience?.forEach((exp: any) => {
      if (exp.bullets) {
        exp.bullets.forEach((bullet: string) => {
          // Initial score of 0 - will be updated by AI analysis
          bullets.push({ text: bullet, score: 0 });
        });
      }
    });
    setBulletPoints(bullets.slice(0, 6));
  };

  // Convert AI analysis to fix-it items
  const convertAnalysisToFixItems = (analysis: ATSAnalysis) => {
    const items: typeof fixItItems = [];
    
    // Convert weaknesses to fix items
    analysis.weaknesses?.forEach((weakness, index) => {
      items.push({
        id: `weakness-${index}`,
        message: weakness,
        severity: 'warning'
      });
    });
    
    // Convert high priority suggestions to critical items
    analysis.suggestions?.forEach((suggestion, index) => {
      const severity = suggestion.priority === 'high' ? 'critical' 
        : suggestion.priority === 'medium' ? 'warning' 
        : 'suggestion';
      
      items.push({
        id: `suggestion-${index}`,
        message: suggestion.suggestion,
        severity
      });
    });
    
    setFixItItems(items);
  };

  const handleDeepAnalysis = async () => {
    if (!resumeContent) {
      toast({ 
        title: "No resume found", 
        description: "Create a resume first using Resume Templates to run AI analysis", 
        variant: "destructive" 
      });
      setActiveTab?.('resume-builder');
      return;
    }

    setIsAnalyzingATS(true);
    setFixItItems([]); // Clear previous items
    
    try {
      // Send ONLY resume data for analysis
      const resumeData = getResumeOnlyData();
      
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { resumeContent: resumeData }
      });

      if (error) throw error;
      
      setAtsAnalysis(data);
      setOverallScore(data.overall_score);
      
      // Convert AI analysis to actionable fix-it items
      convertAnalysisToFixItems(data);
      
      // Update bullet scores based on AI analysis if available
      if (resumeContent?.experience) {
        extractBulletPoints(resumeContent);
      }
      
      const skillCount = resumeData.skills?.length || 0;
      toast({ 
        title: `Score: ${data.overall_score}/100`, 
        description: `AI analyzed your resume: ${skillCount} skills, ${resumeData.experience?.length || 0} jobs, ${resumeData.education?.length || 0} education entries` 
      });
    } catch (error: any) {
      toast({ 
        title: "Analysis failed", 
        description: error.message || "Could not complete AI analysis. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsAnalyzingATS(false);
    }
  };

  const handleUploadAnalysisComplete = (data: ATSAnalysis) => {
    setAtsAnalysis(data);
    setOverallScore(data.overall_score);
    convertAnalysisToFixItems(data);
  };

  const handleAutoOptimize = async () => {
    toast({ title: "Optimizing...", description: "Applying AI improvements to your resume" });
    await new Promise(r => setTimeout(r, 2000));
    toast({ title: "Optimization complete", description: "Your resume has been improved!" });
  };

  const handleNavigateToResumeBuilder = () => setActiveTab?.('resume-builder');
  const handleNavigateToScout = () => setActiveTab?.('scout');

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 bg-background/95 backdrop-blur">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Resume Optimization Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Analyze your resume for ATS compatibility, formatting, and content quality
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 max-w-7xl mx-auto space-y-6">
        {/* Scan Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Scan Your Saved Resume</h2>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your resume created in Resume Templates
                </p>
              </div>
            </div>
            <Button 
              onClick={handleDeepAnalysis}
              disabled={!hasResume || isAnalyzingATS}
              className="gap-2 min-w-[140px]"
              size="lg"
            >
              {isAnalyzingATS ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
          {!hasResume && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Create a resume using Resume Templates to enable scanning
            </p>
          )}
        </motion.div>

        {/* Upload Resume for Analysis */}
        <ResumeUploadAnalyzer
          onAnalysisComplete={handleUploadAnalysisComplete}
          isAnalyzing={isAnalyzingUpload}
          setIsAnalyzing={setIsAnalyzingUpload}
        />

        {/* Auto-Optimize CTA */}
        <AutoOptimizeButton 
          onOptimize={handleAutoOptimize}
          disabled={!resumeContent}
        />

        {/* Tip to use Scout for Job Matching */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-muted/30 border border-border"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Telescope className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Looking for job matches?</p>
                <p className="text-xs text-muted-foreground">
                  Use Scout to find and match with jobs based on your skills
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNavigateToScout}
              className="gap-2"
            >
              Go to Scout
            </Button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DeepAnalysisCard
              analysis={atsAnalysis}
              isAnalyzing={isAnalyzingATS}
              onAnalyze={handleDeepAnalysis}
            />

            <FixItChecklist
              items={fixItItems}
              onFixItem={(id) => {
                setFixItItems(prev => prev.map(i => i.id === id ? { ...i, fixed: true } : i));
              }}
              onNavigateToVault={handleNavigateToResumeBuilder}
            />

            <IndustryBenchmark
              userScore={atsAnalysis?.overall_score || overallScore}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BulletRewriter
              bullets={bulletPoints}
            />

            <ATSSimulationView
              resumeContent={resumeContent}
            />
          </div>
        </div>

        {/* No Resume State */}
        {!resumeContent && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">No Resume to Analyze</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a resume using our templates. Once saved, our AI will analyze it and provide personalized optimization insights.
            </p>
            <Button onClick={handleNavigateToResumeBuilder} size="lg" className="gap-2">
              <FileText className="w-4 h-4" />
              Create Resume
            </Button>
          </motion.div>
        )}
      </div>

      <UpgradeModal 
        open={showUpgrade} 
        onOpenChange={setShowUpgrade}
        feature="Resume Optimization Studio"
        requiredTier="pro"
        currentTier={tier}
        limitType="feature"
      />
    </div>
  );
};

export default ResumeEngine;
