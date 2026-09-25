import React, { useState, useRef } from 'react';
import DocxImprover from './resume-engine/DocxImprover';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Clipboard, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp, Copy, Loader2, Upload, Download, Lock, Search, BarChart3, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, LevelFormat, AlignmentType } from 'docx';
import html2pdf from 'html2pdf.js';

// ===== Types =====
interface BundleResult {
  tailoredResume: string;
  coverLetter: string;
  atsData: {
    beforeScore: number;
    afterScore: number;
    foundKeywords: string[];
    missingKeywords: string[];
    improvements: string[];
  };
}

// ===== Constants =====
const STEPS = [
  { icon: FileText, label: 'Extract', desc: 'Read resume content' },
  { icon: Search, label: 'Compare', desc: 'Analyze against job description' },
  { icon: BarChart3, label: 'Score', desc: 'Calculate match quality' },
  { icon: Lightbulb, label: 'Explain', desc: 'Show detailed feedback' },
];

// ===== Helper Functions =====
const getScoreColor = (s: number): string => {
  if (s >= 80) return 'text-primary';
  if (s >= 60) return 'text-foreground';
  return 'text-destructive';
};

const getProgressColor = (s: number): string => {
  if (s >= 80) return 'bg-primary';
  if (s >= 60) return 'bg-foreground';
  return 'bg-destructive';
};

const wordCount = (t: string): number => {
  return t.split(/\s+/).filter(Boolean).length;
};

const stripMarkdown = (text: string): string => text
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/__([^_]+)__/g, '$1')
  .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1$2')
  .replace(/(^|[^_])_([^_]+)_(?!_)/g, '$1$2')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/^\s{0,3}#{1,6}\s+/gm, '')
  .replace(/^\s*[-*+]\s+/gm, '')
  .trim();

const inlineWordRuns = (line: string, size = 21): TextRun[] => {
  const runs: TextRun[] = [];
  const pattern = /\*\*([^*]+)\*\*|__([^_]+)__/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line)) !== null) {
    if (match.index > cursor) runs.push(new TextRun({ text: stripMarkdown(line.slice(cursor, match.index)), size }));
    runs.push(new TextRun({ text: match[1] || match[2] || '', bold: true, size }));
    cursor = pattern.lastIndex;
  }
  if (cursor < line.length) runs.push(new TextRun({ text: stripMarkdown(line.slice(cursor)), size }));
  return runs.length ? runs : [new TextRun({ text: stripMarkdown(line) || ' ', size })];
};

const resumeToWordParagraphs = (resume: string): Paragraph[] => resume.split(/\r?\n/).map((rawLine) => {
  const line = rawLine.trim();
  if (!line) return new Paragraph({ spacing: { after: 80 }, children: [] });

  const heading = line.match(/^#{1,6}\s+(.+)$/);
  if (heading) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 180, after: 80 },
      children: [new TextRun({ text: stripMarkdown(heading[1]), bold: true, size: 24 })],
    });
  }

  const bullet = line.match(/^[-*+]\s+(.+)$/);
  if (bullet) {
    return new Paragraph({
      numbering: { reference: 'resume-bullets', level: 0 },
      spacing: { after: 55 },
      children: inlineWordRuns(bullet[1]),
    });
  }

  const boldOnly = line.match(/^\*\*([^*]+)\*\*$/) || line.match(/^__([^_]+)__$/);
  return new Paragraph({
    spacing: { after: boldOnly ? 65 : 80 },
    children: boldOnly
      ? [new TextRun({ text: boldOnly[1], bold: true, size: 22 })]
      : inlineWordRuns(line),
  });
});

const isProUser = (tier: string): boolean => {
  return tier === 'free' || tier === 'pro' || tier === 'elite'; // TESTING: free unlocked
};

const hasValidInputs = (resume: string, jobDesc: string): boolean => {
  return Boolean(resume.trim() && jobDesc.trim());
};

// ===== Custom Hooks =====
const useFileUpload = (isPro: boolean, onTextExtracted: (text: string, fileName: string, file: File | null) => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedDocxFile, setUploadedDocxFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPro) {
      toast({ 
        title: 'Pro Feature', 
        description: 'Upgrade to Pro or Elite to upload PDF/DOCX resumes.', 
        variant: 'destructive' 
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }
      
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume-file`,
        { 
          method: 'POST', 
          headers: { 
            Authorization: `Bearer ${session.access_token}` 
          }, 
          body: formData 
        }
      );
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      onTextExtracted(json.text || '', file.name, file.name.toLowerCase().endsWith('.docx') ? file : null);
      setUploadedFileName(file.name);
      if (file.name.toLowerCase().endsWith('.docx')) {
        setUploadedDocxFile(file);
      }
      toast({ 
        title: 'Resume Uploaded', 
        description: `${file.name} parsed successfully.` 
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ 
        title: 'Upload Failed', 
        description: err.message || 'Failed to parse resume file', 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetFileUpload = () => {
    setUploadedFileName(null);
    setUploadedDocxFile(null);
  };

  return {
    isUploading,
    uploadedFileName,
    uploadedDocxFile,
    fileInputRef,
    handleFileUpload,
    resetFileUpload,
  };
};

const useBundleGeneration = () => {
  const { toast } = useToast();
  const { canUse, getRemaining, tier } = useUsageLimit();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BundleResult | null>(null);

  const saveToDatabase = async (userId: string, data: BundleResult, jobDescription: string) => {
    try {
      await Promise.allSettled([
        supabase.from('resumes').insert({
          user_id: userId,
          title: `Tailored Resume — ${new Date().toLocaleDateString()}`,
          content: { 
            text: data.tailoredResume, 
            ats_score: data.atsData?.afterScore ?? null, 
            job_description: jobDescription.trim() 
          },
        }),
        supabase.from('cover_letters').insert({
          user_id: userId,
          job_title: 'Tailored Application',
          content: data.coverLetter,
        }),
      ]);
    } catch (err) {
      console.error('Failed to save to database:', err);
      // Don't throw - the generation still succeeded
    }
  };

  const handleGenerate = async (
    resumeText: string,
    jobDescription: string,
    userName: string
  ): Promise<BundleResult | null> => {
    if (!hasValidInputs(resumeText, jobDescription)) {
      toast({ 
        title: 'Missing Input', 
        description: 'Please paste both your resume and the job description.', 
        variant: 'destructive' 
      });
      return null;
    }

    if (!canUse('resume_ats')) {
      const remaining = getRemaining('resume_ats');
      toast({ 
        title: 'Limit Reached', 
        description: `You have used all your application bundles. ${remaining === 0 ? 'Upgrade to continue.' : ''}`, 
        variant: 'destructive' 
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke('apply-bundle', {
        body: { 
          jobDescription: jobDescription.trim(), 
          userResume: resumeText.trim(), 
          userName: userName || profile?.full_name || '' 
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.tailoredResume || !data?.coverLetter || !data?.atsData) {
        throw new Error('Invalid response from server');
      }

      // Save to database (read-only copy for user history)
      await saveToDatabase(user.id, data, jobDescription);

      // NOTE: trackUsage is NOT called here because the edge function (apply-bundle)
      // already calls recordUsage on the backend. Calling it again would double-count.

      setResult(data);
      toast({ 
        title: 'Success!', 
        description: 'Your tailored resume, cover letter, and ATS score are ready.' 
      });
      return data;
    } catch (error: any) {
      console.error('Generation error:', error);
      const status = error?.context?.status;
      const remaining = getRemaining('resume_ats');
      
      if (status === 402 || status === 429 || remaining <= 0) {
        toast({ 
          title: "Credits Used", 
          description: 'You\'ve used all your credits. Upgrade your plan to keep generating bundles.', 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Generation Failed', 
          description: error.message || 'Something went wrong. Please try again.', 
          variant: 'destructive' 
        });
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return {
    isProcessing,
    result,
    remaining: getRemaining('resume_ats'),
    tier,
    canGenerate: canUse('resume_ats'),
    handleGenerate,
    resetResult,
  };
};

// ===== Subcomponents =====
const ResultsView: React.FC<{
  result: BundleResult;
  isPro: boolean;
  onReset: () => void;
  onCopy: (text: string, label: string) => void;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
}> = ({ result, isPro, onReset, onCopy, onDownloadPDF, onDownloadDOCX }) => {
  const [activeResultTab, setActiveResultTab] = useState('ats');
  const improvement = result.atsData.afterScore - result.atsData.beforeScore;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <HeaderSection action={
        <Button variant="outline" onClick={onReset} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload resume
        </Button>
      } />

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProcessRail complete />
        <div className="space-y-5">
          <Card className="rounded-lg border-border shadow-none">
            <CardContent className="grid gap-6 p-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
              <div className="flex flex-col items-center border-b border-border pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-primary/15 shadow-[inset_0_0_0_2px_hsl(var(--primary))]">
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${getScoreColor(result.atsData.afterScore)}`}>{result.atsData.afterScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-primary">Excellent match</p>
                <p className="mt-1 text-xs text-muted-foreground">+{improvement} points after tailoring</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Match breakdown</h2>
                <div className="mt-4 space-y-4">
                  <BreakdownRow label="Semantic match" value={50} score={Math.min(50, Math.round(result.atsData.afterScore * .5))} />
                  <BreakdownRow label="Skills & experience" value={30} score={Math.min(30, Math.round(result.atsData.afterScore * .3))} />
                  <BreakdownRow label="ATS keywords" value={20} score={Math.min(20, Math.round(result.atsData.afterScore * .2))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <InsightPanel title="Key insights" items={[
              ...(result.atsData.foundKeywords || []).slice(0, 2).map(keyword => `Strong match for ${keyword}`),
              ...(result.atsData.improvements || []).slice(0, 2),
            ]} />
            <InsightPanel title="Recommended changes" items={(result.atsData.missingKeywords || []).slice(0, 4).map(keyword => `Add evidence of ${keyword}`)} />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={onReset} className="gap-2"><RefreshCw className="h-4 w-4" />Re-upload</Button>
            <Button onClick={onDownloadDOCX} disabled={!isPro} className="gap-2">
              {isPro ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              Download optimized resume
            </Button>
          </div>
        </div>
      </div>

      <ResultTabs
        result={result}
        isPro={isPro}
        activeTab={activeResultTab}
        onTabChange={setActiveResultTab}
        onCopy={onCopy}
        onDownloadPDF={onDownloadPDF}
        onDownloadDOCX={onDownloadDOCX}
      />
    </div>
  );
};

const ScoreCard: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="text-center">
    <p className="text-sm text-muted-foreground mb-2">{label}</p>
    <p className={`text-5xl font-black ${getScoreColor(score)}`}>{score}%</p>
    <p className="text-xs text-muted-foreground mt-1">
      {label === 'Before' ? 'Original ATS Score' : 'Optimized ATS Score'}
    </p>
  </div>
);

const ImprovementBadge: React.FC<{ improvement: number }> = ({ improvement }) => (
  <div className="flex items-center justify-center">
    <div className="flex items-center gap-2">
      <TrendingUp className="w-8 h-8 text-primary" />
      <span className="text-2xl font-bold text-primary">+{improvement}</span>
    </div>
  </div>
);

const BreakdownRow: React.FC<{ label: string; value: number; score: number }> = ({ label, value, score }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{score}/{value}</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <motion.div initial={{ width: 0 }} animate={{ width: `${(score / value) * 100}%` }} className="h-full rounded-full bg-primary" />
    </div>
  </div>
);

const InsightPanel: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <section className="rounded-lg border border-border bg-card p-5">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
    </div>
    <ul className="mt-4 space-y-3">
      {(items.length ? items : ['Your resume is well aligned with this role.']).map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm leading-5 text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

const ProgressBar: React.FC<{ score: number }> = ({ score }) => (
  <div className="mt-6 space-y-2">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>ATS Compatibility</span>
      <span>{score}%</span>
    </div>
    <div className="h-3 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`h-full rounded-full ${getProgressColor(score)}`}
      />
    </div>
  </div>
);

const ResultTabs: React.FC<{
  result: BundleResult;
  isPro: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCopy: (text: string, label: string) => void;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
}> = ({ result, isPro, activeTab, onTabChange, onCopy, onDownloadPDF, onDownloadDOCX }) => (
  <Tabs value={activeTab} onValueChange={onTabChange}>
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="resume">
        <FileText className="w-4 h-4 mr-2" />
        Tailored Resume
      </TabsTrigger>
      <TabsTrigger value="cover">
        <Clipboard className="w-4 h-4 mr-2" />
        Cover Letter
      </TabsTrigger>
      <TabsTrigger value="ats">
        <Sparkles className="w-4 h-4 mr-2" />
        ATS Details
      </TabsTrigger>
    </TabsList>

    <TabsContent value="resume">
      <ResumeTabContent
        resume={result.tailoredResume}
        isPro={isPro}
        onCopy={() => onCopy(result.tailoredResume, 'Resume')}
        onDownloadPDF={onDownloadPDF}
        onDownloadDOCX={onDownloadDOCX}
      />
    </TabsContent>

    <TabsContent value="cover">
      <CoverLetterTabContent
        coverLetter={result.coverLetter}
        onCopy={() => onCopy(result.coverLetter, 'Cover Letter')}
      />
    </TabsContent>

    <TabsContent value="ats">
      <ATSTabContent atsData={result.atsData} />
    </TabsContent>
  </Tabs>
);

const ResumeTabContent: React.FC<{
  resume: string;
  isPro: boolean;
  onCopy: () => void;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
}> = ({ resume, isPro, onCopy, onDownloadPDF, onDownloadDOCX }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
      <CardTitle className="text-lg">Tailored Resume</CardTitle>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownloadPDF} 
          disabled={!isPro} 
          className="gap-2"
          title={!isPro ? "Upgrade to Pro or Elite to download PDF" : "Download as PDF"}
        >
          {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          PDF{!isPro && ' (Pro)'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownloadDOCX} 
          disabled={!isPro} 
          className="gap-2"
          title={!isPro ? "Upgrade to Pro or Elite to download DOCX" : "Download as DOCX"}
        >
          {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          DOCX{!isPro && ' (Pro)'}
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="max-h-[600px] overflow-y-auto rounded-lg bg-muted/50 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {resume}
      </div>
    </CardContent>
  </Card>
);

const CoverLetterTabContent: React.FC<{
  coverLetter: string;
  onCopy: () => void;
}> = ({ coverLetter, onCopy }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Cover Letter</CardTitle>
      <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
        <Copy className="w-4 h-4" />
        Copy
      </Button>
    </CardHeader>
    <CardContent>
      <div className="max-h-[600px] overflow-y-auto rounded-lg bg-muted/50 p-6 text-sm leading-relaxed whitespace-pre-wrap">
        {coverLetter}
      </div>
    </CardContent>
  </Card>
);

const ATSTabContent: React.FC<{ atsData: BundleResult['atsData'] }> = ({ atsData }) => (
  <Card>
    <CardContent className="p-6 space-y-6">
      {atsData.missingKeywords?.length > 0 && (
        <KeywordSection
          title="Missing Keywords (Added in Tailored Version)"
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          keywords={atsData.missingKeywords}
          variant="warning"
        />
      )}
      {atsData.foundKeywords?.length > 0 && (
        <KeywordSection
          title="Keywords Already Present"
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          keywords={atsData.foundKeywords}
          variant="success"
          showCheckmark
        />
      )}
      {atsData.improvements?.length > 0 && (
        <ImprovementsSection improvements={atsData.improvements} />
      )}
    </CardContent>
  </Card>
);

const KeywordSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  keywords: string[];
  variant: 'warning' | 'success';
  showCheckmark?: boolean;
}> = ({ title, icon, keywords, variant, showCheckmark }) => {
  const colorClass = variant === 'warning'
    ? 'border-destructive/20 bg-destructive/5 text-destructive'
    : 'border-primary/20 bg-primary/5 text-primary';

  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <Badge key={i} variant="outline" className={colorClass}>
            {showCheckmark && '✓ '}{kw}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ImprovementsSection: React.FC<{ improvements: string[] }> = ({ improvements }) => (
  <div>
    <h4 className="font-semibold mb-3 flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      Improvements Made
    </h4>
    <ul className="space-y-2">
      {improvements.map((imp, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {imp}
        </li>
      ))}
    </ul>
  </div>
);

// ===== Main Component =====
const ResumeEngine: React.FC<{ setActiveTab?: (tab: string) => void; hasResume?: boolean }> = ({ 
  setActiveTab, 
  hasResume = false 
}) => {
  const { toast } = useToast();
  const { tier } = useUsageLimit();
  const isPro = isProUser(tier);
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showRewritePrompt, setShowRewritePrompt] = useState(false);
  const [pendingResumeText, setPendingResumeText] = useState('');

  const handleTextExtracted = (text: string, fileName: string, docxFile: File | null) => {
    setResumeText(text);
    setPendingResumeText(text);
    setShowRewritePrompt(true);
  };

  const { 
    isUploading, 
    uploadedFileName, 
    uploadedDocxFile, 
    fileInputRef, 
    handleFileUpload, 
    resetFileUpload 
  } = useFileUpload(isPro, handleTextExtracted);
  

  const { 
    isProcessing, 
    result, 
    remaining, 
    canGenerate, 
    handleGenerate, 
    resetResult 
  } = useBundleGeneration();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ 
      title: 'Copied!', 
      description: `${label} copied to clipboard.` 
    });
  };

  const downloadAsPDF = async () => {
    if (!isPro || !result) {
      toast({ 
        title: 'Pro Feature', 
        description: 'Upgrade to Pro or Elite to download PDF files.', 
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      const container = document.createElement('div');
      container.style.cssText = 'padding:32px;font-family:Arial,sans-serif;font-size:11pt;color:#111;white-space:pre-wrap;';
      container.innerText = result.tailoredResume;
      await html2pdf().from(container).set({
        margin: 0.5, 
        filename: 'tailored-resume.pdf',
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      }).save();
      
      toast({ title: 'PDF Downloaded', description: 'Your resume has been saved as PDF.' });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast({ 
        title: 'PDF Generation Failed', 
        description: 'Could not generate PDF. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const downloadAsDOCX = async () => {
    if (!isPro || !result) {
      toast({ 
        title: 'Pro Feature', 
        description: 'Upgrade to Pro or Elite to download DOCX files.', 
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      const paragraphs = resumeToWordParagraphs(result.tailoredResume);
      const doc = new Document({ 
        numbering: {
          config: [{
            reference: 'resume-bullets',
            levels: [{
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 540, hanging: 260 } } },
            }],
          }],
        },
        styles: {
          default: { document: { run: { font: 'Arial', size: 21 } } },
          paragraphStyles: [{
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: { font: 'Arial', size: 24, bold: true },
            paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 0 },
          }],
        },
        sections: [{ 
          properties: {
            page: {
              size: { width: 12240, height: 15840 },
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
            },
          },
          children: paragraphs 
        }] 
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tailored-resume.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: 'DOCX Downloaded', description: 'Your resume has been saved as DOCX.' });
    } catch (err) {
      console.error('DOCX generation error:', err);
      toast({ 
        title: 'DOCX Generation Failed', 
        description: 'Could not generate DOCX. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  const handleFormSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ 
          title: 'Not Signed In', 
          description: 'Please sign in to generate resumes.', 
          variant: 'destructive' 
        });
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      await handleGenerate(resumeText, jobDescription, profile?.full_name || '');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleReset = () => {
    resetResult();
    setResumeText('');
    setJobDescription('');
    resetFileUpload();
    setShowRewritePrompt(false);
    setPendingResumeText('');
  };

  // If we have results, show the results view
  if (result) {
    return (
      <ResultsView
        result={result}
        isPro={isPro}
        onReset={handleReset}
        onCopy={handleCopy}
        onDownloadPDF={downloadAsPDF}
        onDownloadDOCX={downloadAsDOCX}
      />
    );
  }

  // Otherwise show the input form
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <HeaderSection action={
        <>
          <Button type="button" onClick={() => isPro ? fileInputRef.current?.click() : setActiveTab?.('billing')} disabled={isUploading} className="gap-2">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPro ? <Upload className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            Upload resume
          </Button>
        </>
      } />

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProcessRail />
        <div className="space-y-5">
          <InputSection
            resumeText={resumeText}
            jobDescription={jobDescription}
            uploadedFileName={uploadedFileName}
            uploadedDocxFile={uploadedDocxFile}
            isUploading={isUploading}
            isPro={isPro}
            fileInputRef={fileInputRef}
            onResumeChange={(val) => {
              setResumeText(val);
              resetFileUpload();
            }}
            onJobDescChange={setJobDescription}
            onFileUpload={handleFileUpload}
          />

          <ActionButtonsSection
            canGenerate={canGenerate}
            isProcessing={isProcessing}
            remaining={remaining}
            tier={tier}
            hasInputs={hasValidInputs(resumeText, jobDescription)}
            onGenerate={handleFormSubmit}
            onUpgrade={() => setActiveTab?.('billing')}
          />

          {uploadedDocxFile && isPro && (
            <div id="docx-improver">
              <DocxImprover file={uploadedDocxFile} resumeText={resumeText} jobDescription={jobDescription} />
            </div>
          )}
        </div>
      </div>

      <RewritePromptDialog
        open={showRewritePrompt}
        onOpenChange={setShowRewritePrompt}
        hasJobDescription={!!jobDescription.trim()}
        uploadedDocxFile={uploadedDocxFile}
        onRewriteDocx={() => document.getElementById('docx-improver')?.scrollIntoView({ behavior: 'smooth' })}
        onGenerate={handleFormSubmit}
      />
    </div>
  );
};

// Additional subcomponents for the main form
const HeaderSection: React.FC<{ action?: React.ReactNode }> = ({ action }) => (
  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="font-display text-2xl text-foreground">Resume + ATS</h1>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">Optimize your resume for ATS and get a higher match rate.</p>
    </div>
    {action}
  </motion.div>
);

const ProcessRail: React.FC<{ complete?: boolean }> = ({ complete = false }) => (
  <aside className="rounded-lg border border-border bg-card p-5">
    <ol className="grid grid-cols-2 gap-4 lg:block lg:space-y-0">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = complete || index === 0;
        return (
          <li key={step.label} className="relative flex gap-3 pb-0 lg:pb-7 last:pb-0">
            {index < STEPS.length - 1 && <span className="absolute left-3.5 top-7 hidden h-[calc(100%-1.25rem)] w-px bg-border lg:block" aria-hidden="true" />}
            <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}>
              {complete ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <div>
              <p className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  </aside>
);

const InputSection: React.FC<{
  resumeText: string;
  jobDescription: string;
  uploadedFileName: string | null;
  uploadedDocxFile: File | null;
  isUploading: boolean;
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onResumeChange: (val: string) => void;
  onJobDescChange: (val: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ 
  resumeText, 
  jobDescription, 
  uploadedFileName, 
  uploadedDocxFile, 
  isUploading, 
  isPro, 
  fileInputRef, 
  onResumeChange, 
  onJobDescChange, 
  onFileUpload 
}) => (
  <Card className="rounded-lg border-border shadow-none">
    <CardContent className="p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <ResumeInputSection
          resumeText={resumeText}
          uploadedFileName={uploadedFileName}
          uploadedDocxFile={uploadedDocxFile}
          isUploading={isUploading}
          isPro={isPro}
          fileInputRef={fileInputRef}
          onResumeChange={onResumeChange}
          onFileUpload={onFileUpload}
        />
        <JobDescriptionSection jobDescription={jobDescription} onChange={onJobDescChange} />
      </div>
    </CardContent>
  </Card>
);

const ResumeInputSection: React.FC<{
  resumeText: string;
  uploadedFileName: string | null;
  uploadedDocxFile: File | null;
  isUploading: boolean;
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onResumeChange: (val: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ 
  resumeText, 
  uploadedFileName, 
  uploadedDocxFile, 
  isUploading, 
  isPro, 
  fileInputRef, 
  onResumeChange, 
  onFileUpload 
}) => (
  <div>
    <div className="mb-2 flex min-h-9 flex-wrap items-center justify-between gap-2">
      <label className="text-sm font-semibold">Your resume</label>
      <div className="flex items-center gap-2">
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".pdf,.docx,.txt" 
          onChange={onFileUpload} 
          className="hidden" 
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => isPro ? fileInputRef.current?.click() : null}
          disabled={isUploading}
          className="gap-2"
          title={!isPro ? "Upgrade to Pro or Elite to upload files" : "Upload resume file"}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPro ? (
            <Upload className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          Replace
        </Button>
      </div>
    </div>
    <Textarea
      placeholder="Paste your full resume text here..."
      value={resumeText}
      onChange={(e) => onResumeChange(e.target.value)}
      className="min-h-[260px] resize-y border-input bg-background text-sm leading-6"
    />
    <p className="text-xs text-muted-foreground mt-1">
      {uploadedFileName ? `${uploadedFileName} — ${wordCount(resumeText)} words` : 
       resumeText ? `${wordCount(resumeText)} words` : 
        'Paste text or upload a PDF or DOCX file'}
    </p>
  </div>
);

const JobDescriptionSection: React.FC<{
  jobDescription: string;
  onChange: (val: string) => void;
}> = ({ jobDescription, onChange }) => (
  <div>
    <div className="mb-2 flex min-h-9 items-center">
      <label className="text-sm font-semibold">Job description</label>
    </div>
    <Textarea
      placeholder="Paste the full job posting here..."
      value={jobDescription}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[260px] resize-y border-input bg-background text-sm leading-6"
    />
    <p className="text-xs text-muted-foreground mt-1">
      {jobDescription ? `${wordCount(jobDescription)} words` : 'Copy the entire posting from LinkedIn, Indeed, etc.'}
    </p>
  </div>
);

const ActionButtonsSection: React.FC<{
  canGenerate: boolean;
  isProcessing: boolean;
  remaining: number;
  tier: string;
  hasInputs: boolean;
  onGenerate: () => void;
  onUpgrade: () => void;
}> = ({ canGenerate, isProcessing, remaining, tier, hasInputs, onGenerate, onUpgrade }) => {
  if (!canGenerate) {
    return (
      <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm font-semibold">
          {tier === 'free' ? 'Free Limit Reached' : 'Monthly Limit Reached'}
        </p>
        <p className="text-xs text-muted-foreground">
          You've used all your application bundles {tier === 'free' ? 'on the free plan' : 'this month'}.
        </p>
        <Button size="sm" className="mt-2" onClick={onUpgrade}>
          Upgrade to {tier === 'free' ? 'Pro' : 'Elite'} to continue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={onGenerate} 
        disabled={isProcessing || !hasInputs} 
        size="lg" 
        className="h-12 w-full gap-3 text-base font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating... (takes ~30 seconds)
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Tailored Resume + Cover Letter + ATS Score
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        {remaining} bundle{remaining !== 1 ? 's' : ''} remaining {tier === 'free' ? '(free plan)' : 'this month'}
      </p>
    </div>
  );
};

const RewritePromptDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasJobDescription: boolean;
  uploadedDocxFile: File | null;
  onRewriteDocx: () => void;
  onGenerate: () => void;
}> = ({ open, onOpenChange, hasJobDescription, uploadedDocxFile, onRewriteDocx, onGenerate }) => {
  const { toast } = useToast();
  
  const handleConfirm = () => {
    onOpenChange(false);
    if (!hasJobDescription) {
      toast({ 
        title: 'Job Description Required', 
        description: 'Please paste the job description first, then click "Rewrite My DOCX" below.', 
        variant: 'destructive' 
      });
      return;
    }
    if (uploadedDocxFile) {
      onRewriteDocx();
    } else {
      onGenerate();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rewrite Resume to Match the Job?</AlertDialogTitle>
          <AlertDialogDescription>
            We can have AI rewrite your uploaded resume to better match the job description, 
            add missing keywords, and boost your ATS score. You'll be able to download it as PDF or DOCX.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, Keep As Is</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Yes, Rewrite with AI</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResumeEngine;
