
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Edit, Share } from 'lucide-react';

interface ResumePreviewProps {
  resumeData?: any;
  template?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, template = 'modern' }) => {
  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
      <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Live Preview</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="aspect-[8.5/11] p-8 overflow-hidden">
            {/* Resume Preview Content */}
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">John Doe</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Software Engineer</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  john.doe@email.com | (555) 123-4567 | LinkedIn | Portfolio
                </p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-700">
                  Professional Summary
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Experienced software engineer with 5+ years developing scalable web applications...
                </p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-700">
                  Experience
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Senior Software Engineer</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tech Company | 2021 - Present</p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside mt-1">
                      <li>Led development of microservices architecture</li>
                      <li>Improved application performance by 40%</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-700">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Live preview updates as you edit your resume
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
