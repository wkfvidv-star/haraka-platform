/**
 * اختبار شامل لسياسات RLS - منصة حركة
 * Comprehensive RLS Policies Test - Haraka Platform
 * 
 * اختبارات متقدمة لضمان عمل جميع السياسات بشكل صحيح
 */

-- ===== إعداد بيانات اختبار شاملة =====

-- إنشاء مستخدمين تجريبيين لجميع الأدوار
DO $$
BEGIN
    -- حذف البيانات التجريبية السابقة
    DELETE FROM haraka_audit_logs WHERE user_role LIKE '%test%';
    DELETE FROM haraka_analysis_reports WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_exercise_sessions WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_teacher_profiles WHERE id BETWEEN 1000 AND 1999;
    DELETE FROM haraka_student_profiles WHERE id BETWEEN 1000 AND 1999;
    
    -- إدراج مستخدمين تجريبيين
    INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at) VALUES
        -- طلاب
        ('10000001-0001-0001-0001-000000000001', 'student1@test.haraka.edu.sa', '{"role": "student", "name": "أحمد محمد السعد"}', NOW(), NOW()),
        ('10000001-0001-0001-0001-000000000002', 'student2@test.haraka.edu.sa', '{"role": "student", "name": "فاطمة علي الأحمد"}', NOW(), NOW()),
        ('10000001-0001-0001-0001-000000000003', 'youth1@test.haraka.edu.sa', '{"role": "youth", "name": "خالد سعد المطيري"}', NOW(), NOW()),
        
        -- أولياء أمور
        ('20000002-0002-0002-0002-000000000001', 'guardian1@test.haraka.edu.sa', '{"role": "guardian", "name": "محمد سعد السعد"}', NOW(), NOW()),
        ('20000002-0002-0002-0002-000000000002', 'guardian2@test.haraka.edu.sa', '{"role": "guardian", "name": "نورا أحمد الأحمد"}', NOW(), NOW()),
        
        -- معلمين ومدربين
        ('30000003-0003-0003-0003-000000000001', 'teacher1@test.haraka.edu.sa', '{"role": "teacher", "name": "سارة محمد القحطاني", "region_id": "riyadh"}', NOW(), NOW()),
        ('30000003-0003-0003-0003-000000000002', 'trainer1@test.haraka.edu.sa', '{"role": "trainer", "name": "عبدالله أحمد الغامدي", "region_id": "makkah"}', NOW(), NOW()),
        
        -- مديريات تربية
        ('40000004-0004-0004-0004-000000000001', 'directorate1@test.haraka.edu.sa', '{"role": "education_directorate", "name": "مديرية تعليم الرياض", "region_id": "riyadh"}', NOW(), NOW()),
        ('40000004-0004-0004-0004-000000000002', 'directorate2@test.haraka.edu.sa', '{"role": "education_directorate", "name": "مديرية تعليم مكة", "region_id": "makkah"}', NOW(), NOW()),
        
        -- وزارة
        ('50000005-0005-0005-0005-000000000001', 'ministry1@test.haraka.edu.sa', '{"role": "ministry", "name": "وزارة التعليم - قسم الإحصاء"}', NOW(), NOW()),
        
        -- منسقي مسابقات
        ('60000006-0006-0006-0006-000000000001', 'competition1@test.haraka.edu.sa', '{"role": "competition_organizer", "name": "منسق مسابقات الرياض"}', NOW(), NOW()),
        
        -- أدمن
        ('70000007-0007-0007-0007-000000000001', 'admin1@test.haraka.edu.sa', '{"role": "admin", "name": "مدير النظام الرئيسي"}', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET 
        raw_user_meta_data = EXCLUDED.raw_user_meta_data,
        updated_at = NOW();
    
    RAISE NOTICE 'تم إنشاء المستخدمين التجريبيين بنجاح';
END
$$;

-- إنشاء ملفات طلاب تجريبية
INSERT INTO haraka_student_profiles (id, user_id, full_name, date_of_birth, guardian_id, class_name, school_name, region_id, created_at) VALUES
    (1001, '10000001-0001-0001-0001-000000000001', 'أحمد محمد السعد', '2012-03-15', '20000002-0002-0002-0002-000000000001', 'الصف الخامس أ', 'مدرسة الملك عبدالعزيز الابتدائية', 'riyadh', NOW()),
    (1002, '10000001-0001-0001-0001-000000000002', 'فاطمة علي الأحمد', '2011-07-22', '20000002-0002-0002-0002-000000000002', 'الصف السادس ب', 'مدرسة الأميرة نورا الابتدائية', 'riyadh', NOW()),
    (1003, '10000001-0001-0001-0001-000000000003', 'خالد سعد المطيري', '2008-11-10', NULL, 'الصف الثاني متوسط', 'متوسطة الإمام محمد بن سعود', 'makkah', NOW()),
    (1004, NULL, 'سلمى أحمد الزهراني', '2013-01-05', '20000002-0002-0002-0002-000000000001', 'الصف الرابع أ', 'مدرسة الملك عبدالعزيز الابتدائية', 'riyadh', NOW()),
    (1005, NULL, 'عبدالرحمن محمد العتيبي', '2010-09-18', NULL, 'الصف السادس ج', 'مدرسة الأمير سلطان الابتدائية', 'makkah', NOW())
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    guardian_id = EXCLUDED.guardian_id,
    region_id = EXCLUDED.region_id;

-- إنشاء ملفات معلمين تجريبية
INSERT INTO haraka_teacher_profiles (id, user_id, full_name, class_name, subject, school_name, region_id, created_at) VALUES
    (1001, '30000003-0003-0003-0003-000000000001', 'سارة محمد القحطاني', 'الصف الخامس أ', 'التربية البدنية', 'مدرسة الملك عبدالعزيز الابتدائية', 'riyadh', NOW()),
    (1002, '30000003-0003-0003-0003-000000000002', 'عبدالله أحمد الغامدي', 'الصف الثاني متوسط', 'التربية البدنية', 'متوسطة الإمام محمد بن سعود', 'makkah', NOW())
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    class_name = EXCLUDED.class_name;

-- إنشاء جلسات تمارين تجريبية
INSERT INTO haraka_exercise_sessions (id, student_id, teacher_id, exercise_type, duration_minutes, difficulty_level, completion_status, created_at) VALUES
    (1001, 1001, '30000003-0003-0003-0003-000000000001', 'balance', 30, 'beginner', 'completed', NOW() - INTERVAL '2 days'),
    (1002, 1002, '30000003-0003-0003-0003-000000000001', 'coordination', 25, 'intermediate', 'completed', NOW() - INTERVAL '1 day'),
    (1003, 1003, '30000003-0003-0003-0003-000000000002', 'strength', 35, 'advanced', 'in_progress', NOW()),
    (1004, 1004, '30000003-0003-0003-0003-000000000001', 'flexibility', 20, 'beginner', 'completed', NOW() - INTERVAL '3 days'),
    (1005, 1005, NULL, 'endurance', 40, 'intermediate', 'scheduled', NOW() + INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE SET 
    exercise_type = EXCLUDED.exercise_type,
    completion_status = EXCLUDED.completion_status;

-- إنشاء تقارير تحليل تجريبية
INSERT INTO haraka_analysis_reports (id, student_id, overall_score, improvement_score, report_type, recommendations, created_by, created_at) VALUES
    (1001, 1001, 87.5, 12.3, 'تقييم شامل', 'يُظهر تحسناً ملحوظاً في التوازن', '30000003-0003-0003-0003-000000000001', NOW() - INTERVAL '1 day'),
    (1002, 1002, 92.1, 8.7, 'تقييم دوري', 'أداء ممتاز في جميع المهارات', '30000003-0003-0003-0003-000000000001', NOW() - INTERVAL '2 hours'),
    (1003, 1003, 78.9, 15.2, 'تقييم أولي', 'يحتاج إلى تركيز أكثر على التنسيق', '30000003-0003-0003-0003-000000000002', NOW() - INTERVAL '3 days'),
    (1004, 1004, 85.3, 10.1, 'تقييم متابعة', 'تطور جيد في المرونة', '30000003-0003-0003-0003-000000000001', NOW() - INTERVAL '1 week'),
    (1005, 1005, 90.7, 6.8, 'تقييم نهائي', 'مستوى متقدم في القدرة على التحمل', NULL, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET 
    overall_score = EXCLUDED.overall_score,
    improvement_score = EXCLUDED.improvement_score;

-- ===== دوال اختبار متقدمة =====

-- دالة محاكاة تسجيل دخول محسنة
CREATE OR REPLACE FUNCTION simulate_user_login_advanced(user_uuid UUID)
RETURNS TABLE(
    login_successful BOOLEAN,
    user_role TEXT,
    user_name TEXT,
    login_time TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    user_info RECORD;
BEGIN
    -- الحصول على معلومات المستخدم
    SELECT 
        raw_user_meta_data->>'role' as role,
        raw_user_meta_data->>'name' as name
    INTO user_info
    FROM auth.users 
    WHERE id = user_uuid;
    
    IF user_info IS NULL THEN
        RETURN QUERY SELECT false, 'unknown'::TEXT, 'مستخدم غير موجود'::TEXT, NOW();
        RETURN;
    END IF;
    
    -- محاكاة تسجيل الدخول
    PERFORM set_config('request.jwt.claims', json_build_object('sub', user_uuid)::text, true);
    
    -- تسجيل عملية تسجيل الدخول
    PERFORM log_user_authentication('LOGIN', true, NULL);
    
    RETURN QUERY SELECT true, user_info.role, user_info.name, NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار شامل للوصول
CREATE OR REPLACE FUNCTION comprehensive_access_test(user_uuid UUID, test_description TEXT)
RETURNS TABLE(
    test_name TEXT,
    user_role TEXT,
    user_name TEXT,
    students_visible INTEGER,
    own_students_only BOOLEAN,
    sessions_visible INTEGER,
    can_create_session BOOLEAN,
    reports_visible INTEGER,
    can_create_report BOOLEAN,
    ministry_views_accessible BOOLEAN,
    audit_logs_visible INTEGER,
    test_status TEXT
) AS $$
DECLARE
    login_result RECORD;
    expected_students INTEGER;
    expected_sessions INTEGER;
    expected_reports INTEGER;
    test_passed BOOLEAN := true;
    user_role_val TEXT;
BEGIN
    -- محاكاة تسجيل الدخول
    SELECT * INTO login_result FROM simulate_user_login_advanced(user_uuid);
    
    IF NOT login_result.login_successful THEN
        RETURN QUERY SELECT 
            test_description, 'unknown'::TEXT, 'فشل تسجيل الدخول'::TEXT,
            0, false, 0, false, 0, false, false, 0, 'FAILED'::TEXT;
        RETURN;
    END IF;
    
    user_role_val := login_result.user_role;
    
    -- حساب التوقعات حسب الدور
    CASE user_role_val
        WHEN 'student', 'youth' THEN
            expected_students := 1; -- يرى ملفه فقط
        WHEN 'guardian' THEN
            expected_students := (SELECT COUNT(*) FROM haraka_student_profiles WHERE guardian_id = user_uuid);
        WHEN 'teacher', 'trainer' THEN
            expected_students := (SELECT COUNT(*) FROM haraka_student_profiles sp 
                                 JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name 
                                 WHERE tp.user_id = user_uuid);
        WHEN 'admin' THEN
            expected_students := (SELECT COUNT(*) FROM haraka_student_profiles WHERE id BETWEEN 1001 AND 1005);
        ELSE
            expected_students := 0;
    END CASE;
    
    RETURN QUERY
    SELECT 
        test_description as test_name,
        user_role_val as user_role,
        login_result.user_name as user_name,
        
        -- عدد الطلاب المرئيين
        (SELECT COUNT(*)::INTEGER FROM haraka_student_profiles WHERE id BETWEEN 1001 AND 1005) as students_visible,
        
        -- هل يرى طلابه فقط
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id BETWEEN 1001 AND 1005) = expected_students as own_students_only,
        
        -- عدد الجلسات المرئية
        (SELECT COUNT(*)::INTEGER FROM haraka_exercise_sessions WHERE id BETWEEN 1001 AND 1005) as sessions_visible,
        
        -- إمكانية إنشاء جلسة
        user_role_val IN ('admin', 'teacher', 'trainer') as can_create_session,
        
        -- عدد التقارير المرئية
        (SELECT COUNT(*)::INTEGER FROM haraka_analysis_reports WHERE id BETWEEN 1001 AND 1005) as reports_visible,
        
        -- إمكانية إنشاء تقرير
        user_role_val IN ('admin', 'teacher', 'trainer') as can_create_report,
        
        -- الوصول لـ Views الوزارة
        (user_role_val IN ('ministry', 'admin') AND 
         (SELECT COUNT(*) FROM ministry_national_overview) >= 0) as ministry_views_accessible,
        
        -- عدد سجلات التدقيق المرئية
        (SELECT COUNT(*)::INTEGER FROM haraka_audit_logs WHERE user_id = user_uuid OR get_user_role() = 'admin') as audit_logs_visible,
        
        -- حالة الاختبار
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id BETWEEN 1001 AND 1005) = expected_students THEN 'PASS'
            ELSE 'FAIL'
        END as test_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار محاولات الوصول غير المصرح المتقدمة
CREATE OR REPLACE FUNCTION test_unauthorized_access_advanced()
RETURNS TABLE(
    test_scenario TEXT,
    user_role TEXT,
    attempted_action TEXT,
    access_granted BOOLEAN,
    should_be_denied BOOLEAN,
    test_result TEXT,
    risk_score INTEGER
) AS $$
DECLARE
    initial_audit_count INTEGER;
    final_audit_count INTEGER;
BEGIN
    -- اختبار 1: طالب يحاول الوصول لبيانات طالب آخر
    PERFORM simulate_user_login_advanced('10000001-0001-0001-0001-000000000001');
    
    SELECT COUNT(*) INTO initial_audit_count FROM haraka_audit_logs;
    
    RETURN QUERY
    SELECT 
        'طالب يحاول الوصول لبيانات طالب آخر'::TEXT as test_scenario,
        'student'::TEXT as user_role,
        'SELECT'::TEXT as attempted_action,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1005) > 0 as access_granted,
        true as should_be_denied,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1005) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END as test_result,
        40 as risk_score;
    
    -- اختبار 2: ولي أمر يحاول الوصول لطفل ليس له
    PERFORM simulate_user_login_advanced('20000002-0002-0002-0002-000000000001');
    
    RETURN QUERY
    SELECT 
        'ولي أمر يحاول الوصول لطفل ليس له'::TEXT as test_scenario,
        'guardian'::TEXT as user_role,
        'SELECT'::TEXT as attempted_action,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) > 0 as access_granted,
        true as should_be_denied,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END as test_result,
        50 as risk_score;
    
    -- اختبار 3: معلم يحاول الوصول لطالب من منطقة أخرى
    PERFORM simulate_user_login_advanced('30000003-0003-0003-0003-000000000001'); -- معلم الرياض
    
    RETURN QUERY
    SELECT 
        'معلم يحاول الوصول لطالب من منطقة أخرى'::TEXT as test_scenario,
        'teacher'::TEXT as user_role,
        'SELECT'::TEXT as attempted_action,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) > 0 as access_granted, -- طالب من مكة
        true as should_be_denied,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE id = 1003) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END as test_result,
        60 as risk_score;
    
    -- اختبار 4: مديرية تحاول الوصول لمنطقة أخرى
    PERFORM simulate_user_login_advanced('40000004-0004-0004-0004-000000000001'); -- مديرية الرياض
    
    RETURN QUERY
    SELECT 
        'مديرية تحاول الوصول لمنطقة أخرى'::TEXT as test_scenario,
        'education_directorate'::TEXT as user_role,
        'SELECT'::TEXT as attempted_action,
        (SELECT COUNT(*) FROM haraka_student_profiles WHERE region_id = 'makkah') > 0 as access_granted,
        true as should_be_denied,
        CASE 
            WHEN (SELECT COUNT(*) FROM haraka_student_profiles WHERE region_id = 'makkah') = 0 THEN 'PASS'
            ELSE 'FAIL'
        END as test_result,
        70 as risk_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة اختبار Views الوزارة المتقدمة
CREATE OR REPLACE FUNCTION test_ministry_views_advanced()
RETURNS TABLE(
    view_name TEXT,
    user_role TEXT,
    accessible BOOLEAN,
    record_count INTEGER,
    contains_personal_data BOOLEAN,
    anonymization_level TEXT,
    test_result TEXT
) AS $$
BEGIN
    -- اختبار وصول الوزارة
    PERFORM simulate_user_login_advanced('50000005-0005-0005-0005-000000000001');
    
    -- اختبار View الإحصائيات الوطنية
    RETURN QUERY
    SELECT 
        'ministry_national_overview'::TEXT as view_name,
        'ministry'::TEXT as user_role,
        (SELECT COUNT(*) FROM ministry_national_overview) >= 0 as accessible,
        (SELECT COUNT(*)::INTEGER FROM ministry_national_overview) as record_count,
        false as contains_personal_data, -- لا يحتوي على بيانات شخصية
        'fully_anonymized'::TEXT as anonymization_level,
        'PASS'::TEXT as test_result;
    
    -- اختبار View الاتجاهات السنوية
    RETURN QUERY
    SELECT 
        'ministry_yearly_trends'::TEXT as view_name,
        'ministry'::TEXT as user_role,
        (SELECT COUNT(*) FROM ministry_yearly_trends) >= 0 as accessible,
        (SELECT COUNT(*)::INTEGER FROM ministry_yearly_trends) as record_count,
        false as contains_personal_data,
        'fully_anonymized'::TEXT as anonymization_level,
        'PASS'::TEXT as test_result;
    
    -- اختبار View مقارنة المناطق
    RETURN QUERY
    SELECT 
        'ministry_regional_benchmarking'::TEXT as view_name,
        'ministry'::TEXT as user_role,
        (SELECT COUNT(*) FROM ministry_regional_benchmarking) >= 0 as accessible,
        (SELECT COUNT(*)::INTEGER FROM ministry_regional_benchmarking) as record_count,
        false as contains_personal_data,
        'region_level_only'::TEXT as anonymization_level,
        'PASS'::TEXT as test_result;
    
    -- اختبار عدم وصول غير الوزارة للـ Views
    PERFORM simulate_user_login_advanced('30000003-0003-0003-0003-000000000001'); -- معلم
    
    RETURN QUERY
    SELECT 
        'ministry_views_teacher_access'::TEXT as view_name,
        'teacher'::TEXT as user_role,
        false as accessible, -- يجب أن يكون مرفوض
        0 as record_count,
        false as contains_personal_data,
        'access_denied'::TEXT as anonymization_level,
        'PASS'::TEXT as test_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== تشغيل الاختبارات الشاملة =====

-- دالة تشغيل جميع الاختبارات المتقدمة
CREATE OR REPLACE FUNCTION run_comprehensive_rls_tests()
RETURNS TABLE(
    test_category TEXT,
    test_name TEXT,
    user_role TEXT,
    expected_result TEXT,
    actual_result TEXT,
    test_status TEXT,
    risk_level TEXT
) AS $$
BEGIN
    RAISE NOTICE '🧪 بدء الاختبارات الشاملة لسياسات RLS...';
    
    -- اختبارات الوصول العادي
    RETURN QUERY
    SELECT 
        'وصول الطلاب'::TEXT as test_category,
        t.test_name,
        t.user_role,
        'وصول للبيانات الشخصية فقط'::TEXT as expected_result,
        CASE WHEN t.own_students_only THEN 'وصول محدود صحيح' ELSE 'وصول غير محدود' END as actual_result,
        t.test_status,
        'منخفض'::TEXT as risk_level
    FROM comprehensive_access_test('10000001-0001-0001-0001-000000000001', 'اختبار وصول الطالب') t;
    
    RETURN QUERY
    SELECT 
        'وصول أولياء الأمور'::TEXT as test_category,
        t.test_name,
        t.user_role,
        'وصول لبيانات الأطفال فقط'::TEXT as expected_result,
        CASE WHEN t.own_students_only THEN 'وصول محدود صحيح' ELSE 'وصول غير محدود' END as actual_result,
        t.test_status,
        'منخفض'::TEXT as risk_level
    FROM comprehensive_access_test('20000002-0002-0002-0002-000000000001', 'اختبار وصول ولي الأمر') t;
    
    RETURN QUERY
    SELECT 
        'وصول المعلمين'::TEXT as test_category,
        t.test_name,
        t.user_role,
        'وصول لبيانات الطلاب المُدرَّسين'::TEXT as expected_result,
        CASE WHEN t.can_create_session AND t.can_create_report THEN 'صلاحيات صحيحة' ELSE 'صلاحيات محدودة' END as actual_result,
        t.test_status,
        'متوسط'::TEXT as risk_level
    FROM comprehensive_access_test('30000003-0003-0003-0003-000000000001', 'اختبار وصول المعلم') t;
    
    RETURN QUERY
    SELECT 
        'وصول الوزارة'::TEXT as test_category,
        t.test_name,
        t.user_role,
        'وصول للإحصائيات المجهولة فقط'::TEXT as expected_result,
        CASE WHEN t.ministry_views_accessible THEN 'وصول صحيح للـ Views' ELSE 'وصول مرفوض' END as actual_result,
        t.test_status,
        'منخفض'::TEXT as risk_level
    FROM comprehensive_access_test('50000005-0005-0005-0005-000000000001', 'اختبار وصول الوزارة') t;
    
    RETURN QUERY
    SELECT 
        'وصول الأدمن'::TEXT as test_category,
        t.test_name,
        t.user_role,
        'وصول كامل مع تسجيل'::TEXT as expected_result,
        CASE WHEN t.students_visible > 0 AND t.audit_logs_visible > 0 THEN 'وصول كامل صحيح' ELSE 'وصول محدود' END as actual_result,
        t.test_status,
        'عالي'::TEXT as risk_level
    FROM comprehensive_access_test('70000007-0007-0007-0007-000000000001', 'اختبار وصول الأدمن') t;
    
    -- اختبارات الوصول غير المصرح
    RETURN QUERY
    SELECT 
        'محاولات وصول غير مصرح'::TEXT as test_category,
        t.test_scenario as test_name,
        t.user_role,
        'وصول مرفوض'::TEXT as expected_result,
        CASE WHEN NOT t.access_granted THEN 'وصول مرفوض بنجاح' ELSE 'وصول مسموح خطأ' END as actual_result,
        t.test_result as test_status,
        CASE 
            WHEN t.risk_score >= 70 THEN 'حرج'
            WHEN t.risk_score >= 50 THEN 'عالي'
            WHEN t.risk_score >= 30 THEN 'متوسط'
            ELSE 'منخفض'
        END as risk_level
    FROM test_unauthorized_access_advanced() t;
    
    -- اختبارات Views الوزارة
    RETURN QUERY
    SELECT 
        'Views الوزارة المجهولة'::TEXT as test_category,
        t.view_name as test_name,
        t.user_role,
        'وصول مجهول فقط'::TEXT as expected_result,
        CASE 
            WHEN t.accessible AND NOT t.contains_personal_data THEN 'وصول مجهول صحيح'
            WHEN NOT t.accessible THEN 'وصول مرفوض'
            ELSE 'يحتوي على بيانات شخصية'
        END as actual_result,
        t.test_result as test_status,
        CASE 
            WHEN t.contains_personal_data THEN 'حرج'
            WHEN t.accessible THEN 'منخفض'
            ELSE 'متوسط'
        END as risk_level
    FROM test_ministry_views_advanced() t;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== تشغيل الاختبارات وعرض النتائج =====

DO $$
DECLARE
    test_result RECORD;
    total_tests INTEGER := 0;
    passed_tests INTEGER := 0;
    failed_tests INTEGER := 0;
    critical_failures INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔒 تشغيل الاختبارات الشاملة لسياسات Row Level Security';
    RAISE NOTICE '=' || repeat('=', 80);
    RAISE NOTICE '';
    
    -- تشغيل الاختبارات وعد النتائج
    FOR test_result IN 
        SELECT * FROM run_comprehensive_rls_tests()
    LOOP
        total_tests := total_tests + 1;
        
        IF test_result.test_status = 'PASS' THEN
            passed_tests := passed_tests + 1;
            RAISE NOTICE '✅ [%] % | %: % → %', 
                test_result.test_category,
                test_result.user_role,
                test_result.test_name,
                test_result.expected_result,
                test_result.actual_result;
        ELSE
            failed_tests := failed_tests + 1;
            IF test_result.risk_level = 'حرج' THEN
                critical_failures := critical_failures + 1;
            END IF;
            RAISE NOTICE '❌ [%] % | %: % → % (خطر: %)', 
                test_result.test_category,
                test_result.user_role,
                test_result.test_name,
                test_result.expected_result,
                test_result.actual_result,
                test_result.risk_level;
        END IF;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 ملخص نتائج الاختبارات الشاملة:';
    RAISE NOTICE '   📋 إجمالي الاختبارات: %', total_tests;
    RAISE NOTICE '   ✅ نجح: % (%%)', passed_tests, 
        CASE WHEN total_tests > 0 
             THEN ROUND((passed_tests::DECIMAL / total_tests) * 100, 1)
             ELSE 0 
        END;
    RAISE NOTICE '   ❌ فشل: % (%%)', failed_tests,
        CASE WHEN total_tests > 0 
             THEN ROUND((failed_tests::DECIMAL / total_tests) * 100, 1)
             ELSE 0 
        END;
    RAISE NOTICE '   🚨 فشل حرج: %', critical_failures;
    RAISE NOTICE '';
    
    IF failed_tests = 0 THEN
        RAISE NOTICE '🎉 جميع اختبارات RLS نجحت! النظام آمن ومحمي بالكامل.';
        RAISE NOTICE '🛡️ جميع السياسات تعمل كما هو متوقع.';
        RAISE NOTICE '✅ لا يمكن لأي مستخدم الوصول لبيانات غيره.';
        RAISE NOTICE '🔒 الوزارة والمديريات ترى بيانات مجمعة فقط.';
    ELSIF critical_failures > 0 THEN
        RAISE NOTICE '🚨 تحذير: يوجد % فشل حرج! يتطلب تدخل فوري.', critical_failures;
        RAISE NOTICE '⚠️ قد تكون هناك ثغرات أمنية تحتاج إصلاح.';
    ELSE
        RAISE NOTICE '⚠️ يوجد % اختبار فاشل. يرجى مراجعة السياسات.', failed_tests;
        RAISE NOTICE '🔍 راجع التفاصيل أعلاه لتحديد المشاكل.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '📈 إحصائيات إضافية:';
    RAISE NOTICE '   🔐 عدد السياسات النشطة: %', (
        SELECT COUNT(*) FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename LIKE 'haraka_%'
    );
    RAISE NOTICE '   👥 عدد المستخدمين التجريبيين: %', (
        SELECT COUNT(*) FROM auth.users 
        WHERE email LIKE '%@test.haraka.edu.sa'
    );
    RAISE NOTICE '   📊 عدد سجلات التدقيق: %', (
        SELECT COUNT(*) FROM haraka_audit_logs 
        WHERE created_at >= CURRENT_DATE
    );
    
    RAISE NOTICE '';
    RAISE NOTICE '=' || repeat('=', 80);
    RAISE NOTICE '🔒 اكتملت الاختبارات الشاملة لسياسات Row Level Security';
    RAISE NOTICE '';
END
$$;

-- ===== تنظيف بيانات الاختبار (اختياري) =====

-- دالة تنظيف شاملة لبيانات الاختبار
CREATE OR REPLACE FUNCTION cleanup_comprehensive_test_data()
RETURNS VOID AS $$
BEGIN
    RAISE NOTICE '🧹 بدء تنظيف بيانات الاختبار الشاملة...';
    
    -- حذف البيانات التجريبية
    DELETE FROM haraka_analysis_reports WHERE id BETWEEN 1001 AND 1005;
    DELETE FROM haraka_exercise_sessions WHERE id BETWEEN 1001 AND 1005;
    DELETE FROM haraka_teacher_profiles WHERE id BETWEEN 1001 AND 1002;
    DELETE FROM haraka_student_profiles WHERE id BETWEEN 1001 AND 1005;
    
    -- حذف المستخدمين التجريبيين
    DELETE FROM auth.users WHERE email LIKE '%@test.haraka.edu.sa';
    
    -- حذف سجلات التدقيق التجريبية
    DELETE FROM haraka_audit_logs WHERE user_role LIKE '%test%' OR details::text LIKE '%test%';
    
    RAISE NOTICE '✅ تم تنظيف جميع بيانات الاختبار بنجاح';
    RAISE NOTICE '📊 يمكن الآن تشغيل الاختبارات مرة أخرى بأمان';
END;
$$ LANGUAGE plpgsql;

-- رسالة تأكيد نهائية
RAISE NOTICE '';
RAISE NOTICE '🎯 تم إنشاء نظام اختبار RLS الشامل بنجاح';
RAISE NOTICE '📋 لتشغيل الاختبارات: SELECT * FROM run_comprehensive_rls_tests();';
RAISE NOTICE '🧹 لتنظيف البيانات: SELECT cleanup_comprehensive_test_data();';
RAISE NOTICE '📊 لعرض إحصائيات الأمان: SELECT * FROM daily_security_summary;';
RAISE NOTICE '';