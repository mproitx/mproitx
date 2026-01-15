import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import { Upload, Users, Bell, FileQuestion, FolderOpen, BarChart, BookOpen, CheckCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  // Redirect if not admin
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const adminFeatures = [
    {
      icon: Upload,
      title: 'सामग्री अपलोड',
      description: 'PDF, छवियां और अन्य फाइलें अपलोड करें',
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/upload',
      comingSoon: false,
    },
    {
      icon: FileQuestion,
      title: 'MCQ अपलोड',
      description: 'प्रश्न और उत्तर जोड़ें',
      color: 'from-purple-500 to-pink-500',
      link: '/admin/mcq-upload',
      comingSoon: false,
    },
    {
      icon: Users,
      title: 'छात्र प्रबंधन',
      description: 'पंजीकृत छात्रों को देखें और प्रबंधित करें',
      color: 'from-green-500 to-emerald-500',
      link: '/admin/students',
      comingSoon: false,
    },
    {
      icon: Bell,
      title: 'सूचनाएं भेजें',
      description: 'छात्रों को घोषणाएं भेजें',
      color: 'from-orange-500 to-red-500',
      link: '/admin/notifications',
      comingSoon: false,
    },
    {
      icon: FolderOpen,
      title: 'सामग्री प्रबंधन',
      description: 'अपलोड की गई सामग्री को संपादित/हटाएं',
      color: 'from-indigo-500 to-blue-500',
      link: '/admin/content-management',
      comingSoon: false,
    },
    {
      icon: BarChart,
      title: 'IIT-JEE प्रश्न अपलोड',
      description: 'Advanced level के प्रश्न जोड़ें',
      color: 'from-yellow-500 to-orange-500',
      link: '/admin/iitjee-upload',
      comingSoon: false,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl animate-pulse-glow">
            👑
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text">एडमिन पैनल</h1>
        <p className="text-lg text-muted-foreground">
          स्वागत है, {profile?.full_name || 'एडमिन'}!
        </p>
      </div>

      {/* Admin Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminFeatures.map((feature, index) => (
          <Card
            key={index}
            className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
          >
            <CardHeader>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 animate-float`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {feature.comingSoon ? (
                <div className="text-center py-4">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-sm font-medium">
                    जल्द ही आ रहा है
                  </span>
                </div>
              ) : (
                <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Link to={feature.link || '#'}>खोलें</Link>
                </Button>
              )}
            </CardContent>
            {feature.comingSoon && (
              <div className="absolute top-4 right-4">
                <span className="text-2xl">🚧</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">👥</CardTitle>
            <CardDescription>कुल छात्र</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">-</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl"><BookOpen className="inline h-4 w-4" /></CardTitle>
            <CardDescription>कुल सामग्री</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">-</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl"><CheckCircle className="inline h-4 w-4" /></CardTitle>
            <CardDescription>MCQ प्रश्न</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">-</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">📊</CardTitle>
            <CardDescription>टेस्ट लिए गए</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">-</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="glass-card bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <CardHeader>
          <CardTitle>ℹ️ जानकारी</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            एडमिन पैनल की सभी सुविधाएं विकास में हैं। जल्द ही आप सभी प्रबंधन कार्य यहां से कर सकेंगे।
            <br /><br />
            <strong>आगामी सुविधाएं:</strong>
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
            <li>बल्क फाइल अपलोड</li>
            <li>MCQ प्रश्न बैंक प्रबंधन</li>
            <li>छात्र प्रगति ट्रैकिंग</li>
            <li>पुश नोटिफिकेशन</li>
            <li>विस्तृत एनालिटिक्स</li>
            <li>सामग्री संपादन और हटाना</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
