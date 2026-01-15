import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFile, createContent } from '@/db/api';
import { CATEGORIES, CLASSES, compressImage, sanitizeFileName } from '@/lib/constants';
import { Loader2, Upload, FileText, CheckCircle, X, ClipboardList } from 'lucide-react';
import type { ContentCategory } from '@/types/types';

interface FileUpload {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function AdminContentUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [category, setCategory] = useState<ContentCategory>('notes');
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const newFiles: FileUpload[] = selectedFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (!subject || !chapter || files.length === 0 || !user) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया सभी आवश्यक फ़ील्ड भरें और फाइलें चुनें',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    for (const fileUpload of files) {
      if (fileUpload.status === 'success') continue;

      try {
        // Update status
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, status: 'uploading', progress: 0 } : f
        ));

        let fileToUpload = fileUpload.file;

        // Compress if image
        if (fileUpload.file.type.startsWith('image/')) {
          fileToUpload = await compressImage(fileUpload.file);
        }

        // Sanitize filename
        const sanitizedName = sanitizeFileName(fileToUpload.name);
        const filePath = `${category}/${selectedClass}/${subject}/${chapter}/${Date.now()}_${sanitizedName}`;

        // Upload to Supabase Storage
        const fileUrl = await uploadFile('app-8vqzns7lohkx_content_files', filePath, fileToUpload);

        // Create content record
        await createContent({
          category,
          class: selectedClass,
          subject,
          chapter,
          title: title || fileUpload.file.name,
          description: description || null,
          file_url: fileUrl,
          file_type: fileUpload.file.type,
          file_size: fileUpload.file.size,
          uploaded_by: user.id,
        });

        // Update status to success
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, status: 'success', progress: 100 } : f
        ));

      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'अपलोड विफल'
          } : f
        ));
      }
    }

    setUploading(false);

    const successCount = files.filter(f => f.status === 'success').length;
    const errorCount = files.filter(f => f.status === 'error').length;

    if (errorCount === 0) {
      toast({
        title: 'सफलता',
        description: `${successCount} फाइलें सफलतापूर्वक अपलोड हो गईं`,
      });
      // Reset form
      setFiles([]);
      setTitle('');
      setDescription('');
    } else {
      toast({
        title: 'आंशिक सफलता',
        description: `${successCount} सफल, ${errorCount} विफल`,
        variant: 'destructive',
      });
    }
  };

  const contentCategories = CATEGORIES.filter(cat => 
    cat.id !== 'mcq_tests' && cat.id !== 'iit_jee_questions'
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl gradient-text">सामग्री अपलोड करें</CardTitle>
              <CardDescription className="text-base mt-2">
                PDF, छवियां और अन्य शैक्षिक सामग्री अपलोड करें
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              वापस जाएं
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>श्रेणी *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ContentCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentCategories.map((cat) => (
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

            <div className="space-y-2">
              <Label>कक्षा *</Label>
              <Select value={selectedClass.toString()} onValueChange={(value) => setSelectedClass(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          {/* Subject and Chapter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">विषय *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="जैसे: Physics, Chemistry, Mathematics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">अध्याय *</Label>
              <Input
                id="chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="जैसे: Chapter 1, Motion"
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <Label htmlFor="title">शीर्षक (वैकल्पिक)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="फाइल का शीर्षक (खाली छोड़ने पर फाइल नाम उपयोग होगा)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">विवरण (वैकल्पिक)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="सामग्री का संक्षिप्त विवरण"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>फाइलें *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">फाइलें अपलोड करने के लिए क्लिक करें</p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, GIF, WEBP (अधिकतम 1MB प्रति फाइल)
                </p>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>चयनित फाइलें ({files.length})</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !subject || !chapter}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                अपलोड हो रहा है...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                अपलोड करें ({files.length} फाइलें)
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2"><ClipboardList className="inline h-4 w-4" /> निर्देश:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>सभी फाइलें 1MB से कम होनी चाहिए</li>
              <li>छवियां स्वचालित रूप से संपीड़ित हो जाएंगी</li>
              <li>एक बार में कई फाइलें अपलोड कर सकते हैं</li>
              <li>विषय और अध्याय नाम सही लिखें</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
