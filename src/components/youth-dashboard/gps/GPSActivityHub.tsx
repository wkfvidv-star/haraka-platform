import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTracker } from './LiveTracker';
import { GPSChallenges } from './GPSChallenges';
import { RouteAndTrainerMap } from './RouteAndTrainerMap';
import { ActivityHeatmap } from './ActivityHeatmap';
import { PerformanceReport } from './PerformanceReport';
import { Map, Trophy, Network, LineChart, Cpu, Navigation, MapPin, Zap, Activity, BarChart3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { SessionSummary } from './LiveTracker';

type TabId = 'tracker' | 'challenges' | 'map' | 'history';

const TABS = [
  { id: 'tracker' as const, label: 'التتبع الحي', icon: Navigation, color: 'text-orange-400', activeBg: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' },
  { id: 'challenges' as const, label: 'تحديات GPS', icon: Trophy, color: 'text-yellow-400', activeBg: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' },
  { id: 'map' as const, label: 'الخريطة', icon: Network, color: 'text-blue-400', activeBg: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' },
  { id: 'history' as const, label: 'الأداء والسجل', icon: BarChart3, color: 'text-green-400', activeBg: 'bg-green-500 text-white shadow-lg shadow-green-500/30' },
] as const;

const QUICK_STATS = [
  { label: 'إجمالي هذا الأسبوع', value: '16.8 كم', icon: Navigation, color: 'text-orange-400' },
  { label: 'الجلسات', value: '5', icon: Activity, color: 'text-blue-400' },
  { label: 'نقاط GPS', value: '3,100', icon: Zap, color: 'text-yellow-400' },
  { label: 'أفضل سرعة', value: '12 كم/س', icon: MapPin, color: 'text-green-400' },
];

export const GPSActivityHub = () => {
  const [activeTab, setActiveTab] = useState<TabId>('tracker');
  const [lastSession, setLastSession] = useState<SessionSummary | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleSessionEnd = (summary: SessionSummary) => {
    setLastSession(summary);
    setShowReport(true);
  };

  const handleNewSession = () => {
    setShowReport(false);
    setLastSession(null);
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6" dir="rtl">

      {/* ═══ HERO HEADER ═══ */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-black" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Animated GPS pulse rings */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-none">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute border border-orange-500/20 rounded-full"
              style={{ width: 60 + i * 40, height: 60 + i * 40, top: -(30 + i * 20), left: -(30 + i * 20) }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }} />
          ))}
          <div className="w-8 h-8 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        <div className="relative z-10 p-6 md:p-8 pr-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 text-xs font-bold">
                  <Cpu className="w-3 h-3 ml-1" /> مدرب رقمي بالـ GPS
                </Badge>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs font-bold">متصل</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                نظام التتبع الميداني الذكي 🌍
              </h2>
              <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-lg">
                تتبع حركتك الفعلية، تحقق من الإنجازات، وحلل أداءك بدقة — كل ذلك بالـ GPS في الوقت الفعلي.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {QUICK_STATS.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-right">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                    <p className="text-[10px] text-slate-500 font-bold">{s.label}</p>
                  </div>
                  <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ NAVIGATION TABS ═══ */}
      <div className="flex flex-wrap gap-2 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowReport(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? `${tab.activeBg} scale-[1.03]`
                : `text-slate-400 hover:text-white hover:bg-white/5 border border-transparent`
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB CONTENT ═══ */}
      <AnimatePresence mode="wait">
        <motion.div key={showReport ? 'report' : activeTab}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>

          {/* Post-session report */}
          {showReport && lastSession && (
            <PerformanceReport summary={lastSession} onNewSession={handleNewSession} />
          )}

          {!showReport && (
            <>
              {activeTab === 'tracker' && <LiveTracker onSessionEnd={handleSessionEnd} />}
              {activeTab === 'challenges' && <GPSChallenges />}
              {activeTab === 'map' && <RouteAndTrainerMap />}
              {activeTab === 'history' && <ActivityHeatmap />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
