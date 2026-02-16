import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { ClientManagement } from '@/components/coach/ClientManagement';
import { SessionScheduling } from '@/components/coach/SessionScheduling';
import { ProgressReports } from '@/components/coach/ProgressReports';
import { TrainingPrograms } from '@/components/coach/TrainingPrograms';
import { ClientNotifications } from '@/components/coach/ClientNotifications';
import VideoAnalysisReview from '@/components/coach/VideoAnalysisReview';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { 
  Users, 
  Calendar, 
  Bell, 
  TrendingUp,
  Clock,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Heart,
  BarChart3,
  Plus,
  Eye,
  MessageSquare,
  Home,
  LogOut,
  User,
  Dumbbell,
  FileText,
  Video
} from 'lucide-react';

interface QuickStats {
  todayClients: number;
  todaySessions: number;
  completedSessions: number;
  pendingNotifications: number;
  weeklyRevenue: number;
  clientSatisfaction: number;
  activePrograms: number;
  newBookings: number;
}

interface TodaySession {
  id: string;
  clientName: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  location: string;
}

interface RecentActivity {
  id: string;
  type: 'session_completed' | 'new_booking' | 'progress_update' | 'client_message';
  clientName: string;
  description: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  trend: number;
  color: string;
}

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  const [quickStats] = useState<QuickStats>({
    todayClients: 8,
    todaySessions: 12,
    completedSessions: 9,
    pendingNotifications: 5,
    weeklyRevenue: 2400,
    clientSatisfaction: 96,
    activePrograms: 6,
    newBookings: 3
  });

  const [todaySessions] = useState<TodaySession[]>([
    {
      id: '1',
      clientName: 'أحمد محمد',
      time: '09:00',
      duration: 60,
      type: 'تدريب قوة',
      status: 'completed',
      location: 'صالة الأثقال'
    },
    {
      id: '2',
      clientName: 'سارة أحمد',
      time: '10:30',
      duration: 45,
      type: 'كارديو',
      status: 'in-progress',
      location: 'صالة الكارديو'
    },
    {
      id: '3',
      clientName: 'محمد علي',
      time: '14:00',
      duration: 90,
      type: 'تدريب شامل',
      status: 'scheduled',
      location: 'الصالة الرئيسية'
    },
    {
      id: '4',
      clientName: 'فاطمة الزهراء',
      time: '16:00',
      duration: 60,
      type: 'يوغا',
      status: 'scheduled',
      location: 'استوديو اليوغا'
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'session_completed',
      clientName: 'أحمد محمد',
      description: 'أكمل جلسة تدريب القوة بنجاح',
      time: 'منذ 30 دقيقة',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'new_booking',
      clientName: 'ليلى حسن',
      description: 'حجزت جلسة تدريب جديدة',
      time: 'منذ ساعة',
      priority: 'high'
    },
    {
      id: '3',
      type: 'progress_update',
      clientName: 'سارة أحمد',
      description: 'حققت هدف فقدان الوزن الشهري',
      time: 'منذ ساعتين',
      priority: 'high'
    },
    {
      id: '4',
      type: 'client_message',
      clientName: 'محمد علي',
      description: 'أرسل استفسار حول البرنامج التدريبي',
      time: 'منذ 3 ساعات',
      priority: 'medium'
    }
  ]);

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      label: 'معدل الحضور',
      value: 92,
      target: 90,
      trend: 5,
      color: 'green'
    },
    {
      label: 'رضا العملاء',
      value: 96,
      target: 95,
      trend: 2,
      color: 'blue'
    },
    {
      label: 'إنجاز الأهداف',
      value: 87,
      target: 85,
      trend: 8,
      color: 'purple'
    },
    {
      label: 'الحجوزات الجديدة',
      value: 15,
      target: 12,
      trend: 25,
      color: 'orange'
    }
  ]);

  // تبويبات التنقل مع إضافة تحليل الأداء
  const navigationTabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'clients', label: 'العملاء', icon: Users },
    { id: 'scheduling', label: 'الجدولة', icon: Calendar },
    { id: 'programs', label: 'البرامج', icon: Target },
    { id: 'video-analysis', label: 'تحليل الأداء', icon: Video },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'notifications', label: 'الإشعارات', icon: Bell }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session_completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'new_booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'progress_update': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'client_message': return <MessageSquare className="h-4 w-4 text-orange-500" />;
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

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Dumbbell className="h-6 w-6" />
            مرحباً كابتن أحمد الرياضي
          </CardTitle>
          <CardDescription className="text-purple-100">
            لوحة تحكم احترافية لإدارة العملاء والجلسات التدريبية
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.todayClients}</div>
              <div className="text-xs sm:text-sm text-purple-100">عملاء اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.todaySessions}</div>
              <div className="text-xs sm:text-sm text-purple-100">جلسات اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.clientSatisfaction}%</div>
              <div className="text-xs sm:text-sm text-purple-100">رضا العملاء</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg relative">
              <div className="text-2xl font-bold">{quickStats.pendingNotifications}</div>
              <div className="text-xs sm:text-sm text-purple-100">إشعارات</div>
              {quickStats.pendingNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="الجلسات المكتملة"
          value={`${quickStats.completedSessions}/${quickStats.todaySessions}`}
          description="معدل الإنجاز 75%"
          icon={CheckCircle}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="الإيرادات الأسبوعية"
          value={`${quickStats.weeklyRevenue} ر.س`}
          description="زيادة عن الأسبوع الماضي"
          icon={TrendingUp}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="البرامج النشطة"
          value={quickStats.activePrograms.toString()}
          description="برامج تدريبية متنوعة"
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="حجوزات جديدة"
          value={quickStats.newBookings.toString()}
          description="اليوم"
          icon={Calendar}
          color="orange"
          trend={{ value: 50, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('clients')}
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              إدارة العملاء
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('scheduling')}
            >
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              جدولة جلسة
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
              onClick={() => setActiveTab('video-analysis')}
            >
              <Video className="h-5 w-5 sm:h-6 sm:w-6" />
              تحليل الأداء
            </Button>
            <Button 
              variant="outline" 
              className="h-16 sm:h-20 flex-col gap-2 relative text-xs sm:text-sm"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              الإشعارات
              {quickStats.pendingNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-xs">
                  {quickStats.pendingNotifications}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            مؤشرات الأداء الاحترافية
          </CardTitle>
          <CardDescription>
            تقييم شامل لأدائك كمدرب محترف
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{metric.label}</span>
                  <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                    +{metric.trend}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الحالي: {metric.value}%</span>
                    <span className="text-gray-500">الهدف: {metric.target}%</span>
                  </div>
                  <Progress value={metric.value} className="h-3" />
                </div>
                <div className={`text-xs text-${metric.color}-600 font-medium`}>
                  {metric.value >= metric.target ? '✓ تم تحقيق الهدف' : `باقي ${metric.target - metric.value}% للهدف`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-green-500" />
                جدول اليوم
              </CardTitle>
              <CardDescription>
                جلساتك التدريبية لهذا اليوم
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setActiveTab('scheduling')}>
              <Plus className="h-4 w-4 mr-2" />
              جدولة جلسة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="text-center flex-shrink-0">
                    <div className="text-lg font-bold text-blue-600">{session.time}</div>
                    <div className="text-xs text-gray-500">{session.duration} دقيقة</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base truncate">{session.clientName}</h4>
                    <p className="text-sm text-gray-600 truncate">{session.type}</p>
                    <p className="text-xs text-gray-500 truncate">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'completed' && 'مكتملة'}
                    {session.status === 'in-progress' && 'جارية'}
                    {session.status === 'scheduled' && 'مجدولة'}
                    {session.status === 'cancelled' && 'ملغية'}
                  </Badge>
                  <Button size="sm" variant="outline" className="hidden sm:flex">
                    <Eye className="h-4 w-4 mr-1" />
                    التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('scheduling')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              عرض الجدول الكامل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-purple-500" />
            الأنشطة الحديثة
          </CardTitle>
          <CardDescription>
            آخر التحديثات والتفاعلات مع العملاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 ${getPriorityColor(activity.priority)}`}>
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm">{activity.clientName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{activity.time}</span>
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

  const renderPrograms = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Target className="h-6 w-6" />
            البرامج التدريبية
          </CardTitle>
          <CardDescription className="text-green-100">
            إدارة وتطوير البرامج التدريبية المتخصصة
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-blue-500" />
              برنامج بناء العضلات
            </CardTitle>
            <CardDescription>برنامج متخصص لزيادة الكتلة العضلية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">عميل</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-500">أسابيع</div>
                </div>
              </div>
              <Button className="w-full" variant="outline" size="sm">
                عرض التفاصيل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              برنامج اللياقة القلبية
            </CardTitle>
            <CardDescription>تحسين صحة القلب والأوعية الدموية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="text-lg font-bold text-red-600">8</div>
                  <div className="text-xs text-gray-500">عميل</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">6</div>
                  <div className="text-xs text-gray-500">أسابيع</div>
                </div>
              </div>
              <Button className="w-full" variant="outline" size="sm">
                عرض التفاصيل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              برنامج فقدان الوزن
            </CardTitle>
            <CardDescription>برنامج شامل لإنقاص الوزن بطريقة صحية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="text-lg font-bold text-purple-600">15</div>
                  <div className="text-xs text-gray-500">عميل</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-500">أسابيع</div>
                </div>
              </div>
              <Button className="w-full" variant="outline" size="sm">
                عرض التفاصيل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            ملخص البرامج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quickStats.activePrograms}</div>
              <div className="text-sm text-gray-600">برامج نشطة</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">35</div>
              <div className="text-sm text-gray-600">عملاء مسجلين</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">معدل الإكمال</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.8</div>
              <div className="text-sm text-gray-600">تقييم البرامج</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'clients': return <ClientManagement />;
      case 'scheduling': return <SessionScheduling />;
      case 'programs': return renderPrograms();
      case 'video-analysis': return <VideoAnalysisReview />;
      case 'reports': return <ProgressReports />;
      case 'notifications': return <ClientNotifications />;
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
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - المدرب
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">مدرب</div>
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
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'notifications' && quickStats.pendingNotifications > 0 && (
                      <Badge className="ml-1 bg-red-500 text-xs px-1 py-0 min-w-[16px] h-4">
                        {quickStats.pendingNotifications}
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