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

const getScoreColor = (s: number) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-amber-500' : 'text-red-500';
const getProgressColor = (s: number) => s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';
const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;

const STEPS = [
  { icon: '📄', label: 'Paste resume + job', desc: 'One input, three outputs' },
  { icon: '✨', label: 'AI tailors everything', desc: 'Resume, cover letter, ATS score' },
  { icon: '📈', label: 'See your score jump', desc: 'Saved to your account automatically' },
];

const ResumeEngine: React.FC<{ setActiveTab?: (tab: string) => void; hasResume?: boolean }> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { canUse, trackUsage, getRemaining, tier } = useUsageLimit();
  const isPro = tier === 'pro' || tier === 'premium';
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [result, setResult] = useState<BundleResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState('ats');
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
      const res = await fetch(`https://xpmhahyvtyvrxryrqane.supabase.co/functions/v1/parse-resume-file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token || ''}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setResumeText(json.text || '');
      setUploadedFileName(file.name);
      toast({ title: 'Resume uploaded', description: `${file.name} parsed successfully.` });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
    a.href = url; a.download = 'tailored-resume.docx';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({ title: 'Missing Input', description: 'Paste both your resume and the job description.', variant: 'destructive' });
      return;
    }
    if (!canUse('resume_ats')) {
      toast({ title: 'Limit reached', description: 'You have used all your application bundles.', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    setResult(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', user?.id || '').maybeSingle();

      // 1. API call FIRST
      const { data, error } = await supabase.functions.invoke('apply-bundle', {
        body: { jobDescription: jobDescription.trim(), userResume: resumeText.trim(), userName: profile?.full_name || '' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // 2. Save results to DB
      if (user) {
        await Promise.allSettled([
          supabase.from('resumes').insert({
            user_id: user.id,
            title: `Tailored Resume — ${new Date().toLocaleDateString()}`,
            content: { text: data.tailoredResume, ats_score: data.atsData?.afterScore ?? null, job_description: jobDescription.trim() } as any,
          }),
          supabase.from('cover_letters').insert({
            user_id: user.id,
            job_title: 'Tailored Application',
            content: data.coverLetter,
          }),
        ]);
      }

      // 3. Track usage AFTER success
      await trackUsage('resume_ats');

      setResult(data);
      setActiveResultTab('ats');
      toast({ title: 'Done!', description: 'Tailored resume, cover letter, and ATS score ready. Saved to your account.' });
    } catch (error: any) {
      console.error('Apply bundle error:', error);
      toast({ title: 'Error', description: error.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
  };

  const handleReset = () => { setResult(null); setResumeText(''); setJobDescription(''); };

  if (result) {
    const improvement = result.atsData.afterScore - result.atsData.beforeScore;
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Results Ready</h1>
              <p className="text-sm text-muted-foreground">Saved to your account automatically.</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleReset} className="gap-2"><RefreshCw className="w-4 h-4" />Start Over</Button>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Before</p>
                <p className={`text-5xl font-black ${getScoreColor(result.atsData.beforeScore)}`}>{result.atsData.beforeScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">Original ATS Score</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-500">+{improvement}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">After</p>
                <p className={`text-5xl font-black ${getScoreColor(result.atsData.afterScore)}`}>{result.atsData.afterScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">Optimized ATS Score</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground"><span>ATS Compatibility</span><span>{result.atsData.afterScore}%</span></div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${result.atsData.afterScore}%` }} transition={{ duration: 1, delay: 0.5 }} className={`h-full rounded-full ${getProgressColor(result.atsData.afterScore)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeResultTab} onValueChange={setActiveResultTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume"><FileText className="w-4 h-4 mr-2" />Tailored Resume</TabsTrigger>
            <TabsTrigger value="cover"><Clipboard className="w-4 h-4 mr-2" />Cover Letter</TabsTrigger>
            <TabsTrigger value="ats"><Sparkles className="w-4 h-4 mr-2" />ATS Details</TabsTrigger>
          </TabsList>
          <TabsContent value="resume">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">Tailored Resume</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(result.tailoredResume, 'Resume')} className="gap-2"><Copy className="w-4 h-4" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={downloadAsPDF} disabled={!isPro} className="gap-2" title={isPro ? 'Download PDF' : 'Pro feature'}>
                    {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />} PDF{!isPro && ' (Pro)'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsDOCX} disabled={!isPro} className="gap-2" title={isPro ? 'Download DOCX' : 'Pro feature'}>
                    {isPro ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />} DOCX{!isPro && ' (Pro)'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto font-mono">{result.tailoredResume}</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cover">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Cover Letter</CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleCopy(result.coverLetter, 'Cover Letter')} className="gap-2"><Copy className="w-4 h-4" />Copy</Button>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto">{result.coverLetter}</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ats">
            <Card>
              <CardContent className="p-6 space-y-6">
                {result.atsData.missingKeywords?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />Missing Keywords (Added in Tailored Version)</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.atsData.missingKeywords.map((kw: any, i: number) => (
                        <Badge key={i} variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20">
                          {typeof kw === 'string' ? kw : kw.keyword ?? JSON.stringify(kw)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.atsData.foundKeywords?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />Keywords Already Present</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.atsData.foundKeywords.map((kw: any, i: number) => (
                        <Badge key={i} variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                          ✓ {typeof kw === 'string' ? kw : kw.keyword ?? JSON.stringify(kw)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.atsData.improvements?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />Improvements Made</h4>
                    <ul className="space-y-2">
                      {result.atsData.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  const remaining = getRemaining('resume_ats');
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground"><FileText className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resume + ATS</h1>
            <p className="text-sm text-muted-foreground">Paste your resume and a job description. Get a tailored resume, cover letter, and ATS score in 60 seconds.</p>
          </div>
        </div>
      </motion.div>

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

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <label className="text-sm font-medium">Your Resume</label>
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => isPro ? fileInputRef.current?.click() : toast({ title: 'Pro feature', description: 'Upgrade to Pro to upload PDF/DOCX resumes.', variant: 'destructive' })}
                disabled={isUploading}
                className="gap-2"
                title={isPro ? 'Upload PDF or DOCX' : 'Pro feature'}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPro ? <Upload className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
                Upload PDF/DOCX{!isPro && ' (Pro)'}
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Paste your full resume text here..."
            value={resumeText}
            onChange={(e) => { setResumeText(e.target.value); if (uploadedFileName) setUploadedFileName(null); }}
            className="min-h-[200px] bg-muted/30 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {uploadedFileName ? `📎 ${uploadedFileName} — ${wordCount(resumeText)} words` : (resumeText ? `${wordCount(resumeText)} words` : 'Paste text or upload PDF/DOCX (Pro)')}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Job Description</label>
          <Textarea
            placeholder="Paste the full job posting here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] bg-muted/30 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">{jobDescription ? `${wordCount(jobDescription)} words` : 'Copy the entire posting from LinkedIn, Indeed, etc.'}</p>
        </div>
      </div>

      {!canUse('resume_ats') ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
          <p className="text-sm font-semibold">{tier === 'free' ? 'Free limit reached' : 'Monthly limit reached'}</p>
          <p className="text-xs text-muted-foreground">You've used all your application bundles {tier === 'free' ? 'on the free plan' : 'this month'}.</p>
          {setActiveTab && <Button size="sm" className="mt-2" onClick={() => setActiveTab('billing')}>Upgrade to continue</Button>}
        </div>
      ) : (
        <div className="space-y-2">
          <Button onClick={handleGenerate} disabled={isProcessing || !resumeText.trim() || !jobDescription.trim()} size="lg" className="w-full h-14 text-lg font-semibold gap-3 rounded-2xl">
            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" />Generating... (takes ~30 seconds)</> : <><Sparkles className="w-5 h-5" />Generate Tailored Resume + Cover Letter + ATS Score</>}
          </Button>
          <p className="text-xs text-center text-muted-foreground">{remaining} bundle{remaining !== 1 ? 's' : ''} remaining {tier === 'free' ? '(free plan)' : 'this month'}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeEngine;
