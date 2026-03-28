import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity, Brain, HeartPulse, ShieldCheck, Zap,
    Play, ChevronLeft, Scan, Clock, BarChart3, Dumbbell, Layers,
    Star, ChevronRight, Eye, Filter, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseData } from '@/components/youth-dashboard/ExerciseDetailsModal';

interface ExerciseLibraryHubProps {
    onOpenExercise: (exercise: ExerciseData) => void;
    onOpenAICoach: () => void;
}

// === EXERCISE DATABASE with specific Unsplash images ===
const exercises = {
    physical: [
        {
            id: 'p1', title: 'تمرين القوة الأساسية (Core)', duration: '15 د', category: 'حركي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['عضلات الجذع', 'البطن', 'الظهر السفلي'],
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
            steps: ['استلقِ على ظهرك مع ثني الركبتين', 'اضغط أسفل ظهرك على الأرض بقوة', 'ارفع بطنك للأعلى بتنفس منتظم', 'احتفظ بالوضع 30 ثانية ثم استرح'],
            description: 'تمرين متكامل لبناء قوة عضلات الجذع وتحسين استقرار الحوض والعمود الفقري.'
        },
        {
            id: 'p2', title: 'تمرين السكوات الديناميكي', duration: '20 د', category: 'حركي' as const,
            isAR: true, difficulty: 'متوسط' as const, muscleGroups: ['الفخذ', 'الأرداف', 'الساق'],
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
            steps: ['قف مع مسافة أقدام مستوى الكتفين', 'انزل ببطء مع إبقاء الظهر مستقيماً', 'تأكد من عدم تجاوز الركبة لأصابع القدم', 'ارجع للوضع الأولي مع ضغط الأرداف'],
            description: 'تقوية شاملة للأطراف السفلية مع تحسين التوازن والتناسق الحركي.'
        },
        {
            id: 'p3', title: 'تدريب HIIT المتكامل', duration: '30 د', category: 'حركي' as const,
            isAR: false, difficulty: 'متقدم' as const, muscleGroups: ['كامل الجسم', 'القلب والأوعية'],
            image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80',
            steps: ['ابدأ بإحماء خفيف 3 دقائق', 'نفّذ 8 تمارين شديدة 30 ثانية لكل منها', 'استرح 15 ثانية بين كل تمرين', 'اختم بالتهدئة والتمدد 5 دقائق'],
            description: 'تدريب متقطع عالي الكثافة يحرق الدهون ويحسن اللياقة القلبية في وقت قياسي.'
        },
        {
            id: 'p4', title: 'البلانك والتعزيز الجانبي', duration: '12 د', category: 'حركي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['الجذع', 'الكتف', 'الخاصرة'],
            image: 'https://images.unsplash.com/photo-1566241832378-917a0f30db2c?w=600&q=80',
            steps: ['ابدأ بوضع البلانك الأمامي 30 ثانية', 'انتقل للبلانك الجانبي الأيمن 20 ثانية', 'انتقل للبلانك الجانبي الأيسر 20 ثانية', 'كرر الدورة 3 مرات مع أخذ استراحة'],
            description: 'تمرين البلانك المتكامل لتعزيز الاستقرار والقوة الأساسية في جميع الاتجاهات.'
        },
    ],
    cognitive: [
        {
            id: 'c1', title: 'تتبع الأنماط السريعة', duration: '10 د', category: 'معرفي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['سرعة المعالجة', 'الانتباه البصري'],
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
            steps: ['ركّز على الشاشة بشكل كامل', 'تتبع النقطة المتحركة بعينيك دون تحريك الرأس', 'اضغط الزر عند ظهور اللون الأحمر فقط', 'استمر لمدة 10 دقائق دون توقف'],
            description: 'تمرين لتحسين سرعة المعالجة البصرية والانتباه المركّز في بيئة مشتتة.'
        },
        {
            id: 'c2', title: 'تمرين الذاكرة العاملة', duration: '15 د', category: 'معرفي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['الذاكرة قصيرة الأمد', 'التركيز'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
            steps: ['انظر للتسلسل المعروض بتمعّن', 'أغمض عينيك وكرر التسلسل ذهنياً', 'أدخل التسلسل بالترتيب الصحيح', 'زِد الصعوبة تدريجياً عند الإتقان'],
            description: 'تدريب مكثف للذاكرة العاملة لتحسين التعلم والأداء الأكاديمي والرياضي.'
        },
        {
            id: 'c3', title: 'سرعة الاستجابة والقرار', duration: '20 د', category: 'معرفي' as const,
            isAR: true, difficulty: 'متقدم' as const, muscleGroups: ['زمن الرجع', 'اتخاذ القرار'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
            steps: ['ضع يديك في وضع الاستعداد', 'استجب للإشارة البصرية بأسرع ما يمكن', 'تجنب الاستجابة للإشارات الوهمية', 'سجّل تحسنك في زمن الرجع'],
            description: 'تدريب متخصص لتقليل زمن الرجع وتحسين جودة وسرعة القرارات تحت الضغط.'
        },
        {
            id: 'c4', title: 'الاتزان الثنائي المهام', duration: '18 د', category: 'معرفي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['التنسيق المعرفي', 'الانتباه المقسّم'],
            image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
            steps: ['نفّذ مهمة حركية بسيطة (قفز خفيف)', 'في نفس الوقت أجب عن أسئلة سريعة', 'حافظ على جودة كلا المهمتين', 'زد صعوبة المهمتين تدريجياً'],
            description: 'تحسين القدرة على أداء مهام متعددة في آنٍ واحد — ضروري للرياضيين المحترفين.'
        },
    ],
    psychological: [
        {
            id: 'psy1', title: 'التنفس العميق للصندوق', duration: '5 د', category: 'نفسي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['الجهاز العصبي', 'الإجهاد'],
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
            steps: ['اجلس بوضع مريح مع استقامة العمود الفقري', 'شهيق لـ 4 ثوانٍ من الأنف', 'احبس الهواء 4 ثوانٍ', 'زفير 4 ثوانٍ ثم توقف 4 ثوانٍ'],
            description: 'تقنية تنفس Box Breathing المستخدمة من قبل القوات الخاصة للتحكم في الضغط النفسي.'
        },
        {
            id: 'psy2', title: 'التأمل الحيوي الموجه', duration: '15 د', category: 'نفسي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['الوعي الذاتي', 'التوازن العاطفي'],
            image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80',
            steps: ['استلقِ بوضع مريح في مكان هادئ', 'أغمض عينيك وركّز على تنفسك', 'تخيّل ضوءاً دافئاً يمر عبر جسدك', 'دع الأفكار تمر دون التعلق بها'],
            description: 'جلسة تأمل موجه لتصفية العقل وتحسين التركيز وتقليل مستوى الكورتيزول.'
        },
        {
            id: 'psy3', title: 'تفريغ الضغط والصمود', duration: '20 د', category: 'نفسي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['المرونة النفسية', 'إدارة التوتر'],
            image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
            steps: ['اكتب 3 أشياء تقلقك حالياً', 'رتّبها حسب مستوى تأثيرها', 'ابتكر خطوة واحدة لكل منها', 'ممارسة التنفس وتصور النجاح'],
            description: 'تقنية CBT لإدارة الضغط وبناء الصمود النفسي لمواجهة التحديات الرياضية.'
        },
        {
            id: 'psy4', title: 'التصور الذهني للأداء', duration: '12 د', category: 'نفسي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['التصور الذهني', 'الثقة بالنفس'],
            image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=600&q=80',
            steps: ['أغمض عينيك وتنفس بهدوء', 'تخيّل نفسك تؤدي التمرين بشكل مثالي', 'أضف التفاصيل الحسية: الصوت، الإيقاع، الإحساس', 'كرر المشهد 5 مرات بثقة تامة'],
            description: 'Mental Imagery لتحسين الأداء — يستخدمها الرياضيون الأولمبيون يومياً.'
        },
    ],
    rehab: [
        {
            id: 'r1', title: 'تأهيل الركبة المتدرج', duration: '25 د', category: 'تأهيلي' as const,
            isAR: true, difficulty: 'مبتدئ' as const, muscleGroups: ['الرباط الأمامي', 'عضلة الفخذ'],
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
            steps: ['التمدد اللطيف للرباط الجانبي', 'تقوية عضلة الفخذ الأمامية بزاوية آمنة', 'تمارين التوازن على الساق الواحدة', 'المشي التدريجي مع مراقبة الألم'],
            description: 'برنامج تأهيل الركبة المعتمد طبياً لاستعادة الحركة الكاملة بعد الإصابة أو الجراحة.'
        },
        {
            id: 'r2', title: 'تصحيح قوام العمود', duration: '30 د', category: 'تأهيلي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['العمود الفقري', 'عضلات الظهر'],
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
            steps: ['تحديد زاوية الانحراف بالمرآة', 'تمارين إطالة العضلات المتقلصة', 'تقوية العضلات المضادة للاختلال', 'تثبيت الوضعية الصحيحة في الحياة اليومية'],
            description: 'برنامج تصحيح الوضعية والقوام لعلاج الحدبة والتقوس الجنبي وآلام الظهر.'
        },
        {
            id: 'r3', title: 'تحريك مفصل الكتف', duration: '15 د', category: 'تأهيلي' as const,
            isAR: false, difficulty: 'مبتدئ' as const, muscleGroups: ['الكفة المدوّرة', 'المفصل الحقي'],
            image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
            steps: ['دُر الكتف للأمام والخلف 10 مرات', 'ارفع الذراع أمامك ببطء إلى الأفق', 'الحركة الدائرية الكاملة ببطء شديد', 'تمدد الجانب الخارجي للكتف 30 ثانية'],
            description: 'تمارين استعادة حركية الكتف بعد الإصابة لتفادي الالتهاب وتحسين المدى الحركي.'
        },
        {
            id: 'r4', title: 'تأهيل الكاحل المتدرج', duration: '20 د', category: 'تأهيلي' as const,
            isAR: false, difficulty: 'متوسط' as const, muscleGroups: ['رباط الكاحل', 'عضلات السمانة'],
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
            steps: ['تحريك الكاحل دوائر لطيفة', 'تمارين الوقوف على أصابع القدم', 'التوازن على ساق واحدة 30 ثانية', 'التدرج نحو المشي ثم الجري الخفيف'],
            description: 'بروتوكول تأهيل الكاحل لاستعادة الاستقرار والقوة بعد الالتواء أو الإصابة الرياضية.'
        },
    ],
    ar: [
        {
            id: 'ar1', title: 'التوافق الحركي بالواقع المعزز', duration: '15 د', category: 'حركي' as const,
            isAR: true, difficulty: 'متوسط' as const, muscleGroups: ['التوافق العصبي', 'سرعة الاستجابة'],
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
            steps: ['وجّه الكاميرا نحوك في مساحة واسعة', 'تتبع النقاط الزرقاء بيديك وقدميك', 'حقق أعلى نقاط ممكنة دون فقد التوازن', 'انتقل من المستوى 1 إلى 5 تدريجياً'],
            description: 'لعبة حركية تفاعلية بالواقع المعزز تحول جسدك إلى وحدة تحكم — الأكثر متعة وفاعلية.'
        },
        {
            id: 'ar2', title: 'الدفاع الشخصي بالرؤية الثلاثية', duration: '20 د', category: 'حركي' as const,
            isAR: true, difficulty: 'متقدم' as const, muscleGroups: ['ردود الفعل', 'التوازن الديناميكي'],
            image: 'https://images.unsplash.com/photo-1614204424926-197b5f4bfd08?w=600&q=80',
            steps: ['ارتدِ نظارات AR أو فعّل وضع الكاميرا', 'لاحق الأهداف الظاهرة في الفضاء أمامك', 'اعترض الهجمات الافتراضية بسرعة', 'زد الصعوبة لتحسين ردود أفعالك'],
            description: 'تجربة دفاع شخصي بالواقع المعزز لتطوير ردود الفعل والتوافق الحسي-الحركي.'
        },
        {
            id: 'ar3', title: 'الإدراك المكاني ثلاثي الأبعاد', duration: '12 د', category: 'معرفي' as const,
            isAR: true, difficulty: 'متوسط' as const, muscleGroups: ['الإدراك المكاني', 'التخطيط الحركي'],
            image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80',
            steps: ['ابدأ بالمرحلة التمهيدية (أشكال 2D)', 'انتقل للأشكال الثلاثية الأبعاد', 'تتبع مواضع الأجسام وتوقع مساراتها', 'حل الألغاز الحركية في الوقت المحدد'],
            description: 'تدريب معرفي بالواقع المعزز لتطوير الذاكرة المكانية والتخطيط الحركي المتقدم.'
        },
        {
            id: 'ar4', title: 'تأهيل توازن VR', duration: '18 د', category: 'تأهيلي' as const,
            isAR: true, difficulty: 'مبتدئ' as const, muscleGroups: ['الجهاز الدهليزي', 'الاتزان'],
            image: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=600&q=80',
            steps: ['قف في مكان آمن مع مسافة كافية', 'اتبع الأرضية الافتراضية المتغيرة', 'حافظ على توازنك في الأسطح غير الثابتة', 'تدرج من السهل للصعب عبر 5 مستويات'],
            description: 'إعادة تأهيل التوازن باستخدام الواقع الافتراضي — طريقة عالمية معتمدة في العلاج الطبيعي.'
        },
    ]
};

const sectionConfig = [
    { id: 'physical', label: 'الأداء الحركي', icon: Dumbbell, color: 'from-orange-500 to-rose-500', accent: 'text-orange-500', bg: 'bg-orange-50', data: exercises.physical },
    { id: 'cognitive', label: 'الأداء المعرفي', icon: Brain, color: 'from-blue-500 to-indigo-500', accent: 'text-blue-500', bg: 'bg-blue-50', data: exercises.cognitive },
    { id: 'psychological', label: 'الأداء النفسي', icon: HeartPulse, color: 'from-emerald-400 to-teal-500', accent: 'text-emerald-500', bg: 'bg-emerald-50', data: exercises.psychological },
    { id: 'rehab', label: 'إعادة التأهيل', icon: ShieldCheck, color: 'from-purple-500 to-fuchsia-500', accent: 'text-purple-500', bg: 'bg-purple-50', data: exercises.rehab },
    { id: 'ar', label: 'الواقع المعزز AR', icon: Scan, color: 'from-violet-600 to-indigo-700', accent: 'text-violet-600', bg: 'bg-violet-50', data: exercises.ar, isAR: true },
];

const diffColor = { 'مبتدئ': 'bg-emerald-100 text-emerald-700', 'متوسط': 'bg-orange-100 text-orange-700', 'متقدم': 'bg-red-100 text-red-700' };

export function ExerciseLibraryHub({ onOpenExercise, onOpenAICoach }: ExerciseLibraryHubProps) {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const buildExercise = (item: any): ExerciseData => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        difficulty: item.difficulty,
        category: item.category,
        isAR: item.isAR,
        muscleGroups: item.muscleGroups,
        steps: item.steps,
        description: item.description,
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-400 pb-20 lg:pb-0" dir="rtl">
            {/* ── HERO ── */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />
                <div className="relative z-10">
                    <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-800 mb-4 px-4 py-1.5 flex w-fit gap-2 font-bold tracking-widest uppercase border-slate-700 text-xs">
                        <Layers className="w-3 h-3" /> COMPREHENSIVE LIBRARY
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                        مكتبة التمارين الشاملة
                    </h2>
                    <p className="text-slate-400 font-medium text-base max-w-2xl leading-relaxed mb-6">
                        تصفح عشرات البرامج المُصممة بعناية لجميع جوانب الأداء — حركياً، معرفياً، نفسياً، وتأهيلياً. تشمل مقاطع وتقنية الواقع المعزز.
                    </p>
                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4">
                        {[
                            { v: '5', l: 'أقسام' },
                            { v: '20+', l: 'تمرين' },
                            { v: '4', l: 'تجارب AR' },
                            { v: '3', l: 'مستويات صعوبة' },
                        ].map((s, i) => (
                            <div key={i} className="bg-slate-800/70 border border-slate-700/50 rounded-2xl px-4 py-2.5 text-center">
                                <p className="text-white font-black text-lg leading-none">{s.v}</p>
                                <p className="text-slate-500 text-xs font-bold mt-0.5">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── AI Coach CTA ── */}
            <div
                onClick={onOpenAICoach}
                className="bg-gradient-to-l from-orange-500 to-rose-500 rounded-[2rem] p-5 flex items-center justify-between cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <Zap className="w-6 h-6 text-orange-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white">المدرب الذكي (AI Coach)</h3>
                        <p className="text-orange-100 text-sm font-medium">دع الذكاء الاصطناعي يصمم لك خطة مخصصة فورياً</p>
                    </div>
                </div>
                <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform hidden sm:block" />
            </div>

            {/* ── SECTIONS ── */}
            {sectionConfig.map((section, si) => (
                <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.06 }}
                    className="space-y-4"
                >
                    {/* Section Header */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', section.bg)}>
                                <section.icon className={cn('w-5 h-5', section.accent)} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    {section.label}
                                    {section.isAR && (
                                        <Badge className="bg-violet-100 text-violet-700 border-0 font-black text-xs px-2 py-0.5">
                                            AR EXCLUSIVE
                                        </Badge>
                                    )}
                                </h3>
                            </div>
                        </div>
                        <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
                            عرض الكل <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Horizontal scrolling cards */}
                    <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
                        <div className="flex gap-4 px-1 pb-2">
                            {section.data.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    onClick={() => onOpenExercise(buildExercise(item))}
                                    className="w-[260px] sm:w-[295px] shrink-0 bg-white rounded-[1.75rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden border border-slate-100"
                                >
                                    {/* IMAGE */}
                                    <div className="relative h-40 overflow-hidden shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        {/* Gradient overlay */}
                                        <div className={cn('absolute inset-0 bg-gradient-to-t', section.isAR ? 'from-violet-900/70 via-violet-900/20 to-transparent' : 'from-slate-900/50 via-transparent to-transparent')} />

                                        {/* Duration badge */}
                                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/20">
                                            <Clock className="w-3 h-3" /> {item.duration}
                                        </div>

                                        {/* AR badge */}
                                        {item.isAR && (
                                            <div className="absolute top-3 left-3 bg-violet-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 border border-violet-400/30">
                                                <Scan className="w-3 h-3" /> AR
                                            </div>
                                        )}

                                        {/* Play button */}
                                        <div className="absolute bottom-3 left-3 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white group-hover:text-slate-900 transition-all text-white">
                                            <Play className="w-4 h-4 translate-x-0.5" />
                                        </div>

                                        {/* Muscle group tag */}
                                        <div className="absolute bottom-3 right-3">
                                            <span className="text-[10px] font-bold text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                                                {item.muscleGroups[0]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                        <h4 className="font-black text-slate-900 text-sm leading-tight mb-2 line-clamp-2">{item.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-100">
                                                {item.category}
                                            </Badge>
                                            <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-lg', diffColor[item.difficulty])}>
                                                {item.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="mt-1" />
                    </ScrollArea>
                </motion.div>
            ))}
        </div>
    );
}
