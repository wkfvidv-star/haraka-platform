'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart3,
  Download,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  School,
  TrendingUp,
  Activity,
  MapPin,
  Calendar,
  Filter,
  Search,
  Eye,
  Lock,
  Database
} from 'lucide-react'

interface MinistryStats {
  totalSchools: number
  totalStudents: number
  totalSessions: number
  averagePerformance: number
  activeRegions: number
  monthlyGrowth: number
}

interface RegionStats {
  regionId: string
  regionName: string
  schoolCount: number
  studentCount: number
  sessionCount: number
  averageScore: number
  participationRate: number
  lastUpdated: string
}

interface SchoolReport {
  schoolId: string
  schoolName: string
  region: string
  studentCount: number
  sessionCount: number
  averageScore: number
  performanceGrade: 'A' | 'B' | 'C' | 'D'
  lastActivity: string
}

interface AccessAttempt {
  id: string
  timestamp: string
  userId: string
  attemptedResource: string
  deniedReason: string
  ipAddress: string
  userAgent: string
}

export default function MinistryDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<string>('all')
  const [ministryStats, setMinistryStats] = useState<MinistryStats | null>(null)
  const [regionStats, setRegionStats] = useState<RegionStats[]>([])
  const [schoolReports, setSchoolReports] = useState<SchoolReport[]>([])
  const [accessAttempts, setAccessAttempts] = useState<AccessAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [apiLogs, setApiLogs] = useState<string[]>([])

  useEffect(() => {
    fetchMinistryData()
  }, [selectedRegion, selectedSchool])

  const logApiCall = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    setApiLogs(prev => [logEntry, ...prev.slice(0, 19)])
    console.log(logEntry)
  }

  const fetchMinistryData = async () => {
    try {
      logApiCall('GET /api/ministry/stats - Fetching aggregated ministry statistics')
      logApiCall('SQL: SELECT * FROM ministry_stats_view WHERE region_id = ? OR ? = "all"')
      
      // Mock aggregated data - no PII
      const mockMinistryStats: MinistryStats = {
        totalSchools: 1247,
        totalStudents: 45632,
        totalSessions: 128945,
        averagePerformance: 78.5,
        activeRegions: 13,
        monthlyGrowth: 12.3
      }

      const mockRegionStats: RegionStats[] = [
        {
          regionId: 'riyadh',
          regionName: 'الرياض',
          schoolCount: 342,
          studentCount: 12845,
          sessionCount: 38567,
          averageScore: 82.1,
          participationRate: 89.5,
          lastUpdated: '2025-01-08T15:30:00Z'
        },
        {
          regionId: 'jeddah',
          regionName: 'جدة',
          schoolCount: 298,
          studentCount: 11234,
          sessionCount: 32145,
          averageScore: 79.8,
          participationRate: 87.2,
          lastUpdated: '2025-01-08T14:45:00Z'
        },
        {
          regionId: 'dammam',
          regionName: 'الدمام',
          schoolCount: 187,
          studentCount: 8976,
          sessionCount: 24567,
          averageScore: 76.4,
          participationRate: 85.1,
          lastUpdated: '2025-01-08T16:20:00Z'
        }
      ]

      const mockSchoolReports: SchoolReport[] = [
        {
          schoolId: 'school-001',
          schoolName: 'مدرسة الملك عبدالعزيز الثانوية',
          region: 'الرياض',
          studentCount: 456,
          sessionCount: 1234,
          averageScore: 85.2,
          performanceGrade: 'A',
          lastActivity: '2025-01-08T10:30:00Z'
        },
        {
          schoolId: 'school-002',
          schoolName: 'مدرسة الأمير محمد المتوسطة',
          region: 'جدة',
          studentCount: 378,
          sessionCount: 987,
          averageScore: 78.9,
          performanceGrade: 'B',
          lastActivity: '2025-01-07T14:20:00Z'
        },
        {
          schoolId: 'school-003',
          schoolName: 'مدرسة الفيصل الابتدائية',
          region: 'الدمام',
          studentCount: 234,
          sessionCount: 567,
          averageScore: 72.1,
          performanceGrade: 'C',
          lastActivity: '2025-01-06T09:15:00Z'
        }
      ]

      logApiCall(`Response: Found ${mockMinistryStats.totalSchools} schools, ${mockMinistryStats.totalStudents} students`)
      logApiCall('Data anonymized: No PII included in aggregated statistics')

      setMinistryStats(mockMinistryStats)
      setRegionStats(mockRegionStats)
      setSchoolReports(mockSchoolReports)
      setIsLoading(false)
    } catch (error) {
      logApiCall(`ERROR: Failed to fetch ministry data - ${error}`)
      setIsLoading(false)
    }
  }

  const attemptPIIAccess = async (resourceType: string) => {
    try {
      logApiCall(`UNAUTHORIZED ACCESS ATTEMPT: GET /api/students/personal-data`)
      logApiCall(`Security Check: Ministry user attempting to access ${resourceType}`)
      logApiCall(`BLOCKED: Access denied - insufficient permissions for PII data`)
      
      const accessAttempt: AccessAttempt = {
        id: `attempt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'ministry-user-001',
        attemptedResource: resourceType,
        deniedReason: 'Ministry users cannot access individual student PII',
        ipAddress: '192.168.1.200',
        userAgent: 'Ministry Dashboard'
      }

      logApiCall(`SQL: INSERT INTO access_violations (user_id, resource, reason, timestamp, ip_address) VALUES ('${accessAttempt.userId}', '${accessAttempt.attemptedResource}', '${accessAttempt.deniedReason}', '${accessAttempt.timestamp}', '${accessAttempt.ipAddress}')`)
      
      setAccessAttempts(prev => [accessAttempt, ...prev])
      
      alert('🚫 الوصول مرفوض: ليس لديك صلاحية للوصول إلى البيانات الشخصية للطلاب')
      
    } catch (error) {
      logApiCall(`ERROR: Failed to log access attempt - ${error}`)
    }
  }

  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      logApiCall(`POST /api/ministry/export - Exporting ${format.toUpperCase()} report`)
      logApiCall(`SQL: SELECT school_name, region, student_count, session_count, average_score FROM school_reports WHERE region = '${selectedRegion}'`)
      
      // Mock export functionality
      const exportData = schoolReports.map(school => ({
        'اسم المدرسة': school.schoolName,
        'المنطقة': school.region,
        'عدد الطلاب': school.studentCount,
        'عدد الجلسات': school.sessionCount,
        'متوسط النقاط': school.averageScore,
        'تقييم الأداء': school.performanceGrade,
        'آخر نشاط': new Date(school.lastActivity).toLocaleDateString('ar-SA')
      }))

      if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0]).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `ministry-report-${selectedRegion}-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
      } else {
        // Mock PDF export
        alert('تم إنشاء تقرير PDF بنجاح (محاكاة)')
      }

      logApiCall(`SUCCESS: ${format.toUpperCase()} report exported successfully`)
      logApiCall(`Export contains ${exportData.length} school records (anonymized data only)`)
      
    } catch (error) {
      logApiCall(`ERROR: Failed to export report - ${error}`)
    }
  }

  const getPerformanceColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-blue-100 text-blue-800'
      case 'C': return 'bg-yellow-100 text-yellow-800'
      case 'D': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSchools = schoolReports.filter(school =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الوزارة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم وزارة التعليم</h1>
          <p className="text-gray-600">الإحصائيات المجمعة والتقارير على مستوى المملكة</p>
        </div>

        {/* Region/School Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              اختيار المنطقة والمدرسة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">المنطقة</Label>
                <select 
                  id="region"
                  className="w-full p-2 border rounded-md"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">جميع المناطق</option>
                  <option value="riyadh">الرياض</option>
                  <option value="jeddah">جدة</option>
                  <option value="dammam">الدمام</option>
                  <option value="makkah">مكة المكرمة</option>
                  <option value="madinah">المدينة المنورة</option>
                </select>
              </div>
              <div>
                <Label htmlFor="school">المدرسة</Label>
                <select 
                  id="school"
                  className="w-full p-2 border rounded-md"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                >
                  <option value="all">جميع المدارس</option>
                  <option value="school-001">مدرسة الملك عبدالعزيز الثانوية</option>
                  <option value="school-002">مدرسة الأمير محمد المتوسطة</option>
                  <option value="school-003">مدرسة الفيصل الابتدائية</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Alert */}
        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>حماية الخصوصية:</strong> جميع البيانات المعروضة مجمعة ومجهولة الهوية. 
            لا يمكن للمستخدمين على مستوى الوزارة الوصول إلى البيانات الشخصية للطلاب.
          </AlertDescription>
        </Alert>

        {/* Ministry Statistics */}
        {ministryStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{ministryStats.totalSchools.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي المدارس</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{ministryStats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي الطلاب</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{ministryStats.totalSessions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">إجمالي الجلسات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{ministryStats.averagePerformance}%</div>
                <div className="text-sm text-gray-600">متوسط الأداء</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{ministryStats.activeRegions}</div>
                <div className="text-sm text-gray-600">المناطق النشطة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">+{ministryStats.monthlyGrowth}%</div>
                <div className="text-sm text-gray-600">النمو الشهري</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="regions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="regions">المناطق</TabsTrigger>
            <TabsTrigger value="schools">المدارس</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            <TabsTrigger value="logs">سجل API</TabsTrigger>
          </TabsList>

          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  إحصائيات المناطق
                </CardTitle>
                <CardDescription>
                  البيانات المجمعة لجميع المناطق (مجهولة الهوية)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionStats.map((region) => (
                    <div key={region.regionId} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{region.regionName}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          معدل المشاركة: {region.participationRate}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">عدد المدارس:</span>
                          <p className="font-medium">{region.schoolCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد الطلاب:</span>
                          <p className="font-medium">{region.studentCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد الجلسات:</span>
                          <p className="font-medium">{region.sessionCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">متوسط النقاط:</span>
                          <p className="font-medium text-green-600">{region.averageScore}%</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        آخر تحديث: {new Date(region.lastUpdated).toLocaleString('ar-SA')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-green-600" />
                  تقارير المدارس
                </CardTitle>
                <CardDescription>
                  تقارير مجمعة على مستوى المدرسة (بدون بيانات شخصية)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في المدارس..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredSchools.map((school) => (
                    <div key={school.schoolId} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{school.schoolName}</h3>
                          <p className="text-sm text-gray-600">{school.region}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPerformanceColor(school.performanceGrade)}>
                            تقييم {school.performanceGrade}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => attemptPIIAccess('student_personal_data')}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض الطلاب (محظور)
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">عدد الطلاب:</span>
                          <p className="font-medium">{school.studentCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد الجلسات:</span>
                          <p className="font-medium">{school.sessionCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">متوسط النقاط:</span>
                          <p className="font-medium text-blue-600">{school.averageScore}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">آخر نشاط:</span>
                          <p className="font-medium">{new Date(school.lastActivity).toLocaleDateString('ar-SA')}</p>
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
                  <FileText className="h-5 w-5 text-purple-600" />
                  تصدير التقارير
                </CardTitle>
                <CardDescription>
                  تصدير التقارير المجمعة بصيغ مختلفة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">تقرير المدارس الشامل</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      تقرير يحتوي على إحصائيات جميع المدارس في المنطقة المختارة
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => exportReport('csv')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تصدير CSV
                      </Button>
                      <Button 
                        onClick={() => exportReport('pdf')}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تصدير PDF
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold mb-2">تقرير الأداء الإقليمي</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      مقارنة الأداء بين المناطق المختلفة
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => exportReport('csv')}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تصدير التقرير
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold mb-2 text-red-800">محاولة الوصول للبيانات الشخصية</h3>
                    <p className="text-sm text-red-600 mb-3">
                      اختبار محاولة الوصول للبيانات الشخصية للطلاب (سيتم رفضها)
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => attemptPIIAccess('student_names')}
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        <Lock className="h-4 w-4 ml-1" />
                        محاولة الوصول لأسماء الطلاب
                      </Button>
                      <Button 
                        onClick={() => attemptPIIAccess('student_contact_info')}
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        <Lock className="h-4 w-4 ml-1" />
                        محاولة الوصول لبيانات الاتصال
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  سجل محاولات الوصول المرفوضة
                </CardTitle>
                <CardDescription>
                  تسجيل جميع محاولات الوصول غير المصرح بها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessAttempts.length > 0 ? (
                    accessAttempts.map((attempt) => (
                      <div key={attempt.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-red-100 text-red-800">وصول مرفوض</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(attempt.timestamp).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">المستخدم:</span>
                            <p className="font-medium">{attempt.userId}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">المورد المطلوب:</span>
                            <p className="font-medium text-red-600">{attempt.attemptedResource}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">سبب الرفض:</span>
                            <p className="font-medium">{attempt.deniedReason}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">عنوان IP:</span>
                            <p className="font-medium">{attempt.ipAddress}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">لا توجد محاولات وصول مرفوضة</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-600" />
                  سجل استدعاءات API و SQL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {apiLogs.length > 0 ? (
                    apiLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-500">لا توجد سجلات API حتى الآن</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}