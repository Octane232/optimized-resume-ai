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
import { useCredits } from '@/contexts/CreditsContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

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

const InterviewPrep: React.FC<{ setActiveTab?: (tab: string) => void }> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { balance, spendCredit } = useCredits();
  const { tier } = useSubscription();

  const [tab, setTab] = useState<Tab>('practice');
  const [stage, setStage] = useState<Stage>('setup');

  // Practice
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Live
  const [livePosition, setLivePosition] = useState('');
  const [liveCompany, setLiveCompany] = useState('');
  const [liveActive, setLiveActive] = useState(false);
  const [liveQuestion, setLiveQuestion] = useState('');
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const liveBottomRef = useRef<HTMLDivElement>(null);

  // History
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => {
    liveBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveEntries]);

  const loadHistory = async () => {
    try {
      const { data: sessionData } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('completed_at', { ascending: false });
      
      if (!sessionData) return;
      
      const full = await Promise.all(sessionData.map(async (s) => {
        const { data: answerData } = await supabase
          .from('interview_answers')
          .select('*')
          .eq('session_id', s.id)
          .order('created_at', { ascending: true });
        
        return {
          id: s.id,
          position: s.position,
          overallScore: Number(s.overall_score),
          date: s.completed_at,
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
      }));
      setSessions(full);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoadingHistory(false); 
    }
  };

  const getFallback = (pos: string): string[] => {
    const p = pos.toLowerCase();
    if (p.includes('engineer') || p.includes('developer')) return [
      `Tell me about the most complex technical problem you solved as a ${pos}.`,
      'How do you approach code reviews — what are you specifically looking for?',
      'Describe a time you had to learn a new technology under real pressure.',
      'How do you balance shipping fast versus building it right?',
      'Walk me through designing a scalable system for a high-traffic feature.',
    ];
    if (p.includes('product') || p.includes('pm')) return [
      `What does success look like in your first 90 days as a ${pos}?`,
      'How do you prioritize features when everything feels equally urgent?',
      'Tell me about a product decision you made with incomplete data.',
      'How do you get engineering and design aligned on a hard tradeoff?',
      'Describe a product launch that did not go as planned.',
    ];
    if (p.includes('design')) return [
      'Walk me through your design process from brief to final delivery.',
      'How do you handle feedback that conflicts with your design decisions?',
      'Tell me about a time user research completely changed your direction.',
      'How do you balance aesthetic quality with delivery timelines?',
      'Describe your most challenging design project and the key lesson.',
    ];
    return [
      `Tell me about yourself and why you are targeting a ${pos} role.`,
      'What is your greatest professional achievement in the last two years?',
      'Describe a conflict with a colleague and how you resolved it.',
      'Tell me about a time you failed. What happened and what did you learn?',
      'Where do you want to be in three years — and why here?',
    ];
  };

  const generateQuestions = async () => {
    if (!position.trim()) { 
      toast({ title: 'Enter a role first', variant: 'destructive' }); 
      return; 
    }
    const credited = await spendCredit('interview_prep', `Mock interview: ${position}`);
    if (!credited) { 
      toast({ title: 'No credits', description: 'You need 1 credit to start.', variant: 'destructive' }); 
      return; 
    }
    setLoadingQuestions(true);
    try {
      const { data } = await supabase.functions.invoke('interview-feedback', {
        body: { generateOnly: true, position, company },
      });
      const qs: string[] = data?.questions?.length ? data.questions : getFallback(position);
      setQuestions(qs); 
      setCurrentQ(0); 
      setAnswers([]);
      setCurrentFeedback(null); 
      setUserAnswer(''); 
      setStage('question');
    } catch {
      setQuestions(getFallback(position)); 
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
        body: { question: questions[currentQ], answer: userAnswer, position },
      });
      if (error) throw error;
      
      const fb: Feedback = {
        score: data?.score || 5,
        feedback: data?.feedback || 'Good attempt.',
        strengths: data?.strengths || [],
        improvements: data?.improvements || [],
      };
      
      const newAnswer: Answer = { 
        question: questions[currentQ], 
        answer: userAnswer, 
        feedback: fb 
      };
      
      const updated = [...answers, newAnswer];
      setAnswers(updated); 
      setCurrentFeedback(fb); 
      setStage('feedback'); 
      setUserAnswer('');

      if (currentQ === questions.length - 1) {
        const overall = updated.reduce((s, a) => s + a.feedback.score, 0) / updated.length;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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
              updated.map(a => ({
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
        }
      }
    } catch { 
      toast({ 
        title: 'Error', 
        description: 'Could not get AI feedback.', 
        variant: 'destructive' 
      }); 
    } finally { 
      setLoadingFeedback(false); 
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) { 
      setCurrentQ(p => p + 1); 
      setCurrentFeedback(null); 
      setStage('question'); 
    } else { 
      setStage('results'); 
    }
  };

  const reset = () => {
    setStage('setup'); 
    setPosition(''); 
    setCompany('');
    setQuestions([]); 
    setCurrentQ(0); 
    setAnswers([]);
    setCurrentFeedback(null); 
    setUserAnswer('');
  };

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
    const q = liveQuestion.trim();
    setLiveQuestion(''); 
    setLiveLoading(true);
    setLiveEntries(prev => [...prev, { id, question: q, suggestion: null, loading: true }]);
    try {
      const { data } = await supabase.functions.invoke('interview-feedback', {
        body: { liveMode: true, question: q, position: livePosition, company: liveCompany },
      });
      setLiveEntries(prev => prev.map(e =>
        e.id === id ? { ...e, suggestion: data?.suggestion || 'Use STAR — Situation, Task, Action, Result.', loading: false } : e
      ));
    } catch {
      setLiveEntries(prev => prev.map(e =>
        e.id === id ? { ...e, suggestion: 'Use STAR method. Give a concrete example with a measurable result. Keep under 2 minutes.', loading: false } : e
      ));
    } finally { 
      setLiveLoading(false); 
    }
  };

  const overallScore = answers.length > 0 ? answers.reduce((s, a) => s + a.feedback.score, 0) / answers.length : 0;
  const avgScore = sessions.length > 0 ? sessions.reduce((s, sess) => s + sess.overallScore, 0) / sessions.length : 0;
  const wordCount = userAnswer.split(/\s+/).filter(Boolean).length;

  const scoreColor = (s: number) => s >= 8 ? 'text-emerald-500' : s >= 6 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = (s: number) => s >= 8 ? 'bg-emerald-500/5 border-emerald-500/20' : s >= 6 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20';
  const scoreGrad = (s: number) => s >= 8 ? 'from-emerald-500 to-teal-500' : s >= 6 ? 'from-amber-500 to-orange-400' : 'from-red-500 to-rose-500';
  const scoreLabel = (s: number) => s >= 8 ? 'Excellent' : s >= 6 ? 'Good' : s >= 4 ? 'Needs Work' : 'Keep Practicing';

  const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: 'practice', label: 'Practice', icon: Brain },
    { id: 'live', label: 'Live Mode', icon: Radio },
    { id: 'tips', label: 'Tips', icon: BookOpen },
    { id: 'history', label: 'History', icon: BarChart3 },
  ];

  const tips = [
    { icon: '🎯', title: 'STAR Method', priority: 'High', time: '2 min', desc: 'Every behavioral answer needs structure: Situation, Task, Action, Result. Without it your answer drifts and interviewers notice immediately.' },
    { icon: '🔍', title: 'Research The Company', priority: 'High', time: '3 min', desc: 'Know their mission, recent funding, key products, main competitors. Referencing something specific shows you actually want this role.' },
    { icon: '💬', title: 'Nail Your Pitch', priority: 'High', time: '2 min', desc: 'A crisp 60-second "tell me about yourself" sets the tone for the whole interview. Rehearse it until it sounds natural.' },
    { icon: '🔢', title: 'Quantify Everything', priority: 'High', time: '1 min', desc: '"Cut load time by 60%" hits differently than "improved performance." Numbers make abstract claims concrete and memorable.' },
    { icon: '❓', title: 'Ask Great Questions', priority: 'Medium', time: '2 min', desc: 'Ask about team culture, what success looks like at 90 days, the biggest current challenge. Never say you have no questions.' },
    { icon: '🧘', title: 'Pause With Confidence', priority: 'Medium', time: '1 min', desc: 'A 2-second pause before answering signals composure. It reads as thoughtful, not hesitant. Use it every time.' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
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
        {sessions.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-bold text-primary">{avgScore.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">avg / 10</span>
          </div>
        )}
      </motion.div>

      {/* Tab Bar */}
      <div className="inline-flex gap-0.5 p-1 rounded-xl bg-muted/60 border border-border/50">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => setTab(id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${tab === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'}`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
            {id === 'history' && sessions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center">
                {sessions.length > 9 ? '9+' : sessions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PRACTICE */}
        {tab === 'practice' && (
          <motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {stage === 'setup' && (
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-3">
                  <Card className="border border-border/60 shadow-sm overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 opacity-60" />
                    <CardContent className="p-6 space-y-5">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Mock Interview</p>
                        <h2 className="text-lg font-bold text-foreground">Set up your session</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">AI generates 5 questions tailored to your role and company.</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                            Target Role <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            placeholder="e.g. Senior Backend Engineer, Product Manager"
                            value={position} 
                            onChange={e => setPosition(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && generateQuestions()}
                            className="h-11 bg-muted/30 border-border/50" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                            Company <span className="text-muted-foreground font-normal normal-case ml-1">(optional)</span>
                          </label>
                          <Input 
                            placeholder="e.g. Stripe, Google, early-stage startup"
                            value={company} 
                            onChange={e => setCompany(e.target.value)}
                            className="h-11 bg-muted/30 border-border/50" 
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={generateQuestions} 
                        disabled={loadingQuestions || !position.trim() || balance <= 0}
                        size="lg" 
                        className="w-full h-12 font-semibold gap-2"
                      >
                        {loadingQuestions
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Generating questions…</>
                          : <><Sparkles className="w-4 h-4" />Start Mock Interview
                            <span className="ml-auto flex items-center gap-1 text-xs opacity-60 font-normal">
                              <Coins className="w-3 h-3" />1 credit
                            </span>
                          </>}
                      </Button>
                      {balance <= 0 && (
                        <p className="text-xs text-center text-destructive">
                          No credits.{' '}
                          <button 
                            onClick={() => setActiveTab?.('billing')} 
                            className="underline font-semibold"
                          >
                            Get more →
                          </button>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2 flex flex-col gap-3">
                  <Card className="border border-border/60 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">Your Stats</span>
                      </div>
                      <div className="text-center py-4 mb-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-4xl font-black text-foreground">{sessions.length > 0 ? avgScore.toFixed(1) : '—'}</p>
                        <p className="text-xs text-muted-foreground mt-1">Average score / 10</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Sessions', value: sessions.length }, 
                          { label: 'Questions', value: sessions.reduce((s, sess) => s + sess.answers.length, 0) }
                        ].map((stat, i) => (
                          <div key={i} className="text-center p-3 rounded-lg bg-muted/40">
                            <p className="text-xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/60 shadow-sm">
                    <CardContent className="p-5 space-y-2.5">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">How it works</p>
                      {[
                        'AI generates 5 role-specific questions', 
                        'Answer each in your own words', 
                        'Get instant score + feedback', 
                        'Review what to improve'
                      ].map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-px">
                            <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{s}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {(stage === 'question' || stage === 'feedback') && (
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                    <Badge variant="outline" className="text-xs">{position}{company ? ` · ${company}` : ''}</Badge>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                      animate={{ width: `${((currentQ + (stage === 'feedback' ? 1 : 0)) / questions.length) * 100}%` }}
                      transition={{ duration: 0.4 }} 
                    />
                  </div>
                </div>
                <Card className="border border-border/60 shadow-sm overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-blue-500 to-violet-500 opacity-60" />
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground leading-relaxed">{questions[currentQ]}</p>
                    </div>

                    {stage === 'question' && (
                      <div className="space-y-3">
                        <Textarea 
                          placeholder="Type your answer. Use a real example from your experience. Vague answers score low."
                          value={userAnswer} 
                          onChange={e => setUserAnswer(e.target.value)}
                          className="min-h-[150px] bg-muted/20 border-border/50 resize-y text-sm" 
                          disabled={loadingFeedback} 
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{wordCount} words <span className="opacity-50">— aim for 100–200</span></span>
                          <div className="flex gap-1">
                            {[0, 60, 120].map((t, i) => (
                              <div 
                                key={i} 
                                className={`h-1 w-6 rounded-full transition-colors ${wordCount > t ? 'bg-primary' : 'bg-muted'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={submitAnswer} 
                          disabled={!userAnswer.trim() || loadingFeedback} 
                          size="lg" 
                          className="w-full h-11 font-semibold gap-2"
                        >
                          {loadingFeedback 
                            ? <><Loader2 className="w-4 h-4 animate-spin" />Analysing your answer…</> 
                            : <>Submit Answer <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                      </div>
                    )}

                    {stage === 'feedback' && currentFeedback && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className={`flex items-center gap-4 p-4 rounded-xl border ${scoreBg(currentFeedback.score)}`}>
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scoreGrad(currentFeedback.score)} flex flex-col items-center justify-center text-white shadow-sm shrink-0`}>
                            <span className="text-2xl font-black leading-none">{currentFeedback.score}</span>
                            <span className="text-[9px] opacity-80 mt-0.5">/ 10</span>
                          </div>
                          <div className="flex-1">
                            <p className={`text-base font-bold ${scoreColor(currentFeedback.score)}`}>{scoreLabel(currentFeedback.score)}</p>
                            <div className="flex gap-0.5 mt-1.5">
                              {[...Array(10)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 flex-1 rounded-full ${i < currentFeedback.score
                                    ? currentFeedback.score >= 8 ? 'bg-emerald-500' : currentFeedback.score >= 6 ? 'bg-amber-500' : 'bg-red-500'
                                    : 'bg-muted'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-sm text-foreground leading-relaxed">{currentFeedback.feedback}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {currentFeedback.strengths?.length > 0 && (
                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" />Strengths
                              </p>
                              {currentFeedback.strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✓</span>
                                  <p className="text-xs text-muted-foreground">{s}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {currentFeedback.improvements?.length > 0 && (
                            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" />Improve
                              </p>
                              {currentFeedback.improvements.map((s, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-amber-500 text-xs shrink-0 mt-0.5">→</span>
                                  <p className="text-xs text-muted-foreground">{s}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button onClick={nextQuestion} size="lg" className="w-full h-11 font-semibold gap-2">
                          {currentQ < questions.length - 1 
                            ? <>Next Question <ChevronRight className="w-4 h-4" /></> 
                            : <>See Results <Trophy className="w-4 h-4" /></>}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {stage === 'results' && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl">
                <Card className="border border-border/60 shadow-sm overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-blue-500 to-violet-500 opacity-60" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${scoreGrad(overallScore)} flex flex-col items-center justify-center text-white shadow-lg shrink-0`}>
                        <span className="text-3xl font-black leading-none">{overallScore.toFixed(1)}</span>
                        <span className="text-xs opacity-70 mt-0.5">/ 10</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Session Complete</p>
                        <h2 className="text-xl font-bold text-foreground">{scoreLabel(overallScore)}</h2>
                        <p className="text-sm text-muted-foreground">{position}{company ? ` · ${company}` : ''}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{answers.length} questions</Badge>
                          <Badge variant="outline" className={`text-xs ${scoreColor(overallScore)}`}>{overallScore.toFixed(1)} avg</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-2">
                  {answers.map((a, i) => (
                    <Card key={i} className="border border-border/60 shadow-sm">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-muted-foreground mt-0.5 shrink-0">Q{i + 1}</span>
                            <p className="text-sm font-medium text-foreground">{a.question}</p>
                          </div>
                          <span className={`text-base font-black shrink-0 ${scoreColor(a.feedback.score)}`}>{a.feedback.score}/10</span>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 leading-relaxed">{a.answer}</p>
                        <p className="text-xs text-foreground/80 leading-relaxed">{a.feedback.feedback}</p>
                        {a.feedback.improvements?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {a.feedback.improvements.slice(0, 2).map((imp, j) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/8 text-amber-600 border border-amber-500/20">{imp}</span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button onClick={reset} variant="outline" className="flex-1 h-11 gap-2">
                    <RotateCcw className="w-4 h-4" />New Interview
                  </Button>
                  {setActiveTab && (
                    <Button onClick={() => setActiveTab('resume-engine')} className="flex-1 h-11 gap-2">
                      <TrendingUp className="w-4 h-4" />Tailor My Resume
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* LIVE MODE - Now available to all users */}
        {tab === 'live' && (
          <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {!liveActive ? (
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-3">
                  <Card className="border border-border/60 shadow-sm overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-red-500 to-rose-400 opacity-80" />
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Mode</p>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Real-time Interview Copilot</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Keep this open during your interview. Type each question as it is asked.</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                            Role <span className="text-destructive">*</span>
                          </label>
                          <Input 
                            placeholder="e.g. Senior Product Manager" 
                            value={livePosition} 
                            onChange={e => setLivePosition(e.target.value)} 
                            className="h-11 bg-muted/30 border-border/50" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                            Company <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                          </label>
                          <Input 
                            placeholder="e.g. Stripe" 
                            value={liveCompany} 
                            onChange={e => setLiveCompany(e.target.value)} 
                            className="h-11 bg-muted/30 border-border/50" 
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={startLive} 
                        size="lg" 
                        className="w-full h-11 font-bold gap-2 bg-red-500 hover:bg-red-600 text-white border-0"
                      >
                        <Radio className="w-4 h-4" />Go Live
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2">
                  <Card className="border border-border/60 shadow-sm h-full">
                    <CardContent className="p-5 space-y-3">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">How it works</p>
                      {[
                        'Open this before your interview', 
                        'Click Go Live and enter your role', 
                        'Interviewer asks a question', 
                        'Type it here — press Enter', 
                        'Read the suggested answer approach', 
                        'Speak confidently using the guide'
                      ].map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-px">
                            <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{s}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">{livePosition}{liveCompany ? ` · ${liveCompany}` : ''}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/25 text-red-500 bg-red-500/8">LIVE</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => { setLiveActive(false); setLiveEntries([]); }} 
                    className="text-xs h-7"
                  >
                    End
                  </Button>
                </div>
                <div className="space-y-3 min-h-[160px] max-h-[440px] overflow-y-auto pr-1">
                  {liveEntries.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm text-muted-foreground">Type the first question when your interviewer asks it.</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">Press Enter or click Get Help.</p>
                    </div>
                  )}
                  {liveEntries.map((entry, i) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border border-border/60 shadow-sm">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60 shrink-0 mt-0.5">Q{i + 1}</span>
                            <p className="text-sm font-medium text-foreground">{entry.question}</p>
                          </div>
                          {entry.loading ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/30">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />Getting your answer guide…
                            </div>
                          ) : entry.suggestion && (
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Answer Guide</span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{entry.suggestion}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  <div ref={liveBottomRef} />
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/30">
                  <Input 
                    placeholder="Type what the interviewer just asked…" 
                    value={liveQuestion}
                    onChange={e => setLiveQuestion(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && askLive()}
                    className="h-11 bg-muted/30 border-border/50 flex-1" 
                    disabled={liveLoading} 
                    autoFocus 
                  />
                  <Button 
                    onClick={askLive} 
                    disabled={!liveQuestion.trim() || liveLoading} 
                    className="h-11 gap-2 shrink-0"
                  >
                    {liveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Get Help
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TIPS */}
        {tab === 'tips' && (
          <motion.div 
            key="tips" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -6 }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {tips.map((tip, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                      <div>
                        <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                          <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] px-1.5 h-4 ${tip.priority === 'High' 
                              ? 'border-red-300/50 text-red-600 bg-red-500/5' 
                              : 'border-amber-300/50 text-amber-600 bg-amber-500/5'}`}
                          >
                            {tip.priority}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-4 gap-0.5">
                            <Clock className="w-2.5 h-2.5" />{tip.time}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                    <BarChart3 className="w-7 h-7 text-primary/40" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">No sessions yet</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-xs">Complete your first mock interview to start tracking your progress.</p>
                  <Button onClick={() => setTab('practice')} className="gap-2">
                    <Brain className="w-4 h-4" />Start Practicing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Sessions', value: sessions.length, icon: Flame }, 
                    { label: 'Avg Score', value: `${avgScore.toFixed(1)}/10`, icon: Trophy }, 
                    { label: 'Questions', value: sessions.reduce((s, sess) => s + sess.answers.length, 0), icon: Target }
                  ].map((stat, i) => (
                    <Card key={i} className="border border-border/60 shadow-sm">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                          <stat.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="space-y-2">
                  {sessions.map((sess, i) => (
                    <motion.div 
                      key={sess.id} 
                      initial={{ opacity: 0, y: 6 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scoreGrad(sess.overallScore)} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                <span className="text-sm font-black">{Math.round(sess.overallScore)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{sess.position}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(sess.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  <span className="mx-1 opacity-40">·</span>{sess.answers.length} questions
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs shrink-0 ${
                                sess.overallScore >= 8 
                                  ? 'border-emerald-500/30 text-emerald-600' 
                                  : sess.overallScore >= 6 
                                    ? 'border-blue-500/30 text-blue-600' 
                                    : 'border-amber-500/30 text-amber-600'
                              }`}
                            >
                              {scoreLabel(sess.overallScore)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPrep;
