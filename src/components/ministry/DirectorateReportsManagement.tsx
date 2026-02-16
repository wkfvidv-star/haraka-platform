import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  MapPin,
  Archive,
  Send,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';

interface DirectorateReport {
  id: string;
  title: string;
  provinceName: string;
  provinceArabicName: string;
  region: 'الشمال' | 'الوسط' | 'الجنوب' | 'الشرق' | 'الغرب';
  reportType: 'monthly' | 'quarterly' | 'annual' | 'special';
  category: 'performance' | 'competitions' | 'infrastructure' | 'budget' | 'emergency';
  submissionDate: string;
  reportPeriod: string;
  status: 'pending_review' | 'under_review' | 'approved' | 'requires_action' | 'archived';
  priority: 'high' | 'medium' | 'low';
  summary: string;
  keyMetrics: {
    schools: number;
    students: number;
    teachers: number;
    performance: number;
    attendance: number;
    budget: number;
  };
  attachments: string[];
  reviewNotes?: string;
  actionRequired?: string;
}

interface DirectorateReportsManagementProps {
  onReportSelect: (report: DirectorateReport) => void;
}

export function DirectorateReportsManagement({ onReportSelect }: DirectorateReportsManagementProps) {
  const [reports, setReports] = useState<DirectorateReport[]>([
    {
      id: 'rpt_001',
      title: 'التقرير الشهري - أكتوبر 2024',
      provinceName: 'Alger',
      provinceArabicName: 'الجزائر',
      region: 'الوسط',
      reportType: 'monthly',
      category: 'performance',
      submissionDate: '2024-10-16',
      reportPeriod: 'أكتوبر 2024',
      status: 'pending_review',
      priority: 'high',
      summary: 'تقرير شامل عن أداء المدارس في ولاية الجزائر خلال شهر أكتوبر، يتضمن إحصائيات الحضور والأداء الأكاديمي',
      keyMetrics: {
        schools: 680,
        students: 156780,
        teachers: 7250,
        performance: 92.4,
        attendance: 94.8,
        budget: 45000000
      },
      attachments: [
        'تقرير_الجزائر_أكتوبر_2024.pdf',
        'إحصائيات_مفصلة.xlsx',
        'تقرير_المسابقات.docx'
      ]
    },
    {
      id: 'rpt_002',
      title: 'تقرير نتائج المسابقات الوطنية',
      provinceName: 'Oran',
      provinceArabicName: 'وهران',
      region: 'الغرب',
      reportType: 'special',
      category: 'competitions',
      submissionDate: '2024-10-15',
      reportPeriod: 'الربع الأول 2024',
      status: 'under_review',
      priority: 'medium',
      summary: 'تقرير تفصيلي عن نتائج المسابقات الرياضية والثقافية على مستوى ولاية وهران',
      keyMetrics: {
        schools: 580,
        students: 128340,
        teachers: 5940,
        performance: 90.8,
        attendance: 93.2,
        budget: 38000000
      },
      attachments: [
        'نتائج_المسابقات_وهران.pdf',
        'صور_الفعاليات.zip'
      ],
      reviewNotes: 'تقرير ممتاز، يحتاج مراجعة بسيطة في قسم الميزانية'
    },
    {
      id: 'rpt_003',
      title: 'تقرير الطوارئ - نقص المعدات',
      provinceName: 'Constantine',
      provinceArabicName: 'قسنطينة',
      region: 'الشرق',
      reportType: 'special',
      category: 'emergency',
      submissionDate: '2024-10-14',
      reportPeriod: 'عاجل',
      status: 'requires_action',
      priority: 'high',
      summary: 'تقرير عاجل حول نقص حاد في المعدات الرياضية في عدة مدارس بولاية قسنطينة',
      keyMetrics: {
        schools: 480,
        students: 105670,
        teachers: 4890,
        performance: 89.6,
        attendance: 92.5,
        budget: 35000000
      },
      attachments: [
        'تقرير_النقص_قسنطينة.pdf',
        'قائمة_المعدات_المطلوبة.xlsx'
      ],
      actionRequired: 'تخصيص ميزانية طارئة لشراء المعدات المطلوبة'
    },
    {
      id: 'rpt_004',
      title: 'التقرير الربع سنوي - الربع الثالث',
      provinceName: 'Sétif',
      provinceArabicName: 'سطيف',
      region: 'الشرق',
      reportType: 'quarterly',
      category: 'performance',
      submissionDate: '2024-10-13',
      reportPeriod: 'الربع الثالث 2024',
      status: 'approved',
      priority: 'medium',
      summary: 'تقرير ربع سنوي شامل عن أداء قطاع التعليم في ولاية سطيف',
      keyMetrics: {
        schools: 520,
        students: 112340,
        teachers: 5180,
        performance: 88.9,
        attendance: 91.8,
        budget: 42000000
      },
      attachments: [
        'تقرير_سطيف_ق3_2024.pdf',
        'المؤشرات_الأساسية.xlsx'
      ],
      reviewNotes: 'تقرير معتمد، أداء ممتاز في جميع المؤشرات'
    },
    {
      id: 'rpt_005',
      title: 'تقرير البنية التحتية والصيانة',
      provinceName: 'Béjaïa',
      provinceArabicName: 'بجاية',
      region: 'الشمال',
      reportType: 'special',
      category: 'infrastructure',
      submissionDate: '2024-10-12',
      reportPeriod: 'سبتمبر 2024',
      status: 'under_review',
      priority: 'medium',
      summary: 'تقرير حول حالة البنية التحتية للمدارس ومشاريع الصيانة المنجزة',
      keyMetrics: {
        schools: 380,
        students: 85670,
        teachers: 3890,
        performance: 87.3,
        attendance: 90.4,
        budget: 28000000
      },
      attachments: [
        'تقرير_البنية_بجاية.pdf',
        'صور_المشاريع.zip',
        'تكاليف_الصيانة.xlsx'
      ]
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<DirectorateReport | null>(null);
  const [filterRegion, setFilterRegion] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterType, setFilterType] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const regionOptions = ['الكل', 'الوسط', 'الشرق', 'الغرب', 'الشمال', 'الجنوب'];
  const statusOptions = ['الكل', 'في انتظار المراجعة', 'قيد المراجعة', 'معتمد', 'يحتاج إجراء', 'مؤرشف'];
  const typeOptions = ['الكل', 'شهري', 'ربع سنوي', 'سنوي', 'خاص'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'requires_action': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
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
      case 'performance': return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'competitions': return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'infrastructure': return <Building2 className="h-4 w-4 text-green-500" />;
      case 'budget': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'الوسط': return 'text-blue-600';
      case 'الشرق': return 'text-green-600';
      case 'الغرب': return 'text-orange-600';
      case 'الشمال': return 'text-purple-600';
      case 'الجنوب': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.provinceArabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = filterRegion === 'الكل' || report.region === filterRegion;
    
    const matchesStatus = filterStatus === 'الكل' ||
                         (filterStatus === 'في انتظار المراجعة' && report.status === 'pending_review') ||
                         (filterStatus === 'قيد المراجعة' && report.status === 'under_review') ||
                         (filterStatus === 'معتمد' && report.status === 'approved') ||
                         (filterStatus === 'يحتاج إجراء' && report.status === 'requires_action') ||
                         (filterStatus === 'مؤرشف' && report.status === 'archived');
    
    const matchesType = filterType === 'الكل' ||
                       (filterType === 'شهري' && report.reportType === 'monthly') ||
                       (filterType === 'ربع سنوي' && report.reportType === 'quarterly') ||
                       (filterType === 'سنوي' && report.reportType === 'annual') ||
                       (filterType === 'خاص' && report.reportType === 'special');
    
    return matchesSearch && matchesRegion && matchesStatus && matchesType;
  });

  const handleExportCSV = () => {
    const csvContent = [
      ['العنوان', 'الولاية', 'المنطقة', 'النوع', 'الحالة', 'تاريخ التقديم', 'الأداء', 'الحضور'],
      ...filteredReports.map(report => [
        report.title,
        report.provinceArabicName,
        report.region,
        report.reportType,
        report.status,
        report.submissionDate,
        `${report.keyMetrics.performance}%`,
        `${report.keyMetrics.attendance}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `تقارير_المديريات_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const pendingCount = reports.filter(r => r.status === 'pending_review').length;
  const underReviewCount = reports.filter(r => r.status === 'under_review').length;
  const requiresActionCount = reports.filter(r => r.status === 'requires_action').length;
  const approvedCount = reports.filter(r => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            إدارة تقارير المديريات - المستوى الوطني
          </CardTitle>
          <CardDescription className="text-blue-100">
            استلام ومراجعة واعتماد التقارير الواردة من جميع مديريات التعليم في الوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg relative">
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-sm text-blue-100">في انتظار المراجعة</div>
              {pendingCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{underReviewCount}</div>
              <div className="text-sm text-blue-100">قيد المراجعة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg relative">
              <div className="text-2xl font-bold">{requiresActionCount}</div>
              <div className="text-sm text-blue-100">يحتاج إجراء</div>
              {requiresActionCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{approvedCount}</div>
              <div className="text-sm text-blue-100">معتمد</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <CardTitle className="text-sm">المنطقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
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
              <Button size="sm" variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button size="sm" variant="outline">
                <FileImage className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getCategoryIcon(report.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-lg">{report.title}</h4>
                      <Badge className={getStatusColor(report.status)} size="sm">
                        {report.status === 'pending_review' && 'في انتظار المراجعة'}
                        {report.status === 'under_review' && 'قيد المراجعة'}
                        {report.status === 'approved' && 'معتمد'}
                        {report.status === 'requires_action' && 'يحتاج إجراء'}
                        {report.status === 'archived' && 'مؤرشف'}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)} size="sm">
                        {report.priority === 'high' && 'عالية'}
                        {report.priority === 'medium' && 'متوسطة'}
                        {report.priority === 'low' && 'منخفضة'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className={getRegionColor(report.region)}>
                          {report.provinceArabicName} ({report.region})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.submissionDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{report.reportPeriod}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {report.summary}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="font-bold text-blue-600">{report.keyMetrics.schools}</div>
                        <div className="text-gray-500">مدرسة</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="font-bold text-green-600">{(report.keyMetrics.students / 1000).toFixed(0)}ك</div>
                        <div className="text-gray-500">طالب</div>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="font-bold text-purple-600">{report.keyMetrics.teachers}</div>
                        <div className="text-gray-500">معلم</div>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="font-bold text-orange-600">{report.keyMetrics.performance}%</div>
                        <div className="text-gray-500">أداء</div>
                      </div>
                      <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                        <div className="font-bold text-teal-600">{report.keyMetrics.attendance}%</div>
                        <div className="text-gray-500">حضور</div>
                      </div>
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="font-bold text-red-600">{(report.keyMetrics.budget / 1000000).toFixed(1)}م</div>
                        <div className="text-gray-500">ميزانية</div>
                      </div>
                    </div>

                    {/* Attachments */}
                    {report.attachments.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {report.attachments.length} مرفق
                        </span>
                      </div>
                    )}

                    {/* Review Notes or Action Required */}
                    {report.reviewNotes && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                        <strong>ملاحظات المراجعة:</strong> {report.reviewNotes}
                      </div>
                    )}
                    {report.actionRequired && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                        <strong>إجراء مطلوب:</strong> {report.actionRequired}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => onReportSelect(report)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    مراجعة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
            <p className="text-gray-500">لا توجد تقارير تطابق المرشحات المحددة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}