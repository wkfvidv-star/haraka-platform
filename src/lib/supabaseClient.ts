// ============================================================
//  supabaseClient.ts
//  ملف تهيئة Supabase الكامل لمنصة حركة
//  يعمل محلياً مع السيرفر على localhost:3001
//  ويعمل على Vercel في الإنتاج
// ============================================================

import { createClient, type AuthError, type User, type Session } from '@supabase/supabase-js';

// ── 1. قراءة المتغيرات البيئية من ملف .env ──────────────────
//  في التطوير: تُقرأ من .env
//  في Vercel:  تُقرأ من Environment Variables في لوحة Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ── 2. التحقق من وجود المتغيرات ─────────────────────────────
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] ⚠️ المتغيرات البيئية مفقودة!\n' +
    'تأكد من وجود VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env'
  );
}

// ── 3. إنشاء عميل Supabase الرئيسي ──────────────────────────
//  هذا هو Client الوحيد المُشترك في كامل المشروع (Singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // حفظ الجلسة تلقائياً في localStorage
    persistSession: true,
    // تجديد التوكن تلقائياً قبل انتهاء صلاحيته
    autoRefreshToken: true,
    // اكتشاف الـ session من URL بعد OAuth أو Magic Link
    detectSessionInUrl: true,
  },
});

// ============================================================
//  TYPES - أنواع البيانات المُستخدمة
// ============================================================

export interface AuthResult {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export interface DbResult<T> {
  data: T | null;
  error: string | null;
}

// ============================================================
//  AUTH FUNCTIONS - وظائف المصادقة
// ============================================================

/**
 * تسجيل مستخدم جديد بالبريد الإلكتروني وكلمة المرور
 * @param email  - البريد الإلكتروني
 * @param password - كلمة المرور (8 أحرف على الأقل)
 * @param metadata - بيانات إضافية مثل الاسم والدور
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata ?? {},
    },
  });

  if (error) {
    console.error('[Supabase Auth] خطأ في التسجيل:', error.message);
    return { success: false, error: translateAuthError(error) };
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

/**
 * تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
 * @param email    - البريد الإلكتروني
 * @param password - كلمة المرور
 */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('[Supabase Auth] خطأ في تسجيل الدخول:', error.message);
    return { success: false, error: translateAuthError(error) };
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

/**
 * إرسال Magic Link للدخول بدون كلمة مرور
 * @param email - البريد الإلكتروني الذي سيُرسل إليه الرابط
 */
export async function supabaseSignInWithMagicLink(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return { success: false, error: translateAuthError(error) };
  }

  return { success: true };
}

/**
 * تسجيل الخروج من Supabase وحذف الجلسة المحلية
 */
export async function supabaseSignOut(): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * الحصول على المستخدم الحالي من الجلسة النشطة
 * يُرجع null إذا لم يكن هناك مستخدم مسجّل دخول
 */
export async function supabaseGetCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * الحصول على الجلسة الحالية (تحتوي على access_token)
 */
export async function supabaseGetSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

/**
 * الاستماع لتغييرات حالة المصادقة (تسجيل دخول / خروج / تجديد التوكن)
 * @param callback - دالة تُستدعى عند كل تغيير
 * @returns unsubscribe - دالة لإيقاف الاستماع
 */
export function supabaseOnAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );
  return () => subscription.unsubscribe();
}

/**
 * إرسال بريد إلكتروني لاستعادة كلمة المرور
 * @param email - البريد الإلكتروني المرتبط بالحساب
 */
export async function supabaseResetPassword(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return { success: false, error: translateAuthError(error) };
  }

  return { success: true };
}

// ============================================================
//  DATABASE FUNCTIONS - وظائف قاعدة البيانات
// ============================================================

/**
 * جلب جميع الصفوف من جدول معيّن
 * @param table   - اسم الجدول في Supabase
 * @param options - خيارات إضافية (فلترة، ترتيب، عدد)
 *
 * مثال:
 *   const { data } = await supabaseFetchAll('profiles');
 *   const { data } = await supabaseFetchAll('sessions', { column: 'student_id', value: userId });
 */
export async function supabaseFetchAll<T = Record<string, unknown>>(
  table: string,
  options?: {
    column?: string;
    value?: unknown;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
  }
): Promise<DbResult<T[]>> {
  let query = supabase.from(table).select('*');

  if (options?.column && options?.value !== undefined) {
    query = query.eq(options.column, options.value);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options?.ascending ?? false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`[Supabase DB] خطأ في جلب بيانات ${table}:`, error.message);
    return { data: null, error: error.message };
  }

  return { data: data as T[], error: null };
}

/**
 * جلب صف واحد بناءً على عمود ومعرّف
 * @param table  - اسم الجدول
 * @param column - اسم العمود للبحث به
 * @param value  - القيمة المطلوبة
 *
 * مثال:
 *   const { data } = await supabaseFetchOne('profiles', 'id', userId);
 */
export async function supabaseFetchOne<T = Record<string, unknown>>(
  table: string,
  column: string,
  value: unknown
): Promise<DbResult<T>> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(column, value)
    .single();

  if (error) {
    console.error(`[Supabase DB] خطأ في جلب صف من ${table}:`, error.message);
    return { data: null, error: error.message };
  }

  return { data: data as T, error: null };
}

/**
 * إدراج صف جديد في جدول
 * @param table - اسم الجدول
 * @param row   - البيانات المراد إدراجها
 *
 * مثال:
 *   const { data } = await supabaseInsert('sessions', { student_id: '...', score: 95 });
 */
export async function supabaseInsert<T = Record<string, unknown>>(
  table: string,
  row: Record<string, unknown>
): Promise<DbResult<T>> {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error(`[Supabase DB] خطأ في الإدراج في ${table}:`, error.message);
    return { data: null, error: error.message };
  }

  return { data: data as T, error: null };
}

/**
 * تحديث صف موجود في جدول
 * @param table  - اسم الجدول
 * @param id     - معرّف الصف المراد تحديثه
 * @param updates - البيانات الجديدة
 *
 * مثال:
 *   const { data } = await supabaseUpdate('profiles', userId, { avatar_url: '...' });
 */
export async function supabaseUpdate<T = Record<string, unknown>>(
  table: string,
  id: string | number,
  updates: Record<string, unknown>
): Promise<DbResult<T>> {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Supabase DB] خطأ في تحديث ${table}:`, error.message);
    return { data: null, error: error.message };
  }

  return { data: data as T, error: null };
}

/**
 * حذف صف من جدول
 * @param table - اسم الجدول
 * @param id    - معرّف الصف المراد حذفه
 */
export async function supabaseDelete(
  table: string,
  id: string | number
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[Supabase DB] خطأ في الحذف من ${table}:`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * تشغيل استعلام مخصص بـ RPC (Stored Procedure في Supabase)
 * @param fnName - اسم الدالة في Supabase
 * @param params - المعاملات المُمرَّرة للدالة
 *
 * مثال:
 *   const { data } = await supabaseRpc('get_student_stats', { p_student_id: userId });
 */
export async function supabaseRpc<T = unknown>(
  fnName: string,
  params?: Record<string, unknown>
): Promise<DbResult<T>> {
  const { data, error } = await supabase.rpc(fnName, params);

  if (error) {
    console.error(`[Supabase RPC] خطأ في استدعاء ${fnName}:`, error.message);
    return { data: null, error: error.message };
  }

  return { data: data as T, error: null };
}

// ============================================================
//  STORAGE FUNCTIONS - وظائف التخزين (رفع الملفات)
// ============================================================

/**
 * رفع ملف إلى Supabase Storage
 * @param bucket   - اسم الـ bucket (مثال: 'avatars', 'videos', 'documents')
 * @param path     - المسار داخل الـ bucket (مثال: 'user-123/avatar.png')
 * @param file     - الملف المراد رفعه
 * @param upsert   - استبدال الملف إذا كان موجوداً (افتراضي: true)
 *
 * مثال:
 *   const { url } = await supabaseUploadFile('avatars', `${userId}/photo.png`, file);
 */
export async function supabaseUploadFile(
  bucket: string,
  path: string,
  file: File,
  upsert = true
): Promise<{ url: string | null; error: string | null }> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert });

  if (uploadError) {
    console.error('[Supabase Storage] خطأ في رفع الملف:', uploadError.message);
    return { url: null, error: uploadError.message };
  }

  // الحصول على الرابط العام للملف
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}

/**
 * الحصول على الرابط العام لملف موجود في Supabase Storage
 * @param bucket - اسم الـ bucket
 * @param path   - المسار داخل الـ bucket
 */
export function supabaseGetFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * حذف ملف من Supabase Storage
 * @param bucket - اسم الـ bucket
 * @param path   - المسار داخل الـ bucket
 */
export async function supabaseDeleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('[Supabase Storage] خطأ في حذف الملف:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================
//  REALTIME FUNCTIONS - وظائف الوقت الحقيقي
// ============================================================

/**
 * الاشتراك في تغييرات جدول معيّن بالوقت الحقيقي
 * @param table    - اسم الجدول للاستماع إليه
 * @param callback - دالة تُستدعى عند كل تغيير
 * @returns دالة لإلغاء الاشتراك
 *
 * مثال:
 *   const unsubscribe = supabaseSubscribeToTable('notifications', (payload) => {
 *     console.log('تغيير جديد:', payload);
 *   });
 *   // لاحقاً: unsubscribe();
 */
export function supabaseSubscribeToTable(
  table: string,
  callback: (payload: Record<string, unknown>) => void
): () => void {
  const channel = supabase
    .channel(`realtime:${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => callback(payload as Record<string, unknown>)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * تنفيذ دالة مع إمكانية إعادة المحاولة تلقائياً (Automatic Retry)
 * مفيد جداً لتجاوز حدود إرسال البريد (Rate Limits) اللحظية
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffFactor = 2,
    shouldRetry = (err) => err?.message?.includes('rate limit') || err?.status === 429
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (attempt < maxRetries && shouldRetry(error)) {
        console.warn(`[Retry] المحاولة ${attempt + 1} فشلت بسبب حدود الطلب، إعادة المحاولة بعد ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoffFactor;
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// ============================================================
//  HELPER FUNCTIONS - أدوات مساعدة
// ============================================================

/**
 * ترجمة رسائل أخطاء Supabase إلى العربية بشكل احترافي
 */
function translateAuthError(error: AuthError | string | any): string {
  const message = typeof error === 'string' ? error : error?.message || '';
  
  const errorMap: Record<string, string> = {
    'Invalid login credentials':       'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'Email not confirmed':             'يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليك',
    'User already registered':         'هذا البريد الإلكتروني مسجّل مسبقاً، جرب تسجيل الدخول',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل للأمان',
    'Email rate limit exceeded':       'لقد تجاوزت الحد المسموح به لإرسال البريد. لا تقلق، سنقوم بإعادة المحاولة تلقائياً أو يمكنك الانتظار دقيقة واحدة.',
    'Invalid email':                   'صيغة البريد الإلكتروني غير صحيحة، يرجى التأكد منها',
    'Signup disabled':                 'التسجيل مُعطَّل حالياً للصيانة، حاول لاحقاً',
    'User not found':                  'المستخدم غير موجود أو لم يتم تفعيل الحساب بعد',
  };

  // البحث عن كلمات مفتاحية إذا لم يتطابق النص تماماً
  if (message.includes('rate limit')) return errorMap['Email rate limit exceeded'];
  if (message.includes('already registered')) return errorMap['User already registered'];
  if (message.includes('confirm')) return errorMap['Email not confirmed'];

  return errorMap[message] ?? `عذراً، حدث خطأ: ${message}`;
}

/**
 * التحقق من أن Supabase مُهيَّأ بشكل صحيح
 * مفيد في أثناء التطوير للتشخيص
 */
export function checkSupabaseConfig(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] ❌ التهيئة ناقصة - تحقق من ملف .env');
    return false;
  }
  console.info('[Supabase] ✅ التهيئة ناجحة:', supabaseUrl);
  return true;
}
