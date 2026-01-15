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
import { Loader2, Plus, CheckCircle, Lightbulb, ClipboardList } from 'lucide-react';

export default function AdminMCQUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [uploading, setUploading] = useState(false);

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
        category: 'mcq_tests',
        class: selectedClass,
        subject,
        chapter,
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
        explanation: explanation || null,
        difficulty,
        created_by: user.id,
      });

      toast({
        title: 'सफलता',
        description: 'प्रश्न सफलतापूर्वक जोड़ा गया',
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
      console.error('Error creating MCQ:', error);
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
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl xl:text-2xl gradient-text">MCQ प्रश्न अपलोड करें</CardTitle>
              <CardDescription className="text-base mt-2">
                बहुविकल्पीय प्रश्न और उत्तर जोड़ें
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              वापस जाएं
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class, Subject, Chapter */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>कक्षा *</Label>
              <Select value={selectedClass.toString()} onValueChange={(value) => setSelectedClass(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls.toString()}>
                      कक्षा {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">विषय *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="जैसे: Physics, Chemistry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">अध्याय *</Label>
              <Input
                id="chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="जैसे: Chapter 1"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>कठिनाई स्तर</Label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">आसान</SelectItem>
                <SelectItem value="medium">मध्यम</SelectItem>
                <SelectItem value="hard">कठिन</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">प्रश्न *</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="प्रश्न यहाँ लिखें..."
              rows={3}
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

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">व्याख्या (वैकल्पिक)</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="सही उत्तर की व्याख्या..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                जोड़ा जा रहा है...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                प्रश्न जोड़ें
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2"><ClipboardList className="inline h-4 w-4" /> निर्देश:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>प्रश्न स्पष्ट और संक्षिप्त होना चाहिए</li>
              <li>सभी 4 विकल्प (A, B, C, D) भरें</li>
              <li>सही उत्तर को ✓ बटन से चिह्नित करें</li>
              <li>व्याख्या छात्रों को समझने में मदद करती है</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
