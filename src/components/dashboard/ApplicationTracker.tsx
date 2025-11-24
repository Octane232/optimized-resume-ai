import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Briefcase, Calendar, MapPin, DollarSign, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export const ApplicationTracker = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "applied",
    applied_date: new Date().toISOString().split('T')[0],
    deadline: "",
    salary_range: "",
    location: "",
    notes: "",
    contact_person: "",
    contact_email: "",
    follow_up_date: "",
    priority: "medium"
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('applied_date', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const dataToSave = {
        ...formData,
        user_id: user.id,
        deadline: formData.deadline || null,
        follow_up_date: formData.follow_up_date || null
      };

      if (editingApp) {
        const { error } = await supabase
          .from('job_applications')
          .update(dataToSave)
          .eq('id', editingApp.id);
        
        if (error) throw error;
        toast({ title: "Application updated successfully" });
      } else {
        const { error } = await supabase
          .from('job_applications')
          .insert([dataToSave]);
        
        if (error) throw error;
        toast({ title: "Application added successfully" });
      }

      setIsDialogOpen(false);
      setEditingApp(null);
      resetForm();
      fetchApplications();
    } catch (error: any) {
      console.error('Error saving application:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Application deleted" });
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      job_title: "",
      job_url: "",
      status: "applied",
      applied_date: new Date().toISOString().split('T')[0],
      deadline: "",
      salary_range: "",
      location: "",
      notes: "",
      contact_person: "",
      contact_email: "",
      follow_up_date: "",
      priority: "medium"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      applied: "secondary",
      interviewing: "default",
      offer: "default",
      rejected: "destructive",
      withdrawn: "outline"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600"
    };
    return colors[priority] || "text-gray-600";
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Application Tracker</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingApp(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingApp ? 'Edit' : 'Add'} Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    required
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="job_url">Job URL</Label>
                <Input
                  id="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applied_date">Applied Date</Label>
                  <Input
                    id="applied_date"
                    type="date"
                    value={formData.applied_date}
                    onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="salary_range">Salary Range</Label>
                  <Input
                    id="salary_range"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="follow_up_date">Follow-up Date</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingApp ? 'Update' : 'Add'} Application
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No applications yet. Start tracking your job applications!</p>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{app.job_title}</h3>
                    {getStatusBadge(app.status)}
                    <Badge variant="outline" className={getPriorityColor(app.priority)}>
                      {app.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span>{app.company_name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {app.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{app.location}</span>
                      </div>
                    )}
                    {app.salary_range && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>{app.salary_range}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {format(new Date(app.applied_date), 'MMM dd, yyyy')}</span>
                    </div>
                    {app.deadline && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {format(new Date(app.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {app.notes && (
                    <p className="mt-3 text-sm text-muted-foreground">{app.notes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingApp(app);
                      setFormData({
                        company_name: app.company_name,
                        job_title: app.job_title,
                        job_url: app.job_url || "",
                        status: app.status,
                        applied_date: app.applied_date.split('T')[0],
                        deadline: app.deadline ? app.deadline.split('T')[0] : "",
                        salary_range: app.salary_range || "",
                        location: app.location || "",
                        notes: app.notes || "",
                        contact_person: app.contact_person || "",
                        contact_email: app.contact_email || "",
                        follow_up_date: app.follow_up_date ? app.follow_up_date.split('T')[0] : "",
                        priority: app.priority
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(app.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};