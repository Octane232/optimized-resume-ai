
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, User, Crown, Plus, Lightbulb, TrendingUp, Star, Zap } from 'lucide-react';

const DashboardMain = () => {
  const stats = [
    { title: 'Total Resumes', value: '3', icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' },
    { title: 'Downloads', value: '12', icon: Download, color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20' },
    { title: 'Profile Score', value: '85%', icon: User, color: 'from-amber-500 to-amber-600', bgColor: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20' },
    { title: 'Plan Status', value: 'Pro', icon: Crown, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' },
  ];

  const recentResumes = [
    { name: 'Software Engineer Resume', lastModified: '2 hours ago', format: 'PDF', status: 'Published' },
    { name: 'Marketing Manager CV', lastModified: '1 day ago', format: 'DOCX', status: 'Draft' },
    { name: 'Data Analyst Resume', lastModified: '3 days ago', format: 'PDF', status: 'Published' },
  ];

  const aiTips = [
    "Use action verbs to start your bullet points for more impact",
    "Quantify your achievements with specific numbers and percentages",
    "Tailor your resume keywords to match job descriptions",
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl"></div>
        <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent mb-2">
                  Welcome back, John! 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Ready to create your next career opportunity?</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {aiTips[Math.floor(Math.random() * aiTips.length)]}
                </span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 text-lg font-semibold">
              <Plus className="w-5 h-5 mr-3" />
              Create New Resume
            </Button>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Resumes */}
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
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{resume.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Modified {resume.lastModified} • {resume.format}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resume.status === 'Published' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {resume.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 hover:text-red-700">
                    Delete
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

export default DashboardMain;
