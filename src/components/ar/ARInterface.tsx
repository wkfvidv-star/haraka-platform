import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronRight, Play, Camera, Zap, Star, Trophy, Timer, ArrowLeft } from 'lucide-react';

// =====================================================================
// AR INTERFACE — World-class, Arabic-first, User-Friendly
// Nike Training Club / Apple Fitness+ style
// =====================================================================

type Screen = 'home' | 'howto' | 'session' | 'done';

interface ARExercise {
  id: string;
  title: string;
  emoji: string;
  category: string;
  duration: string;
  level: string;
  levelColor: string;
  desc: string;
  what: string;     // what is this
  steps: string[];  // how to do it
  points: number;
}

const arExercises: ARExercise[] = [
  {
    id: 'push-ar',
    title: 'تمرين الضغط الموجّه',
    emoji: '💪',
    category: 'قوة الجزء العلوي',
    duration: '5 دقائق',
    level: 'مبتدئ',
    levelColor: 'bg-emerald-100 text-emerald-700',
    desc: 'مدرب افتراضي يوجّهك في وقت حقيقي ويصحح وضعية يديك وظهرك خطوة بخطوة.',
    what: 'تفتح الكاميرا وترى نقاطاً ملونة مرسومة فوق جسمك تُظهر كيف يحلل النظام حركتك.',
    steps: ['قف أمام الكاميرا بمسافة 2 متر', 'سيظهر مدرب افتراضي بجانبك', 'اتبع الإرشادات الصوتية', 'النقاط الخضراء = صح، الحمراء = يحتاج تعديل'],
    points: 150,
  },
  {
    id: 'balance-ar',
    title: 'تحدي التوازن التفاعلي',
    emoji: '🎯',
    category: 'توازن وتنسيق',
    duration: '10 دقائق',
    level: 'متوسط',
    levelColor: 'bg-blue-100 text-blue-700',
    desc: 'استهدف النقاط الطائرة بحركات جسمك — تمرين وألعاب في آنٍ واحد.',
    what: 'تظهر دوائر ملوّنة في الهواء عليك لمسها بيديك أو قدميك. النظام يحسب سرعتك ودقتك.',
    steps: ['قف في مكان مضاء جيداً', 'ستظهر النقاط أمامك على الشاشة', 'القفز + المد لتصل إليها', 'كل نقطة = XP إضافي'],
    points: 200,
  },
  {
    id: 'squat-ar',
    title: 'القرفصاء بالذكاء الاصطناعي',
    emoji: '🦵',
    category: 'قوة الجزء السفلي',
    duration: '8 دقائق',
    level: 'مبتدئ',
    levelColor: 'bg-emerald-100 text-emerald-700',
    desc: 'يقيس النظام زاوية ركبتك وورك في كل تكرار ويعطيك تصحيحاً فورياً بالصوت.',
    what: 'يرسم النظام خطوطاً على مفاصلك ويقيس الزوايا. تسمع "أحسنت" أو "اخفض أكثر" مباشرةً.',
    steps: ['قف أمام الكاميرا وجهاً للشاشة', 'ابدأ بالقرفصاء ببطء', 'الصوت يرشدك في كل حركة', 'أكمل 15 تكراراً للحصول على النقاط'],
    points: 180,
  },
  {
    id: 'cardio-ar',
    title: 'كارديو الواقع المعزز',
    emoji: '⚡',
    category: 'قلب وأوعية',
    duration: '12 دقيقة',
    level: 'متقدم',
    levelColor: 'bg-orange-100 text-orange-700',
    desc: 'سباق افتراضي مع لاعبين من مختلف الولايات — حرّك جسمك لتفوز.',
    what: 'يظهر ملعب افتراضي على شاشتك والاعبون الآخرون. حركة قدميك تحرّك شخصيتك في السباق.',
    steps: ['تأكد من وجود مساحة 3×3 متر', 'اختر مستوى السباق', 'تحرك لتسبق الآخرين', 'الفائز يحصل على شارة خاصة'],
    points: 300,
  },
];

interface SessionData {
  score: number;
  reps: number;
  accuracy: number;
  calories: number;
  time: number;
}

export const ARInterface: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selected, setSelected] = useState<ARExercise | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = (ex: ARExercise) => {
    setSelected(ex);
    setScreen('session');
    setSessionTime(0);
    timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    // Auto-finish after 30s for demo
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setSessionData({
        score: 94,
        reps: 12,
        accuracy: 89,
        calories: Math.round(ex.points / 4),
        time: 30,
      });
      setScreen('done');
    }, 30000);
  };

  const endSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionData({
      score: 94,
      reps: 12,
      accuracy: 89,
      calories: Math.round((selected?.points || 150) / 4),
      time: sessionTime,
    });
    setScreen('done');
  };

  const reset = () => {
    setScreen('home');
    setSelected(null);
    setSessionData(null);
    setSessionTime(0);
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-5 pb-20 lg:pb-0 animate-in fade-in zoom-in-95 duration-500" dir="rtl">

      {/* ── HOME SCREEN ── */}
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

            {/* Hero */}
            <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-[2rem] p-6 relative overflow-hidden border border-violet-800">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-violet-500/30 rounded-2xl flex items-center justify-center text-xl">🥽</div>
                  <span className="text-[10px] font-black bg-violet-500/30 text-violet-200 px-2.5 py-1 rounded-xl">الواقع المعزز الرياضي</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">التدريب بالواقع المعزز</h2>
                <p className="text-violet-300 text-sm leading-relaxed max-w-md mb-4">
                  تفتح كاميرتك فيظهر مدرب افتراضي أمامك — يراقب حركتك، يصحح أخطاءك، ويمنحك نقاطاً في الوقت الحقيقي.
                </p>
                {/* How it works — 3 steps */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { emoji: '📸', title: 'افتح الكاميرا', desc: 'وقف بمسافة 2 متر' },
                    { emoji: '🤖', title: 'الذكاء يرصدك', desc: 'يحلل حركتك فوراً' },
                    { emoji: '🏆', title: 'اكسب نقاطاً', desc: 'كل تكرار صحيح = XP' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
                      <div className="text-xl mb-1">{s.emoji}</div>
                      <p className="text-white font-black text-xs">{s.title}</p>
                      <p className="text-violet-300 text-[10px] font-medium">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What you need */}
            <div className="bg-amber-50 rounded-[1.5rem] border border-amber-200 p-4 flex gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-black text-amber-900 text-sm">ستحتاج فقط:</p>
                <p className="text-amber-700 text-xs font-medium mt-0.5">كاميرا الهاتف أو الحاسوب + مساحة 2×2 متر + إضاءة جيدة</p>
              </div>
            </div>

            {/* Exercise Cards */}
            <div>
              <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-violet-500 rounded-full" /> تمارين الواقع المعزز المتاحة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arExercises.map((ex, i) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden group"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-2xl">{ex.emoji}</div>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm leading-tight">{ex.title}</h4>
                            <p className="text-slate-400 text-[10px] font-bold">{ex.category}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${ex.levelColor}`}>{ex.level}</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">{ex.desc}</p>
                      {/* Mini step explainer */}
                      <div className="bg-violet-50 rounded-2xl p-3 mb-3">
                        <p className="text-violet-800 font-black text-[10px] mb-1">📱 ما ستراه:</p>
                        <p className="text-violet-600 text-[10px] font-medium">{ex.what}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400">⏱️ {ex.duration}</span>
                          <span className="text-[10px] font-bold text-amber-600">⭐ {ex.points} نقطة</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelected(ex); setScreen('howto'); }}
                            className="text-[10px] font-black text-violet-600 bg-violet-50 px-3 py-1.5 rounded-xl hover:bg-violet-100 transition-colors"
                          >
                            كيفية التشغيل
                          </button>
                          <button
                            onClick={() => startSession(ex)}
                            className="text-[10px] font-black text-white bg-violet-600 px-3 py-1.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-1"
                          >
                            <Camera className="w-3 h-3" /> ابدأ
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HOW TO SCREEN ── */}
        {screen === 'howto' && selected && (
          <motion.div key="howto" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <button onClick={() => setScreen('home')} className="flex items-center gap-2 text-slate-500 text-sm font-bold">
              <ArrowLeft className="w-4 h-4" /> العودة للقائمة
            </button>
            <div className="bg-violet-900 rounded-[2rem] p-6 text-center border border-violet-800">
              <div className="text-5xl mb-3">{selected.emoji}</div>
              <h2 className="text-xl font-black text-white mb-2">{selected.title}</h2>
              <p className="text-violet-300 text-sm">{selected.desc}</p>
            </div>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
              <h3 className="font-black text-slate-900 text-base mb-4">📋 خطوات التشغيل</h3>
              <div className="space-y-3">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-2xl p-3">
                    <div className="w-7 h-7 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">{i + 1}</div>
                    <p className="text-slate-700 font-bold text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 rounded-[1.5rem] border border-emerald-200 p-4">
              <p className="font-black text-emerald-900 text-sm mb-1">✅ النقاط المكتسبة</p>
              <p className="text-emerald-700 text-xs font-medium">إكمال التمرين كاملاً يمنحك <strong>{selected.points} نقطة</strong> XP + شارة الواقع المعزز</p>
            </div>
            <button
              onClick={() => startSession(selected)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-500/30 text-sm"
            >
              <Camera className="w-5 h-5" /> فتح الكاميرا والبدء
            </button>
          </motion.div>
        )}

        {/* ── SESSION SCREEN ── */}
        {screen === 'session' && selected && (
          <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Simulated AR view */}
            <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden aspect-video flex items-center justify-center border border-slate-700">
              {/* Fake skeleton overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 640 360">
                {/* Body skeleton dots */}
                {[[320,60],[320,130],[280,130],[240,200],[200,280],[280,280],[360,130],[400,200],[440,280],[360,280],[320,200],[300,280],[340,280]].map(([x,y],i) => (
                  <motion.circle
                    key={i} cx={x} cy={y} r={6}
                    fill={i < 3 ? '#22c55e' : i === 3 ? '#f97316' : '#22c55e'}
                    animate={{ opacity: [0.6, 1, 0.6], r: [5, 7, 5] }}
                    transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
                {/* Skeleton lines */}
                {[[320,60,320,130],[320,130,280,130],[280,130,240,200],[240,200,200,280],[240,200,280,280],[320,130,360,130],[360,130,400,200],[400,200,440,280],[400,200,360,280],[320,130,320,200],[320,200,300,280],[320,200,340,280]].map(([x1,y1,x2,y2],i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22c55e" strokeWidth="2" opacity="0.5" />
                ))}
                {/* Error highlight on knee */}
                <motion.circle cx={240} cy={200} r={14} fill="none" stroke="#f97316" strokeWidth="3"
                  animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
              </svg>
              {/* Camera indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> مباشر
              </div>
              {/* Score */}
              <div className="absolute top-4 left-4 bg-violet-600 text-white text-xs font-black px-3 py-1.5 rounded-xl">
                ⭐ 94 / 100
              </div>
              {/* Timer */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white font-black text-lg px-6 py-2 rounded-2xl backdrop-blur-sm">
                {fmtTime(sessionTime)}
              </div>
              {/* AI Feedback bubble */}
              <motion.div
                className="absolute bottom-16 right-4 bg-emerald-500 text-white text-xs font-black px-3 py-2 rounded-2xl max-w-32 text-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👍 وضعية الظهر ممتازة!
              </motion.div>
              <motion.div
                className="absolute top-14 left-4 bg-orange-500 text-white text-xs font-black px-3 py-2 rounded-2xl max-w-32 text-center"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ⚠️ اخفض الركبة أكثر
              </motion.div>
            </div>

            {/* Live stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'التكرارات', val: '8', emoji: '🔢' },
                { label: 'الدقة', val: '89%', emoji: '🎯' },
                { label: 'السعرات', val: '32', emoji: '🔥' },
                { label: 'الوقت', val: fmtTime(sessionTime), emoji: '⏱️' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
                  <span className="text-xl">{s.emoji}</span>
                  <p className="font-black text-slate-900 text-base mt-0.5 leading-none">{s.val}</p>
                  <p className="text-slate-400 text-[10px] font-bold">{s.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={endSession}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-colors"
            >
              ⏹️ إنهاء الجلسة
            </button>
          </motion.div>
        )}

        {/* ── DONE SCREEN ── */}
        {screen === 'done' && sessionData && selected && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-center relative overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl mb-4"
              >🏆</motion.div>
              <h2 className="text-3xl font-black text-white mb-1">أحسنت!</h2>
              <p className="text-emerald-100 text-sm font-bold mb-4">أنهيت "{selected.title}" بنجاح</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'النتيجة', val: `${sessionData.score}%`, emoji: '⭐' },
                  { label: 'التكرارات', val: sessionData.reps.toString(), emoji: '🔢' },
                  { label: 'الدقة', val: `${sessionData.accuracy}%`, emoji: '🎯' },
                  { label: 'نقاط XP', val: `+${selected.points}`, emoji: '💎' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/20 rounded-2xl p-3 text-center">
                    <p className="text-xl">{s.emoji}</p>
                    <p className="font-black text-white text-base leading-none">{s.val}</p>
                    <p className="text-emerald-200 text-[9px] font-bold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
              <h3 className="font-black text-slate-900 text-sm mb-3">📊 ملاحظات الجلسة</h3>
              <ul className="space-y-2">
                {['وضعية الظهر كانت ممتازة في 90% من التكرارات 👍', 'الركبة اليسرى تحتاج التزام أعمق — اخفض بـ 5سم', 'إيقاع التمرين متناسق جداً — استمر!'].map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={reset} className="bg-white border border-slate-200 text-slate-700 font-black py-3 rounded-2xl text-sm hover:bg-slate-50 transition-colors">
                🔄 تمرين آخر
              </button>
              <button onClick={reset} className="bg-violet-600 text-white font-black py-3 rounded-2xl text-sm hover:bg-violet-700 transition-colors">
                🏠 العودة للرئيسية
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARInterface;