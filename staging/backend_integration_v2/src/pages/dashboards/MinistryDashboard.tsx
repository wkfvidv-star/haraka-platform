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
    },
    {
      id: '19',
      name: 'Sétif',
      arabicName: 'سطيف',
      region: 'الشرق',
      schools: 520,
      students: 112340,
      teachers: 5180,
      performance: 88.9,
      attendance: 91.8,
      completedActivities: 128,
      totalActivities: 148,
      healthStatus: 'جيد',
      lastReportDate: '2024-10-13',
      activeCompetitions: 5
    },
    {
      id: '06',
      name: 'Béjaïa',
      arabicName: 'بجاية',
      region: 'الشمال',
      schools: 380,
      students: 85670,
      teachers: 3890,
      performance: 87.3,
      attendance: 90.4,
      completedActivities: 125,
      totalActivities: 145,
      healthStatus: 'جيد',
      lastReportDate: '2024-10-12',
      activeCompetitions: 4
    }
  ]);

  const [regionalStats] = useState([
    { region: 'الوسط', provinces: 12, performance: 88.5, schools: 5420, students: 1234567 },
    { region: 'الشرق', provinces: 15, performance: 86.2, schools: 6890, students: 1567890 },
    { region: 'الغرب', provinces: 14, performance: 85.8, schools: 6120, students: 1345678 },
    { region: 'الشمال', provinces: 9, performance: 87.1, schools: 4890, students: 987654 },
    { region: 'الجنوب', provinces: 8, performance: 82.4, schools: 5130, students: 1711773 }
  ]);

  // تبويبات التنقل مع إضافة الإحصائيات الوطنية للتحليل الحركي
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
    // Could navigate to a detailed province view or show modal
  };

  const handleReportSelect = (report: DirectorateReport) => {
    setSelectedReport(report);
    // Could navigate to detailed report view or show modal
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
    <div className="space-y-4 sm:space-y-6">
      {/* National Header */}
      <Card className="bg-gradient-to-r from-red-600 to-green-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Flag className="h-6 w-6" />
            وزارة التربية الوطنية - الجمهورية الجزائرية الديمقراطية الشعبية
          </CardTitle>
          <CardDescription className="text-red-100">
            النظرة العامة الوطنية لقطاع التربية والتعليم في جميع أنحاء الوطن
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalProvinces}</div>
              <div className="text-xs sm:text-sm text-red-100">ولاية</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalSchools.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-red-100">مدرسة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{(nationalStats.totalStudents / 1000000).toFixed(1)}م</div>
              <div className="text-xs sm:text-sm text-red-100">طالب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalTeachers.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-red-100">معلم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.averagePerformance}%</div>
              <div className="text-xs sm:text-sm text-red-100">الأداء الوطني</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key National Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      {/* Quick National Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الإجراءات الوطنية السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('motion-analytics')}
            >
              <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
              الإحصائيات الوطنية
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('competitions')}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              المسابقات الوطنية
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('regions')}
            >
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              الإحصائيات الشاملة
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
            >
              <Download className="h-5 w-5 sm:h-6 sm:w-6" />
              تصدير البيانات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            الأداء حسب المناطق الجغرافية
          </CardTitle>
          <CardDescription>
            توزيع الأداء والإحصائيات عبر المناطق الخمس للوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {regionalStats.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className={`text-lg font-bold ${getRegionColor(region.region)}`}>
                    {region.region}
                  </div>
                  <div className="text-2xl font-bold mt-2">{region.performance}%</div>
                  <div className="text-sm text-gray-500 mb-3">متوسط الأداء</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>{region.provinces} ولاية</div>
                    <div>{region.schools.toLocaleString()} مدرسة</div>
                    <div>{(region.students / 1000000).toFixed(1)}م طالب</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Provinces */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                الولايات الأعلى أداءً على المستوى الوطني
              </CardTitle>
              <CardDescription>
                أفضل 5 ولايات من حيث الأداء العام والإنجازات
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              عرض جميع الولايات
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingProvinces.map((province, index) => (
              <Card key={province.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProvinceSelect(province)}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-lg truncate">{province.arabicName}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          المنطقة {province.region} • {province.schools} مدرسة • {province.students.toLocaleString()} طالب
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getHealthStatusColor(province.healthStatus)} size="sm">
                            {province.healthStatus}
                          </Badge>
                          <span className="text-xs text-gray-500 hidden sm:inline">
                            آخر تقرير: {province.lastReportDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-3">
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-green-600">
                            {province.performance}%
                          </div>
                          <div className="text-xs text-gray-500">الأداء</div>
                        </div>
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-blue-600">
                            {province.attendance}%
                          </div>
                          <div className="text-xs text-gray-500">الحضور</div>
                        </div>
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-purple-600">
                            {Math.round((province.completedActivities / province.totalActivities) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">الإنجاز</div>
                        </div>
                      </div>
                      
                      <Button size="sm" className="text-xs">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>تقدم الأنشطة</span>
                      <span>{province.completedActivities}/{province.totalActivities}</span>
                    </div>
                    <Progress 
                      value={(province.completedActivities / province.totalActivities) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-gray-600 to-slate-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            إعدادات الوزارة
          </CardTitle>
          <CardDescription className="text-gray-100">
            إدارة إعدادات النظام الوطني والسياسات العامة
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الإعدادات الوطنية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Flag className="h-4 w-4 mr-2" />
              السياسات التعليمية
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              إدارة المناطق
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              إدارة المديريات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات النظام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              إعدادات الإشعارات
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              قوالب التقارير
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              إعدادات المسابقات الوطنية
            </Button>
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
      case 'schools': return renderDashboard(); // Schools are shown in dashboard
      case 'notifications': return renderDashboard(); // Could add a national notifications component
      case 'settings': return renderSettings();
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
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Flag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - وزارة التربية الوطنية
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">وزير التربية الوطنية</div>
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
                      transition-colors duration-200 relative
                      ${isActive 
                        ? 'border-red-600 text-red-600 dark:text-red-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'notifications' && nationalStats.pendingReports > 0 && (
                      <Badge className="ml-1 bg-red-500 text-xs px-1 py-0 min-w-[16px] h-4">
                        {nationalStats.pendingReports}
                      </Badge>
                    )}
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