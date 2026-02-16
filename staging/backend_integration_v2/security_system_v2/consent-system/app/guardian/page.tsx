'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  FileText, 
  Shield, 
  Bell, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface Child {
  id: string
  name: string
  age: number
  school: string
  grade: string
  status: 'active' | 'inactive'
  lastActivity: string
  totalSessions: number
  averageScore: number
  recentReports: Report[]
}

interface Report {
  id: string
  title: string
  exerciseType: string
  overallScore: number
  createdAt: string
  status: 'completed' | 'processing'
  allowedFields: string[]
}

interface ConsentRequest {
  id: string
  childId: string
  childName: string
  requestType: 'video_analysis' | 'data_sharing' | 'research_participation'
  description: string
  requestedBy: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  expiresAt: string
}

interface Notification {
  id: string
  type: 'consent_request' | 'report_ready' | 'coach_review'
  title: string
  message: string
  childId?: string
  childName?: string
  createdAt: string
  read: boolean
  payload: any
}

export default function GuardianDashboard() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGuardianData()
  }, [])

  const fetchGuardianData = async () => {
    try {
      // Mock data - in real app, fetch from API with RLS
      const mockChildren: Child[] = [
        {
          id: 'child-001',
          name: 'أحمد محمد',
          age: 16,
          school: 'مدرسة الملك فهد الثانوية',
          grade: 'الصف العاشر',
          status: 'active',
          lastActivity: '2025-01-08T10:30:00Z',
          totalSessions: 25,
          averageScore: 87.5,
          recentReports: [
            {
              id: 'report-001',
              title: 'تحليل تمرين كرة القدم',
              exerciseType: 'كرة القدم',
              overallScore: 88.5,
              createdAt: '2025-01-08T10:30:00Z',
              status: 'completed',
              allowedFields: ['overallScore', 'exerciseType', 'recommendations']
            }
          ]
        },
        {
          id: 'child-002',
          name: 'فاطمة علي',
          age: 14,
          school: 'مدرسة الأميرة نورة',
          grade: 'الصف الثامن',
          status: 'active',
          lastActivity: '2025-01-07T14:20:00Z',
          totalSessions: 18,
          averageScore: 92.1,
          recentReports: [
            {
              id: 'report-002',
              title: 'تحليل تمرين كرة السلة',
              exerciseType: 'كرة السلة',
              overallScore: 91.2,
              createdAt: '2025-01-07T14:20:00Z',
              status: 'completed',
              allowedFields: ['overallScore', 'exerciseType', 'improvements']
            }
          ]
        }
      ]

      const mockConsentRequests: ConsentRequest[] = [
        {
          id: 'consent-001',
          childId: 'child-001',
          childName: 'أحمد محمد',
          requestType: 'video_analysis',
          description: 'طلب موافقة على تحليل فيديو تمرين كرة القدم باستخدام الذكاء الاصطناعي',
          requestedBy: 'المدرب خالد',
          requestedAt: '2025-01-08T09:00:00Z',
          status: 'pending',
          expiresAt: '2025-01-15T23:59:59Z'
        }
      ]

      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'consent_request',
          title: 'طلب موافقة جديد',
          message: 'يطلب المدرب خالد موافقة على تحليل فيديو تمرين أحمد',
          childId: 'child-001',
          childName: 'أحمد محمد',
          createdAt: '2025-01-08T09:00:00Z',
          read: false,
          payload: {
            consentId: 'consent-001',
            requestType: 'video_analysis',
            exerciseType: 'كرة القدم'
          }
        },
        {
          id: 'notif-002',
          type: 'report_ready',
          title: 'تقرير جديد متاح',
          message: 'تم إنتاج تقرير تحليل جديد لفاطمة',
          childId: 'child-002',
          childName: 'فاطمة علي',
          createdAt: '2025-01-07T15:30:00Z',
          read: false,
          payload: {
            reportId: 'report-002',
            exerciseType: 'كرة السلة',
            overallScore: 91.2
          }
        }
      ]

      setChildren(mockChildren)
      setConsentRequests(mockConsentRequests)
      setNotifications(mockNotifications)
      setSelectedChild(mockChildren[0]?.id || null)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching guardian data:', error)
      setIsLoading(false)
    }
  }

  const handleConsentResponse = async (consentId: string, approved: boolean) => {
    try {
      // Mock API call - in real app, POST to /api/consents/{id}/respond
      const response = {
        success: true,
        message: approved ? 'تمت الموافقة بنجاح' : 'تم رفض الطلب'
      }

      // Update local state
      setConsentRequests(prev => 
        prev.map(req => 
          req.id === consentId 
            ? { ...req, status: approved ? 'approved' : 'rejected' }
            : req
        )
      )

      // Add audit log entry
      console.log('Consent response audit log:', {
        consentId,
        approved,
        guardianId: user?.id,
        timestamp: new Date().toISOString(),
        ipAddress: 'guardian_dashboard'
      })

    } catch (error) {
      console.error('Error responding to consent:', error)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const selectedChildData = children.find(child => child.id === selectedChild)
  const unreadNotifications = notifications.filter(n => !n.read)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الأطفال...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم ولي الأمر</h1>
              <p className="text-gray-600">متابعة أنشطة الأطفال وإدارة الموافقات</p>
            </div>
            <div className="flex items-center gap-4">
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {unreadNotifications.length} إشعار جديد
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <Card 
              key={child.id} 
              className={`cursor-pointer transition-all ${
                selectedChild === child.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedChild(child.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    {child.name}
                  </CardTitle>
                  <Badge className={child.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {child.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <CardDescription>
                  {child.school} - {child.grade}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>العمر:</span>
                    <span>{child.age} سنة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد الجلسات:</span>
                    <span>{child.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط النقاط:</span>
                    <span className="font-semibold text-purple-600">{child.averageScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="consents">الموافقات</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {selectedChildData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    تقارير {selectedChildData.name}
                  </CardTitle>
                  <CardDescription>
                    عرض التقارير المسموح بها فقط (بدون معلومات شخصية حساسة)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedChildData.recentReports.map((report) => (
                      <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {report.exerciseType}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">النقاط الإجمالية:</span>
                            <span className="font-semibold text-blue-600 mr-2">{report.overallScore}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">تاريخ التقرير:</span>
                            <span className="mr-2">{new Date(report.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            الحقول المسموحة: {report.allowedFields.join(', ')}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            // Mock API call: GET /api/reports/{report.id}
                            console.log('Fetching report with RLS check:', {
                              reportId: report.id,
                              guardianId: user?.id,
                              childId: selectedChildData.id,
                              allowedFields: report.allowedFields
                            })
                          }}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التقرير
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Consents Tab */}
          <TabsContent value="consents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  إدارة الموافقات
                </CardTitle>
                <CardDescription>
                  مراجعة والرد على طلبات الموافقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consentRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{request.childName}</h3>
                        <Badge className={
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {request.status === 'pending' ? 'في الانتظار' :
                           request.status === 'approved' ? 'موافق عليه' : 'مرفوض'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="text-sm text-gray-500 mb-3">
                        <p>طلب بواسطة: {request.requestedBy}</p>
                        <p>تاريخ الطلب: {new Date(request.requestedAt).toLocaleDateString('ar-SA')}</p>
                        <p>ينتهي في: {new Date(request.expiresAt).toLocaleDateString('ar-SA')}</p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleConsentResponse(request.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 ml-1" />
                            موافق
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleConsentResponse(request.id, false)}
                          >
                            <XCircle className="h-4 w-4 ml-1" />
                            رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {consentRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-8">لا توجد طلبات موافقة حالياً</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  الإشعارات
                </CardTitle>
                <CardDescription>
                  إشعارات حول طلبات المراجعة والتقارير الجديدة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {notification.type === 'consent_request' && <Shield className="h-4 w-4 text-green-600" />}
                            {notification.type === 'report_ready' && <FileText className="h-4 w-4 text-blue-600" />}
                            {notification.type === 'coach_review' && <Activity className="h-4 w-4 text-orange-600" />}
                            <h3 className="font-semibold">{notification.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          {notification.childName && (
                            <p className="text-sm text-gray-500">الطفل: {notification.childName}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString('ar-SA')}
                          </p>
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                            <strong>بيانات الإشعار:</strong>
                            <pre className="mt-1">{JSON.stringify(notification.payload, null, 2)}</pre>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  إعدادات الخصوصية
                </CardTitle>
                <CardDescription>
                  التحكم في مستوى الوصول للبيانات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>حماية RLS نشطة:</strong> يمكن لولي الأمر رؤية بيانات أطفاله فقط. 
                    لا يمكن الوصول إلى بيانات أطفال آخرين.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">الحماية المفعلة</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• عزل البيانات على مستوى قاعدة البيانات</li>
                      <li>• تشفير البيانات الحساسة</li>
                      <li>• تسجيل جميع عمليات الوصول</li>
                      <li>• مراجعة دورية للصلاحيات</li>
                    </ul>
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