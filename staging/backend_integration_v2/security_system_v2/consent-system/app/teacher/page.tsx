'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  Plus,
  Eye,
  Edit,
  Send,
  FileText,
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Database
} from 'lucide-react'

interface Student {
  id: string
  name: string
  grade: string
  class: string
  averageScore: number
  sessionsCount: number
  lastActivity: string
  status: 'active' | 'inactive'
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs_improvement'
}

interface TrainingPlan {
  studentId: string
  studentName: string
  exercises: string[]
  duration: string
  goals: string
  notes: string
  createdAt: string
}

interface ClassStats {
  totalStudents: number
  activeStudents: number
  averageScore: number
  completedSessions: number
  improvementRate: number
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [classStats, setClassStats] = useState<ClassStats | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showTrainingPlanForm, setShowTrainingPlanForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('all')
  const [apiLogs, setApiLogs] = useState<string[]>([])
  const [trainingPlan, setTrainingPlan] = useState({
    exercises: '',
    duration: '',
    goals: '',
    notes: ''
  })

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const logApiCall = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    setApiLogs(prev => [logEntry, ...prev.slice(0, 19)])
    console.log(logEntry)
  }

  const fetchTeacherData = async () => {
    try {
      logApiCall('GET /api/teacher/students - Fetching assigned students')
      logApiCall('SQL: SELECT s.*, sp.* FROM students s JOIN student_profiles sp ON s.id = sp.student_id WHERE s.teacher_id = ? AND sp.consent_status = "active"')
      
      // Mock student data
      const mockStudents: Student[] = [
        {
          id: 'student-001',
          name: 'أحمد محمد العلي',
          grade: 'الصف السادس',
          class: '6أ',
          averageScore: 85.2,
          sessionsCount: 24,
          lastActivity: '2025-01-08T10:30:00Z',
          status: 'active',
          performanceLevel: 'excellent'
        },
        {
          id: 'student-002',
          name: 'فاطمة عبدالله السعد',
          grade: 'الصف السادس',
          class: '6أ',
          averageScore: 78.9,
          sessionsCount: 18,
          lastActivity: '2025-01-07T14:20:00Z',
          status: 'active',
          performanceLevel: 'good'
        },
        {
          id: 'student-003',
          name: 'يوسف خالد المطيري',
          grade: 'الصف الخامس',
          class: '5ب',
          averageScore: 72.1,
          sessionsCount: 15,
          lastActivity: '2025-01-06T09:15:00Z',
          status: 'active',
          performanceLevel: 'average'
        },
        {
          id: 'student-004',
          name: 'نورا سعد الغامدي',
          grade: 'الصف الخامس',
          class: '5ب',
          averageScore: 65.8,
          sessionsCount: 12,
          lastActivity: '2025-01-05T16:45:00Z',
          status: 'inactive',
          performanceLevel: 'needs_improvement'
        }
      ]

      const mockClassStats: ClassStats = {
        totalStudents: mockStudents.length,
        activeStudents: mockStudents.filter(s => s.status === 'active').length,
        averageScore: mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / mockStudents.length,
        completedSessions: mockStudents.reduce((sum, s) => sum + s.sessionsCount, 0),
        improvementRate: 12.5
      }

      logApiCall(`Response: Found ${mockStudents.length} students for teacher`)
      logApiCall('RLS Check: Teacher can only see assigned students with active consent')

      setStudents(mockStudents)
      setClassStats(mockClassStats)
      setIsLoading(false)
    } catch (error) {
      logApiCall(`ERROR: Failed to fetch teacher data - ${error}`)
      setIsLoading(false)
    }
  }

  const createTrainingPlan = async () => {
    if (!selectedStudent) return

    try {
      logApiCall(`POST /api/training-plans - Creating training plan for student ${selectedStudent.id}`)
      
      const planData = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        exercises: trainingPlan.exercises.split(',').map(e => e.trim()),
        duration: trainingPlan.duration,
        goals: trainingPlan.goals,
        notes: trainingPlan.notes,
        createdAt: new Date().toISOString(),
        teacherId: 'teacher-001'
      }

      logApiCall(`SQL: INSERT INTO training_plans (student_id, teacher_id, exercises, duration, goals, notes, created_at) VALUES ('${planData.studentId}', '${planData.teacherId}', '${JSON.stringify(planData.exercises)}', '${planData.duration}', '${planData.goals}', '${planData.notes}', '${planData.createdAt}')`)

      // Create notification
      logApiCall(`POST /api/notifications - Creating notification for student and guardian`)
      logApiCall(`SQL: INSERT INTO notifications (user_id, type, title, message, payload, created_at) VALUES ('${planData.studentId}', 'training_plan', 'خطة تدريب جديدة', 'تم إنشاء خطة تدريب جديدة من المدرس', '${JSON.stringify(planData)}', '${new Date().toISOString()}')`)

      setShowTrainingPlanForm(false)
      setTrainingPlan({
        exercises: '',
        duration: '',
        goals: '',
        notes: ''
      })
      setSelectedStudent(null)

      logApiCall('SUCCESS: Training plan created and notifications sent')
      alert('تم إنشاء خطة التدريب بنجاح وإرسال إشعار للطالب وولي الأمر')

    } catch (error) {
      logApiCall(`ERROR: Failed to create training plan - ${error}`)
      alert('حدث خطأ في إنشاء خطة التدريب')
    }
  }

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'average': return 'bg-yellow-100 text-yellow-800'
      case 'needs_improvement': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceText = (level: string) => {
    switch (level) {
      case 'excellent': return 'ممتاز'
      case 'good': return 'جيد'
      case 'average': return 'متوسط'
      case 'needs_improvement': return 'يحتاج تحسين'
      default: return 'غير محدد'
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade
    return matchesSearch && matchesGrade
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المدرس...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المدرس</h1>
          <p className="text-gray-600">إدارة ومتابعة تقدم الطلاب في الأنشطة الرياضية</p>
        </div>

        {/* RLS Security Alert */}
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>حماية البيانات:</strong> يمكنك رؤية الطلاب المُكلفين لك فقط والذين لديهم موافقة نشطة على مشاركة البيانات.
          </AlertDescription>
        </Alert>

        {/* Class Statistics */}
        {classStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{classStats.totalStudents}</div>
                <div className="text-sm text-gray-600">إجمالي الطلاب</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{classStats.activeStudents}</div>
                <div className="text-sm text-gray-600">طلاب نشطين</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{classStats.averageScore.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">متوسط الدرجات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{classStats.completedSessions}</div>
                <div className="text-sm text-gray-600">جلسات مكتملة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">+{classStats.improvementRate}%</div>
                <div className="text-sm text-gray-600">معدل التحسن</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="training">خطط التدريب</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="logs">سجل API</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  قائمة الطلاب المُكلفين
                </CardTitle>
                <CardDescription>
                  الطلاب الذين لديك صلاحية متابعتهم (مع موافقة نشطة على مشاركة البيانات)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="البحث في الطلاب..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الصفوف</SelectItem>
                      <SelectItem value="الصف الخامس">الصف الخامس</SelectItem>
                      <SelectItem value="الصف السادس">الصف السادس</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.grade} - {student.class}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPerformanceColor(student.performanceLevel)}>
                            {getPerformanceText(student.performanceLevel)}
                          </Badge>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">متوسط النقاط:</span>
                          <p className="font-medium text-blue-600">{student.averageScore}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">عدد الجلسات:</span>
                          <p className="font-medium">{student.sessionsCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">آخر نشاط:</span>
                          <p className="font-medium">{new Date(student.lastActivity).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">المستوى:</span>
                          <p className="font-medium">{getPerformanceText(student.performanceLevel)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `/teacher/students/${student.id}`}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowTrainingPlanForm(true)
                          }}
                        >
                          <Plus className="h-4 w-4 ml-1" />
                          إنشاء خطة تدريب
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Plans Tab */}
          <TabsContent value="training" className="space-y-6">
            {showTrainingPlanForm && selectedStudent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    إنشاء خطة تدريب - {selectedStudent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="exercises">التمارين المطلوبة</Label>
                    <Textarea
                      id="exercises"
                      placeholder="اكتب التمارين مفصولة بفاصلة (مثال: جري، كرة قدم، سباحة)"
                      value={trainingPlan.exercises}
                      onChange={(e) => setTrainingPlan({...trainingPlan, exercises: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">مدة الخطة</Label>
                    <Select value={trainingPlan.duration} onValueChange={(value) => setTrainingPlan({...trainingPlan, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="أسبوع واحد">أسبوع واحد</SelectItem>
                        <SelectItem value="أسبوعين">أسبوعين</SelectItem>
                        <SelectItem value="شهر">شهر</SelectItem>
                        <SelectItem value="شهرين">شهرين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goals">الأهداف المطلوبة</Label>
                    <Textarea
                      id="goals"
                      placeholder="اكتب الأهداف المطلوب تحقيقها من هذه الخطة"
                      value={trainingPlan.goals}
                      onChange={(e) => setTrainingPlan({...trainingPlan, goals: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات أو توجيهات إضافية للطالب"
                      value={trainingPlan.notes}
                      onChange={(e) => setTrainingPlan({...trainingPlan, notes: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createTrainingPlan}>
                      <Send className="h-4 w-4 ml-1" />
                      إرسال الخطة
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowTrainingPlanForm(false)
                        setSelectedStudent(null)
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    خطط التدريب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">
                    اختر طالباً من قائمة الطلاب لإنشاء خطة تدريب مخصصة له
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  تقارير الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    تقرير الصف الشامل
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    تقرير التحسن
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    تقرير الإنجازات
                  </Button>
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