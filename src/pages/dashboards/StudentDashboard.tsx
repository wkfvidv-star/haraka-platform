import React from 'react';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

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

// Layout & UI
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  const handleLogout = () => {
    logout();
    // No need to navigate, App.tsx will redirect to / when user is null
  };

  return (
    <div className="expert-dashboard-root selection:bg-app-accent-blue selection:text-white overflow-x-hidden relative">
      {/* Refined Expert Background: High Stability, Low Noise */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Background Image with Deep Overlay */}
        <div
          className="expert-bg-image"
          style={{ backgroundImage: 'url(/images/youth_adults_active_bg.png)' }}
        />
        <div className="expert-bg-overlay" />
      </div>

      <div className="relative z-10 pb-20">

        {/* 1. Smart Student Identity Card (Top Section) */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            {/* Identity Card Container - Full width on mobile */}
            <div className="w-full relative">
              {/* Exit Button - Positioned safely within the flow or top-left absolute BUT relative to this container */}
              <div className="absolute top-4 left-4 z-50 md:static md:float-left md:mr-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 shadow-lg hover:bg-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">تسجيل الخروج (Exit)</span>
                  <span className="sm:hidden">خروج</span>
                </Button>
              </div>

              <StudentIdentityCard
                studentName={user?.name || "الطالب المجتهد"}
                studentLevel="Advanced"
                levelProgress={78}
                streak={12}
                totalPoints={2450}
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mb-4">
          <StudentHealthProfile />
        </section>

        {/* 2. AI Guidance Center (Core Intelligence Layer) */}
        <section className="container mx-auto px-4 mb-10 -mt-8 relative z-20">
          <AIGuidanceCenter
            dailyRecommendation="أداء التوازن لديك ممتاز، لكن سرعة رد الفعل تحتاج لتركيز اليوم."
          />
        </section>

        <main className="container mx-auto px-4 space-y-12">

          {/* 3. Core Training Zones */}
          <section id="training-zones" className="scroll-mt-20">
            <CoreTrainingZones />
          </section>

          {/* 4. AI Motion Lab (Video Analysis) */}
          <section id="motion-lab" className="scroll-mt-20">
            <AIMotionLab />
          </section>

          <Separator className="my-8 bg-white/20" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 5. Virtual Coach */}
            <div className="lg:col-span-1">
              <VirtualCoach />
            </div>

            {/* 6. Smart Competitions */}
            <div className="lg:col-span-2">
              <SmartCompetitions />
            </div>
          </div>

          {/* 7. Progress & Gamification */}
          <section id="progress" className="scroll-mt-20">
            <h3 className="text-xl font-bold mb-4 text-white drop-shadow-md">رحلة التطور (My Growth)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressVisualization />
              {/* We can re-add the Gamification/Badges card here if needed, or keep it in Identity */}
            </div>
          </section>

        </main>

        {/* 8. AI Assistant (Floating) */}
        <AIAssistant />

      </div>
    </div>
  );
}