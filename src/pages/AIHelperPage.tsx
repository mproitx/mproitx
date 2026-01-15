import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { Loader2, Send, Brain, User, Sparkles, BookOpen, Lightbulb, Zap, Ruler, Beaker, Calculator, GraduationCap } from 'lucide-react';
import type { ChatMessage } from '@/types/types';

// Typing effect component
function TypingText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayedText}</span>;
}

export default function AIHelperPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: 'नमस्ते! मैं PM Roit AI Assistant हूं। 🎓\n\nमैं आपकी मदद कर सकता हूं:\n• 📐 Physics - गति, बल, ऊर्जा, विद्युत\n• 🧪 Chemistry - रासायनिक अभिक्रियाएं, तत्व, यौगिक\n• 🔢 Mathematics - बीजगणित, ज्यामिति, कलन\n\nकृपया अपना सवाल पूछें और मैं विस्तृत उत्तर दूंगा।',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>('1'); // Track which message is typing
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages, loading]);

  // Also scroll during typing animation
  useEffect(() => {
    if (typingMessageId && scrollRef.current) {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [typingMessageId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = messages
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      apiMessages.push({
        role: 'user',
        content: userMessage.content,
      });

      const { data, error } = await supabase.functions.invoke('ai-helper', {
        body: { messages: apiMessages },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('AI Helper error:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message || 'AI सेवा में त्रुटि');
      }

      if (data?.response) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setTypingMessageId(aiMessage.id); // Enable typing effect for this message
      } else {
        throw new Error('कोई उत्तर नहीं मिला');
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: 'त्रुटि',
        description: error instanceof Error ? error.message : 'AI से संपर्क करने में विफल',
        variant: 'destructive',
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'क्षमा करें, मुझे आपके सवाल का जवाब देने में समस्या हो रही है। कृपया पुनः प्रयास करें।',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    { icon: BookOpen, text: 'न्यूटन के गति के नियम समझाएं', color: 'from-blue-500 to-cyan-500' },
    { icon: Lightbulb, text: 'रासायनिक बंधन क्या है?', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, text: 'द्विघात समीकरण कैसे हल करें?', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4 xl:p-6 max-w-5xl h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] xl:h-[calc(100vh-8rem)]">
      <Card className="glass-card h-full flex flex-col overflow-hidden border-2 border-primary/20 shadow-2xl">
        {/* Elegant Header */}
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-3 sm:p-4 xl:p-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-16 xl:h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-glow shadow-lg">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 xl:h-8 xl:w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg xl:text-2xl gradient-text flex items-center gap-1 sm:gap-2 break-words">
                  <span className="truncate">PM Roit AI</span>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary animate-pulse shrink-0" />
                </CardTitle>
                <CardDescription className="text-xs xl:text-base mt-0.5 sm:mt-1 hidden sm:block xl:block">
                  <span className="hidden xl:inline">आपका व्यक्तिगत शिक्षा सहायक • Physics • Chemistry • Mathematics</span>
                  <span className="xl:hidden">शिक्षा सहायक</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="px-2 py-0.5 sm:px-2 sm:py-1 xl:px-4 xl:py-2 text-xs xl:text-sm font-semibold shrink-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 xl:mr-2 animate-pulse"></span>
              <span className="hidden sm:inline xl:inline">ऑनलाइन</span>
              <span className="sm:hidden">●</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 p-2 sm:p-3 xl:p-6 overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="space-y-3 sm:space-y-4 xl:space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 sm:space-x-2 xl:space-x-4 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Avatar className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 xl:w-12 xl:h-12 border-2 ${
                    message.role === 'user' 
                      ? 'border-accent shadow-lg shadow-accent/20' 
                      : 'border-primary shadow-lg shadow-primary/20'
                  }`}>
                    <AvatarFallback className={`${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-accent to-secondary'
                        : 'bg-gradient-to-br from-primary to-secondary'
                    } text-white`}>
                      {message.role === 'user' ? <User className="h-3 w-3 sm:h-4 sm:w-4 xl:h-6 xl:w-6" /> : <Brain className="h-3 w-3 sm:h-4 sm:w-4 xl:h-6 xl:w-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 rounded-2xl p-2.5 sm:p-3 xl:p-5 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-accent/10 via-secondary/10 to-accent/5 border border-accent/20'
                        : 'bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20'
                    }`}
                  >
                    <p className="text-xs sm:text-xs xl:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.role === 'model' && typingMessageId === message.id ? (
                        <TypingText text={message.content} speed={15} />
                      ) : (
                        message.content
                      )}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 xl:mt-3 flex items-center gap-1 sm:gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                      {message.timestamp.toLocaleTimeString('hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start space-x-2 sm:space-x-2 xl:space-x-4 animate-fade-in">
                  <Avatar className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 xl:w-12 xl:h-12 border-2 border-primary shadow-lg shadow-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 xl:h-6 xl:w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-2xl p-2.5 sm:p-3 xl:p-5 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/20 shadow-md">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                      <span className="text-xs sm:text-sm font-medium">सोच रहा हूं...</span>
                      <div className="flex space-x-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-2 sm:px-3 xl:px-6 pb-2 sm:pb-3 xl:pb-4">
              <p className="text-xs xl:text-sm text-muted-foreground mb-2 xl:mb-3 font-medium"><Lightbulb className="inline h-4 w-4" /> त्वरित प्रश्न:</p>
              <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-2 xl:gap-3">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(q.text)}
                    className={`p-2 xl:p-3 rounded-xl bg-gradient-to-br ${q.color} bg-opacity-10 hover:bg-opacity-20 transition-all border border-border/50 hover:border-primary/50 text-left group`}
                  >
                    <q.icon className="h-4 w-4 xl:h-5 xl:w-5 mb-1 xl:mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-medium">{q.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border/50 p-2 sm:p-3 xl:p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
            <div className="flex items-end space-x-2 xl:space-x-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="अपना सवाल यहां लिखें..."
                  className="min-h-[50px] sm:min-h-[60px] xl:min-h-[80px] max-h-[100px] sm:max-h-[120px] xl:max-h-[160px] resize-none pr-10 sm:pr-12 border-2 focus:border-primary/50 rounded-xl shadow-inner text-xs sm:text-sm"
                  disabled={loading}
                  maxLength={1000}
                />
                <div className="absolute bottom-1.5 sm:bottom-2 xl:bottom-3 right-1.5 sm:right-2 xl:right-3 text-[10px] sm:text-xs text-muted-foreground">
                  {input.length}/1000
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 h-[50px] sm:h-[60px] xl:h-[80px] px-3 sm:px-4 xl:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" />
                )}
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 xl:mt-3 text-center flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>विस्तृत जवाब के लिए स्पष्ट सवाल पूछें</span>
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

