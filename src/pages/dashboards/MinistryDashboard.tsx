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
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
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
  Globe
} from 'lucide-react';

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
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'regions', label: 'الخريطة الوطنية', icon: MapPin },
    { id: 'motion-analytics', label: 'الإحصائيات الوطنية للتحليل الحركي', icon: Globe },
    { id: 'reports', label: 'تقارير المديريات', icon: BarChart3 },
    { id: 'competitions', label: 'المسابقات الوطنية', icon: Trophy },
    { id: 'schools', label: 'المدارس', icon: School },
    { id: 'notifications', label: 'الإشعارات', icon: Bell }
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
      default: return renderDashboard();
    }
  };

  return (
    <div className="expert-dashboard-root selection:bg-red-500/30">
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
                <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                  <Flag className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">وزارة التربية الوطنية</h1>
                  <p className="text-sm text-slate-400 font-medium">
                    الجمهورية الجزائرية الديمقراطية الشعبية — مركز القرار السيادي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
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
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
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
  );
}