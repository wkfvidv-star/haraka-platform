import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
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
  School
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

interface DirectorateDashboardProps {
  selectedProvince: Province;
  onBackToSelection: () => void;
}

export function DirectorateDashboard({ selectedProvince, onBackToSelection }: DirectorateDashboardProps) {
  const [provinceOverview] = useState<ProvinceOverview>({
    totalSchools: selectedProvince.schools,
    totalStudents: selectedProvince.students,
    totalTeachers: selectedProvince.teachers,
    activeCompetitions: Math.floor(selectedProvince.schools / 20),
    averageAttendance: 91.8,
    overallPerformance: 85.7,
    monthlyProgress: 8.4,
    pendingReports: Math.floor(selectedProvince.schools / 15)
  });

  const [schoolSummaries] = useState<SchoolSummary[]>([
    {
      id: 'school_1',
      name: `متوسطة الشهيد محمد بوضياف - ${selectedProvince.arabicName}`,
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
      name: `ثانوية الأمير عبد القادر - ${selectedProvince.arabicName}`,
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
      name: `ابتدائية الشهيد العربي بن مهيدي - ${selectedProvince.arabicName}`,
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

  const [selectedSchool, setSelectedSchool] = useState<SchoolSummary | null>(null);

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
      <div className="space-y-6">
        {/* School Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
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
              <Button variant="outline" onClick={() => setSelectedSchool(null)}>
                ← العودة للنظرة العامة
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="flex items-center gap-2">
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

  if (selectedSchool) {
    return renderSchoolDetails();
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                مديرية التعليم - ولاية {selectedProvince.arabicName}
              </CardTitle>
              <CardDescription className="text-green-100">
                نظرة عامة على الولاية ومتابعة أداء المدارس والمؤسسات التعليمية
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onBackToSelection}
            >
              <MapPin className="h-4 w-4 mr-2" />
              تغيير الولاية
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalSchools}</div>
              <div className="text-sm text-green-100">إجمالي المدارس</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-green-100">إجمالي الطلاب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.totalTeachers}</div>
              <div className="text-sm text-green-100">إجمالي المعلمين</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{provinceOverview.overallPerformance}%</div>
              <div className="text-sm text-green-100">الأداء العام</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Schools Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                ملخص المدارس في الولاية
              </CardTitle>
              <CardDescription>
                نظرة عامة على أداء المدارس والمؤسسات التعليمية
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مدرسة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schoolSummaries.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <School className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{school.name}</h4>
                        <p className="text-sm text-gray-500">
                          {school.principalName} • {school.studentCount} طالب • {school.region}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getHealthStatusColor(school.healthStatus)} size="sm">
                            {school.healthStatus}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {school.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            آخر تحديث: {school.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center mb-3">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {school.averagePerformance}%
                          </div>
                          <div className="text-xs text-gray-500">الأداء</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {school.attendanceRate}%
                          </div>
                          <div className="text-xs text-gray-500">الحضور</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((school.completedActivities / school.totalActivities) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">الإنجاز</div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => setSelectedSchool(school)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
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
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        من: {activity.source}
                        {activity.schoolName && ` - ${activity.schoolName}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              إنشاء تقرير
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Trophy className="h-6 w-6" />
              إدارة المسابقات
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 relative">
              <Bell className="h-6 w-6" />
              الإشعارات
              {provinceOverview.pendingReports > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {provinceOverview.pendingReports}
                </Badge>
              )}
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              الاستراتيجية
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}