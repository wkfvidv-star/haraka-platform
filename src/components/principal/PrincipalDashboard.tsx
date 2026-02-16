import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  School,
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
  Send
} from 'lucide-react';

interface SchoolOverview {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeCompetitions: number;
  averageAttendance: number;
  overallPerformance: number;
  monthlyProgress: number;
  pendingReports: number;
}

interface ClassSummary {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
  teacherName: string;
  averagePerformance: number;
  attendanceRate: number;
  activeStudents: number;
  completedActivities: number;
  totalActivities: number;
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  recentAchievements: number;
  lastUpdated: string;
}

interface RecentActivity {
  id: string;
  type: 'class_report' | 'competition_result' | 'teacher_update' | 'ministry_notification';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  source: string;
}

export function PrincipalDashboard() {
  const [schoolOverview] = useState<SchoolOverview>({
    totalStudents: 847,
    totalTeachers: 42,
    totalClasses: 28,
    activeCompetitions: 5,
    averageAttendance: 92.5,
    overallPerformance: 87.3,
    monthlyProgress: 12.8,
    pendingReports: 3
  });

  const [classSummaries] = useState<ClassSummary[]>([
    {
      id: 'class_1',
      name: 'السنة الأولى متوسط - أ',
      grade: 'الأولى متوسط',
      studentCount: 32,
      teacherName: 'أستاذة فاطمة الزهراء',
      averagePerformance: 89.2,
      attendanceRate: 94.5,
      activeStudents: 30,
      completedActivities: 145,
      totalActivities: 160,
      healthStatus: 'ممتاز',
      recentAchievements: 8,
      lastUpdated: '2024-10-16'
    },
    {
      id: 'class_2',
      name: 'السنة الثانية متوسط - ب',
      grade: 'الثانية متوسط',
      studentCount: 28,
      teacherName: 'أستاذ محمد الأحمد',
      averagePerformance: 85.7,
      attendanceRate: 91.2,
      activeStudents: 26,
      completedActivities: 132,
      totalActivities: 155,
      healthStatus: 'جيد',
      recentAchievements: 6,
      lastUpdated: '2024-10-15'
    },
    {
      id: 'class_3',
      name: 'السنة الثالثة متوسط - أ',
      grade: 'الثالثة متوسط',
      studentCount: 30,
      teacherName: 'أستاذة سارة الخالد',
      averagePerformance: 78.4,
      attendanceRate: 88.7,
      activeStudents: 27,
      completedActivities: 118,
      totalActivities: 150,
      healthStatus: 'متوسط',
      recentAchievements: 4,
      lastUpdated: '2024-10-14'
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'class_report',
      title: 'تقرير شهري من الصف الأول متوسط',
      description: 'تقرير شامل عن تقدم الطلاب في الأنشطة الرياضية',
      timestamp: 'منذ ساعة',
      priority: 'high',
      source: 'أستاذة فاطمة الزهراء'
    },
    {
      id: '2',
      type: 'competition_result',
      title: 'نتائج مسابقة اللياقة البدنية',
      description: 'انتهت مسابقة اللياقة البدنية للمرحلة المتوسطة',
      timestamp: 'منذ 3 ساعات',
      priority: 'medium',
      source: 'قسم المسابقات'
    },
    {
      id: '3',
      type: 'ministry_notification',
      title: 'تعميم من وزارة التعليم',
      description: 'تحديث على معايير تقييم الأنشطة الرياضية',
      timestamp: 'منذ يوم',
      priority: 'high',
      source: 'وزارة التعليم'
    },
    {
      id: '4',
      type: 'teacher_update',
      title: 'طلب إجازة من المعلم',
      description: 'طلب إجازة اضطرارية من أستاذ محمد الأحمد',
      timestamp: 'منذ يومين',
      priority: 'medium',
      source: 'أستاذ محمد الأحمد'
    }
  ]);

  const [selectedClass, setSelectedClass] = useState<ClassSummary | null>(null);

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
      case 'class_report': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'competition_result': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'teacher_update': return <Users className="h-4 w-4 text-green-500" />;
      case 'ministry_notification': return <Bell className="h-4 w-4 text-red-500" />;
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

  const renderClassDetails = () => {
    if (!selectedClass) return null;

    return (
      <div className="space-y-6">
        {/* Class Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedClass.name}</CardTitle>
                <CardDescription>
                  المعلم: {selectedClass.teacherName} • آخر تحديث: {selectedClass.lastUpdated}
                </CardDescription>
                <Badge className={getHealthStatusColor(selectedClass.healthStatus)} size="sm">
                  {selectedClass.healthStatus}
                </Badge>
              </div>
              <Button variant="outline" onClick={() => setSelectedClass(null)}>
                ← العودة للنظرة العامة
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي الطلاب"
            value={selectedClass.studentCount.toString()}
            description={`${selectedClass.activeStudents} طالب نشط`}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="معدل الأداء"
            value={`${selectedClass.averagePerformance}%`}
            description="متوسط الأداء العام"
            icon={TrendingUp}
            color="green"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="معدل الحضور"
            value={`${selectedClass.attendanceRate}%`}
            description="نسبة الحضور الشهرية"
            icon={CheckCircle}
            color="purple"
          />
          <StatsCard
            title="الأنشطة المكتملة"
            value={`${selectedClass.completedActivities}/${selectedClass.totalActivities}`}
            description={`${Math.round((selectedClass.completedActivities / selectedClass.totalActivities) * 100)}% إنجاز`}
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
                  {selectedClass.completedActivities} من {selectedClass.totalActivities}
                </span>
              </div>
              <Progress 
                value={(selectedClass.completedActivities / selectedClass.totalActivities) * 100} 
                className="h-3"
              />
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(selectedClass.averagePerformance * 0.4)}
                </div>
                <div className="text-sm text-gray-500">طلاب متفوقون</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(selectedClass.averagePerformance * 0.35)}
                </div>
                <div className="text-sm text-gray-500">طلاب متوسطون</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {selectedClass.studentCount - selectedClass.activeStudents}
                </div>
                <div className="text-sm text-gray-500">يحتاج متابعة</div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h4 className="font-medium mb-3">الإنجازات الحديثة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: selectedClass.recentAchievements }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">إنجاز رقم {i + 1} للصف</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16 flex-col gap-2">
            <FileText className="h-6 w-6" />
            إنشاء تقرير مفصل
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Send className="h-6 w-6" />
            إرسال لأولياء الأمور
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Download className="h-6 w-6" />
            تصدير البيانات
          </Button>
        </div>
      </div>
    );
  };

  if (selectedClass) {
    return renderClassDetails();
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <School className="h-6 w-6" />
            مرحباً مدير مدرسة الأمل المتوسطة
          </CardTitle>
          <CardDescription className="text-blue-100">
            نظرة شاملة على أداء المدرسة والصفوف الدراسية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{schoolOverview.totalStudents}</div>
              <div className="text-sm text-blue-100">إجمالي الطلاب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{schoolOverview.totalTeachers}</div>
              <div className="text-sm text-blue-100">المعلمين</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{schoolOverview.totalClasses}</div>
              <div className="text-sm text-blue-100">الصفوف</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{schoolOverview.overallPerformance}%</div>
              <div className="text-sm text-blue-100">الأداء العام</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="معدل الحضور"
          value={`${schoolOverview.averageAttendance}%`}
          description="متوسط حضور الطلاب"
          icon={CheckCircle}
          color="green"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="المسابقات النشطة"
          value={schoolOverview.activeCompetitions.toString()}
          description="مسابقات جارية"
          icon={Trophy}
          color="yellow"
        />
        <StatsCard
          title="التقدم الشهري"
          value={`+${schoolOverview.monthlyProgress}%`}
          description="تحسن هذا الشهر"
          icon={TrendingUp}
          color="blue"
          trend={{ value: schoolOverview.monthlyProgress, isPositive: true }}
        />
        <StatsCard
          title="التقارير المعلقة"
          value={schoolOverview.pendingReports.toString()}
          description="تحتاج مراجعة"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                ملخص الصفوف الدراسية
              </CardTitle>
              <CardDescription>
                نظرة عامة على أداء جميع الصفوف في المدرسة
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة صف جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classSummaries.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{classItem.name}</h4>
                        <p className="text-sm text-gray-500">
                          {classItem.teacherName} • {classItem.studentCount} طالب
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getHealthStatusColor(classItem.healthStatus)} size="sm">
                            {classItem.healthStatus}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            آخر تحديث: {classItem.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center mb-3">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {classItem.averagePerformance}%
                          </div>
                          <div className="text-xs text-gray-500">الأداء</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {classItem.attendanceRate}%
                          </div>
                          <div className="text-xs text-gray-500">الحضور</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((classItem.completedActivities / classItem.totalActivities) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">الإنجاز</div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => setSelectedClass(classItem)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>تقدم الأنشطة</span>
                      <span>{classItem.completedActivities}/{classItem.totalActivities}</span>
                    </div>
                    <Progress 
                      value={(classItem.completedActivities / classItem.totalActivities) * 100} 
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
            الأنشطة الحديثة
          </CardTitle>
          <CardDescription>
            آخر التحديثات والتقارير من المعلمين والوزارة
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
              {schoolOverview.pendingReports > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {schoolOverview.pendingReports}
                </Badge>
              )}
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              التقارير المتقدمة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}