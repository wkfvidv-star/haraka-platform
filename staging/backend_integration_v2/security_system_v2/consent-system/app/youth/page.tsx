'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Video, 
  TrendingUp, 
  Calendar, 
  Award, 
  Upload, 
  Settings,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import Link from 'next/link'

interface YouthProfile {
  id: string
  name: string
  email: string
  age: number
  date_of_birth: string
  region: string
  preferred_sports: string[]
  privacy_level: 'public' | 'friends' | 'private'
  data_sharing_consent: boolean
  research_participation: boolean
  guardian_contact?: string
  profile_visibility: boolean
  activity_tracking: boolean
  performance_sharing: boolean
  created_at: string
  last_active: string
}

interface SessionStats {
  total_sessions: number
  this_month: number
  average_score: number
  improvement_rate: number
  best_sport: string
  recent_activities: {
    id: string
    sport_type: string
    score: number
    date: string
    status: 'completed' | 'processing' | 'failed'
  }[]
}

interface PrivacySettings {
  profile_visibility: boolean
  activity_tracking: boolean
  performance_sharing: boolean
  data_retention_period: number
  consent_status: 'active' | 'withdrawn' | 'pending'
}

export default function YouthDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<YouthProfile | null>(null)
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadYouthData()
    }
  }, [user])

  const loadYouthData = async () => {
    try {
      setLoading(true)
      
      // Load profile data
      const profileResponse = await fetch('/api/youth/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData.data)
      }

      // Load session statistics
      const statsResponse = await fetch('/api/youth/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // Load privacy settings
      const privacyResponse = await fetch('/api/youth/privacy')
      if (privacyResponse.ok) {
        const privacyData = await privacyResponse.json()
        setPrivacy(privacyData.data)
      }

    } catch (error) {
      setError('فشل في تحميل البيانات')
      console.error('Error loading youth data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAgeCategory = (age: number): string => {
    if (age >= 16 && age <= 18) return 'شاب'
    if (age >= 19 && age <= 25) return 'شاب بالغ'
    return 'مستخدم'
  }

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'public': return <Unlock className="h-4 w-4 text-green-600" />
      case 'friends': return <Eye className="h-4 w-4 text-blue-600" />
      case 'private': return <Lock className="h-4 w-4 text-red-600" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getPrivacyLabel = (level: string) => {
    switch (level) {
      case 'public': return 'عام'
      case 'friends': return 'الأصدقاء فقط'
      case 'private': return 'خاص'
      default: return 'غير محدد'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AuthGuard requiredRoles={['youth']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={['youth']}>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  مرحباً، {profile?.name || user?.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {profile && `${getAgeCategory(profile.age)} • ${profile.region}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  {privacy && getPrivacyIcon(profile?.privacy_level || 'private')}
                  {privacy && getPrivacyLabel(profile?.privacy_level || 'private')}
                </Badge>
                <Link href="/youth/privacy">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    إعدادات الخصوصية
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Privacy Alert */}
          {privacy?.consent_status === 'withdrawn' && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                تم سحب الموافقة على معالجة البيانات. بعض الميزات قد تكون محدودة.
                <Link href="/youth/privacy" className="underline mr-2">
                  مراجعة الإعدادات
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    الملف الشخصي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="font-medium">{profile?.name}</h3>
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">العمر:</span>
                      <span>{profile?.age} سنة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المنطقة:</span>
                      <span>{profile?.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ التسجيل:</span>
                      <span>{profile?.created_at && formatDate(profile.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر نشاط:</span>
                      <span>{profile?.last_active && formatDate(profile.last_active)}</span>
                    </div>
                  </div>

                  {profile?.preferred_sports && profile.preferred_sports.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">الرياضات المفضلة:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.preferred_sports.map((sport, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href="/youth/profile">
                    <Button className="w-full" variant="outline">
                      تحديث الملف الشخصي
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Privacy Status Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    حالة الخصوصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ظهور الملف الشخصي</span>
                    {privacy?.profile_visibility ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تتبع النشاط</span>
                    {privacy?.activity_tracking ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">مشاركة الأداء</span>
                    {privacy?.performance_sharing ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">حالة الموافقة</span>
                      <Badge 
                        variant={privacy?.consent_status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {privacy?.consent_status === 'active' ? 'نشطة' : 
                         privacy?.consent_status === 'withdrawn' ? 'مسحوبة' : 'معلقة'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats?.total_sessions || 0}</p>
                        <p className="text-xs text-gray-600">إجمالي الجلسات</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats?.this_month || 0}</p>
                        <p className="text-xs text-gray-600">هذا الشهر</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats?.average_score || 0}%</p>
                        <p className="text-xs text-gray-600">متوسط الدرجة</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">+{stats?.improvement_rate || 0}%</p>
                        <p className="text-xs text-gray-600">معدل التحسن</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>الإجراءات السريعة</CardTitle>
                  <CardDescription>
                    ابدأ جلسة تدريب جديدة أو راجع نتائجك السابقة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/youth/upload">
                      <Button className="w-full h-20 flex flex-col gap-2">
                        <Upload className="h-6 w-6" />
                        <span>رفع فيديو جديد</span>
                      </Button>
                    </Link>
                    <Link href="/youth/sessions">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <Video className="h-6 w-6" />
                        <span>عرض الجلسات</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              {stats?.recent_activities && stats.recent_activities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>النشاطات الأخيرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.recent_activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Video className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.sport_type}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.status === 'completed' && (
                              <>
                                <span className="text-lg font-bold text-green-600">
                                  {activity.score}%
                                </span>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </>
                            )}
                            {activity.status === 'processing' && (
                              <>
                                <span className="text-sm text-blue-600">جاري المعالجة</span>
                                <Clock className="h-4 w-4 text-blue-600" />
                              </>
                            )}
                            {activity.status === 'failed' && (
                              <>
                                <span className="text-sm text-red-600">فشل</span>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Best Performance */}
              {stats?.best_sport && (
                <Card>
                  <CardHeader>
                    <CardTitle>أفضل أداء</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">{stats.best_sport}</p>
                        <p className="text-sm text-gray-600">الرياضة الأكثر تميزاً</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{stats.average_score}%</p>
                        <p className="text-sm text-gray-600">متوسط الدرجة</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={stats.average_score} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}