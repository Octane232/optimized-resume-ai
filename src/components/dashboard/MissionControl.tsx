
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  MoreHorizontal,
  Calendar,
  Building2,
  ExternalLink,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface Application {
  id: string;
  company_name: string;
  job_title: string;
  status: string;
  applied_date: string;
  job_url?: string;
  notes?: string;
}

const STATUS_COLUMNS = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'interviewing', label: 'Interviewing', color: 'bg-amber-500' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

const MissionControl = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async () => {
    if (!newApp.company_name || !newApp.job_title) {
      toast({
        title: "Required fields",
        description: "Please enter company name and job title.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          company_name: newApp.company_name,
          job_title: newApp.job_title,
          job_url: newApp.job_url || null,
          notes: newApp.notes || null,
          status: 'applied'
        });

      if (error) throw error;

      toast({
        title: "Application added",
        description: `${newApp.job_title} at ${newApp.company_name} has been added.`
      });

      setNewApp({ company_name: '', job_title: '', job_url: '', notes: '' });
      setIsAddDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Error",
        description: "Failed to add application.",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(apps => 
        apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setApplications(apps => apps.filter(app => app.id !== id));
      toast({
        title: "Deleted",
        description: "Application removed from tracking."
      });
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check for applications that need follow-up (over 7 days in "applied" status)
  const needsFollowUp = (app: Application) => {
    if (app.status !== 'applied') return false;
    const appliedDate = new Date(app.applied_date);
    const daysSince = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 7;
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-12 bg-muted rounded-lg mb-6 w-48"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mission Control</h2>
          <p className="text-sm text-muted-foreground">Track all your job applications</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="saas-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Company *</label>
                <Input 
                  placeholder="Company name"
                  value={newApp.company_name}
                  onChange={(e) => setNewApp({ ...newApp, company_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Job Title *</label>
                <Input 
                  placeholder="Position title"
                  value={newApp.job_title}
                  onChange={(e) => setNewApp({ ...newApp, job_title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Job URL</label>
                <Input 
                  placeholder="https://..."
                  value={newApp.job_url}
                  onChange={(e) => setNewApp({ ...newApp, job_url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Notes</label>
                <Input 
                  placeholder="Any notes..."
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                />
              </div>
              <Button className="w-full saas-button" onClick={addApplication}>
                Add Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.id} className="kanban-column p-4">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
              <span className="font-semibold text-foreground">{column.label}</span>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {getApplicationsByStatus(column.id).length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {getApplicationsByStatus(column.id).map(app => (
                <div 
                  key={app.id} 
                  className={`kanban-card p-4 ${needsFollowUp(app) ? 'border-amber-500/50' : ''}`}
                >
                  {/* Follow-up indicator */}
                  {needsFollowUp(app) && (
                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>Needs follow-up</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{app.job_title}</p>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{app.company_name}</span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {STATUS_COLUMNS.filter(s => s.id !== column.id).map(status => (
                          <DropdownMenuItem 
                            key={status.id}
                            onClick={() => updateStatus(app.id, status.id)}
                          >
                            Move to {status.label}
                          </DropdownMenuItem>
                        ))}
                        {app.job_url && (
                          <DropdownMenuItem onClick={() => window.open(app.job_url, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Job Posting
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteApplication(app.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-3">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(app.applied_date)}</span>
                  </div>
                </div>
              ))}

              {getApplicationsByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="command-card p-12 text-center mt-8">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start tracking your job applications to never lose sight of where you've applied.
          </p>
          <Button className="saas-button" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Application
          </Button>
        </div>
      )}
    </div>
  );
};

export default MissionControl;
