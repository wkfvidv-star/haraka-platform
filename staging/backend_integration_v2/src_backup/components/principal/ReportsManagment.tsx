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
  FileText,
  BarChart3,
  Download,
  Send,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  School,
  Trophy,
  TrendingUp,
  CheckCircle,
  Upload,
  Mail,
  Printer,
  Share2,
  Filter,
  Search
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  category: 'class_performance' | 'school_overview' | 'competition_results' | 'ministry_report';
  status: 'draft' | 'completed' | 'sent' | 'approved';
  createdDate: string;
  lastModified: string;
  recipient: 'parents' | 'ministry' | 'internal';
  classId?: string;
  className?: string;
  summary: string;
  metrics: {
    totalStudents: number;
    averagePerformance: number;
    attendanceRate: number;
    completedActivities: number;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'class' | 'school' | 'competition' | 'ministry';
  sections: string[];
}

const mockReports: Report[] = [
  {
    id: 'report_1',
    title: 'التقرير الشهري - أكتوبر 2024',
    type: 'monthly',
    category: 'school_overview',
    status: 'completed',
    createdDate: '2024-10-15',
    lastModified: '2024-10-16',
    recipient: 'ministry',
    summary: 'تقرير شامل عن أداء المدرسة خلال شهر أكتوبر',
    metrics: {
      totalStudents: 847,
      averagePerformance: 87.3,
      attendanceRate: 92.5,
      completedActivities: 1245
    }
  },
  {
    id: 'report_2',
    title: 'تقرير أداء الصف الأول متوسط - أ',
    type: 'monthly',
    category: 'class_performance',
    status: 'draft',
    createdDate: '2024-10-14',
    lastModified: '2024-10-16',
    recipient: 'parents',
    classId: 'class_1',
    className: 'الأول متوسط - أ',
    summary: 'تقرير تفصيلي عن تقدم طلاب الصف الأول متوسط',
    metrics: {
      totalStudents: 32,
      averagePerformance: 89.2,
      attendanceRate: 94.5,
      completedActivities: 145
    }
  },
  {
    id: 'report_3',
    title: 'نتائج مسابقة اللياقة البدنية',
    type: 'custom',
    category: 'competition_results',
    status: 'sent',
    createdDate: '2024-10-10',
    lastModified: '2024-10-12',
    recipient: 'parents',
    summary: 'تقرير نتائج مسابقة اللياقة البدنية للمرحلة المتوسطة',
    metrics: {
      totalStudents: 156,
      averagePerformance: 85.7,
      attendanceRate: 98.2,
      completedActivities: 8
    }
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 'template_1',
    name: 'تقرير الصف الشهري',
    description: 'قالب للتقارير الشهرية لكل صف دراسي',
    type: 'class',
    sections: ['نظرة عامة', 'الأداء الأكاديمي', 'الأنشطة الرياضية', 'الحضور والغياب', 'التوصيات']
  },
  {
    id: 'template_2',
    name: 'تقرير المدرسة الفصلي',
    description: 'قالب للتقرير الفصلي الشامل للمدرسة',
    type: 'school',
    sections: ['الإحصائيات العامة', 'أداء الصفوف', 'المسابقات والإنجازات', 'التحديات والحلول', 'الخطط المستقبلية']
  },
  {
    id: 'template_3',
    name: 'تقرير المسابقات',
    description: 'قالب لتقارير نتائج المسابقات الرياضية',
    type: 'competition',
    sections: ['تفاصيل المسابقة', 'المشاركون', 'النتائج', 'الإحصائيات', 'التوصيات']
  },
  {
    id: 'template_4',
    name: 'التقرير الوزاري',
    description: 'قالب للتقارير المرسلة لوزارة التعليم',
    type: 'ministry',
    sections: ['البيانات الأساسية', 'المؤشرات الرئيسية', 'الإنجازات', 'التحديات', 'الاحتياجات']
  }
];

export function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterType, setFilterType] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['الكل', 'مسودة', 'مكتمل', 'مرسل', 'معتمد'];
  const typeOptions = ['الكل', 'شهري', 'ربع سنوي', 'سنوي', 'مخصص'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'approved': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'class_performance': return <Users className="h-4 w-4" />;
      case 'school_overview': return <School className="h-4 w-4" />;
      case 'competition_results': return <Trophy className="h-4 w-4" />;
      case 'ministry_report': return <FileText className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getRecipientIcon = (recipient: string) => {
    switch (recipient) {
      case 'parents': return <Users className="h-4 w-4 text-blue-500" />;
      case 'ministry': return <School className="h-4 w-4 text-red-500" />;
      case 'internal': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'الكل' || 
                         (filterStatus === 'مسودة' && report.status === 'draft') ||
                         (filterStatus === 'مكتمل' && report.status === 'completed') ||
                         (filterStatus === 'مرسل' && report.status === 'sent') ||
                         (filterStatus === 'معتمد' && report.status === 'approved');
    const matchesType = filterType === 'الكل' ||
                       (filterType === 'شهري' && report.type === 'monthly') ||
                       (filterType === 'ربع سنوي' && report.type === 'quarterly') ||
                       (filterType === 'سنوي' && report.type === 'annual') ||
                       (filterType === 'مخصص' && report.type === 'custom');
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSendReport = (reportId: string, recipient: 'parents' | 'ministry') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'sent' as const, recipient }
        : report
    ));
    alert(`تم إرسال التقرير بنجاح إلى ${recipient === 'parents' ? 'أولياء الأمور' : 'الوزارة'}!`);
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء تقرير جديد
          </CardTitle>
          <CardDescription>
            قم بإنشاء تقرير مخصص أو استخدم أحد القوالب الجاهزة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-title">عنوان التقرير</Label>
              <Input id="report-title" placeholder="عنوان التقرير..." />
            </div>
            <div>
              <Label htmlFor="report-type">نوع التقرير</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-category">فئة التقرير</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class_performance">أداء الصف</SelectItem>
                  <SelectItem value="school_overview">نظرة عامة على المدرسة</SelectItem>
                  <SelectItem value="competition_results">نتائج المسابقات</SelectItem>
                  <SelectItem value="ministry_report">تقرير وزاري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-recipient">المستلم</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستلم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parents">أولياء الأمور</SelectItem>
                  <SelectItem value="ministry">وزارة التعليم</SelectItem>
                  <SelectItem value="internal">داخلي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <Label>اختيار القالب</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.slice(0, 3).map((section, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                      {template.sections.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.sections.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div>
            <Label htmlFor="report-summary">ملخص التقرير</Label>
            <Textarea 
              id="report-summary" 
              placeholder="ملخص مختصر عن محتوى التقرير..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              إنشاء التقرير
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportDetails = () => {
    if (!selectedReport) return null;

    return (
      <div className="space-y-6">
        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getCategoryIcon(selectedReport.category)}
                  {selectedReport.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedReport.summary}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status === 'draft' && 'مسودة'}
                    {selectedReport.status === 'completed' && 'مكتمل'}
                    {selectedReport.status === 'sent' && 'مرسل'}
                    {selectedReport.status === 'approved' && 'معتمد'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getRecipientIcon(selectedReport.recipient)}
                    <span className="text-sm text-gray-500">
                      {selectedReport.recipient === 'parents' && 'أولياء الأمور'}
                      {selectedReport.recipient === 'ministry' && 'وزارة التعليم'}
                      {selectedReport.recipient === 'internal' && 'داخلي'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedReport(null)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.totalStudents}</div>
              <div className="text-sm text-gray-500">إجمالي الطلاب</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.averagePerformance}%</div>
              <div className="text-sm text-gray-500">متوسط الأداء</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.attendanceRate}%</div>
              <div className="text-sm text-gray-500">معدل الحضور</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.completedActivities}</div>
              <div className="text-sm text-gray-500">أنشطة مكتملة</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات التقرير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-16 flex-col gap-2"
                onClick={() => handleSendReport(selectedReport.id, 'parents')}
                disabled={selectedReport.status === 'sent'}
              >
                <Send className="h-6 w-6" />
                إرسال لأولياء الأمور
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => handleSendReport(selectedReport.id, 'ministry')}
                disabled={selectedReport.status === 'sent'}
              >
                <Upload className="h-6 w-6" />
                رفع للوزارة
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Download className="h-6 w-6" />
                تحميل PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Content Preview */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium mb-2">معلومات التقرير</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">تاريخ الإنشاء: </span>
                    <span>{selectedReport.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">آخر تعديل: </span>
                    <span>{selectedReport.lastModified}</span>
                  </div>
                  {selectedReport.className && (
                    <div>
                      <span className="text-gray-500">الصف: </span>
                      <span>{selectedReport.className}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">النوع: </span>
                    <span>
                      {selectedReport.type === 'monthly' && 'شهري'}
                      {selectedReport.type === 'quarterly' && 'ربع سنوي'}
                      {selectedReport.type === 'annual' && 'سنوي'}
                      {selectedReport.type === 'custom' && 'مخصص'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">الملخص التنفيذي</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedReport.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (selectedReport) {
    return renderReportDetails();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            إدارة التقارير
          </CardTitle>
          <CardDescription className="text-green-100">
            واجهة احترافية لإعداد وإرسال التقارير لأولياء الأمور والوزارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-sm text-green-100">إجمالي التقارير</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-green-100">تقارير مكتملة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'sent').length}
                </div>
                <div className="text-sm text-green-100">تقارير مرسلة</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء تقرير جديد
            </Button>
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
                placeholder="ابحث في التقارير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <CardTitle className="text-sm">إجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                استيراد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(report.category)}
                  <Badge className={getStatusColor(report.status)}>
                    {report.status === 'draft' && 'مسودة'}
                    {report.status === 'completed' && 'مكتمل'}
                    {report.status === 'sent' && 'مرسل'}
                    {report.status === 'approved' && 'معتمد'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getRecipientIcon(report.recipient)}
                </div>
              </div>
              
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>{report.summary}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Report Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{report.metrics.totalStudents}</div>
                  <div className="text-xs text-gray-500">طلاب</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">{report.metrics.averagePerformance}%</div>
                  <div className="text-xs text-gray-500">أداء</div>
                </div>
              </div>

              {/* Report Info */}
              <div className="text-sm text-gray-500 space-y-1">
                <div>تاريخ الإنشاء: {report.createdDate}</div>
                <div>آخر تعديل: {report.lastModified}</div>
                {report.className && <div>الصف: {report.className}</div>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
}