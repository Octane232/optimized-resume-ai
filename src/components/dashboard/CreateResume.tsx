
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Clock, Award, Wand2, Edit, Sparkles } from 'lucide-react';

const CreateResume = () => {
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean, ATS-friendly design perfect for tech roles',
      preview: '/api/placeholder/300/400',
      category: 'Professional',
      popular: true
    },
    {
      id: 2,
      name: 'Creative Designer',
      description: 'Eye-catching layout ideal for creative positions',
      preview: '/api/placeholder/300/400',
      category: 'Creative',
      popular: false
    },
    {
      id: 3,
      name: 'Executive Summary',
      description: 'Sophisticated template for leadership roles',
      preview: '/api/placeholder/300/400',
      category: 'Executive',
      popular: true
    },
    {
      id: 4,
      name: 'Minimalist',
      description: 'Simple, elegant design that highlights content',
      preview: '/api/placeholder/300/400',
      category: 'Minimalist',
      popular: false
    }
  ];

  const features = [
    { icon: Zap, title: 'AI-Powered Content', description: 'Get suggestions for compelling bullet points', color: 'from-yellow-400 to-orange-500' },
    { icon: Clock, title: 'Quick Creation', description: 'Build professional resumes in under 10 minutes', color: 'from-blue-500 to-cyan-500' },
    { icon: Award, title: 'ATS Optimized', description: 'Pass applicant tracking systems with ease', color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Create Your Perfect Resume
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose from our professionally designed templates or create your own custom resume from scratch
        </p>
      </div>

      {/* Creation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
          <CardContent className="relative p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI-Powered Resume</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Let our AI create a tailored resume based on your experience and target role</p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Create with AI
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10"></div>
          <CardContent className="relative p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Custom Resume</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start from scratch and build your resume exactly how you want it</p>
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3">
              <Edit className="w-5 h-5 mr-2" />
              Create Custom
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Choose a Template
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer">
                <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl p-6 mb-4 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Popular
                    </div>
                  )}
                  <div className="w-full h-48 bg-white dark:bg-slate-700 rounded-lg border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-16 h-16 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                  <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold transition-all duration-300">
                    Use This Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResume;
