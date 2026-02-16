-- جدول إدارة المفاتيح المشفرة - منصة حركة
-- Encryption Keys Management Table - Haraka Platform
-- إضافة جديدة بدون تعديل الجداول الموجودة

-- جدول إدارة مفاتيح التشفير
CREATE TABLE IF NOT EXISTS haraka_encryption_keys_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_id VARCHAR(255) UNIQUE NOT NULL, -- معرف المفتاح الفريد
    key_type VARCHAR(50) NOT NULL CHECK (key_type IN ('master', 'data', 'file', 'backup')),
    key_purpose VARCHAR(100) NOT NULL, -- الغرض من المفتاح (videos, reports, profiles, etc.)
    
    -- معلومات التشفير
    algorithm VARCHAR(50) DEFAULT 'AES-256-GCM' NOT NULL,
    key_size INTEGER DEFAULT 256 NOT NULL,
    
    -- حالة المفتاح
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'rotating', 'deprecated', 'revoked')),
    
    -- معلومات KMS
    kms_provider VARCHAR(50) NOT NULL, -- aws-kms, google-kms, supabase-vault, hashicorp-vault
    kms_key_id VARCHAR(500) NOT NULL, -- معرف المفتاح في KMS
    kms_region VARCHAR(100), -- منطقة KMS إذا كان مطلوباً
    
    -- تدوير المفاتيح
    rotation_schedule INTERVAL DEFAULT '90 days', -- جدولة تدوير المفاتيح
    last_rotated_at TIMESTAMP WITH TIME ZONE,
    next_rotation_at TIMESTAMP WITH TIME ZONE,
    rotation_count INTEGER DEFAULT 0,
    
    -- صلاحيات الوصول
    allowed_roles TEXT[] DEFAULT ARRAY['admin'], -- الأدوار المسموح لها بالوصول
    access_policy JSONB, -- سياسات الوصول المفصلة
    
    -- معلومات إضافية
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- تتبع الإنشاء والتحديث
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- فهارس للأداء
    CONSTRAINT valid_rotation_dates CHECK (next_rotation_at > last_rotated_at OR last_rotated_at IS NULL)
);

-- جدول الملفات المشفرة
CREATE TABLE IF NOT EXISTS haraka_encrypted_files_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- معلومات الملف الأصلي
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL, -- video, report, document, image
    file_category VARCHAR(100) NOT NULL, -- analysis_video, student_report, training_material
    mime_type VARCHAR(200),
    original_size BIGINT,
    
    -- معلومات التشفير
    encryption_key_id UUID REFERENCES haraka_encryption_keys_v2(id) NOT NULL,
    encrypted_path VARCHAR(1000) NOT NULL, -- المسار المشفر في التخزين
    encryption_iv VARCHAR(500) NOT NULL, -- Initialization Vector
    encryption_tag VARCHAR(500), -- Authentication tag for AES-GCM
    
    -- معلومات الملف المشفر
    encrypted_size BIGINT,
    checksum_original VARCHAR(128), -- checksum للملف الأصلي
    checksum_encrypted VARCHAR(128), -- checksum للملف المشفر
    
    -- ربط بالكيانات الأخرى
    related_student_id INTEGER, -- ربط بجدول الطلاب
    related_analysis_id INTEGER, -- ربط بجدول التحليلات
    related_user_id UUID REFERENCES auth.users(id),
    
    -- صلاحيات الوصول
    access_level VARCHAR(50) DEFAULT 'restricted' CHECK (access_level IN ('public', 'internal', 'restricted', 'confidential')),
    allowed_roles TEXT[] DEFAULT ARRAY['admin'],
    access_policy JSONB DEFAULT '{}',
    
    -- معلومات إضافية
    description TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    -- تتبع الوصول
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_by UUID REFERENCES auth.users(id),
    
    -- حالة الملف
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'corrupted')),
    
    -- تواريخ مهمة
    expires_at TIMESTAMP WITH TIME ZONE, -- انتهاء صلاحية الملف
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول سجل الوصول للملفات المشفرة
CREATE TABLE IF NOT EXISTS haraka_file_access_log_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- معلومات الملف والمستخدم
    encrypted_file_id UUID REFERENCES haraka_encrypted_files_v2(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    user_role VARCHAR(100),
    
    -- معلومات الوصول
    access_type VARCHAR(50) NOT NULL, -- view, download, decrypt, share
    access_method VARCHAR(50), -- web, api, mobile
    success BOOLEAN DEFAULT true,
    
    -- معلومات تقنية
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(500),
    
    -- معلومات إضافية
    reason TEXT, -- سبب الوصول
    duration_seconds INTEGER, -- مدة الوصول بالثواني
    
    -- معلومات الأمان
    security_context JSONB DEFAULT '{}',
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- تاريخ الوصول
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- جدول Signed URLs المؤقتة
CREATE TABLE IF NOT EXISTS haraka_signed_urls_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- معلومات الملف
    encrypted_file_id UUID REFERENCES haraka_encrypted_files_v2(id) NOT NULL,
    
    -- معلومات URL
    signed_url_token VARCHAR(1000) UNIQUE NOT NULL,
    original_url VARCHAR(2000) NOT NULL,
    
    -- صلاحيات الوصول
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    allowed_operations TEXT[] DEFAULT ARRAY['read'], -- read, download, stream
    
    -- انتهاء الصلاحية
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    max_access_count INTEGER DEFAULT 1,
    current_access_count INTEGER DEFAULT 0,
    
    -- معلومات الأمان
    ip_restrictions INET[],
    user_agent_restrictions TEXT[],
    
    -- حالة الرابط
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked')),
    
    -- تواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- فهرس للتنظيف التلقائي للروابط المنتهية الصلاحية
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_encryption_keys_v2_type_status ON haraka_encryption_keys_v2(key_type, status);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_v2_rotation ON haraka_encryption_keys_v2(next_rotation_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_encryption_keys_v2_kms ON haraka_encryption_keys_v2(kms_provider, kms_key_id);

CREATE INDEX IF NOT EXISTS idx_encrypted_files_v2_category ON haraka_encrypted_files_v2(file_category, status);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_v2_student ON haraka_encrypted_files_v2(related_student_id) WHERE related_student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_encrypted_files_v2_analysis ON haraka_encrypted_files_v2(related_analysis_id) WHERE related_analysis_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_encrypted_files_v2_user ON haraka_encrypted_files_v2(related_user_id);
CREATE INDEX IF NOT EXISTS idx_encrypted_files_v2_access_level ON haraka_encrypted_files_v2(access_level, status);

CREATE INDEX IF NOT EXISTS idx_file_access_log_v2_file_user ON haraka_file_access_log_v2(encrypted_file_id, user_id);
CREATE INDEX IF NOT EXISTS idx_file_access_log_v2_accessed_at ON haraka_file_access_log_v2(accessed_at);
CREATE INDEX IF NOT EXISTS idx_file_access_log_v2_user_type ON haraka_file_access_log_v2(user_id, access_type);

CREATE INDEX IF NOT EXISTS idx_signed_urls_v2_token ON haraka_signed_urls_v2(signed_url_token);
CREATE INDEX IF NOT EXISTS idx_signed_urls_v2_expires ON haraka_signed_urls_v2(expires_at, status);
CREATE INDEX IF NOT EXISTS idx_signed_urls_v2_user ON haraka_signed_urls_v2(user_id, status);

-- إنشاء وظائف تحديث التواريخ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة محفزات تحديث التواريخ
CREATE TRIGGER update_encryption_keys_v2_updated_at 
    BEFORE UPDATE ON haraka_encryption_keys_v2 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_encrypted_files_v2_updated_at 
    BEFORE UPDATE ON haraka_encrypted_files_v2 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- وظيفة تنظيف الروابط المنتهية الصلاحية
CREATE OR REPLACE FUNCTION cleanup_expired_signed_urls_v2()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM haraka_signed_urls_v2 
    WHERE expires_at < NOW() OR status = 'expired';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- تحديث حالة الروابط المستخدمة بالكامل
    UPDATE haraka_signed_urls_v2 
    SET status = 'used' 
    WHERE current_access_count >= max_access_count AND status = 'active';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- وظيفة تحديد المفاتيح التي تحتاج تدوير
CREATE OR REPLACE FUNCTION get_keys_for_rotation_v2()
RETURNS TABLE(
    key_id UUID,
    key_type VARCHAR(50),
    key_purpose VARCHAR(100),
    days_until_rotation INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ek.id,
        ek.key_type,
        ek.key_purpose,
        EXTRACT(DAY FROM (ek.next_rotation_at - NOW()))::INTEGER as days_until_rotation
    FROM haraka_encryption_keys_v2 ek
    WHERE ek.status = 'active' 
    AND ek.next_rotation_at <= NOW() + INTERVAL '7 days'
    ORDER BY ek.next_rotation_at ASC;
END;
$$ LANGUAGE plpgsql;

-- وظيفة تسجيل الوصول للملفات
CREATE OR REPLACE FUNCTION log_file_access_v2(
    p_file_id UUID,
    p_user_id UUID,
    p_access_type VARCHAR(50),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
    user_role_name VARCHAR(100);
BEGIN
    -- الحصول على دور المستخدم
    SELECT role INTO user_role_name 
    FROM auth.users 
    WHERE id = p_user_id;
    
    -- إدراج سجل الوصول
    INSERT INTO haraka_file_access_log_v2 (
        encrypted_file_id,
        user_id,
        user_role,
        access_type,
        ip_address,
        user_agent,
        success
    ) VALUES (
        p_file_id,
        p_user_id,
        user_role_name,
        p_access_type,
        p_ip_address,
        p_user_agent,
        p_success
    ) RETURNING id INTO log_id;
    
    -- تحديث إحصائيات الوصول للملف
    IF p_success THEN
        UPDATE haraka_encrypted_files_v2 
        SET 
            access_count = access_count + 1,
            last_accessed_at = NOW(),
            last_accessed_by = p_user_id
        WHERE id = p_file_id;
    END IF;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- إعداد سياسات Row Level Security (RLS)
ALTER TABLE haraka_encryption_keys_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_encrypted_files_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_file_access_log_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE haraka_signed_urls_v2 ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمفاتيح (المديرون فقط)
CREATE POLICY "encryption_keys_admin_only_v2" ON haraka_encryption_keys_v2
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

-- سياسات الأمان للملفات المشفرة
CREATE POLICY "encrypted_files_access_v2" ON haraka_encrypted_files_v2
    FOR SELECT USING (
        -- المديرون يرون كل شيء
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
        OR
        -- المعلمون يرون ملفات طلابهم
        (
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid() 
                AND auth.users.role = 'teacher'
            )
            AND related_student_id IN (
                SELECT student_id FROM haraka_student_profiles 
                WHERE class_name IN (
                    SELECT class_name FROM teacher_classes 
                    WHERE teacher_id = auth.uid()
                )
            )
        )
        OR
        -- أولياء الأمور يرون ملفات أطفالهم فقط
        (
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid() 
                AND auth.users.role = 'parent'
            )
            AND related_student_id IN (
                SELECT student_id FROM parent_children 
                WHERE parent_id = auth.uid()
            )
        )
        OR
        -- الطلاب يرون ملفاتهم فقط
        (
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid() 
                AND auth.users.role = 'student'
            )
            AND related_student_id = (
                SELECT student_id FROM haraka_student_profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- سياسة إدراج الملفات المشفرة
CREATE POLICY "encrypted_files_insert_v2" ON haraka_encrypted_files_v2
    FOR INSERT WITH CHECK (
        -- المديرون والمعلمون يمكنهم إدراج ملفات
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role IN ('admin', 'teacher')
        )
    );

-- سياسات سجل الوصول (قراءة فقط للمديرين)
CREATE POLICY "file_access_log_admin_read_v2" ON haraka_file_access_log_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

-- سياسات الروابط المؤقتة
CREATE POLICY "signed_urls_owner_v2" ON haraka_signed_urls_v2
    FOR ALL USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

-- إدراج مفاتيح تشفير افتراضية للنظام
INSERT INTO haraka_encryption_keys_v2 (
    key_id,
    key_type,
    key_purpose,
    algorithm,
    kms_provider,
    kms_key_id,
    allowed_roles,
    description,
    created_by,
    next_rotation_at
) VALUES 
(
    'haraka-master-key-v2',
    'master',
    'system_master_encryption',
    'AES-256-GCM',
    'supabase-vault',
    'vault://haraka/master-key-v2',
    ARRAY['admin'],
    'مفتاح التشفير الرئيسي لمنصة حركة - الإصدار الآمن',
    (SELECT id FROM auth.users WHERE role = 'admin' LIMIT 1),
    NOW() + INTERVAL '90 days'
),
(
    'haraka-video-encryption-v2',
    'data',
    'analysis_videos',
    'AES-256-GCM',
    'supabase-vault',
    'vault://haraka/video-key-v2',
    ARRAY['admin', 'teacher'],
    'مفتاح تشفير فيديوهات التحليل',
    (SELECT id FROM auth.users WHERE role = 'admin' LIMIT 1),
    NOW() + INTERVAL '90 days'
),
(
    'haraka-reports-encryption-v2',
    'data',
    'student_reports',
    'AES-256-GCM',
    'supabase-vault',
    'vault://haraka/reports-key-v2',
    ARRAY['admin', 'teacher', 'parent'],
    'مفتاح تشفير تقارير الطلاب',
    (SELECT id FROM auth.users WHERE role = 'admin' LIMIT 1),
    NOW() + INTERVAL '90 days'
);

-- إنشاء جدولة تلقائية لتنظيف الروابط المنتهية الصلاحية
-- (يتطلب تفعيل pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-urls-v2', '0 */6 * * *', 'SELECT cleanup_expired_signed_urls_v2();');

COMMENT ON TABLE haraka_encryption_keys_v2 IS 'جدول إدارة مفاتيح التشفير للملفات الحساسة في منصة حركة';
COMMENT ON TABLE haraka_encrypted_files_v2 IS 'جدول الملفات المشفرة مع معلومات التشفير والوصول';
COMMENT ON TABLE haraka_file_access_log_v2 IS 'سجل الوصول للملفات المشفرة لأغراض الأمان والمراجعة';
COMMENT ON TABLE haraka_signed_urls_v2 IS 'جدول الروابط المؤقتة المُوقعة للوصول الآمن للملفات';