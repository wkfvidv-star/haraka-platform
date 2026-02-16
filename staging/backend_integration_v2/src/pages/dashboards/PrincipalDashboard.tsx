import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import AIAnalyticsPage from '@/pages/AIAnalyticsPage';
import PredictiveIntelligencePage from '@/pages/PredictiveIntelligencePage';
import SchoolAnalytics from '@/components/school/SchoolAnalytics';
import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  Calendar, 
  Brain,
  Activity,
  TrendingUp,
  BookOpen,
  Award,
  LogOut,
  Bell,
  Settings,
  Target,
  Globe
} from 'lucide-react';

const PrincipalDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'predictive' | 'school-analytics'>('dashboard');
  const { trackClick, trackInteraction } = useActivityTracker({
    component: 'PrincipalDashboard',
    trackClicks: true,
    trackViews: true,
    trackInteractions: true,
    trackTime: true
  });

  const handleLogout = () => {
    trackClick('logout_button');
    logout();
  };

  const handleViewAnalytics = () => {
    trackInteraction('view_analytics');
    setCurrentView('analytics');
  };

  const handleViewPredictive = () => {
    trackInteraction('view_predictive');
    setCurrentView('predictive');
  };

  const handleViewSchoolAnalytics = () => {
    trackInteraction('view_school_analytics');
    setCurrentView('school-analytics');
  };

  const handleBackToDashboard = () => {
    trackInteraction('back_to_dashboard');
    setCurrentView('dashboard');
  };

  if (currentView === 'analytics') {
    return <AIAnalyticsPage onBack={handleBackToDashboard} />;
  }

  if (currentView === 'predictive') {
    return <PredictiveIntelligencePage onBack={handleBackToDashboard} />;
  }

  if (currentView === 'school-analytics') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleBackToDashboard}>
                  ← العودة للوحة التحكم
                </Button>
                <div className="flex items-center gap-2">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold">التحليلات العامة للمدرسة</h1>
                    <p className="text-sm text-muted-foreground">
                      تحليل شامل لأداء جميع التلاميذ
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* School Analytics Content */}
        <div className="container mx-auto px-6 py-6">
          <SchoolAnalytics />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">لوحة تحكم المدير</h1>
                  <p className="text-sm text-muted-foreground">
                    مرحباً، {user?.name} - إدارة المدرسة والمتابعة الأكاديمية
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                onClick={handleViewSchoolAnalytics}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                <Globe className="h-4 w-4 mr-2" />
                التحليلات العامة
              </Button>
              <Button 
                variant="default" 
                onClick={handleViewPredictive}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Target className="h-4 w-4 mr-2" />
                الذكاء التنبؤي
              </Button>
              <Button 
                variant="default" 
                onClick={handleViewAnalytics}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                التحليلات الذكية
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Systems Overview */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">تحليل الأداء العام للتلاميذ</CardTitle>
                    <CardDescription>
                      إحصائيات شاملة من جدول التحليلات الحركية
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  جديد
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold">74.2%</div>
                  <div className="text-xs text-muted-foreground">متوسط المدرسة</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Users className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold">23</div>
                  <div className="text-xs text-muted-foreground">يحتاج متابعة</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold">+8.7%</div>
                  <div className="text-xs text-muted-foreground">تحسن شهري</div>
                </div>
              </div>
              <Button onClick={handleViewSchoolAnalytics} className="w-full bg-green-600 hover:bg-green-700">
                عرض التحليلات العامة والتقارير التفصيلية
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">نظام التحليلات الذكية للمدرسة</CardTitle>
                    <CardDescription>
                      مراقبة أداء الطلاب والمعلمين بالذكاء الاصطناعي
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  نشط
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold">85%</div>
                  <div className="text-xs text-muted-foreground">معدل التفاعل</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold">92%</div>
                  <div className="text-xs text-muted-foreground">الأداء الأكاديمي</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold">78%</div>
                  <div className="text-xs text-muted-foreground">التفاعل الاجتماعي</div>
                </div>
              </div>
              <Button onClick={handleViewAnalytics} className="w-full bg-blue-600 hover:bg-blue-700">
                عرض التحليلات التفصيلية والرؤى الذكية
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">نظام التنبؤ التعليمي</CardTitle>
                    <CardDescription>
                      توقع الأداء والتدخل المبكر للطلاب
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
                  جديد
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold">12</div>
                  <div className="text-xs text-muted-foreground">تنبؤات نشطة</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Bell className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold">3</div>
                  <div className="text-xs text-muted-foreground">تنبيهات عاجلة</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold">89%</div>
                  <div className="text-xs text-muted-foreground">دقة التنبؤ</div>
                </div>
              </div>
              <Button onClick={handleViewPredictive} className="w-full bg-purple-600 hover:bg-purple-700">
                استكشاف الذكاء التنبؤي
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المعلمون النشطون</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">+3 معلمين جدد</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الحضور</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% تحسن</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإنجازات</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">شهادات وجوائز</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات العامة</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="teachers">المعلمون</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الأنشطة الحديثة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تم إنجاز مشروع الرياضيات</p>
                        <p className="text-xs text-muted-foreground">الصف السابع - منذ ساعتين</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">اجتماع أولياء الأمور</p>
                        <p className="text-xs text-muted-foreground">غداً الساعة 3:00 مساءً</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تحديث المناهج</p>
                        <p className="text-xs text-muted-foreground">قيد المراجعة</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الإحصائيات الأسبوعية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">معدل الحضور</span>
                      <span className="font-bold">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الواجبات المكتملة</span>
                      <span className="font-bold">87.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">رضا أولياء الأمور</span>
                      <span className="font-bold">91.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">نشاط المعلمين</span>
                      <span className="font-bold">96.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  تحليل الأداء العام للتلاميذ
                </CardTitle>
                <CardDescription>
                  إحصائيات مفصلة من جدول analysis_reports مع خيارات التصدير والإشعارات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-medium mb-2">التحليلات العامة للمدرسة</h3>
                  <p className="text-muted-foreground mb-4">
                    عرض شامل لأداء جميع التلاميذ مع تحديد الطلاب المحتاجين للمتابعة وخيارات التصدير
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">74.2%</div>
                      <div className="text-sm text-muted-foreground">متوسط الأداء العام</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">23</div>
                      <div className="text-sm text-muted-foreground">طالب يحتاج متابعة دون 60%</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,234</div>
                      <div className="text-sm text-muted-foreground">إجمالي التحليلات</div>
                    </div>
                  </div>
                  <Button onClick={handleViewSchoolAnalytics} className="bg-green-600 hover:bg-green-700">
                    <Globe className="h-4 w-4 mr-2" />
                    عرض التحليلات التفصيلية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلاب</CardTitle>
                <CardDescription>متابعة أداء وحضور الطلاب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>سيتم تطوير هذا القسم في المراحل القادمة</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المعلمين</CardTitle>
                <CardDescription>متابعة أداء وأنشطة المعلمين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>سيتم تطوير هذا القسم في المراحل القادمة</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>التقارير والتحليلات</CardTitle>
                <CardDescription>تقارير شاملة عن أداء المدرسة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <p className="text-muted-foreground mb-4">للحصول على تقارير تفصيلية وتحليلات متقدمة</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleViewSchoolAnalytics} className="bg-green-600 hover:bg-green-700">
                      <Globe className="h-4 w-4 mr-2" />
                      التحليلات العامة
                    </Button>
                    <Button onClick={handleViewAnalytics} className="bg-blue-600 hover:bg-blue-700">
                      <Brain className="h-4 w-4 mr-2" />
                      التحليلات الذكية
                    </Button>
                    <Button onClick={handleViewPredictive} className="bg-purple-600 hover:bg-purple-700">
                      <Target className="h-4 w-4 mr-2" />
                      الذكاء التنبؤي
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrincipalDashboard;