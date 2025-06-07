
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Clock, Target, CheckCircle, Play, Sparkles, Star, Award, Users } from 'lucide-react';

const InterviewPrep = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General Tips', icon: Brain, color: 'from-blue-500 to-blue-600' },
    { id: 'behavioral', label: 'Behavioral', icon: Users, color: 'from-purple-500 to-purple-600' },
    { id: 'technical', label: 'Technical', icon: Target, color: 'from-emerald-500 to-emerald-600' },
    { id: 'questions', label: 'Common Questions', icon: MessageCircle, color: 'from-orange-500 to-orange-600' }
  ];

  const interviewTips = {
    general: [
      {
        title: "Research the Company Thoroughly",
        description: "Know their mission, values, recent news, and competitors. This shows genuine interest.",
        priority: "High",
        timeToRead: "3 min"
      },
      {
        title: "Prepare Your STAR Stories",
        description: "Have 5-7 stories ready using Situation, Task, Action, Result format for behavioral questions.",
        priority: "High",
        timeToRead: "5 min"
      },
      {
        title: "Practice Your Elevator Pitch",
        description: "Craft a compelling 30-60 second summary of your background and career goals.",
        priority: "Medium",
        timeToRead: "2 min"
      },
      {
        title: "Prepare Thoughtful Questions",
        description: "Ask about team dynamics, growth opportunities, and company culture to show engagement.",
        priority: "High",
        timeToRead: "4 min"
      }
    ],
    behavioral: [
      {
        title: "Tell me about a time you faced a challenge",
        description: "Focus on problem-solving skills and resilience. Show how you overcame obstacles.",
        priority: "High",
        timeToRead: "3 min"
      },
      {
        title: "Describe a time you worked in a team",
        description: "Highlight collaboration, communication, and your specific contribution to team success.",
        priority: "High",
        timeToRead: "3 min"
      },
      {
        title: "Give an example of when you showed leadership",
        description: "Leadership isn't just about titles. Show initiative, influence, and positive outcomes.",
        priority: "Medium",
        timeToRead: "4 min"
      }
    ],
    technical: [
      {
        title: "System Design Fundamentals",
        description: "Understand scalability, load balancing, databases, and caching for senior roles.",
        priority: "High",
        timeToRead: "10 min"
      },
      {
        title: "Code Review Best Practices",
        description: "Be ready to review code samples and explain your thought process clearly.",
        priority: "Medium",
        timeToRead: "5 min"
      },
      {
        title: "Problem-Solving Approach",
        description: "Think out loud, ask clarifying questions, and explain your reasoning step by step.",
        priority: "High",
        timeToRead: "3 min"
      }
    ],
    questions: [
      {
        title: "Why do you want to work here?",
        description: "Connect your values and goals with the company's mission and opportunities.",
        priority: "High",
        timeToRead: "2 min"
      },
      {
        title: "What are your strengths and weaknesses?",
        description: "Be honest about weaknesses but show how you're actively working to improve them.",
        priority: "High",
        timeToRead: "3 min"
      },
      {
        title: "Where do you see yourself in 5 years?",
        description: "Show ambition while aligning with potential career paths at their company.",
        priority: "Medium",
        timeToRead: "2 min"
      }
    ]
  };

  const mockInterviews = [
    {
      title: "Software Engineer - Google Style",
      duration: "45 min",
      difficulty: "Advanced",
      topics: ["Algorithms", "System Design", "Behavioral"]
    },
    {
      title: "Product Manager - Meta Style", 
      duration: "60 min",
      difficulty: "Intermediate",
      topics: ["Product Sense", "Analytical", "Leadership"]
    },
    {
      title: "General Behavioral Interview",
      duration: "30 min", 
      difficulty: "Beginner",
      topics: ["STAR Method", "Culture Fit", "Motivation"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI-Powered Interview Preparation</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Master Your Next Interview
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Get personalized interview preparation based on your resume and target role. Practice with AI and boost your confidence.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                selectedCategory === category.id 
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl` 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interview Tips */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 bg-gradient-to-r ${categories.find(c => c.id === selectedCategory)?.color} rounded-xl`}>
                  {React.createElement(categories.find(c => c.id === selectedCategory)?.icon || Brain, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {categories.find(c => c.id === selectedCategory)?.label} Tips
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                    AI-generated advice tailored to your experience
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {interviewTips[selectedCategory]?.map((tip, index) => (
                  <div key={index} className="group p-6 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tip.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`text-xs ${
                          tip.priority === 'High' 
                            ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                            : 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400'
                        }`}>
                          {tip.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                          <Clock className="w-3 h-3 mr-1" />
                          {tip.timeToRead}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Interviews */}
        <div className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mock Interviews</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Practice with AI interviewer</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInterviews.map((interview, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{interview.title}</h4>
                    <Badge variant="secondary" className={`text-xs border-0 ${
                      interview.difficulty === 'Advanced' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : interview.difficulty === 'Intermediate'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {interview.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {interview.duration}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {interview.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold">
                    <Play className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Stats */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Your Progress</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Interview preparation stats</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">85%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Preparation Score</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">12</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Tips Completed</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">3</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Mock Interviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
