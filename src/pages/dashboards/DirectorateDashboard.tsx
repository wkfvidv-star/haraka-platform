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
  Globe
} from 'lucide-react';

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
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

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
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'schools', label: 'المدارس', icon: School },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'competitions', label: 'المسابقات', icon: Trophy },
    { id: 'strategy', label: 'الاستراتيجية', icon: Target },
    { id: 'notifications', label: 'الإشعارات', icon: Bell }
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
      <div className={`expert-dashboard-root selection:bg-blue-500/30 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Background Image with Deep Overlay */}
        <div
          className="expert-bg-image"
          style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)' }}
        />
        <div className="expert-bg-overlay" />

        <div className="relative z-10 font-arabic">
          <header className="expert-header">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3b82f6]/10 rounded-2xl border border-[#3b82f6]/20">
                    <Building2 className="h-8 w-8 text-[#3b82f6]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">مركز مديرية التربية والتعليم</h1>
                    <p className="text-sm text-slate-400 font-medium">
                      ولاية {selectedProvince.arabicName} — إدارة المتابعة والقرار الاستراتيجي
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleBackToSelection}
                    size="sm"
                    className="rounded-xl font-black text-slate-300 hover:bg-white/5"
                  >
                    <MapPin className="h-4 w-4 ml-2 text-[#3b82f6]" />
                    تغيير الولاية
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:bg-white/5">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <div className="h-8 w-[1px] bg-white/10 mx-2" />
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-bold"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>

              <div className="expert-nav-tabs-container p-1.5 rounded-3xl">
                <div className="flex gap-2 overflow-x-auto justify-center">
                  {navigationTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-2xl px-6 flex gap-2 font-black transition-all ${activeTab === tab.id
                        ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-900/40"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <main className="expert-container">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}