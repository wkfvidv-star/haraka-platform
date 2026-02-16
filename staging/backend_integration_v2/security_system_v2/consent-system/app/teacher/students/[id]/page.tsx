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
  User,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  FileVideo,
  Eye,
  Download,
  MessageCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface StudentDetail {
  id: string
  name: string
  grade: string
  totalVideos: number
  averageScore: number
  lastActivity: string
  status: 'active' | 'inactive' | 'needs_attention'
  joinedDate: string
}

interface StudentReport {
  reportId: string
  exerciseType: string
  overallScore: number
  createdAt: string
  strengths: string[]
  improvements: string[]
}

interface StudentProgress {
  month: string
  averageScore: number
  videosCount: number
}

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string
  
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [reports, setReports] = useState<StudentReport[]>([])
  const [progress, setProgress] = useState<StudentProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockStudent: StudentDetail = {
      id: studentId,
      name: 'أحمد محمد الطالب',
      grade: 'الصف الثامن',
      totalVideos: 12,
      averageScore: 88,
      lastActivity: '2025-01-08',
      status: 'active',
      joinedDate: '2024-09-01'
    }

    const mockReports: StudentReport[] = [
      {
        reportId: 'report-001',
        exerciseType: 'كرة القدم',
        overallScore: 88,
        createdAt: '2025-01-08T10:30:00Z',
        strengths: ['دقة التصويب', 'السرعة'],
        improvements: ['التوازن', 'التحكم بالكرة']
      },
      {
        reportId: 'report-002',
        exerciseType: 'الجري',
        overallScore: 82,
        createdAt: '2025-01-07T14:15:00Z',
        strengths: ['التحمل', 'الإيقاع'],
        improvements: ['وضعية الجسم', 'التنفس']
      }
    ]

    const mockProgress: StudentProgress[] = [
      { month: 'سبتمبر', averageScore: 65, videosCount: 2 },
      { month: 'أكتوبر', averageScore: 72, videosCount: 3 },
      { month: 'نوفمبر', averageScore: 78, videosCount: 4 },
      { month: 'ديسمبر', averageScore: 85, videosCount: 3 }
    ]

    setTimeout(() => {
      setStudent(mockStudent)
      setReports(mockReports)
      setProgress(mockProgress)
      setIsLoading(false)
    }, 1000)
  }, [studentId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'needs_attention': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'needs_attention': return 'يحتاج متابعة'
      default: return 'غير محدد'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطالب...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">الطالب غير موجود</h3>
            <p className="text-red-600 mb-4">لم يتم العثور على بيانات الطالب المطلوب</p>
            <Button onClick={() => window.history.back()} variant="outline">
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة لقائمة الطلاب
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
              <p className="text-gray-600">{student.grade} - معرف الطالب: {student.id}</p>
            </div>
            <Badge className={getStatusColor(student.status)}>
              {getStatusText(student.status)}
            </Badge>
          </div>
        </div>

        {/* Student Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <FileVideo className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{student.totalVideos}</div>
              <div className="text-sm text-gray-600">إجمالي الفيديوهات</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
                {student.averageScore}%
              </div>
              <div className="text-sm text-gray-600">المتوسط العام</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold">
                {new Date(student.lastActivity).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm text-gray-600">آخر نشاط</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold">+15%</div>
              <div className="text-sm text-gray-600">التحسن الشهري</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="feedback">الملاحظات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  تقارير الأداء
                </CardTitle>
                <CardDescription>
                  جميع تقارير تحليل الأداء الرياضي للطالب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.reportId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{report.exerciseType}</h3>
                          <Badge variant="outline">{formatDate(report.createdAt)}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-green-800 mb-1">نقاط القوة:</p>
                            <div className="flex flex-wrap gap-1">
                              {report.strengths.map((strength, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium text-orange-800 mb-1">للتحسين:</p>
                            <div className="flex flex-wrap gap-1">
                              {report.improvements.map((improvement, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-6">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                            {report.overallScore}%
                          </div>
                          <div className="text-xs text-gray-600">النتيجة</div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm">
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 ml-1" />
                            تحميل
                          </Button>
                        </div>
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
                  تتبع التقدم
                </CardTitle>
                <CardDescription>
                  تطور أداء الطالب عبر الوقت
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progress.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{month.month}</h3>
                          <p className="text-sm text-gray-600">{month.videosCount} فيديو</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <Progress value={month.averageScore} className="h-2" />
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(month.averageScore)}`}>
                          {month.averageScore}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  الملاحظات والتوجيهات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد ملاحظات بعد</h3>
                  <p className="text-gray-600 mb-4">يمكنك إضافة ملاحظات وتوجيهات للطالب هنا</p>
                  <Button>
                    إضافة ملاحظة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  إعدادات الطالب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">اسم الطالب</label>
                      <input 
                        type="text" 
                        value={student.name}
                        className="w-full p-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                      <input 
                        type="text" 
                        value={student.grade}
                        className="w-full p-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="mr-4">
                      تعديل البيانات
                    </Button>
                    <Button variant="destructive">
                      إزالة من الفصل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}