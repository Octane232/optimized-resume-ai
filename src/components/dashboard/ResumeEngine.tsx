import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Clipboard, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp, Copy, Loader2, Upload, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { Document, Packer, Paragraph, TextRun } from 'docx';
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
  { icon: '📄', label: 'Paste resume + job', desc: 'One input, three outputs' },
  { icon: '✨', label: 'AI tailors everything', desc: 'Resume, cover letter, ATS score' },
  { icon: '📈', label: 'See your score jump', desc: 'Saved to your account automatically' },
];

// ===== Helper Functions =====
const getScoreColor = (s: number): string => {
  if (s >= 80) return 'text-emerald-500';
  if (s >= 60) return 'text-amber-500';
  return 'text-red-500';
};

const getProgressColor = (s: number): string => {
  if (s >= 80) return 'bg-emerald-500';
  if (s >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};

const wordCount = (t: string): number => {
  return t.split(/\s+/).filter(Boolean).length;
};

const isProUser = (tier: string): boolean => {
  return tier === 'pro' || tier === 'premium';
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
      toast({ title: 'Pro feature', description: 'Upgrade to Pro to upload PDF/DOCX resumes.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `https://xpmhahyvtyvrxryrqane.supabase.co/functions/v1/parse-resume-file`,
        { method: 'POST', headers: { Authorization: `Bearer ${session?.access_token || ''}` }, body: formData }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      onTextExtracted(json.text || '', file.name, file.name.toLowerCase().endsWith('.docx') ? file : null);
      setUploadedFileName(file.name);
      if (file.name.toLowerCase().endsWith('.docx')) {
        setUploadedDocxFile(file);
      }
      toast({ title: 'Resume uploaded', description: `${file.name} parsed successfully.` });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
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

const useDocxRewrite = (
  uploadedDocxFile: File | null,
  jobDescription: string,
  onRewriteComplete: (base64: string, previewText: string) => void
) => {
  const { toast } = useToast();
  const [isRewritingDocx, setIsRewritingDocx] = useState(false);
  const [editedDocxBase64, setEditedDocxBase64] = useState<string | null>(null);

  const handleRewriteDocx = async () => {
    if (!uploadedDocxFile || !jobDescription.trim()) {
      toast({ title: 'Missing input', description: 'Need a DOCX file and a job description.', variant: 'destructive' });
      return;
    }

    setIsRewritingDocx(true);
    try {
      const fd = new FormData();
      fd.append('file', uploadedDocxFile);
      fd.append('jobDescription', jobDescription.trim());
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `https://xpmhahyvtyvrxryrqane.supabase.co/functions/v1/rewrite-docx`,
        { method: 'POST', headers: { Authorization: `Bearer ${session?.access_token || ''}` }, body: fd }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Rewrite failed');

      setEditedDocxBase64(json.docxBase64);
      onRewriteComplete(json.docxBase64, json.previewText);
      toast({ title: 'Resume rewritten', description: `${json.rewrittenCount} paragraphs improved.` });
    } catch (err: any) {
      toast({ title: 'Rewrite failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsRewritingDocx(false);
    }
  };

  const downloadEditedDocx = () => {
    if (!editedDocxBase64) return;
    const bin = atob(editedDocxBase64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (uploadedDocxFile?.name.replace(/\.docx$/i, '') || 'resume') + '-rewritten.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    isRewritingDocx,
    editedDocxBase64,
    handleRewriteDocx,
    downloadEditedDocx,
  };
};

const useBundleGeneration = () => {
  const { toast } = useToast();
  const { canUse, trackUsage, getRemaining, tier } = useUsageLimit();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BundleResult | null>(null);

  const saveToDatabase = async (userId: string, data: BundleResult, jobDescription: string) => {
    await Promise.allSettled([
      supabase.from('resumes').insert({
        user_id: userId,
        title: `Tailored Resume — ${new Date().toLocaleDateString()}`,
        content: { text: data.tailoredResume, ats_score: data.atsData?.afterScore ?? null, job_description: jobDescription.trim() } as any,
      }),
      supabase.from('cover_letters').insert({
        user_id: userId,
        job_title: 'Tailored Application',
        content: data.coverLetter,
      }),
    ]);
  };

  const handleGenerate = async (
    resumeText: string,
    jobDescription: string,
    userName: string
  ): Promise<BundleResult | null> => {
    if (!hasValidInputs(resumeText, jobDescription)) {
      toast({ title: 'Missing Input', description: 'Paste both your resume and the job description.', variant: 'destructive' });
      return null;
    }

    if (!canUse('resume_ats')) {
      toast({ title: 'Limit reached', description: 'You have used all your application bundles.', variant: 'destructive' });
      return null;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', user?.id || '').maybeSingle();

      const { data, error } = await supabase.functions.invoke('apply-bundle', {
        body: { jobDescription: jobDescription.trim(), userResume: resumeText.trim(), userName: userName || profile?.full_name || '' },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (user) {
        await saveToDatabase(user.id, data, jobDescription);
      }

      await trackUsage('resume_ats');
      setResult(data);
      toast({ title: 'Done!', description: 'Tailored resume, cover letter, and ATS score ready.' });
      return data;
    } catch (error: any) {
      const status = error?.context?.status;
      const remaining = getRemaining('resume_ats');
      if (status === 402 || status === 429 || remaining <= 0) {
        toast({ title: "You've used all your credits", description: 'Upgrade your plan to keep generating bundles.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: error.message || 'Something went wrong.', variant: 'destructive' });
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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Results Ready</h1>
            <p className="text-sm text-muted-foreground">Saved to your account automatically.</p>
          </div>
        </div>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RefreshCw className="w-4 h-4" />Start Over
        </Button>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <ScoreCard label="Before" score={result.atsData.beforeScore} />
            <ImprovementBadge improvement={improvement} />
            <ScoreCard label="After" score={result.atsData.afterScore} />
          </div>
          <ProgressBar score={result.atsData.afterScore} />
        </CardContent>
      </Card>

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
      <TrendingUp className="w-8 h-8 text-emerald-500" />
      <span className="text-2xl font-bold text-emerald-500">+{improvement}</span>
    </div>
  </div>
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
      <TabsTrigger value="resume"><FileText className="w-4 h-4 mr-2" />Tailored Resume</TabsTrigger>
      <TabsTrigger value="cover"><Clipboard className="w-4 h-4 mr-2" />Cover Letter</TabsTrigger>
      <TabsTrigger value="ats"><Sparkles className="w-4 h-4 mr-2" />ATS Details</TabsTrigger>
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
          <Copy className="w-4 h-4" />Copy
        </Button>
        <Button variant="outline" size="sm" onClick={onDownloadPDF} disabled={!isPro} className="gap-2">
          {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />} PDF{!isPro && ' (Pro)'}
        </Button>
        <Button variant="outline" size="sm" onClick={onDownloadDOCX} disabled={!isPro} className="gap-2">
          {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />} DOCX{!isPro && ' (Pro)'}
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto font-mono">
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
        <Copy className="w-4 h-4" />Copy
      </Button>
    </CardHeader>
    <CardContent>
      <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto">
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
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          keywords={atsData.missingKeywords}
          variant="warning"
        />
      )}
      {atsData.foundKeywords?.length > 0 && (
        <KeywordSection
          title="Keywords Already Present"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
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
  keywords: any[];
  variant: 'warning' | 'success';
  showCheckmark?: boolean;
}> = ({ title, icon, keywords, variant, showCheckmark }) => {
  const colorClass = variant === 'warning'
    ? 'bg-amber-500/5 text-amber-600 border-amber-500/20'
    : 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20';

  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">{icon}{title}</h4>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <Badge key={i} variant="outline" className={colorClass}>
            {showCheckmark && '✓ '}{typeof kw === 'string' ? kw : kw.keyword ?? JSON.stringify(kw)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ImprovementsSection: React.FC<{ improvements: string[] }> = ({ improvements }) => (
  <div>
    <h4 className="font-semibold mb-3 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />Improvements Made
    </h4>
    <ul className="space-y-2">
      {improvements.map((imp, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          {imp}
        </li>
      ))}
    </ul>
  </div>
);

// ===== Main Component =====
const ResumeEngine: React.FC<{ setActiveTab?: (tab: string) => void; hasResume?: boolean }> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { tier } = useUsageLimit();
  const isPro = isProUser(tier);
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showRewritePrompt, setShowRewritePrompt] = useState(false);

  const handleTextExtracted = (text: string, fileName: string, docxFile: File | null) => {
    setResumeText(text);
    setShowRewritePrompt(true);
  };

  const { isUploading, uploadedFileName, uploadedDocxFile, fileInputRef, handleFileUpload, resetFileUpload } = useFileUpload(isPro, handleTextExtracted);
  
  const { isRewritingDocx, editedDocxBase64, handleRewriteDocx, downloadEditedDocx } = useDocxRewrite(
    uploadedDocxFile,
    jobDescription,
    (base64, previewText) => {
      setResumeText(previewText);
    }
  );

  const { isProcessing, result, remaining, canGenerate, handleGenerate, resetResult } = useBundleGeneration();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
  };

  const downloadAsPDF = async () => {
    if (!isPro || !result) return;
    const container = document.createElement('div');
    container.style.cssText = 'padding:32px;font-family:Arial,sans-serif;font-size:11pt;color:#111;white-space:pre-wrap;';
    container.innerText = result.tailoredResume;
    await html2pdf().from(container).set({
      margin: 0.5, filename: 'tailored-resume.pdf',
      html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  const downloadAsDOCX = async () => {
    if (!isPro || !result) return;
    const paragraphs = result.tailoredResume.split('\n').map(line =>
      new Paragraph({ children: [new TextRun({ text: line || ' ' })] })
    );
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailored-resume.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', user?.id || '').maybeSingle();
    await handleGenerate(resumeText, jobDescription, profile?.full_name || '');
  };

  const handleReset = () => {
    resetResult();
    setResumeText('');
    setJobDescription('');
    resetFileUpload();
  };

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

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <HeaderSection />
      <StepsSection />
      <InputSection
        resumeText={resumeText}
        jobDescription={jobDescription}
        uploadedFileName={uploadedFileName}
        uploadedDocxFile={uploadedDocxFile}
        isUploading={isUploading}
        isPro={isPro}
        fileInputRef={fileInputRef}
        onResumeChange={(val) => { setResumeText(val); resetFileUpload(); }}
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

      <DocxRewriteSection
        uploadedDocxFile={uploadedDocxFile}
        isPro={isPro}
        isRewritingDocx={isRewritingDocx}
        editedDocxBase64={editedDocxBase64}
        jobDescription={jobDescription}
        resumeText={resumeText}
        onRewriteDocx={handleRewriteDocx}
        onDownloadEditedDocx={downloadEditedDocx}
      />

      <RewritePromptDialog
        open={showRewritePrompt}
        onOpenChange={setShowRewritePrompt}
        hasJobDescription={!!jobDescription.trim()}
        uploadedDocxFile={uploadedDocxFile}
        onRewriteDocx={handleRewriteDocx}
        onGenerate={handleFormSubmit}
      />
    </div>
  );
};

// Additional subcomponents for the main form
const HeaderSection: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
        <FileText className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resume + ATS</h1>
        <p className="text-sm text-muted-foreground">
          Paste your resume and a job description. Get a tailored resume, cover letter, and ATS score in 60 seconds.
        </p>
      </div>
    </div>
  </motion.div>
);

const StepsSection: React.FC = () => (
  <div className="grid grid-cols-3 gap-4">
    {STEPS.map((step, i) => (
      <Card key={i} className="border-0 shadow-sm">
        <CardContent className="p-4 text-center">
          <span className="text-2xl">{step.icon}</span>
          <p className="text-sm font-medium mt-2">{step.label}</p>
          <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
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
}> = ({ resumeText, jobDescription, uploadedFileName, uploadedDocxFile, isUploading, isPro, fileInputRef, onResumeChange, onJobDescChange, onFileUpload }) => (
  <div className="space-y-4">
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
    <JobDescriptionSection
      jobDescription={jobDescription}
      onChange={onJobDescChange}
    />
  </div>
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
}> = ({ resumeText, uploadedFileName, uploadedDocxFile, isUploading, isPro, fileInputRef, onResumeChange, onFileUpload }) => (
  <div>
    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
      <label className="text-sm font-medium">Your Resume</label>
      <div className="flex items-center gap-2">
        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={onFileUpload} className="hidden" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => isPro ? fileInputRef.current?.click() : null}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPro ? <Upload className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
          Upload PDF/DOCX{!isPro && ' (Pro)'}
        </Button>
      </div>
    </div>
    <Textarea
      placeholder="Paste your full resume text here..."
      value={resumeText}
      onChange={(e) => onResumeChange(e.target.value)}
      className="min-h-[200px] bg-muted/30 resize-y"
    />
    <p className="text-xs text-muted-foreground mt-1">
      {uploadedFileName ? `📎 ${uploadedFileName} — ${wordCount(resumeText)} words` : (resumeText ? `${wordCount(resumeText)} words` : 'Paste text or upload PDF/DOCX (Pro)')}
    </p>
  </div>
);

const JobDescriptionSection: React.FC<{
  jobDescription: string;
  onChange: (val: string) => void;
}> = ({ jobDescription, onChange }) => (
  <div>
    <label className="text-sm font-medium mb-2 block">Job Description</label>
    <Textarea
      placeholder="Paste the full job posting here..."
      value={jobDescription}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px] bg-muted/30 resize-y"
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
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
        <p className="text-sm font-semibold">{tier === 'free' ? 'Free limit reached' : 'Monthly limit reached'}</p>
        <p className="text-xs text-muted-foreground">You've used all your application bundles {tier === 'free' ? 'on the free plan' : 'this month'}.</p>
        <Button size="sm" className="mt-2" onClick={onUpgrade}>Upgrade to continue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={onGenerate} disabled={isProcessing || !hasInputs} size="lg" className="w-full h-14 text-lg font-semibold gap-3 rounded-2xl">
        {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" />Generating... (takes ~30 seconds)</> : <><Sparkles className="w-5 h-5" />Generate Tailored Resume + Cover Letter + ATS Score</>}
      </Button>
      <p className="text-xs text-center text-muted-foreground">{remaining} bundle{remaining !== 1 ? 's' : ''} remaining {tier === 'free' ? '(free plan)' : 'this month'}</p>
    </div>
  );
};

const DocxRewriteSection: React.FC<{
  uploadedDocxFile: File | null;
  isPro: boolean;
  isRewritingDocx: boolean;
  editedDocxBase64: string | null;
  jobDescription: string;
  resumeText: string;
  onRewriteDocx: () => void;
  onDownloadEditedDocx: () => void;
}> = ({ uploadedDocxFile, isPro, isRewritingDocx, editedDocxBase64, jobDescription, resumeText, onRewriteDocx, onDownloadEditedDocx }) => {
  if (!uploadedDocxFile || !isPro) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold">AI DOCX Editing (Pro)</p>
            <p className="text-xs text-muted-foreground">
              Let GPT rewrite your uploaded DOCX paragraph-by-paragraph to match the job description — your original template, fonts, and formatting stay intact.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onRewriteDocx} disabled={isRewritingDocx || !jobDescription.trim()} className="gap-2">
            {isRewritingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {editedDocxBase64 ? 'Rewrite again' : 'Rewrite my DOCX'}
          </Button>
          {editedDocxBase64 && (
            <Button size="sm" variant="outline" onClick={onDownloadEditedDocx} className="gap-2">
              <Download className="w-4 h-4" /> Download edited DOCX
            </Button>
          )}
        </div>
        {editedDocxBase64 && (
          <div className="bg-background/60 rounded-lg p-3 border max-h-[300px] overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Rewritten resume preview:</p>
            <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">{resumeText}</pre>
          </div>
        )}
      </CardContent>
    </Card>
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
  const handleConfirm = () => {
    onOpenChange(false);
    if (!hasJobDescription) {
      toast({ title: 'Add a job description', description: 'Paste the JD, then click "Rewrite my DOCX" below.' });
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
          <AlertDialogTitle>Rewrite resume to match the job?</AlertDialogTitle>
          <AlertDialogDescription>
            We can have AI rewrite your uploaded resume to better match the job description, add missing keywords, and boost your ATS score. You'll be able to download it as PDF or DOCX.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep as is</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Yes, rewrite with AI</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResumeEngine;
