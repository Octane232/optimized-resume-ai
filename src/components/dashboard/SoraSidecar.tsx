import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Briefcase, TrendingUp, Target, Lightbulb, FileText, Mic, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SoraSidecarProps {
  mode: 'hunter' | 'growth';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

// Quick suggestion chips
const quickChips = [
  { label: 'Review resume', action: 'Review my resume and suggest improvements', icon: FileText },
  { label: 'Find jobs', action: 'Help me find relevant job opportunities', icon: Search },
  { label: 'Interview tips', action: 'Give me interview tips for my next interview', icon: Mic },
];

const SoraSidecar: React.FC<SoraSidecarProps> = ({ mode }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const hunterInsights = [
    { icon: Target, title: 'Active Job Alerts', content: '3 new high-match roles found today' },
    { icon: Lightbulb, title: 'Interview Tip', content: 'Practice STAR method for behavioral questions' },
    { icon: Briefcase, title: 'Application Reminder', content: 'Google deadline in 2 days' },
  ];

  const growthInsights = [
    { icon: TrendingUp, title: 'Skill Gap', content: 'Add "Budget Management" for next promotion' },
    { icon: Lightbulb, title: 'Salary Insight', content: 'You\'re 12% below market rate' },
    { icon: Sparkles, title: 'Weekly Win', content: 'Don\'t forget to log your achievements' },
  ];

  const insights = mode === 'hunter' ? hunterInsights : growthInsights;
  const accentColor = mode === 'hunter' ? 'hsl(217, 100%, 50%)' : 'hsl(262, 83%, 58%)';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const msgToSend = customMessage || message;
    if (!msgToSend.trim() || isLoading) return;
    
    const userMessage: Message = { 
      role: 'user', 
      content: msgToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('vaylance-chat', {
        body: { 
          messages: [...messages, userMessage],
          mode 
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: 'AI Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.content,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Vaylance AI Header with Orb */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div 
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}, ${mode === 'hunter' ? 'hsl(230, 80%, 45%)' : 'hsl(280, 70%, 45%)'})`,
              boxShadow: `0 0 20px ${accentColor}40`
            }}
          >
            <div className="absolute inset-0 rounded-full animate-pulse opacity-50" 
              style={{ background: `radial-gradient(circle, ${accentColor}40, transparent)` }} 
            />
            <Sparkles className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <h3 className="font-semibold">Vaylance AI</h3>
            <p className="text-xs text-muted-foreground">Your AI Career Assistant</p>
          </div>
        </div>
      </div>

      {/* Context-Aware Feed */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div 
                key={index}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.content}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="pt-4 border-t border-border space-y-3">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'message-user text-primary-foreground rounded-br-md' 
                        : 'message-ai rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.timestamp && (
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="message-ai rounded-2xl rounded-bl-md text-muted-foreground">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestion Chips */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip.action)}
                className="quick-chip flex items-center gap-1.5"
                disabled={isLoading}
              >
                <chip.icon className="w-3 h-3" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Vaylance AI anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            className="flex-1 rounded-xl"
          />
          <Button 
            size="icon" 
            onClick={() => handleSend()}
            disabled={isLoading || !message.trim()}
            className="rounded-xl transition-transform hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoraSidecar;
