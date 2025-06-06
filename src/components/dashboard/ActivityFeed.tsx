
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Edit, Calendar, Star } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'resume_created',
      title: 'Created new resume',
      description: 'Software Engineer Resume',
      time: '2 hours ago',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      type: 'resume_downloaded',
      title: 'Downloaded resume',
      description: 'Marketing Manager CV',
      time: '1 day ago',
      icon: Download,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 3,
      type: 'resume_edited',
      title: 'Updated resume',
      description: 'Data Analyst Resume',
      time: '2 days ago',
      icon: Edit,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 4,
      type: 'template_used',
      title: 'Used new template',
      description: 'Modern Professional template',
      time: '3 days ago',
      icon: Star,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 5,
      type: 'profile_updated',
      title: 'Profile completed',
      description: 'Added work experience',
      time: '1 week ago',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${activity.color} flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                  {activity.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {activity.description}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {activity.time}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
