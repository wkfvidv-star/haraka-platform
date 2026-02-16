import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { ClassManagement } from '@/components/teacher/ClassManagement';
import { ExerciseManagement } from '@/components/teacher/ExerciseManagement';
import { ChallengeCreation } from '@/components/teacher/ChallengeCreation';
import { CommunicationTools } from '@/components/teacher/CommunicationTools';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Clock,
  Activity,
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  Calendar,
  Plus,
  Eye,
  Edit,
  Home,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  // Mock data for dashboard overview
  const dashboardStats = {
    totalClasses: 3,
    totalStudents: 78,
    activeStudents: 72,
    averageProgress: 82,
    completedExercises: 245,
    activeChallenges: 5,
    pendingReports: 8,
    unreadMessages: 12
  };

  const recentActivities = [
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
    },
    {
      id: '3',
      type: 'report_requested',
      student: 'محمد الأمين',
      activity: 'طلب تقرير من ولي الأمر',
      class: 'الثالثة متوسط ب',
      time: 'منذ ساعتين',
      score: null
    }
  ];

  const classOverview = [
    {
      id: 'class_1',
      name: 'الثالثة متوسط أ',
      students: 28,
      activeStudents: 25,
      averageProgress: 85,
      recentActivity: 'تمرين جماعي',
      status: 'نشط'
    },
    {
      id: 'class_2',
      name: 'الثالثة متوسط ب',
      students: 26,
      activeStudents: 24,
      averageProgress: 78,
      recentActivity: 'تحدي أسبوعي',
      status: 'نشط'
    },
    {
      id: 'class_3',
      name: 'الثانية متوسط أ',
      students: 24,
      activeStudents: 23,
      averageProgress: 80,
      recentActivity: 'تقييم شهري',
      status: 'نشط'
    }
  ];

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
    { id: 'exercises', label: 'التمارين', icon: BookOpen },
    { id: 'challenges', label: 'التحديات', icon: Trophy },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'communication', label: 'التواصل', icon: MessageSquare }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exercise_completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'challenge_joined': return <Trophy className="h-4 w-4 text-purple-500" />;
      case 'report_requested': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'مهم': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      case 'عادي': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            مرحباً أستاذ محمد الصالح
          </CardTitle>
          <CardDescription className="text-blue-100">
            لوحة تحكم شاملة لإدارة الصفوف والتمارين والتواصل مع الطلاب وأولياء الأمور
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.totalClasses}</div>
              <div className="text-xs sm:text-sm text-blue-100">الصفوف</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
              <div className="text-xs sm:text-sm text-blue-100">الطلاب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.averageProgress}%</div>
              <div className="text-xs sm:text-sm text-blue-100">متوسط التقدم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.activeChallenges}</div>
              <div className="text-xs sm:text-sm text-blue-100">تحديات نشطة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="الطلاب النشطون"
          value={`${dashboardStats.activeStudents}/${dashboardStats.totalStudents}`}
          description="نسبة المشاركة 92%"
          icon={Users}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="التمارين المكتملة"
          value={dashboardStats.completedExercises.toString()}
          description="هذا الشهر"
          icon={BookOpen}
          color="blue"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="التقارير المعلقة"
          value={dashboardStats.pendingReports.toString()}
          description="تحتاج مراجعة"
          icon={FileText}
          color="orange"
        />
        <StatsCard
          title="رسائل جديدة"
          value={dashboardStats.unreadMessages.toString()}
          description="من أولياء الأمور"
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('classes')}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              إدارة الصفوف
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('exercises')}
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              التمارين
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('challenges')}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              التحديات
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 relative text-xs sm:text-sm"
              onClick={() => setActiveTab('communication')}
            >
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              التواصل
              {dashboardStats.unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {dashboardStats.unreadMessages}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-500" />
            نظرة عامة على الصفوف
          </CardTitle>
          <CardDescription>
            حالة الصفوف والأنشطة الحديثة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {classOverview.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base sm:text-lg">{classItem.name}</CardTitle>
                      <CardDescription>{classItem.students} طالب</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {classItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-lg font-bold text-blue-600">{classItem.activeStudents}</div>
                      <div className="text-xs text-gray-500">نشط</div>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-lg font-bold text-green-600">{classItem.averageProgress}%</div>
                      <div className="text-xs text-gray-500">تقدم</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>معدل المشاركة</span>
                      <span>{Math.round((classItem.activeStudents / classItem.students) * 100)}%</span>
                    </div>
                    <Progress value={(classItem.activeStudents / classItem.students) * 100} className="h-2" />
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>النشاط الأخير:</strong> {classItem.recentActivity}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab('classes')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('classes')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              عرض جميع الصفوف
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-green-500" />
            الأنشطة الحديثة
          </CardTitle>
          <CardDescription>
            آخر الأنشطة والتفاعلات مع الطلاب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getActivityIcon(activity.type)}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{activity.student}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{activity.activity}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.class}
                      </Badge>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
                {activity.score && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-blue-600">{activity.score}%</div>
                    <div className="text-xs text-gray-500">النتيجة</div>
                  </div>
                )}
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

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-orange-500" />
            المهام القادمة
          </CardTitle>
          <CardDescription>
            المهام والمواعيد المهمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {task.type === 'تقرير' && <FileText className="h-5 w-5 text-white" />}
                    {task.type === 'تحدي' && <Trophy className="h-5 w-5 text-white" />}
                    {task.type === 'تمرين' && <BookOpen className="h-5 w-5 text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        موعد التسليم: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="flex-shrink-0">
                  <Edit className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">بدء العمل</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            التقارير والإحصائيات
          </CardTitle>
          <CardDescription className="text-green-100">
            تقارير مفصلة عن أداء الطلاب والصفوف
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
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
                <div className="text-sm text-gray-600">متوسط الأداء</div>
              </div>
              <Button className="w-full" variant="outline">
                عرض التقرير المفصل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                <div className="text-sm text-gray-600">معدل الحضور</div>
              </div>
              <Button className="w-full" variant="outline">
                عرض التقرير المفصل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              تقرير التحديات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">تحديات نشطة</div>
              </div>
              <Button className="w-full" variant="outline">
                عرض التقرير المفصل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
      case 'exercises': return <ExerciseManagement />;
      case 'challenges': return <ChallengeCreation />;
      case 'reports': return renderReports();
      case 'communication': return <CommunicationTools />;
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
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - المعلم
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">معلم</div>
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
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'communication' && dashboardStats.unreadMessages > 0 && (
                      <Badge className="ml-1 bg-red-500 text-xs px-1 py-0 min-w-[16px] h-4">
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

      {/* Main Content */}
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}