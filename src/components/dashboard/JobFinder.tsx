
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Building, Clock, Bookmark, ExternalLink, Star, DollarSign, Users, Briefcase, Filter, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobTypes: string[];
  tags: string[];
  description: string;
  url: string;
  createdAt: string;
  slug: string;
  salary?: {
    min: number;
    max: number;
  } | null;
}

const JobFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: { searchTerm: '', location: '', page: 1 }
      });

      if (error) throw error;
      
      // Deduplicate jobs by ID
      const uniqueJobs = Array.from(
        new Map((data.data || []).map((job: Job) => [job.id, job])).values()
      ) as Job[];
      setJobs(uniqueJobs);
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
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: { searchTerm, location, page: 1 }
      });

      if (error) throw error;
      
      // Deduplicate jobs by ID
      const uniqueJobs = Array.from(
        new Map((data.data || []).map((job: Job) => [job.id, job])).values()
      ) as Job[];
      setJobs(uniqueJobs);
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

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
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

  const filteredJobs = jobs.filter(job => {
    if (jobType) {
      return job.jobTypes?.some(type => 
        type.toLowerCase().includes(jobType.toLowerCase())
      );
    }
    return true;
  });

  const stats = [
    { label: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Companies', value: new Set(jobs.map(j => j.company)).size.toString(), icon: Building, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Remote Jobs', value: jobs.filter(j => j.jobTypes?.includes('Remote')).length.toString(), icon: MapPin, color: 'from-purple-500 to-purple-600' },
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
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered Job Matching</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover opportunities that perfectly match your skills and career goals with our intelligent job matching system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Search Jobs</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
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
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={salaryRange} onValueChange={setSalaryRange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Salary Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50k">$0 - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                    <SelectItem value="150k+">$150k+</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Trending searches:</p>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
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
            {loading ? 'Loading Jobs...' : `${filteredJobs.length} Jobs Found`}
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Powered by Adzuna</span>
          </div>
        </div>

        {loading ? (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading job listings...</p>
            </CardContent>
          </Card>
        ) : filteredJobs.length === 0 ? (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-slate-600 dark:text-slate-400">Try adjusting your search filters or check back later.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.slug} className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Company Logo & Details */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
                      {job.company ? job.company.charAt(0).toUpperCase() : '?'}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Job Title */}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 break-words">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.jobTypes?.map((type, idx) => (
                            <Badge key={idx} className={`text-xs px-3 py-1 rounded-full font-medium ${
                              type.toLowerCase().includes('remote') 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            }`}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Company Info */}
                      <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{job.company || 'Unknown Company'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{getTimeSince(job.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {job.description.length > 200 
                          ? job.description.substring(0, 200) + '...' 
                          : job.description}
                      </p>
                      
                      {/* Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.tags.slice(0, 6).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50">
                              {tag}
                            </Badge>
                          ))}
                          {job.tags.length > 6 && (
                            <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 px-2 py-1 rounded-md">
                              +{job.tags.length - 6}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right: Action Buttons */}
                  <div className="flex lg:flex-col gap-3 lg:w-32 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSaveJob(job.slug)}
                      className={`flex-1 lg:flex-none border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl ${
                        savedJobs.has(job.slug) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : ''
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 lg:mr-0 mr-2 ${savedJobs.has(job.slug) ? 'fill-current text-blue-600' : ''}`} />
                      <span className="lg:hidden">{savedJobs.has(job.slug) ? 'Saved' : 'Save'}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobFinder;
