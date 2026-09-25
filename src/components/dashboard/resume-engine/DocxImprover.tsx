import React, { useMemo, useState } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Download, Loader2, Pencil, ScanSearch, Sparkles, X, AlertTriangle, Info } from 'lucide-react';
import { runScan, hasLayoutProblems, type ScanResult } from '@/lib/ats';

type Suggestion = { id: number; original: string; improved: string; reason: string };
type Decision = 'pending' | 'accepted' | 'rejected';

async function callRewrite(fd: FormData) {
  const { data, error } = await supabase.functions.invoke('rewrite-docx', { body: fd });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try { msg = (await error.context.json()).error || msg; } catch { /* keep */ }
    }
    throw new Error(msg);
  }
  return data;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function plainText(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_]+)_(?!_)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .trim();
}

const ScorePill: React.FC<{ label: string; before: number; after?: number }> = ({ label, before, after }) => (
  <div className="rounded-lg border bg-background p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-foreground">
      {before}
      {after !== undefined && (<><ArrowRight className="h-4 w-4 text-muted-foreground" /><span className={after >= before ? 'text-primary' : 'text-destructive'}>{after}</span></>)}
      <span className="text-sm font-normal text-muted-foreground">/100</span>
    </p>
  </div>
);

const DocxImprover: React.FC<{ file: File; resumeText: string; jobDescription: string }> = ({ file, resumeText, jobDescription }) => {
  const { toast } = useToast();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState<'suggest' | 'apply' | null>(null);
  const [result, setResult] = useState<{ base64: string; text: string; scan: ScanResult } | null>(null);

  const jdOk = jobDescription.trim().length >= 30;
  const accepted = suggestions.filter((s) => decisions[s.id] === 'accepted');
  const layoutIssue = scan ? hasLayoutProblems(scan) : false;

  const doScan = () => {
    if (!jdOk || resumeText.trim().length < 50) {
      toast({ title: 'Missing input', description: 'Add your resume and the job description first.', variant: 'destructive' });
      return;
    }
    setScan(runScan(resumeText, jobDescription));
    setSuggestions([]); setDecisions({}); setEdits({}); setResult(null);
  };

  const doSuggest = async () => {
    if (!scan) return;
    setLoading('suggest');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('mode', 'suggest');
      fd.append('jobDescription', jobDescription.trim());
      fd.append('missingKeywords', scan.missing.slice(0, 30).join(', '));
      const data = await callRewrite(fd);
      const list: Suggestion[] = (data.suggestions || []).map((suggestion: Suggestion) => ({
        ...suggestion,
        improved: plainText(suggestion.improved),
      }));
      setSuggestions(list);
      setDecisions(Object.fromEntries(list.map((s) => [s.id, 'pending' as Decision])));
      if (!list.length) toast({ title: 'No changes suggested', description: 'Your wording already fits this job well.' });
    } catch (e: any) {
      toast({ title: 'Could not get suggestions', description: e.message, variant: 'destructive' });
    } finally { setLoading(null); }
  };

  const doApply = async () => {
    setLoading('apply');
    try {
      const map: Record<string, string> = {};
      accepted.forEach((s) => { map[String(s.id)] = plainText(edits[s.id] ?? s.improved); });
      const fd = new FormData();
      fd.append('file', file); fd.append('mode', 'apply'); fd.append('edits', JSON.stringify(map));
      const data = await callRewrite(fd);
      setResult({ base64: data.docxBase64, text: data.previewText, scan: runScan(data.previewText, jobDescription) });
    } catch (e: any) {
      toast({ title: 'Could not update your file', description: e.message, variant: 'destructive' });
    } finally { setLoading(null); }
  };

  const doDownload = async () => {
    if (!result) return;
    const base = file.name.replace(/\.docx$/i, '');
    const bin = atob(result.base64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    download(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), `${base}-improved.docx`);
  };

  const fixedIssues = useMemo(() => {
    if (!scan || !result) return [];
    const after = new Set(result.scan.issues.map((i) => i.message));
    return scan.issues.filter((i) => !after.has(i.message));
  }, [scan, result]);
  const newlyMatched = useMemo(() => (scan && result ? result.scan.matching.filter((k) => !scan.matching.includes(k)) : []), [scan, result]);

  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Improve my DOCX</p>
            <p className="text-sm text-muted-foreground">Scan, review each suggested change, then download your original file with the changes you accepted.</p>
          </div>
          <div className="flex gap-1 text-xs">
            {['Scan', 'Improve', 'Review', 'Re-scan'].map((s, i) => {
              const done = [!!scan, suggestions.length > 0, !!result, !!result][i];
              return <Badge key={s} variant={done ? 'default' : 'outline'}>{i + 1}. {s}</Badge>;
            })}
          </div>
        </div>

        {!scan ? (
          <Button onClick={doScan} disabled={!jdOk} className="gap-2"><ScanSearch className="h-4 w-4" /> Scan resume</Button>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScorePill label="ATS score" before={scan.atsScore} after={result?.scan.atsScore} />
              <ScorePill label="Format score" before={scan.formatScore} after={result?.scan.formatScore} />
            </div>
            <p className="text-xs text-muted-foreground">Scores come from a fixed rule-based scanner, not from AI, so the same resume always gets the same score.</p>
            {scan.missing.length > 0 && !result && (
              <div>
                <p className="mb-1 text-xs font-medium text-foreground">Missing keywords</p>
                <div className="flex flex-wrap gap-1">{scan.missing.slice(0, 20).map((k) => <Badge key={k} variant="outline">{k}</Badge>)}</div>
              </div>
            )}
            {!result && scan.issues.filter((i) => i.type !== 'info').slice(0, 6).map((i, n) => (
              <p key={n} className="flex items-start gap-2 text-sm text-muted-foreground"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{i.message}</p>
            ))}
            {!suggestions.length && !result && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={doSuggest} disabled={loading !== null} className="gap-2">
                  {loading === 'suggest' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Suggest improvements
                </Button>
                <Button variant="outline" onClick={doScan}>Scan again</Button>
              </div>
            )}
          </div>
        )}

        {suggestions.length > 0 && !result && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{suggestions.length} suggested changes · {accepted.length} accepted</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setDecisions(Object.fromEntries(suggestions.map((s) => [s.id, 'accepted' as Decision])))}>Accept all</Button>
                <Button size="sm" variant="outline" onClick={() => setDecisions(Object.fromEntries(suggestions.map((s) => [s.id, 'rejected' as Decision])))}>Reject all</Button>
              </div>
            </div>
            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {suggestions.map((s) => {
                const d = decisions[s.id];
                return (
                  <div key={s.id} className={`rounded-lg border p-3 ${d === 'accepted' ? 'border-primary/40 bg-primary/5' : d === 'rejected' ? 'opacity-60' : ''}`}>
                    <p className="text-xs font-medium text-muted-foreground">Original</p>
                    <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/40">{s.original}</p>
                    <p className="mt-2 text-xs font-medium text-primary">Improved</p>
                    {editing === s.id ? (
                      <Textarea value={edits[s.id] ?? s.improved} onChange={(e) => setEdits({ ...edits, [s.id]: e.target.value })} className="mt-1 text-sm" rows={3} />
                    ) : (
                      <p className="text-sm text-foreground">{edits[s.id] ?? s.improved}</p>
                    )}
                    {s.reason && <p className="mt-1 flex gap-1 text-xs text-muted-foreground"><Info className="mt-0.5 h-3 w-3 shrink-0" />{s.reason}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button size="sm" variant={d === 'accepted' ? 'default' : 'outline'} className="gap-1" onClick={() => { setDecisions({ ...decisions, [s.id]: 'accepted' }); setEditing(null); }}><Check className="h-3.5 w-3.5" /> Accept</Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => { setDecisions({ ...decisions, [s.id]: 'rejected' }); setEditing(null); }}><X className="h-3.5 w-3.5" /> Reject</Button>
                      <Button size="sm" variant="ghost" className="gap-1" onClick={() => { setEditing(editing === s.id ? null : s.id); setDecisions({ ...decisions, [s.id]: 'accepted' }); }}><Pencil className="h-3.5 w-3.5" /> {editing === s.id ? 'Done' : 'Edit'}</Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button onClick={doApply} disabled={loading !== null || accepted.length === 0} className="gap-2">
              {loading === 'apply' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />} Apply {accepted.length} changes and re-scan
            </Button>
          </div>
        )}

        {result && scan && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="font-medium text-foreground">Why the score changed</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {newlyMatched.length > 0 && <li>Now matches: {newlyMatched.join(', ')}</li>}
                {fixedIssues.map((i, n) => <li key={n}>Fixed: {i.message}</li>)}
                <li>Keyword match {scan.breakdown.keywordMatch} → {result.scan.breakdown.keywordMatch}, readability {scan.breakdown.readability} → {result.scan.breakdown.readability}</li>
                {result.scan.missing.length > 0 && <li>Still missing (add only if true for you): {result.scan.missing.slice(0, 10).join(', ')}</li>}
              </ul>
            </div>

            <div className="rounded-lg border border-primary bg-primary/5 p-3">
              <p className="text-sm font-medium text-foreground">Original design preserved</p>
              <p className="text-xs text-muted-foreground">Your template, fonts, bold text, spacing and layout stay in place. Only accepted wording changes.</p>
              {layoutIssue && <p className="mt-2 text-xs text-muted-foreground">The scanner found possible layout issues, but it will not redesign your document.</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={doDownload} className="gap-2"><Download className="h-4 w-4" /> Download DOCX</Button>
              <Button variant="outline" onClick={() => { setResult(null); }}>Back to review</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocxImprover;
