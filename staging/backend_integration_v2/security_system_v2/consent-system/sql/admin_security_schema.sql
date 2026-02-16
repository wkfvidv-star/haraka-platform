-- Admin Security Dashboard Schema
-- Comprehensive security management, audit logging, and key rotation system

-- Enhanced audit logs table for comprehensive security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Action details
    action VARCHAR(100) NOT NULL, -- LOGIN, LOGOUT, ACCESS_DENIED, DATA_ACCESS, etc.
    resource VARCHAR(255) NOT NULL, -- API endpoint, table name, file path
    outcome VARCHAR(50) NOT NULL CHECK (outcome IN ('success', 'failure', 'blocked')),
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- Detailed information
    details JSONB,
    error_message TEXT,
    
    -- Security flags
    is_suspicious BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Indexes for performance
    INDEX idx_audit_logs_timestamp (timestamp DESC),
    INDEX idx_audit_logs_user (user_id, timestamp DESC),
    INDEX idx_audit_logs_action (action, timestamp DESC),
    INDEX idx_audit_logs_outcome (outcome, timestamp DESC),
    INDEX idx_audit_logs_suspicious (is_suspicious, timestamp DESC) WHERE is_suspicious = TRUE,
    INDEX idx_audit_logs_ip (ip_address, timestamp DESC),
    INDEX idx_audit_logs_resource (resource, timestamp DESC)
);

-- Key rotation events table
CREATE TABLE IF NOT EXISTS key_rotation_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Key information
    key_id VARCHAR(255) NOT NULL,
    key_type VARCHAR(50) NOT NULL DEFAULT 'encryption', -- encryption, signing, etc.
    old_key_fingerprint VARCHAR(255),
    new_key_fingerprint VARCHAR(255) NOT NULL,
    
    -- Rotation details
    status VARCHAR(50) NOT NULL CHECK (status IN ('initiated', 'in_progress', 'completed', 'failed', 'rolled_back')),
    rotation_type VARCHAR(50) NOT NULL CHECK (rotation_type IN ('scheduled', 'emergency', 'manual', 'automatic')),
    
    -- Metadata
    triggered_by VARCHAR(255) NOT NULL, -- user_id or 'system'
    reason TEXT,
    affected_files_count INTEGER DEFAULT 0,
    
    -- Progress tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Error handling
    error_details JSONB,
    rollback_reason TEXT,
    
    -- Indexes
    INDEX idx_key_rotation_timestamp (timestamp DESC),
    INDEX idx_key_rotation_status (status, timestamp DESC),
    INDEX idx_key_rotation_key_id (key_id, timestamp DESC),
    INDEX idx_key_rotation_triggered_by (triggered_by, timestamp DESC)
);

-- Security incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Incident classification
    incident_type VARCHAR(100) NOT NULL, -- brute_force, data_breach, unauthorized_access, etc.
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    
    -- Affected entities
    affected_user_ids UUID[],
    affected_resources TEXT[],
    
    -- Detection details
    detected_by VARCHAR(100), -- system, user_report, external_scan, etc.
    detection_method VARCHAR(100),
    
    -- Incident details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact_assessment TEXT,
    
    -- Response tracking
    assigned_to VARCHAR(255),
    response_actions JSONB,
    resolution_summary TEXT,
    
    -- Timestamps
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    INDEX idx_security_incidents_timestamp (timestamp DESC),
    INDEX idx_security_incidents_severity (severity, timestamp DESC),
    INDEX idx_security_incidents_status (status, timestamp DESC),
    INDEX idx_security_incidents_type (incident_type, timestamp DESC)
);

-- Failed login attempts tracking
CREATE TABLE IF NOT EXISTS failed_login_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Attempt details
    username VARCHAR(255),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    
    -- Failure details
    failure_reason VARCHAR(100), -- invalid_credentials, account_locked, etc.
    attempt_count INTEGER DEFAULT 1,
    
    -- Geographic information (optional)
    country_code VARCHAR(2),
    city VARCHAR(100),
    
    -- Security flags
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason VARCHAR(255),
    blocked_until TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    INDEX idx_failed_logins_timestamp (timestamp DESC),
    INDEX idx_failed_logins_ip (ip_address, timestamp DESC),
    INDEX idx_failed_logins_username (username, timestamp DESC),
    INDEX idx_failed_logins_blocked (is_blocked, timestamp DESC) WHERE is_blocked = TRUE
);

-- User access revocations table
CREATE TABLE IF NOT EXISTS user_access_revocations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User information
    user_id UUID NOT NULL REFERENCES users(id),
    revoked_by UUID NOT NULL REFERENCES users(id),
    
    -- Revocation details
    revocation_type VARCHAR(50) NOT NULL CHECK (revocation_type IN ('emergency', 'scheduled', 'consent_withdrawn', 'policy_violation')),
    reason TEXT NOT NULL,
    
    -- Scope of revocation
    access_types_revoked TEXT[], -- ['data_access', 'login', 'api_access', etc.]
    effective_immediately BOOLEAN DEFAULT TRUE,
    
    -- Restoration details
    can_be_restored BOOLEAN DEFAULT TRUE,
    restoration_conditions TEXT,
    restored_at TIMESTAMP WITH TIME ZONE,
    restored_by UUID REFERENCES users(id),
    
    -- Indexes
    INDEX idx_revocations_timestamp (timestamp DESC),
    INDEX idx_revocations_user (user_id, timestamp DESC),
    INDEX idx_revocations_type (revocation_type, timestamp DESC),
    INDEX idx_revocations_revoked_by (revoked_by, timestamp DESC)
);

-- Enhanced RLS policies for admin access
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_rotation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access_revocations ENABLE ROW LEVEL SECURITY;

-- Admin full access policy
CREATE POLICY admin_full_access_audit_logs ON audit_logs
    FOR ALL TO admin_users
    USING (true)
    WITH CHECK (true);

CREATE POLICY admin_full_access_key_rotation ON key_rotation_events
    FOR ALL TO admin_users
    USING (true)
    WITH CHECK (true);

CREATE POLICY admin_full_access_security_incidents ON security_incidents
    FOR ALL TO admin_users
    USING (true)
    WITH CHECK (true);

CREATE POLICY admin_full_access_revocations ON user_access_revocations
    FOR ALL TO admin_users
    USING (true)
    WITH CHECK (true);

-- Security dashboard views
CREATE OR REPLACE VIEW security_dashboard_metrics AS
SELECT 
    -- User metrics
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM users WHERE status = 'suspended') as suspended_users,
    (SELECT COUNT(*) FROM users WHERE status = 'revoked') as revoked_users,
    
    -- Login metrics (last 24 hours)
    (SELECT COUNT(*) FROM audit_logs 
     WHERE action = 'LOGIN' AND outcome = 'success' 
       AND timestamp > NOW() - INTERVAL 24 HOUR) as successful_logins_24h,
    (SELECT COUNT(*) FROM audit_logs 
     WHERE action = 'LOGIN' AND outcome = 'failure' 
       AND timestamp > NOW() - INTERVAL 24 HOUR) as failed_logins_24h,
    
    -- Security metrics
    (SELECT COUNT(*) FROM key_rotation_events 
     WHERE timestamp > DATE_TRUNC('month', NOW())) as key_rotations_this_month,
    (SELECT COUNT(*) FROM security_incidents 
     WHERE severity IN ('high', 'critical') AND status = 'open') as critical_alerts,
    
    -- Access revocations
    (SELECT COUNT(*) FROM user_access_revocations 
     WHERE timestamp > NOW() - INTERVAL 24 HOUR) as revocations_24h,
    
    -- Suspicious activity
    (SELECT COUNT(*) FROM audit_logs 
     WHERE is_suspicious = TRUE 
       AND timestamp > NOW() - INTERVAL 24 HOUR) as suspicious_activities_24h,
    
    NOW() as generated_at;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource VARCHAR(255),
    p_outcome VARCHAR(50),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_is_suspicious BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
    user_info RECORD;
BEGIN
    -- Get user information
    SELECT name, role INTO user_info FROM users WHERE id = p_user_id;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id, user_name, user_role, action, resource, outcome,
        ip_address, user_agent, details, is_suspicious
    ) VALUES (
        p_user_id, user_info.name, user_info.role, p_action, p_resource, p_outcome,
        p_ip_address, p_user_agent, p_details, p_is_suspicious
    ) RETURNING id INTO log_id;
    
    -- Check for suspicious patterns
    IF p_is_suspicious OR p_outcome = 'failure' THEN
        PERFORM check_security_patterns(p_user_id, p_ip_address, p_action);
    END IF;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for security patterns
CREATE OR REPLACE FUNCTION check_security_patterns(
    p_user_id UUID,
    p_ip_address INET,
    p_action VARCHAR(100)
) RETURNS VOID AS $$
DECLARE
    failed_count INTEGER;
    suspicious_count INTEGER;
BEGIN
    -- Check for multiple failed login attempts
    IF p_action = 'LOGIN' THEN
        SELECT COUNT(*) INTO failed_count
        FROM audit_logs 
        WHERE user_id = p_user_id 
          AND action = 'LOGIN' 
          AND outcome = 'failure'
          AND timestamp > NOW() - INTERVAL 1 HOUR;
          
        IF failed_count >= 5 THEN
            -- Create security incident
            INSERT INTO security_incidents (
                incident_type, severity, title, description, affected_user_ids, detected_by
            ) VALUES (
                'brute_force', 'high',
                'Multiple Failed Login Attempts',
                format('User %s has %s failed login attempts in the last hour', p_user_id, failed_count),
                ARRAY[p_user_id],
                'system'
            );
        END IF;
    END IF;
    
    -- Check for suspicious IP activity
    SELECT COUNT(*) INTO suspicious_count
    FROM audit_logs 
    WHERE ip_address = p_ip_address 
      AND is_suspicious = TRUE
      AND timestamp > NOW() - INTERVAL 1 HOUR;
      
    IF suspicious_count >= 10 THEN
        INSERT INTO security_incidents (
            incident_type, severity, title, description, detected_by
        ) VALUES (
            'suspicious_ip', 'medium',
            'High Suspicious Activity from IP',
            format('IP address %s has %s suspicious activities in the last hour', p_ip_address, suspicious_count),
            'system'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for emergency user access revocation
CREATE OR REPLACE FUNCTION emergency_revoke_user_access(
    p_user_id UUID,
    p_revoked_by UUID,
    p_reason TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    revocation_id UUID;
BEGIN
    -- Start transaction
    BEGIN
        -- Update user status
        UPDATE users 
        SET status = 'revoked',
            consent_status = 'emergency_revoked',
            updated_at = NOW()
        WHERE id = p_user_id;
        
        -- Log the revocation
        INSERT INTO user_access_revocations (
            user_id, revoked_by, revocation_type, reason, access_types_revoked
        ) VALUES (
            p_user_id, p_revoked_by, 'emergency', p_reason,
            ARRAY['data_access', 'login', 'api_access', 'file_access']
        ) RETURNING id INTO revocation_id;
        
        -- Log security event
        PERFORM log_security_event(
            p_user_id, 'EMERGENCY_REVOKE', 'user_access', 'success',
            NULL, 'Admin Dashboard',
            jsonb_build_object('revocation_id', revocation_id, 'reason', p_reason),
            TRUE
        );
        
        -- Refresh materialized views if they exist
        -- REFRESH MATERIALIZED VIEW CONCURRENTLY user_access_permissions;
        
        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        -- Log the error
        PERFORM log_security_event(
            p_user_id, 'EMERGENCY_REVOKE', 'user_access', 'failure',
            NULL, 'Admin Dashboard',
            jsonb_build_object('error', SQLERRM),
            TRUE
        );
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initiate key rotation
CREATE OR REPLACE FUNCTION initiate_key_rotation(
    p_key_type VARCHAR(50),
    p_rotation_type VARCHAR(50),
    p_triggered_by VARCHAR(255),
    p_reason TEXT
) RETURNS UUID AS $$
DECLARE
    rotation_id UUID;
    new_key_id VARCHAR(255);
    new_fingerprint VARCHAR(255);
BEGIN
    -- Generate new key identifier and fingerprint
    new_key_id := 'key-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0');
    new_fingerprint := 'sha256:' || encode(gen_random_bytes(32), 'hex');
    
    -- Insert rotation event
    INSERT INTO key_rotation_events (
        key_id, key_type, new_key_fingerprint, status, rotation_type,
        triggered_by, reason, started_at
    ) VALUES (
        new_key_id, p_key_type, new_fingerprint, 'initiated', p_rotation_type,
        p_triggered_by, p_reason, NOW()
    ) RETURNING id INTO rotation_id;
    
    -- Log security event
    PERFORM log_security_event(
        NULL, 'KEY_ROTATION_INITIATED', 'encryption_keys', 'success',
        NULL, 'Security System',
        jsonb_build_object(
            'rotation_id', rotation_id,
            'key_id', new_key_id,
            'rotation_type', p_rotation_type
        ),
        FALSE
    );
    
    RETURN rotation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing
INSERT INTO audit_logs (user_id, user_name, user_role, action, resource, outcome, ip_address, user_agent, details) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'أحمد محمد', 'student', 'LOGIN', '/api/auth/login', 'success', '192.168.1.100', 'Mozilla/5.0', '{"login_method": "password"}'),
('550e8400-e29b-41d4-a716-446655440001', 'فاطمة علي', 'teacher', 'DATA_ACCESS', '/api/student/profile', 'success', '192.168.1.101', 'Mozilla/5.0', '{"accessed_profiles": 5}'),
('550e8400-e29b-41d4-a716-446655440002', 'يوسف خالد', 'student', 'LOGIN', '/api/auth/login', 'failure', '192.168.1.102', 'curl/7.68.0', '{"failure_reason": "invalid_password"}');

INSERT INTO key_rotation_events (key_id, key_type, old_key_fingerprint, new_key_fingerprint, status, rotation_type, triggered_by, reason, affected_files_count, completed_at) VALUES
('key-2025-001', 'encryption', 'sha256:a1b2c3d4e5f6...', 'sha256:f6e5d4c3b2a1...', 'completed', 'scheduled', 'system', 'Monthly scheduled rotation', 1247, NOW() - INTERVAL 1 DAY);

INSERT INTO security_incidents (incident_type, severity, status, title, description, detected_by) VALUES
('brute_force', 'high', 'investigating', 'Multiple Failed Login Attempts', 'Detected 10 failed login attempts from IP 203.0.113.42', 'system'),
('unauthorized_access', 'critical', 'open', 'Attempted Access to Restricted Data', 'User attempted to access data without proper consent', 'rls_policy');

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_audit_logs_composite 
    ON audit_logs (timestamp DESC, action, outcome) 
    WHERE timestamp > NOW() - INTERVAL 30 DAY;

CREATE INDEX IF NOT EXISTS idx_security_incidents_active 
    ON security_incidents (severity DESC, timestamp DESC) 
    WHERE status IN ('open', 'investigating');

-- Cleanup old audit logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs() RETURNS VOID AS $$
BEGIN
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - INTERVAL 1 YEAR
      AND is_suspicious = FALSE
      AND outcome = 'success';
      
    DELETE FROM failed_login_attempts 
    WHERE timestamp < NOW() - INTERVAL 6 MONTHS;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (would be set up as a cron job in production)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * 0', 'SELECT cleanup_old_audit_logs();');