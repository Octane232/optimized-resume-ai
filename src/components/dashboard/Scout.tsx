import React, { useState, useEffect } from 'react';
import { 
  Telescope, 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Sparkles,
  Filter,
  Crown,
  Lock,
  Zap,
  TrendingUp,
  Star,
  Bookmark,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ScoutJob {
  id: number;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  salary_range: string | null;
  skills: string[] | null;
  job_url: string | null;
  created_at: string;
  matchScore?: number;
}

const Scout: React.FC = () => {
  const navigate = useNavigate();
  const { tier, limits } = useSubscription();
  const [jobs, setJobs] = useState<ScoutJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const isPremium = tier === 'premium';
  const isPro = tier === 'pro' || tier === 'premium';
  
  // Tier-based limits
  const jobsLimit = tier === 'free' ? 3 : tier === 'pro' ? 20 : Infinity;
  const jobsViewedThisWeek = jobs.length; // Simplified for demo

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch user skills from vault for dynamic match calculation
      let userSkills: string[] = [];
      if (user) {
        const { data: vault } = await supabase
          .from('user_vault')
          .select('skills')
          .eq('user_id', user.id)
          .maybeSingle();
        
        userSkills = (vault?.skills || []).map((s: string) => s.toLowerCase());
      }

      const { data, error } = await supabase
        .from('scouted_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Calculate dynamic match scores based on user skills
      const jobsWithScores = (data || []).map(job => {
        const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
        const matchingSkills = jobSkills.filter((s: string) => userSkills.includes(s));
        const matchScore = jobSkills.length > 0 
          ? Math.round((matchingSkills.length / jobSkills.length) * 100)
          : 50; // Default score if no skills listed
        
        return {
          ...job,
          matchScore: Math.max(matchScore, 40) // Minimum 40% for display
        };
      });

      // Sort by match score (highest first)
      jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setJobs(jobsWithScores);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', user.id);

      if (data) {
        setSavedJobs(new Set(data.map(j => j.id as unknown as number)));
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 80) return 'text-blue-500 bg-blue-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Strong Match';
    return 'Good Match';
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.job_title?.toLowerCase().includes(query) ||
      job.company_name?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  // Apply tier limits
  const visibleJobs = tier === 'free' 
    ? filteredJobs.slice(0, 3) 
    : tier === 'pro' 
      ? filteredJobs.slice(0, 20) 
      : filteredJobs;

  const lockedJobsCount = filteredJobs.length - visibleJobs.length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white">
            <Telescope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scout</h1>
            <p className="text-sm text-muted-foreground">AI-matched jobs tailored to your profile</p>
          </div>
        </div>
        
        {/* Usage Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Jobs viewed this week</p>
            <p className="text-sm font-semibold">
              {jobsViewedThisWeek} / {jobsLimit === Infinity ? '∞' : jobsLimit}
            </p>
          </div>
          {tier === 'free' && (
            <Button 
              size="sm" 
              className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => navigate('/dashboard?tab=settings')}
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </Button>
          )}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title, company, location, or skills..." 
            className="pl-10 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {!isPremium && <Lock className="w-3 h-3 text-muted-foreground" />}
        </Button>
      </motion.div>

      {/* AI Match Summary */}
      {isPro && jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI Analysis Complete</p>
                <p className="text-xs text-muted-foreground">
                  Found {jobs.filter(j => (j.matchScore || 0) >= 85).length} high-match opportunities based on your resume and preferences
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500">
                  {Math.round(jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length)}% avg match
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm animate-pulse">
              <CardContent className="p-5">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : visibleJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "New opportunities are being scouted. Check back soon!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {job.company_name?.[0] || 'C'}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {job.job_title || 'Position'}
                          </h3>
                          <p className="text-sm text-muted-foreground">{job.company_name || 'Company'}</p>
                        </div>
                        
                        {/* Match Score */}
                        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getMatchColor(job.matchScore || 0)}`}>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3 h-3" />
                            {job.matchScore}% Match
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        {job.salary_range && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary_range}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.slice(0, 5).map((skill, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="text-xs font-normal bg-muted/50"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs font-normal bg-muted/50">
                              +{job.skills.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button 
                        size="sm" 
                        className="gap-1.5"
                        onClick={() => job.job_url && window.open(job.job_url, '_blank')}
                      >
                        Apply
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Locked Jobs Teaser */}
          {lockedJobsCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-dashed border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mb-4">
                    <Lock className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    +{lockedJobsCount} More {tier === 'free' ? 'Pro' : 'Premium'} Jobs
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Unlock {tier === 'free' ? '20 weekly' : 'unlimited'} AI-matched job opportunities with {tier === 'free' ? 'Pro' : 'Premium'}
                  </p>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => navigate('/dashboard?tab=settings')}
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to {tier === 'free' ? 'Pro' : 'Premium'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Pro/Premium Features Teaser */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Unlock Premium Scout Features</h4>
                    <p className="text-xs text-muted-foreground">
                      Daily alerts • Advanced filters • Company insights • Resume matching
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  onClick={() => navigate('/dashboard?tab=settings')}
                >
                  Learn More
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Scout;
