import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';
import { supabase } from '@/db/supabase';
import type { Profile } from '@/types/types';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  profile_photo_url: string | null;
  pincode: string | null;
  total_score: number;
  tests_taken: number;
  average_score: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Get all MCQ test results with user profiles
      const { data: results, error } = await supabase
        .from('mcq_test_results')
        .select(`
          user_id,
          score,
          total_questions,
          profiles!inner (
            full_name,
            profile_photo_url,
            pincode
          )
        `)
        .order('score', { ascending: false });

      if (error) throw error;

      // Aggregate scores by user
      const userScores = new Map<string, {
        full_name: string;
        profile_photo_url: string | null;
        pincode: string | null;
        total_score: number;
        tests_taken: number;
      }>();

      results?.forEach((result: any) => {
        const userId = result.user_id;
        const percentage = (result.score / result.total_questions) * 100;
        
        if (userScores.has(userId)) {
          const existing = userScores.get(userId)!;
          existing.total_score += percentage;
          existing.tests_taken += 1;
        } else {
          userScores.set(userId, {
            full_name: result.profiles.full_name,
            profile_photo_url: result.profiles.profile_photo_url,
            pincode: result.profiles.pincode,
            total_score: percentage,
            tests_taken: 1,
          });
        }
      });

      // Convert to leaderboard entries and calculate average
      const entries: LeaderboardEntry[] = Array.from(userScores.entries())
        .map(([user_id, data]) => ({
          user_id,
          full_name: data.full_name,
          profile_photo_url: data.profile_photo_url,
          pincode: data.pincode,
          total_score: data.total_score,
          tests_taken: data.tests_taken,
          average_score: data.total_score / data.tests_taken,
          rank: 0,
        }))
        .sort((a, b) => b.average_score - a.average_score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      setLeaderboard(entries);

      // Find current user's rank
      if (user) {
        const userEntry = entries.find(e => e.user_id === user.id);
        if (userEntry) {
          setCurrentUserRank(userEntry.rank);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast({
        title: 'त्रुटि',
        description: 'लीडरबोर्ड लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 xl:h-8 xl:w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 xl:h-8 xl:w-8 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 xl:h-8 xl:w-8 text-amber-600" />;
      default:
        return <span className="text-lg xl:text-xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    return 'bg-gradient-to-r from-primary to-secondary';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 xl:p-6 space-y-4">
        <Skeleton className="h-32 w-full bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-20 w-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 xl:p-6 space-y-4 xl:space-y-6">
      {/* Header */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl xl:text-3xl gradient-text flex items-center gap-2">
                <Trophy className="h-6 w-6 xl:h-8 xl:w-8" />
                लीडरबोर्ड
              </CardTitle>
              <CardDescription className="text-sm xl:text-base mt-2">
                शीर्ष प्रदर्शन करने वाले छात्र
              </CardDescription>
            </div>
            {currentUserRank && (
              <Badge className={`${getRankBadgeColor(currentUserRank)} text-white px-3 py-1 xl:px-4 xl:py-2 text-sm xl:text-base`}>
                आपकी रैंक: #{currentUserRank}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 xl:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs xl:text-sm text-muted-foreground">कुल छात्र</p>
                <p className="text-lg xl:text-2xl font-bold">{leaderboard.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 xl:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Target className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs xl:text-sm text-muted-foreground">औसत स्कोर</p>
                <p className="text-lg xl:text-2xl font-bold">
                  {leaderboard.length > 0
                    ? Math.round(leaderboard.reduce((sum, e) => sum + e.average_score, 0) / leaderboard.length)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 xl:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
              </div>
              <div>
                <p className="text-xs xl:text-sm text-muted-foreground">शीर्ष स्कोर</p>
                <p className="text-lg xl:text-2xl font-bold">
                  {leaderboard.length > 0 ? Math.round(leaderboard[0].average_score) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 xl:space-y-3">
        {leaderboard.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 xl:p-12 text-center">
              <Trophy className="h-12 w-12 xl:h-16 xl:w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-base xl:text-lg text-muted-foreground">
                अभी तक कोई टेस्ट परिणाम नहीं है
              </p>
              <p className="text-xs xl:text-sm text-muted-foreground mt-2">
                MCQ टेस्ट दें और लीडरबोर्ड में अपनी जगह बनाएं!
              </p>
            </CardContent>
          </Card>
        ) : (
          leaderboard.map((entry) => (
            <Card
              key={entry.user_id}
              className={`glass-card transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5 ${
                entry.user_id === user?.id ? 'border-2 border-primary' : ''
              }`}
            >
              <CardContent className="p-3 sm:p-4 xl:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 sm:w-14 xl:w-16 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 xl:h-14 xl:w-14 border-2 border-primary">
                    <AvatarImage src={entry.profile_photo_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm xl:text-base">
                      {getInitials(entry.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base xl:text-lg truncate">
                      {entry.full_name}
                      {entry.user_id === user?.id && (
                        <Badge variant="secondary" className="ml-2 text-xs">आप</Badge>
                      )}
                    </h3>
                    <p className="text-xs xl:text-sm text-muted-foreground">
                      {entry.tests_taken} टेस्ट पूर्ण
                      {entry.pincode && <span className="ml-2">• पिनकोड: {entry.pincode}</span>}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg sm:text-xl xl:text-2xl font-bold ${getRankBadgeColor(entry.rank)} bg-clip-text text-transparent`}>
                      {Math.round(entry.average_score)}%
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">औसत स्कोर</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
