
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star, ChevronDown, ChevronUp } from 'lucide-react';
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

const ResumesShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'classic', 'modern', 'creative', 'executive', 'tech'];

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

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const displayedTemplates = showAll ? filteredTemplates : filteredTemplates.slice(0, 6);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Resume Templates
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose from our collection of professionally designed, ATS-optimized resume templates. 
            Each template is crafted by career experts and loved by hiring managers.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2 capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resume Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTemplates.map((template, index) => {
              const sampleData = getSampleData(template.category);
              const isFeatured = index < 3;
              
              return (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-md overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {isFeatured && (
                      <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-80">
                      <div className="w-full h-full flex items-center justify-center p-4">
                        {template.json_content && (
                          <div className="transform scale-[0.32] origin-center" style={{ width: '850px', height: '1100px' }}>
                            <CanvaStyleRenderer 
                              template={template.json_content as any} 
                              data={sampleData} 
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-3">
                          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => navigate(`/editor?template=${template.id}`)}
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
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {template.name}
                        </h3>
                        <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-amber-400 mr-1" />
                        4.8
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {template.is_premium ? 'Premium' : 'Free'}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/editor?template=${template.id}`)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Show More/Less Button */}
        {filteredTemplates.length > 6 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show More Templates ({filteredTemplates.length - 6} more)
                </>
              )}
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Can't Find the Perfect Template?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our AI can create a completely custom resume design based on your industry, 
              experience level, and personal preferences.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Custom Resume with AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumesShowcase;
