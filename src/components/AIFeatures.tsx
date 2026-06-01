import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/types/resume';

interface AIFeaturesProps {
  resumeData: ResumeData | null;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ resumeData }) => {
  const [activeFeature, setActiveFeature] = useState<string>('job-matcher');
  const [jobDescription, setJobDescription] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [achievementOutput, setAchievementOutput] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');

  const features = [
    {
      id: 'job-search',
      title: 'AI Job Search',
      icon: '🎯',
      description: 'Automatically find and apply to jobs that match your profile',
      badge: 'Auto Apply'
    },
    {
      id: 'job-matcher',
      title: 'Job Description Matcher',
      icon: '🔍',
      description: 'Paste a job description to see how well your resume matches',
      badge: 'ATS Optimization'
    },
    {
      id: 'achievement-rewriter',
      title: 'Achievement Rewriter',
      icon: '✨',
      description: 'Transform basic job duties into powerful achievements',
      badge: 'Impact Boost'
    },
    {
      id: 'linkedin-optimizer',
      title: 'LinkedIn Optimizer',
      icon: '💼',
      description: 'Generate optimized LinkedIn headline and summary',
      badge: 'Personal Brand'
    },
    {
      id: 'skill-analyzer',
      title: 'Skill Gap Analyzer',
      icon: '📊',
      description: 'Identify missing skills and get learning recommendations',
      badge: 'Career Growth'
    },
    {
      id: 'interview-prep',
      title: 'Interview Prep',
      icon: '🎤',
      description: 'Generate likely interview questions and suggested answers',
      badge: 'Interview Ready'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, featureId: string) => {
    // Handle Enter or Space key to activate
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveFeature(featureId);
    }
  };

  const handleRewriteAchievement = () => {
    setAchievementOutput(`✨ AI Suggestion: "${achievementInput}" → "Increased team productivity by 30% through implementation of automated workflows"`);
  };

  const currentFeature = features.find(f => f.id === activeFeature);

  return (
    <div className="space-y-6">
      {/* AI Job Search Feature */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              AI Job Search Engine
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">New</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Our AI continuously searches for jobs that match your profile and applies automatically.
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-green-600">500+</div>
              <div className="text-gray-600">Companies Monitored</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-green-600">24/7</div>
              <div className="text-gray-600">Job Scanning</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="job-role">Job Preferences</label>
            <select id="job-role" className="w-full p-2 border rounded-lg text-sm">
              <option>Software Engineer</option>
              <option>Product Manager</option>
              <option>Data Scientist</option>
              <option>Marketing Manager</option>
            </select>
            <select className="w-full p-2 border rounded-lg text-sm" aria-label="Location">
              <option>Remote</option>
              <option>San Francisco, CA</option>
              <option>New York, NY</option>
              <option>Austin, TX</option>
            </select>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            Start Automatic Job Search
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            ✅ We'll find jobs, match them to your profile, and apply for you
          </p>
        </CardContent>
      </Card>

      {/* Other AI Features - Using proper button elements instead of divs */}
      <Card>
        <CardHeader>
          <CardTitle>AI Career Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.slice(1).map((feature) => (
            <button
              key={feature.id}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeFeature === feature.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFeatureClick(feature.id)}
              onKeyDown={(e) => handleKeyDown(e, feature.id)}
              tabIndex={0}
              role="tab"
              aria-selected={activeFeature === feature.id}
              aria-label={`Activate ${feature.title}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2" aria-hidden="true">{feature.icon}</span>
                  <span className="font-medium text-sm">{feature.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Active Feature Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentFeature?.title ?? 'Select a feature'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeFeature === 'job-matcher' && (
            <div className="space-y-3">
              <label htmlFor="job-description" className="block text-sm font-medium">
                Job Description
              </label>
              <textarea
                id="job-description"
                className="w-full p-3 border rounded-lg text-sm"
                rows={4}
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button className="w-full" disabled={!jobDescription.trim()}>
                Analyze Match
              </Button>
              {resumeData && (
                <p className="text-xs text-gray-500">
                  Using resume: {resumeData?.contact?.name || 'Your profile'}
                </p>
              )}
            </div>
          )}

          {activeFeature === 'achievement-rewriter' && (
            <div className="space-y-3">
              <label htmlFor="achievement-input" className="block text-sm font-medium">
                Your Achievement or Duty
              </label>
              <input
                id="achievement-input"
                className="w-full p-2 border rounded-lg text-sm"
                placeholder="e.g., Managed social media accounts"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleRewriteAchievement}
                disabled={!achievementInput.trim()}
              >
                Rewrite Achievement
              </Button>
              {achievementOutput && (
                <div className="p-3 bg-gray-50 rounded text-sm">
                  {achievementOutput}
                </div>
              )}
            </div>
          )}

          {activeFeature === 'linkedin-optimizer' && (
            <div className="space-y-3">
              <Button className="w-full">Generate LinkedIn Content</Button>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Headline:</strong> "Senior Software Engineer | React & Node.js Expert | Building Scalable Web Applications"
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <strong>Summary:</strong> "Passionate software engineer with 5+ years of experience..."
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'skill-analyzer' && (
            <div className="space-y-3">
              <label htmlFor="target-job" className="block text-sm font-medium">
                Target Job Description
              </label>
              <textarea
                id="target-job"
                className="w-full p-3 border rounded-lg text-sm"
                rows={3}
                placeholder="Paste target job description..."
                value={targetJobDescription}
                onChange={(e) => setTargetJobDescription(e.target.value)}
              />
              <Button className="w-full" disabled={!targetJobDescription.trim()}>
                Analyze Skills Gap
              </Button>
            </div>
          )}

          {activeFeature === 'interview-prep' && (
            <div className="space-y-3">
              <label htmlFor="job-title" className="block text-sm font-medium">
                Job Title
              </label>
              <input
                id="job-title"
                className="w-full p-2 border rounded-lg text-sm"
                placeholder="Job title (e.g., Senior Software Engineer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Button className="w-full" disabled={!jobTitle.trim()}>
                Generate Interview Questions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeatures;
