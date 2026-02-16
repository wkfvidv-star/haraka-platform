import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  MessageSquare,
  FileText,
  Trophy,
  Users,
  School,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Reply,
  Archive,
  Trash2,
  Filter,
  Search,
  Plus,
  Send,
  Download,
  Upload
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'teacher_report' | 'ministry_directive' | 'competition_update' | 'system_alert' | 'parent_inquiry';
  title: string;
  content: string;
  sender: string;
  senderRole: 'teacher' | 'ministry' | 'system' | 'parent';
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'report' | 'directive' | 'competition' | 'inquiry' | 'alert';
  attachments?: string[];
  requiresResponse: boolean;
  hasResponse: boolean;
  relatedData?: {
    classId?: string;
    competitionId?: string;
    studentId?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'teacher_report',
    title: 'تقرير شهري من الصف الأول متوسط - أ',
    content: 'تقرير شامل عن أداء الطلاب في الأنشطة الرياضية خلال شهر أكتوبر. يتضمن التقرير إحصائيات مفصلة عن معدلات الحضور والأداء والتحسن الملحوظ في مستوى اللياقة البدنية للطلاب.',
    sender: 'أستاذة فاطمة الزهراء',
    senderRole: 'teacher',
    timestamp: new Date(2024, 9, 16, 9, 30),
    isRead: false,
    priority: 'high',
    category: 'report',
    requiresResponse: true,
    hasResponse: false,
    relatedData: {
      classId: 'class_1'
    }
  },
  {
    id: 'notif_2',
    type: 'ministry_directive',
    title: 'تعميم وزاري: تحديث معايير تقييم الأنشطة الرياضية',
    content: 'تعميم من وزارة التعليم بخصوص تحديث معايير تقييم الأنشطة الرياضية في المدارس المتوسطة. يجب تطبيق المعايير الجديدة اعتباراً من الفصل الدراسي القادم.',
    sender: 'وزارة التعليم - الإدارة العامة للتعليم',
    senderRole: 'ministry',
    timestamp: new Date(2024, 9, 15, 14, 15),
    isRead: true,
    priority: 'high',
    category: 'directive',
    requiresResponse: true,
    hasResponse: false,
    attachments: ['تعميم_معايير_التقييم.pdf', 'دليل_التطبيق.docx']
  },
  {
    id: 'notif_3',
    type: 'competition_update',
    title: 'انتهاء مسابقة اللياقة البدنية الشاملة',
    content: 'تم الانتهاء من مسابقة اللياقة البدنية الشاملة بمشاركة 156 طالب. النتائج متاحة للمراجعة والاعتماد.',
    sender: 'نظام إدارة المسابقات',
    senderRole: 'system',
    timestamp: new Date(2024, 9, 14, 16, 45),
    isRead: true,
    priority: 'medium',
    category: 'competition',
    requiresResponse: false,
    hasResponse: false,
    relatedData: {
      competitionId: 'comp_1'
    }
  },
  {
    id: 'notif_4',
    type: 'parent_inquiry',
    title: 'استفسار من ولي أمر الطالب أحمد محمد',
    content: 'استفسار من ولي أمر الطالب أحمد محمد علي بخصوص مستوى ابنه في الأنشطة الرياضية وإمكانية الحصول على تدريب إضافي.',
    sender: 'محمد علي الأحمد (ولي أمر)',
    senderRole: 'parent',
    timestamp: new Date(2024, 9, 13, 11, 20),
    isRead: false,
    priority: 'medium',
    category: 'inquiry',
    requiresResponse: true,
    hasResponse: false,
    relatedData: {
      studentId: 'student_1',
      classId: 'class_1'
    }
  },
  {
    id: 'notif_5',
    type: 'teacher_report',
    title: 'طلب إجازة اضطرارية',
    content: 'طلب إجازة اضطرارية لمدة 3 أيام بسبب ظروف عائلية طارئة. أرجو الموافقة وترتيب بديل مناسب للحصص.',
    sender: 'أستاذ محمد الأحمد',
    senderRole: 'teacher',
    timestamp: new Date(2024, 9, 12, 8, 15),
    isRead: true,
    priority: 'high',
    category: 'inquiry',
    requiresResponse: true,
    hasResponse: true
  }
];

export function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [filterType, setFilterType] = useState('الكل');
  const [filterPriority, setFilterPriority] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const typeOptions = ['الكل', 'تقارير المعلمين', 'تعاميم الوزارة', 'تحديثات المسابقات', 'تنبيهات النظام', 'استفسارات الأولياء'];
  const priorityOptions = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];
  const statusOptions = ['الكل', 'غير مقروءة', 'مقروءة', 'تحتاج رد', 'تم الرد'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teacher_report': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'ministry_directive': return <School className="h-4 w-4 text-red-500" />;
      case 'competition_update': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'system_alert': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'parent_inquiry': return <Users className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getSenderRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-blue-600';
      case 'ministry': return 'text-red-600';
      case 'system': return 'text-orange-600';
      case 'parent': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'الكل' || 
                       (filterType === 'تقارير المعلمين' && notif.type === 'teacher_report') ||
                       (filterType === 'تعاميم الوزارة' && notif.type === 'ministry_directive') ||
                       (filterType === 'تحديثات المسابقات' && notif.type === 'competition_update') ||
                       (filterType === 'تنبيهات النظام' && notif.type === 'system_alert') ||
                       (filterType === 'استفسارات الأولياء' && notif.type === 'parent_inquiry');
    
    const matchesPriority = filterPriority === 'الكل' ||
                           (filterPriority === 'عالية' && notif.priority === 'high') ||
                           (filterPriority === 'متوسطة' && notif.priority === 'medium') ||
                           (filterPriority === 'منخفضة' && notif.priority === 'low');
    
    const matchesStatus = filterStatus === 'الكل' ||
                         (filterStatus === 'غير مقروءة' && !notif.isRead) ||
                         (filterStatus === 'مقروءة' && notif.isRead) ||
                         (filterStatus === 'تحتاج رد' && notif.requiresResponse && !notif.hasResponse) ||
                         (filterStatus === 'تم الرد' && notif.hasResponse);
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAsResponded = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, hasResponse: true } : notif
    ));
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingResponseCount = notifications.filter(n => n.requiresResponse && !n.hasResponse).length;

  const renderReplyForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Reply className="h-5 w-5" />
            الرد على الإشعار
          </CardTitle>
          <CardDescription>
            {selectedNotification?.sender}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Original Notification */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">{selectedNotification?.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selectedNotification?.content}
            </p>
          </div>

          {/* Reply Form */}
          <div>
            <Label htmlFor="reply-content">الرد</Label>
            <Textarea 
              id="reply-content" 
              placeholder="اكتب ردك هنا..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={() => {
                if (selectedNotification) {
                  markAsResponded(selectedNotification.id);
                }
                setShowReplyForm(false);
                setSelectedNotification(null);
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              إرسال الرد
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowReplyForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (selectedNotification) {
    return (
      <>
        <div className="space-y-6">
          {/* Notification Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {getTypeIcon(selectedNotification.type)}
                    {selectedNotification.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    من: <span className={getSenderRoleColor(selectedNotification.senderRole)}>
                      {selectedNotification.sender}
                    </span>
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getPriorityColor(selectedNotification.priority)}>
                      {selectedNotification.priority === 'high' && 'أولوية عالية'}
                      {selectedNotification.priority === 'medium' && 'أولوية متوسطة'}
                      {selectedNotification.priority === 'low' && 'أولوية منخفضة'}
                    </Badge>
                    {!selectedNotification.isRead && (
                      <Badge className="bg-blue-100 text-blue-800">
                        جديد
                      </Badge>
                    )}
                    {selectedNotification.requiresResponse && !selectedNotification.hasResponse && (
                      <Badge className="bg-orange-100 text-orange-800">
                        يحتاج رد
                      </Badge>
                    )}
                    {selectedNotification.hasResponse && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        تم الرد
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedNotification.requiresResponse && !selectedNotification.hasResponse && (
                    <Button size="sm" onClick={() => setShowReplyForm(true)}>
                      <Reply className="h-4 w-4 mr-1" />
                      رد
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setSelectedNotification(null)}>
                    ← العودة
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notification Content */}
          <Card>
            <CardHeader>
              <CardTitle>محتوى الإشعار</CardTitle>
              <CardDescription>
                {format(selectedNotification.timestamp, 'PPpp', { locale: ar })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedNotification.content}
                </p>
              </div>

              {/* Attachments */}
              {selectedNotification.attachments && selectedNotification.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">المرفقات</h4>
                  <div className="space-y-2">
                    {selectedNotification.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="flex-1">{attachment}</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          تحميل
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedNotification.requiresResponse && !selectedNotification.hasResponse && (
                  <Button 
                    className="h-16 flex-col gap-2"
                    onClick={() => setShowReplyForm(true)}
                  >
                    <Reply className="h-6 w-6" />
                    إرسال رد
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => archiveNotification(selectedNotification.id)}
                >
                  <Archive className="h-6 w-6" />
                  أرشفة
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                >
                  <Download className="h-6 w-6" />
                  تصدير PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {showReplyForm && renderReplyForm()}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6" />
            إدارة الإشعارات
          </CardTitle>
          <CardDescription className="text-purple-100">
            تلقي ومتابعة جميع التقارير والإشعارات من المعلمين والوزارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-purple-100">إجمالي الإشعارات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg relative">
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm text-purple-100">غير مقروءة</div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{pendingResponseCount}</div>
              <div className="text-sm text-purple-100">تحتاج رد</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.hasResponse).length}
              </div>
              <div className="text-sm text-purple-100">تم الرد عليها</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث في الإشعارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الأولوية</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedNotification(notification);
              markAsRead(notification.id);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                        {notification.title}
                      </h4>
                      <Badge className={getPriorityColor(notification.priority)} size="sm">
                        {notification.priority === 'high' && 'عالية'}
                        {notification.priority === 'medium' && 'متوسطة'}
                        {notification.priority === 'low' && 'منخفضة'}
                      </Badge>
                      {notification.requiresResponse && !notification.hasResponse && (
                        <Badge className="bg-orange-100 text-orange-800" size="sm">
                          يحتاج رد
                        </Badge>
                      )}
                      {notification.hasResponse && (
                        <Badge className="bg-green-100 text-green-800" size="sm">
                          تم الرد
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm text-gray-600 dark:text-gray-300 mb-2 ${getSenderRoleColor(notification.senderRole)}`}>
                      من: {notification.sender}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {notification.content}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {format(notification.timestamp, 'dd/MM HH:mm')}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
            <p className="text-gray-500">لا توجد إشعارات تطابق المرشحات المحددة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}