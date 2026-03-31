import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Video,
  ClipboardList,
  Users,
  FileText,
  LogOut,
  Bell,
  Menu,
  GraduationCap,
  Inbox,
  Star,
  MessageCircle,
  Satellite
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';

// Import new modular components
import { TeacherOverviewPanel } from '@/components/teacher/v2/TeacherOverviewPanel';
import { TeacherVideoReview } from '@/components/teacher/v2/TeacherVideoReview';
import { TeacherExerciseManager } from '@/components/teacher/v2/TeacherExerciseManager';
import { TeacherClassManager } from '@/components/teacher/v2/TeacherClassManager';
import { TeacherReports } from '@/components/teacher/v2/TeacherReports';
import { TeacherOnboarding } from '@/components/teacher/v2/TeacherOnboarding';
import { TeacherSetupModal } from '@/components/teacher/v2/TeacherSetupModal';
import { TeacherStudentRequests } from '@/components/teacher/v2/TeacherStudentRequests';
import { TeacherGPSDashboard } from '@/components/teacher/gps/TeacherGPSDashboard';

const navigationTabs = [
  { id: 'overview', label: 'اللوحة الرئيسية', icon: LayoutDashboard },
  { id: 'video-review', label: 'مراجعة الفيديوهات', icon: Video },
  { id: 'exercises', label: 'التمارين والمناهج', icon: ClipboardList },
  { id: 'class', label: 'إدارة القسم', icon: Users },
  { id: 'gps', label: 'الميدان (GPS)', icon: Satellite },
  { id: 'requests', label: 'الطلبات الواردة', icon: Inbox },
  { id: 'reports', label: 'التقارير', icon: FileText },
  { id: 'ratings', label: 'تقييم التلاميذ', icon: Star },
  { id: 'chat', label: 'دردشة الأساتذة', icon: MessageCircle },
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const isRTL = true;

  const STUDENT_TARGETS = [
    { id: 'st1', name: 'ياسين محمود', role: 'تلميذ - السنة 4' },
    { id: 'st2', name: 'أمير طارق', role: 'تلميذ - السنة 4' },
    { id: 'st3', name: 'سارة بوزيد', role: 'تلميذة - السنة 4' },
    { id: 'st4', name: 'كريم معروف', role: 'تلميذ - السنة 4' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <TeacherOverviewPanel onNavigate={setActiveTab} />;
      case 'video-review': return <TeacherVideoReview />;
      case 'exercises': return <TeacherExerciseManager />;
      case 'class': return <TeacherClassManager />;
      case 'gps': return <TeacherGPSDashboard />;
      case 'requests': return <TeacherStudentRequests />;
      case 'reports': return <TeacherReports />;
      case 'ratings': return (
        <div className="space-y-6 p-2" dir="rtl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">⭐ تقييم التلاميذ</h2>
            <p className="text-slate-500 font-medium">قيّم أداء تلاميذ قسمك بشكل دوري ومفصّل</p>
          </div>
          <RatingSystem
            raterRole="أستاذ"
            raterName={user?.name || 'الأستاذ'}
            targets={STUDENT_TARGETS}
            mode="rate"
          />
        </div>
      );
      case 'chat': return (
        <div className="space-y-4 p-2" dir="rtl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">💬 غرفة الأساتذة</h2>
            <p className="text-slate-500 font-medium">تواصل مع زملائك الأساتذة في فضاء مهني مشترك</p>
          </div>
          <ChatSystem userRole="teacher" userName={user?.name || 'الأستاذ'} inline defaultOpen />
        </div>
      );
      default: return <TeacherOverviewPanel />;
    }
  };

  return (
    <>
      <TeacherOnboarding />
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`flex h-screen overflow-hidden bg-slate-50/30 text-slate-900 font-sans ${isRTL ? 'rtl' : 'ltr'}`}
      >
        
        {/* ══════════════════════════════════════════════════════
          BOLD PROFESSIONAL SIDEBAR (COACH DASHBOARD STYLE)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={false}
            animate={{ 
              width: isSidebarOpen ? 280 : 0, 
              opacity: isSidebarOpen ? 1 : 0 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full bg-slate-950 text-slate-50 border-l border-slate-900 flex flex-col z-20 shrink-0 overflow-hidden whitespace-nowrap shadow-2xl"
          >
            {/* Header / Logo */}
            <div className="p-6 border-b border-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg shadow-blue-900/20">
                   <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                   <h2 className="font-extrabold text-lg text-white tracking-tight">الأستاذ الخبير</h2>
                   <p className="text-sm font-semibold text-slate-400">Haraka Education</p>
                </div>
              </div>
            </div>

            {/* Navigation Menus */}
            <ScrollArea className="flex-1 py-6 px-4">
              <div className="space-y-2">
                {navigationTabs.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-base font-bold ${
                        active
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-6 h-6 flex-shrink-0 transition-colors ${active ? 'opacity-100' : 'opacity-70'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer User Menu */}
            <div className="p-6 border-t border-slate-800/50 shrink-0 mt-auto">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors text-base font-bold"
              >
                <LogOut className="w-6 h-6 opacity-70" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        
        {/* TOP NAVBAR (BOLD) */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
               <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{navigationTabs.find(t => t.id === activeTab)?.label}</h1>
               <p className="text-sm font-semibold text-slate-500">متصل الآن بالنظام الموحد</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative"
              >
                 <Bell className="w-6 h-6" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 text-right"
                  >
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <h3 className="font-bold text-slate-900">الإشعارات</h3>
                       <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">3 جديدة</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                       {/* Notification 1: Student */}
                       <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                             <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">ياسين محمود <span className="text-slate-500 font-medium text-xs">(تلميذ)</span></p>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-2">قام بتسليم فيديو "تمرين التوازن والمشي" وينتظر تقييمك.</p>
                            <p className="text-[10px] text-slate-400 mt-1">منذ 10 دقائق</p>
                          </div>
                       </div>
                       
                       {/* Notification 2: Principal */}
                       <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                             <ClipboardList className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">إدارة الأكاديمية <span className="text-slate-500 font-medium text-xs">(مدير)</span></p>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-2">يُرجى اعتماد التقرير الفصلي للقسم الابتدائي قبل نهاية الأسبوع.</p>
                            <p className="text-[10px] text-slate-400 mt-1">منذ ساعتين</p>
                          </div>
                       </div>

                       {/* Notification 3: Parent */}
                       <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                             <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">ولي أمر أمير طارق <span className="text-slate-500 font-medium text-xs">(ولي التلميذ)</span></p>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-2">استفسار بخصوص نتائج التحليل البيوميكانيكي الأخيرة لولدي.</p>
                            <p className="text-[10px] text-slate-400 mt-1">أمس</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                       <button className="text-blue-600 text-sm font-bold hover:underline">عرض كل الإشعارات</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md border-0 shrink-0">
              {user?.name ? user.name.charAt(0) : 'E'}
            </div>
          </div>
        </header>

        {/* Setup Modal will automatically show if no classes are selected */}
        <TeacherSetupModal />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto rounded-xl">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="min-h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}