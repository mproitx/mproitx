import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Brain, FileText, Clock, GraduationCap, Zap, Sparkles, CheckCircle, Target } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Check if greeting should be shown (once per day)
    const lastGreetingDate = localStorage.getItem('lastGreetingDate');
    const today = new Date().toDateString();
    
    if (lastGreetingDate !== today) {
      setShowGreeting(true);
      localStorage.setItem('lastGreetingDate', today);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 xl:p-6 space-y-6 xl:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 xl:p-8 rounded-2xl"
      >
        <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-4">
          <div className="text-center xl:text-left">
            <h1 className="text-3xl xl:text-4xl font-bold gradient-text mb-2">
              {showGreeting ? `नमस्ते, ${profile?.full_name || 'छात्र'}! 👋` : `${profile?.full_name || 'छात्र'}`}
            </h1>
            <p className="text-base xl:text-lg text-muted-foreground">
              आज आप क्या सीखना चाहते हैं?
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/recently-viewed">
                <Clock className="w-4 h-4 mr-2" />
                हाल में देखे गए
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl xl:text-2xl font-bold mb-4"><Zap className="inline h-5 w-5 xl:h-6 xl:w-6" /> त्वरित पहुंच</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
          <Link to="/ai-helper">
            <Card className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-4 xl:p-6 text-center">
                <div className="w-12 h-12 xl:w-16 xl:h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl xl:text-3xl mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="font-semibold text-sm xl:text-base">AI सहायक</h3>
                <p className="text-xs text-muted-foreground mt-1">सवाल पूछें</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/mcq-test">
            <Card className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-4 xl:p-6 text-center">
                <div className="w-12 h-12 xl:w-16 xl:h-16 mx-auto rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl xl:text-3xl mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="inline h-5 w-5 xl:h-6 xl:w-6" />
                </div>
                <h3 className="font-semibold text-sm xl:text-base">MCQ टेस्ट</h3>
                <p className="text-xs text-muted-foreground mt-1">अभ्यास करें</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/downloads">
            <Card className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-4 xl:p-6 text-center">
                <div className="w-12 h-12 xl:w-16 xl:h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl xl:text-3xl mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
                  📥
                </div>
                <h3 className="font-semibold text-sm xl:text-base">डाउनलोड</h3>
                <p className="text-xs text-muted-foreground mt-1">सहेजे गए</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profile">
            <Card className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-4 xl:p-6 text-center">
                <div className="w-12 h-12 xl:w-16 xl:h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl xl:text-3xl mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h3 className="font-semibold text-sm xl:text-base">प्रोफाइल</h3>
                <p className="text-xs text-muted-foreground mt-1">सेटिंग्स</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Study Materials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl xl:text-2xl font-bold mb-4"><BookOpen className="h-5 w-5 xl:h-6 xl:w-6" /> अध्ययन सामग्री</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/content/${category.id}`}>
                <Card className="glass-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
                  <CardContent className="p-4 xl:p-5">
                    <div className={`w-12 h-12 xl:w-14 xl:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <DynamicIcon name={category.icon} className="h-6 w-6 xl:h-7 xl:w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm xl:text-base mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl xl:text-2xl font-bold mb-4">📊 आंकड़े</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xl:gap-4">
          <Card className="glass-card bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 xl:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">कुल सामग्री</p>
                  <p className="text-2xl xl:text-3xl font-bold text-primary">1000+</p>
                </div>
                <div className="text-3xl xl:text-4xl"><BookOpen className="h-5 w-5 xl:h-6 xl:w-6" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardContent className="p-4 xl:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MCQ प्रश्न</p>
                  <p className="text-2xl xl:text-3xl font-bold text-secondary">5000+</p>
                </div>
                <div className="text-3xl xl:text-4xl"><CheckCircle className="inline h-8 w-8 xl:h-10 xl:w-10" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-4 xl:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">IIT-JEE प्रश्न</p>
                  <p className="text-2xl xl:text-3xl font-bold text-accent">2000+</p>
                </div>
                <div className="text-3xl xl:text-4xl"><Target className="inline h-8 w-8 xl:h-10 xl:w-10" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-xl xl:text-2xl"><Sparkles className="inline h-5 w-5 xl:h-6 xl:w-6" /> ऐप की विशेषताएं</CardTitle>
            <CardDescription>PM - Roit Study Hub के साथ अपनी पढ़ाई को बेहतर बनाएं</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl flex-shrink-0">
                  📱
                </div>
                <div>
                  <h3 className="font-semibold mb-1">PWA Support</h3>
                  <p className="text-sm text-muted-foreground">
                    अपने फोन में इंस्टॉल करें और ऑफलाइन उपयोग करें
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 AI सहायक से अपने सवालों के जवाब पाएं
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center text-xl flex-shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    अपनी प्रगति को ट्रैक करें और सुधार करें
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl flex-shrink-0">
                  🌙
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    आंखों के लिए आरामदायक डार्क मोड
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
