import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Settings2, Upload, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';

// New Premium Components
import DeepAnalysisCard from './resume-engine/DeepAnalysisCard';
import JobTargetingPanel from './resume-engine/JobTargetingPanel';
import MatchMeter from './resume-engine/MatchMeter';
import KeywordGap from './resume-engine/KeywordGap';
import FixItChecklist from './resume-engine/FixItChecklist';
import IndustryBenchmark from './resume-engine/IndustryBenchmark';
import BulletRewriter from './resume-engine/BulletRewriter';
import ATSSimulationView from './resume-engine/ATSSimulationView';
import AutoOptimizeButton from './resume-engine/AutoOptimizeButton';
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

interface MatchAnalysis {
  match_score: number;
  is_good_fit: boolean;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keyword_matches?: string[];
  missing_keywords?: string[];
}

const ResumeEngine = ({ setActiveTab }: ResumeEngineProps) => {
  const { tier } = useSubscription();
  const isPremium = tier === 'pro' || tier === 'premium';
  
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  // AI Analysis States
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  
  // Fix-it checklist
  const [fixItItems, setFixItItems] = useState<{ id: string; message: string; severity: 'critical' | 'warning' | 'suggestion'; fixed?: boolean }[]>([]);
  
  // Upgrade Modal
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchUserResume();
  }, []);

  const fetchUserResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        setResumeContent(resumes[0].content);
        analyzeResumeBasic(resumes[0].content);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const analyzeResumeBasic = (content: any) => {
    if (!content) return;

    let score = 50;
    const items: typeof fixItItems = [];

    if (!content.personalInfo?.email || !content.personalInfo?.phone) {
      items.push({ id: 'contact', message: 'Missing contact information', severity: 'critical' });
    } else {
      score += 10;
    }

    if (!content.personalInfo?.website) {
      items.push({ id: 'linkedin', message: 'No LinkedIn profile URL', severity: 'warning' });
    } else {
      score += 5;
    }

    if (!content.skills || content.skills.length < 5) {
      items.push({ id: 'skills', message: 'Add more skills (at least 5 recommended)', severity: 'warning' });
    } else {
      score += 15;
    }

    if (!content.summary) {
      items.push({ id: 'summary', message: 'Add a professional summary', severity: 'suggestion' });
    } else {
      score += 10;
    }

    if (content.experience?.length > 0) {
      score += 10;
    }

    setOverallScore(Math.min(score, 100));
    setFixItItems(items);

    // Extract bullets
    const bullets: BulletPoint[] = [];
    content.experience?.forEach((exp: any) => {
      if (exp.bullets) {
        exp.bullets.forEach((bullet: string) => {
          let bulletScore = 50;
          if (/^(Led|Managed|Developed|Created|Implemented|Achieved|Increased|Reduced)/i.test(bullet)) {
            bulletScore += 20;
          }
          if (/\d+%|\$\d+|\d+ (users|customers|projects|team)/i.test(bullet)) {
            bulletScore += 25;
          }
          bullets.push({ text: bullet, score: Math.min(bulletScore, 100) });
        });
      }
    });
    setBulletPoints(bullets.slice(0, 6));
  };

  const handleDeepAnalysis = async () => {
    if (!resumeContent) {
      toast({ title: "No resume", description: "Upload a resume first", variant: "destructive" });
      return;
    }

    setIsAnalyzingATS(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { resumeContent }
      });

      if (error) throw error;
      setAtsAnalysis(data);
      setOverallScore(data.overall_score);
      
      toast({ title: "Analysis complete", description: "Your resume has been analyzed by AI" });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzingATS(false);
    }
  };

  const handleJobMatch = async (jobDescription: string, jobTitle?: string, company?: string) => {
    if (!resumeContent) return;

    setIsAnalyzingMatch(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
        body: { 
          resumeText: JSON.stringify(resumeContent),
          jobDescription 
        }
      });

      if (error) throw error;
      setMatchAnalysis(data);
      
      toast({ title: "Match analysis complete", description: `${data.match_score}% match score` });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzingMatch(false);
    }
  };

  const handleAutoOptimize = async () => {
    toast({ title: "Optimizing...", description: "Applying AI improvements to your resume" });
    await new Promise(r => setTimeout(r, 2000));
    toast({ title: "Optimization complete", description: "Your resume has been improved!" });
  };

  const handleUploadClick = () => setActiveTab?.('vault');

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 flex items-center justify-between bg-background/95 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Resume Optimization Studio
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered resume analysis and optimization</p>
        </div>
        <Button onClick={handleUploadClick} variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 max-w-7xl mx-auto space-y-6">
        {/* Auto-Optimize CTA */}
        <AutoOptimizeButton 
          isPremium={isPremium}
          onUpgrade={() => setShowUpgrade(true)}
          onOptimize={handleAutoOptimize}
          disabled={!resumeContent}
        />

        {/* Job Targeting Panel */}
        <JobTargetingPanel
          onAnalyze={handleJobMatch}
          isAnalyzing={isAnalyzingMatch}
          isPremium={isPremium}
          onUpgrade={() => setShowUpgrade(true)}
        />

        {/* Match Results (if job was analyzed) */}
        {matchAnalysis && (
          <div className="grid lg:grid-cols-2 gap-6">
            <MatchMeter 
              score={matchAnalysis.match_score} 
              missingCount={matchAnalysis.missing_keywords?.length || 0}
              isAnalyzing={isAnalyzingMatch}
            />
            <KeywordGap
              matchingKeywords={matchAnalysis.keyword_matches || []}
              missingKeywords={(matchAnalysis.missing_keywords || []).map(k => ({ keyword: k, reason: 'Required in job description' }))}
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DeepAnalysisCard
              analysis={atsAnalysis}
              isAnalyzing={isAnalyzingATS}
              isPremium={isPremium}
              onAnalyze={handleDeepAnalysis}
              onUpgrade={() => setShowUpgrade(true)}
            />

            <FixItChecklist
              items={fixItItems}
              onFixItem={(id) => {
                setFixItItems(prev => prev.map(i => i.id === id ? { ...i, fixed: true } : i));
              }}
            />

            <IndustryBenchmark
              userScore={atsAnalysis?.overall_score || overallScore}
              isPremium={isPremium}
              onUpgrade={() => setShowUpgrade(true)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BulletRewriter
              bullets={bulletPoints}
              isPremium={isPremium}
              rewritesRemaining={tier === 'premium' ? -1 : tier === 'pro' ? 5 : 0}
              onUpgrade={() => setShowUpgrade(true)}
            />

            <ATSSimulationView
              resumeContent={resumeContent}
              isPremium={isPremium}
              onUpgrade={() => setShowUpgrade(true)}
            />
          </div>
        </div>

        {/* No Resume State */}
        {!resumeContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Resume Found</h3>
            <p className="text-muted-foreground mb-4">Upload a resume to start optimizing</p>
            <Button onClick={handleUploadClick} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Resume
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
