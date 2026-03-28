import { supabase } from '../lib/supabaseClient';
import api from './api';

export interface ActivityData {
    steps: number;
    calories: number;
    activeMinutes: number;
    date: string;
}

export const activityService = {
    // Legacy support or simplified tracking
    saveActivity: async (data: Partial<ActivityData>) => {
        // We'll map this to a session or generic progress update if needed
        console.log("Saving generic activity:", data);
        return { success: true };
    },

    getHistory: async (): Promise<ActivityData[]> => {
        try {
            const response = await api.get('/activity/history');
            if (response.data.success && Array.isArray(response.data.history)) {
                return response.data.history.map((s: any) => ({
                    steps: s.steps || 0,
                    calories: s.calories || 0,
                    activeMinutes: s.activeMinutes || 0,
                    date: s.date || s.createdAt
                }));
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch activity history:", error);
            return [];
        }
    },

    completeSession: async (userId: string, exerciseId: string, durationMinutes: number, xpGained: number) => {
        // 1. Record in Node.js Backend (XP & Coins logic)
        try {
            await api.post('/activity/save', {
                activeMinutes: durationMinutes,
                steps: xpGained * 5, // Mapping XP back to some 'steps' for variety
                calories: durationMinutes * 10
            });
        } catch (error) {
            console.error("Backend sync failed, falling back to direct Supabase:", error);
        }

        // 2. Fallback/Dual-Write to Supabase for legacy components
        const { error: sessionError } = await supabase
            .from('sessions')
            .insert({
                user_id: userId,
                exercise_id: exerciseId,
                duration_minutes: durationMinutes,
                performance_data: { xp_gained: xpGained }
            });

        if (sessionError) throw sessionError;

        // 3. Update player progress in Supabase (Legacy sync)
        const { data: currentProgress, error: fetchError } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!fetchError && currentProgress) {
            const newXp = (currentProgress.xp || 0) + xpGained;
            const newLevel = Math.floor(newXp / 1000) + 1;

            await supabase
                .from('students_progress')
                .update({
                    xp: newXp,
                    level: newLevel,
                    last_active_at: new Date().toISOString()
                })
                .eq('user_id', userId);
        }

        return { success: true };
    }
};
