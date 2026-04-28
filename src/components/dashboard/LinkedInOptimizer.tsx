import React, { useState, useEffect } from 'react';
import { Linkedin, Sparkles, Copy, Check, RefreshCw, History, Trash2, Target, TrendingUp, Eye, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

interface LinkedInOptimization {
  id: string; type: string; original_content: string | null;
  optimized_content: string; target_role: string | null; created_at: string;
}

const SECTION_TABS = [
  { value: 'headline', label: 'Headline', placeholder: 'Paste your current LinkedIn headline...', hint: 'Max 220 characters. Shown in search results and profile cards.' },
  { value: 'summary',  label: 'About',    placeholder: 'Paste your current About / Summary...', hint: 'Max 2,600 characters. Your professional story.' },
  { value: 'experience', label: 'Experience', placeholder: 'Paste experience bullets to rewrite...', hint: 'Paste one or more job bullets. We\'ll make them impact-focused.' },
  { value: 'skills',   label: 'Skills',   placeholder: 'Paste current skills (comma-separated)...', hint: 'We\'ll suggest the top 15 skills for your target role.' },
  { value: 'about',    label: 'Full About', placeholder: 'Paste background info or leave blank...', hint: 'We\'ll write a full compelling About section from scratch.' },
];

const TIPS = [
  { icon: Target,    title: 'Use Keywords',    description: 'Include industry-specific terms recruiters search for' },
  { icon: TrendingUp, title: 'Show Impact',    description: 'Quantify achievements with numbers and percentages' },
  { icon: Eye,       title: 'Be Discoverable', description: 'Optimize headline for LinkedIn search visibility' },
  { icon: User,      title: 'Tell Your Story', description: 'Make your summary personal and engaging' },
];

const LinkedInOptimizer: React.FC = () => {
  const { canUse, trackUsage, getRemaining, tier } = useUsageLimit();
  const [activeTab, setActiveTab] = useState('headline');
  const [content, setContent] = useState<Record<string, string>>({});
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState<string | null>(null);
  const [optimizedType, setOptimizedType] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<LinkedInOptimization[]>([]);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('linkedin_optimizations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
    if (data) setHistory(data);
  };

  const handleOptimize = async () => {
    const currentContent = content[activeTab] || '';
    if (!targetRole.trim() && !currentContent.trim()) {
      toast({ title: 'Input needed', description: 'Enter a target role or your current content.', variant: 'destructive' });
      return;
    }
    if (!canUse('linkedin')) {
      toast({ title: 'Limit reached', description: 'You have used all your LinkedIn optimizations.', variant: 'destructive' });
      return;
    }
    setIsOptimizing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. API call first
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('optimize-linkedin', {
        body: { type: activeTab, currentContent: currentContent.trim(), targetRole: targetRole.trim(), industry: industry.trim() }
      });
      if (aiError) throw aiError;
      if (aiResult?.error) throw new Error(aiResult.error);

      // 2. Save to DB
      const { data: saved } = await supabase.from('linkedin_optimizations').insert({
        user_id: user.id, type: activeTab, original_content: currentContent,
        optimized_content: aiResult.optimizedContent, target_role: targetRole
      }).select().single();

      // 3. Track usage AFTER success
      await trackUsage('linkedin');

      setOptimizedContent(aiResult.optimizedContent);
      setOptimizedType(activeTab);
      if (saved) setHistory([saved, ...history.slice(0, 4)]);
      toast({ title: 'Done!', description: 'Your optimized content is ready to copy.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not optimize. Try again.', variant: 'destructive' });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedContent) return;
    navigator.clipboard.writeText(optimizedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied!' });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('linkedin_optimizations').delete().eq('id', id);
    setHistory(history.filter(h => h.id !== id));
  };

  const remaining = getRemaining('linkedin');
  const activeSection = SECTION_TABS.find(t => t.value === activeTab);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#0A66C2] text-white"><Linkedin className="w-6 h-6" /></div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">LinkedIn Optimizer</h1>
          <p className="text-sm text-muted-foreground">AI-powered enhancement for headline, about, experience, and skills</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#0A66C2]" />AI Optimizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Role</label>
                  <Input placeholder="e.g., Senior Product Manager" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Industry (optional)</label>
                  <Input placeholder="e.g., Fintech, SaaS, Healthcare" value={industry} onChange={e => setIndustry(e.target.value)} />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setOptimizedContent(null); }}>
                <TabsList className="w-full grid grid-cols-5">
                  {SECTION_TABS.map(t => <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>)}
                </TabsList>
                {SECTION_TABS.map(t => (
                  <TabsContent key={t.value} value={t.value} className="space-y-2 mt-4">
                    <Textarea placeholder={t.placeholder} value={content[t.value] || ''} onChange={e => setContent(prev => ({ ...prev, [t.value]: e.target.value }))} rows={5} />
                    <p className="text-xs text-muted-foreground">{t.hint}</p>
                  </TabsContent>
                ))}
              </Tabs>

              {!canUse('linkedin') ? (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
                  <p className="text-sm font-semibold">{tier === 'free' ? 'Free limit reached' : 'Monthly limit reached'}</p>
                  <p className="text-xs text-muted-foreground mt-1">You've used all your LinkedIn optimizations {tier === 'free' ? 'on the free plan' : 'this month'}.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Button className="w-full gap-2 bg-[#0A66C2] hover:bg-[#004182]" onClick={handleOptimize} disabled={isOptimizing}>
                    {isOptimizing ? <><RefreshCw className="w-4 h-4 animate-spin" />Optimizing...</> : <><Sparkles className="w-4 h-4" />Optimize {activeSection?.label} with AI</>}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">{remaining} optimization{remaining !== 1 ? 's' : ''} remaining {tier === 'free' ? '(free plan)' : 'this month'}</p>
                </div>
              )}

              {optimizedContent && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#0A66C2]">Optimized {SECTION_TABS.find(t => t.value === optimizedType)?.label}</label>
                    <Button size="sm" variant="ghost" className="gap-1.5" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/20">
                    <p className="text-sm whitespace-pre-wrap">{optimizedContent}</p>
                  </div>
                </motion.div>
              )}

              {history.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-3"><History className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium">Recent Optimizations</span></div>
                  <div className="space-y-2">
                    {history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{h.type}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">{h.optimized_content.slice(0, 60)}...</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => { setOptimizedContent(h.optimized_content); setOptimizedType(h.type); }}>Use</Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive" onClick={() => handleDelete(h.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4"><CardTitle className="text-lg">Optimization Tips</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#0A66C2]/10 shrink-0"><tip.icon className="w-4 h-4 text-[#0A66C2]" /></div>
                  <div>
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
