
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Award, Wand2, Edit, Sparkles, Brain, Target, Users, Palette, Download, Star, Loader2, Eye, ShieldCheck, AlertCircle, Upload, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import TemplatePreview from './TemplatePreview';
import TemplateThumbnail from './TemplateThumbnail';
import AIResumeDialog from './AIResumeDialog';
import { ResumeImportAnalyzer } from './ResumeImportAnalyzer';
import UpgradeModal from './UpgradeModal';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CreateResume = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [step, setStep] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; feature: string; requiredTier: 'pro' | 'premium'; limitType: 'templates' | 'ai' | 'feature' }>({ open: false, feature: '', requiredTier: 'pro', limitType: 'templates' });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tier, canCreateResume, canUseAI, getRemainingResumes, getRemainingAIGenerations, getNextResetDate, incrementUsage } = useSubscription();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { 
      icon: Brain, 
      title: 'AI-Powered Content', 
      description: 'Get intelligent suggestions for compelling bullet points and descriptions',
      color: 'from-yellow-400 to-orange-500',
      benefit: 'Save 2+ hours of writing'
    },
    { 
      icon: Clock, 
      title: 'Quick Creation', 
      description: 'Build professional resumes in under 10 minutes with guided flow',
      color: 'from-blue-500 to-cyan-500',
      benefit: '10x faster than traditional'
    },
    { 
      icon: Award, 
      title: 'ATS Optimized', 
      description: 'Pass applicant tracking systems with optimized formatting',
      color: 'from-emerald-500 to-teal-500',
      benefit: '95% ATS pass rate'
    },
    { 
      icon: Target, 
      title: 'Industry Targeting', 
      description: 'Customize content based on your target industry and role',
      color: 'from-purple-500 to-pink-600',
      benefit: 'Higher interview rates'
    }
  ];

  const creationMethods = [
    {
      icon: Wand2,
      title: 'AI-Powered Resume',
      description: 'Let our AI create a tailored resume based on your experience and target role',
      gradient: 'from-blue-500 to-purple-600',
      features: ['Smart Content Generation', 'Industry Optimization', 'Keyword Enhancement'],
      time: '5 minutes',
      difficulty: 'Beginner'
    },
    {
      icon: Edit,
      title: 'Guided Builder',
      description: 'Step-by-step guidance to build your resume with expert tips',
      gradient: 'from-emerald-500 to-teal-600',
      features: ['Step-by-Step Guidance', 'Expert Tips', 'Live Preview'],
      time: '15 minutes',
      difficulty: 'Intermediate'
    },
    {
      icon: Upload,
      title: 'Import & Analyze',
      description: 'Upload your existing resume and get AI-powered job match analysis',
      gradient: 'from-pink-500 to-rose-600',
      features: ['Resume Upload', 'Job Match Score', 'Improvement Tips'],
      time: '3 minutes',
      difficulty: 'Beginner'
    }
  ];

  const [showAtsOnly, setShowAtsOnly] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Only show Classic templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(t => t.category?.toLowerCase() === 'classic');
    
    if (showAtsOnly) {
      filtered = filtered.filter(t => t.ats_friendly);
    }
    
    return filtered;
  }, [templates, showAtsOnly]);

  const getATSScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 75) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const handlePreviewOpen = useCallback((template: any) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  }, []);

  const handleSelectTemplate = useCallback((template: any) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `${template.name} template has been selected.`,
    });
  }, [toast]);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Resume Builder</h1>
            <p className="text-sm text-muted-foreground">Create professional resumes with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 max-w-7xl mx-auto space-y-8">

      {/* Creation Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {creationMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card key={index} className="group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient}/10 opacity-50`} />
              <CardContent className="relative p-8 text-center h-full flex flex-col">
                <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{method.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed flex-1">{method.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">{method.time}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                      {method.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => {
                      if (index === 0) {
                        // AI-Powered Resume - check tier
                        if (!canUseAI()) {
                          setUpgradeModal({ open: true, feature: 'AI Resume Generator', requiredTier: 'pro', limitType: tier === 'free' ? 'feature' : 'ai' });
                          return;
                        }
                        setIsAIDialogOpen(true);
                      } else if (index === 1) {
                        // Guided Builder - check resume limit
                        if (!canCreateResume()) {
                          setUpgradeModal({ open: true, feature: 'Resume Creation', requiredTier: 'pro', limitType: 'templates' });
                          return;
                        }
                        navigate(`/editor/new${templates[0]?.id ? `?template=${templates[0].id}` : ''}`);
                      } else if (index === 2) {
                        // Import & Analyze
                        setShowImport(!showImport);
                      }
                    }}
                    className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all duration-300`}
                  >
                    {index === 0 && tier === 'free' && <Lock className="w-4 h-4 mr-2" />}
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Import & Analyze Section */}
      {showImport && (
        <ResumeImportAnalyzer />
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{feature.description}</p>
                <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                  {feature.benefit}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Professional Templates</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose from our curated collection of industry-specific designs</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* ATS Filter Toggle */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-sm">ATS-friendly only (90+)</span>
              </div>
              <Button
                variant={showAtsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAtsOnly(!showAtsOnly)}
                className="rounded-full h-8"
              >
                {showAtsOnly ? "On" : "Off"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="group cursor-pointer">
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 mb-4 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
                    {template.is_popular && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-10">
                        <Star className="w-3 h-3 inline mr-1" />
                        Popular
                      </div>
                    )}
                    
                    <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl border-2 border-slate-200 dark:border-slate-600 shadow-lg mb-4 overflow-hidden relative">
                      {template.preview_image ? (
                        <img 
                          src={template.preview_image} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TemplateThumbnail 
                          template={template} 
                          className="absolute inset-0"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                        {template.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{template.rating}</span>
                        </div>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{template.downloads > 1000 ? `${(template.downloads / 1000).toFixed(1)}k` : template.downloads}</span>
                      </div>
                    </div>

                    {/* ATS Score - Only show when filter is enabled */}
                    {showAtsOnly && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 mb-3 cursor-help">
                              {template.ats_friendly ? (
                                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                              )}
                              <span className="text-xs font-medium">ATS:</span>
                              <Badge className={`text-xs ${getATSScoreBadge(template.ats_score || 0)}`}>
                                {template.ats_score || 0}/100
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-semibold">ATS Features:</p>
                              <ul className="text-xs space-y-1">
                                {(template.ats_features || []).map((feature: string, idx: number) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-green-500" />
                                    {feature.split('-').join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{template.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(Array.isArray(template.features) ? template.features : []).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 px-2 py-1">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                        onClick={() => {
                          setPreviewTemplate(template);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              className={`flex-1 bg-gradient-to-r ${template.color_class || 'from-slate-500 to-slate-600'} hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-300 ${!canCreateResume() ? 'opacity-60' : ''}`}
                              onClick={async () => {
                                if (!canCreateResume()) {
                                  setUpgradeModal({ open: true, feature: 'Resume Creation', requiredTier: 'pro', limitType: 'templates' });
                                  return;
                                }
                                if (!template.json_content) {
                                  toast({ title: 'Template not ready', description: 'This template will be available soon. Please choose another with full styles.' });
                                  return;
                                }
                                await incrementUsage('resume');
                                navigate(`/editor/new?template=${template.id}`);
                              }}
                            >
                              {!canCreateResume() && <Lock className="w-4 h-4 mr-1" />}
                              Use Template
                            </Button>
                          </TooltipTrigger>
                          {!canCreateResume() && (
                            <TooltipContent>
                              <p>Limit reached. Resets on {getNextResetDate().toLocaleDateString()}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Preview Modal */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onUseTemplate={() => {
          if (previewTemplate?.json_content && previewTemplate?.id) {
            navigate(`/editor/new?template=${previewTemplate.id}`);
          } else {
            toast({ title: 'Template not ready', description: 'This template will be available soon. Please choose another with full styles.' });
          }
        }}
      />

      {/* AI Resume Dialog */}
      <AIResumeDialog
        open={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        selectedTemplate={selectedTemplate}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onOpenChange={(open) => setUpgradeModal(prev => ({ ...prev, open }))}
        feature={upgradeModal.feature}
        requiredTier={upgradeModal.requiredTier}
        currentTier={tier}
        resetDate={getNextResetDate()}
        limitType={upgradeModal.limitType}
      />
      </div>
    </div>
  );
};

export default CreateResume;
