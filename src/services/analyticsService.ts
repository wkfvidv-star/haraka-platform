// ============================================================
//  analyticsService.ts — Supabase-first
// ============================================================
import { supabase } from '@/lib/supabaseClient';

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

const getUserId = (): string | null => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').id || null; }
    catch { return null; }
};

export const analyticsService = {
    /**
     * جلب مقاييس الأداء من Supabase (students_progress + sessions)
     */
    getStudentPerformance: async (_userId: string): Promise<PerformanceMetric[]> => {
        const userId = getUserId();
        if (!userId) return _fallbackMetrics();

        try {
            const { data: progress } = await supabase
                .from('students_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            const { data: sessions } = await supabase
                .from('sessions')
                .select('duration_minutes, performance_data')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!progress) return _fallbackMetrics();

            const totalMinutes = sessions?.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0) ?? 0;
            const avgXp = sessions?.length
                ? Math.round(sessions.reduce((s: number, r: any) => s + (r.performance_data?.xp_gained || 0), 0) / sessions.length)
                : 0;

            return [
                {
                    id: 'xp', name: 'نقاط الخبرة (XP)', value: progress.xp || 0, unit: 'XP',
                    change: 12, changeType: 'increase', target: 5000, category: 'تقدم', color: '#6366f1',
                },
                {
                    id: 'level', name: 'المستوى الحالي', value: progress.level || 1, unit: '',
                    change: 0, changeType: 'stable', target: 10, category: 'تقدم', color: '#f59e0b',
                },
                {
                    id: 'minutes', name: 'إجمالي دقائق التدريب', value: totalMinutes, unit: 'دقيقة',
                    change: 8, changeType: 'increase', target: 600, category: 'نشاط', color: '#10b981',
                },
                {
                    id: 'avg_xp', name: 'متوسط XP لكل جلسة', value: avgXp, unit: 'XP',
                    change: 5, changeType: 'increase', target: 100, category: 'أداء', color: '#3b82f6',
                },
            ];
        } catch (err) {
            console.error('getStudentPerformance error:', err);
            return _fallbackMetrics();
        }
    },

    /**
     * بيانات الأداء الأسبوعي
     */
    getWeeklyData: async (_userId: string): Promise<WeeklyData[]> => {
        const userId = getUserId();
        if (!userId) return [];

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 28);

            const { data } = await supabase
                .from('sessions')
                .select('created_at, duration_minutes, performance_data')
                .eq('user_id', userId)
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: true });

            if (!data || !data.length) return [];

            // تجميع بالأسبوع
            const weekMap: Record<string, WeeklyData> = {};
            data.forEach((s: any) => {
                const d = new Date(s.created_at);
                // أول يوم في الأسبوع
                const dayOfWeek = d.getDay();
                const monday = new Date(d);
                monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
                const week = monday.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });

                if (!weekMap[week]) {
                    weekMap[week] = { week, exercises: 0, points: 0, duration: 0, calories: 0 };
                }
                weekMap[week].exercises += 1;
                weekMap[week].points += s.performance_data?.xp_gained || 0;
                weekMap[week].duration += s.duration_minutes || 0;
                weekMap[week].calories += s.performance_data?.calories || Math.round((s.duration_minutes || 0) * 10);
            });

            return Object.values(weekMap);
        } catch (err) {
            console.error('getWeeklyData error:', err);
            return [];
        }
    },

    /**
     * الإنجازات — من جدول achievements أو محسوبة من الجلسات
     */
    getAchievements: async (_userId: string): Promise<Achievement[]> => {
        const userId = getUserId();
        if (!userId) return [];

        try {
            // جرب جدول achievements أولاً
            const { data } = await supabase
                .from('achievements')
                .select('*')
                .eq('user_id', userId);

            if (data && data.length > 0) {
                return data.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    description: a.description || '',
                    progress: a.progress || 0,
                    total: a.total || 100,
                    icon: a.icon || '🏆',
                }));
            }

            // Fallback: احسب من الجلسات
            const { data: sessions } = await supabase
                .from('sessions')
                .select('id, duration_minutes')
                .eq('user_id', userId);

            const count = sessions?.length || 0;
            const totalMin = sessions?.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0) ?? 0;

            return [
                { id: 'sessions_10', name: '10 جلسات تدريب', description: 'أكمل 10 جلسات تدريب', progress: Math.min(count, 10), total: 10, icon: '🎯' },
                { id: 'minutes_60', name: 'ساعة كاملة', description: 'تدرّب 60 دقيقة إجمالاً', progress: Math.min(totalMin, 60), total: 60, icon: '⏱️' },
                { id: 'consistent', name: 'الثبات', description: 'تدرّب 5 أيام متتالية', progress: Math.min(count, 5), total: 5, icon: '🔥' },
            ];
        } catch (err) {
            console.error('getAchievements error:', err);
            return [];
        }
    },
};

function _fallbackMetrics(): PerformanceMetric[] {
    return [
        { id: 'placeholder', name: 'جارٍ تحميل البيانات...', value: 0, unit: '%', change: 0, changeType: 'stable', target: 100, category: 'عام', color: '#6366f1' }
    ];
}
