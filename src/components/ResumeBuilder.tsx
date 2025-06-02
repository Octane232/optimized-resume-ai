
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeData } from '@/types/resume';
import AIFeatures from './AIFeatures';
import ClassicTemplate from './templates/ClassicTemplate';

const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTemplate, setActiveTemplate] = useState('classic');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-gray-600">
            Create a professional resume in minutes with AI assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - AI Features */}
          <div className="lg:col-span-1">
            <AIFeatures resumeData={resumeData} />
          </div>

          {/* Center Panel - Resume Editor */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resume Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="extras">Extras</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input 
                        className="w-full p-2 border rounded-lg"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Job Title</label>
                      <input 
                        className="w-full p-2 border rounded-lg"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input 
                        className="w-full p-2 border rounded-lg"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input 
                        className="w-full p-2 border rounded-lg"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-4 mt-4">
                    <Button className="w-full" variant="outline">
                      + Add Experience
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="space-y-4 mt-4">
                    <Button className="w-full" variant="outline">
                      + Add Skill
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="extras" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        + Add Project
                      </Button>
                      <Button className="w-full" variant="outline">
                        + Add Certification
                      </Button>
                      <Button className="w-full" variant="outline">
                        + Add Language
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={activeTemplate}
                    onChange={(e) => setActiveTemplate(e.target.value)}
                  >
                    <option value="classic">Classic Template</option>
                    <option value="modern">Modern Template</option>
                    <option value="creative">Creative Template</option>
                  </select>
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="transform scale-50 origin-top">
                      {/* Resume preview would go here */}
                      <div className="text-center text-gray-500 py-8">
                        Resume preview will appear here
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">
                      Download PDF
                    </Button>
                    <Button className="w-full" variant="outline">
                      Save & Continue Later
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
