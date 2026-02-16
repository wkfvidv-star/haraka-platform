import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
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
  MessageSquare
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

export function CoachDashboard() {
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            مرحباً كابتن أحمد الرياضي
          </CardTitle>
          <CardDescription className="text-purple-100">
            لوحة تحكم احترافية لإدارة العملاء والجلسات التدريبية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.todayClients}</div>
              <div className="text-sm text-purple-100">عملاء اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.todaySessions}</div>
              <div className="text-sm text-purple-100">جلسات اليوم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{quickStats.clientSatisfaction}%</div>
              <div className="text-sm text-purple-100">رضا العملاء</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg relative">
              <div className="text-2xl font-bold">{quickStats.pendingNotifications}</div>
              <div className="text-sm text-purple-100">إشعارات</div>
              {quickStats.pendingNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            مؤشرات الأداء الاحترافية
          </CardTitle>
          <CardDescription>
            تقييم شامل لأدائك كمدرب محترف
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                جدول اليوم
              </CardTitle>
              <CardDescription>
                جلساتك التدريبية لهذا اليوم
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              جدولة جلسة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{session.time}</div>
                    <div className="text-xs text-gray-500">{session.duration} دقيقة</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div>
                    <h4 className="font-medium">{session.clientName}</h4>
                    <p className="text-sm text-gray-600">{session.type}</p>
                    <p className="text-xs text-gray-500">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'completed' && 'مكتملة'}
                    {session.status === 'in-progress' && 'جارية'}
                    {session.status === 'scheduled' && 'مجدولة'}
                    {session.status === 'cancelled' && 'ملغية'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{activity.clientName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
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
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              إدارة العملاء
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              جدولة جلسة
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              تقارير التقدم
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 relative">
              <Bell className="h-6 w-6" />
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
    </div>
  );
}