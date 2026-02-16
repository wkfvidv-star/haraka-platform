# منصة حركة - Haraka Platform 🏃‍♂️

## نظرة عامة

منصة حركة هي نظام متطور لتحليل الأداء الحركي للطلاب باستخدام تقنيات الذكاء الاصطناعي وتحليل الفيديو. تهدف المنصة إلى تقييم وتحسين الأداء البدني للطلاب من خلال تحليل دقيق للحركة والتوازن والسرعة.

## المميزات الرئيسية ✨

- **تحليل الفيديو بالذكاء الاصطناعي**: تحليل تلقائي لحركة الطلاب
- **تقييم شامل**: قياس التوازن، السرعة، الدقة، التنسيق، المرونة، والتحمل
- **تقارير مفصلة**: إنشاء تقارير شاملة للأداء مع توصيات للتحسين
- **لوحة تحكم تفاعلية**: واجهة سهلة الاستخدام للمعلمين والإداريين
- **نظام إشعارات ذكي**: تنبيهات تلقائية للأداء المنخفض أو المتميز
- **تكامل مع Supabase**: قاعدة بيانات سحابية موثوقة وآمنة

## التقنيات المستخدمة 🛠️

### Frontend
- **React 18** مع TypeScript
- **Tailwind CSS** للتصميم
- **Shadcn/ui** للمكونات
- **React Query** لإدارة البيانات
- **React Hook Form** للنماذج
- **Recharts** للرسوم البيانية

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Node.js** مع Express للـ API
- **TypeScript** للأمان والوضوح
- **JWT** للمصادقة
- **Multer** لرفع الملفات

### قاعدة البيانات
- **PostgreSQL** عبر Supabase
- **Row Level Security (RLS)** للأمان
- **Real-time subscriptions** للتحديثات الفورية

## متطلبات النظام 📋

### المتطلبات الأساسية
- **Node.js** 18.0.0 أو أحدث
- **npm** أو **yarn** أو **pnpm**
- **Git**
- حساب **Supabase** (مجاني أو مدفوع)

### المتطلبات الاختيارية
- **Docker** للتشغيل المحلي
- **Redis** للكاش (اختياري)
- **Nginx** للإنتاج

## التثبيت والإعداد 🚀

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-org/haraka-platform.git
cd haraka-platform
```

### 2. تثبيت التبعيات

```bash
# باستخدام npm
npm install

# أو باستخدام yarn
yarn install

# أو باستخدام pnpm
pnpm install
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف البيئة النموذجي
cp .env.example .env.local

# تحرير الملف وإضافة القيم المطلوبة
nano .env.local
```

### 4. إعداد Supabase

#### 4.1 إنشاء مشروع جديد
1. انتقل إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. أنشئ مشروع جديد
3. احصل على URL و API Keys من إعدادات المشروع

#### 4.2 إعداد قاعدة البيانات
```bash
# تشغيل migrations لإنشاء الجداول
npm run db:setup

# أو يدوياً عبر SQL Editor في Supabase
# انسخ محتوى ملفات database/schemas/*.sql
```

#### 4.3 إعداد Storage Buckets
```bash
# تشغيل سكريبت إعداد التخزين
npm run storage:setup
```

### 5. تشغيل المشروع

#### التطوير المحلي
```bash
# تشغيل الخادم المحلي
npm run dev

# أو
yarn dev

# أو
pnpm dev
```

#### الإنتاج
```bash
# بناء المشروع
npm run build

# تشغيل الإنتاج
npm start
```

#### باستخدام Docker
```bash
# بناء وتشغيل الحاويات
docker-compose up -d

# للتطوير
docker-compose -f docker-compose.dev.yml up -d
```

## إعداد متغيرات البيئة 🔧

### ملف .env.local (للتطوير)

```env
# معلومات التطبيق
NEXT_PUBLIC_APP_NAME="منصة حركة"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV="development"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# قاعدة البيانات
DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"

# الأمان
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# التخزين
NEXT_PUBLIC_MAX_FILE_SIZE="104857600"
NEXT_PUBLIC_ALLOWED_FILE_TYPES="video/mp4,video/quicktime,video/x-msvideo"

# الإشعارات (اختياري)
EMAIL_FROM="noreply@haraka.local"
SMTP_HOST="localhost"
SMTP_PORT="587"

# التحليلات (اختياري)
NEXT_PUBLIC_ANALYTICS_ID=""
SENTRY_DSN=""

# Redis (اختياري)
REDIS_URL="redis://localhost:6379"
```

### ملف .env.production (للإنتاج)

```env
# معلومات التطبيق
NEXT_PUBLIC_APP_NAME="منصة حركة"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV="production"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# قاعدة البيانات
DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"

# الأمان
NEXTAUTH_SECRET="your-secure-nextauth-secret"
NEXTAUTH_URL="https://haraka.edu.sa"

# التخزين
NEXT_PUBLIC_MAX_FILE_SIZE="209715200"
NEXT_PUBLIC_ALLOWED_FILE_TYPES="video/mp4,video/quicktime,video/x-msvideo"

# الإشعارات
EMAIL_FROM="noreply@haraka.edu.sa"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"

# التحليلات
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# Redis
REDIS_URL="redis://redis:6379"

# SSL (للإنتاج)
ENABLE_HTTPS="true"
SSL_CERT_PATH="/etc/ssl/certs/haraka.crt"
SSL_KEY_PATH="/etc/ssl/private/haraka.key"
```

## هيكل المشروع 📁

```
haraka-platform/
├── src/
│   ├── components/          # مكونات React
│   │   ├── ui/             # مكونات أساسية
│   │   ├── forms/          # نماذج
│   │   ├── charts/         # رسوم بيانية
│   │   └── layout/         # تخطيط الصفحات
│   ├── pages/              # صفحات التطبيق
│   ├── hooks/              # React Hooks مخصصة
│   ├── services/           # خدمات API
│   ├── utils/              # دوال مساعدة
│   ├── types/              # تعريفات TypeScript
│   └── styles/             # ملفات CSS
├── database/
│   ├── schemas/            # SQL schemas
│   ├── migrations/         # Database migrations
│   └── seeds/              # بيانات تجريبية
├── api/
│   ├── endpoints/          # API endpoints
│   ├── middleware/         # Express middleware
│   └── utils/              # دوال مساعدة للـ API
├── docs/                   # التوثيق
├── tests/                  # الاختبارات
├── public/                 # ملفات عامة
├── docker-compose.yml      # Docker configuration
├── package.json
└── README.md
```

## الأوامر المتاحة 📝

### أوامر التطوير
```bash
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل الإنتاج
npm run lint         # فحص الكود
npm run type-check   # فحص TypeScript
```

### أوامر قاعدة البيانات
```bash
npm run db:setup     # إعداد قاعدة البيانات
npm run db:migrate   # تشغيل migrations
npm run db:seed      # إضافة بيانات تجريبية
npm run db:reset     # إعادة تعيين قاعدة البيانات
```

### أوامر Supabase
```bash
npm run supabase:start    # تشغيل Supabase محلياً
npm run supabase:stop     # إيقاف Supabase
npm run supabase:reset    # إعادة تعيين Supabase
npm run supabase:deploy   # نشر التغييرات
```

### أوامر الاختبار
```bash
npm run test         # تشغيل الاختبارات
npm run test:watch   # تشغيل الاختبارات مع المراقبة
npm run test:coverage # تقرير التغطية
```

## استخدام المنصة 👥

### للمعلمين
1. **تسجيل الدخول** باستخدام بيانات الاعتماد
2. **إضافة طلاب** جدد أو إدارة الطلاب الحاليين
3. **رفع فيديوهات** التمارين للتحليل
4. **مراجعة التقارير** والنتائج
5. **إضافة ملاحظات** وتوصيات للتحسين

### للإداريين
1. **لوحة التحكم** لمراقبة الأداء العام
2. **إدارة المستخدمين** والصلاحيات
3. **تقارير شاملة** على مستوى المدرسة
4. **إعدادات النظام** والتخصيص

### للطلاب (اختياري)
1. **عرض النتائج** الشخصية
2. **تتبع التقدم** عبر الزمن
3. **التوصيات** للتحسين

## API Documentation 📚

جميع API endpoints موثقة بالتفصيل في:
- **Swagger UI**: `/api/docs` (في بيئة التطوير)
- **ملف OpenAPI**: `docs/api-spec.yaml`
- **Postman Collection**: `docs/haraka-api.postman_collection.json`

### أهم الـ Endpoints

#### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/me` - معلومات المستخدم الحالي

#### الطلاب
- `GET /api/students` - قائمة الطلاب
- `POST /api/students` - إضافة طالب جديد
- `GET /api/students/:id` - معلومات طالب محدد
- `PUT /api/students/:id` - تحديث معلومات طالب
- `DELETE /api/students/:id` - حذف طالب

#### التحليلات
- `POST /api/analyses` - إنشاء تحليل جديد
- `GET /api/analyses` - قائمة التحليلات
- `GET /api/analyses/:id` - تحليل محدد
- `PUT /api/analyses/:id` - تحديث تحليل

#### التقارير
- `GET /api/reports/student/:id` - تقرير طالب
- `GET /api/reports/class/:name` - تقرير صف
- `GET /api/reports/school` - تقرير المدرسة
- `POST /api/reports/export` - تصدير تقرير

## الأمان 🔒

### المصادقة والتفويض
- **JWT Tokens** للمصادقة
- **Row Level Security (RLS)** في Supabase
- **Role-based Access Control** للصلاحيات
- **API Rate Limiting** لمنع الإساءة

### حماية البيانات
- **تشفير البيانات** الحساسة
- **HTTPS إجباري** في الإنتاج
- **تدقيق العمليات** وتسجيل الأنشطة
- **نسخ احتياطية** منتظمة

### أفضل الممارسات
- **تحديث التبعيات** بانتظام
- **فحص الثغرات الأمنية**
- **مراجعة الكود** قبل النشر
- **اختبار الأمان** الدوري

## الاختبار 🧪

### أنواع الاختبارات
- **Unit Tests** للدوال والمكونات
- **Integration Tests** للـ API
- **E2E Tests** للتدفقات الكاملة
- **Performance Tests** للأداء

### تشغيل الاختبارات
```bash
# جميع الاختبارات
npm test

# اختبارات محددة
npm test -- --testPathPattern=components

# اختبارات E2E
npm run test:e2e

# اختبار الأداء
npm run test:performance
```

## النشر 🚀

### بيئة التطوير
```bash
# تشغيل محلي
npm run dev
```

### بيئة الاختبار
```bash
# نشر على Vercel
vercel --prod

# أو Netlify
netlify deploy --prod
```

### بيئة الإنتاج
```bash
# باستخدام Docker
docker-compose -f docker-compose.prod.yml up -d

# أو على خادم
npm run build
pm2 start ecosystem.config.js
```

## استكشاف الأخطاء 🔧

### مشاكل شائعة

#### خطأ في الاتصال بـ Supabase
```bash
# فحص متغيرات البيئة
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# اختبار الاتصال
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

#### مشاكل رفع الملفات
- تأكد من إعداد Storage Buckets في Supabase
- فحص صلاحيات RLS للـ Storage
- تأكد من حجم الملف ونوعه المسموح

#### مشاكل الأداء
- فعل Redis للكاش
- تحسين استعلامات قاعدة البيانات
- ضغط الصور والفيديوهات

### السجلات والمراقبة
```bash
# سجلات التطبيق
npm run logs

# مراقبة الأداء
npm run monitor

# فحص الصحة
curl http://localhost:3000/api/health
```

## المساهمة 🤝

### إرشادات المساهمة
1. **Fork** المشروع
2. إنشاء **branch** جديد للميزة
3. **Commit** التغييرات مع رسائل واضحة
4. **Push** إلى الـ branch
5. إنشاء **Pull Request**

### معايير الكود
- استخدام **TypeScript** للأمان
- اتباع **ESLint** و **Prettier** rules
- كتابة **اختبارات** للميزات الجديدة
- **توثيق** الدوال والمكونات

## الدعم والمساعدة 📞

### قنوات الدعم
- **GitHub Issues**: للأخطاء والميزات الجديدة
- **البريد الإلكتروني**: support@haraka.edu.sa
- **التوثيق**: [docs.haraka.edu.sa](https://docs.haraka.edu.sa)

### الموارد المفيدة
- [دليل Supabase](https://supabase.com/docs)
- [توثيق React](https://react.dev)
- [دليل Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## الترخيص 📄

هذا المشروع مرخص تحت رخصة MIT. انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الشكر والتقدير 🙏

- فريق تطوير منصة حركة
- مجتمع المطورين المفتوح المصدر
- جامعة الملك سعود - كلية علوم الحاسب
- وزارة التعليم - المملكة العربية السعودية

---

**📅 آخر تحديث**: 8 أكتوبر 2024  
**📝 الإصدار**: 1.0.0  
**👨‍💻 المطور**: فريق تطوير منصة حركة

---

## روابط سريعة 🔗

- [🏠 الصفحة الرئيسية](https://haraka.edu.sa)
- [📚 التوثيق الكامل](https://docs.haraka.edu.sa)
- [🐛 الإبلاغ عن خطأ](https://github.com/your-org/haraka-platform/issues)
- [💡 طلب ميزة جديدة](https://github.com/your-org/haraka-platform/discussions)
- [📧 التواصل معنا](mailto:support@haraka.edu.sa)

**🎉 شكراً لاستخدام منصة حركة!**