import { useState } from 'react';
import { Search, MapPin, Briefcase, ExternalLink, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  jobType: string;
  salary: string | null;
  applyLink: string;
  postedAt: string;
  description: string;
  logo: string | null;
  highlights: string[];
}

const JOB_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Full Time', value: 'fulltime' },
  { label: 'Part Time', value: 'parttime' },
  { label: 'Remote', value: 'remote' },
  { label: 'Contract', value: 'contractor' },
  { label: 'Internship', value: 'intern' },
];

const DATE_FILTERS = [
  { label: 'Any Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 3 Days', value: '3days' },
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' },
];

const JobSearch = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('all');
  const [datePosted, setDatePosted] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({ title: 'Enter a job title', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('job-search', {
        body: { query, location, jobType, datePosted, page: 1 },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Search failed');

      setJobs(data.jobs);

      if (data.jobs.length === 0) {
        toast({ title: 'No jobs found', description: 'Try different keywords or filters.' });
      }
    } catch (error) {
      console.error('Job search error:', error);
      toast({
        title: 'Search failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find jobs and apply directly — no middleman sites
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Job title, keywords, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Location (city, state, country)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {JOB_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setJobType(type.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                jobType === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDatePosted(filter.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                datePosted === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto rounded-xl">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</>
          ) : (
            <><Search className="mr-2 h-4 w-4" />Search Jobs</>
          )}
        </Button>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && searched && jobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No jobs found. Try different keywords.</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{jobs.length} jobs found</p>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Company Logo */}
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.isRemote ? 'Remote' : job.location}
                      </Badge>
                      {job.jobType && (
                        <Badge variant="secondary">{job.jobType}</Badge>
                      )}
                      {job.isRemote && (
                        <Badge variant="secondary">Remote</Badge>
                      )}
                      {job.salary && (
                        <Badge variant="secondary">{job.salary}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(job.postedAt)}
                      </span>
                    </div>
                    {job.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  size="sm"
                  onClick={() => window.open(job.applyLink, '_blank')}
                  className="rounded-xl flex-shrink-0"
                >
                  Apply
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!searched && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Search for your next role</h3>
          <p className="text-sm text-muted-foreground">
            Enter a job title above to find opportunities
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
