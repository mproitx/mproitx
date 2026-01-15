import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getMCQQuestions, saveTestResult } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import type { MCQQuestion } from '@/types/types';

export default function TakeMCQTestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { category, class: testClass, questionCount, timeLimit } = location.state || {};

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 600);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || !testClass) {
      navigate('/mcq-test');
      return;
    }

    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getMCQQuestions({
        category,
        class: testClass,
        limit: questionCount,
      });

      if (data.length === 0) {
        toast({
          title: 'कोई प्रश्न नहीं',
          description: 'इस कक्षा के लिए अभी तक कोई प्रश्न उपलब्ध नहीं है',
          variant: 'destructive',
        });
        navigate('/mcq-test');
        return;
      }

      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: 'त्रुटि',
        description: 'प्रश्न लोड करने में विफल',
        variant: 'destructive',
      });
      navigate('/mcq-test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Calculate score
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correctAnswers++;
      }
    });

    const score = correctAnswers * 4; // 4 marks per question
    const totalMarks = questions.length * 4;
    const percentage = (score / totalMarks) * 100;

    try {
      await saveTestResult({
        user_id: user.id,
        category,
        class: testClass,
        subject: 'General', // Default subject
        chapter: null,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        score,
        time_taken: timeLimit - timeRemaining,
        answers: answers,
      });

      navigate('/mcq-test/result', {
        state: {
          score,
          totalMarks,
          correctAnswers,
          totalQuestions: questions.length,
          percentage,
          timeTaken: timeLimit - timeRemaining,
        },
      });
    } catch (error: any) {
      console.error('Error saving test result:', error);
      toast({
        title: 'त्रुटि',
        description: error?.message || 'परिणाम सहेजने में विफल',
        variant: 'destructive',
      });
      
      // Still navigate to result page even if save fails
      navigate('/mcq-test/result', {
        state: {
          score,
          totalMarks,
          correctAnswers,
          totalQuestions: questions.length,
          percentage,
          timeTaken: timeLimit - timeRemaining,
          saveError: true,
        },
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold">प्रश्न:</span> {currentQuestion + 1}/{questions.length}
              </div>
              <div className="text-sm">
                <span className="font-semibold">उत्तर दिए:</span> {answeredCount}/{questions.length}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeRemaining < 60 ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            प्रश्न {currentQuestion + 1}: {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[currentQ.id] || ''}
            onValueChange={handleAnswerChange}
          >
            {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, index) => {
              const optionValue = currentQ[optionKey as keyof MCQQuestion] as string;
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

              return (
                <div
                  key={optionKey}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    answers[currentQ.id] === optionLabel
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerChange(optionLabel)}
                >
                  <RadioGroupItem value={optionLabel} id={`${optionKey}-${currentQuestion}`} />
                  <Label htmlFor={`${optionKey}-${currentQuestion}`} className="flex-1 cursor-pointer">
                    <span className="font-semibold mr-2">{optionLabel}.</span>
                    {optionValue}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          पिछला
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary"
        >
          अगला
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={handleSubmit}
          variant="outline"
          size="lg"
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Flag className="mr-2 h-4 w-4" />
          जमा करें
        </Button>
      </div>

      {/* Question Navigator */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="text-sm">प्रश्न नेविगेटर</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                  index === currentQuestion
                    ? 'bg-primary text-white'
                    : answers[questions[index].id]
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
