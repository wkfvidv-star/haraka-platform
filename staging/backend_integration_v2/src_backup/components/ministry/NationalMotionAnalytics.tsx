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
  MapPin,
  Award,
  Users,
  School,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Activity,
  Zap,
  Globe,
  FileText,
  Filter
} from 'lucide-react';

interface NationalKPIs {
  nationalAverageScore: number;
  totalSchools: number;
  totalStudents: number;
  totalAnalyses: number;
  monthlyImprovement: number;
  averageBalance: number;
  averageSpeed: number;
  averageAccuracy: number;
}

interface TopSchool {
  id: string;
  name: string;
  wilaya: string;
  improvementRate: number;
  averageScore: number;
  totalStudents: number;
  analysesCount: number;
}

interface WilayaStats {
  wilaya: string;
  schoolsCount: number;
  studentsCount: number;
  averageScore: number;
  balance: number;
  speed: number;
  accuracy: number;
  improvement: number;
}

interface MonthlyTrend {
  month: string;
  averageScore: number;
  analysesCount: number;
  improvement: number;
}

export const NationalMotionAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [nationalKPIs, setNationalKPIs] = useState<NationalKPIs | null>(null);
  const [topSchools, setTopSchools] = useState<TopSchool[]>([]);
  const [wilayaStats, setWilayaStats] = useState<WilayaStats[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // محاكاة تحميل البيانات المجمعة من analysis_reports مع join على schools
  useEffect(() => {
    const loadNationalAnalytics = async () => {
      setIsLoading(true);
      
      // محاكاة استعلام قاعدة البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // محاكاة البيانات الوطنية المجمعة
      const mockNationalKPIs: NationalKPIs = {
        nationalAverageScore: 76.8,
        totalSchools: 1247,
        totalStudents: 45623,
        totalAnalyses: 12890,
        monthlyImprovement: 8.3,
        averageBalance: 73.2,
        averageSpeed: 78.9,
        averageAccuracy: 78.3
      };

      const mockTopSchools: TopSchool[] = [
        {
          id: 'school_001',
          name: 'مدرسة النور الابتدائية',
          wilaya: 'الجزائر',
          improvementRate: 24.5,
          averageScore: 89.2,
          totalStudents: 456,
          analysesCount: 1234
        },
        {
          id: 'school_002', 
          name: 'مدرسة الأمل المتوسطة',
          wilaya: 'وهران',
          improvementRate: 22.1,
          averageScore: 86.7,
          totalStudents: 523,
          analysesCount: 1456
        },
        {
          id: 'school_003',
          name: 'مدرسة المستقبل الثانوية',
          wilaya: 'قسنطينة',
          improvementRate: 20.8,
          averageScore: 84.3,
          totalStudents: 678,
          analysesCount: 1876
        },
        {
          id: 'school_004',
          name: 'مدرسة الفجر الابتدائية',
          wilaya: 'سطيف',
          improvementRate: 19.6,
          averageScore: 82.1,
          totalStudents: 389,
          analysesCount: 1098
        },
        {
          id: 'school_005',
          name: 'مدرسة الرياض المتوسطة',
          wilaya: 'تيزي وزو',
          improvementRate: 18.9,
          averageScore: 81.5,
          totalStudents: 445,
          analysesCount: 1267
        }
      ];

      const mockWilayaStats: WilayaStats[] = [
        {
          wilaya: 'الجزائر',
          schoolsCount: 156,
          studentsCount: 5678,
          averageScore: 79.2,
          balance: 76.8,
          speed: 81.3,
          accuracy: 79.5,
          improvement: 9.2
        },
        {
          wilaya: 'وهران',
          schoolsCount: 134,
          studentsCount: 4892,
          averageScore: 77.8,
          balance: 75.1,
          speed: 79.8,
          accuracy: 78.5,
          improvement: 8.7
        },
        {
          wilaya: 'قسنطينة',
          schoolsCount: 98,
          studentsCount: 3567,
          averageScore: 76.4,
          balance: 73.9,
          speed: 78.2,
          accuracy: 77.1,
          improvement: 7.8
        },
        {
          wilaya: 'سطيف',
          schoolsCount: 87,
          studentsCount: 3124,
          averageScore: 75.6,
          balance: 72.8,
          speed: 77.9,
          accuracy: 76.1,
          improvement: 8.1
        },
        {
          wilaya: 'تيزي وزو',
          schoolsCount: 76,
          studentsCount: 2789,
          averageScore: 74.9,
          balance: 71.5,
          speed: 77.2,
          accuracy: 76.0,
          improvement: 7.5
        }
      ];

      const mockMonthlyTrends: MonthlyTrend[] = [
        { month: 'سبتمبر 2023', averageScore: 68.2, analysesCount: 2456, improvement: 0 },
        { month: 'أكتوبر 2023', averageScore: 70.1, analysesCount: 2789, improvement: 2.8 },
        { month: 'نوفمبر 2023', averageScore: 71.8, analysesCount: 3012, improvement: 2.4 },
        { month: 'ديسمبر 2023', averageScore: 73.2, analysesCount: 2834, improvement: 1.9 },
        { month: 'يناير 2024', averageScore: 74.9, analysesCount: 3456, improvement: 2.3 },
        { month: 'فبراير 2024', averageScore: 76.8, analysesCount: 3678, improvement: 2.5 }
      ];

      setNationalKPIs(mockNationalKPIs);
      setTopSchools(mockTopSchools);
      setWilayaStats(mockWilayaStats);
      setMonthlyTrends(mockMonthlyTrends);
      setIsLoading(false);
    };

    loadNationalAnalytics();
  }, []);

  const generateNationalReport = async () => {
    setIsGeneratingReport(true);
    
    // محاكاة إنتاج التقرير
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // محاكاة تحميل PDF
    const link = document.createElement('a');
    link.href = '#'; // في التطبيق الحقيقي، سيكون رابط PDF
    link.download = `التقرير_الوطني_للتحليل_الحركي_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsGeneratingReport(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 15) return 'text-green-600';
    if (improvement >= 8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredWilayaStats = selectedWilaya === 'all' 
    ? wilayaStats 
    : wilayaStats.filter(w => w.wilaya === selectedWilaya);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">جاري تحميل الإحصائيات الوطنية...</span>
      </div>
    );
  }

  if (!nationalKPIs) {
    return (
      <div className="text-center py-12">
        <Globe className="h-16 w-16 mx-auto mb-4 opacity-50 text-gray-500" />
        <h3 className="text-lg font-medium mb-2">لا توجد بيانات متاحة</h3>
        <p className="text-muted-foreground">
          لم يتم العثور على إحصائيات وطنية للتحليل الحركي
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            الإحصاءات الوطنية للتحليل الحركي
          </h2>
          <p className="text-muted-foreground">
            بيانات مجمعة من جميع المدارس على المستوى الوطني - بدون معلومات شخصية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </Badge>
          <Button 
            onClick={generateNationalReport}
            disabled={isGeneratingReport}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGeneratingReport ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                جاري الإنتاج...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                تحميل تقرير وطني PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* National KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              متوسط الأداء الوطني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(nationalKPIs.nationalAverageScore)}`}>
              {nationalKPIs.nationalAverageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              من {nationalKPIs.totalAnalyses.toLocaleString()} تحليل
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{nationalKPIs.monthlyImprovement}% هذا الشهر</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <School className="h-4 w-4 text-green-600" />
              المدارس المشاركة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {nationalKPIs.totalSchools.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">مدرسة على المستوى الوطني</p>
            <div className="mt-2">
              <Progress value={85} className="h-2" />
              <span className="text-xs text-green-600">85% معدل المشاركة</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              الطلاب المسجلين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {(nationalKPIs.totalStudents / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">
              {nationalKPIs.totalStudents.toLocaleString()} طالب وطالبة
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Activity className="h-3 w-3 text-purple-500" />
              <span className="text-xs text-purple-600">نشط في البرنامج</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              التحليلات المكتملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {(nationalKPIs.totalAnalyses / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">تحليل حركي مكتمل</p>
            <div className="flex items-center gap-1 mt-2">
              <Zap className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-600">معدل يومي: 145 تحليل</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="schools">أفضل المدارس</TabsTrigger>
          <TabsTrigger value="regions">حسب الولاية</TabsTrigger>
          <TabsTrigger value="trends">الاتجاهات الزمنية</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* National Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                المؤشرات الوطنية الرئيسية
              </CardTitle>
              <CardDescription>
                متوسط الأداء في المقاييس الثلاثة الأساسية على المستوى الوطني
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">التوازن</span>
                    <span className="text-lg font-bold text-blue-600">{nationalKPIs.averageBalance}%</span>
                  </div>
                  <Progress value={nationalKPIs.averageBalance} className="h-3" />
                  <p className="text-xs text-muted-foreground">أساس الحركة السليمة</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">السرعة</span>
                    <span className="text-lg font-bold text-green-600">{nationalKPIs.averageSpeed}%</span>
                  </div>
                  <Progress value={nationalKPIs.averageSpeed} className="h-3" />
                  <p className="text-xs text-muted-foreground">قوة الاستجابة الحركية</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">الدقة</span>
                    <span className="text-lg font-bold text-purple-600">{nationalKPIs.averageAccuracy}%</span>
                  </div>
                  <Progress value={nationalKPIs.averageAccuracy} className="h-3" />
                  <p className="text-xs text-muted-foreground">جودة الأداء الحركي</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Visualization Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                خريطة الأداء الوطني
              </CardTitle>
              <CardDescription>
                توزيع مستويات الأداء عبر الولايات الجزائرية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h4 className="font-medium text-gray-700 mb-2">خريطة حرارية تفاعلية</h4>
                  <p className="text-sm text-gray-500">عرض توزيع الأداء حسب الولايات</p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span className="text-xs">أقل من 70%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span className="text-xs">70-85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-xs">أكثر من 85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                أفضل 5 مدارس من حيث التحسن
              </CardTitle>
              <CardDescription>
                المدارس الرائدة في تطوير الأداء الحركي للطلاب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSchools.map((school, index) => (
                  <div key={school.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                        <span className="font-bold text-yellow-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{school.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.wilaya}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {school.totalStudents} طالب
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {school.analysesCount} تحليل
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getImprovementColor(school.improvementRate)}`}>
                        +{school.improvementRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">معدل التحسن</div>
                      <div className={`text-sm font-medium ${getScoreColor(school.averageScore)}`}>
                        {school.averageScore}% متوسط الأداء
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">تصفية حسب الولاية:</span>
            <select 
              value={selectedWilaya} 
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">جميع الولايات</option>
              {wilayaStats.map((wilaya) => (
                <option key={wilaya.wilaya} value={wilaya.wilaya}>{wilaya.wilaya}</option>
              ))}
            </select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                الأداء حسب الولايات
              </CardTitle>
              <CardDescription>
                مقارنة مستويات الأداء والتحسن عبر الولايات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWilayaStats.map((wilaya) => (
                  <div key={wilaya.wilaya} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{wilaya.wilaya}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{wilaya.schoolsCount} مدرسة</span>
                          <span>{wilaya.studentsCount.toLocaleString()} طالب</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(wilaya.averageScore)}`}>
                          {wilaya.averageScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">متوسط الأداء</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>التوازن</span>
                          <span>{wilaya.balance}%</span>
                        </div>
                        <Progress value={wilaya.balance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>السرعة</span>
                          <span>{wilaya.speed}%</span>
                        </div>
                        <Progress value={wilaya.speed} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>الدقة</span>
                          <span>{wilaya.accuracy}%</span>
                        </div>
                        <Progress value={wilaya.accuracy} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className={getImprovementColor(wilaya.improvement)}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{wilaya.improvement}% تحسن
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                الاتجاهات الزمنية للأداء الوطني
              </CardTitle>
              <CardDescription>
                تطور متوسط الأداء الوطني عبر الأشهر الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Line Chart Placeholder */}
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h4 className="font-medium text-gray-700 mb-2">رسم بياني خطي</h4>
                  <p className="text-sm text-gray-500">تطور الأداء عبر الزمن</p>
                </div>
              </div>

              {/* Monthly Data Table */}
              <div className="space-y-3">
                <h4 className="font-medium">البيانات الشهرية التفصيلية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthlyTrends.map((trend, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{trend.month}</span>
                        <Badge variant="outline" className="text-xs">
                          {trend.analysesCount.toLocaleString()} تحليل
                        </Badge>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(trend.averageScore)}`}>
                        {trend.averageScore}%
                      </div>
                      {trend.improvement > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          +{trend.improvement}% تحسن
                        </div>
                      )}
                    </div>
                  ))}
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
              <h4 className="font-medium mb-1">مصدر البيانات والخصوصية</h4>
              <p className="mb-2">
                جميع البيانات المعروضة مجمعة من قاعدة بيانات analysis_reports مع ربطها بجدول schools. 
                لا تحتوي هذه الإحصائيات على أي معلومات شخصية للطلاب أو المعلمين.
              </p>
              <p className="text-xs">
                آخر تحديث: {new Date().toLocaleString('ar-SA')} • 
                البيانات محدثة كل 24 ساعة • 
                مصدر البيانات: وزارة التربية الوطنية
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NationalMotionAnalytics;