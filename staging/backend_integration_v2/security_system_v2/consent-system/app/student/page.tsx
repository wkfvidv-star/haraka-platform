'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Upload, 
  FileVideo, 
  TrendingUp, 
  Award, 
  Calendar,
  Clock,
  Target,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState({
    name: 'أحمد محمد الطالب',
    grade: 'الصف الثامن',
    school: 'مدرسة الرياض الثانوية',
    totalVideos: 12,
    lastUpload: '2025-01-06',
    overallScore: 85,
    weeklyProgress: 15
  })

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'upload', description: 'رفع فيديو تمرين كرة القدم', date: '2025-01-06', score: 88 },
    { id: 2, type: 'report', description: 'تقرير تحليل الجري', date: '2025-01-05', score: 82 },
    { id: 3, type: 'achievement', description: 'إنجاز: تحسن في التوازن', date: '2025-01-04', score: 90 }
  ])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading student data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة تحكم الطالب</h1>
                <p className="text-sm text-gray-500">منصة حركة للتحليل الرياضي</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            أهلاً وسهلاً، {studentData.name}
          </h2>
          <p className="text-gray-600">
            {studentData.grade} - {studentData.school}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الفيديوهات</CardTitle>
              <FileVideo className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.totalVideos}</div>
              <p className="text-xs text-muted-foreground">
                +2 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النتيجة الإجمالية</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.overallScore}%</div>
              <Progress value={studentData.overallScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقدم الأسبوعي</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{studentData.weeklyProgress}%</div>
              <p className="text-xs text-muted-foreground">
                تحسن ممتاز هذا الأسبوع
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر رفع</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">منذ يومين</div>
              <p className="text-xs text-muted-foreground">
                {studentData.lastUpload}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload Video Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                رفع فيديو جديد
              </CardTitle>
              <CardDescription>
                ارفع فيديو لتمرينك الرياضي للحصول على تحليل مفصل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اسحب الفيديو هنا أو انقر للاختيار
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  الحد الأقصى: 100 ميجابايت، المدة: 5 دقائق
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  اختيار ملف
                </Button>
              </div>
              
              <Alert className="mt-4">
                <Target className="h-4 w-4" />
                <AlertTitle>نصيحة للحصول على أفضل النتائج</AlertTitle>
                <AlertDescription>
                  تأكد من وضوح الصورة وإضاءة جيدة، وأن تكون الحركات واضحة في الإطار
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>الإجراءات السريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 ml-2" />
                عرض التقارير
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 ml-2" />
                تتبع التقدم
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 ml-2" />
                الأهداف الشخصية
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 ml-2" />
                الإنجازات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              النشاطات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'upload' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'report' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'upload' ? <Upload className="h-4 w-4" /> :
                       activity.type === 'report' ? <BarChart3 className="h-4 w-4" /> :
                       <Award className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant={activity.score >= 85 ? 'default' : 'secondary'}>
                    {activity.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}