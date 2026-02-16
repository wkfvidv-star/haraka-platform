import { LucideIcon, Activity, Brain, Heart, Zap, Crosshair, Move, Scale, Dumbbell } from 'lucide-react';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ExerciseCategory = 'Motor' | 'Cognitive' | 'Mental' | 'Rehabilitation';

export interface KPI {
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
}

export interface Exercise {
    id: string;
    title: string;
    duration: string; // e.g., "5 min"
    description: string;
    videoUrl?: string; // Placeholder for now
    instructions: string[];
}

export interface ExercisePack {
    id: string;
    title: string;
    category: ExerciseCategory;
    subCategory: string; // e.g., "Balance", "Attention"
    difficulty: DifficultyLevel;
    description: string;
    iconName: string; // We'll map this to Lucide icons in the UI
    kpis: KPI[];
    exercises: Exercise[];
    colorTheme: 'blue' | 'green' | 'purple' | 'orange';
}

// --- MOCK DATA GENERATOR ---

const generateMotorPacks = (): ExercisePack[] => [
    {
        id: 'motor-balance-basic',
        title: 'أساسيات التوازن',
        category: 'Motor',
        subCategory: 'التوازن والتحكم الوضعي',
        difficulty: 'Beginner',
        description: 'تمارين تأسيسية لتعزيز الثبات والتحكم في مركز الثقل.',
        iconName: 'Scale',
        colorTheme: 'blue',
        kpis: [{ name: 'نتيجة التوازن', value: 75, unit: '%', trend: 'up' }],
        exercises: [
            { id: 'm-bal-1', title: 'الوقوف على قدم واحدة (يمين)', duration: '30s', description: 'قف بثبات على الساق اليمنى.', instructions: ['ارفع القدم اليسرى', 'حافظ على الوضع لمدة 30 ثانية'] },
            { id: 'm-bal-2', title: 'الوقوف على قدم واحدة (يسار)', duration: '30s', description: 'قف بثبات على الساق اليسرى.', instructions: ['ارفع القدم اليمنى', 'حافظ على الوضع لمدة 30 ثانية'] }
        ]
    },
    {
        id: 'motor-agility-reactive',
        title: 'تدريبات الرشاقة التفاعلية',
        category: 'Motor',
        subCategory: 'الرشاقة وتغيير الاتجاه',
        difficulty: 'Advanced',
        description: 'تغييرات سريعة في الاتجاه بناءً على إشارات بصرية.',
        iconName: 'Zap',
        colorTheme: 'blue',
        kpis: [{ name: 'سرعة رد الفعل', value: 250, unit: 'ms', trend: 'down' }],
        exercises: [
            { id: 'm-agi-1', title: 'التفاعل مع الألوان', duration: '2 min', description: 'تحرك نحو القمع الذي يطابق لون الشاشة.', instructions: ['راقب الشاشة', 'انطلق بسرعة نحو اللون المطابق'] }
        ]
    },
    {
        id: 'motor-coord-handeye',
        title: 'التوافق العضلي العصبي (يد-عين)',
        category: 'Motor',
        subCategory: 'التوافق العضلي العصبي',
        difficulty: 'Intermediate',
        description: 'مزامنة المدخلات البصرية مع حركات اليد.',
        iconName: 'Crosshair',
        colorTheme: 'blue',
        kpis: [{ name: 'الدقة', value: 88, unit: '%', trend: 'up' }],
        exercises: [
            { id: 'm-co-1', title: 'رمي الكرة للحائط', duration: '3 min', description: 'ارمي الكرة نحو الحائط والتقطها.', instructions: ['قف على بعد مترين', 'ارمي بيد واحدة', 'التقط باليد الأخرى'] }
        ]
    },
    {
        id: 'motor-strength-core',
        title: 'بناء ثبات الجذع (Core)',
        category: 'Motor',
        subCategory: 'القوة الوظيفية',
        difficulty: 'Beginner',
        description: 'تقوية عضلات الجذع لتحسين الثبات العام.',
        iconName: 'Dumbbell',
        colorTheme: 'blue',
        kpis: [{ name: 'التحمل', value: 60, unit: 's', trend: 'up' }],
        exercises: [
            { id: 'm-str-1', title: 'تمرين البلانك (Plank)', duration: '1 min', description: 'حافظ على وضعية البلانك بشكل صحيح.', instructions: ['جسم مستقيم', 'شد عضلات البطن'] }
        ]
    }
];

const generateCognitivePacks = (): ExercisePack[] => [
    {
        id: 'cog-focus-dual',
        title: 'التركيز المزدوج',
        category: 'Cognitive',
        subCategory: 'الانتباه والتركيز',
        difficulty: 'Intermediate',
        description: 'الحفاظ على الانتباه في مهمتين في وقت واحد.',
        iconName: 'Focus',
        colorTheme: 'green',
        kpis: [{ name: 'نتيجة التركيز', value: 82, unit: '%', trend: 'stable' }],
        exercises: [
            { id: 'c-foc-1', title: 'المشي والعد', duration: '5 min', description: 'امشِ في خط مستقيم مع العد التنازلي من 100 بطرح 7.', instructions: ['امشِ باستقامة', 'عد بصوت عالٍ تنازلياً'] }
        ]
    },
    {
        id: 'cog-process-speed',
        title: 'سرعة المعالجة',
        category: 'Cognitive',
        subCategory: 'سرعة رد الفعل الذهني',
        difficulty: 'Advanced',
        description: 'معالجة المعلومات البصرية بسرعة عالية.',
        iconName: 'Zap',
        colorTheme: 'green',
        kpis: [{ name: 'وقت المعالجة', value: 180, unit: 'ms', trend: 'down' }],
        exercises: [
            { id: 'c-proc-1', title: 'تطابق الرموز', duration: '3 min', description: 'اضغط على الرموز المتطابقة بأسرع ما يمكن.', instructions: ['حدد الهدف', 'اضغط على التطابق'] }
        ]
    },
    {
        id: 'cog-memory-working',
        title: 'بناء الذاكرة العاملة',
        category: 'Cognitive',
        subCategory: 'الذاكرة العاملة',
        difficulty: 'Beginner',
        description: 'تعزيز سعة الذاكرة قصيرة المدى.',
        iconName: 'Brain',
        colorTheme: 'green',
        kpis: [{ name: 'سعة الذاكرة', value: 5, unit: 'عناصر', trend: 'up' }],
        exercises: [
            { id: 'c-mem-1', title: 'تذكر النمط', duration: '4 min', description: 'راقب النمط ثم قم بإعادة تكراره.', instructions: ['شاهد النمط', 'انتظر 5 ثوانٍ', 'أعد إدخال النمط'] }
        ]
    }
];

const generateMentalPacks = (): ExercisePack[] => [
    {
        id: 'men-regulation-breath',
        title: 'تمرين التنفس المربع',
        category: 'Mental',
        subCategory: 'التنظيم العاطفي',
        difficulty: 'Beginner',
        description: 'تقنية لتهدئة الجهاز العصبي.',
        iconName: 'Wind',
        colorTheme: 'purple',
        kpis: [{ name: 'مؤشر الهدوء', value: 65, unit: '', trend: 'up' }],
        exercises: [
            { id: 'm-reg-1', title: 'تنفس 4-4-4-4', duration: '5 min', description: 'شهيق 4ث، حبس 4ث، زفير 4ث، حبس 4ث.', instructions: ['اجلس بارتياح', 'اتبع الإيقاع بهدوء'] }
        ]
    },
    {
        id: 'men-conf-affirmations',
        title: 'عقلية المحارب',
        category: 'Mental',
        subCategory: 'الثقة بالنفس',
        difficulty: 'Intermediate',
        description: 'بناء الحديث الإيجابي مع النفس والثقة.',
        iconName: 'Trophy',
        colorTheme: 'purple',
        kpis: [{ name: 'مؤشر الثقة', value: 8, unit: '/10', trend: 'up' }],
        exercises: [
            { id: 'm-conf-1', title: 'توكيدات المرآة', duration: '3 min', description: 'كرر التوكيدات القوية.', instructions: ['قف شامخاً', 'تحدث بوضوح وقوة'] }
        ]
    },
    {
        id: 'men-stress-sim',
        title: 'محاكاة الضغط النفسي',
        category: 'Mental',
        subCategory: 'إدارة التوتر',
        difficulty: 'Advanced',
        description: 'الأداء تحت ضغط الوقت المحاكى.',
        iconName: 'Activity',
        colorTheme: 'purple',
        kpis: [{ name: 'الهدوء تحت الضغط', value: 90, unit: '%', trend: 'stable' }],
        exercises: [
            { id: 'm-str-1', title: 'تخيل ركلة الجزاء', duration: '5 min', description: 'تخيل تنفيذ ركلة جزاء في النهائي.', instructions: ['أغمض عينيك', 'تخيل صوت الجمهور', 'ركز على الكرة فقط'] }
        ]
    }
];

const generateRehabilitationPacks = (): ExercisePack[] => [
    {
        id: 'rehab-mobility-joint',
        title: 'تحريك المفاصل (Mobility)',
        category: 'Rehabilitation',
        subCategory: 'المرونة والمجال الحركي',
        difficulty: 'Beginner',
        description: 'تمارين لطيفة لتحسين مجال حركة المفاصل وتقليل التيبس.',
        iconName: 'Activity',
        colorTheme: 'orange',
        kpis: [{ name: 'مجال الحركة', value: 85, unit: '%', trend: 'up' }],
        exercises: [
            { id: 'r-mob-1', title: 'دوران الكاحل', duration: '2 min', description: 'حرك الكاحل في دوائر واسعة.', instructions: ['اجلس على كرسي', 'ارفع قدمك قليلاً', 'دور الكاحل ببطء في كلا الاتجاهين'] },
            { id: 'r-mob-2', title: 'إطالة المعصم', duration: '2 min', description: 'إطالة لطيفة لعضلات المعصم.', instructions: ['مد ذراعك للأمام', 'اسحب كفك للخلف برفق', 'ثبت لمدة 15 ثانية'] }
        ]
    },
    {
        id: 'rehab-strength-iso',
        title: 'التقوية الثابتة (Isometric)',
        category: 'Rehabilitation',
        subCategory: 'تنشيط العضلات',
        difficulty: 'Beginner',
        description: 'تقوية العضلات دون حركة مفرطة للمفاصل (آمن للمراحل الأولى).',
        iconName: 'Dumbbell',
        colorTheme: 'orange',
        kpis: [{ name: 'قوة الانقباض', value: 60, unit: '%', trend: 'up' }],
        exercises: [
            { id: 'r-iso-1', title: 'ضغط الفخذ', duration: '3 min', description: 'اضغط عضلات الفخذ دون ثني الركبة.', instructions: ['اجلس وساقك ممدودة', 'اضغط خلف الركبة لأسفل', 'ثبت لمدة 5 ثوان ثم استرخ'] }
        ]
    },
    {
        id: 'rehab-balance-prop',
        title: 'التوازن الحس العميق',
        category: 'Rehabilitation',
        subCategory: 'الاستقرار الحسي',
        difficulty: 'Intermediate',
        description: 'تحسين الإحساس بوضع الجسم والتوازن الدقيق.',
        iconName: 'Scale',
        colorTheme: 'orange',
        kpis: [{ name: 'مؤشر الاستقرار', value: 72, unit: '%', trend: 'stable' }],
        exercises: [
            { id: 'r-prop-1', title: 'الوقوف على سطح غير مستقر', duration: '3 min', description: 'استخدم وسادة أو سطح إسفنجي للوقوف.', instructions: ['قف على الوسادة', 'حاول الحفاظ على التوازن', 'استخدم كرسي للدعم عند الحاجة'] }
        ]
    },
    {
        id: 'rehab-coord-fine',
        title: 'التوافق الحركي الدقيق',
        category: 'Rehabilitation',
        subCategory: 'التحكم الدقيق',
        difficulty: 'Advanced',
        description: 'تمارين للتحكم الدقيق في الحركات الصغيرة.',
        iconName: 'Crosshair',
        colorTheme: 'orange',
        kpis: [{ name: 'دقة الحركة', value: 80, unit: '%', trend: 'up' }],
        exercises: [
            { id: 'r-fin-1', title: 'تتبع المسار', duration: '4 min', description: 'تتبع خطاً متعرجاً بإصبعك أو قدمك بدقة.', instructions: ['ارسم خطاً وهمياً أو حقيقياً', 'تتبعه بدقة عالية وبطء'] }
        ]
    }
];

const ALL_PACKS = [...generateMotorPacks(), ...generateCognitivePacks(), ...generateMentalPacks(), ...generateRehabilitationPacks()];

export const SmartExerciseService = {
    getAllPacks: async (): Promise<ExercisePack[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return ALL_PACKS;
    },

    getPacksByCategory: async (category: ExerciseCategory): Promise<ExercisePack[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return ALL_PACKS.filter(p => p.category === category);
    },

    getPackById: async (id: string): Promise<ExercisePack | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return ALL_PACKS.find(p => p.id === id);
    },

    // AI Recommendation Logic (Simulated)
    getRecommendedPacks: async (): Promise<ExercisePack[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Simple logic: return one from each category as "AI Recommended"
        const motor = ALL_PACKS.find(p => p.category === 'Motor');
        const cognitive = ALL_PACKS.find(p => p.category === 'Cognitive');
        const mental = ALL_PACKS.find(p => p.category === 'Mental');
        return [motor, cognitive, mental].filter(Boolean) as ExercisePack[];
    },

    // KPI Dashboard Data (Simulated)
    getStudentKPIs: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            motorScore: 78,
            cognitiveScore: 82,
            mentalScore: 65,
            weeklyStreak: 4,
            totalMinutes: 120
        }
    }
};
