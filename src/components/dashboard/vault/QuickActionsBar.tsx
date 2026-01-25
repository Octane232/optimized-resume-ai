import React, { useState } from 'react';
import { FileText, Briefcase, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuickActionsBarProps {
  onNavigate: (tab: string) => void;
}

const QuickActionsBar = ({ onNavigate }: QuickActionsBarProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSummary = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch vault data
      const { data: vault } = await supabase
        .from('user_vault')
        .select('skills, certifications, projects')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch resume data
      const { data: resumes } = await supabase
        .from('resumes')
        .select('title, content')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const resume = resumes?.[0];
      const content = resume?.content as any;

      // Build summary text
      const summaryLines = [
        '=== CAREER SUMMARY ===',
        '',
        `Name: ${content?.personalInfo?.fullName || 'Not provided'}`,
        `Email: ${content?.personalInfo?.email || 'Not provided'}`,
        '',
        '--- SKILLS ---',
        (vault?.skills || []).join(', ') || 'No skills added',
        '',
        '--- CERTIFICATIONS ---',
        ...(vault?.certifications as any[] || []).map((c: any) => 
          `• ${c.name}${c.issuer ? ` (${c.issuer})` : ''}${c.dateEarned ? ` - ${c.dateEarned}` : ''}`
        ),
        '',
        '--- PROJECTS ---',
        ...(vault?.projects as any[] || []).map((p: any) => 
          `• ${p.name}${p.technologies ? ` | Tech: ${p.technologies}` : ''}`
        ),
        '',
        `Generated: ${new Date().toLocaleDateString()}`
      ];

      // Download as text file
      const blob = new Blob([summaryLines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'career-summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Summary exported",
        description: "Your career summary has been downloaded."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Could not export your summary.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5"
              onClick={() => onNavigate('resume-engine')}
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Resume
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a tailored resume from your vault</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5"
              onClick={() => onNavigate('scout')}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Match with Jobs
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Find jobs that match your profile</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5"
              onClick={handleExportSummary}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Summary
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your career summary</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default QuickActionsBar;
