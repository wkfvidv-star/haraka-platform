import { createClient } from '@supabase/supabase-js';
import { STAGING_CONFIG, isStaging } from '@/config/staging';

// إعداد عميل Supabase للبيئة التجريبية
const supabaseUrl = STAGING_CONFIG.database.url;
const supabaseAnonKey = STAGING_CONFIG.database.anonKey;

export const supabaseStaging = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'haraka-staging-auth',
    storage: window.localStorage
  },
  db: {
    schema: STAGING_CONFIG.database.schema
  }
});

// خدمات قاعدة البيانات التجريبية
export class StagingDatabaseService {
  
  // إنشاء الجداول التجريبية
  static async setupStagingTables() {
    if (!isStaging()) {
      throw new Error('هذه الوظيفة متاحة فقط في البيئة التجريبية');
    }

    try {
      // إنشاء جدول التحليلات التجريبي
      const { error: analysisError } = await supabaseStaging.rpc('create_staging_analysis_table');
      if (analysisError) console.warn('Analysis table setup:', analysisError);

      // إنشاء جدول الطلاب التجريبي
      const { error: studentsError } = await supabaseStaging.rpc('create_staging_students_table');
      if (studentsError) console.warn('Students table setup:', studentsError);

      // إنشاء جدول الإشعارات التجريبي
      const { error: notificationsError } = await supabaseStaging.rpc('create_staging_notifications_table');
      if (notificationsError) console.warn('Notifications table setup:', notificationsError);

      console.log('✅ جداول البيئة التجريبية تم إعدادها بنجاح');
      return true;
    } catch (error) {
      console.error('❌ خطأ في إعداد جداول البيئة التجريبية:', error);
      return false;
    }
  }

  // إدراج بيانات تجريبية
  static async seedStagingData() {
    if (!isStaging()) {
      throw new Error('هذه الوظيفة متاحة فقط في البيئة التجريبية');
    }

    const mockStudents = [
      {
        id: 'staging_student_1',
        name: 'أحمد محمد (تجريبي)',
        class: 'الصف الخامس أ',
        grade: 5
      },
      {
        id: 'staging_student_2', 
        name: 'فاطمة علي (تجريبي)',
        class: 'الصف الرابع ب',
        grade: 4
      }
    ];

    const mockAnalyses = [
      {
        student_id: 'staging_student_1',
        balance_score: 78.5,
        speed_score: 82.3,
        accuracy_score: 75.2,
        analysis_date: new Date().toISOString(),
        is_staging: true
      },
      {
        student_id: 'staging_student_2',
        balance_score: 65.8,
        speed_score: 70.1,
        accuracy_score: 68.4,
        analysis_date: new Date().toISOString(),
        is_staging: true
      }
    ];

    try {
      // إدراج الطلاب التجريبيين
      const { error: studentsError } = await supabaseStaging
        .from('students_staging')
        .insert(mockStudents);
      
      if (studentsError) throw studentsError;

      // إدراج التحليلات التجريبية
      const { error: analysesError } = await supabaseStaging
        .from('analysis_reports_staging')
        .insert(mockAnalyses);
      
      if (analysesError) throw analysesError;

      console.log('✅ البيانات التجريبية تم إدراجها بنجاح');
      return true;
    } catch (error) {
      console.error('❌ خطأ في إدراج البيانات التجريبية:', error);
      return false;
    }
  }

  // جلب البيانات التجريبية
  static async getStagingAnalyses() {
    const { data, error } = await supabaseStaging
      .from('analysis_reports_staging')
      .select('*')
      .eq('is_staging', true)
      .order('analysis_date', { ascending: false });

    if (error) {
      console.error('خطأ في جلب التحليلات التجريبية:', error);
      return [];
    }

    return data || [];
  }

  // حذف جميع البيانات التجريبية
  static async clearStagingData() {
    if (!isStaging()) {
      throw new Error('هذه الوظيفة متاحة فقط في البيئة التجريبية');
    }

    try {
      await supabaseStaging.from('analysis_reports_staging').delete().eq('is_staging', true);
      await supabaseStaging.from('students_staging').delete().neq('id', '');
      
      console.log('✅ تم حذف جميع البيانات التجريبية');
      return true;
    } catch (error) {
      console.error('❌ خطأ في حذف البيانات التجريبية:', error);
      return false;
    }
  }
}

export default supabaseStaging;