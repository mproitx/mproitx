import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createMCQQuestion } from '@/db/api';
import { CLASSES } from '@/lib/constants';
import { Loader2, CheckCircle, ArrowLeft, Zap, Lightbulb, ClipboardList } from 'lucide-react';

export default function AdminIITJEEUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedClass, setSelectedClass] = useState<number>(11);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [uploading, setUploading] = useState(false);

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];

  const handleSubmit = async () => {
    // Validation
    if (!subject || !chapter || !question || !optionA || !optionB || !optionC || !optionD) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया सभी आवश्यक फ़ील्ड भरें',
        variant: 'destructive',
      });
      return;
    }

    if (!explanation) {
      toast({
        title: 'चेतावनी',
        description: 'IIT-JEE प्रश्नों के लिए व्याख्या अनिवार्य है',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया लॉगिन करें',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      await createMCQQuestion({
        category: 'iit_jee_questions',
        class: selectedClass,
        subject,
        chapter,
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
        explanation,
        difficulty: 'hard', // IIT-JEE questions are always hard
        created_by: user.id,
      });

      toast({
        title: 'सफलता',
        description: 'IIT-JEE प्रश्न सफलतापूर्वक जोड़ा गया',
      });

      // Reset form
      setQuestion('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      setExplanation('');
    } catch (error) {
      console.error('Error creating IIT-JEE question:', error);
      toast({
        title: 'त्रुटि',
        description: 'प्रश्न जोड़ने में विफल',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-4xl">
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl xl:text-2xl">IIT-JEE प्रश्न अपलोड</CardTitle>
                <CardDescription className="mt-1">
                  Advanced level के प्रश्न जोड़ें (कक्षा 11-12)
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 xl:p-6 space-y-6">
          {/* Class and Subject Selection */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>कक्षा *</Label>
              <Select
                value={String(selectedClass)}
                onValueChange={(value) => setSelectedClass(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.filter((cls) => cls >= 11).map((cls) => (
                    <SelectItem key={cls} value={String(cls)}>
                      कक्षा {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>विषय *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="विषय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter */}
          <div className="space-y-2">
            <Label htmlFor="chapter">अध्याय *</Label>
            <Input
              id="chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="उदाहरण: Thermodynamics, Organic Chemistry, Calculus"
            />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">प्रश्न *</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="IIT-JEE level का प्रश्न लिखें..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>विकल्प *</Label>

            <div className="space-y-3">
              {/* Option A */}
              <div className="flex items-center gap-2">
                <Button
                  variant={correctAnswer === 'A' ? 'default' : 'outline'}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setCorrectAnswer('A')}
                  title="सही उत्तर के रूप में चिह्नित करें"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-6">A.</span>
                <Input
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="विकल्प A"
                  className="flex-1"
                />
              </div>

              {/* Option B */}
              <div className="flex items-center gap-2">
                <Button
                  variant={correctAnswer === 'B' ? 'default' : 'outline'}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setCorrectAnswer('B')}
                  title="सही उत्तर के रूप में चिह्नित करें"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-6">B.</span>
                <Input
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="विकल्प B"
                  className="flex-1"
                />
              </div>

              {/* Option C */}
              <div className="flex items-center gap-2">
                <Button
                  variant={correctAnswer === 'C' ? 'default' : 'outline'}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setCorrectAnswer('C')}
                  title="सही उत्तर के रूप में चिह्नित करें"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-6">C.</span>
                <Input
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="विकल्प C"
                  className="flex-1"
                />
              </div>

              {/* Option D */}
              <div className="flex items-center gap-2">
                <Button
                  variant={correctAnswer === 'D' ? 'default' : 'outline'}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setCorrectAnswer('D')}
                  title="सही उत्तर के रूप में चिह्नित करें"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-6">D.</span>
                <Input
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="विकल्प D"
                  className="flex-1"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <Lightbulb className="inline h-4 w-4" /> सही उत्तर को <CheckCircle className="inline h-3 w-3" /> बटन से चिह्नित करें
            </p>
          </div>

          {/* Explanation - MANDATORY for IIT-JEE */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="flex items-center gap-2">
              विस्तृत व्याख्या *
              <span className="text-xs text-destructive">(अनिवार्य)</span>
            </Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Step-by-step solution और concept explanation लिखें..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              IIT-JEE प्रश्नों के लिए विस्तृत व्याख्या आवश्यक है
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                प्रश्न जोड़ा जा रहा है...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                IIT-JEE प्रश्न जोड़ें
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2"><ClipboardList className="inline h-4 w-4" /> IIT-JEE प्रश्न निर्देश:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>केवल कक्षा 11 और 12 के लिए</li>
              <li>Advanced level के conceptual प्रश्न</li>
              <li>सभी 4 विकल्प (A, B, C, D) भरें</li>
              <li>विस्तृत व्याख्या अनिवार्य है</li>
              <li>Step-by-step solution दें</li>
              <li>Concepts और formulas explain करें</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
