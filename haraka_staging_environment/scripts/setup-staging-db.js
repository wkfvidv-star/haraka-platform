#!/usr/bin/env node

// سكريبت إعداد قاعدة البيانات التجريبية
const { createClient } = require('@supabase/supabase-js');

const STAGING_CONFIG = {
  supabaseUrl: process.env.VITE_SUPABASE_URL_STAGING || 'https://your-staging-project.supabase.co',
  supabaseKey: process.env.VITE_SUPABASE_SERVICE_KEY_STAGING || 'your-staging-service-key'
};

const supabase = createClient(STAGING_CONFIG.supabaseUrl, STAGING_CONFIG.supabaseKey);

async function setupStagingDatabase() {
  console.log('🚀 بدء إعداد قاعدة البيانات التجريبية...');

  try {
    // إنشاء جدول الطلاب التجريبي
    const studentsTableSQL = `
      CREATE TABLE IF NOT EXISTS students_staging (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        grade INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        is_staging BOOLEAN DEFAULT TRUE
      );
    `;

    // إنشاء جدول التحليلات التجريبي
    const analysisTableSQL = `
      CREATE TABLE IF NOT EXISTS analysis_reports_staging (
        id SERIAL PRIMARY KEY,
        student_id TEXT REFERENCES students_staging(id),
        balance_score DECIMAL(5,2) NOT NULL,
        speed_score DECIMAL(5,2) NOT NULL,
        accuracy_score DECIMAL(5,2) NOT NULL,
        overall_score DECIMAL(5,2) GENERATED ALWAYS AS ((balance_score + speed_score + accuracy_score) / 3) STORED,
        analysis_date TIMESTAMP DEFAULT NOW(),
        is_staging BOOLEAN DEFAULT TRUE
      );
    `;

    // إنشاء جدول الإشعارات التجريبي
    const notificationsTableSQL = `
      CREATE TABLE IF NOT EXISTS notifications_staging (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        recipient_id TEXT,
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        is_staging BOOLEAN DEFAULT TRUE
      );
    `;

    // تنفيذ الاستعلامات
    await supabase.rpc('exec_sql', { sql: studentsTableSQL });
    console.log('✅ جدول الطلاب التجريبي تم إنشاؤه');

    await supabase.rpc('exec_sql', { sql: analysisTableSQL });
    console.log('✅ جدول التحليلات التجريبي تم إنشاؤه');

    await supabase.rpc('exec_sql', { sql: notificationsTableSQL });
    console.log('✅ جدول الإشعارات التجريبي تم إنشاؤه');

    // إنشاء bucket للتخزين
    const { error: bucketError } = await supabase.storage.createBucket('haraka-staging-uploads', {
      public: true,
      allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      fileSizeLimit: 104857600 // 100MB
    });

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.warn('تحذير في إنشاء bucket:', bucketError.message);
    } else {
      console.log('✅ bucket التخزين التجريبي تم إنشاؤه');
    }

    console.log('🎉 تم إعداد قاعدة البيانات التجريبية بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إعداد قاعدة البيانات:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
if (require.main === module) {
  setupStagingDatabase();
}

module.exports = { setupStagingDatabase };