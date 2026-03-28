import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Sport {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  gradient: string;
  tags: string[];
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  players: number;
  matchScore?: number; // 0-100 AI match score
  description: string;
  benefits: string[];
  sessionsPerWeek: number;
}

interface TalentQuestion {
  id: number;
  question: string;
  options: { label: string; value: string; emoji: string }[];
  category: string;
}

interface TalentProfile {
  sport: Sport;
  matchScore: number;
  analysis: string;
  strengths: string[];
  weeklyPlan: { week: string; focus: string; intensity: string }[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_SPORTS: Sport[] = [
  {
    id: 'football',
    name: 'كرة القدم',
    nameEn: 'Football',
    emoji: '⚽',
    gradient: 'from-green-500 to-emerald-700',
    tags: ['جماعي', 'لياقة', 'سرعة', 'تنسيق'],
    level: 'متوسط',
    players: 2840,
    description: 'الرياضة الأكثر شعبية في العالم، تبني روح الفريق والسرعة والذكاء التكتيكي.',
    benefits: ['تحسين اللياقة القلبية', 'بناء العلاقات الاجتماعية', 'تطوير الذكاء التكتيكي'],
    sessionsPerWeek: 4,
  },
  {
    id: 'swimming',
    name: 'السباحة',
    nameEn: 'Swimming',
    emoji: '🏊',
    gradient: 'from-blue-500 to-cyan-600',
    tags: ['تحمل', 'كل العمر', 'وحيد', 'صحة'],
    level: 'مبتدئ',
    players: 1210,
    description: 'الرياضة الأكثر شمولاً لتنشيط الجسم بالكامل دون إجهاد المفاصل.',
    benefits: ['تقوية كل عضلات الجسم', 'تحسين التنفس', 'تقليل التوتر'],
    sessionsPerWeek: 3,
  },
  {
    id: 'athletics',
    name: 'ألعاب القوى',
    nameEn: 'Athletics',
    emoji: '🏃',
    gradient: 'from-orange-500 to-amber-600',
    tags: ['سرعة', 'قوة', 'تنافسي', 'فردي'],
    level: 'متقدم',
    players: 780,
    description: 'أم الرياضات، تختبر حدود قدراتك في السرعة والقوة والتحمل.',
    benefits: ['أقصى قدر من اللياقة', 'تطوير الانضباط الذاتي', 'التنافس المباشر'],
    sessionsPerWeek: 5,
  },
  {
    id: 'basketball',
    name: 'كرة السلة',
    nameEn: 'Basketball',
    emoji: '🏀',
    gradient: 'from-red-500 to-orange-600',
    tags: ['جماعي', 'تنسيق', 'طول', 'سرعة'],
    level: 'متوسط',
    players: 1650,
    description: 'رياضة تجمع بين السرعة والحكمة التكتيكية والعمل الجماعي المتناسق.',
    benefits: ['تطوير التنسيق الحركي', 'بناء الثقة بالنفس', 'تحسين ردود الفعل'],
    sessionsPerWeek: 4,
  },
  {
    id: 'karate',
    name: 'الكاراتيه',
    nameEn: 'Karate',
    emoji: '🥋',
    gradient: 'from-violet-500 to-purple-700',
    tags: ['انضباط', 'دفاع ذاتي', 'فردي', 'تركيز'],
    level: 'متوسط',
    players: 920,
    description: 'فن قتالي ياباني يبني الانضباط الذهني والأداء الجسدي المتوازن.',
    benefits: ['الانضباط الذاتي', 'الدفاع الشخصي', 'التركيز العقلي'],
    sessionsPerWeek: 3,
  },
  {
    id: 'gymnastics',
    name: 'الجمباز',
    nameEn: 'Gymnastics',
    emoji: '🤸',
    gradient: 'from-pink-500 to-rose-600',
    tags: ['مرونة', 'قوة', 'فن', 'إبداع'],
    level: 'متقدم',
    players: 430,
    description: 'رياضة تجمع بين القوة الاستثنائية والمرونة المطلقة والتعبير الفني.',
    benefits: ['أقصى مرونة للجسم', 'قوة مذهلة', 'التعبير الحركي الإبداعي'],
    sessionsPerWeek: 5,
  },
  {
    id: 'volleyball',
    name: 'كرة الطائرة',
    nameEn: 'Volleyball',
    emoji: '🏐',
    gradient: 'from-yellow-500 to-amber-600',
    tags: ['جماعي', 'طول', 'تفاعل', 'سرعة'],
    level: 'مبتدئ',
    players: 1080,
    description: 'رياضة تعتمد على التفاهم الجماعي والردود الفعل السريعة والتحليق.',
    benefits: ['التواصل الفريقي', 'تطوير الارتفاع والقفز', 'اللياقة الكاملة'],
    sessionsPerWeek: 3,
  },
  {
    id: 'weightlifting',
    name: 'رفع الأثقال',
    nameEn: 'Weightlifting',
    emoji: '🏋️',
    gradient: 'from-slate-600 to-zinc-700',
    tags: ['قوة', 'جسم', 'صحة', 'انضباط'],
    level: 'متقدم',
    players: 670,
    description: 'رياضة علمية دقيقة لبناء القوة القصوى وتحسين التركيبة الجسدية.',
    benefits: ['بناء كتلة عضلية', 'تعزيز الأيض', 'القوة الوظيفية'],
    sessionsPerWeek: 4,
  },
];

const TALENT_QUESTIONS: TalentQuestion[] = [
  {
    id: 1,
    question: 'ما الذي تستمتع به أكثر في وقت فراغك؟',
    category: 'personality',
    options: [
      { label: 'الركض والحركة السريعة', value: 'speed', emoji: '⚡' },
      { label: 'الألعاب مع الأصدقاء', value: 'team', emoji: '🤝' },
      { label: 'الفنون والأداء الجسدي', value: 'art', emoji: '🎭' },
      { label: 'رفع الأحمال وتحدي نفسي', value: 'strength', emoji: '💪' },
    ],
  },
  {
    id: 2,
    question: 'كيف تصف جسدك وبنيتك الطبيعية؟',
    category: 'physique',
    options: [
      { label: 'رشيق وسريع الحركة', value: 'agile', emoji: '🦊' },
      { label: 'طويل ومتناسق', value: 'tall', emoji: '🦒' },
      { label: 'قوي وممتلئ', value: 'strong', emoji: '🦍' },
      { label: 'مرن وخفيف', value: 'flexible', emoji: '🐱' },
    ],
  },
  {
    id: 3,
    question: 'ما أهدافك الأساسية من ممارسة الرياضة؟',
    category: 'goals',
    options: [
      { label: 'المنافسة والفوز', value: 'compete', emoji: '🏆' },
      { label: 'الصداقات وروح الفريق', value: 'social', emoji: '👥' },
      { label: 'الصحة واللياقة', value: 'health', emoji: '❤️' },
      { label: 'الشهرة والاحتراف', value: 'fame', emoji: '⭐' },
    ],
  },
  {
    id: 4,
    question: 'كيف تتعامل مع الضغط والمواقف الصعبة؟',
    category: 'mental',
    options: [
      { label: 'أتحلى بالهدوء والتركيز', value: 'calm', emoji: '🧘' },
      { label: 'أتحفز وأستمد الطاقة من الأجواء', value: 'energized', emoji: '🔥' },
      { label: 'أفكر وأضع خطة بسرعة', value: 'tactical', emoji: '🧠' },
      { label: 'أثق بزملائي وأتشاور', value: 'collaborative', emoji: '🤲' },
    ],
  },
  {
    id: 5,
    question: 'كم ساعة في الأسبوع يمكنك تخصيصها للتدريب؟',
    category: 'commitment',
    options: [
      { label: '3-5 ساعات (مرونة عالية)', value: 'low', emoji: '🕐' },
      { label: '6-9 ساعات (التزام جيد)', value: 'medium', emoji: '🕑' },
      { label: '10-14 ساعة (جدية عالية)', value: 'high', emoji: '🕒' },
      { label: '+15 ساعة (طموح احترافي)', value: 'pro', emoji: '🌟' },
    ],
  },
];

// ─── AI Matching Algorithm ────────────────────────────────────────────────────
function computeSportMatch(answers: Record<number, string>): Sport[] {
  const scores: Record<string, number> = {};

  ALL_SPORTS.forEach(s => { scores[s.id] = 50; });

  // Q1: activity preference
  if (answers[1] === 'speed') { scores['athletics'] += 30; scores['football'] += 20; scores['basketball'] += 15; }
  if (answers[1] === 'team')  { scores['football'] += 30; scores['basketball'] += 25; scores['volleyball'] += 20; }
  if (answers[1] === 'art')   { scores['gymnastics'] += 35; scores['karate'] += 20; scores['swimming'] += 10; }
  if (answers[1] === 'strength') { scores['weightlifting'] += 35; scores['athletics'] += 15; scores['karate'] += 15; }

  // Q2: physique
  if (answers[2] === 'agile')    { scores['football'] += 20; scores['athletics'] += 25; scores['karate'] += 20; }
  if (answers[2] === 'tall')     { scores['basketball'] += 30; scores['volleyball'] += 30; scores['swimming'] += 15; }
  if (answers[2] === 'strong')   { scores['weightlifting'] += 30; scores['football'] += 15; scores['athletics'] += 20; }
  if (answers[2] === 'flexible') { scores['gymnastics'] += 35; scores['swimming'] += 20; scores['karate'] += 20; }

  // Q3: goals
  if (answers[3] === 'compete')   { scores['athletics'] += 25; scores['karate'] += 20; scores['football'] += 15; }
  if (answers[3] === 'social')    { scores['football'] += 25; scores['basketball'] += 25; scores['volleyball'] += 25; }
  if (answers[3] === 'health')    { scores['swimming'] += 30; scores['gymnastics'] += 20; scores['athletics'] += 15; }
  if (answers[3] === 'fame')      { scores['football'] += 25; scores['basketball'] += 20; scores['gymnastics'] += 20; }

  // Q4: mental
  if (answers[4] === 'calm')          { scores['swimming'] += 20; scores['karate'] += 25; scores['gymnastics'] += 20; }
  if (answers[4] === 'energized')     { scores['football'] += 25; scores['basketball'] += 25; scores['athletics'] += 20; }
  if (answers[4] === 'tactical')      { scores['football'] += 20; scores['basketball'] += 20; scores['volleyball'] += 20; }
  if (answers[4] === 'collaborative') { scores['football'] += 25; scores['volleyball'] += 30; scores['basketball'] += 25; }

  // Q5: commitment
  if (answers[5] === 'low')    { scores['swimming'] += 15; scores['karate'] += 15; }
  if (answers[5] === 'medium') { scores['football'] += 15; scores['basketball'] += 15; scores['volleyball'] += 15; }
  if (answers[5] === 'high')   { scores['athletics'] += 20; scores['gymnastics'] += 20; scores['weightlifting'] += 20; }
  if (answers[5] === 'pro')    { scores['athletics'] += 30; scores['gymnastics'] += 30; scores['weightlifting'] += 25; }

  // Normalize to 0-100 and sort
  const maxScore = Math.max(...Object.values(scores));
  return ALL_SPORTS
    .map(s => ({ ...s, matchScore: Math.min(100, Math.round((scores[s.id] / maxScore) * 100)) }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

function buildWeeklyPlan(sport: Sport): { week: string; focus: string; intensity: string }[] {
  return [
    { week: 'الأسبوع 1–2', focus: `تقييم المستوى + مقدمة أساسيات ${sport.name}`, intensity: 'خفيف' },
    { week: 'الأسبوع 3–4', focus: 'بناء القاعدة الفنية + الانضمام للمجموعة', intensity: 'متوسط' },
    { week: 'الأسبوع 5–6', focus: 'تدريب مكثف مع المدرب + قياس التقدم', intensity: 'مرتفع' },
    { week: 'الأسبوع 7–8', focus: 'تحدي المنافسة الأولى + تقييم شامل', intensity: 'تنافسي' },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TalentQuiz({ onComplete }: { onComplete: (profile: TalentProfile) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const q = TALENT_QUESTIONS[step];
  const progress = (step / TALENT_QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setSelected(value);
    setTimeout(() => {
      const newAnswers = { ...answers, [step + 1]: value };
      setAnswers(newAnswers);
      setSelected(null);
      if (step < TALENT_QUESTIONS.length - 1) {
        setStep(s => s + 1);
      } else {
        const ranked = computeSportMatch(newAnswers);
        const top = ranked[0];
        onComplete({
          sport: top,
          matchScore: top.matchScore || 90,
          analysis: `بناءً على إجاباتك، تتمتع بمهارات طبيعية تناسب ${top.name} بشكل استثنائي. خصائصك الجسدية وطبيعة شخصيتك تُشير إلى مستقبل واعد في هذه الرياضة.`,
          strengths: top.benefits,
          weeklyPlan: buildWeeklyPlan(top),
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[2rem] p-8 mb-6"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1254 50%, #1a0533 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 60%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest bg-orange-500/20 px-3 py-1 rounded-full">
              🧠 ذكاء اصطناعي رياضي
            </span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">اكتشف رياضتك المثالية</h2>
          <p className="text-white/60 font-medium text-sm">{TALENT_QUESTIONS.length} أسئلة ذكية لتحليل موهبتك</p>
          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/40 font-bold mb-2">
              <span>السؤال {step + 1} من {TALENT_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 mb-4">
            <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3">
              السؤال {step + 1}
            </p>
            <h3 className="text-xl font-black text-white leading-relaxed">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map(opt => (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full text-right px-5 py-4 rounded-2xl border-2 font-bold text-base transition-all flex items-center gap-4 ${
                  selected === opt.value
                    ? 'border-orange-500 bg-orange-500/20 text-white scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/30 text-white/80 hover:text-white'
                }`}
              >
                <span className="text-2xl shrink-0">{opt.emoji}</span>
                <span>{opt.label}</span>
                {selected === opt.value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-auto text-orange-400 font-black"
                  >✓</motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="mt-4 text-white/40 hover:text-white/70 font-bold text-sm transition-colors flex items-center gap-2"
            >
              ← السؤال السابق
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TalentResult({ profile, allRanked, onReset, onSelectSport }: {
  profile: TalentProfile;
  allRanked: Sport[];
  onReset: () => void;
  onSelectSport: (sport: Sport) => void;
}) {
  const intensityColor = { 'خفيف': 'text-green-400 bg-green-500/20', 'متوسط': 'text-yellow-400 bg-yellow-500/20', 'مرتفع': 'text-orange-400 bg-orange-500/20', 'تنافسي': 'text-red-400 bg-red-500/20' };

  return (
    <div className="space-y-5 pb-20" dir="rtl">
      {/* Hero result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br ${profile.sport.gradient} shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }} />
        <div className="relative z-10 flex items-center gap-6">
          <div className="text-7xl">{profile.sport.emoji}</div>
          <div>
            <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">موهبتك المكتشفة</p>
            <h2 className="text-4xl font-black text-white">{profile.sport.name}</h2>
            <p className="text-white/80 font-bold mt-1">{profile.sport.nameEn}</p>
          </div>
          <div className="mr-auto text-center">
            <div className="text-5xl font-black text-white">{profile.matchScore}%</div>
            <div className="text-white/70 text-xs font-bold">تطابق</div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ['🧠', 'الموهبة', `${profile.matchScore}%`],
          ['🎯', 'التوافق', 'عالي جداً'],
          ['⭐', 'الإمكانية', 'احترافية'],
        ].map(([em, label, val]) => (
          <div key={String(label)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-2xl">{em}</span>
            <p className="text-white font-black text-lg mt-1">{val}</p>
            <p className="text-white/40 text-xs font-bold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">🤖 تحليل الذكاء الاصطناعي</p>
        <p className="text-white/80 font-medium leading-relaxed">{profile.analysis}</p>
      </div>

      {/* 8-Week Plan */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="font-black text-white text-lg mb-4">📋 خطة التطوير 8 أسابيع</h3>
        <div className="space-y-3">
          {profile.weeklyPlan.map(row => (
            <div key={row.week} className="flex items-start gap-3">
              <span className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${intensityColor[row.intensity as keyof typeof intensityColor] || 'text-white/60 bg-white/10'}`}>
                {row.week}
              </span>
              <p className="text-white/70 text-sm font-medium">{row.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other matches */}
      <div>
        <h3 className="font-black text-white text-base mb-3">🎯 رياضات تناسبك أيضاً</h3>
        <div className="grid grid-cols-3 gap-3">
          {allRanked.slice(1, 4).map(sport => (
            <motion.button
              key={sport.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectSport(sport)}
              className={`rounded-2xl overflow-hidden text-center bg-gradient-to-br ${sport.gradient} p-4 shadow-lg`}
            >
              <span className="text-3xl block">{sport.emoji}</span>
              <p className="text-white font-black text-sm mt-1">{sport.name}</p>
              <p className="text-white/70 text-xs font-bold">{sport.matchScore}% تطابق</p>
            </motion.button>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full border-2 border-white/20 hover:border-white/40 text-white/60 hover:text-white font-black py-4 rounded-2xl transition-all"
      >
        🔄 إعادة اختبار الموهبة
      </button>
    </div>
  );
}

function SportsCatalog({ rankedSports, onSelectSport }: {
  rankedSports: Sport[];
  onSelectSport: (sport: Sport) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'مبتدئ' | 'متوسط' | 'متقدم'>('all');
  const [joined, setJoined] = useState<string[]>([]);

  const filtered = filter === 'all' ? rankedSports : rankedSports.filter(s => s.level === filter);

  return (
    <div className="space-y-5 pb-20" dir="rtl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 border border-orange-700/40 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)' }}>
        <p className="text-orange-300 text-xs font-black uppercase tracking-widest mb-2">اختر تخصصك</p>
        <h2 className="text-3xl font-black text-white">الرياضات المتاحة 🏅</h2>
        <p className="text-orange-200/60 font-medium mt-1">احجز مكانك في النادي الذي يناسب موهبتك</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'مبتدئ', 'متوسط', 'متقدم'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-xl font-black text-sm transition-all ${
              filter === f
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {f === 'all' ? '🏅 الكل' : f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((sport, idx) => {
          const isJoined = joined.includes(sport.id);
          return (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-white/5"
            >
              {/* Card top */}
              <button
                onClick={() => onSelectSport(sport)}
                className={`w-full bg-gradient-to-br ${sport.gradient} p-5 text-right block hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{sport.emoji}</span>
                  {sport.matchScore !== undefined && (
                    <span className="text-xs font-black bg-white/20 text-white px-2 py-0.5 rounded-full">
                      {sport.matchScore}% تناسبك
                    </span>
                  )}
                </div>
                <h4 className="font-black text-white text-lg leading-tight">{sport.name}</h4>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full mt-1 inline-block ${
                  sport.level === 'مبتدئ' ? 'bg-green-500/30 text-green-200' :
                  sport.level === 'متوسط' ? 'bg-yellow-500/30 text-yellow-200' :
                  'bg-red-500/30 text-red-200'
                }`}>{sport.level}</span>
              </button>
              {/* Card bottom */}
              <div className="bg-white/5 border-t border-white/10 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-xs font-bold">{sport.players.toLocaleString()} مشترك</span>
                  <div className="flex gap-1">
                    {sport.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setJoined(prev => isJoined ? prev.filter(id => id !== sport.id) : [...prev, sport.id])}
                  className={`w-full py-2 rounded-xl font-black text-sm transition-all ${
                    isJoined
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {isJoined ? '✓ منضم' : '+ انضمام'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SportDetail({ sport, onBack }: { sport: Sport; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-5 pb-20"
      dir="rtl"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white font-bold text-sm transition-colors mb-2">
        → رجوع للقائمة
      </button>

      <div className={`rounded-[2rem] p-8 bg-gradient-to-br ${sport.gradient} shadow-2xl`}>
        <span className="text-6xl block mb-4">{sport.emoji}</span>
        <h2 className="text-4xl font-black text-white">{sport.name}</h2>
        <p className="text-white/70 mt-2 font-medium">{sport.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['👥', 'المشتركون', `${sport.players.toLocaleString()}`],
          ['📅', 'جلسات أسبوعية', `${sport.sessionsPerWeek} جلسات`],
          ['📊', 'المستوى', sport.level],
          ['🎯', 'التطابق', sport.matchScore ? `${sport.matchScore}%` : '-'],
        ].map(([em, label, val]) => (
          <div key={String(label)} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xl">{em}</span>
            <p className="text-white/40 text-xs font-bold mt-1">{label}</p>
            <p className="text-white font-black">{val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-white font-black mb-3">✨ فوائد هذه الرياضة</h3>
        <div className="space-y-2">
          {sport.benefits.map(b => (
            <div key={b} className="flex items-center gap-3 text-white/70 font-medium text-sm">
              <span className="text-green-400 font-black">✓</span>
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className={`flex-1 py-4 rounded-2xl font-black text-white bg-gradient-to-r ${sport.gradient} shadow-xl`}>
          انضم الآن
        </button>
        <button className="px-5 py-4 rounded-2xl font-black border border-white/20 text-white/60 hover:text-white transition-colors">
          مشاركة
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface SportsTalentHubProps {
  initialView?: 'catalog' | 'talent';
}

export default function SportsTalentHub({ initialView = 'catalog' }: SportsTalentHubProps) {
  const [view, setView] = useState<'home' | 'quiz' | 'result' | 'catalog' | 'detail'>(
    initialView === 'talent' ? 'quiz' : 'home'
  );
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('haraka_talent_profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [rankedSports, setRankedSports] = useState<Sport[]>(ALL_SPORTS);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  useEffect(() => {
    if (talentProfile) {
      const ranked = computeSportMatch({});
      setRankedSports(ALL_SPORTS.map(s => ({
        ...s,
        matchScore: s.id === talentProfile.sport.id ? talentProfile.matchScore :
          Math.max(20, Math.min(85, 40 + Math.floor(Math.random() * 40)))
      })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)));
    }
  }, [talentProfile]);

  const handleQuizComplete = (profile: TalentProfile) => {
    setTalentProfile(profile);
    localStorage.setItem('haraka_talent_profile', JSON.stringify(profile));
    const ranked = computeSportMatch({});
    setRankedSports(ALL_SPORTS.map(s => ({
      ...s,
      matchScore: s.id === profile.sport.id ? profile.matchScore :
        Math.max(20, Math.min(85, 50 + Math.floor(Math.random() * 30)))
    })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)));
    setView('result');
  };

  const handleSelectSport = (sport: Sport) => {
    setSelectedSport(sport);
    setView('detail');
  };

  // Home: show talent discovery banner + sports preview
  if (view === 'home') {
    return (
      <div className="space-y-6 pb-20" dir="rtl">
        {/* Talent Discovery Banner */}
        {!talentProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] p-8 cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, #1a0533 0%, #431407 100%)' }}
            onClick={() => setView('quiz')}
          >
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest bg-orange-500/20 px-3 py-1 rounded-full">
                🧠 ذكاء اصطناعي رياضي
              </span>
              <h2 className="text-3xl font-black text-white mt-4 mb-2">اكتشف موهبتك الرياضية</h2>
              <p className="text-white/60 font-medium mb-5">
                5 أسئلة ذكية تكشف الرياضة التي تناسب شخصيتك وجسدك بدقة استثنائية
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow"
              >
                <span>ابدأ الاختبار الآن</span>
                <span className="text-xl">🚀</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br ${talentProfile.sport.gradient} shadow-2xl cursor-pointer`}
            onClick={() => setView('result')}
          >
            <div className="flex items-center gap-5">
              <span className="text-5xl">{talentProfile.sport.emoji}</span>
              <div>
                <p className="text-white/70 text-xs font-black uppercase tracking-widest">موهبتك المكتشفة</p>
                <h3 className="text-2xl font-black text-white">{talentProfile.sport.name}</h3>
                <p className="text-white/70 font-bold">{talentProfile.matchScore}% تطابق مع شخصيتك</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setView('quiz'); setTalentProfile(null); localStorage.removeItem('haraka_talent_profile'); }}
                className="mr-auto text-white/40 hover:text-white text-xs font-bold border border-white/20 px-3 py-1.5 rounded-xl"
              >
                إعادة
              </button>
            </div>
          </motion.div>
        )}

        {/* Sports Quick View */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-white text-xl">الرياضات المتاحة 🏅</h3>
            <button onClick={() => setView('catalog')} className="text-orange-400 font-black text-sm hover:text-orange-300 transition-colors">
              عرض الكل ←
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rankedSports.slice(0, 4).map((sport, idx) => (
              <motion.button
                key={sport.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectSport(sport)}
                className={`rounded-2xl bg-gradient-to-br ${sport.gradient} p-4 text-right shadow-lg`}
              >
                <span className="text-3xl">{sport.emoji}</span>
                <p className="text-white font-black text-base mt-2">{sport.name}</p>
                {sport.matchScore !== undefined && (
                  <p className="text-white/70 text-xs font-bold mt-0.5">{sport.matchScore}% تناسبك</p>
                )}
                <p className="text-white/50 text-xs mt-1">{sport.players.toLocaleString()} مشترك</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('catalog')}
            className="py-4 rounded-2xl font-black text-white bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all"
          >
            🏟️ كل الرياضات
          </button>
          <button
            onClick={() => setView('quiz')}
            className="py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20"
          >
            🧠 اختبار الموهبة
          </button>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    return (
      <div dir="rtl">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-white/50 hover:text-white font-bold text-sm transition-colors mb-4"
        >
          → رجوع
        </button>
        <TalentQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (view === 'result' && talentProfile) {
    return (
      <TalentResult
        profile={talentProfile}
        allRanked={rankedSports}
        onReset={() => { setTalentProfile(null); localStorage.removeItem('haraka_talent_profile'); setView('quiz'); }}
        onSelectSport={handleSelectSport}
      />
    );
  }

  if (view === 'catalog') {
    return (
      <div dir="rtl">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-white/50 hover:text-white font-bold text-sm transition-colors mb-4"
        >
          → رجوع
        </button>
        <SportsCatalog rankedSports={rankedSports} onSelectSport={handleSelectSport} />
      </div>
    );
  }

  if (view === 'detail' && selectedSport) {
    return (
      <SportDetail
        sport={selectedSport}
        onBack={() => setView(view === 'detail' ? 'catalog' : 'home')}
      />
    );
  }

  return null;
}
