import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

// ===== Types =====
interface Application {
  id: string;
  company_name: string;
  job_title: string;
  status: string;
  applied_date: string;
  job_url?: string;
  notes?: string;
}

interface NewApplication {
  company_name: string;
  job_title: string;
  job_url: string;
  notes: string;
  status: string;
}

// ===== Constants =====
const STATUS_COLUMNS = [
  { id: 'saved', label: 'Saved', color: 'bg-slate-500' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'interviewing', label: 'Interview', color: 'bg-amber-500' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-400' },
];

const NEW_APP_INITIAL: NewApplication = {
  company_name: '',
  job_title: '',
  job_url: '',
  notes: '',
  status: 'saved'
};

// ===== Helper Functions =====
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const isStale = (app: Application): boolean => {
  if (app.status !== 'applied') return false;
  const appliedDate = new Date(app.applied_date);
  const daysSince = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysSince >= 5;
};

const validateNewApplication = (app: NewApplication): boolean => {
  return Boolean(app.company_name.trim() && app.job_title.trim());
};

// ===== Custom Hooks =====
const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
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
  }, []);

  const addApplication = useCallback(async (newApp: NewApplication) => {
    if (!validateNewApplication(newApp)) {
      toast({
        title: "Required fields",
        description: "Please enter company name and job title.",
        variant: "destructive"
      });
      return false;
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

      await fetchApplications();
      return true;
    } catch (error) {
      console.error('Error adding application:', error);
      toast({
        title: "Error",
        description: "Failed to add application.",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchApplications]);

  const updateStatus = useCallback(async (id: string, newStatus: string) => {
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
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
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
  }, []);

  return {
    applications,
    loading,
    fetchApplications,
    addApplication,
    updateStatus,
    deleteApplication
  };
};

// ===== Subcomponents =====
interface LoadingSkeletonProps {
  columnCount?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ columnCount = 4 }) => {
  const skeletons = useMemo(() => Array(columnCount).fill(null), [columnCount]);
  
  return (
    <div className="p-6">
      <div className="h-12 bg-muted/50 rounded-lg mb-6 w-48 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {skeletons.map((_, i) => (
          <div key={i} className="h-96 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
};

interface HeaderProps {
  onAddClick: () => void;
  uniqueCompanies: string[];
  filter: string;
  onFilterChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddClick, 
  uniqueCompanies, 
  filter, 
  onFilterChange 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mission Control</h2>
        <p className="text-xs text-muted-foreground">Track all your job applications</p>
      </div>
      
      <div className="flex items-center gap-3">
        {uniqueCompanies.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="company-filter" className="sr-only">
              Filter by company
            </label>
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger id="company-filter" className="w-[160px] h-9 text-sm">
                <Filter className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {uniqueCompanies.slice(0, 10).map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button className="saas-button h-9" onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Add Application
        </Button>
      </div>
    </div>
  );
};

interface AddApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (app: NewApplication) => Promise<boolean>;
}

const AddApplicationDialog: React.FC<AddApplicationDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAdd 
}) => {
  const [newApp, setNewApp] = useState<NewApplication>(NEW_APP_INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await onAdd(newApp);
    setIsSubmitting(false);
    
    if (success) {
      setNewApp(NEW_APP_INITIAL);
      onOpenChange(false);
    }
  };

  const updateField = <K extends keyof NewApplication>(field: K, value: NewApplication[K]) => {
    setNewApp(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="saas-button h-9">
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent aria-labelledby="add-application-title">
        <DialogHeader>
          <DialogTitle id="add-application-title">Add New Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label htmlFor="company-name" className="text-sm font-medium text-foreground">
              Company <span aria-hidden="true">*</span>
              <span className="sr-only">Required</span>
            </label>
            <Input 
              id="company-name"
              placeholder="Company name"
              value={newApp.company_name}
              onChange={(e) => updateField('company_name', e.target.value)}
              className="mt-1"
              aria-required="true"
              required
            />
          </div>

          <div>
            <label htmlFor="job-title" className="text-sm font-medium text-foreground">
              Job Title <span aria-hidden="true">*</span>
              <span className="sr-only">Required</span>
            </label>
            <Input 
              id="job-title"
              placeholder="Position title"
              value={newApp.job_title}
              onChange={(e) => updateField('job_title', e.target.value)}
              className="mt-1"
              aria-required="true"
              required
            />
          </div>

          <div>
            <label htmlFor="application-status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select value={newApp.status} onValueChange={(val) => updateField('status', val)}>
              <SelectTrigger id="application-status" className="mt-1">
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
            <label htmlFor="job-url" className="text-sm font-medium text-foreground">
              Job URL
            </label>
            <Input 
              id="job-url"
              type="url"
              placeholder="https://..."
              value={newApp.job_url}
              onChange={(e) => updateField('job_url', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea 
              id="notes"
              placeholder="Any notes about this application..."
              value={newApp.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <Button 
            className="w-full saas-button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface KanbanCardProps {
  application: Application;
  columnId: string;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ 
  application, 
  columnId, 
  onUpdateStatus, 
  onDelete 
}) => {
  const stale = isStale(application);
  
  const statusActions = STATUS_COLUMNS
    .filter(s => s.id !== columnId)
    .map(status => (
      <DropdownMenuItem 
        key={status.id}
        onClick={() => onUpdateStatus(application.id, status.id)}
      >
        Move to {status.label}
      </DropdownMenuItem>
    ));

  return (
    <div 
      className={`kanban-card p-3.5 ${stale ? 'ring-1 ring-amber-500/50' : ''}`}
      role="listitem"
    >
      {stale && (
        <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-2">
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          <span>Stale — follow up</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm truncate">{application.job_title}</p>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <Building2 className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{application.company_name}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 shrink-0"
              aria-label={`Actions for ${application.job_title} at ${application.company_name}`}
            >
              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusActions}
            <DropdownMenuSeparator />
            {application.job_url && (
              <DropdownMenuItem onClick={() => window.open(application.job_url, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                Open Job Posting
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(application.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {application.notes && (
        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
          <StickyNote className="w-3 h-3" aria-hidden="true" />
          <span className="truncate">
            {application.notes.slice(0, 40)}{application.notes.length > 40 ? '...' : ''}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
        <Calendar className="w-3 h-3" aria-hidden="true" />
        <time dateTime={application.applied_date}>{formatDate(application.applied_date)}</time>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  column: typeof STATUS_COLUMNS[0];
  applications: Application[];
  filter: string;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  applications, 
  filter, 
  onUpdateStatus, 
  onDelete 
}) => {
  const filteredApps = useMemo(() => {
    let filtered = applications.filter(app => app.status === column.id);
    
    if (filter !== 'all') {
      filtered = filtered.filter(app => 
        app.company_name.toLowerCase().includes(filter.toLowerCase()) ||
        app.job_title.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return filtered;
  }, [applications, column.id, filter]);

  return (
    <div 
      className="kanban-column p-4 min-h-[400px]"
      role="region"
      aria-label={`${column.label} applications column`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} aria-hidden="true" />
        <span className="font-semibold text-foreground text-sm">{column.label}</span>
        <span 
          className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
          aria-label={`${filteredApps.length} applications`}
        >
          {filteredApps.length}
        </span>
      </div>

      <div className="space-y-2.5" role="list" aria-label={`${column.label} applications`}>
        {filteredApps.map(app => (
          <KanbanCard
            key={app.id}
            application={app}
            columnId={column.id}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}

        {filteredApps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs">
            No applications
          </div>
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="command-card p-12 text-center mt-8">
      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Building2 className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
        Start tracking your job applications to never lose sight of where you've applied.
      </p>
      <Button className="saas-button" onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
        Add Your First Application
      </Button>
    </div>
  );
};

// ===== Main Component =====
const MissionControl: React.FC = () => {
  const { applications, loading, fetchApplications, addApplication, updateStatus, deleteApplication } = useApplications();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const uniqueCompanies = useMemo(() => {
    return [...new Set(applications.map(app => app.company_name))];
  }, [applications]);

  const handleAddApplication = useCallback(async (newApp: NewApplication) => {
    return await addApplication(newApp);
  }, [addApplication]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6">
      <Header 
        onAddClick={() => setIsAddDialogOpen(true)}
        uniqueCompanies={uniqueCompanies}
        filter={filter}
        onFilterChange={setFilter}
      />

      <AddApplicationDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddApplication}
      />

      {applications.length === 0 ? (
        <EmptyState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STATUS_COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              applications={applications}
              filter={filter}
              onUpdateStatus={updateStatus}
              onDelete={deleteApplication}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionControl;
