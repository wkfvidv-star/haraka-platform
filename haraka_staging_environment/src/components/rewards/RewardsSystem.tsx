import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Gift, 
  Target,
  TrendingUp,
  Award,
  Medal,
  Flame,
  Sparkles,
  Coins,
  ShoppingBag,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academic' | 'sports' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedDate?: Date;
  progress: number;
  maxProgress: number;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'badge' | 'avatar' | 'theme' | 'feature' | 'item';
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  available: boolean;
  owned: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  badges: string[];
  environment: 'school' | 'community';
}

export const RewardsSystem: React.FC = () => {
  const { user, environment, updateUserStats } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'أول خطوة',
      description: 'أكمل أول تمرين لك',
      icon: '👶',
      category: 'academic',
      rarity: 'common',
      xpReward: 50,
      coinReward: 10,
      unlocked: true,
      unlockedDate: new Date('2024-10-01'),
      progress: 1,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'عاشق التحدي',
      description: 'شارك في 10 مسابقات',
      icon: '🏆',
      category: 'sports',
      rarity: 'rare',
      xpReward: 200,
      coinReward: 50,
      unlocked: false,
      progress: 3,
      maxProgress: 10
    },
    {
      id: '3',
      title: 'نجم المجتمع',
      description: 'احصل على 1000 نقطة إعجاب',
      icon: '⭐',
      category: 'social',
      rarity: 'epic',
      xpReward: 500,
      coinReward: 100,
      unlocked: false,
      progress: 234,
      maxProgress: 1000
    },
    {
      id: '4',
      title: 'أسطورة المنصة',
      description: 'وصل للمستوى 50',
      icon: '👑',
      category: 'special',
      rarity: 'legendary',
      xpReward: 1000,
      coinReward: 500,
      unlocked: false,
      progress: user?.level || 1,
      maxProgress: 50
    }
  ];

  // Mock rewards store
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'شارة النجم الذهبي',
      description: 'شارة مميزة تظهر في ملفك الشخصي',
      type: 'badge',
      cost: 100,
      rarity: 'rare',
      available: true,
      owned: false
    },
    {
      id: '2',
      title: 'صورة رمزية الأسد',
      description: 'صورة رمزية قوية ومميزة',
      type: 'avatar',
      cost: 250,
      rarity: 'epic',
      available: true,
      owned: false
    },
    {
      id: '3',
      title: 'ثيم الليل المتقدم',
      description: 'واجهة مظلمة أنيقة مع تأثيرات خاصة',
      type: 'theme',
      cost: 500,
      rarity: 'legendary',
      available: true,
      owned: false
    },
    {
      id: '4',
      title: 'إحصائيات متقدمة',
      description: 'فتح تحليلات مفصلة للأداء',
      type: 'feature',
      cost: 300,
      rarity: 'epic',
      available: true,
      owned: false
    }
  ];

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'أحمد الذكي', xp: 15420, level: 28, badges: ['🏆', '⭐', '🎯'], environment: 'school' },
    { rank: 2, name: 'فاطمة المتفوقة', xp: 14890, level: 27, badges: ['🏆', '📚', '💡'], environment: 'school' },
    { rank: 3, name: 'محمد الرياضي', xp: 13250, level: 25, badges: ['💪', '🏃‍♂️', '🥇'], environment: 'community' },
    { rank: 4, name: user?.name || 'أنت', xp: user?.xp || 0, level: user?.level || 1, badges: user?.badges || [], environment: environment || 'school' },
    { rank: 5, name: 'سارة المبدعة', xp: 11800, level: 22, badges: ['🎨', '💻', '🌟'], environment: 'community' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'عادي';
      case 'rare': return 'نادر';
      case 'epic': return 'ملحمي';
      case 'legendary': return 'أسطوري';
      default: return rarity;
    }
  };

  const getNextLevelXP = (currentLevel: number) => {
    return currentLevel * 1000; // Simple formula: level * 1000 XP needed for next level
  };

  const getCurrentLevelProgress = () => {
    const currentXP = user?.xp || 0;
    const currentLevel = user?.level || 1;
    const xpForCurrentLevel = (currentLevel - 1) * 1000;
    const xpForNextLevel = currentLevel * 1000;
    const progressXP = currentXP - xpForCurrentLevel;
    const neededXP = xpForNextLevel - xpForCurrentLevel;
    return (progressXP / neededXP) * 100;
  };

  const purchaseReward = (reward: Reward) => {
    if (user && user.playCoins && user.playCoins >= reward.cost) {
      const newCoins = user.playCoins - reward.cost;
      updateUserStats({ playCoins: newCoins });
      // In a real app, you would also update the reward ownership
      console.log(`Purchased ${reward.title} for ${reward.cost} coins`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            environment === 'school' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
              : 'bg-gradient-to-r from-orange-500 to-pink-500'
          }`}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold">🎁 نظام المكافآت الذكي</h2>
        </div>
        <p className="text-muted-foreground">
          اكسب النقاط، فتح الإنجازات، واحصل على مكافآت رائعة
        </p>
      </div>

      {/* User Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            إحصائياتك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user?.level || 1}</div>
              <div className="text-sm text-muted-foreground">المستوى</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user?.xp || 0}</div>
              <div className="text-sm text-muted-foreground">نقاط الخبرة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{user?.playCoins || 0}</div>
              <div className="text-sm text-muted-foreground">العملات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user?.badges?.length || 0}</div>
              <div className="text-sm text-muted-foreground">الشارات</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>التقدم للمستوى التالي</span>
              <span>{getNextLevelXP(user?.level || 1)} XP</span>
            </div>
            <Progress value={getCurrentLevelProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="store">المتجر</TabsTrigger>
          <TabsTrigger value="leaderboard">المتصدرون</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  الإنجازات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  إحصائيات الأسبوع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>XP المكتسبة</span>
                    <span className="font-bold text-blue-600">+450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>العملات المكتسبة</span>
                    <span className="font-bold text-yellow-600">+120</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>المسابقات المكتملة</span>
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الترتيب الأسبوعي</span>
                    <span className="font-bold text-purple-600">#12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`border-2 ${
                achievement.unlocked 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200' 
                  : 'border-gray-200'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {getRarityText(achievement.rarity)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  {!achievement.unlocked && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>التقدم</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-500" />
                      {achievement.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      {achievement.coinReward}
                    </span>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="mt-2 text-xs text-green-600">
                      تم الإنجاز في {achievement.unlockedDate.toLocaleDateString('ar-SA')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="store" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <Badge className={getRarityColor(reward.rarity)}>
                      {getRarityText(reward.rarity)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{reward.cost}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reward.type === 'badge' ? 'شارة' :
                       reward.type === 'avatar' ? 'صورة رمزية' :
                       reward.type === 'theme' ? 'ثيم' :
                       reward.type === 'feature' ? 'ميزة' : 'عنصر'}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={reward.owned || !reward.available || (user?.playCoins || 0) < reward.cost}
                    onClick={() => purchaseReward(reward)}
                  >
                    {reward.owned ? 'مملوك' :
                     !reward.available ? 'غير متاح' :
                     (user?.playCoins || 0) < reward.cost ? 'عملات غير كافية' : 'شراء'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                المتصدرون {environment === 'school' ? 'في البيئة المدرسية' : 'في بيئة المجتمع'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.name === user?.name 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-white' :
                      entry.rank === 2 ? 'bg-gray-400 text-white' :
                      entry.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        المستوى {entry.level} • {entry.xp.toLocaleString()} XP
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {entry.badges.map((badge, index) => (
                        <span key={index} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    
                    <Badge variant={entry.environment === 'school' ? 'default' : 'secondary'}>
                      {entry.environment === 'school' ? 'مدرسي' : 'مجتمع'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsSystem;