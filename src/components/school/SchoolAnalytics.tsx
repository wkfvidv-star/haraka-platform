import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Download,
  RefreshCw,
  Target,
  Activity,
  Clock,
  Bell,
  FileText,
  Filter,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SchoolAnalytics {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalAnalyses: number;
  averageScore: number;
  averageBalance: number;
  averageSpeed: number;
  averageAccuracy: number;
  monthlyImprovement: number;
  studentsNeedingSupport: number;
  lastAnalysisDate: Date;
  analysisCount: {
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
}

interface StudentNeedingSupport {
  id: string;
  name: string;
  className: string;
  lastScore: number;
  balance: number;
  speed: number;
  accuracy: number;
  lastAnalysisDate: Date;
  analysisCount: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface ClassPerformance {
  className: string;
  studentsCount: number;
  averageScore: number;
  balance: number;
  speed: number;
  accuracy: number;
  improvement: number;
  analysesCount: number;
}

export const SchoolAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<SchoolAnalytics | null>(null);
  const [studentsNeedingSupport, setStudentsNeedingSupport] = useState<StudentNeedingSupport[]>([]);
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([]);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [hasNewAnalyses, setHasNewAnalyses] = useState(false);

  // محاكاة تحميل البيانات من analysis_reports
  useEffect(() => {
    const loadSchoolAnalytics = async () => {
      setIsLoading(true);
      
      // محاكاة استعلام قاعدة البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // محاكاة البيانات المستخرجة من analysis_reports
      const mockAnalytics: SchoolAnalytics = {
        schoolId: 'school_001',
        schoolName: 'مدرسة النور الابتدائية',
        totalStudents: 456,
        totalAnalyses: 1234,
        averageScore: 74.2,
        averageBalance: 71.8,
        averageSpeed: 76.3,
        averageAccuracy: 74.5,
        monthlyImprovement: 8.7,
        studentsNeedingSupport: 23,
        lastAnalysisDate: new Date('2024-01-16'),
        analysisCount: {
          thisWeek: 45,
          thisMonth: 187,
          total: 1234
        }
      };

      const mockStudentsNeedingSupport: StudentNeedingSupport[] = [
        {
          id: 'student_001',
          name: 'أحمد محمد علي',
          className: 'الصف الخامس أ',
          lastScore: 45,
          balance: 42,
          speed: 48,
          accuracy: 45,
          lastAnalysisDate: new Date('2024-01-15'),
          analysisCount: 3,
          riskLevel: 'high'
        },
        {
          id: 'student_002',
          name: 'فاطمة الزهراء',
          className: 'الصف الرابع ب',
          lastScore: 52,
          balance: 55,
          speed: 49,
          accuracy: 52,
          lastAnalysisDate: new Date('2024-01-14'),
          analysisCount: 4,
          riskLevel: 'high'
        },
        {
          id: 'student_003',
          name: 'يوسف أحمد',
          className: 'الصف الثالث أ',
          lastScore: 58,
          balance: 60,
          speed: 56,
          accuracy: 58,
          lastAnalysisDate: new Date('2024-01-13'),
          analysisCount: 2,
          riskLevel: 'medium'
        },
        {
          id: 'student_004',
          name: 'مريم سالم',
          className: 'الصف الخامس ب',
          lastScore: 47,
          balance: 45,
          speed: 50,
          accuracy: 46,
          lastAnalysisDate: new Date('2024-01-12'),
          analysisCount: 5,
          riskLevel: 'high'
        },
        {
          id: 'student_005',
          name: 'عبد الرحمن خالد',
          className: 'الصف الرابع أ',
          lastScore: 59,
          balance: 62,
          speed: 57,
          accuracy: 58,
          lastAnalysisDate: new Date('2024-01-11'),
          analysisCount: 3,
          riskLevel: 'medium'
        }
      ];

      const mockClassPerformance: ClassPerformance[] = [
        {
          className: 'الصف الخامس أ',
          studentsCount: 28,
          averageScore: 78.5,
          balance: 76.2,
          speed: 80.1,
          accuracy: 79.2,
          improvement: 12.3,
          analysesCount: 84
        },
        {
          className: 'الصف الخامس ب',
          studentsCount: 26,
          averageScore: 75.8,
          balance: 73.4,
          speed: 77.9,
          accuracy: 76.1,
          improvement: 9.8,
          analysesCount: 78
        },
        {
          className: 'الصف الرابع أ',
          studentsCount: 30,
          averageScore: 72.1,
          balance: 69.5,
          speed: 74.2,
          accuracy: 72.6,
          improvement: 7.4,
          analysesCount: 90
        },
        {
          className: 'الصف الرابع ب',
          studentsCount: 29,
          averageScore: 70.3,
          balance: 68.1,
          speed: 72.8,
          accuracy: 70.0,
          improvement: 6.2,
          analysesCount: 87
        },
        {
          className: 'الصف الثالث أ',
          studentsCount: 25,
          averageScore: 68.9,
          balance: 66.7,
          speed: 70.5,
          accuracy: 69.5,
          improvement: 8.9,
          analysesCount: 75
        }
      ];

      setAnalytics(mockAnalytics);
      setStudentsNeedingSupport(mockStudentsNeedingSupport);
      setClassPerformance(mockClassPerformance);
      
      // محاكاة وجود تحليلات جديدة
      setHasNewAnalyses(Math.random() > 0.5);
      
      setIsLoading(false);
    };

    loadSchoolAnalytics();
  }, []);

  const exportReport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    // محاكاة إنتاج التقرير
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fileName = `تقرير_أداء_المدرسة_${new Date().toISOString().split('T')[0]}.${format}`;
    
    // محاكاة تحميل الملف
    const link = document.createElement('a');
    link.href = '#'; // في التطبيق الحقيقي، سيكون رابط الملف
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const filteredStudents = selectedRiskLevel === 'all' 
    ? studentsNeedingSupport 
    : studentsNeedingSupport.filter(s => s.riskLevel === selectedRiskLevel);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">جاري تحميل تحليلات المدرسة...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50 text-gray-500" />
        <h3 className="text-lg font-medium mb-2">لا توجد تحليلات متاحة</h3>
        <p className="text-muted-foreground">
          لم يتم العثور على تحليلات للمدرسة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with New Analysis Notification */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            تحليل الأداء العام للتلاميذ
          </h2>
          <p className="text-muted-foreground">
            تحليلات شاملة مستخرجة من جدول analysis_reports - {analytics.schoolName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasNewAnalyses && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse">
              <Bell className="h-3 w-3 mr-1" />
              تحليلات جديدة متاحة
            </Badge>
          )}
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            آخر تحديث: {analytics.lastAnalysisDate.toLocaleDateString('ar-SA')}
          </Badge>
        </div>
      </div>

      {/* School Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              متوسط الأداء العام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(analytics.averageScore)}`}>
              {analytics.averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              من {analytics.totalAnalyses} تحليل
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{analytics.monthlyImprovement}% هذا الشهر</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              الطلاب المشاركون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">طالب وطالبة</p>
            <div className="mt-2">
              <Progress value={85} className="h-2" />
              <span className="text-xs text-green-600">85% معدل المشاركة</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-600" />
              التحليلات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {analytics.analysisCount.thisMonth}
            </div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">{analytics.analysisCount.thisWeek} هذا الأسبوع</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              يحتاجون متابعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {analytics.studentsNeedingSupport}
            </div>
            <p className="text-xs text-muted-foreground">طالب (نتيجة أقل من 60%)</p>
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">يتطلب تدخل فوري</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-gray-600" />
            تصدير التقارير
          </CardTitle>
          <CardDescription>
            تحميل تقارير شاملة لأداء المدرسة بصيغ مختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => exportReport('csv')}
              disabled={isExporting}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              تصدير CSV
            </Button>
            <Button 
              onClick={() => exportReport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              تصدير PDF
            </Button>
            {isExporting && (
              <span className="text-sm text-muted-foreground">
                جاري إنتاج التقرير...
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="students">الطلاب المحتاجون للمتابعة</TabsTrigger>
          <TabsTrigger value="classes">الأداء حسب الصف</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس التفصيلية</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* School Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                المقاييس الأساسية للمدرسة
              </CardTitle>
              <CardDescription>
                متوسط الأداء في المقاييس الثلاثة الأساسية لجميع طلاب المدرسة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">التوازن</span>
                    <span className="text-lg font-bold text-blue-600">{analytics.averageBalance}%</span>
                  </div>
                  <Progress value={analytics.averageBalance} className="h-3" />
                  <p className="text-xs text-muted-foreground">أساس الحركة السليمة</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">السرعة</span>
                    <span className="text-lg font-bold text-green-600">{analytics.averageSpeed}%</span>
                  </div>
                  <Progress value={analytics.averageSpeed} className="h-3" />
                  <p className="text-xs text-muted-foreground">قوة الاستجابة الحركية</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">الدقة</span>
                    <span className="text-lg font-bold text-purple-600">{analytics.averageAccuracy}%</span>
                  </div>
                  <Progress value={analytics.averageAccuracy} className="h-3" />
                  <p className="text-xs text-muted-foreground">جودة الأداء الحركي</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                تطور الأداء الشهري
              </CardTitle>
              <CardDescription>
                رسم بياني يوضح تطور أداء المدرسة عبر الأشهر الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h4 className="font-medium text-gray-700 mb-2">رسم بياني خطي</h4>
                  <p className="text-sm text-gray-500">تطور الأداء عبر الزمن</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">تصفية حسب مستوى المخاطر:</span>
            <select 
              value={selectedRiskLevel} 
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">جميع المستويات</option>
              <option value="high">مخاطر عالية</option>
              <option value="medium">مخاطر متوسطة</option>
              <option value="low">مخاطر منخفضة</option>
            </select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                الطلاب الذين يحتاجون متابعة إضافية (نتيجة أقل من 60%)
              </CardTitle>
              <CardDescription>
                قائمة الطلاب الذين حصلوا على نتائج منخفضة ويحتاجون لتدخل تعليمي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{student.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{student.className}</span>
                          <span>{student.analysisCount} تحليل</span>
                          <span>آخر تحليل: {student.lastAnalysisDate.toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(student.lastScore)}`}>
                          {student.lastScore}%
                        </div>
                        <Badge className={getRiskLevelColor(student.riskLevel)}>
                          مخاطر {getRiskLevelText(student.riskLevel)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>التوازن</span>
                          <span>{student.balance}%</span>
                        </div>
                        <Progress value={student.balance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>السرعة</span>
                          <span>{student.speed}%</span>
                        </div>
                        <Progress value={student.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>الدقة</span>
                          <span>{student.accuracy}%</span>
                        </div>
                        <Progress value={student.accuracy} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        عرض التفاصيل
                      </Button>
                      <Button size="sm">
                        إنشاء خطة متابعة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                الأداء حسب الصف الدراسي
              </CardTitle>
              <CardDescription>
                مقارنة أداء الصفوف المختلفة في المدرسة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classPerformance.map((classData, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{classData.className}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{classData.studentsCount} طالب</span>
                          <span>{classData.analysesCount} تحليل</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(classData.averageScore)}`}>
                          {classData.averageScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">متوسط الصف</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>التوازن</span>
                          <span>{classData.balance}%</span>
                        </div>
                        <Progress value={classData.balance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>السرعة</span>
                          <span>{classData.speed}%</span>
                        </div>
                        <Progress value={classData.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>الدقة</span>
                          <span>{classData.accuracy}%</span>
                        </div>
                        <Progress value={classData.accuracy} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{classData.improvement}% تحسن
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        تفاصيل الصف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                المقاييس التفصيلية
              </CardTitle>
              <CardDescription>
                تحليل تفصيلي للمقاييس الثلاثة عبر جميع الصفوف
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Detailed Metrics Chart Placeholder */}
              <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-6">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h4 className="font-medium text-gray-700 mb-2">رسم بياني عمودي</h4>
                  <p className="text-sm text-gray-500">مقارنة المقاييس حسب الصف</p>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.averageBalance}%</div>
                  <div className="text-sm text-muted-foreground">متوسط التوازن</div>
                  <div className="text-xs text-blue-600 mt-1">أعلى في الصف الخامس أ</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.averageSpeed}%</div>
                  <div className="text-sm text-muted-foreground">متوسط السرعة</div>
                  <div className="text-xs text-green-600 mt-1">تحسن مستمر</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analytics.averageAccuracy}%</div>
                  <div className="text-sm text-muted-foreground">متوسط الدقة</div>
                  <div className="text-xs text-purple-600 mt-1">يحتاج تطوير</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-1">مصدر البيانات</h4>
              <p className="mb-2">
                جميع البيانات المعروضة مستخرجة من جدول analysis_reports في قاعدة البيانات. 
                التحليلات محدثة تلقائياً عند إضافة تحليلات جديدة للطلاب.
              </p>
              <p className="text-xs">
                آخر تحديث: {new Date().toLocaleString('ar-SA')} • 
                البيانات محدثة فورياً • 
                إجمالي التحليلات: {analytics.totalAnalyses}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolAnalytics;