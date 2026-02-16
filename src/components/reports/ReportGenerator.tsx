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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  FileText,
  Download,
  Mail,
  Calendar,
  Users,
  School,
  MapPin,
  Filter,
  Settings,
  Send,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Share2,
  History,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'fitness_progress' | 'attendance' | 'competition_results' | 'device_usage' | 'custom';
  format: 'pdf' | 'excel' | 'both';
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: ReportRecipient[];
  filters: ReportFilters;
  sections: ReportSection[];
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  lastGenerated?: string;
}

interface ReportRecipient {
  id: string;
  type: 'parent' | 'teacher' | 'admin' | 'ministry' | 'directorate';
  email: string;
  name: string;
  autoSend: boolean;
}

interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  classes?: string[];
  provinces?: string[];
  schools?: string[];
  students?: string[];
  competitions?: string[];
}

interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'summary' | 'text';
  data: string;
  config: Record<string, unknown>;
  order: number;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  format: 'pdf' | 'excel';
  status: 'generating' | 'completed' | 'failed' | 'sending';
  progress: number;
  generatedDate: string;
  fileSize?: number;
  downloadUrl?: string;
  emailsSent: number;
  emailsTotal: number;
  error?: string;
}

export function ReportGenerator({ userRole = 'admin' }: { userRole?: string }) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: 'template_1',
      name: 'تقرير التقدم الشهري للطلاب',
      description: 'تقرير شامل عن تقدم الطلاب في اللياقة البدنية خلال الشهر',
      type: 'fitness_progress',
      format: 'both',
      frequency: 'monthly',
      recipients: [
        { id: 'rec_1', type: 'parent', email: 'parent@example.com', name: 'ولي الأمر', autoSend: true },
        { id: 'rec_2', type: 'admin', email: 'admin@school.com', name: 'مدير المدرسة', autoSend: true }
      ],
      filters: {
        dateRange: { start: '2024-10-01', end: '2024-10-31' },
        classes: ['الصف الثالث متوسط'],
        provinces: ['الجزائر']
      },
      sections: [
        { id: 'sec_1', title: 'ملخص الأداء', type: 'summary', data: 'performance_summary', config: {}, order: 1 },
        { id: 'sec_2', title: 'رسم بياني للتقدم', type: 'chart', data: 'progress_chart', config: { chartType: 'line' }, order: 2 },
        { id: 'sec_3', title: 'جدول النتائج', type: 'table', data: 'results_table', config: {}, order: 3 }
      ],
      isActive: true,
      createdBy: 'أ. محمد أحمد',
      createdDate: '2024-09-15',
      lastGenerated: '2024-10-01T10:30:00Z'
    },
    {
      id: 'template_2',
      name: 'تقرير الحضور الأسبوعي',
      description: 'تقرير حضور الطلاب في حصص التربية البدنية',
      type: 'attendance',
      format: 'excel',
      frequency: 'weekly',
      recipients: [
        { id: 'rec_3', type: 'teacher', email: 'teacher@school.com', name: 'معلم التربية البدنية', autoSend: true }
      ],
      filters: {
        dateRange: { start: '2024-09-30', end: '2024-10-06' },
        classes: ['جميع الصفوف']
      },
      sections: [
        { id: 'sec_4', title: 'جدول الحضور', type: 'table', data: 'attendance_table', config: {}, order: 1 }
      ],
      isActive: true,
      createdBy: 'مدير المدرسة',
      createdDate: '2024-09-20',
      lastGenerated: '2024-10-01T08:00:00Z'
    },
    {
      id: 'template_3',
      name: 'تقرير نتائج المسابقات',
      description: 'تقرير شامل عن نتائج المسابقات الرياضية',
      type: 'competition_results',
      format: 'pdf',
      frequency: 'manual',
      recipients: [
        { id: 'rec_4', type: 'ministry', email: 'ministry@education.gov', name: 'وزارة التربية', autoSend: false }
      ],
      filters: {
        dateRange: { start: '2024-09-01', end: '2024-10-31' },
        competitions: ['مسابقة اللياقة البدنية الوطنية']
      },
      sections: [
        { id: 'sec_5', title: 'نتائج المسابقات', type: 'table', data: 'competition_results', config: {}, order: 1 },
        { id: 'sec_6', title: 'إحصائيات المشاركة', type: 'chart', data: 'participation_stats', config: { chartType: 'pie' }, order: 2 }
      ],
      isActive: true,
      createdBy: 'مديرية التعليم',
      createdDate: '2024-09-10'
    }
  ]);

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: 'report_1',
      templateId: 'template_1',
      templateName: 'تقرير التقدم الشهري للطلاب',
      format: 'pdf',
      status: 'completed',
      progress: 100,
      generatedDate: '2024-10-02T10:30:00Z',
      fileSize: 2.4,
      downloadUrl: '/reports/monthly_progress_oct2024.pdf',
      emailsSent: 25,
      emailsTotal: 25
    },
    {
      id: 'report_2',
      templateId: 'template_1',
      templateName: 'تقرير التقدم الشهري للطلاب',
      format: 'excel',
      status: 'completed',
      progress: 100,
      generatedDate: '2024-10-02T10:32:00Z',
      fileSize: 1.8,
      downloadUrl: '/reports/monthly_progress_oct2024.xlsx',
      emailsSent: 25,
      emailsTotal: 25
    },
    {
      id: 'report_3',
      templateId: 'template_2',
      templateName: 'تقرير الحضور الأسبوعي',
      format: 'excel',
      status: 'generating',
      progress: 65,
      generatedDate: '2024-10-02T14:15:00Z',
      emailsSent: 0,
      emailsTotal: 5
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fitness_progress': return <TrendingUp className="h-4 w-4" />;
      case 'attendance': return <Users className="h-4 w-4" />;
      case 'competition_results': return <BarChart3 className="h-4 w-4" />;
      case 'device_usage': return <Settings className="h-4 w-4" />;
      case 'custom': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-600" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'both': return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const generateReport = (templateId: string, format: 'pdf' | 'excel' | 'both') => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const formats = format === 'both' ? ['pdf', 'excel'] : [format];
    
    formats.forEach((fmt, index) => {
      const newReport: GeneratedReport = {
        id: `report_${Date.now()}_${index}`,
        templateId,
        templateName: template.name,
        format: fmt as 'pdf' | 'excel',
        status: 'generating',
        progress: 0,
        generatedDate: new Date().toISOString(),
        emailsSent: 0,
        emailsTotal: template.recipients.filter(r => r.autoSend).length
      };

      setGeneratedReports(prev => [newReport, ...prev]);

      // Simulate report generation
      const interval = setInterval(() => {
        setGeneratedReports(prev => prev.map(report => {
          if (report.id === newReport.id && report.status === 'generating') {
            const newProgress = Math.min(report.progress + Math.random() * 20, 100);
            const newStatus = newProgress === 100 ? 'completed' : 'generating';
            return {
              ...report,
              progress: newProgress,
              status: newStatus,
              ...(newStatus === 'completed' && {
                fileSize: Math.random() * 5 + 1,
                downloadUrl: `/reports/${template.name.replace(/\s+/g, '_')}.${fmt}`,
                emailsSent: report.emailsTotal
              })
            };
          }
          return report;
        }));
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 8000);
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    return `${bytes.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            مركز التقارير والتصدير
          </CardTitle>
          <CardDescription className="text-emerald-100">
            توليد وتخصيص التقارير مع الإرسال التلقائي والتتبع الشامل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{templates.length}</div>
              <div className="text-sm text-emerald-100">قوالب التقارير</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{generatedReports.filter(r => r.status === 'completed').length}</div>
              <div className="text-sm text-emerald-100">تقارير مكتملة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{generatedReports.reduce((acc, r) => acc + r.emailsSent, 0)}</div>
              <div className="text-sm text-emerald-100">رسائل مرسلة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{templates.filter(t => t.isActive).length}</div>
              <div className="text-sm text-emerald-100">تقارير تلقائية</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">قوالب التقارير</TabsTrigger>
          <TabsTrigger value="generated">التقارير المولدة</TabsTrigger>
          <TabsTrigger value="logs">سجل الإرسال</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Filters and Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في القوالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="نوع التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="fitness_progress">تقدم اللياقة</SelectItem>
                <SelectItem value="attendance">الحضور</SelectItem>
                <SelectItem value="competition_results">نتائج المسابقات</SelectItem>
                <SelectItem value="device_usage">استخدام الأجهزة</SelectItem>
                <SelectItem value="custom">مخصص</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowTemplateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              قالب جديد
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {getFormatIcon(template.format)}
                      {template.isActive && (
                        <Badge className="bg-green-100 text-green-800" size="sm">نشط</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">التكرار:</span>
                      <p className="font-medium">
                        {template.frequency === 'manual' && 'يدوي'}
                        {template.frequency === 'daily' && 'يومي'}
                        {template.frequency === 'weekly' && 'أسبوعي'}
                        {template.frequency === 'monthly' && 'شهري'}
                        {template.frequency === 'quarterly' && 'ربع سنوي'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">المستلمون:</span>
                      <p className="font-medium">{template.recipients.length} مستلم</p>
                    </div>
                    <div>
                      <span className="text-gray-600">الأقسام:</span>
                      <p className="font-medium">{template.sections.length} قسم</p>
                    </div>
                    <div>
                      <span className="text-gray-600">آخر توليد:</span>
                      <p className="font-medium text-xs">
                        {template.lastGenerated 
                          ? new Date(template.lastGenerated).toLocaleDateString('ar-SA')
                          : 'لم يتم بعد'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => generateReport(template.id, template.format)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      توليد
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التقارير المولدة</CardTitle>
              <CardDescription>جميع التقارير التي تم توليدها مؤخراً</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getFormatIcon(report.format)}
                      <div>
                        <h4 className="font-medium">{report.templateName}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>تاريخ التوليد: {new Date(report.generatedDate).toLocaleString('ar-SA')}</p>
                          {report.fileSize && (
                            <p>حجم الملف: {formatFileSize(report.fileSize)}</p>
                          )}
                          <p>الرسائل المرسلة: {report.emailsSent}/{report.emailsTotal}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === 'completed' && 'مكتمل'}
                          {report.status === 'generating' && 'جاري التوليد'}
                          {report.status === 'sending' && 'جاري الإرسال'}
                          {report.status === 'failed' && 'فشل'}
                        </Badge>
                        {report.status === 'generating' && (
                          <div className="mt-2 w-32">
                            <Progress value={report.progress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{Math.round(report.progress)}%</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'completed' && report.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل الإرسال والتحميل</CardTitle>
              <CardDescription>تتبع شامل لجميع عمليات الإرسال والتحميل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 'log_1',
                    action: 'email_sent',
                    reportName: 'تقرير التقدم الشهري للطلاب',
                    recipient: 'parent@example.com',
                    timestamp: '2024-10-02T10:35:00Z',
                    status: 'success'
                  },
                  {
                    id: 'log_2',
                    action: 'download',
                    reportName: 'تقرير الحضور الأسبوعي',
                    recipient: 'admin@school.com',
                    timestamp: '2024-10-02T09:20:00Z',
                    status: 'success'
                  },
                  {
                    id: 'log_3',
                    action: 'email_failed',
                    reportName: 'تقرير نتائج المسابقات',
                    recipient: 'invalid@email.com',
                    timestamp: '2024-10-01T16:15:00Z',
                    status: 'failed',
                    error: 'عنوان بريد إلكتروني غير صحيح'
                  }
                ].map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-sm">
                          {log.action === 'email_sent' && 'تم إرسال بريد إلكتروني'}
                          {log.action === 'download' && 'تم تحميل التقرير'}
                          {log.action === 'email_failed' && 'فشل في إرسال البريد'}
                        </h4>
                        <div className="text-xs text-gray-600">
                          <p>{log.reportName}</p>
                          <p>إلى: {log.recipient}</p>
                          {log.error && <p className="text-red-600">خطأ: {log.error}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Creation/Edit Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'تعديل قالب التقرير' : 'إنشاء قالب تقرير جديد'}
            </DialogTitle>
            <DialogDescription>
              قم بتخصيص إعدادات التقرير والمستلمين والمحتوى
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">الإعدادات الأساسية</TabsTrigger>
              <TabsTrigger value="filters">المرشحات</TabsTrigger>
              <TabsTrigger value="recipients">المستلمون</TabsTrigger>
              <TabsTrigger value="content">المحتوى</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateName">اسم القالب</Label>
                  <Input id="templateName" placeholder="أدخل اسم القالب" />
                </div>
                <div>
                  <Label htmlFor="templateType">نوع التقرير</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness_progress">تقدم اللياقة البدنية</SelectItem>
                      <SelectItem value="attendance">الحضور</SelectItem>
                      <SelectItem value="competition_results">نتائج المسابقات</SelectItem>
                      <SelectItem value="device_usage">استخدام الأجهزة</SelectItem>
                      <SelectItem value="custom">مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">تنسيق التقرير</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التنسيق" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF فقط</SelectItem>
                      <SelectItem value="excel">Excel فقط</SelectItem>
                      <SelectItem value="both">PDF و Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">تكرار التوليد</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التكرار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">يدوي</SelectItem>
                      <SelectItem value="daily">يومي</SelectItem>
                      <SelectItem value="weekly">أسبوعي</SelectItem>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="quarterly">ربع سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">وصف التقرير</Label>
                <Textarea id="description" placeholder="أدخل وصف التقرير" rows={3} />
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provinces">الولايات</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الولايات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الولايات</SelectItem>
                      <SelectItem value="algiers">الجزائر</SelectItem>
                      <SelectItem value="oran">وهران</SelectItem>
                      <SelectItem value="constantine">قسنطينة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schools">المدارس</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدارس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المدارس</SelectItem>
                      <SelectItem value="school1">ثانوية الأمير عبد القادر</SelectItem>
                      <SelectItem value="school2">متوسطة الشهيد بوضياف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="classes">الصفوف</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط', 'الصف الرابع متوسط', 'السنة الأولى ثانوي', 'السنة الثانية ثانوي'].map(className => (
                    <div key={className} className="flex items-center space-x-2">
                      <Checkbox id={className} />
                      <Label htmlFor={className} className="text-sm">{className}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">قائمة المستلمين</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة مستلم
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'parent', email: 'parent@example.com', name: 'أولياء الأمور', autoSend: true },
                  { type: 'admin', email: 'admin@school.com', name: 'إدارة المدرسة', autoSend: true },
                  { type: 'ministry', email: 'ministry@education.gov', name: 'وزارة التربية', autoSend: false }
                ].map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={recipient.autoSend} />
                        <Label className="text-sm">إرسال تلقائي</Label>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{recipient.name}</p>
                        <p className="text-xs text-gray-600">{recipient.email}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">أقسام التقرير</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة قسم
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'ملخص الأداء', type: 'summary', order: 1 },
                  { title: 'رسم بياني للتقدم', type: 'chart', order: 2 },
                  { title: 'جدول النتائج التفصيلي', type: 'table', order: 3 }
                ].map((section, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                        {section.order}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{section.title}</p>
                        <p className="text-xs text-gray-600">
                          {section.type === 'summary' && 'ملخص نصي'}
                          {section.type === 'chart' && 'رسم بياني'}
                          {section.type === 'table' && 'جدول بيانات'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t">
            <Button className="flex-1">
              {selectedTemplate ? 'حفظ التغييرات' : 'إنشاء القالب'}
            </Button>
            <Button variant="outline" onClick={() => {
              setShowTemplateDialog(false);
              setSelectedTemplate(null);
            }}>
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}