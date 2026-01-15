import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getAllProfiles, updateUserRole } from '@/db/api';
import { Search, Users, Shield, User as UserIcon, Lock } from 'lucide-react';
import { formatDate } from '@/lib/constants';
import type { Profile } from '@/types/types';

const ADMIN_PASSWORD = '12/07/2010';

export default function AdminStudentManagementPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Profile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast({
        title: 'सफल',
        description: 'पासवर्ड सही है। छात्र प्रबंधन खुल रहा है।',
      });
    } else {
      toast({
        title: 'त्रुटि',
        description: 'गलत पासवर्ड। कृपया पुनः प्रयास करें।',
        variant: 'destructive',
      });
      setPasswordInput('');
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone?.includes(searchQuery)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllProfiles();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: 'त्रुटि',
        description: 'छात्र लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: 'सफलता',
        description: 'भूमिका सफलतापूर्वक अपडेट की गई',
      });
      loadStudents();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'त्रुटि',
        description: 'भूमिका अपडेट करने में विफल',
        variant: 'destructive',
      });
    }
  };

  const stats = {
    total: students.length,
    admins: students.filter(s => s.role === 'admin').length,
    users: students.filter(s => s.role === 'user').length,
  };

  // Password Dialog
  if (!isAuthenticated) {
    return (
      <Dialog open={showPasswordDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">छात्र प्रबंधन सुरक्षा</DialogTitle>
            <DialogDescription className="text-center">
              छात्र डेटा देखने के लिए पासवर्ड दर्ज करें
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="पासवर्ड दर्ज करें"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={handlePasswordKeyPress}
                className="text-center text-lg"
                autoFocus
              />
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-primary to-secondary"
              size="lg"
            >
              <Lock className="mr-2 h-4 w-4" />
              सत्यापित करें
            </Button>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="w-full"
            >
              वापस जाएं
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 xl:p-6 space-y-4">
        <Skeleton className="h-12 w-full bg-muted" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Skeleton className="h-24 bg-muted" />
          <Skeleton className="h-24 bg-muted" />
          <Skeleton className="h-24 bg-muted" />
        </div>
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 xl:p-6 space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <CardTitle className="text-xl xl:text-2xl gradient-text">छात्र प्रबंधन</CardTitle>
              <CardDescription className="text-base mt-2">
                पंजीकृत उपयोगकर्ताओं को देखें और प्रबंधित करें
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              वापस जाएं
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">कुल उपयोगकर्ता</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <Users className="h-12 w-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">एडमिन</p>
                <p className="text-3xl font-bold text-secondary">{stats.admins}</p>
              </div>
              <Shield className="h-12 w-12 text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">छात्र</p>
                <p className="text-3xl font-bold text-accent">{stats.users}</p>
              </div>
              <UserIcon className="h-12 w-12 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, ईमेल या फोन से खोजें..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>उपयोगकर्ता सूची ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">कोई उपयोगकर्ता नहीं मिला</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {student.full_name?.[0]?.toUpperCase() || student.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base xl:text-lg break-words">
                              {student.full_name || 'नाम नहीं'}
                            </h3>
                            <Badge variant={student.role === 'admin' ? 'default' : 'secondary'}>
                              {student.role === 'admin' ? '👑 एडमिन' : '👤 छात्र'}
                            </Badge>
                          </div>
                          <div className="space-y-1 mt-2">
                            {student.email && (
                              <p className="text-sm text-muted-foreground break-all">
                                📧 {student.email}
                              </p>
                            )}
                            {student.phone && (
                              <p className="text-sm text-muted-foreground">
                                📱 {student.phone}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              🗓️ पंजीकृत: {formatDate(student.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {student.role === 'user' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(student.id, 'admin')}
                            className="w-full xl:w-auto"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            एडमिन बनाएं
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(student.id, 'user')}
                            className="w-full xl:w-auto"
                          >
                            <UserIcon className="h-4 w-4 mr-1" />
                            छात्र बनाएं
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
