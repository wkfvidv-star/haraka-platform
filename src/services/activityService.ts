// ============================================================
//  activityService.ts — Supabase-first (no local server needed)
// ============================================================
import { supabase } from '@/lib/supabaseClient';

export interface ActivityData {
    steps: number;
    calories: number;
    activeMinutes: number;
    date: string;
}

const getUserId = (): string | null => {
    try {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u).id : null;
    } catch { return null; }
};

export const activityService = {
    saveActivity: async (data: Partial<ActivityData>) => {
        console.log('Saving generic activity:', data);
        return { success: true };
    },

    /**
     * جلب سجل النشاط من Supabase
     */
    getHistory: async (): Promise<ActivityData[]> => {
        const userId = getUserId();
        if (!userId) return [];
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(30);

            if (error || !data) return [];

            return data.map((s: any) => ({
                steps: s.performance_data?.steps || 0,
                calories: s.performance_data?.calories || Math.round(s.duration_minutes * 10),
                activeMinutes: s.duration_minutes || 0,
                date: s.created_at || new Date().toISOString(),
            }));
        } catch (err) {
            console.error('Failed to fetch activity history:', err);
            return [];
        }
    },

    /**
     * تسجيل جلسة مكتملة في Supabase
     */
    completeSession: async (userId: string, exerciseId: string, durationMinutes: number, xpGained: number) => {
        // 1. تسجيل الجلسة
        const { error: sessionError } = await supabase
            .from('sessions')
            .insert({
                user_id: userId,
                exercise_id: exerciseId,
                duration_minutes: durationMinutes,
                performance_data: {
                    xp_gained: xpGained,
                    steps: xpGained * 5,
                    calories: durationMinutes * 10,
                },
            });

        if (sessionError) {
            console.error('Session insert error:', sessionError.message);
            throw sessionError;
        }

        // 2. تحديث تقدم اللاعب
        const { data: currentProgress } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (currentProgress) {
            const newXp = (currentProgress.xp || 0) + xpGained;
            const newLevel = Math.floor(newXp / 1000) + 1;
            await supabase
                .from('students_progress')
                .update({ xp: newXp, level: newLevel, last_active_at: new Date().toISOString() })
                .eq('user_id', userId);
        }

        return { success: true };
    },
};
