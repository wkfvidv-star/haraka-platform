'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Target,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  Activity,
  Eye,
  Download,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock
} from 'lucide-react'

interface AthleteDetail {
  id: string
  name: string
  sport: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  totalSessions: number
  averageScore: number
  improvement: number
  lastSession: string
  status: 'active' | 'inactive' | 'injury'
  joinedDate: string
}

interface PerformanceReport {
  reportId: string
  exerciseType: string
  overallScore: number
  createdAt: string
  strengths: string[]
  improvements: string[]
  technicalNotes: string
}

interface TrainingProgress {
  month: string
  averageScore: number
  sessionsCount: number
  improvement: number
}

export default function AthleteDetailPage() {
  const params = useParams()
  const athleteId = params.id as string
  
  const [athlete, setAthlete] = useState<AthleteDetail | null>(null)
  const [reports, setReports] = useState<PerformanceReport[]>([])
  const [progress, setProgress] = useState<TrainingProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAthlete: AthleteDetail = {
      id: athleteId,
      name: 'أحمد محمد العداء',
      sport: 'الجري',
      level: 'advanced',
      totalSessions: 24,
      averageScore: 89,
      improvement: 15,
      lastSession: '2025-01-08',
      status: 'active',
      joinedDate: '2024-09-01'
    }

    const mockReports: PerformanceReport[] = [
      {
        reportId: 'report-001',
        exerciseType: 'جري 100 متر',
        overallScore: 92,
        createdAt: '2025-01-08T10:30:00Z',
        strengths: ['انطلاقة قوية', 'سرعة عالية', 'تقنية جيدة'],
        improvements: ['تحسين الإنهاء', 'توازن أفضل'],
        technicalNotes: 'أداء ممتاز مع إمكانية تحسين الثواني الأخيرة'
      },
      {
        reportId: 'report-002',
        exerciseType: 'جري 400 متر',
        overallScore: 85,
        createdAt: '2025-01-07T14:15:00Z',
        strengths: ['تحمل جيد', 'إيقاع ثابت'],
        improvements: ['إدارة الطاقة', 'سرعة الانطلاق'],
        technicalNotes: 'يحتاج تركيز على توزيع الجهد على المسافة'
      }
    ]

    const mockProgress: TrainingProgress[] = [
      { month: 'سبتمبر', averageScore: 75, sessionsCount: 4, improvement: 0 },
      { month: 'أكتوبر', averageScore: 78, sessionsCount: 6, improvement: 4 },
      { month: 'نوفمبر', averageScore: 83, sessionsCount: 7, improvement: 6 },
      { month: 'ديسمبر', averageScore: 89, sessionsCount: 7, improvement: 7 }
    ]

    setTimeout(() => {
      setAthlete(mockAthlete)
      setReports(mockReports)
      setProgress(mockProgress)
      setIsLoading(false)
    }, 1000)
  }, [athleteId])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'advanced': return 'bg-purple-100 text-purple-800'
      case 'professional': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'مبتدئ'
      case 'intermediate': return 'متوسط'
      case 'advanced': return 'متقدم'
      case 'professional': return 'محترف'
      default: return 'غير محدد'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'injury': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'injury': return 'مصاب'
      default: return 'غير محدد'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600'
    if (improvement < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الرياضي...</p>
        </div>
      </div>
    )
  }

  if (!athlete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">الرياضي غير موجود</h3>
            <p className="text-red-600 mb-4">لم يتم العثور على بيانات الرياضي المطلوب</p>
            <Button onClick={() => window.history.back()} variant="outline">
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة لقائمة الرياضيين
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{athlete.name}</h1>
              <p className="text-gray-600">{athlete.sport} - معرف الرياضي: {athlete.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getLevelColor(athlete.level)}>
                {getLevelText(athlete.level)}
              </Badge>
              <Badge className={getStatusColor(athlete.status)}>
                {getStatusText(athlete.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Athlete Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{athlete.totalSessions}</div>
              <div className="text-sm text-gray-600">إجمالي الجلسات</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getScoreColor(athlete.averageScore)}`}>
                {athlete.averageScore}%
              </div>
              <div className="text-sm text-gray-600">المتوسط العام</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getImprovementColor(athlete.improvement)}`}>
                {athlete.improvement > 0 ? '+' : ''}{athlete.improvement}%
              </div>
              <div className="text-sm text-gray-600">التحسن</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold">
                {new Date(athlete.lastSession).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-gray-600">آخر جلسة</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">تقارير الأداء</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="training">البرنامج التدريبي</TabsTrigger>
            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
          </TabsList>

          {/* Performance Reports Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  تقارير الأداء التفصيلية
                </CardTitle>
                <CardDescription>
                  تحليل شامل لأداء الرياضي في جميع الجلسات التدريبية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reports.map((report) => (
                    <div key={report.reportId} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{report.exerciseType}</h3>
                          <p className="text-sm text-gray-600">{formatDate(report.createdAt)}</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                            {report.overallScore}%
                          </div>
                          <div className="text-sm text-gray-600">النتيجة الإجمالية</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">ملاحظات تقنية:</h4>
                        <p className="text-blue-800 text-sm">{report.technicalNotes}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            نقاط القوة
                          </h4>
                          <div className="space-y-2">
                            {report.strengths.map((strength, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            نقاط التحسين
                          </h4>
                          <div className="space-y-2">
                            {report.improvements.map((improvement, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>{improvement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button size="sm">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 ml-1" />
                          تحميل التقرير
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 ml-1" />
                          إضافة ملاحظة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  تتبع التقدم الشهري
                </CardTitle>
                <CardDescription>
                  تطور أداء الرياضي عبر الأشهر الماضية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progress.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{month.month}</h3>
                          <p className="text-sm text-gray-600">{month.sessionsCount} جلسة تدريبية</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(month.averageScore)}`}>
                            {month.averageScore}%
                          </div>
                          <div className="text-xs text-gray-500">المتوسط</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getImprovementColor(month.improvement)}`}>
                            {month.improvement > 0 ? '+' : ''}{month.improvement}%
                          </div>
                          <div className="text-xs text-gray-500">التحسن</div>
                        </div>

                        <div className="w-32">
                          <Progress value={month.averageScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Program Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  البرنامج التدريبي الحالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد برنامج تدريبي حالي</h3>
                  <p className="text-gray-600 mb-4">يمكنك إنشاء برنامج تدريبي مخصص لهذا الرياضي</p>
                  <Button>
                    إنشاء برنامج تدريبي
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  ملاحظات المدرب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ملاحظات بعد</h3>
                  <p className="text-gray-600 mb-4">يمكنك إضافة ملاحظات وتوجيهات للرياضي هنا</p>
                  <Button>
                    إضافة ملاحظة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}