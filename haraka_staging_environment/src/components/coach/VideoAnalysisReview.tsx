import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  TrendingUp,
  Activity,
  Edit,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  User,
  Calendar,
  Award,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

interface AnalysisReport {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  exerciseName: string;
  videoUrl: string;
  overallScore: number;
  metrics: {
    balance: number;
    speed: number;
    accuracy: number;
    modelConfidence: number;
  };
  recommendation: string;
  status: 'processing' | 'completed' | 'failed';
  coachReviewRequested: boolean;
  coachReviewed: boolean;
  coachFeedback?: string;
  createdAt: Date;
  completedAt?: Date;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  sessions: {
    date: Date;
    score: number;
    balance: number;
    speed: number;
    accuracy: number;
  }[];
  averageImprovement: number;
  totalSessions: number;
}

export const VideoAnalysisReview: React.FC = () => {
  const { user } = useAuth();
  const [analysisReports, setAnalysisReports] = useState<AnalysisReport[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // محاكاة تحميل البيانات من قاعدة البيانات
  useEffect(() => {
    const loadAnalysisData = async () => {
      setIsLoading(true);
      
      // محاكاة البيانات من analysis_reports
      const mockReports: AnalysisReport[] = [
        {
          id: 'analysis_001',
          sessionId: 'session_001',
          studentId: 'student_001',
          studentName: 'أحمد محمد',
          exerciseName: 'تمرين القوة الوظيفية',
          videoUrl: '/mock-video-1.mp4',
          overallScore: 85,
          metrics: {
            balance: 88,
            speed: 82,
            accuracy: 85,
            modelConfidence: 92
          },
          recommendation: 'ممتاز! حافظ على هذا المستوى وركز على تحسين السرعة',
          status: 'completed',
          coachReviewRequested: true,
          coachReviewed: false,
          createdAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T10:35:00')
        },
        {
          id: 'analysis_002',
          sessionId: 'session_002',
          studentId: 'student_002',
          studentName: 'فاطمة علي',
          exerciseName: 'تمارين التوازن',
          videoUrl: '/mock-video-2.mp4',
          overallScore: 72,
          metrics: {
            balance: 68,
            speed: 75,
            accuracy: 74,
            modelConfidence: 87
          },
          recommendation: 'جيد، لكن يحتاج تحسين في التوازن. جرب تمارين الثبات',
          status: 'completed',
          coachReviewRequested: true,
          coachReviewed: true,
          coachFeedback: 'أوافق على التوصية. أضف تمارين اليوغا للتوازن',
          createdAt: new Date('2024-01-14T14:20:00'),
          completedAt: new Date('2024-01-14T14:25:00')
        },
        {
          id: 'analysis_003',
          sessionId: 'session_003',
          studentId: 'student_003',
          studentName: 'محمد حسن',
          exerciseName: 'تدريب السرعة',
          videoUrl: '/mock-video-3.mp4',
          overallScore: 0,
          metrics: {
            balance: 0,
            speed: 0,
            accuracy: 0,
            modelConfidence: 0
          },
          recommendation: '',
          status: 'processing',
          coachReviewRequested: false,
          coachReviewed: false,
          createdAt: new Date('2024-01-16T09:15:00')
        },
        {
          id: 'analysis_004',
          sessionId: 'session_004',
          studentId: 'student_001',
          studentName: 'أحمد محمد',
          exerciseName: 'تمرين التحمل',
          videoUrl: '/mock-video-4.mp4',
          overallScore: 78,
          metrics: {
            balance: 80,
            speed: 76,
            accuracy: 78,
            modelConfidence: 89
          },
          recommendation: 'تحسن ملحوظ في الأداء العام. استمر في هذا المسار',
          status: 'completed',
          coachReviewRequested: false,
          coachReviewed: false,
          createdAt: new Date('2024-01-13T16:45:00'),
          completedAt: new Date('2024-01-13T16:50:00')
        }
      ];

      // محاكاة بيانات تقدم الطلاب
      const mockProgress: StudentProgress[] = [
        {
          studentId: 'student_001',
          studentName: 'أحمد محمد',
          sessions: [
            { date: new Date('2024-01-10'), score: 70, balance: 72, speed: 68, accuracy: 70 },
            { date: new Date('2024-01-13'), score: 78, balance: 80, speed: 76, accuracy: 78 },
            { date: new Date('2024-01-15'), score: 85, balance: 88, speed: 82, accuracy: 85 }
          ],
          averageImprovement: 7.5,
          totalSessions: 3
        },
        {
          studentId: 'student_002',
          studentName: 'فاطمة علي',
          sessions: [
            { date: new Date('2024-01-12'), score: 65, balance: 60, speed: 70, accuracy: 65 },
            { date: new Date('2024-01-14'), score: 72, balance: 68, speed: 75, accuracy: 74 }
          ],
          averageImprovement: 3.5,
          totalSessions: 2
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisReports(mockReports);
      setStudentProgress(mockProgress);
      setIsLoading(false);
    };

    loadAnalysisData();
  }, []);

  const handleReviewReport = (reportId: string, approved: boolean, feedback?: string) => {
    setAnalysisReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { 
              ...report, 
              coachReviewed: true, 
              coachFeedback: feedback || (approved ? 'تمت الموافقة على التوصية' : 'تم تعديل التوصية')
            }
          : report
      )
    );
    
    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => 
        prev ? { 
          ...prev, 
          coachReviewed: true, 
          coachFeedback: feedback || (approved ? 'تمت الموافقة على التوصية' : 'تم تعديل التوصية')
        } : null
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'قيد المعالجة';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فشل';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReports = analysisReports.filter(report => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return report.coachReviewRequested && !report.coachReviewed;
    return report.status === filterStatus;
  });

  const pendingReviewsCount = analysisReports.filter(r => r.coachReviewRequested && !r.coachReviewed).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">جاري تحميل تحليلات الفيديو...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">تحليلات الفيديو</h2>
          <p className="text-muted-foreground">
            مراجعة وتقييم تحليلات فيديو التمارين للطلاب
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingReviewsCount > 0 && (
            <Badge variant="destructive">
              {pendingReviewsCount} مراجعة مطلوبة
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              إجمالي التحليلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analysisReports.length}</div>
            <p className="text-xs text-muted-foreground">جلسة تحليل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              مكتملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analysisReports.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">تحليل مكتمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              مراجعات مطلوبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReviewsCount}</div>
            <p className="text-xs text-muted-foreground">تحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              متوسط النتائج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                analysisReports
                  .filter(r => r.status === 'completed')
                  .reduce((sum, r) => sum + r.overallScore, 0) /
                analysisReports.filter(r => r.status === 'completed').length || 0
              )}%
            </div>
            <p className="text-xs text-muted-foreground">النتيجة العامة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">مراجعة التحليلات</TabsTrigger>
          <TabsTrigger value="progress">تتبع التقدم</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">تصفية:</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'الكل' },
                { key: 'pending', label: 'مراجعات مطلوبة' },
                { key: 'completed', label: 'مكتملة' },
                { key: 'processing', label: 'قيد المعالجة' },
                { key: 'failed', label: 'فشلت' }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={filterStatus === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(filter.key as any)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Analysis Reports List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">قائمة التحليلات</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredReports.map((report) => (
                  <Card 
                    key={report.id} 
                    className={`cursor-pointer transition-all ${
                      selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''
                    } ${report.coachReviewRequested && !report.coachReviewed ? 'border-yellow-300 bg-yellow-50' : ''}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{report.exerciseName}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          {getStatusLabel(report.status)}
                        </Badge>
                      </div>

                      {report.status === 'completed' && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className={`text-lg font-bold ${getScoreColor(report.overallScore)}`}>
                              {report.overallScore}%
                            </div>
                            <div className="text-xs text-muted-foreground">النتيجة</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{report.metrics.balance}%</div>
                            <div className="text-xs text-muted-foreground">التوازن</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-lg font-bold text-green-600">{report.metrics.speed}%</div>
                            <div className="text-xs text-muted-foreground">السرعة</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{report.createdAt.toLocaleString('ar-SA')}</span>
                        {report.coachReviewRequested && !report.coachReviewed && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            مراجعة مطلوبة
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Detailed View */}
            <div>
              {selectedReport ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      التحليل التفصيلي
                    </CardTitle>
                    <CardDescription>
                      {selectedReport.studentName} - {selectedReport.exerciseName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Preview */}
                    <div className="relative bg-black rounded-lg overflow-hidden h-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="secondary">
                          <Play className="h-6 w-6 mr-2" />
                          مشاهدة الفيديو
                        </Button>
                      </div>
                    </div>

                    {selectedReport.status === 'completed' && (
                      <>
                        {/* Detailed Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>التوازن</span>
                                <span>{selectedReport.metrics.balance}%</span>
                              </div>
                              <Progress value={selectedReport.metrics.balance} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>السرعة</span>
                                <span>{selectedReport.metrics.speed}%</span>
                              </div>
                              <Progress value={selectedReport.metrics.speed} className="h-2" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>الدقة</span>
                                <span>{selectedReport.metrics.accuracy}%</span>
                              </div>
                              <Progress value={selectedReport.metrics.accuracy} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>ثقة النموذج</span>
                                <span>{selectedReport.metrics.modelConfidence}%</span>
                              </div>
                              <Progress value={selectedReport.metrics.modelConfidence} className="h-2" />
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">🤖 التوصية الآلية</h4>
                          <p className="text-blue-700 text-sm">{selectedReport.recommendation}</p>
                        </div>

                        {/* Coach Review Section */}
                        {selectedReport.coachReviewRequested && (
                          <div className="border-t pt-4">
                            {selectedReport.coachReviewed ? (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-green-800 mb-2">✅ مراجعة المدرب</h4>
                                <p className="text-green-700 text-sm">{selectedReport.coachFeedback}</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <h4 className="font-medium">مراجعة المدرب مطلوبة</h4>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleReviewReport(selectedReport.id, true)}
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    قبول التوصية
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReviewReport(selectedReport.id, false, 'يحتاج تعديل في خطة التدريب')}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    تعديل التوصية
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {selectedReport.status === 'processing' && (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                        <p className="text-muted-foreground">جاري معالجة التحليل...</p>
                      </div>
                    )}

                    {selectedReport.status === 'failed' && (
                      <div className="text-center py-8">
                        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                        <p className="text-muted-foreground">فشل في تحليل الفيديو</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          إعادة المحاولة
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 mx-auto mb-4 opacity-50 text-gray-500" />
                    <h3 className="text-lg font-medium mb-2">اختر تحليل للعرض</h3>
                    <p className="text-muted-foreground">
                      انقر على أي تحليل من القائمة لعرض التفاصيل الكاملة
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <h3 className="text-lg font-semibold">تتبع تقدم الطلاب</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studentProgress.map((student) => (
              <Card key={student.studentId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {student.studentName}
                  </CardTitle>
                  <CardDescription>
                    {student.totalSessions} جلسة • متوسط التحسن: {student.averageImprovement}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Chart Placeholder */}
                    <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-muted-foreground">رسم بياني للتقدم</p>
                      </div>
                    </div>

                    {/* Sessions Table */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">الجلسات الأخيرة</h4>
                      <div className="space-y-2">
                        {student.sessions.slice(-3).map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{session.date.toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className={`font-medium ${getScoreColor(session.score)}`}>
                                {session.score}%
                              </span>
                              <div className="flex gap-1">
                                <span className="text-blue-600">{session.balance}</span>
                                <span className="text-green-600">{session.speed}</span>
                                <span className="text-purple-600">{session.accuracy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Improvement Badge */}
                    <div className="flex justify-center">
                      <Badge 
                        variant={student.averageImprovement > 5 ? 'default' : 'secondary'}
                        className={student.averageImprovement > 5 ? 'bg-green-500' : ''}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {student.averageImprovement > 0 ? 'تحسن' : 'ثابت'} {Math.abs(student.averageImprovement)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoAnalysisReview;