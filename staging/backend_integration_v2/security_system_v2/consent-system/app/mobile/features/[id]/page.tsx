'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Smartphone,
  Download,
  Star,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Settings
} from 'lucide-react'

interface MobileFeature {
  id: string
  name: string
  description: string
  status: 'available' | 'coming_soon' | 'beta' | 'disabled'
  category: string
  version: string
  lastUpdated: string
  downloads: number
  rating: number
  screenshots: string[]
  requirements: string[]
  changelog: string[]
}

export default function MobileFeatureDetailPage() {
  const params = useParams()
  const featureId = params.id as string
  
  const [feature, setFeature] = useState<MobileFeature | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeatureDetails()
  }, [featureId])

  const fetchFeatureDetails = async () => {
    try {
      // Mock feature data based on ID
      const mockFeatures: Record<string, Partial<MobileFeature>> = {
        'video-analysis': {
          name: 'تحليل الفيديو المتقدم',
          description: 'تحليل فوري للحركات الرياضية باستخدام الذكاء الاصطناعي مع تقييم الأداء والتوصيات',
          status: 'available',
          category: 'تحليل'
        },
        'offline-mode': {
          name: 'الوضع غير المتصل',
          description: 'إمكانية تسجيل وحفظ الفيديوهات محلياً ومزامنتها عند الاتصال بالإنترنت',
          status: 'beta',
          category: 'أساسي'
        },
        'ar-coaching': {
          name: 'التدريب بالواقع المعزز',
          description: 'تجربة تدريب تفاعلية باستخدام تقنية الواقع المعزز لتحسين الأداء',
          status: 'coming_soon',
          category: 'متقدم'
        }
      }

      const mockFeature: MobileFeature = {
        id: featureId,
        name: mockFeatures[featureId]?.name || 'ميزة غير معروفة',
        description: mockFeatures[featureId]?.description || 'وصف غير متوفر',
        status: mockFeatures[featureId]?.status || 'available',
        category: mockFeatures[featureId]?.category || 'عام',
        version: '2.1.0',
        lastUpdated: '2025-01-08T10:30:00Z',
        downloads: 15420,
        rating: 4.7,
        screenshots: [
          '/screenshots/feature-1.jpg',
          '/screenshots/feature-2.jpg',
          '/screenshots/feature-3.jpg'
        ],
        requirements: [
          'Android 8.0+ أو iOS 13.0+',
          'ذاكرة وصول عشوائي 4 جيجابايت على الأقل',
          'مساحة تخزين 2 جيجابايت',
          'كاميرا بدقة 8 ميجابكسل على الأقل',
          'اتصال إنترنت للمزامنة'
        ],
        changelog: [
          'تحسين دقة تحليل الحركة بنسبة 15%',
          'إضافة دعم للغة العربية في التقارير',
          'تحسين استهلاك البطارية',
          'إصلاح مشاكل المزامنة مع الخادم',
          'واجهة مستخدم محدثة ومحسنة'
        ]
      }

      setFeature(mockFeature)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching feature details:', error)
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'beta': return 'bg-blue-100 text-blue-800'
      case 'coming_soon': return 'bg-yellow-100 text-yellow-800'
      case 'disabled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'متوفر'
      case 'beta': return 'تجريبي'
      case 'coming_soon': return 'قريباً'
      case 'disabled': return 'معطل'
      default: return 'غير محدد'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle
      case 'beta': return Settings
      case 'coming_soon': return Clock
      case 'disabled': return AlertTriangle
      default: return AlertTriangle
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الميزة...</p>
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">الميزة غير موجودة</h2>
            <p className="text-gray-600 mb-4">لم يتم العثور على الميزة المطلوبة</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(feature.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة للميزات
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
                <Smartphone className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{feature.name}</h1>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    آخر تحديث: {new Date(feature.lastUpdated).toLocaleDateString('ar-SA')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {feature.downloads.toLocaleString()} تحميل
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {feature.rating} نجمة
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(feature.status)}>
                <StatusIcon className="h-3 w-3 ml-1" />
                {getStatusText(feature.status)}
              </Badge>
              <Badge variant="outline">
                الإصدار {feature.version}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {feature.status === 'beta' && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Settings className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              هذه الميزة في المرحلة التجريبية. قد تواجه بعض المشاكل أو التغييرات في المستقبل.
            </AlertDescription>
          </Alert>
        )}

        {feature.status === 'coming_soon' && (
          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              هذه الميزة قيد التطوير وستكون متوفرة قريباً. ترقب التحديثات القادمة!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="screenshots">لقطات الشاشة</TabsTrigger>
                <TabsTrigger value="requirements">المتطلبات</TabsTrigger>
                <TabsTrigger value="changelog">سجل التغييرات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>وصف مفصل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">الفئة</h3>
                        <p className="text-blue-600">{feature.category}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">التقييم</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(feature.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-green-600 mr-2">{feature.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>لقطات الشاشة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {feature.screenshots.map((screenshot, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-8 w-8 text-gray-400" />
                          <span className="text-gray-500 mr-2">لقطة شاشة {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>متطلبات النظام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="changelog" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل التغييرات - الإصدار {feature.version}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.changelog.map((change, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {feature.status === 'available' && (
                  <>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 ml-2" />
                      تحميل الآن
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Play className="h-4 w-4 ml-2" />
                      معاينة مباشرة
                    </Button>
                  </>
                )}
                {feature.status === 'beta' && (
                  <>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 ml-2" />
                      تحميل النسخة التجريبية
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 ml-2" />
                      انضم للاختبار
                    </Button>
                  </>
                )}
                {feature.status === 'coming_soon' && (
                  <Button variant="outline" className="w-full" disabled>
                    <Clock className="h-4 w-4 ml-2" />
                    قريباً
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">التحميلات</span>
                  <span className="font-semibold">{feature.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">التقييم</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{feature.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الإصدار</span>
                  <span className="font-semibold">{feature.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الفئة</span>
                  <span className="font-semibold">{feature.category}</span>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardHeader>
                <CardTitle>الدعم والمساعدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 ml-2" />
                  تواصل مع الدعم
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 ml-2" />
                  الإبلاغ عن مشكلة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}