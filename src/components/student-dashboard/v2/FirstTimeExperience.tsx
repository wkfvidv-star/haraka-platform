import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Activity, Brain, Zap, PlayCircle,
  ChevronRight, ChevronLeft, Target, Video,
  MessageSquare, UserCheck, ArrowLeft, X,
} from 'lucide-react';
import { FTUEAssessmentEngine, type AssessmentResult } from './FTUEAssessmentEngine';
import { FTUEResults } from './FTUEResults';
import { PreAssessmentSurveyModal } from './PreAssessmentSurveyModal';

type Phase = 'slides' | 'pre_assessment' | 'assessment' | 'results';
const VALID_PHASES: Phase[] = ['slides', 'pre_assessment', 'assessment', 'results'];

interface Props {
  onComplete: () => void;
  studentName?: string;
}

const SLIDES = [
  {
    id: 1,
    badge: 'مرحباً بك',
    title: 'منصة حركة\nللتميز الرياضي',
    description: 'منصتك الذكية المتخصصة في تطوير قدراتك البدنية والذهنية. اكتشف إمكانياتك الحقيقية وقِس تقدمك بدقة علمية.',
    icon: Sparkles,
    bg: 'linear-gradient(150deg,#4F0599 0%,#7B2FF7 45%,#C026D3 100%)',
    textLight: true,
  },
  {
    id: 2,
    badge: 'التطوير الحركي',
    title: 'تمارين مصممة\nخصيصاً لك',
    description: 'برامج تدريبية مخصصة لتحسين سرعتك، رشاقتك، توازنك وتنسيقك الحركي — مبنية على بصمتك الفردية.',
    icon: Activity,
    bg: 'linear-gradient(150deg,#064E3B 0%,#059669 45%,#34D399 100%)',
    textLight: true,
  },
  {
    id: 3,
    badge: 'الذكاء المعرفي',
    title: 'التركيز والقرار\nفي لحظات الضغط',
    description: 'تمارين تفاعلية علمية تطوّر قدرتك على التركيز وسرعة معالجة المعلومات واتخاذ القرارات الصحيحة.',
    icon: Brain,
    bg: 'linear-gradient(150deg,#1E3A8A 0%,#2563EB 45%,#60A5FA 100%)',
    textLight: true,
  },
  {
    id: 4,
    badge: 'الذكاء الاصطناعي',
    title: 'مدرب ذكي\nيعمل معك 24/7',
    description: 'تقنيات متقدمة في خدمتك:',
    icon: Zap,
    bg: 'linear-gradient(150deg,#78350F 0%,#D97706 45%,#FCD34D 100%)',
    textLight: false,
    features: [
      { icon: UserCheck,     label: 'مدرب افتراضي شخصي' },
      { icon: Video,         label: 'تحليل فيديو الأداء' },
      { icon: MessageSquare, label: 'مساعد ذكي تفاعلي' },
      { icon: Target,        label: 'توصيات مخصصة يومياً' },
    ],
  },
  {
    id: 5,
    badge: 'الخطوة الأولى',
    title: 'ابدأ رحلتك\nمع اختبار البصمة',
    description: 'سنُجري معك اختباراً شاملاً في 4 مجالات (4–5 دقائق) لإنشاء بصمتك الحركية الفريدة.',
    icon: PlayCircle,
    bg: 'linear-gradient(150deg,#0C4A6E 0%,#0284C7 45%,#38BDF8 100%)',
    textLight: true,
    isLast: true,
  },
] as const;

const PHASE_LABELS = {
  slides: 'التعرف على المنصة',
  pre_assessment: 'الاستبيان التمهيدي',
  assessment: 'اختبار البصمة الحركية',
  results: 'نتائجك وخطة تدريبك',
};
const PHASE_STEP = { slides: 1, pre_assessment: 2, assessment: 3, results: 4 };

function SlidesPhase({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const slide = SLIDES[idx];
  const isLast = 'isLast' in slide && slide.isLast;
  const Icon = slide.icon;
  const textColor = slide.textLight ? '#FFFFFF' : '#1C0A00';
  const descColor = slide.textLight ? 'rgba(255,255,255,0.78)' : 'rgba(28,10,0,0.68)';

  const next = () => { if (isLast) { onComplete(); return; } setDir(1); setIdx(i => i + 1); };
  const prev = () => { if (idx === 0) return; setDir(-1); setIdx(i => i - 1); };
  const onDrag = (_: any, info: any) => { if (info.offset.x > 60) prev(); else if (info.offset.x < -60) next(); };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  return (
    <div className="flex flex-col h-full relative" dir="rtl">
      {/* Full-screen animated background */}
      <AnimatePresence>
        <motion.div
          key={`bg-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ background: slide.bg }}
        />
      </AnimatePresence>
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/6 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-7 pt-7 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <span style={{ color: textColor }} className="font-black text-base">H</span>
          </div>
          <span style={{ color: textColor, opacity: 0.9 }} className="font-black text-sm tracking-wide">حركة</span>
        </div>
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105"
          style={{ color: textColor, background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <X className="w-3.5 h-3.5" />
          تخطي
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-7 pb-4 flex-shrink-0">
        <div className="h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.18)' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ background: textColor, opacity: 0.75 }}
          />
        </div>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={idx} custom={dir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}
            onDragEnd={onDrag}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 py-4 overflow-y-auto touch-pan-y"
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5 flex-shrink-0">
              <span
                className="inline-flex items-center gap-2 text-sm font-black px-5 py-2 rounded-full tracking-widest uppercase"
                style={{ color: textColor, background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)' }}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: textColor }} />
                {slide.badge}
              </span>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-7 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(16px)', border: '2px solid rgba(255,255,255,0.28)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            >
              <Icon className="w-12 h-12" style={{ color: textColor }} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}
              className="font-black leading-tight mb-5 flex-shrink-0 whitespace-pre-line text-center"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: textColor, letterSpacing: '-0.5px', fontFamily: "'Almarai','Tajawal',sans-serif" }}
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-xl leading-relaxed flex-shrink-0 mb-6 text-center mx-auto"
              style={{ color: descColor, maxWidth: '400px', fontFamily: "'Almarai','Tajawal',sans-serif" }}
            >
              {slide.description}
            </motion.p>

            {/* Features (slide 4) */}
            {'features' in slide && slide.features && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-2.5 mb-6 flex-shrink-0" style={{ maxWidth: '400px' }}
              >
                {slide.features.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <div key={i}
                      className="flex items-center gap-2.5 rounded-2xl px-4 py-3.5"
                      style={{ background: 'rgba(0,0,0,0.16)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}
                    >
                      <FIcon className="w-5 h-5 flex-shrink-0" style={{ color: textColor }} />
                      <span className="text-base font-bold" style={{ color: textColor, opacity: 0.9 }}>{f.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Last CTA */}
            {isLast && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex-shrink-0">
                <button
                  onClick={onComplete}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#0C4A6E', boxShadow: '0 16px 48px rgba(0,0,0,0.28)' }}
                >
                  ابدأ اختبار البصمة الحركية
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="relative z-10 flex-shrink-0 px-7 pb-10 pt-4 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              animate={{ width: i === idx ? 30 : 8, opacity: i === idx ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full cursor-pointer"
              style={{ background: textColor }}
            />
          ))}
          <span className="mr-auto text-sm font-black" style={{ color: textColor, opacity: 0.5 }}>
            {idx + 1} / {SLIDES.length}
          </span>
        </div>

        {!isLast && (
          <div className="flex items-center justify-between">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="flex items-center gap-2 text-base font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-0"
              style={{ color: textColor, background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ChevronRight className="w-5 h-5" /> السابق
            </button>
            <button
              onClick={next}
              className="flex items-center gap-2 text-base font-black px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b', boxShadow: '0 8px 32px rgba(0,0,0,0.22)' }}
            >
              التالي <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export function FirstTimeExperience({ onComplete, studentName }: Props) {
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || 'default';
    } catch {
      return 'default';
    }
  };
  const uid = getUserId();

  const [phase, setPhase] = useState<Phase>(() => {
    const saved = localStorage.getItem(`haraka_ftue_phase_${uid}`);
    return saved && VALID_PHASES.includes(saved as Phase) ? (saved as Phase) : 'slides';
  });
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(() => {
    try {
      const savedScores = localStorage.getItem(`haraka_ftue_scores_${uid}`);
      return savedScores ? JSON.parse(savedScores) : null;
    } catch {
      return null;
    }
  });

  const save = (p: Phase) => localStorage.setItem(`haraka_ftue_phase_${uid}`, p);
  const handleSkip = () => {
    localStorage.removeItem(`haraka_ftue_phase_${uid}`);
    localStorage.setItem(`haraka_ftue_complete_${uid}`, 'true');
    localStorage.setItem(`haraka_ftue_date_${uid}`, new Date().toISOString());
    onComplete();
  };
  const handleSlidesComplete = () => { save('pre_assessment'); setPhase('pre_assessment'); };
  const handlePreAssessmentDone = (data: { educationalLevel: string; activityLevel: string }) => {
    localStorage.setItem(`haraka_student_level_${uid}`, data.educationalLevel);
    save('assessment');
    setPhase('assessment');
  };
  const handleAssessmentDone = (result: AssessmentResult) => {
    localStorage.setItem(`haraka_ftue_scores_${uid}`, JSON.stringify(result));
    setAssessmentResult(result);
    save('results');
    setPhase('results');
  };
  const handleFinalComplete = () => {
    localStorage.removeItem(`haraka_ftue_phase_${uid}`);
    localStorage.setItem(`haraka_ftue_complete_${uid}`, 'true');
    localStorage.setItem(`haraka_ftue_date_${uid}`, new Date().toISOString());
    onComplete();
  };

  const step = PHASE_STEP[phase];

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" dir="rtl" style={{ fontFamily: "'Almarai','Tajawal',sans-serif" }}>

      {phase !== 'slides' && (
        <div id="ftue-bg-container" className="absolute inset-0 transition-all duration-700 ease-in-out" style={{ background: '#060B18' }}>
          <div className="pointer-events-none absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }} />
          <div className="pointer-events-none absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>
      )}

      {phase !== 'slides' && (
        <div className="relative z-10 px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-2.5">
            {(['slides', 'pre_assessment', 'assessment', 'results'] as Phase[]).map((p, i) => (
              <div key={p} className="flex-1 h-[3px] rounded-full transition-all duration-500"
                style={{ background: step > i + 1 ? '#10B981' : step === i + 1 ? '#3B82F6' : 'rgba(255,255,255,0.08)' }}
              />
            ))}
            <span className="text-[11px] font-black whitespace-nowrap mr-1" style={{ color: 'rgba(100,116,139,0.7)' }}>
              {step} / 4
            </span>
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.7)' }}>
            {PHASE_LABELS[phase]}
          </p>
        </div>
      )}

      <div className="relative z-10" style={{ height: phase === 'slides' ? '100%' : 'calc(100% - 80px)', overflow: 'hidden' }}>
        <div className={`h-full flex flex-col ${phase === 'assessment' ? 'px-8 py-6 max-w-4xl mx-auto' : phase === 'results' ? 'px-4 sm:px-8 py-6 max-w-5xl mx-auto overflow-y-auto custom-scrollbar' : ''}`}>
          <AnimatePresence mode="wait">
            {phase === 'slides' && (
              <motion.div key="slides"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }} className="flex-1 min-h-0 flex flex-col h-full"
              >
                <SlidesPhase onComplete={handleSlidesComplete} onSkip={handleSkip} />
              </motion.div>
            )}
            {phase === 'pre_assessment' && (
              <motion.div key="pre_assessment" className="flex-1 flex items-center justify-center">
                 <PreAssessmentSurveyModal 
                    isOpen={true} 
                    onClose={() => handleSkip()} 
                    onComplete={handlePreAssessmentDone} 
                 />
              </motion.div>
            )}
            {phase === 'assessment' && (
              <motion.div key="assessment"
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }} className="flex-1 min-h-0 flex flex-col"
              >
                <FTUEAssessmentEngine onDone={handleAssessmentDone} onSkip={handleSkip} />
              </motion.div>
            )}
            {phase === 'results' && assessmentResult && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FTUEResults result={assessmentResult} studentName={studentName} onComplete={handleFinalComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeExperience;
