import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AIResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: any;
}

const AIResumeDialog: React.FC<AIResumeDialogProps> = ({ open, onOpenChange, selectedTemplate }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetRole: '',
    experience: '',
    education: '',
    skills: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.targetRole || !formData.skills) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in at least name, target role, and skills',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        }
      });

      if (error) throw error;

      if (!data?.data) {
        throw new Error('No resume data generated');
      }

      // Get user data
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Fetch actual template from database matching AI recommendation
      const recommendedCategory = data.recommendedTemplate || 'modern';
      const { data: templates, error: templateError } = await supabase
        .from('resume_templates')
        .select('id, name, category')
        .eq('category', recommendedCategory)
        .limit(1);

      if (templateError) {
        console.error('Error fetching template:', templateError);
      }

      // Use the fetched template ID or fallback to the category name
      const templateId = templates?.[0]?.id || selectedTemplate?.id || null;

      const { data: resumeData, error: saveError } = await supabase
        .from('resumes')
        .insert({
          user_id: userData.user.id,
          title: `${formData.targetRole} Resume`,
          content: data.data,
          template_name: templateId
        })
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: 'Success!',
        description: `Your AI-powered resume has been created with a ${recommendedCategory} template`,
      });

      onOpenChange(false);
      navigate(`/editor/${resumeData.id}`);
    } catch (error: any) {
      console.error('Error generating resume:', error);
      
      let errorMessage = 'Failed to generate resume. Please try again.';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message?.includes('Payment required')) {
        errorMessage = 'AI service requires payment. Please add credits to your account.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI-Powered Resume Generation
          </DialogTitle>
          <DialogDescription>
            Tell us about yourself and let AI create a professional resume tailored to your target role
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role *</Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="e.g., 5 years in software development"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education Background</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="e.g., BS in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated) *</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              placeholder="JavaScript, React, Node.js, Python, AWS, Docker"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> The more details you provide, the better AI can tailor your resume to your target role.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIResumeDialog;