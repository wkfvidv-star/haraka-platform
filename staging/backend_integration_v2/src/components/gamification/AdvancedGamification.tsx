import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Medal, 
  Gift,
  Coins,
  TrendingUp,
  Users,
  Target,
  Award,
  Flame,
  Shield,
  Gem,
  Lock,
  Unlock,
  CheckCircle
} from 'lucide-react';

interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  streak: number;
  rank: number;
  totalUsers: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  reward: {
    xp: number;
    coins: number;
  };
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'badge' | 'theme' | 'feature';
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  icon: string;
}

type TabType = 'overview' | 'achievements' | 'leaderboard' | 'rewards';

export const AdvancedGamification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const userStats: UserStats = {
    level: 15,
    xp: 2350,
    nextLevelXp: 2500,
    coins: 1250,
    streak: 7,
    rank: 23,
    totalUsers: 1500
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'محارب النار',
      description: 'أكمل 100 تمرين متتالي',
      icon: '🔥',
      rarity: 'legendary',
      unlocked: true,
      reward: { xp: 500, coins: 200 }
    },
    {
      id: '2',
      name: 'عداء الماراثون',
      description: 'اجر مسافة 42 كم إجمالية',
      icon: '🏃‍♂️',
      rarity: 'epic',
      unlocked: false,
      progress: 28,
      maxProgress: 42,
      reward: { xp: 300, coins: 150 }
    },
    {
      id: '3',
      name: 'خبير التوازن',
      description: 'أتقن 20 تمرين توازن مختلف',
      icon: '⚖️',
      rarity: 'rare',
      unlocked: true,
      reward: { xp: 200, coins: 100 }
    },
    {
      id: '4',
      name: 'نجم الأسبوع',
      description: 'احتل المركز الأول لمدة أسبوع',
      icon: '⭐',
      rarity: 'epic',
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      reward: { xp: 400, coins: 180 }
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'أحمد محمد', avatar: '/api/placeholder/32/32', level: 18, xp: 3200, rank: 1 },
    { id: '2', name: 'فاطمة علي', avatar: '/api/placeholder/32/32', level: 17, xp: 2980, rank: 2 },
    { id: '3', name: 'محمد حسن', avatar: '/api/placeholder/32/32', level: 16, xp: 2750, rank: 3 },
    { id: '4', name: 'سارة أحمد', avatar: '/api/placeholder/32/32', level: 15, xp: 2600, rank: 4 },
    { id: '5', name: 'يوسف محمود', avatar: '/api/placeholder/32/32', level: 15, xp: 2450, rank: 5 }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      name: 'أفاتار الأسد الذهبي',
      description: 'أفاتار حصري للمحاربين الأقوياء',
      type: 'avatar',
      cost: 500,
      rarity: 'legendary',
      unlocked: false,
      icon: '🦁'
    },
    {
      id: '2',
      name: 'شارة البطل',
      description: 'شارة تظهر إنجازاتك للجميع',
      type: 'badge',
      cost: 200,
      rarity: 'epic',
      unlocked: true,
      icon: '🏆'
    },
    {
      id: '3',
      name: 'ثيم الليل الأزرق',
      description: 'ثيم أنيق بألوان الليل',
      type: 'theme',
      cost: 150,
      rarity: 'rare',
      unlocked: false,
      icon: '🌙'
    },
    {
      id: '4',
      name: 'ميزة التحليل المتقدم',
      description: 'احصل على تحليلات مفصلة لأدائك',
      type: 'feature',
      cost: 300,
      rarity: 'epic',
      unlocked: false,
      icon: '📊'
    }
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityText = (rarity: string) => {
    const texts = {
      common: 'عادي',
      rare: 'نادر',
      epic: 'ملحمي',
      legendary: 'أسطوري'
    };
    return texts[rarity as keyof typeof texts] || 'عادي';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
  };

  const progressPercentage = (userStats.xp / userStats.nextLevelXp) * 100;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* إحصائيات المستخدم */}
      <Card className="bg-gradient-to-r from-educational-primary/10 to-educational-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-educational-primary" />
            ملفك الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-educational-primary">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">المستوى</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-educational-secondary">{userStats.coins}</div>
              <div className="text-sm text-muted-foreground">عملة ذهبية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-educational-accent">{userStats.streak}</div>
              <div className="text-sm text-muted-foreground">أيام متتالية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-educational-purple">#{userStats.rank}</div>
              <div className="text-sm text-muted-foreground">الترتيب العام</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">التقدم للمستوى التالي</span>
              <span className="text-sm text-muted-foreground">
                {userStats.xp} / {userStats.nextLevelXp} XP
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* الإنجازات الحديثة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            إنجازات حديثة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {getRarityText(achievement.rarity)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* لوحة المتصدرين المصغرة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-educational-primary" />
            أفضل 5 متسابقين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                {getRankIcon(user.rank)}
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">المستوى {user.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{user.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`${achievement.unlocked ? 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : 'opacity-75'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {getRarityText(achievement.rarity)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">التقدم</span>
                        <span className="text-xs font-medium">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-600" />
                      {achievement.reward.xp} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-600" />
                      {achievement.reward.coins} عملة
                    </span>
                  </div>
                </div>
                
                {achievement.unlocked ? (
                  <Unlock className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            لوحة المتصدرين
          </CardTitle>
          <CardDescription>أفضل المتسابقين هذا الشهر</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'bg-muted/50'}`}>
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">المستوى {user.level}</div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">{user.xp}</div>
                  <div className="text-xs text-muted-foreground">نقطة خبرة</div>
                </div>
                
                {index < 3 && (
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-educational-accent" />
            متجر المكافآت
          </CardTitle>
          <CardDescription>استبدل عملاتك الذهبية بمكافآت حصرية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={`${reward.unlocked ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-3">{reward.icon}</div>
                    <h4 className="font-semibold mb-1">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge className={getRarityColor(reward.rarity)}>
                        {getRarityText(reward.rarity)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-bold">{reward.cost}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={reward.unlocked || userStats.coins < reward.cost}
                      variant={reward.unlocked ? "outline" : "default"}
                    >
                      {reward.unlocked ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          مملوك
                        </>
                      ) : userStats.coins >= reward.cost ? (
                        <>
                          <Coins className="w-4 h-4 mr-1" />
                          استبدال
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          غير متاح
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview' as TabType, label: 'نظرة عامة', icon: TrendingUp },
    { id: 'achievements' as TabType, label: 'الإنجازات', icon: Star },
    { id: 'leaderboard' as TabType, label: 'المتصدرين', icon: Users },
    { id: 'rewards' as TabType, label: 'المكافآت', icon: Gift }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'achievements': return renderAchievements();
      case 'leaderboard': return renderLeaderboard();
      case 'rewards': return renderRewards();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🏅 نظام المسابقات واللعبنة المتقدم</h2>
        <p className="text-muted-foreground">تنافس، اكسب النقاط، واحصل على مكافآت حصرية</p>
      </div>

      {/* التبويبات */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-educational-primary text-educational-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* المحتوى */}
      {renderContent()}
    </div>
  );
};

export default AdvancedGamification;