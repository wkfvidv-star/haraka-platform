// ============================================================
//  authService.ts — مصادقة هجينة
//  في التطوير المحلي: يحاول السيرفر المحلي أولاً، ثم Supabase كـ Fallback
//  في الإنتاج (Vercel): يستخدم Supabase مباشرة
// ============================================================
import { supabase, executeWithRetry } from '@/lib/supabaseClient';

// ── كاشف البيئة ───────────────────────────────────────────
const isProduction = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── ترجمة أخطاء Supabase ──────────────────────────────────
function translateError(msg: string): string {
    const map: Record<string, string> = {
        'Invalid login credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        'Email not confirmed': 'جاري التحقق من الحساب... يرجى إعادة المحاولة إذا لم يتم الدخول تلقائياً (أو تفعيل البريد إذا كان متاحاً)',
        'User already registered': 'هذا البريد الإلكتروني مسجّل مسبقاً',
        'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    };

    return map[msg] ?? msg;
}

export const authService = {
    login: async (email: string, password: string, environment: string) => {
        // ── DEV BYPASS (password: devx) ───────────────────────────────────
        if (password === 'devx') {
            const roleFromEmail = email.startsWith('role:')
                ? email.split(':')[1]?.split('@')[0] || 'student'
                : 'student';
            const envMap: Record<string, string> = {
                parent: 'school', student: 'school', teacher: 'school',
                principal: 'school', directorate: 'school', ministry: 'school',
                youth: 'community', coach: 'community', competition: 'community'
            };
            const mockUser = {
                id: 'dev-001',
                firstName: 'مستخدم',
                lastName: 'تجريبي',
                name: 'مستخدم تجريبي',
                email: email || 'dev@test.com',
                role: roleFromEmail,
                environment: envMap[roleFromEmail] || environment,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=dev`,
                xp: 340,
                level: 3,
                badges: [],
                subscriptionStatus: 'ACTIVE'
            };
            const mockToken = 'dev-token-' + Date.now();
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('environment', mockUser.environment);
            return { success: true, token: mockToken, user: mockUser };
        }
        // ─────────────────────────────────────────────────────────────────

        // ── طريق الإنتاج: Supabase مباشرة ───────────────────────────────
        if (isProduction) {
            return authService._supabaseLogin(email, password, environment);
        }

        // ── طريق التطوير: السيرفر المحلي ← Supabase fallback ────────────
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, environment }),
                signal: AbortSignal.timeout(5000), // 5s timeout
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('environment', environment);
                return { success: true, token: data.token, user: data.user };
            }
            return { success: false, error: data.error || 'فشل تسجيل الدخول' };
        } catch {
            console.warn('[authService] السيرفر المحلي غير متاح، التبديل إلى Supabase...');
            return authService._supabaseLogin(email, password, environment);
        }
    },

    // ── تسجيل الدخول عبر Supabase ────────────────────────────────────────
    _supabaseLogin: async (email: string, password: string, environment: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, error: translateError(error.message) };
        }
        const meta = data.user?.user_metadata ?? {};
        const user = {
            id: data.user!.id,
            email: data.user!.email ?? '',
            name: meta.full_name || meta.name || email.split('@')[0],
            firstName: meta.first_name || '',
            lastName: meta.last_name || '',
            role: meta.role || 'student',
            environment: meta.environment || environment,
            avatar: meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user!.id}`,
            xp: meta.xp || 0,
            level: meta.level || 1,
            badges: meta.badges || [],
            subscriptionStatus: meta.subscription_status || 'ACTIVE',
        };
        const token = data.session?.access_token ?? '';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('environment', user.environment);
        return { success: true, token, user };
    },

    register: async (userData: any) => {
        // ── الإنتاج: Supabase مباشرة ──────────────────────────────────────
        if (isProduction) {
            return authService._supabaseRegister(userData);
        }

        // ── التطوير: السيرفر المحلي ← Supabase fallback ──────────────────
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                signal: AbortSignal.timeout(5000),
            });
            const data = await response.json();
            if (!data.success && data.error === 'EMAIL_TAKEN') {
                return { success: false, error: 'EMAIL_TAKEN', existingRole: data.existingRole };
            }
            return data;
        } catch {
            console.warn('[authService] السيرفر المحلي غير متاح، التبديل إلى Supabase للتسجيل...');
            return authService._supabaseRegister(userData);
        }
    },

    // ── تسجيل مستخدم جديد عبر Supabase ──────────────────────────────────
    _supabaseRegister: async (userData: any) => {
        try {
            return await executeWithRetry(async () => {
                const { data, error } = await supabase.auth.signUp({
                    email: userData.email,
                    password: userData.password,
                    options: {
                        data: {
                            full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                            first_name: userData.firstName || '',
                            last_name: userData.lastName || '',
                            role: userData.role || 'student',
                            environment: userData.environment || 'school',
                            xp: 0,
                            level: 1,
                            badges: [],
                            subscription_status: 'ACTIVE',
                        },
                    },
                });

                if (error) {
                    // إذا كان الخطأ هو تجاوز الحد، سنرميه لكي يلتقطه executeWithRetry ويعيد المحاولة
                    if (error.message?.includes('rate limit') || error.status === 429) {
                        throw error;
                    }
                    return { success: false, error: translateError(error.message) };
                }
                
                return { 
                    success: true, 
                    userId: data.user?.id, 
                    user: data.user,
                    session: data.session 
                };
            }, {
                maxRetries: 2,
                initialDelay: 2000
            });

        } catch (finalError: any) {
            return { 
                success: false, 
                error: translateError(finalError.message || 'تعذر إكمال العملية حالياً بسبب ضغط النظام. يرجى المحاولة لاحقاً.'),
                isRateLimit: finalError.message?.includes('rate limit') || finalError.status === 429
            };
        }

    },

    logout: async () => {
        // تسجيل خروج من Supabase إذا كانت هناك جلسة نشطة
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('environment');
        localStorage.removeItem('province');
    }
};
