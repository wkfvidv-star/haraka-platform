import { supabase } from '../lib/supabaseClient';
import { User, Environment } from '../contexts/AuthContext';

export const authService = {
    login: async (email: string, password: string, environment: Environment): Promise<{ success: boolean; token: string; user: any; error?: string }> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase login error:', error);
            return { success: false, error: error.message, token: '', user: null };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        const { data: stats } = await supabase
            .from('students_progress')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

        const user = {
            id: data.user.id,
            email: data.user.email,
            firstName: profile?.name?.split(' ')[0] || '',
            lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
            role: profile?.role || 'student',
            xp: stats?.xp || 0,
            level: stats?.level || 1,
            playCoins: 0, // Not in requested schema yet but kept for compatibility
        };

        return {
            success: true,
            token: data.session?.access_token || '',
            user
        };
    },

    register: async (data: any): Promise<{ success: boolean; userId: string }> => {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    name: `${data.firstName} ${data.lastName}`,
                    role: data.role || 'student',
                }
            }
        });

        if (error) {
            console.error('Supabase registration error:', error);
            throw error;
        }

        return {
            success: true,
            userId: authData.user?.id || ''
        };
    },

    logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('user');
        localStorage.removeItem('environment');
        localStorage.removeItem('province');
    }
};
