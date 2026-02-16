import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  FileSpreadsheet,
  FileImage,
  Printer,
  Share2,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'شهري' | 'فصلي' | 'سنوي' | 'مخصص';
  format: 'PDF' | 'Excel' | 'Word' | 'PowerPoint';
  lastGenerated: string;
  status: 'جاهز' | 'قيد الإنشاء' | 'يحتاج تحديث';
  size: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'التقرير الشهري الشامل',
    description: 'تقرير شامل يتضمن جميع الإحصائيات والأنشطة الرياضية لجميع الولايات',
    type: 'شهري',
    format: 'PDF',
    lastGenerated: '2024-10-01',
    status: 'جاهز',
    size: '15.2 MB'
  },
  {
    id: '2',
    name: 'إحصائيات المشاركة الرياضية',
    description: 'تحليل مفصل لمعدلات المشاركة في الأنشطة الرياضية حسب الولايات والمناطق',
    type: 'فصلي',
    format: 'Excel',
    lastGenerated: '2024-09-30',
    status: 'جاهز',
    size: '8.7 MB'
  },
  {
    id: '3',
    name: 'تقرير الأداء السنوي',
    description: 'تقييم شامل للأداء التعليمي والرياضي على مستوى الجمهورية',
    type: 'سنوي',
    format: 'PDF',
    lastGenerated: '2024-09-15',
    status: 'يحتاج تحديث',
    size: '22.4 MB'
  },
  {
    id: '4',
    name: 'عرض تقديمي للمسابقات',
    description: 'عرض تقديمي يلخص نتائج المسابقات والبطولات الوطنية',
    type: 'مخصص',
    format: 'PowerPoint',
    lastGenerated: '2024-09-28',
    status: 'قيد الإنشاء',
    size: '12.1 MB'
  },
  {
    id: '5',
    name: 'تحليل البيانات الصحية',
    description: 'تقرير مفصل عن بيانات الأساور الذكية ومؤشرات الصحة العامة',
    type: 'شهري',
    format: 'Excel',
    lastGenerated: '2024-10-01',
    status: 'جاهز',
    size: '6.3 MB'
  },
  {
    id: '6',
    name: 'تقرير المرافق والتجهيزات',
    description: 'حالة المرافق الرياضية والتجهيزات في جميع المؤسسات التعليمية',
    type: 'فصلي',
    format: 'PDF',
    lastGenerated: '2024-09-20',
    status: 'يحتاج تحديث',
    size: '18.9 MB'
  }
];

export function ReportGenerator() {
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جاهز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'قيد الإنشاء': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'يحتاج تحديث': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-600" />;
      case 'Excel': return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'Word': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'PowerPoint': return <FileImage className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'جاهز': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'قيد الإنشاء': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'يحتاج تحديث': return <Settings className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleGenerateReport = (reportId: string) => {
    setGeneratingReport(reportId);
    // محاكاة عملية إنشاء التقرير
    setTimeout(() => {
      setGeneratingReport(null);
      // تحديث حالة التقرير إلى "جاهز"
    }, 3000);
  };

  const handleDownloadReport = (report: ReportTemplate) => {
    // محاكاة تحميل التقرير
    console.log(`تحميل التقرير: ${report.name} - ${report.format}`);
  };

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
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">قوالب التقارير</div>
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
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-gray-600">تقارير جاهزة</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-600">تحميل هذا الشهر</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.4GB</div>
                <div className="text-sm text-gray-600">حجم البيانات</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قوالب التقارير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            مولد التقارير الدورية
          </CardTitle>
          <CardDescription>
            إنشاء وتحميل التقارير الدورية بصيغ مختلفة (PDF, Excel, Word, PowerPoint)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportTemplates.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <h4 className="font-medium">{report.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {getFormatIcon(report.format)}
                    <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar-DZ')}
                  </span>
                  <span>{report.size}</span>
                </div>
                
                <div className="flex gap-2">
                  {report.status === 'جاهز' ? (
                    <>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadReport(report);
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        تحميل {report.format}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(report.id);
                        }}
                      >
                        تحديث
                      </Button>
                    </>
                  ) : report.status === 'قيد الإنشاء' || generatingReport === report.id ? (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span className="text-sm">جاري الإنشاء...</span>
                      </div>
                      <Progress value={65} className="h-1.5" />
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateReport(report.id);
                      }}
                    >
                      إنشاء التقرير
                    </Button>
                  )}
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
              {getFormatIcon(selectedReport.format)}
              معاينة التقرير: {selectedReport.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">تفاصيل التقرير</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>النوع:</span>
                    <span>{selectedReport.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الصيغة:</span>
                    <span>{selectedReport.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>آخر إنشاء:</span>
                    <span>{new Date(selectedReport.lastGenerated).toLocaleDateString('ar-DZ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحجم:</span>
                    <span>{selectedReport.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحالة:</span>
                    <Badge className={`text-xs ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">الإجراءات المتاحة</h4>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل بصيغة PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    تحميل بصيغة Excel
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    طباعة التقرير
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    مشاركة عبر البريد
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    تخصيص القالب
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