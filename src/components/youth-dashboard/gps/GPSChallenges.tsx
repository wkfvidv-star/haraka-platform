import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Target, Zap, Flag, Compass, CheckCircle2, Play,
  Lock, Star, TrendingUp, Award, Gift, BarChart2, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: number;
  title: string;
  desc: string;
  type: string;
  reward: number;
  badge: string;
  status: 'available' | 'locked' | 'completed' | 'active';
  icon: React.ElementType;
  color: string;
  bg: string;
  progress?: number; // 0-100
  target: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
}

const CHALLENGES: Challenge[] = [
  { id: 1, title: 'الجري لمسافة 1 كم', desc: 'أتمم 1 كيلومتر في جلسة واحدة متواصلة باستخدام GPS.', type: 'distance', reward: 300, badge: '🏃', status: 'active', icon: Zap, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-900/5', progress: 65, target: '1 كم', difficulty: 'سهل' },
  { id: 2, title: 'الوصول لـ 3 نقاط تفتيش', desc: 'اعبر 3 نقاط تفتيش مختلفة في جلسة واحدة.', type: 'checkpoints', reward: 500, badge: '🏁', status: 'available', icon: Flag, color: 'text-rose-400', bg: 'from-rose-500/10 to-rose-900/5', target: '3 نقاط', difficulty: 'متوسط' },
  { id: 3, title: 'الغزال السريع (10 كم/س)', desc: 'حافظ على سرعة 10 كم/س لمدة 3 دقائق متواصلة.', type: 'speed', reward: 800, badge: '⚡', status: 'locked', icon: Target, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-900/5', target: '10 كم/س لـ 3د', difficulty: 'صعب' },
  { id: 4, title: 'استكشاف 5 مناطق', desc: 'زر 5 مناطق مختلفة في الأسبوع (مواقع متباعدة بـ500م).', type: 'exploration', reward: 1200, badge: '🗺️', status: 'available', icon: Compass, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-900/5', target: '5 مناطق', difficulty: 'صعب' },
  { id: 5, title: 'رحلة 30 دقيقة', desc: 'ابقَ نشطاً (مشي أو جري) لمدة 30 دقيقة متواصلة.', type: 'duration', reward: 400, badge: '⏱️', status: 'completed', icon: TrendingUp, color: 'text-green-400', bg: 'from-green-500/10 to-green-900/5', target: '30 دقيقة', difficulty: 'متوسط' },
  { id: 6, title: 'بطل الأسبوع', desc: 'أجرِ 5 جلسات على الأقل هذا الأسبوع. التتبع آلي.', type: 'streak', reward: 2000, badge: '🏆', status: 'available', icon: Trophy, color: 'text-yellow-400', bg: 'from-yellow-500/10 to-yellow-900/5', target: '5 جلسات', difficulty: 'صعب' },
];

const difficultyColor: Record<string, string> = {
  'سهل': 'bg-green-500/10 text-green-400 border-green-500/20',
  'متوسط': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'صعب': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const LEADERBOARD = [
  { rank: 1, name: 'أحمد العمري', pts: 4200, badge: '🥇', color: 'text-yellow-400' },
  { rank: 2, name: 'سارة الزهراني', pts: 3750, badge: '🥈', color: 'text-slate-300' },
  { rank: 3, name: 'أنت', pts: 3100, badge: '🥉', color: 'text-orange-400', isMe: true },
  { rank: 4, name: 'محمد الغامدي', pts: 2850, badge: '4️⃣', color: 'text-slate-400' },
  { rank: 5, name: 'فاطمة القرني', pts: 2400, badge: '5️⃣', color: 'text-slate-400' },
];

export const GPSChallenges = () => {
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [tab, setTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const [totalPoints] = useState(3100);
  const [level] = useState(6);

  const handleAccept = (id: number) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: 'active' as const } : c));
  };

  const completedCount = challenges.filter(c => c.status === 'completed').length;
  const activeCount = challenges.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'إجمالي النقاط', value: `${totalPoints.toLocaleString()}`, icon: Star, color: 'text-yellow-400', bg: 'from-yellow-500/10' },
          { label: 'المستوى الحالي', value: `Lv. ${level}`, icon: Award, color: 'text-purple-400', bg: 'from-purple-500/10' },
          { label: 'تحديات منجزة', value: `${completedCount}/${challenges.length}`, icon: Trophy, color: 'text-green-400', bg: 'from-green-500/10' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className={`bg-gradient-to-br ${s.bg} to-transparent border-white/5`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold">{s.label}</p>
                  <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
        {[
          { id: 'challenges', label: 'التحديات', icon: Target },
          { id: 'leaderboard', label: 'لوحة الصدارة', icon: BarChart2 },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === t.id ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'challenges' && (
          <motion.div key="ch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Active Challenge Alert */}
            {activeCount > 0 && (
              <div className="mb-4 flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                <Flame className="w-5 h-5 text-orange-400 shrink-0 animate-pulse" />
                <p className="text-orange-300 font-bold text-sm">{activeCount} تحدٍ جارٍ حالياً — استمر في التتبع لإتمامهم!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {challenges.map((card, i) => (
                <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Card className={`bg-gradient-to-br ${card.bg} border-white/5 shadow-xl overflow-hidden h-full flex flex-col relative group`}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                    {card.status === 'active' && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 animate-pulse rounded-t-full" />
                    )}

                    <CardContent className="pt-5 pb-4 px-5 flex flex-col flex-1 relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 text-2xl`}>
                          {card.badge}
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          <Badge className={`text-[9px] border px-2 py-0.5 font-bold ${difficultyColor[card.difficulty]}`}>{card.difficulty}</Badge>
                          {card.status === 'completed' && <Badge className="text-[9px] bg-green-500/10 text-green-400 border-green-500/20 px-2 py-0.5">✓ مكتمل</Badge>}
                          {card.status === 'active' && <Badge className="text-[9px] bg-orange-500/10 text-orange-400 border-orange-500/20 px-2 py-0.5 animate-pulse">● جارٍ</Badge>}
                        </div>
                      </div>

                      <h4 className="font-black text-white text-base mb-1">{card.title}</h4>
                      <p className="text-slate-400 text-xs font-bold leading-relaxed mb-3 flex-1">{card.desc}</p>

                      {/* Progress bar for active */}
                      {card.status === 'active' && card.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>التقدم</span><span>{card.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
                              initial={{ width: 0 }} animate={{ width: `${card.progress}%` }} transition={{ duration: 1, delay: 0.3 }} />
                          </div>
                        </div>
                      )}

                      {/* Reward */}
                      <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl mb-3">
                        <span className="text-slate-400 text-xs font-bold">الهدف: {card.target}</span>
                        <span className="text-yellow-400 font-black flex items-center gap-1 text-sm">
                          <Gift className="w-3.5 h-3.5" /> {card.reward} نقطة
                        </span>
                      </div>

                      {/* CTA */}
                      {card.status === 'available' && (
                        <Button onClick={() => handleAccept(card.id)} className="w-full font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 text-sm">
                          قبول التحدي →
                        </Button>
                      )}
                      {card.status === 'active' && (
                        <Button className="w-full font-black bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl shadow-lg h-10 text-sm">
                          <Play className="w-4 h-4 ml-1.5 fill-current" /> ابدأ التتبع للإنجاز
                        </Button>
                      )}
                      {card.status === 'locked' && (
                        <Button disabled className="w-full font-bold bg-slate-900 text-slate-600 border border-slate-800 rounded-xl h-10 text-sm">
                          <Lock className="w-3.5 h-3.5 ml-1.5" /> مقفول — أنجز السابق
                        </Button>
                      )}
                      {card.status === 'completed' && (
                        <Button variant="outline" className="w-full font-bold bg-green-500/10 text-green-400 border-green-500/20 rounded-xl pointer-events-none h-10 text-sm">
                          <CheckCircle2 className="w-4 h-4 ml-1.5" /> تم الإنجاز! 🎉
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'leaderboard' && (
          <motion.div key="lb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="bg-slate-900/60 border-white/5">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-white font-black flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> لوحة الصدارة — هذا الأسبوع
                </CardTitle>
                <p className="text-slate-500 text-xs font-bold mt-1">التصنيف حسب نقاط GPS المكتسبة</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {LEADERBOARD.map((p, i) => (
                    <motion.div key={p.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className={`p-4 flex items-center justify-between transition-colors ${p.isMe ? 'bg-orange-500/10' : 'hover:bg-white/[0.03]'}`}>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-8 text-center">{p.badge}</span>
                        <div>
                          <p className={`font-black ${p.isMe ? 'text-orange-300' : 'text-white'} text-base`}>
                            {p.name} {p.isMe && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full font-bold">أنت</span>}
                          </p>
                          <p className="text-slate-500 text-xs font-bold">المركز #{p.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${p.color}`}>{p.pts.toLocaleString()}</p>
                        <p className="text-slate-600 text-[10px] font-bold">نقطة</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
