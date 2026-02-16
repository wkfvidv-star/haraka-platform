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
import { ProfessionalExercises } from '@/components/student/ProfessionalExercises';
import { ProfessionalGames } from '@/components/student/ProfessionalGames';
import { ProfessionalProgress } from '@/components/student/ProfessionalProgress';
import VideoAnalysis from '@/components/student/VideoAnalysis';
import AIVideoGenerator from '@/components/ai/AIVideoGenerator';
import AdaptiveTutor from '@/components/ai/AdaptiveTutor';
import SmartChatAssistant from '@/components/ai/SmartChatAssistant';
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
  Zap,
  Heart,
  Award,
  Activity,
  BarChart3,
  ShoppingBag,
  Lightbulb,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  Home,
  LogOut,
  User,
  Settings,
  Video,
  Brain,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  // بيانات وهمية للنشاط اليومي
  const activityData = {
    steps: 8543,
    stepsGoal: 10000,
    distance: 6.2,
    calories: 320,
    heartRate: {
      current: 78,
      min: 65,
      max: 145,
      avg: 85
    },
    activeTime: 180, // 3 ساعات
    sedentaryTime: 420 // 7 ساعات
  };

  // بيانات وهمية للصحة
  const healthData = {
    heartRate: {
      min: 65,
      max: 145,
      avg: 85,
      restingHR: 72
    },
    sleep: {
      totalSleep: 480, // 8 ساعات
      deepSleep: 120, // ساعتان
      lightSleep: 240, // 4 ساعات
      remSleep: 120, // ساعتان
      sleepQuality: 85
    },
    oxygenSaturation: 98,
    bloodPressure: {
      systolic: 110,
      diastolic: 70
    }
  };

  // بيانات وهمية لتحليل الجسم
  const bodyData = {
    bodyFatPercentage: 15.2,
    muscleMass: 28.5,
    waterPercentage: 62.3,
    bmi: 19.8,
    weight: 45,
    height: 150,
    visceralFat: 3,
    boneMass: 2.1,
    metabolicAge: 12
  };

  const todayExercises = [
    { 
      id: 1, 
      name: 'تمرين القوة الوظيفية الأساسية', 
      duration: '15 دقيقة', 
      difficulty: 'مبتدئ', 
      points: 20, 
      completed: false,
      category: 'القوة'
    },
    { 
      id: 2, 
      name: 'تدريب التحمل القلبي الوعائي', 
      duration: '20 دقيقة', 
      difficulty: 'متوسط', 
      points: 30, 
      completed: true,
      category: 'التحمل'
    },
    { 
      id: 3, 
      name: 'تمارين المرونة والحركية', 
      duration: '12 دقيقة', 
      difficulty: 'مبتدئ', 
      points: 15, 
      completed: false,
      category: 'المرونة'
    },
  ];

  const quickChallenges = [
    { 
      id: 1, 
      name: 'تحدي اللياقة البدنية الشامل', 
      description: 'برنامج تدريبي متكامل لمدة 30 يوماً', 
      type: 'فردي',
      participants: 245,
      points: 500
    },
    { 
      id: 2, 
      name: 'بطولة المدرسة للجري', 
      description: 'مسابقة جري بين طلاب المدرسة', 
      type: 'تنافسي',
      participants: 89,
      points: 300
    },
    { 
      id: 3, 
      name: 'تحدي الفريق الأسبوعي', 
      description: 'تحديات تتطلب التعاون بين أعضاء الفريق', 
      type: 'جماعي',
      participants: 156,
      points: 200
    },
  ];

  const achievements = [
    { id: 1, name: 'محارب اللياقة', description: 'أكملت 50 تمرين', icon: '⚔️', unlocked: true },
    { id: 2, name: 'خبير التوازن', description: 'أتقنت تمارين التوازن', icon: '⚖️', unlocked: true },
    { id: 3, name: 'عداء الماراثون', description: 'جريت مسافة 25 كم', icon: '🏃‍♂️', unlocked: false },
  ];

  // تبويبات التنقل المحدثة مع الميزات الجديدة
  const navigationTabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'ai-tutor', label: 'المدرّس الذكي', icon: Brain },
    { id: 'ai-video', label: 'فيديو بالذكاء الاصطناعي', icon: Video },
    { id: 'ai-chat', label: 'المساعد الذكي', icon: MessageCircle },
    { id: 'exercises', label: 'التمارين', icon: Dumbbell },
    { id: 'games', label: 'التحديات', icon: Target },
    { id: 'progress', label: 'التقدم', icon: TrendingUp },
    { id: 'rewards', label: 'الجوائز', icon: Trophy },
    { id: 'body-analysis', label: 'تحليل الجسم', icon: Heart }
  ];

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-educational-primary to-educational-purple text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Award className="h-6 w-6" />
            مرحباً بك في منصة التعليم الذكية! 
          </CardTitle>
          <CardDescription className="text-blue-100">
            تابع تطورك الرياضي بأدوات احترافية ومؤشرات دقيقة مع الذكاء الاصطناعي
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold">{activityData.steps.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-blue-100">خطوات اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold">{activityData.calories}</div>
              <div className="text-xs sm:text-sm text-blue-100">سعرة محروقة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold">{Math.floor(activityData.activeTime / 60)}س</div>
              <div className="text-xs sm:text-sm text-blue-100">وقت النشاط</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Quick Access */}
      <Card className="bg-gradient-to-r from-educational-secondary/10 to-educational-accent/10 border-educational-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-educational-accent" />
            ميزات الذكاء الاصطناعي الجديدة
          </CardTitle>
          <CardDescription>
            استكشف الميزات الذكية الجديدة لتحسين تجربة التعلم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-educational-primary/5"
              onClick={() => setActiveTab('ai-tutor')}
            >
              <div className="w-12 h-12 bg-educational-primary rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">المدرّس الافتراضي</h4>
                <p className="text-xs text-muted-foreground mt-1">توصيات شخصية ذكية</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-educational-secondary/5"
              onClick={() => setActiveTab('ai-video')}
            >
              <div className="w-12 h-12 bg-educational-secondary rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">فيديو بالذكاء الاصطناعي</h4>
                <p className="text-xs text-muted-foreground mt-1">أنشئ محتوى تفاعلي</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-educational-accent/5"
              onClick={() => setActiveTab('ai-chat')}
            >
              <div className="w-12 h-12 bg-educational-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h4 className="font-medium">المساعد الذكي</h4>
                <p className="text-xs text-muted-foreground mt-1">دردشة ذكية متخصصة</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="مؤشر الأداء العام"
          value="78%"
          description="تحسن بنسبة 12%"
          icon={TrendingUp}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="التمارين المكتملة"
          value="156"
          description="هذا الشهر"
          icon={Dumbbell}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="معدل النبض"
          value={activityData.heartRate.current}
          description="نبضة/دقيقة"
          icon={Heart}
          color="red"
        />
        <StatsCard
          title="مستوى اللياقة"
          value="متقدم"
          description="المرتبة 15 من 200"
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Today's Professional Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-educational-primary" />
            البرنامج التدريبي اليومي
          </CardTitle>
          <CardDescription>
            تمارين مخصصة ومصممة علمياً لتطوير أداءك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayExercises.slice(0, 3).map((exercise) => (
              <div key={exercise.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-educational-primary/5 dark:from-gray-800 dark:to-educational-primary/10 rounded-lg border">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-educational-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{exercise.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {exercise.duration}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {exercise.category}
                      </Badge>
                      <span className="text-xs text-educational-primary font-medium">
                        {exercise.points} نقطة
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-educational-primary hover:bg-educational-primary/90 flex-shrink-0"
                  disabled={exercise.completed}
                >
                  {exercise.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">مكتمل</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">ابدأ</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('exercises')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              عرض جميع التمارين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-educational-purple" />
            التحديات والمسابقات النشطة
          </CardTitle>
          <CardDescription>
            انضم للتحديات المهنية وطور مهاراتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {quickChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-gradient-to-br from-educational-purple/10 to-educational-accent/10 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-educational-purple" />
                  <Badge variant="outline" className="text-xs">
                    {challenge.type}
                  </Badge>
                </div>
                <h4 className="font-semibold mb-2 text-sm">{challenge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {challenge.participants} مشارك
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {challenge.points} نقطة
                  </span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  انضم للتحدي
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('games')}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              عرض جميع التحديات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-educational-secondary" />
            نظرة سريعة على التقدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-educational-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-educational-secondary mb-1">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">معدل الإنجاز الشهري</div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="text-center p-4 bg-educational-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-educational-primary mb-1">78%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">مؤشر اللياقة العام</div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="text-center p-4 bg-educational-purple/10 rounded-lg">
              <div className="text-2xl font-bold text-educational-purple mb-1">92%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">الالتزام بالبرنامج</div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('progress')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              عرض التحليل المفصل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6">
      <ProfessionalExercises />
      
      {/* Video Analysis Section - Added below exercise cards */}
      <VideoAnalysis 
        exerciseId="exercise_1" 
        exerciseName="تمرين القوة الوظيفية الأساسية"
      />
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Trophy className="h-5 w-5 text-yellow-500" />
            الإنجازات والشارات المهنية
          </CardTitle>
          <CardDescription>
            تتبع إنجازاتك واحصل على شارات الخبرة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`text-center ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200' : 'opacity-50'}`}>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-3xl sm:text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{achievement.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-2 bg-yellow-500 text-xs">مكتسب</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
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
            <Activity className="h-5 w-5 text-educational-primary" />
            النشاط اليومي
          </CardTitle>
          <CardDescription>
            تتبع نشاطك اليومي من خلال السوار الذكي
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
            تحليل شامل لحالتك الصحية
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
            <BarChart3 className="h-5 w-5 text-educational-purple" />
            تحليل تركيبة الجسم
          </CardTitle>
          <CardDescription>
            تحليل مفصل لتركيبة جسمك باستخدام تقنية BIA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BodyAnalysis data={bodyData} userAge={14} userGender="male" />
        </CardContent>
      </Card>

      {/* التوصيات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            التوصيات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-educational-secondary/10 rounded-lg">
              <h4 className="font-medium text-educational-secondary mb-2">
                🥗 التوصيات الغذائية
              </h4>
              <ul className="text-sm text-educational-secondary/80 space-y-1">
                <li>• اشرب 8 أكواب ماء يومياً</li>
                <li>• تناول 5 حصص من الخضار والفواكه</li>
                <li>• قلل من السكريات والمشروبات الغازية</li>
              </ul>
            </div>
            <div className="p-4 bg-educational-primary/10 rounded-lg">
              <h4 className="font-medium text-educational-primary mb-2">
                🏃‍♂️ التوصيات الرياضية
              </h4>
              <ul className="text-sm text-educational-primary/80 space-y-1">
                <li>• مارس الرياضة 30 دقيقة يومياً</li>
                <li>• امش 10000 خطوة على الأقل</li>
                <li>• خذ فترات راحة كل ساعة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المتجر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingBag className="h-5 w-5 text-educational-purple" />
            متجر الأساور والإكسسوارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-educational-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-educational-primary" />
              </div>
              <h4 className="font-medium mb-1">Mi Band 7</h4>
              <p className="text-sm text-gray-500 mb-2">سوار ذكي متقدم</p>
              <div className="text-lg font-bold text-educational-primary mb-2">2,500 دج</div>
              <Button size="sm" variant="outline" className="w-full">
                عرض التفاصيل
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-educational-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-educational-secondary" />
              </div>
              <h4 className="font-medium mb-1">حزام معدل النبض</h4>
              <p className="text-sm text-gray-500 mb-2">لقياس دقيق للنبض</p>
              <div className="text-lg font-bold text-educational-secondary mb-2">1,200 دج</div>
              <Button size="sm" variant="outline" className="w-full">
                عرض التفاصيل
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="w-16 h-16 bg-educational-purple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-educational-purple" />
              </div>
              <h4 className="font-medium mb-1">شاحن لاسلكي</h4>
              <p className="text-sm text-gray-500 mb-2">شحن سريع وآمن</p>
              <div className="text-lg font-bold text-educational-purple mb-2">800 دج</div>
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
      case 'ai-tutor': return <AdaptiveTutor />;
      case 'ai-video': return <AIVideoGenerator />;
      case 'ai-chat': return <SmartChatAssistant />;
      case 'exercises': return renderExercises();
      case 'games': return <ProfessionalGames />;
      case 'progress': return <ProfessionalProgress />;
      case 'rewards': return renderRewards();
      case 'body-analysis': return renderBodyAnalysis();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-educational-primary rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة التعليم الذكية - التلميذ
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-educational-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">تلميذ</div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
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
                        ? 'border-educational-primary text-educational-primary' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
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