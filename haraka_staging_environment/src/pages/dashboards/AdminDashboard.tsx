import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import AIAnalyticsPage from '@/pages/AIAnalyticsPage';
import PredictiveIntelligencePage from '@/pages/PredictiveIntelligencePage';
import AIControlCenterPage from '@/pages/AIControlCenterPage';
import UserManagement from '@/components/admin/UserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import ActivityStatistics from '@/components/admin/ActivityStatistics';
import AuditLogs from '@/components/admin/AuditLogs';
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Brain,
  Zap,
  Shield,
  Database,
  Activity,
  LogOut,
  Bell,
  Target,
  Cpu
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'predictive' | 'control-center'>('dashboard');
  const { trackClick, trackInteraction } = useActivityTracker({
    component: 'AdminDashboard',
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

  const handleViewControlCenter = () => {
    trackInteraction('view_control_center');
    setCurrentView('control-center');
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

  if (currentView === 'control-center') {
    return <AIControlCenterPage onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold">لوحة تحكم المدير</h1>
                  <p className="text-sm text-muted-foreground">
                    مرحباً، {user?.name} - إدارة شاملة لمنصة حركة
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                onClick={handleViewControlCenter}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <Cpu className="h-4 w-4 mr-2" />
                مركز التحكم الذكي
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

      {/* AI Systems Quick Access */}
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Cpu className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">مركز التحكم الذكي</CardTitle>
                    <CardDescription>
                      المرحلة الثالثة: المركز العصبي للمنصة
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-cyan-100 text-cyan-800 border-cyan-200">
                  <Zap className="h-3 w-3 mr-1" />
                  جديد
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
                  <div className="text-lg font-bold">مراقبة شاملة</div>
                  <div className="text-xs text-muted-foreground">في الوقت الحقيقي</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold">تمثيل بصري</div>
                  <div className="text-xs text-muted-foreground">خرائط حرارية</div>
                </div>
              </div>
              <Button onClick={handleViewControlCenter} className="w-full bg-cyan-600 hover:bg-cyan-700">
                دخول مركز التحكم الذكي
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">نظام الذكاء الاصطناعي التحليلي</CardTitle>
                    <CardDescription>
                      المرحلة الأولى: مراقبة وتحليل النشاط
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <Zap className="h-3 w-3 mr-1" />
                  نشط
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold">التحليل الفوري</div>
                  <div className="text-xs text-muted-foreground">مراقبة النشاط</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Settings className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold">أجهزة الاستشعار</div>
                  <div className="text-xs text-muted-foreground">مراقبة السلوك</div>
                </div>
              </div>
              <Button onClick={handleViewAnalytics} className="w-full bg-blue-600 hover:bg-blue-700">
                عرض التحليلات الكاملة
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
                    <CardTitle className="text-lg">نظام الذكاء التنبؤي</CardTitle>
                    <CardDescription>
                      المرحلة الثانية: التنبؤ والوعي السياقي
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
                  <Zap className="h-3 w-3 mr-1" />
                  متقدم
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold">التنبؤ الذكي</div>
                  <div className="text-xs text-muted-foreground">تعلم الآلة</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <Bell className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold">إنذارات ذكية</div>
                  <div className="text-xs text-muted-foreground">تنبيهات استباقية</div>
                </div>
              </div>
              <Button onClick={handleViewPredictive} className="w-full bg-purple-600 hover:bg-purple-700">
                استكشاف الذكاء التنبؤي
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              إعدادات النظام
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              سجلات النشاط
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="statistics">
            <ActivityStatistics />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="logs">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;