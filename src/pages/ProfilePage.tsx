import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, uploadFile } from '@/db/api';
import { compressImage, sanitizeFileName } from '@/lib/constants';
import { Loader2, Camera, Save, Lock, User, Phone, GraduationCap, Mail } from 'lucide-react';
import { supabase } from '@/db/supabase';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [studentClass, setStudentClass] = useState(profile?.student_class || '');
  const [schoolName, setSchoolName] = useState(profile?.school_name || '');
  const [city, setCity] = useState(profile?.city || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Sync state with profile when profile loads or changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setStudentClass(profile.student_class || '');
      setSchoolName(profile.school_name || '');
      setCity(profile.city || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया एक छवि फ़ाइल चुनें',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Compress image
      const compressedFile = await compressImage(file);
      
      // Sanitize filename
      const sanitizedName = sanitizeFileName(compressedFile.name);
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}_${sanitizedName}`;

      // Upload to Supabase Storage
      const photoUrl = await uploadFile('app-8vqzns7lohkx_profile_images', filePath, compressedFile);

      // Update profile with cache-busting parameter
      const photoUrlWithTimestamp = `${photoUrl}?v=${timestamp}`;
      await updateProfile(user.id, { profile_photo_url: photoUrlWithTimestamp });
      
      toast({
        title: 'सफलता',
        description: 'प्रोफाइल फोटो अपडेट हो गई',
      });
      
      // Force refresh profile to get updated data
      await refreshProfile();
      
      // Force re-render by clearing the file input
      e.target.value = '';
      
      // Reload after a short delay to show toast
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: 'त्रुटि',
        description: 'फोटो अपलोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName || null,
        phone: phone || null,
        student_class: studentClass || null,
        school_name: schoolName || null,
        city: city || null,
        pincode: pincode || null,
      });
      
      toast({
        title: 'सफलता',
        description: 'प्रोफाइल अपडेट हो गई',
      });
      
      await refreshProfile();
      
      // Reload after a short delay to show toast
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'त्रुटि',
        description: 'प्रोफाइल अपडेट करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: 'त्रुटि',
        description: 'कृपया सभी पासवर्ड फ़ील्ड भरें',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'त्रुटि',
        description: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'त्रुटि',
        description: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);
    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      toast({
        title: 'सफलता',
        description: 'पासवर्ड सफलतापूर्वक बदल गया',
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: 'त्रुटि',
        description: error.message || 'पासवर्ड बदलने में विफल',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Information Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              प्रोफाइल जानकारी
            </CardTitle>
            <CardDescription>अपनी व्यक्तिगत जानकारी अपडेट करें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar 
                  key={profile?.profile_photo_url || 'default'}
                  className="h-32 w-32 border-4 border-primary"
                >
                  <AvatarImage 
                    src={profile?.profile_photo_url || undefined}
                    alt={profile?.full_name || 'User'} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl">
                    {getInitials(profile?.full_name || null)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg"
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                फोटो अपलोड करने के लिए कैमरा आइकन पर क्लिक करें
                <br />
                (अधिकतम 1MB, स्वचालित संपीड़न)
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  ईमेल
                </Label>
                <Input value={profile?.email || ''} disabled className="bg-muted" />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  पूरा नाम
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="अपना पूरा नाम दर्ज करें"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  फोन नंबर
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="अपना फोन नंबर दर्ज करें"
                />
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <Label htmlFor="studentClass" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  कक्षा
                </Label>
                <Select value={studentClass} onValueChange={setStudentClass}>
                  <SelectTrigger id="studentClass">
                    <SelectValue placeholder="अपनी कक्षा चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">कक्षा 8</SelectItem>
                    <SelectItem value="9">कक्षा 9</SelectItem>
                    <SelectItem value="10">कक्षा 10</SelectItem>
                    <SelectItem value="11">कक्षा 11</SelectItem>
                    <SelectItem value="12">कक्षा 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="schoolName">स्कूल का नाम</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="अपने स्कूल का नाम दर्ज करें"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">शहर</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="अपना शहर दर्ज करें"
                />
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <Label htmlFor="pincode">पिनकोड</Label>
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="अपना पिनकोड दर्ज करें"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Role Badge */}
            <div className="space-y-2">
              <Label>भूमिका</Label>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile?.role === 'admin' 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {profile?.role === 'admin' ? '👑 एडमिन' : '👤 छात्र'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  सहेजा जा रहा है...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  प्रोफाइल सहेजें
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="h-6 w-6" />
              पासवर्ड बदलें
            </CardTitle>
            <CardDescription>अपना पासवर्ड अपडेट करें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">वर्तमान पासवर्ड</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="अपना वर्तमान पासवर्ड दर्ज करें"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">नया पासवर्ड</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">नया पासवर्ड पुष्टि करें</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="नया पासवर्ड फिर से दर्ज करें"
              />
            </div>

            {/* Change Password Button */}
            <Button
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  बदला जा रहा है...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  पासवर्ड बदलें
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
