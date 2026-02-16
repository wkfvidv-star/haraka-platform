-- Security System SQL Queries & Evidence
-- All queries executed during implementation and testing

-- =====================================================
-- 1. ADMIN USERS MANAGEMENT QUERIES
-- =====================================================

-- Fetch all users with security information
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    u.last_login,
    u.created_at,
    u.disabled_at,
    u.disabled_reason,
    COUNT(DISTINCT ar.id) as active_revocations,
    COUNT(DISTINCT fla.id) as failed_attempts_24h
FROM users u
LEFT JOIN access_revocations ar ON u.id = ar.user_id AND ar.status = 'active'
LEFT JOIN failed_access_attempts fla ON u.id = fla.attempted_user_id 
    AND fla.attempted_at >= NOW() - INTERVAL '24 hours'
GROUP BY u.id, u.name, u.email, u.role, u.status, u.last_login, u.created_at, u.disabled_at, u.disabled_reason
ORDER BY u.created_at DESC;

-- Expected Results:
/*
id          | name                  | email                    | role    | status   | last_login          | active_revocations | failed_attempts_24h
user-001    | أحمد محمد الأدمن       | admin@haraka.sa          | admin   | active   | 2025-01-08 10:30:00 | 0                  | 0
user-002    | فاطمة علي المدرسة     | teacher@school.edu.sa    | teacher | active   | 2025-01-08 09:15:00 | 0                  | 0
user-003    | يوسف خالد الطالب      | student@example.com      | student | disabled | 2025-01-07 20:45:00 | 1                  | 5
*/

-- Search users by name or email
SELECT u.id, u.name, u.email, u.role, u.status
FROM users u
WHERE (u.name ILIKE '%محمد%' OR u.email ILIKE '%admin%')
  AND u.status = 'active'
ORDER BY u.name;

-- =====================================================
-- 2. AUDIT LOGS QUERIES
-- =====================================================

-- Fetch recent audit logs with user information
SELECT 
    al.id,
    al.user_id,
    al.user_name,
    al.user_role,
    al.action,
    al.resource,
    al.status,
    al.ip_address,
    al.user_agent,
    al.timestamp,
    al.details
FROM audit_logs al
WHERE al.timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY al.timestamp DESC
LIMIT 50;

-- Expected Results:
/*
id        | user_name             | action         | resource              | status  | ip_address    | timestamp
audit-001 | فاطمة علي المدرسة     | LOGIN_SUCCESS  | /teacher/dashboard    | success | 192.168.1.100| 2025-01-08 09:15:00
audit-002 | يوسف خالد الطالب      | ACCESS_DENIED  | /api/students/data    | blocked | 192.168.1.200| 2025-01-08 08:30:00
audit-003 | محاولة غير مصرح بها   | LOGIN_FAILED   | /admin/login          | failed  | 203.0.113.42 | 2025-01-08 07:45:00
*/

-- Count audit events by status and action
SELECT 
    al.status,
    al.action,
    COUNT(*) as event_count,
    COUNT(DISTINCT al.user_id) as unique_users
FROM audit_logs al
WHERE al.timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY al.status, al.action
ORDER BY event_count DESC;

-- Failed login attempts analysis
SELECT 
    fla.ip_address,
    fla.attempted_username,
    COUNT(*) as attempt_count,
    MIN(fla.attempted_at) as first_attempt,
    MAX(fla.attempted_at) as last_attempt,
    BOOL_OR(fla.is_suspicious) as is_suspicious
FROM failed_access_attempts fla
WHERE fla.attempted_at >= NOW() - INTERVAL '24 hours'
GROUP BY fla.ip_address, fla.attempted_username
HAVING COUNT(*) >= 3
ORDER BY attempt_count DESC;

-- =====================================================
-- 3. KEY ROTATION QUERIES
-- =====================================================

-- Insert new key rotation event
INSERT INTO key_rotation_events (
    key_id, key_type, rotated_by, reason, rotation_type, 
    status, affected_files, old_key_fingerprint, new_key_fingerprint
) VALUES (
    'enc-key-2025-003', 'encryption', 'admin-001', 
    'Manual emergency rotation', 'emergency',
    'completed', 4, 
    'sha256:f6e5d4c3b2a1...', 'sha256:9z8y7x6w5v4u...'
) RETURNING id, key_id, status;

-- Expected Result:
/*
id                                   | key_id          | status
rotation-1704735900000              | enc-key-2025-003| completed
*/

-- Query key rotation history
SELECT 
    kr.id,
    kr.key_id,
    kr.key_type,
    kr.rotated_by,
    kr.rotated_at,
    kr.reason,
    kr.rotation_type,
    kr.status,
    kr.affected_files,
    kr.progress_percentage,
    kr.completed_at
FROM key_rotation_events kr
ORDER BY kr.rotated_at DESC
LIMIT 10;

-- Expected Results:
/*
id           | key_id           | key_type   | rotated_by | rotated_at          | status    | affected_files
rotation-003 | enc-key-2025-003 | encryption | admin-001  | 2025-01-08 18:45:00 | completed | 4
rotation-002 | sign-key-2025-001| signing    | admin-001  | 2025-01-06 03:30:00 | completed | 0
rotation-001 | enc-key-2025-001 | encryption | admin-001  | 2025-01-07 02:00:00 | completed | 1247
*/

-- Key rotation metrics
SELECT 
    kr.key_type,
    COUNT(*) as total_rotations,
    COUNT(CASE WHEN kr.status = 'completed' THEN 1 END) as successful_rotations,
    COUNT(CASE WHEN kr.status = 'failed' THEN 1 END) as failed_rotations,
    SUM(kr.affected_files) as total_files_affected,
    AVG(EXTRACT(EPOCH FROM (kr.completed_at - kr.rotated_at))/60) as avg_duration_minutes
FROM key_rotation_events kr
WHERE kr.rotated_at >= NOW() - INTERVAL '30 days'
GROUP BY kr.key_type
ORDER BY total_rotations DESC;

-- =====================================================
-- 4. EMERGENCY ACCESS REVOCATION QUERIES
-- =====================================================

-- Execute emergency user access revocation
SELECT emergency_revoke_user_access(
    'user-003'::UUID,
    'admin-001'::UUID,
    'Emergency security action - suspicious activity detected'
) as revocation_success;

-- Expected Result:
/*
revocation_success
true
*/

-- Verify user status after revocation
SELECT 
    u.id,
    u.name,
    u.status,
    u.disabled_at,
    u.disabled_reason
FROM users u
WHERE u.id = 'user-003';

-- Expected Result:
/*
id       | name               | status   | disabled_at         | disabled_reason
user-003 | يوسف خالد الطالب   | disabled | 2025-01-08 18:45:00 | Emergency security action - suspicious activity detected
*/

-- Insert access revocation record
INSERT INTO access_revocations (
    user_id, revoked_by, revocation_type, reason, severity, 
    revoked_permissions, status
) VALUES (
    'user-003', 'admin-001', 'emergency', 
    'Emergency security action - suspicious activity detected', 'high',
    '["data_access", "login", "api_access", "file_access"]'::jsonb,
    'active'
) RETURNING id, user_id, revocation_type, status;

-- Query active access revocations
SELECT 
    ar.id,
    ar.user_id,
    u.name as user_name,
    ar.revoked_by,
    admin.name as revoked_by_name,
    ar.revocation_type,
    ar.reason,
    ar.severity,
    ar.revoked_at,
    ar.status
FROM access_revocations ar
JOIN users u ON ar.user_id = u.id
JOIN users admin ON ar.revoked_by = admin.id
WHERE ar.status = 'active'
ORDER BY ar.revoked_at DESC;

-- =====================================================
-- 5. RLS (ROW LEVEL SECURITY) TESTING QUERIES
-- =====================================================

-- Test RLS blocking for revoked user
SELECT test_rls_blocking('user-003'::UUID);

-- Expected Results:
/*
test_name        | blocked | row_count
student_profiles | true    | 0
video_sessions   | true    | 0
reports          | true    | 0
*/

-- Manual RLS test - these should return 0 rows for revoked user
SET app.current_user_id = 'user-003';

SELECT COUNT(*) as accessible_profiles
FROM student_profiles 
WHERE student_id = 'user-003';
-- Expected: 0 (blocked by RLS)

SELECT COUNT(*) as accessible_sessions
FROM video_sessions 
WHERE student_id = 'user-003';
-- Expected: 0 (blocked by RLS)

SELECT COUNT(*) as accessible_reports
FROM reports 
WHERE student_id = 'user-003';
-- Expected: 0 (blocked by RLS)

-- Reset to admin context
SET app.current_user_id = 'admin-001';

-- =====================================================
-- 6. SECURITY DASHBOARD METRICS QUERIES
-- =====================================================

-- Generate security dashboard metrics
SELECT * FROM admin_security_dashboard;

-- Expected Results:
/*
total_users | active_users | disabled_users | failed_logins_24h | key_rotations_30d | consent_revocations_30d | open_incidents | generated_at
3           | 2            | 1              | 15                | 2                 | 1                       | 0              | 2025-01-08 18:45:00
*/

-- Detailed security metrics query
SELECT 
    -- User statistics
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM users WHERE status = 'disabled') as disabled_users,
    (SELECT COUNT(*) FROM users WHERE status = 'suspended') as suspended_users,
    
    -- Security events (24 hours)
    (SELECT COUNT(*) FROM failed_access_attempts 
     WHERE attempted_at >= NOW() - INTERVAL '24 hours') as failed_logins_24h,
    (SELECT COUNT(*) FROM audit_logs 
     WHERE status = 'blocked' AND timestamp >= NOW() - INTERVAL '24 hours') as blocked_attempts_24h,
    (SELECT COUNT(*) FROM audit_logs 
     WHERE status = 'success' AND action = 'LOGIN_SUCCESS' 
       AND timestamp >= NOW() - INTERVAL '24 hours') as successful_logins_24h,
    
    -- Key management (30 days)
    (SELECT COUNT(*) FROM key_rotation_events 
     WHERE rotated_at >= NOW() - INTERVAL '30 days') as key_rotations_30d,
    (SELECT COUNT(*) FROM key_rotation_events 
     WHERE status = 'completed' AND rotated_at >= NOW() - INTERVAL '30 days') as successful_rotations_30d,
    
    -- Access control
    (SELECT COUNT(*) FROM access_revocations 
     WHERE status = 'active') as active_revocations,
    (SELECT COUNT(*) FROM consent_revocations 
     WHERE revoked_at >= NOW() - INTERVAL '30 days') as consent_revocations_30d,
    
    -- Current timestamp
    NOW() as generated_at;

-- =====================================================
-- 7. AUDIT LOG INSERTION QUERIES
-- =====================================================

-- Log admin dashboard access
INSERT INTO audit_logs (
    user_id, user_name, user_role, action, resource, status,
    details, ip_address, user_agent, timestamp
) VALUES (
    'admin-001', 'System Administrator', 'admin',
    'VIEW_ADMIN_DASHBOARD', '/admin', 'success',
    'Admin accessed security dashboard', 
    '192.168.1.1', 'Mozilla/5.0 Admin Dashboard', NOW()
);

-- Log key rotation initiation
INSERT INTO audit_logs (
    user_id, user_name, user_role, action, resource, status,
    details, ip_address, user_agent, timestamp
) VALUES (
    'admin-001', 'System Administrator', 'admin',
    'KEY_ROTATION_INITIATED', '/admin/key-rotation', 'success',
    'Manual emergency key rotation initiated for encryption keys',
    '192.168.1.1', 'Mozilla/5.0 Admin Dashboard', NOW()
);

-- Log emergency access revocation
INSERT INTO audit_logs (
    user_id, user_name, user_role, action, resource, status,
    details, ip_address, user_agent, timestamp
) VALUES (
    'admin-001', 'System Administrator', 'admin',
    'EMERGENCY_REVOKE', '/users/user-003', 'success',
    'Emergency access revocation for user-003 - suspicious activity detected',
    '192.168.1.1', 'Mozilla/5.0 Admin Dashboard', NOW()
);

-- Log CSV export
INSERT INTO audit_logs (
    user_id, user_name, user_role, action, resource, status,
    details, ip_address, user_agent, timestamp
) VALUES (
    'admin-001', 'System Administrator', 'admin',
    'EXPORT_AUDIT_LOGS', '/admin/audit-logs/export', 'success',
    'Exported audit logs to CSV format',
    '192.168.1.1', 'Mozilla/5.0 Admin Dashboard', NOW()
);

-- =====================================================
-- 8. DATA VERIFICATION QUERIES
-- =====================================================

-- Verify all security tables have data
SELECT 
    'audit_logs' as table_name,
    COUNT(*) as row_count,
    MIN(timestamp) as earliest_record,
    MAX(timestamp) as latest_record
FROM audit_logs
UNION ALL
SELECT 
    'key_rotation_events' as table_name,
    COUNT(*) as row_count,
    MIN(rotated_at) as earliest_record,
    MAX(rotated_at) as latest_record
FROM key_rotation_events
UNION ALL
SELECT 
    'access_revocations' as table_name,
    COUNT(*) as row_count,
    MIN(revoked_at) as earliest_record,
    MAX(revoked_at) as latest_record
FROM access_revocations
UNION ALL
SELECT 
    'failed_access_attempts' as table_name,
    COUNT(*) as row_count,
    MIN(attempted_at) as earliest_record,
    MAX(attempted_at) as latest_record
FROM failed_access_attempts;

-- Expected Results:
/*
table_name            | row_count | earliest_record     | latest_record
audit_logs           | 8         | 2025-01-08 07:45:00 | 2025-01-08 18:45:00
key_rotation_events  | 3         | 2025-01-06 03:30:00 | 2025-01-08 18:45:00
access_revocations   | 1         | 2025-01-08 18:45:00 | 2025-01-08 18:45:00
failed_access_attempts| 3        | 2025-01-08 07:00:00 | 2025-01-08 08:00:00
*/

-- Verify RLS policies are enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('audit_logs', 'key_rotation_events', 'access_revocations', 'failed_access_attempts')
ORDER BY tablename;

-- Expected Results:
/*
schemaname | tablename            | rowsecurity
public     | access_revocations   | true
public     | audit_logs          | true
public     | failed_access_attempts| true
public     | key_rotation_events | true
*/

-- =====================================================
-- 9. PERFORMANCE & INDEXING VERIFICATION
-- =====================================================

-- Check indexes on security tables
SELECT 
    t.relname as table_name,
    i.relname as index_name,
    pg_get_indexdef(i.oid) as index_definition
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
WHERE t.relname IN ('audit_logs', 'key_rotation_events', 'access_revocations')
ORDER BY t.relname, i.relname;

-- Query performance test - should use indexes
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM audit_logs 
WHERE timestamp >= NOW() - INTERVAL '24 hours' 
  AND status = 'failed'
ORDER BY timestamp DESC;

-- =====================================================
-- 10. CLEANUP & MAINTENANCE QUERIES
-- =====================================================

-- Clean up old audit logs (retention policy - 1 year)
DELETE FROM audit_logs 
WHERE timestamp < NOW() - INTERVAL '1 year'
  AND status = 'success'
  AND action NOT IN ('EMERGENCY_REVOKE', 'KEY_ROTATION_INITIATED', 'SECURITY_INCIDENT');

-- Clean up old failed access attempts (retention policy - 6 months)
DELETE FROM failed_access_attempts 
WHERE attempted_at < NOW() - INTERVAL '6 months'
  AND is_suspicious = false;

-- Archive completed key rotations older than 1 year
UPDATE key_rotation_events 
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb), 
    '{archived}', 
    'true'::jsonb
)
WHERE rotated_at < NOW() - INTERVAL '1 year'
  AND status = 'completed';

-- =====================================================
-- END OF SQL QUERIES EVIDENCE
-- =====================================================