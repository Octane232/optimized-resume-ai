
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, User, Crown, Plus, Lightbulb } from 'lucide-react';

const DashboardMain = () => {
  const stats = [
    { title: 'Total Resumes', value: '3', icon: FileText, color: 'text-blue-600' },
    { title: 'Downloads', value: '12', icon: Download, color: 'text-green-600' },
    { title: 'Profile Completion', value: '85%', icon: User, color: 'text-orange-600' },
    { title: 'Plan Status', value: 'Pro', icon: Crown, color: 'text-purple-600' },
  ];

  const recentResumes = [
    { name: 'Software Engineer Resume', lastModified: '2 hours ago', format: 'PDF' },
    { name: 'Marketing Manager CV', lastModified: '1 day ago', format: 'DOCX' },
    { name: 'Data Analyst Resume', lastModified: '3 days ago', format: 'PDF' },
  ];

  const aiTips = [
    "Use action verbs to start your bullet points for more impact",
    "Quantify your achievements with specific numbers and percentages",
    "Tailor your resume keywords to match job descriptions",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, John! 👋
            </h1>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">
                {aiTips[Math.floor(Math.random() * aiTips.length)]}
              </span>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Resume
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-slate-50 dark:bg-slate-800 p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Resumes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Resumes</span>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentResumes.map((resume, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{resume.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Modified {resume.lastModified} • {resume.format}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Download</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
