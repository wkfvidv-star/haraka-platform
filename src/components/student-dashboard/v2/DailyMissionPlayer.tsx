import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, CheckCircle2, X, Target, Heart, Zap, Trophy, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gamificationService } from '@/services/gamificationService';

// ── Inline confetti burst (no external dependency) ─────────────────
function fireConfetti() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '9999' });
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d')!;
  const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }[] = [];
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  for (let i = 0; i < 140; i++) {
    particles.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20 - 5, color: colors[Math.floor(Math.random() * colors.length)], size: Math.random() * 8 + 4, alpha: 1 });
  }
  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.alpha -= 0.015; ctx.globalAlpha = Math.max(0, p.alpha); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); });
    frame++;
    if (frame < 80) requestAnimationFrame(animate);
    else document.body.removeChild(canvas);
  };
  requestAnimationFrame(animate);
}

interface Mission {
  id: string;
  title: string;
  type: 'fitness' | 'speed' | 'focus';
  durationSeconds: number;
  description: string;
}

interface Props {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number, points: number) => void;
}

type Phase = 'intro' | 'active' | 'rest' | 'result';

export function DailyMissionPlayer({ mission, isOpen, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [timeLeft, setTimeLeft] = useState(mission.durationSeconds);
  const [progress, setProgress] = useState(0);
  const [motivationText, setMotivationText] = useState(() => gamificationService.getSmartMotivation('start'));

  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setTimeLeft(mission.durationSeconds);
      setProgress(0);
    }
  }, [isOpen, mission]);

  // Timer logic
  useEffect(() => {
    if (phase === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          setProgress(((mission.durationSeconds - next) / mission.durationSeconds) * 100);
          if (next === Math.floor(mission.durationSeconds * 0.5)) setMotivationText(gamificationService.getSmartMotivation('half'));
          if (next === 10) setMotivationText(gamificationService.getSmartMotivation('final'));
          return next;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (phase === 'active' && timeLeft === 0) {
      handleFinish();
    }
  }, [phase, timeLeft, mission.durationSeconds]);

  const handleFinish = () => {
    const score = 95;
    const xpGain = 200;
    const { unlockedChallenge } = gamificationService.addXP(xpGain, score);
    setPhase('result');
    fireConfetti();
    if (unlockedChallenge) fireConfetti(); // double burst for challenge unlock
    setTimeout(() => {
      onComplete(score, xpGain);
    }, 4000);
  };

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s.toString().padStart(2, '0')}`;
  };

  const getThemeColor = () => {
    if (mission.type === 'fitness') return { text: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]' };
    if (mission.type === 'speed') return { text: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.3)]' };
    return { text: 'text-indigo-400', border: 'border-indigo-500', bg: 'bg-indigo-500', glow: 'shadow-[0_0_40px_rgba(99,102,241,0.3)]' };
  };

  const theme = getThemeColor();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900 overflow-hidden rtl flex justify-center items-center font-['Almarai']" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${theme.bg} rounded-full blur-[150px]`} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px]" />
      </div>

      {/* Header Close */}
      <button onClick={onClose} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50">
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          
          {/* Phase: INTRO */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center w-full">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center ${theme.glow}`}>
                  {mission.type === 'fitness' ? <Heart className={`w-12 h-12 ${theme.text}`} /> : mission.type === 'speed' ? <Zap className={`w-12 h-12 ${theme.text}`} /> : <Target className={`w-12 h-12 ${theme.text}`} />}
                </div>
              </div>
              <h2 className="text-4xl font-black text-white mb-4">مهمة اليوم: {mission.title}</h2>
              <p className="text-xl font-bold text-slate-300 mb-12 max-w-md mx-auto leading-relaxed">{mission.description}</p>
              
              <div className="bg-white/10 w-32 mx-auto rounded-2xl py-3 border border-white/5 mb-10 shadow-inner">
                <span className="text-2xl font-black text-white">{formatTime(mission.durationSeconds)}</span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('active')}
                className={`w-full max-w-sm mx-auto ${theme.bg} text-white font-black text-xl py-5 rounded-2xl ${theme.glow} flex items-center justify-center gap-3 active:scale-95 transition-all`}
              >
                <PlayCircle className="w-6 h-6 fill-white" />
                لنبذل أقصى جهد الآن!
              </motion.button>
            </motion.div>
          )}

          {/* Phase: ACTIVE TIMER */}
          {phase === 'active' && (
            <motion.div key="active" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center w-full">
               <h3 className="text-2xl font-black text-slate-300 mb-8">{mission.title}</h3>
               
               {/* Massive Timer Ring */}
               <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center mb-10">
                 {/* Background static ring */}
                 <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />
                 
                 {/* Animated Progress Ring */}
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle 
                     cx="50%" cy="50%" r="calc(50% - 6px)"
                     fill="none" 
                     stroke="currentColor" strokeWidth="12" 
                     strokeDasharray="100 100" // Not real SVG dash array logic for dynamic yet, using framer below
                     className={`text-transparent`}
                   />
                   <motion.circle
                     cx="50%" cy="50%" r="calc(50% - 6px)"
                     fill="none" 
                     stroke="currentColor" strokeWidth="12"
                     strokeDasharray={`${progress} 100`} // Approximation, requires real length but for MVP this handles simple CSS / motion length
                     strokeLinecap="round"
                     className={`${theme.text}`}
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: progress / 100 }}
                     transition={{ duration: 0.5 }}
                   />
                 </svg>

                 {/* Timer Text */}
                 <div className="relative z-10 flex flex-col items-center">
                   <span className="text-[5rem] font-black tracking-tight text-white leading-none shadow-sm">{formatTime(timeLeft)}</span>
                 </div>
               </div>

               {/* Motivation Engine */}
               <motion.div 
                 key={motivationText} // re-animates on change
                 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} 
                 className={`text-2xl font-black ${theme.text} bg-white/5 px-6 py-3 rounded-full border border-white/10`}
               >
                 {motivationText}
               </motion.div>
            </motion.div>
          )}

          {/* Phase: RESULT */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="text-center">
              <div className="flex justify-center mb-6">
                 <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                 </div>
              </div>
              <h2 className="text-5xl font-black text-white mb-4">أداء بطل!</h2>
              <p className="text-2xl font-bold text-slate-300 mb-10">لقد أتممت المهمة بنجاح تام.</p>
              
              <div className="flex justify-center gap-6 mb-10">
                 <div className="bg-white/10 p-6 rounded-2xl border border-emerald-500/30 flex px-8 flex-col items-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                    <span className="text-4xl font-black text-white">+200</span>
                    <span className="text-sm font-bold text-slate-400 mt-1 uppercase">نقطة XP</span>
                 </div>
                 <div className="bg-white/10 p-6 rounded-2xl border border-blue-500/30 flex px-8 flex-col items-center">
                    <Flame className="w-8 h-8 text-orange-400 mb-2" />
                    <span className="text-4xl font-black text-white">95%</span>
                    <span className="text-sm font-bold text-slate-400 mt-1 uppercase">كفاءة الأداء</span>
                 </div>
              </div>

              <button disabled onClick={onClose} className="text-slate-400 font-bold flex items-center justify-center gap-2 mx-auto disabled:opacity-50 mt-4">
                 <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-white animate-spin" />
                 جاري حفظ النتيجة والعودة للرئيسية...
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default DailyMissionPlayer;
