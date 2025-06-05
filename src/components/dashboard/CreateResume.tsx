
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Clock, Award } from 'lucide-react';

const CreateResume = () => {
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean, ATS-friendly design perfect for tech roles',
      preview: '/api/placeholder/300/400',
      category: 'Professional'
    },
    {
      id: 2,
      name: 'Creative Designer',
      description: 'Eye-catching layout ideal for creative positions',
      preview: '/api/placeholder/300/400',
      category: 'Creative'
    },
    {
      id: 3,
      name: 'Executive Summary',
      description: 'Sophisticated template for leadership roles',
      preview: '/api/placeholder/300/400',
      category: 'Executive'
    },
    {
      id: 4,
      name: 'Minimalist',
      description: 'Simple, elegant design that highlights content',
      preview: '/api/placeholder/300/400',
      category: 'Minimalist'
    }
  ];

  const features = [
    { icon: Zap, title: 'AI-Powered Content', description: 'Get suggestions for compelling bullet points' },
    { icon: Clock, title: 'Quick Creation', description: 'Build professional resumes in under 10 minutes' },
    { icon: Award, title: 'ATS Optimized', description: 'Pass applicant tracking systems with ease' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create New Resume</h1>
        <p className="text-slate-600 dark:text-slate-400">Choose a template and let our AI help you create the perfect resume</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-3 group-hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-white dark:bg-slate-700 rounded border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">{template.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{template.description}</p>
                <Button className="w-full" variant="outline">
                  Use This Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;
