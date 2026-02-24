import { supabase } from '../lib/supabaseClient';

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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map(s => ({
            steps: 0,
            calories: 0,
            activeMinutes: s.duration_minutes || 0,
            date: s.created_at
        }));
    },

    completeSession: async (userId: string, exerciseId: string, durationMinutes: number, xpGained: number) => {
        // 1. Record the session
        const { error: sessionError } = await supabase
            .from('sessions')
            .insert({
                user_id: userId,
                exercise_id: exerciseId,
                duration_minutes: durationMinutes,
                performance_data: { xp_gained: xpGained }
            });

        if (sessionError) throw sessionError;

        // 2. Update player progress
        const { data: currentProgress, error: fetchError } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        const newXp = (currentProgress.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 1000) + 1; // Example: level up every 1000 XP

        const { error: updateError } = await supabase
            .from('students_progress')
            .update({
                xp: newXp,
                level: newLevel,
                last_active_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return { xp: newXp, level: newLevel };
    }
};
