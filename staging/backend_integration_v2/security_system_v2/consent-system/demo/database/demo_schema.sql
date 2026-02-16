-- Demo Mode Database Schema
-- نظام قاعدة البيانات للوضع التجريبي
-- Created: 2024-01-20
-- Purpose: Separate demo tables and functions for testing without affecting production

-- =====================================================
-- 1. DEMO EXERCISE SESSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS exercise_sessions_demo (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Demo metadata
    is_demo BOOLEAN DEFAULT true,
    demo_student_name VARCHAR(100) DEFAULT 'أحمد محمد التجريبي',
    demo_exercise_type VARCHAR(50) DEFAULT 'كرة القدم',
    
    -- Session details
    upload_url TEXT,
    upload_expires_at TIMESTAMP WITH TIME ZONE,
    video_file_path TEXT,
    video_file_size BIGINT,
    video_duration INTEGER, -- in seconds
    
    -- Processing status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for demo sessions
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_demo_status ON exercise_sessions_demo(status);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_demo_created ON exercise_sessions_demo(created_at);

-- =====================================================
-- 2. DEMO ANALYSIS REPORTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS analysis_reports_demo (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES exercise_sessions_demo(session_id) ON DELETE CASCADE,
    
    -- Demo metadata
    is_demo BOOLEAN DEFAULT true,
    
    -- Analysis results
    overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
    
    -- Detailed metrics (JSON)
    metrics JSONB DEFAULT '{}',
    
    -- AI analysis details
    ai_model_version VARCHAR(50) DEFAULT 'demo_v1.0',
    processing_time_ms INTEGER,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for demo reports
CREATE INDEX IF NOT EXISTS idx_analysis_reports_demo_session ON analysis_reports_demo(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_demo_score ON analysis_reports_demo(overall_score);

-- =====================================================
-- 3. DEMO NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications_demo (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exercise_sessions_demo(session_id) ON DELETE CASCADE,
    report_id UUID REFERENCES analysis_reports_demo(report_id) ON DELETE CASCADE,
    
    -- Demo metadata
    is_demo BOOLEAN DEFAULT true,
    
    -- Notification details
    recipient_role VARCHAR(20) CHECK (recipient_role IN ('student', 'parent', 'teacher', 'coach', 'admin')),
    recipient_name VARCHAR(100),
    notification_type VARCHAR(30) DEFAULT 'analysis_complete',
    
    -- Content
    title VARCHAR(200),
    message TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for demo notifications
CREATE INDEX IF NOT EXISTS idx_notifications_demo_session ON notifications_demo(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_demo_status ON notifications_demo(status);

-- =====================================================
-- 4. DEMO FUNCTIONS
-- =====================================================

-- Function to create a demo session
CREATE OR REPLACE FUNCTION create_demo_session(
    p_student_name VARCHAR(100) DEFAULT 'أحمد محمد التجريبي',
    p_exercise_type VARCHAR(50) DEFAULT 'كرة القدم',
    p_upload_expires_minutes INTEGER DEFAULT 5
) RETURNS TABLE (
    session_id UUID,
    upload_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_session_id UUID;
    v_upload_url TEXT;
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate session ID
    v_session_id := gen_random_uuid();
    
    -- Calculate expiration time
    v_expires_at := now() + (p_upload_expires_minutes || ' minutes')::INTERVAL;
    
    -- Generate signed upload URL (mock for demo)
    v_upload_url := 'https://demo-storage.haraka.com/upload/' || v_session_id || '?expires=' || extract(epoch from v_expires_at);
    
    -- Insert demo session
    INSERT INTO exercise_sessions_demo (
        session_id,
        demo_student_name,
        demo_exercise_type,
        upload_url,
        upload_expires_at,
        status
    ) VALUES (
        v_session_id,
        p_student_name,
        p_exercise_type,
        v_upload_url,
        v_expires_at,
        'pending'
    );
    
    -- Log audit event
    PERFORM log_audit_event(
        'demo_system'::UUID,
        'system',
        'DEMO_SESSION_CREATED',
        'exercise_session',
        v_session_id::TEXT,
        NULL,
        jsonb_build_object(
            'student_name', p_student_name,
            'exercise_type', p_exercise_type,
            'expires_at', v_expires_at,
            'is_demo', true
        ),
        NULL,
        'Demo System',
        NULL,
        true,
        NULL,
        2,
        jsonb_build_object('demo_mode', true)
    );
    
    -- Return session details
    RETURN QUERY SELECT v_session_id, v_upload_url, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete demo session (mark as uploaded)
CREATE OR REPLACE FUNCTION complete_demo_session(
    p_session_id UUID,
    p_video_file_path TEXT DEFAULT NULL,
    p_video_file_size BIGINT DEFAULT NULL,
    p_video_duration INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_session_exists BOOLEAN;
BEGIN
    -- Check if session exists and is pending
    SELECT EXISTS(
        SELECT 1 FROM exercise_sessions_demo 
        WHERE session_id = p_session_id 
        AND status = 'pending'
        AND upload_expires_at > now()
    ) INTO v_session_exists;
    
    IF NOT v_session_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Update session status
    UPDATE exercise_sessions_demo SET
        status = 'processing',
        video_file_path = COALESCE(p_video_file_path, 'demo/videos/' || p_session_id || '.mp4'),
        video_file_size = COALESCE(p_video_file_size, 1024000), -- 1MB default
        video_duration = COALESCE(p_video_duration, 30), -- 30 seconds default
        processing_started_at = now(),
        updated_at = now()
    WHERE session_id = p_session_id;
    
    -- Log audit event
    PERFORM log_audit_event(
        'demo_system'::UUID,
        'system',
        'DEMO_VIDEO_UPLOADED',
        'exercise_session',
        p_session_id::TEXT,
        NULL,
        jsonb_build_object(
            'video_file_path', p_video_file_path,
            'video_file_size', p_video_file_size,
            'video_duration', p_video_duration,
            'is_demo', true
        ),
        NULL,
        'Demo System',
        NULL,
        true,
        NULL,
        2,
        jsonb_build_object('demo_mode', true)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate mock analysis report
CREATE OR REPLACE FUNCTION generate_demo_analysis_report(
    p_session_id UUID
) RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_session_exists BOOLEAN;
    v_overall_score INTEGER;
    v_metrics JSONB;
    v_recommendations JSONB;
    v_processing_time INTEGER;
BEGIN
    -- Check if session exists and is processing
    SELECT EXISTS(
        SELECT 1 FROM exercise_sessions_demo 
        WHERE session_id = p_session_id 
        AND status = 'processing'
    ) INTO v_session_exists;
    
    IF NOT v_session_exists THEN
        RETURN NULL;
    END IF;
    
    -- Generate realistic mock data
    v_overall_score := 75 + (random() * 20)::INTEGER; -- Score between 75-95
    v_processing_time := 2000 + (random() * 3000)::INTEGER; -- 2-5 seconds
    
    -- Generate mock metrics
    v_metrics := jsonb_build_object(
        'balance', jsonb_build_object(
            'score', 80 + (random() * 15)::INTEGER,
            'left_foot_stability', 0.8 + (random() * 0.15),
            'right_foot_stability', 0.75 + (random() * 0.2),
            'core_stability', 0.85 + (random() * 0.1)
        ),
        'speed', jsonb_build_object(
            'score', 70 + (random() * 25)::INTEGER,
            'avg_speed_kmh', 15 + (random() * 10),
            'max_speed_kmh', 25 + (random() * 15),
            'acceleration_ms2', 2.5 + (random() * 1.5)
        ),
        'accuracy', jsonb_build_object(
            'score', 85 + (random() * 10)::INTEGER,
            'shot_accuracy_percent', 70 + (random() * 25),
            'pass_accuracy_percent', 80 + (random() * 15),
            'ball_control_score', 0.8 + (random() * 0.15)
        ),
        'technique', jsonb_build_object(
            'score', 78 + (random() * 17)::INTEGER,
            'form_consistency', 0.75 + (random() * 0.2),
            'movement_efficiency', 0.8 + (random() * 0.15),
            'timing_precision', 0.85 + (random() * 0.1)
        )
    );
    
    -- Generate mock recommendations
    v_recommendations := jsonb_build_array(
        jsonb_build_object(
            'category', 'balance',
            'priority', 'high',
            'title', 'تحسين الثبات على القدم اليسرى',
            'description', 'ركز على تمارين التوازن على قدم واحدة لمدة 30 ثانية يومياً',
            'exercises', jsonb_build_array('تمرين الوقوف على قدم واحدة', 'تمرين البلانك الجانبي')
        ),
        jsonb_build_object(
            'category', 'speed',
            'priority', 'medium',
            'title', 'زيادة سرعة الانطلاق',
            'description', 'تمارين السبرنت القصيرة ستحسن من قوة الانطلاق',
            'exercises', jsonb_build_array('سبرنت 20 متر', 'تمارين البليومترك')
        ),
        jsonb_build_object(
            'category', 'technique',
            'priority', 'low',
            'title', 'تطوير دقة التمرير',
            'description', 'التدرب على التمرير للأهداف الصغيرة سيحسن الدقة',
            'exercises', jsonb_build_array('تمرير للمربعات', 'تمرير بالحائط')
        )
    );
    
    -- Generate report ID
    v_report_id := gen_random_uuid();
    
    -- Insert analysis report
    INSERT INTO analysis_reports_demo (
        report_id,
        session_id,
        overall_score,
        metrics,
        ai_model_version,
        processing_time_ms,
        confidence_score,
        recommendations
    ) VALUES (
        v_report_id,
        p_session_id,
        v_overall_score,
        v_metrics,
        'demo_v1.0',
        v_processing_time,
        0.85 + (random() * 0.1), -- Confidence between 0.85-0.95
        v_recommendations
    );
    
    -- Update session status to completed
    UPDATE exercise_sessions_demo SET
        status = 'completed',
        processing_completed_at = now(),
        updated_at = now()
    WHERE session_id = p_session_id;
    
    -- Log audit event
    PERFORM log_audit_event(
        'demo_system'::UUID,
        'system',
        'DEMO_ANALYSIS_COMPLETED',
        'analysis_report',
        v_report_id::TEXT,
        NULL,
        jsonb_build_object(
            'session_id', p_session_id,
            'overall_score', v_overall_score,
            'processing_time_ms', v_processing_time,
            'is_demo', true
        ),
        NULL,
        'Demo AI System',
        NULL,
        true,
        NULL,
        1,
        jsonb_build_object('demo_mode', true)
    );
    
    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create demo notifications
CREATE OR REPLACE FUNCTION create_demo_notifications(
    p_session_id UUID,
    p_report_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_notification_count INTEGER := 0;
    v_session_data RECORD;
    v_report_data RECORD;
BEGIN
    -- Get session and report data
    SELECT demo_student_name, demo_exercise_type INTO v_session_data
    FROM exercise_sessions_demo WHERE session_id = p_session_id;
    
    SELECT overall_score INTO v_report_data
    FROM analysis_reports_demo WHERE report_id = p_report_id;
    
    -- Create notifications for different roles
    
    -- 1. Student notification
    INSERT INTO notifications_demo (
        session_id, report_id, recipient_role, recipient_name,
        notification_type, title, message, status
    ) VALUES (
        p_session_id, p_report_id, 'student', v_session_data.demo_student_name,
        'analysis_complete',
        'تم إكمال تحليل أدائك الرياضي!',
        'تم الانتهاء من تحليل تمرين ' || v_session_data.demo_exercise_type || '. النتيجة الإجمالية: ' || v_report_data.overall_score || '/100',
        'sent'
    );
    v_notification_count := v_notification_count + 1;
    
    -- 2. Parent notification
    INSERT INTO notifications_demo (
        session_id, report_id, recipient_role, recipient_name,
        notification_type, title, message, status
    ) VALUES (
        p_session_id, p_report_id, 'parent', 'ولي أمر ' || v_session_data.demo_student_name,
        'analysis_complete',
        'تقرير أداء طفلك جاهز',
        'تم إكمال تحليل الأداء الرياضي لطفلك ' || v_session_data.demo_student_name || ' في تمرين ' || v_session_data.demo_exercise_type,
        'sent'
    );
    v_notification_count := v_notification_count + 1;
    
    -- 3. Teacher notification
    INSERT INTO notifications_demo (
        session_id, report_id, recipient_role, recipient_name,
        notification_type, title, message, status
    ) VALUES (
        p_session_id, p_report_id, 'teacher', 'معلم التربية البدنية',
        'analysis_complete',
        'تقرير تحليل جديد متاح',
        'تم إكمال تحليل أداء الطالب ' || v_session_data.demo_student_name || '. يمكن مراجعة التقرير والتوصيات',
        'sent'
    );
    v_notification_count := v_notification_count + 1;
    
    -- 4. Coach notification
    INSERT INTO notifications_demo (
        session_id, report_id, recipient_role, recipient_name,
        notification_type, title, message, status
    ) VALUES (
        p_session_id, p_report_id, 'coach', 'المدرب الرياضي',
        'analysis_complete',
        'تحليل أداء جديد - يتطلب مراجعة',
        'تحليل أداء متقدم متاح للطالب ' || v_session_data.demo_student_name || ' مع توصيات تدريبية مخصصة',
        'sent'
    );
    v_notification_count := v_notification_count + 1;
    
    -- Log audit event
    PERFORM log_audit_event(
        'demo_system'::UUID,
        'system',
        'DEMO_NOTIFICATIONS_CREATED',
        'notifications',
        p_report_id::TEXT,
        NULL,
        jsonb_build_object(
            'session_id', p_session_id,
            'notification_count', v_notification_count,
            'is_demo', true
        ),
        NULL,
        'Demo Notification System',
        NULL,
        true,
        NULL,
        1,
        jsonb_build_object('demo_mode', true)
    );
    
    RETURN v_notification_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. DEMO DATA CLEANUP FUNCTION
-- =====================================================

-- Function to cleanup old demo data
CREATE OR REPLACE FUNCTION cleanup_demo_data(
    p_older_than_hours INTEGER DEFAULT 24
) RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER := 0;
    v_cutoff_time TIMESTAMP WITH TIME ZONE;
BEGIN
    v_cutoff_time := now() - (p_older_than_hours || ' hours')::INTERVAL;
    
    -- Delete old demo sessions (cascades to reports and notifications)
    DELETE FROM exercise_sessions_demo 
    WHERE created_at < v_cutoff_time;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    -- Log cleanup
    PERFORM log_audit_event(
        'demo_system'::UUID,
        'system',
        'DEMO_DATA_CLEANUP',
        'maintenance',
        NULL,
        NULL,
        jsonb_build_object(
            'deleted_sessions', v_deleted_count,
            'cutoff_hours', p_older_than_hours,
            'is_demo', true
        ),
        NULL,
        'Demo Cleanup System',
        NULL,
        true,
        NULL,
        1,
        jsonb_build_object('demo_mode', true)
    );
    
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions for demo functions
GRANT EXECUTE ON FUNCTION create_demo_session(VARCHAR, VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_demo_session(UUID, TEXT, BIGINT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_demo_analysis_report(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_demo_notifications(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_demo_data(INTEGER) TO authenticated;

-- Grant table access
GRANT SELECT, INSERT, UPDATE ON exercise_sessions_demo TO authenticated;
GRANT SELECT, INSERT, UPDATE ON analysis_reports_demo TO authenticated;
GRANT SELECT, INSERT, UPDATE ON notifications_demo TO authenticated;

-- =====================================================
-- 7. COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE exercise_sessions_demo IS 'Demo exercise sessions for testing without affecting production data';
COMMENT ON TABLE analysis_reports_demo IS 'Demo analysis reports generated by mock AI system';
COMMENT ON TABLE notifications_demo IS 'Demo notifications sent to various roles after analysis completion';

COMMENT ON FUNCTION create_demo_session IS 'Creates a new demo session with signed upload URL';
COMMENT ON FUNCTION complete_demo_session IS 'Marks demo session as uploaded and ready for processing';
COMMENT ON FUNCTION generate_demo_analysis_report IS 'Generates mock analysis report with realistic data';
COMMENT ON FUNCTION create_demo_notifications IS 'Creates notifications for all relevant roles';
COMMENT ON FUNCTION cleanup_demo_data IS 'Cleans up old demo data to prevent storage bloat';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Demo database schema created successfully!';
    RAISE NOTICE 'Tables: exercise_sessions_demo, analysis_reports_demo, notifications_demo';
    RAISE NOTICE 'Functions: create_demo_session, complete_demo_session, generate_demo_analysis_report, create_demo_notifications, cleanup_demo_data';
    RAISE NOTICE 'Demo mode ready for testing!';
END $$;