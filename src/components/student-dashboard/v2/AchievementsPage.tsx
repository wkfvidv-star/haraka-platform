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
  { date: '2026-03-14', dateLabel: 'اليوم', type: 'speed', title: 'جلسة السرعة والرشاقة', duration: 53, xp: 200, icon: Zap, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  { date: '2026-03-13', dateLabel: 'أمس', type: 'balance', title: 'تمارين التوازن والتوافق', duration: 33, xp: 130, icon: Shield, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
  { date: '2026-03-12', dateLabel: 'الثلاثاء', type: 'agility', title: 'الرشاقة المتقدمة — T-Test', duration: 47, xp: 180, icon: Activity, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { date: '2026-03-10', dateLabel: 'الأحد', type: 'cognitive', title: 'تمارين الإدراك الحركي', duration: 28, xp: 110, icon: Target, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  { date: '2026-03-09', dateLabel: 'السبت', type: 'speed', title: 'السرعة والقوة الانفجارية', duration: 45, xp: 175, icon: Zap, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  { date: '2026-03-07', dateLabel: 'الخميس', type: 'balance', title: 'التوازن الديناميكي', duration: 30, xp: 120, icon: Shield, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
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
  const { fullProfile } = useAuth();
  const xp = fullProfile?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const progressPct = ((xp - ((level - 1) * 500)) / 500) * 100;
  const streakDays = fullProfile?.streakDays || 1;
  const completedWorkouts = fullProfile?.completedWorkouts || 3;
  const totalBadges = fullProfile?.badges?.length || 1;

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
      <div className="flex gap-2 bg-slate-100 dark:bg-white/5 rounded-2xl p-1.5">
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
              'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Activity Log */}
      {activeTab === 'log' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-slate-100 dark:border-white/5">
            <h3 className="font-black text-slate-800 dark:text-slate-100">سجل النشاطات الأخيرة</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activityLog.length} جلسة مسجلة</p>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {activityLog.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0', entry.color)}>
                  <entry.icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{entry.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{entry.dateLabel}</span>
                    <span>•</span>
                    <span>{entry.duration} دقيقة</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/30 rounded-xl px-3 py-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black text-yellow-600 dark:text-yellow-400">+{entry.xp}</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
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
          <div className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100">تطور الأداء الأسبوعي</h3>
                <p className="text-xs text-slate-400 mt-0.5">النقاط المجمّعة خلال الأسابيع الأربعة الماضية</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30 rounded-2xl px-3 py-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+20%</span>
              </div>
            </div>
            <MiniBarChart data={weeklyData} />
            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              {weeklyData.map((w, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{w.label}</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{w.sessions} جلسات</p>
                  </div>
                  <div className={cn(
                    'text-xl font-black',
                    i === weeklyData.length - 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'
                  )}>
                    {w.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak milestones */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm">
            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-4">مراحل الإنجاز</h3>
            <div className="flex items-center gap-2">
              {[3, 5, 7, 10, 14, 21, 30].map((days, i) => {
                const reached = totalSessions >= days;
                return (
                  <React.Fragment key={days}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                        reached
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-400 shadow-md shadow-orange-400/30'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                      )}>
                        {reached ? <Medal className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <span className={cn('text-[10px] font-bold', reached ? 'text-orange-500' : 'text-slate-400')}>{days}ي</span>
                    </div>
                    {i < 6 && <div className={cn('flex-1 h-0.5', i < 5 && reached ? 'bg-orange-400' : 'bg-slate-200 dark:bg-white/10')} />}
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
          className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm"
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
          <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 backdrop-blur-md p-6 shadow-sm overflow-hidden relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
             <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
               <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-slate-300 to-slate-100 dark:from-slate-600 dark:to-slate-400 border-[6px] border-white dark:border-[#1e2330] flex items-center justify-center shadow-xl flex-shrink-0">
                  <Shield className="w-10 h-10 text-slate-500 dark:text-slate-200" />
               </div>
               <div className="flex-1 text-center md:text-right w-full">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">التصنيف الحالي (League)</p>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">الدوري الفضي (Silver League)</h3>
                  <div className="flex items-center justify-between xl:max-w-md mb-2 mt-4 text-xs font-bold text-slate-500">
                    <span>{xp} XP</span>
                    <span>الدوري الذهبي يفتح عند 5000 XP</span>
                  </div>
                  <div className="h-3 xl:max-w-md bg-slate-300/50 dark:bg-black/30 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: `${Math.min((xp/5000)*100, 100)}%`}} className="h-full bg-gradient-to-l from-slate-400 to-slate-300 dark:from-slate-300 dark:to-slate-400" transition={{duration: 1}} />
                  </div>
               </div>
             </div>
          </div>

          {/* Social / Share Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" /> تصنيف مدرستك (Top 10)
            </h3>
            <button className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-xl text-sm font-black hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors shadow-sm">
              مشاركة الإنجاز 🚀
            </button>
          </div>

          {/* Leaderboard List */}
          <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-[#0B0E14] backdrop-blur-md shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {[
                { rank: 1, name: 'يوسف أحمد', points: 4850, isMe: false, diff: '+12' },
                { rank: 2, name: 'علي مصطفى', points: 4200, isMe: false, diff: '+8' },
                { rank: 3, name: 'أنت', points: xp, isMe: true, diff: '+2' },
                { rank: 4, name: 'محمد صالح', points: xp > 3100 ? xp - 200 : 3100, isMe: false, diff: '-1' },
                { rank: 5, name: 'عبدالله سامي', points: xp > 2950 ? xp - 350 : 2950, isMe: false, diff: '-5' },
              ].map((student, i) => (
                <div key={i} className={cn("flex items-center gap-4 p-4 md:p-5 transition-colors", student.isMe ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-r-4 border-indigo-500" : "hover:bg-slate-50/50 dark:hover:bg-white/[0.02]")}>
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg", student.rank === 1 ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-700/30" : student.rank === 2 ? "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300 border border-slate-300/50 dark:border-white/10" : student.rank === 3 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200/50 dark:border-orange-700/30" : "bg-slate-50 dark:bg-white/5 text-slate-400")}>
                    {student.rank}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center flex-shrink-0 font-black text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-white/5">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-black text-base md:text-lg", student.isMe ? "text-indigo-700 dark:text-indigo-400" : "text-slate-800 dark:text-slate-100")}>{student.name}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{student.isMe ? "هذا تصنيفك الحالي" : `يتفوق عليك بمهارة الرشاقة`}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{student.points}</p>
                    <p className={cn("text-xs font-bold", student.diff.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>{student.diff} هذا الأسبوع</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 dark:bg-white/[0.02] dark:border-white/5 text-center">
              <button className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">عرض جميع الطلاب (142)</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
