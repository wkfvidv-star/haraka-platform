'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Bell,
  Settings,
  Activity,
  AlertCircle,
  Radio,
  Truck,
  Building2,
  UserCheck,
  Heart,
  Shield,
  Zap,
  LogOut
} from 'lucide-react'

interface EmergencyIncident {
  id: string
  type: 'injury' | 'medical' | 'security' | 'facility' | 'weather'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'responding' | 'resolved' | 'escalated'
  title: string
  description: string
  location: string
  reportedBy: string
  reportedAt: string
  assignedTo?: string
  estimatedResponse: string
  peopleInvolved: number
}

interface EmergencyStats {
  total: number
  active: number
  resolved: number
  critical: number
  averageResponse: string
}

export default function EmergencyPage() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([])
  const [stats, setStats] = useState<EmergencyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchEmergencyData()
  }, [])

  const fetchEmergencyData = async () => {
    try {
      // Mock emergency incidents data
      const mockIncidents: EmergencyIncident[] = [
        {
          id: 'incident-001',
          type: 'injury',
          severity: 'high',
          status: 'responding',
          title: 'إصابة في ملعب كرة القدم',
          description: 'طالب تعرض لإصابة في الكاحل أثناء المباراة',
          location: 'ملعب كرة القدم الرئيسي',
          reportedBy: 'أ. محمد الرياضي',
          reportedAt: '2025-01-08T14:30:00Z',
          assignedTo: 'فريق الإسعاف المدرسي',
          estimatedResponse: '5 دقائق',
          peopleInvolved: 1
        },
        {
          id: 'incident-002',
          type: 'medical',
          severity: 'critical',
          status: 'escalated',
          title: 'حالة إغماء في صالة الجمباز',
          description: 'طالبة فقدت الوعي أثناء التمرين',
          location: 'صالة الجمباز - الطابق الثاني',
          reportedBy: 'أ. فاطمة المدربة',
          reportedAt: '2025-01-08T13:45:00Z',
          assignedTo: 'الهلال الأحمر',
          estimatedResponse: '8 دقائق',
          peopleInvolved: 1
        },
        {
          id: 'incident-003',
          type: 'security',
          severity: 'medium',
          status: 'resolved',
          title: 'دخول غير مصرح في المبنى',
          description: 'شخص غريب تم رصده في ممرات المدرسة',
          location: 'المبنى الإداري - الطابق الأول',
          reportedBy: 'حارس الأمن',
          reportedAt: '2025-01-08T12:15:00Z',
          assignedTo: 'فريق الأمن',
          estimatedResponse: '2 دقيقة',
          peopleInvolved: 1
        },
        {
          id: 'incident-004',
          type: 'facility',
          severity: 'low',
          status: 'reported',
          title: 'تسريب مياه في المختبر',
          description: 'تسريب مياه من الأنابيب في مختبر الكيمياء',
          location: 'مختبر الكيمياء - الطابق الثالث',
          reportedBy: 'د. عبدالله الكيميائي',
          reportedAt: '2025-01-08T11:30:00Z',
          estimatedResponse: '15 دقيقة',
          peopleInvolved: 0
        }
      ]

      const mockStats: EmergencyStats = {
        total: mockIncidents.length,
        active: mockIncidents.filter(i => i.status !== 'resolved').length,
        resolved: mockIncidents.filter(i => i.status === 'resolved').length,
        critical: mockIncidents.filter(i => i.severity === 'critical').length,
        averageResponse: '6 دقائق'
      }

      setIncidents(mockIncidents)
      setStats(mockStats)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching emergency data:', error)
      setIsLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'injury': return 'bg-red-100 text-red-800'
      case 'medical': return 'bg-pink-100 text-pink-800'
      case 'security': return 'bg-orange-100 text-orange-800'
      case 'facility': return 'bg-blue-100 text-blue-800'
      case 'weather': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'injury': return 'إصابة'
      case 'medical': return 'طبية'
      case 'security': return 'أمنية'
      case 'facility': return 'مرافق'
      case 'weather': return 'طقس'
      default: return 'غير محدد'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      case 'critical': return 'حرج'
      default: return 'غير محدد'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800'
      case 'responding': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'escalated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'مُبلغ عنه'
      case 'responding': return 'قيد الاستجابة'
      case 'resolved': return 'محلول'
      case 'escalated': return 'مُصعد'
      default: return 'غير محدد'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'injury': return Heart
      case 'medical': return Activity
      case 'security': return Shield
      case 'facility': return Building2
      case 'weather': return AlertTriangle
      default: return AlertTriangle
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || incident.type === filterType
    const matchesStatus = !filterStatus || incident.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الطوارئ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة الطوارئ</h1>
              <p className="text-gray-600">مراقبة والاستجابة للحوادث والطوارئ المدرسية</p>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 ml-1" />
                إبلاغ عن حادث
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 ml-1" />
                التنبيهات
              </Button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {incidents.some(i => i.severity === 'critical' && i.status !== 'resolved') && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">تنبيه طوارئ حرج!</AlertTitle>
            <AlertDescription className="text-red-700">
              يوجد {incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length} حادث حرج يتطلب تدخل فوري.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">إجمالي الحوادث</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-gray-600">حوادث نشطة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.resolved}</div>
                <div className="text-sm text-gray-600">حوادث محلولة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.critical}</div>
                <div className="text-sm text-gray-600">حوادث حرجة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.averageResponse}</div>
                <div className="text-sm text-gray-600">متوسط الاستجابة</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incidents">الحوادث</TabsTrigger>
            <TabsTrigger value="teams">فرق الاستجابة</TabsTrigger>
            <TabsTrigger value="contacts">جهات الاتصال</TabsTrigger>
          </TabsList>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  البحث والتصفية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في الحوادث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="injury">إصابة</option>
                    <option value="medical">طبية</option>
                    <option value="security">أمنية</option>
                    <option value="facility">مرافق</option>
                    <option value="weather">طقس</option>
                  </select>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">جميع الحالات</option>
                    <option value="reported">مُبلغ عنه</option>
                    <option value="responding">قيد الاستجابة</option>
                    <option value="resolved">محلول</option>
                    <option value="escalated">مُصعد</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Incidents List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  قائمة الحوادث ({filteredIncidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredIncidents.map((incident) => {
                    const TypeIcon = getTypeIcon(incident.type)
                    return (
                      <div key={incident.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${
                              incident.severity === 'critical' ? 'bg-red-100 text-red-600' :
                              incident.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                              incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{incident.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {incident.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDateTime(incident.reportedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <UserCheck className="h-3 w-3" />
                                  {incident.reportedBy}
                                </span>
                                {incident.peopleInvolved > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {incident.peopleInvolved} شخص
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(incident.type)}>
                              {getTypeText(incident.type)}
                            </Badge>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {getSeverityText(incident.severity)}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {getStatusText(incident.status)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            {incident.assignedTo && (
                              <span className="text-green-600">
                                مُكلف إلى: {incident.assignedTo}
                              </span>
                            )}
                            <span className="text-blue-600">
                              وقت الاستجابة المتوقع: {incident.estimatedResponse}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.location.href = `/emergency/incidents/${incident.id}`}
                            >
                              <Eye className="h-4 w-4 ml-1" />
                              عرض التفاصيل
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 ml-1" />
                              تحديث
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Response Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  فرق الاستجابة للطوارئ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">فريق الإسعاف المدرسي</h3>
                        <p className="text-sm text-gray-600">متاح</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 ml-1" />
                        اتصال
                      </Button>
                      <Button size="sm" variant="outline">
                        <Radio className="h-4 w-4 ml-1" />
                        راديو
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded-full">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">الهلال الأحمر</h3>
                        <p className="text-sm text-gray-600">في مهمة</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                        <Phone className="h-4 w-4 ml-1" />
                        اتصال
                      </Button>
                      <Button size="sm" variant="outline">
                        <Radio className="h-4 w-4 ml-1" />
                        راديو
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">فريق الأمن</h3>
                        <p className="text-sm text-gray-600">متاح</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Phone className="h-4 w-4 ml-1" />
                        اتصال
                      </Button>
                      <Button size="sm" variant="outline">
                        <Radio className="h-4 w-4 ml-1" />
                        راديو
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  أرقام الطوارئ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-800">الهلال الأحمر</h3>
                        <p className="text-2xl font-bold text-red-600">997</p>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-800">الشرطة</h3>
                        <p className="text-2xl font-bold text-blue-600">999</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-orange-800">الدفاع المدني</h3>
                        <p className="text-2xl font-bold text-orange-600">998</p>
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-800">إدارة المدرسة</h3>
                        <p className="text-xl font-bold text-green-600">+966501111111</p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
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