
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Edit, Trash2, Plus } from 'lucide-react';

const MyResumes = () => {
  const resumes = [
    { 
      id: 1, 
      name: 'Software Engineer Resume', 
      dateCreated: '2024-01-15',
      format: 'PDF',
      downloads: 5,
      lastModified: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Marketing Manager CV', 
      dateCreated: '2024-01-10',
      format: 'DOCX',
      downloads: 3,
      lastModified: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Data Analyst Resume', 
      dateCreated: '2024-01-05',
      format: 'PDF',
      downloads: 2,
      lastModified: '3 days ago'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Resumes</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{resume.name}</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Created {resume.dateCreated}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Format:</span>
                  <span className="font-medium">{resume.format}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Downloads:</span>
                  <span className="font-medium">{resume.downloads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Last Modified:</span>
                  <span className="font-medium">{resume.lastModified}</span>
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyResumes;
