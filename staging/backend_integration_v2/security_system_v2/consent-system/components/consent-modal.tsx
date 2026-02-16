'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Shield, 
  Video, 
  Clock, 
  Eye, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  Users,
  Calendar,
  Database
} from 'lucide-react'

interface ConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onConsent: (granted: boolean) => void
  studentName: string
  guardianName: string
  isLoading?: boolean
}

export function ConsentModal({ 
  isOpen, 
  onClose, 
  onConsent, 
  studentName, 
  guardianName,
  isLoading = false 
}: ConsentModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [hasUnderstoodRights, setHasUnderstoodRights] = useState(false)
  const [showDeclineMessage, setShowDeclineMessage] = useState(false)

  const canProceed = hasReadTerms && hasUnderstoodRights

  const handleAccept = () => {
    if (canProceed) {
      onConsent(true)
    }
  }

  const handleDecline = () => {
    setShowDeclineMessage(true)
    setTimeout(() => {
      onConsent(false)
      setShowDeclineMessage(false)
    }, 3000)
  }

  if (!isOpen) return null

  if (showDeclineMessage) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto" />
            <h3 className="text-lg font-semibold text-orange-800">تم رفض الموافقة</h3>
            <p className="text-sm text-orange-700">
              لن يتمكن {studentName} من رفع الفيديوهات لتحليل الأداء الرياضي. 
              يمكنك تغيير رأيك في أي وقت من خلال إعدادات الحساب.
            </p>
            <div className="text-xs text-orange-600">
              سيتم إغلاق هذه النافذة تلقائياً...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <Video className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">موافقة ولي الأمر - منصة حركة</CardTitle>
          <CardDescription>
            مطلوب موافقة ولي الأمر قبل رفع وتحليل الفيديوهات الرياضية
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Student Info */}
          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>معلومات الطالب</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="font-medium">اسم الطالب:</span>
                  <div className="text-sm">{studentName}</div>
                </div>
                <div>
                  <span className="font-medium">ولي الأمر:</span>
                  <div className="text-sm">{guardianName}</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Purpose Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              الغرض من جمع البيانات
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-blue-800">
                <strong>الهدف الأساسي:</strong> تحليل الأداء الرياضي وتطوير مهارات طفلك في التربية البدنية
              </p>
              <ul className="text-sm text-blue-700 space-y-1 mr-4">
                <li>• تحليل الحركات الرياضية باستخدام الذكاء الاصطناعي</li>
                <li>• تقديم تقارير مفصلة عن نقاط القوة والتحسين</li>
                <li>• مساعدة المعلمين في وضع برامج تدريبية مخصصة</li>
                <li>• تتبع التقدم والتطور عبر الزمن</li>
              </ul>
            </div>
          </div>

          {/* Data Handling Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              التعامل مع البيانات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">الحماية والتشفير</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• تشفير شامل لجميع البيانات</li>
                  <li>• خوادم آمنة معتمدة</li>
                  <li>• وصول محدود للمخولين فقط</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">مدة الحفظ</span>
                </div>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• سنة واحدة كحد أقصى</li>
                  <li>• حذف تلقائي بعد انتهاء المدة</li>
                  <li>• إمكانية الحذف المبكر عند الطلب</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rights Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              حقوقك كولي أمر
            </h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <ul className="text-sm text-orange-800 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>سحب الموافقة:</strong> يمكنك سحب الموافقة في أي وقت دون إبداء أسباب</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>الوصول للبيانات:</strong> يمكنك طلب نسخة من جميع بيانات طفلك</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>حذف البيانات:</strong> يمكنك طلب حذف جميع البيانات نهائياً</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>التحكم في المشاركة:</strong> تحديد من يمكنه الوصول للتقارير</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">تأكيد الفهم والموافقة</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="terms"
                  checked={hasReadTerms}
                  onCheckedChange={(checked) => setHasReadTerms(!!checked)}
                />
                <div className="space-y-1">
                  <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                    قرأت وفهمت الغرض من جمع البيانات ومدة حفظها
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أؤكد أنني اطلعت على كيفية استخدام بيانات طفلي وفترة الاحتفاظ بها
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox 
                  id="rights"
                  checked={hasUnderstoodRights}
                  onCheckedChange={(checked) => setHasUnderstoodRights(!!checked)}
                />
                <div className="space-y-1">
                  <label htmlFor="rights" className="text-sm font-medium cursor-pointer">
                    أفهم حقوقي في سحب الموافقة وحذف البيانات
                  </label>
                  <p className="text-xs text-muted-foreground">
                    أدرك أنه يمكنني سحب هذه الموافقة أو طلب حذف البيانات في أي وقت
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={handleAccept}
              disabled={!canProceed || isLoading}
              className="flex-1"
              size="lg"
            >
              {isLoading ? 'جاري المعالجة...' : 'أوافق على رفع وتحليل الفيديوهات'}
            </Button>
            <Button 
              onClick={handleDecline}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
              size="lg"
            >
              لا أوافق
            </Button>
          </div>

          {/* Security Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">ضمان الأمان</AlertTitle>
            <AlertDescription className="text-blue-700">
              منصة حركة ملتزمة بأعلى معايير الأمان والخصوصية. جميع البيانات محمية وفقاً لأفضل الممارسات العالمية.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}