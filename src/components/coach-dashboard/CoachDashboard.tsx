import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard, Users, Activity, Target, Flame, Calendar,
  Bell, Navigation, Play, Plus, Zap, HeartPulse, Search, Menu, AlertCircle, Bot, Sparkles, CheckCircle2, Apple, LineChart, MessageSquare, Video, LogOut, Star, MessageCircle, X, Dumbbell
} from 'lucide-react';
import { toast } from 'sonner';
import CoachOverviewPanel from '@/components/coach-dashboard/CoachOverviewPanel';
import CoachClientsManager from '@/components/coach-dashboard/CoachClientsManager';
import CoachPrograms from '@/components/coach-dashboard/CoachPrograms';
import CoachSchedule from '@/components/coach-dashboard/CoachSchedule';
import CoachNutrition from '@/components/coach-dashboard/CoachNutrition';
import CoachAnalytics from '@/components/coach-dashboard/CoachAnalytics';
import CoachMessages from '@/components/coach-dashboard/CoachMessages';
import CoachVideoReview from '@/components/coach-dashboard/CoachVideoReview';
import { CoachOnboarding } from '@/components/coach-dashboard/CoachOnboarding';
import { CoachDashboardContext, useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';
import CoachLibrary from '@/components/coach-dashboard/CoachLibrary';

const TABS = [
  { id: 'overview',    label: 'اللوحة الرئيسية',  icon: LayoutDashboard },
  { id: 'clients',     label: 'المتدربين',        icon: Users },
  { id: 'video-review',label: 'تحليل الفيديو',   icon: Video },
  { id: 'programs',    label: 'البرامج (PDF)',           icon: Target },
  { id: 'nutrition',   label: 'التغذية (PDF)', icon: Apple },
  { id: 'schedule',    label: 'الجدول',            icon: Calendar },
  { id: 'library',     label: 'مكتبة التمارين',  icon: Dumbbell },
  { id: 'analytics',   label: 'التحليلات والنمو', icon: LineChart },
  { id: 'ratings',     label: 'تقييم المتدربين',  icon: Star },
  { id: 'messages',    label: 'صندوق الرسائل',  icon: MessageSquare },
  { id: 'chat',        label: 'غرفة المدربين',  icon: MessageCircle },
];

const CoachDashboardContent = () => {
  const { activeTab, setActiveTab } = useCoachDashboard();
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
      case 'clients': return <CoachClientsManager />;
      case 'video-review': return <CoachVideoReview />;
      case 'programs': return <CoachPrograms />;
      case 'schedule': return <CoachSchedule />;
      case 'library': return <CoachLibrary />;
      case 'nutrition': return <CoachNutrition />;
      case 'analytics': return <CoachAnalytics />;
      case 'messages': return <CoachMessages />;
      case 'ratings': return (
        <div className="space-y-6 md:space-y-8" dir="rtl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                    <Star className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 نظام تقييم المتدربين
              </h2>
              <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">متابعة دقيقة وتسجيل لمستويات الالتزام والتطور لجميع المتدربين لتوفير تقارير عالمية المستوى.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>
             
             <RatingSystem
               raterRole="المدرب الرئيسي"
               raterName={user?.name || 'المدرب'}
               targets={ATHLETE_TARGETS}
               mode="rate"
             />
          </div>
        </div>
      );
      case 'chat': return (
        <div className="space-y-6 md:space-y-8" dir="rtl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                    <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
                 </div>
                 غرفة المدربين (Community)
              </h2>
              <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">تبادل الخبرات والاستشارات الحية مع شبكة من نجوم ومحترفي التدريب على المنصة.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 overflow-hidden">
             <ChatSystem userRole="coach" userName={user?.name || 'المدرب'} inline defaultOpen />
          </div>
        </div>
      );
      default: return <CoachOverviewPanel />;
    }
  };

  return (
    <div className="flex h-[100dvh] bg-[#f8fafc] overflow-hidden text-slate-900 font-sans relative" dir="rtl">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: 280 }}
            animate={{ width: 300, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 280 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className={`
              fixed lg:static inset-y-0 right-0 z-40 h-full 
              bg-[#0f172a] text-slate-50 border-l border-slate-800 
              flex flex-col shrink-0 shadow-2xl lg:shadow-none
            `}
          >
            <div className="p-6 md:p-8 border-b border-slate-800/50 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-[1rem] flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400">
                  {user?.name?.charAt(0) || 'م'}
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-white leading-tight">الكاتبن / {user?.name?.split(' ')[0] || 'المحترف'}</h2>
                  <p className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-widest bg-blue-500/10 inline-block px-2 py-0.5 rounded-md">PRO COACH</p>
                </div>
              </div>
              
              {/* Mobile Close Sidebar */}
              <button 
                className="lg:hidden text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-xl"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-4 py-6 custom-scrollbar">
              <div className="space-y-1.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-base font-bold relative group overflow-hidden
                        ${isActive 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-blue-600 z-0 rounded-2xl" />
                      )}
                      <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'opacity-100 scale-110' : 'opacity-70 group-hover:scale-110'}`} />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="p-4 md:p-6 border-t border-slate-800/50 mt-auto shrink-0 bg-slate-900/50">
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                  toast.success('تم تسجيل الخروج بنجاح');
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-base font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج السريع
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm border border-slate-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {TABS.find(t => t.id === activeTab)?.label}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Sync</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button className="font-bold h-11 px-5 rounded-xl hidden lg:flex items-center gap-2 shadow-md bg-slate-900 hover:bg-slate-800 text-white transition-transform hover:-translate-y-0.5">
              <Plus className="w-5 h-5" /> إضافة متدرب جديد
            </Button>
            
            <Popover>
              <PopoverTrigger className="p-3 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors relative border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
                   <Bell className="w-5 h-5 md:w-6 md:h-6" />
                   <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-bounce" />
              </PopoverTrigger>
              <PopoverContent className="w-[320px] md:w-[380px] p-0 rounded-3xl border border-slate-200 shadow-2xl z-[100] mt-2 mr-4" align="end" dir="rtl">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
                  <h3 className="font-black text-slate-900 text-lg">الإشعارات الواردة</h3>
                  <Badge className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-3 py-1 text-sm shadow-md">2 جديد</Badge>
                </div>
                <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  <div className="p-4 hover:bg-blue-50/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-blue-100">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-black text-slate-900">رحيم قد رفع فيديو جديد</p>
                        <p className="text-xs font-bold text-slate-600 bg-slate-100 inline-block px-2.5 py-1 rounded-lg mt-2">تمرين الرفعة الميتة (Deadlift)</p>
                        <span className="text-[10px] text-slate-400 mt-2 block font-bold">منذ 10 دقائق</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-emerald-50/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-emerald-100">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-black text-slate-900">طلب موعد جديد</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">عبدالله طلب موعداً لجلسة تقييم بدني للمرحلة الخاصة به غداً مسائاً.</p>
                        <span className="text-[10px] text-slate-400 mt-2 block font-bold">منذ ساعتين</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
                  <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl font-bold h-12">تعيين جميع الإشعارات كمقروءة</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto rounded-tl-[2rem] bg-white relative shadow-inner">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 pb-20">
            {/* Header Mobile Only */}
            <header className="sm:hidden flex items-center justify-between mb-6 bg-slate-900 p-5 rounded-2xl shadow-lg border border-slate-800 text-white">
              <div>
                 <h1 className="text-xl font-black">{TABS.find(t => t.id === activeTab)?.label}</h1>
                 <p className="text-xs text-blue-400 font-bold mt-1">Haraka Pro System</p>
              </div>
            </header>

            <main className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <CoachDashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {showOnboarding ? (
        <CoachOnboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <CoachDashboardContent />
      )}
    </CoachDashboardContext.Provider>
  );
}
