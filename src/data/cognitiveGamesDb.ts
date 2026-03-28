export type GameType = 'memory_shapes' | 'number_sequence' | 'match_pairs' | 'quick_choice' | 'stroop_test' | 'fast_math' | 'focus_target' | 'problem_solving' | 'flexibility' | 'decision_making' | 'attention';

export interface CognitiveGameLevel {
    id: string;
    gameType: GameType;
    difficulty: number;
    timeLimitSeconds?: number;
    config: any;
}

export interface CognitiveGame {
    id: string; 
    title: string;
    category: string;
    description: string;
    controls?: string[];
    levels: CognitiveGameLevel[];
}

export const COGNITIVE_GAMES_DB: Record<string, CognitiveGame> = {
    'processing_speed': {
        id: 'processing_speed',
        title: 'سرعة المعالجة الذهنية',
        category: 'السرعة والدقة',
        description: 'المطابقة السريعة تحت الضغط، والحساب الذهني المتغير.',
        controls: ['انقر على البطاقات المتطابقة بأسرع ما يمكن.', 'في مستويات الحساب، حل المسألة وانقر على الناتج الصحيح قبل انتهاء الوقت.'],
        levels: [
            { id: 'ps-lvl-1', gameType: 'match_pairs', difficulty: 2, config: { gridPairs: 4, distraction: false }, timeLimitSeconds: 30 },
            { id: 'ps-lvl-2', gameType: 'match_pairs', difficulty: 3, config: { gridPairs: 6, distraction: false }, timeLimitSeconds: 25 },
            { id: 'ps-lvl-3', gameType: 'problem_solving', difficulty: 4, config: { targetScore: 4, fastMath: true }, timeLimitSeconds: 30 },
            { id: 'ps-lvl-4', gameType: 'problem_solving', difficulty: 5, config: { targetScore: 6, fastMath: true }, timeLimitSeconds: 25 },
            { id: 'ps-lvl-5', gameType: 'match_pairs', difficulty: 6, config: { gridPairs: 8, distraction: true }, timeLimitSeconds: 20 }
        ]
    },
    'focus_attention': {
        id: 'focus_attention',
        title: 'التركيز والانتباه',
        category: 'مقاومة التشتت',
        description: 'تحديد الهدف وسط الفوضى، ومقاومة التشتت البصري والسمعي.',
        controls: ['ابحث عن الهدف المطلوب وسط المشتتات البصرية وانقره بسرعة.', 'تجاهل أي عناصر متحركة أو ألوان خادعة تظهر في محيط اللعبة.'],
        levels: [
            { id: 'fa-lvl-1', gameType: 'focus_target', difficulty: 2, config: { targetScore: 5, clutter: 20 }, timeLimitSeconds: 40 },
            { id: 'fa-lvl-2', gameType: 'focus_target', difficulty: 3, config: { targetScore: 8, clutter: 40 }, timeLimitSeconds: 35 },
            { id: 'fa-lvl-3', gameType: 'attention', difficulty: 4, config: { targetScore: 10, intenseDistractions: false }, timeLimitSeconds: 35 },
            { id: 'fa-lvl-4', gameType: 'attention', difficulty: 5, config: { targetScore: 12, intenseDistractions: true }, timeLimitSeconds: 30 },
            { id: 'fa-lvl-5', gameType: 'focus_target', difficulty: 6, config: { targetScore: 15, clutter: 80 }, timeLimitSeconds: 25 }
        ]
    },
    'advanced_memory': {
        id: 'advanced_memory',
        title: 'الذاكرة المتقدمة',
        category: 'التذكر المنطقي',
        description: 'الذاكرة العاملة المتسلسلة، وتحدي التذكر العكسي الخاطف.',
        controls: ['تذكر تسلسل الأرقام أو الأشكال المعروضة على الشاشة.', 'أعد إدخال التسلسل بالترتيب (أو العكس إذا طلب منك ذلك).'],
        levels: [
            { id: 'am-lvl-1', gameType: 'match_pairs', difficulty: 2, config: { gridPairs: 4, previewSeconds: 5 }, timeLimitSeconds: 35 },
            { id: 'am-lvl-2', gameType: 'match_pairs', difficulty: 3, config: { gridPairs: 6, previewSeconds: 4 }, timeLimitSeconds: 30 },
            { id: 'am-lvl-3', gameType: 'match_pairs', difficulty: 4, config: { gridPairs: 8, previewSeconds: 3 }, timeLimitSeconds: 30 },
            { id: 'am-lvl-4', gameType: 'match_pairs', difficulty: 5, config: { gridPairs: 10, distraction: true }, timeLimitSeconds: 40 },
            { id: 'am-lvl-5', gameType: 'match_pairs', difficulty: 6, config: { gridPairs: 12, distraction: true }, timeLimitSeconds: 45 }
        ]
    },
    'mental_flexibility': {
        id: 'mental_flexibility',
        title: 'المرونة والتكيف الذهني',
        category: 'الذكاء التنفيذي',
        description: 'تغيير القواعد المفاجئ، والتصنيف المتغير السريع.',
        controls: ['اتبع القاعدة الحالية للفرز (اللون، الشكل، الخ).', 'إذا تغيرت القاعدة فجأة، بدّل طريقة اختيارك للمطابقة فوراً وبدون تردد.'],
        levels: [
            { id: 'mf-lvl-1', gameType: 'flexibility', difficulty: 2, config: { targetScore: 5, ruleChangeFreq: 'low' }, timeLimitSeconds: 40 },
            { id: 'mf-lvl-2', gameType: 'flexibility', difficulty: 3, config: { targetScore: 8, ruleChangeFreq: 'medium' }, timeLimitSeconds: 35 },
            { id: 'mf-lvl-3', gameType: 'stroop_test', difficulty: 4, config: { targetScore: 10, dynamicRules: false }, timeLimitSeconds: 30 },
            { id: 'mf-lvl-4', gameType: 'stroop_test', difficulty: 5, config: { targetScore: 15, dynamicRules: true }, timeLimitSeconds: 25 },
            { id: 'mf-lvl-5', gameType: 'flexibility', difficulty: 6, config: { targetScore: 12, ruleChangeFreq: 'high' }, timeLimitSeconds: 20 }
        ]
    },
    'problem_solving': {
        id: 'problem_solving',
        title: 'حل المشكلات والمنطق',
        category: 'التفكير التحليلي',
        description: 'إكمال الأنماط الذكية المعقدة، والألغاز السريعة.',
        controls: ['اقرأ اللغز أو النمط المنطقي المعروض بدقة.', 'اختر الإجابة الصحيحة من الخيارات لفك الشفرة قبل نفاد وقت المستوى.'],
        levels: [
            { id: 'psolve-lvl-1', gameType: 'problem_solving', difficulty: 2, config: { targetScore: 2, puzzleType: 'logic_pattern' }, timeLimitSeconds: 50 },
            { id: 'psolve-lvl-2', gameType: 'problem_solving', difficulty: 3, config: { targetScore: 4, puzzleType: 'logic_pattern' }, timeLimitSeconds: 45 },
            { id: 'psolve-lvl-3', gameType: 'problem_solving', difficulty: 4, config: { targetScore: 3, puzzleType: 'math_riddle' }, timeLimitSeconds: 40 },
            { id: 'psolve-lvl-4', gameType: 'problem_solving', difficulty: 5, config: { targetScore: 5, puzzleType: 'math_riddle' }, timeLimitSeconds: 35 },
            { id: 'psolve-lvl-5', gameType: 'problem_solving', difficulty: 6, config: { targetScore: 7, puzzleType: 'mixed' }, timeLimitSeconds: 30 }
        ]
    },
    'decision_making': {
        id: 'decision_making',
        title: 'اتخاذ القرار تحت الضغط',
        category: 'التحكم الإرادي والمخاطرة',
        description: 'القرار السريع متعدد الخيارات، والمخاطرة الذكية.',
        controls: ['في المواقف المفاجئة، اتخذ قراراً فورياً بالنقر على السلوك السليم.', 'تجنب الفخاخ البصرية أو الأزرار الحمراء التي قد تفقدك نقاطاً مضاعفة.'],
        levels: [
            { id: 'dm-lvl-1', gameType: 'decision_making', difficulty: 2, config: { targetScore: 5, timePerChoice: 4 }, timeLimitSeconds: 40 },
            { id: 'dm-lvl-2', gameType: 'decision_making', difficulty: 3, config: { targetScore: 8, timePerChoice: 3 }, timeLimitSeconds: 35 },
            { id: 'dm-lvl-3', gameType: 'decision_making', difficulty: 4, config: { targetScore: 10, timePerChoice: 2.5 }, timeLimitSeconds: 30 },
            { id: 'dm-lvl-4', gameType: 'decision_making', difficulty: 5, config: { targetScore: 12, riskRewardSystem: true }, timeLimitSeconds: 25 },
            { id: 'dm-lvl-5', gameType: 'decision_making', difficulty: 6, config: { targetScore: 15, riskRewardSystem: true, timePerChoice: 1.5 }, timeLimitSeconds: 20 }
        ]
    }
};
