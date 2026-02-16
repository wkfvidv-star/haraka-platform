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
  MessageSquare,
  FileText,
  Send,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  User,
  Users,
  Building,
  Calendar,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Mail,
  Phone,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Report {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  type: 'تقرير أداء' | 'تقرير صحي' | 'تقرير سلوكي' | 'تقرير شامل';
  content: string;
  format: 'PDF' | 'HTML';
  recipientType: 'parent' | 'principal' | 'both';
  recipients: string[];
  status: 'مسودة' | 'مرسل' | 'مقروء' | 'مجاب عليه';
  createdDate: Date;
  sentDate?: Date;
  attachments?: string[];
  priority: 'عادي' | 'مهم' | 'عاجل';
  category: string;
}

interface Message {
  id: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'inbox' | 'sent' | 'draft';
  priority: 'عادي' | 'مهم' | 'عاجل';
  attachments?: string[];
  relatedStudent?: string;
}

const mockReports: Report[] = [
  {
    id: 'report_1',
    studentId: 'student_1',
    studentName: 'أحمد محمد علي',
    title: 'تقرير الأداء الرياضي الأسبوعي',
    type: 'تقرير أداء',
    content: 'تقرير شامل عن أداء الطالب أحمد في الأنشطة الرياضية خلال الأسبوع الماضي...',
    format: 'PDF',
    recipientType: 'parent',
    recipients: ['parent_1'],
    status: 'مرسل',
    createdDate: new Date(2024, 9, 15, 14, 30),
    sentDate: new Date(2024, 9, 15, 15, 0),
    priority: 'مهم',
    category: 'أداء رياضي',
    attachments: ['performance_chart.pdf', 'exercise_log.xlsx']
  },
  {
    id: 'report_2',
    studentId: 'student_2',
    studentName: 'فاطمة الزهراء بن علي',
    title: 'تقرير التقدم الشهري',
    type: 'تقرير شامل',
    content: 'تقرير مفصل عن تقدم الطالبة فاطمة في جميع الأنشطة الرياضية والصحية...',
    format: 'HTML',
    recipientType: 'both',
    recipients: ['parent_2', 'principal_1'],
    status: 'مسودة',
    createdDate: new Date(2024, 9, 16, 10, 0),
    priority: 'عادي',
    category: 'تقدم شامل'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg_1',
    from: 'الأستاذ محمد الصالح',
    to: ['parent_1'],
    subject: 'استفسار حول تقدم أحمد',
    content: 'السلام عليكم، أود مناقشة تقدم ابنكم أحمد في الأنشطة الرياضية...',
    timestamp: new Date(2024, 9, 16, 9, 30),
    isRead: true,
    type: 'sent',
    priority: 'عادي',
    relatedStudent: 'أحمد محمد علي'
  },
  {
    id: 'msg_2',
    from: 'ولي أمر فاطمة',
    to: ['teacher_1'],
    subject: 'شكر وتقدير',
    content: 'نشكركم على الاهتمام الكبير بابنتنا فاطمة وتطورها الملحوظ...',
    timestamp: new Date(2024, 9, 15, 16, 45),
    isRead: false,
    type: 'inbox',
    priority: 'عادي',
    relatedStudent: 'فاطمة الزهراء بن علي'
  }
];

export function CommunicationTools() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('reports');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مرسل': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'مقروء': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'مسودة': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'مجاب عليه': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'مهم': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      case 'عادي': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const renderReportForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            إنشاء تقرير جديد
          </CardTitle>
          <CardDescription>
            قم بإنشاء تقرير مفصل عن أداء الطالب
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-student">الطالب</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student_1">أحمد محمد علي</SelectItem>
                  <SelectItem value="student_2">فاطمة الزهراء بن علي</SelectItem>
                  <SelectItem value="student_3">محمد الأمين خالد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-type">نوع التقرير</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="تقرير أداء">تقرير أداء</SelectItem>
                  <SelectItem value="تقرير صحي">تقرير صحي</SelectItem>
                  <SelectItem value="تقرير سلوكي">تقرير سلوكي</SelectItem>
                  <SelectItem value="تقرير شامل">تقرير شامل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="report-format">تنسيق التقرير</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التنسيق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-priority">الأولوية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عادي">عادي</SelectItem>
                  <SelectItem value="مهم">مهم</SelectItem>
                  <SelectItem value="عاجل">عاجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-recipient">المستقبل</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستقبل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">ولي الأمر فقط</SelectItem>
                  <SelectItem value="principal">المدير فقط</SelectItem>
                  <SelectItem value="both">ولي الأمر والمدير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="report-title">عنوان التقرير</Label>
            <Input id="report-title" placeholder="عنوان التقرير..." />
          </div>

          <div>
            <Label htmlFor="report-content">محتوى التقرير</Label>
            <Textarea 
              id="report-content" 
              placeholder="اكتب محتوى التقرير المفصل هنا..."
              className="min-h-[200px]"
            />
          </div>

          {/* Report Template Sections */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">أقسام التقرير المقترحة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-sm">الأداء الرياضي</h5>
                <Textarea placeholder="تقييم الأداء في التمارين..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">التقدم والتطور</h5>
                <Textarea placeholder="ملاحظات حول التقدم..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">نقاط القوة</h5>
                <Textarea placeholder="نقاط القوة الملاحظة..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-sm">التوصيات</h5>
                <Textarea placeholder="التوصيات للتحسين..." className="min-h-[80px]" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">المرفقات</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">رفع ملفات</p>
                <p className="text-xs text-gray-500">PDF, DOC, XLS</p>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">رسوم بيانية</p>
                <p className="text-xs text-gray-500">إضافة رسوم بيانية</p>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">شهادات وجوائز</p>
                <p className="text-xs text-gray-500">إضافة إنجازات</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              إرسال التقرير
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              حفظ كمسودة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowReportForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMessageForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            رسالة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="message-to">إلى</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستقبل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent_1">ولي أمر أحمد</SelectItem>
                  <SelectItem value="parent_2">ولي أمر فاطمة</SelectItem>
                  <SelectItem value="principal_1">مدير المدرسة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message-priority">الأولوية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عادي">عادي</SelectItem>
                  <SelectItem value="مهم">مهم</SelectItem>
                  <SelectItem value="عاجل">عاجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="message-subject">الموضوع</Label>
            <Input id="message-subject" placeholder="موضوع الرسالة..." />
          </div>

          <div>
            <Label htmlFor="message-student">متعلق بالطالب (اختياري)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر الطالب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student_1">أحمد محمد علي</SelectItem>
                <SelectItem value="student_2">فاطمة الزهراء بن علي</SelectItem>
                <SelectItem value="student_3">محمد الأمين خالد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message-content">الرسالة</Label>
            <Textarea 
              id="message-content" 
              placeholder="اكتب رسالتك هنا..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              <Paperclip className="h-4 w-4 mr-2" />
              إرفاق ملف
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowMessageForm(false)}
              >
                إلغاء
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                إرسال
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            أدوات التواصل والتقارير
          </CardTitle>
          <CardDescription className="text-blue-100">
            إنشاء التقارير والتواصل مع أولياء الأمور والإدارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-sm text-blue-100">التقارير</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{messages.length}</div>
              <div className="text-sm text-blue-100">الرسائل</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'مرسل').length}
              </div>
              <div className="text-sm text-blue-100">تقارير مرسلة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {messages.filter(m => !m.isRead && m.type === 'inbox').length}
              </div>
              <div className="text-sm text-blue-100">رسائل جديدة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="messages">الرسائل</TabsTrigger>
          <TabsTrigger value="history">سجل التواصل</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Reports Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">إدارة التقارير</h3>
            <Button onClick={() => setShowReportForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              تقرير جديد
            </Button>
          </div>

          {/* Reports List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>
                        {report.studentName} - {report.type}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {report.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(report.createdDate, 'dd/MM/yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {report.format}
                    </span>
                    {report.attachments && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        {report.attachments.length}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      تحميل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {/* Messages Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">صندوق الرسائل</h3>
            <Button onClick={() => setShowMessageForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              رسالة جديدة
            </Button>
          </div>

          {/* Messages List */}
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className={`hover:shadow-lg transition-shadow ${!message.isRead && message.type === 'inbox' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!message.isRead && message.type === 'inbox' ? 'font-bold' : ''}`}>
                            {message.type === 'sent' ? `إلى: ${message.to[0]}` : `من: ${message.from}`}
                          </h4>
                          <Badge className={getPriorityColor(message.priority)} size="sm">
                            {message.priority}
                          </Badge>
                          {message.type === 'inbox' && (
                            <Badge variant="outline" size="sm">
                              وارد
                            </Badge>
                          )}
                          {message.type === 'sent' && (
                            <Badge variant="outline" size="sm">
                              مرسل
                            </Badge>
                          )}
                        </div>
                        <h5 className={`text-sm mb-1 ${!message.isRead && message.type === 'inbox' ? 'font-semibold' : ''}`}>
                          {message.subject}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                          {message.content}
                        </p>
                        {message.relatedStudent && (
                          <div className="mt-2">
                            <Badge variant="outline" size="sm">
                              <User className="h-3 w-3 mr-1" />
                              {message.relatedStudent}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {format(message.timestamp, 'dd/MM HH:mm')}
                      </div>
                      {!message.isRead && message.type === 'inbox' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل التواصل</CardTitle>
              <CardDescription>
                تاريخ شامل لجميع التقارير والرسائل المرسلة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Communication History Timeline */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">تقرير الأداء الأسبوعي - أحمد محمد علي</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        تم إرسال التقرير إلى ولي الأمر
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        15 أكتوبر 2024 - 3:00 م
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      مقروء
                    </Badge>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">رسالة من ولي أمر فاطمة</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        شكر وتقدير على الاهتمام بالطالبة
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        15 أكتوبر 2024 - 4:45 م
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      مجاب عليه
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      {showReportForm && renderReportForm()}
      {showMessageForm && renderMessageForm()}
    </div>
  );
}