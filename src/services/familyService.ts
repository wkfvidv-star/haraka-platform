import { supabase } from '../lib/supabaseClient';

export interface ChildSummary {
    id: string;
    name: string;
    avatarUrl?: string;
    age: number;
    activityLevel: number;
    healthScore: number;
    nextSession?: string;
}

export const familyService = {
    getChildren: async (parentId: string): Promise<ChildSummary[]> => {
        // 1. Fetch profiles where parent_id matches
        const { data: childrenProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('parent_id', parentId);

        if (profilesError) throw profilesError;
        if (!childrenProfiles || childrenProfiles.length === 0) return [];

        // 2. Fetch progress for these children
        const childIds = childrenProfiles.map(c => c.id);
        const { data: progressData, error: progressError } = await supabase
            .from('students_progress')
            .select('*')
            .in('user_id', childIds);

        if (progressError) throw progressError;

        // 3. Map to ChildSummary
        return childrenProfiles.map(profile => {
            const progress = progressData.find(p => p.user_id === profile.id);
            return {
                id: profile.id,
                name: profile.name || 'Unknown',
                avatarUrl: profile.avatar_url,
                age: profile.age || 0,
                activityLevel: progress ? Math.min(100, (progress.performance_score || 0)) : 0,
                healthScore: 85, // Placeholder or calculated from metrics
                nextSession: 'Upcoming' // Placeholder
            };
        });
    }
};
