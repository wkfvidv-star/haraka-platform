-- Consent Management System for Haraka Platform
-- نظام إدارة موافقات أولياء الأمور - منصة حركة

-- إنشاء جدول الموافقات
CREATE TABLE IF NOT EXISTS consents (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL,
    guardian_id UUID NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    scope TEXT NOT NULL DEFAULT 'video_upload_analysis',
    version TEXT DEFAULT 'v1.0',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول سجل الموافقات (للتدقيق)
CREATE TABLE IF NOT EXISTS consent_audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent_id UUID REFERENCES consents(consent_id),
    action TEXT NOT NULL, -- 'granted', 'revoked', 'viewed', 'modified'
    performed_by UUID NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    risk_score INTEGER DEFAULT 1
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_consents_child_id ON consents(child_id);
CREATE INDEX IF NOT EXISTS idx_consents_guardian_id ON consents(guardian_id);
CREATE INDEX IF NOT EXISTS idx_consents_scope ON consents(scope);
CREATE INDEX IF NOT EXISTS idx_consents_active ON consents(child_id, guardian_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_consent_audit_consent_id ON consent_audit_log(consent_id);
CREATE INDEX IF NOT EXISTS idx_consent_audit_performed_at ON consent_audit_log(performed_at);

-- دالة للتحقق من وجود موافقة نشطة
CREATE OR REPLACE FUNCTION has_active_consent(
    p_child_id UUID,
    p_guardian_id UUID,
    p_scope TEXT DEFAULT 'video_upload_analysis'
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM consents 
        WHERE child_id = p_child_id 
        AND guardian_id = p_guardian_id 
        AND scope = p_scope
        AND revoked_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لتسجيل عمليات الموافقة في سجل التدقيق
CREATE OR REPLACE FUNCTION log_consent_action(
    p_consent_id UUID,
    p_action TEXT,
    p_performed_by UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_risk_score INTEGER := 1;
BEGIN
    -- تحديد مستوى المخاطر بناءً على نوع العملية
    CASE p_action
        WHEN 'revoked' THEN v_risk_score := 5;
        WHEN 'modified' THEN v_risk_score := 3;
        WHEN 'granted' THEN v_risk_score := 2;
        ELSE v_risk_score := 1;
    END CASE;

    INSERT INTO consent_audit_log (
        consent_id, action, performed_by, ip_address, 
        user_agent, details, risk_score
    ) VALUES (
        p_consent_id, p_action, p_performed_by, p_ip_address,
        p_user_agent, p_details, v_risk_score
    ) RETURNING log_id INTO v_log_id;

    -- تسجيل في نظام المراجعة الرئيسي إذا كان موجوداً
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'haraka_audit_logs') THEN
        INSERT INTO haraka_audit_logs (
            user_id, user_role, action, table_name, record_id,
            ip_address, user_agent, success, risk_score, additional_data
        ) VALUES (
            p_performed_by, 'guardian', 'CONSENT_' || UPPER(p_action), 
            'consents', p_consent_id::TEXT,
            p_ip_address, p_user_agent, true, v_risk_score,
            jsonb_build_object('consent_action', p_action, 'details', p_details)
        );
    END IF;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لمنح الموافقة
CREATE OR REPLACE FUNCTION grant_consent(
    p_child_id UUID,
    p_guardian_id UUID,
    p_scope TEXT DEFAULT 'video_upload_analysis',
    p_version TEXT DEFAULT 'v1.0',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_consent_id UUID;
BEGIN
    -- التحقق من عدم وجود موافقة نشطة مسبقاً
    IF has_active_consent(p_child_id, p_guardian_id, p_scope) THEN
        RAISE EXCEPTION 'موافقة نشطة موجودة مسبقاً لهذا النطاق';
    END IF;

    -- إنشاء موافقة جديدة
    INSERT INTO consents (
        child_id, guardian_id, scope, version, ip_address, user_agent
    ) VALUES (
        p_child_id, p_guardian_id, p_scope, p_version, p_ip_address, p_user_agent
    ) RETURNING consent_id INTO v_consent_id;

    -- تسجيل العملية في سجل التدقيق
    PERFORM log_consent_action(
        v_consent_id, 'granted', p_guardian_id, p_ip_address, p_user_agent,
        jsonb_build_object('scope', p_scope, 'version', p_version)
    );

    RETURN v_consent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لسحب الموافقة
CREATE OR REPLACE FUNCTION revoke_consent(
    p_consent_id UUID,
    p_guardian_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_consent_exists BOOLEAN;
BEGIN
    -- التحقق من وجود الموافقة وأنها نشطة
    SELECT EXISTS (
        SELECT 1 FROM consents 
        WHERE consent_id = p_consent_id 
        AND guardian_id = p_guardian_id 
        AND revoked_at IS NULL
    ) INTO v_consent_exists;

    IF NOT v_consent_exists THEN
        RAISE EXCEPTION 'الموافقة غير موجودة أو مسحوبة مسبقاً';
    END IF;

    -- سحب الموافقة
    UPDATE consents 
    SET revoked_at = now(), updated_at = now()
    WHERE consent_id = p_consent_id;

    -- تسجيل العملية في سجل التدقيق
    PERFORM log_consent_action(
        p_consent_id, 'revoked', p_guardian_id, p_ip_address, p_user_agent,
        jsonb_build_object('reason', p_reason)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة للحصول على حالة الموافقة
CREATE OR REPLACE FUNCTION get_consent_status(
    p_child_id UUID,
    p_guardian_id UUID,
    p_scope TEXT DEFAULT 'video_upload_analysis'
) RETURNS TABLE (
    consent_id UUID,
    status TEXT,
    granted_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    version TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.consent_id,
        CASE 
            WHEN c.revoked_at IS NULL THEN 'active'
            ELSE 'revoked'
        END as status,
        c.accepted_at as granted_at,
        c.revoked_at,
        c.version
    FROM consents c
    WHERE c.child_id = p_child_id 
    AND c.guardian_id = p_guardian_id 
    AND c.scope = p_scope
    ORDER BY c.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء سياسات Row Level Security للموافقات
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;

-- سياسة للأولياء: يمكنهم رؤية وإدارة موافقات أطفالهم فقط
CREATE POLICY guardian_consent_policy ON consents
    FOR ALL TO authenticated
    USING (guardian_id = auth.uid());

-- سياسة للطلاب: يمكنهم رؤية موافقاتهم فقط (للقراءة)
CREATE POLICY student_consent_view_policy ON consents
    FOR SELECT TO authenticated
    USING (child_id = auth.uid());

-- سياسة للمعلمين: يمكنهم التحقق من الموافقات للطلاب في صفوفهم
CREATE POLICY teacher_consent_check_policy ON consents
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'teacher'
            AND up.school_id = (
                SELECT school_id FROM user_profiles 
                WHERE user_id = child_id
            )
        )
    );

-- سياسة للإداريين: وصول كامل مع تسجيل
CREATE POLICY admin_consent_policy ON consents
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- سياسات سجل التدقيق
CREATE POLICY guardian_audit_view_policy ON consent_audit_log
    FOR SELECT TO authenticated
    USING (
        consent_id IN (
            SELECT consent_id FROM consents 
            WHERE guardian_id = auth.uid()
        )
    );

CREATE POLICY admin_audit_policy ON consent_audit_log
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- إنشاء view مجهولة للإحصائيات
CREATE OR REPLACE VIEW consent_statistics AS
SELECT 
    scope,
    COUNT(*) as total_consents,
    COUNT(*) FILTER (WHERE revoked_at IS NULL) as active_consents,
    COUNT(*) FILTER (WHERE revoked_at IS NOT NULL) as revoked_consents,
    ROUND(
        COUNT(*) FILTER (WHERE revoked_at IS NULL) * 100.0 / COUNT(*), 2
    ) as consent_rate_percentage,
    DATE_TRUNC('day', accepted_at) as consent_date
FROM consents 
GROUP BY scope, DATE_TRUNC('day', accepted_at)
ORDER BY consent_date DESC;

-- منح الصلاحيات
GRANT SELECT ON consent_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_consent(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_consent_status(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION grant_consent(UUID, UUID, TEXT, TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_consent(UUID, UUID, INET, TEXT, TEXT) TO authenticated;

-- تعليقات للتوثيق
COMMENT ON TABLE consents IS 'جدول موافقات أولياء الأمور لرفع وتحليل الفيديوهات';
COMMENT ON TABLE consent_audit_log IS 'سجل تدقيق عمليات الموافقات لأغراض الأمان';
COMMENT ON FUNCTION has_active_consent IS 'التحقق من وجود موافقة نشطة';
COMMENT ON FUNCTION grant_consent IS 'منح موافقة جديدة مع التسجيل الأمني';
COMMENT ON FUNCTION revoke_consent IS 'سحب موافقة موجودة مع التسجيل الأمني';