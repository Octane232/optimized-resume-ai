import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, Eye, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import TemplatePreview from './TemplatePreview';
import TemplateThumbnail from './TemplateThumbnail';

const CreateResume = () => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const [showAtsOnly, setShowAtsOnly] = useState(false);

  // Only show Classic templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(t => t.category?.toLowerCase() === 'classic');
    
    if (showAtsOnly) {
      filtered = filtered.filter(t => t.ats_friendly);
    }
    
    return filtered;
  }, [templates, showAtsOnly]);

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Resume Templates</h1>
            <p className="text-sm text-muted-foreground">Choose a professional template to get started</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 max-w-7xl mx-auto">
        <Card className="bg-card border-border shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Classic Templates</h2>
                  <p className="text-sm text-muted-foreground font-normal">Professional and ATS-friendly designs</p>
                </div>
              </div>
              
              {/* ATS Filter */}
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium hidden sm:inline">ATS Only</span>
                <Button
                  variant={showAtsOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAtsOnly(!showAtsOnly)}
                  className="h-8 px-3 text-xs"
                >
                  {showAtsOnly ? "On" : "Off"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No templates found. Try adjusting filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-200"
                  >
                    {/* Template Preview */}
                    <div className="relative aspect-[3/4] bg-white overflow-hidden">
                      {template.preview_image ? (
                        <img 
                          src={template.preview_image} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : template.json_content ? (
                        <div 
                          className="absolute inset-0"
                          style={{
                            transform: 'scale(0.25)',
                            transformOrigin: 'top left',
                            width: '400%',
                            height: '400%'
                          }}
                        >
                          <TemplateThumbnail 
                            template={template} 
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <TemplateThumbnail 
                          template={template} 
                          className="absolute inset-0"
                        />
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setPreviewTemplate(template);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                      </div>

                      {/* ATS Badge */}
                      {template.ats_friendly && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-600 text-white text-xs gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            ATS {template.ats_score}%
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-medium text-foreground">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                      </div>

                      <Button 
                        className="w-full"
                        size="sm"
                        onClick={() => {
                          if (!template.json_content) {
                            toast({ title: 'Template not ready', description: 'This template will be available soon.' });
                            return;
                          }
                          navigate(`/editor/new?template=${template.id}`);
                        }}
                      >
                        Use Template
                      </Button>
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
              toast({ title: 'Template not ready', description: 'This template will be available soon.' });
            }
          }}
        />
      </div>
    </div>
  );
};

export default CreateResume;
