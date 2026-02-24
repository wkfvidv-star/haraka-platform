import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { hceService, HCEInsights } from '@/services/hceService';
import { activityService, ActivityData } from '@/services/activityService';

// V2 Components
import { StudentIdentityCard } from '@/components/student-dashboard/v2/StudentIdentityCard';
import { AIGuidanceCenter } from '@/components/student-dashboard/v2/AIGuidanceCenter';
import { CoreTrainingZones } from '@/components/student-dashboard/v2/CoreTrainingZones';
import { AIMotionLab } from '@/components/student-dashboard/v2/AIMotionLab';
import { VirtualCoach } from '@/components/student-dashboard/v2/VirtualCoach';
import { SmartCompetitions } from '@/components/student-dashboard/v2/SmartCompetitions';
import { ProgressVisualization } from '@/components/student-dashboard/v2/ProgressVisualization';
import { AIAssistant } from '@/components/student-dashboard/v2/AIAssistant';
import { StudentHealthProfile } from '@/components/student-dashboard/v2/StudentHealthProfile';
import { StudentWellBeingIndicators } from '@/components/student-dashboard/v2/StudentWellBeingIndicators';
import { AGIInsightFlow } from '@/components/student-dashboard/v2/AGIInsightFlow';
import { SmartAccessModal } from '@/components/access/SmartAccessModal';
import { HealthSurveyModal } from '@/components/health/HealthSurveyModal';
import { profileService } from '@/services/profileService';

// Adapted Dashboard Components
import { DailyMissionCard } from '@/components/dashboard/DailyMissionCard';
import { AIPersonalizationBanner } from '@/components/dashboard/AIPersonalizationBanner';
import { InteractiveTimeline } from '@/components/dashboard/InteractiveTimeline';
import { CognitiveSection } from '@/components/dashboard/CognitiveSection';
import { AcademicSection } from '@/components/dashboard/AcademicSection';
import { MentalWellBeingSection } from '@/components/dashboard/MentalWellBeingSection';
import { SportsClubsWidget } from '@/components/common/SportsClubsWidget';

// Layout & UI
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LogOut, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboard() {
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [hceInsights, setHceInsights] = useState<HCEInsights | null>(null);
  const [activityHistory, setActivityHistory] = useState<ActivityData[]>([]);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        hceService.getPersonalInsights(user.id)
          .then(setHceInsights)
          .catch(err => {
            console.error("HCE Connection Error:", err);
            toast({
              title: "خطأ في الاتصال",
              description: "تعذر تحميل التوصيات الذكية حالياً.",
              variant: "destructive",
            });
          }),
        activityService.getHistory()
          .then(setActivityHistory)
          .catch(err => {
            console.error("Activity History Error:", err);
            toast({
              title: "خطأ في قاعدة البيانات",
              description: "تعذر تحميل سجل النشاط.",
              variant: "destructive",
            });
          }),
        profileService.getProfile(user.id)
          .then(profile => {
            setFullProfile(profile);
            if (!profile.height || !profile.weight) {
              setIsSurveyModalOpen(true);
            }
          })
          .catch(err => {
            console.error("Profile Fetch Error:", err);
            toast({
              title: "خطأ في الملف الشخصي",
              description: "تعذر تحميل بيانات المستخدم المتكاملة.",
              variant: "destructive",
            });
          })
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="expert-dashboard-root selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      {/* 1. Expert Background Layering */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="expert-bg-image"
          style={{ backgroundImage: 'url(/images/youth_adults_active_bg.png)' }}
        />
        <div className="expert-bg-overlay" />

        {/* Animated Accent Pulsar */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse-soft" />
      </div>

      <div className="relative z-10 pb-20">

        {/* 2. Global Intelligence Monitoring Bar (High Visibility Status) */}
        <div className="w-full bg-blue-600/10 border-b border-white/5 backdrop-blur-md py-1.5 px-4 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 opacity-30" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[2px] font-mono">Core Engine: Sync</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-blue-400/80 uppercase tracking-[1px] font-mono">Cognitive Sync: Aggregated</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest relative z-10 hidden sm:block">
            Haraka AGI Infrastructure v1.05 // Production Mode
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-white/40 uppercase">Supabase Realtime: Active</span>
          </div>
        </div>

        {/* 3. Expert Dashboard Header */}
        <header className="expert-header px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-900/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">مركز المعلومات الذكي</h1>
              <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Digital Intelligence & Motion Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all rounded-xl gap-2 h-10 px-4"
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج (Exit)
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-10">

          {/* Section 1: Identity & Core Status */}
          <section className="space-y-6">
            <StudentIdentityCard
              studentName={user?.name || "تلميذ حركا"}
              studentLevel={user?.level && user.level > 15 ? "Advanced" : user?.level && user.level > 5 ? "Intermediate" : "Beginner"}
              levelProgress={user?.xp ? (user.xp % 1000) / 10 : 0}
              streak={activityHistory.length > 0 ? activityHistory.length : 0}
              totalPoints={user?.xp || 0}
              digitalId={user?.digitalId}
              qrToken={user?.qrToken}
              loading={loading}
              onOpenAccess={() => setIsAccessModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentHealthProfile metrics={activityHistory[0]} />
              <div className="space-y-6">
                <AIPersonalizationBanner isSimplified={true} />
                <DailyMissionCard />
              </div>
            </div>
          </section>

          {/* Section 2: Smart Motion Lab (High Impact) */}
          <section id="motion-lab" className="space-y-8 relative">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-blue-500 rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">مختبر الحركة الذكي (Smart Motion Lab)</h3>
            </div>
            <AIMotionLab />
          </section>

          {/* Section 3: Intelligence & Training Science */}
          <section id="intelligence-training" className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                {/* Digital Brain moves into the primary column */}
                <div className="space-y-6 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-6 w-1.5 bg-orange-500 rounded-full" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">العقل الرقمي (Digital Brain Core)</h3>
                  </div>
                  <div className="absolute -left-4 top-10 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent rounded-full opacity-50" />
                  <AIGuidanceCenter
                    dailyRecommendation={
                      hceInsights?.physical?.observation && hceInsights?.physical?.recommendation
                        ? `${hceInsights.physical.observation} ${hceInsights.physical.recommendation}`
                        : "جاري تحليل الاستقرار البدني والذهني بواسطة النبض الرقمي..."
                    }
                  />
                  <AGIInsightFlow insights={hceInsights} />
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 bg-green-500 rounded-full" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">مناطق التدريب الأساسية</h3>
                  </div>
                  <CoreTrainingZones />
                </div>
              </div>

              <div className="space-y-8">
                <InteractiveTimeline />
                <StudentWellBeingIndicators />
              </div>
            </div>
          </section>

          <Separator className="bg-white/5" />

          {/* Section 4: Skills & Competitions */}
          <section id="growth" className="space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CognitiveSection isSimplified={true} />
              <AcademicSection isSimplified={true} />
              <MentalWellBeingSection isSimplified={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-1">
                <VirtualCoach />
              </div>
              <div className="lg:col-span-2">
                <SmartCompetitions />
                {/* 6. Dynamic Progress Visualization */}
                <div className="mt-8"> {/* Added mt-8 for spacing, adjust as needed */}
                  <ProgressVisualization history={activityHistory} />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <SportsClubsWidget />
            </div>
          </section>

        </main>

        {/* Floating AI Assistant Integration */}
        <AIAssistant />

        <SmartAccessModal
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
        />

        <HealthSurveyModal
          isOpen={isSurveyModalOpen}
          onClose={() => setIsSurveyModalOpen(false)}
          onComplete={() => {
            setIsSurveyModalOpen(false);
            if (user?.id) {
              profileService.getProfile(user.id).then(setFullProfile);
            }
          }}
        />

      </div>
    </div>
  );
}