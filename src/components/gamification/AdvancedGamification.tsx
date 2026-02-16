import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaderboard } from './Leaderboard';
import { RewardsMarketplace } from './RewardsMarketplace';
import { Trophy, ShoppingBag, Star, Target, Brain, BookOpen, Wind, Book } from 'lucide-react';
import { BookOpenText } from 'lucide-react';

// Mock data interfaces (to be replaced with real data/props)
interface GamificationProps {
  userXP: number;
  userLevel: number;
  nextLevelXP: number;
  userCoins: number;
  leaderboardData: any; // Typed in Leaderboard component
  rewardsData: any; // Typed in RewardsMarketplace component
}

export default function AdvancedGamification({
  userXP = 2450,
  userLevel = 12,
  nextLevelXP = 3000,
  userCoins = 1250,
  leaderboardData,
  rewardsData
}: Partial<GamificationProps>) {
  const [activeTab, setActiveTab] = useState('overview');

  const progressPercentage = (userXP / nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />

        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                <span className="text-4xl font-bold">{userLevel}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">المستوى الحالي</h2>
                <p className="text-indigo-100">أنت متقدم على 85% من زملائك!</p>
              </div>
            </div>

            <div className="flex-1 w-full md:max-w-md">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>{userXP} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-black/20" />
              <p className="text-xs text-indigo-200 mt-2 text-left">
                باقي {nextLevelXP - userXP} نقطة للوصول للمستوى {userLevel + 1}
              </p>
            </div>

            <div className="flex flex-col items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="text-xs text-indigo-100 mb-1">رصيد العملات</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-300">{userCoins}</span>
                <span className="text-xl">🪙</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="leaderboard">المتصدرين</TabsTrigger>
          <TabsTrigger value="rewards">المتجر</TabsTrigger>
          <TabsTrigger value="badges">الشارات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  المهام اليومية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={i === 1 ? 'line-through text-gray-500' : ''}>إكمال تمرين يومي</span>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                        +50 XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  أحدث الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20">
                    <div className="text-2xl">🏃‍♂️</div>
                    <div>
                      <h4 className="font-semibold text-sm">عداء الأسبوع</h4>
                      <p className="text-xs text-gray-500">أكملت 20 كم جري هذا الأسبوع</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard
            data={leaderboardData}
            currentUserid="user-1"
          />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsMarketplace
            items={rewardsData}
            userCoins={userCoins}
            onPurchase={(id) => console.log('Purchase:', id)}
          />
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100 flex flex-col items-center p-4 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-900">عبقري التركيز</h3>
              <p className="text-xs text-blue-700">أكمل 5 جلسات تركيز</p>
            </Card>
            <Card className="bg-green-50 border-green-100 flex flex-col items-center p-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-green-900">المتفوق الأكاديمي</h3>
              <p className="text-xs text-green-700">حل 10 مسائل رياضية</p>
            </Card>
            <Card className="bg-purple-50 border-purple-100 flex flex-col items-center p-4 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Wind className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-purple-900">سيد الهدوء</h3>
              <p className="text-xs text-purple-700">جلسات استرخاء لمدة 30 دقيقة</p>
            </Card>
            <Card className="grayscale opacity-60 flex flex-col items-center p-4 text-center border-dashed">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-500">قريباً...</h3>
              <p className="text-xs text-gray-400">تحديات جديدة</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}