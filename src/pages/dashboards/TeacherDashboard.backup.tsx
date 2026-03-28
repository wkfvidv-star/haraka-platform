import React, { useState, useEffect } from 'react';
import { coachService, Group } from '@/services/coachService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// New Modular Components
import { TeacherHero } from '@/components/teacher-dashboard/TeacherHero';
import { TeacherStatsGrid } from '@/components/teacher-dashboard/TeacherStatsGrid';
import { TeacherQuickActions } from '@/components/teacher-dashboard/TeacherQuickActions';
import { TeacherClassesOverview } from '@/components/teacher-dashboard/TeacherClassesOverview';
import { TeacherRecentActivity } from '@/components/teacher-dashboard/TeacherRecentActivity';
import { TeacherUpcomingTasks } from '@/components/teacher-dashboard/TeacherUpcomingTasks';
import { TeacherOnboarding } from '@/components/teacher-dashboard/TeacherOnboarding';
import { ClassComparisonChart } from '@/components/teacher-dashboard/ClassComparisonChart';
import { TalentSpotlightCard } from '@/components/teacher-dashboard/TalentSpotlightCard';
import { TeacherVideoReviews } from '@/components/teacher-dashboard/TeacherVideoReviews';

// Existing Sub-components
import { ClassManagement } from '@/components/teacher/ClassManagement';
import { ExerciseManagement } from '@/components/teacher/ExerciseManagement';
import { ChallengeCreation } from '@/components/teacher/ChallengeCreation';
import { CommunicationTools } from '@/components/teacher/CommunicationTools';
import { MotorProfileInput } from '@/components/teacher/MotorProfileInput';

import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import {
  Users,
  BookOpen,
  Trophy,
  MessageSquare,
  BarChart3,
  LogOut,
  User,
  GraduationCap,
  Sparkles,
  Home,
  TrendingUp,
  PlayCircle,
  ActivitySquare
} from 'lucide-react';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  // Onboarding State
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const hasSeenOnboarding = localStorage.getItem('haraka_teacher_onboarding_seen');
    if (!hasSeenOnboarding) setIsNewUser(true);
    return !hasSeenOnboarding;
  });

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('haraka_teacher_onboarding_seen', 'true');
  };

  const handleReplayOnboarding = () => {
    setIsNewUser(false);
    setShowOnboarding(true);
  };

  // Phase 2: AI Note Drafter State
  const [aiNote, setAiNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  const generateAiNote = () => {
    setIsGeneratingNote(true);
    setTimeout(() => {
      setAiNote('بناءً على تحليل البيانات للشهر الحالي، أظهرت الطالبة سارة تحسناً ملحوظاً في معدل الحضور بنسبة 10%، كما ارتفع أداؤها في التمارين البدنية. نوصي بتشجيعها على الاستمرار في المشاركة في التحديات الأسبوعية لتعزيز هذا التقدم.');
      setIsGeneratingNote(false);
    }, 1500);
  };

  const [dashboardStats, setDashboardStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completedExercises: 0,
    activeChallenges: 0,
    pendingReports: 0,
    unreadMessages: 0
  });

  const [classOverview, setClassOverview] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([
    {
      id: '1',
      type: 'exercise_completed',
      student: 'أحمد محمد علي',
      activity: 'تدريب القوة الوظيفية',
      class: 'الثالثة متوسط أ',
      time: 'منذ 30 دقيقة',
      score: 85
    },
    {
      id: '2',
      type: 'challenge_joined',
      student: 'فاطمة الزهراء',
      activity: 'تحدي اللياقة الشامل',
      class: 'الثالثة متوسط أ',
      time: 'منذ ساعة',
      score: 92
    }
  ]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (user?.id) {
        try {
          const groups = await coachService.getGroups(user.id);
          const totalStudents = groups.reduce((acc, g) => acc + g.memberCount, 0);

          setDashboardStats(prev => ({
            ...prev,
            totalClasses: groups.length,
            totalStudents: totalStudents,
            activeStudents: totalStudents, // Simple assumption
            averageProgress: 75, // Placeholder
            completedExercises: 120 // Placeholder
          }));

          setClassOverview(groups.map(g => ({
            id: g.id,
            name: g.name,
            students: g.memberCount,
            activeStudents: g.memberCount,
            averageProgress: 80,
            recentActivity: 'نشط حديثاً',
            status: 'نشط'
          })));
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        }
      }
    };
    fetchTeacherData();
  }, [user]);

  const upcomingTasks = [
    {
      id: '1',
      title: 'إعداد تقرير شهري للثالثة متوسط أ',
      dueDate: '2024-10-20',
      priority: 'مهم',
      type: 'تقرير'
    },
    {
      id: '2',
      title: 'إنشاء تحدي جديد للأسبوع القادم',
      dueDate: '2024-10-18',
      priority: 'عادي',
      type: 'تحدي'
    },
    {
      id: '3',
      title: 'مراجعة التمارين المرفوعة',
      dueDate: '2024-10-17',
      priority: 'عاجل',
      type: 'تمرين'
    }
  ];

  // تبويبات التنقل
  const navigationTabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'classes', label: 'الصفوف', icon: Users },
    { id: 'assessments', label: 'القياسات', icon: ActivitySquare },
    { id: 'videos', label: 'الفيديوهات', icon: PlayCircle },
    { id: 'exercises', label: 'التمارين', icon: BookOpen },
    { id: 'challenges', label: 'التحديات', icon: Trophy },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'communication', label: 'التواصل', icon: MessageSquare }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <div data-tour="teacher_hero">
        <TeacherHero userName={user?.name || "المعلم"} stats={dashboardStats} />
      </div>

      {/* 2. Stats Grid */}
      <div data-tour="teacher_stats">
        <TeacherStatsGrid stats={dashboardStats} />
      </div>

      {/* 3. Quick Actions */}
      <div data-tour="teacher_quick_actions">
        <TeacherQuickActions unreadMessages={dashboardStats.unreadMessages} setActiveTab={setActiveTab} />
      </div>

      {/* 4. Middle Section: Classes & Activity & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Overview */}
        <div className="lg:col-span-2" data-tour="teacher_classes">
          <TeacherClassesOverview classes={classOverview} onViewAll={() => setActiveTab('classes')} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 h-full">
          <TeacherRecentActivity activities={recentActivities} />
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-1 h-full" data-tour="teacher_tasks">
          <TeacherUpcomingTasks tasks={upcomingTasks} />
        </div>

        {/* --- Phase 2: Performance & Talent --- */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white dark:bg-[#0B0E14] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm h-full">
            <ClassComparisonChart />
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <TalentSpotlightCard />
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-blue-500/20 shadow-xl overflow-hidden group">
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/5 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-black text-white flex items-center gap-3 tracking-tighter">
            <div className="p-2 bg-blue-500/20 ring-1 ring-blue-500/30 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            التقارير والإحصائيات (Advanced Analytics)
          </CardTitle>
          <CardDescription className="text-gray-400 font-bold mt-1">
            تحليلات مفصلة عن أداء الطلاب والصفوف (Data Hub)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              تقرير الأداء الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">82%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">متوسط الأداء</div>
              </div>
              <Button className="w-full" variant="outline">
                عرض التقرير المفصل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              تقرير حضور الطلاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">معدل الحضور</div>
              </div>
              <Button className="w-full" variant="outline">
                عرض التقرير المفصل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300 group/report">
          <CardHeader className="pb-4 border-b border-white/5">
            <CardTitle className="text-lg font-black text-white group-hover/report:text-blue-300 transition-colors flex items-center gap-3 uppercase tracking-tight">
              <Trophy className="h-5 w-5 text-blue-400" />
              تقرير التحديات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="text-center p-6 bg-black/20 rounded-[1.5rem] border border-white/5 shadow-inner">
                <div className="text-3xl font-black text-blue-400 leading-tight">5</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">تحديات نشطة</div>
              </div>
              <Button className="w-full bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all h-10" variant="outline">
                عرض تقرير التحديات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Note Drafter - New for Phase 2 */}
      <Card className="glass-card border-blue-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
            <div className="p-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            مسودة الملاحظات الذكية (AI Note Drafter)
          </CardTitle>
          <CardDescription className="text-gray-400 font-bold mt-1">
            توليد مسودة ملاحظات للطلاب بالذكاء الاصطناعي بناءً على تحليل الأداء
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-8">
          <div className="space-y-6">
            <textarea
              className="w-full h-40 p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm leading-relaxed"
              placeholder="اختر طالباً أو اضغط على توليد لإنشاء مسودة عامة..."
              value={aiNote}
              onChange={(e) => setAiNote(e.target.value)}
            />
            <Button
              onClick={generateAiNote}
              disabled={isGeneratingNote}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-95 text-base uppercase tracking-widest"
            >
              <Sparkles className="ml-3 h-5 w-5 animate-pulse" />
              {isGeneratingNote ? 'جاري التحليل الرقمي...' : 'توليد مسودة الملاحظات'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            تحليل مفصل للأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">الرسوم البيانية التفاعلية للأداء</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'classes': return <ClassManagement />;
      case 'assessments': return <MotorProfileInput />;
      case 'videos': return <TeacherVideoReviews />;
      case 'exercises': return <ExerciseManagement />;
      case 'challenges': return <ChallengeCreation />;
      case 'reports': return renderReports();
      case 'communication': return <CommunicationTools />;
      default: return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen pb-20 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <TeacherOnboarding
          onComplete={handleCompleteOnboarding}
          onSkip={handleCompleteOnboarding}
          isNewUser={isNewUser}
        />
      )}

      {/* 🎯 Cinematic Sports-Themed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* The Image - High Detail Photographic Expert-Grade */}
        <div
          className="absolute inset-0 bg-[url('/images/teacher_cinematic_bg.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 scale-105"
          aria-hidden="true"
        />
        {/* Precision Dark Overlay - Moody & Professional */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/98 via-blue-900/90 to-blue-950/98 mix-blend-multiply transition-colors duration-500" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Readability Guard: Secondary Shadow Layer for Content Pop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" />
      </div>

      {/* Top Header - Precision Styled */}
      <header className="bg-blue-950/60 dark:bg-gray-900/60 backdrop-blur-3xl sticky top-0 z-40 border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                منصة الحركة <span className="text-blue-400 opacity-80">(Teacher Hub)</span>
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {/* Replay Tour Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplayOnboarding}
                className="bg-white/5 border-white/10 text-gray-300 hover:text-indigo-400 hover:bg-white/10 transition-all rounded-xl gap-2 h-10 px-4 group hidden md:flex"
                title="إعادة جولة التعريف بالمنصة"
              >
                <PlayCircle className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                <span>إعادة الجولة</span>
              </Button>

              {/* User Profile - Expert Style */}
              <div className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner group cursor-pointer hover:bg-white/10 transition-all">
                <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden ring-2 ring-white/10 group-hover:ring-blue-400/50 transition-all">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-black text-white leading-tight uppercase tracking-tight">
                    {user?.name || "المعلم"}
                  </div>
                  <div className="text-[10px] text-blue-300 font-bold uppercase tracking-widest opacity-70">المعلم الرياضي</div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Precision Floating Style */}
        <div className="border-t border-white/5 bg-white/5 backdrop-blur-sm" data-tour="teacher_navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="flex space-x-1 rtl:space-x-reverse overflow-x-auto no-scrollbar">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-2 px-5 rounded-full font-black text-xs whitespace-nowrap
                      transition-all duration-300 relative uppercase tracking-wider
                      ${isActive
                        ? 'bg-white text-blue-900 shadow-xl scale-105'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    {tab.label}
                    {tab.id === 'communication' && dashboardStats.unreadMessages > 0 && (
                      <Badge className="ml-2 bg-red-600 text-white text-[10px] px-2 py-0 h-4 min-w-[18px] flex justify-center items-center shadow-lg animate-pulse">
                        {dashboardStats.unreadMessages}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Precision Alignment */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}