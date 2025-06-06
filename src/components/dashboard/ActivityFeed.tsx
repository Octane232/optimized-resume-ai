
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Edit, Eye, Clock, TrendingUp } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'created',
      title: 'Software Engineer Resume',
      description: 'New resume created',
      time: '2 hours ago',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50/50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30'
    },
    {
      id: 2,
      type: 'downloaded',
      title: 'Marketing Resume',
      description: 'Downloaded as PDF',
      time: '5 hours ago',
      icon: Download,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/30'
    },
    {
      id: 3,
      type: 'edited',
      title: 'Data Analyst CV',
      description: 'Skills section updated',
      time: '1 day ago',
      icon: Edit,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50/50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/30'
    },
    {
      id: 4,
      type: 'viewed',
      title: 'Portfolio Review',
      description: '12 new profile views',
      time: '2 days ago',
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50/50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/30'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Profile Milestone',
      description: '75% completion reached',
      time: '3 days ago',
      icon: TrendingUp,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'from-rose-50/50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/30'
    }
  ];

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Your latest actions and achievements</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="relative overflow-hidden bg-gradient-to-r from-slate-50/30 to-white/30 dark:from-slate-800/20 dark:to-slate-700/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${activity.bgColor} opacity-50`} />
              <div className="relative flex items-start gap-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activity.color} shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {activity.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800 border-0 ml-2">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
