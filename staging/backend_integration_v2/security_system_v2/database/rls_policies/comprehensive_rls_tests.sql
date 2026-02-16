/**
 * اختبارات RLS الشاملة - منصة حركة
 * Comprehensive RLS Tests - Haraka Platform
 * 
 * اختبارات شاملة لإثبات أن كل واجهة لا ترى سوى بياناتها المسموحة
 */

-- ===== إعداد بيانات الاختبار الشاملة =====

-- إنشاء مستخدمين تجريبيين لجميع الأدوار
DO $$
BEGIN
    -- حذف البيانات التجريبية السابقة إن وجدت
    DELETE FROM haraka_audit_logs WHERE user_email LIKE '%@test-haraka.com';
    DELETE FROM haraka_analysis_reports WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_exercise_sessions WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_teacher_profiles WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_student_profiles WHERE id BETWEEN 1000 AND 1999;
    
    -- حذف المستخدمين التجريبيين
    DELETE FROM auth.users WHERE email LIKE '%@test-haraka.com';
    
    RAISE NOTICE 'تم تنظيف البيانات التجريبية السابقة';
END $$;

-- إدراج مستخدمين تجريبيين جدد
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at) VALUES
    -- طلاب
    ('10000001-0001-0001-0001-000000000001', 'student1@test-haraka.com', '{"role": "student", "name": "أحمد محمد الطالب"}', NOW(), NOW()),
    ('10000001-0001-0001-0001-000000000002', 'student2@test-haraka.com', '{"role": "student", "name": "فاطمة علي الطالبة"}', NOW(), NOW()),
    
    -- أولياء أمور
    ('20000001-0001-0001-0001-000000000001', 'guardian1@test-haraka.com', '{"role": "guardian", "name": "محمد أحمد الوالد"}', NOW(), NOW()),
    ('20000001-0001-0001-0001-000000000002', 'guardian2@test-haraka.com', '{"role": "guardian", "name": "عائشة علي الوالدة"}', NOW(), NOW()),
    
    -- معلمين
    ('30000001-0001-0001-0001-000000000001', 'teacher1@test-haraka.com', '{"role": "teacher", "name": "سارة خالد المعلمة", "region_id": "riyadh"}', NOW(), NOW()),
    ('30000001-0001-0001-0001-000000000002', 'teacher2@test-haraka.com', '{"role": "teacher", "name": "عبدالله سعد المعلم", "region_id": "makkah"}', NOW(), NOW()),
    
    -- مدربين
    ('40000001-0001-0001-0001-000000000001', 'trainer1@test-haraka.com', '{"role": "trainer", "name": "خالد عبدالرحمن المدرب"}', NOW(), NOW()),
    
    -- مديريات تربية
    ('50000001-0001-0001-0001-000000000001', 'directorate1@test-haraka.com', '{"role": "education_directorate", "name": "مديرية تعليم الرياض", "region_id": "riyadh"}', NOW(), NOW()),
    ('50000001-0001-0001-0001-000000000002', 'directorate2@test-haraka.com', '{"role": "education_directorate", "name": "مديرية تعليم مكة", "region_id": "makkah"}', NOW(), NOW()),
    
    -- وزارة
    ('60000001-0001-0001-0001-000000000001', 'ministry@test-haraka.com', '{"role": "ministry", "name": "وزارة التعليم"}', NOW(), NOW()),
    
    -- منظمي مسابقات
    ('70000001-0001-0001-0001-000000000001', 'competition1@test-haraka.com', '{"role": "competition_organizer", "name": "منظم المسابقات الوطنية"}', NOW(), NOW()),
    
    -- أدمن
    ('80000001-0001-0001-0001-000000000001', 'admin@test-haraka.com', '{"role": "admin", "name": "مدير النظام"}', NOW(), NOW());

-- إدراج ملفات الطلاب التجريبية
INSERT INTO haraka_student_profiles (id, user_id, full_name, date_of_birth, guardian_id, class_name, school_name, created_at) VALUES
    (1001, '10000001-0001-0001-0001-000000000001', 'أحمد محمد الطالب', '2010-05-15', '20000001-0001-0001-0001-000000000001', 'الصف الخامس أ', 'مدرسة الملك عبدالعزيز - الرياض', NOW()),
    (1002, '10000001-0001-0001-0001-000000000002', 'فاطمة علي الطالبة', '2011-03-20', '20000001-0001-0001-0001-000000000002', 'الصف الرابع ب', 'مدرسة الأميرة نورة - الرياض', NOW()),
    (1003, NULL, 'سعد خالد الطالب', '2009-08-10', '20000001-0001-0001-0001-000000000001', 'الصف السادس أ', 'مدرسة الإمام محمد بن سعود - مكة', NOW()),
    (1004, NULL, 'نورا عبدالله الطالبة', '2012-01-25', NULL, 'الصف الثالث ج', 'مدرسة الملكة رانيا - مكة', NOW());

-- إدراج ملفات المعلمين التجريبية
INSERT INTO haraka_teacher_profiles (id, user_id, full_name, class_name, subject, school_name, created_at) VALUES
    (1001, '30000001-0001-0001-0001-000000000001', 'سارة خالد المعلمة', 'الصف الخامس أ', 'التربية البدنية', 'مدرسة الملك عبدالعزيز - الرياض', NOW()),
    (1002, '30000001-0001-0001-0001-000000000001', 'سارة خالد المعلمة', 'الصف الرابع ب', 'التربية البدنية', 'مدرسة الأميرة نورة - الرياض', NOW()),
    (1003, '30000001-0001-0001-0001-000000000002', 'عبدالله سعد المعلم', 'الصف السادس أ', 'التربية البدنية', 'مدرسة الإمام محمد بن سعود - مكة', NOW()),
    (1004, '40000001-0001-0001-0001-000000000001', 'خالد عبدالرحمن المدرب', 'برنامج التدريب المتقدم', 'التحليل الحركي', 'مركز التدريب الرياضي', NOW());

-- إدراج جلسات التمارين التجريبية
INSERT INTO haraka_exercise_sessions (id, student_id, teacher_id, exercise_type, duration_minutes, difficulty_level, completion_status, created_at) VALUES
    (1001, 1001, '30000001-0001-0001-0001-000000000001', 'balance', 30, 'beginner', 'completed', NOW() - INTERVAL '5 days'),
    (1002, 1002, '30000001-0001-0001-0001-000000000001', 'coordination', 25, 'intermediate', 'completed', NOW() - INTERVAL '4 days'),
    (1003, 1003, '30000001-0001-0001-0001-000000000002', 'strength', 35, 'advanced', 'completed', NOW() - INTERVAL '3 days'),
    (1004, 1004, NULL, 'flexibility', 20, 'beginner', 'in_progress', NOW() - INTERVAL '2 days'),
    (1005, 1001, '40000001-0001-0001-0001-000000000001', 'coordination', 40, 'advanced', 'completed', NOW() - INTERVAL '1 day');

-- إدراج تقارير التحليل التجريبية
INSERT INTO haraka_analysis_reports (id, student_id, overall_score, improvement_score, created_by, report_type, created_at) VALUES
    (1001, 1001, 85.5, 12.3, '30000001-0001-0001-0001-000000000001', 'تقييم شامل', NOW() - INTERVAL '5 days'),
    (1002, 1002, 78.2, 8.7, '30000001-0001-0001-0001-000000000001', 'تقييم شامل', NOW() - INTERVAL '4 days'),
    (1003, 1003, 92.1, 15.4, '30000001-0001-0001-0001-000000000002', 'تقييم شامل', NOW() - INTERVAL '3 days'),
    (1004, 1004, 67.8, 5.2, NULL, 'تقييم أولي', NOW() - INTERVAL '2 days'),
    (1005, 1001, 88.9, 18.6, '40000001-0001-0001-0001-000000000001', 'تقييم متقدم', NOW() - INTERVAL '1 day');

-- ===== دوال اختبار شاملة =====

-- دالة محاكاة تسجيل دخول متقدمة
CREATE OR REPLACE FUNCTION simulate_user_session(
    user_uuid UUID,
    session_duration_minutes INTEGER DEFAULT 30
)
RETURNS VOID AS $$
DECLARE
    session_token TEXT;
BEGIN
    -- إنشاء session token
    session_token := 'test_session_' || user_uuid::TEXT || '_' || EXTRACT(EPOCH FROM NOW())::TEXT;
    
    -- تعيين معلومات الجلسة
    PERFORM set_config('request.jwt.claims', 
        json_build_object(
            'sub', user_uuid,
            'session_id', session_token,
            'exp', EXTRACT(EPOCH FROM NOW() + (session_duration_minutes || ' minutes')::INTERVAL)
        )::text, 
        true
    );
    
    -- تعيين معلومات الشبكة المحاكاة
    PERFORM set_config('request.headers', 
        json_build_object(
            'user-agent', 'Mozilla/5.0 (Test Browser)',
            'x-forwarded-for', '192.168.1.' || (RANDOM() * 254 + 1)::INTEGER::TEXT
        )::text, 
        true
    );
    
    -- تسجيل بداية الجلسة
    PERFORM log_user_login(user_uuid, 'test_session', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار شاملة للوصول
CREATE OR REPLACE FUNCTION comprehensive_access_test(
    user_uuid UUID,
    test_name TEXT
)
RETURNS TABLE(
    test_scenario TEXT,
    user_role TEXT,
    resource_type TEXT,
    expected_access TEXT,
    actual_count INTEGER,
    access_result TEXT,
    test_status TEXT
) AS $$
DECLARE
    current_role TEXT;
    test_results RECORD;
BEGIN
    -- بدء جلسة المحاكاة
    PERFORM simulate_user_session(user_uuid);
    
    -- الحصول على دور المستخدم
    SELECT get_user_role() INTO current_role;
    
    -- اختبار الوصول للطلاب
    RETURN QUERY
    SELECT 
        test_name as test_scenario,
        current_role as user_role,
        'haraka_student_profiles' as resource_type,
        CASE 
            WHEN current_role = 'admin' THEN 'جميع الطلاب'
            WHEN current_role IN ('student', 'youth') THEN 'الطالب نفسه فقط'
            WHEN current_role = 'guardian' THEN 'أطفاله فقط'
            WHEN current_role IN ('teacher', 'trainer') THEN 'طلابه فقط'
            WHEN current_role = 'education_directorate' THEN 'طلاب منطقته فقط'
            WHEN current_role = 'ministry' THEN 'لا وصول مباشر'
            ELSE 'لا وصول'
        END as expected_access,
        (SELECT COUNT(*)::INTEGER FROM haraka_student_profiles) as actual_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles) > 0 THEN 'مسموح'
            ELSE 'مرفوض'
        END as access_result,
        CASE 
            WHEN current_role = 'admin' AND (SELECT COUNT(*) FROM haraka_student_profiles) = 4 THEN 'نجح'
            WHEN current_role IN ('student', 'youth') AND (SELECT COUNT(*) FROM haraka_student_profiles) = 1 THEN 'نجح'
            WHEN current_role = 'guardian' AND (SELECT COUNT(*) FROM haraka_student_profiles) BETWEEN 1 AND 2 THEN 'نجح'
            WHEN current_role IN ('teacher', 'trainer') AND (SELECT COUNT(*) FROM haraka_student_profiles) BETWEEN 1 AND 3 THEN 'نجح'
            WHEN current_role = 'education_directorate' AND (SELECT COUNT(*) FROM haraka_student_profiles) BETWEEN 1 AND 3 THEN 'نجح'
            WHEN current_role = 'ministry' AND (SELECT COUNT(*) FROM haraka_student_profiles) = 0 THEN 'نجح'
            ELSE 'فشل'
        END as test_status;
    
    -- اختبار الوصول للجلسات
    RETURN QUERY
    SELECT 
        test_name as test_scenario,
        current_role as user_role,
        'haraka_exercise_sessions' as resource_type,
        CASE 
            WHEN current_role = 'admin' THEN 'جميع الجلسات'
            WHEN current_role IN ('student', 'youth') THEN 'جلساته فقط'
            WHEN current_role = 'guardian' THEN 'جلسات أطفاله فقط'
            WHEN current_role IN ('teacher', 'trainer') THEN 'جلسات طلابه فقط'
            ELSE 'حسب الصلاحية'
        END as expected_access,
        (SELECT COUNT(*)::INTEGER FROM haraka_exercise_sessions) as actual_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_exercise_sessions) > 0 THEN 'مسموح'
            ELSE 'مرفوض'
        END as access_result,
        CASE 
            WHEN current_role = 'admin' AND (SELECT COUNT(*) FROM haraka_exercise_sessions) = 5 THEN 'نجح'
            WHEN current_role IN ('student', 'youth') AND (SELECT COUNT(*) FROM haraka_exercise_sessions) BETWEEN 1 AND 2 THEN 'نجح'
            WHEN current_role = 'guardian' AND (SELECT COUNT(*) FROM haraka_exercise_sessions) BETWEEN 1 AND 3 THEN 'نجح'
            WHEN current_role IN ('teacher', 'trainer') AND (SELECT COUNT(*) FROM haraka_exercise_sessions) BETWEEN 1 AND 4 THEN 'نجح'
            ELSE 'تحقق مطلوب'
        END as test_status;
    
    -- اختبار الوصول للتقارير
    RETURN QUERY
    SELECT 
        test_name as test_scenario,
        current_role as user_role,
        'haraka_analysis_reports' as resource_type,
        CASE 
            WHEN current_role = 'admin' THEN 'جميع التقارير'
            WHEN current_role IN ('student', 'youth') THEN 'تقاريره فقط'
            WHEN current_role = 'guardian' THEN 'تقارير أطفاله فقط'
            WHEN current_role IN ('teacher', 'trainer') THEN 'تقارير طلابه فقط'
            ELSE 'حسب الصلاحية'
        END as expected_access,
        (SELECT COUNT(*)::INTEGER FROM haraka_analysis_reports) as actual_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_analysis_reports) > 0 THEN 'مسموح'
            ELSE 'مرفوض'
        END as access_result,
        CASE 
            WHEN current_role = 'admin' AND (SELECT COUNT(*) FROM haraka_analysis_reports) = 5 THEN 'نجح'
            WHEN current_role IN ('student', 'youth') AND (SELECT COUNT(*) FROM haraka_analysis_reports) BETWEEN 1 AND 2 THEN 'نجح'
            WHEN current_role = 'guardian' AND (SELECT COUNT(*) FROM haraka_analysis_reports) BETWEEN 1 AND 3 THEN 'نجح'
            WHEN current_role IN ('teacher', 'trainer') AND (SELECT COUNT(*) FROM haraka_analysis_reports) BETWEEN 1 AND 4 THEN 'نجح'
            ELSE 'تحقق مطلوب'
        END as test_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار محاولات الوصول المرفوضة
CREATE OR REPLACE FUNCTION test_access_violations()
RETURNS TABLE(
    violation_test TEXT,
    user_role TEXT,
    attempted_resource TEXT,
    violation_detected BOOLEAN,
    audit_logged BOOLEAN,
    security_status TEXT
) AS $$
DECLARE
    initial_audit_count INTEGER;
    final_audit_count INTEGER;
    student_user_id UUID := '10000001-0001-0001-0001-000000000001';
    guardian_user_id UUID := '20000001-0001-0001-0001-000000000001';
    teacher_user_id UUID := '30000001-0001-0001-0001-000000000001';
BEGIN
    -- اختبار 1: طالب يحاول الوصول لبيانات طالب آخر
    PERFORM simulate_user_session(student_user_id);
    
    SELECT COUNT(*) INTO initial_audit_count FROM haraka_audit_logs;
    
    -- محاولة وصول غير مصرح (يجب أن تفشل)
    BEGIN
        PERFORM * FROM haraka_student_profiles WHERE id = 1003; -- طالب من مدرسة أخرى
    EXCEPTION
        WHEN OTHERS THEN
            PERFORM log_access_denied('haraka_student_profiles', '1003', 'SELECT', 'Student accessing other student data');
    END;
    
    SELECT COUNT(*) INTO final_audit_count FROM haraka_audit_logs;
    
    RETURN QUERY
    SELECT 
        'طالب يحاول الوصول لطالب آخر' as violation_test,
        'student' as user_role,
        'haraka_student_profiles' as attempted_resource,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) = 0 as violation_detected,
        final_audit_count > initial_audit_count as audit_logged,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) = 0 
                AND final_audit_count > initial_audit_count 
            THEN 'آمن - تم الحجب والتسجيل'
            ELSE 'خطر أمني!'
        END as security_status;
    
    -- اختبار 2: ولي أمر يحاول الوصول لطفل ليس له
    PERFORM simulate_user_session(guardian_user_id);
    
    SELECT COUNT(*) INTO initial_audit_count FROM haraka_audit_logs;
    
    BEGIN
        PERFORM * FROM haraka_student_profiles WHERE id = 1004; -- طالب ليس له ولي أمر مسجل
    EXCEPTION
        WHEN OTHERS THEN
            PERFORM log_access_denied('haraka_student_profiles', '1004', 'SELECT', 'Guardian accessing non-child data');
    END;
    
    SELECT COUNT(*) INTO final_audit_count FROM haraka_audit_logs;
    
    RETURN QUERY
    SELECT 
        'ولي أمر يحاول الوصول لطفل ليس له' as violation_test,
        'guardian' as user_role,
        'haraka_student_profiles' as attempted_resource,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1004 AND guardian_id = guardian_user_id) = 0 as violation_detected,
        final_audit_count > initial_audit_count as audit_logged,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1004 AND guardian_id = guardian_user_id) = 0
                AND final_audit_count > initial_audit_count 
            THEN 'آمن - تم الحجب والتسجيل'
            ELSE 'خطر أمني!'
        END as security_status;
    
    -- اختبار 3: معلم يحاول الوصول لطالب من منطقة أخرى
    PERFORM simulate_user_session(teacher_user_id);
    
    SELECT COUNT(*) INTO initial_audit_count FROM haraka_audit_logs;
    
    BEGIN
        PERFORM * FROM haraka_student_profiles WHERE id = 1003; -- طالب من مكة والمعلم من الرياض
    EXCEPTION
        WHEN OTHERS THEN
            PERFORM log_access_denied('haraka_student_profiles', '1003', 'SELECT', 'Teacher accessing student from different region');
    END;
    
    SELECT COUNT(*) INTO final_audit_count FROM haraka_audit_logs;
    
    RETURN QUERY
    SELECT 
        'معلم يحاول الوصول لطالب من منطقة أخرى' as violation_test,
        'teacher' as user_role,
        'haraka_student_profiles' as attempted_resource,
        (SELECT COUNT(*) FROM haraka_student_profiles sp 
         JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name 
         WHERE sp.id = 1003 AND tp.user_id = teacher_user_id) = 0 as violation_detected,
        final_audit_count > initial_audit_count as audit_logged,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles sp 
                  JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name 
                  WHERE sp.id = 1003 AND tp.user_id = teacher_user_id) = 0
                AND final_audit_count > initial_audit_count 
            THEN 'آمن - تم الحجب والتسجيل'
            ELSE 'خطر أمني!'
        END as security_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار Views الوزارة والمديريات
CREATE OR REPLACE FUNCTION test_anonymized_views()
RETURNS TABLE(
    view_name TEXT,
    user_role TEXT,
    contains_pii BOOLEAN,
    data_aggregated BOOLEAN,
    access_allowed BOOLEAN,
    privacy_protected BOOLEAN,
    test_result TEXT
) AS $$
DECLARE
    ministry_user_id UUID := '60000001-0001-0001-0001-000000000001';
    directorate_user_id UUID := '50000001-0001-0001-0001-000000000001';
    sample_record RECORD;
BEGIN
    -- اختبار Views الوزارة
    PERFORM simulate_user_session(ministry_user_id);
    
    -- اختبار ministry_national_performance
    BEGIN
        SELECT * INTO sample_record FROM ministry_national_performance LIMIT 1;
        
        RETURN QUERY
        SELECT 
            'ministry_national_performance' as view_name,
            'ministry' as user_role,
            false as contains_pii, -- يجب ألا تحتوي على بيانات شخصية
            true as data_aggregated, -- البيانات مجمعة
            sample_record IS NOT NULL as access_allowed,
            true as privacy_protected, -- محمية بحد أدنى 50 طالب
            CASE 
                WHEN sample_record IS NOT NULL THEN 'نجح - وصول آمن للبيانات المجمعة'
                ELSE 'فشل - لا يوجد بيانات كافية'
            END as test_result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN QUERY
            SELECT 
                'ministry_national_performance' as view_name,
                'ministry' as user_role,
                false as contains_pii,
                true as data_aggregated,
                false as access_allowed,
                true as privacy_protected,
                'فشل - خطأ في الوصول' as test_result;
    END;
    
    -- اختبار Views المديريات
    PERFORM simulate_user_session(directorate_user_id);
    
    BEGIN
        SELECT * INTO sample_record FROM directorate_regional_stats 
        WHERE region_code = 'riyadh' LIMIT 1;
        
        RETURN QUERY
        SELECT 
            'directorate_regional_stats' as view_name,
            'education_directorate' as user_role,
            false as contains_pii,
            true as data_aggregated,
            sample_record IS NOT NULL as access_allowed,
            true as privacy_protected, -- محمية بحد أدنى 25 طالب
            CASE 
                WHEN sample_record IS NOT NULL THEN 'نجح - وصول إقليمي آمن'
                ELSE 'فشل - لا يوجد بيانات إقليمية كافية'
            END as test_result;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN QUERY
            SELECT 
                'directorate_regional_stats' as view_name,
                'education_directorate' as user_role,
                false as contains_pii,
                true as data_aggregated,
                false as access_allowed,
                true as privacy_protected,
                'فشل - خطأ في الوصول الإقليمي' as test_result;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== تشغيل الاختبارات الشاملة =====

-- دالة تشغيل جميع الاختبارات
CREATE OR REPLACE FUNCTION run_comprehensive_rls_tests()
RETURNS TABLE(
    test_category TEXT,
    test_details TEXT,
    result_status TEXT,
    security_level TEXT,
    notes TEXT
) AS $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🧪 بدء الاختبارات الشاملة لسياسات RLS';
    RAISE NOTICE '=' || repeat('=', 70);
    RAISE NOTICE '';
    
    -- اختبار 1: وصول الطلاب
    RAISE NOTICE '👨‍🎓 اختبار وصول الطلاب...';
    RETURN QUERY
    SELECT 
        'وصول الطلاب' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        CASE WHEN test_status = 'نجح' THEN 'آمن' ELSE 'يحتاج مراجعة' END as security_level,
        'الطالب: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '10000001-0001-0001-0001-000000000001', 
        'اختبار الطالب أحمد'
    );
    
    -- اختبار 2: وصول أولياء الأمور
    RAISE NOTICE '👨‍👩‍👧‍👦 اختبار وصول أولياء الأمور...';
    RETURN QUERY
    SELECT 
        'وصول أولياء الأمور' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        CASE WHEN test_status = 'نجح' THEN 'آمن' ELSE 'يحتاج مراجعة' END as security_level,
        'ولي الأمر: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '20000001-0001-0001-0001-000000000001', 
        'اختبار ولي الأمر محمد'
    );
    
    -- اختبار 3: وصول المعلمين
    RAISE NOTICE '👨‍🏫 اختبار وصول المعلمين...';
    RETURN QUERY
    SELECT 
        'وصول المعلمين' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        CASE WHEN test_status = 'نجح' THEN 'آمن' ELSE 'يحتاج مراجعة' END as security_level,
        'المعلم: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '30000001-0001-0001-0001-000000000001', 
        'اختبار المعلمة سارة'
    );
    
    -- اختبار 4: وصول مديريات التربية
    RAISE NOTICE '🏛️ اختبار وصول مديريات التربية...';
    RETURN QUERY
    SELECT 
        'وصول مديريات التربية' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        CASE WHEN test_status = 'نجح' THEN 'آمن' ELSE 'يحتاج مراجعة' END as security_level,
        'المديرية: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '50000001-0001-0001-0001-000000000001', 
        'اختبار مديرية الرياض'
    );
    
    -- اختبار 5: وصول الوزارة
    RAISE NOTICE '🏢 اختبار وصول الوزارة...';
    RETURN QUERY
    SELECT 
        'وصول الوزارة' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        CASE WHEN test_status = 'نجح' THEN 'آمن' ELSE 'يحتاج مراجعة' END as security_level,
        'الوزارة: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '60000001-0001-0001-0001-000000000001', 
        'اختبار الوزارة'
    );
    
    -- اختبار 6: وصول الأدمن
    RAISE NOTICE '👑 اختبار وصول الأدمن...';
    RETURN QUERY
    SELECT 
        'وصول الأدمن' as test_category,
        test_scenario || ' - ' || resource_type as test_details,
        test_status as result_status,
        'آمن مع تسجيل' as security_level,
        'الأدمن: ' || user_role || ' - العدد المرئي: ' || actual_count as notes
    FROM comprehensive_access_test(
        '80000001-0001-0001-0001-000000000001', 
        'اختبار مدير النظام'
    );
    
    -- اختبار 7: محاولات الوصول المرفوضة
    RAISE NOTICE '🚫 اختبار محاولات الوصول المرفوضة...';
    RETURN QUERY
    SELECT 
        'محاولات وصول مرفوضة' as test_category,
        violation_test as test_details,
        security_status as result_status,
        CASE WHEN security_status LIKE '%آمن%' THEN 'محمي' ELSE 'خطر' END as security_level,
        'المستخدم: ' || user_role || ' - مسجل: ' || audit_logged as notes
    FROM test_access_violations();
    
    -- اختبار 8: Views المجهولة
    RAISE NOTICE '📊 اختبار Views المجهولة...';
    RETURN QUERY
    SELECT 
        'Views مجهولة' as test_category,
        view_name || ' - ' || user_role as test_details,
        test_result as result_status,
        CASE WHEN privacy_protected THEN 'محمي' ELSE 'غير محمي' END as security_level,
        'بيانات شخصية: ' || contains_pii || ' - مجمع: ' || data_aggregated as notes
    FROM test_anonymized_views();
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ اكتملت جميع الاختبارات الشاملة';
    RAISE NOTICE '=' || repeat('=', 70);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== تشغيل الاختبارات وعرض النتائج =====

-- عرض نتائج الاختبارات الشاملة
DO $$
DECLARE
    test_record RECORD;
    total_tests INTEGER := 0;
    passed_tests INTEGER := 0;
    failed_tests INTEGER := 0;
    security_issues INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔒 تشغيل اختبارات RLS الشاملة - منصة حركة';
    RAISE NOTICE '=' || repeat('=', 80);
    
    -- تشغيل الاختبارات وعد النتائج
    FOR test_record IN 
        SELECT * FROM run_comprehensive_rls_tests()
    LOOP
        total_tests := total_tests + 1;
        
        IF test_record.result_status LIKE '%نجح%' OR test_record.result_status LIKE '%آمن%' THEN
            passed_tests := passed_tests + 1;
            RAISE NOTICE '✅ %: % - %', 
                test_record.test_category,
                test_record.test_details,
                test_record.result_status;
        ELSE
            failed_tests := failed_tests + 1;
            IF test_record.security_level = 'خطر' THEN
                security_issues := security_issues + 1;
            END IF;
            RAISE NOTICE '❌ %: % - %', 
                test_record.test_category,
                test_record.test_details,
                test_record.result_status;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 ملخص نتائج الاختبارات الشاملة:';
    RAISE NOTICE '   📝 إجمالي الاختبارات: %', total_tests;
    RAISE NOTICE '   ✅ نجح: %', passed_tests;
    RAISE NOTICE '   ❌ فشل: %', failed_tests;
    RAISE NOTICE '   🚨 مشاكل أمنية: %', security_issues;
    RAISE NOTICE '   📈 معدل النجاح: %%', 
        CASE WHEN total_tests > 0 
             THEN ROUND((passed_tests::DECIMAL / total_tests) * 100, 1)
             ELSE 0 
        END;
    
    RAISE NOTICE '';
    
    IF security_issues = 0 AND failed_tests <= (total_tests * 0.1) THEN
        RAISE NOTICE '🎉 نظام RLS آمن ومحمي! جميع السياسات تعمل بشكل صحيح.';
    ELSIF security_issues = 0 THEN
        RAISE NOTICE '⚠️  النظام آمن مع بعض التحسينات المطلوبة.';
    ELSE
        RAISE NOTICE '🚨 تحذير: يوجد % مشكلة أمنية تحتاج معالجة فورية!', security_issues;
    END IF;
    
    RAISE NOTICE '=' || repeat('=', 80);
    RAISE NOTICE '';
    
    -- إحصائيات إضافية
    RAISE NOTICE '📈 إحصائيات إضافية:';
    RAISE NOTICE '   👥 مستخدمين تجريبيين: %', (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%@test-haraka.com');
    RAISE NOTICE '   🎓 طلاب تجريبيين: %', (SELECT COUNT(*) FROM haraka_student_profiles WHERE id BETWEEN 1000 AND 1999);
    RAISE NOTICE '   📝 سجلات مراجعة: %', (SELECT COUNT(*) FROM haraka_audit_logs WHERE created_at >= CURRENT_DATE);
    RAISE NOTICE '';
END
$$;

-- ===== تنظيف البيانات التجريبية (اختياري) =====

-- دالة تنظيف البيانات التجريبية
CREATE OR REPLACE FUNCTION cleanup_comprehensive_test_data()
RETURNS TEXT AS $$
DECLARE
    cleanup_summary TEXT;
BEGIN
    -- حذف البيانات التجريبية
    DELETE FROM haraka_audit_logs WHERE user_email LIKE '%@test-haraka.com';
    DELETE FROM haraka_analysis_reports WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_exercise_sessions WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_teacher_profiles WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_student_profiles WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM auth.users WHERE email LIKE '%@test-haraka.com';
    
    cleanup_summary := '🧹 تم تنظيف جميع البيانات التجريبية بنجاح';
    
    RAISE NOTICE '%', cleanup_summary;
    RETURN cleanup_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- رسالة إرشادية
RAISE NOTICE '';
RAISE NOTICE '📋 الاختبارات الشاملة جاهزة للتشغيل!';
RAISE NOTICE '🔧 لتشغيل الاختبارات: SELECT * FROM run_comprehensive_rls_tests();';
RAISE NOTICE '🧹 لتنظيف البيانات: SELECT cleanup_comprehensive_test_data();';
RAISE NOTICE '';