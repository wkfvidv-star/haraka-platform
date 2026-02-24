import { supabase } from '../lib/supabaseClient';
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
    colorTheme: 'blue' | 'green' | 'purple' | 'orange';
}

// Map database categories to frontend categories
const CATEGORY_MAP: Record<string, ExerciseCategory> = {
    'motor': 'Motor',
    'cognitive': 'Cognitive',
    'psychological': 'Mental',
    'rehabilitation': 'Rehabilitation'
};

const THEME_MAP: Record<ExerciseCategory, 'blue' | 'green' | 'purple' | 'orange'> = {
    'Motor': 'blue',
    'Cognitive': 'green',
    'Mental': 'purple',
    'Rehabilitation': 'orange'
};

const ICON_MAP: Record<ExerciseCategory, string> = {
    'Motor': 'Activity',
    'Cognitive': 'Brain',
    'Mental': 'Heart',
    'Rehabilitation': 'Zap'
};

export const SmartExerciseService = {
    getAllPacks: async (): Promise<ExercisePack[]> => {
        const { data, error } = await supabase
            .from('exercises')
            .select('*');

        if (error) throw error;

        return data.map(ex => ({
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
    },

    getPacksByCategory: async (category: ExerciseCategory): Promise<ExercisePack[]> => {
        const dbCategory = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === category);

        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('category', dbCategory);

        if (error) throw error;

        return data.map(ex => ({
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
        }));
    },

    getPackById: async (id: string): Promise<ExercisePack | undefined> => {
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
