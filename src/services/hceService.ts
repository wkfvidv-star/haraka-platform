// ============================================================
//  hceService.ts — Supabase-first (Holistic Cognitive Engine)
// ============================================================
import { supabase } from '@/lib/supabaseClient';

export interface HCEInsights {
    cognitive: {
        status: string;
        observation: string;
        recommendation: string;
    };
    physical: {
        status: string;
        observation: string;
        recommendation: string;
    };
    psychological: {
        status: string;
        observation: string;
        recommendation: string;
    };
    vision_forecast: string;
}

export const hceService = {
    /**
     * جلب الرؤى الذكية لمستخدم معيّن من Supabase
     */
    async getPersonalInsights(userId: string): Promise<HCEInsights> {
        // جرب جدول hce_insights أولاً
        const { data } = await supabase
            .from('hce_insights')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            return {
                cognitive: data.cognitive || _defaultInsights().cognitive,
                physical: data.physical || _defaultInsights().physical,
                psychological: data.psychological || _defaultInsights().psychological,
                vision_forecast: data.vision_forecast || _defaultInsights().vision_forecast,
            };
        }

        // Fallback: احسب من الجلسات المسجّلة في Supabase
        const { data: sessions } = await supabase
            .from('sessions')
            .select('duration_minutes, performance_data')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (sessions && sessions.length > 0) {
            const avgDuration = sessions.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0) / sessions.length;
            const avgXp = sessions.reduce((s: number, r: any) => s + (r.performance_data?.xp_gained || 0), 0) / sessions.length;
            const physicalStatus = avgDuration >= 30 ? 'ممتاز' : avgDuration >= 15 ? 'جيد' : 'يحتاج تطوير';

            return {
                cognitive: {
                    status: 'جيد',
                    observation: `متوسط XP للجلسة: ${Math.round(avgXp)} نقطة`,
                    recommendation: 'استمر في التحديات المعرفية لتطوير قدراتك',
                },
                physical: {
                    status: physicalStatus,
                    observation: `متوسط مدة الجلسة: ${Math.round(avgDuration)} دقيقة`,
                    recommendation: avgDuration < 30 ? 'حاول زيادة مدة الجلسات إلى 30 دقيقة' : 'أداء حركي رائع، حافظ عليه',
                },
                psychological: {
                    status: 'مستقر',
                    observation: `عدد الجلسات المكتملة: ${sessions.length}`,
                    recommendation: 'الانتظام في التدريب يعزز صحتك النفسية',
                },
                vision_forecast: avgXp >= 80 ? 'مسار النخبة - استمر بهذا الأداء الرائع!' : 'أنت في طريقك لتحقيق أهدافك، لا تتوقف!',
            };
        }

        return _defaultInsights();
    },

    /**
     * تسجيل نشاط في Supabase
     */
    async recordActivity(userId: string, activityType: string, performanceData: any) {
        const { error } = await supabase
            .from('hce_activities')
            .insert({
                user_id: userId,
                activity_type: activityType,
                performance_data: performanceData,
                created_at: new Date().toISOString(),
            });

        if (error) {
            console.warn('[hceService] recordActivity to hce_activities:', error.message);
            // Fallback إلى جدول sessions
            await supabase.from('sessions').insert({
                user_id: userId,
                exercise_id: activityType,
                duration_minutes: performanceData?.duration || 0,
                performance_data: performanceData,
            });
        }

        return { success: true };
    },
};

function _defaultInsights(): HCEInsights {
    return {
        cognitive: {
            status: 'لا توجد بيانات',
            observation: 'لم يتم تسجيل أي جلسات بعد',
            recommendation: 'ابدأ بجلسة تدريبية للحصول على رؤى مخصصة',
        },
        physical: {
            status: 'لا توجد بيانات',
            observation: 'لم يتم تسجيل أي نشاط',
            recommendation: 'سجّل أول تمرين لك في المنصة',
        },
        psychological: {
            status: 'مستقر',
            observation: 'مرحباً بك في منصة حركة',
            recommendation: 'الممارسة المنتظمة هي مفتاح النجاح',
        },
        vision_forecast: 'أكمل أولى جلساتك لنبني معاً توقعات مخصصة لك',
    };
}
