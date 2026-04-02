import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard, Users, Activity, Target, Flame, Calendar, MapPin,
  Bell, Navigation, Play, Plus, Zap, HeartPulse, Search, Menu, AlertCircle, Bot, Sparkles, CheckCircle2, Apple, LineChart, MessageSquare, Video, LogOut, Star, MessageCircle, Dumbbell
} from 'lucide-react';
import { toast } from 'sonner';
import { getCoachStats } from '@/data/mockCoachData';
import CoachOverviewPanel from '@/components/coach-dashboard/CoachOverviewPanel';
import CoachClientsManager from '@/components/coach-dashboard/CoachClientsManager';
import CoachPrograms from '@/components/coach-dashboard/CoachPrograms';
import CoachSchedule from '@/components/coach-dashboard/CoachSchedule';
import CoachNutrition from '@/components/coach-dashboard/CoachNutrition';
import CoachAnalytics from '@/components/coach-dashboard/CoachAnalytics';
import CoachMessages from '@/components/coach-dashboard/CoachMessages';
import CoachVideoReview from '@/components/coach-dashboard/CoachVideoReview';
import { CoachOnboarding } from '@/components/coach-dashboard/CoachOnboarding';
import { CoachDashboardProvider, useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';
import CoachLibrary from '@/components/coach-dashboard/CoachLibrary';
import CoachGPSHub from '@/components/coach-dashboard/gps/CoachGPSHub';

const TABS = [
  { id: 'overview',    label: 'اللوحة الرئيسية',  icon: LayoutDashboard },
  { id: 'gps-hub',     label: 'التدريب الميداني', icon: MapPin },
  { id: 'clients',     label: 'المتدربين',        icon: Users },
  { id: 'video-review',label: 'تحليل الفيديو',   icon: Video },
  { id: 'programs',    label: 'البرامج',           icon: Target },
  { id: 'schedule',    label: 'الجدول',            icon: Calendar },
  { id: 'library',     label: 'مكتبة التمارين',  icon: Dumbbell },
  { id: 'nutrition',   label: 'الأنظمة الغذائية', icon: Apple },
  { id: 'analytics',   label: 'التحليلات والنمو', icon: LineChart },
  { id: 'messages',    label: 'صندوق الرسائل',  icon: MessageSquare },
  { id: 'ratings',     label: 'تقييم المتدربين',  icon: Star },
  { id: 'chat',        label: 'غرفة المدربين',  icon: MessageCircle },
];

const CoachDashboardContent = () => {
  const { activeTab, setActiveTab, notifications, markNotificationsAsRead } = useCoachDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const ATHLETE_TARGETS = [
    { id: 'ath1', name: 'رحيم بوعلام', role: 'متدرب - مالتيديسك' },
    { id: 'ath2', name: 'عبدالله سعيد', role: 'متدرب - تحمل أثقال' },
    { id: 'ath3', name: 'غسان مراد', role: 'متدرب - كروسفيت' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <CoachOverviewPanel />;
      case 'gps-hub': return <CoachGPSHub />;
      case 'clients': return <CoachClientsManager />;
      case 'video-review': return <CoachVideoReview />;
      case 'programs': return <CoachPrograms />;
      case 'schedule': return <CoachSchedule />;
      case 'library': return <CoachLibrary />;
      case 'nutrition': return <CoachNutrition />;
      case 'analytics': return <CoachAnalytics />;
      case 'messages': return <CoachMessages />;
      case 'ratings': return (
        <div className="space-y-6 p-2" dir="rtl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">⭐ تقييم المتدربين</h2>
            <p className="text-slate-500 font-medium">سجّل تقدم متدربيك وأداءهم الرياضي</p>
          </div>
          <RatingSystem
            raterRole="مدرب"
            raterName={user?.name || 'المدرب'}
            targets={ATHLETE_TARGETS}
            mode="rate"
          />
        </div>
      );
      case 'chat': return (
        <div className="space-y-4 p-2" dir="rtl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">💬 غرفة المدربين</h2>
            <p className="text-slate-500 font-medium">تبادل الخبرات مع زملائك المدربين</p>
          </div>
          <ChatSystem userRole="coach" userName={user?.name || 'المدرب'} inline defaultOpen />
        </div>
      );
      default: return <CoachOverviewPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden text-slate-900 font-sans" dir="rtl">
      
      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-slate-950 text-slate-50 border-l border-slate-900 flex flex-col z-20 shrink-0 shadow-2xl relative"
          >
            <div className="p-6 border-b border-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/20">
                  {user?.name?.charAt(0) || 'م'}
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-white">المدرب المحترف</h2>
                  <p className="text-sm font-semibold text-slate-400">Haraka Pro</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 py-6 px-4">
              <div className="space-y-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-base font-bold ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-slate-800/50 mt-auto shrink-0">
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                  toast.success('تم تسجيل الخروج بنجاح');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{TABS.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-sm font-semibold text-slate-500">متصل الآن بالنظام الموحد</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 font-bold h-12 px-6 rounded-xl hidden md:flex items-center gap-2">
              <Plus className="w-5 h-5" /> إضافة متدرب
            </Button>
            <Popover>
              <PopoverTrigger className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative border-none outline-none focus:ring-2 focus:ring-blue-500">
                   <Bell className="w-6 h-6" />
                   {notifications.filter(n => !n.isRead).length > 0 && (
                     <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                   )}
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-2xl border border-slate-200 shadow-2xl z-[100]" align="end" dir="rtl">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-slate-900 text-base">الإشعارات</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold shadow-sm">{notifications.filter(n => !n.isRead).length} جديد</Badge>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`p-3 ${notification.isRead ? 'opacity-70' : 'bg-slate-50'} rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md`}>
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${notification.type === 'calendar' ? 'bg-emerald-100 text-emerald-600' : notification.type === 'video' ? 'bg-blue-100 text-blue-600' : notification.type === 'report' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0 shadow-inner`}>
                          {notification.type === 'calendar' ? <Calendar className="w-5 h-5" /> : notification.type === 'video' ? <Video className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                          <p className={`text-xs ${notification.type === 'video' ? 'mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded-md text-slate-500' : 'text-slate-500 mt-1 leading-snug'}`}>{notification.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block font-medium">{notification.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm font-medium text-slate-500">لا توجد إشعارات جديدة</div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                  <Button onClick={markNotificationsAsRead} variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl font-bold">تعيين الكل كمقروء</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto rounded-xl">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
            {/* Header Mobile */}
            <header className="lg:hidden flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h1 className="text-xl font-bold">Haraka Coach</h1>
              <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
            </header>

            <main className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function CoachDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <CoachDashboardProvider>
      {showOnboarding ? (
        <CoachOnboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <CoachDashboardContent />
      )}
    </CoachDashboardProvider>
  );
}