import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Trophy, Star, Flame, TrendingUp, Calendar, Lock,
  CheckCircle2, Award, Zap, Shield, Activity, Target, Medal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GamificationBadges } from './GamificationBadges';

// ─── Types ───────────────────────────────────────
interface ActivityEntry {
  date: string;
  dateLabel: string;
  type: string;
  title: string;
  duration: number;
  xp: number;
  icon: React.ElementType;
  color: string;
}

interface WeeklyDataPoint {
  label: string;
  score: number;
  sessions: number;
}

interface LevelInfo {
  current: number;
  title: string;
  xp: number;
  nextLevelXp: number;
  color: string;
  icon: React.ElementType;
}

// ─── Data ────────────────────────────────────────
const activityLog: ActivityEntry[] = [
  { date: '2026-03-14', dateLabel: 'اليوم', type: 'speed', title: 'جلسة السرعة والرشاقة', duration: 53, xp: 200, icon: Zap, color: 'text-yellow-400 bg-yellow-500/10' },
  { date: '2026-03-13', dateLabel: 'أمس', type: 'balance', title: 'تمارين التوازن والتوافق', duration: 33, xp: 130, icon: Shield, color: 'text-cyan-400 bg-cyan-500/10' },
  { date: '2026-03-12', dateLabel: 'الثلاثاء', type: 'agility', title: 'الرشاقة المتقدمة — T-Test', duration: 47, xp: 180, icon: Activity, color: 'text-blue-400 bg-blue-500/10' },
  { date: '2026-03-10', dateLabel: 'الأحد', type: 'cognitive', title: 'تمارين الإدراك الحركي', duration: 28, xp: 110, icon: Target, color: 'text-purple-400 bg-purple-500/10' },
  { date: '2026-03-09', dateLabel: 'السبت', type: 'speed', title: 'السرعة والقوة الانفجارية', duration: 45, xp: 175, icon: Zap, color: 'text-yellow-400 bg-yellow-500/10' },
  { date: '2026-03-07', dateLabel: 'الخميس', type: 'balance', title: 'التوازن الديناميكي', duration: 30, xp: 120, icon: Shield, color: 'text-cyan-400 bg-cyan-500/10' },
];

const weeklyData: WeeklyDataPoint[] = [
  { label: 'الأسبوع 1', score: 68, sessions: 3 },
  { label: 'الأسبوع 2', score: 72, sessions: 4 },
  { label: 'الأسبوع 3', score: 75, sessions: 4 },
  { label: 'الأسبوع 4 (الحالي)', score: 82, sessions: 5 },
];

// We will use actual auth context inside the component now for real student stats
// Mock achievements are kept for UI showcasing
const STUDENT_ACHIEVEMENTS: any[] = [];

// ─── Subcomponents ───────────────────────────────
function MiniBarChart({ data }: { data: WeeklyDataPoint[] }) {
  const max = Math.max(...data.map(d => d.score));
  return (
    <div className="flex items-end justify-between gap-2 h-28">
      {data.map((point, i) => {
        const isLast = i === data.length - 1;
        const heightPct = (point.score / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <p className={cn('text-xs font-black', isLast ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400')}>{point.score}</p>
            <div className="w-full rounded-t-xl overflow-hidden flex items-end" style={{ height: '72px', background: 'rgba(0,0,0,0.04)' }}>
              <motion.div
                className={cn('w-full rounded-t-xl', isLast ? 'bg-gradient-to-t from-blue-600 to-indigo-500' : 'bg-slate-200 dark:bg-white/10')}
                initial={{ height: '0%' }}
                animate={{ height: `${heightPct}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-tight">{point.label.replace(' (الحالي)', '')}</p>
          </div>
        );
      })}
    </div>
  );
}

// StatCard component (assuming it's defined elsewhere or needs to be added)
function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 shadow-sm">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", bg)}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-lg font-black text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────
export function AchievementsPage() {
  const { user } = useAuth();
  const xp = user?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const progressPct = ((xp - ((level - 1) * 500)) / 500) * 100;
  const streakDays = 1;
  const completedWorkouts = 3;
  const totalBadges = user?.badges?.length || 1;

  const [activeTab, setActiveTab] = useState<'log' | 'chart' | 'badges' | 'leaderboard'>('log');
  const [activeFilter, setActiveFilter] = useState('all');
  const totalSessions = activityLog.length;
  const totalXP = activityLog.reduce((a, e) => a + e.xp, 0);
  const totalMinutes = activityLog.reduce((a, e) => a + e.duration, 0);

  return (
    <div className="space-y-6">

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-6 lg:p-8"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 60%, #1a1040 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">مستواك الحالي</p>
              <h2 className="text-2xl font-black text-white">المستوى {level}</h2>
              <p className="text-slate-400 text-sm font-medium">مستكشف الحركة</p>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">{xp} نقطة XP</span>
              <span className="text-xs text-slate-400 font-medium">{nextLevelXp} لمستوى {level + 1}</span>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 right-0 h-full rounded-full bg-gradient-to-l from-yellow-400 to-orange-500"
                initial={{ width: '0%' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">{Math.round(progressPct)}% من الوصول للمستوى التالي</p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-xl font-black text-white">{totalSessions}</p>
              <p className="text-[11px] text-slate-400">جلسة</p>
            </div>
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-xl font-black text-yellow-400">{totalXP}</p>
              <p className="text-[11px] text-slate-400">XP</p>
            </div>
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-xl font-black text-white">{totalMinutes}</p>
              <p className="text-[11px] text-slate-400">دقيقة</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap lg:flex-nowrap gap-2 bg-[#151928] border border-white/5 rounded-2xl p-1.5 shadow-lg relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
        {[
          { id: 'log' as const, label: 'سجل النشاطات', icon: Calendar },
          { id: 'chart' as const, label: 'تطور الأداء', icon: TrendingUp },
          { id: 'badges' as const, label: 'الشارات والإنجازات', icon: Award },
          { id: 'leaderboard' as const, label: 'لوحة الصدارة', icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all duration-300 relative z-10 min-w-[140px]',
              activeTab === tab.id
                ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? 'text-white' : 'text-slate-500')} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Activity Log */}
      {activeTab === 'log' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-[#151928]/90 backdrop-blur-xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="p-6 border-b border-white/5 relative z-10 flex justify-between items-center">
            <div>
                <h3 className="font-black text-white text-lg tracking-wide">سجل النشاطات الأخيرة</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">{activityLog.length} جلسة مسجلة</p>
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-slate-300">هذا الشهر</div>
          </div>
          <div className="divide-y divide-white/5 relative z-10">
            {activityLog.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-5 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer"
              >
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300', entry.color)}>
                  <entry.icon className="w-5 h-5 drop-shadow-md" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-base group-hover:text-blue-400 transition-colors">{entry.title}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1.5 flex items-center gap-2">
                    <span className="bg-white/5 px-2 py-0.5 rounded-sm">{entry.dateLabel}</span>
                    <span className="text-slate-600 font-black">•</span>
                    <span className="text-blue-400">{entry.duration} دقيقة</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:bg-yellow-500/20 transition-colors">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                    <span className="text-sm font-black text-yellow-400">+{entry.xp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Chart */}
      {activeTab === 'chart' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-white/5 bg-[#151928]/90 backdrop-blur-md p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/[0.02]" />
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-white text-xl">تطور الأداء الأسبوعي</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">النقاط المجمّعة خلال الأسابيع الأربعة الماضية</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-black text-emerald-400">+20%</span>
              </div>
            </div>
            <div className="relative z-10">
              <MiniBarChart data={weeklyData} />
            </div>
            <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              {weeklyData.map((w, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-5 py-4 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-1">{w.label}</p>
                    <p className="text-sm font-black text-white">{w.sessions} جلسات</p>
                  </div>
                  <div className={cn(
                    'text-2xl font-black drop-shadow-md',
                    i === weeklyData.length - 1 ? 'text-blue-400' : 'text-slate-300'
                  )}>
                    {w.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak milestones */}
          <div className="rounded-3xl border border-white/5 bg-[#151928]/90 backdrop-blur-md p-6 lg:p-8 shadow-2xl">
            <h3 className="font-black text-white text-xl mb-6">مراحل الإنجاز الذهبية</h3>
            <div className="flex items-center gap-2">
              {[3, 5, 7, 10, 14, 21, 30].map((days, i) => {
                const reached = totalSessions >= days;
                return (
                  <React.Fragment key={days}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all',
                        reached
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                          : 'bg-white/5 border-white/10'
                      )}>
                        {reached ? <Medal className="w-6 h-6 text-white drop-shadow-md" /> : <Lock className="w-5 h-5 text-slate-500" />}
                      </div>
                      <span className={cn('text-xs font-black shadow-none', reached ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]' : 'text-slate-500')}>{days}ي</span>
                    </div>
                    {i < 6 && <div className={cn('flex-1 h-1 rounded-full', i < 5 && reached ? 'bg-gradient-to-r from-orange-500 to-yellow-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10')} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Badges */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-[#151928]/90 backdrop-blur-md p-6 shadow-2xl overflow-hidden"
        >
          <GamificationBadges />
        </motion.div>
      )}

      {/* Leaderboard & Social Ranking */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* League Tier Card */}
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1e2330] to-[#151928] backdrop-blur-xl p-6 shadow-2xl overflow-hidden relative">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
             <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
               <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-slate-600 to-slate-400 border-[3px] border-white/10 flex items-center justify-center shadow-lg flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-white/20 blur-sm rounded-[2rem]" />
                  <Shield className="w-12 h-12 text-slate-100 relative z-10 drop-shadow-md" />
               </div>
               <div className="flex-1 text-center md:text-right w-full">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2 justify-center md:justify-start">
                    <Award className="w-4 h-4 text-indigo-400" /> التصنيف الحالي (League)
                  </p>
                  <h3 className="text-3xl font-black text-white mb-3">الدوري الفضي (Silver League)</h3>
                  <div className="flex items-center justify-between xl:max-w-md mb-2.5 mt-4 text-xs font-bold text-slate-400">
                    <span className="text-white text-sm bg-white/10 px-2 py-0.5 rounded-md">{xp} نقطة XP</span>
                    <span>الدوري الذهبي يفتح عند <strong className="text-yellow-400">5000 XP</strong></span>
                  </div>
                  <div className="h-4 p-0.5 xl:max-w-md bg-white/5 border border-white/10 rounded-full overflow-hidden flex items-center box-border">
                    <motion.div initial={{width: 0}} animate={{width: `${Math.min((xp/5000)*100, 100)}%`}} className="h-full rounded-full bg-gradient-to-l from-slate-300 to-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.4)]" transition={{duration: 1.2, ease: 'easeOut'}} />
                  </div>
               </div>
               <div className="hidden lg:flex flex-col items-center justify-center w-32 h-32 rounded-full border-[6px] border-white/5 relative z-10 bg-white/5">
                  <p className="text-sm font-black text-slate-400">المركز</p>
                  <p className="text-4xl font-black text-white">3</p>
               </div>
             </div>
          </div>

          {/* Social / Share Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-white text-2xl flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" /> منشئوا الأبطال (Top 10)
            </h3>
            <button className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-5 py-3 rounded-xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              مشاركة الإنجاز <Zap className="w-4 h-4" />
            </button>
          </div>

          {/* Leaderboard List */}
          <div className="rounded-[2rem] border border-white/5 bg-[#151928]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {[
                { rank: 1, name: 'يوسف أحمد', points: 4850, isMe: false, diff: '+12' },
                { rank: 2, name: 'علي مصطفى', points: 4200, isMe: false, diff: '+8' },
                { rank: 3, name: 'أنت', points: xp, isMe: true, diff: '+2' },
                { rank: 4, name: 'محمد صالح', points: xp > 3100 ? xp - 200 : 3100, isMe: false, diff: '-1' },
                { rank: 5, name: 'عبدالله سامي', points: xp > 2950 ? xp - 350 : 2950, isMe: false, diff: '-5' },
              ].map((student, i) => (
                <div key={i} className={cn("flex items-center gap-4 p-5 md:p-6 transition-all duration-300", student.isMe ? "bg-indigo-500/10 border-r-[6px] border-indigo-500 relative" : "hover:bg-white/[0.03]")}>
                  {student.isMe && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg relative z-10", student.rank === 1 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]" : student.rank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30 shadow-[0_0_15px_rgba(203,213,225,0.2)]" : student.rank === 3 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/5 text-slate-400 border border-white/5")}>
                    {student.rank}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#1e2330] flex items-center justify-center flex-shrink-0 font-black text-white text-xl shadow-inner border border-white/10 relative z-10">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className={cn("font-black text-lg md:text-xl tracking-wide", student.isMe ? "text-indigo-400" : "text-white")}>{student.name}</p>
                    <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                        {student.isMe ? <><Award className="w-3.5 h-3.5" /> هذا تصنيفك الحالي</> : <><Target className="w-3.5 h-3.5" /> يتفوق بمهارة الرشاقة</>}
                    </p>
                  </div>
                  <div className="text-left relative z-10">
                    <p className="text-2xl md:text-3xl font-black text-white tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">{student.points}</p>
                    <p className={cn("text-xs font-black mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-sm", student.diff.startsWith('+') ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10")}>
                        {student.diff.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                        {student.diff} الأسبوع
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 bg-black/20 border-t border-white/5 text-center">
              <button className="text-sm font-black text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-6 py-2.5 rounded-xl border border-blue-500/20 transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)]">عرض جميع الأبطال (142)</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
