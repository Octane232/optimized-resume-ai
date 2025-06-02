
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star } from 'lucide-react';

// Import templates
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechTemplate from '@/components/templates/TechTemplate';

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
      id: 3,
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
      id: 4,
      category: 'Modern',
      title: 'Sleek Professional',
      description: 'Sophisticated design with subtle accents',
      industry: 'Consulting',
      experience: 'Senior Level',
      rating: 4.7,
      downloads: '9.8k',
      template: ModernTemplate,
      data: modernResumeSample
    },
    // Creative Category
    {
      id: 5,
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
    {
      id: 6,
      category: 'Creative',
      title: 'Artistic Expression',
      description: 'Bold design perfect for creative industries',
      industry: 'Arts',
      experience: 'Entry Level',
      rating: 4.6,
      downloads: '7.2k',
      template: CreativeTemplate,
      data: creativeResumeSample
    },
    // Executive Category
    {
      id: 7,
      category: 'Executive',
      title: 'CEO Excellence',
      description: 'Premium design for top-tier executive positions',
      industry: 'Technology',
      experience: 'Executive',
      rating: 4.9,
      downloads: '6.1k',
      template: ExecutiveTemplate,
      data: executiveResumeSample
    },
    {
      id: 8,
      category: 'Executive',
      title: 'Leadership Focus',
      description: 'Authoritative layout emphasizing leadership experience',
      industry: 'Healthcare',
      experience: 'Executive',
      rating: 4.8,
      downloads: '5.9k',
      template: ExecutiveTemplate,
      data: executiveResumeSample
    },
    // Tech Category
    {
      id: 9,
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
    },
    {
      id: 10,
      category: 'Tech',
      title: 'Data Scientist',
      description: 'Analytics-focused layout perfect for data roles',
      industry: 'Data Science',
      experience: 'Mid-Level',
      rating: 4.7,
      downloads: '13.5k',
      template: TechTemplate,
      data: techResumeSample
    }
  ];

  const filteredResumes = selectedCategory === 'All' 
    ? resumes 
    : resumes.filter(resume => resume.category === selectedCategory);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Resume Templates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredResumes.map((resume, index) => {
            const TemplateComponent = resume.template;
            return (
              <Card 
                key={resume.id} 
                className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  {resume.featured && (
                    <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  <div className="relative overflow-hidden bg-gray-100 h-64">
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
                        <Button size="sm" className="bg-navy-600 hover:bg-navy-700">
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
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {resume.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {resume.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-amber-400 mr-1" />
                      {resume.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {resume.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {resume.industry}
                    </span>
                    <span>{resume.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {resume.downloads} downloads
                    </span>
                    <Button size="sm" className="bg-navy-600 hover:bg-navy-700">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-navy-600 to-navy-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Can't Find the Perfect Template?
            </h3>
            <p className="text-navy-100 mb-6 max-w-2xl mx-auto">
              Our AI can create a completely custom resume design based on your industry, 
              experience level, and personal preferences.
            </p>
            <Button size="lg" className="bg-white text-navy-600 hover:bg-gray-100">
              Create Custom Resume with AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumesShowcase;
