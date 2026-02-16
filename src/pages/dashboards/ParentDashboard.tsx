import React, { useState } from 'react';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Users, BarChart3, Calendar, MessageSquare, LayoutDashboard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// V2 Components
import { ParentIdentityCard } from '@/components/parent-dashboard/v2/ParentIdentityCard';
import { FamilyActivityHub } from '@/components/parent-dashboard/v2/FamilyActivityHub';
import { ChildrenOverview } from '@/components/parent-dashboard/v2/ChildrenOverview';
import { NotificationCenter } from '@/components/parent-dashboard/v2/NotificationCenter';
import { DinnerDiscussionCard } from '@/components/parent-dashboard/v2/DinnerDiscussionCard';
import { ParentAIAssistant } from '@/components/parent-dashboard/v2/ParentAIAssistant';

// Existing Sub-Systems (Wrapped to keep functionality)
import { ChildrenList } from '@/components/parent/ChildrenList';
import { SchedulingSystem } from '@/components/parent/SchedulingSystem';
import { MessagingSystem } from '@/components/parent/MessagingSystem';
import StudentAnalysisCard from '@/components/parent/StudentAnalysisCard'; // Keeping this for reports tab

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>();
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  const navigationTabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'children', label: 'الأطفال', icon: Users },
    { id: 'schedule', label: 'الجدول', icon: Calendar },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare }
  ];

  const renderDashboardContent = () => (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* 1. Identity & Overview Section */}
      <section>
        <ParentIdentityCard
          parentName={user?.name || "ولي الأمر"}
          onViewMessages={() => setActiveTab('messages')}
        />
      </section>

      {/* 2. Family Pulse Section (Timeline & Children Quick View) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FamilyActivityHub />
        </div>
        <div className="lg:col-span-1">
          <ChildrenOverview onViewChild={(id) => { setSelectedChildId(id); setActiveTab('children'); }} />
        </div>
      </section>

      {/* 3. Engagement & Notifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DinnerDiscussionCard />
        <NotificationCenter />
      </section>

    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardContent();
      case 'children': return <ChildrenList onSelectChild={setSelectedChildId} selectedChildId={selectedChildId} />;
      case 'schedule': return <SchedulingSystem />;
      case 'reports': return (
        <div className="space-y-6">
          {/* Re-using existing analysis card but wrapped nicely */}
          <div className="text-xl font-bold text-gray-800 dark:text-white mb-4">التقارير التفصيلية</div>
          <StudentAnalysisCard />
        </div>
      );
      case 'messages': return <MessagingSystem />;
      default: return renderDashboardContent();
    }
  };

  return (
    <div className={`min-h-screen pb-20 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>

      {/* 🎯 Cinematic Sports-Themed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* The Image - High Detail Photographic */}
        <div
          className="absolute inset-0 bg-[url('/images/parent_cinematic_bg.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 scale-105"
          aria-hidden="true"
        />
        {/* Precision Dark Overlay - Moody & Professional */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/80 to-blue-950/95 mix-blend-multiply transition-colors duration-500" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

        {/* Readability Guard: Secondary Shadow Layer for Content Pop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      </div>

      {/* Top Header - Precision Styled */}
      <header className="bg-blue-950/40 dark:bg-gray-900/40 backdrop-blur-2xl sticky top-0 z-40 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="font-black text-lg hidden sm:block tracking-tight text-gray-900 dark:text-white">منصة العائلة (Parent Pulse)</h1>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-full border border-white/10">
            {navigationTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black transition-all
                        ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-md scale-105'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}
                    `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />
            <Button variant="ghost" size="icon" onClick={logout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {renderActiveTab()}
      </main>

      <div className="relative z-50">
        <ParentAIAssistant />
      </div>
    </div>
  );
}