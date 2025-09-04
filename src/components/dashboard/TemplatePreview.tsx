import React, { useEffect, useRef, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download, X } from 'lucide-react';

interface TemplatePreviewProps {
  template: {
    id?: string;
    name?: string;
    html_content?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = memo(({ 
  template, 
  isOpen, 
  onClose, 
  onUseTemplate 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const writeToIframe = useCallback(() => {
    if (!iframeRef.current || !template?.html_content) return;
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDoc) return;
      
      iframeDoc.open();
      iframeDoc.write(template.html_content);
      iframeDoc.close();
    } catch (error) {
      console.error('Error writing to iframe:', error);
    }
  }, [template?.html_content]);

  useEffect(() => {
    if (isOpen && template?.html_content) {
      // Use requestAnimationFrame to ensure smooth rendering
      requestAnimationFrame(() => {
        writeToIframe();
      });
    }
  }, [isOpen, template, writeToIframe]);

  if (!isOpen || !template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name || 'Template Preview'}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onUseTemplate}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Use Template
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto max-w-4xl">
            <iframe
              ref={iframeRef}
              className="w-full h-[calc(90vh-100px)] border-0 rounded-lg"
              title="Resume Template Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;