'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  FileText, 
  Eye, 
  Edit,
  Filter,
  Search,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Video,
  BarChart3,
  Flag,
  Save,
  Send
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface Session {
  id: string
  studentId: string
  studentName: string
  exerciseType: string
  uploadedAt: string
  status: 'completed' | 'processing' | 'needs_review' | 'flagged'
  originalScore: number
  adjustedScore?: number
  coachNotes?: string
  flaggedForReview: boolean
  confidence: number
  rawFeatures: {
    balance: number
    speed: number
    accuracy: number
    technique: number
    coordination: number
  }
}

interface AuditLog {
  id: string
  sessionId: string
  action: string
  userId: string
  userName: string
  beforeValue: any
  afterValue: any
  timestamp: string
  ipAddress: string
  userAgent: string
}

export default function CoachDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter states
  const [studentFilter, setStudentFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [editedScore, setEditedScore] = useState<number>(0)
  const [editNotes, setEditNotes] = useState('')
  
  // API logs
  const [apiLogs, setApiLogs] = useState<string[]>([])

  useEffect(() => {
    fetchCoachData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sessions, studentFilter, dateFilter, statusFilter])

  const logApiCall = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    setApiLogs(prev => [logEntry, ...prev.slice(0, 9)])
    console.log(logEntry)
  }

  const fetchCoachData = async () => {
    try {
      logApiCall('GET /api/coach/sessions - Fetching assigned sessions with RLS')
      
      // Mock API call with RLS simulation
      const mockSessions: Session[] = [
        {
          id: 'session-001',
          studentId: 'student-001',
          studentName: 'أحمد محمد',
          exerciseType: 'كرة القدم',
          uploadedAt: '2025-01-08T10:30:00Z',
          status: 'completed',
          originalScore: 85.5,
          adjustedScore: undefined,
          coachNotes: '',
          flaggedForReview: false,
          confidence: 0.92,
          rawFeatures: {
            balance: 85.2,
            speed: 90.1,
            accuracy: 87.8,
            technique: 89.5,
            coordination: 86.3
          }
        },
        {
          id: 'session-002',
          studentId: 'student-002',
          studentName: 'فاطمة علي',
          exerciseType: 'كرة السلة',
          uploadedAt: '2025-01-07T14:20:00Z',
          status: 'completed',
          originalScore: 91.2,
          adjustedScore: 88.0,
          coachNotes: 'تم تعديل النقاط بناءً على ملاحظات تقنية',
          flaggedForReview: false,
          confidence: 0.89,
          rawFeatures: {
            balance: 92.1,
            speed: 88.5,
            accuracy: 93.2,
            technique: 91.8,
            coordination: 90.4
          }
        },
        {
          id: 'session-003',
          studentId: 'student-003',
          studentName: 'يوسف خالد',
          exerciseType: 'الجري',
          uploadedAt: '2025-01-06T16:45:00Z',
          status: 'needs_review',
          originalScore: 68.5,
          adjustedScore: undefined,
          coachNotes: '',
          flaggedForReview: true,
          confidence: 0.65,
          rawFeatures: {
            balance: 70.2,
            speed: 75.1,
            accuracy: 65.8,
            technique: 68.5,
            coordination: 63.3
          }
        }
      ]

      logApiCall(`SQL: SELECT s.*, st.name as student_name FROM sessions s JOIN students st ON s.student_id = st.id WHERE s.coach_id = '${user?.id}' ORDER BY s.uploaded_at DESC`)
      logApiCall(`RLS Check: Coach ${user?.id} can only see sessions for assigned students`)
      logApiCall(`Response: Found ${mockSessions.length} sessions`)
      
      setSessions(mockSessions)
      setIsLoading(false)
    } catch (error) {
      logApiCall(`ERROR: Failed to fetch sessions - ${error}`)
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = sessions

    if (studentFilter) {
      filtered = filtered.filter(session =>
        session.studentName.toLowerCase().includes(studentFilter.toLowerCase())
      )
    }

    if (dateFilter) {
      filtered = filtered.filter(session =>
        session.uploadedAt.startsWith(dateFilter)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(session =>
        session.status === statusFilter
      )
    }

    setFilteredSessions(filtered)
    logApiCall(`Filter Applied: ${filtered.length} sessions match criteria`)
  }

  const openSession = (session: Session) => {
    logApiCall(`GET /api/sessions/${session.id}/report - Opening session report`)
    logApiCall(`Permission Check: Coach ${user?.id} accessing session ${session.id}`)
    
    setSelectedSession(session)
    setEditedScore(session.adjustedScore || session.originalScore)
    setEditNotes(session.coachNotes || '')
  }

  const saveScoreAdjustment = async () => {
    if (!selectedSession) return

    try {
      logApiCall(`PUT /api/sessions/${selectedSession.id}/score - Attempting manual score correction`)
      
      const beforeValue = {
        originalScore: selectedSession.originalScore,
        adjustedScore: selectedSession.adjustedScore,
        notes: selectedSession.coachNotes
      }

      const afterValue = {
        originalScore: selectedSession.originalScore,
        adjustedScore: editedScore,
        notes: editNotes
      }

      // Check if coach is allowed to edit scores
      if (selectedSession.status === 'flagged') {
        logApiCall(`ERROR: Cannot edit flagged session - requires admin approval`)
        return
      }

      // Mock API call
      logApiCall(`SQL: UPDATE sessions SET adjusted_score = ${editedScore}, coach_notes = '${editNotes}', updated_at = NOW() WHERE id = '${selectedSession.id}' AND coach_id = '${user?.id}'`)
      
      // Create audit log entry
      const auditEntry: AuditLog = {
        id: `audit-${Date.now()}`,
        sessionId: selectedSession.id,
        action: 'SCORE_MANUAL_CORRECTION',
        userId: user?.id || 'coach-001',
        userName: user?.profile?.name || 'المدرب',
        beforeValue,
        afterValue,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Coach Dashboard'
      }

      logApiCall(`SQL: INSERT INTO audit_logs (session_id, action, user_id, user_name, before_value, after_value, timestamp, ip_address, user_agent) VALUES ('${auditEntry.sessionId}', '${auditEntry.action}', '${auditEntry.userId}', '${auditEntry.userName}', '${JSON.stringify(auditEntry.beforeValue)}', '${JSON.stringify(auditEntry.afterValue)}', '${auditEntry.timestamp}', '${auditEntry.ipAddress}', '${auditEntry.userAgent}')`)
      
      // Update local state
      setSessions(prev =>
        prev.map(session =>
          session.id === selectedSession.id
            ? { ...session, adjustedScore: editedScore, coachNotes: editNotes }
            : session
        )
      )

      setAuditLogs(prev => [auditEntry, ...prev])
      setIsEditing(false)
      
      logApiCall(`SUCCESS: Score adjusted from ${selectedSession.originalScore} to ${editedScore}`)
      logApiCall(`AUDIT: Entry created with ID ${auditEntry.id}`)
      
    } catch (error) {
      logApiCall(`ERROR: Failed to save score adjustment - ${error}`)
    }
  }

  const requestHumanReview = async () => {
    if (!selectedSession) return

    try {
      logApiCall(`POST /api/sessions/${selectedSession.id}/request-review - Triggering human review flow`)
      
      // Mock API call
      logApiCall(`SQL: UPDATE sessions SET status = 'flagged', flagged_for_review = true, flagged_by = '${user?.id}', flagged_at = NOW() WHERE id = '${selectedSession.id}'`)
      
      // Create notification for admin
      logApiCall(`SQL: INSERT INTO notifications (user_id, type, title, message, payload, created_at) VALUES ('admin-001', 'review_request', 'طلب مراجعة بشرية', 'طلب المدرب مراجعة جلسة ${selectedSession.studentName}', '${JSON.stringify({ sessionId: selectedSession.id, coachId: user?.id })}', NOW())`)
      
      // Update session status
      setSessions(prev =>
        prev.map(session =>
          session.id === selectedSession.id
            ? { ...session, status: 'flagged', flaggedForReview: true }
            : session
        )
      )

      // Create audit log
      const auditEntry: AuditLog = {
        id: `audit-${Date.now()}`,
        sessionId: selectedSession.id,
        action: 'REQUEST_HUMAN_REVIEW',
        userId: user?.id || 'coach-001',
        userName: user?.profile?.name || 'المدرب',
        beforeValue: { status: selectedSession.status, flaggedForReview: false },
        afterValue: { status: 'flagged', flaggedForReview: true },
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Coach Dashboard'
      }

      setAuditLogs(prev => [auditEntry, ...prev])
      
      logApiCall(`SUCCESS: Session flagged for human review`)
      logApiCall(`NOTIFICATION: Admin notified about review request`)
      
    } catch (error) {
      logApiCall(`ERROR: Failed to request human review - ${error}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الجلسات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المدرب</h1>
          <p className="text-gray-600">مراجعة وتعديل تقارير الجلسات التدريبية</p>
        </div>

        {/* RLS Security Alert */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>حماية RLS نشطة:</strong> يمكن للمدرب رؤية جلسات الطلاب المخصصين له فقط. 
            المدرب: {user?.profile?.name || 'غير محدد'} | معرف: {user?.id}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
            <TabsTrigger value="review">المراجعة التفصيلية</TabsTrigger>
            <TabsTrigger value="audit">سجل التدقيق</TabsTrigger>
            <TabsTrigger value="logs">سجل API</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-orange-600" />
                  تصفية الجلسات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="student">الطالب</Label>
                    <Input
                      id="student"
                      placeholder="اسم الطالب..."
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">التاريخ</Label>
                    <Input
                      id="date"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <select 
                      id="status"
                      className="w-full p-2 border rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="completed">مكتملة</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="needs_review">تحتاج مراجعة</option>
                      <option value="flagged">مُعلمة للمراجعة</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  الجلسات التدريبية ({filteredSessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{session.studentName}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {session.exerciseType}
                          </Badge>
                          <Badge className={
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            session.status === 'needs_review' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {session.status === 'completed' ? 'مكتملة' :
                             session.status === 'processing' ? 'قيد المعالجة' :
                             session.status === 'needs_review' ? 'تحتاج مراجعة' :
                             'مُعلمة للمراجعة'}
                          </Badge>
                          {session.flaggedForReview && (
                            <Badge className="bg-red-100 text-red-800">
                              <Flag className="h-3 w-3 ml-1" />
                              مُعلمة
                            </Badge>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => openSession(session)}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التقرير
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">النقاط الأصلية:</span>
                          <p className="font-medium">{session.originalScore}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">النقاط المعدلة:</span>
                          <p className="font-medium text-orange-600">
                            {session.adjustedScore ? `${session.adjustedScore}%` : 'غير معدلة'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">مستوى الثقة:</span>
                          <p className="font-medium">{(session.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">تاريخ الرفع:</span>
                          <p className="font-medium">{new Date(session.uploadedAt).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                      {session.coachNotes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong>ملاحظات المدرب:</strong> {session.coachNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Review Tab */}
          <TabsContent value="review" className="space-y-6">
            {selectedSession ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    مراجعة تفصيلية - {selectedSession.studentName}
                  </CardTitle>
                  <CardDescription>
                    {selectedSession.exerciseType} | {new Date(selectedSession.uploadedAt).toLocaleDateString('ar-SA')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    
                    {/* Video Simulation */}
                    <div className="bg-black rounded-lg p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">عرض الفيديو مع التحليل</span>
                      </div>
                      <div className="aspect-video bg-gray-800 rounded flex items-center justify-center">
                        <p className="text-gray-400">فيديو الجلسة مع طبقة التحليل</p>
                      </div>
                    </div>

                    {/* Score Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">النقاط والتعديلات</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span>النقاط الأصلية (AI):</span>
                            <span className="font-bold text-blue-600">{selectedSession.originalScore}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>النقاط المعدلة:</span>
                            <span className="font-bold text-orange-600">
                              {selectedSession.adjustedScore ? `${selectedSession.adjustedScore}%` : 'غير معدلة'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Score Editing */}
                        {selectedSession.status !== 'flagged' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">تعديل النقاط</h4>
                              <Button
                                size="sm"
                                variant={isEditing ? "outline" : "default"}
                                onClick={() => setIsEditing(!isEditing)}
                              >
                                <Edit className="h-4 w-4 ml-1" />
                                {isEditing ? 'إلغاء' : 'تعديل'}
                              </Button>
                            </div>
                            
                            {isEditing && (
                              <div className="space-y-3 p-3 bg-gray-50 rounded">
                                <div>
                                  <Label htmlFor="score">النقاط الجديدة</Label>
                                  <Input
                                    id="score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editedScore}
                                    onChange={(e) => setEditedScore(parseFloat(e.target.value))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="notes">ملاحظات التعديل</Label>
                                  <Textarea
                                    id="notes"
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    placeholder="سبب تعديل النقاط..."
                                    rows={3}
                                  />
                                </div>
                                <Button onClick={saveScoreAdjustment} className="w-full">
                                  <Save className="h-4 w-4 ml-1" />
                                  حفظ التعديل
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedSession.status === 'flagged' && (
                          <Alert>
                            <Flag className="h-4 w-4" />
                            <AlertDescription>
                              هذه الجلسة مُعلمة للمراجعة البشرية. لا يمكن تعديلها حتى تتم المراجعة.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Raw Features */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">البيانات الخام</h3>
                        <div className="space-y-3">
                          {Object.entries(selectedSession.rawFeatures).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>
                                  {key === 'balance' ? 'التوازن' :
                                   key === 'speed' ? 'السرعة' :
                                   key === 'accuracy' ? 'الدقة' :
                                   key === 'technique' ? 'التقنية' :
                                   key === 'coordination' ? 'التناسق' : key}
                                </span>
                                <span className="font-medium">{value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full" 
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">إجراءات المراجعة</h4>
                      <div className="flex gap-2">
                        <Button 
                          onClick={requestHumanReview}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={selectedSession.flaggedForReview}
                        >
                          <Flag className="h-4 w-4 ml-1" />
                          {selectedSession.flaggedForReview ? 'مُعلمة للمراجعة' : 'طلب مراجعة بشرية'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">اختر جلسة من القائمة لعرض المراجعة التفصيلية</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  سجل التدقيق
                </CardTitle>
                <CardDescription>
                  جميع التعديلات والإجراءات مع القيم قبل وبعد التغيير
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            log.action === 'SCORE_MANUAL_CORRECTION' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {log.action === 'SCORE_MANUAL_CORRECTION' ? 'تعديل النقاط' : 'طلب مراجعة'}
                          </Badge>
                          <span className="font-medium">{log.userName}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-red-50 p-2 rounded">
                          <strong>قبل التغيير:</strong>
                          <pre className="mt-1 text-xs">{JSON.stringify(log.beforeValue, null, 2)}</pre>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <strong>بعد التغيير:</strong>
                          <pre className="mt-1 text-xs">{JSON.stringify(log.afterValue, null, 2)}</pre>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        معرف الجلسة: {log.sessionId} | IP: {log.ipAddress}
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد إدخالات في سجل التدقيق</p>
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
                  <Activity className="h-5 w-5 text-gray-600" />
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