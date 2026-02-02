import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Settings2, Upload, Sparkles, FileText, Database } from 'lucide-react';
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
import RecommendationsPanel from './resume-engine/RecommendationsPanel';
import VaultDataIndicator from './resume-engine/VaultDataIndicator';
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
  fit_summary?: string;
  strengths: { point: string; impact: 'high' | 'medium' }[];
  gaps: { gap: string; severity: 'critical' | 'moderate' | 'minor'; suggestion: string }[];
  recommendations: { action: string; section: 'summary' | 'experience' | 'skills' | 'education' | 'other'; priority: 'high' | 'medium' | 'low'; example?: string }[];
  keyword_matches?: string[];
  missing_keywords?: { keyword: string; importance: 'must-have' | 'nice-to-have'; context?: string }[];
  ats_warnings?: string[];
}

interface VaultCertification {
  name: string;
  issuer?: string;
  dateEarned?: string;
  credentialLink?: string;
}

interface VaultProject {
  name: string;
  description?: string;
  technologies?: string;
  liveLink?: string;
}

const ResumeEngine = ({ setActiveTab }: ResumeEngineProps) => {
  const { tier } = useSubscription();
  const isPremium = tier === 'pro' || tier === 'premium';
  
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  const [isLoadingVault, setIsLoadingVault] = useState(true);
  
  // Vault data states
  const [vaultSkills, setVaultSkills] = useState<string[]>([]);
  const [vaultCertifications, setVaultCertifications] = useState<VaultCertification[]>([]);
  const [vaultProjects, setVaultProjects] = useState<VaultProject[]>([]);
  
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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoadingVault(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingVault(false);
        return;
      }

      // Fetch resume and vault data in parallel
      const [resumeResult, vaultResult] = await Promise.all([
        supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1),
        supabase
          .from('user_vault')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      // Process resume data
      if (resumeResult.data && resumeResult.data.length > 0) {
        const content = resumeResult.data[0].content as any;
        setResumeContent(content);
        setHasResume(true);
        analyzeResumeBasic(content);
      }

      // Process vault data
      if (vaultResult.data) {
        setVaultSkills(vaultResult.data.skills || []);
        setVaultCertifications((vaultResult.data.certifications as unknown as VaultCertification[]) || []);
        setVaultProjects((vaultResult.data.projects as unknown as VaultProject[]) || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: "Could not load your resume and vault data. Please refresh.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVault(false);
    }
  };

  // Helper to build enriched resume data with all Vault content
  const getEnrichedResumeData = () => {
    const resumeSkills = resumeContent?.skills || [];
    // Combine resume skills with vault skills, removing duplicates
    const allSkills = [...new Set([...resumeSkills, ...vaultSkills])];
    
    // Build comprehensive profile
    return {
      ...resumeContent,
      allSkills,
      totalSkillsCount: allSkills.length,
      certifications: vaultCertifications.map(c => ({
        name: c.name,
        issuer: c.issuer,
        date: c.dateEarned
      })),
      projects: vaultProjects.map(p => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies
      })),
      vaultEnriched: true,
      dataSourceInfo: {
        resumeSkillsCount: resumeSkills.length,
        vaultSkillsCount: vaultSkills.length,
        certificationsCount: vaultCertifications.length,
        projectsCount: vaultProjects.length
      }
    };
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
      // Send enriched data with vault content
      const enrichedData = getEnrichedResumeData();
      
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { resumeContent: enrichedData }
      });

      if (error) throw error;
      setAtsAnalysis(data);
      setOverallScore(data.overall_score);
      
      toast({ 
        title: "Analysis complete", 
        description: `Your profile was analyzed using ${enrichedData.allSkills.length} skills and ${enrichedData.certifications.length} certifications from your Vault` 
      });
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
      // Get enriched resume data including all Vault content
      const enrichedData = getEnrichedResumeData();
      
      const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
        body: { 
          resumeText: JSON.stringify(enrichedData),
          jobDescription,
          jobTitle: jobTitle || undefined,
          company: company || undefined
        }
      });

      if (error) throw error;
      setMatchAnalysis(data);
      
      const vaultBoost = vaultSkills.length + vaultCertifications.length + vaultProjects.length;
      const boostMessage = vaultBoost > 5 
        ? `Analysis enhanced with ${vaultBoost} Vault items!` 
        : data.is_good_fit 
          ? "You're a strong match for this role!" 
          : "See recommendations to improve your fit.";
      
      toast({ 
        title: `${data.match_score}% Match Score`, 
        description: boostMessage
      });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzingMatch(false);
    }
  };

  const handleAutoOptimize = async () => {
    toast({ title: "Optimizing...", description: "Applying AI improvements using your Vault data" });
    await new Promise(r => setTimeout(r, 2000));
    toast({ title: "Optimization complete", description: "Your resume has been improved!" });
  };

  const handleUploadClick = () => setActiveTab?.('vault');
  const handleNavigateToVault = () => setActiveTab?.('vault');

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
        {/* Vault Data Source Indicator */}
        <VaultDataIndicator
          hasResume={hasResume}
          skillsCount={vaultSkills.length}
          certificationsCount={vaultCertifications.length}
          projectsCount={vaultProjects.length}
          isLoading={isLoadingVault}
          onNavigateToVault={handleNavigateToVault}
        />

        {/* Auto-Optimize CTA */}
        <AutoOptimizeButton 
          onOptimize={handleAutoOptimize}
          disabled={!resumeContent}
        />

        {/* Job Targeting Panel */}
        <JobTargetingPanel
          onAnalyze={handleJobMatch}
          isAnalyzing={isAnalyzingMatch}
        />

        {/* Match Results (if job was analyzed) */}
        {matchAnalysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score & Keywords Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <MatchMeter 
                score={matchAnalysis.match_score} 
                missingCount={matchAnalysis.missing_keywords?.length || 0}
                isAnalyzing={isAnalyzingMatch}
              />
              <KeywordGap
                matchingKeywords={matchAnalysis.keyword_matches || []}
                missingKeywords={(matchAnalysis.missing_keywords || []).map(k => 
                  typeof k === 'string' 
                    ? { keyword: k, reason: 'Required in job description' }
                    : { keyword: k.keyword, reason: k.context || `${k.importance === 'must-have' ? 'Must-have' : 'Nice-to-have'} skill` }
                )}
              />
            </div>
            
            {/* Recommendations Panel */}
            <RecommendationsPanel
              recommendations={matchAnalysis.recommendations}
              gaps={matchAnalysis.gaps}
              fitSummary={matchAnalysis.fit_summary}
              atsWarnings={matchAnalysis.ats_warnings}
              onApplyRecommendation={(rec) => {
                toast({
                  title: `Apply to ${rec.section}`,
                  description: rec.action
                });
              }}
            />
          </motion.div>
        )}

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
        {!resumeContent && !isLoadingVault && (
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
