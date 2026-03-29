// ============================================================
//  healthService.ts — Supabase-first
// ============================================================
import { supabase } from '@/lib/supabaseClient';

export interface PhysicalMetric {
    height?: number;
    weight?: number;
    bmi?: number;
    heartRate?: number;
    agilityScore?: number;
    balanceScore?: number;
    flexibilityScore?: number;
    strengthScore?: number;
    enduranceScore?: number;
    date: string;
}

export interface Goal {
    id: string;
    title: string;
    description?: string;
    targetValue?: number;
    currentValue: number;
    unit?: string;
    isCompleted: boolean;
}

export interface Competition {
    id: string;
    title: string;
    description?: string;
    type: string;
    rewardXp: number;
    rewardCoins: number;
    participants: number;
    endDate: string;
}

const getUserId = (): string | null => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').id || null; }
    catch { return null; }
};

export const healthService = {
    /**
     * جلب الملف الصحي من Supabase
     */
    async getHealthProfile() {
        const userId = getUserId();
        if (!userId) return _defaultHealthProfile();

        const { data, error } = await supabase
            .from('health_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) return _defaultHealthProfile();
        return data;
    },

    /**
     * حفظ البيانات الصحية في Supabase
     */
    async saveMetrics(metrics: Partial<PhysicalMetric>) {
        const userId = getUserId();
        if (!userId) throw new Error('المستخدم غير مسجّل دخول');

        const { data, error } = await supabase
            .from('health_metrics')
            .insert({
                user_id: userId,
                ...metrics,
                date: metrics.date || new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    /**
     * إنشاء هدف جديد في Supabase
     */
    async createGoal(goal: Partial<Goal>) {
        const userId = getUserId();
        if (!userId) throw new Error('المستخدم غير مسجّل دخول');

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: userId,
                title: goal.title || 'هدف جديد',
                description: goal.description,
                target_value: goal.targetValue,
                current_value: goal.currentValue || 0,
                unit: goal.unit,
                is_completed: false,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.warn('[healthService] goals table not found, returning mock:', error.message);
            return { id: `mock_${Date.now()}`, ...goal, isCompleted: false };
        }
        return data;
    },

    /**
     * تحديث تقدم الهدف في Supabase
     */
    async updateGoalProgress(goalId: string, currentValue: number) {
        const { data, error } = await supabase
            .from('goals')
            .update({
                current_value: currentValue,
                is_completed: currentValue >= 100,
                updated_at: new Date().toISOString(),
            })
            .eq('id', goalId)
            .select()
            .single();

        if (error) {
            console.warn('[healthService] updateGoalProgress error:', error.message);
            return null;
        }
        return data;
    },
};

function _defaultHealthProfile() {
    return {
        userId: null,
        metrics: [],
        goals: [],
        submissions: [],
    };
}
