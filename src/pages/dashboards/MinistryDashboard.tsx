import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { DirectorateReportsManagement } from '@/components/ministry/DirectorateReportsManagement';
import { NationalCompetitions } from '@/components/ministry/NationalCompetitions';
import { NationalMaps } from '@/components/ministry/NationalMaps';
import NationalMotionAnalytics from '@/components/ministry/NationalMotionAnalytics';
import { NationalHeatmapReport } from '@/components/ministry/NationalHeatmapReport';
import { PolicyReportExporter } from '@/components/ministry/PolicyReportExporter';
import { MinistryOnboarding } from '@/components/ministry-dashboard/MinistryOnboarding';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';
import {
  Building2,
  Users,
  GraduationCap,
  Trophy,
  TrendingUp,
  MapPin,
  BarChart3,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  FileText,
  School,
  Flag,
  Home,
  LogOut,
  User,
  Settings,
  Bell,
  Plus,
  Globe,
  PlayCircle,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NationalStats {
  totalProvinces: number;
  totalDirectorates: number;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activeCompetitions: number;
  averagePerformance: number;
  nationalAttendance: number;
  monthlyProgress: number;
  pendingReports: number;
}

interface ProvincePerformance {
  id: string;
  name: string;
  arabicName: string;
  region: 'الشمال' | 'الوسط' | 'الجنوب' | 'الشرق' | 'الغرب';
  schools: number;
  students: number;
  teachers: number;
  performance: number;
  attendance: number;
  completedActivities: number;
  totalActivities: number;
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  lastReportDate: string;
  activeCompetitions: number;
}

interface DirectorateReport {
  id: string;
  title: string;
  provinceName: string;
  provinceArabicName: string;
  region: 'الشمال' | 'الوسط' | 'الجنوب' | 'الشرق' | 'الغرب';
  reportType: 'monthly' | 'quarterly' | 'annual' | 'special';
  category: 'performance' | 'competitions' | 'infrastructure' | 'budget' | 'emergency';
  submissionDate: string;
  reportPeriod: string;
  status: 'pending_review' | 'under_review' | 'approved' | 'requires_action' | 'archived';
  priority: 'high' | 'medium' | 'low';
  summary: string;
  keyMetrics: {
    schools: number;
    students: number;
    teachers: number;
    performance: number;
    attendance: number;
    budget: number;
  };
  attachments: string[];
  reviewNotes?: string;
  actionRequired?: string;
}

export default function MinistryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProvince, setSelectedProvince] = useState<ProvincePerformance | null>(null);
  const [selectedReport, setSelectedReport] = useState<DirectorateReport | null>(null);
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const hasSeen = localStorage.getItem('haraka_ministry_onboarding_seen');
    return !hasSeen;
  });

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('haraka_ministry_onboarding_seen', 'true');
  };

  const handleReplayOnboarding = () => {
    setShowOnboarding(true);
  };

  const [nationalStats] = useState<NationalStats>({
    totalProvinces: 58,
    totalDirectorates: 58,
    totalSchools: 28450,
    totalStudents: 9847562,
    totalTeachers: 387420,
    activeCompetitions: 142,
    averagePerformance: 84.7,
    nationalAttendance: 91.3,
    monthlyProgress: 6.8,
    pendingReports: 23
  });

  const [topPerformingProvinces] = useState<ProvincePerformance[]>([
    {
      id: '16',
      name: 'Alger',
      arabicName: 'الجزائر',
      region: 'الوسط',
      schools: 680,
      students: 156780,
      teachers: 7250,
      performance: 92.4,
      attendance: 94.8,
      completedActivities: 145,
      totalActivities: 160,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-16',
      activeCompetitions: 8
    },
    {
      id: '31',
      name: 'Oran',
      arabicName: 'وهران',
      region: 'الغرب',
      schools: 580,
      students: 128340,
      teachers: 5940,
      performance: 90.8,
      attendance: 93.2,
      completedActivities: 138,
      totalActivities: 155,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-15',
      activeCompetitions: 7
    },
    {
      id: '25',
      name: 'Constantine',
      arabicName: 'قسنطينة',
      region: 'الشرق',
      schools: 480,
      students: 105670,
      teachers: 4890,
      performance: 89.6,
      attendance: 92.5,
      completedActivities: 132,
      totalActivities: 150,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-14',
      activeCompetitions: 6
    }
  ]);

  const [regionalStats] = useState([
    { region: 'الوسط', provinces: 12, performance: 88.5, schools: 5420, students: 1234567 },
    { region: 'الشرق', provinces: 15, performance: 86.2, schools: 6890, students: 1567890 },
    { region: 'الغرب', provinces: 14, performance: 85.8, schools: 6120, students: 1345678 },
    { region: 'الشمال', provinces: 9, performance: 87.1, schools: 4890, students: 987654 },
    { region: 'الجنوب', provinces: 8, performance: 82.4, schools: 5130, students: 1711773 }
  ]);

  const navigationTabs = [
    { id: 'dashboard',        label: 'لوحة التحكم',                          icon: Home },
    { id: 'regions',          label: 'الخريطة الوطنية',                     icon: MapPin },
    { id: 'motion-analytics', label: 'الإحصائيات الوطنية للتحليل الحركي', icon: Globe },
    { id: 'reports',          label: 'تقارير المديريات',                  icon: BarChart3 },
    { id: 'competitions',     label: 'المسابقات الوطنية',               icon: Trophy },
    { id: 'schools',          label: 'المدارس',                            icon: School },
    { id: 'notifications',    label: 'الإشعارات',                         icon: Bell },
    { id: 'ratings',          label: '⭐ تقييم المديريات',              icon: Award },
  ];

  const handleProvinceSelect = (province: ProvincePerformance) => {
    setSelectedProvince(province);
  };

  const handleReportSelect = (report: DirectorateReport) => {
    setSelectedReport(report);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'الوسط': return 'text-blue-600';
      case 'الشرق': return 'text-green-600';
      case 'الغرب': return 'text-orange-600';
      case 'الشمال': return 'text-purple-600';
      case 'الجنوب': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* National Stats Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="md:col-span-4 bg-white/60 backdrop-blur-md border-white/40 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-800 mb-2">إحصائيات القطاع الوطنية</h2>
              <p className="text-muted-foreground font-medium mb-4">نظرة استراتيجية شاملة على مستوى الجمهورية الجزائرية</p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-blue-100 text-blue-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {nationalStats.totalProvinces} ولاية
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {nationalStats.totalSchools.toLocaleString()} مدرسة
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold px-4 py-1.5 rounded-lg">
                  {(nationalStats.totalStudents / 1000000).toFixed(1)}م طالب
                </Badge>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-2xl font-black text-blue-800">{nationalStats.averagePerformance}%</div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">الأداء الوطني</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-2xl font-black text-emerald-800">+{nationalStats.monthlyProgress}%</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">نمو سنوي</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="معدل الحضور الوطني"
          value={`${nationalStats.nationalAttendance}%`}
          description="متوسط حضور الطلاب"
          icon={CheckCircle}
          color="green"
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatsCard
          title="المسابقات النشطة"
          value={nationalStats.activeCompetitions.toString()}
          description="على المستوى الوطني"
          icon={Trophy}
          color="yellow"
        />
        <StatsCard
          title="التقدم الشهري"
          value={`+${nationalStats.monthlyProgress}%`}
          description="تحسن هذا الشهر"
          icon={TrendingUp}
          color="blue"
          trend={{ value: nationalStats.monthlyProgress, isPositive: true }}
        />
        <StatsCard
          title="التقارير المعلقة"
          value={nationalStats.pendingReports.toString()}
          description="من المديريات"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              الولايات الأعلى أداءً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingProvinces.map((province) => (
                <div key={province.id} className="flex items-center justify-between p-3 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-700">
                      {province.id}
                    </div>
                    <div>
                      <div className="font-bold">{province.arabicName}</div>
                      <div className="text-xs text-muted-foreground">{province.region} • {province.students.toLocaleString()} طالب</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{province.performance}%</div>
                    <Badge variant="outline" className="text-[10px]">{province.healthStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              الأداء الإقليمي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalStats.map((reg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{reg.region}</span>
                    <span className="font-bold">{reg.performance}%</span>
                  </div>
                  <Progress value={reg.performance} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Comparison Chart */}
        <div className="lg:col-span-2 relative z-10">
          <NationalHeatmapReport />
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1 border-r border-slate-200 dark:border-[#1e293b] pr-6 h-full relative z-10">
          <PolicyReportExporter />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'reports': return <DirectorateReportsManagement onReportSelect={handleReportSelect} />;
      case 'competitions': return <NationalCompetitions />;
      case 'regions': return <NationalMaps />;
      case 'motion-analytics': return <NationalMotionAnalytics />;
      case 'schools': return renderDashboard();
      case 'notifications': return renderDashboard();
      case 'ratings': return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
          <div>
            <h3 className="text-2xl font-black text-white mb-4">⭐ تقييم المديريات</h3>
            <RatingSystem
              raterRole="وزارة"
              raterName={user?.name || 'الوزارة'}
              targets={topPerformingProvinces.map(p => ({ id: p.id, name: `مديرية ${p.arabicName}`, role: `ولاية ${p.arabicName}` }))}
              mode="rate"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-4">💬 غرفة الوزارة</h3>
            <ChatSystem userRole="ministry" userName={user?.name || 'الوزارة'} inline defaultOpen />
          </div>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="expert-dashboard-root selection:bg-red-500/30">
      {/* Onboarding Overlay */}
      {showOnboarding && (
        <MinistryOnboarding
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

      <div className="relative z-10 font-arabic">
        <header className="expert-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white -mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="p-2 sm:p-3 bg-red-600/10 rounded-2xl border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                  <Flag className="h-5 w-5 sm:h-8 sm:w-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">وزارة التربية الوطنية</h1>
                  <p className="text-[10px] sm:text-sm text-slate-400 font-medium line-clamp-1">
                    الجمهورية الجزائرية الديمقراطية الشعبية — مركز القرار السيادي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:bg-white/5">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="h-6 w-[1px] bg-white/10 mx-1 sm:mx-2" />
                {/* Replay Tour Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplayOnboarding}
                  className="bg-white/5 border-white/10 text-slate-300 hover:text-red-400 hover:bg-white/10 transition-all rounded-xl gap-2 font-bold hidden lg:flex"
                >
                  <PlayCircle className="w-4 h-4 transition-colors" />
                  إعادة الجولة
                </Button>
                <div className="h-8 w-[1px] bg-white/10 mx-1 hidden lg:block" />
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-bold px-2 sm:px-4"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </Button>
              </div>
            </div>

            <div className="expert-nav-tabs-container p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {navigationTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl sm:rounded-2xl px-4 sm:px-6 flex gap-2 font-black transition-all shrink-0 text-sm sm:text-base ${activeTab === tab.id
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </header>

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
                    <div className="p-2 bg-red-600/10 rounded-xl border border-red-600/20">
                      <Flag className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xl font-black text-white">الوزارة</span>
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
                          ${isActive ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <tab.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
                <div className="p-4 border-t border-white/5 space-y-3">
                  <LanguageSwitcher />
                  <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10">
                    <LogOut className="h-5 w-5" />
                    <span className="font-bold">تسجيل الخروج</span>
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <main className="expert-container pb-24 lg:pb-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}