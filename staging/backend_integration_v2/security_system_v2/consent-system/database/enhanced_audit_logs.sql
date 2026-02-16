-- Enhanced Audit Log System for Haraka Platform
-- نظام سجل التدقيق المحسن - منصة حركة
-- Created: 2024-01-20
-- Purpose: Comprehensive audit logging for all important events

-- =====================================================
-- 1. ENHANCED AUDIT LOGS TABLE
-- =====================================================

-- Drop existing audit logs table if it exists and recreate with enhanced structure
DROP TABLE IF EXISTS haraka_audit_logs CASCADE;

CREATE TABLE haraka_audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and Session Information
    user_id UUID NOT NULL,
    user_role TEXT NOT NULL,
    session_id TEXT,
    
    -- Action Details
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'exercise_session', 'video_upload', 'consent', 'user_profile', etc.
    resource_id TEXT,
    table_name TEXT,
    
    -- Data Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Request Information
    ip_address INET,
    user_agent TEXT,
    request_method TEXT,
    request_path TEXT,
    
    -- Result and Context
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    response_time_ms INTEGER,
    
    -- Security and Risk Assessment
    risk_score INTEGER DEFAULT 1 CHECK (risk_score >= 1 AND risk_score <= 10),
    security_flags TEXT[], -- ['suspicious_ip', 'multiple_attempts', 'unusual_time', etc.]
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user_id ON haraka_audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON haraka_audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON haraka_audit_logs(resource_type);
CREATE INDEX idx_audit_logs_timestamp ON haraka_audit_logs(timestamp);
CREATE INDEX idx_audit_logs_risk_score ON haraka_audit_logs(risk_score);
CREATE INDEX idx_audit_logs_success ON haraka_audit_logs(success);
CREATE INDEX idx_audit_logs_ip_address ON haraka_audit_logs(ip_address);
CREATE INDEX idx_audit_logs_session_id ON haraka_audit_logs(session_id);

-- Composite indexes for common queries
CREATE INDEX idx_audit_logs_user_action_time ON haraka_audit_logs(user_id, action, timestamp);
CREATE INDEX idx_audit_logs_resource_time ON haraka_audit_logs(resource_type, resource_id, timestamp);

-- =====================================================
-- 2. AUDIT LOG FUNCTIONS
-- =====================================================

-- Enhanced function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_user_role TEXT,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL,
    p_risk_score INTEGER DEFAULT 1,
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
    calculated_risk_score INTEGER;
    security_flags TEXT[] := '{}';
BEGIN
    -- Calculate risk score based on action and context
    calculated_risk_score := p_risk_score;
    
    -- Adjust risk score based on action type
    CASE p_action
        WHEN 'LOGIN_FAILED' THEN calculated_risk_score := GREATEST(calculated_risk_score, 6);
        WHEN 'CONSENT_REVOKED' THEN calculated_risk_score := GREATEST(calculated_risk_score, 4);
        WHEN 'VIDEO_UPLOAD_BLOCKED' THEN calculated_risk_score := GREATEST(calculated_risk_score, 7);
        WHEN 'UNAUTHORIZED_ACCESS' THEN calculated_risk_score := GREATEST(calculated_risk_score, 9);
        WHEN 'DATA_EXPORT' THEN calculated_risk_score := GREATEST(calculated_risk_score, 5);
        WHEN 'ADMIN_ACTION' THEN calculated_risk_score := GREATEST(calculated_risk_score, 3);
        ELSE calculated_risk_score := p_risk_score;
    END CASE;
    
    -- Add security flags based on patterns
    IF p_ip_address IS NOT NULL THEN
        -- Check for suspicious IP patterns (this is a simplified example)
        IF p_ip_address::text LIKE '10.%' OR p_ip_address::text LIKE '192.168.%' THEN
            -- Internal IP, lower risk
            NULL;
        ELSE
            -- External IP, check for known patterns
            IF EXISTS (
                SELECT 1 FROM haraka_audit_logs 
                WHERE ip_address = p_ip_address 
                AND success = false 
                AND timestamp > now() - INTERVAL '1 hour'
                LIMIT 5
            ) THEN
                security_flags := security_flags || 'multiple_failed_attempts';
                calculated_risk_score := GREATEST(calculated_risk_score, 8);
            END IF;
        END IF;
    END IF;
    
    -- Check for unusual time patterns
    IF EXTRACT(HOUR FROM now()) BETWEEN 0 AND 5 THEN
        security_flags := security_flags || 'unusual_time';
        calculated_risk_score := calculated_risk_score + 1;
    END IF;
    
    -- Insert audit log
    INSERT INTO haraka_audit_logs (
        user_id, user_role, action, resource_type, resource_id,
        old_values, new_values, ip_address, user_agent, session_id,
        success, error_message, risk_score, security_flags, metadata
    ) VALUES (
        p_user_id, p_user_role, p_action, p_resource_type, p_resource_id,
        p_old_values, p_new_values, p_ip_address, p_user_agent, p_session_id,
        p_success, p_error_message, calculated_risk_score, security_flags, p_metadata
    ) RETURNING haraka_audit_logs.log_id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log video upload events
CREATE OR REPLACE FUNCTION log_video_upload_event(
    p_user_id UUID,
    p_session_id TEXT,
    p_video_id UUID DEFAULT NULL,
    p_file_size BIGINT DEFAULT NULL,
    p_duration_seconds INTEGER DEFAULT NULL,
    p_device_type TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    user_role TEXT;
    metadata JSONB;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM users WHERE id = p_user_id;
    
    -- Build metadata
    metadata := jsonb_build_object(
        'file_size_bytes', p_file_size,
        'duration_seconds', p_duration_seconds,
        'device_type', p_device_type,
        'upload_timestamp', now()
    );
    
    -- Log the event
    RETURN log_audit_event(
        p_user_id,
        user_role,
        CASE WHEN p_success THEN 'VIDEO_UPLOADED' ELSE 'VIDEO_UPLOAD_FAILED' END,
        'exercise_session',
        COALESCE(p_video_id::text, p_session_id),
        NULL,
        metadata,
        p_ip_address,
        p_user_agent,
        p_session_id,
        p_success,
        p_error_message,
        CASE WHEN p_success THEN 2 ELSE 4 END,
        metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log report viewing events
CREATE OR REPLACE FUNCTION log_report_view_event(
    p_user_id UUID,
    p_report_type TEXT,
    p_student_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    user_role TEXT;
    metadata JSONB;
    risk_score INTEGER := 1;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM users WHERE id = p_user_id;
    
    -- Calculate risk score based on access pattern
    IF user_role = 'guardian' AND p_student_id IS NOT NULL THEN
        -- Check if guardian is accessing their own child's report
        IF NOT EXISTS (
            SELECT 1 FROM user_relationships 
            WHERE parent_id = p_user_id 
            AND child_id = p_student_id 
            AND relationship_type = 'guardian'
            AND is_active = true
        ) THEN
            risk_score := 8; -- High risk for unauthorized access
        END IF;
    END IF;
    
    -- Build metadata
    metadata := jsonb_build_object(
        'report_type', p_report_type,
        'student_id', p_student_id,
        'access_timestamp', now()
    );
    
    -- Log the event
    RETURN log_audit_event(
        p_user_id,
        user_role,
        'REPORT_VIEWED',
        'fitness_report',
        COALESCE(p_student_id::text, p_session_id),
        NULL,
        metadata,
        p_ip_address,
        p_user_agent,
        p_session_id,
        true,
        NULL,
        risk_score,
        metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log data decryption events
CREATE OR REPLACE FUNCTION log_decryption_event(
    p_user_id UUID,
    p_data_type TEXT,
    p_record_id TEXT,
    p_purpose TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    user_role TEXT;
    metadata JSONB;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM users WHERE id = p_user_id;
    
    -- Build metadata
    metadata := jsonb_build_object(
        'data_type', p_data_type,
        'purpose', p_purpose,
        'decryption_timestamp', now()
    );
    
    -- Log the event with higher risk score for decryption
    RETURN log_audit_event(
        p_user_id,
        user_role,
        'DATA_DECRYPTED',
        p_data_type,
        p_record_id,
        NULL,
        metadata,
        p_ip_address,
        p_user_agent,
        p_session_id,
        true,
        NULL,
        5, -- Medium-high risk for decryption events
        metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. AUDIT LOG VIEWS AND REPORTS
-- =====================================================

-- View for high-risk events
CREATE OR REPLACE VIEW high_risk_audit_events AS
SELECT 
    log_id,
    user_id,
    user_role,
    action,
    resource_type,
    resource_id,
    risk_score,
    security_flags,
    ip_address,
    timestamp,
    error_message
FROM haraka_audit_logs
WHERE risk_score >= 7
ORDER BY timestamp DESC;

-- View for failed events
CREATE OR REPLACE VIEW failed_audit_events AS
SELECT 
    log_id,
    user_id,
    user_role,
    action,
    resource_type,
    error_message,
    ip_address,
    timestamp,
    risk_score
FROM haraka_audit_logs
WHERE success = false
ORDER BY timestamp DESC;

-- View for consent-related events
CREATE OR REPLACE VIEW consent_audit_events AS
SELECT 
    log_id,
    user_id,
    user_role,
    action,
    resource_id as consent_id,
    old_values,
    new_values,
    ip_address,
    timestamp,
    risk_score
FROM haraka_audit_logs
WHERE action LIKE '%CONSENT%'
ORDER BY timestamp DESC;

-- =====================================================
-- 4. AUDIT LOG CLEANUP AND MAINTENANCE
-- =====================================================

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
    p_retention_days INTEGER DEFAULT 365
) RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Archive or delete logs older than retention period
    DELETE FROM haraka_audit_logs
    WHERE timestamp < (now() - INTERVAL '1 day' * p_retention_days);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup operation
    PERFORM log_audit_event(
        '00000000-0000-0000-0000-000000000000'::UUID, -- System user
        'system',
        'AUDIT_CLEANUP',
        'audit_logs',
        NULL,
        NULL,
        jsonb_build_object('deleted_count', deleted_count, 'retention_days', p_retention_days),
        NULL,
        'System Cleanup Job',
        NULL,
        true,
        NULL,
        1
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. RLS POLICIES FOR AUDIT LOGS
-- =====================================================

-- Enable RLS on audit logs
ALTER TABLE haraka_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own audit logs
CREATE POLICY user_own_audit_logs ON haraka_audit_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Policy: Admins can see all audit logs
CREATE POLICY admin_all_audit_logs ON haraka_audit_logs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policy: Teachers can see audit logs for their students
CREATE POLICY teacher_student_audit_logs ON haraka_audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN user_relationships ur ON u.id = ur.child_id
            WHERE u.id = haraka_audit_logs.user_id
            AND ur.parent_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM users teacher
                WHERE teacher.id = auth.uid()
                AND teacher.role = 'teacher'
            )
        )
    );

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions for audit functions
GRANT EXECUTE ON FUNCTION log_audit_event(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, JSONB, INET, TEXT, TEXT, BOOLEAN, TEXT, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION log_video_upload_event(UUID, TEXT, UUID, BIGINT, INTEGER, TEXT, BOOLEAN, TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_report_view_event(UUID, TEXT, UUID, TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_decryption_event(UUID, TEXT, TEXT, TEXT, INET, TEXT, TEXT) TO authenticated;

-- Grant access to views
GRANT SELECT ON high_risk_audit_events TO authenticated;
GRANT SELECT ON failed_audit_events TO authenticated;
GRANT SELECT ON consent_audit_events TO authenticated;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE haraka_audit_logs IS 'Comprehensive audit log for all system events including video uploads, consent changes, and data access';
COMMENT ON FUNCTION log_audit_event IS 'Log any audit event with automatic risk assessment';
COMMENT ON FUNCTION log_video_upload_event IS 'Specialized logging for video upload events';
COMMENT ON FUNCTION log_report_view_event IS 'Log report viewing with access control validation';
COMMENT ON FUNCTION log_decryption_event IS 'Log data decryption events for security monitoring';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Audit Log System installed successfully!';
    RAISE NOTICE 'Table created: haraka_audit_logs with comprehensive event tracking';
    RAISE NOTICE 'Functions created: log_audit_event, log_video_upload_event, log_report_view_event, log_decryption_event';
    RAISE NOTICE 'Views created: high_risk_audit_events, failed_audit_events, consent_audit_events';
    RAISE NOTICE 'RLS policies applied for secure access control';
END $$;