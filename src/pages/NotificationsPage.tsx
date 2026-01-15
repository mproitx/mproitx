import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getUserNotifications, markNotificationAsRead } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle, AlertCircle, Info, Megaphone } from 'lucide-react';
import { formatDate } from '@/lib/constants';
import type { UserNotification } from '@/types/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'त्रुटि',
        description: 'सूचनाएं लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await markNotificationAsRead(user.id, notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_content':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'exam_reminder':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_content':
        return 'from-green-500/10 to-emerald-500/10';
      case 'exam_reminder':
        return 'from-orange-500/10 to-red-500/10';
      case 'announcement':
        return 'from-blue-500/10 to-cyan-500/10';
      default:
        return 'from-gray-500/10 to-slate-500/10';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl animate-float">
            <Bell className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold gradient-text">सूचनाएं</h1>
        <p className="text-muted-foreground">
          आपकी सभी महत्वपूर्ण सूचनाएं
        </p>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((item) => (
            <Card
              key={item.id}
              className={`glass-card hover:shadow-hover transition-all cursor-pointer ${
                !item.read ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => !item.read && handleMarkAsRead(item.notification_id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${getNotificationColor(item.notification?.type || 'system')}`}>
                      {getNotificationIcon(item.notification?.type || 'system')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">
                          {item.notification?.title}
                        </CardTitle>
                        {!item.read && (
                          <Badge variant="default" className="text-xs">
                            नया
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {formatDate(item.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.notification?.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">कोई सूचना नहीं</h3>
            <p className="text-muted-foreground text-center">
              अभी तक कोई सूचना नहीं है
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
