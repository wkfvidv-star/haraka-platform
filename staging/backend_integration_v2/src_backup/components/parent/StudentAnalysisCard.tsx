import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Target, 
  TrendingUp, 
  Activity, 
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  User,
  Award
} from 'lucide-react';

interface StudentAnalysisData {
  id: string;
  studentId: string;
  studentName: string;
  overallScore: number;
  performanceSummary: string;
  homeRecommendation: string;
  metrics: {
    balance: number;
    speed: number;
    accuracy: number;
  };
  lastAnalysisDate: Date;
  parentConsent: boolean;
  analysisCount: number;
  improvementTrend: number;
}

export const StudentAnalysisCard: React.FC = () => {
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState<StudentAnalysisData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // محاكاة تحميل البيانات من analysis_reports للتلميذ المرتبط بالولي
  useEffect(() => {
    const loadStudentAnalysis = async () => {
      setIsLoading(true);
      
      // محاكاة استعلام قاعدة البيانات للحصول على آخر تحليل للتلميذ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // محاكاة البيانات من analysis_reports مرتبطة بالتلميذ
      const mockAnalysisData: StudentAnalysisData = {
        id: 'analysis_parent_001',
        studentId: 'student_001',
        studentName: 'أحمد محمد', // اسم الابن
        overallScore: 78,
        performanceSummary: 'الأداء العام جيد – يحتاج لتحسين التوازن بنسبة 24٪',
        homeRecommendation: 'تابع تمارين التوازن 10 دقائق يومياً',
        metrics: {
          balance: 65, // يحتاج تحسين
          speed: 82,
          accuracy: 87
        },
        lastAnalysisDate: new Date('2024-01-15T10:35:00'),
        parentConsent: true,
        analysisCount: 5,
        improvementTrend: 12 // تحسن بنسبة 12%
      };

      setAnalysisData(mockAnalysisData);
      setIsLoading(false);
    };

    if (user) {
      loadStudentAnalysis();
    }
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'ممتاز';
    if (score >= 70) return 'جيد';
    if (score >= 50) return 'مقبول';
    return 'يحتاج تحسين';
  };

  const getImprovementIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            آخر تحليل حركي للتلميذ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">جاري تحميل البيانات...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            آخر تحليل حركي للتلميذ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">لا توجد تحليلات متاحة</h3>
            <p className="text-muted-foreground">
              لم يقم التلميذ بإجراء أي تحليل حركي بعد
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Analysis Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">آخر تحليل حركي للتلميذ</CardTitle>
                <CardDescription>
                  تقرير الأداء الحركي لـ {analysisData.studentName}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              محدث
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Score */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                  {analysisData.overallScore}%
                </div>
                <div className="text-sm text-muted-foreground">النتيجة العامة</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <div className={`font-medium ${getScoreColor(analysisData.overallScore)}`}>
                  {getScoreLabel(analysisData.overallScore)}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getImprovementIcon(analysisData.improvementTrend)}
                  تحسن بنسبة {analysisData.improvementTrend}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{analysisData.analysisCount} تحليل</div>
              <div className="text-xs text-muted-foreground">إجمالي التحليلات</div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">📊 ملخص الأداء</h4>
            <p className="text-yellow-700 text-sm">{analysisData.performanceSummary}</p>
          </div>

          {/* Home Recommendation */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Home className="h-4 w-4" />
              توصية منزلية
            </h4>
            <p className="text-green-700 text-sm">{analysisData.homeRecommendation}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{analysisData.metrics.balance}%</div>
              <div className="text-xs text-muted-foreground">التوازن</div>
              <Progress value={analysisData.metrics.balance} className="mt-1 h-1" />
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{analysisData.metrics.speed}%</div>
              <div className="text-xs text-muted-foreground">السرعة</div>
              <Progress value={analysisData.metrics.speed} className="mt-1 h-1" />
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{analysisData.metrics.accuracy}%</div>
              <div className="text-xs text-muted-foreground">الدقة</div>
              <Progress value={analysisData.metrics.accuracy} className="mt-1 h-1" />
            </div>
          </div>

          {/* Analysis Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>آخر تحليل: {analysisData.lastAnalysisDate.toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-2">
              {analysisData.parentConsent ? (
                <Badge variant="outline" className="text-green-600 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  موافقة الولي
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  <Clock className="h-3 w-3 mr-1" />
                  في انتظار الموافقة
                </Badge>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? 'إخفاء تفاصيل التقرير' : 'عرض تفاصيل التقرير'}
          </Button>
        </CardContent>
      </Card>

      {/* Detailed Report */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تفاصيل التقرير - {analysisData.studentName}
            </CardTitle>
            <CardDescription>
              معلومات تفصيلية عن الأداء الحركي (بدون عرض الفيديو حفاظاً على الخصوصية)
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Detailed Metrics */}
            <div className="space-y-3">
              <h4 className="font-medium">تفصيل المقاييس</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">التوازن</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analysisData.metrics.balance} className="w-20 h-2" />
                    <span className="text-sm font-medium w-12">{analysisData.metrics.balance}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">السرعة</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analysisData.metrics.speed} className="w-20 h-2" />
                    <span className="text-sm font-medium w-12">{analysisData.metrics.speed}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">الدقة</span>
                  <div className="flex items-center gap-2">
                    <Progress value={analysisData.metrics.accuracy} className="w-20 h-2" />
                    <span className="text-sm font-medium w-12">{analysisData.metrics.accuracy}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis History Summary */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">ملخص التحليلات السابقة</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{analysisData.analysisCount}</div>
                  <div className="text-xs text-muted-foreground">إجمالي التحليلات</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">+{analysisData.improvementTrend}%</div>
                  <div className="text-xs text-muted-foreground">معدل التحسن</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{getScoreLabel(analysisData.overallScore)}</div>
                  <div className="text-xs text-muted-foreground">المستوى الحالي</div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="text-xs text-gray-600">
                  <strong>ملاحظة الخصوصية:</strong> لا يتم عرض الفيديو الفعلي للتمرين حفاظاً على خصوصية التلميذ. 
                  يمكن للمدرب فقط الوصول إلى الفيديو لأغراض التقييم المهني.
                </div>
              </div>
            </div>

            {/* Contact Coach */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">تواصل مع المدرب</h4>
                  <p className="text-sm text-muted-foreground">للاستفسار عن التحليل أو طلب توضيحات إضافية</p>
                </div>
                <Button variant="outline" size="sm">
                  إرسال رسالة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentAnalysisCard;