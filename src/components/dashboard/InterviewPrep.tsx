import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Mic, MicOff, RotateCcw, ArrowRight, Loader2,
  CheckCircle2, AlertCircle, Sparkles, Radio, Send, Lock,
  BarChart3, BookOpen, Trophy, Shield, AlertTriangle, Wifi,
  WifiOff, Clock
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
type Tab = 'practice' | 'copilot' | 'tips' | 'history';
type Stage = 'setup' | 'question' | 'feedback' | 'results';
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

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

interface CopilotEntry {
  id: string;
  question: string;
  suggestion: string | null;
  loading: boolean;
  timestamp: Date;
}

// ===== Constants =====
const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'practice', label: 'Practice', icon: Brain },
  { id: 'copilot', label: 'Copilot', icon: Radio },
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
  const { canUse, trackUsage, getRemaining, tier } = useUsageLimit();

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

  // Copilot Mode State
  const [copilotPosition, setCopilotPosition] = useState('');
  const [copilotCompany, setCopilotCompany] = useState('');
  const [copilotActive, setCopilotActive] = useState(false);
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotEntries, setCopilotEntries] = useState<CopilotEntry[]>([]);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicInitializing, setIsMicInitializing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const copilotBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const transcriptBufferRef = useRef('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  // Use ref for copilotLoading to avoid stale closure inside the silence timer
  const copilotLoadingRef = useRef(false);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const SILENCE_WINDOW_MS = 1200;

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
  const isElite = tier === 'elite';

  // Use live getRemaining() directly on every render, not stale local state
  const remainingSessions = getRemaining('interview_prep');

  // ===== Effects =====
  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    copilotBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotEntries]);

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
            answers: (answerData || []).map(a => {
              const fb = a.feedback as Record<string, unknown> | null;
              return {
                question: a.question,
                answer: a.answer,
                feedback: {
                  score: Number(a.score),
                  feedback: (fb?.feedback as string) || '',
                  strengths: (fb?.strengths as string[]) || [],
                  improvements: (fb?.improvements as string[]) || [],
                },
              };
            }),
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

  // ===== Practice Mode Handlers =====
  const generateQuestions = async () => {
    if (!position.trim()) {
      toast({ title: 'Enter a role first', variant: 'destructive' });
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

      const credited = await trackUsage('interview_prep');
      if (!credited) {
        toast({ 
          title: 'No credits', 
          description: 'You need 1 credit to start.', 
          variant: 'destructive' 
        });
        setLoadingQuestions(false);
        return;
      }

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

      if (currentQ === questions.length - 1) {
        await saveSession(updatedAnswers);
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      const remaining = getRemaining('interview_prep');
      const ctx = error?.context;
      const status = ctx?.status;
      if (status === 402 || status === 429 || remaining <= 0) {
        toast({
          title: "You've used all your credits",
          description: 'Upgrade your plan to keep practicing.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Could not get AI feedback',
          description: 'Please try again in a moment.',
          variant: 'destructive'
        });
      }
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

  // ===== Copilot Mode Handlers =====
  const startCopilot = () => {
    if (!copilotPosition.trim()) {
      toast({ title: 'Enter your role first', variant: 'destructive' });
      return;
    }

    // Use live canUse() instead of a stale cached number
    if (!canUse('interview_prep')) {
      toast({ 
        title: 'No sessions remaining', 
        description: 'You have used all your interview prep sessions. Upgrade to continue.',
        variant: 'destructive' 
      });
      return;
    }

    setCopilotEntries([]);
    setCopilotActive(true);
    setConnectionStatus('idle');
    setErrorCount(0);
    reconnectAttemptsRef.current = 0;
    toast({ title: '🎯 Copilot session started!' });
  };

  // Speech Recognition for Copilot
  useEffect(() => {
    if (!isElite || !copilotActive) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const win = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
      const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognitionCtor) return;
      recognitionRef.current = new SpeechRecognitionCtor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setConnectionStatus('connected');
        setErrorCount(0);
        // Any successful start means the connection is healthy again
        reconnectAttemptsRef.current = 0;
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interimChunk += event.results[i][0].transcript;
          }
        }

        // Show live partial text immediately
        if (finalChunk || interimChunk) {
          setTranscript((transcriptBufferRef.current + ' ' + finalChunk + interimChunk).trim());
        }

        if (finalChunk) {
          // Accumulate finalized fragments
          transcriptBufferRef.current = (transcriptBufferRef.current + ' ' + finalChunk).trim();

          // Reset the silence timer every time new speech arrives
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            const fullQuestion = transcriptBufferRef.current.trim();
            transcriptBufferRef.current = '';
            silenceTimerRef.current = null;

            // Use the ref instead of the closed-over state value, so this
            // always sees the live loading status, not a frozen snapshot.
            if (fullQuestion.length > 5 && copilotActive && !copilotLoadingRef.current) {
              setCopilotQuestion(fullQuestion);
              askCopilot(fullQuestion);
            }
          }, SILENCE_WINDOW_MS);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          toast({ title: 'Microphone access denied', variant: 'destructive' });
          isListeningRef.current = false;
          setIsListening(false);
          setConnectionStatus('error');
          return;
        }
        
        if (event.error === 'no-speech') {
          // No speech detected - this is normal, don't show error
          return;
        }
        
        if (event.error === 'network') {
          setConnectionStatus('disconnected');
          toast({ 
            title: 'Network error', 
            description: 'Attempting to reconnect...',
            variant: 'default' 
          });
        }
        
        setErrorCount(prev => prev + 1);
      };

      recognitionRef.current.onend = () => {
        if (isListeningRef.current) {
          // Auto-reconnect with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 8000);
          reconnectAttemptsRef.current += 1;

          if (reconnectAttemptsRef.current <= MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
              if (isListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                  // onstart (above) will reset the counter once it actually succeeds
                } catch {
                  // start() can throw if called too soon after stop(); onend will fire again
                }
              }
            }, delay);
          } else {
            // Retries exhausted. Don't leave the UI lying about its state —
            // actually stop listening so the button honestly shows "Listen"
            // again and the user has one clear, obvious way back in.
            setConnectionStatus('error');
            toast({
              title: 'Connection lost',
              description: 'Mic stopped responding. Tap Listen to reconnect.',
              variant: 'destructive'
            });
            isListeningRef.current = false;
            setIsListening(false);
            reconnectAttemptsRef.current = 0;
          }
        }
      };
    } else {
      toast({ title: 'Speech recognition not supported', variant: 'destructive' });
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isElite, copilotActive]);

  const toggleListening = async () => {
    if (!isElite) {
      toast({ title: 'Elite Feature', description: 'Copilot is only available on the Elite plan.', variant: 'destructive' });
      return;
    }

    if (!copilotActive) {
      toast({ title: 'Start a session first', variant: 'destructive' });
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore errors on stop
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      transcriptBufferRef.current = '';
      setIsListening(false);
      setConnectionStatus('idle');
      toast({ title: '🎙️ Listening paused' });
    } else {
      setIsMicInitializing(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        reconnectAttemptsRef.current = 0;
        isListeningRef.current = true;
        if (recognitionRef.current) {
          setConnectionStatus('connecting');
          recognitionRef.current.start();
        }
        setIsListening(true);
        toast({ title: '🎙️ Listening to interviewer...' });
      } catch (err) {
        toast({ 
          title: 'Failed to access microphone', 
          description: 'Please allow microphone access and try again.',
          variant: 'destructive' 
        });
        setConnectionStatus('error');
      } finally {
        setIsMicInitializing(false);
      }
    }
  };

  const askCopilot = async (question?: string) => {
    const questionText = question || copilotQuestion;
    if (!questionText.trim() || copilotLoading) return;

    if (!canUse('interview_prep')) {
      toast({
        title: 'Limit reached',
        description: 'You have used all your interview sessions this month.',
        variant: 'destructive',
      });
      return;
    }

    const id = Date.now().toString();

    setCopilotQuestion('');
    setCopilotLoading(true);
    copilotLoadingRef.current = true;
    setCopilotEntries(prev => [...prev, { 
      id, 
      question: questionText, 
      suggestion: null, 
      loading: true,
      timestamp: new Date()
    }]);

    try {
      const { data, error } = await supabase.functions.invoke('interview-feedback', {
        body: {
          liveMode: true,
          question: questionText,
          position: copilotPosition,
          company: copilotCompany
        },
      });

      if (error) throw error;

      const suggestion = data?.suggestion?.trim();
      if (!suggestion) throw new Error('Empty AI response');

      await trackUsage('interview_prep');

      setCopilotEntries(prev => prev.map(entry =>
        entry.id === id
          ? { ...entry, suggestion, loading: false }
          : entry
      ));
    } catch (error: any) {
      console.error('Error in copilot mode:', error);
      const errorMessage = error?.message || 'Could not generate suggestion';
      
      // Check if it's a quota error
      if (errorMessage.includes('limit') || errorMessage.includes('quota')) {
        toast({
          title: 'Monthly limit reached',
          description: `You've used all your interview prep sessions. Upgrade to continue.`,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Could not generate suggestion',
          description: 'Please try again in a moment.',
          variant: 'destructive'
        });
      }
      
      setCopilotEntries(prev => prev.filter(entry => entry.id !== id));
    } finally {
      setCopilotLoading(false);
      copilotLoadingRef.current = false;
    }
  };

  const endCopilot = () => {
    setCopilotActive(false);
    setCopilotEntries([]);
    setIsListening(false);
    isListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    transcriptBufferRef.current = '';
    setTranscript('');
    setConnectionStatus('idle');
    copilotLoadingRef.current = false;
    reconnectAttemptsRef.current = 0;
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore errors on cleanup
      }
    }
    toast({ title: 'Copilot session ended' });
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
          <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-border/60">
              <CardContent className="p-6 space-y-4">
                {stage === 'setup' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="target-position" className="text-sm font-medium text-foreground">
                          Target Position
                        </label>
                        <Input 
                          id="target-position"
                          placeholder="e.g. Software Engineer" 
                          value={position} 
                          onChange={e => setPosition(e.target.value)} 
                          aria-required="true"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company-name" className="text-sm font-medium text-foreground">
                          Company (optional)
                        </label>
                        <Input 
                          id="company-name"
                          placeholder="e.g. Google" 
                          value={company} 
                          onChange={e => setCompany(e.target.value)} 
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={generateQuestions} 
                      disabled={!position.trim() || loadingQuestions || !canUse('interview_prep')} 
                      className="w-full"
                    >
                      {loadingQuestions ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</> : <><Brain className="w-4 h-4 mr-2" />Generate Questions</>}
                    </Button>
                    {!canUse('interview_prep') && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> No sessions remaining this period.
                        {setActiveTab && <button className="text-primary underline ml-1" onClick={() => setActiveTab('billing')}>Upgrade</button>}
                      </p>
                    )}
                  </div>
                )}
                
                {stage === 'question' && questions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Question {currentQ + 1} of {questions.length}</Badge>
                      <span className="text-xs text-muted-foreground">{wordCount} words</span>
                    </div>
                    <p className="text-foreground font-medium">{questions[currentQ]}</p>
                    <div className="space-y-2">
                      <label htmlFor="user-answer" className="text-sm font-medium text-foreground">
                        Your Answer
                      </label>
                      <Textarea 
                        id="user-answer"
                        placeholder="Type your answer…" 
                        value={userAnswer} 
                        onChange={e => setUserAnswer(e.target.value)} 
                        rows={6}
                        aria-describedby="word-count"
                      />
                      <p id="word-count" className="text-xs text-muted-foreground text-right">
                        {wordCount} words
                      </p>
                    </div>
                    <Button onClick={submitAnswer} disabled={!userAnswer.trim() || loadingFeedback}>
                      {loadingFeedback ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing…</> : <><Send className="w-4 h-4 mr-2" />Submit Answer</>}
                    </Button>
                  </div>
                )}
                
                {stage === 'feedback' && currentFeedback && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${getScoreBackground(currentFeedback.score)}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-2xl font-bold ${getScoreColor(currentFeedback.score)}`}>{currentFeedback.score}/10</span>
                        <Badge className={`bg-gradient-to-r ${getScoreGradient(currentFeedback.score)} text-white`}>{getScoreLabel(currentFeedback.score)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{currentFeedback.feedback}</p>
                    </div>
                    {currentFeedback.strengths.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </p>
                        <ul className="space-y-1">
                          {currentFeedback.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground ml-5">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {currentFeedback.improvements.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Improvements
                        </p>
                        <ul className="space-y-1">
                          {currentFeedback.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground ml-5">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button onClick={nextQuestion}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {currentQ + 1 < questions.length ? 'Next Question' : 'See Results'}
                    </Button>
                  </div>
                )}
                
                {stage === 'results' && (
                  <div className="space-y-4 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getScoreBackground(overallScore)}`}>
                      <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">/ 10 overall</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      You answered {answers.length} question{answers.length !== 1 ? 's' : ''}.
                    </p>
                    <Button variant="outline" onClick={resetPractice}>
                      <RotateCcw className="w-4 h-4 mr-2" />Practice Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ===== INTERVIEW COPILOT (Elite Only) ===== */}
        {tab === 'copilot' && (
          <motion.div key="copilot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!isElite ? (
              <Card className="border-border/60">
                <CardContent className="p-8 text-center space-y-3">
                  <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="font-semibold text-lg">Elite Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Interview Copilot is available on the Elite plan only.
                  </p>
                  <Button onClick={() => setActiveTab?.('billing')}>
                    Upgrade to Elite
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 relative">
                <CardContent className="p-6 space-y-4">
                  {!copilotActive ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="copilot-position" className="text-sm font-medium text-foreground">
                            Position
                          </label>
                          <Input 
                            id="copilot-position"
                            placeholder="e.g. Software Engineer" 
                            value={copilotPosition} 
                            onChange={e => setCopilotPosition(e.target.value)} 
                            aria-required="true"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="copilot-company" className="text-sm font-medium text-foreground">
                            Company (optional)
                          </label>
                          <Input 
                            id="copilot-company"
                            placeholder="e.g. Google" 
                            value={copilotCompany} 
                            onChange={e => setCopilotCompany(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button onClick={startCopilot} disabled={!copilotPosition.trim() || !canUse('interview_prep')} className="flex-1">
                          <Radio className="w-4 h-4 mr-2" />Start Copilot Session
                        </Button>
                        {!canUse('interview_prep') && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> No sessions remaining. 
                            {setActiveTab && <button className="text-primary underline ml-1" onClick={() => setActiveTab('billing')}>Upgrade</button>}
                          </p>
                        )}
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <Shield className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">
                            <strong>AI-Powered:</strong> Get real-time suggestions for interview questions.
                            <br />
                            <span className="text-primary/60">🎙️ Use the mic to auto-detect questions.</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{remainingSessions} sessions remaining this month</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="animate-pulse">
                            <Radio className="w-3 h-3 mr-1" />Live
                          </Badge>
                          {isListening && (
                            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              <Mic className="w-3 h-3 mr-1" />Listening
                            </Badge>
                          )}
                          <StatusBadge status={connectionStatus} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {remainingSessions} sessions left
                          </span>
                          <Button 
                            variant={isListening ? "destructive" : "outline"} 
                            size="sm" 
                            onClick={toggleListening}
                            className={isListening ? "animate-pulse" : ""}
                            disabled={isMicInitializing}
                          >
                            {isMicInitializing ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : isListening ? (
                              <MicOff className="w-4 h-4 mr-1" />
                            ) : (
                              <Mic className="w-4 h-4 mr-1" />
                            )}
                            {isMicInitializing ? "Initializing..." : isListening ? "Stop Listening" : "Listen"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={endCopilot}>
                            End Session
                          </Button>
                        </div>
                      </div>

                      {/* Live Transcript Display */}
                      {isListening && transcript && (
                        <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Heard:</p>
                          <p className="text-sm text-foreground italic">"{transcript}"</p>
                        </div>
                      )}

                      <div className="space-y-3 max-h-96 overflow-y-auto" aria-live="polite">
                        {copilotEntries.map(entry => (
                          <div key={entry.id} className="p-3 rounded-lg border border-border/60 space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium text-foreground flex-1">{entry.question}</p>
                              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                {entry.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            {entry.loading ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 className="w-3 h-3 animate-spin" />Thinking…
                              </div>
                            ) : entry.suggestion && (
                              <div className="text-sm text-muted-foreground bg-primary/5 p-3 rounded">
                                <p className="font-medium text-primary/80 text-xs uppercase tracking-wider mb-1">
                                  💡 Suggested Talking Points
                                </p>
                                {entry.suggestion}
                              </div>
                            )}
                          </div>
                        ))}
                        <div ref={copilotBottomRef} />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <label htmlFor="copilot-question" className="text-sm font-medium text-foreground">
                            Ask Copilot
                          </label>
                          <div className="flex gap-2">
                            <Input 
                              id="copilot-question"
                              placeholder="Type a question or use the mic above…" 
                              value={copilotQuestion} 
                              onChange={e => setCopilotQuestion(e.target.value)} 
                              onKeyDown={e => e.key === 'Enter' && askCopilot()} 
                              disabled={copilotLoading}
                            />
                            <Button onClick={() => askCopilot()} disabled={!copilotQuestion.trim() || copilotLoading}>
                              <Send className="w-4 h-4" />
                              <span className="sr-only">Send question</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        <span>AI suggestions appear instantly. Use them as talking points, not a script.</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {tab === 'tips' && (
          <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-3 sm:grid-cols-2">
              {tips.map((tip, i) => (
                <Card key={i} className="border-border/60">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{tip.icon}</span>
                      <h3 className="font-medium text-foreground text-sm">{tip.title}</h3>
                      <Badge variant="secondary" className="ml-auto text-[10px]">{tip.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="sr-only">Loading history...</span>
              </div>
            ) : sessions.length === 0 ? (
              <Card className="border-border/60">
                <CardContent className="p-8 text-center space-y-3">
                  <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto" aria-hidden="true" />
                  <p className="text-muted-foreground text-sm">No sessions yet. Complete a practice round to see your history.</p>
                  <Button variant="outline" onClick={() => setTab('practice')}>
                    <Brain className="w-4 h-4 mr-2" />Start Practice
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-foreground">Interview History</h2>
                  <span className="text-xs text-muted-foreground">{sessions.length} sessions</span>
                </div>
                {sessions.map(session => (
                  <Card key={session.id} className="border-border/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm text-foreground">{session.position}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} · {session.answers.length} question{session.answers.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(session.overallScore)}`}>
                        {session.overallScore.toFixed(1)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Subcomponents =====

// Status Badge for Connection
const StatusBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const statusConfig = {
    idle: { label: 'Idle', icon: null, className: 'bg-muted/50 text-muted-foreground' },
    connecting: { label: 'Connecting...', icon: <Loader2 className="w-3 h-3 animate-spin" />, className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    connected: { label: 'Connected', icon: <Wifi className="w-3 h-3" />, className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    disconnected: { label: 'Disconnected', icon: <WifiOff className="w-3 h-3" />, className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    error: { label: 'Error', icon: <AlertTriangle className="w-3 h-3" />, className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.className} border text-xs flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

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
          <Mic className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" aria-hidden="true" />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Interview Coach</h1>
        <p className="text-xs text-muted-foreground">Practice before. Get help during. Win the offer.</p>
      </div>
    </div>

    {sessionsCount > 0 && (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
        <Trophy className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
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
  <div 
    className="inline-flex gap-0.5 p-1 rounded-xl bg-muted/60 border border-border/50"
    role="tablist"
    aria-label="Interview preparation sections"
  >
    {tabs.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        role="tab"
        aria-selected={activeTab === id}
        aria-label={`${label} section${id === 'history' && sessionsCount > 0 ? `, ${sessionsCount} items` : ''}`}
        className={`
          relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
          ${activeTab === id 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
          }
        `}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
        {id === 'history' && sessionsCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center"
            aria-label={`${sessionsCount} saved sessions`}
          >
            {sessionsCount > 9 ? '9+' : sessionsCount}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default InterviewPrep;
