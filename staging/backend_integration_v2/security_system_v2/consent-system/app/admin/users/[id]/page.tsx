'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  ArrowLeft,
  User,
  Shield,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react'

interface UserDetail {
  id: string
  name: string
  email: string
  phone?: string
  role: 'student' | 'teacher' | 'guardian' | 'coach' | 'ministry' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
  schoolName?: string
  region?: string
  profileImage?: string
}

interface UserActivity {
  id: string
  action: string
  resource: string
  timestamp: string
  ipAddress: string
  status: 'success' | 'failed'
  details: string
}

interface UserPermission {
  id: string
  resource: string
  permissions: string[]
  granted: boolean
  grantedBy: string
  grantedAt: string
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserDetail | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [permissions, setPermissions] = useState<UserPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserDetail>>({})

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockUser: UserDetail = {
      id: userId,
      name: 'أحمد محمد الطالب',
      email: 'ahmed.student@example.com',
      phone: '+966501234567',
      role: 'student',
      status: 'active',
      lastLogin: '2025-01-08T10:30:00Z',
      createdAt: '2024-09-01T08:00:00Z',
      schoolName: 'مدرسة الملك فهد الثانوية',
      region: 'الرياض'
    }

    const mockActivities: UserActivity[] = [
      {
        id: 'activity-001',
        action: 'LOGIN',
        resource: 'student_dashboard',
        timestamp: '2025-01-08T10:30:00Z',
        ipAddress: '192.168.1.100',
        status: 'success',
        details: 'تسجيل دخول ناجح'
      },
      {
        id: 'activity-002',
        action: 'VIDEO_UPLOAD',
        resource: 'exercise_session',
        timestamp: '2025-01-08T09:15:00Z',
        ipAddress: '192.168.1.100',
        status: 'success',
        details: 'رفع فيديو تمرين كرة القدم'
      },
      {
        id: 'activity-003',
        action: 'PROFILE_UPDATE',
        resource: 'user_profile',
        timestamp: '2025-01-07T14:20:00Z',
        ipAddress: '192.168.1.100',
        status: 'success',
        details: 'تحديث بيانات الملف الشخصي'
      }
    ]

    const mockPermissions: UserPermission[] = [
      {
        id: 'perm-001',
        resource: 'student_dashboard',
        permissions: ['read', 'write'],
        granted: true,
        grantedBy: 'system',
        grantedAt: '2024-09-01T08:00:00Z'
      },
      {
        id: 'perm-002',
        resource: 'exercise_sessions',
        permissions: ['create', 'read', 'update'],
        granted: true,
        grantedBy: 'admin',
        grantedAt: '2024-09-01T08:00:00Z'
      },
      {
        id: 'perm-003',
        resource: 'reports',
        permissions: ['read'],
        granted: true,
        grantedBy: 'system',
        grantedAt: '2024-09-01T08:00:00Z'
      }
    ]

    setTimeout(() => {
      setUser(mockUser)
      setActivities(mockActivities)
      setPermissions(mockPermissions)
      setEditForm(mockUser)
      setIsLoading(false)
    }, 1000)
  }, [userId])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'teacher': return 'bg-green-100 text-green-800'
      case 'guardian': return 'bg-purple-100 text-purple-800'
      case 'coach': return 'bg-orange-100 text-orange-800'
      case 'ministry': return 'bg-indigo-100 text-indigo-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'طالب'
      case 'teacher': return 'معلم'
      case 'guardian': return 'ولي أمر'
      case 'coach': return 'مدرب'
      case 'ministry': return 'وزارة'
      case 'admin': return 'مدير'
      default: return 'غير محدد'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'suspended': return 'موقوف'
      default: return 'غير محدد'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSaveEdit = () => {
    if (user && editForm) {
      setUser({ ...user, ...editForm })
      setIsEditing(false)
      // In real app, send API request to update user
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      setEditForm(user)
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">المستخدم غير موجود</h3>
            <p className="text-red-600 mb-4">لم يتم العثور على بيانات المستخدم المطلوب</p>
            <Button onClick={() => window.history.back()} variant="outline">
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة لإدارة المستخدمين
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">تفاصيل المستخدم</h1>
              <p className="text-gray-600">عرض وتعديل بيانات المستخدم</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRoleColor(user.role)}>
                {getRoleText(user.role)}
              </Badge>
              <Badge className={getStatusColor(user.status)}>
                {getStatusText(user.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                الملف الشخصي
              </CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 ml-1" />
                      حفظ
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 ml-1" />
                      إلغاء
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">الاسم</label>
                  {isEditing ? (
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">البريد الإلكتروني</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {user.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">رقم الهاتف</label>
                  {isEditing ? (
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {user.phone || 'غير محدد'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">المدرسة</label>
                  {isEditing ? (
                    <Input
                      value={editForm.schoolName || ''}
                      onChange={(e) => setEditForm({ ...editForm, schoolName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{user.schoolName || 'غير محدد'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">المنطقة</label>
                  {isEditing ? (
                    <Select
                      value={editForm.region || ''}
                      onValueChange={(value) => setEditForm({ ...editForm, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="مكة المكرمة">مكة المكرمة</SelectItem>
                        <SelectItem value="المنطقة الشرقية">المنطقة الشرقية</SelectItem>
                        <SelectItem value="المدينة المنورة">المدينة المنورة</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {user.region || 'غير محدد'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">الحالة</label>
                  {isEditing ? (
                    <Select
                      value={editForm.status || ''}
                      onValueChange={(value) => setEditForm({ ...editForm, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="suspended">موقوف</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>تاريخ الإنشاء: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>آخر دخول: {formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">سجل النشاط</TabsTrigger>
            <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  سجل النشاط
                </CardTitle>
                <CardDescription>
                  جميع أنشطة المستخدم في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {activity.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.timestamp)} • IP: {activity.ipAddress}
                          </p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                        {activity.status === 'success' ? 'نجح' : 'فشل'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  صلاحيات المستخدم
                </CardTitle>
                <CardDescription>
                  الصلاحيات الممنوحة للمستخدم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{permission.resource}</h3>
                        <p className="text-sm text-gray-600">
                          الصلاحيات: {permission.permissions.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          منح بواسطة: {permission.grantedBy} • {formatDate(permission.grantedAt)}
                        </p>
                      </div>
                      <Badge className={permission.granted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {permission.granted ? 'ممنوح' : 'مرفوض'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    إعادة تعيين كلمة المرور
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    تفعيل المصادقة الثنائية
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    مراجعة جلسات تسجيل الدخول
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
                    إيقاف الحساب مؤقتاً
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