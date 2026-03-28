export type PsychGameType = 'breathing' | 'visual_focus' | 'user_input' | 'analysis';

export interface PsychGameLevel {
    id: string;
    gameType: PsychGameType;
    difficulty: number;
    timeLimitSeconds?: number;
    config: any;
}

export interface PsychologicalGame {
    id: string; 
    title: string;
    category: string;
    description: string;
    controls?: string[];
    levels: PsychGameLevel[];
}

export const PSYCHOLOGICAL_GAMES_DB: Record<string, PsychologicalGame> = {
    'stress_control': {
        id: 'stress_control',
        title: 'التحكم في الضغط',
        category: 'الثبات الانفعالي',
        description: 'الأداء تحت الضغط وسرعة اتخاذ القرار في المواقف الحرجة.',
        controls: ['حافظ على ثبات تنفسك العميق (4 ثوانٍ للشهيق، 4 للزفير).', 'تجاهل المؤثرات البصرية والسمعية المزعجة.', 'عند ظهور الخيار، انقر بسرعة على المواجهة بدلاً من الهروب.'],
        levels: [
            { id: 'sc-1', gameType: 'visual_focus', difficulty: 1, config: { intensity: 0.2 }, timeLimitSeconds: 60 },
            { id: 'sc-2', gameType: 'breathing', difficulty: 2, config: { pattern: { in: 4, hold: 2, out: 4 } }, timeLimitSeconds: 90 },
            { id: 'sc-3', gameType: 'visual_focus', difficulty: 3, config: { intensity: 0.5 }, timeLimitSeconds: 120 },
            { id: 'sc-4', gameType: 'user_input', difficulty: 4, config: { prompt: 'اكتب قرارك فوراً للسيطرة على الأزمة', timeStrict: true }, timeLimitSeconds: 30 },
            { id: 'sc-5', gameType: 'analysis', difficulty: 5, config: { stressTolerance: 'high' }, timeLimitSeconds: 60 }
        ]
    },
    'deep_focus': {
        id: 'deep_focus',
        title: 'التركيز العميق',
        category: 'الصفاء الذهني',
        description: 'تدريب الوعي والمثابرة طويلة المدى دون تشتت.',
        controls: ['تتبع النقطة المركزية بعينيك دون السماح لأي فكرة باختراق ذهنك.', 'إذا شرد ذهنك، أعده بهدوء لتتبع الهدف.', 'الجلوس بوضعية صحيحة يضاعف من تركيزك.'],
        levels: [
            { id: 'df-1', gameType: 'visual_focus', difficulty: 1, config: { targetSpeed: 'slow' }, timeLimitSeconds: 120 },
            { id: 'df-2', gameType: 'breathing', difficulty: 2, config: { pattern: { in: 4, hold: 4, out: 4 } }, timeLimitSeconds: 150 },
            { id: 'df-3', gameType: 'visual_focus', difficulty: 3, config: { targetSpeed: 'medium', distractions: true }, timeLimitSeconds: 180 },
            { id: 'df-4', gameType: 'analysis', difficulty: 4, config: { focusDepth: 'deep' }, timeLimitSeconds: 90 },
            { id: 'df-5', gameType: 'visual_focus', difficulty: 5, config: { targetSpeed: 'fast', distractions: true }, timeLimitSeconds: 240 }
        ]
    },
    'emotional_control': {
        id: 'emotional_control',
        title: 'التحكم العاطفي',
        category: 'الذكاء العاطفي',
        description: 'إدارة الغضب والإحباط، والاستجابة الهادئة للمحفزات السلبية.',
        controls: ['اكتب مشاعرك السلبية بصدق تام في المربع المخصص.', 'انقر على "تجاوز" لتحويل الإحباط إلى طاقة استقرار.', 'تنفس بعمق كلما شعرت بنبضك يرتفع.'],
        levels: [
            { id: 'ec-1', gameType: 'breathing', difficulty: 1, config: { pattern: { in: 5, hold: 0, out: 5 } }, timeLimitSeconds: 90 },
            { id: 'ec-2', gameType: 'user_input', difficulty: 2, config: { prompt: 'ما هو الشيء الذي يحبطك الآن؟' }, timeLimitSeconds: 120 },
            { id: 'ec-3', gameType: 'visual_focus', difficulty: 3, config: { targetSpeed: 'slow', color: 'blue' }, timeLimitSeconds: 150 },
            { id: 'ec-4', gameType: 'user_input', difficulty: 4, config: { prompt: 'كيف تستطيع تحويل هذا الإحباط لدافع؟' }, timeLimitSeconds: 120 },
            { id: 'ec-5', gameType: 'analysis', difficulty: 5, config: { emotionalStability: 'balanced' }, timeLimitSeconds: 60 }
        ]
    },
    'confidence_decision': {
        id: 'confidence_decision',
        title: 'الثقة واتخاذ القرار',
        category: 'الشجاعة الإدارية',
        description: 'الحسم المطلق والمخاطرة التكتيكية الذكية تحت اللايقين.',
        controls: ['اقرأ الموقف المتأزم بسرعة، ولا تطل التفكير.', 'اختر إحدى الحلول الجريئة فوراً.', 'التردد سيؤدي إلى خصم النقاط، ثق بحدسك الداخلي.'],
        levels: [
            { id: 'cd-1', gameType: 'user_input', difficulty: 1, config: { prompt: 'اختر: استقرار آمن أم استثمار جريء؟', timeStrict: true }, timeLimitSeconds: 20 },
            { id: 'cd-2', gameType: 'visual_focus', difficulty: 2, config: { targetSpeed: 'fast' }, timeLimitSeconds: 60 },
            { id: 'cd-3', gameType: 'user_input', difficulty: 3, config: { prompt: 'من ستنحي من فريقك لتمرير المشروع؟', timeStrict: true }, timeLimitSeconds: 15 },
            { id: 'cd-4', gameType: 'breathing', difficulty: 4, config: { pattern: { in: 3, hold: 1, out: 6 }, description: 'تنفس لإبطاء النبض بعد القرار' }, timeLimitSeconds: 120 },
            { id: 'cd-5', gameType: 'analysis', difficulty: 5, config: { decisionConfidence: 'absolute' }, timeLimitSeconds: 60 }
        ]
    },
    'resilience': {
        id: 'resilience',
        title: 'الصمود الذهني',
        category: 'الصلابة النفسية',
        description: 'تقوية العزيمة بعد الانتكاسات وتجديد المخزون الطاقي للتصدي للإرهاق.',
        controls: ['حتى لو شعرت بالإرهاق البصري أو الذهني، لا تغلق الجلسة.', 'تابع الإيقاعات المتسارعة وتجاوز الرغبة في التوقف.', 'كرر جمل الإصرار بصمت أثناء الأداء.'],
        levels: [
            { id: 'rs-1', gameType: 'visual_focus', difficulty: 1, config: { targetSpeed: 'medium', pattern: 'erratic' }, timeLimitSeconds: 120 },
            { id: 'rs-2', gameType: 'visual_focus', difficulty: 2, config: { targetSpeed: 'fast', pattern: 'erratic' }, timeLimitSeconds: 180 },
            { id: 'rs-3', gameType: 'breathing', difficulty: 3, config: { pattern: { in: 4, hold: 4, out: 4 }, description: 'التنفس المربع لإعادة الشحن' }, timeLimitSeconds: 120 },
            { id: 'rs-4', gameType: 'user_input', difficulty: 4, config: { prompt: 'ما هو الدافع الذي يجعلك تستمر؟' }, timeLimitSeconds: 90 },
            { id: 'rs-5', gameType: 'analysis', difficulty: 5, config: { resilienceDepth: 'unbreakable' }, timeLimitSeconds: 60 }
        ]
    },
    'relaxation_balance': {
        id: 'relaxation_balance',
        title: 'الاسترخاء والتوازن',
        category: 'التعافي المعرفي',
        description: 'التفريغ التنفسي الشامل وإعادة تهيئة النظام العصبي المركزي للهدوء.',
        controls: ['أرخِ كتفيك وعضلات وجهك تماماً أثناء النظر للشاشة.', 'اتبع إيقاع النقطة الزرقاء المتوسعة للشهيق والمنبثقة للزفير.', 'لا تقم بأي فعل، فقط استسلم للإيقاع.'],
        levels: [
            { id: 'rb-1', gameType: 'breathing', difficulty: 1, config: { pattern: { in: 4, hold: 2, out: 6 } }, timeLimitSeconds: 180 },
            { id: 'rb-2', gameType: 'visual_focus', difficulty: 2, config: { targetSpeed: 'very_slow', color: 'cyan' }, timeLimitSeconds: 180 },
            { id: 'rb-3', gameType: 'breathing', difficulty: 3, config: { pattern: { in: 5, hold: 5, out: 5 }, description: 'تنفس متوازن للانسجام' }, timeLimitSeconds: 180 },
            { id: 'rb-4', gameType: 'analysis', difficulty: 4, config: { relaxationState: 'deep' }, timeLimitSeconds: 90 },
            { id: 'rb-5', gameType: 'breathing', difficulty: 5, config: { pattern: { in: 4, hold: 7, out: 8 }, description: 'تنفس 4-7-8 المتقدم لنوم الأعضاء' }, timeLimitSeconds: 240 }
        ]
    }
};
