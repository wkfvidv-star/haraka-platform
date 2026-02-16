import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Upload, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  School
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  province: string;
  type: 'شهري' | 'فصلي' | 'سنوي' | 'طارئ';
  status: 'مستلم' | 'قيد المراجعة' | 'مكتمل' | 'متأخر';
  date: string;
  size: string;
  priority: 'عالي' | 'متوسط' | 'منخفض';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'التقرير الشهري للأنشطة الرياضية',
    province: 'الجزائر',
    type: 'شهري',
    status: 'مستلم',
    date: '2024-10-01',
    size: '2.4 MB',
    priority: 'عالي'
  },
  {
    id: '2',
    title: 'تقرير نتائج المسابقات المدرسية',
    province: 'وهران',
    type: 'فصلي',
    status: 'قيد المراجعة',
    date: '2024-09-28',
    size: '1.8 MB',
    priority: 'متوسط'
  },
  {
    id: '3',
    title: 'تقرير حالة المرافق الرياضية',
    province: 'قسنطينة',
    type: 'سنوي',
    status: 'مكتمل',
    date: '2024-09-25',
    size: '3.2 MB',
    priority: 'عالي'
  },
  {
    id: '4',
    title: 'تقرير الحضور والمشاركة',
    province: 'سطيف',
    type: 'شهري',
    status: 'متأخر',
    date: '2024-09-20',
    size: '1.5 MB',
    priority: 'عالي'
  },
  {
    id: '5',
    title: 'تقرير التجهيزات والمعدات',
    province: 'باتنة',
    type: 'فصلي',
    status: 'مستلم',
    date: '2024-09-30',
    size: '2.1 MB',
    priority: 'متوسط'
  }
];

export function ReportsManager() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مستلم': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'قيد المراجعة': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'مكتمل': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'متأخر': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مستلم': return <CheckCircle className="h-4 w-4" />;
      case 'قيد المراجعة': return <Clock className="h-4 w-4" />;
      case 'مكتمل': return <CheckCircle className="h-4 w-4" />;
      case 'متأخر': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredReports = mockReports.filter(report => {
    const matchesStatus = filterStatus === '' || report.status === filterStatus;
    const matchesType = filterType === '' || report.type === filterType;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* إحصائيات التقارير */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">124</div>
                <div className="text-sm text-gray-600">إجمالي التقارير</div>
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
                <div className="text-2xl font-bold">98</div>
                <div className="text-sm text-gray-600">تقارير مكتملة</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-gray-600">قيد المراجعة</div>
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
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-600">تقارير متأخرة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر التقارير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            إدارة التقارير
          </CardTitle>
          <CardDescription>
            عرض وإدارة جميع التقارير الواردة من مديريات التعليم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('')}
              >
                جميع الحالات
              </Button>
              <Button
                variant={filterStatus === 'مستلم' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('مستلم')}
              >
                مستلم
              </Button>
              <Button
                variant={filterStatus === 'قيد المراجعة' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('قيد المراجعة')}
              >
                قيد المراجعة
              </Button>
              <Button
                variant={filterStatus === 'متأخر' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('متأخر')}
              >
                متأخر
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('')}
              >
                جميع الأنواع
              </Button>
              <Button
                variant={filterType === 'شهري' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('شهري')}
              >
                شهري
              </Button>
              <Button
                variant={filterType === 'فصلي' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('فصلي')}
              >
                فصلي
              </Button>
              <Button
                variant={filterType === 'سنوي' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('سنوي')}
              >
                سنوي
              </Button>
            </div>
          </div>

          {/* قائمة التقارير */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <h4 className="font-medium">{report.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <School className="h-3 w-3" />
                    <span>ولاية {report.province}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{report.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(report.date).toLocaleDateString('ar-DZ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    <span>{report.size}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    إرسال ملاحظات
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معاينة التقرير المحدد */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              معاينة التقرير: {selectedReport.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">تفاصيل التقرير</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>الولاية:</span>
                    <span>{selectedReport.province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النوع:</span>
                    <span>{selectedReport.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التاريخ:</span>
                    <span>{new Date(selectedReport.date).toLocaleDateString('ar-DZ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحجم:</span>
                    <span>{selectedReport.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الأولوية:</span>
                    <Badge className={`text-xs ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">الإجراءات المتاحة</h4>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل التقرير الكامل
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    عرض الملخص التنفيذي
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    تحليل البيانات
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    مشاركة مع الفريق
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}