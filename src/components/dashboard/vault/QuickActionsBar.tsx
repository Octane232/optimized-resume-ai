import React from 'react';
import { FileText, Briefcase, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuickActionsBarProps {
  onNavigate: (tab: string) => void;
}

const QuickActionsBar = ({ onNavigate }: QuickActionsBarProps) => {
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
            >
              <Download className="w-3.5 h-3.5" />
              Export Summary
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your career summary PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default QuickActionsBar;
