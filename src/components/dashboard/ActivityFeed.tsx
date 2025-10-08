
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Edit, Eye, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedActivities = data?.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        time: formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }),
        icon: getIconForType(activity.type),
        color: getColorForType(activity.type)
      })) || [];

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'created': return FileText;
      case 'downloaded': return Download;
      case 'edited': return Edit;
      case 'viewed': return Eye;
      case 'achievement': return TrendingUp;
      default: return FileText;
    }
  };

  const getColorForType = (type) => {
    return 'bg-primary/10';
  };

  return (
    <Card className="glass-morphism border border-border/50 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground font-normal">Your latest actions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 bg-muted rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-2">Start creating resumes to see your activity here</p>
          </div>
        ) : (
          activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="bg-accent/20 rounded-xl border border-border/50 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={activity.color + ' p-2.5 rounded-xl'}>
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {activity.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          );
        }))}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
