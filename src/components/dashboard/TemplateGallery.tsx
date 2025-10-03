
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Eye, Download, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TemplateGalleryProps {
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ['All', 'Modern', 'Classic', 'Creative', 'Executive', 'Tech'];

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

      if (data && data.length > 0) {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Choose Your Perfect Template
          </DialogTitle>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Template Grid */}
        {!loading && filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No templates found in this category</p>
          </div>
        )}
        
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-0 shadow-md overflow-hidden"
              >
                <div className="relative">
                  {template.is_popular && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-64">
                    <div className="w-full h-full p-4 flex items-center justify-center">
                      {template.preview_image ? (
                        <img 
                          src={template.preview_image} 
                          alt={template.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-lg">
                          <FileText className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!template.json_content) {
                              toast({ title: 'Template not ready', description: 'This template will be available soon. Please choose another with full styles.' });
                              return;
                            }
                            navigate(`/editor/new?template=${template.id}`);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                        {template.name}
                      </h3>
                      <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Star className="w-4 h-4 text-amber-400 mr-1" />
                      {template.rating || 4.5}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-500">
                      {template.downloads || 0} downloads
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!template.json_content) {
                          toast({ title: 'Template not ready', description: 'This template will be available soon. Please choose another with full styles.' });
                          return;
                        }
                        navigate(`/editor/new?template=${template.id}`);
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" onClick={onClose}>
            Close Gallery
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
