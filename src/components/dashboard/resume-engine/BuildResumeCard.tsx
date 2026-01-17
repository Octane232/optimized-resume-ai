import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CanvaStyleRenderer from '@/components/templates/CanvaStyleRenderer';
import { classicResueSample } from '@/data/sampleResumes';

interface DatabaseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  json_content: any;
}

const BuildResumeCard = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<DatabaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('resume_templates')
          .select('id, name, description, category, json_content')
          .eq('category', 'classic')
          .limit(6);

        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleStartBuilding = (templateId: string) => {
    navigate(`/editor/new?template=${templateId}`);
  };

  const getTemplateForRenderer = (template: DatabaseTemplate) => {
    if (!template.json_content) return null;
    
    return {
      layout: 'standard',
      theme: template.json_content.theme || {
        primaryColor: '#1e293b',
        secondaryColor: '#64748b',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        fontFamily: 'Inter, sans-serif'
      },
      sections: template.json_content.sections || []
    };
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Build Your Resume
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a classic template and start building your professional resume
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No templates available
          </div>
        ) : (
          <>
            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {templates.map((template) => {
                const rendererTemplate = getTemplateForRenderer(template);
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden
                      ${isSelected 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {/* Template Preview */}
                    <div className="h-48 overflow-hidden bg-white">
                      {rendererTemplate ? (
                        <div className="transform scale-[0.22] origin-top-left w-[455%]">
                          <CanvaStyleRenderer 
                            template={rendererTemplate} 
                            data={classicResueSample} 
                            scale={1} 
                          />
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          Preview not available
                        </div>
                      )}
                    </div>
                    
                    {/* Template Info */}
                    <div className="p-3 bg-background border-t">
                      <h4 className="font-medium text-sm text-foreground truncate">{template.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Selected
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => selectedTemplate && handleStartBuilding(selectedTemplate)}
              disabled={!selectedTemplate}
              className="w-full gap-2"
            >
              Start Building
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildResumeCard;
