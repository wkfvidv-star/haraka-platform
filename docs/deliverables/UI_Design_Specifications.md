# مواصفات التصميم للواجهات (UI Design Specifications)

## نظرة عامة
هذا المستند يحتوي على مواصفات التصميم الشاملة لمنصة تتبع اللياقة البدنية، مع تصاميم مخصصة لكل دور من أدوار المستخدمين.

## الأدوار والواجهات

### 1. واجهة الطالب (Student Interface)
**الألوان الأساسية:**
- اللون الأساسي: #3B82F6 (أزرق)
- اللون الثانوي: #10B981 (أخضر)
- لون التحذير: #F59E0B (برتقالي)
- لون الخطر: #EF4444 (أحمر)

**المكونات الرئيسية:**
- لوحة التحكم الرئيسية مع KPIs
- شاشة إدارة الأجهزة
- عرض البيانات الصحية (نشاط، نوم، BIA)
- نظام الحجوزات
- المسابقات والتحديات
- الرسائل والإشعارات

**خصائص التصميم:**
- تصميم متجاوب (Mobile-first)
- دعم RTL للغة العربية
- أيقونات واضحة ومفهومة
- ألوان متباينة للوضوح
- خطوط عربية واضحة (Tajawal, Cairo)

### 2. واجهة ولي الأمر (Parent Interface)
**الألوان الأساسية:**
- اللون الأساسي: #8B5CF6 (بنفسجي)
- اللون الثانوي: #06B6D4 (سماوي)
- لون المعلومات: #3B82F6 (أزرق)

**المكونات الرئيسية:**
- ملخص أداء الطفل
- التقارير والإحصائيات
- الرسائل من المدرسة
- إعدادات الخصوصية والموافقة
- جدولة المواعيد

### 3. واجهة المعلم (Teacher Interface)
**الألوان الأساسية:**
- اللون الأساسي: #059669 (أخضر داكن)
- اللون الثانوي: #DC2626 (أحمر)
- لون النجاح: #10B981 (أخضر)

**المكونات الرئيسية:**
- إدارة الصفوف والطلاب
- تتبع الأداء الجماعي
- إنشاء التقارير
- نظام الرسائل
- إدارة المهام والواجبات

### 4. واجهة المدرب (Coach Interface)
**الألوان الأساسية:**
- اللون الأساسي: #EA580C (برتقالي)
- اللون الثانوي: #7C2D12 (بني)
- لون التدريب: #F59E0B (ذهبي)

**المكونات الرئيسية:**
- جدولة الحصص التدريبية
- تتبع الأداء الفردي
- إدارة البرامج التدريبية
- تحليل البيانات البيومترية
- نظام التقييم والمتابعة

### 5. واجهة مدير المدرسة (Principal Interface)
**الألوان الأساسية:**
- اللون الأساسي: #1E40AF (أزرق داكن)
- اللون الثانوي: #7C2D12 (بني)
- لون الإدارة: #374151 (رمادي)

**المكونات الرئيسية:**
- لوحة تحكم إدارية شاملة
- إحصائيات المدرسة
- إدارة الموارد والمعدات
- التقارير الرسمية
- نظام الموافقات

### 6. واجهة مديرية التعليم (Directorate Interface)
**الألوان الأساسية:**
- اللون الأساسي: #7C2D12 (بني)
- اللون الثانوي: #1E40AF (أزرق داكن)
- لون الحكومة: #374151 (رمادي داكن)

**المكونات الرئيسية:**
- خريطة الولايات والمدارس
- إحصائيات إقليمية
- التقارير الحكومية
- إدارة الميزانيات
- نظام المراقبة والتدقيق

## مواصفات تقنية للتصميم

### الشبكة والتخطيط (Grid System)
```css
/* نظام الشبكة الأساسي */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* استجابة للشاشات */
@media (max-width: 768px) {
  .grid-cols-2, .grid-cols-3, .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
```

### الخطوط (Typography)
```css
/* الخطوط العربية */
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;900&display=swap');

.font-primary {
  font-family: 'Tajawal', sans-serif;
}

.font-secondary {
  font-family: 'Cairo', sans-serif;
}

/* أحجام الخطوط */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
```

### المكونات الأساسية (Components)

#### البطاقات (Cards)
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 24px;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}
```

#### الأزرار (Buttons)
```css
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #3B82F6;
  color: white;
}

.btn-primary:hover {
  background: #2563EB;
}

.btn-secondary {
  background: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.btn-secondary:hover {
  background: #E5E7EB;
}
```

### دعم RTL
```css
/* دعم الكتابة من اليمين لليسار */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse;
}

[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}
```

## إرشادات التصدير لـ Figma

### هيكل الملفات
```
/Design Files
├── Student_Interface.fig
├── Parent_Interface.fig
├── Teacher_Interface.fig
├── Coach_Interface.fig
├── Principal_Interface.fig
├── Directorate_Interface.fig
├── Shared_Components.fig
├── Icons_Library.fig
└── Color_Palette.fig
```

### مكونات قابلة للإعادة الاستخدام
- نظام الألوان الموحد
- مكتبة الأيقونات
- مكونات الواجهة الأساسية
- أنماط النصوص
- شبكة التخطيط

### متغيرات التصميم
```figma
/* متغيرات الألوان */
Primary Colors:
- Student: #3B82F6
- Parent: #8B5CF6
- Teacher: #059669
- Coach: #EA580C
- Principal: #1E40AF
- Directorate: #7C2D12

/* متغيرات المسافات */
Spacing:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

/* متغيرات الخطوط */
Font Sizes:
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
```

## قائمة التحقق للتصميم

### ✅ المتطلبات الأساسية
- [ ] دعم كامل للغة العربية (RTL)
- [ ] تصميم متجاوب لجميع الأجهزة
- [ ] نظام ألوان متسق لكل دور
- [ ] إمكانية الوصول (WCAG 2.1 AA)
- [ ] مكونات قابلة للإعادة الاستخدام

### ✅ التفاعل والحركة
- [ ] انتقالات سلسة بين الصفحات
- [ ] تأثيرات hover واضحة
- [ ] حالات التحميل والانتظار
- [ ] رسائل النجاح والخطأ
- [ ] إشعارات فورية

### ✅ الأداء والتحسين
- [ ] تحسين الصور والأيقونات
- [ ] استخدام SVG للرسوميات
- [ ] تحميل تدريجي للمحتوى
- [ ] ضغط ملفات CSS/JS
- [ ] استخدام خطوط ويب محسنة

## ملاحظات التطوير

### أولويات التطوير
1. **المرحلة الأولى**: واجهة الطالب والمعلم
2. **المرحلة الثانية**: واجهة ولي الأمر والمدرب
3. **المرحلة الثالثة**: واجهة الإدارة والمديرية

### اعتبارات تقنية
- استخدام React مع TypeScript
- مكتبة UI: shadcn/ui
- إدارة الحالة: Zustand أو Redux Toolkit
- التوجيه: React Router
- التصميم: Tailwind CSS

### اختبار التصميم
- اختبار على أجهزة مختلفة
- اختبار مع مستخدمين حقيقيين
- اختبار إمكانية الوصول
- اختبار الأداء
- اختبار التوافق مع المتصفحات