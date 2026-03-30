import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Timer, Trophy, Star, ChevronLeft, Target, Award,
  Flame, Gamepad2, Brain, Activity, HeartPulse, 
  Map, Crosshair, Crown, Zap, BarChart3, Users, 
  TestTube, ShieldAlert, Sparkles, BookOpen, Clock, AlertTriangle,
  Coins, User, Home, Calendar, Camera, Wind, Sun, LogOut, Video,
  Navigation, Satellite, Menu, X, Gift
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { InteractiveTimeline } from '@/components/dashboard/InteractiveTimeline';
import { DailyMissionCard } from '@/components/dashboard/DailyMissionCard';
import { StatsCard } from '@/components/ui/stats-card';
import { CoachBookingModal } from '@/components/youth-dashboard/CoachBookingModal';
import { VideoAnalysisModal } from '@/components/youth-dashboard/VideoAnalysisModal';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

// External Modules
import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';
import { SmartMetricsWidget } from '@/components/youth-dashboard/SmartMetricsWidget';
import { HarakaChatbot } from '@/components/youth-dashboard/HarakaChatbot';

// Onboarding Modules
import YouthOnboarding from '@/components/youth-dashboard/YouthOnboarding';
import YouthQuestionnaire from '@/components/youth-dashboard/YouthQuestionnaire';
import { DigitalBrainOnboarding } from '@/components/youth-dashboard/DigitalBrainOnboarding';
import YouthInitialTest from '@/components/youth-dashboard/YouthInitialTest';
import { ProfileSettings } from '@/components/youth-dashboard/ProfileSettings';

// Integration Modules
import { ExerciseLibraryHub } from '@/components/youth-dashboard/ExerciseLibraryHub';
import { SportRecommender } from '@/components/student-dashboard/v2/SportRecommender';
import { AdaptiveTrainingEngine } from '@/components/student-dashboard/v2/AdaptiveTrainingEngine';
import { AIMotionLab } from '@/components/student-dashboard/v2/AIMotionLab';
import { PerformanceAnalyticsDashboard } from '@/components/student-dashboard/v2/PerformanceAnalyticsDashboard';
import { FTUEAssessmentEngine } from '@/components/student-dashboard/v2/FTUEAssessmentEngine';
import { AIGuidanceCenter } from '@/components/student-dashboard/v2/AIGuidanceCenter';
import { SmartCompetitions } from '@/components/student-dashboard/v2/SmartCompetitions';
import { AchievementsPage } from '@/components/student-dashboard/v2/AchievementsPage';
import { CognitiveSection } from '@/components/dashboard/CognitiveSection';
import { AcademicSection } from '@/components/dashboard/AcademicSection';
import { MentalWellBeingSection } from '@/components/dashboard/MentalWellBeingSection';
import { GPSActivityHub } from '@/components/youth-dashboard/gps/GPSActivityHub';
import { PhysicalPerformanceSection } from '@/components/youth-dashboard/development/PhysicalPerformanceSection';
import { RehabilitationSection } from '@/components/youth-dashboard/development/RehabilitationSection';
import { ARTrainingSection } from '@/components/youth-dashboard/innovation/ARTrainingSection';



export default function YouthDashboard() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { user, logout } = useAuth();
  
  // Mandatory Onboarding Flow State
  const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'complete'>('slides');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [hceInsights, setHCEInsights] = useState<any>(null);

  useEffect(() => {
    // Force onboarding every time as requested by user
    // The onboarding phase state initializes to 'slides'
  }, []);

  const completeOnboarding = () => {
    // Don't save to localStorage so it runs every time
    setOnboardingPhase('complete');
  };

  const navigationGroups = {
    gps: [
      { id: 'gps-tracker', label: 'التتبع الذكي (GPS)', icon: Satellite },
    ],
    training: [
      { id: 'training', label: 'التدريب', icon: Dumbbell },
      { id: 'sports', label: 'الرياضات', icon: Activity },
      { id: 'training-plan', label: 'الخطة', icon: Calendar },
      { id: 'ar-training', label: 'الواقع المعزز (AR)', icon: Camera },
    ],
    innovation: [
      { id: 'Haraka', label: 'مختبر الإبداع', icon: Gamepad2 },
      { id: 'ai-motion', label: 'التصحيح بالذكاء الاصطناعي', icon: Brain },
      { id: 'pilot-test', label: 'الاختبار الميداني', icon: TestTube },
      { id: 'metrics', label: 'المقاييس الحقيقية', icon: BarChart3 },
    ],
    community: [
      { id: 'competitions', label: 'المسابقات المجتمعية', icon: Trophy },
      { id: 'rewards', label: 'نظام المكافآت', icon: Gift },
    ],
    development: [
      { id: 'cognitive', label: 'التطوير الذهني', icon: Brain },
      { id: 'academic', label: 'التطوير الأكاديمي', icon: BookOpen },
      { id: 'mental', label: 'الدعم النفسي', icon: Wind },
    ]
  };

  // --- External Navigation Icons ---
  function Dumbbell(props: any) { return <Activity {...props} />; }
  function Gift(props: any) { return <Award {...props} />; }

  const renderContent = () => {
    if (activeTab === 'profile') return <ProfileSettings />;
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6 animate-in" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Top Hero Overview */}
          <div className="flex flex-col md:flex-row gap-5">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1">
                <Card className="bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white border-none shadow-2xl overflow-hidden relative h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                  <CardContent className="pt-6 pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                         <Crown className="w-8 h-8 text-yellow-300" />
                       </div>
                       <div>
                         <h2 className="text-3xl font-black tracking-tighter">مرحباً {user?.name || 'أيها البطل'} 🚀</h2>
                         <p className="text-orange-100/90 text-sm font-bold mt-1">طريقك للقمة بدأ للتو. إنجازاتك اليومية تصنع الفارق.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'المستوى', value: user?.level || 1, icon: Star },
                        { label: 'نقاط XP', value: user?.xp || 0, icon: Zap },
                        { label: 'عملات', value: user?.playCoins || 0, icon: Coins },
                        { label: 'شارات', value: user?.badges?.length || 0, icon: Award },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-3 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                          <div className="text-2xl font-black mb-1">{s.value}</div>
                          <div className="text-[10px] font-bold text-orange-50 flex items-center justify-center gap-1"><s.icon className="w-3 h-3" />{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
             </motion.div>
          </div>

          {/* ===== GPS HERO CARD ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setActiveTab('gps-tracker')}
              className="w-full text-right group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-[#060d1f] via-[#0a1628] to-[#060d1f] shadow-2xl shadow-blue-900/30 hover:border-blue-400/40 transition-all duration-500 hover:shadow-blue-500/20 hover:shadow-2xl"
            >
              {/* Animated Background Orbs */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -mr-24 -mb-24 group-hover:bg-indigo-500/15 transition-all duration-700 pointer-events-none" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg5OSwxNTgsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                {/* Icon Section */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                    <Satellite className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  {/* Live Pulse Indicator */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500" />
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2 flex-row-reverse md:flex-row">
                    <span className="text-2xl md:text-3xl font-black text-white">نظام التتبع الذكي بالـ GPS</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-wider">جديد 🚀</span>
                  </div>
                  <p className="text-slate-400 font-bold text-sm md:text-base leading-relaxed max-w-2xl mb-4">
                    تتبع جريك ومشيتك في العالم الحقيقي، اكسب تحديات جغرافية، واحجز مدربك من الخريطة مباشرة. رفيقك الرقمي الذكي في كل خطوة.
                  </p>
                  {/* Mini Stats */}
                  <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                    {[
                      { icon: Navigation, label: 'تتبع GPS حي', color: 'text-blue-400' },
                      { icon: Trophy, label: 'تحديات ميدانية', color: 'text-yellow-400' },
                      { icon: Map, label: 'خريطة تفاعلية', color: 'text-green-400' },
                      { icon: Users, label: 'حجز مدربين', color: 'text-purple-400' },
                    ].map((f, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-xs font-bold ${f.color}`}>
                        <f.icon className="w-3.5 h-3.5" /> {f.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Arrow */}
                <div className="shrink-0 hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-blue-400 group-hover:-translate-x-1 transition-transform duration-300 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Core Modules - Prominent Positioning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
             {/* AI Modules Overview */}
             <Card className="bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                     <Brain className="w-5 h-5 text-blue-400" /> تقنيات الذكاء الاصطناعي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 gap-3 h-[calc(100%-60px)] content-start">
                   {[
                     { id: 'ai-motion', title: 'التصحيح الحركي', icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                     { id: 'training-plan', title: 'الخطة التكيفية', icon: Calendar, color: 'text-green-400', bg: 'bg-green-500/10' },
                     { id: 'metrics', title: 'تحليل المقاييس', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                     { id: 'pilot-test', title: 'قياس الأداء', icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' }
                   ].map(item => (
                     <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center sm:text-right overflow-hidden h-full">
                        <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", item.bg)}><item.icon className={cn("w-5 h-5", item.color)} /></div>
                        <span className="font-bold text-white text-[11px] mt-1 sm:mt-0 leading-tight">{item.title}</span>
                     </button>
                   ))}
                </CardContent>
             </Card>

             {/* Comprehensive Dev Section */}
             <Card className="bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                     <Zap className="w-5 h-5 text-purple-400" /> قسم التطوير الشامل
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 h-[calc(100%-60px)] content-start">
                   {[
                     { id: 'physical', title: 'الأداء الحركي', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                     { id: 'cognitive', title: 'المعرفي والنفسي', icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                     { id: 'rehab', title: 'إعادة التأهيل', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10' }
                   ].map(item => (
                     <button key={item.id} onClick={() => setActiveTab(item.id)} className="group p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-white/5 transition-all flex flex-col gap-3 h-full justify-between items-start text-right">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}><item.icon className={cn("w-5 h-5", item.color)} /></div>
                        <h4 className="font-black text-white text-xs">{item.title}</h4>
                     </button>
                   ))}
                </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
             <div className="lg:col-span-8 flex flex-col gap-5">
                {/* Inbox replaces standard components layout */}
                <CoachInboxWidget />
             </div>
             <div className="lg:col-span-4 flex flex-col gap-5">
                <SmartMetricsWidget />
                <DailyMissionCard onStart={() => setActiveTab('competitions')} />
             </div>
          </div>
        </div>
      );
    }

    // --- Training & Development Integration ---
    if (activeTab === 'training') return <ExerciseLibraryHub onOpenExercise={() => {}} onOpenAICoach={() => {}} />;
    if (activeTab === 'sports') return <SportRecommender />;
    if (activeTab === 'training-plan') return <AdaptiveTrainingEngine />;
    
    // --- Innovation & Digital Lab Integration ---
    if (activeTab === 'ai-motion') return <AIMotionLab onComplete={() => setActiveTab('dashboard')} />;
    if (activeTab === 'pilot-test') return <FTUEAssessmentEngine onDone={() => setActiveTab('dashboard')} onSkip={() => setActiveTab('dashboard')} />;
    if (activeTab === 'metrics') return <PerformanceAnalyticsDashboard />;
    if (activeTab === 'Haraka') return <AIGuidanceCenter />;
    
    // AR Integration
    if (activeTab === 'ar-training') return <ARTrainingSection />;
    
    // --- Community & Rewards Integration ---
    if (activeTab === 'competitions') return <SmartCompetitions />;
    if (activeTab === 'rewards') return <AchievementsPage />;

    // --- GPS Field Tracking ---
    if (activeTab === 'gps-tracker') return <GPSActivityHub />;

    // --- Comprehensive Development Integration ---
    if (activeTab === 'physical') return <PhysicalPerformanceSection />;
    if (activeTab === 'rehab') return <RehabilitationSection />;
    if (activeTab === 'cognitive') return <CognitiveSection />;
    if (activeTab === 'academic') return <AcademicSection />;
    if (activeTab === 'mental') return <MentalWellBeingSection />;
    
    // Fallback for missing tabs
    return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
           <Activity className="w-16 h-16 mb-4 text-orange-500/50" />
           <h2 className="text-2xl font-black text-white">القسم قيد التطوير</h2>
           <p>جاري تخصيص محتوى `{activeTab}` بناءً على بياناتك المستمرة.</p>
           <Button className="mt-6 font-bold" onClick={() => setActiveTab('dashboard')}>العودة للرئيسية</Button>
       </div>
    );
  };

  // ── Modals & Flow Guard ──
  if (onboardingPhase === 'slides') return <YouthOnboarding onComplete={() => setOnboardingPhase('questionnaire')} />;
  if (onboardingPhase === 'questionnaire') return <YouthQuestionnaire onComplete={() => setOnboardingPhase('tech-intro')} />;
  if (onboardingPhase === 'tech-intro') return <DigitalBrainOnboarding onComplete={() => setOnboardingPhase('test')} />;
  if (onboardingPhase === 'test') return <YouthInitialTest onComplete={completeOnboarding} />;

  // ── Main SaaS Sidebar Architectural Layout ──
  return (
    <div className={`flex w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-arabic selection:bg-orange-500/30 ${isRTL ? 'rtl flex-row' : 'ltr flex-row-reverse'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Image Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/youth_adults_active_bg.png')] bg-cover bg-center opacity-10 filter blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/95 to-slate-900/95"></div>
      </div>

      {/* DYNAMIC SIDEBAR with Drawer Behavior for Mobile */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            initial={{ x: isRTL ? 280 : -280 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? 280 : -280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              "w-[280px] shrink-0 border-x border-white/5 bg-slate-950/60 backdrop-blur-2xl relative z-50 flex flex-col shadow-2xl h-full fixed lg:static top-0",
              isRTL ? "right-0" : "left-0"
            )}
          >
            {/* Overlay for mobile */}
            <div className="fixed inset-0 bg-black/60 z-[-1] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            
            <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-white/5 shrink-0">
              <motion.div whileHover={{ rotate: 360, scale: 1.1 }} className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-white tracking-tighter leading-none">منصة الشباب</h1>
                <span className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">Haraka System</span>
              </div>
              <button className="lg:hidden mr-auto p-2 text-white/50" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               <div className="space-y-6">
                  {/* Core Links */}
                  <div>
                     <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm", activeTab === 'dashboard' ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                        <Home className="h-4 w-4" /> لوحة القيادة
                     </button>
                  </div>

                  {/* GPS Field Tracking */}
                   <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">التتبع الميداني</div>
                      <div className="space-y-1">
                         {navigationGroups.gps.map(tab => (
                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs border", activeTab === tab.id ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30 shadow-lg" : "border-transparent text-slate-400 hover:text-white hover:bg-white/5")}>
                               <tab.icon className="h-4 w-4" /> {tab.label}
                               {activeTab !== tab.id && <span className="mr-auto text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-black">جديد</span>}
                            </button>
                         ))}
                      </div>
                   </div>

                  {/* Training Links */}
                  <div>
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">التدريب والتطوير</div>
                     <div className="space-y-1">
                        {[...navigationGroups.training, ...navigationGroups.development].map(tab => (
                           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs", activeTab === tab.id ? "bg-white/10 text-orange-400" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                              <tab.icon className="h-4 w-4" /> {tab.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Innovation */}
                  <div>
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">المختبر الرقمي</div>
                     <div className="space-y-1">
                        {[...navigationGroups.innovation, ...navigationGroups.community].map(tab => (
                           <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs", activeTab === tab.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                              <tab.icon className="h-4 w-4" /> {tab.label}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Sidebar Chatbot */}
            <div className="p-4 mt-auto border-t border-white/5 bg-slate-900/40 relative z-50 shrink-0">
               <HarakaChatbot inline={true} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full relative z-10 min-w-0">
        
        {/* Top App Bar inside main workflow */}
<header className="h-20 bg-slate-900/30 backdrop-blur-md border-b border-white/5 flex flex-col justify-center px-6 sm:px-8 shrink-0 relative z-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <button className="lg:hidden p-2 bg-white/5 rounded-lg active:scale-95 transition-all" onClick={() => setIsSidebarOpen(true)}>
                      <Menu className="w-5 h-5 text-white" />
                   </button>
                   <div className="hidden sm:block">
                      <h2 className="text-lg font-black tracking-tight text-white mb-0.5 opacity-90">غرفة العمليات المركزية</h2>
                      <p className="text-[10px] sm:text-xs text-slate-400">تتبع ذكي، تواصل مباشر مع الخبراء</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6">
                   <div className="hidden sm:block"><LanguageSwitcher /></div>
                   <div className="flex items-center gap-3 sm:gap-4 pl-4 border-l border-white/10 rtl:pr-4 rtl:pl-0 rtl:border-r rtl:border-l-0">
                      <div className="text-left rtl:text-right hidden md:block">
                         <div className="text-sm font-black text-white leading-none">{user?.name}</div>
                         <div className="text-[9px] font-black text-orange-400 uppercase mt-1 tracking-widest">مشترك ألماسي</div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-xl cursor-pointer" onClick={() => setActiveTab('profile')}>
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300" />
                      </motion.div>
                   </div>
                   <Button variant="ghost" size="icon" onClick={logout} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/10">
                        <LogOut className="h-5 w-5" />
                   </Button>
                </div>
            </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto w-full">
              {renderContent()}
           </div>
        </div>

      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        items={[
          { id: 'dashboard', label: 'الرئيسية', icon: Home },
          { id: 'gps-tracker', label: 'التتبع', icon: Satellite },
          { id: 'training', label: 'التدريب', icon: Flame },
          { id: 'competitions', label: 'المسابقات', icon: Trophy },
          { id: 'profile', label: 'حسابي', icon: User },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
        accentColor="orange"
      />

      {/* Modals outside standard flow */}
      {showBooking && <CoachBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />}
      {showVideoAnalysis && <VideoAnalysisModal isOpen={showVideoAnalysis} onClose={() => setShowVideoAnalysis(false)} />}
    </div>
  );
}
