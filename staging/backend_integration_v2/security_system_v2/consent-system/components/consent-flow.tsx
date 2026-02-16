'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Video, 
  Eye, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock,
  Users,
  Camera,
  BarChart3,
  Settings
} from 'lucide-react'

interface ConsentFlowProps {
  childId: string
  childName: string
  guardianId: string
  onConsentGranted: (consentId: string) => void
  onConsentRevoked: () => void
}

interface ConsentStatus {
  consent_id?: string
  status: 'none' | 'active' | 'revoked'
  granted_at?: string
  revoked_at?: string
  version: string
}

export function ConsentFlow({ 
  childId, 
  childName, 
  guardianId, 
  onConsentGranted, 
  onConsentRevoked 
}: ConsentFlowProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    status: 'none',
    version: 'v1.0'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [acceptedTerms, setAcceptedTerms] = useState({
    dataCollection: false,
    videoAnalysis: false,
    dataStorage: false,
    dataSharing: false
  })

  useEffect(() => {
    checkConsentStatus()
  }, [childId, guardianId])

  const checkConsentStatus = async () => {
    try {
      // في التطبيق الحقيقي، استدعاء API
      // const response = await fetch(`/api/consent/status?childId=${childId}&guardianId=${guardianId}`)
      // const data = await response.json()
      
      // محاكاة البيانات
      const mockStatus: ConsentStatus = {
        status: 'none', // أو 'active' أو 'revoked'
        version: 'v1.0'
      }
      
      setConsentStatus(mockStatus)
    } catch (error) {
      console.error('خطأ في التحقق من حالة الموافقة:', error)
    }
  }

  const grantConsent = async () => {
    setIsLoading(true)
    try {
      // في التطبيق الحقيقي، استدعاء API
      // const response = await fetch('/api/consent/grant', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     childId,
      //     guardianId,
      //     scope: 'video_upload_analysis',
      //     version: 'v1.0'
      //   })
      // })
      // const data = await response.json()

      // محاكاة النجاح
      const mockConsentId = 'consent_' + Date.now()
      
      setConsentStatus({
        consent_id: mockConsentId,
        status: 'active',
        granted_at: new Date().toISOString(),
        version: 'v1.0'
      })
      
      onConsentGranted(mockConsentId)
    } catch (error) {
      console.error('خطأ في منح الموافقة:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const revokeConsent = async () => {
    setIsLoading(true)
    try {
      // في التطبيق الحقيقي، استدعاء API
      // const response = await fetch('/api/consent/revoke', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     consentId: consentStatus.consent_id,
      //     guardianId,
      //     reason: 'parent_request'
      //   })
      // })

      setConsentStatus(prev => ({
        ...prev,
        status: 'revoked',
        revoked_at: new Date().toISOString()
      }))
      
      onConsentRevoked()
    } catch (error) {
      console.error('خطأ في سحب الموافقة:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean)
  const progressPercentage = (Object.values(acceptedTerms).filter(Boolean).length / 4) * 100

  if (consentStatus.status === 'active') {
    return (
      <Card className="security-success">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            الموافقة مُفعّلة
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            تم منح الموافقة لرفع وتحليل فيديوهات {childName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">تاريخ الموافقة:</span>
              <div className="font-medium">
                {consentStatus.granted_at ? 
                  new Date(consentStatus.granted_at).toLocaleDateString('ar-SA') : 
                  'غير محدد'
                }
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">الإصدار:</span>
              <div className="font-medium">{consentStatus.version}</div>
            </div>
          </div>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>الحماية مُفعّلة</AlertTitle>
            <AlertDescription>
              جميع العمليات محمية بسياسات الأمان ومُسجّلة في نظام المراجعة
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
              size="sm"
            >
              <Eye className="h-4 w-4 ml-2" />
              مراجعة الشروط
            </Button>
            <Button 
              variant="destructive" 
              onClick={revokeConsent}
              disabled={isLoading}
              size="sm"
            >
              سحب الموافقة
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (consentStatus.status === 'revoked') {
    return (
      <Card className="security-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            الموافقة مسحوبة
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            تم سحب الموافقة. لا يمكن رفع أو تحليل فيديوهات {childName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            تاريخ السحب: {consentStatus.revoked_at ? 
              new Date(consentStatus.revoked_at).toLocaleDateString('ar-SA') : 
              'غير محدد'
            }
          </div>
          <Button 
            onClick={() => setCurrentStep(1)}
            className="w-full"
          >
            منح موافقة جديدة
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          موافقة ولي الأمر - {childName}
        </CardTitle>
        <CardDescription>
          مطلوب موافقة ولي الأمر قبل رفع وتحليل الفيديوهات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>التقدم</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step 1: Terms and Conditions */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الشروط والأحكام
            </h3>
            
            <Alert>
              <Video className="h-4 w-4" />
              <AlertTitle>ما الذي سيحدث للفيديوهات؟</AlertTitle>
              <AlertDescription>
                سيتم استخدام الفيديوهات لتحليل الأداء الرياضي وتقديم تقارير تطوير مهارات طفلك
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="dataCollection"
                  checked={acceptedTerms.dataCollection}
                  onCheckedChange={(checked) => 
                    setAcceptedTerms(prev => ({ ...prev, dataCollection: !!checked }))
                  }
                />
                <div className="space-y-1">
                  <label htmlFor="dataCollection" className="text-sm font-medium cursor-pointer">
                    جمع البيانات المرئية
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أوافق على جمع الفيديوهات والصور لأغراض تحليل الأداء الرياضي
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="videoAnalysis"
                  checked={acceptedTerms.videoAnalysis}
                  onCheckedChange={(checked) => 
                    setAcceptedTerms(prev => ({ ...prev, videoAnalysis: !!checked }))
                  }
                />
                <div className="space-y-1">
                  <label htmlFor="videoAnalysis" className="text-sm font-medium cursor-pointer">
                    تحليل الفيديوهات بالذكاء الاصطناعي
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أوافق على استخدام تقنيات الذكاء الاصطناعي لتحليل حركات طفلي
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="dataStorage"
                  checked={acceptedTerms.dataStorage}
                  onCheckedChange={(checked) => 
                    setAcceptedTerms(prev => ({ ...prev, dataStorage: !!checked }))
                  }
                />
                <div className="space-y-1">
                  <label htmlFor="dataStorage" className="text-sm font-medium cursor-pointer">
                    تخزين البيانات الآمن
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أوافق على تخزين البيانات بشكل آمن ومشفر لمدة سنة واحدة
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="dataSharing"
                  checked={acceptedTerms.dataSharing}
                  onCheckedChange={(checked) => 
                    setAcceptedTerms(prev => ({ ...prev, dataSharing: !!checked }))
                  }
                />
                <div className="space-y-1">
                  <label htmlFor="dataSharing" className="text-sm font-medium cursor-pointer">
                    مشاركة التقارير مع المعلمين
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أوافق على مشاركة تقارير الأداء مع معلمي التربية البدنية
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!allTermsAccepted}
                className="flex-1"
              >
                التالي: مراجعة الموافقة
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Final Consent */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              تأكيد الموافقة
            </h3>

            <Alert className="security-success">
              <Shield className="h-4 w-4" />
              <AlertTitle>الحماية والأمان</AlertTitle>
              <AlertDescription>
                جميع البيانات محمية بأحدث تقنيات التشفير وسياسات الأمان المتقدمة
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">ملخص الموافقة:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• رفع وتحليل فيديوهات {childName}</li>
                <li>• استخدام الذكاء الاصطناعي للتحليل</li>
                <li>• تخزين آمن ومشفر للبيانات</li>
                <li>• مشاركة التقارير مع المعلمين</li>
                <li>• إمكانية سحب الموافقة في أي وقت</li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="space-y-1">
                <Camera className="h-6 w-6 mx-auto text-blue-500" />
                <div className="font-medium">رفع آمن</div>
                <div className="text-muted-foreground">تشفير شامل</div>
              </div>
              <div className="space-y-1">
                <BarChart3 className="h-6 w-6 mx-auto text-green-500" />
                <div className="font-medium">تحليل دقيق</div>
                <div className="text-muted-foreground">ذكاء اصطناعي</div>
              </div>
              <div className="space-y-1">
                <Lock className="h-6 w-6 mx-auto text-purple-500" />
                <div className="font-medium">حماية كاملة</div>
                <div className="text-muted-foreground">خصوصية مضمونة</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                السابق
              </Button>
              <Button 
                onClick={grantConsent}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'جاري المعالجة...' : 'منح الموافقة'}
              </Button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>معلومة مهمة</AlertTitle>
          <AlertDescription>
            يمكنك سحب هذه الموافقة في أي وقت من خلال لوحة التحكم. 
            جميع العمليات مُسجّلة في نظام المراجعة للشفافية الكاملة.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}