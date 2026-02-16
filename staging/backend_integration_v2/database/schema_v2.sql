-- ===============================================
-- مخطط قاعدة البيانات - المرحلة الثالثة (v2)
-- منصة حركة - تحليل الأداء الحركي للطلاب
-- ===============================================

-- جدول تحليلات الحركة المحدث (v2)
CREATE TABLE IF NOT EXISTS analysis_reports_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    school_id UUID,
    class_name VARCHAR(100),
    
    -- مقاييس الأداء الحركي
    balance_score DECIMAL(5,2) NOT NULL CHECK (balance_score >= 0 AND balance_score <= 100),
    speed_score DECIMAL(5,2) NOT NULL CHECK (speed_score >= 0 AND speed_score <= 100),
    accuracy_score DECIMAL(5,2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
    overall_score DECIMAL(5,2) GENERATED ALWAYS AS ((balance_score + speed_score + accuracy_score) / 3) STORED,
    
    -- بيانات التحليل التفصيلي
    movement_data JSONB,
    analysis_duration INTEGER, -- بالثواني
    exercises_completed INTEGER DEFAULT 0,
    
    -- تصنيف مستوى الأداء
    performance_level VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN ((balance_score + speed_score + accuracy_score) / 3) >= 85 THEN 'ممتاز'
            WHEN ((balance_score + speed_score + accuracy_score) / 3) >= 70 THEN 'جيد'
            WHEN ((balance_score + speed_score + accuracy_score) / 3) >= 60 THEN 'مقبول'
            ELSE 'يحتاج تحسين'
        END
    ) STORED,
    
    -- معلومات النظام
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_version VARCHAR(10) DEFAULT 'v2.0'
);

-- جدول ملفات الطلاب المطور (v2)
CREATE TABLE IF NOT EXISTS student_profiles_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name VARCHAR(200) NOT NULL,
    student_code VARCHAR(50) UNIQUE,
    school_id UUID,
    class_name VARCHAR(100),
    grade_level INTEGER,
    
    -- معلومات شخصية
    birth_date DATE,
    gender VARCHAR(10),
    
    -- إحصائيات الأداء
    total_sessions INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    best_score DECIMAL(5,2),
    improvement_rate DECIMAL(5,2),
    
    -- حالة المتابعة
    needs_attention BOOLEAN GENERATED ALWAYS AS (average_score < 60) STORED,
    last_analysis_date TIMESTAMP WITH TIME ZONE,
    
    -- معلومات النظام
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- جدول إحصائيات المدرسة الجديد (v2)
CREATE TABLE IF NOT EXISTS school_analytics_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL,
    school_name VARCHAR(200),
    
    -- إحصائيات عامة
    total_students INTEGER DEFAULT 0,
    total_analyses INTEGER DEFAULT 0,
    average_performance DECIMAL(5,2),
    
    -- توزيع مستويات الأداء
    excellent_count INTEGER DEFAULT 0, -- 85+ نقطة
    good_count INTEGER DEFAULT 0,      -- 70-84 نقطة
    acceptable_count INTEGER DEFAULT 0, -- 60-69 نقطة
    needs_improvement_count INTEGER DEFAULT 0, -- أقل من 60
    
    -- معدلات التحسن
    monthly_improvement DECIMAL(5,2),
    weekly_improvement DECIMAL(5,2),
    
    -- فترة التقرير
    report_period_start DATE,
    report_period_end DATE,
    
    -- معلومات النظام
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإشعارات المحسن (v2)
CREATE TABLE IF NOT EXISTS notifications_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- معلومات المستلم
    recipient_type VARCHAR(50) NOT NULL, -- 'principal', 'teacher', 'parent'
    recipient_id UUID,
    school_id UUID,
    
    -- محتوى الإشعار
    notification_type VARCHAR(50) NOT NULL, -- 'low_performance', 'new_analysis', 'monthly_report'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- بيانات مرتبطة
    related_student_id UUID,
    related_analysis_id UUID,
    
    -- حالة الإشعار
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    priority_level INTEGER DEFAULT 1, -- 1=منخفض, 2=متوسط, 3=عالي
    
    -- معلومات النظام
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- ===============================================
-- الفهارس لتحسين الأداء
-- ===============================================

-- فهارس جدول التحليلات
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_student_id ON analysis_reports_v2(student_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_school_id ON analysis_reports_v2(school_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_session_id ON analysis_reports_v2(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_created_at ON analysis_reports_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_overall_score ON analysis_reports_v2(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_v2_performance_level ON analysis_reports_v2(performance_level);

-- فهارس جدول ملفات الطلاب
CREATE INDEX IF NOT EXISTS idx_student_profiles_v2_school_id ON student_profiles_v2(school_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_v2_class_name ON student_profiles_v2(class_name);
CREATE INDEX IF NOT EXISTS idx_student_profiles_v2_needs_attention ON student_profiles_v2(needs_attention);
CREATE INDEX IF NOT EXISTS idx_student_profiles_v2_student_code ON student_profiles_v2(student_code);

-- فهارس جدول إحصائيات المدرسة
CREATE INDEX IF NOT EXISTS idx_school_analytics_v2_school_id ON school_analytics_v2(school_id);
CREATE INDEX IF NOT EXISTS idx_school_analytics_v2_report_period ON school_analytics_v2(report_period_start, report_period_end);

-- فهارس جدول الإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_v2_recipient ON notifications_v2(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_v2_school_id ON notifications_v2(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_v2_is_read ON notifications_v2(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_v2_created_at ON notifications_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_v2_priority ON notifications_v2(priority_level DESC);

-- ===============================================
-- سياسات الأمان (RLS)
-- ===============================================

-- تفعيل RLS على جميع الجداول
ALTER TABLE analysis_reports_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_analytics_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_v2 ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة للتحليلات
CREATE POLICY "allow_read_analysis_reports_v2" ON analysis_reports_v2 
    FOR SELECT USING (true);

-- سياسات الإدراج للمستخدمين المصرح لهم
CREATE POLICY "allow_insert_analysis_reports_v2" ON analysis_reports_v2 
    FOR INSERT TO authenticated 
    WITH CHECK (true);

-- سياسات القراءة للملفات الشخصية
CREATE POLICY "allow_read_student_profiles_v2" ON student_profiles_v2 
    FOR SELECT USING (true);

-- سياسات القراءة لإحصائيات المدرسة
CREATE POLICY "allow_read_school_analytics_v2" ON school_analytics_v2 
    FOR SELECT USING (true);

-- سياسات الإشعارات
CREATE POLICY "allow_read_own_notifications_v2" ON notifications_v2 
    FOR SELECT USING (true);

-- ===============================================
-- الدوال المساعدة
-- ===============================================

-- دالة حساب إحصائيات المدرسة
CREATE OR REPLACE FUNCTION calculate_school_analytics_v2(p_school_id UUID, p_start_date DATE DEFAULT NULL, p_end_date DATE DEFAULT NULL)
RETURNS TABLE (
    total_students_count INTEGER,
    total_analyses_count INTEGER,
    avg_performance DECIMAL(5,2),
    excellent_students INTEGER,
    good_students INTEGER,
    acceptable_students INTEGER,
    needs_improvement_students INTEGER,
    monthly_change DECIMAL(5,2)
) 
LANGUAGE plpgsql AS $$
DECLARE
    start_period DATE := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
    end_period DATE := COALESCE(p_end_date, CURRENT_DATE);
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT ar.student_id)::INTEGER as total_students_count,
        COUNT(ar.id)::INTEGER as total_analyses_count,
        ROUND(AVG(ar.overall_score), 2) as avg_performance,
        COUNT(CASE WHEN ar.overall_score >= 85 THEN 1 END)::INTEGER as excellent_students,
        COUNT(CASE WHEN ar.overall_score >= 70 AND ar.overall_score < 85 THEN 1 END)::INTEGER as good_students,
        COUNT(CASE WHEN ar.overall_score >= 60 AND ar.overall_score < 70 THEN 1 END)::INTEGER as acceptable_students,
        COUNT(CASE WHEN ar.overall_score < 60 THEN 1 END)::INTEGER as needs_improvement_students,
        0.0::DECIMAL(5,2) as monthly_change -- سيتم حسابها لاحقاً
    FROM analysis_reports_v2 ar
    WHERE ar.school_id = p_school_id
    AND ar.created_at >= start_period
    AND ar.created_at <= end_period;
END;
$$;

-- دالة إنشاء إشعار تلقائي
CREATE OR REPLACE FUNCTION create_notification_v2(
    p_recipient_type VARCHAR(50),
    p_recipient_id UUID,
    p_school_id UUID,
    p_notification_type VARCHAR(50),
    p_title VARCHAR(200),
    p_message TEXT,
    p_related_student_id UUID DEFAULT NULL,
    p_related_analysis_id UUID DEFAULT NULL,
    p_priority_level INTEGER DEFAULT 1
)
RETURNS UUID
LANGUAGE plpgsql AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications_v2 (
        recipient_type, recipient_id, school_id, notification_type,
        title, message, related_student_id, related_analysis_id, priority_level
    ) VALUES (
        p_recipient_type, p_recipient_id, p_school_id, p_notification_type,
        p_title, p_message, p_related_student_id, p_related_analysis_id, p_priority_level
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- ===============================================
-- المشغلات (Triggers)
-- ===============================================

-- مشغل تحديث timestamp عند التعديل
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق المشغل على الجداول
CREATE TRIGGER update_analysis_reports_v2_updated_at 
    BEFORE UPDATE ON analysis_reports_v2 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_v2_updated_at 
    BEFORE UPDATE ON student_profiles_v2 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_analytics_v2_updated_at 
    BEFORE UPDATE ON school_analytics_v2 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- مشغل إنشاء إشعار عند انخفاض الأداء
CREATE OR REPLACE FUNCTION notify_low_performance_v2()
RETURNS TRIGGER AS $$
BEGIN
    -- إذا كانت النتيجة الإجمالية أقل من 60
    IF NEW.overall_score < 60 THEN
        PERFORM create_notification_v2(
            'principal',
            NULL, -- سيتم تحديده من معلومات المدرسة
            NEW.school_id,
            'low_performance',
            'تنبيه: أداء طالب منخفض',
            'طالب يحتاج إلى متابعة إضافية - النتيجة: ' || NEW.overall_score || '%',
            NEW.student_id,
            NEW.id,
            2 -- أولوية متوسطة
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_low_performance_analysis_v2
    AFTER INSERT ON analysis_reports_v2
    FOR EACH ROW EXECUTE FUNCTION notify_low_performance_v2();

-- ===============================================
-- بيانات تجريبية للاختبار
-- ===============================================

-- إدراج بيانات مدرسة تجريبية
INSERT INTO school_analytics_v2 (school_id, school_name, total_students, report_period_start, report_period_end)
VALUES (
    gen_random_uuid(),
    'مدرسة الأمل الابتدائية',
    456,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE
) ON CONFLICT DO NOTHING;

-- إدراج ملفات طلاب تجريبية
DO $$
DECLARE
    school_uuid UUID;
    student_uuid UUID;
    i INTEGER;
    classes TEXT[] := ARRAY['الصف الثالث أ', 'الصف الرابع أ', 'الصف الرابع ب', 'الصف الخامس أ', 'الصف الخامس ب'];
    student_names TEXT[] := ARRAY['أحمد محمد', 'فاطمة علي', 'محمد أحمد', 'عائشة حسن', 'عبدالله سالم', 'مريم خالد'];
BEGIN
    -- الحصول على معرف المدرسة
    SELECT school_id INTO school_uuid FROM school_analytics_v2 LIMIT 1;
    
    -- إنشاء 50 طالب تجريبي
    FOR i IN 1..50 LOOP
        INSERT INTO student_profiles_v2 (
            student_name, 
            student_code, 
            school_id, 
            class_name, 
            grade_level,
            birth_date,
            gender,
            total_sessions,
            average_score,
            best_score
        ) VALUES (
            student_names[((i-1) % array_length(student_names, 1)) + 1] || ' ' || i,
            'STD' || LPAD(i::TEXT, 4, '0'),
            school_uuid,
            classes[((i-1) % array_length(classes, 1)) + 1],
            3 + ((i-1) % 3),
            CURRENT_DATE - INTERVAL '8 years' - (RANDOM() * INTERVAL '2 years'),
            CASE WHEN i % 2 = 0 THEN 'ذكر' ELSE 'أنثى' END,
            (RANDOM() * 10 + 5)::INTEGER,
            (RANDOM() * 40 + 50)::DECIMAL(5,2),
            (RANDOM() * 30 + 70)::DECIMAL(5,2)
        );
    END LOOP;
END $$;

-- إدراج تحليلات تجريبية
DO $$
DECLARE
    student_record RECORD;
    analysis_count INTEGER;
    j INTEGER;
BEGIN
    -- لكل طالب، إنشاء عدة تحليلات
    FOR student_record IN SELECT id, school_id, class_name FROM student_profiles_v2 LOOP
        analysis_count := (RANDOM() * 5 + 3)::INTEGER; -- 3-8 تحليلات لكل طالب
        
        FOR j IN 1..analysis_count LOOP
            INSERT INTO analysis_reports_v2 (
                student_id,
                session_id,
                school_id,
                class_name,
                balance_score,
                speed_score,
                accuracy_score,
                movement_data,
                analysis_duration,
                exercises_completed,
                created_at
            ) VALUES (
                student_record.id,
                'session_' || student_record.id || '_' || j,
                student_record.school_id,
                student_record.class_name,
                (RANDOM() * 40 + 50)::DECIMAL(5,2), -- 50-90
                (RANDOM() * 40 + 50)::DECIMAL(5,2), -- 50-90
                (RANDOM() * 40 + 50)::DECIMAL(5,2), -- 50-90
                '{"exercises": ["balance_test", "speed_test", "coordination_test"], "duration_per_exercise": [120, 90, 150]}'::JSONB,
                (RANDOM() * 300 + 180)::INTEGER, -- 3-8 دقائق
                (RANDOM() * 5 + 3)::INTEGER, -- 3-8 تمارين
                NOW() - (RANDOM() * INTERVAL '30 days') -- خلال آخر 30 يوم
            );
        END LOOP;
    END LOOP;
END $$;

-- تحديث إحصائيات الطلاب بناءً على التحليلات
UPDATE student_profiles_v2 
SET 
    total_sessions = (
        SELECT COUNT(*) FROM analysis_reports_v2 
        WHERE student_id = student_profiles_v2.id
    ),
    average_score = (
        SELECT ROUND(AVG(overall_score), 2) FROM analysis_reports_v2 
        WHERE student_id = student_profiles_v2.id
    ),
    best_score = (
        SELECT MAX(overall_score) FROM analysis_reports_v2 
        WHERE student_id = student_profiles_v2.id
    ),
    last_analysis_date = (
        SELECT MAX(created_at) FROM analysis_reports_v2 
        WHERE student_id = student_profiles_v2.id
    );

COMMENT ON TABLE analysis_reports_v2 IS 'جدول تحليلات الأداء الحركي للطلاب - الإصدار الثاني';
COMMENT ON TABLE student_profiles_v2 IS 'ملفات الطلاب مع إحصائيات الأداء - الإصدار الثاني';
COMMENT ON TABLE school_analytics_v2 IS 'إحصائيات عامة على مستوى المدرسة - الإصدار الثاني';
COMMENT ON TABLE notifications_v2 IS 'نظام الإشعارات المحسن - الإصدار الثاني';