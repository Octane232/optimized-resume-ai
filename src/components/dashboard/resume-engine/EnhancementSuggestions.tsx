import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check, ChevronRight, Sparkles, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ParsedResume } from './ResumeParser';

interface Suggestion {
  id: string;
  type: 'keyword' | 'formatting' | 'content' | 'achievement' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  applied?: boolean;
}

interface EnhancementSuggestionsProps {
  parsedResume: ParsedResume | null;
  missingKeywords?: string[];
  weaknesses?: string[];
}

// Generate suggestions based on parsed resume
const generateSuggestions = (
  parsed: ParsedResume | null,
  missingKeywords: string[] = [],
  weaknesses: string[] = []
): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (!parsed) {
    return [{
      id: 'no-resume',
      type: 'content',
      priority: 'high',
      title: 'Upload Resume First',
      description: 'Process a resume to receive personalized enhancement suggestions.',
    }];
  }

  // Contact completeness suggestions
  if (!parsed.contact.email) {
    suggestions.push({
      id: 'add-email',
      type: 'content',
      priority: 'high',
      title: 'Add Email Address',
      description: 'Email is essential for recruiters to contact you. Add a professional email address.',
      action: 'Add professional email (e.g., firstname.lastname@email.com)',
    });
  }

  if (!parsed.contact.phone) {
    suggestions.push({
      id: 'add-phone',
      type: 'content',
      priority: 'high',
      title: 'Add Phone Number',
      description: 'Include a phone number for faster communication with recruiters.',
      action: 'Add phone in format (XXX) XXX-XXXX',
    });
  }

  if (!parsed.contact.linkedin && !parsed.contact.github) {
    suggestions.push({
      id: 'add-linkedin',
      type: 'content',
      priority: 'medium',
      title: 'Add LinkedIn Profile',
      description: '87% of recruiters use LinkedIn. Adding your profile URL increases visibility.',
      action: 'Add linkedin.com/in/yourprofile',
    });
  }

  // Summary suggestions
  if (!parsed.detectedSections.includes('summary')) {
    suggestions.push({
      id: 'add-summary',
      type: 'structure',
      priority: 'high',
      title: 'Add Professional Summary',
      description: 'A 2-3 sentence summary at the top quickly communicates your value proposition.',
      action: 'Write a compelling summary highlighting your experience and goals',
    });
  }

  // Skills section suggestions
  if (parsed.skills.length < 5) {
    suggestions.push({
      id: 'add-skills',
      type: 'content',
      priority: 'high',
      title: 'Expand Skills Section',
      description: `Only ${parsed.skills.length} skills detected. ATS systems match on keywords - aim for 10-15 relevant skills.`,
      action: 'Add more technical and soft skills relevant to your target role',
    });
  }

  // Experience suggestions
  if (!parsed.detectedSections.includes('experience')) {
    suggestions.push({
      id: 'add-experience',
      type: 'structure',
      priority: 'high',
      title: 'Add Work Experience Section',
      description: 'Experience section is critical for ATS parsing and recruiter review.',
      action: 'Add your work history with company, title, dates, and bullet points',
    });
  }

  // Achievement-oriented suggestions
  const hasMetrics = parsed.experience.some(exp => 
    exp.bullets.some(b => /\d+%|\$[\d,]+|\d+ (users|customers|clients|employees)/i.test(b))
  );

  if (!hasMetrics) {
    suggestions.push({
      id: 'add-metrics',
      type: 'achievement',
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Add metrics to your accomplishments. Numbers make your impact tangible.',
      action: 'Example: "Increased performance by 40%" or "Managed team of 5"',
    });
  }

  // Missing keywords from job matching
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    suggestions.push({
      id: 'add-keywords',
      type: 'keyword',
      priority: 'high',
      title: `Add Missing Keywords (${missingKeywords.length})`,
      description: `Your resume is missing key terms from the job description: ${topMissing.join(', ')}${missingKeywords.length > 5 ? '...' : ''}`,
      action: 'Incorporate these keywords naturally into your experience and skills sections',
    });
  }

  // Weaknesses from AI analysis
  weaknesses.forEach((weakness, i) => {
    suggestions.push({
      id: `weakness-${i}`,
      type: 'content',
      priority: 'medium',
      title: 'Address Identified Weakness',
      description: weakness,
    });
  });

  // Formatting suggestions
  if (parsed.parsingConfidence < 70) {
    suggestions.push({
      id: 'improve-formatting',
      type: 'formatting',
      priority: 'medium',
      title: 'Improve ATS-Friendly Formatting',
      description: 'Low parsing confidence suggests formatting issues. Use simple headings and avoid tables/graphics.',
      action: 'Use standard section headers: Summary, Experience, Education, Skills',
    });
  }

  // Education suggestions
  if (!parsed.detectedSections.includes('education')) {
    suggestions.push({
      id: 'add-education',
      type: 'structure',
      priority: 'medium',
      title: 'Add Education Section',
      description: 'Include your educational background, even if just high school or certifications.',
      action: 'Add degree, institution, and graduation year',
    });
  }

  return suggestions;
};

const EnhancementSuggestions: React.FC<EnhancementSuggestionsProps> = ({
  parsedResume,
  missingKeywords = [],
  weaknesses = [],
}) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);

  const suggestions = generateSuggestions(parsedResume, missingKeywords, weaknesses);

  const handleApply = (id: string) => {
    setAppliedIds(prev => new Set([...prev, id]));
    toast({
      title: "Suggestion marked as applied",
      description: "Don't forget to update your actual resume!",
    });
  };

  const handleRewriteBullet = async (bullet: string) => {
    setIsRewriting(bullet);
    try {
      const { data, error } = await supabase.functions.invoke('rewrite-bullet', {
        body: { bullet, style: 'achievement' }
      });

      if (error) throw error;

      toast({
        title: "Improved Version",
        description: data.rewritten || "Check the console for the rewritten bullet",
      });
    } catch (e: any) {
      toast({
        title: "Rewrite failed",
        description: e.message || "Could not rewrite the bullet point",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(null);
    }
  };

  const getPriorityBadge = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>;
    }
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'keyword':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'formatting':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'content':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'achievement':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'structure':
        return <ChevronRight className="w-4 h-4 text-emerald-500" />;
    }
  };

  const highPriority = suggestions.filter(s => s.priority === 'high' && !appliedIds.has(s.id));
  const otherSuggestions = suggestions.filter(s => s.priority !== 'high' && !appliedIds.has(s.id));
  const appliedSuggestions = suggestions.filter(s => appliedIds.has(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-5 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Enhancement Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              {suggestions.length} suggestions to improve your resume
            </p>
          </div>
        </div>
      </Card>

      {/* High Priority Suggestions */}
      {highPriority.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Critical Improvements ({highPriority.length})
          </h4>
          {highPriority.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="command-card p-4 border-l-4 border-red-500"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-foreground">{suggestion.title}</h5>
                      {getPriorityBadge(suggestion.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    {suggestion.action && (
                      <p className="text-xs text-primary mt-2 bg-primary/10 px-2 py-1 rounded inline-block">
                        → {suggestion.action}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApply(suggestion.id)}
                  className="shrink-0"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Done
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Other Suggestions */}
      {otherSuggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Additional Improvements ({otherSuggestions.length})
          </h4>
          {otherSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="command-card p-4"
            >
              <div 
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              >
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-foreground">{suggestion.title}</h5>
                      {getPriorityBadge(suggestion.priority)}
                    </div>
                    <AnimatePresence>
                      {expandedId === suggestion.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground mt-2">{suggestion.description}</p>
                          {suggestion.action && (
                            <p className="text-xs text-primary mt-2 bg-primary/10 px-2 py-1 rounded inline-block">
                              → {suggestion.action}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedId === suggestion.id ? 'rotate-90' : ''
                  }`} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(suggestion.id);
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Applied Suggestions */}
      {appliedSuggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            Applied ({appliedSuggestions.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {appliedSuggestions.map((suggestion) => (
              <span
                key={suggestion.id}
                className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs line-through opacity-60"
              >
                {suggestion.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bullet Rewriter Preview */}
      {parsedResume && parsedResume.experience.length > 0 && parsedResume.experience[0].bullets.length > 0 && (
        <Card className="p-5">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Bullet Rewriter
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Click on a bullet point to get an AI-improved version:
          </p>
          <div className="space-y-2">
            {parsedResume.experience[0].bullets.slice(0, 3).map((bullet, i) => (
              <button
                key={i}
                onClick={() => handleRewriteBullet(bullet)}
                disabled={isRewriting === bullet}
                className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground hover:text-foreground flex items-start gap-2"
              >
                {isRewriting === bullet ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="line-clamp-2">{bullet}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancementSuggestions;
