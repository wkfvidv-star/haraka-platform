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
  MapPin,
  School,
  Users,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface RegionDetail {
  id: string
  name: string
  schools: number
  students: number
  teachers: number
  coaches: number
  averageScore: number
  sessionsThisMonth: number
  growth: number
  status: 'excellent' | 'good' | 'needs_improvement'
}

interface SchoolInRegion {
  id: string
  name: string
  students: number
  teachers: number
  averageScore: number
  totalSessions: number
  improvement: number
  status: 'excellent' | 'good' | 'needs_improvement'
}

interface RegionProgress {
  month: string
  averageScore: number
  sessionsCount: number
  schoolsActive: number
}

export default function RegionDetailPage() {
  const params = useParams()
  const regionId = params.id as string
  
  const [region, setRegion] = useState<RegionDetail | null>(null)
  const [schools, setSchools] = useState<SchoolInRegion[]>([])
  const [progress, setProgress] = useState<RegionProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRegion: RegionDetail = {
      id: regionId,
      name: regionId === 'riyadh' ? 'منطقة الرياض' : 
            regionId === 'makkah' ? 'منطقة مكة المكرمة' : 
            regionId === 'eastern' ? 'المنطقة الشرقية' : 'منطقة غير معروفة',
      schools: 890,
      students: 45200,
      teachers: 2340,
      coaches: 180,
      averageScore: 82,
      sessionsThisMonth: 12400,
      growth: 15,
      status: 'excellent'
    }

    const mockSchools: SchoolInRegion[] = [
      {
        id: 'school-001',
        name: 'مدرسة الملك فهد الثانوية',
        students: 850,
        teachers: 45,
        averageScore: 94,
        totalSessions: 420,
        improvement: 18,
        status: 'excellent'
      },
      {
        id: 'school-002',
        name: 'مدرسة الأمير محمد بن سلمان',
        students: 720,
        teachers: 38,
        averageScore: 91,
        totalSessions: 380,
        improvement: 15,
        status: 'excellent'
      },
      {
        id: 'school-003',
        name: 'مدرسة النور الثانوية',
        students: 680,
        teachers: 35,
        averageScore: 85,
        totalSessions: 350,
        improvement: 12,
        status: 'good'
      },
      {
        id: 'school-004',
        name: 'مدرسة الفيصل المتوسطة',
        students: 590,
        teachers: 30,
        averageScore: 78,
        totalSessions: 290,
        improvement: 8,
        status: 'good'
      },
      {
        id: 'school-005',
        name: 'مدرسة الحي الابتدائية',
        students: 420,
        teachers: 22,
        averageScore: 65,
        totalSessions: 180,
        improvement: 3,
        status: 'needs_improvement'
      }
    ]

    const mockProgress: RegionProgress[] = [
      { month: 'سبتمبر', averageScore: 75, sessionsCount: 8900, schoolsActive: 820 },
      { month: 'أكتوبر', averageScore: 78, sessionsCount: 9800, schoolsActive: 845 },
      { month: 'نوفمبر', averageScore: 80, sessionsCount: 11200, schoolsActive: 870 },
      { month: 'ديسمبر', averageScore: 82, sessionsCount: 12400, schoolsActive: 890 }
    ]

    setTimeout(() => {
      setRegion(mockRegion)
      setSchools(mockSchools)
      setProgress(mockProgress)
      setIsLoading(false)
    }, 1000)
  }, [regionId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'needs_improvement': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'ممتاز'
      case 'good': return 'جيد'
      case 'needs_improvement': return 'يحتاج تحسين'
      default: return 'غير محدد'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 65) return 'text-orange-600'
    return 'text-red-600'
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 10) return 'text-green-600'
    if (improvement > 5) return 'text-blue-600'
    if (improvement > 0) return 'text-orange-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المنطقة...</p>
        </div>
      </div>
    )
  }

  if (!region) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">المنطقة غير موجودة</h3>
            <p className="text-red-600 mb-4">لم يتم العثور على بيانات المنطقة المطلوبة</p>
            <Button onClick={() => window.history.back()} variant="outline">
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للوحة الوزارة
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{region.name}</h1>
              <p className="text-gray-600">تفاصيل شاملة عن أداء المنطقة</p>
            </div>
            <Badge className={getStatusColor(region.status)}>
              {getStatusText(region.status)}
            </Badge>
          </div>
        </div>

        {/* Region Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{region.schools}</div>
              <div className="text-sm text-gray-600">مدرسة</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{region.students.toLocaleString()}</div>
              <div className="text-sm text-gray-600">طالب</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getScoreColor(region.averageScore)}`}>
                {region.averageScore}%
              </div>
              <div className="text-sm text-gray-600">المتوسط العام</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">+{region.growth}%</div>
              <div className="text-sm text-gray-600">النمو الشهري</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schools">المدارس</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  مدارس المنطقة
                </CardTitle>
                <CardDescription>
                  قائمة بجميع المدارس في المنطقة وأدائها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <School className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{school.name}</h3>
                          <p className="text-sm text-gray-600">
                            {school.students} طالب • {school.teachers} معلم
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(school.averageScore)}`}>
                            {school.averageScore}%
                          </div>
                          <div className="text-xs text-gray-500">المتوسط</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {school.totalSessions}
                          </div>
                          <div className="text-xs text-gray-500">جلسة</div>
                        </div>

                        <div className="text-center">
                          <div className={`text-lg font-bold ${getImprovementColor(school.improvement)}`}>
                            +{school.improvement}%
                          </div>
                          <div className="text-xs text-gray-500">التحسن</div>
                        </div>
                        
                        <Badge className={getStatusColor(school.status)}>
                          {getStatusText(school.status)}
                        </Badge>

                        <Button size="sm">
                          <Eye className="h-4 w-4 ml-1" />
                          التفاصيل
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
                  تقدم المنطقة
                </CardTitle>
                <CardDescription>
                  تطور أداء المنطقة عبر الأشهر الماضية
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
                          <p className="text-sm text-gray-600">
                            {month.schoolsActive} مدرسة نشطة
                          </p>
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
                          <div className="text-lg font-bold text-purple-600">
                            {month.sessionsCount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">جلسة</div>
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

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  تقارير المنطقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    تقرير شامل للمنطقة
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <School className="h-6 w-6 mb-2" />
                    تقرير المدارس
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    تحليل الأداء
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    تقرير النمو
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