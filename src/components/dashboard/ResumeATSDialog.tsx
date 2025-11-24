import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ATSScoreCard } from "./ATSScoreCard";

interface ResumeATSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  resumeContent: any;
  resumeTitle: string;
}

export const ResumeATSDialog = ({ 
  open, 
  onOpenChange, 
  resumeId, 
  resumeContent,
  resumeTitle 
}: ResumeATSDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ATS Score - {resumeTitle}</DialogTitle>
        </DialogHeader>
        <ATSScoreCard resumeId={resumeId} resumeContent={resumeContent} />
      </DialogContent>
    </Dialog>
  );
};