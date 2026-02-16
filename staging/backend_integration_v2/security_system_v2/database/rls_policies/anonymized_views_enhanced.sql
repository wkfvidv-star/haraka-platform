/**
 * Views مجهولة محسّنة للوزارة والمديريات - منصة حركة
 * Enhanced Anonymized Views for Ministry and Directorates - Haraka Platform
 * 
 * Views مجمعة ومجهولة بدون أي بيانات شخصية (PII) للوزارة والمديريات
 */

-- ===== Views للوزارة (مجهولة تماماً) =====

-- View إحصائيات الأداء الوطنية للوزارة
CREATE OR REPLACE VIEW ministry_national_performance AS
SELECT 
    -- الفترة الزمنية
    DATE_TRUNC('month', ar.created_at) as period_month,
    DATE_TRUNC('quarter', ar.created_at) as period_quarter,
    
    -- إحصائيات عامة مجهولة
    COUNT(DISTINCT sp.id) as total_students_count,
    COUNT(DISTINCT sp.class_name) as total_classes_count,
    COUNT(DISTINCT tp.school_name) as total_schools_count,
    
    -- مؤشرات الأداء المجمعة
    ROUND(AVG(ar.overall_score), 2) as national_avg_score,
    ROUND(STDDEV(ar.overall_score), 2) as score_std_deviation,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ar.overall_score), 2) as median_score,
    
    -- توزيع مستويات الأداء (نسب مئوية)
    ROUND(
        COUNT(CASE WHEN ar.overall_score >= 90 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as excellent_percentage,
    ROUND(
        COUNT(CASE WHEN ar.overall_score >= 75 AND ar.overall_score < 90 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as good_percentage,
    ROUND(
        COUNT(CASE WHEN ar.overall_score >= 60 AND ar.overall_score < 75 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as average_percentage,
    ROUND(
        COUNT(CASE WHEN ar.overall_score < 60 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as needs_improvement_percentage,
    
    -- مؤشرات النشاط
    COUNT(DISTINCT es.id) as total_sessions_count,
    ROUND(AVG(es.duration_minutes), 2) as avg_session_duration,
    
    -- معدل المشاركة الوطني
    ROUND(
        COUNT(DISTINCT es.student_id)::DECIMAL / COUNT(DISTINCT sp.id) * 100, 
        2
    ) as national_participation_rate,
    
    -- مؤشر التحسن
    ROUND(AVG(ar.improvement_score), 2) as avg_improvement_rate

FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
LEFT JOIN haraka_exercise_sessions es ON sp.id = es.student_id
LEFT JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name
WHERE 
    ar.created_at >= CURRENT_DATE - INTERVAL '24 months'
    AND sp.created_at >= '2024-01-01'
GROUP BY 
    DATE_TRUNC('month', ar.created_at),
    DATE_TRUNC('quarter', ar.created_at)
HAVING 
    -- حماية الخصوصية: حد أدنى 50 طالب
    COUNT(DISTINCT sp.id) >= 50
ORDER BY period_month DESC;

-- View اتجاهات الأداء الوطنية للوزارة
CREATE OR REPLACE VIEW ministry_national_trends AS
SELECT 
    DATE_TRUNC('month', ar.created_at) as trend_month,
    
    -- مؤشرات الاتجاه الشهرية
    COUNT(ar.id) as monthly_reports_count,
    ROUND(AVG(ar.overall_score), 2) as monthly_avg_score,
    
    -- مقارنة مع الشهر السابق
    LAG(ROUND(AVG(ar.overall_score), 2)) OVER (ORDER BY DATE_TRUNC('month', ar.created_at)) as prev_month_score,
    
    -- معدل التغيير الشهري
    ROUND(
        (AVG(ar.overall_score) - LAG(AVG(ar.overall_score)) OVER (ORDER BY DATE_TRUNC('month', ar.created_at))) 
        / NULLIF(LAG(AVG(ar.overall_score)) OVER (ORDER BY DATE_TRUNC('month', ar.created_at)), 0) * 100,
        2
    ) as monthly_change_rate,
    
    -- توزيع أنواع التمارين (نسب مئوية)
    ROUND(
        COUNT(CASE WHEN es.exercise_type = 'balance' THEN 1 END)::DECIMAL / COUNT(es.id) * 100,
        2
    ) as balance_exercises_percentage,
    ROUND(
        COUNT(CASE WHEN es.exercise_type = 'coordination' THEN 1 END)::DECIMAL / COUNT(es.id) * 100,
        2
    ) as coordination_exercises_percentage,
    ROUND(
        COUNT(CASE WHEN es.exercise_type = 'strength' THEN 1 END)::DECIMAL / COUNT(es.id) * 100,
        2
    ) as strength_exercises_percentage,
    ROUND(
        COUNT(CASE WHEN es.exercise_type = 'flexibility' THEN 1 END)::DECIMAL / COUNT(es.id) * 100,
        2
    ) as flexibility_exercises_percentage

FROM haraka_analysis_reports ar
LEFT JOIN haraka_exercise_sessions es ON ar.student_id = es.student_id 
    AND DATE_TRUNC('month', ar.created_at) = DATE_TRUNC('month', es.created_at)
WHERE 
    ar.created_at >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY 
    DATE_TRUNC('month', ar.created_at)
HAVING 
    -- حماية الخصوصية: حد أدنى 30 تقرير
    COUNT(ar.id) >= 30
ORDER BY trend_month DESC;

-- ===== Views للمديريات (مجهولة حسب المنطقة) =====

-- View إحصائيات المناطق التعليمية للمديريات
CREATE OR REPLACE VIEW directorate_regional_stats AS
SELECT 
    -- معرف المنطقة (مجهول)
    COALESCE(
        (SELECT raw_user_meta_data->>'region_id' 
         FROM auth.users u 
         JOIN haraka_teacher_profiles tp ON u.id = tp.user_id
         WHERE tp.class_name = sp.class_name 
         LIMIT 1), 
        'منطقة_غير_محددة'
    ) as region_code,
    
    -- الفترة الزمنية
    DATE_TRUNC('month', ar.created_at) as reporting_month,
    
    -- إحصائيات المنطقة المجمعة
    COUNT(DISTINCT sp.id) as region_students_count,
    COUNT(DISTINCT sp.class_name) as region_classes_count,
    COUNT(DISTINCT tp.school_name) as region_schools_count,
    COUNT(DISTINCT tp.user_id) as region_teachers_count,
    
    -- مؤشرات الأداء الإقليمية
    ROUND(AVG(ar.overall_score), 2) as region_avg_performance,
    ROUND(STDDEV(ar.overall_score), 2) as region_performance_variance,
    
    -- ترتيب المنطقة (مقارنة وطنية)
    RANK() OVER (
        PARTITION BY DATE_TRUNC('month', ar.created_at) 
        ORDER BY AVG(ar.overall_score) DESC
    ) as national_performance_rank,
    
    -- معدل النشاط الإقليمي
    COUNT(DISTINCT es.id) as region_total_sessions,
    ROUND(
        COUNT(DISTINCT es.id)::DECIMAL / COUNT(DISTINCT sp.id), 
        2
    ) as region_sessions_per_student,
    
    -- توزيع الأعمار (مجمع ومجهول)
    ROUND(
        AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, sp.date_of_birth))), 
        1
    ) as region_avg_age,
    
    -- فئات عمرية (عدد فقط، بدون تفاصيل شخصية)
    COUNT(CASE 
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, sp.date_of_birth)) BETWEEN 6 AND 10 
        THEN 1 
    END) as age_group_6_10_count,
    COUNT(CASE 
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, sp.date_of_birth)) BETWEEN 11 AND 15 
        THEN 1 
    END) as age_group_11_15_count,
    COUNT(CASE 
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, sp.date_of_birth)) BETWEEN 16 AND 18 
        THEN 1 
    END) as age_group_16_18_count,
    
    -- معدل التحسن الإقليمي
    ROUND(AVG(ar.improvement_score), 2) as region_avg_improvement,
    
    -- مؤشر جودة التعليم (مقدر)
    ROUND(
        (AVG(ar.overall_score) * COUNT(DISTINCT es.id)::DECIMAL / COUNT(DISTINCT sp.id)) / 100,
        3
    ) as region_education_quality_index

FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
LEFT JOIN haraka_exercise_sessions es ON sp.id = es.student_id
LEFT JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name
WHERE 
    ar.created_at >= CURRENT_DATE - INTERVAL '12 months'
    AND sp.created_at >= '2024-01-01'
GROUP BY 
    region_code,
    DATE_TRUNC('month', ar.created_at)
HAVING 
    -- حماية الخصوصية: حد أدنى 25 طالب لكل منطقة
    COUNT(DISTINCT sp.id) >= 25
ORDER BY 
    region_code, 
    reporting_month DESC;

-- View مقارنة الأداء بين المناطق للمديريات
CREATE OR REPLACE VIEW directorate_regional_comparison AS
SELECT 
    -- معرف المنطقة
    region_code,
    
    -- إحصائيات المقارنة
    region_avg_performance,
    national_performance_rank,
    region_students_count,
    region_schools_count,
    
    -- مقارنة مع المتوسط الوطني
    ROUND(
        region_avg_performance - (
            SELECT AVG(region_avg_performance) 
            FROM directorate_regional_stats drs2 
            WHERE drs2.reporting_month = drs1.reporting_month
        ),
        2
    ) as performance_vs_national_avg,
    
    -- نسبة الأداء مقارنة بالمتوسط الوطني
    ROUND(
        (region_avg_performance / NULLIF(
            (SELECT AVG(region_avg_performance) 
             FROM directorate_regional_stats drs2 
             WHERE drs2.reporting_month = drs1.reporting_month), 
            0
        ) - 1) * 100,
        2
    ) as performance_percentage_vs_national,
    
    -- اتجاه التحسن (مقارنة مع الشهر السابق)
    LAG(region_avg_performance) OVER (
        PARTITION BY region_code 
        ORDER BY reporting_month
    ) as prev_month_performance,
    
    ROUND(
        region_avg_performance - LAG(region_avg_performance) OVER (
            PARTITION BY region_code 
            ORDER BY reporting_month
        ),
        2
    ) as monthly_improvement,
    
    -- تصنيف الأداء
    CASE 
        WHEN region_avg_performance >= 85 THEN 'ممتاز'
        WHEN region_avg_performance >= 75 THEN 'جيد جداً'
        WHEN region_avg_performance >= 65 THEN 'جيد'
        WHEN region_avg_performance >= 55 THEN 'مقبول'
        ELSE 'يحتاج تحسين'
    END as performance_category,
    
    reporting_month

FROM directorate_regional_stats drs1
ORDER BY 
    reporting_month DESC, 
    region_avg_performance DESC;

-- ===== View موحد للوزارة والمديريات =====

-- View لوحة تحكم موحدة للوزارة
CREATE OR REPLACE VIEW ministry_executive_dashboard AS
SELECT 
    'national_overview' as dashboard_section,
    jsonb_build_object(
        'total_students', SUM(total_students_count),
        'total_schools', SUM(total_schools_count),
        'national_avg_score', ROUND(AVG(national_avg_score), 2),
        'participation_rate', ROUND(AVG(national_participation_rate), 2),
        'improvement_rate', ROUND(AVG(avg_improvement_rate), 2),
        'last_updated', MAX(period_month)
    ) as dashboard_data,
    NOW() as generated_at
FROM ministry_national_performance
WHERE period_month >= CURRENT_DATE - INTERVAL '3 months'

UNION ALL

SELECT 
    'performance_trends' as dashboard_section,
    jsonb_agg(
        jsonb_build_object(
            'month', trend_month,
            'avg_score', monthly_avg_score,
            'change_rate', monthly_change_rate,
            'reports_count', monthly_reports_count
        ) ORDER BY trend_month DESC
    ) as dashboard_data,
    NOW() as generated_at
FROM (
    SELECT * FROM ministry_national_trends 
    LIMIT 12
) recent_trends

UNION ALL

SELECT 
    'regional_summary' as dashboard_section,
    jsonb_agg(
        jsonb_build_object(
            'region_code', region_code,
            'avg_performance', region_avg_performance,
            'national_rank', national_performance_rank,
            'students_count', region_students_count,
            'schools_count', region_schools_count
        ) ORDER BY national_performance_rank
    ) as dashboard_data,
    NOW() as generated_at
FROM (
    SELECT DISTINCT ON (region_code) 
        region_code,
        region_avg_performance,
        national_performance_rank,
        region_students_count,
        region_schools_count
    FROM directorate_regional_stats 
    WHERE reporting_month >= CURRENT_DATE - INTERVAL '1 month'
    ORDER BY region_code, reporting_month DESC
) latest_regional_data;

-- ===== سياسات الوصول للـ Views =====

-- سياسة وصول الوزارة للـ Views الوطنية
CREATE POLICY "ministry_national_views_access" ON ministry_national_performance
    FOR SELECT USING (
        get_user_role() IN ('ministry', 'admin')
    );

CREATE POLICY "ministry_trends_access" ON ministry_national_trends
    FOR SELECT USING (
        get_user_role() IN ('ministry', 'admin')
    );

-- سياسة وصول المديريات للـ Views الإقليمية
CREATE POLICY "directorate_regional_views_access" ON directorate_regional_stats
    FOR SELECT USING (
        get_user_role() IN ('education_directorate', 'ministry', 'admin')
        AND (
            get_user_role() IN ('ministry', 'admin')
            OR region_code = (
                SELECT raw_user_meta_data->>'region_id' 
                FROM auth.users 
                WHERE id = auth.uid()
            )
        )
    );

-- ===== منح الصلاحيات =====

-- منح صلاحيات للأدوار المناسبة
GRANT SELECT ON ministry_national_performance TO authenticated;
GRANT SELECT ON ministry_national_trends TO authenticated;
GRANT SELECT ON directorate_regional_stats TO authenticated;
GRANT SELECT ON directorate_regional_comparison TO authenticated;
GRANT SELECT ON ministry_executive_dashboard TO authenticated;

-- ===== دوال مساعدة للتحقق من الوصول =====

-- دالة للتحقق من صلاحية الوصول للبيانات الوطنية
CREATE OR REPLACE FUNCTION can_access_national_data()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('ministry', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة للتحقق من صلاحية الوصول للبيانات الإقليمية
CREATE OR REPLACE FUNCTION can_access_regional_data(target_region_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_region_id TEXT;
BEGIN
    -- الأدمن والوزارة يمكنهم الوصول لجميع المناطق
    IF get_user_role() IN ('admin', 'ministry') THEN
        RETURN true;
    END IF;
    
    -- مديرية التربية يمكنها الوصول لمنطقتها فقط
    IF get_user_role() = 'education_directorate' THEN
        SELECT raw_user_meta_data->>'region_id' 
        INTO user_region_id
        FROM auth.users 
        WHERE id = auth.uid();
        
        RETURN user_region_id = target_region_id;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== تعليقات توضيحية =====

COMMENT ON VIEW ministry_national_performance IS 'إحصائيات الأداء الوطنية للوزارة - مجهولة تماماً بدون PII';
COMMENT ON VIEW ministry_national_trends IS 'اتجاهات الأداء الوطنية للوزارة - بيانات مجمعة شهرية';
COMMENT ON VIEW directorate_regional_stats IS 'إحصائيات المناطق التعليمية للمديريات - مجهولة حسب المنطقة';
COMMENT ON VIEW directorate_regional_comparison IS 'مقارنة أداء المناطق التعليمية - بيانات مجمعة للمديريات';
COMMENT ON VIEW ministry_executive_dashboard IS 'لوحة تحكم تنفيذية موحدة للوزارة';

COMMENT ON FUNCTION can_access_national_data() IS 'دالة للتحقق من صلاحية الوصول للبيانات الوطنية';
COMMENT ON FUNCTION can_access_regional_data(TEXT) IS 'دالة للتحقق من صلاحية الوصول للبيانات الإقليمية';

-- ===== إنشاء فهارس للأداء =====

-- فهارس للـ Views (على الجداول الأساسية)
CREATE INDEX IF NOT EXISTS idx_analysis_reports_created_month 
ON haraka_analysis_reports (DATE_TRUNC('month', created_at));

CREATE INDEX IF NOT EXISTS idx_exercise_sessions_created_month 
ON haraka_exercise_sessions (DATE_TRUNC('month', created_at));

CREATE INDEX IF NOT EXISTS idx_student_profiles_birth_year 
ON haraka_student_profiles (EXTRACT(YEAR FROM date_of_birth));

-- إشعار اكتمال التنفيذ
DO $$
BEGIN
    RAISE NOTICE '🎯 تم إنشاء Views مجهولة محسّنة للوزارة والمديريات';
    RAISE NOTICE '📊 تم إنشاء % view للوزارة', 3;
    RAISE NOTICE '🏛️ تم إنشاء % view للمديريات', 2;
    RAISE NOTICE '🔒 جميع البيانات الشخصية (PII) محذوفة من الـ Views';
    RAISE NOTICE '📈 تم تطبيق حد أدنى للمجموعات لحماية الخصوصية';
    RAISE NOTICE '✅ تم إنشاء سياسات الوصول المتدرجة';
END $$;