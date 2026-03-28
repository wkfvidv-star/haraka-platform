import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RehabProgram {
  id: string;
  title: string;
  emoji: string;
  level: string;
  duration: string;
  sessions: number;
  desc: string;
  color: string;
  bgColor: string;
  exercises: { name: string; sets: string; tip: string }[];
  tag: string;
}

const programs: RehabProgram[] = [
  {
    id: 'knee',
    title: 'تأهيل الركبة',
    emoji: '🦵',
    level: 'مبتدئ',
    duration: '6 أسابيع',
    sessions: 3,
    desc: 'برنامج تعافٍ تدريجي لإصابات الركبة — تقوية، توازن، واستعادة المدى الحركي.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    tag: 'الأكثر طلباً',
    exercises: [
      { name: 'رفع الساق المستقيمة', sets: '3 × 15 عدة', tip: 'اِبقَ الركبة مستقيمة تماماً أثناء الرفع' },
      { name: 'الجلوس الجزئي (Half Squat)', sets: '3 × 10 عدة', tip: 'لا تتجاوز زاوية 45 درجة في البداية' },
      { name: 'تمرين التوازن أحادي القدم', sets: '30 ثانية × 3', tip: 'يمكن الاستعانة بالحائط إذا لزم الأمر' },
    ],
  },
  {
    id: 'shoulder',
    title: 'تأهيل الكتف',
    emoji: '💪',
    level: 'مبتدئ',
    duration: '4 أسابيع',
    sessions: 4,
    desc: 'استعادة قوة ومرونة الكتف بعد الإصابة أو الجراحة — حركات دقيقة ومتدرجة.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    tag: 'موصى به',
    exercises: [
      { name: 'دوران الكتف البندولي', sets: '2 دقيقة × 3', tip: 'حرك الذراع بالجاذبية فقط — لا تبذل مجهوداً' },
      { name: 'تمدد الكتف الداخلي', sets: '30 ثانية × 3', tip: 'اربط مطاطة خلف ظهرك لمقاومة خفيفة' },
      { name: 'رفع الذراعين أمامياً', sets: '3 × 12 عدة', tip: 'استخدم وزناً رمزياً (0.5-1 كغ) في البداية' },
    ],
  },
  {
    id: 'back',
    title: 'تأهيل أسفل الظهر',
    emoji: '🏃',
    level: 'متوسط',
    duration: '8 أسابيع',
    sessions: 3,
    desc: 'تقوية عضلات الجذع والحزام الخلفي لتخفيف الألم وتجنب الانتكاسة.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    tag: 'شائع',
    exercises: [
      { name: 'تمرين التمساح (Cat-Cow)', sets: '10 تكرار × 3', tip: 'تنفس ببطء مع كل حركة' },
      { name: 'جسر الأرداف (Glute Bridge)', sets: '3 × 15 عدة', tip: 'اضغط العضلة العجزية في الذروة' },
      { name: 'بلانك جانبي كامل', sets: '20 ثانية × 3 لكل جانب', tip: 'جسمك مستقيم من الكاحل للكتف' },
    ],
  },
  {
    id: 'ankle',
    title: 'تأهيل الكاحل',
    emoji: '🦶',
    level: 'مبتدئ',
    duration: '3 أسابيع',
    sessions: 5,
    desc: 'التعافي السريع من التواء الكاحل — تمارين التوازن والثبات والقوة العضلية.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tag: 'سريع الفائدة',
    exercises: [
      { name: 'دوران الكاحل (Circles)', sets: '20 دورة × 3 لكل اتجاه', tip: 'يمكن تأديتها جالساً' },
      { name: 'الوقوف على أصابع القدم', sets: '3 × 20 عدة', tip: 'ابقَ بالقرب من حائط للاتزان في البداية' },
      { name: 'تمرين المشي الحرفي (Lateral Walk)', sets: '3 أمتار × 4 جولات', tip: 'استخدم مطاطة مقاومة حول الكاحلين' },
    ],
  },
];

const tips = [
  { emoji: '🌡️', title: 'أوقف التمرين عند الألم الحاد', desc: 'الألم الخفيف طبيعي، لكن الألم الحاد إشارة توقف' },
  { emoji: '🧊', title: 'الثلج بعد كل جلسة', desc: '10-15 دقيقة ثلج على منطقة الإصابة بعد التمرين' },
  { emoji: '💧', title: 'الترطيب الجيد', desc: 'اشرب 2-3 لترات ماء يومياً خلال فترة التعافي' },
  { emoji: '😴', title: 'النوم الكافي', desc: '8 ساعات نوم تسرّع الشفاء بنسبة 40%' },
];

export function MotorRehabHub() {
  const [selectedProgram, setSelectedProgram] = useState<RehabProgram | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);

  if (selectedProgram) {
    return (
      <div className="space-y-5 pb-20 lg:pb-0 animate-in fade-in duration-300" dir="rtl">
        {/* Program Header */}
        <div className={`${selectedProgram.bgColor} rounded-[2rem] p-6 border border-slate-100`}>
          <button onClick={() => setSelectedProgram(null)} className="text-slate-500 text-sm font-bold mb-4 flex items-center gap-1">
            ← العودة لبرامج التأهيل
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{selectedProgram.emoji}</div>
            <div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg bg-white ${selectedProgram.color} mb-2 inline-block`}>{selectedProgram.tag}</span>
              <h2 className="text-2xl font-black text-slate-900">{selectedProgram.title}</h2>
              <p className="text-slate-500 text-sm mt-1">{selectedProgram.desc}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs font-black text-slate-600">⏱️ {selectedProgram.duration}</span>
                <span className="text-xs font-black text-slate-600">📅 {selectedProgram.sessions} جلسات/أسبوع</span>
                <span className="text-xs font-black text-slate-600">📊 {selectedProgram.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Week selector */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
          <h3 className="font-black text-slate-900 text-sm mb-3">اختر الأسبوع</h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5, 6].slice(0, selectedProgram.id === 'ankle' ? 3 : selectedProgram.id === 'shoulder' ? 4 : selectedProgram.id === 'knee' ? 6 : 8).map(w => (
              <button
                key={w}
                onClick={() => setActiveWeek(w)}
                className={cn(
                  'shrink-0 w-12 h-12 rounded-2xl font-black text-sm transition-colors',
                  activeWeek === w ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {w}
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-xs font-bold mt-2">الأسبوع {activeWeek} — {activeWeek <= 2 ? 'تمارين خفيفة للبدء' : activeWeek <= 4 ? 'زيادة الحمل تدريجياً' : 'تمارين وظيفية كاملة'}</p>
        </div>

        {/* Exercises */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
          <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
            🏋️ تمارين الجلسة
          </h3>
          <div className="space-y-3">
            {selectedProgram.exercises.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${selectedProgram.bgColor} rounded-xl flex items-center justify-center font-black text-sm ${selectedProgram.color} shrink-0`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-sm">{ex.name}</h4>
                    <p className="text-slate-500 text-xs font-bold mt-0.5">{ex.sets}</p>
                    <div className="flex items-center gap-1 mt-2 bg-white rounded-xl px-3 py-1.5 border border-slate-100">
                      <span className="text-base">💡</span>
                      <span className="text-xs font-bold text-slate-600">{ex.tip}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-slate-900 rounded-[1.5rem] p-5 border border-slate-800">
          <h3 className="font-black text-white text-sm mb-3">⚠️ نصائح السلامة</h3>
          <div className="grid grid-cols-2 gap-2">
            {tips.map((t, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-3 border border-slate-700">
                <span className="text-lg">{t.emoji}</span>
                <p className="font-black text-white text-xs mt-1">{t.title}</p>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 lg:pb-0 animate-in fade-in zoom-in-95 duration-500" dir="rtl">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-900 to-slate-900 rounded-[2rem] p-6 relative overflow-hidden border border-rose-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-rose-500/20 rounded-2xl flex items-center justify-center text-2xl">🏥</div>
            <span className="text-[10px] font-black bg-rose-500/30 text-rose-200 px-2.5 py-1 rounded-xl">مسار التأهيل الحركي</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">العودة أقوى من الإصابة</h2>
          <p className="text-rose-200 text-sm leading-relaxed max-w-lg">
            برامج تأهيل حركي مصممة بمعايير طبية — تمارين متدرجة تعيدك للملعب بأمان وثقة.
          </p>
          <div className="flex gap-4 mt-4">
            {[
              { label: '4 برامج', sub: 'متكاملة' },
              { label: '6 أسابيع', sub: 'أقصى مدة' },
              { label: '100%', sub: 'آمنة طبياً' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-2xl px-3 py-2 text-center border border-white/10">
                <p className="font-black text-white text-base leading-none">{s.label}</p>
                <p className="text-rose-300 text-[10px] font-bold mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
        <span className="w-1 h-5 bg-rose-500 rounded-full" /> اختر برنامج التأهيل
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog, i) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelectedProgram(prog)}
            className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-lg hover:border-slate-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${prog.bgColor} rounded-2xl flex items-center justify-center text-2xl`}>{prog.emoji}</div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl ${prog.bgColor} ${prog.color}`}>{prog.tag}</span>
            </div>
            <h4 className="font-black text-slate-900 text-base mb-1">{prog.title}</h4>
            <p className="text-slate-500 text-sm mb-3 leading-relaxed">{prog.desc}</p>
            <div className="flex gap-3 mb-3">
              <span className="text-xs font-bold text-slate-500">⏱️ {prog.duration}</span>
              <span className="text-xs font-bold text-slate-500">📅 {prog.sessions} جلسات/أسبوع</span>
              <span className="text-xs font-bold text-slate-500">📊 {prog.level}</span>
            </div>
            <div className={`${prog.bgColor} text-center py-2.5 rounded-xl font-black text-sm ${prog.color} group-hover:opacity-80 transition-opacity`}>
              ابدأ البرنامج ←
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 rounded-[1.5rem] border border-amber-200 p-4 flex gap-3">
        <span className="text-2xl shrink-0">⚕️</span>
        <div>
          <p className="font-black text-amber-800 text-sm">استشر طبيبك قبل البدء</p>
          <p className="text-amber-600 text-xs font-medium mt-0.5">هذه البرامج مرشدة فقط وليست بديلاً عن الرعاية الطبية المهنية.</p>
        </div>
      </div>
    </div>
  );
}

export default MotorRehabHub;
