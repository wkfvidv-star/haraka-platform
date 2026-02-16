'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Radio,
  Save,
  Shield,
  UserCheck,
  Users,
  X,
  Camera,
  Truck
} from 'lucide-react'

interface Incident {
  id: string
  type: string
  severity: string
  status: string
  title: string
  description: string
  location: string
  reportedBy: string
  reportedAt: string
  assignedTo?: string
  estimatedResponse?: string
  peopleInvolved: number
  contactNumber: string
  updates: IncidentUpdate[]
}

interface IncidentUpdate {
  id: string
  timestamp: string
  author: string
  message: string
  type: 'status_change' | 'assignment' | 'note' | 'escalation'
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newUpdate, setNewUpdate] = useState('')
  const [isAddingUpdate, setIsAddingUpdate] = useState(false)

  useEffect(() => {
    fetchIncidentDetails()
  }, [params.id])

  const fetchIncidentDetails = async () => {
    try {
      // Mock incident data - in real app, fetch from API
      const mockIncident: Incident = {
        id: params.id,
        type: 'medical',
        severity: 'high',
        status: 'responding',
        title: 'إصابة في ملعب كرة القدم',
        description: 'طالب سقط أثناء اللعب ويشتكي من ألم في الكاحل',
        location: 'ملعب كرة القدم الرئيسي',
        reportedBy: 'أ. محمد الرياضي',
        reportedAt: '2025-01-08T10:30:00Z',
        assignedTo: 'فريق الإسعاف المدرسي',
        estimatedResponse: '5-10 دقائق',
        peopleInvolved: 1,
        contactNumber: '+966501234567',
        updates: [
          {
            id: 'update-001',
            timestamp: '2025-01-08T10:35:00Z',
            author: 'فريق الإسعاف',
            message: 'تم الوصول إلى الموقع وفحص الطالب',
            type: 'note'
          },
          {
            id: 'update-002',
            timestamp: '2025-01-08T10:32:00Z',
            author: 'النظام',
            message: 'تم تعيين الحادث إلى فريق الإسعاف المدرسي',
            type: 'assignment'
          }
        ]
      }

      setIncident(mockIncident)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching incident:', error)
      setIsLoading(false)
    }
  }

  const addUpdate = async () => {
    if (!newUpdate.trim() || !incident) return

    try {
      setIsAddingUpdate(true)
      
      const update: IncidentUpdate = {
        id: `update-${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: 'المستخدم الحالي',
        message: newUpdate,
        type: 'note'
      }

      setIncident(prev => prev ? {
        ...prev,
        updates: [update, ...prev.updates]
      } : null)

      setNewUpdate('')
    } catch (error) {
      console.error('Error adding update:', error)
    } finally {
      setIsAddingUpdate(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!incident) return

    try {
      setIncident(prev => prev ? { ...prev, status: newStatus } : null)
      
      const statusUpdate: IncidentUpdate = {
        id: `update-${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: 'النظام',
        message: `تم تغيير الحالة إلى: ${newStatus}`,
        type: 'status_change'
      }

      setIncident(prev => prev ? {
        ...prev,
        updates: [statusUpdate, ...prev.updates]
      } : null)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الحادث...</p>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">الحادث غير موجود</h2>
            <p className="text-gray-600 mb-4">لم يتم العثور على الحادث المطلوب</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة إلى قائمة الحوادث
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{incident.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>رقم الحادث: {incident.id}</span>
                <span>•</span>
                <span>تم الإبلاغ: {new Date(incident.reportedAt).toLocaleString('ar-SA')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={
                incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }>
                {incident.severity === 'critical' ? 'حرج' :
                 incident.severity === 'high' ? 'عالي' :
                 incident.severity === 'medium' ? 'متوسط' : 'منخفض'}
              </Badge>
              <Badge className={
                incident.status === 'reported' ? 'bg-blue-100 text-blue-800' :
                incident.status === 'responding' ? 'bg-yellow-100 text-yellow-800' :
                incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }>
                {incident.status === 'reported' ? 'مُبلغ عنه' :
                 incident.status === 'responding' ? 'قيد الاستجابة' :
                 incident.status === 'resolved' ? 'محلول' : 'مُصعد'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  تفاصيل الحادث
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">الوصف</Label>
                  <p className="mt-1 text-gray-900">{incident.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">الموقع</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{incident.location}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">المُبلغ</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <UserCheck className="h-4 w-4 text-gray-500" />
                      <span>{incident.reportedBy}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">رقم الاتصال</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{incident.contactNumber}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">عدد المتأثرين</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{incident.peopleInvolved} شخص</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  إجراءات الاستجابة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {incident.status !== 'responding' && (
                    <Button 
                      onClick={() => updateStatus('responding')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Radio className="h-4 w-4 ml-1" />
                      بدء الاستجابة
                    </Button>
                  )}
                  {incident.status !== 'resolved' && (
                    <Button 
                      onClick={() => updateStatus('resolved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 ml-1" />
                      تم الحل
                    </Button>
                  )}
                  {incident.status !== 'escalated' && (
                    <Button 
                      onClick={() => updateStatus('escalated')}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <AlertTriangle className="h-4 w-4 ml-1" />
                      تصعيد
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Updates Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  التحديثات والملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Add New Update */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="update" className="text-sm font-medium">إضافة تحديث</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      id="update"
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      placeholder="اكتب تحديثاً أو ملاحظة..."
                      rows={3}
                    />
                    <Button 
                      onClick={addUpdate}
                      disabled={!newUpdate.trim() || isAddingUpdate}
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 ml-1" />
                      {isAddingUpdate ? 'جاري الإضافة...' : 'إضافة تحديث'}
                    </Button>
                  </div>
                </div>

                {/* Updates List */}
                <div className="space-y-3">
                  {incident.updates.map((update) => (
                    <div key={update.id} className="flex gap-3 p-3 bg-white border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          update.type === 'status_change' ? 'bg-blue-100' :
                          update.type === 'assignment' ? 'bg-green-100' :
                          update.type === 'escalation' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          {update.type === 'status_change' ? <Activity className="h-4 w-4 text-blue-600" /> :
                           update.type === 'assignment' ? <UserCheck className="h-4 w-4 text-green-600" /> :
                           update.type === 'escalation' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                           <MessageSquare className="h-4 w-4 text-gray-600" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{update.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(update.timestamp).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-gray-700">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  معلومات التعيين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">مُعين إلى</Label>
                  <p className="mt-1 font-medium">{incident.assignedTo || 'غير محدد'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">وقت الاستجابة المتوقع</Label>
                  <p className="mt-1">{incident.estimatedResponse || 'غير محدد'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  جهات الاتصال الطارئة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <p className="font-medium">الهلال الأحمر</p>
                    <p className="text-sm text-gray-600">997</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div>
                    <p className="font-medium">الأمن المدرسي</p>
                    <p className="text-sm text-gray-600">+966501111111</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <p className="font-medium">إدارة المدرسة</p>
                    <p className="text-sm text-gray-600">+966502222222</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-600" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 ml-2" />
                  التقاط صور
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 ml-2" />
                  إنشاء تقرير
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 ml-2" />
                  طلب إسعاف
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}