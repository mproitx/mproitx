import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { useToast } from '@/hooks/use-toast';
import { getContent, getSubjects, getChapters, addRecentlyViewed, addDownload } from '@/db/api';
import { getCategoryInfo, CLASSES, formatFileSize, formatDate, getFileTypeIcon } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Download, Eye, ArrowLeft, FileText } from 'lucide-react';
import type { Content } from '@/types/types';

export default function ContentBrowserPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  const categoryInfo = getCategoryInfo(category as any);

  // Load subjects when class is selected
  useEffect(() => {
    if (category && selectedClass) {
      setLoading(true);
      getSubjects(category, selectedClass)
        .then(setSubjects)
        .catch((error) => {
          console.error('Error loading subjects:', error);
          toast({
            title: 'त्रुटि',
            description: 'विषय लोड करने में विफल',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [category, selectedClass]);

  // Load chapters when subject is selected
  useEffect(() => {
    if (category && selectedClass && selectedSubject) {
      setLoading(true);
      getChapters(category, selectedClass, selectedSubject)
        .then(setChapters)
        .catch((error) => {
          console.error('Error loading chapters:', error);
          toast({
            title: 'त्रुटि',
            description: 'अध्याय लोड करने में विफल',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [category, selectedClass, selectedSubject]);

  // Load content when chapter is selected
  useEffect(() => {
    if (category && selectedClass && selectedSubject && selectedChapter) {
      setLoading(true);
      getContent({
        category: category as any,
        class: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter,
        search: searchQuery || undefined,
      })
        .then(setContent)
        .catch((error) => {
          console.error('Error loading content:', error);
          toast({
            title: 'त्रुटि',
            description: 'सामग्री लोड करने में विफल',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [category, selectedClass, selectedSubject, selectedChapter, searchQuery]);

  const handleViewContent = async (contentItem: Content) => {
    if (user) {
      await addRecentlyViewed(user.id, contentItem.id);
    }
    navigate(`/content/view/${contentItem.id}`);
  };

  const handleDownload = async (contentItem: Content) => {
    if (user) {
      await addDownload(user.id, contentItem.id);
    }
    window.open(contentItem.file_url, '_blank');
    toast({
      title: 'सफलता',
      description: 'डाउनलोड शुरू हो गया',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {categoryInfo?.icon && (
                <DynamicIcon name={categoryInfo.icon} className="h-8 w-8 xl:h-10 xl:w-10" />
              )}
              {categoryInfo?.name}
            </h1>
            <p className="text-muted-foreground">{categoryInfo?.description}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>फ़िल्टर</CardTitle>
          <CardDescription>अपनी सामग्री खोजने के लिए फ़िल्टर चुनें</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">कक्षा</label>
              <Select
                value={selectedClass?.toString() || ''}
                onValueChange={(value) => {
                  setSelectedClass(Number(value));
                  setSelectedSubject(null);
                  setSelectedChapter(null);
                  setContent([]);
                }}
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

            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">विषय</label>
              <Select
                value={selectedSubject || ''}
                onValueChange={(value) => {
                  setSelectedSubject(value);
                  setSelectedChapter(null);
                  setContent([]);
                }}
                disabled={!selectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="विषय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">अध्याय</label>
              <Select
                value={selectedChapter || ''}
                onValueChange={setSelectedChapter}
                disabled={!selectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="अध्याय चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          {selectedChapter && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="सामग्री खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </CardContent>
      </Card>

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
      ) : content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {content.map((item) => (
            <Card key={item.id} className="glass-card hover:shadow-hover transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DynamicIcon name={getFileTypeIcon(item.file_type)} className="h-6 w-6" />
                      {item.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {item.description || 'कोई विवरण नहीं'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{item.subject}</Badge>
                  <Badge variant="outline">{item.chapter}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>आकार: {formatFileSize(item.file_size)}</div>
                  <div>अपलोड: {formatDate(item.created_at)}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewContent(item)}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    देखें
                  </Button>
                  <Button
                    onClick={() => handleDownload(item)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedChapter ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">कोई सामग्री नहीं मिली</h3>
            <p className="text-muted-foreground text-center">
              इस अध्याय के लिए अभी तक कोई सामग्री उपलब्ध नहीं है
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">सामग्री खोजें</h3>
            <p className="text-muted-foreground text-center">
              कृपया ऊपर से कक्षा, विषय और अध्याय चुनें
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
