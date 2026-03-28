import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import AIAnalyticsPage from '@/pages/AIAnalyticsPage';
import PredictiveIntelligencePage from '@/pages/PredictiveIntelligencePage';
import AIControlCenterPage from '@/pages/AIControlCenterPage';
import UserManagement from '@/components/admin/UserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import ActivityStatistics from '@/components/admin/ActivityStatistics';
import AuditLogs from '@/components/admin/AuditLogs';
import SmartAccessControl from '@/components/admin/SmartAccessControl';
import { AdminOnboarding } from '@/components/admin-dashboard/AdminOnboarding';
import { AdminHome } from '@/components/admin-dashboard/AdminHome';
import { AdminStudents } from '@/components/admin-dashboard/AdminStudents';
import { AdminTeachers } from '@/components/admin-dashboard/AdminTeachers';
import { AdminPerformance } from '@/components/admin-dashboard/AdminPerformance';
import { AdminVideoAnalysis } from '@/components/admin-dashboard/AdminVideoAnalysis';
import { AdminHealth } from '@/components/admin-dashboard/AdminHealth';
import { AdminPsychological } from '@/components/admin-dashboard/AdminPsychological';
import { AdminReports } from '@/components/admin-dashboard/AdminReports';
import {
  Users,
  Settings,
  BarChart3,
  FileText,
  Brain,
  Shield,
  Activity,
  LogOut,
  Bell,
  Target,
  Cpu,
  ShieldCheck,
  PlayCircle,
  Menu,
  HeartPulse,
  Video,
  Home,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

export type AdminViewType =
  | 'home'
  | 'students'
  | 'teachers'
  | 'statistics'
  | 'settings'
  | 'logs'
  | 'access'
  | 'video'
  | 'health'
  | 'psychological'
  | 'analytics'
  | 'predictive'
  | 'control-center';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AdminViewType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { trackClick, trackInteraction } = useActivityTracker({
    component: 'AdminDashboard',
    trackClicks: true,
    trackViews: true,
    trackInteractions: true,
    trackTime: true
  });

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  React.useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('haraka_admin_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      setIsNewUser(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('haraka_admin_onboarding_seen', 'true');
  };

  const handleReplayOnboarding = () => {
    localStorage.removeItem('haraka_admin_onboarding_seen');
    setIsNewUser(false);
    setShowOnboarding(true);
  };

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
    setCurrentView('home');
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'students', label: 'التلاميذ', icon: Users },
    { id: 'teachers', label: 'المعلمين', icon: GraduationCap },
    { id: 'statistics', label: 'الأداء العام', icon: BarChart3 },
    { id: 'video', label: 'تحليل الفيديو', icon: Video },
    { id: 'health', label: 'الملف الصحي', icon: HeartPulse },
    { id: 'psychological', label: 'الحالة النفسية', icon: Brain },
    { id: 'logs', label: 'التقارير والسجلات', icon: FileText },
    { id: 'access', label: 'الوصول الذكي', icon: ShieldCheck },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ] as const;

  if (currentView === 'analytics') return <AIAnalyticsPage onBack={handleBackToDashboard} />;
  if (currentView === 'predictive') return <PredictiveIntelligencePage onBack={handleBackToDashboard} />;
  if (currentView === 'control-center') return <AIControlCenterPage onBack={handleBackToDashboard} />;

  return (
    <div className="expert-dashboard-root selection:bg-blue-500/30 relative text-right" dir="rtl">
      {/* Onboarding Overlay */}
      {showOnboarding && (
        <AdminOnboarding
          onComplete={handleCompleteOnboarding}
          onSkip={handleCompleteOnboarding}
          isNewUser={isNewUser}
        />
      )}

      {/* Background Image with Deep Overlay */}
      <div
        className="expert-bg-image"
        style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)' }}
      />
      <div className="expert-bg-overlay" />

      {/* Main Content Container border-t border-l */}
      <div className="relative z-10 flex h-screen overflow-hidden font-cairo">

        {/* Sidebar */}
        <aside
          data-tour="admin_sidebar"
          className={`
          ${isSidebarOpen ? 'w-72' : 'w-20'} 
          transition-all duration-300 ease-in-out shrink-0
          bg-slate-950/80 backdrop-blur-xl border-l border-white/5 
          flex flex-col z-40
        `}>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            {isSidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3b82f6]/10 rounded-xl border border-[#3b82f6]/20">
                  <Shield className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <span className="text-xl font-black text-white tracking-wide">الإدارة</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white mx-auto">
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminViewType)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive
                      ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {isSidebarOpen && (
                    <span className="font-bold text-sm tracking-wide text-right flex-1">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5 space-y-2">
            {isSidebarOpen && (
              <div className="px-4 py-3 bg-white/5 rounded-2xl mb-4 border border-white/5 text-right">
                <p className="text-xs text-slate-400 font-medium">حساب المدير</p>
                <p className="text-sm text-white font-bold truncate">{user?.name}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
                text-rose-400 border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10
                ${!isSidebarOpen && 'justify-center'}
              `}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden text-right">

          {/* Header */}
          <header className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 shrink-0">
            <div>
              <h1 className="text-2xl font-black text-white">مركز تحكم النظام الرئيسي</h1>
              <p className="text-xs font-bold text-slate-400 mt-0.5 tracking-wide">
                منصة حركة - الوصول السيادي والإشراف المتقدم
              </p>
            </div>

            <div className="flex items-center gap-4" dir="ltr">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:bg-white/10 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900 border-2" />
              </Button>

              <div className="h-8 w-[1px] bg-white/10" />

              {/* Replay Tour Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplayOnboarding}
                className="bg-white/5 border-white/10 text-slate-300 hover:text-[#3b82f6] hover:bg-white/10 transition-all rounded-xl gap-2 h-10 px-4 group hidden md:flex"
              >
                <PlayCircle className="w-4 h-4 group-hover:text-[#3b82f6] transition-colors" />
                <span className="font-cairo font-bold">إعادة الجولة</span>
              </Button>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">

            {/* Render view dynamically based on sidebar state */}
            {currentView === 'home' && <AdminHome />}

            {currentView === 'students' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminStudents />
              </div>
            )}

            {currentView === 'teachers' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminTeachers />
              </div>
            )}

            {currentView === 'statistics' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminPerformance />
              </div>
            )}

            {currentView === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SystemSettings />
              </div>
            )}

            {currentView === 'logs' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminReports />
              </div>
            )}

            {currentView === 'access' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SmartAccessControl />
              </div>
            )}

            {currentView === 'video' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminVideoAnalysis />
              </div>
            )}

            {currentView === 'health' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminHealth />
              </div>
            )}

            {currentView === 'psychological' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AdminPsychological />
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;