import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="glass-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-8xl animate-bounce-slow">
              🔍
            </div>
          </div>
          <CardTitle className="text-4xl gradient-text mb-2">404</CardTitle>
          <p className="text-xl font-semibold">पेज नहीं मिला</p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            क्षमा करें, आप जो पेज खोज रहे हैं वह मौजूद नहीं है।
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              वापस जाएं
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Home className="mr-2 h-4 w-4" />
              होम पेज
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
