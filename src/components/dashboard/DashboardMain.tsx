
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, User, Crown, Plus, Lightbulb, TrendingUp, Star, Zap, Target, Clock, Award, Calendar, ArrowRight } from 'lucide-react';
import OnboardingFlow from './OnboardingFlow';
import ResumePreview from './ResumePreview';
import TemplateGallery from './TemplateGallery';
import ActivityFeed from './ActivityFeed';

const DashboardMain = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75);

  const stats = [
    { 
      title: 'Total Resumes', 
      value: '3', 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600', 
      bgColor: 'from-blue-50/50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30', 
      change: '+2 this week',
      trend: 'up'
    },
    { 
      title: 'Downloads', 
      value: '12', 
      icon: Download, 
      color: 'from-emerald-500 to-emerald-600', 
      bgColor: 'from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/30', 
      change: '+5 this month',
      trend: 'up'
    },
    { 
      title: 'Profile Score', 
      value: `${profileCompletion}%`, 
      icon: User, 
      color: 'from-amber-500 to-amber-600', 
      bgColor: 'from-amber-50/50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/30', 
      change: 'Complete to 100%',
      trend: 'neutral'
    },
    { 
      title: 'Plan Status', 
      value: 'Pro', 
      icon: Crown, 
      color: 'from-purple-500 to-purple-600', 
      bgColor: 'from-purple-50/50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/30', 
      change: 'Unlimited resumes',
      trend: 'neutral'
    },
  ];

  const recentResumes = [
    { 
      id: 1,
      name: 'Software Engineer Resume', 
      lastModified: '2 hours ago', 
      format: 'PDF', 
      status: 'Published',
      completion: 95,
      template: 'Modern Professional',
      views: 24
    },
    { 
      id: 2,
      name: 'Marketing Manager CV', 
      lastModified: '1 day ago', 
      format: 'DOCX', 
      status: 'Draft',
      completion: 80,
      template: 'Creative Designer',
      views: 12
    },
    { 
      id: 3,
      name: 'Data Analyst Resume', 
      lastModified: '3 days ago', 
      format: 'PDF', 
      status: 'Published',
      completion: 100,
      template: 'Executive Summary',
      views: 31
    },
  ];

  const aiTips = [
    "Use action verbs to start your bullet points for more impact",
    "Quantify your achievements with specific numbers and percentages",
    "Tailor your resume keywords to match job descriptions",
    "Keep your resume to 1-2 pages for optimal readability",
    "Use consistent formatting throughout your document"
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl" />
        <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-900/5">
          <div className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome back!</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                    Ready to land your 
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> dream job</span>?
                  </h1>
                  
                  <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                    Create professional resumes in minutes with our AI-powered platform. Your next career opportunity is just one click away.
                  </p>
                </div>
                
                {/* Profile Completion */}
                <div className="bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Profile Completion</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-3 mb-3" />
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {profileCompletion < 100 ? 'Complete your profile to unlock premium features' : '🎉 Profile complete! All features unlocked'}
                    </p>
                  </div>
                </div>

                {/* AI Tip */}
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                  <div className="p-2.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">💡 Pro Tip</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiTips[Math.floor(Math.random() * aiTips.length)]}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setShowOnboarding(true)}
                  size="lg"
                  className="h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Create New Resume
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  size="lg"
                  className="h-14 text-base font-medium border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Browse Templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor}`} />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Resumes - Enhanced */}
        <div className="xl:col-span-2">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60 pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Resumes</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and edit your resume collection</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentResumes.map((resume, index) => (
                  <div key={index} className="group relative overflow-hidden bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{resume.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span>Modified {resume.lastModified}</span>
                              <span>•</span>
                              <span>{resume.format}</span>
                              <span>•</span>
                              <span>{resume.views} views</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">
                                {resume.template}
                              </Badge>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                resume.status === 'Published' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {resume.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={resume.completion} className="w-24 h-2" />
                              <span className="text-xs text-slate-500 font-medium">{resume.completion}% complete</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 rounded-xl">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <ActivityFeed />
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
