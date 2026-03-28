import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Timer, Trophy, Star, ChevronLeft, Target, Award,
  Flame, Gamepad2, Brain, Activity, HeartPulse, 
  Map, Crosshair, Crown, Zap, BarChart3, Users, 
  TestTube, ShieldAlert, Sparkles, BookOpen, Clock, AlertTriangle,
  Coins, User, Home, Calendar, Camera, Wind, Sun, LogOut, Video
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { InteractiveTimeline } from '@/components/dashboard/InteractiveTimeline';
import { DailyMissionCard } from '@/components/dashboard/DailyMissionCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CoachBookingModal } from '@/components/youth-dashboard/CoachBookingModal';
import { VideoAnalysisModal } from '@/components/youth-dashboard/VideoAnalysisModal';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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



export default function YouthDashboard() {
  const { language, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  
  // Mandatory Onboarding Flow State
  const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'complete'>('slides');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [hceInsights, setHCEInsights] = useState<any>(null);

  useEffect(() => {
    // Only bypass if fully complete 
    const isComplete = localStorage.getItem('youth_onboarding_final');
    if (isComplete === 'true') {
        setOnboardingPhase('complete');
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('youth_onboarding_final', 'true');
    setOnboardingPhase('complete');
  };

  const navigationGroups = {
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
    if (activeTab === 'profile') return <ProfileSettings onBack={() => setActiveTab('dashboard')} />;
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
                     <button key={item.id} onClick={() => setActiveTab('library')} className="group p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-white/5 transition-all flex flex-col gap-3 h-full justify-between items-start text-right">
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
    
    // AR Placeholder
    if (activeTab === 'ar-training') return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 bg-slate-900/50 rounded-3xl border border-white/5 p-8 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
           <Camera className="w-20 h-20 mb-6 text-rose-500/80 animate-pulse" />
           <h2 className="text-3xl font-black text-white mb-2">الواقع المعزز (AR) <Badge className="bg-rose-500 hover:bg-rose-500 text-white border-none align-top animate-bounce">قريباً</Badge></h2>
           <p className="max-w-md text-slate-400 leading-relaxed font-bold">هذه الميزة الثورية ستسمح لك بالتدريب في العالم الحقيقي باستخدام كاميرا جهازك، حيث سيتم عرض المدرب الرقمي داخل غرفتك بدقة متناهية.</p>
           <Button className="mt-8 font-bold bg-white/5 hover:bg-white/10 text-white rounded-xl h-12 px-8" onClick={() => setActiveTab('dashboard')}>العودة للوحة القيادة</Button>
       </div>
    );
    
    // --- Community & Rewards Integration ---
    if (activeTab === 'competitions') return <SmartCompetitions />;
    if (activeTab === 'rewards') return <AchievementsPage />;

    // --- Comprehensive Development Integration ---
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
    <div className={`flex w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-arabic selection:bg-orange-500/30 ${isRTL ? 'rtl flex-row' : 'ltr flex-row'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Image Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/youth_adults_active_bg.png')] bg-cover bg-center opacity-10 filter blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/95 to-slate-900/95"></div>
      </div>

      {/* DYNAMIC SIDEBAR */}
      <aside className="w-[280px] shrink-0 border-x border-white/5 bg-slate-950/60 backdrop-blur-2xl relative z-40 flex flex-col shadow-2xl h-full">
        <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-white/5 shrink-0">
          <motion.div whileHover={{ rotate: 360, scale: 1.1 }} className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Crown className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">منصة الشباب</h1>
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">Haraka System</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="space-y-6">
              {/* Core Links */}
              <div>
                 <button onClick={() => setActiveTab('dashboard')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm", activeTab === 'dashboard' ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                    <Home className="h-4 w-4" /> لوحة القيادة
                 </button>
              </div>

              {/* Training Links */}
              <div>
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">التدريب والتطوير</div>
                 <div className="space-y-1">
                    {[...navigationGroups.training, ...navigationGroups.development].map(tab => (
                       <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs", activeTab === tab.id ? "bg-white/10 text-orange-400" : "text-slate-400 hover:text-white hover:bg-white/5")}>
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
                       <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs", activeTab === tab.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                          <tab.icon className="h-4 w-4" /> {tab.label}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* 🚀 Haraka Chatbot explicitly bound to the sidebar footer 🚀 */}
        <div className="p-4 mt-auto border-t border-white/5 bg-slate-900/40 relative z-50 shrink-0">
           <HarakaChatbot inline={true} />
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full relative z-10 min-w-0">
        
        {/* Top App Bar inside main workflow */}
        <header className="h-20 bg-slate-900/30 backdrop-blur-md border-b border-white/5 flex flex-col justify-center px-6 sm:px-8 shrink-0 relative z-20">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-lg font-black tracking-tight text-white mb-0.5 opacity-90 hidden sm:block">غرفة العمليات المركزية</h2>
                   <p className="text-[10px] sm:text-xs text-slate-400">تتبع ذكي، تواصل مباشر مع الخبراء</p>
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

      {/* Modals outside standard flow */}
      {showBooking && <CoachBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />}
      {showVideoAnalysis && <VideoAnalysisModal isOpen={showVideoAnalysis} onClose={() => setShowVideoAnalysis(false)} />}
    </div>
  );
}
