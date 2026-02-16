import { Brain, Activity, Zap, Users, Heart, Accessibility, Video, Dumbbell, Target, Timer } from 'lucide-react';
import { ExerciseCategory, VideoProductionContext } from '../types/ExerciseTypes';

export interface ScientificDomain {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    icon: any;
    color: string;
    benefits: string[];
    kpi: string;
}

export interface ScientificExercise {
    id: string;
    domainId: string; // Keep for backward compatibility or domain grouping
    categories: ExerciseCategory[]; // New multi-category support
    title: string;
    difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
    ageRange: string;
    duration: string;
    equipment: string;
    instructions: string[];
    objectives: string[];
    aiFeedbackType?: 'video' | 'sensor' | 'manual';

    // Pedagogical Context
    rationale?: string; // Why: Scientific/Pedagogical reason
    developmentGoal?: string; // What: What skill is developed
    targetAudience?: string[]; // Who: Specific roles or ages

    // Technical Context
    targetedMuscles?: string[];
    intensityZone?: 'Low' | 'Moderate' | 'High' | 'Maximal';

    // UX Context
    coachNotes?: string[]; // Specific info for the coach
    athleteCues?: string[]; // Cues for the athlete during execution
    commonMistakes?: string[];
    videoContext?: VideoProductionContext;
    thumbnailUrl?: string; // Local path to image
}

export const scientificDomains: ScientificDomain[] = [
    {
        id: 'motor-skills',
        title: 'المهارات الحركية الأساسية',
        titleEn: 'Fundamental Motor Skills',
        description: 'بناء الأسس العصبية العضلية والتحكم الجسدي من خلال التوازن والتنسيق.',
        icon: Activity,
        color: 'blue',
        benefits: ['تحسين التوازن', 'تطوير التنسيق العصبي', 'الرشاقة'],
        kpi: 'مؤشر الكفاءة الحركية'
    },
    {
        id: 'cognitive-motor',
        title: 'التكامل المعرفي الحركي',
        titleEn: 'Cognitive-Motor Integration',
        description: 'دمج الحركة مع التفكير لتحسين الوظائف التنفيذية والمرونة الذهنية.',
        icon: Brain,
        color: 'purple',
        benefits: ['الذاكرة العاملة', 'الانتباه المزدوج', 'سرعة المعالجة'],
        kpi: 'درجة المرونة الذهنية'
    },
    {
        id: 'mental-speed',
        title: 'السرعة الذهنية واتخاذ القرار',
        titleEn: 'Mental Speed & Decision Making',
        description: 'تحسين سرعة المعالجة والتحكم المثبط والاستجابات التكيفية.',
        icon: Zap,
        color: 'yellow',
        benefits: ['سرعة رد الفعل', 'دقة القرار', 'التحكم في الاندفاع'],
        kpi: 'زمن الاستجابة (مللي ثانية)'
    },
    {
        id: 'social-skills',
        title: 'المهارات التعاونية والاجتماعية',
        titleEn: 'Cooperative & Social Skills',
        description: 'تنمية الذكاء الاجتماعي والعمل الجماعي والقيادة من خلال الحركة.',
        icon: Users,
        color: 'green',
        benefits: ['العمل الجماعي', 'التواصل', 'القيادة'],
        kpi: 'نقاط التعاون'
    },
    {
        id: 'emotional-regulation',
        title: 'التنظيم العاطفي والحركة',
        titleEn: 'Emotional Regulation',
        description: 'دعم الصحة العقلية والتركيز والتوازن العاطفي من خلال الحركة الواعية.',
        icon: Heart,
        color: 'rose',
        benefits: ['تقليل التوتر', 'الوعي الذاتي', 'الاستقرار العاطفي'],
        kpi: 'مؤشر الهدوء'
    },
    {
        id: 'adaptive-training',
        title: 'التدريب التكيفي والشامل',
        titleEn: 'Adaptive & Inclusive Training',
        description: 'تطوير حركي ومعرفي مخصص ذكي للاحتياجات الخاصة.',
        icon: Accessibility,
        color: 'indigo',
        benefits: ['مسارات مخصصة', 'تعديل الصعوبة', 'إعادة التأهيل'],
        kpi: 'نسبة التقدم الشخصي'
    },
    {
        id: 'ai-analysis',
        title: 'مختبر التحليل الحركي الذكي',
        titleEn: 'AI Movement Analysis Lab',
        description: 'تحليل الفيديو لاستخراج زوايا المفاصل والكشف عن الأخطاء آلياً.',
        icon: Video,
        color: 'slate',
        benefits: ['تحليل دقيق', 'تغذية راجعة فورية', 'تتبع التطور'],
        kpi: 'درجة الدقة الفنية'
    }
];

export const sampleScientificExercises: ScientificExercise[] = [
    // Domain 1: Motor Skills
    {
        id: 'ms-1',
        domainId: 'motor-skills',
        title: 'توازن الفلامنجو الديناميكي',
        difficulty: 'مبتدئ',
        ageRange: '6-12',
        duration: '5 دقائق',
        equipment: 'لا يوجد',
        instructions: [
            'قف على ساق واحدة واغمض عينيك.',
            'حاول لمس ركبتك الأخرى بيدك العكسية.',
            'حافظ على استقامة ظهرك.'
        ],
        objectives: ['تحسين التوازن الثابت', 'تعزيز الحس العميق'],
        aiFeedbackType: 'video',
        categories: ['motor', 'balance'],
        rationale: 'التوازن الثابت هو أساس التحكم في كافة الحركات الرياضية المعقدة.',
        developmentGoal: 'تطوير الثبات العصبي العضلي.',
        targetAudience: ['جميع اللاعبين', 'إعادة التأهيل'],
        coachNotes: ['راقب استقامة الحوض', 'تأكد من عدم ميلان الجذع'],
        athleteCues: ['ركز نظرك على نقطة ثابتة', 'تنفس بعمق وبهدوء'],
        intensityZone: 'Low',
        thumbnailUrl: '/images/training/mobility.png',
        videoContext: {
            performerProfile: 'Gymnast or Yoga Expert, Perfect alignment',
            cameraAngle: 'Stable tripod, Grid overlay optional',
            lighting: 'Soft, Even studio lighting',
            pacing: 'Slow, Controlled, Real-time',
            audioAtmosphere: 'Calm ambient or silence'
        }
    },
    // Domain 2: Cognitive-Motor
    {
        id: 'cm-1',
        domainId: 'cognitive-motor',
        title: 'تحدي ستوب (Stroop) الحركي',
        difficulty: 'متوسط',
        ageRange: '10-16',
        duration: '10 دقائق',
        equipment: 'بطاقات ملونة',
        instructions: [
            'عندما ترى اللون الأحمر، اقفز لليمين.',
            'عندما ترى اللون الأزرق، اقفز لليسار.',
            'إذا كانت الكلمة "أحمر" مكتوبة باللون الأزرق، اتبع لون الخط وليس الكلمة!'
        ],
        objectives: ['تحسين التحكم المثبط', 'سرعة المعالجة'],
        aiFeedbackType: 'manual',
        categories: ['cognitive', 'reaction'],
        rationale: 'تطوير القدرة على اتخاذ القرار الصحيح تحت ضغط الوقت وتعارض المعلومات.',
        developmentGoal: 'المرونة الذهنية وسرعة رد الفعل.',
        targetAudience: ['لاعبي الوسط', 'حراس المرمى'],
        coachNotes: ['تأكد من تنوع الألوان والكلمات', 'زد السرعة تدريجياً'],
        athleteCues: ['فكر قبل أن تقفز', 'لا تتسرع، الدقة أهم من السرعة في البداية'],
        intensityZone: 'Moderate',
        thumbnailUrl: '/images/training/cognitive.png',
        videoContext: {
            performerProfile: 'Athlete with sharp reflexes',
            cameraAngle: 'Head-on, Clear view of color cards',
            lighting: 'Bright, Focus on the stimuli',
            pacing: 'Moderate rhythm, Pauses for decision',
            audioAtmosphere: 'Click track or visual beeps'
        }
    },
    // Domain 3: Mental Speed
    {
        id: 'msp-1',
        domainId: 'mental-speed',
        title: 'شبكة رد الفعل السريع',
        difficulty: 'متقدم',
        ageRange: '12+',
        duration: '3 دقائق',
        equipment: 'مخاريط ملونة',
        instructions: [
            'ضع 4 مخاريط ملونة في مربع.',
            'قف في المنتصف.',
            'اركض للمخروط الذي ينادي المدرب بلونه وعد للمركز بأقصى سرعة.'
        ],
        objectives: ['سرعة رد الفعل', 'الرشاقة', 'سرعة اتخاذ القرار'],
        aiFeedbackType: 'video',
        categories: ['speed', 'agility', 'reaction'],
        rationale: 'محاكاة لظروف المباراة حيث يتطلب الأمر استجابة سريعة ومفاجئة.',
        developmentGoal: 'تحسين زمن الاستجابة والتسارع في مسافات قصيرة.',
        targetAudience: ['المهاجمين', 'الأظهرة'],
        coachNotes: ['استخدم إشارات عشوائية', 'سجل زمن العودة للمركز'],
        athleteCues: ['ابق على أطراف أصابعك', 'انفجر في الانطلاق'],
        intensityZone: 'High',
        thumbnailUrl: '/images/training/hiit.png',
        videoContext: {
            performerProfile: 'Pro Sprinter, Explosive power',
            cameraAngle: 'Wide angle capture of acceleration',
            lighting: 'High contrast, energetic',
            pacing: 'Explosive, High tempo',
            audioAtmosphere: 'Whistle starts, Fast beat'
        }
    },
    // Domain 7: AI Analysis
    {
        id: 'ai-1',
        domainId: 'ai-analysis',
        title: 'اختبار القرفصاء العميق (Deep Squat)',
        difficulty: 'متوسط',
        ageRange: 'الكل',
        duration: '2 دقيقة',
        equipment: 'كاميرا الهاتف',
        instructions: [
            'ضع الهاتف على بعد 2 متر.',
            'قف بقدمين بعرض الكتفين.',
            'انزل ببطء مع الحفاظ على كعبك ثابتًا على الأرض.',
            'ارفع ذراعيك فوق رأسك.'
        ],
        objectives: ['تقييم حركية الكاحل', 'تقييم ثبات الجذع', 'قياس تماثل الحركة'],
        aiFeedbackType: 'video',
        categories: ['corrective', 'mobility'],
        rationale: 'تحليل دقيق لنقاط الضعف في السلسلة الحركية.',
        developmentGoal: 'تحديد التشوهات القوامية أو عدم التماثل.',
        targetAudience: ['الكل'],
        coachNotes: ['تأكد من زاوية الكاميرا', 'الإضاءة يجب أن تكون جيدة'],
        athleteCues: ['انزل أعمق ما يمكن دون رفع الكعبين'],
        intensityZone: 'Low',
        thumbnailUrl: '/images/training/strength.png',
        videoContext: {
            performerProfile: 'Physiotherapist or Corrective Specialist',
            cameraAngle: 'Side profile, Clinical grid',
            lighting: 'Clinical bright, No shadows',
            pacing: 'Very slow, Analytical',
            audioAtmosphere: 'Voiceover explaining mechanics'
        }
    }
];
