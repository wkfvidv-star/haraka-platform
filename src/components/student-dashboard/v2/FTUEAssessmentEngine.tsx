import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Zap, Shield, Dumbbell, Brain, Calculator, Grid3X3,
  Heart, Moon, Battery, AlertTriangle, CheckCircle2,
  ChevronLeft, ChevronRight, Activity, Timer, Star,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
export type DomainId = 'motor' | 'cognitive' | 'psychological' | 'rehab';

export interface DomainScore {
  id: DomainId;
  label: string;
  score: number;       // 0–100
  subscores: Record<string, number>;
}

export interface AssessmentResult {
  motor: DomainScore;
  cognitive: DomainScore;
  psychological: DomainScore;
  rehab: DomainScore;
  needsRehab: boolean;
  completedAt: string;
}

interface Props {
  onDone: (result: AssessmentResult) => void;
  onSkip: () => void;
}

// ─────────────────────────────────────────────────────────────────
// DOMAIN DEFINITIONS
// ─────────────────────────────────────────────────────────────────
const DOMAINS = [
  { id: 'motor' as DomainId, label: 'الأداء الحركي', icon: Activity, color: 'from-blue-500 to-cyan-600', tests: 3 },
  { id: 'cognitive' as DomainId, label: 'الأداء المعرفي', icon: Brain, color: 'from-violet-500 to-purple-700', tests: 3 },
  { id: 'psychological' as DomainId, label: 'الجانب النفسي', icon: Heart, color: 'from-rose-500 to-pink-600', tests: 4 },
  { id: 'rehab' as DomainId, label: 'التأهيل والسلامة', icon: Shield, color: 'from-emerald-500 to-teal-600', tests: 3 },
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
function avg(vals: number[]) { return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length); }

// ─────────────────────────────────────────────────────────────────
// ── MOTOR TESTS ──────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────

/** Test M1: Reaction */
function ReactionTest({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  const [phase, setPhase] = useState<'idle' | 'wait' | 'go' | 'done' | 'early'>('idle');
  const [ms, setMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);

  const start = () => {
    setPhase('wait');
    const delay = level === 'primary' ? 2000 + Math.random() * 2000 : 
                  1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase('go');
    }, delay);
  };

  const tap = () => {
    if (phase === 'idle') { start(); return; }
    if (phase === 'wait') {
      clearTimeout(timerRef.current!);
      setPhase('early');
      setTimeout(() => setPhase('idle'), 1200);
      return;
    }
    if (phase === 'go') {
      const elapsed = Date.now() - startRef.current;
      setMs(elapsed);
      setPhase('done');

      let score = 0;
      if (level === 'primary') {
         score = elapsed < 350 ? 100 : elapsed < 500 ? 85 : elapsed < 700 ? 70 : elapsed < 800 ? 55 : 38;
      } else if (level === 'middle') {
         score = elapsed < 250 ? 100 : elapsed < 350 ? 85 : elapsed < 500 ? 70 : elapsed < 650 ? 55 : 38;
      } else { // high
         score = elapsed < 180 ? 100 : elapsed < 250 ? 85 : elapsed < 380 ? 70 : elapsed < 500 ? 55 : 38;
      }

      setTimeout(() => onDone(score), 1800);
    }
  };

  const bgMap = { idle: 'bg-slate-700', wait: 'bg-red-600', go: 'bg-emerald-500', done: 'bg-slate-700', early: 'bg-orange-500' };
  const labelMap = { idle: 'اضغط للبدء', wait: 'انتظر…', go: '⚡ اضغط!', done: `${ms} ms`, early: 'سابق لأوانه!' };

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <p className="text-white/95 text-center text-3xl font-black max-w-xl leading-tight drop-shadow-md">
        انتظر حتى يتحوّل اللون إلى <span className="text-emerald-400">أخضر</span> ثم اضغط فورًا!
      </p>
      <motion.button
        whileTap={{ scale: 0.92 }} onClick={tap}
        className={`w-64 h-64 rounded-full ${bgMap[phase]} transition-colors duration-200 flex flex-col items-center justify-center shadow-2xl select-none cursor-pointer border-4 border-white/10`}
      >
        <span className="text-white text-4xl font-black drop-shadow-lg">{labelMap[phase]}</span>
        {phase === 'go' && <Zap className="w-12 h-12 text-white mt-2 animate-bounce drop-shadow-xl" />}
      </motion.button>
      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4">
          <p className="text-emerald-400 font-black text-3xl drop-shadow-md">{ms < 300 ? '🔥 رائع! ردة فعل صاروخية' : '👍 جيد! يمكن تحسينها'}</p>
          <p className="text-white/70 text-lg font-bold mt-2">زمن ردة الفعل: {ms} مللي ثانية</p>
        </motion.div>
      )}
    </div>
  );
}

/** Test M2: Balance */
function BalanceTest({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  const [sel, setSel] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  
  const opts = level === 'primary' ? [
    { v: 1, label: 'أواجه صعوبة كبيرة', score: 35, emoji: '😰' },
    { v: 2, label: 'أقل من 3 ثوانٍ', score: 55, emoji: '😐' },
    { v: 3, label: 'من 3 إلى 8 ثوانٍ', score: 75, emoji: '🙂' },
    { v: 4, label: 'أكثر من 8 ثوانٍ بثبات', score: 95, emoji: '🦸' },
  ] : level === 'middle' ? [
    { v: 1, label: 'لا أستطيع الوقوف على قدم واحدة', score: 28, emoji: '😰' },
    { v: 2, label: 'أقل من 5 ثوانٍ', score: 50, emoji: '😐' },
    { v: 3, label: 'من 5 إلى 15 ثانية', score: 72, emoji: '🙂' },
    { v: 4, label: 'أكثر من 15 ثانية بسهولة', score: 92, emoji: '💪' },
  ] : [
    { v: 1, label: 'أقل من 5 ثوانٍ', score: 40, emoji: '😰' },
    { v: 2, label: '5-15 ثانية', score: 60, emoji: '😐' },
    { v: 3, label: '15-30 ثانية', score: 80, emoji: '🙂' },
    { v: 4, label: 'أكثر من 30 ثانية وعيناي مغلقتان', score: 100, emoji: '🥷' },
  ];
  const confirm = () => {
    if (sel === null) return;
    setConfirmed(true);
    setTimeout(() => onDone(opts.find(o => o.v === sel)!.score), 1400);
  };
  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto py-4">
      <p className="text-white/95 text-center text-3xl font-black leading-tight drop-shadow-md mb-2">جرّب الوقوف على قدم واحدة. ماذا تستطيع؟</p>
      {opts.map(o => (
        <motion.button key={o.v} whileTap={{ scale: 0.97 }}
          onClick={() => !confirmed && setSel(o.v)}
          className={`flex items-center gap-6 px-6 py-5 rounded-3xl border text-right transition-all shadow-lg ${sel === o.v ? 'border-cyan-400 bg-cyan-500/30 text-white scale-105' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/15 hover:scale-[1.02]'}`}>
          <span className="text-5xl">{o.emoji}</span>
          <span className="text-2xl font-black leading-snug">{o.label}</span>
        </motion.button>
      ))}
      {sel !== null && !confirmed && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Button onClick={confirm} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-3xl h-16 text-2xl font-black shadow-2xl transition-all hover:scale-105">تأكيد الإجابة</Button>
        </motion.div>
      )}
      {confirmed && <p className="text-emerald-400 font-bold text-center">✅ تم تسجيل نتيجة التوازن</p>}
    </div>
  );
}

/** Test M3: Strength & Flexibility (combined self-report) */
function StrengthFlexTest({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  const [step, setStep] = useState(0); // 0=flex, 1=strength
  const [flexR, setFlexR] = useState<number | null>(null);
  const [strR, setStrR] = useState<number | null>(null);

  const flexOpts = [
    { v: 1, label: 'لا أستطيع لمس ركبتيّ', emoji: '😓', score: 20 },
    { v: 2, label: 'أصل لمنتصف ساقيّ', emoji: '😕', score: 45 },
    { v: 3, label: 'أصل لكاحليّ', emoji: '😐', score: 65 },
    { v: 4, label: 'أصل لأطراف أصابع قدميّ', emoji: '🙂', score: 85 },
    { v: 5, label: 'أضع راحتيّ كاملتين على الأرض', emoji: '😎', score: 100 },
  ];
  const strOpts = level === 'primary' ? [
    { v: 1, label: 'أقل من 2', emoji: '😰', score: 30 },
    { v: 2, label: '2–5 تكرارات', emoji: '😐', score: 55 },
    { v: 3, label: '6–10 تكراراً', emoji: '🙂', score: 80 },
    { v: 4, label: 'أكثر من 10', emoji: '🦸', score: 100 },
  ] : level === 'middle' ? [
    { v: 1, label: 'أقل من 5', emoji: '😰', score: 25 },
    { v: 2, label: '5–10 تكرارات', emoji: '😐', score: 50 },
    { v: 3, label: '11–20 تكراراً', emoji: '🙂', score: 72 },
    { v: 4, label: 'أكثر من 20', emoji: '💪', score: 92 },
  ] : [
    { v: 1, label: 'أقل من 10', emoji: '😰', score: 35 },
    { v: 2, label: '10–20 تكراراً', emoji: '😐', score: 60 },
    { v: 3, label: '21–40 تكراراً', emoji: '🙂', score: 85 },
    { v: 4, label: 'أكثر من 40', emoji: '💪', score: 100 },
  ];

  const handleFlex = (v: number) => { setFlexR(v); setStep(1); };
  const handleStr = (v: number) => {
    setStrR(v);
    const fScore = flexOpts.find(o => o.v === flexR)!.score;
    const sScore = strOpts.find(o => o.v === v)!.score;
    setTimeout(() => onDone(avg([fScore, sScore])), 1000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-4">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="flex" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-6">
            <p className="text-white/95 text-center text-3xl font-black leading-tight drop-shadow-md">انحنِ للأمام واستطِل بيديك. أين تصل؟</p>
            <div className="flex gap-4 justify-center flex-wrap mt-2">
              {flexOpts.map(o => (
                <motion.button key={o.v} whileTap={{ scale: 0.9 }}
                  onClick={() => handleFlex(o.v)}
                  className="flex flex-col items-center justify-center gap-2 w-[110px] h-[120px] rounded-3xl border border-white/20 bg-white/10 hover:bg-white/20 shadow-xl transition-all hover:scale-105">
                  <span className="text-4xl mt-1 drop-shadow-md">{o.emoji}</span>
                  <span className="text-sm font-black text-white/95 text-center px-2 leading-snug">{o.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="str" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-5">
            <p className="text-white/95 text-center text-3xl font-black leading-tight drop-shadow-md mb-2">كم تضغطة (Push-up) تستطيع في مرة واحدة؟</p>
            {strOpts.map(o => (
              <motion.button key={o.v} whileTap={{ scale: 0.97 }}
                onClick={() => handleStr(o.v)}
                className="flex items-center gap-6 px-6 py-5 rounded-3xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/15 hover:border-blue-400/50 hover:scale-[1.02] text-right transition-all shadow-lg">
                <span className="text-5xl">{o.emoji}</span>
                <span className="text-2xl font-black">{o.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {strR !== null && <p className="text-emerald-400 font-bold text-center">✅ تم قياس القوة والمرونة</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ── COGNITIVE TESTS ───────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────

/** Test C1: Memory Sequence */
function MemoryTest({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
  const COLOR_LABELS = ['أحمر', 'أزرق', 'أصفر', 'أخضر', 'بنفسجي', 'برتقالي'];
  
  const SEQ_LEN = level === 'primary' ? 3 : level === 'middle' ? 4 : 5;
  const PALETTE_SIZE = level === 'primary' ? 3 : level === 'middle' ? 4 : 6;
  const SPEED = level === 'primary' ? 1000 : level === 'high' ? 450 : 700;
  const DELAY = level === 'high' ? 200 : 300;

  const ACTIVE_COLORS = COLORS.slice(0, PALETTE_SIZE);
  const ACTIVE_LABELS = COLOR_LABELS.slice(0, PALETTE_SIZE);
  const [phase, setPhase] = useState<'intro' | 'show' | 'input' | 'result'>('intro');
  const [sequence, setSequence] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const generateAndShow = () => {
    const seq = Array.from({ length: SEQ_LEN }, () => Math.floor(Math.random() * PALETTE_SIZE));
    setSequence(seq);
    setPhase('show');
    let i = 0;
    const next = () => {
      if (i < seq.length) {
        setShowing(seq[i]);
        setTimeout(() => { setShowing(-1); setTimeout(() => { i++; next(); }, DELAY); }, SPEED);
      } else {
        setPhase('input');
      }
    };
    setTimeout(next, 700);
  };

  const handleInput = (c: number) => {
    if (phase !== 'input') return;
    const ns = [...userSeq, c];
    setUserSeq(ns);
    if (ns.length === SEQ_LEN) {
      const ok = ns.every((v, i) => v === sequence[i]);
      setCorrect(ok);
      setPhase('result');
      const score = ok ? 88 : ns.filter((v, i) => v === sequence[i]).length >= 2 ? 55 : 30;
      setTimeout(() => onDone(score), 1600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {phase === 'intro' && (
        <div className="flex flex-col items-center gap-10 py-6">
          <p className="text-white/95 text-center text-3xl font-black max-w-2xl leading-tight drop-shadow-md">سيُعرض عليك تسلسل ألوان. احفظه ثم كرّره بالترتيب!</p>
          <div className="flex gap-4">
            {COLORS.map((c, i) => <div key={i} className={`w-20 h-20 rounded-3xl ${c} opacity-40`} />)}
          </div>
          <Button onClick={generateAndShow} className="bg-violet-600 hover:bg-violet-500 text-white rounded-3xl h-16 text-2xl px-12 font-black shadow-2xl mt-4">ابدأ التحدي</Button>
        </div>
      )}

      {phase === 'show' && (
        <div className="flex flex-col items-center gap-10 py-10">
          <p className="text-white font-black text-3xl drop-shadow-md">احفظ التسلسل…</p>
          <div className="flex gap-5">
            {COLORS.map((c, i) => (
              <motion.div key={i} animate={{ scale: showing === i ? 1.4 : 1, opacity: showing === i ? 1 : 0.3 }}
                className={`w-28 h-28 rounded-[2rem] ${c} shadow-2xl`} />
            ))}
          </div>
        </div>
      )}

      {phase === 'input' && (
        <div className="flex flex-col items-center gap-8 py-4">
          <p className="text-white/95 font-black text-3xl drop-shadow-md">الآن كرّر التسلسل ({userSeq.length}/{SEQ_LEN})</p>
          <div className="flex gap-4 mb-4">
            {userSeq.map((c, i) => <div key={i} className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${ACTIVE_COLORS[c]}`} />)}
            {Array.from({ length: SEQ_LEN - userSeq.length }).map((_, i) => (
              <div key={i} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 border-dashed border-white/30" />
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-4 max-w-lg">
            {ACTIVE_COLORS.map((c, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => handleInput(i)}
                className={`w-28 h-28 md:w-32 md:h-32 rounded-[2rem] ${c} font-black text-white text-xl md:text-2xl shadow-2xl hover:opacity-90 transition-opacity border-2 border-white/10`}>
                {ACTIVE_LABELS[i]}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <p className={`text-2xl font-black ${correct ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {correct ? '🎉 ممتاز! ذاكرة قوية!' : '💡 جيد! تحتاج مزيداً من التدريب'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/** Test C2: Math Speed */
function MathSpeedTest({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  
  const TOTAL = level === 'primary' ? 3 : level === 'middle' ? 5 : 7;
  const TIME = level === 'primary' ? 25 : level === 'middle' ? 18 : 15;

  const [started, setStarted] = useState(false);
  const [q, setQ] = useState<{ a: number; b: number; op: '+' | '-'; ans: number } | null>(null);
  const [qNum, setQNum] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [ended, setEnded] = useState(false);
  const [chosenOpts, setChosenOpts] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const makeQ = () => {
    let a, b, op: '+' | '-' | '*';
    if (level === 'primary') {
       a = Math.floor(Math.random() * 10) + 1;
       b = Math.floor(Math.random() * 10) + 1;
       op = '+';
    } else if (level === 'middle') {
       a = Math.floor(Math.random() * 20) + 5;
       b = Math.floor(Math.random() * 15) + 1;
       op = Math.random() > 0.5 ? '+' : '-';
    } else {
       a = Math.floor(Math.random() * 50) + 10;
       b = Math.floor(Math.random() * 30) + 2;
       op = Math.random() > 0.6 ? '+' : Math.random() > 0.3 ? '-' : '*';
       if (op === '*') { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 9) + 2; }
    }
    
    const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;

    const opts = new Set<number>([ans]);
    while (opts.size < 3) opts.add(ans + Math.floor(Math.random() * 6) - 3);
    const shuffled = [...opts].sort(() => Math.random() - 0.5);
    setChosenOpts(shuffled);
    setQ({ a, b, op, ans });
  };

  const start = () => {
    setStarted(true);
    makeQ();
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current!); finish(-1); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const finish = (finalCorrect: number) => {
    clearInterval(intervalRef.current!);
    setEnded(true);
    const c = finalCorrect >= 0 ? finalCorrect : correct;
    const ratio = c / TOTAL;
    const score = ratio >= 0.8 ? 95 : ratio >= 0.6 ? 82 : ratio >= 0.4 ? 65 : ratio >= 0.2 ? 45 : 20;
    setTimeout(() => onDone(score), 1600);
  };

  const handleAnswer = (val: number) => {
    if (ended || !q) return;
    const isCorrect = val === q.ans;
    const nc = isCorrect ? correct + 1 : correct;
    if (isCorrect) setCorrect(nc);
    const nextQ = qNum + 1;
    setQNum(nextQ);
    if (nextQ >= TOTAL) { finish(nc); return; }
    makeQ();
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const OP_TEXT = level === 'primary' ? 'عمليات جمع بسيطة' : level === 'middle' ? 'عمليات رياضية متنوعة' : 'معادلات حسابية متقدمة (شاملة للضرب)';
  
  if (!started) return (
    <div className="flex flex-col items-center gap-8 py-6">
      <p className="text-white/95 text-center text-3xl font-black max-w-2xl leading-tight drop-shadow-md">أجب على {TOTAL} {OP_TEXT} في {TIME} ثانية!</p>
      <Button onClick={start} className="bg-violet-600 hover:bg-violet-500 text-white rounded-3xl h-16 text-2xl px-14 font-black shadow-2xl mt-4">ابدأ التحدي</Button>
    </div>
  );

  if (ended) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col items-center gap-4 py-8">
      <p className="text-[4rem] font-black text-white drop-shadow-xl">{correct}/{TOTAL} صحيحة</p>
      <p className={`text-3xl font-black drop-shadow-md ${correct >= 4 ? 'text-emerald-400' : correct >= 2 ? 'text-yellow-400' : 'text-rose-400'}`}>
        {correct >= 4 ? '🔥 سرعة حسابية ممتازة!' : correct >= 2 ? '👍 جيد، يمكن تحسينها' : '💡 تحتاج تدريباً إضافياً'}
      </p>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 mb-4">
        <Timer className="w-8 h-8 text-yellow-400" />
        <span className={`text-5xl font-black drop-shadow-md ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
        <span className="text-white/80 text-2xl font-bold mr-6">السؤال {qNum + 1}/{TOTAL}</span>
      </div>
      {q && (
        <>
          <div className="text-[5rem] font-black text-white py-6 tracking-widest drop-shadow-2xl text-center" dir="ltr">
            {q.a} {q.op} {q.b} = ?
          </div>
          <div className="flex gap-6 flex-wrap justify-center mt-6">
            {chosenOpts.map((opt, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => handleAnswer(opt)}
                className="w-32 h-28 rounded-[2rem] border-2 border-white/20 bg-white/10 text-white text-5xl font-black shadow-2xl hover:bg-violet-500/50 hover:border-violet-300 transition-all">
                {opt}
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Test C3: Attention Grid */
function AttentionGrid({ onDone }: { onDone: (score: number) => void }) {
  const getUserId = () => { try { return JSON.parse(localStorage.getItem('user') || '{}')?.id || 'default'; } catch { return 'default'; } };
  const uid = getUserId();
  const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
  
  const TARGET = 7; 
  const SIZE = level === 'primary' ? 3 : level === 'middle' ? 5 : 7; 
  const TIME = level === 'primary' ? 15 : level === 'middle' ? 12 : 9;

  const [started, setStarted] = useState(false);
  const [grid, setGrid] = useState<number[][]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [found, setFound] = useState(false);
  const [failed, setFailed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t0 = useRef(0);

  const buildGrid = () => {
    const cells: number[] = [];
    let placed = false;
    for (let i = 0; i < SIZE * SIZE; i++) {
      if (!placed && (Math.random() > 0.65 || i === SIZE * SIZE - 1)) { cells.push(TARGET); placed = true; }
      else { let n; do { n = Math.floor(Math.random() * 9) + 1; } while (n === TARGET); cells.push(n); }
    }
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
    const rows: number[][] = [];
    for (let r = 0; r < SIZE; r++) rows.push(cells.slice(r * SIZE, (r + 1) * SIZE));
    return rows;
  };

  const start = () => {
    setGrid(buildGrid()); setStarted(true); setTimeLeft(TIME); t0.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(intervalRef.current!); setFailed(true); setTimeout(() => onDone(30), 1800); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  const tap = (v: number) => {
    if (found || failed) return;
    if (v === TARGET) {
      clearInterval(intervalRef.current!);
      const el = Date.now() - t0.current;
      setFound(true);
      
      let score = 0;
      if (level === 'primary') {
         score = el < 5000 ? 98 : el < 8000 ? 80 : el < 12000 ? 60 : 42;
      } else if (level === 'middle') {
         score = el < 3000 ? 98 : el < 6000 ? 80 : el < 9000 ? 60 : 42;
      } else {
         score = el < 2000 ? 98 : el < 4000 ? 80 : el < 7000 ? 60 : 42;
      }
      setTimeout(() => onDone(score), 1600);
    }
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  if (!started) return (
    <div className="flex flex-col items-center gap-8 py-6">
      <p className="text-white/95 text-center text-3xl font-black max-w-2xl leading-tight drop-shadow-md">ابحث عن الرقم <span className="text-yellow-400 text-5xl px-2">{TARGET}</span> في الشبكة في أقل من {TIME} ثانية!</p>
      <Button onClick={start} className="bg-violet-600 hover:bg-violet-500 text-white rounded-3xl h-16 text-2xl px-14 font-black shadow-2xl mt-4">ابدأ التحدي</Button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-4 mb-2">
        <Timer className="w-8 h-8 text-yellow-400" />
        <span className={`text-4xl font-black drop-shadow-md ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
        <span className="text-white/80 text-xl font-bold font-black px-4">ابحث عن: <span className="text-yellow-400 text-3xl">{TARGET}</span></span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {grid.map((row, ri) => row.map((val, ci) => (
          <motion.button key={`${ri}-${ci}`} whileTap={{ scale: 0.85 }} onClick={() => tap(val)}
            className={`w-20 h-20 rounded-3xl border-2 shadow-2xl font-black text-3xl transition-all ${found && val === TARGET ? 'bg-emerald-500 border-emerald-400 text-white scale-110' : 'bg-white/10 border-white/20 text-white hover:bg-white/30'}`}>
            {val}
          </motion.button>
        )))}
      </div>
      {(found || failed) && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`font-bold ${found ? 'text-emerald-400' : 'text-rose-400'}`}>
          {found ? '🎯 وجدته! تركيزك قوي' : '⏰ انتهى الوقت! تحتاج تدريباً'}
        </motion.p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ── PSYCHOLOGICAL QUESTIONNAIRE ───────────────────────────────────
// ─────────────────────────────────────────────────────────────────
function PsychologicalAssessment({ onDone }: { onDone: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questions = [
    { id: 'stress', label: 'مستوى الإجهاد والضغط اليوم', icon: AlertTriangle, low: 'منخفض', high: 'مرتفع', reverse: true },
    { id: 'motivation', label: 'رغبتك في ممارسة الرياضة الآن', icon: Star, low: 'ضعيفة', high: 'قوية', reverse: false },
    { id: 'sleep', label: 'جودة نومك البارحة', icon: Moon, low: 'سيء', high: 'ممتاز', reverse: false },
    { id: 'energy', label: 'مستوى طاقتك الحالي', icon: Battery, low: 'منخفضة', high: 'مرتفعة', reverse: false },
  ];

  const handleChange = (id: string, val: number) => setAnswers(prev => ({ ...prev, [id]: val }));

  const allDone = questions.every(q => answers[q.id] !== undefined);

  const submit = () => {
    const scores = questions.map(q => {
      const raw = answers[q.id] ?? 3;
      return q.reverse ? (6 - raw) * 20 : raw * 20;
    });
    onDone(avg(scores));
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-4">
      <p className="text-white/95 text-center text-3xl font-black mb-4 drop-shadow-md leading-tight">هذا يساعدنا على فهم حالتك النفسية والجسدية اليوم</p>
      {questions.map(q => {
        const Icon = q.icon;
        const val = answers[q.id] ?? 0;
        return (
          <div key={q.id} className="bg-white/10 rounded-[2rem] border border-white/20 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/30 flex items-center justify-center">
                <Icon className="w-6 h-6 text-rose-300" />
              </div>
              <span className="text-2xl font-black text-white">{q.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-white/80 w-24 text-right leading-tight">{q.low}</span>
              <div className="flex-1 flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map(v => (
                  <motion.button key={v} whileTap={{ scale: 0.9 }}
                    onClick={() => handleChange(q.id, v)}
                    className={`w-16 h-16 rounded-2xl font-black text-2xl transition-all ${val === v ? 'bg-rose-500 text-white scale-110 shadow-2xl' : 'bg-white/10 text-white/80 border 2 border-white/20 hover:bg-white/30'}`}>
                    {v}
                  </motion.button>
                ))}
              </div>
              <span className="text-lg font-bold text-white/80 w-24 leading-tight">{q.high}</span>
            </div>
          </div>
        );
      })}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Button onClick={submit} className="w-full bg-rose-500 hover:bg-rose-400 text-white rounded-3xl h-16 text-2xl font-black shadow-2xl transition hover:scale-[1.02]">
              تأكيد الإجابات ✓
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ── REHABILITATION CHECK ──────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
function RehabCheck({ onDone }: { onDone: (score: number, needsRehab: boolean) => void }) {
  const [painAreas, setPainAreas] = useState<string[]>([]);
  const [injury, setInjury] = useState<boolean | null>(null);
  const [medAdvice, setMedAdvice] = useState<boolean | null>(null);

  const areas = ['الركبة', 'الظهر', 'الكاحل', 'الكتف', 'المعصم', 'الرقبة', 'لا توجد'];

  const toggleArea = (a: string) => {
    if (a === 'لا توجد') { setPainAreas(['لا توجد']); return; }
    setPainAreas(prev => {
      const without = prev.filter(x => x !== 'لا توجد');
      return without.includes(a) ? without.filter(x => x !== a) : [...without, a];
    });
  };

  const allDone = painAreas.length > 0 && injury !== null && medAdvice !== null;

  const submit = () => {
    const needsRehab = painAreas.some(a => a !== 'لا توجد') || injury === true || medAdvice === true;
    const score = needsRehab ? 40 : 90;
    onDone(score, needsRehab);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-4">
      <p className="text-white/95 text-center text-3xl font-black mb-4 drop-shadow-md leading-tight">نريد التأكد من سلامتك قبل البدء. أجب بصدق.</p>

      {/* Pain areas */}
      <div className="bg-white/10 rounded-[2rem] border border-white/20 p-8 shadow-xl backdrop-blur-md">
        <p className="text-2xl font-black text-white mb-6 flex items-center gap-4"><AlertTriangle className="w-8 h-8 text-emerald-300" />هل تشعر بألم في أي منطقة؟</p>
        <div className="flex flex-wrap gap-4">
          {areas.map(a => (
            <motion.button key={a} whileTap={{ scale: 0.95 }}
              onClick={() => toggleArea(a)}
              className={`px-6 py-4 rounded-2xl text-xl font-bold transition-all border-2 ${painAreas.includes(a) ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg scale-105' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
              {a}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Injury */}
      <div className="bg-white/10 rounded-[2rem] border border-white/20 p-8 shadow-xl backdrop-blur-md">
        <p className="text-2xl font-black text-white mb-6">هل لديك إصابة حديثة؟</p>
        <div className="flex gap-6">
          {[{ v: false, label: 'لا ✓', style: 'bg-emerald-500 border-emerald-400 text-white shadow-lg' },
          { v: true, label: 'نعم', style: 'bg-rose-500 border-rose-400 text-white shadow-lg' }].map(opt => (
            <motion.button key={String(opt.v)} whileTap={{ scale: 0.95 }}
              onClick={() => setInjury(opt.v)}
              className={`flex-1 py-6 rounded-2xl border-2 font-black text-2xl transition-all ${injury === opt.v ? opt.style : 'bg-white/10 border-white/20 text-white hover:bg-white/30'}`}>
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Med advice */}
      <div className="bg-white/10 rounded-[2rem] border border-white/20 p-8 shadow-xl backdrop-blur-md">
        <p className="text-2xl font-black text-white mb-6">هل أوصاك طبيب بتجنّب نشاط معين؟</p>
        <div className="flex gap-6">
          {[{ v: false, label: 'لا ✓', style: 'bg-emerald-500 border-emerald-400 text-white shadow-lg' },
          { v: true, label: 'نعم', style: 'bg-rose-500 border-rose-400 text-white shadow-lg' }].map(opt => (
            <motion.button key={String(opt.v)} whileTap={{ scale: 0.95 }}
              onClick={() => setMedAdvice(opt.v)}
              className={`flex-1 py-6 rounded-2xl border-2 font-black text-2xl transition-all ${medAdvice === opt.v ? opt.style : 'bg-white/10 border-white/20 text-white hover:bg-white/30'}`}>
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Button onClick={submit} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-3xl h-16 text-2xl font-black shadow-2xl transition hover:scale-[1.02]">
              إنهاء الفحص الصحي ✓
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ── DOMAIN RUNNER ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
type Step = { domainIdx: number; testIdx: number; label: string; subtitle: string };

const ALL_STEPS: Step[] = [
  { domainIdx: 0, testIdx: 0, label: 'رد الفعل', subtitle: 'قياس سرعة استجابتك البصرية' },
  { domainIdx: 0, testIdx: 1, label: 'التوازن', subtitle: 'قياس ثباتك وتوازن جسمك' },
  { domainIdx: 0, testIdx: 2, label: 'القوة والمرونة', subtitle: 'تقييم قوتك العضلية ومرونتك' },
  { domainIdx: 1, testIdx: 0, label: 'الذاكرة العملية', subtitle: 'تذكر وتكرار التسلسل' },
  { domainIdx: 1, testIdx: 1, label: 'سرعة الحساب', subtitle: 'حل مسائل رياضية سريعاً' },
  { domainIdx: 1, testIdx: 2, label: 'الانتباه والتركيز', subtitle: 'البحث السريع في المعلومات' },
  { domainIdx: 2, testIdx: 0, label: 'الاستبيان النفسي', subtitle: 'الإجهاد، الدافعية، النوم، الطاقة' },
  { domainIdx: 3, testIdx: 0, label: 'فحص السلامة', subtitle: 'الألم، الإصابات، التوصيات الطبية' },
];

// ─────────────────────────────────────────────────────────────────
// DOMAIN OVERVIEW
// ─────────────────────────────────────────────────────────────────
function DomainOverview({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-center px-8"
      dir="rtl"
      style={{ background: 'linear-gradient(150deg,#0F172A 0%,#1E3A8A 45%,#312E81 100%)', fontFamily: "'Almarai','Tajawal',sans-serif" }}
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-8">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <span className="inline-flex items-center gap-2 text-sm font-black px-5 py-2 rounded-full uppercase tracking-widest"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.24)', backdropFilter: 'blur(8px)' }}>
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            اختبار البصمة الحركية
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
          className="font-black text-white leading-tight text-center"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', letterSpacing: '-0.5px' }}
        >
          اختبار شامل في 4 مجالات رئيسية
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl font-medium text-center mx-auto"
          style={{ color: 'rgba(255,255,255,0.72)', maxWidth: '380px' }}
        >
          مدة تقريبية 4–5 دقائق · سنُنشئ بصمتك الحركية الفريدة
        </motion.p>

        {/* Domain cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {DOMAINS.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="rounded-2xl p-4 flex flex-col items-center gap-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.22)' }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-black text-sm leading-tight">{d.label}</p>
                <p className="text-white/55 text-xs font-medium">{d.tests} اختبارات</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} className="w-full">
          <button
            onClick={onStart}
            className="w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#1E3A8A', boxShadow: '0 16px 48px rgba(0,0,0,0.30)' }}
          >
            ابدأ الاختبارات 🎯
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN ENGINE
// ─────────────────────────────────────────────────────────────────
export function FTUEAssessmentEngine({ onDone, onSkip }: Props) {
  const [showOverview, setShowOverview] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepDone, setStepDone] = useState(false);

  // Raw scores per step
  const [rawScores, setRawScores] = useState<Record<number, number>>({});
  const [needsRehab, setNeedsRehab] = useState(false);

  const curStep = ALL_STEPS[stepIdx];
  const totalSteps = ALL_STEPS.length;
  const domainDef = DOMAINS[curStep.domainIdx];
  const DomainIcon = domainDef.icon;
  const progress = (stepIdx / totalSteps) * 100;

  // Dynamically change background
  useEffect(() => {
    if (showOverview) return;
    const el = document.getElementById('ftue-bg-container');
    if (el) {
      const bgs: Record<string, string> = {
        motor: 'linear-gradient(150deg,#064E3B 0%,#0F172A 100%)', // darker teal to dark blue
        cognitive: 'linear-gradient(150deg,#312E81 0%,#0F172A 100%)', // deep indigo to dark blue
        psychological: 'linear-gradient(150deg,#831843 0%,#0F172A 100%)', // deep rose/pink to dark blue
        rehab: 'linear-gradient(150deg,#064E3B 0%,#0F172A 100%)', // emerald to dark blue
      };
      el.style.background = bgs[domainDef.id] || '#060B18';
    }
    return () => {
      if (el) el.style.background = '#060B18';
    };
  }, [domainDef.id, showOverview]);

  const handleTestDone = (score: number, rehab = false) => {
    setRawScores(prev => ({ ...prev, [stepIdx]: score }));
    if (rehab) setNeedsRehab(true);
    setStepDone(true);
  };

  const handleNext = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(i => i + 1);
      setStepDone(false);
    } else {
      buildAndFinish();
    }
  };

  const buildAndFinish = () => {
    // Motor: steps 0,1,2
    const motorAvg = avg([rawScores[0] ?? 60, rawScores[1] ?? 60, rawScores[2] ?? 60]);
    // Cognitive: steps 3,4,5
    const cogAvg = avg([rawScores[3] ?? 60, rawScores[4] ?? 60, rawScores[5] ?? 60]);
    // Psychological: step 6
    const psychScore = rawScores[6] ?? 60;
    // Rehab: step 7
    const rehabScore = rawScores[7] ?? 80;

    const result: AssessmentResult = {
      motor: { id: 'motor', label: 'الأداء الحركي', score: motorAvg, subscores: { reaction: rawScores[0] ?? 60, balance: rawScores[1] ?? 60, strength: rawScores[2] ?? 60 } },
      cognitive: { id: 'cognitive', label: 'الأداء المعرفي', score: cogAvg, subscores: { memory: rawScores[3] ?? 60, math: rawScores[4] ?? 60, attention: rawScores[5] ?? 60 } },
      psychological: { id: 'psychological', label: 'الجانب النفسي', score: psychScore, subscores: { overall: psychScore } },
      rehab: { id: 'rehab', label: 'التأهيل والسلامة', score: rehabScore, subscores: { safety: rehabScore } },
      needsRehab,
      completedAt: new Date().toISOString(),
    };
    onDone(result);
  };

  const isLastStep = stepIdx === totalSteps - 1;

  if (showOverview) {
    return (
      <div className="h-full flex flex-col" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400 text-xs font-bold">الاختبار الشامل</span>
          <button onClick={onSkip} className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">تخطي</button>
        </div>
        <DomainOverview onStart={() => setShowOverview(false)} />
      </div>
    );
  }

  const isNewDomain = stepIdx === 0 || ALL_STEPS[stepIdx - 1]?.domainIdx !== curStep.domainIdx;

  return (
    <div className="flex flex-col h-full overflow-hidden" dir="rtl">
      {/* Top bar */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs font-bold">الاختبار {stepIdx + 1} من {totalSteps}</span>
          <button onClick={onSkip} className="text-slate-500 hover:text-slate-300 text-[11px] font-bold transition-colors">تخطي</button>
        </div>
        {/* Overall progress */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div className="h-full rounded-full bg-gradient-to-l from-blue-500 to-indigo-500"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
        {/* Domain dots */}
        <div className="flex gap-1.5">
          {ALL_STEPS.map((s, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < stepIdx ? `bg-gradient-to-l ${DOMAINS[s.domainIdx].color}` : i === stepIdx ? 'bg-white/60' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Domain transition banner */}
      <AnimatePresence>
        {isNewDomain && (
          <motion.div key={`domain-${curStep.domainIdx}`}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-3 mb-4 px-4 py-2.5 rounded-2xl bg-gradient-to-l ${domainDef.color} bg-opacity-20`}>
            <DomainIcon className="w-5 h-5 text-white flex-shrink-0" />
            <div>
              <p className="text-white font-black text-sm">{domainDef.label}</p>
              <p className="text-white/60 text-[11px]">المجال {curStep.domainIdx + 1} من {DOMAINS.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test header */}
      <div className="flex items-center gap-5 mb-8 mt-2">
        <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${domainDef.color} flex items-center justify-center shadow-2xl border-2 border-white/20`} style={{ backdropFilter: 'blur(8px)' }}>
          <DomainIcon className="w-10 h-10 text-white drop-shadow-lg" />
        </div>
        <div>
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">{curStep.label}</h3>
          <p className="text-white/80 text-xl mt-1.5 font-medium">{curStep.subtitle}</p>
        </div>
      </div>

      {/* Test content (scrollable area) */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-20 pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={stepIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="h-full">
            {stepIdx === 0 && <ReactionTest onDone={handleTestDone} />}
            {stepIdx === 1 && <BalanceTest onDone={handleTestDone} />}
            {stepIdx === 2 && <StrengthFlexTest onDone={handleTestDone} />}
            {stepIdx === 3 && <MemoryTest onDone={handleTestDone} />}
            {stepIdx === 4 && <MathSpeedTest onDone={handleTestDone} />}
            {stepIdx === 5 && <AttentionGrid onDone={handleTestDone} />}
            {stepIdx === 6 && <PsychologicalAssessment onDone={handleTestDone} />}
            {stepIdx === 7 && <RehabCheck onDone={(score, rehab) => handleTestDone(score, rehab)} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button (fixed at bottom or scrollable) */}
      <AnimatePresence>
        {stepDone && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex-shrink-0">
            <Button onClick={handleNext}
              className={`w-full text-white rounded-2xl h-14 text-base font-black flex items-center justify-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95 ${isLastStep ? 'bg-gradient-to-l from-orange-500 to-rose-600' : `bg-gradient-to-l ${domainDef.color}`}`}>
              {isLastStep
                ? <><Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />عرض نتائجك</>
                : <>الاختبار التالي <ChevronLeft className="w-5 h-5" /></>
              }
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FTUEAssessmentEngine;
