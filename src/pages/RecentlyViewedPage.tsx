import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { useToast } from '@/hooks/use-toast';
import { getRecentlyViewed } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Clock, FileText } from 'lucide-react';
import { formatDate, getFileTypeIcon } from '@/lib/constants';
import type { RecentlyViewed } from '@/types/types';

export default function RecentlyViewedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<RecentlyViewed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentlyViewed();
    }
  }, [user]);

  const loadRecentlyViewed = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getRecentlyViewed(user.id, 20);
      setItems(data);
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      toast({
        title: 'त्रुटि',
        description: 'हाल ही में देखी गई सामग्री लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (contentId: string) => {
    navigate(`/content/view/${contentId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl animate-float">
            <Clock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold gradient-text">हाल ही में देखा गया</h1>
        <p className="text-muted-foreground">
          आपके द्वारा हाल ही में देखी गई सामग्री
        </p>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="glass-card hover:shadow-hover transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DynamicIcon name={getFileTypeIcon(item.content?.file_type || '')} className="h-6 w-6" />
                      {item.content?.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {item.content?.description || 'कोई विवरण नहीं'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">कक्षा {item.content?.class}</Badge>
                  <Badge variant="outline">{item.content?.subject}</Badge>
                  <Badge variant="outline">{item.content?.chapter}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  देखा गया: {formatDate(item.viewed_at)}
                </div>
                <Button
                  onClick={() => handleViewContent(item.content_id)}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  size="sm"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  फिर से देखें
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">कोई सामग्री नहीं</h3>
            <p className="text-muted-foreground text-center mb-4">
              आपने अभी तक कोई सामग्री नहीं देखी है
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-primary to-secondary">
              सामग्री देखें
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
