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
    <div className="expert-dashboard-root selection:bg-blue-500/30">
      {/* Background Image with Deep Overlay */}
      <div
        className="expert-bg-image"
        style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)' }}
      />
      <div className="expert-bg-overlay" />

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="expert-header">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#3b82f6]/10 rounded-2xl border border-[#3b82f6]/20">
                  <Shield className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">مركز تحكم النظام الرئيسي</h1>
                  <p className="text-sm text-slate-400 font-medium">
                    مرحباً، {user?.name} — إدارة البنية التحتية والذكاء السيادي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:bg-white/5">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-white/10 mx-2" />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors font-bold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="expert-container">
          {/* AI Systems Quick Access Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                <div className="w-2 h-8 bg-[#3b82f6] rounded-full" />
                الأنظمة الذكية والتحليلات السيادية
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'مركز التحكم الذكي',
                  desc: 'المركز العصبي للمنصة: مراقبة الأداء الفوري لكافة القطاعات',
                  icon: Cpu,
                  badge: 'جديد',
                  color: '#3482f6',
                  action: handleViewControlCenter,
                  stats: [
                    { label: 'مراقبة شاملة', icon: Activity },
                    { label: 'خرائط حرارية', icon: BarChart3 }
                  ]
                },
                {
                  title: 'الذكاء الاصطناعي التحليلي',
                  desc: 'مراقبة وتحليل النشاط الوطني باستخدام محركات التحليل العميق',
                  icon: Brain,
                  badge: 'نشط',
                  color: '#10b981',
                  action: handleViewAnalytics,
                  stats: [
                    { label: 'التحليل الفوري', icon: Activity },
                    { label: 'أجهزة الاستشعار', icon: Settings }
                  ]
                },
                {
                  title: 'نظام الذكاء التنبؤي',
                  desc: 'التنبؤ والوعي السياقي: استباق الاحتياجات والتحديات المستقبلية',
                  icon: Target,
                  badge: 'متقدم',
                  color: '#6366f1',
                  action: handleViewPredictive,
                  stats: [
                    { label: 'التنبؤ الذكي', icon: Target },
                    { label: 'إنذارات ذكية', icon: Bell }
                  ]
                }
              ].map((sys, idx) => (
                <Card key={idx} className="glass-card border-white/5 hover:border-[#3b82f6]/30 transition-all duration-500 group overflow-hidden relative">
                  <CardHeader className="pb-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <sys.icon className="h-7 w-7" style={{ color: sys.color }} />
                      </div>
                      <Badge className="bg-white/5 text-slate-300 border-white/10 px-3 py-1">
                        {sys.badge}
                      </Badge>
                    </div>
                    <div className="pt-6">
                      <CardTitle className="text-xl font-black text-white mb-2">{sys.title}</CardTitle>
                      <CardDescription className="text-slate-400 font-medium leading-relaxed">{sys.desc}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {sys.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group-hover:bg-white/10 transition-colors">
                          <stat.icon className="h-5 w-5 mx-auto mb-2 text-[#3b82f6]" />
                          <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={sys.action}
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-xl shadow-blue-900/40 rounded-2xl font-black h-12 transition-all active:scale-95"
                    >
                      دخول النظام السيادي
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Core Management Tabs */}
          <section>
            <Tabs defaultValue="users" className="space-y-8">
              <div className="flex items-center justify-center">
                <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-3xl border border-white/10 inline-flex shadow-2xl">
                  <TabsList className="bg-transparent border-none grid grid-cols-4 h-12 w-[500px]">
                    <TabsTrigger
                      value="users"
                      className="rounded-2xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black text-xs text-slate-400 gap-2"
                    >
                      <Users className="h-4 w-4" />
                      المستخدمين
                    </TabsTrigger>
                    <TabsTrigger
                      value="statistics"
                      className="rounded-2xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black text-xs text-slate-400 gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      الإحصائيات
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="rounded-2xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black text-xs text-slate-400 gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      الإعدادات
                    </TabsTrigger>
                    <TabsTrigger
                      value="logs"
                      className="rounded-2xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black text-xs text-slate-400 gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      السجلات
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Card className="glass-card border-white/5 rounded-[32px] overflow-hidden">
                  <CardContent className="p-8">
                    <TabsContent value="users" className="m-0">
                      <UserManagement />
                    </TabsContent>

                    <TabsContent value="statistics" className="m-0">
                      <ActivityStatistics />
                    </TabsContent>

                    <TabsContent value="settings" className="m-0">
                      <SystemSettings />
                    </TabsContent>

                    <TabsContent value="logs" className="m-0">
                      <AuditLogs />
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;