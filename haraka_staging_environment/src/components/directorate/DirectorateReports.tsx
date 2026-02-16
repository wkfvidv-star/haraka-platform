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
  Search,
  Building2
} from 'lucide-react';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  schools: number;
  students: number;
  teachers: number;
}

interface DirectorateReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  category: 'province_overview' | 'schools_performance' | 'competition_results' | 'ministry_report';
  status: 'draft' | 'completed' | 'sent_to_schools' | 'sent_to_ministry' | 'approved';
  createdDate: string;
  lastModified: string;
  recipient: 'schools' | 'ministry' | 'internal';
  schoolsCount?: number;
  summary: string;
  metrics: {
    totalSchools: number;
    totalStudents: number;
    totalTeachers: number;
    averagePerformance: number;
    attendanceRate: number;
    completedActivities: number;
  };
  province: Province;
}

interface DirectorateReportsProps {
  selectedProvince: Province;
}

export function DirectorateReports({ selectedProvince }: DirectorateReportsProps) {
  const [reports, setReports] = useState<DirectorateReport[]>([
    {
      id: 'report_1',
      title: `التقرير الشهري - ولاية ${selectedProvince.arabicName} - أكتوبر 2024`,
      type: 'monthly',
      category: 'province_overview',
      status: 'completed',
      createdDate: '2024-10-15',
      lastModified: '2024-10-16',
      recipient: 'ministry',
      summary: `تقرير شامل عن أداء المدارس في ولاية ${selectedProvince.arabicName} خلال شهر أكتوبر`,
      metrics: {
        totalSchools: selectedProvince.schools,
        totalStudents: selectedProvince.students,
        totalTeachers: selectedProvince.teachers,
        averagePerformance: 87.3,
        attendanceRate: 92.5,
        completedActivities: Math.floor(selectedProvince.schools * 8.5)
      },
      province: selectedProvince
    },
    {
      id: 'report_2',
      title: `تقرير أداء المدارس المتوسطة - ولاية ${selectedProvince.arabicName}`,
      type: 'monthly',
      category: 'schools_performance',
      status: 'draft',
      createdDate: '2024-10-14',
      lastModified: '2024-10-16',
      recipient: 'schools',
      schoolsCount: Math.floor(selectedProvince.schools * 0.4),
      summary: 'تقرير تفصيلي عن تقدم المدارس المتوسطة في الولاية',
      metrics: {
        totalSchools: Math.floor(selectedProvince.schools * 0.4),
        totalStudents: Math.floor(selectedProvince.students * 0.35),
        totalTeachers: Math.floor(selectedProvince.teachers * 0.38),
        averagePerformance: 89.2,
        attendanceRate: 94.5,
        completedActivities: Math.floor(selectedProvince.schools * 3.2)
      },
      province: selectedProvince
    },
    {
      id: 'report_3',
      title: `نتائج مسابقة اللياقة البدنية - ولاية ${selectedProvince.arabicName}`,
      type: 'custom',
      category: 'competition_results',
      status: 'sent_to_schools',
      createdDate: '2024-10-10',
      lastModified: '2024-10-12',
      recipient: 'schools',
      schoolsCount: Math.floor(selectedProvince.schools * 0.8),
      summary: 'تقرير نتائج مسابقة اللياقة البدنية على مستوى الولاية',
      metrics: {
        totalSchools: Math.floor(selectedProvince.schools * 0.8),
        totalStudents: Math.floor(selectedProvince.students * 0.6),
        totalTeachers: Math.floor(selectedProvince.teachers * 0.7),
        averagePerformance: 85.7,
        attendanceRate: 98.2,
        completedActivities: 15
      },
      province: selectedProvince
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<DirectorateReport | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterType, setFilterType] = useState('الكل');

  const statusOptions = ['الكل', 'مسودة', 'مكتمل', 'مرسل للمدارس', 'مرسل للوزارة', 'معتمد'];
  const typeOptions = ['الكل', 'شهري', 'ربع سنوي', 'سنوي', 'مخصص'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'sent_to_schools': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'sent_to_ministry': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'schools_performance': return <School className="h-4 w-4" />;
      case 'province_overview': return <Building2 className="h-4 w-4" />;
      case 'competition_results': return <Trophy className="h-4 w-4" />;
      case 'ministry_report': return <FileText className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getRecipientIcon = (recipient: string) => {
    switch (recipient) {
      case 'schools': return <School className="h-4 w-4 text-blue-500" />;
      case 'ministry': return <Building2 className="h-4 w-4 text-red-500" />;
      case 'internal': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleSendReport = (reportId: string, recipient: 'schools' | 'ministry') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: recipient === 'schools' ? 'sent_to_schools' as const : 'sent_to_ministry' as const,
            recipient 
          }
        : report
    ));
    alert(`تم إرسال التقرير بنجاح إلى ${recipient === 'schools' ? 'جميع المدارس في الولاية' : 'وزارة التربية الوطنية'}!`);
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء تقرير جديد - ولاية {selectedProvince.arabicName}
          </CardTitle>
          <CardDescription>
            قم بإنشاء تقرير مخصص للولاية أو استخدم أحد القوالب الجاهزة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-title">عنوان التقرير</Label>
              <Input 
                id="report-title" 
                placeholder={`تقرير ولاية ${selectedProvince.arabicName}...`}
              />
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
                  <SelectItem value="province_overview">نظرة عامة على الولاية</SelectItem>
                  <SelectItem value="schools_performance">أداء المدارس</SelectItem>
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
                  <SelectItem value="schools">جميع المدارس في الولاية</SelectItem>
                  <SelectItem value="ministry">وزارة التربية الوطنية</SelectItem>
                  <SelectItem value="internal">داخلي</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              بيانات الولاية المختارة
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">المدارس: </span>
                <span className="font-medium">{selectedProvince.schools}</span>
              </div>
              <div>
                <span className="text-gray-500">الطلاب: </span>
                <span className="font-medium">{selectedProvince.students.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">المعلمون: </span>
                <span className="font-medium">{selectedProvince.teachers}</span>
              </div>
            </div>
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
                    {selectedReport.status === 'sent_to_schools' && 'مرسل للمدارس'}
                    {selectedReport.status === 'sent_to_ministry' && 'مرسل للوزارة'}
                    {selectedReport.status === 'approved' && 'معتمد'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getRecipientIcon(selectedReport.recipient)}
                    <span className="text-sm text-gray-500">
                      {selectedReport.recipient === 'schools' && 'المدارس'}
                      {selectedReport.recipient === 'ministry' && 'وزارة التربية الوطنية'}
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
              <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.totalSchools}</div>
              <div className="text-sm text-gray-500">إجمالي المدارس</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-500">إجمالي الطلاب</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.averagePerformance}%</div>
              <div className="text-sm text-gray-500">متوسط الأداء</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedReport.metrics.attendanceRate}%</div>
              <div className="text-sm text-gray-500">معدل الحضور</div>
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
                onClick={() => handleSendReport(selectedReport.id, 'schools')}
                disabled={selectedReport.status === 'sent_to_schools' || selectedReport.status === 'sent_to_ministry'}
              >
                <Send className="h-6 w-6" />
                إرسال لجميع المدارس
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => handleSendReport(selectedReport.id, 'ministry')}
                disabled={selectedReport.status === 'sent_to_ministry'}
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
                    <span className="text-gray-500">الولاية: </span>
                    <span>{selectedReport.province.arabicName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">تاريخ الإنشاء: </span>
                    <span>{selectedReport.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">آخر تعديل: </span>
                    <span>{selectedReport.lastModified}</span>
                  </div>
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

              {selectedReport.schoolsCount && (
                <div>
                  <h4 className="font-medium mb-2">نطاق التقرير</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    يشمل هذا التقرير {selectedReport.schoolsCount} مدرسة من أصل {selectedReport.province.schools} مدرسة في الولاية
                  </p>
                </div>
              )}
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
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            إدارة التقارير - ولاية {selectedProvince.arabicName}
          </CardTitle>
          <CardDescription className="text-blue-100">
            واجهة احترافية لإعداد وإرسال التقارير لجميع المدارس في الولاية والوزارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-sm text-blue-100">إجمالي التقارير</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-blue-100">تقارير مكتملة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.status === 'sent_to_schools' || r.status === 'sent_to_ministry').length}
                </div>
                <div className="text-sm text-blue-100">تقارير مرسلة</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء تقرير جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(report.category)}
                  <Badge className={getStatusColor(report.status)}>
                    {report.status === 'draft' && 'مسودة'}
                    {report.status === 'completed' && 'مكتمل'}
                    {report.status === 'sent_to_schools' && 'مرسل للمدارس'}
                    {report.status === 'sent_to_ministry' && 'مرسل للوزارة'}
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
                  <div className="text-lg font-bold text-blue-600">{report.metrics.totalSchools}</div>
                  <div className="text-xs text-gray-500">مدارس</div>
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
                {report.schoolsCount && <div>عدد المدارس: {report.schoolsCount}</div>}
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