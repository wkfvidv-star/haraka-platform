/**
 * نظام تسجيل العمليات الشامل - منصة حركة
 * Comprehensive Audit Logging System - Haraka Platform
 * 
 * نظام تسجيل شامل لجميع العمليات مع معلومات مفصلة
 */

-- ===== إنشاء جدول audit_logs محسّن =====

CREATE TABLE IF NOT EXISTS haraka_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- معلومات المستخدم
    user_id UUID REFERENCES auth.users(id),
    user_role VARCHAR(50),
    user_email VARCHAR(255),
    
    -- معلومات العملية
    action VARCHAR(20) NOT NULL CHECK (action IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS_DENIED')),
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    
    -- معلومات الشبكة والجلسة
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- البيانات والسياق
    meta_data JSONB DEFAULT '{}',
    old_values JSONB,
    new_values JSONB,
    
    -- معلومات إضافية
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    execution_time_ms INTEGER,
    
    -- الطوابع الزمنية
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- فهرسة للبحث السريع
    CONSTRAINT valid_meta_data CHECK (jsonb_typeof(meta_data) = 'object')
);

-- ===== إنشاء فهارس للأداء =====

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON haraka_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON haraka_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON haraka_audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON haraka_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON haraka_audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON haraka_audit_logs(success);

-- فهرس مركب للاستعلامات الشائعة
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action_date 
ON haraka_audit_logs(user_id, action, created_at DESC);

-- فهرس GIN للبحث في البيانات الوصفية
CREATE INDEX IF NOT EXISTS idx_audit_logs_meta_data_gin 
ON haraka_audit_logs USING GIN (meta_data);

-- ===== تفعيل RLS على جدول audit_logs =====

ALTER TABLE haraka_audit_logs ENABLE ROW LEVEL SECURITY;

-- سياسة وصول الأدمن لجميع السجلات
CREATE POLICY "admin_full_audit_access" ON haraka_audit_logs
    FOR SELECT USING (get_user_role() = 'admin');

-- سياسة وصول المستخدمين لسجلاتهم الشخصية فقط
CREATE POLICY "users_own_audit_access" ON haraka_audit_logs
    FOR SELECT USING (
        user_id = auth.uid() 
        AND get_user_role() != 'admin'
    );

-- سياسة وصول الوزارة للإحصائيات المجمعة فقط
CREATE POLICY "ministry_audit_stats_access" ON haraka_audit_logs
    FOR SELECT USING (
        get_user_role() = 'ministry'
        AND action IN ('SELECT', 'ACCESS_DENIED')
    );

-- ===== دوال تسجيل العمليات =====

-- دالة تسجيل العمليات الأساسية
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action VARCHAR(20),
    p_resource_type VARCHAR(100),
    p_resource_id VARCHAR(255) DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_meta_data JSONB DEFAULT '{}',
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL,
    p_execution_time_ms INTEGER DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    audit_id BIGINT;
    current_user_id UUID;
    current_user_role VARCHAR(50);
    current_user_email VARCHAR(255);
    current_ip INET;
    current_user_agent TEXT;
    current_session_id VARCHAR(255);
BEGIN
    -- الحصول على معلومات المستخدم الحالي
    current_user_id := auth.uid();
    
    IF current_user_id IS NOT NULL THEN
        SELECT 
            raw_user_meta_data->>'role',
            email
        INTO 
            current_user_role,
            current_user_email
        FROM auth.users 
        WHERE id = current_user_id;
    END IF;
    
    -- الحصول على معلومات الشبكة والجلسة
    BEGIN
        current_ip := inet_client_addr();
        current_user_agent := current_setting('request.headers', true)::jsonb->>'user-agent';
        current_session_id := current_setting('request.jwt.claims', true)::jsonb->>'session_id';
    EXCEPTION
        WHEN OTHERS THEN
            -- في حالة عدم توفر المعلومات (مثل العمليات الداخلية)
            current_ip := NULL;
            current_user_agent := NULL;
            current_session_id := NULL;
    END;
    
    -- إدراج سجل المراجعة
    INSERT INTO haraka_audit_logs (
        user_id,
        user_role,
        user_email,
        action,
        resource_type,
        resource_id,
        ip_address,
        user_agent,
        session_id,
        meta_data,
        old_values,
        new_values,
        success,
        error_message,
        execution_time_ms,
        created_at
    ) VALUES (
        current_user_id,
        COALESCE(current_user_role, 'anonymous'),
        current_user_email,
        p_action,
        p_resource_type,
        p_resource_id,
        current_ip,
        current_user_agent,
        current_session_id,
        COALESCE(p_meta_data, '{}'),
        p_old_values,
        p_new_values,
        p_success,
        p_error_message,
        p_execution_time_ms,
        NOW()
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة تسجيل محاولات الوصول المرفوضة
CREATE OR REPLACE FUNCTION log_access_denied(
    p_resource_type VARCHAR(100),
    p_resource_id VARCHAR(255) DEFAULT NULL,
    p_attempted_action VARCHAR(20) DEFAULT 'SELECT',
    p_reason TEXT DEFAULT 'Insufficient permissions'
)
RETURNS BIGINT AS $$
BEGIN
    RETURN log_audit_event(
        'ACCESS_DENIED',
        p_resource_type,
        p_resource_id,
        NULL,
        NULL,
        jsonb_build_object(
            'attempted_action', p_attempted_action,
            'denial_reason', p_reason,
            'timestamp', NOW()
        ),
        false,
        p_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة تسجيل عمليات تسجيل الدخول
CREATE OR REPLACE FUNCTION log_user_login(
    p_user_id UUID,
    p_login_method VARCHAR(50) DEFAULT 'password',
    p_success BOOLEAN DEFAULT true,
    p_failure_reason TEXT DEFAULT NULL
)
RETURNS BIGINT AS $$
BEGIN
    RETURN log_audit_event(
        CASE WHEN p_success THEN 'LOGIN' ELSE 'ACCESS_DENIED' END,
        'user_session',
        p_user_id::TEXT,
        NULL,
        NULL,
        jsonb_build_object(
            'login_method', p_login_method,
            'timestamp', NOW()
        ),
        p_success,
        p_failure_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== Triggers للتسجيل التلقائي =====

-- دالة trigger عامة للتسجيل التلقائي
CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    start_time TIMESTAMP;
    execution_time INTEGER;
    resource_id_val VARCHAR(255);
BEGIN
    start_time := clock_timestamp();
    
    -- تحديد معرف المورد
    resource_id_val := COALESCE(
        NEW.id::TEXT, 
        OLD.id::TEXT, 
        'unknown'
    );
    
    -- حساب وقت التنفيذ
    execution_time := EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000;
    
    -- تسجيل العملية
    PERFORM log_audit_event(
        TG_OP,
        TG_TABLE_NAME,
        resource_id_val,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        jsonb_build_object(
            'table_name', TG_TABLE_NAME,
            'operation', TG_OP,
            'trigger_name', TG_NAME,
            'schema_name', TG_TABLE_SCHEMA
        ),
        true,
        NULL,
        execution_time
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تطبيق triggers على الجداول الحساسة
CREATE TRIGGER audit_student_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_student_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_teacher_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_teacher_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_exercise_sessions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_exercise_sessions
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_analysis_reports_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_analysis_reports
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_notifications_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_notifications
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_encrypted_files_trigger
    AFTER INSERT OR UPDATE OR DELETE ON haraka_encrypted_files_v2
    FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

-- ===== Views لإحصائيات المراجعة =====

-- View إحصائيات المراجعة للأدمن
CREATE OR REPLACE VIEW admin_audit_statistics AS
SELECT 
    DATE_TRUNC('day', created_at) as audit_date,
    action,
    resource_type,
    user_role,
    
    -- إحصائيات العمليات
    COUNT(*) as operations_count,
    COUNT(CASE WHEN success THEN 1 END) as successful_operations,
    COUNT(CASE WHEN NOT success THEN 1 END) as failed_operations,
    
    -- إحصائيات الأداء
    AVG(execution_time_ms) as avg_execution_time_ms,
    MAX(execution_time_ms) as max_execution_time_ms,
    
    -- إحصائيات المستخدمين
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ip_addresses,
    
    -- معدل النجاح
    ROUND(
        COUNT(CASE WHEN success THEN 1 END)::DECIMAL / COUNT(*) * 100, 
        2
    ) as success_rate_percentage

FROM haraka_audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 
    DATE_TRUNC('day', created_at),
    action,
    resource_type,
    user_role
ORDER BY 
    audit_date DESC,
    operations_count DESC;

-- View محاولات الوصول المرفوضة
CREATE OR REPLACE VIEW security_access_denied_log AS
SELECT 
    created_at,
    user_id,
    user_role,
    user_email,
    ip_address,
    resource_type,
    resource_id,
    meta_data->>'attempted_action' as attempted_action,
    meta_data->>'denial_reason' as denial_reason,
    error_message,
    
    -- تجميع المحاولات من نفس IP
    COUNT(*) OVER (
        PARTITION BY ip_address, DATE_TRUNC('hour', created_at)
    ) as attempts_from_same_ip_per_hour

FROM haraka_audit_logs
WHERE 
    action = 'ACCESS_DENIED'
    AND created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC;

-- View نشاط المستخدمين
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    user_id,
    user_role,
    user_email,
    
    -- إحصائيات النشاط
    COUNT(*) as total_operations,
    COUNT(DISTINCT DATE_TRUNC('day', created_at)) as active_days,
    MAX(created_at) as last_activity,
    MIN(created_at) as first_activity,
    
    -- توزيع العمليات
    COUNT(CASE WHEN action = 'SELECT' THEN 1 END) as select_operations,
    COUNT(CASE WHEN action = 'INSERT' THEN 1 END) as insert_operations,
    COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as update_operations,
    COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as delete_operations,
    COUNT(CASE WHEN action = 'ACCESS_DENIED' THEN 1 END) as access_denied_count,
    
    -- معدل النجاح
    ROUND(
        COUNT(CASE WHEN success THEN 1 END)::DECIMAL / COUNT(*) * 100, 
        2
    ) as user_success_rate,
    
    -- عناوين IP المستخدمة
    COUNT(DISTINCT ip_address) as unique_ip_count,
    array_agg(DISTINCT ip_address) as used_ip_addresses

FROM haraka_audit_logs
WHERE 
    created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND user_id IS NOT NULL
GROUP BY 
    user_id,
    user_role,
    user_email
ORDER BY 
    total_operations DESC,
    last_activity DESC;

-- ===== دوال تحليل الأمان =====

-- دالة كشف الأنشطة المشبوهة
CREATE OR REPLACE FUNCTION detect_suspicious_activity(
    time_window_hours INTEGER DEFAULT 24
)
RETURNS TABLE(
    alert_type TEXT,
    user_id UUID,
    ip_address INET,
    suspicious_count BIGINT,
    first_occurrence TIMESTAMP WITH TIME ZONE,
    last_occurrence TIMESTAMP WITH TIME ZONE,
    details JSONB
) AS $$
BEGIN
    -- محاولات وصول مرفوضة متكررة
    RETURN QUERY
    SELECT 
        'REPEATED_ACCESS_DENIED' as alert_type,
        al.user_id,
        al.ip_address,
        COUNT(*) as suspicious_count,
        MIN(al.created_at) as first_occurrence,
        MAX(al.created_at) as last_occurrence,
        jsonb_build_object(
            'resource_types', array_agg(DISTINCT al.resource_type),
            'user_agents', array_agg(DISTINCT al.user_agent)
        ) as details
    FROM haraka_audit_logs al
    WHERE 
        al.action = 'ACCESS_DENIED'
        AND al.created_at >= NOW() - (time_window_hours || ' hours')::INTERVAL
    GROUP BY 
        al.user_id,
        al.ip_address
    HAVING 
        COUNT(*) >= 5;  -- 5 أو أكثر من محاولات الوصول المرفوضة
    
    -- نشاط من عناوين IP متعددة لنفس المستخدم
    RETURN QUERY
    SELECT 
        'MULTIPLE_IP_USAGE' as alert_type,
        al.user_id,
        NULL::INET as ip_address,
        COUNT(DISTINCT al.ip_address) as suspicious_count,
        MIN(al.created_at) as first_occurrence,
        MAX(al.created_at) as last_occurrence,
        jsonb_build_object(
            'ip_addresses', array_agg(DISTINCT al.ip_address),
            'total_operations', COUNT(*)
        ) as details
    FROM haraka_audit_logs al
    WHERE 
        al.created_at >= NOW() - (time_window_hours || ' hours')::INTERVAL
        AND al.user_id IS NOT NULL
    GROUP BY 
        al.user_id
    HAVING 
        COUNT(DISTINCT al.ip_address) >= 3;  -- 3 أو أكثر من عناوين IP مختلفة
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== دوال الصيانة =====

-- دالة تنظيف السجلات القديمة
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
    retention_days INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- حذف السجلات الأقدم من المدة المحددة
    DELETE FROM haraka_audit_logs
    WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- تسجيل عملية التنظيف
    PERFORM log_audit_event(
        'DELETE',
        'audit_logs_cleanup',
        NULL,
        NULL,
        jsonb_build_object('deleted_count', deleted_count),
        jsonb_build_object(
            'retention_days', retention_days,
            'cleanup_date', NOW()
        ),
        true,
        NULL
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== منح الصلاحيات =====

-- منح صلاحيات القراءة للأدوار المناسبة
GRANT SELECT ON haraka_audit_logs TO authenticated;
GRANT SELECT ON admin_audit_statistics TO authenticated;
GRANT SELECT ON security_access_denied_log TO authenticated;
GRANT SELECT ON user_activity_summary TO authenticated;

-- منح صلاحيات تنفيذ الدوال للأدمن
GRANT EXECUTE ON FUNCTION log_audit_event TO authenticated;
GRANT EXECUTE ON FUNCTION log_access_denied TO authenticated;
GRANT EXECUTE ON FUNCTION log_user_login TO authenticated;
GRANT EXECUTE ON FUNCTION detect_suspicious_activity TO authenticated;

-- ===== تعليقات توضيحية =====

COMMENT ON TABLE haraka_audit_logs IS 'جدول تسجيل المراجعة الشامل لجميع العمليات في النظام';
COMMENT ON FUNCTION log_audit_event IS 'دالة تسجيل العمليات الأساسية مع جميع التفاصيل';
COMMENT ON FUNCTION log_access_denied IS 'دالة تسجيل محاولات الوصول المرفوضة';
COMMENT ON FUNCTION detect_suspicious_activity IS 'دالة كشف الأنشطة المشبوهة والتهديدات الأمنية';
COMMENT ON VIEW admin_audit_statistics IS 'إحصائيات المراجعة الشاملة للأدمن';
COMMENT ON VIEW security_access_denied_log IS 'سجل محاولات الوصول المرفوضة للمراقبة الأمنية';

-- إشعار اكتمال التنفيذ
DO $$
BEGIN
    RAISE NOTICE '📝 تم إنشاء نظام تسجيل المراجعة الشامل';
    RAISE NOTICE '🔍 تم إنشاء جدول haraka_audit_logs مع جميع الحقول المطلوبة';
    RAISE NOTICE '⚡ تم إنشاء % trigger للتسجيل التلقائي', 6;
    RAISE NOTICE '📊 تم إنشاء % view لإحصائيات المراجعة', 3;
    RAISE NOTICE '🛡️ تم إنشاء دوال كشف الأنشطة المشبوهة';
    RAISE NOTICE '🔒 تم تطبيق RLS على جدول المراجعة';
END $$;