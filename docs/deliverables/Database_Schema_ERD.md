# مخطط قاعدة البيانات ونموذج البيانات (ERD)

## نظرة عامة
هذا المستند يحتوي على التصميم الشامل لقاعدة البيانات، بما في ذلك العلاقات بين الكيانات (ERD) ونموذج البيانات للمقاييس الصحية والربط بين المستخدمين والأجهزة والحصص.

## 1. الكيانات الأساسية (Core Entities)

### 1.1 جدول المستخدمين (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    school_id UUID REFERENCES schools(id),
    province_id UUID REFERENCES provinces(id),
    date_of_birth DATE,
    gender gender_type,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس للأداء
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_province_id ON users(province_id);
```

### 1.2 جدول المدارس (schools)
```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type school_type NOT NULL,
    address TEXT,
    province_id UUID REFERENCES provinces(id) NOT NULL,
    directorate_id UUID REFERENCES directorates(id) NOT NULL,
    principal_id UUID REFERENCES users(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    student_capacity INTEGER,
    current_students INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_schools_province_id ON schools(province_id);
CREATE INDEX idx_schools_directorate_id ON schools(directorate_id);
CREATE INDEX idx_schools_code ON schools(code);
```

### 1.3 جدول الولايات (provinces)
```sql
CREATE TABLE provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- 01 إلى 58
    region region_type NOT NULL,
    population INTEGER,
    area_km2 DECIMAL(10,2),
    capital VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج جميع الولايات الجزائرية
INSERT INTO provinces (name, code, region, capital) VALUES
('أدرار', '01', 'south', 'أدرار'),
('الشلف', '02', 'north', 'الشلف'),
('الأغواط', '03', 'south', 'الأغواط'),
('أم البواقي', '04', 'east', 'أم البواقي'),
('باتنة', '05', 'east', 'باتنة'),
('بجاية', '06', 'north', 'بجاية'),
('بسكرة', '07', 'south', 'بسكرة'),
('بشار', '08', 'south', 'بشار'),
('البليدة', '09', 'north', 'البليدة'),
('البويرة', '10', 'north', 'البويرة'),
-- ... باقي الولايات
('الجزائر', '16', 'north', 'الجزائر'),
('الجلفة', '17', 'south', 'الجلفة'),
('جيجل', '18', 'north', 'جيجل'),
('سطيف', '19', 'east', 'سطيف'),
('سعيدة', '20', 'west', 'سعيدة'),
-- ... إلى الولاية 58
('المنيعة', '58', 'south', 'المنيعة');
```

## 2. إدارة الأجهزة (Device Management)

### 2.1 جدول الأجهزة (devices)
```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id VARCHAR(255) UNIQUE NOT NULL, -- معرف الجهاز الفريد
    name VARCHAR(100) NOT NULL,
    brand device_brand NOT NULL,
    model VARCHAR(100),
    type device_type NOT NULL,
    firmware_version VARCHAR(50),
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    is_active BOOLEAN DEFAULT true,
    supports_bia BOOLEAN DEFAULT false,
    supports_heart_rate BOOLEAN DEFAULT false,
    supports_sleep BOOLEAN DEFAULT false,
    last_sync TIMESTAMP WITH TIME ZONE,
    paired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_brand ON devices(brand);
```

### 2.2 جدول مزامنة الأجهزة (device_syncs)
```sql
CREATE TABLE device_syncs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) NOT NULL,
    sync_status sync_status_type NOT NULL,
    data_points_synced INTEGER DEFAULT 0,
    sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_device_syncs_device_id ON device_syncs(device_id);
CREATE INDEX idx_device_syncs_status ON device_syncs(sync_status);
CREATE INDEX idx_device_syncs_date ON device_syncs(sync_started_at);
```

## 3. البيانات الصحية (Health Data)

### 3.1 جدول النشاط اليومي (daily_activities)
```sql
CREATE TABLE daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id UUID REFERENCES devices(id),
    activity_date DATE NOT NULL,
    steps INTEGER DEFAULT 0,
    distance_meters DECIMAL(10,2) DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    active_minutes INTEGER DEFAULT 0,
    floors_climbed INTEGER DEFAULT 0,
    avg_heart_rate INTEGER,
    max_heart_rate INTEGER,
    resting_heart_rate INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
CREATE INDEX idx_daily_activities_date ON daily_activities(activity_date);
CREATE INDEX idx_daily_activities_device ON daily_activities(device_id);
```

### 3.2 جدول بيانات النوم (sleep_data)
```sql
CREATE TABLE sleep_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id UUID REFERENCES devices(id),
    sleep_date DATE NOT NULL,
    bedtime TIME NOT NULL,
    wake_time TIME NOT NULL,
    total_sleep_minutes INTEGER NOT NULL,
    deep_sleep_minutes INTEGER DEFAULT 0,
    light_sleep_minutes INTEGER DEFAULT 0,
    rem_sleep_minutes INTEGER DEFAULT 0,
    awake_minutes INTEGER DEFAULT 0,
    sleep_efficiency DECIMAL(5,2), -- نسبة مئوية
    sleep_quality_score INTEGER CHECK (sleep_quality_score >= 0 AND sleep_quality_score <= 100),
    times_awakened INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, sleep_date)
);

CREATE INDEX idx_sleep_data_user_date ON sleep_data(user_id, sleep_date);
CREATE INDEX idx_sleep_data_quality ON sleep_data(sleep_quality_score);
```

### 3.3 جدول تحليل تركيب الجسم (body_composition)
```sql
CREATE TABLE body_composition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id UUID REFERENCES devices(id),
    measurement_date DATE NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    height_cm DECIMAL(5,2),
    bmi DECIMAL(4,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_kg DECIMAL(5,2),
    bone_mass_kg DECIMAL(4,2),
    water_percentage DECIMAL(4,2),
    visceral_fat_level INTEGER,
    bmr_calories INTEGER, -- معدل الأيض الأساسي
    metabolic_age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, measurement_date)
);

CREATE INDEX idx_body_composition_user_date ON body_composition(user_id, measurement_date);
CREATE INDEX idx_body_composition_bmi ON body_composition(bmi);
```

## 4. نظام الحجوزات والجلسات (Booking System)

### 4.1 جدول المدربين (coaches)
```sql
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    specialization VARCHAR(100),
    certification VARCHAR(255),
    experience_years INTEGER,
    hourly_rate DECIMAL(8,2),
    is_available BOOLEAN DEFAULT true,
    max_students_per_session INTEGER DEFAULT 10,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_coaches_specialization ON coaches(specialization);
```

### 4.2 جدول الجلسات التدريبية (training_sessions)
```sql
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_type session_type NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    duration_minutes INTEGER NOT NULL,
    location VARCHAR(255),
    equipment_needed TEXT[],
    difficulty_level difficulty_level,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_training_sessions_coach_id ON training_sessions(coach_id);
CREATE INDEX idx_training_sessions_type ON training_sessions(session_type);
```

### 4.3 جدول الحجوزات (bookings)
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) NOT NULL,
    session_id UUID REFERENCES training_sessions(id) NOT NULL,
    coach_id UUID REFERENCES coaches(id) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status booking_status DEFAULT 'pending',
    notes TEXT,
    attendance_status attendance_status,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    cancelled_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_student_id ON bookings(student_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_bookings_coach_id ON bookings(coach_id);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, booking_time);
CREATE INDEX idx_bookings_status ON bookings(status);
```

## 5. نظام المسابقات (Competition System)

### 5.1 جدول المسابقات (competitions)
```sql
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type competition_type NOT NULL,
    category VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    prize_description TEXT,
    rules TEXT,
    status competition_status DEFAULT 'draft',
    created_by UUID REFERENCES users(id) NOT NULL,
    school_id UUID REFERENCES schools(id),
    province_id UUID REFERENCES provinces(id),
    is_national BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_competitions_type ON competitions(type);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX idx_competitions_school ON competitions(school_id);
CREATE INDEX idx_competitions_province ON competitions(province_id);
```

### 5.2 جدول المشاركة في المسابقات (competition_participants)
```sql
CREATE TABLE competition_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) NOT NULL,
    student_id UUID REFERENCES users(id) NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status participation_status DEFAULT 'registered',
    score DECIMAL(10,2),
    rank INTEGER,
    performance_data JSONB, -- بيانات الأداء المرنة
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(competition_id, student_id)
);

CREATE INDEX idx_competition_participants_competition ON competition_participants(competition_id);
CREATE INDEX idx_competition_participants_student ON competition_participants(student_id);
CREATE INDEX idx_competition_participants_score ON competition_participants(score DESC);
CREATE INDEX idx_competition_participants_rank ON competition_participants(rank);
```

## 6. نظام الرسائل (Messaging System)

### 6.1 جدول الرسائل (messages)
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) NOT NULL,
    recipient_id UUID REFERENCES users(id) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'personal',
    priority priority_level DEFAULT 'normal',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    parent_message_id UUID REFERENCES messages(id), -- للردود
    attachments JSONB, -- مرفقات الرسالة
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_read_status ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_date ON messages(created_at);
```

### 6.2 جدول الإشعارات (notifications)
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    data JSONB, -- بيانات إضافية
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_date ON notifications(created_at);
```

## 7. الأنواع المخصصة (Custom Types)

```sql
-- أنواع البيانات المخصصة
CREATE TYPE user_role AS ENUM (
    'student', 'parent', 'teacher', 'coach', 
    'principal', 'directorate_admin', 'ministry_admin'
);

CREATE TYPE gender_type AS ENUM ('male', 'female');

CREATE TYPE school_type AS ENUM (
    'primary', 'middle', 'secondary', 'mixed'
);

CREATE TYPE region_type AS ENUM (
    'north', 'south', 'east', 'west', 'center'
);

CREATE TYPE device_brand AS ENUM (
    'xiaomi', 'apple', 'samsung', 'fitbit', 'garmin', 'huawei', 'other'
);

CREATE TYPE device_type AS ENUM (
    'fitness_tracker', 'smartwatch', 'smart_scale', 'heart_rate_monitor'
);

CREATE TYPE sync_status_type AS ENUM (
    'pending', 'in_progress', 'completed', 'failed'
);

CREATE TYPE session_type AS ENUM (
    'individual', 'group', 'class', 'workshop'
);

CREATE TYPE difficulty_level AS ENUM (
    'beginner', 'intermediate', 'advanced'
);

CREATE TYPE booking_status AS ENUM (
    'pending', 'confirmed', 'cancelled', 'completed'
);

CREATE TYPE attendance_status AS ENUM (
    'present', 'absent', 'late', 'excused'
);

CREATE TYPE competition_type AS ENUM (
    'fitness_challenge', 'sports_tournament', 'endurance_test', 
    'strength_test', 'flexibility_test', 'team_challenge'
);

CREATE TYPE competition_status AS ENUM (
    'draft', 'published', 'active', 'completed', 'cancelled'
);

CREATE TYPE participation_status AS ENUM (
    'registered', 'confirmed', 'withdrawn', 'disqualified', 'completed'
);

CREATE TYPE message_type AS ENUM (
    'personal', 'announcement', 'report', 'alert', 'reminder'
);

CREATE TYPE notification_type AS ENUM (
    'booking_confirmation', 'device_sync', 'competition_update', 
    'message_received', 'report_ready', 'system_alert'
);

CREATE TYPE priority_level AS ENUM (
    'low', 'normal', 'high', 'urgent'
);
```

## 8. العلاقات والقيود (Relationships & Constraints)

### 8.1 العلاقات الأساسية
```sql
-- علاقة المستخدم بالمدرسة
ALTER TABLE users ADD CONSTRAINT fk_users_school 
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL;

-- علاقة المدرسة بالولاية
ALTER TABLE schools ADD CONSTRAINT fk_schools_province 
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE RESTRICT;

-- علاقة الجهاز بالمستخدم
ALTER TABLE devices ADD CONSTRAINT fk_devices_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- علاقة البيانات الصحية بالمستخدم والجهاز
ALTER TABLE daily_activities ADD CONSTRAINT fk_activities_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE daily_activities ADD CONSTRAINT fk_activities_device 
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL;
```

### 8.2 قيود البيانات
```sql
-- قيود التحقق من صحة البيانات
ALTER TABLE daily_activities ADD CONSTRAINT chk_steps_positive 
    CHECK (steps >= 0);

ALTER TABLE daily_activities ADD CONSTRAINT chk_calories_positive 
    CHECK (calories_burned >= 0);

ALTER TABLE sleep_data ADD CONSTRAINT chk_sleep_duration 
    CHECK (total_sleep_minutes >= 0 AND total_sleep_minutes <= 1440);

ALTER TABLE body_composition ADD CONSTRAINT chk_weight_range 
    CHECK (weight_kg > 0 AND weight_kg < 300);

ALTER TABLE body_composition ADD CONSTRAINT chk_bmi_range 
    CHECK (bmi > 0 AND bmi < 50);
```

## 9. الفهارس المحسنة للأداء

### 9.1 فهارس مركبة للاستعلامات الشائعة
```sql
-- فهرس للبحث عن البيانات الصحية لمستخدم في فترة زمنية
CREATE INDEX idx_daily_activities_user_date_range 
    ON daily_activities(user_id, activity_date DESC);

-- فهرس للبحث عن الحجوزات حسب التاريخ والحالة
CREATE INDEX idx_bookings_date_status 
    ON bookings(booking_date, status);

-- فهرس للبحث عن المسابقات النشطة
CREATE INDEX idx_competitions_active 
    ON competitions(status, start_date, end_date) 
    WHERE status IN ('published', 'active');

-- فهرس للرسائل غير المقروءة
CREATE INDEX idx_messages_unread 
    ON messages(recipient_id, created_at DESC) 
    WHERE is_read = false;
```

### 9.2 فهارس للتجميع والإحصائيات
```sql
-- فهرس لإحصائيات المدارس حسب الولاية
CREATE INDEX idx_schools_province_stats 
    ON schools(province_id, is_active, current_students);

-- فهرس لإحصائيات الأجهزة حسب النوع والعلامة التجارية
CREATE INDEX idx_devices_brand_type_stats 
    ON devices(brand, type, is_active);
```

## 10. إجراءات التحسين والصيانة

### 10.1 إجراءات التنظيف التلقائي
```sql
-- إجراء لحذف البيانات القديمة (أكثر من سنتين)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- حذف بيانات النشاط القديمة
    DELETE FROM daily_activities 
    WHERE activity_date < CURRENT_DATE - INTERVAL '2 years';
    
    -- حذف بيانات النوم القديمة
    DELETE FROM sleep_data 
    WHERE sleep_date < CURRENT_DATE - INTERVAL '2 years';
    
    -- حذف الإشعارات المنتهية الصلاحية
    DELETE FROM notifications 
    WHERE expires_at < NOW() OR created_at < NOW() - INTERVAL '6 months';
    
    -- حذف سجلات المزامنة القديمة
    DELETE FROM device_syncs 
    WHERE sync_started_at < NOW() - INTERVAL '3 months';
END;
$$ LANGUAGE plpgsql;

-- جدولة تنفيذ الإجراء شهرياً
SELECT cron.schedule('cleanup-old-data', '0 2 1 * *', 'SELECT cleanup_old_data();');
```

### 10.2 إجراءات الإحصائيات
```sql
-- إجراء لحساب إحصائيات المستخدم اليومية
CREATE OR REPLACE FUNCTION calculate_user_daily_stats(user_uuid UUID, target_date DATE)
RETURNS TABLE(
    avg_steps INTEGER,
    avg_calories INTEGER,
    sleep_quality DECIMAL,
    active_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(da.steps)::INTEGER, 0) as avg_steps,
        COALESCE(AVG(da.calories_burned)::INTEGER, 0) as avg_calories,
        COALESCE(AVG(sd.sleep_quality_score), 0) as sleep_quality,
        COUNT(DISTINCT da.activity_date)::INTEGER as active_days
    FROM daily_activities da
    LEFT JOIN sleep_data sd ON sd.user_id = da.user_id AND sd.sleep_date = da.activity_date
    WHERE da.user_id = user_uuid 
    AND da.activity_date >= target_date - INTERVAL '30 days'
    AND da.activity_date <= target_date;
END;
$$ LANGUAGE plpgsql;
```

## 11. أمان البيانات والنسخ الاحتياطية

### 11.1 تشفير البيانات الحساسة
```sql
-- تشفير البيانات الشخصية الحساسة
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- دالة لتشفير البيانات الحساسة
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(data::bytea, 'encryption_key', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql;

-- دالة لفك تشفير البيانات
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), 'encryption_key', 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql;
```

### 11.2 سياسات الأمان على مستوى الصفوف (RLS)
```sql
-- تفعيل RLS على الجداول الحساسة
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- سياسة للطلاب: يمكنهم رؤية بياناتهم فقط
CREATE POLICY student_own_data ON daily_activities
    FOR ALL TO student_role
    USING (user_id = current_user_id());

-- سياسة للمعلمين: يمكنهم رؤية بيانات طلابهم
CREATE POLICY teacher_student_data ON daily_activities
    FOR SELECT TO teacher_role
    USING (user_id IN (
        SELECT s.id FROM users s 
        JOIN users t ON s.school_id = t.school_id 
        WHERE t.id = current_user_id() AND t.role = 'teacher'
    ));
```

هذا المخطط يوفر أساساً قوياً ومرناً لقاعدة البيانات، مع التركيز على الأداء والأمان وسهولة الصيانة.