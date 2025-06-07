
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Clock, Target, CheckCircle, Play, Sparkles, Star, Award, Users, Mic, MicOff, RotateCcw, ArrowRight } from 'lucide-react';

const InterviewPrep = () => {
  const [selectedCategory, setSelectedCategory] = useState('ai-interview');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const categories = [
    { id: 'ai-interview', label: 'AI Interview', icon: Brain, color: 'from-blue-500 to-blue-600' },
    { id: 'tips', label: 'Interview Tips', icon: Target, color: 'from-emerald-500 to-emerald-600' },
    { id: 'practice', label: 'Practice Sessions', icon: Play, color: 'from-purple-500 to-purple-600' },
    { id: 'analytics', label: 'Performance', icon: Award, color: 'from-orange-500 to-orange-600' }
  ];

  // Mock AI-generated questions based on position
  const generateQuestions = (position) => {
    const questionSets = {
      'software engineer': [
        "Tell me about a challenging technical problem you've solved recently.",
        "How do you approach debugging complex systems?",
        "Describe your experience with agile development methodologies.",
        "What's your strategy for staying updated with new technologies?"
      ],
      'product manager': [
        "How do you prioritize features when resources are limited?",
        "Describe a time when you had to make a difficult product decision.",
        "How do you gather and analyze user feedback?",
        "What's your approach to working with cross-functional teams?"
      ],
      'data scientist': [
        "Walk me through your approach to a machine learning project.",
        "How do you handle missing or dirty data?",
        "Explain a complex statistical concept to a non-technical audience.",
        "What's your experience with A/B testing and experimental design?"
      ]
    };
    
    return questionSets[position.toLowerCase()] || [
      "Tell me about yourself and your career goals.",
      "What are your greatest strengths and weaknesses?",
      "Why are you interested in this position?",
      "Where do you see yourself in five years?"
    ];
  };

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const startInterview = () => {
    const questions = generateQuestions(desiredPosition);
    setInterviewQuestions(questions);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const submitAnswer = () => {
    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);
    setUserAnswer('');
    
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  // Mock AI rating system
  const getAnswerRating = (answer, questionIndex) => {
    // Simulate AI rating based on answer length and keywords
    const baseScore = Math.min(10, Math.max(1, answer.length / 20));
    const keywords = ['experience', 'project', 'team', 'challenge', 'solution', 'result'];
    const keywordBonus = keywords.filter(keyword => 
      answer.toLowerCase().includes(keyword)
    ).length * 0.5;
    
    return Math.min(10, Math.round((baseScore + keywordBonus) * 10) / 10);
  };

  const getOverallScore = () => {
    if (answers.length === 0) return 0;
    const totalScore = answers.reduce((sum, answer, index) => 
      sum + getAnswerRating(answer, index), 0
    );
    return Math.round((totalScore / answers.length) * 10) / 10;
  };

  const interviewTips = [
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
          Get personalized interview questions generated by AI based on your target position. Practice and receive detailed feedback.
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

      {selectedCategory === 'ai-interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Interview Setup */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
              <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Interview Simulator</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                      Practice with personalized questions
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!interviewQuestions.length && !showResults ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        What position are you interviewing for?
                      </label>
                      <Input
                        placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                        value={desiredPosition}
                        onChange={(e) => setDesiredPosition(e.target.value)}
                        className="text-base p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50"
                      />
                    </div>
                    
                    <Button 
                      onClick={startInterview}
                      disabled={!desiredPosition.trim()}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Brain className="w-5 h-5 mr-3" />
                      Generate AI Interview Questions
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                ) : showResults ? (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Interview Complete!</h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400">Overall Score: <span className="font-bold text-emerald-600">{getOverallScore()}/10</span></p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Detailed Feedback</h4>
                      {answers.map((answer, index) => {
                        const rating = getAnswerRating(answer, index);
                        return (
                          <div key={index} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-slate-900 dark:text-white">Question {index + 1}</p>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                                <span className="font-bold text-slate-900 dark:text-white">{rating}/10</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{interviewQuestions[index]}</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-700/30 p-3 rounded-lg">{answer}</p>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <strong>AI Feedback:</strong> {
                                rating >= 8 ? "Excellent answer with good structure and examples." :
                                rating >= 6 ? "Good answer, could benefit from more specific examples." :
                                rating >= 4 ? "Adequate answer, needs more detail and structure." :
                                "Consider providing more context and specific examples."
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button 
                      onClick={() => {
                        setInterviewQuestions([]);
                        setDesiredPosition('');
                        setShowResults(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start New Interview
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Question {currentQuestion + 1} of {interviewQuestions.length}
                      </h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {desiredPosition}
                      </Badge>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        {interviewQuestions[currentQuestion]}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                          className={`rounded-xl ${isRecording ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          {isRecording ? 'Stop Recording' : 'Voice Answer'}
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder="Type your answer here... Try to be specific and use examples."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="min-h-32 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl"
                      />
                      
                      <Button 
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim()}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
                      >
                        {currentQuestion < interviewQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Stats */}
          <div className="space-y-6">
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
                    <div className="text-xs text-slate-600 dark:text-slate-400">Sessions Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">8.2</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedCategory === 'tips' && (
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Interview Tips</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                  AI-generated advice tailored to your experience
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {interviewTips.map((tip, index) => (
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
      )}
    </div>
  );
};

export default InterviewPrep;
