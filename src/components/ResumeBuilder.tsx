import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Wand2, Download, Save, Eye, Palette, Sparkles, Plus, X } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import AIFeatures from './AIFeatures';
import ClassicTemplate from './templates/ClassicTemplate';

const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [activeTab, setActiveTab] = useState('basic');
  const [aiEnabled, setAiEnabled] = useState(true);

  // Sample experience data
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      responsibilities: ['']
    }
  ]);

  // Sample skills data
  const [skills, setSkills] = useState(['']);
  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setExperiences([...experiences, {
      id: experiences.length + 1,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      responsibilities: ['']
    }]);
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning, professional resumes in minutes with our AI-assisted editor
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI-Powered
            </Badge>
            <Badge variant="outline">Real-time Preview</Badge>
            <Badge variant="outline">ATS Friendly</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - AI Features & Editor */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Features Card */}
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    AI Assistant
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                    />
                    <Label className="text-sm">{aiEnabled ? 'Enabled' : 'Disabled'}</Label>
                  </div>
                </div>
                <CardDescription>
                  Get AI suggestions to improve your resume content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIFeatures resumeData={resumeData} />
              </CardContent>
            </Card>

            {/* Resume Editor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Resume Editor</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Auto-save enabled
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic" className="text-xs md:text-sm">Basic Info</TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs md:text-sm">Experience</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs md:text-sm">Skills</TabsTrigger>
                    <TabsTrigger value="extras" className="text-xs md:text-sm">Extras</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name"
                        placeholder="John Doe"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title *</Label>
                      <Input 
                        id="title"
                        placeholder="Software Engineer"
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          placeholder="(555) 123-4567"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        placeholder="San Francisco, CA"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea 
                        id="summary"
                        placeholder="Experienced software engineer with 5+ years in..."
                        rows={3}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-4 mt-4">
                    {experiences.map((exp, index) => (
                      <Card key={exp.id} className="relative">
                        <CardContent className="pt-6">
                          {experiences.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 h-6 w-6"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input placeholder="Senior Developer" />
                              </div>
                              <div className="space-y-2">
                                <Label>Company</Label>
                                <Input placeholder="Tech Company Inc." />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input type="month" />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input type="month" placeholder="Present" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Responsibilities</Label>
                              <Textarea 
                                placeholder="• Led development of...&#10;• Managed team of...&#10;• Improved performance by..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addExperience} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Experience
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Skills & Technologies</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill..."
                          className="flex-1"
                        />
                        <Button onClick={addSkill} variant="secondary">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        skill && (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button onClick={() => removeSkill(index)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="extras" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" /> Add Project
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" /> Add Education
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" /> Add Certification
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" /> Add Language
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={activeTemplate} onValueChange={setActiveTemplate}>
                      <SelectTrigger className="w-[140px]">
                        <Palette className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resume Preview Container */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white min-h-[500px]">
                    <div className="transform scale-75 origin-top w-[133%] h-[133%] relative -left-16 -top-10">
                      <ClassicTemplate data={{
                        contact: {
                          name: "John Smith",
                          title: "Software Engineer",
                          email: "john@example.com",
                          phone: "(555) 123-4567",
                          location: "San Francisco, CA"
                        },
                        summary: "Experienced software engineer with expertise in full-stack development.",
                        skills: ["React", "TypeScript", "Node.js"],
                        experience: [{
                          title: "Senior Developer",
                          company: "Tech Corp",
                          startDate: "2020",
                          endDate: "Present",
                          responsibilities: ["Led development team", "Built scalable solutions"]
                        }],
                        education: [{
                          degree: "B.S. Computer Science",
                          institution: "University",
                          startYear: "2012",
                          endYear: "2016"
                        }]
                      }} />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-12 gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="h-12 gap-2">
                      <Save className="h-4 w-4" />
                      Save & Export
                    </Button>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">2</div>
                      <div>Sections</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">5</div>
                      <div>Skills</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">1</div>
                      <div>Experience</div>
                    </div>
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
