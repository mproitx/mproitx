import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getContentById, addRecentlyViewed, addDownload } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { ArrowLeft, Download, Eye, BookOpen, Book, FileText, File } from 'lucide-react';
import { formatDate } from '@/lib/constants';
import type { Content } from '@/types/types';

export default function ContentViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadContent();
    }
  }, [id, user]);

  const loadContent = async () => {
    if (!id || !user) return;

    setLoading(true);
    try {
      const data = await getContentById(id);
      if (data) {
        setContent(data);
        // Track view
        await addRecentlyViewed(user.id, id);
      } else {
        toast({
          title: 'त्रुटि',
          description: 'सामग्री नहीं मिली',
          variant: 'destructive',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'त्रुटि',
        description: 'सामग्री लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!content || !user) return;

    try {
      // Track download
      await addDownload(user.id, content.id);

      // Download file
      const link = document.createElement('a');
      link.href = content.file_url;
      link.download = content.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'सफलता',
        description: 'डाउनलोड शुरू हो गया',
      });
    } catch (error) {
      console.error('Error downloading:', error);
      toast({
        title: 'त्रुटि',
        description: 'डाउनलोड करने में विफल',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 xl:p-6 space-y-4">
        <Skeleton className="h-12 w-full bg-muted" />
        <Skeleton className="h-[70vh] w-full bg-muted" />
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const isPDF = content.file_type === 'application/pdf' || content.file_url.toLowerCase().endsWith('.pdf');
  const isImage = content.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(content.file_url);

  return (
    <div className="container mx-auto p-4 xl:p-6 space-y-4">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl xl:text-2xl gradient-text break-words">
                  {content.title}
                </CardTitle>
                {content.description && (
                  <p className="text-sm text-muted-foreground mt-2 break-words">
                    {content.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span><BookOpen className="inline h-4 w-4" /> कक्षा {content.class}</span>
                  <span>•</span>
                  <span><Book className="inline h-4 w-4" /> {content.subject}</span>
                  <span>•</span>
                  <span><FileText className="inline h-4 w-4" /> {content.chapter}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatDate(content.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 w-full xl:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              डाउनलोड करें
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Content Viewer */}
      {isPDF ? (
        <PDFViewer 
          url={content.file_url} 
          title={content.title}
        />
      ) : isImage ? (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted/30 flex items-center justify-center min-h-[70vh] p-4">
              <img
                src={content.file_url}
                alt={content.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-6xl"><File className="inline h-16 w-16" /></div>
            <h3 className="text-xl font-semibold">पूर्वावलोकन उपलब्ध नहीं</h3>
            <p className="text-muted-foreground text-center max-w-md">
              इस फाइल का पूर्वावलोकन नहीं दिखाया जा सकता। कृपया डाउनलोड करें।
            </p>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              डाउनलोड करें
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
