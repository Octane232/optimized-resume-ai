
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeData, JobDescription, ResumeAnalysis } from '@/types/resume';

interface AIFeaturesProps {
  resumeData?: ResumeData;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = async () => {
    if (!jobDescription || !resumeData) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: ResumeAnalysis = {
        matchScore: 78,
        missingKeywords: ['project management', 'agile', 'stakeholder management'],
        suggestions: [
          'Add quantifiable achievements to your experience section',
          'Include more industry-specific keywords',
          'Highlight leadership experience more prominently'
        ],
        strengthAreas: ['Technical skills', 'Education background', 'Project experience'],
        improvementAreas: ['Soft skills', 'Industry keywords', 'Achievement metrics']
      };
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const rewriteAchievement = (text: string) => {
    // Mock AI achievement rewriter
    const improvements = {
      'Managed social media': 'Grew Instagram audience by 43% in 4 months using targeted content strategies',
      'Led team': 'Successfully led cross-functional team of 8 members, delivering projects 20% ahead of schedule',
      'Improved sales': 'Increased quarterly sales by 35% through implementation of data-driven customer acquisition strategies'
    };
    return improvements[text as keyof typeof improvements] || text + ' (AI-enhanced version)';
  };

  return (
    <div className="space-y-6">
      {/* Job Description Matcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Job Description Matcher
            <Badge variant="outline">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="Paste the job description here to get AI-powered optimization suggestions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button 
              onClick={analyzeResume} 
              disabled={!jobDescription || !resumeData || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume Match'}
            </Button>
            
            {analysis && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Match Score:</span>
                  <Badge variant={analysis.matchScore > 70 ? "default" : "destructive"}>
                    {analysis.matchScore}%
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Missing Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">AI Suggestions:</h4>
                  <ul className="space-y-1 text-sm">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Achievement Rewriter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 AI Achievement Rewriter
            <Badge variant="outline">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Transform generic job descriptions into quantifiable achievements that stand out to recruiters.
            </p>
            <div className="grid gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Before:</div>
                <div className="text-sm">"Managed social media"</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">After (AI-Enhanced):</div>
                <div className="text-sm font-medium">"Grew Instagram audience by 43% in 4 months using targeted content strategies"</div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Try Achievement Rewriter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skill Gap Analyzer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛠 Skill Gap Analyzer
            <Badge variant="outline">Career Growth</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Discover skills you're missing for your target role and get personalized learning recommendations.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm">Python Programming</span>
                <Badge variant="destructive" className="text-xs">Missing</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm">Data Analysis</span>
                <Badge variant="outline" className="text-xs">Beginner</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm">Project Management</span>
                <Badge variant="default" className="text-xs">Advanced</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Analyze Skill Gaps
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interview Prep Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 AI Interview Prep
            <Badge variant="outline">Interview Ready</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get personalized interview questions and suggested answers based on your resume and target role.
            </p>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">Sample Question:</div>
              <div className="text-sm text-blue-700">
                "Tell me about a time when you had to manage a difficult project with tight deadlines."
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Generate Interview Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn Optimizer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔗 LinkedIn Profile Optimizer
            <Badge variant="outline">Personal Brand</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Auto-generate optimized LinkedIn headline and summary that matches your resume.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-linkedin-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Suggested Headline:</div>
                <div className="text-sm text-blue-700">
                  "Senior Marketing Manager | Digital Strategy Expert | Driving 40% Growth in Lead Generation"
                </div>
              </div>
              <div className="p-3 bg-linkedin-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Summary Preview:</div>
                <div className="text-sm text-blue-700">
                  "Results-driven marketing professional with 8+ years of experience developing and executing integrated marketing campaigns..."
                </div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Optimize LinkedIn Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeatures;
