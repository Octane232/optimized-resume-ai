
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Edit, Trash2, Plus, Search, Filter, Grid, List, Star, Eye, Calendar, Clock } from 'lucide-react';

const MyResumes = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');

  const resumes = [
    { 
      id: 1, 
      name: 'Software Engineer Resume', 
      dateCreated: '2024-01-15',
      format: 'PDF',
      downloads: 5,
      lastModified: '2 hours ago',
      status: 'Published',
      template: 'Modern Professional',
      views: 24,
      rating: 4.8,
      size: '2.3 MB',
      tags: ['Tech', 'Senior', 'Full-stack']
    },
    { 
      id: 2, 
      name: 'Marketing Manager CV', 
      dateCreated: '2024-01-10',
      format: 'DOCX',
      downloads: 3,
      lastModified: '1 day ago',
      status: 'Draft',
      template: 'Creative Designer',
      views: 12,
      rating: 4.5,
      size: '1.8 MB',
      tags: ['Marketing', 'Management', 'Creative']
    },
    { 
      id: 3, 
      name: 'Data Analyst Resume', 
      dateCreated: '2024-01-05',
      format: 'PDF',
      downloads: 2,
      lastModified: '3 days ago',
      status: 'Published',
      template: 'Executive Summary',
      views: 31,
      rating: 4.9,
      size: '2.1 MB',
      tags: ['Data', 'Analytics', 'Python']
    },
  ];

  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ResumeCardGrid = ({ resume }) => (
    <Card className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-500">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {resume.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={`text-xs font-semibold ${
                  resume.status === 'Published' 
                    ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                }`}>
                  {resume.status}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {resume.template}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-950/30 rounded-lg">
              <Star className="w-3 h-3 text-amber-600" fill="currentColor" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{resume.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-3 h-3 text-blue-600" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{resume.views}</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Views</div>
          </div>
          
          <div className="text-center p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Download className="w-3 h-3 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{resume.downloads}</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Downloads</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">{resume.format}</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Format</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {resume.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created {resume.dateCreated}
            </span>
            <span className="font-medium">{resume.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last modified {resume.lastModified}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl transition-all duration-300">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 rounded-xl transition-all duration-300">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 rounded-xl transition-all duration-300">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
            My Resumes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Manage and organize your professional resume collection
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl h-12 px-8">
          <Plus className="w-5 h-5 mr-3" />
          Create New Resume
        </Button>
      </div>

      {/* Controls */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search resumes, tags, or templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumes Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredResumes.map((resume) => (
          <ResumeCardGrid key={resume.id} resume={resume} />
        ))}
      </div>

      {filteredResumes.length === 0 && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No resumes found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first professional resume'}
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Resume
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyResumes;
