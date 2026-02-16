// دمج الواجهة الأمامية مع Supabase - المرحلة 3ج
// Frontend Integration with Supabase - Phase 3C

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect, useCallback } from 'react';

// إعدادات Supabase للواجهة الأمامية
const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
};

// عميل Supabase للواجهة الأمامية
export const supabase: SupabaseClient = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// أنواع البيانات
export interface StudentProfile {
  id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  class_name: string;
  grade_level: number;
  birth_date?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  status: string;
  total_analyses: number;
  average_performance: number;
  last_analysis_date?: string;
  performance_trend: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisReport {
  id: number;
  student_id: number;
  student_name: string;
  class_name: string;
  grade_level: number;
  balance_score: number;
  speed_score: number;
  accuracy_score: number;
  coordination_score?: number;
  flexibility_score?: number;
  endurance_score?: number;
  overall_score: number;
  session_duration: number;
  exercises_completed: number;
  video_file_path?: string;
  teacher_name?: string;
  teacher_notes?: string;
  improvement_suggestions?: string[];
  risk_factors?: string[];
  performance_category: string;
  needs_followup: boolean;
  analysis_date: string;
  created_at: string;
}

export interface SchoolAnalytics {
  id: number;
  report_date: string;
  total_students: number;
  total_analyses: number;
  avg_overall_score: number;
  avg_balance_score: number;
  avg_speed_score: number;
  avg_accuracy_score: number;
  students_needing_followup: number;
  top_performing_class: string;
  improvement_rate: number;
  monthly_growth: number;
  class_distribution: Record<string, number>;
  performance_distribution: Record<string, number>;
  recommendations: string[];
  created_at: string;
}

export interface NotificationV2 {
  id: number;
  recipient_type: string;
  recipient_id?: number;
  notification_type: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  is_read: boolean;
  read_at?: string;
  related_student_id?: number;
  related_analysis_id?: number;
  action_required: boolean;
  action_taken: boolean;
  created_at: string;
}

// خدمة إدارة البيانات للواجهة الأمامية
export class FrontendDataService {
  
  // جلب جميع الطلاب مع فلترة
  static async getStudents(filters: {
    search?: string;
    class_name?: string;
    grade_level?: number;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: StudentProfile[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('student_profiles_v2')
        .select('*', { count: 'exact' });

      // تطبيق الفلاتر
      if (filters.search) {
        query = query.or(`student_name.ilike.%${filters.search}%,student_code.ilike.%${filters.search}%`);
      }
      
      if (filters.class_name) {
        query = query.eq('class_name', filters.class_name);
      }
      
      if (filters.grade_level) {
        query = query.eq('grade_level', filters.grade_level);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // ترتيب وحدود
      query = query.order('student_name', { ascending: true });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { data: data || [], count: count || 0 };

    } catch (error) {
      console.error('خطأ في جلب الطلاب:', error);
      return { 
        data: [], 
        count: 0, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // جلب طالب محدد مع تحليلاته
  static async getStudentWithAnalyses(studentId: number): Promise<{
    student?: StudentProfile;
    analyses?: AnalysisReport[];
    error?: string;
  }> {
    try {
      // جلب بيانات الطالب
      const { data: student, error: studentError } = await supabase
        .from('student_profiles_v2')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (studentError) {
        throw new Error(`خطأ في جلب بيانات الطالب: ${studentError.message}`);
      }

      // جلب تحليلات الطالب
      const { data: analyses, error: analysesError } = await supabase
        .from('analysis_reports_v2')
        .select('*')
        .eq('student_id', studentId)
        .order('analysis_date', { ascending: false });

      if (analysesError) {
        throw new Error(`خطأ في جلب تحليلات الطالب: ${analysesError.message}`);
      }

      return { student, analyses: analyses || [] };

    } catch (error) {
      console.error('خطأ في جلب بيانات الطالب:', error);
      return { 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // جلب التحليلات مع فلترة
  static async getAnalyses(filters: {
    student_id?: number;
    class_name?: string;
    grade_level?: number;
    min_score?: number;
    max_score?: number;
    date_from?: string;
    date_to?: string;
    needs_followup?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: AnalysisReport[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('analysis_reports_v2')
        .select('*', { count: 'exact' });

      // تطبيق الفلاتر
      if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      
      if (filters.class_name) {
        query = query.eq('class_name', filters.class_name);
      }
      
      if (filters.grade_level) {
        query = query.eq('grade_level', filters.grade_level);
      }
      
      if (filters.min_score !== undefined) {
        query = query.gte('overall_score', filters.min_score);
      }
      
      if (filters.max_score !== undefined) {
        query = query.lte('overall_score', filters.max_score);
      }
      
      if (filters.date_from) {
        query = query.gte('analysis_date', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('analysis_date', filters.date_to);
      }
      
      if (filters.needs_followup !== undefined) {
        query = query.eq('needs_followup', filters.needs_followup);
      }

      // ترتيب وحدود
      query = query.order('analysis_date', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { data: data || [], count: count || 0 };

    } catch (error) {
      console.error('خطأ في جلب التحليلات:', error);
      return { 
        data: [], 
        count: 0, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // جلب إحصائيات المدرسة
  static async getSchoolAnalytics(): Promise<{
    data?: SchoolAnalytics;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('school_analytics_v2')
        .select('*')
        .order('report_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { data };

    } catch (error) {
      console.error('خطأ في جلب إحصائيات المدرسة:', error);
      return { 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // جلب الطلاب المحتاجين للمتابعة
  static async getStudentsNeedingFollowup(): Promise<{
    data: AnalysisReport[];
    count: number;
    error?: string;
  }> {
    try {
      const { data, error, count } = await supabase
        .from('analysis_reports_v2')
        .select('*', { count: 'exact' })
        .eq('needs_followup', true)
        .order('overall_score', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return { data: data || [], count: count || 0 };

    } catch (error) {
      console.error('خطأ في جلب الطلاب المحتاجين للمتابعة:', error);
      return { 
        data: [], 
        count: 0, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // جلب الإشعارات
  static async getNotifications(filters: {
    recipient_type?: string;
    recipient_id?: number;
    unread_only?: boolean;
    limit?: number;
  } = {}): Promise<{ data: NotificationV2[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('notifications_v2')
        .select('*', { count: 'exact' });

      // تطبيق الفلاتر
      if (filters.recipient_type) {
        query = query.eq('recipient_type', filters.recipient_type);
      }
      
      if (filters.recipient_id) {
        query = query.eq('recipient_id', filters.recipient_id);
      }
      
      if (filters.unread_only) {
        query = query.eq('is_read', false);
      }

      // ترتيب وحدود
      query = query.order('created_at', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { data: data || [], count: count || 0 };

    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
      return { 
        data: [], 
        count: 0, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // إنشاء تحليل جديد
  static async createAnalysis(analysisData: Partial<AnalysisReport>): Promise<{
    data?: AnalysisReport;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('analysis_reports_v2')
        .insert([analysisData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { data };

    } catch (error) {
      console.error('خطأ في إنشاء التحليل:', error);
      return { 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // تحديث حالة الإشعار
  static async markNotificationAsRead(notificationId: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await supabase
        .from('notifications_v2')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          status: 'مقروء'
        })
        .eq('id', notificationId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };

    } catch (error) {
      console.error('خطأ في تحديث حالة الإشعار:', error);
      return { 
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }

  // رفع ملف فيديو
  static async uploadVideo(file: File, fileName: string): Promise<{
    path?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.storage
        .from('haraka-videos')
        .upload(fileName, file);

      if (error) {
        throw new Error(error.message);
      }

      return { path: data.path };

    } catch (error) {
      console.error('خطأ في رفع الفيديو:', error);
      return { 
        error: error instanceof Error ? error.message : 'خطأ غير معروف' 
      };
    }
  }
}

// React Hooks للتفاعل مع البيانات

// Hook لجلب الطلاب
export function useStudents(filters: Parameters<typeof FrontendDataService.getStudents>[0] = {}) {
  const [data, setData] = useState<StudentProfile[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FrontendDataService.getStudents(filters);
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
      setCount(result.count);
    }
    
    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { data, count, loading, error, refetch: fetchStudents };
}

// Hook لجلب التحليلات
export function useAnalyses(filters: Parameters<typeof FrontendDataService.getAnalyses>[0] = {}) {
  const [data, setData] = useState<AnalysisReport[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FrontendDataService.getAnalyses(filters);
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
      setCount(result.count);
    }
    
    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return { data, count, loading, error, refetch: fetchAnalyses };
}

// Hook لجلب إحصائيات المدرسة
export function useSchoolAnalytics() {
  const [data, setData] = useState<SchoolAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FrontendDataService.getSchoolAnalytics();
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data || null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}

// Hook لجلب الإشعارات
export function useNotifications(filters: Parameters<typeof FrontendDataService.getNotifications>[0] = {}) {
  const [data, setData] = useState<NotificationV2[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FrontendDataService.getNotifications(filters);
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
      setCount(result.count);
    }
    
    setLoading(false);
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: number) => {
    const result = await FrontendDataService.markNotificationAsRead(notificationId);
    if (result.success) {
      setData(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true, status: 'مقروء' }
          : notification
      ));
    }
    return result;
  }, []);

  return { data, count, loading, error, refetch: fetchNotifications, markAsRead };
}

export default FrontendDataService;