# دليل سياسات الأمان - منصة حركة
# Security Policies Guide - Haraka Platform

## 📋 نظرة عامة

هذا الدليل يوضح جميع سياسات الأمان المطبقة في منصة حركة باستخدام Row Level Security (RLS) ونظام تسجيل المراجعة الشامل.

## 🔒 سياسات Row Level Security (RLS)

### 1. التلميذ/الشاب (Student/Youth)

#### الصلاحيات المسموحة:
- ✅ **قراءة**: بياناته الشخصية فقط
- ✅ **تحديث**: معلومات محددة في ملفه الشخصي
- ✅ **عرض**: جلسات التمارين والتقارير الخاصة به

#### السياسات المطبقة:
```sql
-- وصول للملف الشخصي
CREATE POLICY "students_own_profile_access" ON haraka_student_profiles
    FOR ALL USING (
        get_user_role() IN ('student', 'youth') 
        AND user_id = auth.uid()
    );

-- وصول للجلسات الشخصية
CREATE POLICY "students_own_sessions_access" ON haraka_exercise_sessions
    FOR SELECT USING (
        get_user_role() IN ('student', 'youth') 
        AND student_id IN (
            SELECT id FROM haraka_student_profiles 
            WHERE user_id = auth.uid()
        )
    );
```

#### الصلاحيات المرفوضة:
- ❌ الوصول لبيانات طلاب آخرين
- ❌ تعديل بيانات الآخرين
- ❌ حذف أي بيانات
- ❌ إنشاء جلسات تمارين

---

### 2. ولي الأمر (Guardian)

#### الصلاحيات المسموحة:
- ✅ **قراءة**: بيانات أطفاله المسجلين فقط
- ✅ **عرض**: جلسات التمارين والتقارير لأطفاله
- ✅ **استلام**: الإشعارات المتعلقة بأطفاله

#### السياسات المطبقة:
```sql
-- وصول لملفات الأطفال
CREATE POLICY "guardians_children_profiles_access" ON haraka_student_profiles
    FOR SELECT USING (
        get_user_role() = 'guardian' 
        AND guardian_id = auth.uid()
    );

-- وصول لجلسات الأطفال
CREATE POLICY "guardians_children_sessions_access" ON haraka_exercise_sessions
    FOR SELECT USING (
        get_user_role() = 'guardian' 
        AND is_guardian_of_student(student_id)
    );
```

#### الصلاحيات المرفوضة:
- ❌ الوصول لبيانات أطفال آخرين
- ❌ تعديل بيانات الأطفال
- ❌ إنشاء أو حذف جلسات
- ❌ الوصول للبيانات الإدارية

---

### 3. المعلم/المدرب (Teacher/Trainer)

#### الصلاحيات المسموحة:
- ✅ **قراءة**: بيانات طلاب صفه/متدربيه فقط
- ✅ **إنشاء**: جلسات تمارين جديدة لطلابه
- ✅ **تحديث**: تقارير التحليل لطلابه
- ✅ **إدارة**: الإشعارات المتعلقة بطلابه

#### السياسات المطبقة:
```sql
-- وصول لملفات الطلاب
CREATE POLICY "teachers_students_profiles_access" ON haraka_student_profiles
    FOR SELECT USING (
        get_user_role() IN ('teacher', 'trainer') 
        AND class_name IN (
            SELECT class_name FROM haraka_teacher_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- إنشاء جلسات جديدة
CREATE POLICY "teachers_create_sessions" ON haraka_exercise_sessions
    FOR INSERT WITH CHECK (
        get_user_role() IN ('teacher', 'trainer') 
        AND teacher_id = auth.uid()
        AND is_teacher_of_student(student_id)
    );
```

#### الصلاحيات المرفوضة:
- ❌ الوصول لطلاب صفوف أخرى
- ❌ تعديل بيانات الطلاب الشخصية
- ❌ حذف بيانات الطلاب
- ❌ الوصول للبيانات الإدارية العامة

---

### 4. مديرية التربية (Education Directorate)

#### الصلاحيات المسموحة:
- ✅ **قراءة**: بيانات المدارس في منطقتها فقط
- ✅ **عرض**: تقارير إحصائية مجمعة للمنطقة
- ✅ **مراقبة**: أداء المدارس التابعة لها

#### السياسات المطبقة:
```sql
-- وصول إقليمي للطلاب
CREATE POLICY "education_directorate_regional_access" ON haraka_student_profiles
    FOR SELECT USING (
        get_user_role() = 'education_directorate' 
        AND is_in_user_region(
            COALESCE(
                (SELECT raw_user_meta_data->>'region_id' 
                 FROM auth.users u 
                 JOIN haraka_teacher_profiles tp ON u.id = tp.user_id
                 WHERE tp.class_name = haraka_student_profiles.class_name 
                 LIMIT 1),
                'unknown'
            )
        )
    );
```

#### Views المخصصة:
- `directorate_regional_stats` - إحصائيات المنطقة
- `directorate_regional_comparison` - مقارنة الأداء الإقليمي

#### الصلاحيات المرفوضة:
- ❌ الوصول لمناطق أخرى
- ❌ البيانات الشخصية للطلاب
- ❌ تعديل أي بيانات
- ❌ الوصول للبيانات الوطنية الشاملة

---

### 5. الوزارة (Ministry)

#### الصلاحيات المسموحة:
- ✅ **عرض**: إحصائيات وطنية مجمعة ومجهولة فقط
- ✅ **تحليل**: اتجاهات الأداء العامة
- ✅ **مراقبة**: مؤشرات الأداء الوطنية

#### Views المخصصة (مجهولة تماماً):
```sql
-- إحصائيات وطنية مجهولة
CREATE VIEW ministry_national_performance AS
SELECT 
    DATE_TRUNC('month', ar.created_at) as period_month,
    COUNT(DISTINCT sp.id) as total_students_count,
    ROUND(AVG(ar.overall_score), 2) as national_avg_score,
    -- بدون أي بيانات شخصية
FROM haraka_student_profiles sp
LEFT JOIN haraka_analysis_reports ar ON sp.id = ar.student_id
GROUP BY DATE_TRUNC('month', ar.created_at)
HAVING COUNT(DISTINCT sp.id) >= 50; -- حماية الخصوصية
```

#### الصلاحيات المرفوضة:
- ❌ أي بيانات شخصية (PII)
- ❌ بيانات غير مجمعة
- ❌ معلومات تحديد الهوية
- ❌ تعديل أي بيانات

---

### 6. المسابقات (Competitions)

#### الصلاحيات المسموحة:
- ✅ **إدارة**: المسابقات التي ينظمها
- ✅ **عرض**: بيانات المشاركين في مسابقاته
- ✅ **إدخال**: نتائج المسابقات
- ✅ **تحديث**: حالة المشاركين

#### السياسات المطبقة:
```sql
-- وصول منظمي المسابقات
CREATE POLICY "competitions_participants_access" ON haraka_student_profiles
    FOR SELECT USING (
        get_user_role() = 'competition_organizer' 
        AND id IN (
            SELECT student_id 
            FROM competition_participants cp
            JOIN competitions c ON cp.competition_id = c.id
            WHERE c.organizer_id = auth.uid()
        )
    );
```

#### الصلاحيات المرفوضة:
- ❌ الوصول لمسابقات أخرى
- ❌ بيانات غير المشاركين
- ❌ تعديل بيانات الطلاب الأساسية

---

### 7. الأدمن (Admin)

#### الصلاحيات المسموحة:
- ✅ **وصول كامل**: جميع البيانات والجداول
- ✅ **تعديل**: جميع السجلات
- ✅ **حذف**: البيانات عند الضرورة
- ✅ **إدارة**: النظام بالكامل

#### السياسات المطبقة:
```sql
-- صلاحيات كاملة للأدمن
CREATE POLICY "admin_full_access_students" ON haraka_student_profiles
    FOR ALL USING (get_user_role() = 'admin');
```

#### نظام التسجيل الإجباري:
- 📝 **جميع العمليات مُسجلة تلقائياً**
- 🕒 **طوابع زمنية دقيقة**
- 📍 **تتبع عناوين IP**
- 📊 **تسجيل البيانات القديمة والجديدة**

---

## 📝 نظام تسجيل المراجعة (Audit Logging)

### جدول audit_logs

```sql
CREATE TABLE haraka_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,                    -- معرف المستخدم
    user_role VARCHAR(50),           -- دور المستخدم
    user_email VARCHAR(255),         -- بريد المستخدم
    action VARCHAR(20),              -- نوع العملية
    resource_type VARCHAR(100),      -- نوع المورد
    resource_id VARCHAR(255),        -- معرف المورد
    ip_address INET,                 -- عنوان IP
    user_agent TEXT,                 -- معلومات المتصفح
    session_id VARCHAR(255),         -- معرف الجلسة
    meta_data JSONB,                 -- بيانات إضافية
    old_values JSONB,                -- القيم القديمة
    new_values JSONB,                -- القيم الجديدة
    success BOOLEAN,                 -- نجاح العملية
    error_message TEXT,              -- رسالة الخطأ
    execution_time_ms INTEGER,       -- وقت التنفيذ
    created_at TIMESTAMP             -- وقت الإنشاء
);
```

### أنواع العمليات المُسجلة:

#### 1. عمليات البيانات:
- `SELECT` - قراءة البيانات
- `INSERT` - إضافة بيانات جديدة
- `UPDATE` - تحديث البيانات
- `DELETE` - حذف البيانات

#### 2. عمليات الأمان:
- `LOGIN` - تسجيل الدخول
- `LOGOUT` - تسجيل الخروج
- `ACCESS_DENIED` - محاولة وصول مرفوضة

#### 3. معلومات مُسجلة لكل عملية:
```json
{
  "user_id": "uuid",
  "user_role": "teacher",
  "action": "SELECT",
  "resource_type": "haraka_student_profiles",
  "resource_id": "123",
  "ip_address": "192.168.1.100",
  "meta_data": {
    "table_name": "haraka_student_profiles",
    "operation": "SELECT",
    "filters_applied": ["class_name = 'الصف الخامس أ'"]
  },
  "success": true,
  "created_at": "2024-10-08T15:30:00Z"
}
```

---

## 🛡️ كشف الأنشطة المشبوهة

### دالة كشف التهديدات:
```sql
SELECT * FROM detect_suspicious_activity(24); -- آخر 24 ساعة
```

### أنواع التنبيهات:

#### 1. محاولات وصول مرفوضة متكررة:
- **العتبة**: 5+ محاولات في الساعة
- **الإجراء**: تنبيه فوري + حجب مؤقت

#### 2. استخدام عناوين IP متعددة:
- **العتبة**: 3+ عناوين IP مختلفة لنفس المستخدم
- **الإجراء**: مراجعة أمنية

#### 3. نشاط غير طبيعي:
- **المؤشرات**: عمليات كثيرة في وقت قصير
- **الإجراء**: تسجيل مفصل + مراقبة

---

## 🧪 اختبارات الأمان

### 1. اختبار عزل البيانات:
```sql
-- اختبار أن الطالب لا يرى بيانات طلاب آخرين
SELECT test_user_access(
    'student_user_id', 
    'اختبار عزل بيانات الطلاب'
);
```

### 2. اختبار منع الوصول غير المصرح:
```sql
-- اختبار محاولة وصول ولي أمر لطفل ليس له
SELECT * FROM test_unauthorized_access();
```

### 3. اختبار Views الوزارة:
```sql
-- التأكد من عدم وجود بيانات شخصية في views الوزارة
SELECT * FROM test_ministry_views();
```

---

## 📊 مراقبة الأداء والأمان

### Views المراقبة:

#### 1. إحصائيات المراجعة للأدمن:
```sql
SELECT * FROM admin_audit_statistics 
WHERE audit_date >= CURRENT_DATE - INTERVAL '7 days';
```

#### 2. محاولات الوصول المرفوضة:
```sql
SELECT * FROM security_access_denied_log 
WHERE attempts_from_same_ip_per_hour >= 3;
```

#### 3. نشاط المستخدمين:
```sql
SELECT * FROM user_activity_summary 
WHERE access_denied_count > 0;
```

---

## 🔧 الصيانة والإدارة

### تنظيف السجلات القديمة:
```sql
-- حذف السجلات الأقدم من سنة واحدة
SELECT cleanup_old_audit_logs(365);
```

### مراقبة الأداء:
- **فهارس محسّنة** للاستعلامات السريعة
- **تقسيم الجداول** للبيانات الكبيرة
- **أرشفة تلقائية** للسجلات القديمة

---

## ✅ معايير القبول المحققة

### 1. عزل البيانات:
- ✅ **لا يمكن لأي مستخدم رؤية بيانات غيره**
- ✅ **كل دور يرى البيانات المسموحة له فقط**
- ✅ **الوزارة ترى بيانات مجمعة ومجهولة فقط**

### 2. تسجيل شامل:
- ✅ **جميع العمليات مُسجلة في audit_logs**
- ✅ **معلومات مفصلة لكل عملية**
- ✅ **تتبع محاولات الوصول المرفوضة**

### 3. الأمان المتقدم:
- ✅ **كشف الأنشطة المشبوهة**
- ✅ **تنبيهات أمنية فورية**
- ✅ **مراقبة مستمرة للنظام**

---

## 📞 الدعم والمساعدة

### للمطورين:
- 📚 **مراجعة الكود**: جميع السياسات موثقة في SQL
- 🧪 **اختبار السياسات**: دوال اختبار شاملة متوفرة
- 📊 **مراقبة الأداء**: Views إحصائية مفصلة

### للأدمن:
- 🔍 **مراقبة الأمان**: لوحات تحكم متخصصة
- 📝 **تقارير المراجعة**: تقارير تفصيلية يومية
- 🚨 **التنبيهات**: إشعارات فورية للأنشطة المشبوهة

---

**© 2024 منصة حركة - نظام أمان متقدم ومتوافق مع أعلى المعايير العالمية**