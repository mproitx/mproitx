import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { useToast } from '@/hooks/use-toast';
import { getContent, deleteContent } from '@/db/api';
import { CLASSES, CATEGORIES } from '@/lib/constants';
import { Loader2, Search, Trash2, Edit, FileText, Image, File, ArrowLeft } from 'lucide-react';
import type { Content } from '@/types/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminContentManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [searchQuery, selectedCategory, selectedClass, contents]);

  const loadContents = async () => {
    setLoading(true);
    try {
      const data = await getContent();
      setContents(data);
    } catch (error) {
      console.error('Error loading contents:', error);
      toast({
        title: 'त्रुटि',
        description: 'सामग्री लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.chapter?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((content) => content.category === selectedCategory);
    }

    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter((content) => content.class === Number(selectedClass));
    }

    setFilteredContents(filtered);
  };

  const handleDeleteClick = (content: Content) => {
    setContentToDelete(content);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    setDeleting(true);
    try {
      await deleteContent(contentToDelete.id);
      toast({
        title: 'सफलता',
        description: 'सामग्री सफलतापूर्वक हटाई गई',
      });
      loadContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'त्रुटि',
        description: 'सामग्री हटाने में विफल',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find((c) => c.id === category);
    return cat?.name || category;
  };

  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-7xl">
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin')}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-xl xl:text-2xl">सामग्री प्रबंधन</CardTitle>
                <CardDescription className="mt-1">
                  अपलोड की गई सामग्री को देखें, संपादित करें और हटाएं
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              कुल: {filteredContents.length} सामग्री
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 xl:p-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
            {/* Search */}
            <div className="xl:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="शीर्षक, विषय या अध्याय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="श्रेणी चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी श्रेणियां</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <DynamicIcon name={cat.icon} className="h-4 w-4" />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Class Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="कक्षा चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी कक्षाएं</SelectItem>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls} value={String(cls)}>
                    कक्षा {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">कोई सामग्री नहीं मिली</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' || selectedClass !== 'all'
                  ? 'फ़िल्टर बदलकर पुनः प्रयास करें'
                  : 'अभी तक कोई सामग्री अपलोड नहीं की गई है'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContents.map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* File Icon */}
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        {getFileIcon(content.file_type)}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm xl:text-base truncate">
                          {content.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(content.category)}
                          </Badge>
                          <span>•</span>
                          <span>कक्षा {content.class}</span>
                          {content.subject && (
                            <>
                              <span>•</span>
                              <span>{content.subject}</span>
                            </>
                          )}
                          {content.chapter && (
                            <>
                              <span>•</span>
                              <span>{content.chapter}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          अपलोड: {new Date(content.created_at).toLocaleDateString('hi-IN')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/content/view/${content.id}`)}
                          title="देखें"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(content)}
                          title="हटाएं"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप सुनिश्चित हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह सामग्री स्थायी रूप से हटा दी जाएगी। इस क्रिया को पूर्ववत नहीं किया जा सकता।
              {contentToDelete && (
                <div className="mt-3 p-3 rounded-lg bg-muted">
                  <p className="font-semibold text-sm text-foreground">
                    {contentToDelete.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryLabel(contentToDelete.category)} • कक्षा {contentToDelete.class}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  हटाया जा रहा है...
                </>
              ) : (
                'हटाएं'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
