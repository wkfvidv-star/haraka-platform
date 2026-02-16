import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Trophy, 
  School,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Settings,
  Archive,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'warning' | 'report';
  source: string;
  province: string;
  timestamp: string;
  isRead: boolean;
  priority: 'عالي' | 'متوسط' | 'منخفض';
  category: 'تقارير' | 'مسابقات' | 'طوارئ' | 'إحصائيات' | 'عام';
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'تقرير متأخر من ولاية أدرار',
    message: 'لم يتم استلام التقرير الشهري للأنشطة الرياضية المدرسية. الموعد النهائي كان يوم أمس.',
    type: 'urgent',
    source: 'مديرية التعليم - أدرار',
    province: 'أدرار',
    timestamp: '2024-10-01T14:30:00',
    isRead: false,
    priority: 'عالي',
    category: 'تقارير'
  },
  {
    id: '2',
    title: 'نتائج ممتازة في بطولة كرة القدم',
    message: 'حققت مدارس ولاية الجزائر المركز الأول في بطولة كرة القدم المدرسية بمشاركة 2400 تلميذ.',
    type: 'success',
    source: 'مديرية التعليم - الجزائر',
    province: 'الجزائر',
    timestamp: '2024-10-01T12:15:00',
    isRead: false,
    priority: 'متوسط',
    category: 'مسابقات'
  },
  {
    id: '3',
    title: 'طلب موافقة على مسابقة جديدة',
    message: 'مديرية وهران تطلب الموافقة على تنظيم بطولة كرة السلة الإقليمية للمرحلة الثانوية.',
    type: 'info',
    source: 'مديرية التعليم - وهران',
    province: 'وهران',
    timestamp: '2024-10-01T10:45:00',
    isRead: true,
    priority: 'متوسط',
    category: 'مسابقات'
  },
  {
    id: '4',
    title: 'تحديث نظام التقارير',
    message: 'تم تحديث نظام إدارة التقارير بميزات جديدة لتتبع الأساور الذكية والبيانات الصحية.',
    type: 'info',
    source: 'قسم تقنية المعلومات',
    province: 'الجزائر',
    timestamp: '2024-10-01T09:00:00',
    isRead: true,
    priority: 'منخفض',
    category: 'عام'
  },
  {
    id: '5',
    title: 'انقطاع في الخدمة - ولاية تمنراست',
    message: 'انقطاع مؤقت في خدمة الإنترنت يؤثر على إرسال التقارير من 15 مدرسة في المنطقة الجنوبية.',
    type: 'warning',
    source: 'مديرية التعليم - تمنراست',
    province: 'تمنراست',
    timestamp: '2024-10-01T08:30:00',
    isRead: false,
    priority: 'عالي',
    category: 'طوارئ'
  },
  {
    id: '6',
    title: 'إحصائيات المشاركة الرياضية',
    message: 'ارتفاع معدل المشاركة في الأنشطة الرياضية بنسبة 12% مقارنة بالشهر الماضي.',
    type: 'success',
    source: 'قسم الإحصائيات',
    province: 'جميع الولايات',
    timestamp: '2024-09-30T16:20:00',
    isRead: true,
    priority: 'متوسط',
    category: 'إحصائيات'
  },
  {
    id: '7',
    title: 'تسليم تقرير فصلي - قسنطينة',
    message: 'تم استلام التقرير الفصلي للأنشطة الرياضية من ولاية قسنطينة بنجاح.',
    type: 'success',
    source: 'مديرية التعليم - قسنطينة',
    province: 'قسنطينة',
    timestamp: '2024-09-30T14:10:00',
    isRead: true,
    priority: 'منخفض',
    category: 'تقارير'
  },
  {
    id: '8',
    title: 'اجتماع طارئ - مديري التعليم',
    message: 'اجتماع طارئ لجميع مديري التعليم غداً الساعة 10:00 صباحاً لمناقشة خطة الطوارئ.',
    type: 'urgent',
    source: 'مكتب الوزير',
    province: 'جميع الولايات',
    timestamp: '2024-09-30T13:45:00',
    isRead: false,
    priority: 'عالي',
    category: 'عام'
  }
];

export function NotificationCenter() {
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'report': return <FileText className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200';
      case 'report': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'منخفض': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'تقارير': return <FileText className="h-3 w-3" />;
      case 'مسابقات': return <Trophy className="h-3 w-3" />;
      case 'طوارئ': return <AlertTriangle className="h-3 w-3" />;
      case 'إحصائيات': return <TrendingUp className="h-3 w-3" />;
      case 'عام': return <MessageSquare className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'أمس';
    return time.toLocaleDateString('ar-DZ');
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === '' || notification.type === selectedFilter;
    const matchesCategory = selectedCategory === '' || notification.category === selectedCategory;
    const matchesRead = !showUnreadOnly || !notification.isRead;
    return matchesFilter && matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* إحصائيات الإشعارات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm text-gray-600">إجمالي الإشعارات</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm text-gray-600">غير مقروءة</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{urgentCount}</div>
                <div className="text-sm text-gray-600">عاجلة</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
                <div className="text-sm text-gray-600">مقروءة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مركز الإشعارات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" />
            مركز الإشعارات المركزي
          </CardTitle>
          <CardDescription>
            استقبال جميع الإشعارات والتحديثات من مديريات التعليم والمدارس
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* فلاتر الإشعارات */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('')}
              >
                <Filter className="h-3 w-3 mr-1" />
                جميع الأنواع
              </Button>
              <Button
                variant={selectedFilter === 'urgent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('urgent')}
              >
                عاجل
              </Button>
              <Button
                variant={selectedFilter === 'warning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('warning')}
              >
                تحذير
              </Button>
              <Button
                variant={selectedFilter === 'success' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('success')}
              >
                نجاح
              </Button>
              <Button
                variant={selectedFilter === 'info' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('info')}
              >
                معلومات
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                جميع الفئات
              </Button>
              <Button
                variant={selectedCategory === 'تقارير' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('تقارير')}
              >
                تقارير
              </Button>
              <Button
                variant={selectedCategory === 'مسابقات' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('مسابقات')}
              >
                مسابقات
              </Button>
              <Button
                variant={selectedCategory === 'طوارئ' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('طوارئ')}
              >
                طوارئ
              </Button>
            </div>
            
            <Button
              variant={showUnreadOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              غير مقروءة فقط
            </Button>
          </div>

          {/* قائمة الإشعارات */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200' : 'bg-white dark:bg-gray-800'
                } ${getTypeColor(notification.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <School className="h-3 w-3" />
                        <span>{notification.source}</span>
                        <span>•</span>
                        <span>{notification.province}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </Badge>
                    <Badge className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(notification.category)}
                        {notification.category}
                      </div>
                    </Badge>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatTime(notification.timestamp)}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" variant="outline">
                      اتخاذ إجراء
                    </Button>
                    {!notification.isRead && (
                      <Button size="sm" variant="outline">
                        تعيين كمقروء
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-500">لا توجد إشعارات تطابق الفلاتر المحددة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}