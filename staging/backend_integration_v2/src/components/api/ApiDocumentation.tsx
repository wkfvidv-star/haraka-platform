import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Code,
  Globe,
  Zap,
  Database,
  Users,
  Activity,
  Moon,
  Calendar,
  Mail,
  Trophy,
  ShoppingCart,
  FileText,
  Webhook,
  Smartphone,
  Heart,
  Copy,
  Play,
  Settings,
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  category: string;
  authentication: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  example: {
    request?: string;
    response: string;
  };
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface RequestBody {
  type: string;
  schema: string;
  example: string;
}

interface Response {
  status: number;
  description: string;
  schema?: string;
}

interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  payload: string;
  triggers: string[];
  example: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'coming_soon' | 'beta';
  icon: React.ReactNode;
  features: string[];
  setup: string[];
}

export function ApiDocumentation() {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);

  const [apiEndpoints] = useState<ApiEndpoint[]>([
    // User Management
    {
      id: 'get_users',
      method: 'GET',
      path: '/api/v1/users',
      title: 'قائمة المستخدمين',
      description: 'الحصول على قائمة بجميع المستخدمين مع إمكانية الفلترة',
      category: 'users',
      authentication: true,
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'رقم الصفحة', example: '1' },
        { name: 'limit', type: 'integer', required: false, description: 'عدد النتائج في الصفحة', example: '20' },
        { name: 'role', type: 'string', required: false, description: 'فلترة حسب الدور', example: 'student' },
        { name: 'school_id', type: 'string', required: false, description: 'فلترة حسب المدرسة', example: 'school_123' }
      ],
      responses: [
        { status: 200, description: 'قائمة المستخدمين بنجاح' },
        { status: 401, description: 'غير مصرح' },
        { status: 403, description: 'ممنوع' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "user_123",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "role": "student",
      "school_id": "school_123",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1247,
    "pages": 63
  }
}`
      }
    },
    {
      id: 'create_user',
      method: 'POST',
      path: '/api/v1/users',
      title: 'إنشاء مستخدم جديد',
      description: 'إنشاء حساب مستخدم جديد في النظام',
      category: 'users',
      authentication: true,
      requestBody: {
        type: 'application/json',
        schema: 'CreateUserRequest',
        example: `{
  "name": "فاطمة علي",
  "email": "fatima@example.com",
  "password": "SecurePassword123!",
  "role": "student",
  "school_id": "school_123",
  "parent_email": "parent@example.com"
}`
      },
      responses: [
        { status: 201, description: 'تم إنشاء المستخدم بنجاح' },
        { status: 400, description: 'بيانات غير صحيحة' },
        { status: 409, description: 'المستخدم موجود مسبقاً' }
      ],
      example: {
        request: `{
  "name": "فاطمة علي",
  "email": "fatima@example.com",
  "password": "SecurePassword123!",
  "role": "student",
  "school_id": "school_123"
}`,
        response: `{
  "data": {
    "id": "user_456",
    "name": "فاطمة علي",
    "email": "fatima@example.com",
    "role": "student",
    "school_id": "school_123",
    "created_at": "2024-10-02T14:30:00Z"
  }
}`
      }
    },
    // Device Management
    {
      id: 'get_devices',
      method: 'GET',
      path: '/api/v1/devices',
      title: 'قائمة الأجهزة',
      description: 'الحصول على قائمة الأجهزة المقترنة',
      category: 'devices',
      authentication: true,
      parameters: [
        { name: 'user_id', type: 'string', required: false, description: 'فلترة حسب المستخدم', example: 'user_123' },
        { name: 'status', type: 'string', required: false, description: 'حالة الجهاز', example: 'active' },
        { name: 'type', type: 'string', required: false, description: 'نوع الجهاز', example: 'fitness_tracker' }
      ],
      responses: [
        { status: 200, description: 'قائمة الأجهزة بنجاح' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "device_123",
      "name": "Mi Band 7",
      "type": "fitness_tracker",
      "brand": "Xiaomi",
      "user_id": "user_123",
      "status": "active",
      "battery_level": 85,
      "last_sync": "2024-10-02T14:30:00Z"
    }
  ]
}`
      }
    },
    {
      id: 'pair_device',
      method: 'POST',
      path: '/api/v1/devices/pair',
      title: 'اقتران جهاز جديد',
      description: 'اقتران جهاز لياقة بدنية جديد مع المستخدم',
      category: 'devices',
      authentication: true,
      requestBody: {
        type: 'application/json',
        schema: 'PairDeviceRequest',
        example: `{
  "device_id": "xiaomi_miband7_abc123",
  "device_name": "Mi Band 7",
  "device_type": "fitness_tracker",
  "brand": "Xiaomi"
}`
      },
      responses: [
        { status: 201, description: 'تم اقتران الجهاز بنجاح' },
        { status: 400, description: 'بيانات الجهاز غير صحيحة' },
        { status: 409, description: 'الجهاز مقترن مسبقاً' }
      ],
      example: {
        response: `{
  "data": {
    "id": "device_456",
    "name": "Mi Band 7",
    "status": "paired",
    "pairing_code": "ABC123",
    "expires_at": "2024-10-02T15:00:00Z"
  }
}`
      }
    },
    // Activity Data
    {
      id: 'get_activity',
      method: 'GET',
      path: '/api/v1/activity/{user_id}',
      title: 'بيانات النشاط',
      description: 'الحصول على بيانات النشاط البدني للمستخدم',
      category: 'activity',
      authentication: true,
      parameters: [
        { name: 'user_id', type: 'string', required: true, description: 'معرف المستخدم', example: 'user_123' },
        { name: 'date_from', type: 'string', required: false, description: 'تاريخ البداية', example: '2024-10-01' },
        { name: 'date_to', type: 'string', required: false, description: 'تاريخ النهاية', example: '2024-10-07' },
        { name: 'type', type: 'string', required: false, description: 'نوع النشاط', example: 'steps,calories,distance' }
      ],
      responses: [
        { status: 200, description: 'بيانات النشاط بنجاح' }
      ],
      example: {
        response: `{
  "data": {
    "user_id": "user_123",
    "period": {
      "from": "2024-10-01",
      "to": "2024-10-07"
    },
    "activities": [
      {
        "date": "2024-10-01",
        "steps": 8500,
        "calories": 2100,
        "distance": 6.2,
        "active_minutes": 45
      }
    ],
    "summary": {
      "total_steps": 65000,
      "avg_steps": 9285,
      "total_calories": 16800,
      "total_distance": 48.5
    }
  }
}`
      }
    },
    // Sleep Data
    {
      id: 'get_sleep',
      method: 'GET',
      path: '/api/v1/sleep/{user_id}',
      title: 'بيانات النوم',
      description: 'الحصول على بيانات النوم والراحة',
      category: 'sleep',
      authentication: true,
      parameters: [
        { name: 'user_id', type: 'string', required: true, description: 'معرف المستخدم', example: 'user_123' },
        { name: 'date_from', type: 'string', required: false, description: 'تاريخ البداية', example: '2024-10-01' },
        { name: 'date_to', type: 'string', required: false, description: 'تاريخ النهاية', example: '2024-10-07' }
      ],
      responses: [
        { status: 200, description: 'بيانات النوم بنجاح' }
      ],
      example: {
        response: `{
  "data": {
    "user_id": "user_123",
    "sleep_records": [
      {
        "date": "2024-10-01",
        "bedtime": "23:30:00",
        "wake_time": "07:00:00",
        "total_sleep": 450,
        "deep_sleep": 120,
        "light_sleep": 280,
        "rem_sleep": 50,
        "sleep_quality": 85
      }
    ]
  }
}`
      }
    },
    // BIA Data
    {
      id: 'get_bia',
      method: 'GET',
      path: '/api/v1/bia/{user_id}',
      title: 'بيانات تحليل الجسم',
      description: 'الحصول على بيانات تحليل تركيب الجسم (BIA)',
      category: 'bia',
      authentication: true,
      parameters: [
        { name: 'user_id', type: 'string', required: true, description: 'معرف المستخدم', example: 'user_123' }
      ],
      responses: [
        { status: 200, description: 'بيانات BIA بنجاح' }
      ],
      example: {
        response: `{
  "data": {
    "user_id": "user_123",
    "measurements": [
      {
        "date": "2024-10-01",
        "weight": 65.5,
        "body_fat_percentage": 18.5,
        "muscle_mass": 28.2,
        "bone_mass": 2.8,
        "water_percentage": 58.3,
        "bmr": 1450,
        "visceral_fat": 5
      }
    ]
  }
}`
      }
    },
    // Bookings
    {
      id: 'get_bookings',
      method: 'GET',
      path: '/api/v1/bookings',
      title: 'قائمة الحجوزات',
      description: 'الحصول على قائمة الحجوزات والمواعيد',
      category: 'bookings',
      authentication: true,
      parameters: [
        { name: 'user_id', type: 'string', required: false, description: 'فلترة حسب المستخدم', example: 'user_123' },
        { name: 'status', type: 'string', required: false, description: 'حالة الحجز', example: 'confirmed' },
        { name: 'date_from', type: 'string', required: false, description: 'تاريخ البداية', example: '2024-10-01' }
      ],
      responses: [
        { status: 200, description: 'قائمة الحجوزات بنجاح' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "booking_123",
      "user_id": "user_123",
      "coach_id": "coach_456",
      "session_type": "personal_training",
      "date": "2024-10-06",
      "time": "16:00:00",
      "duration": 60,
      "status": "confirmed",
      "location": "صالة الألعاب الرياضية"
    }
  ]
}`
      }
    },
    // Messages
    {
      id: 'get_messages',
      method: 'GET',
      path: '/api/v1/messages',
      title: 'قائمة الرسائل',
      description: 'الحصول على رسائل المستخدم',
      category: 'messages',
      authentication: true,
      parameters: [
        { name: 'folder', type: 'string', required: false, description: 'مجلد الرسائل', example: 'inbox' },
        { name: 'unread_only', type: 'boolean', required: false, description: 'الرسائل غير المقروءة فقط', example: 'true' }
      ],
      responses: [
        { status: 200, description: 'قائمة الرسائل بنجاح' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "message_123",
      "subject": "تقرير الأداء الشهري",
      "sender": {
        "id": "teacher_456",
        "name": "أ. محمد أحمد",
        "role": "teacher"
      },
      "content": "تقرير أداء الطالب لشهر سبتمبر...",
      "is_read": false,
      "created_at": "2024-10-02T14:30:00Z"
    }
  ]
}`
      }
    },
    // Competitions
    {
      id: 'get_competitions',
      method: 'GET',
      path: '/api/v1/competitions',
      title: 'قائمة المسابقات',
      description: 'الحصول على المسابقات المتاحة',
      category: 'competitions',
      authentication: true,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'حالة المسابقة', example: 'active' },
        { name: 'category', type: 'string', required: false, description: 'فئة المسابقة', example: 'fitness' }
      ],
      responses: [
        { status: 200, description: 'قائمة المسابقات بنجاح' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "competition_123",
      "name": "مسابقة اللياقة البدنية الوطنية",
      "description": "مسابقة شاملة للياقة البدنية...",
      "start_date": "2024-11-01",
      "end_date": "2024-11-30",
      "status": "active",
      "participants_count": 1247,
      "prizes": ["ميدالية ذهبية", "شهادة تقدير"]
    }
  ]
}`
      }
    },
    // Store
    {
      id: 'get_store_items',
      method: 'GET',
      path: '/api/v1/store/items',
      title: 'عناصر المتجر',
      description: 'الحصول على المنتجات المتاحة في المتجر',
      category: 'store',
      authentication: true,
      parameters: [
        { name: 'category', type: 'string', required: false, description: 'فئة المنتج', example: 'fitness_equipment' },
        { name: 'price_min', type: 'number', required: false, description: 'الحد الأدنى للسعر', example: '100' },
        { name: 'price_max', type: 'number', required: false, description: 'الحد الأقصى للسعر', example: '1000' }
      ],
      responses: [
        { status: 200, description: 'قائمة المنتجات بنجاح' }
      ],
      example: {
        response: `{
  "data": [
    {
      "id": "item_123",
      "name": "Mi Band 7",
      "description": "ساعة ذكية للياقة البدنية...",
      "price": 299.99,
      "currency": "DZD",
      "category": "fitness_equipment",
      "in_stock": true,
      "images": ["image1.jpg", "image2.jpg"]
    }
  ]
}`
      }
    },
    // Reports
    {
      id: 'generate_report',
      method: 'POST',
      path: '/api/v1/reports/generate',
      title: 'توليد تقرير',
      description: 'توليد تقرير مخصص',
      category: 'reports',
      authentication: true,
      requestBody: {
        type: 'application/json',
        schema: 'GenerateReportRequest',
        example: `{
  "type": "fitness_progress",
  "format": "pdf",
  "date_range": {
    "from": "2024-09-01",
    "to": "2024-09-30"
  },
  "filters": {
    "user_ids": ["user_123", "user_456"],
    "school_id": "school_123"
  }
}`
      },
      responses: [
        { status: 202, description: 'تم بدء توليد التقرير' },
        { status: 400, description: 'معاملات غير صحيحة' }
      ],
      example: {
        response: `{
  "data": {
    "report_id": "report_789",
    "status": "generating",
    "estimated_completion": "2024-10-02T15:00:00Z",
    "download_url": null
  }
}`
      }
    }
  ]);

  const [webhookEvents] = useState<WebhookEvent[]>([
    {
      id: 'booking_confirmed',
      name: 'تأكيد الحجز',
      description: 'يتم إرسال هذا الحدث عند تأكيد حجز جلسة تدريبية',
      triggers: ['booking.confirmed', 'booking.updated'],
      payload: 'BookingConfirmedPayload',
      example: `{
  "event": "booking.confirmed",
  "timestamp": "2024-10-02T14:30:00Z",
  "data": {
    "booking_id": "booking_123",
    "user_id": "user_123",
    "coach_id": "coach_456",
    "session_date": "2024-10-06T16:00:00Z",
    "status": "confirmed"
  }
}`
    },
    {
      id: 'device_sync',
      name: 'مزامنة الجهاز',
      description: 'يتم إرسال هذا الحدث عند مزامنة بيانات جهاز اللياقة البدنية',
      triggers: ['device.sync_completed', 'device.sync_failed'],
      payload: 'DeviceSyncPayload',
      example: `{
  "event": "device.sync_completed",
  "timestamp": "2024-10-02T14:30:00Z",
  "data": {
    "device_id": "device_123",
    "user_id": "user_123",
    "sync_status": "success",
    "data_points": 1250,
    "last_sync": "2024-10-02T14:30:00Z"
  }
}`
    },
    {
      id: 'competition_result',
      name: 'نتيجة المسابقة',
      description: 'يتم إرسال هذا الحدث عند إعلان نتائج المسابقة',
      triggers: ['competition.result_published', 'competition.winner_announced'],
      payload: 'CompetitionResultPayload',
      example: `{
  "event": "competition.result_published",
  "timestamp": "2024-10-02T14:30:00Z",
  "data": {
    "competition_id": "competition_123",
    "user_id": "user_123",
    "rank": 2,
    "score": 95.5,
    "total_participants": 150
  }
}`
    }
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: 'google_fit',
      name: 'Google Fit',
      description: 'مزامنة البيانات مع Google Fit لأجهزة Android',
      status: 'available',
      icon: <Smartphone className="h-5 w-5" />,
      features: [
        'مزامنة تلقائية للخطوات والسعرات',
        'تتبع النشاط البدني',
        'بيانات معدل ضربات القلب',
        'إحصائيات التمرين'
      ],
      setup: [
        'تفعيل Google Fit API',
        'إعداد OAuth 2.0',
        'ربط الحساب',
        'تكوين المزامنة'
      ]
    },
    {
      id: 'apple_health',
      name: 'Apple Health',
      description: 'تكامل مع تطبيق الصحة في iOS',
      status: 'available',
      icon: <Heart className="h-5 w-5" />,
      features: [
        'مزامنة بيانات الصحة',
        'تتبع النشاط والتمارين',
        'بيانات النوم والراحة',
        'المؤشرات الحيوية'
      ],
      setup: [
        'تفعيل HealthKit',
        'طلب الأذونات',
        'تكوين البيانات المطلوبة',
        'اختبار المزامنة'
      ]
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'ربط مع أجهزة وخدمات Fitbit',
      status: 'beta',
      icon: <Activity className="h-5 w-5" />,
      features: [
        'بيانات الأجهزة المتقدمة',
        'تحليل النوم المفصل',
        'مراقبة معدل ضربات القلب',
        'تتبع التمارين'
      ],
      setup: [
        'تسجيل تطبيق Fitbit',
        'إعداد OAuth',
        'ربط الحساب',
        'تكوين المزامنة'
      ]
    },
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      description: 'تكامل مع منصة Samsung Health',
      status: 'coming_soon',
      icon: <Smartphone className="h-5 w-5" />,
      features: [
        'بيانات شاملة للصحة',
        'تتبع التغذية',
        'مراقبة الضغط والسكر',
        'تحليل الإجهاد'
      ],
      setup: [
        'انتظار الموافقة من Samsung',
        'إعداد SDK',
        'تطوير التكامل',
        'اختبار شامل'
      ]
    }
  ]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'users': return <Users className="h-4 w-4" />;
      case 'devices': return <Smartphone className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'bia': return <Heart className="h-4 w-4" />;
      case 'bookings': return <Calendar className="h-4 w-4" />;
      case 'messages': return <Mail className="h-4 w-4" />;
      case 'competitions': return <Trophy className="h-4 w-4" />;
      case 'store': return <ShoppingCart className="h-4 w-4" />;
      case 'reports': return <FileText className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming_soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Code className="h-6 w-6" />
            واجهات برمجة التطبيقات (API)
          </CardTitle>
          <CardDescription className="text-purple-100">
            وثائق شاملة لـ RESTful API مع Webhooks وتكاملات خارجية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{apiEndpoints.length}</div>
              <div className="text-sm text-purple-100">نقاط النهاية</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{webhookEvents.length}</div>
              <div className="text-sm text-purple-100">Webhooks</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'available').length}</div>
              <div className="text-sm text-purple-100">تكاملات متاحة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">v1.0</div>
              <div className="text-sm text-purple-100">إصدار API</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">نقاط النهاية</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
          <TabsTrigger value="authentication">المصادقة</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في نقاط النهاية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="users">المستخدمون</SelectItem>
                <SelectItem value="devices">الأجهزة</SelectItem>
                <SelectItem value="activity">النشاط</SelectItem>
                <SelectItem value="sleep">النوم</SelectItem>
                <SelectItem value="bia">تحليل الجسم</SelectItem>
                <SelectItem value="bookings">الحجوزات</SelectItem>
                <SelectItem value="messages">الرسائل</SelectItem>
                <SelectItem value="competitions">المسابقات</SelectItem>
                <SelectItem value="store">المتجر</SelectItem>
                <SelectItem value="reports">التقارير</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* API Endpoints */}
          <div className="grid grid-cols-1 gap-4">
            {filteredEndpoints.map(endpoint => (
              <Card key={endpoint.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(endpoint.category)}
                        <h3 className="font-medium">{endpoint.title}</h3>
                      </div>
                      {endpoint.authentication && (
                        <Badge variant="outline" className="text-xs">
                          <Key className="h-3 w-3 mr-1" />
                          مصادقة مطلوبة
                        </Badge>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      التفاصيل
                    </Button>
                  </div>
                  
                  <div className="mb-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {endpoint.path}
                    </code>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {endpoint.parameters && (
                      <span>{endpoint.parameters.length} معاملات</span>
                    )}
                    <span>{endpoint.responses.length} استجابات</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(endpoint.path)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                إشعارات فورية للأحداث المهمة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEvents.map(event => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{event.name}</h4>
                      <Badge variant="outline">{event.triggers.length} مشغلات</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">المشغلات:</h5>
                      <div className="flex flex-wrap gap-2">
                        {event.triggers.map(trigger => (
                          <Badge key={trigger} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">مثال على البيانات:</h5>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(event.example)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="text-xs overflow-x-auto">
                        <code>{event.example}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map(integration => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status === 'available' && 'متاح'}
                          {integration.status === 'beta' && 'تجريبي'}
                          {integration.status === 'coming_soon' && 'قريباً'}
                        </Badge>
                      </div>
                    </div>
                    {integration.status === 'available' && (
                      <Button size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        إعداد
                      </Button>
                    )}
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">المميزات:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {integration.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">خطوات الإعداد:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {integration.setup.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                المصادقة والأمان
              </CardTitle>
              <CardDescription>
                كيفية المصادقة والوصول الآمن لواجهات برمجة التطبيقات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">1. الحصول على مفتاح API</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    للحصول على مفتاح API، قم بإرسال طلب POST إلى نقطة التسجيل:
                  </p>
                  <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
                    POST /api/v1/auth/register<br/>
                    Content-Type: application/json<br/><br/>
                    {`{
  "email": "developer@example.com",
  "password": "SecurePassword123!",
  "app_name": "My Fitness App"
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">2. المصادقة باستخدام JWT</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    استخدم JWT Token في رأس Authorization:
                  </p>
                  <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
                    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">3. معدلات الاستخدام</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-medium">المجاني</h4>
                    <p className="text-2xl font-bold text-blue-600">1,000</p>
                    <p className="text-sm text-gray-600">طلب/ساعة</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-medium">المدفوع</h4>
                    <p className="text-2xl font-bold text-green-600">10,000</p>
                    <p className="text-sm text-gray-600">طلب/ساعة</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-medium">المؤسسي</h4>
                    <p className="text-2xl font-bold text-purple-600">∞</p>
                    <p className="text-sm text-gray-600">غير محدود</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">4. رموز الخطأ الشائعة</h3>
                <div className="space-y-2">
                  {[
                    { code: 401, message: 'Unauthorized - مفتاح API غير صحيح' },
                    { code: 403, message: 'Forbidden - ليس لديك صلاحية للوصول' },
                    { code: 429, message: 'Too Many Requests - تم تجاوز معدل الاستخدام' },
                    { code: 500, message: 'Internal Server Error - خطأ في الخادم' }
                  ].map(error => (
                    <div key={error.code} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Badge className="bg-red-100 text-red-800">{error.code}</Badge>
                      <span className="text-sm">{error.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Endpoint Details Dialog */}
      <Dialog open={!!selectedEndpoint} onOpenChange={() => setSelectedEndpoint(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEndpoint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Badge className={getMethodColor(selectedEndpoint.method)}>
                    {selectedEndpoint.method}
                  </Badge>
                  {selectedEndpoint.title}
                </DialogTitle>
                <DialogDescription>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {selectedEndpoint.path}
                  </code>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">الوصف</h4>
                  <p className="text-sm text-gray-600">{selectedEndpoint.description}</p>
                </div>

                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">المعاملات</h4>
                    <div className="space-y-2">
                      {selectedEndpoint.parameters.map(param => (
                        <div key={param.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono">{param.name}</code>
                              <Badge variant="outline" className="text-xs">{param.type}</Badge>
                              {param.required && (
                                <Badge className="bg-red-100 text-red-800 text-xs">مطلوب</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                          </div>
                          {param.example && (
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {param.example}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEndpoint.requestBody && (
                  <div>
                    <h4 className="font-medium mb-3">جسم الطلب</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{selectedEndpoint.requestBody.type}</Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(selectedEndpoint.requestBody!.example)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code>{selectedEndpoint.requestBody.example}</code>
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3">الاستجابات</h4>
                  <div className="space-y-2">
                    {selectedEndpoint.responses.map(response => (
                      <div key={response.status} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Badge className={
                          response.status < 300 ? 'bg-green-100 text-green-800' :
                          response.status < 400 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {response.status}
                        </Badge>
                        <span className="text-sm">{response.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">مثال على الاستجابة</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">JSON Response</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedEndpoint.example.response)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{selectedEndpoint.example.response}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}