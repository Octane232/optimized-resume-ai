import React from 'react';
import { ResumeData } from '@/types/resume';
import CanvaStyleRenderer from '@/components/templates/CanvaStyleRenderer';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ 
  resumeData, 
  templateId,
  templates 
}) => {
  const template = templates.find(t => t.id === templateId);

  // Build a renderer-compatible template from DB record
  const getTemplateForRenderer = () => {
    if (!template) return null;
    if (template.json_content) return template.json_content;

    const styles = template.styles || template.style_settings;
    if (styles) {
      return {
        layout: styles.layout || 'modern',
        theme: {
          primaryColor: styles.primary_color || 'hsl(220, 90%, 56%)',
          secondaryColor: styles.secondary_color || 'hsl(220, 15%, 25%)',
          accentColor: styles.accent_color || 'hsl(280, 100%, 70%)',
          backgroundColor: '#FFFFFF',
          textColor: '#1a1a1a',
          fontFamily: styles.font_family || 'Inter',
        },
        sections: [
          { id: 'header', type: 'header', style: { backgroundColor: 'gradient', padding: '48px', textAlign: 'center' } },
          { id: 'summary', type: 'summary' },
          { id: 'experience', type: 'experience' },
          { id: 'skills', type: 'skills', style: { columns: 3 } },
          { id: 'education', type: 'education' },
        ],
      };
    }
    return null;
  };

  const rendererTemplate = getTemplateForRenderer();

  // Default fallback template
  const defaultTemplate = {
    layout: 'modern',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter',
    },
    sections: [
      { id: 'header', type: 'header', style: { padding: '48px', backgroundColor: 'gradient', textAlign: 'center' } },
      { id: 'summary', type: 'summary', style: { padding: '24px', fontSize: '16px' } },
      { id: 'experience', type: 'experience', style: { padding: '24px', itemSpacing: '24px' } },
      { id: 'skills', type: 'skills', style: { padding: '24px', display: 'tags', columns: 3 } },
      { id: 'education', type: 'education', style: { padding: '24px', itemSpacing: '16px' } },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
      <CanvaStyleRenderer 
        template={rendererTemplate || defaultTemplate}
        data={resumeData}
        scale={1}
      />
    </div>
  );
};

export default ResumeTemplatePreview;