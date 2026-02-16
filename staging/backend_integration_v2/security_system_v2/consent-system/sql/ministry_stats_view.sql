-- Ministry Statistics Aggregated View
-- This view provides anonymized, aggregated statistics for ministry-level reporting
-- NO PERSONAL IDENTIFIABLE INFORMATION (PII) IS INCLUDED

CREATE OR REPLACE VIEW ministry_stats_view AS
SELECT 
    -- Regional aggregations
    r.region_id,
    r.region_name,
    
    -- School-level aggregations (no individual school identification for privacy)
    COUNT(DISTINCT s.school_id) as school_count,
    COUNT(DISTINCT sp.student_id) as student_count,
    COUNT(DISTINCT vs.session_id) as session_count,
    
    -- Performance metrics (aggregated only)
    ROUND(AVG(vs.final_score), 2) as average_score,
    ROUND(AVG(vs.confidence_level), 2) as average_confidence,
    
    -- Participation metrics
    ROUND(
        (COUNT(DISTINCT CASE WHEN vs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
               THEN sp.student_id END) * 100.0) / 
        NULLIF(COUNT(DISTINCT sp.student_id), 0), 2
    ) as monthly_participation_rate,
    
    -- Activity metrics
    COUNT(DISTINCT CASE WHEN vs.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
          THEN vs.session_id END) as weekly_sessions,
    COUNT(DISTINCT CASE WHEN vs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
          THEN vs.session_id END) as monthly_sessions,
    
    -- Performance distribution (anonymized counts)
    COUNT(CASE WHEN vs.final_score >= 90 THEN 1 END) as excellent_count,
    COUNT(CASE WHEN vs.final_score >= 80 AND vs.final_score < 90 THEN 1 END) as good_count,
    COUNT(CASE WHEN vs.final_score >= 70 AND vs.final_score < 80 THEN 1 END) as satisfactory_count,
    COUNT(CASE WHEN vs.final_score < 70 THEN 1 END) as needs_improvement_count,
    
    -- Exercise type distribution
    COUNT(CASE WHEN vs.exercise_type = 'football' THEN 1 END) as football_sessions,
    COUNT(CASE WHEN vs.exercise_type = 'basketball' THEN 1 END) as basketball_sessions,
    COUNT(CASE WHEN vs.exercise_type = 'running' THEN 1 END) as running_sessions,
    COUNT(CASE WHEN vs.exercise_type = 'swimming' THEN 1 END) as swimming_sessions,
    
    -- Temporal aggregations
    MAX(vs.created_at) as last_activity,
    MIN(vs.created_at) as first_activity,
    
    -- Data freshness indicator
    NOW() as report_generated_at

FROM regions r
LEFT JOIN schools s ON r.region_id = s.region_id
LEFT JOIN student_profiles sp ON s.school_id = sp.school_id
LEFT JOIN video_sessions vs ON sp.student_id = vs.student_id

-- Privacy filters: Only include consented and active data
WHERE sp.consent_status = 'active'
  AND sp.privacy_level IN ('public', 'school_only')
  AND vs.status = 'completed'
  AND vs.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) -- Only recent data

GROUP BY r.region_id, r.region_name

-- Additional privacy protection: Only show regions with minimum threshold
HAVING student_count >= 50  -- Minimum 50 students to prevent identification

ORDER BY student_count DESC;

-- School-level aggregated report (no PII)
CREATE OR REPLACE VIEW school_performance_summary AS
SELECT 
    s.school_id,
    s.school_name,
    r.region_name,
    s.school_type,
    
    -- Aggregated metrics only
    COUNT(DISTINCT sp.student_id) as total_students,
    COUNT(DISTINCT vs.session_id) as total_sessions,
    ROUND(AVG(vs.final_score), 2) as average_performance,
    
    -- Performance grade based on averages
    CASE 
        WHEN AVG(vs.final_score) >= 85 THEN 'A'
        WHEN AVG(vs.final_score) >= 75 THEN 'B' 
        WHEN AVG(vs.final_score) >= 65 THEN 'C'
        ELSE 'D'
    END as performance_grade,
    
    -- Activity indicators
    MAX(vs.created_at) as last_activity_date,
    COUNT(DISTINCT CASE WHEN vs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
          THEN vs.session_id END) as recent_sessions,
    
    -- Participation rate
    ROUND(
        (COUNT(DISTINCT CASE WHEN vs.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
               THEN sp.student_id END) * 100.0) / 
        NULLIF(COUNT(DISTINCT sp.student_id), 0), 2
    ) as participation_rate,
    
    NOW() as report_date

FROM schools s
JOIN regions r ON s.region_id = r.region_id
LEFT JOIN student_profiles sp ON s.school_id = sp.school_id
LEFT JOIN video_sessions vs ON sp.student_id = vs.student_id

WHERE sp.consent_status = 'active'
  AND vs.status = 'completed'
  AND vs.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTHS)

GROUP BY s.school_id, s.school_name, r.region_name, s.school_type

-- Privacy protection: Only schools with minimum activity
HAVING total_students >= 10 AND total_sessions >= 20

ORDER BY average_performance DESC;

-- Access control view for ministry users
CREATE OR REPLACE VIEW ministry_access_permissions AS
SELECT 
    'ministry_stats_view' as view_name,
    'SELECT' as permission_type,
    'Aggregated statistics only - NO PII access' as description,
    TRUE as allowed
UNION ALL
SELECT 
    'student_profiles' as view_name,
    'SELECT' as permission_type, 
    'Individual student data - BLOCKED for ministry users' as description,
    FALSE as allowed
UNION ALL
SELECT 
    'student_personal_info' as view_name,
    'SELECT' as permission_type,
    'Personal information - STRICTLY PROHIBITED' as description, 
    FALSE as allowed;

-- Audit log for access attempts
CREATE TABLE IF NOT EXISTS ministry_access_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    attempted_resource VARCHAR(255) NOT NULL,
    access_granted BOOLEAN NOT NULL,
    denial_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for security monitoring
    INDEX idx_access_log_user (user_id, timestamp),
    INDEX idx_access_log_resource (attempted_resource, access_granted),
    INDEX idx_access_log_denied (access_granted, timestamp) WHERE access_granted = FALSE
);

-- Row Level Security policy for ministry users
CREATE POLICY ministry_aggregated_data_only ON ministry_stats_view
    FOR SELECT TO ministry_users
    USING (true); -- Allow access to aggregated view only

-- Deny access to individual student data
CREATE POLICY deny_student_pii_to_ministry ON student_profiles  
    FOR ALL TO ministry_users
    USING (false); -- Completely block access to PII

-- Function to log and deny PII access attempts
CREATE OR REPLACE FUNCTION log_ministry_access_attempt(
    p_user_id VARCHAR(255),
    p_resource VARCHAR(255),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Log the access attempt
    INSERT INTO ministry_access_log (
        user_id, 
        user_role,
        attempted_resource, 
        access_granted, 
        denial_reason,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        'ministry',
        p_resource, 
        FALSE, 
        'Ministry users cannot access individual student PII data',
        p_ip_address,
        p_user_agent
    );
    
    -- Always return FALSE to deny access
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;