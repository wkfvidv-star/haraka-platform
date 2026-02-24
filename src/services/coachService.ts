import { supabase } from '../lib/supabaseClient';

export interface Group {
    id: string;
    name: string;
    description: string;
    memberCount: number;
}

export interface StudentStats {
    userId: string;
    name: string;
    xp: number;
    level: number;
    lastActive: string;
    performanceScore: number;
}

export const coachService = {
    getGroups: async (coachId: string): Promise<Group[]> => {
        const { data, error } = await supabase
            .from('groups')
            .select('*, group_members(count)')
            .eq('created_by', coachId);

        if (error) throw error;

        return data.map(g => ({
            id: g.id,
            name: g.name,
            description: g.description,
            memberCount: g.group_members[0].count
        }));
    },

    getGroupMembers: async (groupId: string): Promise<StudentStats[]> => {
        // 1. Get member IDs
        const { data: members, error: memberError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);

        if (memberError) throw memberError;
        if (!members || members.length === 0) return [];

        const userIds = members.map(m => m.user_id);

        // 2. Fetch profiles and progress
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);

        const { data: progress, error: progressError } = await supabase
            .from('students_progress')
            .select('*')
            .in('user_id', userIds);

        if (profileError || progressError) throw profileError || progressError;

        return profiles.map(p => {
            const stats = progress?.find(s => s.user_id === p.id);
            return {
                userId: p.id,
                name: p.name || 'Unknown Student',
                xp: stats?.xp || 0,
                level: stats?.level || 1,
                lastActive: stats?.last_activity || '',
                performanceScore: stats?.performance_score || 0
            };
        });
    }
};
