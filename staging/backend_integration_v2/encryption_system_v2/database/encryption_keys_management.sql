-- جدول إدارة المفاتيح المشفرة - منصة حركة
-- Encryption Keys Management Table - Haraka Platform

-- إنشاء جدول إدارة المفاتيح
CREATE TABLE IF NOT EXISTS haraka_encryption_keys_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_id VARCHAR(255) UNIQUE NOT NULL,
    key_type VARCHAR(50) NOT NULL CHECK (key_type IN ('master', 'data', 'file', 'backup')),
    key_purpose VARCHAR(100) NOT NULL, -- 'video_analysis', 'student_reports', 'training_files', etc.
    
    -- معلومات التشفير
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM' NOT NULL,
    key_version INTEGER DEFAULT 1 NOT NULL,
    key_status VARCHAR(20) DEFAULT 'active' CHECK (key_status IN ('active', 'rotating', 'deprecated', 'revoked')),
    
    -- مفتاح مشفر (encrypted with master key)
    encrypted_key_data TEXT NOT NULL,
    key_metadata JSONB DEFAULT '{}',
    
    -- معلومات KMS
    kms_provider VARCHAR(50) NOT NULL, -- 'supabase_vault', 'aws_kms', 'google_kms', 'azure_vault'
    kms_key_id VARCHAR(500), -- External KMS key identifier
    kms_region VARCHAR(50),
    
    -- تدوير المفاتيح
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_rotated_at TIMESTAMP WITH TIME ZONE,
    rotation_schedule_days INTEGER DEFAULT 90, -- تدوير كل 90 يوم
    
    -- معلومات الوصول والأمان
    created_by UUID REFERENCES auth.users(id),
    access_policy JSONB DEFAULT '{}', -- IAM policies and role restrictions
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- معلومات إضافية
    description TEXT,
    tags JSONB DEFAULT '{}',
    
    -- فهارس للأداء
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- إنشاء فهارس محسنة
CREATE INDEX IF NOT EXISTS idx_encryption_keys_key_id ON haraka_encryption_keys_v2(key_id);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_type_purpose ON haraka_encryption_keys_v2(key_type, key_purpose);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_status ON haraka_encryption_keys_v2(key_status);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_expires ON haraka_encryption_keys_v2(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_encryption_keys_rotation ON haraka_encryption_keys_v2(last_rotated_at, rotation_schedule_days);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_kms ON haraka_encryption_keys_v2(kms_provider, kms_key_id);

-- جدول الملفات المشفرة
CREATE TABLE IF NOT EXISTS haraka_encrypted_files_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id VARCHAR(255) UNIQUE NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL, -- 'video_analysis', 'student_report', 'training_material'
    
    -- معلومات التشفير
    encryption_key_id UUID REFERENCES haraka_encryption_keys_v2(id) ON DELETE RESTRICT,
    encrypted_file_path TEXT NOT NULL, -- مسار الملف المشفر
    file_hash VARCHAR(128) NOT NULL, -- SHA-256 hash للتحقق من سلامة الملف
    encryption_iv VARCHAR(64) NOT NULL, -- Initialization Vector
    
    -- معلومات الملف
    original_size_bytes BIGINT NOT NULL,
    encrypted_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    
    -- معلومات الوصول
    owner_id UUID REFERENCES auth.users(id),
    related_student_id INTEGER, -- ربط بجدول الطلاب
    related_analysis_id INTEGER, -- ربط بجدول التحليلات
    
    -- صلاحيات الوصول
    access_level VARCHAR(20) DEFAULT 'private' CHECK (access_level IN ('public', 'internal', 'private', 'restricted')),
    allowed_roles JSONB DEFAULT '[]', -- قائمة الأدوار المسموح لها بالوصول
    
    -- معلومات زمنية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- معلومات إضافية
    metadata JSONB DEFAULT '{}',
    tags JSONB DEFAULT '{}',
    description TEXT,
    
    CONSTRAINT valid_file_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- فهارس للملفات المشفرة
CREATE INDEX IF NOT EXISTS idx_encrypted_files_file_id ON haraka_encrypted_files_v2(file_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_type ON haraka_encrypted_files_v2(file_type);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_owner ON haraka_encrypted_files_v2(owner_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_student ON haraka_encrypted_files_v2(related_student_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_analysis ON haraka_encrypted_files_v2(related_analysis_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_access ON haraka_encrypted_files_v2(access_level);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_expires ON haraka_encrypted_files_v2(expires_at) WHERE expires_at IS NOT NULL;

-- جدول سجل الوصول للملفات المشفرة
CREATE TABLE IF NOT EXISTS haraka_file_access_log_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_id UUID REFERENCES haraka_encrypted_files_v2(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    
    -- معلومات الوصول
    access_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'decrypt', 'share'
    access_method VARCHAR(50) NOT NULL, -- 'signed_url', 'direct_access', 'api_call'
    success BOOLEAN NOT NULL DEFAULT true,
    
    -- معلومات تقنية
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- معلومات الأمان
    decryption_time_ms INTEGER, -- وقت فك التشفير بالميللي ثانية
    signed_url_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- معلومات إضافية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    metadata JSONB DEFAULT '{}',
    error_details TEXT -- في حالة فشل الوصول
);

-- فهارس لسجل الوصول
CREATE INDEX IF NOT EXISTS idx_file_access_log_file ON haraka_file_access_log_v2(file_id);
CREATE INDEX IF NOT EXISTS idx_file_access_log_user ON haraka_file_access_log_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_file_access_log_type ON haraka_file_access_log_v2(access_type);
CREATE INDEX IF NOT EXISTS idx_file_access_log_time ON haraka_file_access_log_v2(created_at);
CREATE INDEX IF NOT EXISTS idx_file_access_log_success ON haraka_file_access_log_v2(success);

-- جدول تدوير المفاتيح
CREATE TABLE IF NOT EXISTS haraka_key_rotation_history_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_id UUID REFERENCES haraka_encryption_keys_v2(id) ON DELETE CASCADE,
    
    -- معلومات التدوير
    rotation_type VARCHAR(50) NOT NULL, -- 'scheduled', 'manual', 'emergency'
    old_key_version INTEGER NOT NULL,
    new_key_version INTEGER NOT NULL,
    
    -- حالة التدوير
    rotation_status VARCHAR(20) DEFAULT 'in_progress' CHECK (rotation_status IN ('in_progress', 'completed', 'failed', 'rolled_back')),
    
    -- إحصائيات التدوير
    files_affected_count INTEGER DEFAULT 0,
    files_re_encrypted_count INTEGER DEFAULT 0,
    rotation_duration_seconds INTEGER,
    
    -- معلومات زمنية
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- معلومات إضافية
    initiated_by UUID REFERENCES auth.users(id),
    rotation_reason TEXT,
    error_details TEXT,
    metadata JSONB DEFAULT '{}'
);

-- فهارس لتاريخ تدوير المفاتيح
CREATE INDEX IF NOT EXISTS idx_key_rotation_key ON haraka_key_rotation_history_v2(key_id);
CREATE INDEX IF NOT EXISTS idx_key_rotation_status ON haraka_key_rotation_history_v2(rotation_status);
CREATE INDEX IF NOT EXISTS idx_key_rotation_time ON haraka_key_rotation_history_v2(started_at);

-- وظائف مساعدة لإدارة المفاتيح

-- وظيفة للتحقق من انتهاء صلاحية المفاتيح
CREATE OR REPLACE FUNCTION check_key_expiration_v2()
RETURNS TABLE(
    key_id UUID,
    key_purpose VARCHAR(100),
    days_until_expiry INTEGER,
    needs_rotation BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ek.id,
        ek.key_purpose,
        EXTRACT(DAY FROM (ek.expires_at - NOW()))::INTEGER as days_until_expiry,
        (ek.expires_at <= NOW() + INTERVAL '7 days' OR 
         ek.last_rotated_at <= NOW() - INTERVAL '1 day' * ek.rotation_schedule_days) as needs_rotation
    FROM haraka_encryption_keys_v2 ek
    WHERE ek.key_status = 'active'
    AND (ek.expires_at IS NOT NULL OR ek.last_rotated_at IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- وظيفة لتسجيل الوصول للملفات
CREATE OR REPLACE FUNCTION log_file_access_v2(
    p_file_id UUID,
    p_user_id UUID,
    p_access_type VARCHAR(50),
    p_access_method VARCHAR(50),
    p_success BOOLEAN DEFAULT true,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_decryption_time_ms INTEGER DEFAULT NULL,
    p_error_details TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO haraka_file_access_log_v2 (
        file_id, user_id, access_type, access_method, success,
        ip_address, user_agent, decryption_time_ms, error_details
    ) VALUES (
        p_file_id, p_user_id, p_access_type, p_access_method, p_success,
        p_ip_address, p_user_agent, p_decryption_time_ms, p_error_details
    ) RETURNING id INTO log_id;
    
    -- تحديث آخر وقت وصول للملف
    UPDATE haraka_encrypted_files_v2 
    SET accessed_at = NOW() 
    WHERE id = p_file_id;
    
    -- تحديث عداد الاستخدام للمفتاح
    UPDATE haraka_encryption_keys_v2 
    SET usage_count = usage_count + 1, last_used_at = NOW()
    WHERE id = (SELECT encryption_key_id FROM haraka_encrypted_files_v2 WHERE id = p_file_id);
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- محفز لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column_v2()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_encrypted_files_updated_at_v2
    BEFORE UPDATE ON haraka_encrypted_files_v2
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column_v2();

-- سياسات الأمان (RLS)
ALTER TABLE haraka_encryption_keys_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_encrypted_files_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_file_access_log_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_key_rotation_history_v2 ENABLE ROW LEVEL SECURITY;

-- سياسة للمديرين فقط للوصول لجدول المفاتيح
CREATE POLICY "encryption_keys_admin_only_v2" ON haraka_encryption_keys_v2
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'system')
        )
    );

-- سياسة للوصول للملفات المشفرة حسب الدور والملكية
CREATE POLICY "encrypted_files_access_v2" ON haraka_encrypted_files_v2
    FOR SELECT USING (
        -- المالك يمكنه الوصول
        owner_id = auth.uid()
        OR
        -- المدير يمكنه الوصول لجميع الملفات
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
        OR
        -- المعلم يمكنه الوصول لملفات طلاب صفه
        (
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE id = auth.uid() 
                AND raw_user_meta_data->>'role' = 'teacher'
            )
            AND related_student_id IN (
                SELECT student_id FROM haraka_student_profiles_v2 
                WHERE class_name = (
                    SELECT raw_user_meta_data->>'class_name' 
                    FROM auth.users WHERE id = auth.uid()
                )
            )
        )
        OR
        -- الدور مسموح في قائمة allowed_roles
        (
            SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()
        ) = ANY(SELECT jsonb_array_elements_text(allowed_roles))
    );

-- سياسة لسجل الوصول
CREATE POLICY "file_access_log_view_v2" ON haraka_file_access_log_v2
    FOR SELECT USING (
        -- المستخدم يمكنه رؤية سجل وصوله
        user_id = auth.uid()
        OR
        -- المدير يمكنه رؤية جميع السجلات
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- سياسة لتاريخ تدوير المفاتيح - المديرين فقط
CREATE POLICY "key_rotation_admin_only_v2" ON haraka_key_rotation_history_v2
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'system')
        )
    );

-- إدراج بيانات تجريبية للمفاتيح
INSERT INTO haraka_encryption_keys_v2 (
    key_id, key_type, key_purpose, encryption_algorithm, 
    encrypted_key_data, kms_provider, kms_key_id,
    description, access_policy
) VALUES 
(
    'master-key-2024-001', 'master', 'system_master', 'AES-256-GCM',
    'encrypted_master_key_data_placeholder', 'supabase_vault', 'vault-key-001',
    'مفتاح رئيسي للنظام - تشفير جميع المفاتيح الفرعية',
    '{"allowed_roles": ["admin"], "min_clearance": "top_secret"}'
),
(
    'video-analysis-key-001', 'data', 'video_analysis', 'AES-256-GCM',
    'encrypted_video_key_data_placeholder', 'supabase_vault', 'vault-key-002',
    'مفتاح تشفير فيديوهات التحليل الحركي',
    '{"allowed_roles": ["admin", "teacher"], "file_types": ["mp4", "mov", "avi"]}'
),
(
    'student-reports-key-001', 'data', 'student_reports', 'AES-256-GCM',
    'encrypted_reports_key_data_placeholder', 'supabase_vault', 'vault-key-003',
    'مفتاح تشفير تقارير أداء الطلاب',
    '{"allowed_roles": ["admin", "teacher", "parent"], "data_classification": "confidential"}'
),
(
    'training-materials-key-001', 'data', 'training_files', 'AES-256-GCM',
    'encrypted_training_key_data_placeholder', 'supabase_vault', 'vault-key-004',
    'مفتاح تشفير ملفات التدريب والمواد التعليمية',
    '{"allowed_roles": ["admin", "teacher"], "content_type": "educational"}'
);

-- إدراج ملفات مشفرة تجريبية
INSERT INTO haraka_encrypted_files_v2 (
    file_id, original_filename, file_type, encryption_key_id,
    encrypted_file_path, file_hash, encryption_iv,
    original_size_bytes, encrypted_size_bytes, mime_type,
    owner_id, related_student_id, access_level, allowed_roles,
    description
) VALUES 
(
    'video-001-encrypted', 'student_123_balance_analysis.mp4', 'video_analysis',
    (SELECT id FROM haraka_encryption_keys_v2 WHERE key_id = 'video-analysis-key-001'),
    '/encrypted/videos/enc_student_123_balance_analysis.mp4.enc', 
    'sha256_hash_placeholder_001', 'iv_placeholder_001',
    15728640, 15728704, 'video/mp4',
    (SELECT id FROM auth.users LIMIT 1), 123, 'private', '["admin", "teacher"]',
    'فيديو تحليل التوازن للطالب رقم 123'
),
(
    'report-001-encrypted', 'student_123_performance_report.pdf', 'student_report',
    (SELECT id FROM haraka_encryption_keys_v2 WHERE key_id = 'student-reports-key-001'),
    '/encrypted/reports/enc_student_123_performance_report.pdf.enc',
    'sha256_hash_placeholder_002', 'iv_placeholder_002',
    524288, 524352, 'application/pdf',
    (SELECT id FROM auth.users LIMIT 1), 123, 'private', '["admin", "teacher", "parent"]',
    'تقرير أداء شامل للطالب رقم 123'
);

-- تعليقات للتوثيق
COMMENT ON TABLE haraka_encryption_keys_v2 IS 'جدول إدارة مفاتيح التشفير مع دعم KMS وتدوير المفاتيح';
COMMENT ON TABLE haraka_encrypted_files_v2 IS 'جدول الملفات المشفرة مع معلومات الوصول والصلاحيات';
COMMENT ON TABLE haraka_file_access_log_v2 IS 'سجل الوصول للملفات المشفرة لأغراض المراقبة والأمان';
COMMENT ON TABLE haraka_key_rotation_history_v2 IS 'تاريخ عمليات تدوير المفاتيح والإحصائيات المرتبطة';

COMMENT ON FUNCTION check_key_expiration_v2() IS 'فحص انتهاء صلاحية المفاتيح والحاجة للتدوير';
COMMENT ON FUNCTION log_file_access_v2(UUID, UUID, VARCHAR, VARCHAR, BOOLEAN, INET, TEXT, INTEGER, TEXT) IS 'تسجيل عمليات الوصول للملفات المشفرة';