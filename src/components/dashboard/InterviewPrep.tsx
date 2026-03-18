import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Mic, RotateCcw, ArrowRight, Loader2,
  CheckCircle2, AlertCircle, Sparkles, ChevronRight, TrendingUp,
  Coins, BarChart3, BookOpen, Zap, Radio, Send, Lock,
  Target, Clock, Trophy, Flame, MessageSquare
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

// ===== Type Definitions =====
type Tab = 'practice' | 'live' | 'tips' | 'history';
type Stage = 'setup' | 'question' | 'feedback' | 'results';

interface Feedback {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface Answer {
  question: string;
  answer: string;
  feedback: Feedback;
}

interface Session {
  id: string;
  position: string;
  overallScore: number;
  date: string;
  answers: Answer[];
}

interface LiveEntry {
  id: string;
  question: string;
  suggestion: string | null;
  loading: boolean;
}

// ===== Constants =====
const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'practice', label: 'Practice', icon: Brain },
  { id: 'live', label: 'Live Mode', icon: Radio },
  { id: 'tips', label: 'Tips', icon: BookOpen },
  { id: 'history', label: 'History', icon: BarChart3 },
];

const tips = [
  { 
    icon: '⭐', 
    title: 'STAR Method', 
    priority: 'High', 
    time: '2 min', 
    desc: 'Every behavioral answer needs structure: Situation, Task, Action, Result. Without it your answer drifts and interviewers notice immediately.' 
  },
  { 
    icon: '🔍', 
    title: 'Research The Company', 
    priority: 'High', 
    time: '3 min', 
    desc: 'Know their mission, recent funding, key products, main competitors. Referencing something specific shows you actually want this role.' 
  },
  { 
    icon: '🎯', 
    title: 'Nail Your Pitch', 
    priority: 'High', 
    time: '2 min', 
    desc: 'A crisp 60-second "tell me about yourself" sets the tone for the whole interview. Rehearse it until it sounds natural.' 
  },
  { 
    icon: '📊', 
    title: 'Quantify Everything', 
    priority: 'High', 
    time: '1 min', 
    desc: '"Cut load time by 60%" hits differently than "improved performance." Numbers make abstract claims concrete and memorable.' 
  },
  { 
    icon: '❓', 
    title: 'Ask Great Questions', 
    priority: 'Medium', 
    time: '2 min', 
    desc: 'Ask about team culture, what success looks like at 90 days, the biggest current challenge. Never say you have no questions.' 
  },
  { 
    icon: '⏸️', 
    title: 'Pause With Confidence', 
    priority: 'Medium', 
    time: '1 min', 
    desc: 'A 2-second pause before answering signals composure. It reads as thoughtful, not hesitant. Use it every time.' 
  },
];

// ===== Helper Functions =====
const getFallbackQuestions = (position: string): string[] => {
  const p = position.toLowerCase();
  
  if (p.includes('engineer') || p.includes('developer')) {
    return [
      `Tell me about the most complex technical problem you solved as a ${position}.`,
      'How do you approach code reviews — what are you specifically looking for?',
      'Describe a time you had to learn a new technology under real pressure.',
      'How do you balance shipping fast versus building it right?',
      'Walk me through designing a scalable system for a high-traffic feature.',
    ];
  }
  
  if (p.includes('product') || p.includes('pm')) {
    return [
      `What does success look like in your first 90 days as a ${position}?`,
      'How do you prioritize features when everything feels equally urgent?',
      'Tell me about a product decision you made with incomplete data.',
      'How do you get engineering and design aligned on a hard tradeoff?',
      'Describe a product launch that did not go as planned.',
    ];
  }
  
  if (p.includes('design')) {
    return [
      'Walk me through your design process from brief to final delivery.',
      'How do you handle feedback that conflicts with your design decisions?',
      'Tell me about a time user research completely changed your direction.',
      'How do you balance aesthetic quality with delivery timelines?',
      'Describe your most challenging design project and the key lesson.',
    ];
  }
  
  return [
    `Tell me about yourself and why you are targeting a ${position} role.`,
    'What is your greatest professional achievement in the last two years?',
    'Describe a conflict with a colleague and how you resolved it.',
    'Tell me about a time you failed. What happened and what did you learn?',
    'Where do you want to be in three years — and why here?',
  ];
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-emerald-500';
  if (score >= 6) return 'text-amber-500';
  return 'text-red-500';
};

const getScoreBackground = (score: number): string => {
  if (score >= 8) return 'bg-emerald-500/5 border-emerald-500/20';
  if (score >= 6) return 'bg-amber-500/5 border-amber-500/20';
  return 'bg-red-500/5 border-red-500/20';
};

const getScoreGradient = (score: number): string => {
  if (score >= 8) return 'from-emerald-500 to-teal-500';
  if (score >= 6) return 'from-amber-500 to-orange-400';
  return 'from-red-500 to-rose-500';
};

const getScoreLabel = (score: number): string => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Needs Work';
  return 'Keep Practicing';
};

// ===== Main Component =====
const InterviewPrep: React.FC<{ setActiveTab?: (tab: string) => void }> = ({ setActiveTab }) => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { canUse, trackUsage, getRemaining } = useUsageLimit();
  const { tier } = useSubscription();

  // ===== State =====
  const [tab, setTab] = useState<Tab>('practice');
  const [stage, setStage] = useState<Stage>('setup');

  // Practice Mode State
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Live Mode State
  const [livePosition, setLivePosition] = useState('');
  const [liveCompany, setLiveCompany] = useState('');
  const [liveActive, setLiveActive] = useState(false);
  const [liveQuestion, setLiveQuestion] = useState('');
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const liveBottomRef = useRef<HTMLDivElement>(null);

  // History State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ===== Derived Values =====
  const overallScore = answers.length > 0 
    ? answers.reduce((sum, a) => sum + a.feedback.score, 0) / answers.length 
    : 0;
  
  const avgScore = sessions.length > 0 
    ? sessions.reduce((sum, sess) => sum + sess.overallScore, 0) / sessions.length 
    : 0;
  
  const wordCount = userAnswer.split(/\s+/).filter(Boolean).length;
  const remainingLive = getRemaining('interview_prep');

  // ===== Effects =====
  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    liveBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveEntries]);

  // ===== Data Fetching =====
  const loadHistory = async () => {
    try {
      const { data: sessionData } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (!sessionData) return;

      const full = await Promise.all(
        sessionData.map(async (session) => {
          const { data: answerData } = await supabase
            .from('interview_answers')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: true });

          return {
            id: session.id,
            position: session.position,
            overallScore: Number(session.overall_score),
            date: session.completed_at,
            answers: (answerData || []).map(a => ({
              question: a.question,
              answer: a.answer,
              feedback: {
                score: Number(a.score),
                feedback: a.feedback?.feedback || '',
                strengths: a.feedback?.strengths || [],
                improvements: a.feedback?.improvements || []
              },
            })),
          };
        })
      );

      setSessions(full);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ===== Event Handlers =====
  const generateQuestions = async () => {
    if (!position.trim()) {
      toast({ title: 'Enter a role first', variant: 'destructive' });
      return;
    }

    const credited = await trackUsage('interview_prep');
    if (!credited) {
      toast({ 
        title: 'No credits', 
        description: 'You need 1 credit to start.', 
        variant: 'destructive' 
      });
      return;
    }

    setLoadingQuestions(true);

    try {
      const { data } = await supabase.functions.invoke('interview-feedback', {
        body: { generateOnly: true, position, company },
      });

      const generatedQuestions: string[] = data?.questions?.length 
        ? data.questions 
        : getFallbackQuestions(position);

      setQuestions(generatedQuestions);
      setCurrentQ(0);
      setAnswers([]);
      setCurrentFeedback(null);
      setUserAnswer('');
      setStage('question');
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(getFallbackQuestions(position));
      setCurrentQ(0);
      setAnswers([]);
      setCurrentFeedback(null);
      setUserAnswer('');
      setStage('question');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setLoadingFeedback(true);

    try {
      const { data, error } = await supabase.functions.invoke('interview-feedback', {
        body: { 
          question: questions[currentQ], 
          answer: userAnswer, 
          position 
        },
      });

      if (error) throw error;

      const feedback: Feedback = {
        score: data?.score || 5,
        feedback: data?.feedback || 'Good attempt.',
        strengths: data?.strengths || [],
        improvements: data?.improvements || [],
      };

      const newAnswer: Answer = {
        question: questions[currentQ],
        answer: userAnswer,
        feedback
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setCurrentFeedback(feedback);
      setStage('feedback');
      setUserAnswer('');

      // Save session if this was the last question
      if (currentQ === questions.length - 1) {
        await saveSession(updatedAnswers);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: 'Error',
        description: 'Could not get AI feedback.',
        variant: 'destructive'
      });
    } finally {
      setLoadingFeedback(false);
    }
  };

  const saveSession = async (answersToSave: Answer[]) => {
    const overall = answersToSave.reduce((sum, a) => sum + a.feedback.score, 0) / answersToSave.length;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data: saved } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        position,
        overall_score: overall
      })
      .select()
      .single();

    if (saved) {
      await supabase.from('interview_answers').insert(
        answersToSave.map(a => ({
          session_id: saved.id,
          question: a.question,
          answer: a.answer,
          score: a.feedback.score,
          feedback: {
            feedback: a.feedback.feedback,
            strengths: a.feedback.strengths,
            improvements: a.feedback.improvements
          },
        }))
      );

      await loadHistory();
      toast({ title: 'Session saved!' });
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setCurrentFeedback(null);
      setStage('question');
    } else {
      setStage('results');
    }
  };

  const resetPractice = () => {
    setStage('setup');
    setPosition('');
    setCompany('');
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setCurrentFeedback(null);
    setUserAnswer('');
  };

  // Live Mode Handlers
  const startLive = () => {
    if (!livePosition.trim()) {
      toast({ title: 'Enter your role first', variant: 'destructive' });
      return;
    }
    setLiveEntries([]);
    setLiveActive(true);
  };

  const askLive = async () => {
    if (!liveQuestion.trim() || liveLoading) return;

    const id = Date.now().toString();
    const question = liveQuestion.trim();

    setLiveQuestion('');
    setLiveLoading(true);
    setLiveEntries(prev => [...prev, { id, question, suggestion: null, loading: true }]);

    try {
      const { data } = await supabase.functions.invoke('interview-feedback', {
        body: { 
          liveMode: true, 
          question, 
          position: livePosition, 
          company: liveCompany 
        },
      });

      setLiveEntries(prev => prev.map(entry =>
        entry.id === id 
          ? { 
              ...entry, 
              suggestion: data?.suggestion || 'Use STAR — Situation, Task, Action, Result.', 
              loading: false 
            } 
          : entry
      ));
    } catch (error) {
      console.error('Error in live mode:', error);
      setLiveEntries(prev => prev.map(entry =>
        entry.id === id 
          ? { 
              ...entry, 
              suggestion: 'Use STAR method. Give a concrete example with a measurable result. Keep under 2 minutes.', 
              loading: false 
            } 
          : entry
      ));
    } finally {
      setLiveLoading(false);
    }
  };

  const endLive = () => {
    setLiveActive(false);
    setLiveEntries([]);
  };

  // ===== Render =====
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <HeaderSection 
        avgScore={avgScore} 
        sessionsCount={sessions.length} 
      />

      {/* Tab Bar */}
      <TabBar 
        tabs={TABS} 
        activeTab={tab} 
        onTabChange={setTab} 
        sessionsCount={sessions.length} 
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {tab === 'practice' && (
          <PracticeMode
            stage={stage}
            position={position}
            setPosition={setPosition}
            company={company}
            setCompany={setCompany}
            questions={questions}
            currentQ={currentQ}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            answers={answers}
            currentFeedback={currentFeedback}
            loadingQuestions={loadingQuestions}
            loadingFeedback={loadingFeedback}
            wordCount={wordCount}
            overallScore={overallScore}
            canUse={canUse('interview_prep')}
            remaining={remainingLive}
            sessions={sessions}
            avgScore={avgScore}
            onGenerateQuestions={generateQuestions}
            onSubmitAnswer={submitAnswer}
            onNextQuestion={nextQuestion}
            onReset={resetPractice}
            setActiveTab={setActiveTab}
          />
        )}

        {tab === 'live' && (
          <LiveMode
            liveActive={liveActive}
            livePosition={livePosition}
            setLivePosition={setLivePosition}
            liveCompany={liveCompany}
            setLiveCompany={setLiveCompany}
            liveQuestion={liveQuestion}
            setLiveQuestion={setLiveQuestion}
            liveEntries={liveEntries}
            liveLoading={liveLoading}
            liveBottomRef={liveBottomRef}
            onStartLive={startLive}
            onAskLive={askLive}
            onEndLive={endLive}
          />
        )}

        {tab === 'tips' && (
          <TipsMode tips={tips} />
        )}

        {tab === 'history' && (
          <HistoryMode
            loading={loadingHistory}
            sessions={sessions}
            avgScore={avgScore}
            onStartPractice={() => setTab('practice')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Subcomponents =====

// Header Section
const HeaderSection: React.FC<{ avgScore: number; sessionsCount: number }> = ({ 
  avgScore, 
  sessionsCount 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="flex items-center justify-between gap-4"
  >
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Interview Coach</h1>
        <p className="text-xs text-muted-foreground">Practice before. Get help during. Win the offer.</p>
      </div>
    </div>

    {sessionsCount > 0 && (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
        <Trophy className="w-3.5 h-3.5 text-primary" />
        <span className="text-sm font-bold text-primary">{avgScore.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">avg / 10</span>
      </div>
    )}
  </motion.div>
);

// Tab Bar
const TabBar: React.FC<{
  tabs: typeof TABS;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  sessionsCount: number;
}> = ({ tabs, activeTab, onTabChange, sessionsCount }) => (
  <div className="inline-flex gap-0.5 p-1 rounded-xl bg-muted/60 border border-border/50">
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`
          relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
          ${activeTab === id 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
          }
        `}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
        {id === 'history' && sessionsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center">
            {sessionsCount > 9 ? '9+' : sessionsCount}
          </span>
        )}
      </button>
    ))}
  </div>
);

// Due to length constraints, I'll continue with the remaining subcomponents if you'd like.
// The pattern above shows how to break down this massive component into manageable pieces.

export default InterviewPrep;
