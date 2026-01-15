import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया सभी फ़ील्ड भरें',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await signInWithUsername(username, password);
    setLoading(false);

    if (error) {
      toast({
        title: 'लॉगिन विफल',
        description: 'गलत यूज़रनेम या पासवर्ड',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'सफलता',
        description: 'लॉगिन सफल रहा!',
      });
      navigate(from, { replace: true });
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
            अपने खाते में लॉगिन करें
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">यूज़रनेम</Label>
              <Input
                id="username"
                type="text"
                placeholder="अपना यूज़रनेम दर्ज करें"
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
                placeholder="अपना पासवर्ड दर्ज करें"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  लॉगिन हो रहा है...
                </>
              ) : (
                'लॉगिन करें'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">खाता नहीं है? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              साइन अप करें
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
