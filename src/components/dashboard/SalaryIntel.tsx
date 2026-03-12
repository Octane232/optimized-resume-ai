import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Building2, Sparkles, ChevronDown, ChevronUp, Copy, Loader2, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalaryData {
  benchmark: {
    title: string;
    location: string;
    salaryRange: { low: number; median: number; high: number };
    totalCompRange: { low: number; median: number; high: number };
    breakdown: { baseSalary: number; bonus: number; equity: string; benefits: string };
    marketDemand: string;
    demandReason: string;
    topPayingCompanies: string[];
    salaryFactors: string[];
    isUnderpaid: boolean | null;
    underpaidBy: number | null;
  };
  negotiation: {
    scripts: Array<{ style: string; label: string; opening: string; body: string; closing: string }>;
    keyTips: string[];
    counterOfferAdvice: string;
    timingAdvice: string;
  };
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const SalaryIntel: React.FC = () => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryData | null>(null);
  const [openScript, setOpenScript] = useState<number | null>(0);

  const handleSearch = async () => {
    if (!jobTitle.trim()) {
      toast({ title: 'Missing Info', description: 'Please enter a job title.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('salary-intel', {
        body: { jobTitle, company, location, yearsExperience: yearsExp, currentSalary },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not fetch salary data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyScript = (script: any) => {
    const text = `${script.opening}\n\n${script.body}\n\n${script.closing}`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Negotiation script copied to clipboard.' });
  };

  const demandColor = (d: string) => d === 'High' ? 'text-emerald-500 bg-emerald-500/10' : d === 'Medium' ? 'text-amber-500 bg-amber-500/10' : 'text-red-500 bg-red-500/10';

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Salary Intelligence</h1>
          <p className="text-sm text-muted-foreground">Know your worth before the first conversation.</p>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Job Title *</label>
                <Input placeholder="e.g. Senior Product Manager" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="bg-muted/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Company (optional)</label>
                <Input placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-muted/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                <Input placeholder="e.g. San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-muted/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Years of Experience</label>
                <Input placeholder="e.g. 5" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="bg-muted/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Current Salary (to check if you're underpaid)</label>
                <Input placeholder="e.g. 120000" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} className="bg-muted/30" />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading || !jobTitle.trim()} className="gap-2 w-full md:w-auto">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing market data...</> : <><Sparkles className="w-4 h-4" />Get Salary Intelligence</>}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Underpaid Alert */}
          {result.benchmark.isUnderpaid && result.benchmark.underpaidBy && result.benchmark.underpaidBy > 0 && (
            <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">You may be underpaid</h3>
                  <p className="text-sm text-muted-foreground">Based on market data, you could be earning {fmt(result.benchmark.underpaidBy)} more per year. Use the negotiation scripts below.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salary Range */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-bold text-foreground">{result.benchmark.title} — {result.benchmark.location}</h2>
                <Badge className={`${demandColor(result.benchmark.marketDemand)} border-0`}>{result.benchmark.marketDemand} Demand</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Low', value: result.benchmark.salaryRange.low, color: 'text-muted-foreground' },
                  { label: 'Median', value: result.benchmark.salaryRange.median, color: 'text-foreground' },
                  { label: 'High', value: result.benchmark.salaryRange.high, color: 'text-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{fmt(item.value)}</p>
                    <p className="text-xs text-muted-foreground">base salary</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                {result.benchmark.demandReason}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Base', value: fmt(result.benchmark.breakdown.baseSalary) },
                  { label: 'Bonus', value: fmt(result.benchmark.breakdown.bonus) },
                  { label: 'Equity', value: result.benchmark.breakdown.equity },
                  { label: 'Benefits', value: result.benchmark.breakdown.benefits },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Paying Companies */}
          {result.benchmark.topPayingCompanies?.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Top Paying Companies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.benchmark.topPayingCompanies.map((co, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">{co}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Negotiation Scripts */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Negotiation Scripts</h3>
              </div>
              <p className="text-sm text-muted-foreground">{result.negotiation.timingAdvice}</p>
              {result.negotiation.scripts?.map((script, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenScript(openScript === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{script.style}</Badge>
                      <span className="text-sm text-muted-foreground">{script.label}</span>
                    </div>
                    {openScript === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openScript === i && (
                    <div className="p-4 border-t border-border space-y-4">
                      <div className="space-y-3 text-sm">
                        <p className="italic text-primary">"{script.opening}"</p>
                        <p className="text-muted-foreground">{script.body}</p>
                        <p className="italic text-primary">"{script.closing}"</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyScript(script)} className="gap-2 w-full">
                        <Copy className="w-4 h-4" />
                        Copy Script
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Tips */}
          {result.negotiation.keyTips?.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-semibold text-foreground">Key Tips</h3>
                </div>
                <div className="space-y-3">
                  {result.negotiation.keyTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SalaryIntel;