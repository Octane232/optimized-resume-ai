
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  MoreHorizontal,
  Calendar,
  Building2,
  ExternalLink,
  Trash2,
  AlertCircle,
  Filter,
  StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Updated columns per spec: Saved → Applied → Interview → Offer
const STATUS_COLUMNS = [
  { id: 'saved', label: 'Saved', color: 'bg-slate-500' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'interviewing', label: 'Interview', color: 'bg-amber-500' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-500' },
];

const MissionControl = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [newApp, setNewApp] = useState({
    company_name: '',
    job_title: '',
    job_url: '',
    notes: '',
    status: 'saved'
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
          status: newApp.status
        });

      if (error) throw error;

      toast({
        title: "Application added",
        description: `${newApp.job_title} at ${newApp.company_name} has been added.`
      });

      setNewApp({ company_name: '', job_title: '', job_url: '', notes: '', status: 'saved' });
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
    let filtered = applications.filter(app => app.status === status);
    
    // Apply additional filter if set
    if (filter !== 'all') {
      filtered = filtered.filter(app => 
        app.company_name.toLowerCase().includes(filter.toLowerCase()) ||
        app.job_title.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return filtered;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Stale card detection: >5 days in "applied" without update
  const isStale = (app: Application) => {
    if (app.status !== 'applied') return false;
    const appliedDate = new Date(app.applied_date);
    const daysSince = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 5;
  };

  // Get unique companies for filter
  const uniqueCompanies = [...new Set(applications.map(app => app.company_name))];

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
          <h2 className="text-xl font-bold text-foreground">Mission Control</h2>
          <p className="text-xs text-muted-foreground">Track all your job applications</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          {uniqueCompanies.length > 0 && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <Filter className="w-3.5 h-3.5 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {uniqueCompanies.slice(0, 10).map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="saas-button h-9">
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Job Title *</label>
                  <Input 
                    placeholder="Position title"
                    value={newApp.job_title}
                    onChange={(e) => setNewApp({ ...newApp, job_title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select value={newApp.status} onValueChange={(val) => setNewApp({ ...newApp, status: val })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_COLUMNS.map(col => (
                        <SelectItem key={col.id} value={col.id}>{col.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Job URL</label>
                  <Input 
                    placeholder="https://..."
                    value={newApp.job_url}
                    onChange={(e) => setNewApp({ ...newApp, job_url: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Notes</label>
                  <Textarea 
                    placeholder="Any notes about this application..."
                    value={newApp.notes}
                    onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <Button className="w-full saas-button" onClick={addApplication}>
                  Add Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.id} className="kanban-column p-4 min-h-[400px]">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${column.color}`}></div>
              <span className="font-semibold text-foreground text-sm">{column.label}</span>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {getApplicationsByStatus(column.id).length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {getApplicationsByStatus(column.id).map(app => (
                <div 
                  key={app.id} 
                  className={`kanban-card p-3.5 ${isStale(app) ? 'ring-1 ring-amber-500/50' : ''}`}
                >
                  {/* Stale indicator */}
                  {isStale(app) && (
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>Stale — follow up</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{app.job_title}</p>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{app.company_name}</span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
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
                        <DropdownMenuSeparator />
                        {app.job_url && (
                          <DropdownMenuItem onClick={() => window.open(app.job_url, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Job Posting
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteApplication(app.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Notes indicator */}
                  {app.notes && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
                      <StickyNote className="w-3 h-3" />
                      <span className="truncate">{app.notes.slice(0, 40)}{app.notes.length > 40 ? '...' : ''}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(app.applied_date)}</span>
                  </div>
                </div>
              ))}

              {getApplicationsByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-xs">
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
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
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
