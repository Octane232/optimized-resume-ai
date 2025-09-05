
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TemplateGalleryProps {
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Modern', 'Classic', 'Creative', 'Executive', 'Tech'];

  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      category: 'Modern',
      description: 'Clean, contemporary design perfect for tech roles',
      featured: true,
      downloads: '12.3k',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Classic Executive',
      category: 'Executive',
      description: 'Traditional layout ideal for senior positions',
      featured: false,
      downloads: '8.7k',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Creative Designer',
      category: 'Creative',
      description: 'Eye-catching design for creative professionals',
      featured: true,
      downloads: '11.4k',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Tech Specialist',
      category: 'Tech',
      description: 'Code-focused layout for developers',
      featured: false,
      downloads: '15.2k',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Minimalist',
      category: 'Classic',
      description: 'Simple, clean design that highlights content',
      featured: false,
      downloads: '9.8k',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Bold Creative',
      category: 'Creative',
      description: 'Striking design for standout applications',
      featured: true,
      downloads: '7.1k',
      rating: 4.8
    }
  ];

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

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-0 shadow-md overflow-hidden"
            >
              <div className="relative">
                {template.featured && (
                  <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-64">
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-lg">
                      <FileText className="w-16 h-16 text-slate-400" />
                    </div>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate('/editor/new');
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
                    {template.rating}
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-500">
                    {template.downloads} downloads
                  </span>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      navigate('/editor/new');
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
