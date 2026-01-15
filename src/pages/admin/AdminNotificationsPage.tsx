import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createNotification } from '@/db/api';
import { Loader2, Send, Bell, BookOpen, ClipboardList } from 'lucide-react';

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'new_content' | 'exam_reminder' | 'announcement' | 'system'>('announcement');
  const [targetClass, setTargetClass] = useState<string>('all');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title || !message) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया शीर्षक और संदेश भरें',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    try {
      await createNotification({
        title,
        message,
        type,
        metadata: targetClass === 'all' ? null : { target_class: Number(targetClass) },
        sent_by: null, // Will be set by RLS
      });

      toast({
        title: 'सफलता',
        description: 'सूचना सफलतापूर्वक भेजी गई',
      });

      // Reset form
      setTitle('');
      setMessage('');
      setType('announcement');
      setTargetClass('all');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'त्रुटि',
        description: 'सूचना भेजने में विफल',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-4xl">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl xl:text-2xl gradient-text">सूचनाएं भेजें</CardTitle>
              <CardDescription className="text-base mt-2">
                छात्रों को घोषणाएं और अपडेट भेजें
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              वापस जाएं
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type and Target Class */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>सूचना प्रकार</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">📢 घोषणा</SelectItem>
                  <SelectItem value="new_content"><BookOpen className="inline h-4 w-4" /> नई सामग्री</SelectItem>
                  <SelectItem value="exam_reminder">⏰ परीक्षा अनुस्मारक</SelectItem>
                  <SelectItem value="system">⚙️ सिस्टम</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>लक्षित कक्षा</Label>
              <Select value={targetClass} onValueChange={setTargetClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी कक्षाएं</SelectItem>
                  <SelectItem value="8">कक्षा 8</SelectItem>
                  <SelectItem value="9">कक्षा 9</SelectItem>
                  <SelectItem value="10">कक्षा 10</SelectItem>
                  <SelectItem value="11">कक्षा 11</SelectItem>
                  <SelectItem value="12">कक्षा 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">शीर्षक *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="सूचना का शीर्षक..."
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">संदेश *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="सूचना का विस्तृत संदेश..."
              rows={6}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>पूर्वावलोकन</Label>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base break-words">
                      {title || 'शीर्षक यहाँ दिखेगा'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      {message || 'संदेश यहाँ दिखेगा'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>
                        {type === 'announcement' && '📢 घोषणा'}
                        {type === 'new_content' && '<BookOpen className="inline h-4 w-4" /> नई सामग्री'}
                        {type === 'exam_reminder' && '⏰ परीक्षा अनुस्मारक'}
                        {type === 'system' && '⚙️ सिस्टम'}
                      </span>
                      <span>•</span>
                      <span>
                        {targetClass === 'all' ? 'सभी कक्षाएं' : `कक्षा ${targetClass}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={sending || !title || !message}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                भेजा जा रहा है...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                सूचना भेजें
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2"><ClipboardList className="inline h-4 w-4" /> निर्देश:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>शीर्षक संक्षिप्त और स्पष्ट रखें (अधिकतम 100 अक्षर)</li>
              <li>संदेश में सभी महत्वपूर्ण जानकारी शामिल करें</li>
              <li>सही सूचना प्रकार चुनें (जानकारी, सफलता, चेतावनी, घोषणा)</li>
              <li>विशिष्ट कक्षा या सभी कक्षाओं को लक्षित करें</li>
              <li>भेजने से पहले पूर्वावलोकन जांचें</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
