'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Users, 
  Star,
  Zap,
  Shield,
  Globe,
  Play,
  Camera,
  Bell,
  Settings,
  LogOut,
  ArrowRight,
  CheckCircle,
  Clock,
  Wifi,
  Battery,
  Signal
} from 'lucide-react'

interface MobileStats {
  totalDownloads: number
  activeUsers: number
  averageRating: number
  totalSessions: number
  offlineCapable: boolean
  lastUpdate: string
}

interface AppFeature {
  id: string
  name: string
  description: string
  icon: string
  status: 'available' | 'coming_soon' | 'beta'
  category: 'core' | 'analysis' | 'social' | 'utility'
}

interface DeviceCompatibility {
  platform: 'ios' | 'android' | 'web'
  minVersion: string
  supported: boolean
  downloadUrl: string
  size: string
}

export default function MobileDashboard() {
  const [stats, setStats] = useState<MobileStats>({
    totalDownloads: 45230,
    activeUsers: 28450,
    averageRating: 4.7,
    totalSessions: 156890,
    offlineCapable: true,
    lastUpdate: '2025-01-05T10:00:00Z'
  })

  const [features, setFeatures] = useState<AppFeature[]>([
    {
      id: 'video-upload',
      name: 'رفع الفيديو',
      description: 'رفع وتحليل مقاطع الفيديو الرياضية مباشرة من الهاتف',
      icon: 'Camera',
      status: 'available',
      category: 'core'
    },
    {
      id: 'real-time-analysis',
      name: 'التحليل الفوري',
      description: 'تحليل الحركات الرياضية في الوقت الفعلي باستخدام الذكاء الاصطناعي',
      icon: 'Zap',
      status: 'available',
      category: 'analysis'
    },
    {
      id: 'offline-mode',
      name: 'الوضع غير المتصل',
      description: 'استخدام التطبيق وحفظ البيانات حتى بدون اتصال إنترنت',
      icon: 'Wifi',
      status: 'available',
      category: 'utility'
    },
    {
      id: 'social-sharing',
      name: 'المشاركة الاجتماعية',
      description: 'مشاركة الإنجازات والتقدم مع الأصدقاء والمدربين',
      icon: 'Users',
      status: 'available',
      category: 'social'
    },
    {
      id: 'push-notifications',
      name: 'الإشعارات الذكية',
      description: 'تلقي إشعارات مخصصة حول التمارين والمسابقات',
      icon: 'Bell',
      status: 'available',
      category: 'utility'
    },
    {
      id: 'ar-coaching',
      name: 'التدريب بالواقع المعزز',
      description: 'تدريب تفاعلي باستخدام تقنية الواقع المعزز',
      icon: 'Play',
      status: 'coming_soon',
      category: 'analysis'
    }
  ])

  const [compatibility, setCompatibility] = useState<DeviceCompatibility[]>([
    {
      platform: 'ios',
      minVersion: 'iOS 14.0+',
      supported: true,
      downloadUrl: 'https://apps.apple.com/haraka-sports',
      size: '45.2 MB'
    },
    {
      platform: 'android',
      minVersion: 'Android 8.0+',
      supported: true,
      downloadUrl: 'https://play.google.com/store/apps/haraka-sports',
      size: '38.7 MB'
    },
    {
      platform: 'web',
      minVersion: 'PWA Compatible',
      supported: true,
      downloadUrl: 'https://mobile.haraka.sa',
      size: '12.1 MB'
    }
  ])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const getFeatureIcon = (iconName: string) => {
    const icons = {
      Camera: Camera,
      Zap: Zap,
      Wifi: Wifi,
      Users: Users,
      Bell: Bell,
      Play: Play
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Camera
    return <IconComponent className="h-6 w-6" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'coming_soon': return 'bg-blue-100 text-blue-800'
      case 'beta': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'متاح'
      case 'coming_soon': return 'قريباً'
      case 'beta': return 'تجريبي'
      default: return 'غير محدد'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800'
      case 'analysis': return 'bg-purple-100 text-purple-800'
      case 'social': return 'bg-green-100 text-green-800'
      case 'utility': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'core': return 'أساسي'
      case 'analysis': return 'تحليل'
      case 'social': return 'اجتماعي'
      case 'utility': return 'أدوات'
      default: return 'عام'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎'
      case 'android': return '🤖'
      case 'web': return '🌐'
      default: return '📱'
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'ios': return 'iOS'
      case 'android': return 'Android'
      case 'web': return 'تطبيق الويب'
      default: return 'غير محدد'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة تطبيق الموبايل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 text-white p-2 rounded-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">تطبيق حركة للموبايل</h1>
                <p className="text-sm text-gray-500">إدارة التطبيق والميزات المحمولة</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <QrCode className="h-4 w-4 ml-2" />
                رمز QR للتحميل
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                تصدير الإحصائيات
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                إعدادات التطبيق
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
            مرحباً بك في إدارة تطبيق الموبايل
          </h2>
          <p className="text-gray-600">
            إدارة وتطوير تطبيق حركة للأجهزة المحمولة
          </p>
        </div>

        {/* App Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التحميلات</CardTitle>
              <Download className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                إجمالي التحميلات
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                مستخدم نشط
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقييم</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                من 5 نجوم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الجلسات</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                جلسة استخدام
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر تحديث</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatDate(stats.lastUpdate)}</div>
              <p className="text-xs text-muted-foreground">
                الإصدار الأخير
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Offline Capability Alert */}
        {stats.offlineCapable && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">الوضع غير المتصل متاح</AlertTitle>
            <AlertDescription className="text-green-700">
              التطبيق يدعم العمل بدون اتصال إنترنت مع مزامنة البيانات عند العودة للاتصال
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">ميزات التطبيق</TabsTrigger>
            <TabsTrigger value="download">التحميل والتوافق</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  ميزات التطبيق
                </CardTitle>
                <CardDescription>
                  جميع الميزات والوظائف المتاحة في تطبيق الموبايل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature) => (
                    <div key={feature.id} className="p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                            {getFeatureIcon(feature.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(feature.status)}>
                            {getStatusText(feature.status)}
                          </Badge>
                          <Badge className={getCategoryColor(feature.category)}>
                            {getCategoryText(feature.category)}
                          </Badge>
                        </div>
                        
                        {feature.status === 'available' && (
                          <Button size="sm" variant="outline">
                            <ArrowRight className="h-4 w-4 ml-1" />
                            التفاصيل
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Download & Compatibility Tab */}
          <TabsContent value="download" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  التحميل والتوافق
                </CardTitle>
                <CardDescription>
                  روابط التحميل ومتطلبات النظام لجميع المنصات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {compatibility.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getPlatformIcon(platform.platform)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getPlatformName(platform.platform)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            الحد الأدنى: {platform.minVersion}
                          </p>
                          <p className="text-sm text-gray-500">
                            حجم التطبيق: {platform.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {platform.supported ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            مدعوم
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            غير مدعوم
                          </Badge>
                        )}

                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={!platform.supported}
                        >
                          <Download className="h-4 w-4 ml-2" />
                          تحميل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* QR Code Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        تحميل سريع برمز QR
                      </h3>
                      <p className="text-gray-600">
                        امسح الرمز بكاميرا هاتفك للانتقال مباشرة لصفحة التحميل
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <QrCode className="h-20 w-20 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  تحليلات التطبيق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">استخدام الميزات</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">رفع الفيديو</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">التحليل الفوري</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">المشاركة الاجتماعية</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">إحصائيات الأداء</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">متوسط وقت الجلسة</span>
                        <span className="font-medium">12 دقيقة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">معدل الاحتفاظ</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تقييم المتجر</span>
                        <span className="font-medium">4.7/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">معدل التحديث</span>
                        <span className="font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  إعدادات التطبيق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Bell className="h-6 w-6 mb-2" />
                    إعدادات الإشعارات
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="h-6 w-6 mb-2" />
                    الأمان والخصوصية
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Globe className="h-6 w-6 mb-2" />
                    اللغة والمنطقة
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Zap className="h-6 w-6 mb-2" />
                    الأداء والتحسين
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    إدارة التحديثات
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    دعم المستخدمين
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}