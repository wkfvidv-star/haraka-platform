// ============================================================
//  profileService.ts — Supabase-first
// ============================================================
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
    firstName: string;
    lastName: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    athleticGoal?: string;
    bio?: string;
}

export const profileService = {
    /**
     * تحديث بيانات الملف الشخصي في Supabase
     */
    async updateProfile(userId: string, profileData: Partial<UserProfile>) {
        // تحديث user_metadata في Supabase Auth
        const metaUpdates: Record<string, unknown> = {};
        if (profileData.firstName) metaUpdates.first_name = profileData.firstName;
        if (profileData.lastName) metaUpdates.last_name = profileData.lastName;
        if (profileData.firstName && profileData.lastName) {
            metaUpdates.full_name = `${profileData.firstName} ${profileData.lastName}`.trim();
        }

        const { error: authError } = await supabase.auth.updateUser({ data: metaUpdates });
        if (authError) throw new Error(authError.message);

        // تحديث جدول profiles (إذا كان موجوداً)
        const { error: dbError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                height: profileData.height,
                weight: profileData.weight,
                blood_type: profileData.bloodType,
                athletic_goal: profileData.athleticGoal,
                bio: profileData.bio,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

        if (dbError) console.warn('[profileService] profiles table upsert:', dbError.message);

        // تحديث localStorage
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            const updated = {
                ...parsed,
                firstName: profileData.firstName ?? parsed.firstName,
                lastName: profileData.lastName ?? parsed.lastName,
                name: metaUpdates.full_name || parsed.name,
            };
            localStorage.setItem('user', JSON.stringify(updated));
        }

        return { success: true };
    },

    /**
     * جلب الملف الشخصي من Supabase
     */
    async getProfile(userId: string): Promise<UserProfile> {
        // جرب جدول profiles
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            return {
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                height: data.height,
                weight: data.weight,
                bloodType: data.blood_type,
                athleticGoal: data.athletic_goal,
                bio: data.bio,
            };
        }

        // Fallback: من localStorage
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            return {
                firstName: u.firstName || '',
                lastName: u.lastName || '',
            };
        } catch {
            return { firstName: '', lastName: '' };
        }
    },
};
