import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithUsername } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया सभी फ़ील्ड भरें',
        variant: 'destructive',
      });
      return;
    }

    // Validate username (only letters, numbers, and underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast({
        title: 'त्रुटि',
        description: 'यूज़रनेम में केवल अक्षर, संख्या और _ का उपयोग करें',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'त्रुटि',
        description: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'त्रुटि',
        description: 'पासवर्ड मेल नहीं खाते',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signUpWithUsername(username, password);
    setLoading(false);

    if (error) {
      toast({
        title: 'साइन अप विफल',
        description: error.message || 'कुछ गलत हो गया',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'सफलता',
        description: 'खाता बनाया गया! लॉगिन हो रहा है...',
      });
      // Auto login after signup
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
      <Card className="w-full max-w-md glass-card animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-float">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">PM - Roit</CardTitle>
          <CardDescription className="text-base">
            नया खाता बनाएं
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">यूज़रनेम</Label>
              <Input
                id="username"
                type="text"
                placeholder="यूज़रनेम चुनें (केवल अक्षर, संख्या, _)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="transition-all hover:border-primary focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">पासवर्ड</Label>
              <Input
                id="password"
                type="password"
                placeholder="पासवर्ड बनाएं (कम से कम 6 अक्षर)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="transition-all hover:border-primary focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="पासवर्ड फिर से दर्ज करें"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="transition-all hover:border-primary focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all hover-glow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  खाता बनाया जा रहा है...
                </>
              ) : (
                'साइन अप करें'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">पहले से खाता है? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              लॉगिन करें
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
