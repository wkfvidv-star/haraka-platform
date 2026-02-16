import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
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
import { DailyStateCard } from '@/components/dashboard/DailyStateCard';
import { AIPersonalizationBanner } from '@/components/dashboard/AIPersonalizationBanner';
import { SimplifiedModeToggle } from '@/components/dashboard/SimplifiedModeToggle';
import { CognitiveSection } from '@/components/dashboard/CognitiveSection';
import { AcademicSection } from '@/components/dashboard/AcademicSection';
import { MentalWellBeingSection } from '@/components/dashboard/MentalWellBeingSection';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SportsClubsWidget } from '@/components/common/SportsClubsWidget';
import { PartnersSection } from '@/components/common/PartnersSection';
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
  WifiOff,
  Settings,
  ArrowRight,
  Shield,
  Video,
  Upload,
  HeartPulse,
  BookOpen,
  Wind
} from 'lucide-react';
import { JourneyNavigator } from '@/components/dashboard/JourneyNavigator';
import { DailyMissionCard } from '@/components/dashboard/DailyMissionCard';
import { QuickActionsFAB } from '@/components/dashboard/QuickActionsFAB';
import { InteractiveTimeline } from '@/components/dashboard/InteractiveTimeline';

export default function YouthDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLowDataMode, setIsLowDataMode] = useState(false);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
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

  // Grouped Tabs for better UX
  const navigationGroups = {
    training: [
      { id: 'training', label: 'التدريب', icon: Dumbbell },
      { id: 'sports', label: 'الرياضات', icon: Activity },
      { id: 'training-plan', label: 'الخطة', icon: Calendar },
      { id: 'ai-motion', label: 'التصحيح', icon: Brain },
      { id: 'ar-training', label: 'AR', icon: Camera },
    ],
    innovation: [
      { id: 'Haraka', label: 'المختبر', icon: Gamepad2 },
      { id: 'pilot-test', label: 'الاختبار', icon: TestTube },
      { id: 'metrics', label: 'المقاييس', icon: BarChart3 },
    ],
    community: [
      { id: 'competitions', label: 'المسابقات', icon: Trophy },
      { id: 'rewards', label: 'المكافآت', icon: Gift },
      { id: 'gamification', label: 'التحديات', icon: Target },
    ],
    analysis: [
      { id: 'progress', label: 'الأداء', icon: TrendingUp },
      { id: 'body-analysis', label: 'الجسم', icon: Heart },
    ],
    development: [
      { id: 'cognitive', label: 'الذهني', icon: Brain },
      { id: 'academic', label: 'الأكاديمي', icon: BookOpen },
      { id: 'mental', label: 'النفسي', icon: Wind },
    ]
  };

  const allTabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    ...navigationGroups.training,
    ...navigationGroups.development,
    ...navigationGroups.innovation,
    ...navigationGroups.community,
    ...navigationGroups.analysis
  ];

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Journey Navigator - The Daily Loop */}
      <JourneyNavigator
        currentStep={activeTab}
        onStepClick={setActiveTab}
      />

      {/* Simplified Mode Toggle Row */}
      <div className="flex justify-end mb-2">
        <SimplifiedModeToggle isSimplified={isSimplifiedMode} onToggle={setIsSimplifiedMode} />
      </div>

      {/* Daily State Card */}
      <DailyStateCard
        activityLevel="Good"
        focusLevel="Medium"
        mood="Positive"
        isSimplified={isSimplifiedMode}
      />

      {/* AI Personalization Banner */}
      <AIPersonalizationBanner isSimplified={isSimplifiedMode} />

      {/* Daily Mission - Instant Action */}
      <DailyMissionCard />

      {/* Welcome Section - Community Style */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-2xl sm:text-4xl font-black flex items-center gap-3 tracking-tighter">
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md">
                <Crown className="h-8 w-8 text-yellow-300" />
              </div>
              مرحباً بالشاب المبدع! 🚀
            </CardTitle>
            <CardDescription className="text-orange-50 text-lg font-medium opacity-90">
              استمر في الإبداع وحقق أهدافك مع أدوات الذكاء الاصطناعي المتطورة
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'المستوى', value: user?.level || 1, icon: Star, color: 'bg-yellow-400' },
                { label: 'نقاط الخبرة', value: user?.xp || 0, icon: Zap, color: 'bg-blue-400' },
                { label: 'العملات', value: user?.playCoins || 0, icon: Coins, color: 'bg-emerald-400' },
                { label: 'الشارات', value: user?.badges?.length || 0, icon: Award, color: 'bg-purple-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="text-center p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-orange-50 uppercase tracking-widest flex items-center justify-center gap-1">
                    <stat.icon className="w-3 h-3" />
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* New AI Sports Features Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/50 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-20 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          <CardHeader>
            <div className="flex justify-between items-center relative z-10">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-black text-blue-700 tracking-tighter">
                  <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  وحدات الذكاء الاصطناعي
                </CardTitle>
                <CardDescription className="text-blue-600/70 font-bold mt-1">
                  تقنيات متطورة للتدريب والتصحيح الحركي
                </CardDescription>
              </div>
              <Button
                variant={isLowDataMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLowDataMode(!isLowDataMode)}
                className={cn(
                  "rounded-full px-5 border-blue-200 font-bold tracking-widest text-[10px] uppercase transition-all",
                  isLowDataMode ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-blue-600 hover:bg-blue-50"
                )}
              >
                <WifiOff className="h-3.5 w-3.5 mr-2" />
                وضع البيانات
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLowDataMode ? (
              <div className="space-y-3">
                {[
                  { tab: 'ai-motion', title: 'التصحيح الحركي الذكي', desc: 'تحليل الحركة بدون فيديو', color: 'text-blue-700', bg: 'bg-blue-50' },
                  { tab: 'training-plan', title: 'الخطة التدريبية الذكية', desc: 'جدول التدريب الأسبوعي', color: 'text-green-700', bg: 'bg-green-50' },
                  { tab: 'metrics', title: 'المقاييس الواقعية', desc: 'عرض الأرقام والنتائج فقط', color: 'text-purple-700', bg: 'bg-purple-50' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn("p-4 border border-transparent rounded-2xl hover:border-current cursor-pointer transition-all", item.bg, item.color)}
                    onClick={() => setActiveTab(item.tab)}
                  >
                    <div className="font-black text-sm">{item.title}</div>
                    <div className="text-[10px] opacity-70 font-bold uppercase mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { tab: 'ai-motion', title: 'التصحيح الحركي', desc: 'تحليل وتصحيح الحركة', icon: Brain, color: 'bg-blue-500', hover: 'hover:bg-blue-50' },
                  { tab: 'training-plan', title: 'الخطة الذكية', desc: 'خطط مخصصة لأدائك', icon: Calendar, color: 'bg-green-500', hover: 'hover:bg-green-50' },
                  { tab: 'metrics', title: 'المقاييس الواقعية', desc: 'تحليل البيانات الحقيقية', icon: BarChart3, color: 'bg-purple-500', hover: 'hover:bg-purple-50' },
                  { tab: 'pilot-test', title: 'الاختبار الميداني', desc: 'تقييم النظام في الواقع', icon: TestTube, color: 'bg-red-500', hover: 'hover:bg-red-50' }
                ].map((item, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn(
                      "h-auto p-5 flex flex-col items-center gap-4 border-none shadow-sm rounded-3xl transition-all duration-300",
                      item.hover
                    )}
                    onClick={() => setActiveTab(item.tab)}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}
                    >
                      <item.icon className="w-7 h-7" />
                    </motion.div>
                    <div className="text-center">
                      <h4 className="font-black text-sm">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">{item.desc}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Holistic Progress Timeline Container */}
        <div className="flex flex-col gap-6">
          <InteractiveTimeline />
          <StatsCard
            title="مؤشر التركيز الذهني"
            value="8.5"
            description="قدرة عالية على التركيز اليوم"
            icon={Brain}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
        </div>
      </div>

      {/* Original Features Highlight - Updated for Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'Haraka', label: 'مختبر الإبداع', desc: 'أنشئ ألعابك التعليمية', icon: Gamepad2, color: 'bg-purple-500', hover: 'hover:bg-purple-50' },
          { id: 'ar-training', label: 'الواقع المعزز', desc: 'تدرب مع مدرب افتراضي', icon: Camera, color: 'bg-orange-500', hover: 'hover:bg-orange-50' },
          { id: 'competitions', label: 'المسابقات', desc: 'تنافس واكسب جوائز', icon: Trophy, color: 'bg-yellow-500', hover: 'hover:bg-yellow-50' },
          { id: 'rewards', label: 'المكافآت', desc: 'اكسب واستبدل النقاط', icon: Gift, color: 'bg-green-500', hover: 'hover:bg-green-50' }
        ].map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className={cn(
              "h-auto p-5 flex flex-col items-center gap-4 border-none shadow-sm rounded-3xl transition-all duration-300",
              item.hover
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
              <item.icon className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h4 className="font-black text-sm">{item.label}</h4>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{item.desc}</p>
            </div>
          </Button>
        ))}
      </div>

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
        {/* New Indicators */}
        <StatsCard
          title="مؤشر التركيز"
          value="8.5"
          description="جيد جداً"
          icon={Brain}
          color="blue"
        />
        <StatsCard
          title="الاستقرار النفسي"
          value="92%"
          description="مرتفع"
          icon={Wind}
          color="purple"
        />
        <StatsCard
          title="التقدم الأكاديمي"
          value="+15"
          description="نقطة"
          icon={BookOpen}
          color="green"
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

      {/* Development Group Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            مجموعة التطوير
          </CardTitle>
          <CardDescription>
            استكشف أدوات وموارد لتطوير مهاراتك وقدراتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-blue-50"
              onClick={() => setActiveTab('cognitive')}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">القدرات المعرفية</h4>
                <p className="text-xs text-muted-foreground mt-1">نمِ ذكائك وتركيزك</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-purple-50"
              onClick={() => setActiveTab('academic')}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">التحصيل الأكاديمي</h4>
                <p className="text-xs text-muted-foreground mt-1">تفوق في دراستك</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-green-50"
              onClick={() => setActiveTab('mental')}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">الصحة النفسية</h4>
                <p className="text-xs text-muted-foreground mt-1">عزز رفاهيتك</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-red-50"
              onClick={() => setActiveTab('body-analysis')}
            >
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">تحليل الجسم</h4>
                <p className="text-xs text-muted-foreground mt-1">راقب صحتك</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Holistic Progress Timeline */}
      <InteractiveTimeline />

      {/* Community Integrations */}
      <SportsClubsWidget />
      <PartnersSection />
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-blue-800">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white/10 p-4 rounded-full">
            <Video className="w-8 h-8 sm:w-12 sm:h-12 text-blue-300" />
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h3 className="text-lg sm:text-xl font-bold mb-2">حلل أدائك بالذكاء الاصطناعي</h3>
            <p className="text-blue-100 text-sm mb-4">
              ارفع فيديو لأدائك الحركي واحصل على تحليل فوري وتوصيات للتحسين
            </p>
            <div className="flex gap-3 justify-center sm:justify-start">
              <Button variant="secondary" className="gap-2">
                <Upload className="w-4 h-4" />
                رفع فيديو
              </Button>
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2">
                <Camera className="w-4 h-4" />
                تسجيل مباشر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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

  const renderCognitive = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CognitiveSection isSimplified={isSimplifiedMode} />
    </div>
  );

  const renderAcademic = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AcademicSection isSimplified={isSimplifiedMode} />
    </div>
  );

  const renderMental = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <MentalWellBeingSection isSimplified={isSimplifiedMode} />
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

      {/* Privacy InfoCard */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-700 text-sm">بياناتك محمية بخصوصية تامة</h4>
          <p className="text-sm text-blue-600 mt-1">
            جميع قياسات وتفاصيل تحليل الجسم مشفرة ولا يتم مشاركتها مع أي جهة خارجية إلا بموافقتك الصريحة.
          </p>
        </div>
      </div>

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
      case 'cognitive': return renderCognitive();
      case 'academic': return renderAcademic();
      case 'mental': return renderMental();
      case 'progress': return renderProgress();
      case 'body-analysis': return renderBodyAnalysis();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`expert-dashboard-root selection:bg-orange-500/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Image with Deep Overlay */}
      <div
        className="expert-bg-image"
        style={{ backgroundImage: 'url(/images/youth_adults_active_bg.png)' }}
      />
      <div className="expert-bg-overlay" />

      <header className="expert-header">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 group cursor-pointer relative z-10">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10"
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black text-white tracking-tighter">
                  منصة الشباب
                </h1>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Haraka Universe</span>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-6 relative z-10">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="text-left rtl:text-right hidden md:block text-right">
                  <div className="text-base font-black text-white leading-none">
                    {user?.name}
                  </div>
                  <div className="text-[11px] font-black text-orange-400 uppercase mt-1 tracking-widest">مشترك ذهبي</div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar"
                >
                  <User className="h-7 w-7 text-slate-300 group-hover/avatar:text-orange-400 transition-colors" />
                </motion.div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="w-12 h-12 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold"
                title="تسجيل الخروج"
              >
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Glassmorphic design */}
        <div className="expert-nav-tabs-container">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-3 py-4 overflow-x-auto no-scrollbar scroll-smooth">
              {/* Dashboard Tab */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-300 font-black text-sm whitespace-nowrap",
                  activeTab === 'dashboard'
                    ? "bg-orange-500 text-white shadow-xl shadow-orange-900/40 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Home className="h-5 w-5" />
                الرئيسية
              </button>

              <div className="w-[1px] h-8 bg-white/10 mx-2 flex-shrink-0" />

              {/* Groups - Reusing the same logic but with premium styling */}
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-3xl border border-white/5">
                {[...navigationGroups.training, ...navigationGroups.development].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-black text-xs whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-white/10 text-orange-400 border border-white/10 shadow-lg"
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="w-[1px] h-8 bg-white/10 mx-2 flex-shrink-0" />

              <div className="flex items-center gap-2">
                {[...navigationGroups.innovation, ...navigationGroups.community, ...navigationGroups.analysis].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-black text-xs whitespace-nowrap border-2 border-transparent",
                      activeTab === tab.id
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 font-arabic">
        <div className="expert-container">
          {renderContent()}
        </div>
      </main>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-8 left-8 z-50">
        <QuickActionsFAB />
      </div>
    </div>
  );
}
