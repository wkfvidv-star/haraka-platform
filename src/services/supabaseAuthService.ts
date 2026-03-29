// ============================================================
//  supabaseAuthService.ts
//  خدمة مصادقة Supabase للمنصة - مستقلة تماماً عن authService.ts
//
//  ملاحظة مهمة:
//  ───────────────────────────────────────────────────────────
//  هذا الملف لا يُعدِّل ولا يستبدل authService.ts الموجود.
//  السيرفر المحلي (localhost:3001) يستمر في العمل كما هو.
//  استخدم هذه الخدمة بديلاً عندما يكون Supabase هو مصدر البيانات.
// ============================================================

import {
  supabase,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseGetCurrentUser,
  supabaseResetPassword,
  type AuthResult,
} from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// ── نوع بيانات المستخدم الموحَّد في المنصة ──────────────────
export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  environment: string;
  avatar: string;
  xp: number;
  level: number;
  badges: string[];
  subscriptionStatus: string;
  supabaseId: string;    // معرف Supabase الفريد
}

// ── تحويل مستخدم Supabase إلى نموذج المنصة ─────────────────
function mapSupabaseUserToPlatform(user: User): PlatformUser {
  const meta = user.user_metadata ?? {};
  const fullName = meta.full_name || meta.name || '';
  const nameParts = fullName.split(' ');

  return {
    id: user.id,
    supabaseId: user.id,
    email: user.email ?? '',
    firstName: meta.first_name || nameParts[0] || 'مستخدم',
    lastName: meta.last_name || nameParts.slice(1).join(' ') || '',
    name: fullName || user.email?.split('@')[0] || 'مستخدم',
    role: meta.role || 'student',
    environment: meta.environment || 'school',
    avatar: meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
    xp: meta.xp || 0,
    level: meta.level || 1,
    badges: meta.badges || [],
    subscriptionStatus: meta.subscription_status || 'ACTIVE',
  };
}

// ============================================================
//  supabaseAuthService — الواجهة الرئيسية للمصادقة عبر Supabase
// ============================================================
export const supabaseAuthService = {

  /**
   * تسجيل دخول مستخدم موجود عبر Supabase
   * يحفظ التوكن والبيانات في localStorage بنفس هيكل authService.ts
   *
   * @param email    - البريد الإلكتروني
   * @param password - كلمة المرور
   */
  login: async (email: string, password: string): Promise<{
    success: boolean;
    user?: PlatformUser;
    token?: string;
    error?: string;
  }> => {
    const result: AuthResult = await supabaseSignIn(email, password);

    if (!result.success || !result.user) {
      return { success: false, error: result.error };
    }

    const platformUser = mapSupabaseUserToPlatform(result.user);
    const token = result.session?.access_token ?? '';

    // حفظ في localStorage بنفس مفاتيح authService.ts الحالي
    // هذا يضمن توافق باقي الكود الموجود مع Supabase
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(platformUser));
    localStorage.setItem('environment', platformUser.environment);
    localStorage.setItem('supabase_session', JSON.stringify(result.session));

    return { success: true, user: platformUser, token };
  },

  /**
   * تسجيل مستخدم جديد عبر Supabase
   *
   * @param userData - بيانات المستخدم الجديد
   */
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    environment?: string;
  }): Promise<{
    success: boolean;
    user?: PlatformUser;
    error?: string;
    emailConfirmationRequired?: boolean;
  }> => {
    const result: AuthResult = await supabaseSignUp(
      userData.email,
      userData.password,
      {
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role || 'student',
        environment: userData.environment || 'school',
        xp: 0,
        level: 1,
        badges: [],
        subscription_status: 'ACTIVE',
      }
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // إذا كان التحقق من البريد مفعلاً، لن تكون هناك session فورية
    if (!result.session) {
      return {
        success: true,
        emailConfirmationRequired: true,
      };
    }

    const platformUser = mapSupabaseUserToPlatform(result.user!);
    localStorage.setItem('token', result.session.access_token);
    localStorage.setItem('user', JSON.stringify(platformUser));
    localStorage.setItem('environment', platformUser.environment);

    return { success: true, user: platformUser };
  },

  /**
   * تسجيل الخروج من Supabase وتنظيف localStorage
   */
  logout: async (): Promise<void> => {
    await supabaseSignOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('environment');
    localStorage.removeItem('province');
    localStorage.removeItem('supabase_session');
  },

  /**
   * الحصول على بيانات المستخدم الحالي المسجّل دخوله
   * يُرجع null إذا لم يكن هناك مستخدم
   */
  getCurrentUser: async (): Promise<PlatformUser | null> => {
    const user = await supabaseGetCurrentUser();
    if (!user) return null;
    return mapSupabaseUserToPlatform(user);
  },

  /**
   * إرسال رسالة استعادة كلمة المرور
   */
  resetPassword: async (email: string): Promise<AuthResult> => {
    return supabaseResetPassword(email);
  },

  /**
   * التحقق مما إذا كان المستخدم مسجّلاً دخوله حالياً عبر Supabase
   */
  isAuthenticated: async (): Promise<boolean> => {
    const user = await supabaseGetCurrentUser();
    return user !== null;
  },

  /**
   * تحديث بيانات ملف المستخدم في Supabase Auth
   * @param updates - البيانات المراد تحديثها
   */
  updateProfile: async (updates: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const metadata: Record<string, unknown> = {};

    if (updates.firstName !== undefined) metadata.first_name = updates.firstName;
    if (updates.lastName !== undefined)  metadata.last_name  = updates.lastName;
    if (updates.avatar !== undefined)    metadata.avatar_url = updates.avatar;
    if (updates.role !== undefined)      metadata.role       = updates.role;

    if (updates.firstName && updates.lastName) {
      metadata.full_name = `${updates.firstName} ${updates.lastName}`.trim();
    }

    const { error } = await supabase.auth.updateUser({ data: metadata });

    if (error) {
      return { success: false, error: error.message };
    }

    // تحديث localStorage أيضاً
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const updated = { ...parsed, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
    }

    return { success: true };
  },
};

export default supabaseAuthService;
