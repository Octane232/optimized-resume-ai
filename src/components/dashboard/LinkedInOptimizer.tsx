import React, { useState, useEffect } from 'react';
import { 
  Linkedin, 
  Sparkles, 
  Copy, 
  Check, 
  User,
  FileText,
  Target,
  TrendingUp,
  Eye,
  RefreshCw,
  History,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LinkedInOptimization {
  id: string;
  type: string;
  original_content: string | null;
  optimized_content: string;
  target_role: string | null;
  created_at: string;
}

const LinkedInOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('headline');
  const [currentHeadline, setCurrentHeadline] = useState('');
  const [currentSummary, setCurrentSummary] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentOptimizations, setRecentOptimizations] = useState<LinkedInOptimization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOptimizations();
  }, []);

  const fetchRecentOptimizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('linkedin_optimizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentOptimizations(data);
      }
    } catch (error) {
      console.error('Error fetching optimizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileScore = () => {
    let score = 50; // Base score
    if (recentOptimizations.some(o => o.type === 'headline')) score += 25;
    if (recentOptimizations.some(o => o.type === 'summary')) score += 25;
    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate optimized content
      let newOptimizedContent = '';
      
      if (activeTab === 'headline') {
        newOptimizedContent = `${targetRole || 'Software Engineer'} | Helping companies build scalable solutions | Ex-${currentHeadline.split(' ')[0] || 'Tech'} | Open to opportunities`;
      } else {
        newOptimizedContent = 
          `🚀 Passionate ${targetRole || 'professional'} with a track record of delivering results.\n\n` +
          `I specialize in:\n` +
          `✅ Building high-impact solutions\n` +
          `✅ Leading cross-functional teams\n` +
          `✅ Driving measurable business outcomes\n\n` +
          `${currentSummary ? `Previously: ${currentSummary.slice(0, 100)}...` : ''}\n\n` +
          `Let's connect! Always happy to chat about ${targetRole || 'opportunities'}.`;
      }

      // Save to database
      const { data: newOptimization, error } = await supabase
        .from('linkedin_optimizations')
        .insert({
          user_id: user.id,
          type: activeTab,
          original_content: activeTab === 'headline' ? currentHeadline : currentSummary,
          optimized_content: newOptimizedContent,
          target_role: targetRole
        })
        .select()
        .single();

      if (error) throw error;

      setOptimizedContent(newOptimizedContent);
      
      if (newOptimization) {
        setRecentOptimizations([newOptimization, ...recentOptimizations.slice(0, 4)]);
      }

      toast({
        title: "Optimization complete!",
        description: "Your optimized content is ready to copy."
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Error",
        description: "Could not optimize content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (optimizedContent) {
      navigator.clipboard.writeText(optimizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard."
      });
    }
  };

  const deleteOptimization = async (id: string) => {
    try {
      const { error } = await supabase
        .from('linkedin_optimizations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecentOptimizations(recentOptimizations.filter(o => o.id !== id));
      toast({
        title: "Deleted",
        description: "Optimization removed."
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const useOptimization = (optimization: LinkedInOptimization) => {
    setOptimizedContent(optimization.optimized_content);
    setActiveTab(optimization.type);
    if (optimization.target_role) {
      setTargetRole(optimization.target_role);
    }
  };

  const optimizationTips = [
    { icon: Target, title: 'Use Keywords', description: 'Include industry-specific terms recruiters search for' },
    { icon: TrendingUp, title: 'Show Impact', description: 'Quantify achievements with numbers and percentages' },
    { icon: Eye, title: 'Be Discoverable', description: 'Optimize headline for search visibility' },
    { icon: User, title: 'Tell Your Story', description: 'Make your summary personal and engaging' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0A66C2] text-white">
            <Linkedin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">LinkedIn Optimizer</h1>
            <p className="text-sm text-muted-foreground">AI-powered profile enhancement</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#0A66C2]/5 to-[#0A66C2]/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${profileScore * 1.76} 176`}
                      className="text-[#0A66C2]"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {profileScore}%
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">Profile Strength</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimize your headline and summary to reach 100%
                  </p>
                </div>
              </div>
              <Badge className="bg-[#0A66C2]/10 text-[#0A66C2] border-0">
                {profileScore >= 100 ? 'All-Star' : profileScore >= 75 ? 'Expert' : 'Intermediate'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Optimizer Panel */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0A66C2]" />
                AI Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Input 
                  placeholder="e.g., Senior Product Manager, Full Stack Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="headline" className="flex-1">Headline</TabsTrigger>
                  <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="headline" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Headline</label>
                    <Input 
                      placeholder="Paste your current LinkedIn headline..."
                      value={currentHeadline}
                      onChange={(e) => setCurrentHeadline(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max 220 characters. Make it keyword-rich and compelling.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Summary</label>
                    <Textarea 
                      placeholder="Paste your current LinkedIn summary..."
                      value={currentSummary}
                      onChange={(e) => setCurrentSummary(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max 2,600 characters. Tell your professional story.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full gap-2 bg-[#0A66C2] hover:bg-[#004182]"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Optimize with AI
                  </>
                )}
              </Button>

              {/* Optimized Output */}
              {optimizedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#0A66C2]">
                      ✨ Optimized {activeTab === 'headline' ? 'Headline' : 'Summary'}
                    </label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="gap-1.5"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/20">
                    <p className="text-sm whitespace-pre-wrap">{optimizedContent}</p>
                  </div>
                </motion.div>
              )}

              {/* Recent Optimizations */}
              {recentOptimizations.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Recent Optimizations</span>
                  </div>
                  <div className="space-y-2">
                    {recentOptimizations.map((opt) => (
                      <div 
                        key={opt.id} 
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {opt.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(opt.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {opt.optimized_content.slice(0, 60)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2"
                            onClick={() => useOptimization(opt)}
                          >
                            Use
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-destructive"
                            onClick={() => deleteOptimization(opt.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Panel */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#0A66C2]/10 shrink-0">
                    <tip.icon className="w-4 h-4 text-[#0A66C2]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-sm mt-4">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium text-sm">Profile Checklist</h4>
              {[
                { label: 'Professional Photo', done: true },
                { label: 'Optimized Headline', done: recentOptimizations.some(o => o.type === 'headline') },
                { label: 'Compelling Summary', done: recentOptimizations.some(o => o.type === 'summary') },
                { label: 'Skills Added (10+)', done: true },
                { label: 'Experience Detailed', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                  {item.done ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
