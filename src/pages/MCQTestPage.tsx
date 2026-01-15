import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CATEGORIES, CLASSES } from '@/lib/constants';
import { CheckSquare, Clock, Target, CheckCircle, ClipboardList } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import type { ContentCategory } from '@/types/types';

export default function MCQTestPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ContentCategory>('mcq_tests');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(10);

  const mcqCategories = CATEGORIES.filter(cat => 
    cat.id === 'mcq_tests' || cat.id === 'iit_jee_questions'
  );

  const handleStartTest = () => {
    if (!selectedClass) {
      return;
    }

    navigate('/mcq-test/take', {
      state: {
        category,
        class: selectedClass,
        questionCount,
        timeLimit: timeLimit * 60, // Convert to seconds
      },
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl animate-float">
              <CheckCircle className="inline h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl gradient-text">MCQ टेस्ट</CardTitle>
          <CardDescription className="text-lg">
            अपना टेस्ट कॉन्फ़िगर करें और शुरू करें
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>टेस्ट प्रकार</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ContentCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mcqCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <DynamicIcon name={cat.icon} className="h-4 w-4" />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <Label>कक्षा</Label>
            <Select
              value={selectedClass?.toString() || ''}
              onValueChange={(value) => setSelectedClass(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="कक्षा चुनें" />
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

          {/* Question Count */}
          <div className="space-y-2">
            <Label>प्रश्नों की संख्या</Label>
            <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 प्रश्न</SelectItem>
                <SelectItem value="10">10 प्रश्न</SelectItem>
                <SelectItem value="15">15 प्रश्न</SelectItem>
                <SelectItem value="20">20 प्रश्न</SelectItem>
                <SelectItem value="25">25 प्रश्न</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <Label>समय सीमा</Label>
            <Select value={timeLimit.toString()} onValueChange={(value) => setTimeLimit(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 मिनट</SelectItem>
                <SelectItem value="10">10 मिनट</SelectItem>
                <SelectItem value="15">15 मिनट</SelectItem>
                <SelectItem value="20">20 मिनट</SelectItem>
                <SelectItem value="30">30 मिनट</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test Info */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-center">
              <CheckSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">{questionCount}</p>
              <p className="text-xs text-muted-foreground">प्रश्न</p>
            </div>
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-medium">{timeLimit} मिनट</p>
              <p className="text-xs text-muted-foreground">समय</p>
            </div>
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">{questionCount * 4}</p>
              <p className="text-xs text-muted-foreground">अंक</p>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartTest}
            disabled={!selectedClass}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
          >
            टेस्ट शुरू करें 🚀
          </Button>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2"><ClipboardList className="inline h-4 w-4" /> निर्देश:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>प्रत्येक प्रश्न के लिए 4 अंक</li>
              <li>गलत उत्तर के लिए कोई नकारात्मक अंकन नहीं</li>
              <li>समय समाप्त होने पर टेस्ट स्वचालित रूप से जमा हो जाएगा</li>
              <li>एक बार जमा करने के बाद उत्तर नहीं बदले जा सकते</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

