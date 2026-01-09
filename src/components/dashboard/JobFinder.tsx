import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building, Clock, Bookmark, ExternalLink, Briefcase, Filter, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  tags: string[];
  url: string;
  createdAt: string;
  salary?: string | null;
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
      const { data, error } = await supabase
        .from('scouted_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedJobs: Job[] = (data || []).map(job => ({
        id: job.id,
        title: job.job_title || 'Untitled Position',
        company: job.company_name || 'Unknown Company',
        location: job.location || 'Not specified',
        tags: job.skills || [],
        url: job.job_url || '',
        createdAt: job.created_at,
        salary: job.salary_range
      }));
      
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job listings. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('scouted_jobs')
        .select('*')
        .eq('is_active', true);
      
      if (searchTerm) {
        query = query.or(`job_title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
      }
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedJobs: Job[] = (data || []).map(job => ({
        id: job.id,
        title: job.job_title || 'Untitled Position',
        company: job.company_name || 'Unknown Company',
        location: job.location || 'Not specified',
        tags: job.skills || [],
        url: job.job_url || '',
        createdAt: job.created_at,
        salary: job.salary_range
      }));
      
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to search jobs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobUrl: string, job?: Job) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save jobs.",
          variant: "destructive"
        });
        return;
      }

      const isSaved = savedJobs.has(jobUrl);

      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_url', jobUrl);

        if (error) throw error;

        setSavedJobs(prev => {
          const newSaved = new Set(prev);
          newSaved.delete(jobUrl);
          return newSaved;
        });

        toast({
          title: "Job Removed",
          description: "Job removed from your saved list."
        });
      } else {
        if (!job) return;

        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary || null,
            job_url: jobUrl,
            description: null
          });

        if (error) throw error;

        setSavedJobs(prev => {
          const newSaved = new Set(prev);
          newSaved.add(jobUrl);
          return newSaved;
        });

        toast({
          title: "Job Saved!",
          description: "Job added to your saved list."
        });
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast({
        title: "Error",
        description: "Failed to update saved job. Please try again.",
        variant: "destructive"
      });
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
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const stats = [
    { label: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Companies', value: new Set(jobs.map(j => j.company)).size.toString(), icon: Building, color: 'from-emerald-500 to-emerald-600' },
    { label: 'New Today', value: jobs.filter(j => {
      const posted = new Date(j.createdAt);
      const today = new Date();
      return posted.toDateString() === today.toDateString();
    }).length.toString(), icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ];

  const trendingSearches = ['React Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Curated Job Listings</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Browse curated opportunities that match your skills and career goals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Search Jobs</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Main Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search
              </Button>
            </div>

            {/* Trending Searches */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Trending searches:</p>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm(search);
                      handleSearch();
                    }}
                    className="text-xs border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-full"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? 'Loading Jobs...' : `${jobs.length} Jobs Found`}
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Curated for you</span>
          </div>
        </div>

        {loading ? (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading job listings...</p>
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-slate-600 dark:text-slate-400">New jobs are being added regularly. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {job.company.charAt(0).toUpperCase()}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {getTimeSince(job.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Salary Badge */}
                        {job.salary && (
                          <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 shrink-0">
                            {job.salary}
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.tags.slice(0, 5).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {job.tags.length > 5 && (
                            <Badge 
                              variant="secondary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs"
                            >
                              +{job.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSaveJob(job.url, job)}
                          className={`rounded-xl ${
                            savedJobs.has(job.url)
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 mr-1 ${savedJobs.has(job.url) ? 'fill-current' : ''}`} />
                          {savedJobs.has(job.url) ? 'Saved' : 'Save'}
                        </Button>
                        {job.url && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                            onClick={() => window.open(job.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Apply
                          </Button>
                        )}
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
