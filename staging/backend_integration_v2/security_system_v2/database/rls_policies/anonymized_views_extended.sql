/**
 * Views مجهولة موسعة للوزارة والمديريات - منصة حركة
 * Extended Anonymized Views for Ministry and Directorates - Haraka Platform
 * 
 * Views إضافية مجمعة ومجهولة بدون بيانات شخصية (PII)
 */

-- ===== Views للوزارة - إحصائيات وطنية =====

-- View الإحصائيات الوطنية الشاملة
CREATE OR REPLACE VIEW ministry_national_overview AS
SELECT 
    'national_statistics' as metric_category,
    
    -- إحصائيات الطلاب
    COUNT(DISTINCT sp.id) as total_students_nationwide,
    COUNT(DISTINCT sp.class_name) as total_classes_nationwide,
    COUNT(DISTINCT tp.user_id) as total_teachers_nationwide,
    
    -- توزيع الأعمار (مجمع)
    ROUND(AVG(EXTRACT(YEAR FROM AGE(sp.date_of_birth))), 1) as national_avg_age,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 6 AND 12 THEN 1 END) as elementary_age_count,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 13 AND 15 THEN 1 END) as middle_age_count,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 16 AND 18 THEN 1 END) as high_age_count,
    
    -- مؤشرات الأداء الوطنية
    ROUND(AVG(ar.overall_score), 2) as national_avg_performance,
    ROUND(STDDEV(ar.overall_score), 2) as national_performance_stddev,
    
    -- توزيع مستويات الأداء
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
    COUNT(DISTINCT es.id) as total_sessions_nationwide,
    ROUND(AVG(es.duration_minutes), 1) as avg_session_duration_nationwide,
    
    -- معدل المشاركة الوطني
    ROUND(
        COUNT(DISTINCT es.student_id)::DECIMAL / COUNT(DISTINCT sp.id) * 100, 
        2
    ) as national_participation_rate,
    
    -- تاريخ آخر تحديث
    MAX(ar.created_at) as last_updated

FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
LEFT JOIN haraka_exercise_sessions es ON sp.id = es.student_id
LEFT JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name
WHERE 
    sp.created_at >= '2024-01-01'
    AND ar.created_at >= CURRENT_DATE - INTERVAL '12 months'
HAVING 
    COUNT(DISTINCT sp.id) >= 100; -- حد أدنى لحماية الخصوصية

-- View اتجاهات الأداء السنوية للوزارة
CREATE OR REPLACE VIEW ministry_yearly_trends AS
SELECT 
    EXTRACT(YEAR FROM ar.created_at) as year,
    EXTRACT(QUARTER FROM ar.created_at) as quarter,
    
    -- إحصائيات ربع سنوية
    COUNT(DISTINCT ar.student_id) as unique_students_assessed,
    COUNT(ar.id) as total_assessments,
    ROUND(AVG(ar.overall_score), 2) as avg_performance_score,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ar.overall_score), 2) as median_performance_score,
    
    -- مقارنة مع الربع السابق
    ROUND(
        (AVG(ar.overall_score) - LAG(AVG(ar.overall_score)) OVER (
            ORDER BY EXTRACT(YEAR FROM ar.created_at), EXTRACT(QUARTER FROM ar.created_at)
        )) / NULLIF(LAG(AVG(ar.overall_score)) OVER (
            ORDER BY EXTRACT(YEAR FROM ar.created_at), EXTRACT(QUARTER FROM ar.created_at)
        ), 0) * 100, 2
    ) as quarter_over_quarter_change,
    
    -- إحصائيات التحسن
    ROUND(AVG(ar.improvement_score), 2) as avg_improvement_score,
    COUNT(CASE WHEN ar.improvement_score > 0 THEN 1 END) as students_improved,
    COUNT(CASE WHEN ar.improvement_score <= 0 THEN 1 END) as students_declined,
    
    -- معدل النشاط
    COUNT(DISTINCT es.id) as total_sessions_quarter,
    ROUND(AVG(es.duration_minutes), 1) as avg_session_duration,
    
    -- توزيع أنواع التمارين
    COUNT(CASE WHEN es.exercise_type = 'balance' THEN 1 END) as balance_sessions,
    COUNT(CASE WHEN es.exercise_type = 'coordination' THEN 1 END) as coordination_sessions,
    COUNT(CASE WHEN es.exercise_type = 'strength' THEN 1 END) as strength_sessions,
    COUNT(CASE WHEN es.exercise_type = 'flexibility' THEN 1 END) as flexibility_sessions,
    COUNT(CASE WHEN es.exercise_type = 'endurance' THEN 1 END) as endurance_sessions

FROM haraka_analysis_reports ar
LEFT JOIN haraka_exercise_sessions es ON ar.student_id = es.student_id 
    AND DATE_TRUNC('quarter', ar.created_at) = DATE_TRUNC('quarter', es.created_at)
WHERE 
    ar.created_at >= CURRENT_DATE - INTERVAL '36 months'
GROUP BY 
    EXTRACT(YEAR FROM ar.created_at),
    EXTRACT(QUARTER FROM ar.created_at)
HAVING 
    COUNT(DISTINCT ar.student_id) >= 50
ORDER BY year DESC, quarter DESC;

-- ===== Views للمديريات - إحصائيات إقليمية =====

-- View مقارنة المناطق التعليمية المفصلة
CREATE OR REPLACE VIEW directorate_regional_detailed AS
SELECT 
    COALESCE(
        (SELECT raw_user_meta_data->>'region_id' 
         FROM auth.users u 
         JOIN haraka_teacher_profiles tp ON u.id = tp.user_id
         WHERE tp.class_name = sp.class_name 
         LIMIT 1), 
        'غير محدد'
    ) as region_id,
    
    -- إحصائيات أساسية للمنطقة
    COUNT(DISTINCT sp.id) as region_students_count,
    COUNT(DISTINCT sp.class_name) as region_classes_count,
    COUNT(DISTINCT tp.user_id) as region_teachers_count,
    COUNT(DISTINCT sp.school_name) as region_schools_count,
    
    -- مؤشرات الأداء الإقليمية
    ROUND(AVG(ar.overall_score), 2) as region_avg_performance,
    ROUND(STDDEV(ar.overall_score), 2) as region_performance_variance,
    ROUND(MIN(ar.overall_score), 2) as region_min_score,
    ROUND(MAX(ar.overall_score), 2) as region_max_score,
    
    -- توزيع الأداء في المنطقة
    COUNT(CASE WHEN ar.overall_score >= 90 THEN 1 END) as region_excellent_count,
    COUNT(CASE WHEN ar.overall_score >= 75 AND ar.overall_score < 90 THEN 1 END) as region_good_count,
    COUNT(CASE WHEN ar.overall_score >= 60 AND ar.overall_score < 75 THEN 1 END) as region_average_count,
    COUNT(CASE WHEN ar.overall_score < 60 THEN 1 END) as region_needs_improvement_count,
    
    -- نسب الأداء في المنطقة
    ROUND(
        COUNT(CASE WHEN ar.overall_score >= 90 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as region_excellent_percentage,
    ROUND(
        COUNT(CASE WHEN ar.overall_score < 60 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as region_needs_attention_percentage,
    
    -- مؤشرات النشاط الإقليمية
    COUNT(DISTINCT es.id) as region_total_sessions,
    ROUND(AVG(es.duration_minutes), 1) as region_avg_session_duration,
    ROUND(
        COUNT(DISTINCT es.student_id)::DECIMAL / COUNT(DISTINCT sp.id) * 100, 
        2
    ) as region_participation_rate,
    
    -- توزيع الأعمار في المنطقة
    ROUND(AVG(EXTRACT(YEAR FROM AGE(sp.date_of_birth))), 1) as region_avg_age,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 6 AND 10 THEN 1 END) as region_age_6_10,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 11 AND 15 THEN 1 END) as region_age_11_15,
    COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(sp.date_of_birth)) BETWEEN 16 AND 18 THEN 1 END) as region_age_16_18,
    
    -- مؤشرات التحسن الإقليمية
    ROUND(AVG(ar.improvement_score), 2) as region_avg_improvement,
    COUNT(CASE WHEN ar.improvement_score > 0 THEN 1 END) as region_improved_students,
    ROUND(
        COUNT(CASE WHEN ar.improvement_score > 0 THEN 1 END)::DECIMAL / COUNT(ar.id) * 100, 
        2
    ) as region_improvement_rate,
    
    -- ترتيب المنطقة وطنياً
    RANK() OVER (ORDER BY AVG(ar.overall_score) DESC) as national_performance_rank,
    RANK() OVER (ORDER BY AVG(ar.improvement_score) DESC) as national_improvement_rank,
    
    -- مؤشرات زمنية
    DATE_TRUNC('month', MAX(ar.created_at)) as last_assessment_month,
    COUNT(CASE WHEN ar.created_at >= CURRENT_DATE - INTERVAL '3 months' THEN 1 END) as recent_assessments_count

FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
LEFT JOIN haraka_exercise_sessions es ON sp.id = es.student_id
LEFT JOIN haraka_teacher_profiles tp ON sp.class_name = tp.class_name
WHERE 
    sp.created_at >= '2024-01-01'
    AND ar.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY region_id
HAVING 
    COUNT(DISTINCT sp.id) >= 15  -- حد أدنى لحماية الخصوصية
ORDER BY region_avg_performance DESC;

-- View اتجاهات المناطق الشهرية
CREATE OR REPLACE VIEW directorate_monthly_trends AS
SELECT 
    COALESCE(
        (SELECT raw_user_meta_data->>'region_id' 
         FROM auth.users u 
         JOIN haraka_teacher_profiles tp ON u.id = tp.user_id
         WHERE tp.class_name = sp.class_name 
         LIMIT 1), 
        'غير محدد'
    ) as region_id,
    DATE_TRUNC('month', ar.created_at) as assessment_month,
    
    -- إحصائيات شهرية للمنطقة
    COUNT(DISTINCT ar.student_id) as monthly_students_assessed,
    COUNT(ar.id) as monthly_total_assessments,
    ROUND(AVG(ar.overall_score), 2) as monthly_avg_score,
    ROUND(STDDEV(ar.overall_score), 2) as monthly_score_stddev,
    
    -- مقارنة مع الشهر السابق
    ROUND(
        (AVG(ar.overall_score) - LAG(AVG(ar.overall_score)) OVER (
            PARTITION BY region_id ORDER BY DATE_TRUNC('month', ar.created_at)
        )) / NULLIF(LAG(AVG(ar.overall_score)) OVER (
            PARTITION BY region_id ORDER BY DATE_TRUNC('month', ar.created_at)
        ), 0) * 100, 2
    ) as month_over_month_change,
    
    -- إحصائيات النشاط الشهرية
    COUNT(DISTINCT es.id) as monthly_sessions,
    ROUND(AVG(es.duration_minutes), 1) as monthly_avg_duration,
    COUNT(DISTINCT es.student_id) as monthly_active_students,
    
    -- توزيع مستويات الأداء الشهرية
    COUNT(CASE WHEN ar.overall_score >= 85 THEN 1 END) as monthly_high_performers,
    COUNT(CASE WHEN ar.overall_score < 60 THEN 1 END) as monthly_low_performers,
    
    -- معدلات التحسن الشهرية
    ROUND(AVG(ar.improvement_score), 2) as monthly_avg_improvement,
    COUNT(CASE WHEN ar.improvement_score > 5 THEN 1 END) as monthly_significant_improvements

FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
LEFT JOIN haraka_exercise_sessions es ON sp.id = es.student_id 
    AND DATE_TRUNC('month', ar.created_at) = DATE_TRUNC('month', es.created_at)
WHERE 
    ar.created_at >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY 
    region_id, 
    DATE_TRUNC('month', ar.created_at)
HAVING 
    COUNT(DISTINCT ar.student_id) >= 10
ORDER BY region_id, assessment_month DESC;

-- ===== Views مقارنة الأداء بين المناطق =====

-- View مقارنة الأداء بين المناطق
CREATE OR REPLACE VIEW ministry_regional_benchmarking AS
SELECT 
    region_stats.region_id,
    region_stats.region_avg_performance,
    region_stats.region_students_count,
    region_stats.region_participation_rate,
    
    -- مقارنة مع المتوسط الوطني
    ROUND(
        region_stats.region_avg_performance - national_stats.national_avg_performance, 
        2
    ) as performance_vs_national_avg,
    
    -- تصنيف الأداء
    CASE 
        WHEN region_stats.region_avg_performance >= national_stats.national_avg_performance + 10 THEN 'متفوق'
        WHEN region_stats.region_avg_performance >= national_stats.national_avg_performance + 5 THEN 'جيد جداً'
        WHEN region_stats.region_avg_performance >= national_stats.national_avg_performance - 5 THEN 'جيد'
        WHEN region_stats.region_avg_performance >= national_stats.national_avg_performance - 10 THEN 'يحتاج تحسين'
        ELSE 'يحتاج تدخل'
    END as performance_category,
    
    -- مؤشرات التحسن
    region_stats.region_improvement_rate,
    
    -- مقارنة معدل المشاركة
    ROUND(
        region_stats.region_participation_rate - national_stats.national_participation_rate, 
        2
    ) as participation_vs_national_avg,
    
    -- ترتيب المنطقة
    region_stats.national_performance_rank,
    
    -- مؤشرات الجودة
    CASE 
        WHEN region_stats.region_excellent_percentage >= 30 THEN 'عالي الجودة'
        WHEN region_stats.region_excellent_percentage >= 20 THEN 'جودة جيدة'
        WHEN region_stats.region_excellent_percentage >= 10 THEN 'جودة متوسطة'
        ELSE 'يحتاج تطوير'
    END as quality_indicator

FROM directorate_regional_detailed region_stats
CROSS JOIN ministry_national_overview national_stats
WHERE region_stats.region_students_count >= 20
ORDER BY region_stats.region_avg_performance DESC;

-- ===== Views إحصائيات التمارين المتقدمة =====

-- View تحليل فعالية التمارين
CREATE OR REPLACE VIEW ministry_exercise_effectiveness AS
SELECT 
    es.exercise_type,
    es.difficulty_level,
    
    -- إحصائيات عامة
    COUNT(DISTINCT es.student_id) as unique_participants,
    COUNT(es.id) as total_sessions,
    ROUND(AVG(es.duration_minutes), 1) as avg_duration,
    
    -- مؤشرات الإكمال
    COUNT(CASE WHEN es.completion_status = 'completed' THEN 1 END) as completed_sessions,
    ROUND(
        COUNT(CASE WHEN es.completion_status = 'completed' THEN 1 END)::DECIMAL / COUNT(es.id) * 100, 
        2
    ) as completion_rate,
    
    -- تأثير على الأداء
    ROUND(AVG(ar.overall_score), 2) as avg_performance_after_exercise,
    ROUND(AVG(ar.improvement_score), 2) as avg_improvement_after_exercise,
    
    -- مقارنة الأداء حسب مستوى الصعوبة
    COUNT(CASE WHEN ar.overall_score >= 85 AND es.difficulty_level = 'advanced' THEN 1 END) as advanced_high_performers,
    COUNT(CASE WHEN ar.overall_score >= 85 AND es.difficulty_level = 'beginner' THEN 1 END) as beginner_high_performers,
    
    -- اتجاهات زمنية
    COUNT(CASE WHEN es.created_at >= CURRENT_DATE - INTERVAL '3 months' THEN 1 END) as recent_sessions,
    
    -- مؤشر الشعبية والفعالية
    ROUND(
        (COUNT(es.id)::DECIMAL / 
         (SELECT COUNT(*) FROM haraka_exercise_sessions WHERE created_at >= CURRENT_DATE - INTERVAL '12 months')) * 
        (AVG(ar.improvement_score) / 10) * 100, 
        2
    ) as effectiveness_score

FROM haraka_exercise_sessions es
LEFT JOIN haraka_analysis_reports ar ON es.student_id = ar.student_id 
    AND ar.created_at BETWEEN es.created_at AND es.created_at + INTERVAL '7 days'
WHERE 
    es.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY es.exercise_type, es.difficulty_level
HAVING 
    COUNT(DISTINCT es.student_id) >= 20
ORDER BY effectiveness_score DESC;

-- ===== سياسات الوصول للـ Views الجديدة =====

-- منح صلاحيات الوصول للوزارة والمديريات
GRANT SELECT ON ministry_national_overview TO authenticated;
GRANT SELECT ON ministry_yearly_trends TO authenticated;
GRANT SELECT ON directorate_regional_detailed TO authenticated;
GRANT SELECT ON directorate_monthly_trends TO authenticated;
GRANT SELECT ON ministry_regional_benchmarking TO authenticated;
GRANT SELECT ON ministry_exercise_effectiveness TO authenticated;

-- دالة للتحقق من صلاحية الوصول للإحصائيات الإقليمية
CREATE OR REPLACE FUNCTION can_access_regional_stats(target_region_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('ministry', 'admin') OR 
           (get_user_role() = 'education_directorate' AND is_in_user_region(target_region_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== View موحد للمديريات =====

CREATE OR REPLACE VIEW directorate_dashboard AS
SELECT 
    'regional_overview' as metric_type,
    region_id,
    jsonb_build_object(
        'students_count', region_students_count,
        'avg_performance', region_avg_performance,
        'performance_rank', national_performance_rank,
        'participation_rate', region_participation_rate,
        'improvement_rate', region_improvement_rate,
        'last_updated', last_assessment_month
    ) as data
FROM directorate_regional_detailed
WHERE can_access_regional_stats(region_id)

UNION ALL

SELECT 
    'monthly_trends' as metric_type,
    region_id,
    jsonb_agg(
        jsonb_build_object(
            'month', assessment_month,
            'avg_score', monthly_avg_score,
            'change', month_over_month_change,
            'sessions', monthly_sessions,
            'active_students', monthly_active_students
        ) ORDER BY assessment_month DESC
    ) as data
FROM (
    SELECT * FROM directorate_monthly_trends 
    WHERE can_access_regional_stats(region_id)
    ORDER BY assessment_month DESC 
    LIMIT 12
) recent_monthly_data
GROUP BY region_id;

-- ===== تعليقات توضيحية =====

COMMENT ON VIEW ministry_national_overview IS 'نظرة عامة وطنية شاملة للوزارة - مجهولة ومجمعة';
COMMENT ON VIEW ministry_yearly_trends IS 'اتجاهات الأداء السنوية والربع سنوية للوزارة';
COMMENT ON VIEW directorate_regional_detailed IS 'إحصائيات إقليمية مفصلة للمديريات';
COMMENT ON VIEW directorate_monthly_trends IS 'اتجاهات شهرية للمناطق التعليمية';
COMMENT ON VIEW ministry_regional_benchmarking IS 'مقارنة أداء المناطق مع المعايير الوطنية';
COMMENT ON VIEW ministry_exercise_effectiveness IS 'تحليل فعالية أنواع التمارين المختلفة';
COMMENT ON VIEW directorate_dashboard IS 'لوحة تحكم موحدة للمديريات التعليمية';

-- إشعار اكتمال التنفيذ
DO $$
BEGIN
    RAISE NOTICE 'تم إنشاء % view مجهول إضافي للوزارة والمديريات', 7;
    RAISE NOTICE 'تم إضافة مقارنات وطنية وإقليمية متقدمة';
    RAISE NOTICE 'تم تطبيق حدود حماية الخصوصية على جميع الـ Views';
    RAISE NOTICE 'تم إنشاء لوحات تحكم موحدة للوزارة والمديريات';
END $$;