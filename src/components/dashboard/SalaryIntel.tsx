import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
interface SalaryData {
  benchmark: {
    title: string;
    location: string;
    salaryRange: { low: number; median: number; high: number };
    totalCompRange: { low: number; median: number; high: number };
    breakdown: {
      baseSalary: number;
      bonus: number;
      equity: string;
      benefits: string;
    };
    marketDemand: string;
    demandReason: string;
    topPayingCompanies: string[];
    salaryFactors: string[];
    isUnderpaid: boolean | null;
    underpaidBy: number | null;
  };
  negotiation: {
    scripts: Array<{
      style: string;
      label: string;
      opening: string;
      body: string;
      closing: string;
    }>;
    keyTips: string[];
    counterOfferAdvice: string;
    timingAdvice: string;
  };
}

interface SalaryRange {
  label: string;
  value: number;
  color: string;
}

interface CompensationItem {
  label: string;
  value: string;
}

// ===== Helper Functions =====
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const getDemandColor = (demand: string): string => {
  switch (demand) {
    case 'High':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'Medium':
      return 'text-amber-500 bg-amber-500/10';
    default:
      return 'text-red-500 bg-red-500/10';
  }
};

// ===== Main Component =====
const SalaryIntel: React.FC = () => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { canUse, trackUsage, getRemaining } = useUsageLimit();

  // ===== State =====
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryData | null>(null);
  const [openScript, setOpenScript] = useState<number | null>(0);

  // ===== Derived Values =====
  const hasCredits = canUse('salary_intel');
  const isFormValid = jobTitle.trim().length > 0;

  // ===== Event Handlers =====
  const handleSearch = async () => {
    // Check credits
    if (!hasCredits) {
      toast({
        title: 'Limit reached',
        description: 'You have used all your salary lookups. Upgrade to get more.',
        variant: 'destructive'
      });
      return;
    }

    // Validate input
    if (!isFormValid) {
      toast({
        title: 'Missing Info',
        description: 'Please enter a job title.',
        variant: 'destructive'
      });
      return;
    }

    // Spend credit
    await trackUsage('salary_intel');

    setLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('salary-intel', {
        body: {
          jobTitle,
          company,
          location,
          yearsExperience: yearsExp,
          currentSalary
        },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);

    } catch (error: any) {
      console.error('Salary intel error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not fetch salary data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyScript = (script: SalaryData['negotiation']['scripts'][0]) => {
    const text = `${script.opening}\n\n${script.body}\n\n${script.closing}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Negotiation script copied to clipboard.'
    });
  };

  const toggleScript = (index: number) => {
    setOpenScript(openScript === index ? null : index);
  };

  // ===== Salary Range Data =====
  const salaryRanges: SalaryRange[] = result ? [
    { label: 'Low', value: result.benchmark.salaryRange.low, color: 'text-muted-foreground' },
    { label: 'Median', value: result.benchmark.salaryRange.median, color: 'text-foreground' },
    { label: 'High', value: result.benchmark.salaryRange.high, color: 'text-emerald-500' },
  ] : [];

  const compensationItems: CompensationItem[] = result ? [
    { label: 'Base', value: formatCurrency(result.benchmark.breakdown.baseSalary) },
    { label: 'Bonus', value: formatCurrency(result.benchmark.breakdown.bonus) },
    { label: 'Equity', value: result.benchmark.breakdown.equity },
    { label: 'Benefits', value: result.benchmark.breakdown.benefits },
  ] : [];

  // ===== Render =====
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <HeaderSection />

      {/* Input Form */}
      <InputForm
        jobTitle={jobTitle}
        company={company}
        location={location}
        yearsExp={yearsExp}
        currentSalary={currentSalary}
        loading={loading}
        hasCredits={hasCredits}
        isFormValid={isFormValid}
        onJobTitleChange={setJobTitle}
        onCompanyChange={setCompany}
        onLocationChange={setLocation}
        onYearsExpChange={setYearsExp}
        onCurrentSalaryChange={setCurrentSalary}
        onSearch={handleSearch}
      />

      {/* Results */}
      {result && (
        <ResultsSection
          result={result}
          salaryRanges={salaryRanges}
          compensationItems={compensationItems}
          openScript={openScript}
          onToggleScript={toggleScript}
          onCopyScript={handleCopyScript}
        />
      )}
    </div>
  );
};

// ===== Header Section =====
const HeaderSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3"
  >
    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
      <DollarSign className="w-6 h-6" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground">Salary Intelligence</h1>
      <p className="text-sm text-muted-foreground">
        Know your worth before the first conversation.
      </p>
    </div>
  </motion.div>
);

// ===== Input Form Component =====
interface InputFormProps {
  jobTitle: string;
  company: string;
  location: string;
  yearsExp: string;
  currentSalary: string;
  loading: boolean;
  hasCredits: boolean;
  isFormValid: boolean;
  onJobTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onYearsExpChange: (value: string) => void;
  onCurrentSalaryChange: (value: string) => void;
  onSearch: () => Promise<void>;
}

const InputForm: React.FC<InputFormProps> = ({
  jobTitle,
  company,
  location,
  yearsExp,
  currentSalary,
  loading,
  hasCredits,
  isFormValid,
  onJobTitleChange,
  onCompanyChange,
  onLocationChange,
  onYearsExpChange,
  onCurrentSalaryChange,
  onSearch,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 }}
  >
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <InputField
            id="job-title"
            label="Job Title *"
            placeholder="e.g. Senior Product Manager"
            value={jobTitle}
            onChange={onJobTitleChange}
          />

          <InputField
            id="company"
            label="Company (optional)"
            placeholder="e.g. Google"
            value={company}
            onChange={onCompanyChange}
          />

          <InputField
            id="location"
            label="Location"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={onLocationChange}
          />

          <InputField
            id="years-exp"
            label="Years of Experience"
            placeholder="e.g. 5"
            value={yearsExp}
            onChange={onYearsExpChange}
          />

          <InputField
            id="current-salary"
            label="Current Salary (to check if you're underpaid)"
            placeholder="e.g. 120000"
            value={currentSalary}
            onChange={onCurrentSalaryChange}
          />
        </div>

        <Button
          onClick={onSearch}
          disabled={loading || !isFormValid || !hasCredits}
          className="gap-2 w-full md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing market data...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get Salary Intelligence
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

// ===== Input Field Component =====
interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-foreground mb-1 block">
      {label}
    </label>
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted/30"
    />
  </div>
);

// ===== Results Section Component =====
interface ResultsSectionProps {
  result: SalaryData;
  salaryRanges: SalaryRange[];
  compensationItems: CompensationItem[];
  openScript: number | null;
  onToggleScript: (index: number) => void;
  onCopyScript: (script: SalaryData['negotiation']['scripts'][0]) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  result,
  salaryRanges,
  compensationItems,
  openScript,
  onToggleScript,
  onCopyScript,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Underpaid Alert */}
    {result.benchmark.isUnderpaid && result.benchmark.underpaidBy && result.benchmark.underpaidBy > 0 && (
      <UnderpaidAlert underpaidBy={result.benchmark.underpaidBy} />
    )}

    {/* Salary Range Card */}
    <SalaryRangeCard
      title={result.benchmark.title}
      location={result.benchmark.location}
      marketDemand={result.benchmark.marketDemand}
      demandReason={result.benchmark.demandReason}
      salaryRanges={salaryRanges}
      compensationItems={compensationItems}
    />

    {/* Top Paying Companies */}
    {result.benchmark.topPayingCompanies?.length > 0 && (
      <TopCompanies companies={result.benchmark.topPayingCompanies} />
    )}

    {/* Negotiation Scripts */}
    <NegotiationScripts
      scripts={result.negotiation.scripts}
      timingAdvice={result.negotiation.timingAdvice}
      openScript={openScript}
      onToggleScript={onToggleScript}
      onCopyScript={onCopyScript}
    />

    {/* Key Tips */}
    {result.negotiation.keyTips?.length > 0 && (
      <KeyTips tips={result.negotiation.keyTips} />
    )}
  </motion.div>
);

// ===== Underpaid Alert Component =====
interface UnderpaidAlertProps {
  underpaidBy: number;
}

const UnderpaidAlert: React.FC<UnderpaidAlertProps> = ({ underpaidBy }) => (
  <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
    <CardContent className="p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
      <div>
        <h3 className="font-semibold text-foreground">You may be underpaid</h3>
        <p className="text-sm text-muted-foreground">
          Based on market data, you could be earning {formatCurrency(underpaidBy)} more per year.
          Use the negotiation scripts below.
        </p>
      </div>
    </CardContent>
  </Card>
);

// ===== Salary Range Card Component =====
interface SalaryRangeCardProps {
  title: string;
  location: string;
  marketDemand: string;
  demandReason: string;
  salaryRanges: SalaryRange[];
  compensationItems: CompensationItem[];
}

const SalaryRangeCard: React.FC<SalaryRangeCardProps> = ({
  title,
  location,
  marketDemand,
  demandReason,
  salaryRanges,
  compensationItems,
}) => (
  <Card className="border-0 shadow-lg overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />

    <CardContent className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-foreground">
          {title} — {location}
        </h2>
        <Badge className={`${getDemandColor(marketDemand)} border-0`}>
          {marketDemand} Demand
        </Badge>
      </div>

      {/* Salary Ranges */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {salaryRanges.map((item, index) => (
          <div key={index} className="p-4 rounded-xl bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {formatCurrency(item.value)}
            </p>
            <p className="text-xs text-muted-foreground">base salary</p>
          </div>
        ))}
      </div>

      {/* Demand Reason */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
        {demandReason}
      </div>

      {/* Compensation Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {compensationItems.map((item, index) => (
          <div key={index} className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// ===== Top Companies Component =====
interface TopCompaniesProps {
  companies: string[];
}

const TopCompanies: React.FC<TopCompaniesProps> = ({ companies }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Top Paying Companies</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.map((company, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {company}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

// ===== Negotiation Scripts Component =====
interface NegotiationScriptsProps {
  scripts: SalaryData['negotiation']['scripts'];
  timingAdvice: string;
  openScript: number | null;
  onToggleScript: (index: number) => void;
  onCopyScript: (script: SalaryData['negotiation']['scripts'][0]) => void;
}

const NegotiationScripts: React.FC<NegotiationScriptsProps> = ({
  scripts,
  timingAdvice,
  openScript,
  onToggleScript,
  onCopyScript,
}) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Negotiation Scripts</h3>
      </div>

      <p className="text-sm text-muted-foreground">{timingAdvice}</p>

      {scripts?.map((script, index) => (
        <div key={index} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => onToggleScript(index)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline">{script.style}</Badge>
              <span className="text-sm text-muted-foreground">{script.label}</span>
            </div>
            {openScript === index ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {openScript === index && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="space-y-3 text-sm">
                <p className="italic text-primary">"{script.opening}"</p>
                <p className="text-muted-foreground">{script.body}</p>
                <p className="italic text-primary">"{script.closing}"</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopyScript(script)}
                className="gap-2 w-full"
              >
                <Copy className="w-4 h-4" />
                Copy Script
              </Button>
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

// ===== Key Tips Component =====
interface KeyTipsProps {
  tips: string[];
}

const KeyTips: React.FC<KeyTipsProps> = ({ tips }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <h3 className="font-semibold text-foreground">Key Tips</h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            {tip}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SalaryIntel;
