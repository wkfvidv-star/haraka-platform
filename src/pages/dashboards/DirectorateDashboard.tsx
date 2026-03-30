import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { ProvinceSelector } from '@/components/directorate/ProvinceSelector';
import { DirectorateReports } from '@/components/directorate/DirectorateReports';
import { DirectorateCompetitions } from '@/components/directorate/DirectorateCompetitions';
import { DirectorateStrategy } from '@/components/directorate/DirectorateStrategy';
import { DirectorateNotifications } from '@/components/directorate/DirectorateNotifications';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DirectorateOnboarding } from '@/components/directorate-dashboard/DirectorateOnboarding';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';
import {
  Building2,
  Users,
  GraduationCap,
  Trophy,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  BarChart3,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  Download,
  Send,
  MapPin,
  School,
  Home,
  LogOut,
  User,
  Settings,
  Lightbulb,
  Globe,
  Menu,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  schools: number;
  students: number;
  teachers: number;
}

interface ProvinceOverview {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activeCompetitions: number;
  averageAttendance: number;
  overallPerformance: number;
  monthlyProgress: number;
  pendingReports: number;
}

interface SchoolSummary {
  id: string;
  name: string;
  type: string;
  studentCount: number;
  teacherCount: number;
  principalName: string;
  averagePerformance: number;
  attendanceRate: number;
  activeStudents: number;
  completedActivities: number;
  totalActivities: number;
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  recentAchievements: number;
  lastUpdated: string;
  region: string;
  context: 'urban' | 'rural';
}

export default function DirectorateDashboard() {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSchool, setSelectedSchool] = useState<SchoolSummary | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const hasSeen = localStorage.getItem('haraka_directorate_onboarding_seen');
    return !hasSeen;
  });

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('haraka_directorate_onboarding_seen', 'true');
  };

  const handleReplayOnboarding = () => {
    setShowOnboarding(true);
  };

  const [provinceOverview] = useState<ProvinceOverview>({
    totalSchools: selectedProvince?.schools || 125,
    totalStudents: selectedProvince?.students || 45000,
    totalTeachers: selectedProvince?.teachers || 2800,
    activeCompetitions: 6,
    averageAttendance: 91.8,
    overallPerformance: 85.7,
    monthlyProgress: 8.4,
    pendingReports: 4
  });

  const [schoolSummaries] = useState<SchoolSummary[]>([
    {
      id: 'school_1',
      name: `متوسطة الشهيد محمد بوضياف`,
      type: 'متوسطة',
      studentCount: 420,
      teacherCount: 28,
      principalName: 'الأستاذ أحمد بن علي',
      averagePerformance: 89.2,
      attendanceRate: 94.5,
      activeStudents: 398,
      completedActivities: 145,
      totalActivities: 160,
      healthStatus: 'ممتاز',
      recentAchievements: 8,
      lastUpdated: '2024-10-16',
      region: 'المنطقة الشرقية',
      context: 'urban'
    }
  ]);

  const navigationTabs = [
    { id: 'dashboard',     label: 'لوحة التحكم',   icon: Home },
    { id: 'schools',       label: 'المدارس',       icon: School },
    { id: 'reports',       label: 'التقارير',       icon: BarChart3 },
    { id: 'competitions',  label: 'المسابقات',    icon: Trophy },
    { id: 'strategy',      label: 'الاستراتيجية',  icon: Target },
    { id: 'notifications', label: 'الإشعارات',     icon: Bell },
    { id: 'ratings',       label: '⭐ التقييم',         icon: Award },
  ];

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
  };

  const handleBackToSelection = () => {
    setSelectedProvince(null);
    setActiveTab('dashboard');
    setSelectedSchool(null);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-emerald-100 text-emerald-800';
      case 'جيد': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-amber-100 text-amber-800';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Province Overview Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="md:col-span-4 bg-white/60 backdrop-blur-md border-white/40 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-right">
              <h2 className="text-2xl font-black text-slate-800 mb-2">إحصائيات الولاية الشاملة</h2>
              <p className="text-muted-foreground font-medium mb-4">نظرة عامة على أداء المدارس في ولاية {selectedProvince?.arabicName}</p>
              <div className="flex flex-wrap gap-4 justify-end">
                <Badge className="bg-blue-100 text-blue-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {provinceOverview.totalSchools} مؤسسة
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {provinceOverview.totalStudents.toLocaleString()} طالب
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {provinceOverview.overallPerformance}% أداء عام
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="معدل الحضور" value={`${provinceOverview.averageAttendance}%`} icon={CheckCircle} color="green" />
        <StatsCard title="المسابقات النشطة" value={provinceOverview.activeCompetitions.toString()} icon={Trophy} color="yellow" />
        <StatsCard title="التقدم الشهري" value={`+${provinceOverview.monthlyProgress}%`} icon={TrendingUp} color="blue" />
        <StatsCard title="التقارير المعلقة" value={provinceOverview.pendingReports.toString()} icon={AlertTriangle} color="red" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">ملخص المدارس</CardTitle>
          <Button size="sm" className="bg-[#0ea5e9]">
            <Plus className="h-4 w-4 ml-2" /> إلحاق مدرسة
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schoolSummaries.map((school) => (
              <div key={school.id} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-white/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl"><School className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <div className="font-bold text-slate-800">{school.name}</div>
                    <div className="text-xs text-muted-foreground">{school.principalName} • {school.studentCount} طالب</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-black text-emerald-600">{school.averagePerformance}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase">الأداء</div>
                  </div>
                  <Badge className={getHealthStatusColor(school.healthStatus)}>{school.healthStatus}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedSchool(school)}><Eye className="h-4 w-4 text-blue-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (selectedSchool) return <div className="p-8 text-center text-muted-foreground">عرض تفاصيل المدرسة قيد التطوير</div>;
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'reports': return <DirectorateReports selectedProvince={selectedProvince} />;
      case 'competitions': return <DirectorateCompetitions selectedProvince={selectedProvince} />;
      case 'strategy': return <DirectorateStrategy selectedProvince={selectedProvince} />;
      case 'notifications': return <DirectorateNotifications selectedProvince={selectedProvince} />;
      case 'ratings': return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
          <div>
            <h3 className="text-xl font-black text-white mb-4">⭐ تقييم المدارس والمدربين</h3>
            <RatingSystem
              raterRole="مديرية"
              raterName={user?.name || 'المديرية'}
              targets={[
                { id: 'sch1', name: 'متوسطة الشهيد بوضياف', role: 'مدير: أحمد بن علي' },
                { id: 'sch2', name: 'ثانوية الأمير عبد القادر', role: 'مدير: سامية قاسمي' },
                { id: 'coa1', name: 'المدرب كريم معروف', role: 'مدرب رياضة بدنية' },
              ]}
              mode="rate"
            />
          </div>
          <div>
            <h3 className="text-xl font-black text-white mb-4">💬 غرفة المديريات</h3>
            <ChatSystem userRole="directorate" userName={user?.name || 'المديرية'} inline defaultOpen />
          </div>
        </div>
      );
      default: return renderDashboard();
    }
  };

  if (!selectedProvince) {
    return (
      <ErrorBoundary>
        <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
          <ProvinceSelector onProvinceSelect={handleProvinceSelect} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`expert-dashboard-root selection:bg-blue-500/30 relative text-right`} dir={isRTL ? 'rtl' : 'ltr'}>

        {showOnboarding && (
          <DirectorateOnboarding
            onComplete={handleCompleteOnboarding}
            onSkip={handleCompleteOnboarding}
          />
        )}

        {/* Background Image with Deep Overlay */}
        <div
          className="expert-bg-image"
          style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)' }}
        />
        <div className="expert-bg-overlay" />

        {/* Main Content Container border-t border-l */}
        <div className="relative z-10 flex h-screen overflow-hidden font-cairo">

          {/* Sidebar */}
          <aside className={`
            ${isSidebarOpen ? 'w-72' : 'w-20'} 
            transition-all duration-300 ease-in-out shrink-0
            bg-slate-950/80 backdrop-blur-xl border-l border-white/5 
            hidden lg:flex flex-col z-40
          `}>
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              {isSidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#3b82f6]/10 rounded-xl border border-[#3b82f6]/20">
                    <Building2 className="h-6 w-6 text-[#3b82f6]" />
                  </div>
                  <span className="text-xl font-black text-white tracking-wide">المديرية</span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white mx-auto">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
              {navigationTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                      ${isActive
                        ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                    `}
                  >
                    <tab.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {isSidebarOpen && (
                      <span className="font-bold text-sm tracking-wide text-right flex-1">{tab.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
              {isSidebarOpen && (
                <div className="px-4 py-3 bg-white/5 rounded-2xl mb-4 border border-white/5 text-right">
                  <p className="text-xs text-slate-400 font-medium">حساب المديرية</p>
                  <p className="text-sm text-white font-bold truncate">{user?.name}</p>
                </div>
              )}
              <button
                onClick={logout}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
                  text-rose-400 border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10
                  ${!isSidebarOpen && 'justify-center'}
                `}
              >
                <LogOut className="h-5 w-5" />
                {isSidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex" dir={isRTL ? 'rtl' : 'ltr'}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.aside
                  initial={{ x: isRTL ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: isRTL ? '100%' : '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`w-72 bg-slate-900 border-white/10 h-full relative flex flex-col shadow-2xl ${isRTL ? 'border-l mr-auto' : 'border-r ml-auto'}`}
                >
                  <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3b82f6]/10 rounded-xl border border-[#3b82f6]/20">
                        <Building2 className="h-6 w-6 text-[#3b82f6]" />
                      </div>
                      <span className="text-xl font-black text-white tracking-wide">المديرية</span>
                    </div>
                  </div>
                  <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {navigationTabs.map(tab => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
                            ${isActive ? 'bg-[#3b82f6] text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                          `}
                        >
                          <tab.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                  <div className="p-4 border-t border-white/5">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10">
                      <LogOut className="h-5 w-5" />
                      <span className="font-bold">تسجيل الخروج</span>
                    </button>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden text-right">

            {/* Header */}
            <header className="h-20 lg:h-24 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
                <div>
                  <h1 className="text-lg lg:text-2xl font-black text-white line-clamp-1 truncate">مركز مديرية التربية والتعليم</h1>
                  <p className="text-[10px] lg:text-xs font-bold text-slate-400 mt-0.5 tracking-wide line-clamp-1">
                    ولاية {selectedProvince.arabicName} — إدارة المتابعة والقرار الاستراتيجي
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4" dir="ltr">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:bg-white/10 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900 border-2" />
                </Button>

                <div className="h-8 w-[1px] bg-white/10 mx-2" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="bg-white/5 border-white/10 text-slate-300 hover:text-[#3b82f6] hover:bg-white/10 transition-all rounded-xl gap-2 h-10 px-4 group hidden md:flex"
                >
                  <MapPin className="h-4 w-4 ml-2 group-hover:text-[#3b82f6] transition-colors" />
                  <span className="font-cairo font-bold">تغيير الولاية</span>
                </Button>

                {/* Replay Tour Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplayOnboarding}
                  className="bg-white/5 border-white/10 text-slate-300 hover:text-[#3b82f6] hover:bg-white/10 transition-all rounded-xl gap-2 h-10 px-4 group hidden lg:flex"
                >
                  <PlayCircle className="w-4 h-4 group-hover:text-[#3b82f6] transition-colors" />
                  <span className="font-cairo font-bold">إعادة الجولة</span>
                </Button>
                
                <div className="lg:hidden">
                  <LanguageSwitcher />
                </div>
              </div>
            </header>

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}