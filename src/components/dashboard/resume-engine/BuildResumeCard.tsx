import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ClassicTemplate2 from '@/components/templates/ClassicTemplate2';
import { classicResueSample } from '@/data/sampleResumes';

interface TemplateOption {
  id: string;
  name: string;
  component: React.FC<{ data: any; scale?: number }>;
  description: string;
}

const classicTemplates: TemplateOption[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    component: ClassicTemplate,
    description: 'Traditional and timeless design'
  },
  {
    id: 'classic2',
    name: 'Classic Elegant',
    component: ClassicTemplate2,
    description: 'Refined with golden accents'
  }
];

const BuildResumeCard = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleStartBuilding = (templateId: string) => {
    navigate(`/editor/new?template=${templateId}`);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Build Your Resume
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a classic template and start building your professional resume
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-4">
          {classicTemplates.map((template) => {
            const TemplateComponent = template.component;
            const isSelected = selectedTemplate === template.id;
            
            return (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden
                  ${isSelected 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Template Preview */}
                <div className="h-48 overflow-hidden bg-white">
                  <div className="transform scale-[0.25] origin-top-left w-[400%]">
                    <TemplateComponent data={classicResueSample} scale={1} />
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-3 bg-background border-t">
                  <h4 className="font-medium text-sm text-foreground">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Selected
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => selectedTemplate && handleStartBuilding(selectedTemplate)}
          disabled={!selectedTemplate}
          className="w-full gap-2"
        >
          Start Building
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuildResumeCard;
