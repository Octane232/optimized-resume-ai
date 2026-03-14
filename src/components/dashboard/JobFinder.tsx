import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building, Clock, Bookmark, ExternalLink, Briefcase, TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  url: string;
  createdAt: string;
  salary?: string | null;
  matchScore?: number;
}

const JobFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: savedJobsData } = await supabase
        .from('saved_jobs')
        .select('job_url')
        .eq('user_id', user.id);
      if (savedJobsData) {
        const savedUrls = new Set(savedJobsData.map(job => job.job_url).filter(Boolean) as string[]);
        setSavedJobs(savedUrls);
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch from radar_alerts joined with radar_signals
      const { data: alerts, error } = await supabase
        .from('radar_alerts')
        .select('id, match_score, created_at, radar_signals(company_name, likely_roles, industry, source_url, amount, hiring_window)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedJobs: Job[] = (alerts || []).map((alert: any) => ({
        id: alert.id,
        title: alert.radar_signals?.likely_roles?.[0] || 'Open Position',
        company: alert.radar_signals?.company_name || 'Unknown Company',
        location: alert.radar_signals?.industry || 'Not specified',
        tags: alert.radar_signals?.likely_roles || [],
        url: alert.radar_signals?.source_url || '',
        createdAt: alert.created_at,
        salary: alert.radar_signals?.amount ? `Raised ${alert.radar_signals.amount}` : null,
        matchScore: alert.match_score,
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({ title: 'Error', description: 'Failed to load job listings.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Filter locally
    const filtered = jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !location ||
        job.location.toLowerCase().includes(location.toLowerCase());
      return matchesSearch && matchesLocation;
    });
    setJobs(filtered);
    if (filtered.length === 0 && (searchTerm || location)) {
      fetchJobs(); // Reset if no results
    }
  };

  const toggleSaveJob = async (jobUrl: string, job?: Job) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Sign in required', description: 'Please sign in to save jobs.', variant: 'destructive' });
        return;
      }
      const isSaved = savedJobs.has(jobUrl);
      if (isSaved) {
        await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_url', jobUrl);
        setSavedJobs(prev => { const n = new Set(prev); n.delete(jobUrl); return n; });
        toast({ title: 'Removed', description: 'Job removed from saved list.' });
      } else if (job) {
        await supabase.from('saved_jobs').insert({
          user_id: user.id, job_title: job.title, company: job.company,
          location: job.location, salary: job.salary || null, job_url: jobUrl,
        });
        setSavedJobs(prev => { const n = new Set(prev); n.add(jobUrl); return n; });
        toast({ title: 'Saved!', description: 'Job added to your saved list.' });
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast({ title: 'Error', description: 'Failed to update saved job.', variant: 'destructive' });
    }
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const stats = [
    { label: 'Matched Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Companies', value: new Set(jobs.map(j => j.company)).size.toString(), icon: Building, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Avg Match', value: jobs.length > 0 ? `${Math.round(jobs.reduce((a, j) => a + (j.matchScore || 0), 0) / jobs.length)}%` : '0%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Find Your Next Role</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Matched opportunities from companies that just raised funding.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-border/50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Search className="w-5 h-5 text-primary" />
            Search Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 bg-muted/30"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Industry"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 bg-muted/30"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="h-12">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {loading ? 'Loading...' : `${jobs.length} Jobs Found`}
        </h2>

        {loading ? (
          <Card><CardContent className="p-12 flex flex-col items-center"><Loader2 className="w-12 h-12 text-primary animate-spin mb-4" /><p className="text-muted-foreground">Loading...</p></CardContent></Card>
        ) : jobs.length === 0 ? (
          <Card><CardContent className="p-12 text-center"><Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3><p className="text-muted-foreground">Run a Radar Scan to discover opportunities from recently funded companies.</p></CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="border border-border/50 hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Building className="w-4 h-4" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{getTimeSince(job.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.matchScore && <Badge className="bg-primary/10 text-primary border-0">{job.matchScore}% match</Badge>}
                          {job.salary && <Badge variant="secondary">{job.salary}</Badge>}
                        </div>
                      </div>
                      {job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.tags.slice(0, 5).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        {job.url && (
                          <Button size="sm" onClick={() => window.open(job.url, '_blank')} className="gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={savedJobs.has(job.url) ? 'default' : 'outline'}
                          onClick={() => toggleSaveJob(job.url, job)}
                          className="gap-1"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          {savedJobs.has(job.url) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFinder;
