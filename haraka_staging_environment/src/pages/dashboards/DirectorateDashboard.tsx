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
  Settings
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
}

interface RecentActivity {
  id: string;
  type: 'school_report' | 'competition_result' | 'ministry_directive' | 'system_alert';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  source: string;
  schoolName?: string;
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
    activeCompetitions: Math.floor((selectedProvince?.schools || 125) / 20),
    averageAttendance: 91.8,
    overallPerformance: 85.7,
    monthlyProgress: 8.4,
    pendingReports: Math.floor((selectedProvince?.schools || 125) / 15)
  });

  const [schoolSummaries] = useState<SchoolSummary[]>([
    {
      id: 'school_1',
      name: `متوسطة الشهيد محمد بوضياف - ${selectedProvince?.arabicName || 'الجزائر'}`,
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
      region: 'المنطقة الشرقية'
    },
    {
      id: 'school_2',
      name: `ثانوية الأمير عبد القادر - ${selectedProvince?.arabicName || 'الجزائر'}`,
      type: 'ثانوية',
      studentCount: 580,
      teacherCount: 42,
      principalName: 'الأستاذة فاطمة الزهراء',
      averagePerformance: 87.6,
      attendanceRate: 92.3,
      activeStudents: 545,
      completedActivities: 132,
      totalActivities: 155,
      healthStatus: 'جيد',
      recentAchievements: 6,
      lastUpdated: '2024-10-15',
      region: 'المنطقة الوسطى'
    },
    {
      id: 'school_3',
      name: `ابتدائية الشهيد العربي بن مهيدي - ${selectedProvince?.arabicName || 'الجزائر'}`,
      type: 'ابتدائية',
      studentCount: 320,
      teacherCount: 18,
      principalName: 'الأستاذ محمد الصالح',
      averagePerformance: 82.4,
      attendanceRate: 89.7,
      activeStudents: 287,
      completedActivities: 118,
      totalActivities: 150,
      healthStatus: 'متوسط',
      recentAchievements: 4,
      lastUpdated: '2024-10-14',
      region: 'المنطقة الغربية'
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'school_report',
      title: 'تقرير شهري من متوسطة الشهيد محمد بوضياف',
      description: 'تقرير شامل عن تقدم الطلاب في الأنشطة الرياضية والأكاديمية',
      timestamp: 'منذ ساعة',
      priority: 'high',
      source: 'مدير المدرسة',
      schoolName: 'متوسطة الشهيد محمد بوضياف'
    },
    {
      id: '2',
      type: 'competition_result',
      title: 'انتهاء مسابقة اللياقة البدنية على مستوى الولاية',
      description: 'تم الانتهاء من مسابقة اللياقة البدنية بمشاركة 25 مدرسة',
      timestamp: 'منذ 3 ساعات',
      priority: 'medium',
      source: 'قسم المسابقات',
      schoolName: 'متعدد المدارس'
    },
    {
      id: '3',
      type: 'ministry_directive',
      title: 'تعميم وزاري جديد حول معايير التقييم',
      description: 'تحديث على معايير تقييم الأنشطة الرياضية في المدارس',
      timestamp: 'منذ يوم',
      priority: 'high',
      source: 'وزارة التربية الوطنية'
    }
  ]);

  // تبويبات التنقل
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
      case 'ممتاز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'school_report': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'competition_result': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'ministry_directive': return <Building2 className="h-4 w-4 text-red-500" />;
      case 'system_alert': return <Bell className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const renderSchoolDetails = () => {
    if (!selectedSchool) return null;

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* School Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <School className="h-5 w-5" />
                  {selectedSchool.name}
                </CardTitle>
                <CardDescription>
                  المدير: {selectedSchool.principalName} • المنطقة: {selectedSchool.region}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getHealthStatusColor(selectedSchool.healthStatus)} size="sm">
                    {selectedSchool.healthStatus}
                  </Badge>
                  <Badge variant="outline">{selectedSchool.type}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedSchool(null)} size="sm">
                ← العودة للنظرة العامة
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="إجمالي الطلاب"
            value={selectedSchool.studentCount.toString()}
            description={`${selectedSchool.activeStudents} طالب نشط`}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="معدل الأداء"
            value={`${selectedSchool.averagePerformance}%`}
            description="متوسط الأداء العام"
            icon={TrendingUp}
            color="green"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="معدل الحضور"
            value={`${selectedSchool.attendanceRate}%`}
            description="نسبة الحضور الشهرية"
            icon={CheckCircle}
            color="purple"
          />
          <StatsCard
            title="الأنشطة المكتملة"
            value={`${selectedSchool.completedActivities}/${selectedSchool.totalActivities}`}
            description={`${Math.round((selectedSchool.completedActivities / selectedSchool.totalActivities) * 100)}% إنجاز`}
            icon={Target}
            color="orange"
          />
        </div>

        {/* Progress Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              تحليل التقدم التفصيلي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Activity Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">تقدم الأنشطة</span>
                <span className="text-sm text-gray-500">
                  {selectedSchool.completedActivities} من {selectedSchool.totalActivities}
                </span>
              </div>
              <Progress 
                value={(selectedSchool.completedActivities / selectedSchool.totalActivities) * 100} 
                className="h-3"
              />
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(selectedSchool.studentCount * 0.4)}
                </div>
                <div className="text-sm text-gray-500">طلاب متفوقون</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(selectedSchool.studentCount * 0.35)}
                </div>
                <div className="text-sm text-gray-500">طلاب متوسطون</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {selectedSchool.studentCount - selectedSchool.activeStudents}
                </div>
                <div className="text-sm text-gray-500">يحتاج متابعة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16 flex-col gap-2">
            <FileText className="h-6 w-6" />
            طلب تقرير مفصل
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Send className="h-6 w-6" />
            إرسال توجيهات
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Download className="h-6 w-6" />
            تصدير البيانات
          </Button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                مديرية التعليم - ولاية {selectedProvince?.arabicName || 'الجزائر'}
              </CardTitle>
              <CardDescription className="text-green-100">
                نظرة عامة على الولاية ومتابعة أداء المدارس والمؤسسات التعليمية
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleBackToSelection}
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              تغيير الولاية
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalSchools}</div>
              <div className="text-xs sm:text-sm text-green-100">إجمالي المدارس</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalStudents.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-green-100">إجمالي الطلاب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalTeachers}</div>
              <div className="text-xs sm:text-sm text-green-100">إجمالي المعلمين</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.overallPerformance}%</div>
              <div className="text-xs sm:text-sm text-green-100">الأداء العام</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="معدل الحضور"
          value={`${provinceOverview.averageAttendance}%`}
          description="متوسط حضور الطلاب"
          icon={CheckCircle}
          color="green"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="المسابقات النشطة"
          value={provinceOverview.activeCompetitions.toString()}
          description="مسابقات جارية"
          icon={Trophy}
          color="yellow"
        />
        <StatsCard
          title="التقدم الشهري"
          value={`+${provinceOverview.monthlyProgress}%`}
          description="تحسن هذا الشهر"
          icon={TrendingUp}
          color="blue"
          trend={{ value: provinceOverview.monthlyProgress, isPositive: true }}
        />
        <StatsCard
          title="التقارير المعلقة"
          value={provinceOverview.pendingReports.toString()}
          description="تحتاج مراجعة"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('reports')}
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              إنشاء تقرير
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('competitions')}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              إدارة المسابقات
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 relative text-xs sm:text-sm"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              الإشعارات
              {provinceOverview.pendingReports > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {provinceOverview.pendingReports}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('strategy')}
            >
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              الاستراتيجية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schools Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <School className="h-5 w-5" />
                ملخص المدارس في الولاية
              </CardTitle>
              <CardDescription>
                نظرة عامة على أداء المدارس والمؤسسات التعليمية
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              إضافة مدرسة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schoolSummaries.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <School className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-base truncate">{school.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {school.principalName} • {school.studentCount} طالب • {school.region}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getHealthStatusColor(school.healthStatus)} size="sm">
                            {school.healthStatus}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {school.type}
                          </Badge>
                          <span className="text-xs text-gray-500 hidden sm:inline">
                            آخر تحديث: {school.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-3">
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-green-600">
                            {school.averagePerformance}%
                          </div>
                          <div className="text-xs text-gray-500">الأداء</div>
                        </div>
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-blue-600">
                            {school.attendanceRate}%
                          </div>
                          <div className="text-xs text-gray-500">الحضور</div>
                        </div>
                        <div>
                          <div className="text-sm sm:text-lg font-bold text-purple-600">
                            {Math.round((school.completedActivities / school.totalActivities) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">الإنجاز</div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => setSelectedSchool(school)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>تقدم الأنشطة</span>
                      <span>{school.completedActivities}/{school.totalActivities}</span>
                    </div>
                    <Progress 
                      value={(school.completedActivities / school.totalActivities) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('schools')}
              className="flex items-center gap-2"
            >
              <School className="h-4 w-4" />
              عرض جميع المدارس
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            الأنشطة الحديثة على مستوى الولاية
          </CardTitle>
          <CardDescription>
            آخر التحديثات والتقارير من المدارس والوزارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 ${getPriorityColor(activity.priority)}`}
              >
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        من: {activity.source}
                        {activity.schoolName && ` - ${activity.schoolName}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">
              عرض جميع الأنشطة
            </Button>
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
            إعدادات المديرية
          </CardTitle>
          <CardDescription className="text-gray-100">
            إدارة إعدادات المديرية والنظام العام
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات الولاية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              معلومات الولاية
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <School className="h-4 w-4 mr-2" />
              إدارة المدارس
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              إدارة المستخدمين
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
              إعدادات المسابقات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    // If viewing school details, show school details component
    if (selectedSchool) {
      return renderSchoolDetails();
    }

    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'schools': return renderDashboard(); // Schools are shown in dashboard
      case 'reports': return <DirectorateReports selectedProvince={selectedProvince} />;
      case 'competitions': return <DirectorateCompetitions selectedProvince={selectedProvince} />;
      case 'strategy': return <DirectorateStrategy selectedProvince={selectedProvince} />;
      case 'notifications': return <DirectorateNotifications selectedProvince={selectedProvince} />;
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  // If no province is selected, show the province selector without navigation
  if (!selectedProvince) {
    return (
      <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
        <ProvinceSelector onProvinceSelect={handleProvinceSelect} />
      </div>
    );
  }

  // Show full dashboard with navigation when province is selected
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - مديرية التعليم
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">مدير تعليم</div>
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
                        ? 'border-green-600 text-green-600 dark:text-green-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'notifications' && provinceOverview.pendingReports > 0 && (
                      <Badge className="ml-1 bg-red-500 text-xs px-1 py-0 min-w-[16px] h-4">
                        {provinceOverview.pendingReports}
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