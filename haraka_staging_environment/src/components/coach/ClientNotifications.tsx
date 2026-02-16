import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Send,
  Reply,
  Archive,
  Trash2,
  Filter,
  Search,
  Plus,
  Eye,
  Star,
  Heart,
  ThumbsUp,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'booking_request' | 'session_feedback' | 'payment_received' | 'client_message' | 'program_enrollment' | 'session_cancellation';
  clientId: string;
  clientName: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  relatedData?: {
    sessionId?: string;
    programId?: string;
    bookingId?: string;
    amount?: number;
  };
}

interface ClientMessage {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  hasReply: boolean;
  category: 'general' | 'booking' | 'feedback' | 'complaint' | 'compliment';
  attachments?: string[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking_request',
    clientId: '1',
    clientName: 'أحمد محمد',
    title: 'طلب حجز جلسة جديدة',
    message: 'يرغب في حجز جلسة تدريب قوة يوم الأحد الساعة 10:00 صباحاً',
    timestamp: new Date(2024, 9, 16, 9, 30),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedData: {
      sessionId: 'session_123',
      bookingId: 'booking_456'
    }
  },
  {
    id: '2',
    type: 'session_feedback',
    clientId: '2',
    clientName: 'سارة أحمد',
    title: 'تقييم الجلسة التدريبية',
    message: 'قيمت الجلسة بـ 5 نجوم مع تعليق إيجابي حول التحسن في الأداء',
    timestamp: new Date(2024, 9, 15, 18, 45),
    isRead: true,
    priority: 'medium',
    actionRequired: false,
    relatedData: {
      sessionId: 'session_789'
    }
  },
  {
    id: '3',
    type: 'payment_received',
    clientId: '3',
    clientName: 'محمد علي',
    title: 'تم استلام الدفعة',
    message: 'تم دفع 500 ر.س لبرنامج بناء القوة للمبتدئين',
    timestamp: new Date(2024, 9, 15, 14, 20),
    isRead: true,
    priority: 'low',
    actionRequired: false,
    relatedData: {
      programId: 'program_123',
      amount: 500
    }
  },
  {
    id: '4',
    type: 'client_message',
    clientId: '4',
    clientName: 'فاطمة الزهراء',
    title: 'رسالة من العميل',
    message: 'استفسار حول تعديل مواعيد الجلسات الأسبوعية',
    timestamp: new Date(2024, 9, 15, 11, 15),
    isRead: false,
    priority: 'medium',
    actionRequired: true
  },
  {
    id: '5',
    type: 'program_enrollment',
    clientId: '5',
    clientName: 'خالد أحمد',
    title: 'اشتراك في برنامج جديد',
    message: 'اشترك في برنامج تحدي الكارديو المكثف',
    timestamp: new Date(2024, 9, 14, 16, 30),
    isRead: true,
    priority: 'medium',
    actionRequired: false,
    relatedData: {
      programId: 'program_456'
    }
  }
];

const mockMessages: ClientMessage[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'أحمد محمد',
    subject: 'استفسار حول البرنامج التدريبي',
    message: 'السلام عليكم كابتن، أريد أن أستفسر عن إمكانية تعديل البرنامج التدريبي ليناسب ظروف عملي الجديدة. هل يمكن تقليل عدد الجلسات الأسبوعية من 4 إلى 3 جلسات؟',
    timestamp: new Date(2024, 9, 16, 8, 30),
    isRead: false,
    hasReply: false,
    category: 'general'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'سارة أحمد',
    subject: 'شكر وتقدير',
    message: 'أشكرك جداً على الاهتمام والمتابعة المستمرة. لاحظت تحسناً كبيراً في لياقتي البدنية ومرونتي خلال الشهر الماضي. البرنامج ممتاز والتمارين متنوعة ومفيدة.',
    timestamp: new Date(2024, 9, 15, 19, 15),
    isRead: true,
    hasReply: true,
    category: 'compliment'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'محمد علي',
    subject: 'طلب تأجيل الجلسة',
    message: 'عذراً، اضطررت لتأجيل جلسة الغد بسبب ظرف طارئ في العمل. هل يمكن إعادة جدولتها ليوم الخميس في نفس الوقت؟',
    timestamp: new Date(2024, 9, 15, 15, 45),
    isRead: true,
    hasReply: false,
    category: 'booking'
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'فاطمة الزهراء',
    subject: 'تقييم الجلسة الأخيرة',
    message: 'الجلسة الأخيرة كانت ممتازة! أحببت التمارين الجديدة خاصة تمارين التوازن. أشعر بتحسن كبير في قوة عضلات الساقين. شكراً لك.',
    timestamp: new Date(2024, 9, 14, 17, 20),
    isRead: true,
    hasReply: true,
    category: 'feedback'
  }
];

export function ClientNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [messages, setMessages] = useState<ClientMessage[]>(mockMessages);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [filterType, setFilterType] = useState('الكل');
  const [filterPriority, setFilterPriority] = useState('الكل');

  const notificationTypes = ['الكل', 'طلبات حجز', 'تقييمات', 'رسائل', 'مدفوعات', 'اشتراكات'];
  const priorities = ['الكل', 'عالية', 'متوسطة', 'منخفضة'];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'session_feedback': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'payment_received': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'client_message': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'program_enrollment': return <BookOpen className="h-4 w-4 text-orange-500" />;
      case 'session_cancellation': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'booking': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'feedback': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'complaint': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'compliment': return <Heart className="h-4 w-4 text-pink-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isRead: true } : m
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadMessages = messages.filter(m => !m.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6" />
            إشعارات العملاء
          </CardTitle>
          <CardDescription className="text-indigo-100">
            متابعة جميع الإشعارات والرسائل من العملاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{unreadNotifications.length}</div>
              <div className="text-sm text-indigo-100">إشعارات جديدة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{unreadMessages.length}</div>
              <div className="text-sm text-indigo-100">رسائل جديدة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.actionRequired && !n.isRead).length}
              </div>
              <div className="text-sm text-indigo-100">تحتاج إجراء</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.priority === 'high' && !n.isRead).length}
              </div>
              <div className="text-sm text-indigo-100">أولوية عالية</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            الرسائل ({unreadMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">نوع الإشعار</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map(type => (
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
                    {priorities.map(priority => (
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
                <CardTitle className="text-sm">إجراءات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    قراءة الكل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4 mr-1" />
                    أرشفة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
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
                        {getNotificationIcon(notification.type)}
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
                          {notification.actionRequired && (
                            <Badge className="bg-orange-100 text-orange-800" size="sm">
                              يحتاج إجراء
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          من: {notification.clientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {notification.message}
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
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {/* Messages List */}
          <div className="space-y-3">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  !message.isRead ? 'bg-green-50 dark:bg-green-900/10 border-l-4 border-l-green-500' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  markMessageAsRead(message.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!message.isRead ? 'font-bold' : ''}`}>
                            {message.clientName}
                          </h4>
                          {getCategoryIcon(message.category)}
                          {message.hasReply && (
                            <Badge className="bg-green-100 text-green-800" size="sm">
                              تم الرد
                            </Badge>
                          )}
                        </div>
                        <h5 className={`text-sm mb-1 ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.subject}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {format(message.timestamp, 'dd/MM HH:mm')}
                      </div>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reply Form Modal */}
      {(selectedMessage || selectedNotification) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Reply className="h-5 w-5" />
                {selectedMessage ? 'الرد على الرسالة' : 'الرد على الإشعار'}
              </CardTitle>
              <CardDescription>
                {selectedMessage ? selectedMessage.clientName : selectedNotification?.clientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Original Message */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedMessage ? selectedMessage.subject : selectedNotification?.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedMessage ? selectedMessage.message : selectedNotification?.message}
                </p>
              </div>

              {/* Reply Form */}
              <div>
                <Label htmlFor="reply-message">الرد</Label>
                <Textarea 
                  id="reply-message" 
                  placeholder="اكتب ردك هنا..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  إرسال الرد
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMessage(null);
                    setSelectedNotification(null);
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}