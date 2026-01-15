import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getTestHistory } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Target, Clock, TrendingUp, FileText } from 'lucide-react';
import { formatDate } from '@/lib/constants';
import type { TestResult } from '@/types/types';

export default function MCQTestHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTestHistory();
    }
  }, [user]);

  const loadTestHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getTestHistory(user.id);
      setTests(data);
    } catch (error) {
      console.error('Error loading test history:', error);
      toast({
        title: 'त्रुटि',
        description: 'टेस्ट इतिहास लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { label: 'उत्कृष्ट', variant: 'default' as const };
    if (percentage >= 75) return { label: 'बहुत अच्छा', variant: 'secondary' as const };
    if (percentage >= 60) return { label: 'अच्छा', variant: 'outline' as const };
    return { label: 'सुधार करें', variant: 'destructive' as const };
  };

  const calculateStats = () => {
    if (tests.length === 0) return null;

    const totalTests = tests.length;
    const avgScore = tests.reduce((sum, t) => sum + t.score, 0) / totalTests;
    const avgPercentage = tests.reduce((sum, t) => {
      const totalMarks = t.total_questions * 4;
      return sum + (t.score / totalMarks) * 100;
    }, 0) / totalTests;
    const bestScore = Math.max(...tests.map(t => t.score));

    return { totalTests, avgScore, avgPercentage, bestScore };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl animate-float">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold gradient-text">टेस्ट इतिहास</h1>
        <p className="text-muted-foreground">
          आपके सभी टेस्ट परिणाम
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalTests}</p>
                  <p className="text-xs text-muted-foreground">कुल टेस्ट</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgScore.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">औसत स्कोर</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgPercentage.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">औसत प्रतिशत</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.bestScore}</p>
                  <p className="text-xs text-muted-foreground">सर्वश्रेष्ठ स्कोर</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test History List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test) => {
            const totalMarks = test.total_questions * 4;
            const percentage = (test.score / totalMarks) * 100;
            const badge = getPerformanceBadge(percentage);

            return (
              <Card key={test.id} className="glass-card hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        कक्षा {test.class} - {test.category === 'mcq_tests' ? 'MCQ टेस्ट' : 'IIT-JEE प्रश्न'}
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {formatDate(test.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text">
                        {test.score}/{totalMarks}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{test.correct_answers}/{test.total_questions}</p>
                        <p className="text-xs text-muted-foreground">सही उत्तर</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatTime(test.time_taken)}</p>
                        <p className="text-xs text-muted-foreground">समय लिया</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {(test.time_taken / test.total_questions).toFixed(1)}s
                        </p>
                        <p className="text-xs text-muted-foreground">प्रति प्रश्न</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">कोई टेस्ट नहीं</h3>
            <p className="text-muted-foreground text-center mb-4">
              आपने अभी तक कोई टेस्ट नहीं दिया है
            </p>
            <Button onClick={() => navigate('/mcq-test')} className="bg-gradient-to-r from-primary to-secondary">
              पहला टेस्ट दें
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
