// دمج Supabase مع النظام - المرحلة 3ج
// Supabase Integration - Phase 3C

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseServiceV2 } from '../src/services/database_v2';

// إعدادات Supabase
const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || 'https://vxzkgizakrkeutfvnmxg.supabase.co',
  anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4emtnaXpha3JrZXV0ZnZubXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTU1NjksImV4cCI6MjA3NzM5MTU2OX0.ZJWz6wX_MkixeDjJKOBfjm_O7OAED77Xlc6Sodzj2Fc',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
};

export class SupabaseIntegration {
  private supabase: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor() {
    // عميل عادي للعمليات العامة
    this.supabase = createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );

    // عميل إداري للعمليات المتقدمة
    this.adminClient = createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.serviceKey
    );

    console.log('✅ تم تهيئة اتصال Supabase بنجاح');
  }

  // إعداد قاعدة البيانات في Supabase
  async setupDatabase(): Promise<boolean> {
    try {
      console.log('🔧 بدء إعداد قاعدة البيانات في Supabase...');

      // إنشاء الجداول الأساسية
      await this.createTables();
      
      // إعداد RLS (Row Level Security)
      await this.setupRLS();
      
      // إنشاء الفهارس
      await this.createIndexes();
      
      // إعداد التخزين
      await this.setupStorage();
      
      // إدراج البيانات التجريبية
      await this.seedData();

      console.log('✅ تم إعداد قاعدة البيانات في Supabase بنجاح');
      return true;

    } catch (error) {
      console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
      return false;
    }
  }

  // إنشاء الجداول
  private async createTables(): Promise<void> {
    const tables = [
      // جدول التحليلات المطور
      `
      CREATE TABLE IF NOT EXISTS analysis_reports_v2 (
        id BIGSERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        grade_level INTEGER NOT NULL,
        balance_score DECIMAL(5,2) NOT NULL CHECK (balance_score >= 0 AND balance_score <= 100),
        speed_score DECIMAL(5,2) NOT NULL CHECK (speed_score >= 0 AND speed_score <= 100),
        accuracy_score DECIMAL(5,2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
        coordination_score DECIMAL(5,2) DEFAULT 0,
        flexibility_score DECIMAL(5,2) DEFAULT 0,
        endurance_score DECIMAL(5,2) DEFAULT 0,
        overall_score DECIMAL(5,2) GENERATED ALWAYS AS (
          (balance_score + speed_score + accuracy_score + 
           COALESCE(coordination_score, 0) + COALESCE(flexibility_score, 0) + COALESCE(endurance_score, 0)) / 6
        ) STORED,
        session_duration INTEGER NOT NULL DEFAULT 0,
        exercises_completed INTEGER DEFAULT 0,
        video_file_path TEXT,
        analysis_metadata JSONB DEFAULT '{}',
        teacher_name VARCHAR(255),
        teacher_notes TEXT,
        improvement_suggestions TEXT[],
        risk_factors TEXT[],
        performance_category VARCHAR(50) DEFAULT 'متوسط',
        needs_followup BOOLEAN GENERATED ALWAYS AS (overall_score < 60) STORED,
        analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,

      // جدول ملفات الطلاب المطور
      `
      CREATE TABLE IF NOT EXISTS student_profiles_v2 (
        id BIGSERIAL PRIMARY KEY,
        student_id INTEGER UNIQUE NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        student_code VARCHAR(50) UNIQUE NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        grade_level INTEGER NOT NULL,
        birth_date DATE,
        gender VARCHAR(10) CHECK (gender IN ('ذكر', 'أنثى')),
        height_cm INTEGER,
        weight_kg DECIMAL(5,2),
        medical_conditions TEXT[],
        emergency_contact JSONB DEFAULT '{}',
        parent_info JSONB DEFAULT '{}',
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'نشط' CHECK (status IN ('نشط', 'معلق', 'محول', 'متخرج')),
        total_analyses INTEGER DEFAULT 0,
        average_performance DECIMAL(5,2) DEFAULT 0,
        last_analysis_date TIMESTAMP WITH TIME ZONE,
        performance_trend VARCHAR(20) DEFAULT 'مستقر',
        special_needs TEXT,
        achievements TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,

      // جدول إحصائيات المدرسة
      `
      CREATE TABLE IF NOT EXISTS school_analytics_v2 (
        id BIGSERIAL PRIMARY KEY,
        report_date DATE DEFAULT CURRENT_DATE,
        total_students INTEGER DEFAULT 0,
        total_analyses INTEGER DEFAULT 0,
        avg_overall_score DECIMAL(5,2) DEFAULT 0,
        avg_balance_score DECIMAL(5,2) DEFAULT 0,
        avg_speed_score DECIMAL(5,2) DEFAULT 0,
        avg_accuracy_score DECIMAL(5,2) DEFAULT 0,
        students_needing_followup INTEGER DEFAULT 0,
        top_performing_class VARCHAR(100),
        improvement_rate DECIMAL(5,2) DEFAULT 0,
        monthly_growth DECIMAL(5,2) DEFAULT 0,
        class_distribution JSONB DEFAULT '{}',
        performance_distribution JSONB DEFAULT '{}',
        risk_analysis JSONB DEFAULT '{}',
        recommendations TEXT[],
        generated_by VARCHAR(255),
        report_type VARCHAR(50) DEFAULT 'يومي',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,

      // جدول الإشعارات المطور
      `
      CREATE TABLE IF NOT EXISTS notifications_v2 (
        id BIGSERIAL PRIMARY KEY,
        recipient_type VARCHAR(50) NOT NULL CHECK (recipient_type IN ('مدير', 'معلم', 'ولي_أمر', 'جميع')),
        recipient_id INTEGER,
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'متوسط' CHECK (priority IN ('منخفض', 'متوسط', 'عالي', 'عاجل')),
        status VARCHAR(20) DEFAULT 'جديد' CHECK (status IN ('جديد', 'مرسل', 'مقروء', 'محذوف')),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP WITH TIME ZONE,
        related_student_id INTEGER,
        related_analysis_id INTEGER,
        action_required BOOLEAN DEFAULT FALSE,
        action_taken BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `
    ];

    for (const tableSQL of tables) {
      const { error } = await this.adminClient.rpc('exec_sql', { 
        sql: tableSQL 
      });
      
      if (error) {
        console.error('خطأ في إنشاء جدول:', error);
        throw error;
      }
    }

    console.log('✅ تم إنشاء جميع الجداول بنجاح');
  }

  // إعداد Row Level Security
  private async setupRLS(): Promise<void> {
    const rlsPolicies = [
      // سياسات الأمان للتحليلات
      `
      ALTER TABLE analysis_reports_v2 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "allow_read_all_analyses" ON analysis_reports_v2
        FOR SELECT USING (true);
      
      CREATE POLICY "allow_insert_analyses" ON analysis_reports_v2
        FOR INSERT TO authenticated WITH CHECK (true);
      
      CREATE POLICY "allow_update_own_analyses" ON analysis_reports_v2
        FOR UPDATE TO authenticated USING (true);
      `,

      // سياسات الأمان للطلاب
      `
      ALTER TABLE student_profiles_v2 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "allow_read_all_students" ON student_profiles_v2
        FOR SELECT USING (true);
      
      CREATE POLICY "allow_manage_students" ON student_profiles_v2
        FOR ALL TO authenticated USING (true);
      `,

      // سياسات الأمان للإحصائيات
      `
      ALTER TABLE school_analytics_v2 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "allow_read_analytics" ON school_analytics_v2
        FOR SELECT USING (true);
      
      CREATE POLICY "allow_insert_analytics" ON school_analytics_v2
        FOR INSERT TO authenticated WITH CHECK (true);
      `,

      // سياسات الأمان للإشعارات
      `
      ALTER TABLE notifications_v2 ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "allow_read_notifications" ON notifications_v2
        FOR SELECT USING (true);
      
      CREATE POLICY "allow_manage_notifications" ON notifications_v2
        FOR ALL TO authenticated USING (true);
      `
    ];

    for (const policy of rlsPolicies) {
      const { error } = await this.adminClient.rpc('exec_sql', { 
        sql: policy 
      });
      
      if (error && !error.message.includes('already exists')) {
        console.warn('تحذير في إعداد RLS:', error.message);
      }
    }

    console.log('✅ تم إعداد سياسات الأمان (RLS) بنجاح');
  }

  // إنشاء الفهارس للأداء
  private async createIndexes(): Promise<void> {
    const indexes = [
      // فهارس جدول التحليلات
      'CREATE INDEX IF NOT EXISTS idx_analysis_student_id ON analysis_reports_v2(student_id);',
      'CREATE INDEX IF NOT EXISTS idx_analysis_class_name ON analysis_reports_v2(class_name);',
      'CREATE INDEX IF NOT EXISTS idx_analysis_overall_score ON analysis_reports_v2(overall_score);',
      'CREATE INDEX IF NOT EXISTS idx_analysis_date ON analysis_reports_v2(analysis_date);',
      'CREATE INDEX IF NOT EXISTS idx_analysis_needs_followup ON analysis_reports_v2(needs_followup);',

      // فهارس جدول الطلاب
      'CREATE INDEX IF NOT EXISTS idx_student_code ON student_profiles_v2(student_code);',
      'CREATE INDEX IF NOT EXISTS idx_student_class ON student_profiles_v2(class_name);',
      'CREATE INDEX IF NOT EXISTS idx_student_grade ON student_profiles_v2(grade_level);',
      'CREATE INDEX IF NOT EXISTS idx_student_status ON student_profiles_v2(status);',

      // فهارس جدول الإحصائيات
      'CREATE INDEX IF NOT EXISTS idx_analytics_date ON school_analytics_v2(report_date);',
      'CREATE INDEX IF NOT EXISTS idx_analytics_type ON school_analytics_v2(report_type);',

      // فهارس جدول الإشعارات
      'CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications_v2(recipient_type, recipient_id);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications_v2(notification_type);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications_v2(status);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications_v2(priority);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications_v2(is_read);',
      'CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications_v2(created_at);'
    ];

    for (const indexSQL of indexes) {
      const { error } = await this.adminClient.rpc('exec_sql', { 
        sql: indexSQL 
      });
      
      if (error && !error.message.includes('already exists')) {
        console.warn('تحذير في إنشاء فهرس:', error.message);
      }
    }

    console.log('✅ تم إنشاء جميع الفهارس بنجاح');
  }

  // إعداد التخزين للملفات
  private async setupStorage(): Promise<void> {
    try {
      // إنشاء bucket للفيديوهات
      const { error: videoBucketError } = await this.adminClient.storage
        .createBucket('haraka-videos', {
          public: false,
          allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
          fileSizeLimit: 104857600 // 100MB
        });

      if (videoBucketError && !videoBucketError.message.includes('already exists')) {
        console.warn('تحذير في إنشاء bucket الفيديوهات:', videoBucketError.message);
      }

      // إنشاء bucket للتقارير
      const { error: reportsBucketError } = await this.adminClient.storage
        .createBucket('haraka-reports', {
          public: false,
          allowedMimeTypes: ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          fileSizeLimit: 52428800 // 50MB
        });

      if (reportsBucketError && !reportsBucketError.message.includes('already exists')) {
        console.warn('تحذير في إنشاء bucket التقارير:', reportsBucketError.message);
      }

      // سياسات الأمان للتخزين
      const storagePolicies = `
        CREATE POLICY "allow_authenticated_upload_videos" ON storage.objects
          FOR INSERT TO authenticated WITH CHECK (bucket_id = 'haraka-videos');
        
        CREATE POLICY "allow_authenticated_read_videos" ON storage.objects
          FOR SELECT TO authenticated USING (bucket_id = 'haraka-videos');
        
        CREATE POLICY "allow_authenticated_upload_reports" ON storage.objects
          FOR INSERT TO authenticated WITH CHECK (bucket_id = 'haraka-reports');
        
        CREATE POLICY "allow_authenticated_read_reports" ON storage.objects
          FOR SELECT TO authenticated USING (bucket_id = 'haraka-reports');
      `;

      const { error: policyError } = await this.adminClient.rpc('exec_sql', { 
        sql: storagePolicies 
      });

      if (policyError && !policyError.message.includes('already exists')) {
        console.warn('تحذير في سياسات التخزين:', policyError.message);
      }

      console.log('✅ تم إعداد التخزين بنجاح');

    } catch (error) {
      console.error('❌ خطأ في إعداد التخزين:', error);
    }
  }

  // إدراج البيانات التجريبية
  private async seedData(): Promise<void> {
    try {
      // بيانات طلاب تجريبية
      const studentsData = [
        {
          student_id: 1001,
          student_name: 'أحمد محمد علي',
          student_code: 'ST001',
          class_name: 'الصف الخامس أ',
          grade_level: 5,
          birth_date: '2014-03-15',
          gender: 'ذكر',
          height_cm: 140,
          weight_kg: 35.5
        },
        {
          student_id: 1002,
          student_name: 'فاطمة أحمد حسن',
          student_code: 'ST002',
          class_name: 'الصف الخامس أ',
          grade_level: 5,
          birth_date: '2014-07-22',
          gender: 'أنثى',
          height_cm: 138,
          weight_kg: 33.2
        },
        {
          student_id: 1003,
          student_name: 'عبدالرحمن طارق',
          student_code: 'ST003',
          class_name: 'الصف الرابع ب',
          grade_level: 4,
          birth_date: '2015-01-10',
          gender: 'ذكر',
          height_cm: 135,
          weight_kg: 32.0
        },
        {
          student_id: 1004,
          student_name: 'سارة عبدالله',
          student_code: 'ST004',
          class_name: 'الصف الرابع ب',
          grade_level: 4,
          birth_date: '2015-05-18',
          gender: 'أنثى',
          height_cm: 133,
          weight_kg: 30.8
        },
        {
          student_id: 1005,
          student_name: 'محمد خالد',
          student_code: 'ST005',
          class_name: 'الصف الثالث ج',
          grade_level: 3,
          birth_date: '2016-09-03',
          gender: 'ذكر',
          height_cm: 128,
          weight_kg: 28.5
        }
      ];

      const { error: studentsError } = await this.supabase
        .from('student_profiles_v2')
        .upsert(studentsData, { onConflict: 'student_code' });

      if (studentsError) {
        console.warn('تحذير في إدراج بيانات الطلاب:', studentsError.message);
      }

      // بيانات تحليلات تجريبية
      const analysesData = [
        {
          student_id: 1001,
          student_name: 'أحمد محمد علي',
          class_name: 'الصف الخامس أ',
          grade_level: 5,
          balance_score: 78.5,
          speed_score: 82.1,
          accuracy_score: 75.8,
          coordination_score: 80.0,
          flexibility_score: 77.3,
          endurance_score: 79.2,
          session_duration: 1800,
          exercises_completed: 12,
          teacher_name: 'أ. محمد الأحمد',
          teacher_notes: 'أداء جيد مع إمكانية للتحسن في التوازن',
          improvement_suggestions: ['تمارين التوازن اليومية', 'تقوية عضلات الجذع'],
          performance_category: 'جيد'
        },
        {
          student_id: 1002,
          student_name: 'فاطمة أحمد حسن',
          class_name: 'الصف الخامس أ',
          grade_level: 5,
          balance_score: 85.2,
          speed_score: 79.6,
          accuracy_score: 88.1,
          coordination_score: 86.5,
          flexibility_score: 90.0,
          endurance_score: 82.3,
          session_duration: 1650,
          exercises_completed: 15,
          teacher_name: 'أ. محمد الأحمد',
          teacher_notes: 'أداء ممتاز، تظهر مهارات حركية متقدمة',
          improvement_suggestions: ['الحفاظ على المستوى الحالي', 'تطوير السرعة'],
          performance_category: 'ممتاز'
        },
        {
          student_id: 1003,
          student_name: 'عبدالرحمن طارق',
          class_name: 'الصف الرابع ب',
          grade_level: 4,
          balance_score: 58.1,
          speed_score: 62.4,
          accuracy_score: 55.7,
          coordination_score: 60.0,
          flexibility_score: 56.8,
          endurance_score: 59.2,
          session_duration: 1200,
          exercises_completed: 8,
          teacher_name: 'أ. سارة خليل',
          teacher_notes: 'يحتاج لمتابعة إضافية وتمارين تقوية',
          improvement_suggestions: ['برنامج تحسين مكثف', 'تمارين يومية مع المنزل'],
          risk_factors: ['أداء أقل من المتوسط', 'قد يحتاج تدخل متخصص'],
          performance_category: 'يحتاج تحسين'
        },
        {
          student_id: 1004,
          student_name: 'سارة عبدالله',
          class_name: 'الصف الرابع ب',
          grade_level: 4,
          balance_score: 84.4,
          speed_score: 87.2,
          accuracy_score: 85.9,
          coordination_score: 88.1,
          flexibility_score: 89.5,
          endurance_score: 86.7,
          session_duration: 1950,
          exercises_completed: 18,
          teacher_name: 'أ. سارة خليل',
          teacher_notes: 'أداء استثنائي، موهبة حركية واضحة',
          improvement_suggestions: ['برامج متقدمة للموهوبين', 'أنشطة تحدي إضافية'],
          performance_category: 'متفوق'
        },
        {
          student_id: 1005,
          student_name: 'محمد خالد',
          class_name: 'الصف الثالث ج',
          grade_level: 3,
          balance_score: 72.3,
          speed_score: 68.9,
          accuracy_score: 74.1,
          coordination_score: 71.5,
          flexibility_score: 73.8,
          endurance_score: 69.7,
          session_duration: 1350,
          exercises_completed: 10,
          teacher_name: 'أ. عبدالله نور',
          teacher_notes: 'أداء متوسط مناسب للعمر',
          improvement_suggestions: ['تنويع التمارين', 'تشجيع الأنشطة الحركية'],
          performance_category: 'متوسط'
        }
      ];

      const { error: analysesError } = await this.supabase
        .from('analysis_reports_v2')
        .insert(analysesData);

      if (analysesError) {
        console.warn('تحذير في إدراج بيانات التحليلات:', analysesError.message);
      }

      // إحصائيات المدرسة التجريبية
      const schoolStats = {
        total_students: 456,
        total_analyses: 1234,
        avg_overall_score: 74.2,
        avg_balance_score: 75.8,
        avg_speed_score: 73.1,
        avg_accuracy_score: 76.9,
        students_needing_followup: 23,
        top_performing_class: 'الصف الخامس أ',
        improvement_rate: 12.5,
        monthly_growth: 3.2,
        class_distribution: {
          'الصف الثالث': 152,
          'الصف الرابع': 148,
          'الصف الخامس': 156
        },
        performance_distribution: {
          'ممتاز': 89,
          'جيد جداً': 156,
          'جيد': 134,
          'متوسط': 54,
          'يحتاج تحسين': 23
        },
        recommendations: [
          'زيادة التركيز على تمارين التوازن',
          'برامج تحسين للطلاب ذوي الأداء المنخفض',
          'تطوير برامج للطلاب المتفوقين'
        ]
      };

      const { error: statsError } = await this.supabase
        .from('school_analytics_v2')
        .insert(schoolStats);

      if (statsError) {
        console.warn('تحذير في إدراج إحصائيات المدرسة:', statsError.message);
      }

      console.log('✅ تم إدراج البيانات التجريبية بنجاح');

    } catch (error) {
      console.error('❌ خطأ في إدراج البيانات التجريبية:', error);
    }
  }

  // اختبار الاتصال والوظائف
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 اختبار اتصال Supabase...');

      // اختبار قراءة البيانات
      const { data: students, error: studentsError } = await this.supabase
        .from('student_profiles_v2')
        .select('*')
        .limit(5);

      if (studentsError) {
        throw new Error(`خطأ في قراءة بيانات الطلاب: ${studentsError.message}`);
      }

      const { data: analyses, error: analysesError } = await this.supabase
        .from('analysis_reports_v2')
        .select('*')
        .limit(5);

      if (analysesError) {
        throw new Error(`خطأ في قراءة بيانات التحليلات: ${analysesError.message}`);
      }

      // اختبار التخزين
      const { data: buckets, error: bucketsError } = await this.supabase.storage.listBuckets();

      if (bucketsError) {
        throw new Error(`خطأ في الوصول للتخزين: ${bucketsError.message}`);
      }

      console.log('✅ نتائج الاختبار:');
      console.log(`   - الطلاب: ${students?.length || 0} سجل`);
      console.log(`   - التحليلات: ${analyses?.length || 0} سجل`);
      console.log(`   - buckets التخزين: ${buckets?.length || 0}`);

      return true;

    } catch (error) {
      console.error('❌ فشل اختبار الاتصال:', error);
      return false;
    }
  }

  // الحصول على إحصائيات سريعة
  async getQuickStats(): Promise<any> {
    try {
      const [studentsCount, analysesCount, avgScore] = await Promise.all([
        this.supabase
          .from('student_profiles_v2')
          .select('*', { count: 'exact', head: true }),
        
        this.supabase
          .from('analysis_reports_v2')
          .select('*', { count: 'exact', head: true }),
        
        this.supabase
          .from('analysis_reports_v2')
          .select('overall_score')
      ]);

      const avgOverallScore = avgScore.data?.length > 0 
        ? avgScore.data.reduce((sum, item) => sum + item.overall_score, 0) / avgScore.data.length
        : 0;

      return {
        total_students: studentsCount.count || 0,
        total_analyses: analysesCount.count || 0,
        average_score: Math.round(avgOverallScore * 100) / 100,
        connection_status: 'متصل',
        last_check: new Date().toISOString()
      };

    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      return {
        total_students: 0,
        total_analyses: 0,
        average_score: 0,
        connection_status: 'خطأ في الاتصال',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  // تنظيف البيانات التجريبية
  async cleanupTestData(): Promise<boolean> {
    try {
      console.log('🧹 تنظيف البيانات التجريبية...');

      // حذف البيانات بالترتيب الصحيح (بسبب المراجع الخارجية)
      await this.supabase.from('notifications_v2').delete().neq('id', 0);
      await this.supabase.from('school_analytics_v2').delete().neq('id', 0);
      await this.supabase.from('analysis_reports_v2').delete().neq('id', 0);
      await this.supabase.from('student_profiles_v2').delete().neq('id', 0);

      console.log('✅ تم تنظيف البيانات التجريبية بنجاح');
      return true;

    } catch (error) {
      console.error('❌ خطأ في تنظيف البيانات:', error);
      return false;
    }
  }
}

export default SupabaseIntegration;