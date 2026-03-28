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
import { PrincipalOnboarding } from '@/components/dashboard/PrincipalOnboarding';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';
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
  Globe,
  MapPin,
  FileText,
  Download
} from 'lucide-react';

const PrincipalDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'predictive' | 'school-analytics'>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [receivedReports, setReceivedReports] = useState<any[]>([]);

  React.useEffect(() => {
    // Check if new user & if onboarding seen
    const hasSeenOnboarding = localStorage.getItem('haraka_principal_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      setIsNewUser(true);
    }
    
    // Load synced reports
    try {
      const saved = JSON.parse(localStorage.getItem('haraka_sent_reports') || '[]');
      const principalReports = saved.filter((r: any) => r.recipient === 'principal');
      setReceivedReports(principalReports.reverse()); // Latest first
    } catch(e) {}
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('haraka_principal_onboarding_seen', 'true');
  };

  const replayTour = () => {
    localStorage.removeItem('haraka_principal_onboarding_seen');
    setIsNewUser(false); // Reset to false for subsequent plays
    setShowOnboarding(true);
  };

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
    <div className="expert-dashboard-root selection:bg-blue-500/30">

      {showOnboarding && (
        <PrincipalOnboarding
          onComplete={handleOnboardingComplete}
          isNewUser={isNewUser}
        />
      )}

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
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <GraduationCap className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">لوحة تحكم المدير</h1>
                  <p className="text-sm text-slate-400 font-medium">
                    مرحباً، {user?.name} — إدارة المنصة التعليمية الذكية
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={replayTour}
                  className="hidden sm:flex text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                >
                  إعادة الجولة
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-300">
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
          <section className="mb-12" data-tour="ai_systems">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                <div className="w-2 h-8 bg-[#3b82f6] rounded-full" />
                أنظمة الرؤى والذكاء التنبؤي
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'تحليل الأداء العام',
                  desc: 'إحصائيات شاملة وتفصيلية للأداء المدرسي',
                  icon: Globe,
                  badge: 'جديد',
                  color: '#3b82f6',
                  action: handleViewSchoolAnalytics,
                  stats: [
                    { label: 'متوسط الأداء', value: '74.2%', icon: Target },
                    { label: 'يحتاج متابعة', value: '23', icon: Users }
                  ]
                },
                {
                  title: 'التحليلات الذكية',
                  desc: 'مراقبة أداء الطلاب بالذكاء الاصطناعي',
                  icon: Brain,
                  badge: 'نشط',
                  color: '#10b981',
                  action: handleViewAnalytics,
                  stats: [
                    { label: 'معدل التفاعل', value: '85%', icon: Activity },
                    { label: 'الأداء الأكاديمي', value: '92%', icon: TrendingUp }
                  ]
                },
                {
                  title: 'الذكاء التنبؤي',
                  desc: 'توقع الأداء الأكاديمي والتدخل المبكر',
                  icon: Target,
                  badge: 'نشط',
                  color: '#6366f1',
                  action: handleViewPredictive,
                  stats: [
                    { label: 'تنبؤات نشطة', value: '12', icon: Target },
                    { label: 'تنبيهات عاجلة', value: '3', icon: Bell }
                  ]
                }
              ].map((sys, idx) => (
                <Card key={idx} className="glass-card border-white/5 hover:border-[#3b82f6]/30 transition-all duration-500 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#3b82f6]/10 transition-all" />

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
                          <div className="text-lg font-black text-white">{stat.value}</div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={sys.action}
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-xl shadow-blue-900/40 rounded-2xl font-black h-12 text-base transition-all active:scale-95"
                    >
                      فتح النظام
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-tour="quick_stats">
            {[
              { label: 'إجمالي الطلاب', value: '1,247', trend: '+12%', icon: Users, color: 'text-blue-400' },
              { label: 'المعلمون النشطون', value: '67', trend: '+3', icon: BookOpen, color: 'text-emerald-400' },
              { label: 'معدل الحضور', value: '94.2%', trend: '+2.1%', icon: Calendar, color: 'text-orange-400' },
              { label: 'الإنجازات', value: '342', trend: 'شهادات', icon: Award, color: 'text-indigo-400' }
            ].map((stat, idx) => (
              <Card key={idx} className="glass-card border-white/5 group hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} border border-white/10`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-[11px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      {stat.trend}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{stat.label}</h3>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-8" data-tour="main_tabs">
            <div className="flex items-center justify-center">
              <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-3xl border border-white/10 inline-flex shadow-2xl">
                <TabsList className="bg-transparent border-none grid grid-cols-6 h-12 w-[720px]">
                  {['overview', 'analytics', 'students', 'teachers', 'reports', 'ratings'].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="rounded-2xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black text-xs text-slate-400 px-4"
                    >
                      {tab === 'overview' ? 'نظرة عامة' :
                        tab === 'analytics' ? 'التحليلات' :
                          tab === 'students' ? 'الطلاب' :
                            tab === 'teachers' ? 'المعلمون' :
                              tab === 'reports' ? 'التقارير' : '⭐ التقييم'}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="glass-card border-white/5 rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
                        <Activity className="h-6 w-6 text-[#3b82f6]" />
                        آخر الأنشطة والفعاليات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: 'اجتماع أولياء الأمور', time: 'غداً الساعة 3:00 مساءً', color: 'bg-[#3b82f6]' },
                        { title: 'تحديث المناهج', time: 'قيد المراجعة', color: 'bg-orange-500' },
                        { title: 'إضافة محتوى تعليمي جديد', time: 'منذ 3 ساعات', color: 'bg-emerald-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className={`w-3 h-3 ${item.color} rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                          <div className="flex-1">
                            <h4 className="font-black text-base text-white">{item.title}</h4>
                            <p className="text-sm text-slate-500 font-medium">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/5 rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
                        <TrendingUp className="h-6 w-6 text-emerald-400" />
                        تقرير الأداء الأسبوعي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { label: 'معدل الحضور الدراسي', value: '94.2%', color: 'text-blue-400', bg: 'bg-blue-400/5' },
                        { label: 'نسبة إنجاز الواجبات', value: '87.5%', color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                        { label: 'مؤشر رضا أولياء الأمور', value: '91.3%', color: 'text-orange-400', bg: 'bg-orange-400/5' },
                        { label: 'معدل تفاعل المعلمين', value: '96.1%', color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/5' }
                      ].map((stat, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-5 ${stat.bg} rounded-2xl border border-white/5 hover:scale-[1.01] transition-transform`}>
                          <span className="text-base font-bold text-slate-300">{stat.label}</span>
                          <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="glass-card border-white/5 rounded-[40px] overflow-hidden">
                  <div className="p-16 text-center space-y-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <div className="w-24 h-24 bg-[#3b82f6]/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(59,130,246,0.2)] border border-[#3b82f6]/30">
                      <Globe className="h-12 w-12 text-[#3b82f6]" />
                    </div>
                    <div className="max-w-2xl mx-auto relative z-10">
                      <h3 className="text-3xl font-black text-white mb-4">التحليلات الذكية الشاملة</h3>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed">
                        استكشف أعماق البيانات المدرسية باستخدام محرك الذكاء الاصطناعي الخاص بنا. حدد الأنماط، وتوقع النتائج، واتخذ قرارات مدروسة لتحسين تجربة التعلم.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative z-10">
                      {[
                        { label: 'كفاءة التعلم المتوقعة', value: '74.2%', color: 'text-blue-400', border: 'border-blue-400/20' },
                        { label: 'تنبيهات التدخل المبكر', value: '23', color: 'text-orange-400', border: 'border-orange-400/20' },
                        { label: 'نقاط البيانات المحللة', value: '1.2M', color: 'text-emerald-400', border: 'border-emerald-400/20' }
                      ].map((item, idx) => (
                        <div key={idx} className={`p-8 rounded-3xl border ${item.border} bg-white/5 backdrop-blur-lg`}>
                          <div className={`text-4xl font-black mb-2 ${item.color}`}>{item.value}</div>
                          <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleViewSchoolAnalytics}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-16 h-16 rounded-3xl font-black text-xl shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all relative z-10"
                    >
                      إطلاق مركز التحليلات
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Other tabs with updated styling */}
              <TabsContent value="students" className="p-24 text-center glass-card border-white/5 rounded-3xl">
                <Users className="h-24 w-24 mx-auto mb-6 text-slate-700 animate-pulse" />
                <h3 className="text-2xl font-black text-white mb-2">إدارة سجلات الطلاب</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  مركز إدارة الطلاب والملفات الشخصية سيكون متاحاً قريباً في التحديث القادم
                </p>
              </TabsContent>
              <TabsContent value="teachers" className="p-24 text-center glass-card border-white/5 rounded-3xl">
                <BookOpen className="h-24 w-24 mx-auto mb-6 text-slate-700 animate-pulse" />
                <h3 className="text-2xl font-black text-white mb-2">مركز الهيئة التدريسية</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                  أدوات تواصل وإدارة المعلمين يتم تحضيرها حالياً لتناسب احتياجاتكم
                </p>
              </TabsContent>
              <TabsContent value="reports" className="animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                     <FileText className="w-6 h-6 text-[#3b82f6]" /> التقارير المرفوعة من الأساتذة
                  </h3>
                  <Badge className="bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 px-4 py-1.5 text-sm font-bold">
                     إجمالي: {receivedReports.length}
                  </Badge>
                </div>

                {receivedReports.length === 0 ? (
                  <div className="p-24 text-center glass-card border-white/5 rounded-3xl">
                    <BarChart3 className="h-24 w-24 mx-auto mb-6 text-slate-700 animate-pulse" />
                    <h3 className="text-2xl font-black text-white mb-2">لا توجد تقارير حالياً</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                      جميع التقارير المرسلة من أساتذة أقسام المدرسة ستظهر هنا فور تزامنها.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {receivedReports.map((report) => (
                      <Card key={report.id} className="glass-card border-white/5 hover:border-[#3b82f6]/40 transition-all duration-300 group">
                        <CardHeader className="pb-2 border-b border-white/5">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="bg-white/5 text-slate-300 border-white/10 mb-3">{report.period}</Badge>
                              <CardTitle className="text-lg font-black text-white">{report.studentName}</CardTitle>
                              <CardDescription className="text-blue-400 font-bold mt-1">{report.class}</CardDescription>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                              <FileText className="w-6 h-6 text-[#3b82f6]" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                             <div className="text-sm font-bold text-slate-400">نوع التقرير</div>
                             <div className="text-sm font-black text-white">{report.type}</div>
                          </div>
                          <div className="flex items-center justify-between mb-6">
                             <div className="text-sm font-bold text-slate-400">معدل الإنجاز</div>
                             <div className={`text-sm font-black px-2 py-1 rounded-md ${report.progress >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                               {report.progress}%
                             </div>
                          </div>
                          <Button className="w-full bg-white/5 hover:bg-[#3b82f6] text-white transition-colors border border-white/10 hover:border-[#3b82f6]">
                             <Download className="w-4 h-4 ml-2" /> استعراض وتنزيل
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="ratings" className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
                  <div>
                    <h3 className="text-xl font-black text-white mb-4">⭐ تقييم الأساتذة</h3>
                    <RatingSystem
                      raterRole="مدير مدرسة"
                      raterName={user?.name || 'المدير'}
                      targets={[
                        { id: 't1', name: 'ستاذ أحمد لعماري', role: 'أستاذ رياضة بدنية' },
                        { id: 't2', name: 'أستاذة فاطمة سوداني', role: 'أستاذة علوم ' },
                        { id: 't3', name: 'أستاذ كريم بوكريم', role: 'أستاذ رياضيات' },
                      ]}
                      mode="rate"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-4">💬 غرفة المدراء</h3>
                    <ChatSystem userRole="principal" userName={user?.name || 'المدير'} inline defaultOpen />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PrincipalDashboard;