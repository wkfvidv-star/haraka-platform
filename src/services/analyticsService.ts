import { supabase } from '../lib/supabaseClient';

export interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    target: number;
    category: string;
    color: string;
}

export interface WeeklyData {
    week: string;
    exercises: number;
    points: number;
    duration: number;
    calories: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    progress: number;
    total: number;
    icon: string;
}

export const analyticsService = {
    getStudentPerformance: async (userId: string): Promise<PerformanceMetric[]> => {
        const { data, error } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        // Mocking some metrics based on overall score for now
        // In a real app, these would come from an analytics table
        const baseScore = data.performance_score || 70;

        return [
            { id: 'strength', name: 'مؤشر القوة العضلية', value: baseScore + 5, unit: '%', change: 12, changeType: 'increase', target: 85, category: 'القوة', color: 'blue' },
            { id: 'endurance', name: 'مؤشر التحمل القلبي', value: baseScore + 2, unit: '%', change: 8, changeType: 'increase', target: 90, category: 'التحمل', color: 'green' },
            { id: 'flexibility', name: 'مؤشر المرونة', value: baseScore - 10, unit: '%', change: -2, changeType: 'decrease', target: 75, category: 'المرونة', color: 'purple' },
            { id: 'balance', name: 'مؤشر التوازن', value: baseScore - 5, unit: '%', change: 5, changeType: 'increase', target: 80, category: 'التوازن', color: 'orange' },
            { id: 'coordination', name: 'مؤشر التناسق الحركي', value: baseScore + 3, unit: '%', change: 0, changeType: 'stable', target: 85, category: 'التناسق', color: 'pink' },
            { id: 'speed', name: 'مؤشر السرعة', value: baseScore - 8, unit: '%', change: 15, changeType: 'increase', target: 80, category: 'السرعة', color: 'red' }
        ];
    },

    getWeeklyData: async (userId: string): Promise<WeeklyData[]> => {
        const { data: sessions, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Group by week (simplified for last 6 weeks)
        // This is a placeholder for more complex aggregation
        const weeks = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6'];

        return weeks.map((week, idx) => {
            // Mocking increasing progress
            return {
                week,
                exercises: 10 + (idx * 3),
                points: 100 + (idx * 50),
                duration: 200 + (idx * 40),
                calories: 1000 + (idx * 300)
            };
        });
    },

    getAchievements: async (userId: string): Promise<Achievement[]> => {
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        // Define default achievements goal
        const goals = [
            { id: '1', name: 'محارب اللياقة', description: 'أكمل 100 تمرين', total: 100, icon: '⚔️' },
            { id: '2', name: 'عداء الماراثون', description: 'اجر مسافة 50 كم', total: 50, icon: '🏃‍♂️' },
            { id: '3', name: 'خبير التوازن', description: 'أتقن 20 تمرين توازن', total: 20, icon: '⚖️' },
            { id: '4', name: 'نجم الأسبوع', description: 'تمرن 7 أيام متتالية', total: 7, icon: '⭐' }
        ];

        // Enrich with real user data if available in DB
        // For now using data from sessions count for simple ones
        const { count: sessionCount } = await supabase
            .from('sessions')
            .count()
            .eq('user_id', userId);

        return goals.map(g => ({
            ...g,
            progress: g.id === '1' ? (sessionCount || 0) : Math.floor(Math.random() * g.total) // Mocking others
        }));
    }
};
