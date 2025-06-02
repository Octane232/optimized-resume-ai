
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Star } from 'lucide-react';

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
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop',
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
      preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop'
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
      preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
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
      preview: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop'
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
      preview: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
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
      preview: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop'
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
      preview: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop'
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
      preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop'
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
      preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
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
      preview: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop'
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
          {filteredResumes.map((resume, index) => (
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
                  <img 
                    src={resume.preview} 
                    alt={resume.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
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
          ))}
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
