import { supabase } from '../lib/supabaseClient';
import { LucideIcon, Activity, Brain, Heart, Zap, Crosshair, Move, Scale, Dumbbell } from 'lucide-react';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ExerciseCategory = 'Motor' | 'Cognitive' | 'Perceptual' | 'Mental' | 'Rehabilitation';

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
    videoUrl?: string;
    instructions: string[];
}

export interface ExercisePack {
    id: string;
    title: string;
    category: ExerciseCategory;
    subCategory: string; // e.g., "Balance", "Attention"
    difficulty: DifficultyLevel;
    description: string;
    iconName: string;
    kpis: KPI[];
    exercises: Exercise[];
    colorTheme: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
}

// Map database categories to frontend categories
const CATEGORY_MAP: Record<string, ExerciseCategory> = {
    'motor': 'Motor',
    'cognitive': 'Cognitive',
    'perceptual': 'Perceptual',
    'psychological': 'Mental',
    'rehabilitation': 'Rehabilitation'
};

const THEME_MAP: Record<ExerciseCategory, 'blue' | 'green' | 'purple' | 'orange' | 'indigo'> = {
    'Motor': 'blue',
    'Cognitive': 'green',
    'Perceptual': 'indigo',
    'Mental': 'purple',
    'Rehabilitation': 'orange'
};

const ICON_MAP: Record<ExerciseCategory, string> = {
    'Motor': 'Activity',
    'Cognitive': 'Brain',
    'Perceptual': 'Crosshair',
    'Mental': 'Heart',
    'Rehabilitation': 'Zap'
};

const INTERACTIVE_PACKS: ExercisePack[] = [
    {
        id: 'int-motor-1',
        title: 'تحدي الرشاقة السريعة',
        category: 'Motor',
        subCategory: 'Agility',
        difficulty: 'Intermediate',
        description: 'تمرين يعتمد على الكاميرا لتتبع سرعة حركتك وانتقالك بين النقاط الافتراضية.',
        iconName: 'Activity',
        kpis: [],
        exercises: [{ id: 'ex-motor-1', title: 'تحدي الرشاقة', duration: '3 min', description: 'تتبع حركي مباشر لتطوير التوافق والسرعة', instructions: [] }],
        colorTheme: 'blue'
    },
    {
        id: 'motor-speed-1',
        title: 'الانطلاق السريع (Sprint Base)',
        category: 'Motor',
        subCategory: 'Speed',
        difficulty: 'Beginner',
        description: 'مجموعة تمارين أساسية لتطوير القوة الانفجارية وسرعة الانطلاق من الثبات.',
        iconName: 'Zap',
        kpis: [],
        exercises: [{ id: 'ex-speed-1', title: 'الركض في المكان', duration: '5 min', description: 'ركض سريع في المكان مع رفع الركبتين', instructions: ['ارفع ركبتيك عالياً', 'حرك ذراعيك بسرعة'] }],
        colorTheme: 'blue'
    },
    {
        id: 'motor-balance-1',
        title: 'التوازن الثابت (Core Stability)',
        category: 'Motor',
        subCategory: 'Balance',
        difficulty: 'Advanced',
        description: 'تمارين متقدمة للثبات والتحكم بمركز الثقل الخاص بالجسم (الوقوف على قدم واحدة مع إغلاق العينين).',
        iconName: 'Scale',
        kpis: [],
        exercises: [{ id: 'ex-bal-1', title: 'توازن الشجرة المتقدم', duration: '4 min', description: 'وقوف على قدم واحدة مع تحديات متغيرة', instructions: ['ثبت نظرك في نقطة', 'شد عضلات البطن'] }],
        colorTheme: 'blue'
    },
    {
        id: 'motor-coord-1',
        title: 'التوافق الحركي الشامل',
        category: 'Motor',
        subCategory: 'Coordination',
        difficulty: 'Intermediate',
        description: 'برنامج مصمم لربط حركة الأطراف العلوية مع السفلية في توقيت متزامن لإتقان المهارات المركبة.',
        iconName: 'Move',
        kpis: [],
        exercises: [{ id: 'ex-coord-1', title: 'قفز الحبل الوهمي المتقاطع', duration: '5 min', description: 'قفز وتبديل الأرجل واليدين بشكل متقاطع', instructions: [] }],
        colorTheme: 'blue'
    },
    {
        id: 'motor-strength-1',
        title: 'القوة الوظيفية (Functional Power)',
        category: 'Motor',
        subCategory: 'Strength',
        difficulty: 'Advanced',
        description: 'بناء قوة تحمل عضلية تدعم الأداء الحركي المستمر دون إجهاد سريع.',
        iconName: 'Dumbbell',
        kpis: [],
        exercises: [{ id: 'ex-str-1', title: 'تمارين الضغط والقرفصاء المركبة', duration: '8 min', description: 'دمج حركات القوة في سلسلة واحدة', instructions: [] }],
        colorTheme: 'blue'
    },
    {
        id: 'motor-endurance-1',
        title: 'التحمل الحركي الأساسي',
        category: 'Motor',
        subCategory: 'Endurance',
        difficulty: 'Beginner',
        description: 'تمارين قلبية هوائية خفيفة لزيادة السعة الرئوية وتحمل المجهود لفترات أطول.',
        iconName: 'Heart',
        kpis: [],
        exercises: [{ id: 'ex-end-1', title: 'قفز النجمة (Jumping Jacks)', duration: '5 min', description: 'أداء مستمر لقفزات النجمة', instructions: [] }],
        colorTheme: 'blue'
    },
    // Existing Cognitive, Perceptual, Mental packs
    {
        id: 'int-cog-1',
        title: 'تدريب الذاكرة العاملة',
        category: 'Cognitive',
        subCategory: 'Memory',
        difficulty: 'Beginner',
        description: 'لعبة تفاعلية لتنشيط الذاكرة وسرعة استرجاع المعلومات البصرية.',
        iconName: 'Brain',
        kpis: [],
        exercises: [{ id: 'ex-cog-1', title: 'مطابقة الأنماط', duration: '5 min', description: 'لعبة تفاعلية لمطابقة الأشكال', instructions: [] }],
        colorTheme: 'green'
    },
    {
        id: 'int-perc-1',
        title: 'التتبع البصري الدقيق',
        category: 'Perceptual',
        subCategory: 'Visual',
        difficulty: 'Advanced',
        description: 'درب عينيك على تتبع الأجسام المتحركة بسرعة عالية لتعزيز الإدراك المكاني.',
        iconName: 'Crosshair',
        kpis: [],
        exercises: [{ id: 'ex-perc-1', title: 'تتبع الأجسام', duration: '2 min', description: 'تتبع الكرات المضيئة لزيادة سرعة الاستجابة', instructions: [] }],
        colorTheme: 'indigo'
    },
    {
        id: 'int-ment-1',
        title: 'جلسة التنفس الاسترخائي',
        category: 'Mental',
        subCategory: 'Relaxation',
        difficulty: 'Beginner',
        description: 'تمرين نفسي لتنظيم التنفس (4-7-8) وإعادة التوازن للجسد والعقل للحصول على صفاء ذهني.',
        iconName: 'Heart',
        kpis: [],
        exercises: [{ id: 'ex-ment-1', title: 'دائرة التنفس', duration: '4 min', description: 'تمرين تنفس موجه لخفض التوتر', instructions: [] }],
        colorTheme: 'purple'
    }
];

export const SmartExerciseService = {
    getAllPacks: async (): Promise<ExercisePack[]> => {
        let dbPacks: any[] = [];
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*');
            if (!error && data) {
                dbPacks = data.map(ex => ({
                    id: ex.id,
                    title: ex.title,
                    category: CATEGORY_MAP[ex.category] || 'Motor',
                    subCategory: ex.sub_category || '',
                    difficulty: ex.difficulty || 'Beginner',
                    description: ex.description || '',
                    iconName: ICON_MAP[CATEGORY_MAP[ex.category]] || 'Activity',
                    kpis: [],
                    exercises: [
                        {
                            id: ex.id,
                            title: ex.title,
                            duration: ex.duration || '5 min',
                            description: ex.description || '',
                            instructions: ex.instructions || [],
                            videoUrl: ex.video_url
                        }
                    ],
                    colorTheme: THEME_MAP[CATEGORY_MAP[ex.category]] || 'blue'
                }));
            }
        } catch (e) {
            console.warn("Using offline fallback data for packs.");
        }

        // Return combined list, injecting interactive packs seamlessly
        return [...INTERACTIVE_PACKS, ...dbPacks];
    },

    getPacksByCategory: async (category: ExerciseCategory): Promise<ExercisePack[]> => {
        const dbCategory = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === category);

        let validData: any[] = [];
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .eq('category', dbCategory);
            if (!error && data) {
                validData = data;
            }
        } catch (e) {
             console.warn(`Using offline fallback data for ${category}.`);
        }

        const interactivePacks = INTERACTIVE_PACKS.filter(p => p.category === category);

        return [...interactivePacks, ...validData.map(ex => ({
            id: ex.id,
            title: ex.title,
            category: category,
            subCategory: ex.sub_category || '',
            difficulty: ex.difficulty || 'Beginner',
            description: ex.description || '',
            iconName: ICON_MAP[category] || 'Activity',
            kpis: [],
            exercises: [
                {
                    id: ex.id,
                    title: ex.title,
                    duration: ex.duration || '5 min',
                    description: ex.description || '',
                    instructions: ex.instructions || [],
                    videoUrl: ex.video_url
                }
            ],
            colorTheme: THEME_MAP[category] || 'blue'
        }))];
    },

    getPackById: async (id: string): Promise<ExercisePack | undefined> => {
        const interactive = INTERACTIVE_PACKS.find(p => p.id === id);
        if (interactive) return interactive;

        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;

        const category = CATEGORY_MAP[data.category] || 'Motor';

        return {
            id: data.id,
            title: data.title,
            category: category,
            subCategory: data.sub_category || '',
            difficulty: data.difficulty || 'Beginner',
            description: data.description || '',
            iconName: ICON_MAP[category] || 'Activity',
            kpis: [],
            exercises: [
                {
                    id: data.id,
                    title: data.title,
                    duration: data.duration || '5 min',
                    description: data.description || '',
                    instructions: data.instructions || [],
                    videoUrl: data.video_url
                }
            ],
            colorTheme: THEME_MAP[category] || 'blue'
        };
    },

    // AI Recommendation Logic
    getRecommendedPacks: async (): Promise<ExercisePack[]> => {
        // For now, return top 3 exercises
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .limit(3);

        if (error) return [];

        return data.map(ex => {
            const category = CATEGORY_MAP[ex.category] || 'Motor';
            return {
                id: ex.id,
                title: ex.title,
                category: category,
                subCategory: ex.category || '',
                difficulty: ex.difficulty || 'Beginner',
                description: ex.description || '',
                iconName: ICON_MAP[category] || 'Activity',
                kpis: [],
                exercises: [{ id: ex.id, title: ex.title, duration: ex.duration || '5 min', description: ex.description || '', instructions: [] }],
                colorTheme: THEME_MAP[category] || 'blue'
            };
        });
    },

    // KPI Dashboard Data
    getStudentKPIs: async (userId: string) => {
        const { data, error } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) return null;

        return {
            motorScore: data.performance_score || 0,
            cognitiveScore: 0, // Need more granular tracking
            mentalScore: 0,
            weeklyStreak: data.streak_days || 0,
            totalMinutes: 0 // Sum from sessions
        }
    }
};
