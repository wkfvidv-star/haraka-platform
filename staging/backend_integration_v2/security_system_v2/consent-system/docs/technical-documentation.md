# 🔧 الوثائق التقنية - منصة حركة

## 📋 جدول المحتويات

1. [نظرة عامة على المعمارية](#architecture)
2. [قواعد البيانات](#database)
3. [APIs ونقاط النهاية](#apis)
4. [نظام الأمان](#security)
5. [التخزين والملفات](#storage)
6. [نظام المصادقة](#authentication)
7. [معالجة الفيديو](#video-processing)
8. [نظام الموافقات](#consent-system)
9. [المراقبة والسجلات](#monitoring)
10. [النشر والبيئات](#deployment)

---

## 🏗️ نظرة عامة على المعمارية {#architecture}

### هيكل التطبيق
```
منصة حركة/
├── Frontend (Next.js 14)
│   ├── Pages Router
│   ├── React Components
│   ├── TypeScript
│   └── Tailwind CSS + Shadcn-UI
├── Backend (Next.js API Routes)
│   ├── Authentication APIs
│   ├── Video Processing APIs
│   ├── User Management APIs
│   └── Analytics APIs
├── Database (Supabase PostgreSQL)
│   ├── Users & Profiles
│   ├── Video Records
│   ├── Analysis Results
│   └── Consent Records
├── Storage (Supabase Storage)
│   ├── Video Files
│   ├── Thumbnails
│   ├── Reports
│   └── Consent Documents
└── AI Processing Engine
    ├── Motion Analysis
    ├── Biomechanics Extraction
    ├── Performance Metrics
    └── Recommendations Generator
```

### التقنيات المستخدمة

#### Frontend Stack
- **Framework**: Next.js 14.0.0+
- **Language**: TypeScript 5.0+
- **UI Library**: React 18.0+
- **Styling**: Tailwind CSS 3.0+
- **Components**: Shadcn-UI
- **State Management**: React Hooks + Context API
- **Form Handling**: React Hook Form + Zod Validation
- **HTTP Client**: Fetch API (Native)

#### Backend Stack
- **Runtime**: Node.js 18.0+
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL 14+ (Supabase)
- **Storage**: Supabase Storage (S3-compatible)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod Schema Validation
- **Rate Limiting**: Custom Middleware
- **Error Handling**: Centralized Error Handler

#### DevOps & Infrastructure
- **Hosting**: Vercel (Frontend) + Supabase (Backend)
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in Analytics
- **Logging**: Console + File Logging
- **Backup**: Automated Supabase Backups

---

## 🗄️ قواعد البيانات {#database}

### مخطط قاعدة البيانات

#### جدول المستخدمين (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  school_id UUID REFERENCES schools(id),
  region_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM (
  'student', 'teacher', 'coach', 'guardian', 
  'ministry', 'admin', 'competition_manager'
);
```

#### جدول الملفات الشخصية (user_profiles)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender gender_type,
  grade VARCHAR(50),
  sport_preferences TEXT[],
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE gender_type AS ENUM ('male', 'female');
```

#### جدول رفع الفيديوهات (video_uploads)
```sql
CREATE TABLE video_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  upload_status upload_status_type DEFAULT 'uploading',
  processing_status processing_status_type DEFAULT 'pending',
  consent_status consent_status_type DEFAULT 'required',
  analysis_results JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE upload_status_type AS ENUM (
  'uploading', 'uploaded', 'processing', 'completed', 'failed'
);

CREATE TYPE processing_status_type AS ENUM (
  'pending', 'analyzing', 'completed', 'failed'
);

CREATE TYPE consent_status_type AS ENUM (
  'required', 'pending', 'approved', 'rejected'
);
```

#### جدول سجلات الموافقة (consent_records)
```sql
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES video_uploads(id) ON DELETE CASCADE,
  consent_type consent_type_enum NOT NULL,
  status consent_record_status DEFAULT 'pending',
  guardian_signature TEXT,
  consent_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE consent_type_enum AS ENUM (
  'video_analysis', 'data_sharing', 'research_participation'
);

CREATE TYPE consent_record_status AS ENUM (
  'pending', 'approved', 'rejected', 'expired'
);
```

#### جدول المدارس (schools)
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### جدول الإشعارات (notifications)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  status notification_status DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
  'consent_request', 'consent_response', 'analysis_complete', 
  'system_alert', 'reminder'
);

CREATE TYPE notification_status AS ENUM (
  'pending', 'sent', 'delivered', 'failed'
);
```

### فهارس قاعدة البيانات

```sql
-- فهارس الأداء
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);

CREATE INDEX idx_video_uploads_user ON video_uploads(user_id);
CREATE INDEX idx_video_uploads_status ON video_uploads(processing_status);
CREATE INDEX idx_video_uploads_created ON video_uploads(created_at);

CREATE INDEX idx_consent_records_student ON consent_records(student_id);
CREATE INDEX idx_consent_records_guardian ON consent_records(guardian_id);
CREATE INDEX idx_consent_records_status ON consent_records(status);

-- فهارس البحث النصي
CREATE INDEX idx_users_name_search ON users USING gin(to_tsvector('arabic', name));
CREATE INDEX idx_schools_name_search ON schools USING gin(to_tsvector('arabic', name));
```

### سياسات الأمان (RLS Policies)

```sql
-- تفعيل Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- سياسات المستخدمين
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الفيديوهات
CREATE POLICY "Users can view own videos" ON video_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student videos" ON video_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('teacher', 'coach', 'admin')
    )
  );

-- سياسات الموافقات
CREATE POLICY "Students can view own consent records" ON consent_records
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Guardians can manage consent records" ON consent_records
  FOR ALL USING (auth.uid() = guardian_id);
```

---

## 🔌 APIs ونقاط النهاية {#apis}

### APIs المصادقة

#### POST /api/auth/login
تسجيل دخول المستخدم

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  user: User;
  token: string;
}
```

**Status Codes:**
- `200`: نجح تسجيل الدخول
- `401`: بيانات دخول خاطئة
- `403`: الحساب غير مفعل
- `429`: تجاوز حد المحاولات

#### POST /api/auth/register
إنشاء حساب جديد

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'coach' | 'guardian';
  school_id?: string;
  region_id: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  user: User;
  token: string;
}
```

#### GET /api/auth/me
جلب بيانات المستخدم الحالي

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  success: boolean;
  user: User;
}
```

### APIs إدارة الفيديو

#### POST /api/videos/upload
رفع فيديو جديد

**Content-Type:** `multipart/form-data`

**Form Data:**
- `video`: File (الفيديو)
- `metadata`: JSON string

**Metadata Schema:**
```typescript
{
  sport_type: string;
  session_notes?: string;
  file_size: number;
  mime_type: string;
  duration?: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: {
    video_id: string;
    upload_status: string;
    processing_status: string;
    consent_status: string;
  };
}
```

#### GET /api/videos/[id]/status
تتبع حالة معالجة الفيديو

**Response:**
```typescript
{
  success: boolean;
  data: {
    video: {
      id: string;
      filename: string;
      original_filename: string;
      upload_status: string;
      processing_status: string;
      consent_status: string;
      analysis_results?: AnalysisResults;
      processing_progress: number;
      video_url?: string;
      thumbnail_url?: string;
      created_at: string;
      updated_at: string;
    };
  };
}
```

#### GET /api/videos/[id]/analysis
جلب نتائج تحليل الفيديو

**Response:**
```typescript
{
  success: boolean;
  data: {
    analysis: AnalysisResults;
    recommendations: string[];
    comparison_data: ComparisonData;
  };
}
```

### APIs إدارة المستخدمين

#### GET /api/users
جلب قائمة المستخدمين (للإدارة)

**Query Parameters:**
- `role?`: تصفية حسب الدور
- `school_id?`: تصفية حسب المدرسة
- `page?`: رقم الصفحة
- `limit?`: عدد النتائج

**Response:**
```typescript
{
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
```

#### GET /api/users/[id]
جلب بيانات مستخدم محدد

**Response:**
```typescript
{
  success: boolean;
  data: {
    user: User;
    profile: UserProfile;
    stats: UserStats;
  };
}
```

### APIs الموافقات

#### POST /api/consent/request
إنشاء طلب موافقة

**Request Body:**
```typescript
{
  student_id: string;
  video_id: string;
  consent_type: 'video_analysis' | 'data_sharing' | 'research_participation';
  guardian_email?: string;
  additional_notes?: string;
}
```

#### POST /api/consent/[id]/respond
الرد على طلب موافقة

**Request Body:**
```typescript
{
  approved: boolean;
  guardian_signature?: string;
  response_notes?: string;
}
```

### معالجة الأخطاء

جميع APIs تستخدم معالج أخطاء موحد:

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**رموز الأخطاء الشائعة:**
- `UNAUTHORIZED`: غير مصرح بالوصول
- `FORBIDDEN`: ممنوع الوصول
- `NOT_FOUND`: المورد غير موجود
- `VALIDATION_ERROR`: خطأ في التحقق من البيانات
- `RATE_LIMITED`: تجاوز حد المعدل
- `SERVER_ERROR`: خطأ في الخادم

---

## 🔒 نظام الأمان {#security}

### المصادقة والتفويض

#### JWT Tokens
```typescript
// Token Structure
{
  id: string;        // معرف المستخدم
  email: string;     // البريد الإلكتروني
  role: string;      // دور المستخدم
  school_id?: string; // معرف المدرسة
  region_id?: string; // معرف المنطقة
  iat: number;       // تاريخ الإصدار
  exp: number;       // تاريخ انتهاء الصلاحية
}
```

**إعدادات الأمان:**
- **خوارزمية التوقيع**: HS256
- **مدة الصلاحية**: 24 ساعة
- **التحديث التلقائي**: غير مفعل
- **التخزين**: HTTP-only cookies

#### تشفير كلمات المرور
```typescript
// استخدام bcrypt مع salt rounds = 12
const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### حماية المسارات

#### Middleware Protection
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // التحقق من المسارات المحمية
  const protectedRoutes = {
    '/student': ['student'],
    '/teacher': ['teacher'],
    '/admin': ['admin'],
    // ...
  };
  
  // التحقق من وجود token
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return redirectToLogin(request);
  }
  
  // التحقق من صحة التوقيع
  const payload = await verifyToken(token);
  
  // التحقق من الصلاحيات
  const requiredRoles = getRequiredRoles(pathname);
  if (!hasRequiredRole(payload.role, requiredRoles)) {
    return redirectToDashboard(payload.role);
  }
  
  return NextResponse.next();
}
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
export function withRateLimit(
  handler: Function,
  options: {
    maxRequests: number;
    windowMs: number;
  }
) {
  const requests = new Map();
  
  return async (req: NextRequest) => {
    const ip = getClientIP(req);
    const now = Date.now();
    const windowStart = now - options.windowMs;
    
    // تنظيف الطلبات القديمة
    const userRequests = requests.get(ip) || [];
    const validRequests = userRequests.filter(
      (timestamp: number) => timestamp > windowStart
    );
    
    // التحقق من الحد الأقصى
    if (validRequests.length >= options.maxRequests) {
      return new Response('Too Many Requests', { status: 429 });
    }
    
    // إضافة الطلب الحالي
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    return handler(req);
  };
}
```

### حماية البيانات

#### تشفير البيانات الحساسة
```typescript
// تشفير البيانات قبل التخزين
const crypto = require('crypto');

function encrypt(text: string): string {
  const algorithm = 'aes-256-gcm';
  const key = process.env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}
```

#### تنظيف البيانات المدخلة
```typescript
import { z } from 'zod';

// Schema validation
const UserSchema = z.object({
  name: z.string().min(2).max(100).regex(/^[a-zA-Zأ-ي\s]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

// XSS Protection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // إزالة HTML tags
    .replace(/javascript:/gi, '') // إزالة JavaScript URLs
    .trim();
}
```

### مراجعة الأمان

#### سجل العمليات الحساسة
```typescript
// lib/audit-log.ts
export async function logSecurityEvent(
  event: 'login' | 'logout' | 'password_change' | 'data_access',
  userId: string,
  details: any
) {
  await supabase
    .from('security_logs')
    .insert({
      event_type: event,
      user_id: userId,
      ip_address: getClientIP(),
      user_agent: getUserAgent(),
      details: details,
      timestamp: new Date().toISOString()
    });
}
```

#### مراقبة التهديدات
```typescript
// كشف محاولات الدخول المشبوهة
export function detectSuspiciousActivity(
  userId: string,
  ipAddress: string
): boolean {
  // فحص عدد محاولات تسجيل الدخول الفاشلة
  const failedAttempts = getFailedLoginAttempts(userId, ipAddress);
  if (failedAttempts > 5) {
    return true;
  }
  
  // فحص تغيير الموقع الجغرافي المفاجئ
  const lastLocation = getLastLoginLocation(userId);
  const currentLocation = getLocationFromIP(ipAddress);
  if (calculateDistance(lastLocation, currentLocation) > 1000) {
    return true;
  }
  
  return false;
}
```

---

## 📁 التخزين والملفات {#storage}

### هيكل Supabase Storage

```
Storage Buckets:
├── student-videos/
│   ├── {user_id}/
│   │   ├── {timestamp}-{random}.mp4
│   │   ├── {timestamp}-{random}.avi
│   │   └── ...
├── video-thumbnails/
│   ├── {user_id}/
│   │   ├── {video_id}_thumb.jpg
│   │   └── ...
├── analysis-reports/
│   ├── {user_id}/
│   │   ├── {video_id}_report.pdf
│   │   ├── {video_id}_data.json
│   │   └── ...
└── consent-documents/
    ├── {guardian_id}/
    │   ├── {consent_id}_signature.png
    │   └── ...
```

### إعدادات Storage Buckets

```typescript
// lib/supabase-storage-config.ts
export const STORAGE_CONFIG = {
  VIDEOS: {
    name: 'student-videos',
    public: false,
    allowedMimeTypes: [
      'video/mp4',
      'video/avi', 
      'video/mov',
      'video/wmv',
      'video/webm'
    ],
    maxFileSize: 500 * 1024 * 1024, // 500MB
    retentionPeriod: 365 * 24 * 60 * 60 * 1000 // 1 year
  },
  THUMBNAILS: {
    name: 'video-thumbnails',
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  },
  REPORTS: {
    name: 'analysis-reports',
    public: false,
    allowedMimeTypes: ['application/pdf', 'application/json'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  }
};
```

### إدارة الملفات

#### رفع الملفات
```typescript
export class FileManager {
  static async uploadVideo(
    file: File,
    userId: string,
    metadata: VideoMetadata
  ): Promise<UploadResult> {
    try {
      // التحقق من نوع وحجم الملف
      this.validateFile(file);
      
      // إنشاء اسم ملف فريد
      const fileName = this.generateFileName(file, userId);
      
      // رفع الملف إلى Supabase
      const { data, error } = await supabase.storage
        .from(STORAGE_CONFIG.VIDEOS.name)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            userId,
            originalName: file.name,
            sportType: metadata.sport_type,
            uploadedAt: new Date().toISOString()
          }
        });
      
      if (error) throw error;
      
      // إنشاء سجل في قاعدة البيانات
      const videoRecord = await this.createVideoRecord(
        fileName, 
        file, 
        userId, 
        metadata
      );
      
      return { success: true, data: videoRecord };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  private static validateFile(file: File): void {
    const config = STORAGE_CONFIG.VIDEOS;
    
    if (!config.allowedMimeTypes.includes(file.type)) {
      throw new Error('نوع الملف غير مدعوم');
    }
    
    if (file.size > config.maxFileSize) {
      throw new Error('حجم الملف كبير جداً');
    }
  }
  
  private static generateFileName(file: File, userId: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }
}
```

#### إنشاء URLs موقعة
```typescript
export class StorageURLManager {
  static async getSignedURL(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  }
  
  static async getPublicURL(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
```

#### تنظيف الملفات القديمة
```typescript
export class StorageCleanup {
  static async cleanupExpiredFiles(): Promise<void> {
    const expiredVideos = await this.getExpiredVideos();
    
    for (const video of expiredVideos) {
      try {
        // حذف الملف من Storage
        await supabase.storage
          .from(STORAGE_CONFIG.VIDEOS.name)
          .remove([video.storage_path]);
        
        // حذف الصورة المصغرة
        await supabase.storage
          .from(STORAGE_CONFIG.THUMBNAILS.name)
          .remove([video.thumbnail_path]);
        
        // حذف التقارير
        await supabase.storage
          .from(STORAGE_CONFIG.REPORTS.name)
          .remove([video.report_path]);
        
        // تحديث حالة السجل
        await supabase
          .from('video_uploads')
          .update({ status: 'deleted' })
          .eq('id', video.id);
        
      } catch (error) {
        console.error(`Failed to cleanup video ${video.id}:`, error);
      }
    }
  }
  
  private static async getExpiredVideos() {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() - 1);
    
    const { data } = await supabase
      .from('video_uploads')
      .select('*')
      .lt('created_at', expiryDate.toISOString())
      .neq('status', 'deleted');
    
    return data || [];
  }
}
```

---

## 🔐 نظام المصادقة {#authentication}

### JWT Token Management

#### إنشاء Token
```typescript
import { SignJWT } from 'jose';

export async function generateToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    school_id: user.school_id,
    region_id: user.region_id
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .setIssuer('haraka-platform')
    .setAudience('haraka-users')
    .sign(secret);
  
  return token;
}
```

#### التحقق من Token
```typescript
import { jwtVerify } from 'jose';

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'haraka-platform',
      audience: 'haraka-users'
    });
    
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
```

### Session Management

#### إعداد الجلسة
```typescript
export function setAuthCookie(
  response: NextResponse, 
  token: string
): void {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  });
}
```

#### إنهاء الجلسة
```typescript
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('auth-token');
}
```

### Password Security

#### تشفير كلمة المرور
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

#### سياسة كلمات المرور
```typescript
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
  }
  
  if (password.length > 128) {
    errors.push('كلمة المرور طويلة جداً');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف واحد على الأقل');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### Role-Based Access Control

#### تعريف الأدوار والصلاحيات
```typescript
export const ROLE_PERMISSIONS = {
  student: [
    'upload_video',
    'view_own_analysis',
    'update_own_profile'
  ],
  teacher: [
    'view_student_videos',
    'view_student_analysis',
    'add_student_notes',
    'view_class_stats'
  ],
  coach: [
    'view_athlete_videos',
    'create_training_programs',
    'advanced_analysis',
    'competition_prep'
  ],
  guardian: [
    'manage_consent',
    'view_child_activity',
    'privacy_settings'
  ],
  ministry: [
    'view_national_stats',
    'regional_reports',
    'policy_insights'
  ],
  admin: [
    'user_management',
    'system_settings',
    'all_data_access',
    'security_logs'
  ]
} as const;
```

#### فحص الصلاحيات
```typescript
export function hasPermission(
  userRole: string, 
  requiredPermission: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return rolePermissions?.includes(requiredPermission as any) || false;
}

export function requirePermission(permission: string) {
  return (req: NextRequest, res: NextResponse, next: Function) => {
    const user = getCurrentUser(req);
    
    if (!user || !hasPermission(user.role, permission)) {
      return new Response('Forbidden', { status: 403 });
    }
    
    next();
  };
}
```

---

## 🎥 معالجة الفيديو {#video-processing}

### محرك التحليل بالذكاء الاصطناعي

#### هيكل التحليل
```typescript
export interface AnalysisResults {
  overall_score: number;          // الدرجة الإجمالية (0-100)
  balance_score: number;          // درجة التوازن
  speed_score: number;            // درجة السرعة
  accuracy_score: number;         // درجة الدقة
  technique_score: number;        // درجة التقنية
  
  recommendations: string[];      // التوصيات
  key_moments: KeyMoment[];      // اللحظات المهمة
  biomechanics: BiomechanicsData; // البيانات البيومكانيكية
  comparison_data: ComparisonData; // بيانات المقارنة
}

export interface KeyMoment {
  timestamp: number;    // الوقت بالثواني
  description: string;  // وصف اللحظة
  score: number;       // تقييم اللحظة
}

export interface BiomechanicsData {
  joint_angles: Record<string, number>;     // زوايا المفاصل
  center_of_mass: Point3D[];               // مركز الكتلة
  velocity_profile: number[];              // ملف السرعة
}
```

#### خط أنابيب المعالجة
```typescript
export class VideoAnalysisEngine {
  static async processVideo(
    videoPath: string,
    sportType: string,
    userId: string
  ): Promise<AnalysisResults> {
    
    // الخطوة 1: استخراج الإطارات
    const frames = await this.extractFrames(videoPath);
    
    // الخطوة 2: كشف الأشخاص والمفاصل
    const poseData = await this.detectPoses(frames);
    
    // الخطوة 3: تحليل الحركة
    const motionAnalysis = await this.analyzeMotion(poseData, sportType);
    
    // الخطوة 4: حساب المقاييس
    const scores = await this.calculateScores(motionAnalysis, sportType);
    
    // الخطوة 5: إنتاج التوصيات
    const recommendations = await this.generateRecommendations(
      scores, 
      sportType, 
      userId
    );
    
    // الخطوة 6: مقارنة مع البيانات السابقة
    const comparisonData = await this.getComparisonData(userId, scores);
    
    return {
      ...scores,
      recommendations,
      comparison_data: comparisonData
    };
  }
  
  private static async extractFrames(videoPath: string): Promise<Frame[]> {
    // استخدام FFmpeg لاستخراج الإطارات
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-vf', 'fps=30',  // 30 إطار في الثانية
      '-f', 'image2pipe',
      '-pix_fmt', 'rgb24',
      '-vcodec', 'rawvideo',
      'pipe:1'
    ]);
    
    const frames: Frame[] = [];
    // معالجة البيانات المستخرجة...
    
    return frames;
  }
  
  private static async detectPoses(frames: Frame[]): Promise<PoseData[]> {
    // استخدام MediaPipe أو OpenPose لكشف المفاصل
    const poses: PoseData[] = [];
    
    for (const frame of frames) {
      const landmarks = await this.runPoseDetection(frame);
      poses.push({
        timestamp: frame.timestamp,
        landmarks: landmarks,
        confidence: landmarks.reduce((acc, l) => acc + l.confidence, 0) / landmarks.length
      });
    }
    
    return poses;
  }
}
```

### خوارزميات التحليل المتخصصة

#### تحليل التوازن
```typescript
export class BalanceAnalyzer {
  static analyzeBalance(poseData: PoseData[]): number {
    let totalStability = 0;
    
    for (const pose of poseData) {
      // حساب مركز الكتلة
      const centerOfMass = this.calculateCenterOfMass(pose.landmarks);
      
      // حساب قاعدة الدعم
      const supportBase = this.calculateSupportBase(pose.landmarks);
      
      // حساب الاستقرار
      const stability = this.calculateStability(centerOfMass, supportBase);
      
      totalStability += stability;
    }
    
    return (totalStability / poseData.length) * 100;
  }
  
  private static calculateCenterOfMass(landmarks: Landmark[]): Point3D {
    // حساب متوسط مواقع المفاصل الرئيسية
    const keyJoints = [
      'left_shoulder', 'right_shoulder',
      'left_hip', 'right_hip',
      'left_knee', 'right_knee'
    ];
    
    let totalX = 0, totalY = 0, totalZ = 0;
    
    for (const jointName of keyJoints) {
      const joint = landmarks.find(l => l.name === jointName);
      if (joint) {
        totalX += joint.x;
        totalY += joint.y;
        totalZ += joint.z;
      }
    }
    
    return {
      x: totalX / keyJoints.length,
      y: totalY / keyJoints.length,
      z: totalZ / keyJoints.length
    };
  }
}
```

#### تحليل السرعة
```typescript
export class SpeedAnalyzer {
  static analyzeSpeed(poseData: PoseData[]): number {
    const velocities: number[] = [];
    
    for (let i = 1; i < poseData.length; i++) {
      const prev = poseData[i - 1];
      const curr = poseData[i];
      
      // حساب السرعة للمفاصل الرئيسية
      const velocity = this.calculateJointVelocities(prev, curr);
      velocities.push(velocity);
    }
    
    // حساب متوسط السرعة والذروة
    const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const maxVelocity = Math.max(...velocities);
    
    // تحويل إلى درجة (0-100)
    return this.normalizeSpeedScore(avgVelocity, maxVelocity);
  }
  
  private static calculateJointVelocities(
    prev: PoseData, 
    curr: PoseData
  ): number {
    const timeDelta = curr.timestamp - prev.timestamp;
    let totalVelocity = 0;
    
    const movementJoints = ['wrist', 'elbow', 'knee', 'ankle'];
    
    for (const jointType of movementJoints) {
      const prevJoint = prev.landmarks.find(l => l.name.includes(jointType));
      const currJoint = curr.landmarks.find(l => l.name.includes(jointType));
      
      if (prevJoint && currJoint) {
        const distance = this.calculateDistance(prevJoint, currJoint);
        const velocity = distance / timeDelta;
        totalVelocity += velocity;
      }
    }
    
    return totalVelocity / movementJoints.length;
  }
}
```

### تحسين الأداء

#### معالجة متوازية
```typescript
export class ParallelProcessor {
  static async processVideoInChunks(
    videoPath: string,
    chunkSize: number = 30 // 30 إطار لكل قطعة
  ): Promise<AnalysisResults> {
    
    const totalFrames = await this.getVideoFrameCount(videoPath);
    const chunks = Math.ceil(totalFrames / chunkSize);
    
    const promises: Promise<PartialAnalysis>[] = [];
    
    for (let i = 0; i < chunks; i++) {
      const startFrame = i * chunkSize;
      const endFrame = Math.min((i + 1) * chunkSize, totalFrames);
      
      promises.push(
        this.processChunk(videoPath, startFrame, endFrame)
      );
    }
    
    const results = await Promise.all(promises);
    
    // دمج النتائج
    return this.mergeAnalysisResults(results);
  }
}
```

#### تخزين مؤقت للنتائج
```typescript
export class AnalysisCache {
  private static cache = new Map<string, AnalysisResults>();
  
  static async getCachedAnalysis(
    videoId: string
  ): Promise<AnalysisResults | null> {
    // فحص الذاكرة المؤقتة
    if (this.cache.has(videoId)) {
      return this.cache.get(videoId)!;
    }
    
    // فحص قاعدة البيانات
    const { data } = await supabase
      .from('video_uploads')
      .select('analysis_results')
      .eq('id', videoId)
      .single();
    
    if (data?.analysis_results) {
      this.cache.set(videoId, data.analysis_results);
      return data.analysis_results;
    }
    
    return null;
  }
  
  static setCachedAnalysis(
    videoId: string, 
    results: AnalysisResults
  ): void {
    this.cache.set(videoId, results);
    
    // حفظ في قاعدة البيانات
    supabase
      .from('video_uploads')
      .update({ analysis_results: results })
      .eq('id', videoId);
  }
}
```

---

## 📋 نظام الموافقات {#consent-system}

### إدارة الموافقات

#### فحص العمر التلقائي
```typescript
export class AgeVerification {
  static async checkAge(userId: string): Promise<{
    isMinor: boolean;
    age?: number;
    requiresConsent: boolean;
  }> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('date_of_birth')
        .eq('user_id', userId)
        .single();
      
      if (!profile?.date_of_birth) {
        // إذا لم يتم تحديد تاريخ الميلاد، نعتبر الشخص قاصراً للأمان
        return {
          isMinor: true,
          requiresConsent: true
        };
      }
      
      const birthDate = new Date(profile.date_of_birth);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      const isMinor = age < 18;
      
      return {
        isMinor,
        age,
        requiresConsent: isMinor
      };
      
    } catch (error) {
      console.error('Error checking age:', error);
      // في حالة الخطأ، نعتبر الشخص قاصراً للأمان
      return {
        isMinor: true,
        requiresConsent: true
      };
    }
  }
}
```

#### إنشاء طلبات الموافقة
```typescript
export class ConsentRequestManager {
  static async createConsentRequest(
    request: ConsentRequest
  ): Promise<ConsentRequestResult> {
    try {
      // التحقق من وجود طلب سابق
      const existingRequest = await this.checkExistingRequest(
        request.student_id,
        request.video_id,
        request.consent_type
      );
      
      if (existingRequest) {
        return {
          success: false,
          error: 'يوجد طلب موافقة سابق لهذا الفيديو'
        };
      }
      
      // العثور على ولي الأمر
      const guardian = await this.findGuardian(
        request.student_id,
        request.guardian_email
      );
      
      if (!guardian) {
        return {
          success: false,
          error: 'لم يتم العثور على ولي الأمر'
        };
      }
      
      // إنشاء سجل الموافقة
      const consentRecord = await this.createConsentRecord({
        student_id: request.student_id,
        guardian_id: guardian.id,
        video_id: request.video_id,
        consent_type: request.consent_type,
        status: 'pending',
        expiry_date: this.calculateExpiryDate()
      });
      
      // إرسال إشعار لولي الأمر
      await this.sendConsentNotification(
        guardian.email,
        consentRecord.id,
        request
      );
      
      return {
        success: true,
        consent_id: consentRecord.id
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  private static async findGuardian(
    studentId: string,
    guardianEmail?: string
  ): Promise<Guardian | null> {
    if (guardianEmail) {
      // البحث بالبريد الإلكتروني
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', guardianEmail)
        .eq('role', 'guardian')
        .single();
      
      return data;
    }
    
    // البحث في جدول العلاقات
    const { data } = await supabase
      .from('student_guardian_relations')
      .select(`
        guardian:guardian_id (
          id, email, name, phone
        )
      `)
      .eq('student_id', studentId)
      .single();
    
    return data?.guardian || null;
  }
  
  private static calculateExpiryDate(): string {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30); // صالح لمدة 30 يوم
    return expiry.toISOString();
  }
}
```

### معالجة ردود الموافقة

```typescript
export class ConsentResponseProcessor {
  static async processResponse(
    consentId: string,
    response: ConsentResponse
  ): Promise<ProcessingResult> {
    try {
      // جلب سجل الموافقة
      const consentRecord = await this.getConsentRecord(consentId);
      
      if (!consentRecord) {
        throw new Error('طلب الموافقة غير موجود');
      }
      
      // التحقق من حالة الطلب
      if (consentRecord.status !== 'pending') {
        throw new Error('تم الرد على هذا الطلب مسبقاً');
      }
      
      // التحقق من انتهاء الصلاحية
      if (new Date() > new Date(consentRecord.expiry_date)) {
        await this.markAsExpired(consentId);
        throw new Error('انتهت صلاحية طلب الموافقة');
      }
      
      // تحديث سجل الموافقة
      await this.updateConsentRecord(consentId, {
        status: response.approved ? 'approved' : 'rejected',
        guardian_signature: response.guardian_signature,
        consent_date: response.signed_at,
        response_notes: response.response_notes
      });
      
      // تحديث حالة الفيديو
      await this.updateVideoConsentStatus(
        consentRecord.video_id,
        response.approved
      );
      
      // إرسال إشعار تأكيد
      await this.sendConfirmationNotification(
        consentRecord.student_id,
        response.approved
      );
      
      // إذا تم الرفض، إيقاف معالجة الفيديو
      if (!response.approved) {
        await this.stopVideoProcessing(consentRecord.video_id);
      }
      
      return { success: true };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  private static async stopVideoProcessing(videoId: string): Promise<void> {
    await supabase
      .from('video_uploads')
      .update({
        processing_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);
  }
}
```

### نظام الإشعارات

```typescript
export class ConsentNotificationSystem {
  static async sendConsentRequest(
    guardianEmail: string,
    consentId: string,
    studentName: string,
    videoDetails: VideoDetails
  ): Promise<void> {
    const emailTemplate = this.generateEmailTemplate({
      guardianEmail,
      consentId,
      studentName,
      videoDetails,
      consentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/consent/${consentId}`
    });
    
    // إرسال البريد الإلكتروني
    await this.sendEmail(guardianEmail, emailTemplate);
    
    // إرسال رسالة نصية (اختياري)
    if (process.env.SMS_ENABLED === 'true') {
      await this.sendSMS(guardianPhone, this.generateSMSMessage(consentId));
    }
    
    // تسجيل الإشعار
    await this.logNotification({
      type: 'consent_request',
      recipient: guardianEmail,
      consent_id: consentId,
      status: 'sent'
    });
  }
  
  private static generateEmailTemplate(data: EmailTemplateData): EmailTemplate {
    return {
      to: data.guardianEmail,
      subject: 'طلب موافقة على تحليل فيديو رياضي - منصة حركة',
      html: `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>طلب موافقة - منصة حركة</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #2563eb; text-align: center;">منصة حركة</h1>
              <h2 style="color: #374151;">طلب موافقة على تحليل فيديو رياضي</h2>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p>السلام عليكم ورحمة الله وبركاته،</p>
              
              <p>نتواصل معكم بخصوص طلب موافقة على تحليل فيديو رياضي للطالب: <strong>${data.studentName}</strong></p>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h3>تفاصيل الطلب:</h3>
                <ul>
                  <li><strong>نوع الرياضة:</strong> ${data.videoDetails.sport_type}</li>
                  <li><strong>تاريخ الرفع:</strong> ${data.videoDetails.upload_date}</li>
                  <li><strong>الغرض:</strong> تحليل الأداء وتحسين المهارات الرياضية</li>
                </ul>
              </div>
              
              <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="color: #059669; margin-top: 0;">ما يتضمنه التحليل:</h4>
                <ul style="color: #047857;">
                  <li>تحليل الحركة والأداء الرياضي</li>
                  <li>استخراج المقاييس البيومكانيكية</li>
                  <li>إنتاج تقارير تحسين الأداء</li>
                  <li>مقارنة الأداء مع المعايير العامة</li>
                </ul>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="color: #d97706; margin-top: 0;">حماية البيانات:</h4>
                <ul style="color: #92400e;">
                  <li>البيانات المستخرجة ستُستخدم لتحسين أداء الطالب فقط</li>
                  <li>لن يتم مشاركة الفيديو مع أطراف خارجية</li>
                  <li>يمكن حذف البيانات في أي وقت بناءً على طلبكم</li>
                  <li>البيانات محمية وفقاً لمعايير الأمان العالمية</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.consentUrl}" 
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  مراجعة الطلب والرد عليه
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280;">
                <strong>ملاحظة:</strong> هذا الطلب صالح لمدة 30 يوماً من تاريخ الإرسال.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
              <p>منصة حركة - تحليل الحركة الرياضية بالذكاء الاصطناعي</p>
              <p>للاستفسارات: support@haraka.sa | +966-11-123-4567</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
}
```

---

*هذا جزء من الوثائق التقنية الشاملة. الوثيقة الكاملة تحتوي على تفاصيل إضافية حول المراقبة، النشر، وإدارة الأخطاء.*

**آخر تحديث**: أكتوبر 2025  
**الإصدار**: 1.0