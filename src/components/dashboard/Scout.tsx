import React, { useState, useEffect } from 'react';
import { 
  Telescope, Search, MapPin, DollarSign, Clock, ExternalLink,
  Sparkles, Crown, Lock, Zap, TrendingUp, Rocket, Building2,
  Users, ArrowUpRight, RefreshCw, Bell, BellOff
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface RadarSignal {
  id: string;
  company_name: string;
  amount: string | null;
  funding_stage: string | null;
  industry: string | null;
  description: string | null;
  source_url: string;
  likely_roles: string[] | null;
  hiring_window: string | null;
  published_at: string | null;
  created_at: string | null;
}

interface RadarAlert {
  id: string;
  signal_id: string;
  match_score: number;
  match_reasons: string[] | null;
  insight: string | null;
  is_read: boolean | null;
  created_at: string | null;
  radar_signals: RadarSignal;
}

const Scout: React.FC = () => {
  const { tier } = useSubscription();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<RadarAlert[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'alerts' | 'all'>('alerts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch user's matched alerts with signal data
      if (user) {
        const { data: alertsData } = await supabase
          .from('radar_alerts')
          .select('*, radar_signals(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (alertsData) {
          setAlerts(alertsData as unknown as RadarAlert[]);
        }
      }

      // Fetch all recent signals
      const { data: signalsData } = await supabase
        .from('radar_signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (signalsData) {
        setSignals(signalsData);
      }
    } catch (error) {
      console.error('Error fetching radar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('radar-scan');
      if (error) throw error;
      
      toast({
        title: "Radar Scan Complete",
        description: `Found ${data?.signalsCreated || 0} new funding signals.`,
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error.message || "Could not complete radar scan.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const getStageColor = (stage: string | null) => {
    switch (stage?.toLowerCase()) {
      case 'seed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'series a': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'series b': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'series c': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const filteredSignals = (viewMode === 'alerts' ? alerts.map(a => ({ ...a.radar_signals, alert: a })) : signals)
    .filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return s.company_name?.toLowerCase().includes(q) ||
        s.industry?.toLowerCase().includes(q) ||
        s.likely_roles?.some((r: string) => r.toLowerCase().includes(q));
    });

  const isPro = tier === 'pro' || tier === 'premium';
  const visibleSignals = tier === 'free' ? filteredSignals.slice(0, 3) : filteredSignals;
  const lockedCount = filteredSignals.length - visibleSignals.length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <Telescope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hidden Job Radar</h1>
            <p className="text-sm text-muted-foreground">Companies raising funding = companies about to hire</p>
          </div>
        </div>
        
        <Button 
          onClick={handleScan} 
          disabled={scanning}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan Now'}
        </Button>
      </motion.div>

      {/* Explainer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">How it works</p>
                <p className="text-xs text-muted-foreground mt-1">
                  When a company raises funding, they hire aggressively in the next 30–90 days. 
                  The Radar finds these signals <strong>before</strong> jobs are posted — giving you a 14-day head start 
                  over 250+ other applicants.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Toggle + Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('alerts')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'alerts' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            <Bell className="w-3.5 h-3.5 inline mr-1.5" />
            My Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            All Signals ({signals.length})
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by company, industry, or role..." 
            className="pl-10 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Signals List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm animate-pulse">
              <CardContent className="p-5">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : visibleSignals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Telescope className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {viewMode === 'alerts' ? 'No Alerts Yet' : 'No Signals Found'}
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              {viewMode === 'alerts' 
                ? 'Set your target role and industry in Settings, then run a scan to get matched alerts.'
                : 'Click "Scan Now" to discover companies that just raised funding and are about to hire.'}
            </p>
            <Button onClick={handleScan} disabled={scanning} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              Run First Scan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleSignals.map((signal: any, index) => {
            const alert = signal.alert || null;
            const s = alert ? signal : signal;
            
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Company Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {s.company_name?.[0] || 'C'}
                      </div>

                      {/* Signal Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                              {s.company_name}
                              {s.amount && (
                                <Badge variant="outline" className={`${getStageColor(s.funding_stage)} text-xs`}>
                                  {s.funding_stage} · {s.amount}
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                          </div>

                          {/* Match Score (only for alerts) */}
                          {alert && (
                            <div className={`text-right shrink-0 ${getMatchColor(alert.match_score)}`}>
                              <div className="text-2xl font-bold">{alert.match_score}%</div>
                              <div className="text-xs">match</div>
                            </div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          {s.industry && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {s.industry}
                            </span>
                          )}
                          {s.hiring_window && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Hiring: {s.hiring_window}
                            </span>
                          )}
                          {s.published_at && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {new Date(s.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Likely Roles */}
                        {s.likely_roles && s.likely_roles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="text-xs text-muted-foreground mr-1 py-0.5">Likely hiring:</span>
                            {s.likely_roles.map((role: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs font-normal bg-muted/50">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Alert Insight */}
                        {alert?.insight && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-foreground">
                            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                            {alert.insight}
                          </div>
                        )}

                        {/* Match Reasons */}
                        {alert?.match_reasons && alert.match_reasons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {alert.match_reasons.map((reason: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                                ✓ {reason}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Locked Teaser */}
          {lockedCount > 0 && (
            <Card className="border-dashed border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">+{lockedCount} More Signals</h3>
                <p className="text-sm text-muted-foreground mb-4">Upgrade to see all funding signals and get matched alerts.</p>
                <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Scout;
