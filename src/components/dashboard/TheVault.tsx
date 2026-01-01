
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  Plus, 
  X, 
  CheckCircle,
  Award,
  FolderKanban,
  Tag,
  Tags
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const TheVault = () => {
  const [hasResume, setHasResume] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCert, setNewCert] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState('');
  const [resumeTags, setResumeTags] = useState<string[]>(['General']);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        setHasResume(true);
        setResumeTitle(resumes[0].title);
        const content = resumes[0].content as any;
        if (content?.skills) setSkills(content.skills);
      }

    } catch (error) {
      console.error('Error fetching vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 0;
    if (hasResume) score += 40;
    if (skills.length >= 5) score += 20;
    else if (skills.length > 0) score += 10;
    if (certifications.length > 0) score += 15;
    if (projects.length > 0) score += 15;
    if (resumeTags.length > 1) score += 10;
    return Math.min(score, 100);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('word') && !file.name.endsWith('.docx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: file.name.replace(/\.(pdf|docx?)$/i, ''),
            content: {
              personalInfo: { fullName: 'Uploaded Resume' },
              skills: [],
              experience: [],
              education: []
            }
          });

        if (error) throw error;

        setHasResume(true);
        setResumeTitle(file.name.replace(/\.(pdf|docx?)$/i, ''));
        
        toast({
          title: "Resume uploaded",
          description: "Your master resume has been uploaded successfully."
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your resume.",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    }, 1500);
  };

  const addItem = (
    item: string, 
    setItem: (val: string) => void, 
    items: string[], 
    setItems: (items: string[]) => void
  ) => {
    if (item.trim() && !items.includes(item.trim())) {
      setItems([...items, item.trim()]);
      setItem('');
    }
  };

  const removeItem = (index: number, items: string[], setItems: (items: string[]) => void) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const completeness = calculateCompleteness();

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-24 bg-muted rounded-2xl"></div>
        <div className="h-48 bg-muted rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Vault Completeness Meter */}
      <div className="command-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Vault Completeness</h2>
            <p className="text-xs text-muted-foreground">The more complete, the better your insights</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${completeness >= 75 ? 'text-emerald-500' : completeness >= 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {completeness}%
            </span>
          </div>
        </div>
        <Progress value={completeness} className="h-2" />
        
        {/* Completion hints */}
        <div className="flex flex-wrap gap-2 mt-3">
          {!hasResume && (
            <span className="text-xs text-amber-500">• Upload master resume (+40%)</span>
          )}
          {skills.length < 5 && (
            <span className="text-xs text-amber-500">• Add {5 - skills.length} more skills (+{skills.length > 0 ? '10' : '20'}%)</span>
          )}
          {certifications.length === 0 && (
            <span className="text-xs text-muted-foreground">• Add certifications (+15%)</span>
          )}
        </div>
      </div>

      {/* Master Resume - Mandatory */}
      <div className="command-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-electric to-blue-400 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Master Resume</h3>
            <p className="text-xs text-muted-foreground">Required — Your primary career document</p>
          </div>
        </div>

        {hasResume ? (
          <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-foreground text-sm">{resumeTitle}</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Replace
            </Button>
          </div>
        ) : (
          <label className="block">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-foreground mb-1 text-sm">Upload your master resume</p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX • Drag and drop or click</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Resume Tags/Labels */}
      <div className="command-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-400 rounded-lg flex items-center justify-center">
            <Tags className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Resume Versions</h3>
            <p className="text-xs text-muted-foreground">Tag different versions (e.g., "Tech PM", "General")</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a version tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(newTag, setNewTag, resumeTags, setResumeTags)}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => addItem(newTag, setNewTag, resumeTags, setResumeTags)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {resumeTags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1 text-xs">
              {tag}
              {resumeTags.length > 1 && (
                <button 
                  onClick={() => removeItem(i, resumeTags, setResumeTags)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="command-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Skills</h3>
            <p className="text-xs text-muted-foreground">Technical and soft skills</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(newSkill, setNewSkill, skills, setSkills)}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => addItem(newSkill, setNewSkill, skills, setSkills)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1 text-xs">
              {skill}
              <button 
                onClick={() => removeItem(i, skills, setSkills)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="command-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Certifications</h3>
            <p className="text-xs text-muted-foreground">Professional certifications and courses</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a certification..."
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(newCert, setNewCert, certifications, setCertifications)}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => addItem(newCert, setNewCert, certifications, setCertifications)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {certifications.map((cert, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
              <span className="text-sm text-foreground">{cert}</span>
              <button 
                onClick={() => removeItem(i, certifications, setCertifications)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-xs text-muted-foreground">No certifications added yet</p>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="command-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
            <FolderKanban className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Projects</h3>
            <p className="text-xs text-muted-foreground">Notable projects you've worked on</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a project..."
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(newProject, setNewProject, projects, setProjects)}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => addItem(newProject, setNewProject, projects, setProjects)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {projects.map((project, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-lg">
              <span className="text-sm text-foreground">{project}</span>
              <button 
                onClick={() => removeItem(i, projects, setProjects)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground">No projects added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheVault;
