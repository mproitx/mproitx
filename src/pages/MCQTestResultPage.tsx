import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Clock, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MCQTestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score,
    totalMarks,
    correctAnswers,
    totalQuestions,
    percentage,
    timeTaken,
  } = location.state || {};

  if (!score && score !== 0) {
    navigate('/mcq-test');
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} मिनट ${secs} सेकंड`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: 'उत्कृष्ट! 🎉', color: 'text-green-500' };
    if (percentage >= 75) return { message: 'बहुत अच्छा! 👏', color: 'text-blue-500' };
    if (percentage >= 60) return { message: 'अच्छा प्रयास! 👍', color: 'text-yellow-500' };
    if (percentage >= 40) return { message: 'और मेहनत करें! 💪', color: 'text-orange-500' };
    return { message: 'अधिक अभ्यास की जरूरत है! <BookOpen className="inline h-4 w-4" />', color: 'text-red-500' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Result Header */}
      <Card className="glass-card mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl animate-bounce-slow">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl gradient-text mb-2">
            टेस्ट पूर्ण!
          </CardTitle>
          <p className={`text-2xl font-bold ${performance.color}`}>
            {performance.message}
          </p>
        </CardHeader>
      </Card>

      {/* Score Card */}
      <Card className="glass-card mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold gradient-text mb-2">
              {score}/{totalMarks}
            </div>
            <p className="text-muted-foreground">कुल अंक</p>
          </div>
          <Progress value={percentage} className="h-4 mb-2" />
          <p className="text-center text-sm text-muted-foreground">
            {percentage.toFixed(1)}% सही
          </p>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{correctAnswers}</p>
                <p className="text-sm text-muted-foreground">सही उत्तर</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalQuestions - correctAnswers}</p>
                <p className="text-sm text-muted-foreground">गलत उत्तर</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalQuestions}</p>
                <p className="text-sm text-muted-foreground">कुल प्रश्न</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatTime(timeTaken)}</p>
                <p className="text-sm text-muted-foreground">समय लिया</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>प्रदर्शन विश्लेषण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">सटीकता</span>
            <span className="font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={percentage} />

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">प्रति प्रश्न औसत समय</span>
            <span className="font-semibold">
              {(timeTaken / totalQuestions).toFixed(1)} सेकंड
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <Home className="mr-2 h-4 w-4" />
          होम
        </Button>
        <Button
          onClick={() => navigate('/mcq-test/history')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <Trophy className="mr-2 h-4 w-4" />
          इतिहास
        </Button>
        <Button
          onClick={() => navigate('/mcq-test')}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-secondary"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          फिर से टेस्ट दें
        </Button>
      </div>
    </div>
  );
}
