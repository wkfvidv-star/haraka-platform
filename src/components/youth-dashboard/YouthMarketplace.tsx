import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MapPin, Brain, ArrowRight, Filter,
  CheckCircle2, Clock, Users, Zap, Shield, Target,
  TrendingUp, Award, Play, X, Phone, ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketplaceService, Coach, Invitation } from '@/services/marketplaceService';
import { gamificationService } from '@/services/gamificationService';
import { cn } from '@/lib/utils';

// ── Specialty icon map ──────────────────────────────────────────────
const SPECIALTY_META: Record<string, { emoji: string; color: string; bg: string }> = {
  speed:     { emoji: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  focus:     { emoji: '🧠', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  fitness:   { emoji: '💪', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  rehab:     { emoji: '🩺', color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
  nutrition: { emoji: '🥗', color: 'text-teal-400',    bg: 'bg-teal-500/10 border-teal-500/20' },
};

const FILTERS = [
  { id: 'all',       label: 'الكل',          emoji: '🌟' },
  { id: 'speed',     label: 'السرعة',        emoji: '⚡' },
  { id: 'focus',     label: 'التركيز',       emoji: '🧠' },
  { id: 'fitness',   label: 'اللياقة',       emoji: '💪' },
  { id: 'rehab',     label: 'إعادة التأهيل', emoji: '🩺' },
];

// ── Coach Card ──────────────────────────────────────────────────────
function CoachCard({
  coach,
  requested,
  onRequest,
  onView,
}: {
  coach: Coach & { matchPct: number };
  requested: boolean;
  onRequest: () => void;
  onView: () => void;
}) {
  const meta = SPECIALTY_META[coach.specialty] ?? SPECIALTY_META.fitness;
  const matchColor =
    coach.matchPct >= 90 ? 'text-emerald-400' :
    coach.matchPct >= 75 ? 'text-blue-400' : 'text-slate-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[28px] overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-xl hover:shadow-orange-500/10">
        <CardContent className="p-0">
          {/* Header gradient */}
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

            {/* AI Match Ring */}
            <div className="absolute top-5 right-5">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" className="stroke-white/10 fill-none" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24"
                    className="stroke-orange-500 fill-none"
                    strokeWidth="4"
                    strokeDasharray={`${(coach.matchPct / 100) * 150.8} 150.8`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-[11px] font-black', matchColor)}>{coach.matchPct}%</span>
                  <span className="text-[6px] font-bold text-orange-400 uppercase tracking-widest">تطابق</span>
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="absolute bottom-4 right-5 flex items-end gap-3">
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg', coach.avatarColor)}>
                {coach.avatarInitials}
              </div>
              <div>
                <h3 className="text-white font-black text-base leading-tight">{coach.name}</h3>
                <div className={cn('flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mt-1 w-fit', meta.bg, meta.color)}>
                  <span>{meta.emoji}</span>
                  <span>{coach.specialtyLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* AI Reason */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3.5 flex items-start gap-3">
              <Brain className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{coach.bio}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-white">{coach.rating}</span>
                <span>({coach.reviewCount} تقييم)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-white">{coach.sessionPrice} دج</span>
                <span>/جلسة</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onView}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs h-10"
              >
                عرض الملف
              </Button>
              <Button
                size="sm"
                onClick={onRequest}
                disabled={requested}
                className={cn(
                  'flex-[1.5] rounded-xl font-black text-xs h-10 flex items-center gap-1.5',
                  requested
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/30'
                    : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white'
                )}
              >
                {requested ? <><CheckCircle2 className="w-3.5 h-3.5" /> تم الطلب</> : <>ابدأ تدريبك <ArrowRight className="w-3.5 h-3.5" /></>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Coach Profile Modal ─────────────────────────────────────────────
function CoachModal({
  coach,
  requested,
  onRequest,
  onClose,
}: {
  coach: Coach & { matchPct: number };
  requested: boolean;
  onRequest: () => void;
  onClose: () => void;
}) {
  const meta = SPECIALTY_META[coach.specialty] ?? SPECIALTY_META.fitness;
  const slots = ['الأحد 10:00ص', 'الاثنين 4:00م', 'الثلاثاء 6:00م', 'الخميس 5:00م'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative z-10 bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-orange-900/50 to-slate-900 p-6 flex items-end gap-4">
          <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg', coach.avatarColor)}>
            {coach.avatarInitials}
          </div>
          <div>
            <h2 className="text-white font-black text-xl">{coach.name}</h2>
            <div className={cn('flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border w-fit', meta.bg, meta.color)}>
              {meta.emoji} {coach.specialtyLabel}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Match */}
          <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-[10px] text-orange-400 font-black uppercase tracking-wider">توافق الذكاء الاصطناعي</p>
                <p className="text-white font-black text-xl">{coach.matchPct}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold">السعر / جلسة</p>
              <p className="text-white font-black">{coach.sessionPrice} دج</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-300 text-sm font-medium leading-relaxed">{coach.bio}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Star, label: 'التقييم', val: `${coach.rating}⭐`, color: 'text-amber-400' },
              { icon: Users, label: 'الجلسات', val: coach.reviewCount, color: 'text-orange-400' },
              { icon: Award, label: 'الخبرة', val: '8 سنوات', color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                <s.icon className={cn('w-4 h-4 mx-auto mb-1', s.color)} />
                <p className="text-white font-black text-sm">{s.val}</p>
                <p className="text-slate-400 text-[10px] font-bold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Available slots */}
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">المواعيد المتاحة</p>
            <div className="grid grid-cols-2 gap-2">
              {slots.map(s => (
                <button key={s} className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-300 text-xs font-bold hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={onRequest}
            disabled={requested}
            className={cn(
              'w-full h-12 rounded-2xl font-black text-base',
              requested
                ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/30'
                : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-xl shadow-orange-500/25'
            )}
          >
            {requested ? '✓ تم إرسال الطلب' : 'طلب جلسة تدريبية'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Invitation Banner ───────────────────────────────────────────────
function InvitationBanner({ inv, onAccept, onReject }: { inv: Invitation; onAccept: () => void; onReject: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-l from-orange-500/15 to-rose-500/10 border border-orange-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg', inv.coachAvatarColor)}>
        {inv.coachAvatarInitials}
      </div>
      <div className="flex-1">
        <h4 className="font-black text-white text-base">📩 دعوة تدريب من {inv.coachName}</h4>
        <p className="text-slate-300 text-sm mt-0.5 leading-relaxed line-clamp-2">{inv.message}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button onClick={onAccept} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl px-5">
          قبول ✓
        </Button>
        <Button onClick={onReject} size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
          تجاهل
        </Button>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════
export function YouthMarketplace() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [coaches, setCoaches] = useState<(Coach & { matchPct: number })[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [selectedCoach, setSelectedCoach] = useState<(Coach & { matchPct: number }) | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const levelInfo = gamificationService.getLevelInfo();
  const streak = gamificationService.getStreak();

  useEffect(() => {
    const allCoaches = marketplaceService.getSuggestedCoaches();
    setCoaches(allCoaches);
    setInvitations(marketplaceService.getInvitations().filter(i => i.status === 'pending'));
    const reqSet = new Set(allCoaches.filter(c => marketplaceService.hasRequestedCoach(c.id)).map(c => c.id));
    setRequested(reqSet);
  }, []);

  const filtered = coaches.filter(c => {
    const matchSpec = activeFilter === 'all' || c.specialty === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q || c.name.includes(q) || c.specialtyLabel.includes(q) || c.bio.includes(q);
    return matchSpec && matchQ;
  });

  const handleRequest = (coachId: string, coachName: string) => {
    marketplaceService.requestCoach(coachId, coachName);
    setRequested(prev => new Set([...prev, coachId]));
    setSelectedCoach(null);
  };

  const handleAccept = (id: string) => {
    marketplaceService.acceptInvitation(id);
    setInvitations(prev => prev.filter(i => i.id !== id));
  };

  const handleReject = (id: string) => {
    marketplaceService.rejectInvitation(id);
    setInvitations(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[36px] p-8 md:p-10 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 45%, #881337 100%)' }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-orange-400 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <Badge className="bg-white/20 text-white border-white/10 px-3 py-1 font-black text-[11px] uppercase tracking-widest backdrop-blur-md">
              🤖 توصيات الذكاء الاصطناعي
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              اعثر على مدربك <br />المثالي الآن
            </h1>
            <p className="text-orange-100/80 text-base font-medium max-w-sm leading-relaxed">
              نحلل أهدافك ومستواك ونقترح عليك المدربين الأنسب لك تحديداً.
            </p>
            {/* Mini stats */}
            <div className="flex items-center gap-3 pt-1">
              <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
                <TrendingUp className="w-3.5 h-3.5 text-orange-300" />
                <span className="text-white text-xs font-black">المستوى {levelInfo.level}</span>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
                <span className="text-sm">🔥</span>
                <span className="text-white text-xs font-black">{streak} يوم متتالي</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-72 space-y-2">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-400 transition-colors" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو التخصص..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white/95 border-none shadow-xl text-slate-900 font-bold placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 font-black text-xs flex items-center justify-center gap-2 transition-all backdrop-blur-md"
            >
              <Filter className="w-3.5 h-3.5" />
              تصفية متقدمة
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showFilters && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Pending Invitations ─────────────────────────────────── */}
      <AnimatePresence>
        {invitations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-white font-black text-base">دعوات تدريب معلقة ({invitations.length})</h3>
            </div>
            {invitations.map(inv => (
              <InvitationBanner key={inv.id} inv={inv} onAccept={() => handleAccept(inv.id)} onReject={() => handleReject(inv.id)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-full font-black text-sm whitespace-nowrap transition-all',
              activeFilter === f.id
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            )}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* ── AI Insight Banner ────────────────────────────────────── */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <p className="text-orange-300 text-[11px] font-black uppercase tracking-widest mb-0.5">تحليل ذكي لاحتياجاتك</p>
          <p className="text-white text-sm font-medium leading-snug">
            بناءً على أهدافك ومستواك، المدربون المعروضون تم تصنيفهم بنسبة التوافق مع بصمتك الحركية تحديداً.
          </p>
        </div>
      </div>

      {/* ── Coaches Grid ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-bold">لا يوجد مدربون بهذه المعايير</p>
          <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="mt-3 text-orange-400 font-black text-sm hover:underline">
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map(coach => (
              <CoachCard
                key={coach.id}
                coach={coach}
                requested={requested.has(coach.id)}
                onRequest={() => handleRequest(coach.id, coach.name)}
                onView={() => setSelectedCoach(coach)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Why Marketplace Section ──────────────────────────────── */}
      <div className="bg-white/5 border border-white/5 rounded-[28px] p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, color: 'text-orange-400', title: 'مدربون معتمدون', desc: 'جميع المدربين حاصلون على شهادات رياضية معتمدة' },
          { icon: Zap, color: 'text-yellow-400', title: 'توصية فورية بالذكاء', desc: 'نظام AI يحلل أهدافك ويختار المدرب الأنسب تلقائياً' },
          { icon: Target, color: 'text-rose-400', title: 'تدريب شخصي 100%', desc: 'كل جلسة مصممة خصيصاً لتطوير نقاط قوتك' },
        ].map(item => (
          <div key={item.title} className="flex flex-col items-center text-center p-4">
            <div className={cn('w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3', item.color)}>
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="text-white font-black text-sm mb-1">{item.title}</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Coach Profile Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedCoach && (
          <CoachModal
            coach={selectedCoach}
            requested={requested.has(selectedCoach.id)}
            onRequest={() => handleRequest(selectedCoach.id, selectedCoach.name)}
            onClose={() => setSelectedCoach(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
