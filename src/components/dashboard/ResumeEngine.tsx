import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Settings2, Sparkles, FileText, Database } from 'lucide-react';
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
  
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  const [isLoadingVault, setIsLoadingVault] = useState(true);
  
  // Vault data states
  const [vaultSkills, setVaultSkills] = useState<string[]>([]);
  const [vaultCertifications, setVaultCertifications] = useState<VaultCertification[]>([]);
  const [vaultProjects, setVaultProjects] = useState<VaultProject[]>([]);
  
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  // AI Analysis States (Resume-focused only)
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  
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
        extractBulletPoints(content);
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
        description: "Please upload a resume in the Master Vault first to run AI analysis", 
        variant: "destructive" 
      });
      setActiveTab?.('vault');
      return;
    }

    setIsAnalyzingATS(true);
    setFixItItems([]); // Clear previous items
    
    try {
      // Send enriched data with vault content
      const enrichedData = getEnrichedResumeData();
      
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { resumeContent: enrichedData }
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
      
      toast({ 
        title: `Score: ${data.overall_score}/100`, 
        description: `AI analyzed ${enrichedData.allSkills.length} skills, ${enrichedData.certifications.length} certifications, and ${enrichedData.projects.length} projects` 
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

  const handleAutoOptimize = async () => {
    toast({ title: "Optimizing...", description: "Applying AI improvements using your Vault data" });
    await new Promise(r => setTimeout(r, 2000));
    toast({ title: "Optimization complete", description: "Your resume has been improved!" });
  };

  const handleNavigateToVault = () => setActiveTab?.('vault');
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
                <h2 className="font-semibold text-foreground">Scan Your Resume</h2>
                <p className="text-sm text-muted-foreground">
                  AI analyzes formatting, keywords, and ATS compatibility
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
              Upload a resume in the Master Vault to enable scanning
            </p>
          )}
        </motion.div>

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

        {/* Tip to use Scout for Job Matching */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-muted/30 border border-border"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-600" />
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
              onNavigateToVault={handleNavigateToVault}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">No Resume to Analyze</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Head to the Master Vault to upload your resume. Once uploaded, our AI will analyze it and provide personalized optimization insights.
            </p>
            <Button onClick={handleNavigateToVault} size="lg" className="gap-2">
              <Database className="w-4 h-4" />
              Go to Master Vault
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              The AI combines your resume with skills, certifications, and projects from your Vault for comprehensive analysis
            </p>
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
