import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { WearableConnection } from '@/components/health/WearableConnection';
import { DailyActivity } from '@/components/health/DailyActivity';
import { HealthMetrics } from '@/components/health/HealthMetrics';
import { BodyAnalysis } from '@/components/health/BodyAnalysis';
import HarakaCreator from '@/components/Haraka/HarakaCreator';
import ARInterface from '@/components/ar/ARInterface';
import AdvancedGamification from '@/components/gamification/AdvancedGamification';
import CompetitionHub from '@/components/competitions/CompetitionHub';
import RewardsSystem from '@/components/rewards/RewardsSystem';
import AIMotionCorrection from '@/components/sports/AIMotionCorrection';
import AdaptiveTrainingPlan from '@/components/sports/AdaptiveTrainingPlan';
import RealMetricsDashboard from '@/components/sports/RealMetricsDashboard';
import PilotTestMode from '@/components/sports/PilotTestMode';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { 
  Play, 
  Star, 
  Trophy, 
  Target, 
  Timer,
  TrendingUp,
  Dumbbell,
  Activity,
  Zap,
  BarChart3,
  Calendar,
  Users,
  Heart,
  ShoppingBag,
  Lightbulb,
  MapPin,
  Flame,
  Home,
  LogOut,
  User,
  Award,
  Gamepad2,
  Camera,
  Sparkles,
  Crown,
  Gift,
  Coins,
  TestTube,
  Brain,
  Settings
} from 'lucide-react';

export default function YouthDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout, environment } = useAuth();
  const isRTL = language === 'ar';

  // بيانات وهمية للنشاط اليومي
  const activityData = {
    steps: 12840,
    stepsGoal: 15000,
    distance: 9.8,
    calories: 580,
    heartRate: {
      current: 82,
      min: 68,
      max: 165,
      avg: 95
    },
    activeTime: 240, // 4 ساعات
    sedentaryTime: 360 // 6 ساعات
  };

  // بيانات وهمية للصحة
  const healthData = {
    heartRate: {
      min: 68,
      max: 165,
      avg: 95,
      restingHR: 75
    },
    sleep: {
      totalSleep: 450, // 7.5 ساعات
      deepSleep: 135, // 2.25 ساعة
      lightSleep: 225, // 3.75 ساعة
      remSleep: 90, // 1.5 ساعة
      sleepQuality: 78
    },
    oxygenSaturation: 97,
    bloodPressure: {
      systolic: 118,
      diastolic: 76
    }
  };

  // بيانات وهمية لتحليل الجسم
  const bodyData = {
    bodyFatPercentage: 12.8,
    muscleMass: 42.3,
    waterPercentage: 64.2,
    bmi: 21.5,
    weight: 68,
    height: 175,
    visceralFat: 4,
    boneMass: 3.2,
    metabolicAge: 19
  };

  const sports = [
    { id: 1, name: 'كرة القدم', level: 'متقدم', sessions: 15, progress: 88, icon: '⚽' },
    { id: 2, name: 'كرة السلة', level: 'متوسط', sessions: 10, progress: 72, icon: '🏀' },
    { id: 3, name: 'السباحة', level: 'متقدم', sessions: 12, progress: 85, icon: '🏊‍♂️' },
    { id: 4, name: 'ألعاب القوى', level: 'متقدم', sessions: 18, progress: 92, icon: '🏃‍♂️' },
    { id: 5, name: 'التنس', level: 'مبتدئ', sessions: 6, progress: 45, icon: '🎾' },
    { id: 6, name: 'الكاراتيه', level: 'متوسط', sessions: 8, progress: 68, icon: '🥋' },
    { id: 7, name: 'رفع الأثقال', level: 'متقدم', sessions: 20, progress: 95, icon: '🏋️‍♂️' },
    { id: 8, name: 'الجمباز', level: 'مبتدئ', sessions: 4, progress: 35, icon: '🤸‍♂️' },
  ];

  const workouts = [
    { id: 1, name: 'تدريب القوة والتحمل', duration: '60 دقيقة', difficulty: 'صعب', calories: 450, type: 'قوة' },
    { id: 2, name: 'تدريب الكارديو المكثف', duration: '45 دقيقة', difficulty: 'متوسط', calories: 380, type: 'تحمل' },
    { id: 3, name: 'تدريب المرونة واليوغا', duration: '30 دقيقة', difficulty: 'سهل', calories: 150, type: 'مرونة' },
    { id: 4, name: 'تدريب HIIT', duration: '35 دقيقة', difficulty: 'صعب', calories: 420, type: 'مختلط' },
    { id: 5, name: 'تدريب الوظائف الحركية', duration: '50 دقيقة', difficulty: 'متوسط', calories: 320, type: 'وظيفي' },
  ];

  // تبويبات التنقل المحدثة للبيئة الشبابية مع الوحدات الجديدة
  const navigationTabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'ai-motion', label: 'التصحيح الذكي', icon: Brain },
    { id: 'training-plan', label: 'الخطة التدريبية', icon: Calendar },
    { id: 'metrics', label: 'المقاييس الواقعية', icon: BarChart3 },
    { id: 'pilot-test', label: 'الاختبار الميداني', icon: TestTube },
    { id: 'Haraka', label: 'مختبر الإبداع', icon: Gamepad2 },
    { id: 'ar-training', label: 'الواقع المعزز', icon: Camera },
    { id: 'competitions', label: 'المسابقات', icon: Trophy },
    { id: 'rewards', label: 'المكافآت', icon: Gift },
    { id: 'gamification', label: 'التحديات', icon: Target },
    { id: 'training', label: 'التدريب', icon: Dumbbell },
    { id: 'sports', label: 'الرياضات', icon: Activity },
    { id: 'progress', label: 'الأداء', icon: TrendingUp },
    { id: 'body-analysis', label: 'تحليل الجسم', icon: Heart }
  ];

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Community Style */}
      <Card className="bg-gradient-to-r from-orange-500 to-green-500 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6" />
            مرحباً بالشاب المبدع! 🚀
          </CardTitle>
          <CardDescription className="text-orange-100">
            استمر في الإبداع وحقق أهدافك مع أدوات الذكاء الاصطناعي المتطورة
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{user?.level || 1}</div>
              <div className="text-xs sm:text-sm text-orange-100">المستوى</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{user?.xp || 0}</div>
              <div className="text-xs sm:text-sm text-orange-100">نقاط الخبرة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{user?.playCoins || 0}</div>
              <div className="text-xs sm:text-sm text-orange-100">العملات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">{user?.badges?.length || 0}</div>
              <div className="text-xs sm:text-sm text-orange-100">الشارات</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New AI Sports Features Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-600" />
            وحدات الذكاء الاصطناعي الرياضية الجديدة
          </CardTitle>
          <CardDescription>
            تقنيات متطورة للتدريب والتصحيح الحركي الذكي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-blue-50"
              onClick={() => setActiveTab('ai-motion')}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">التصحيح الحركي الذكي</h4>
                <p className="text-xs text-muted-foreground mt-1">تحليل وتصحيح الحركة فورياً</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-green-50"
              onClick={() => setActiveTab('training-plan')}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">الخطة التدريبية الذكية</h4>
                <p className="text-xs text-muted-foreground mt-1">خطط مخصصة حسب أدائك</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-purple-50"
              onClick={() => setActiveTab('metrics')}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">المقاييس الواقعية</h4>
                <p className="text-xs text-muted-foreground mt-1">تحليل البيانات الحقيقية</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-red-50"
              onClick={() => setActiveTab('pilot-test')}
            >
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">الاختبار الميداني</h4>
                <p className="text-xs text-muted-foreground mt-1">تقييم النظام في الواقع</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Original Features Highlight - Updated for Community */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
            ميزات المجتمع الذكي
          </CardTitle>
          <CardDescription>
            اكتشف الأدوات المتطورة للشباب المبدعين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-purple-50"
              onClick={() => setActiveTab('Haraka')}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">مختبر الإبداع</h4>
                <p className="text-xs text-muted-foreground mt-1">أنشئ ألعابك التعليمية</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-orange-50"
              onClick={() => setActiveTab('ar-training')}
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">الواقع المعزز</h4>
                <p className="text-xs text-muted-foreground mt-1">تدرب مع مدرب افتراضي</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-yellow-50"
              onClick={() => setActiveTab('competitions')}
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">المسابقات</h4>
                <p className="text-xs text-muted-foreground mt-1">تنافس واكسب جوائز</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-green-50"
              onClick={() => setActiveTab('rewards')}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">المكافآت</h4>
                <p className="text-xs text-muted-foreground mt-1">اكسب واستبدل النقاط</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Updated for Community */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="الأداء اليومي"
          value="94%"
          description="من الهدف المحدد"
          icon={Target}
          color="orange"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="التمارين المكتملة"
          value="32"
          description="هذا الشهر"
          icon={Dumbbell}
          color="green"
        />
        <StatsCard
          title="وقت التدريب"
          value="4 س"
          description="اليوم"
          icon={Timer}
          color="purple"
        />
        <StatsCard
          title="الترتيب"
          value="#4"
          description="في المجتمع"
          icon={Crown}
          color="yellow"
        />
      </div>

      {/* Sports Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-orange-500" />
            تقدمك في الرياضات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {sports.slice(0, 4).map((sport) => (
              <div key={sport.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">{sport.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-xs sm:text-sm truncate">{sport.name}</h4>
                    <p className="text-xs text-gray-500">{sport.sessions} حصة</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>التقدم</span>
                    <span>{sport.progress}%</span>
                  </div>
                  <Progress value={sport.progress} className="h-1.5" />
                </div>
                <Badge variant={sport.level === 'متقدم' ? 'default' : 'secondary'} className="text-xs">
                  {sport.level}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('sports')}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              عرض جميع الرياضات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Dumbbell className="h-5 w-5 text-green-500" />
            تدريب اليوم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workouts.slice(0, 2).map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base truncate">{workout.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">{workout.duration} • {workout.calories} سعرة</p>
                  </div>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-shrink-0">
                  <Play className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">ابدأ</span>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('training')}
              className="flex items-center gap-2"
            >
              <Dumbbell className="h-4 w-4" />
              عرض جميع التمارين
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">برامج التدريب المتخصصة</CardTitle>
          <CardDescription>تمارين مصممة بالذكاء الاصطناعي حسب مستواك وأهدافك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center">
                  <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm sm:text-base">{workout.name}</h4>
                    <Badge variant={workout.difficulty === 'صعب' ? 'destructive' : workout.difficulty === 'متوسط' ? 'default' : 'secondary'} className="text-xs">
                      {workout.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
                      {workout.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                      {workout.calories} سعرة
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600" size="sm">
                      ابدأ التدريب
                    </Button>
                    <Button variant="outline" size="sm">
                      حجز مع مدرب
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

  const renderSports = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-5 w-5 text-orange-500" />
            الرياضات المتاحة
          </CardTitle>
          <CardDescription>اختر الرياضة التي تريد التدرب عليها وطور مهاراتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {sports.map((sport) => (
              <Card key={sport.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-4xl sm:text-5xl mb-3">{sport.icon}</div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{sport.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{sport.sessions} حصة تدريبية</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>التقدم</span>
                      <span>{sport.progress}%</span>
                    </div>
                    <Progress value={sport.progress} className="h-1.5" />
                  </div>
                  <Badge variant={sport.level === 'متقدم' ? 'default' : 'secondary'} className="text-xs mb-2">
                    {sport.level}
                  </Badge>
                  <Button size="sm" className="w-full mt-2">
                    ابدأ التدريب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-green-500" />
            تحليل الأداء الشامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">القوة البدنية</span>
                <span className="text-sm sm:text-base font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2 sm:h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">التحمل</span>
                <span className="text-sm sm:text-base font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2 sm:h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">المرونة</span>
                <span className="text-sm sm:text-base font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2 sm:h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">التوازن</span>
                <span className="text-sm sm:text-base font-medium">90%</span>
              </div>
              <Progress value={90} className="h-2 sm:h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">السرعة</span>
                <span className="text-sm sm:text-base font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2 sm:h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // صفحة تحليل الجسم الجديدة
  const renderBodyAnalysis = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* ربط السوار */}
      <WearableConnection />
      
      {/* النشاط اليومي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-5 w-5 text-orange-500" />
            النشاط اليومي
          </CardTitle>
          <CardDescription>
            تتبع نشاطك اليومي وأداءك الرياضي من خلال السوار الذكي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DailyActivity data={activityData} />
        </CardContent>
      </Card>

      {/* المؤشرات الصحية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Heart className="h-5 w-5 text-red-500" />
            المؤشرات الصحية
          </CardTitle>
          <CardDescription>
            تحليل شامل لحالتك الصحية ومؤشراتك الحيوية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HealthMetrics data={healthData} />
        </CardContent>
      </Card>

      {/* تحليل الجسم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            تحليل تركيبة الجسم المتقدم
          </CardTitle>
          <CardDescription>
            تحليل مفصل لتركيبة جسمك باستخدام تقنية BIA المتطورة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BodyAnalysis data={bodyData} userAge={20} userGender="male" />
        </CardContent>
      </Card>

      {/* لوحة التقدم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-green-500" />
            لوحة التقدم
          </CardTitle>
          <CardDescription>
            رسم بياني أسبوعي وشهري للنشاط والنوم والوزن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-500 mb-1">+12%</div>
              <div className="text-sm text-gray-600">تحسن النشاط</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-500 mb-1">+8%</div>
              <div className="text-sm text-gray-600">تحسن جودة النوم</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-500 mb-1">-2.5 كغ</div>
              <div className="text-sm text-gray-600">تغيير الوزن</div>
            </div>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">الرسم البياني للتقدم الأسبوعي/الشهري</p>
          </div>
        </CardContent>
      </Card>

      {/* التوصيات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            التوصيات الشخصية المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">
                🥗 التوصيات الغذائية
              </h4>
              <ul className="text-sm text-green-600/80 space-y-1">
                <li>• تناول 2.5 لتر ماء يومياً للرياضيين</li>
                <li>• 120-150غ بروتين يومياً لبناء العضلات</li>
                <li>• تناول الكربوهيدرات قبل التمرين بساعة</li>
                <li>• أضف المكملات الغذائية المناسبة</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-600 mb-2">
                🏃‍♂️ التوصيات الرياضية
              </h4>
              <ul className="text-sm text-orange-600/80 space-y-1">
                <li>• تدرب 5-6 أيام في الأسبوع</li>
                <li>• نوع بين تمارين القوة والكارديو</li>
                <li>• خذ يوم راحة كامل أسبوعياً</li>
                <li>• احرص على الإحماء والتبريد</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المتجر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
            متجر المعدات الرياضية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-medium mb-1">Garmin Forerunner 955</h4>
              <p className="text-sm text-gray-500 mb-2">ساعة رياضية متقدمة</p>
              <div className="text-lg font-bold text-orange-500 mb-2">45,000 دج</div>
              <Button size="sm" variant="outline" className="w-full">
                عرض التفاصيل
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="font-medium mb-1">Polar H10</h4>
              <p className="text-sm text-gray-500 mb-2">حزام معدل النبض الاحترافي</p>
              <div className="text-lg font-bold text-green-500 mb-2">8,500 دج</div>
              <Button size="sm" variant="outline" className="w-full">
                عرض التفاصيل
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="h-8 w-8 text-purple-500" />
              </div>
              <h4 className="font-medium mb-1">مجموعة أوزان قابلة للتعديل</h4>
              <p className="text-sm text-gray-500 mb-2">من 5 إلى 50 كيلو</p>
              <div className="text-lg font-bold text-purple-500 mb-2">25,000 دج</div>
              <Button size="sm" variant="outline" className="w-full">
                عرض التفاصيل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'ai-motion': return <AIMotionCorrection />;
      case 'training-plan': return <AdaptiveTrainingPlan />;
      case 'metrics': return <RealMetricsDashboard />;
      case 'pilot-test': return <PilotTestMode />;
      case 'Haraka': return <HarakaCreator />;
      case 'ar-training': return <ARInterface />;
      case 'competitions': return <CompetitionHub />;
      case 'rewards': return <RewardsSystem />;
      case 'gamification': return <AdvancedGamification />;
      case 'training': return renderTraining();
      case 'sports': return renderSports();
      case 'progress': return renderProgress();
      case 'body-analysis': return renderBodyAnalysis();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Top Header - Community Style */}
      <header className="bg-gradient-to-r from-orange-500 to-green-500 border-b border-orange-300 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-orange-500" />
              </div>
              <h1 className="text-xl font-bold text-white">
                منصة المجتمع الذكية - الشاب
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-500" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-orange-100">شاب • المستوى {user?.level || 1}</div>
                </div>
              </div>

              {/* User Stats */}
              <div className="hidden lg:flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">{user?.xp || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm">{user?.playCoins || 0}</span>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:text-orange-200 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-orange-300/30">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 rtl:space-x-reverse overflow-x-auto">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      transition-colors duration-200
                      ${isActive 
                        ? 'border-white text-white' 
                        : 'border-transparent text-orange-100 hover:text-white hover:border-orange-200'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}