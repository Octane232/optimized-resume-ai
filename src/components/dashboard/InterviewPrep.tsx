
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Clock, Target, CheckCircle, Sparkles, Star, Award, Users, RotateCcw, ArrowRight, Loader2, CheckCircle2, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useCredits } from '@/contexts/CreditsContext';

const InterviewPrep = () => {
  const { toast } = useToast();
  const { balance, spendCredit } = useCredits();
  const [selectedCategory, setSelectedCategory] = useState('ai-interview');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load session history from database
  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      if (sessions) {
        // Load answers for each session
        const sessionsWithAnswers = await Promise.all(
          sessions.map(async (session) => {
            const { data: answers, error: answersError } = await supabase
              .from('interview_answers')
              .select('*')
              .eq('session_id', session.id)
              .order('created_at', { ascending: true });

            if (answersError) throw answersError;

            return {
              id: session.id,
              date: session.completed_at,
              position: session.position,
              overallScore: Number(session.overall_score),
              answers: answers?.map(a => ({
                question: a.question,
                answer: a.answer,
                feedback: {
                  score: Number(a.score),
                  ...(typeof a.feedback === 'object' && a.feedback ? a.feedback : {})
                }
              })) || []
            };
          })
        );

        setSessionHistory(sessionsWithAnswers);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
      toast({
        title: "Error",
        description: "Failed to load interview history",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const categories = [
    { id: 'ai-interview', label: 'AI Interview', icon: Brain, color: 'from-blue-500 to-blue-600' },
    { id: 'tips', label: 'Interview Tips', icon: Target, color: 'from-emerald-500 to-emerald-600' },
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
  const [answers, setAnswers] = useState<any[]>([]);

  const startInterview = async () => {
    // Spend 1 credit for a mock interview session
    const credited = await spendCredit('interview_prep', `Mock interview for ${desiredPosition}`);
    if (!credited) {
      toast({
        title: "No credits remaining",
        description: "You need 1 credit to start a mock interview session.",
        variant: "destructive"
      });
      return;
    }
    const questions = generateQuestions(desiredPosition);
    setInterviewQuestions(questions);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setCurrentFeedback(null);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setIsLoadingFeedback(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-feedback', {
        body: { 
          question: interviewQuestions[currentQuestion],
          answer: userAnswer,
          position: desiredPosition 
        }
      });

      if (error) throw error;

      const feedbackData = {
        question: interviewQuestions[currentQuestion],
        answer: userAnswer,
        feedback: data
      };

      const newAnswers = [...answers, feedbackData];
      setAnswers(newAnswers);
      setCurrentFeedback(data);
      setUserAnswer('');

      // Auto-advance after showing feedback
      setTimeout(async () => {
        if (currentQuestion < interviewQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setCurrentFeedback(null);
        } else {
          // Save completed session to database
          try {
            const overallScore = newAnswers.reduce((sum, a) => sum + (a.feedback?.score || 0), 0) / newAnswers.length;
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Insert session
            const { data: sessionData, error: sessionError } = await supabase
              .from('interview_sessions')
              .insert({
                user_id: user.id,
                position: desiredPosition,
                overall_score: overallScore
              })
              .select()
              .single();

            if (sessionError) throw sessionError;

            // Insert answers
            const answersToInsert = newAnswers.map(a => ({
              session_id: sessionData.id,
              question: a.question,
              answer: a.answer,
              score: a.feedback?.score || 0,
              feedback: {
                feedback: a.feedback?.feedback,
                strengths: a.feedback?.strengths || [],
                improvements: a.feedback?.improvements || []
              }
            }));

            const { error: answersError } = await supabase
              .from('interview_answers')
              .insert(answersToInsert);

            if (answersError) throw answersError;

            // Reload session history
            await loadSessionHistory();

            toast({
              title: "Session Saved",
              description: "Your interview performance has been saved successfully",
            });

          } catch (saveError) {
            console.error('Error saving session:', saveError);
            toast({
              title: "Save Error",
              description: "Failed to save session, but you can still view results",
              variant: "destructive"
            });
          }

          setShowResults(true);
        }
      }, 3000);

    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const getOverallScore = () => {
    if (answers.length === 0) return 0;
    const totalScore = answers.reduce((sum, answer) => 
      sum + (answer.feedback?.score || 0), 0
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
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">AI-Powered Interview Preparation</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">
          Master Your Next Interview
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === category.id 
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl` 
                  : 'hover:bg-muted'
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
            <div className="command-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">AI Interview Simulator</h2>
                    <p className="text-sm text-muted-foreground">
                      Practice with personalized questions
                    </p>
                  </div>
                </div>
                
                {!interviewQuestions.length && !showResults ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        What position are you interviewing for?
                      </label>
                      <Input
                        placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                        value={desiredPosition}
                        onChange={(e) => setDesiredPosition(e.target.value)}
                        className="form-input-polished text-base p-4"
                      />
                    </div>
                    
                    <Button 
                      onClick={startInterview}
                      disabled={!desiredPosition.trim() || balance <= 0}
                      className="w-full h-12 text-base font-semibold saas-button"
                    >
                      <Brain className="w-5 h-5 mr-3" />
                      Start Mock Interview
                      <span className="ml-2 inline-flex items-center gap-1 text-xs opacity-80">
                        <Coins className="w-3 h-3" />1
                      </span>
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                ) : showResults ? (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Interview Complete!</h3>
                      <p className="text-lg text-muted-foreground">Overall Score: <span className="font-bold text-emerald-500">{getOverallScore()}/10</span></p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Detailed Feedback</h4>
                      {answers.map((answerData, index) => {
                        const { question, answer, feedback } = answerData;
                        return (
                          <div key={index} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-slate-900 dark:text-white">Question {index + 1}</p>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                                <span className="font-bold text-slate-900 dark:text-white">{feedback?.score || 0}/10</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{question}</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-700/30 p-3 rounded-lg mb-3">{answer}</p>
                            
                            <div className="space-y-2">
                              <div className="text-sm">
                                <strong className="text-slate-900 dark:text-white">AI Feedback:</strong>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">{feedback?.feedback}</p>
                              </div>
                              
                              {feedback?.strengths && feedback.strengths.length > 0 && (
                                <div className="text-sm">
                                  <strong className="text-emerald-600 dark:text-emerald-400">Strengths:</strong>
                                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-1">
                                    {feedback.strengths.map((strength: string, i: number) => (
                                      <li key={i}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {feedback?.improvements && feedback.improvements.length > 0 && (
                                <div className="text-sm">
                                  <strong className="text-orange-600 dark:text-orange-400">Areas to Improve:</strong>
                                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 mt-1">
                                    {feedback.improvements.map((improvement: string, i: number) => (
                                      <li key={i}>{improvement}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
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

                    <div className="space-y-6">
                      <Textarea
                        placeholder="Type your answer here... Try to be specific and use examples from your experience."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isLoadingFeedback}
                        className="min-h-40 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 rounded-xl text-base"
                      />
                      
                      {currentFeedback && (
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-bottom-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">Score: {currentFeedback.score}/10</span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{currentFeedback.feedback}</p>
                              {currentFeedback.strengths?.length > 0 && (
                                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                                  <strong>Strengths:</strong> {currentFeedback.strengths.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim() || isLoadingFeedback}
                        className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
                      >
                        {isLoadingFeedback ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Getting AI Feedback...
                          </>
                        ) : (
                          <>
                            Submit Answer
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {sessionHistory.length > 0 
                      ? `${Math.round((sessionHistory.reduce((sum, s) => sum + s.overallScore, 0) / sessionHistory.length) * 10)}%`
                      : '0%'
                    }
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Preparation Score</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{sessionHistory.length}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Sessions Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {sessionHistory.length > 0 
                        ? (sessionHistory.reduce((sum, s) => sum + s.overallScore, 0) / sessionHistory.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
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

      {selectedCategory === 'analytics' && (
        <div className="space-y-6">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Performance Analytics</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                    Track your interview preparation progress
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sessionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Sessions Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Complete your first AI interview to see your performance analytics
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Overall Score</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {(sessionHistory.reduce((sum, s) => sum + s.overallScore, 0) / sessionHistory.length).toFixed(1)}/10
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{sessionHistory.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Questions Answered</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {sessionHistory.reduce((sum, s) => sum + s.answers.length, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session History */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Sessions</h3>
                    <div className="space-y-4">
                      {sessionHistory.slice().reverse().map((session) => (
                        <div key={session.id} className="p-5 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">{session.position}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {new Date(session.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-xl">
                              <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                              <span className="font-bold text-slate-900 dark:text-white">{session.overallScore.toFixed(1)}/10</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {session.answers.length} questions
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                session.overallScore >= 8 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : session.overallScore >= 6
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}
                            >
                              {session.overallScore >= 8 ? 'Excellent' : session.overallScore >= 6 ? 'Good' : 'Needs Improvement'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
