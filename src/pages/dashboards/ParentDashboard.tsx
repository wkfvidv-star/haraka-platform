import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Users, BarChart3, Calendar, MessageSquare, LayoutDashboard, PlayCircle, Star, MessageCircle, Menu, X, ChevronLeft, ChevronRight, Activity, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { ChatSystem } from '@/components/shared/ChatSystem';

// V2 Components
import { ParentIdentityCard } from '@/components/parent-dashboard/v2/ParentIdentityCard';
import { FamilyActivityHub } from '@/components/parent-dashboard/v2/FamilyActivityHub';
import { ChildrenOverview, ChildSummary } from '@/components/parent-dashboard/v2/ChildrenOverview';
import { NotificationCenter } from '@/components/parent-dashboard/v2/NotificationCenter';
import { DinnerDiscussionCard } from '@/components/parent-dashboard/v2/DinnerDiscussionCard';
import { ParentAIAssistant } from '@/components/parent-dashboard/v2/ParentAIAssistant';
import { ParentCoachPanel } from '@/components/parent-dashboard/ParentCoachPanel';
import { ParentOnboarding } from '@/components/parent-dashboard/ParentOnboarding';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { EmptyDashboardState } from '@/components/parent-dashboard/v2/EmptyDashboardState';
import { AddChildForm } from '@/components/parent-dashboard/v2/AddChildForm';
import { ChildContextView } from '@/components/parent-dashboard/v2/ChildContextView';

// Existing Sub-Systems (Wrapped to keep functionality)
import { ChildrenList } from '@/components/parent/ChildrenList';
import { SchedulingSystem } from '@/components/parent/SchedulingSystem';
import { MessagingSystem } from '@/components/parent/MessagingSystem';
import StudentAnalysisCard from '@/components/parent/StudentAnalysisCard'; // Keeping this for reports tab
import { parentDataService, Child } from '@/services/parentDataService';

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Onboarding Status
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  useEffect(() => {
    setShowOnboarding(true);
    setIsNewUser(true);
  }, []);

  const fetchFamily = () => {
    setLoadingChildren(true);
    try {
      const data = parentDataService.getChildren();
      setChildren(data);
      if (data.length > 0 && !selectedChildId) {
        setSelectedChildId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch family data", error);
    } finally {
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, [user]);

  const selectedChild = children.find(c => c.id === selectedChildId);

  const navigationTabs = [
    { id: 'dashboard', label: 'ملف الطفل', icon: LayoutDashboard },
    { id: 'family_overview', label: 'نظرة العائلة', icon: Users },
    { id: 'messages', label: 'صندوق الوارد', icon: MessageSquare },
    { id: 'chat', label: 'مجتمع الأولياء', icon: MessageCircle },
    { id: 'schedule', label: 'الجدول العام', icon: Calendar },
  ];

  const renderDashboardContent = () => {
    if (children.length === 0) {
      return <EmptyDashboardState onAddChild={() => setIsAddChildOpen(true)} />;
    }

    return (
      <div className="space-y-10 pb-10">
        {/* Child Selector (Top Tabs) */}
        <section className="flex items-center gap-4 p-2 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[28px] overflow-x-auto no-scrollbar scroll-smooth shadow-inner">
           {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-[22px] transition-all duration-500 whitespace-nowrap
                  ${selectedChildId === child.id 
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black
                    ${selectedChildId === child.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                   {child.name.charAt(0)}
                </div>
                <span className="font-bold tracking-tight">{child.name}</span>
              </button>
           ))}
           <button 
             onClick={() => setIsAddChildOpen(true)}
             className="px-6 py-4 rounded-[22px] border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
           >
              <Plus className="w-5 h-5" />
              أضف طفلاً
           </button>
        </section>

        {selectedChildId && children.find(c => c.id === selectedChildId) ? (
          <ChildContextView 
            child={children.find(c => c.id === selectedChildId)!} 
            parentName={user?.name || 'ولي الأمر'}
          />
        ) : (
          <div className="text-center py-20 text-slate-500">اختر طفلاً لعرض البيانات</div>
        )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardContent();
      case 'family_overview': return (
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white">نظرة عامة على العائلة</h2>
                 <p className="text-slate-400 mt-1">ملخص مجمع لجميع أبنائك المسجلين في المنصة</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                  <FamilyActivityHub />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <DinnerDiscussionCard />
                     <NotificationCenter />
                  </div>
              </div>
              <div className="lg:col-span-1">
                  <ChildrenOverview
                    children={children as any}
                    onViewChild={(id) => { setSelectedChildId(id); setActiveTab('dashboard'); }}
                  />
              </div>
           </div>
        </div>
      );
      case 'schedule': return <SchedulingSystem />;
      case 'messages': return <MessagingSystem />;
      case 'chat': return (
        <div className="space-y-6" dir="rtl">
          <div className="flex items-center gap-3 mb-8 ltr:flex-row-reverse ltr:text-right">
             <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                <MessageCircle className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white">مجتمع الأولياء</h2>
                <p className="text-slate-400 mt-1">تواصل مع أولياء أمور التلاميذ الآخرين</p>
             </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
             <ChatSystem userRole="parent" userName={user?.name || 'ولي الأمر'} inline defaultOpen />
          </div>
        </div>
      );
      default: return renderDashboardContent();
    }
  };

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleReplayOnboarding = () => {
    setIsNewUser(false);
    setShowOnboarding(true);
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-950 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 🎯 Cinematic Sports-Themed Background Layer for entire app */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[url('/images/parent_cinematic_bg.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 opacity-60 mix-blend-luminosity scale-105"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-slate-950/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" aria-hidden="true" />
      </div>

      <MobileBottomNav
        items={navigationTabs.slice(0, 5).map(t => ({
          ...t,
          disabled: children.length === 0 && t.id !== 'dashboard'
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor="blue"
      />

      {isAddChildOpen && (
        <AddChildForm 
          onClose={() => setIsAddChildOpen(false)}
          onSuccess={(child) => {
            setIsAddChildOpen(false);
            fetchFamily();
            setSelectedChildId(child.id);
            setActiveTab('dashboard');
          }}
        />
      )}

      {showOnboarding && (
        <ParentOnboarding
          onComplete={handleCompleteOnboarding}
          onSkip={handleCompleteOnboarding}
          isNewUser={isNewUser}
        />
      )}

      {/* --- Desktop Sidebar --- */}
      <aside 
        className={`${isSidebarOpen ? 'w-[280px]' : 'w-[90px]'} hidden lg:flex flex-col relative z-20 
                    bg-slate-900/40 backdrop-blur-3xl border-inline-end border-white/10 shadow-2xl transition-all duration-500 ease-out`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 min-h-[88px]">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2.5 rounded-2xl shadow-xl shadow-blue-500/30 shrink-0 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <Activity className="w-6 h-6 relative z-10" />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-500 delay-100">
                <h1 className="font-black text-xl tracking-tight text-white mb-0.5">Parent Pulse</h1>
                <p className="text-[10px] text-blue-300/80 font-bold tracking-[0.2em] uppercase">منصة العائلة</p>
              </div>
            )}
          </div>
          <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl"
          >
             {isSidebarOpen ? <><ChevronRight className="w-5 h-5 rtl:hidden"/><ChevronLeft className="w-5 h-5 hidden rtl:block"/></> : 
                              <><ChevronLeft className="w-5 h-5 rtl:hidden"/><ChevronRight className="w-5 h-5 hidden rtl:block"/></>}
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar scroll-smooth" data-tour="parent_navigation">
          {navigationTabs.map(tab => {
            const isActive = activeTab === tab.id;
            const isDisabled = children.length === 0 && tab.id !== 'dashboard';
            
            return (
              <button
                key={tab.id}
                disabled={isDisabled}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'text-white bg-white/10 shadow-lg' 
                    : isDisabled 
                      ? 'text-slate-600 opacity-40 cursor-not-allowed'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
                title={!isSidebarOpen ? tab.label : undefined}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-500/0 opacity-100" />
                )}
                {isActive && (
                  <div className="absolute right-0 rtl:right-0 ltr:left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-l-full rtl:rounded-l-full ltr:rounded-r-full" />
                )}
                <tab.icon className={`w-5 h-5 shrink-0 transition-all duration-500 ${isActive ? 'scale-110 text-blue-400 drop-shadow-md' : 'group-hover:scale-110'} ${!isSidebarOpen && 'mx-auto'}`} />
                
                {isSidebarOpen && (
                   <span className="whitespace-nowrap tracking-wide">{tab.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-slate-900/20">
          <Button
            variant="ghost"
            onClick={handleReplayOnboarding}
            className={`flex items-center gap-3 justify-start rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors w-full ${!isSidebarOpen ? 'px-0 justify-center' : 'px-4'}`}
            title={!isSidebarOpen ? "تعريف المنصة" : undefined}
          >
            <PlayCircle className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-semibold">تصفح الميزات</span>}
          </Button>

          <Button 
            variant="ghost" 
            onClick={logout} 
            className={`flex items-center gap-3 justify-start rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full ${!isSidebarOpen ? 'px-0 justify-center' : 'px-4'}`}
            title={!isSidebarOpen ? "تسجيل الخروج" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-semibold">تسجيل الخروج</span>}
          </Button>
        </div>
      </aside>

      {/* --- Mobile View Header & Menu --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Activity className="w-5 h-5" />
             </div>
             <div>
                <h1 className="font-black text-lg text-white leading-tight">Parent Pulse</h1>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-[280px] bg-slate-900 border-white/10 h-full relative flex flex-col shadow-2xl ${isRTL ? 'border-l mr-auto' : 'border-r ml-auto'}`}
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <h2 className="font-black text-white text-xl">القائمة</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2 bg-white/5 rounded-full">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navigationTabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all
                        ${isActive ? 'text-white bg-white/10 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      <tab.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-slate-900/20">
                <Button
                  variant="ghost"
                  onClick={() => { handleReplayOnboarding(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 justify-start rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors w-full px-4"
                >
                  <PlayCircle className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">تصفح الميزات</span>
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={logout} 
                  className="flex items-center gap-3 justify-start rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full px-4"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">تسجيل الخروج</span>
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* --- Main Content Area --- */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 lg:pt-0 pt-20 custom-scrollbar scroll-smooth">
        <div className="container mx-auto p-4 md:p-8 lg:p-10 max-w-7xl min-h-full">
          {/* Top Bar inside content (Language, User Profile placeholder) */}
          <div className="hidden lg:flex justify-end items-center mb-10 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center gap-3">
                 <div className="px-4 py-1.5 rounded-xl bg-white/5 text-white font-medium text-sm">
                    {user?.name || "ولي الأمر"}
                 </div>
                 <div className="w-[1px] h-6 bg-white/10" />
                 <LanguageSwitcher />
              </div>
          </div>

          <div className="animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-both pb-20">
             {renderActiveTab()}
          </div>
        </div>
      </main>

      {/* AI Assistant FAB - Keep persistent */}
      <div className="relative z-50">
        <ParentAIAssistant />
      </div>

    </div>
  );
}