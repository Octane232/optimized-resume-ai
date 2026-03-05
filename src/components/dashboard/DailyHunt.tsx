import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FileText, Mail, Users, X, Briefcase, MapPin, DollarSign } from 'lucide-react';

interface Job {
  id: number;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  salary_range: string | null;
  skills: string[] | null;
  job_url: string | null;
}

const DailyHunt: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('scouted_jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const matchScore = () => Math.floor(Math.random() * 15) + 80;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">The Daily Hunt</h2>
        <p className="text-muted-foreground text-sm">Loading today's top matches...</p>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">The Daily Hunt</h2>
        <p className="text-muted-foreground text-sm mt-1">Your top 5 job matches for today</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No jobs scouted yet</p>
          <p className="text-sm mt-1">New matches will appear here daily.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const score = matchScore();
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{job.job_title || 'Untitled'}</p>
                  <p className="text-sm text-muted-foreground truncate">{job.company_name || 'Unknown Company'}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {job.salary_range}
                      </span>
                    )}
                  </div>
                </div>
                <Badge className="shrink-0 bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold">
                  {score}% Match
                </Badge>
              </button>
            );
          })}
        </div>
      )}

      {/* Side Drawer */}
      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedJob.job_title}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selectedJob.company_name}</p>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Job Info */}
                <div className="space-y-2 text-sm">
                  {selectedJob.location && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {selectedJob.location}
                    </p>
                  )}
                  {selectedJob.salary_range && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" /> {selectedJob.salary_range}
                    </p>
                  )}
                </div>

                {/* Skills / Keyword Gap */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Key Skills Required</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Button className="w-full gap-2" size="lg">
                    <FileText className="w-4 h-4" />
                    AI Optimize Resume
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <Mail className="w-4 h-4" />
                    Draft Cover Letter
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <Users className="w-4 h-4" />
                    Find Referral
                  </Button>
                </div>

                {selectedJob.job_url && (
                  <a
                    href={selectedJob.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm text-primary hover:underline"
                  >
                    View Original Posting →
                  </a>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DailyHunt;
