import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ScoutedJob {
  id: number;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  salary_range: string | null;
  skills: string[] | null;
  job_url: string | null;
  created_at: string;
  is_active: boolean | null;
}

const LiveFeedSection = () => {
  const [jobs, setJobs] = useState<ScoutedJob[]>([]);
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
        .limit(12);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Ticker content - duplicate for seamless loop
  const tickerItems = jobs.length > 0 
    ? [...jobs, ...jobs].map((job, i) => (
        <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
          <span className="text-lime font-semibold">{job.job_title}</span>
          <span className="text-muted-foreground">at</span>
          <span className="text-foreground">{job.company_name}</span>
        </span>
      ))
    : null;

  return (
    <section className="py-24 bg-charcoal-dark relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--lime)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--lime)/0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center">
              <Radar className="w-6 h-6 text-lime" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Live Intelligence</h2>
              <p className="text-muted-foreground text-sm font-mono">THE VAULT • REAL-TIME UPDATES</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime/30 bg-lime/5">
            <div className="w-2 h-2 rounded-full bg-lime animate-pulse"></div>
            <span className="text-xs font-mono text-lime">LIVE</span>
          </div>
        </div>

        {/* Ticker */}
        {jobs.length > 0 && (
          <div className="relative mb-12 overflow-hidden py-3 border-y border-border/30">
            <div className="flex animate-ticker whitespace-nowrap">
              {tickerItems}
            </div>
          </div>
        )}

        {/* Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="cyber-card p-5 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.slice(0, 9).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="cyber-card p-5 group cursor-pointer hover:border-lime/50 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate group-hover:text-lime transition-colors">
                      {job.job_title || 'Untitled Position'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.company_name || 'Company'}
                    </p>
                  </div>
                  {job.job_url && (
                    <a 
                      href={job.job_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-lime/10 text-lime opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Skills tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-electric/10 border border-electric/20 text-electric text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {job.salary_range && (
                      <span className="flex items-center gap-1 text-lime font-semibold text-sm">
                        <DollarSign className="w-3 h-3" />
                        {job.salary_range}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(job.created_at)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="cyber-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center mx-auto mb-4">
              <Radar className="w-8 h-8 text-lime" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Vault Loading</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our AI is actively scouting job boards. Fresh opportunities will appear here as they're discovered and refined.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveFeedSection;
