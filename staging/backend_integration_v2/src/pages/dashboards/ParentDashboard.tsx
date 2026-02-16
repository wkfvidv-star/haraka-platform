import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { ChildrenList } from '@/components/parent/ChildrenList';
import { ChildDetails } from '@/components/parent/ChildDetails';
import { SchedulingSystem } from '@/components/parent/SchedulingSystem';
import { MessagingSystem } from '@/components/parent/MessagingSystem';
import StudentAnalysisCard from '@/components/parent/StudentAnalysisCard';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { 
  Users, 
  Calendar, 
  Mail, 
  Bell, 
  TrendingUp,
  Activity,
  Heart,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  MessageSquare,
  CalendarCheck,
  UserCheck,
  Target,
  BookOpen,
  Settings,
  Home,
  LogOut,
  User,
  BarChart3
} from 'lucide-react';

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  // Mock data for dashboard overview
  const dashboardStats = {
    totalChildren: 3,
    activeChildren: 2,
    upcomingSessions: 5,
    unreadMessages: 3,
    weeklyProgress: 85,
    monthlyGoals: 78
  };

  const recentNotifications = [
    {
      id: '1',
      type: 'success',
      title: 'تم إكمال التمرين',
      message: 'أحمد أكمل تمرين القوة الوظيفية بنجاح',
      time: 'منذ ساعتين',
      child: 'أحمد محمد علي'
    },
    {
      id: '2',
      type: 'info',
      title: 'حصة جديدة محجوزة',
      message: 'تم حجز حصة سباحة لفاطمة يوم الأربعاء',
      time: 'منذ 4 ساعات',
      child: 'فاطمة الزهراء'
    },
    {
      id: '3',
      type: 'warning',
      title: 'تذكير بالفحص الطبي',
      message: 'موعد الفحص الطبي السنوي ليوسف قريباً',
      time: 'منذ يوم',
      child: 'يوسف أحمد'
    },
    {
      id: '4',
      type: 'info',
      title: 'تقرير أسبوعي جديد',
      message: 'تقرير الأداء الأسبوعي لأحمد متاح الآن',
      time: 'منذ يومين',
      child: 'أحمد محمد علي'
    }
  ];

  const upcomingSessions = [
    {
      id: '1',
      child: 'أحمد محمد علي',
      activity: 'تدريب كرة القدم',
      date: '2024-10-16',
      time: '16:00',
      instructor: 'المدرب أحمد الصالح',
      type: 'جماعي'
    },
    {
      id: '2',
      child: 'فاطمة الزهراء',
      activity: 'حصة السباحة',
      date: '2024-10-16',
      time: '15:30',
      instructor: 'المدربة فاطمة بن علي',
      type: 'جماعي'
    },
    {
      id: '3',
      child: 'أحمد محمد علي',
      activity: 'تمرين القوة الشخصي',
      date: '2024-10-17',
      time: '18:30',
      instructor: 'المدرب كريم الهادي',
      type: 'فردي'
    }
  ];

  // تبويبات التنقل
  const navigationTabs = [
    { id: 'dashboard', label: 'المتابعة', icon: Home },
    { id: 'children', label: 'الأطفال', icon: Users },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'schedule', label: 'الجدولة', icon: Calendar },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            مرحباً بك في لوحة ولي الأمر
          </CardTitle>
          <CardDescription className="text-purple-100">
            تابع تقدم أطفالك الرياضي والصحي، واحجز الحصص، وتواصل مع المعلمين
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.totalChildren}</div>
              <div className="text-xs sm:text-sm text-purple-100">إجمالي الأطفال</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.activeChildren}</div>
              <div className="text-xs sm:text-sm text-purple-100">نشط حالياً</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.upcomingSessions}</div>
              <div className="text-xs sm:text-sm text-purple-100">حصص قادمة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{dashboardStats.unreadMessages}</div>
              <div className="text-xs sm:text-sm text-purple-100">رسائل جديدة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="التقدم الأسبوعي"
          value={`${dashboardStats.weeklyProgress}%`}
          description="متوسط جميع الأطفال"
          icon={TrendingUp}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="النشاط اليومي"
          value="8.5k"
          description="متوسط الخطوات"
          icon={Activity}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="الحالة الصحية"
          value="ممتاز"
          description="التقييم العام"
          icon={Heart}
          color="red"
        />
        <StatsCard
          title="الإنجازات"
          value="15"
          description="هذا الشهر"
          icon={Award}
          color="purple"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Student Analysis Card - Added here */}
      <StudentAnalysisCard />

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
              onClick={() => setActiveTab('children')}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              عرض الأطفال
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              حجز حصة
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 relative text-xs sm:text-sm"
              onClick={() => setActiveTab('messages')}
            >
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              الرسائل
              {dashboardStats.unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {dashboardStats.unreadMessages}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              التقارير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarCheck className="h-5 w-5 text-blue-500" />
            الحصص القادمة
          </CardTitle>
          <CardDescription>
            الحصص المحجوزة لأطفالك في الأيام القادمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{session.activity}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{session.child}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.date} - {session.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {session.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-sm font-medium truncate max-w-24 sm:max-w-none">{session.instructor}</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs">
                    التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('schedule')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              عرض جميع الحصص
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-orange-500" />
            الإشعارات الحديثة
          </CardTitle>
          <CardDescription>
            آخر التحديثات حول أطفالك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.child}
                    </Badge>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
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
            تقارير مفصلة عن تقدم أطفالك الرياضي والصحي
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">أحمد محمد علي</CardTitle>
            <CardDescription>14 سنة - تلميذ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>اللياقة العامة</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>النشاط اليومي</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الحضور</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">فاطمة الزهراء</CardTitle>
            <CardDescription>12 سنة - تلميذة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>اللياقة العامة</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>النشاط اليومي</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الحضور</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">يوسف أحمد</CardTitle>
            <CardDescription>10 سنوات - تلميذ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>اللياقة العامة</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>النشاط اليومي</span>
                  <span>82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الحضور</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-500" />
            الملخص الشهري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
              <div className="text-sm text-gray-600">حصة مكتملة</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">18</div>
              <div className="text-sm text-gray-600">إنجاز جديد</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">معدل الحضور</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">+12%</div>
              <div className="text-sm text-gray-600">تحسن الأداء</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6" />
            الإشعارات المخصصة
          </CardTitle>
          <CardDescription className="text-orange-100">
            تحديثات فورية حول تقدم أطفالك ومواعيدهم المهمة
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              إنجازات ونجاحات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.filter(n => n.type === 'success').map((notification) => (
                <div key={notification.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-sm text-green-800 dark:text-green-200">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.child}
                    </Badge>
                    <span className="text-xs text-green-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              معلومات وتحديثات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.filter(n => n.type === 'info').map((notification) => (
                <div key={notification.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.child}
                    </Badge>
                    <span className="text-xs text-blue-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              تنبيهات ومواعيد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.filter(n => n.type === 'warning').map((notification) => (
                <div key={notification.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-medium text-sm text-orange-800 dark:text-orange-200">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.child}
                    </Badge>
                    <span className="text-xs text-orange-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            إعدادات الإشعارات
          </CardTitle>
          <CardDescription>
            تخصيص أنواع الإشعارات التي تريد استلامها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">إشعارات النشاط الرياضي</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">إكمال التمارين</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">تحقيق الأهداف اليومية</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">مسابقات وتحديات جديدة</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">إشعارات الجدولة والمواعيد</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">تذكير بالحصص القادمة</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">تأكيد الحجوزات</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">إلغاء أو تغيير المواعيد</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    // If viewing child details, show child details component
    if (selectedChildId) {
      return (
        <ChildDetails 
          childId={selectedChildId} 
          onBack={() => setSelectedChildId(undefined)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'children': return (
        <ChildrenList 
          onSelectChild={setSelectedChildId}
          selectedChildId={selectedChildId}
        />
      );
      case 'reports': return renderReports();
      case 'schedule': return <SchedulingSystem />;
      case 'messages': return <MessagingSystem />;
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
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - ولي الأمر
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">ولي أمر</div>
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
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'messages' && dashboardStats.unreadMessages > 0 && (
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