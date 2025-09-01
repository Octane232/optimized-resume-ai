
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Zap, Clock, Award, Wand2, Edit, Sparkles, Brain, Target, Users, Palette, Download, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CreateResume = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [step, setStep] = useState('templates'); // templates, builder, preview
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .order('rating', { ascending: false });

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
      icon: FileText,
      title: 'Import & Enhance',
      description: 'Upload your existing resume and let AI enhance it',
      gradient: 'from-orange-500 to-red-600',
      features: ['Import Existing', 'AI Enhancement', 'Format Upgrade'],
      time: '3 minutes',
      difficulty: 'Beginner'
    }
  ];

  const categories = ['All', 'Modern', 'Simple', 'Tech', 'Creative'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered Resume Creation</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Create Your Perfect Resume
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Choose from our professionally designed templates or let AI create a custom resume tailored to your career goals
        </p>
      </div>

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
                  
                  <Button className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all duration-300`}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={`rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </Button>
            ))}
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
                    
                    <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-lg mb-4 overflow-hidden">
                      <div className={`w-16 h-16 bg-gradient-to-r ${template.color_class || 'from-slate-500 to-slate-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <FileText className="w-8 h-8 text-white" />
                      </div>
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
                      <Button variant="outline" size="sm" className="flex-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                        Preview
                      </Button>
                      <Button className={`flex-1 bg-gradient-to-r ${template.color_class || 'from-slate-500 to-slate-600'} hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-300`}>
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;
