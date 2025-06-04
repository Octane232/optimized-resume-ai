
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star, ChevronDown, ChevronUp } from 'lucide-react';

// Import templates
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechTemplate from '@/components/templates/TechTemplate';
import ClassicTemplate2 from '@/components/templates/ClassicTemplate2';
import ModernTemplate2 from '@/components/templates/ModernTemplate2';

// Import sample data
import { 
  classicResueSample, 
  modernResumeSample, 
  creativeResumeSample, 
  executiveResumeSample, 
  techResumeSample 
} from '@/data/sampleResumes';

const ResumesShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const categories = ['All', 'Classic', 'Modern', 'Creative', 'Executive', 'Tech'];

  const resumes = [
    // Classic Category
    {
      id: 1,
      category: 'Classic',
      title: 'Traditional Professional',
      description: 'Clean, timeless design perfect for conservative industries',
      industry: 'Finance',
      experience: 'Senior Level',
      rating: 4.9,
      downloads: '12.3k',
      template: ClassicTemplate,
      data: classicResueSample,
      featured: true
    },
    {
      id: 2,
      category: 'Classic',
      title: 'Centered Elegance',
      description: 'Sophisticated center-aligned layout for formal presentations',
      industry: 'Law',
      experience: 'Senior Level',
      rating: 4.8,
      downloads: '8.9k',
      template: ClassicTemplate2,
      data: classicResueSample
    },
    {
      id: 3,
      category: 'Classic',
      title: 'Corporate Executive',
      description: 'Formal layout ideal for C-suite positions',
      industry: 'Corporate',
      experience: 'Executive',
      rating: 4.8,
      downloads: '8.7k',
      template: ExecutiveTemplate,
      data: executiveResumeSample
    },
    
    // Modern Category
    {
      id: 11,
      category: 'Modern',
      title: 'Minimalist Pro',
      description: 'Clean lines and modern typography for contemporary roles',
      industry: 'Marketing',
      experience: 'Mid-Level',
      rating: 4.9,
      downloads: '15.2k',
      template: ModernTemplate,
      data: modernResumeSample,
      featured: true
    },
    {
      id: 12,
      category: 'Modern',
      title: 'Split Column',
      description: 'Efficient two-column layout maximizing space utilization',
      industry: 'Consulting',
      experience: 'Mid-Level',
      rating: 4.7,
      downloads: '11.4k',
      template: ModernTemplate2,
      data: modernResumeSample
    },
    
    // Creative Category
    {
      id: 21,
      category: 'Creative',
      title: 'Designer Portfolio',
      description: 'Vibrant and creative layout for design professionals',
      industry: 'Design',
      experience: 'Mid-Level',
      rating: 4.8,
      downloads: '11.4k',
      template: CreativeTemplate,
      data: creativeResumeSample,
      featured: true
    },
    
    // Executive Category
    {
      id: 31,
      category: 'Executive',
      title: 'CEO Excellence',
      description: 'Premium design for top-tier executive positions',
      industry: 'Technology',
      experience: 'Executive',
      rating: 4.9,
      downloads: '6.1k',
      template: ExecutiveTemplate,
      data: executiveResumeSample,
      featured: true
    },
    
    // Tech Category
    {
      id: 41,
      category: 'Tech',
      title: 'Software Engineer',
      description: 'Tech-focused design highlighting technical skills',
      industry: 'Software',
      experience: 'Senior Level',
      rating: 4.9,
      downloads: '18.7k',
      template: TechTemplate,
      data: techResumeSample,
      featured: true
    }
  ];

  const filteredResumes = selectedCategory === 'All' 
    ? resumes 
    : resumes.filter(resume => resume.category === selectedCategory);

  const displayedResumes = showAll ? filteredResumes : filteredResumes.slice(0, 6);

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
                className="px-6 py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedResumes.map((resume, index) => {
            const TemplateComponent = resume.template;
            return (
              <Card 
                key={resume.id} 
                className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  {resume.featured && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-64">
                    <div className="w-full h-full p-2 overflow-hidden">
                      <TemplateComponent data={resume.data} scale={0.3} />
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                        {resume.title}
                      </h3>
                      <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {resume.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-amber-400 mr-1" />
                      {resume.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {resume.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {resume.industry}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{resume.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {resume.downloads} downloads
                    </span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        {filteredResumes.length > 6 && (
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
                  Show More Templates ({filteredResumes.length - 6} more)
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
