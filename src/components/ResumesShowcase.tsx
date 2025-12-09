import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, PenTool, Briefcase, GraduationCap, Code, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CanvaStyleRenderer from '@/components/templates/CanvaStyleRenderer';
import { 
  classicResueSample, 
  modernResumeSample, 
  creativeResumeSample, 
  executiveResumeSample, 
  techResumeSample 
} from '@/data/sampleResumes';
import { useNavigate } from 'react-router-dom';

const categoryData = [
  { id: 'classic', name: 'Classic & Professional', icon: Briefcase, count: 0 },
  { id: 'modern', name: 'Modern & Creative', icon: PenTool, count: 0 },
  { id: 'executive', name: 'Executive & Leadership', icon: Users, count: 0 },
  { id: 'tech', name: 'Tech & Engineering', icon: Code, count: 0 },
];

const ResumesShowcase = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = (category: string) => {
    switch (category) {
      case 'classic': return classicResueSample;
      case 'modern': return modernResumeSample;
      case 'creative': return creativeResumeSample;
      case 'executive': return executiveResumeSample;
      case 'tech': return techResumeSample;
      default: return classicResueSample;
    }
  };

  // Get category counts
  const getCategoryCount = (categoryId: string) => {
    return templates.filter(t => t.category.toLowerCase() === categoryId.toLowerCase()).length;
  };

  // Get 4 templates to display
  const displayTemplates = templates.slice(0, 4);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Resume Templates
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose from professionally designed templates for every industry
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {categoryData.map((category) => {
            const Icon = category.icon;
            const count = getCategoryCount(category.id);
            return (
              <Card 
                key={category.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-border bg-card"
                onClick={() => navigate('/templates')}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {count} templates
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Resume Previews Grid */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayTemplates.map((template, index) => {
              const sampleData = getSampleData(template.category);
              
              return (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-lg transition-all duration-300 bg-card border border-border overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/editor/new?template=${template.id}`)}
                >
                  <div className="relative bg-muted h-48 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center p-2">
                      {template.json_content && (
                        <div className="transform scale-[0.18] origin-center" style={{ width: '850px', height: '1100px' }}>
                          <CanvaStyleRenderer 
                            template={template.json_content as any} 
                            data={sampleData} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {template.category}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/templates')}
            variant="outline"
            className="px-6"
          >
            View All Templates
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResumesShowcase;
