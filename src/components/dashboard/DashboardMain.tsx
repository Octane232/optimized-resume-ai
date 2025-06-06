
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, User, Crown, Plus, Lightbulb, TrendingUp, Star, Zap, Target, Clock, Award, Calendar } from 'lucide-react';
import OnboardingFlow from './OnboardingFlow';
import ResumePreview from './ResumePreview';
import TemplateGallery from './TemplateGallery';
import ActivityFeed from './ActivityFeed';

const DashboardMain = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75);

  const stats = [
    { title: 'Total Resumes', value: '3', icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', change: '+2 this week' },
    { title: 'Downloads', value: '12', icon: Download, color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20', change: '+5 this month' },
    { title: 'Profile Score', value: `${profileCompletion}%`, icon: User, color: 'from-amber-500 to-amber-600', bgColor: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20', change: 'Complete to 100%' },
    { title: 'Plan Status', value: 'Pro', icon: Crown, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20', change: 'Unlimited resumes' },
  ];

  const recentResumes = [
    { 
      id: 1,
      name: 'Software Engineer Resume', 
      lastModified: '2 hours ago', 
      format: 'PDF', 
      status: 'Published',
      completion: 95,
      template: 'Modern Professional'
    },
    { 
      id: 2,
      name: 'Marketing Manager CV', 
      lastModified: '1 day ago', 
      format: 'DOCX', 
      status: 'Draft',
      completion: 80,
      template: 'Creative Designer'
    },
    { 
      id: 3,
      name: 'Data Analyst Resume', 
      lastModified: '3 days ago', 
      format: 'PDF', 
      status: 'Published',
      completion: 100,
      template: 'Executive Summary'
    },
  ];

  const aiTips = [
    "Use action verbs to start your bullet points for more impact",
    "Quantify your achievements with specific numbers and percentages",
    "Tailor your resume keywords to match job descriptions",
    "Keep your resume to 1-2 pages for optimal readability",
    "Use consistent formatting throughout your document"
  ];

  const upcomingFeatures = [
    { title: 'LinkedIn Integration', description: 'Import your profile data automatically', eta: 'Coming Soon' },
    { title: 'Interview Preparation', description: 'AI-powered interview questions based on your resume', eta: 'Next Week' },
    { title: 'Job Matching', description: 'Find jobs that match your skills perfectly', eta: '2 Weeks' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Progress Tracker */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl"></div>
        <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent mb-2">
                  Welcome back, John! 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Ready to create your next career opportunity?</p>
              </div>
              
              {/* Profile Completion Tracker */}
              <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Completion</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {profileCompletion < 100 ? 'Complete your profile to unlock all features' : 'Your profile is complete!'}
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  💡 {aiTips[Math.floor(Math.random() * aiTips.length)]}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 text-lg font-semibold"
              >
                <Plus className="w-5 h-5 mr-3" />
                Create New Resume
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowTemplates(true)}
                className="border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-12 px-6"
              >
                <Star className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`}></div>
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Resumes */}
        <div className="lg:col-span-2">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Recent Resumes</span>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentResumes.map((resume, index) => (
                  <div key={index} className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{resume.name}</h3>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Modified {resume.lastModified} • {resume.format}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {resume.template}
                          </Badge>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            resume.status === 'Published' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {resume.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={resume.completion} className="w-20 h-1" />
                          <span className="text-xs text-slate-500">{resume.completion}% complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700">
                        Duplicate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed & Upcoming Features */}
        <div className="space-y-6">
          <ActivityFeed />
          
          {/* Upcoming Features */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingFeatures.map((feature, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <Badge variant="secondary" className="text-xs">{feature.eta}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showOnboarding && (
        <OnboardingFlow onClose={() => setShowOnboarding(false)} />
      )}
      
      {showTemplates && (
        <TemplateGallery onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
};

export default DashboardMain;
