import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail,
  MailOpen,
  Send,
  Paperclip,
  Download,
  Bell,
  BellRing,
  Users,
  School,
  Trophy,
  Calendar,
  Watch,
  FileText,
  Image,
  Video,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    role: string;
  };
  category: 'teacher' | 'principal' | 'coach' | 'education_ministry' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  attachments: Attachment[];
  type: 'message' | 'notification' | 'alert' | 'announcement';
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document';
  size: number;
  url: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'device_pairing' | 'progress_report' | 'competition_result' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
}

export function MessagingSystem({ userRole = 'student' }: { userRole?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      subject: 'تقرير الأداء الشهري - أكتوبر 2024',
      content: 'السلام عليكم، يرجى مراجعة تقرير الأداء المرفق للشهر الماضي. نلاحظ تحسناً ملحوظاً في مستوى اللياقة البدنية.',
      sender: {
        id: 'teacher_1',
        name: 'الأستاذ محمد أحمد',
        role: 'teacher',
        avatar: '/avatars/teacher1.jpg'
      },
      recipient: {
        id: 'student_1',
        name: 'أحمد محمد',
        role: 'student'
      },
      category: 'teacher',
      priority: 'medium',
      isRead: false,
      timestamp: '2024-10-02T14:30:00Z',
      attachments: [
        {
          id: 'att_1',
          name: 'تقرير_الأداء_أكتوبر.pdf',
          type: 'pdf',
          size: 2.4,
          url: '/reports/performance_october.pdf'
        }
      ],
      type: 'message'
    },
    {
      id: 'msg_2',
      subject: 'دعوة للمشاركة في بطولة اللياقة البدنية',
      content: 'تحية طيبة، ندعوكم للمشاركة في البطولة الوطنية للياقة البدنية المقررة في نوفمبر 2024.',
      sender: {
        id: 'ministry_1',
        name: 'مديرية التربية والتعليم',
        role: 'education_ministry'
      },
      recipient: {
        id: 'student_1',
        name: 'أحمد محمد',
        role: 'student'
      },
      category: 'education_ministry',
      priority: 'high',
      isRead: false,
      timestamp: '2024-10-01T10:15:00Z',
      attachments: [
        {
          id: 'att_2',
          name: 'شروط_المشاركة.pdf',
          type: 'pdf',
          size: 1.8,
          url: '/competition/terms.pdf'
        },
        {
          id: 'att_3',
          name: 'فيديو_تعريفي.mp4',
          type: 'video',
          size: 15.2,
          url: '/competition/intro_video.mp4'
        }
      ],
      type: 'announcement'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      title: 'تم تأكيد حجز الجلسة التدريبية',
      message: 'تم تأكيد حجزك لجلسة التدريب يوم الأحد 6 أكتوبر في تمام الساعة 4:00 مساءً',
      type: 'booking',
      priority: 'medium',
      isRead: false,
      timestamp: '2024-10-02T15:30:00Z',
      actionUrl: '/bookings/session_123',
      data: { sessionId: 'session_123', date: '2024-10-06', time: '16:00' }
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const unreadNotifications = notifications.filter(notif => !notif.isRead).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teacher': return <Users className="h-4 w-4" />;
      case 'principal': return <School className="h-4 w-4" />;
      case 'coach': return <Trophy className="h-4 w-4" />;
      case 'education_ministry': return <School className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || msg.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6" />
            الرسائل والإشعارات
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-white text-indigo-600">
                {unreadCount} جديد
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-indigo-100">
            صندوق الوارد المصنف حسب المرسل مع الإشعارات الفورية
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>صندوق الوارد</CardTitle>
              <Button size="sm" onClick={() => setShowComposeDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                رسالة جديدة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الرسائل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Messages List */}
            <div className="space-y-2">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {message.subject}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                        {message.sender.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleDateString('ar-SA')}
                        </p>
                        {message.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Content */}
        <Card className="lg:col-span-2">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedMessage.sender.avatar} />
                      <AvatarFallback>
                        {selectedMessage.sender.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        من: {selectedMessage.sender.name} • {new Date(selectedMessage.timestamp).toLocaleString('ar-SA')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Reply className="h-4 w-4 mr-1" />
                      رد
                    </Button>
                    <Button size="sm" variant="outline">
                      <Forward className="h-4 w-4 mr-1" />
                      إعادة توجيه
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>

                {selectedMessage.attachments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">المرفقات ({selectedMessage.attachments.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMessage.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <div className="p-2 bg-gray-100 rounded">
                            {attachment.type === 'pdf' && <FileText className="h-4 w-4" />}
                            {attachment.type === 'image' && <Image className="h-4 w-4" />}
                            {attachment.type === 'video' && <Video className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-1">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.size} MB • {attachment.type.toUpperCase()}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اختر رسالة لعرضها
                </h3>
                <p className="text-gray-500">
                  انقر على أي رسالة من القائمة لعرض محتواها
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Compose Message Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إنشاء رسالة جديدة</DialogTitle>
            <DialogDescription>
              أرسل رسالة إلى المعلمين، المدربين، أو الإدارة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">الموضوع</Label>
              <Input id="subject" placeholder="أدخل موضوع الرسالة" />
            </div>
            <div>
              <Label htmlFor="content">المحتوى</Label>
              <Textarea 
                id="content" 
                placeholder="اكتب رسالتك هنا..." 
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-1" />
                إرسال
              </Button>
              <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}