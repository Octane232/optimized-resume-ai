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
  Tags,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Calendar,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Vault sub-components
import CareerStrengthMeter from './vault/CareerStrengthMeter';
import VaultInsightsTeaser from './vault/VaultInsightsTeaser';
import AchievementBadges from './vault/AchievementBadges';
import QuickActionsBar from './vault/QuickActionsBar';
import AISkillsExtractor from './vault/AISkillsExtractor';
import TrendingSkillBadge from './vault/TrendingSkillBadge';


interface TheVaultProps {
  onResumeChange?: (hasResume: boolean) => void;
  setActiveTab?: (tab: string) => void;
}

interface RichCertification {
  name: string;
  issuer?: string;
  dateEarned?: string;
  credentialLink?: string;
}

interface RichProject {
  name: string;
  description?: string;
  technologies?: string;
  liveLink?: string;
}

const TheVault = ({ onResumeChange, setActiveTab }: TheVaultProps) => {
  const [hasResume, setHasResume] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState<RichCertification[]>([]);
  const [newCert, setNewCert] = useState('');
  const [projects, setProjects] = useState<RichProject[]>([]);
  const [newProject, setNewProject] = useState('');
  const [resumeTags, setResumeTags] = useState<string[]>(['General']);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCert, setExpandedCert] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVaultData();
  }, []);

  // Auto-save when data changes (debounced)
  useEffect(() => {
    if (!loading && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveVaultData();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [skills, certifications, projects, resumeTags, hasUnsavedChanges]);

  const fetchVaultData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch resume data
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
        if (content?.skills) {
          setResumeSkills(content.skills);
        }
      }

      // Fetch vault data
      const { data: vaultData } = await supabase
        .from('user_vault')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (vaultData) {
        setSkills(vaultData.skills || []);
        setCertifications((vaultData.certifications as unknown as RichCertification[]) || []);
        setProjects((vaultData.projects as unknown as RichProject[]) || []);
        setResumeTags(vaultData.resume_tags || ['General']);
      } else {
        // Initialize with resume skills if no vault data exists
        if (resumes && resumes.length > 0) {
          const content = resumes[0].content as any;
          if (content?.skills) {
            setSkills(content.skills);
          }
        }
      }

    } catch (error) {
      console.error('Error fetching vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVaultData = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_vault')
        .upsert({
          user_id: user.id,
          skills,
          certifications: certifications as any,
          projects: projects as any,
          resume_tags: resumeTags
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving vault data:', error);
      toast({
        title: "Save failed",
        description: "Could not save your vault data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setHasUnsavedChanges(true);
    }
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
      setHasUnsavedChanges(true);
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };


  const handleNavigate = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const addCertification = () => {
    if (newCert.trim()) {
      setCertifications([...certifications, { name: newCert.trim() }]);
      setNewCert('');
      setHasUnsavedChanges(true);
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
    if (expandedCert === index) setExpandedCert(null);
    setHasUnsavedChanges(true);
  };

  const updateCertification = (index: number, updates: Partial<RichCertification>) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], ...updates };
    setCertifications(updated);
    setHasUnsavedChanges(true);
  };

  const addProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, { name: newProject.trim() }]);
      setNewProject('');
      setHasUnsavedChanges(true);
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
    if (expandedProject === index) setExpandedProject(null);
    setHasUnsavedChanges(true);
  };

  const updateProject = (index: number, updates: Partial<RichProject>) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], ...updates };
    setProjects(updated);
    setHasUnsavedChanges(true);
  };

  const completeness = calculateCompleteness();

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="h-24 bg-muted/50 rounded-2xl animate-pulse"></div>
        <div className="h-48 bg-muted/50 rounded-2xl animate-pulse"></div>
        <div className="h-32 bg-muted/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Save indicator */}
      {(hasUnsavedChanges || saving) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge variant="secondary" className="gap-2 px-3 py-1.5">
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Unsaved changes
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Career Profile Strength Meter (Enhanced) */}
      <CareerStrengthMeter 
        completeness={completeness}
        hasResume={hasResume}
        skillsCount={skills.length}
        certificationsCount={certifications.length}
        projectsCount={projects.length}
      />

      {/* Quick Actions Bar */}
      <QuickActionsBar 
        onNavigate={handleNavigate}
      />

      {/* Vault Insights */}
      <VaultInsightsTeaser />

      {/* Achievement Badges */}
      <AchievementBadges 
        hasResume={hasResume}
        skillsCount={skills.length}
        certificationsCount={certifications.length}
        projectsCount={projects.length}
      />

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
            <label>
              <Button variant="outline" size="sm" className="text-xs h-8 cursor-pointer" asChild>
                <span>Replace</span>
              </Button>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
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
                  onClick={() => {
                    setResumeTags(resumeTags.filter((_, idx) => idx !== i));
                    setHasUnsavedChanges(true);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills with AI Extractor and Trending Badges */}
      <div className="command-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">#</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Skills</h3>
              <p className="text-xs text-muted-foreground">Technical and soft skills</p>
            </div>
          </div>
        </div>

        {/* AI Skills Extractor */}
        <AISkillsExtractor 
          existingSkills={skills}
          resumeSkills={resumeSkills}
          onAddSkill={addSkill}
        />

        <div className="flex gap-2 my-3">
          <Input 
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(newSkill);
                setNewSkill('');
              }
            }}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={() => {
              addSkill(newSkill);
              setNewSkill('');
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <TrendingSkillBadge
              key={i}
              skill={skill}
              onRemove={() => removeSkill(i)}
            />
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Certifications with Rich Details */}
      <div className="command-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Certifications</h3>
              <p className="text-xs text-muted-foreground">Professional certifications</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a certification..."
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={addCertification}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {certifications.map((cert, i) => (
            <div key={i} className="bg-secondary/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-2.5">
                <span className="text-sm text-foreground">{cert.name}</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setExpandedCert(expandedCert === i ? null : i)}
                    className="p-1 hover:bg-background rounded"
                  >
                    {expandedCert === i ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button 
                    onClick={() => removeCertification(i)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Rich Details */}
              {expandedCert === i && (
                <div className="px-2.5 pb-2.5 space-y-2 border-t border-border/50 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Issuer</label>
                      <Input 
                        placeholder="e.g., AWS, Google"
                        value={cert.issuer || ''}
                        onChange={(e) => updateCertification(i, { issuer: e.target.value })}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Date Earned</label>
                      <Input 
                        placeholder="e.g., Jan 2024"
                        value={cert.dateEarned || ''}
                        onChange={(e) => updateCertification(i, { dateEarned: e.target.value })}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Credential Link</label>
                    <Input 
                      placeholder="https://..."
                      value={cert.credentialLink || ''}
                      onChange={(e) => updateCertification(i, { credentialLink: e.target.value })}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-xs text-muted-foreground">No certifications added yet</p>
          )}
        </div>
      </div>

      {/* Projects with Rich Details */}
      <div className="command-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Projects</h3>
              <p className="text-xs text-muted-foreground">Notable projects</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Add a project..."
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addProject()}
            className="h-9 text-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={addProject}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {projects.map((project, i) => (
            <div key={i} className="bg-secondary/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-2.5">
                <span className="text-sm text-foreground">{project.name}</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setExpandedProject(expandedProject === i ? null : i)}
                    className="p-1 hover:bg-background rounded"
                  >
                    {expandedProject === i ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button 
                    onClick={() => removeProject(i)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Rich Details */}
              {expandedProject === i && (
                <div className="px-2.5 pb-2.5 space-y-2 border-t border-border/50 pt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Description</label>
                    <Input 
                      placeholder="Brief description..."
                      value={project.description || ''}
                      onChange={(e) => updateProject(i, { description: e.target.value })}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Technologies</label>
                    <Input 
                      placeholder="React, Node.js, AWS..."
                      value={project.technologies || ''}
                      onChange={(e) => updateProject(i, { technologies: e.target.value })}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Live Link / GitHub</label>
                    <Input 
                      placeholder="https://..."
                      value={project.liveLink || ''}
                      onChange={(e) => updateProject(i, { liveLink: e.target.value })}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>
              )}
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
