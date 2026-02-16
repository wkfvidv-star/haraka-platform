'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Database, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Lock,
  Unlock,
  UserX,
  Archive
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import Link from 'next/link'

interface PrivacySettings {
  profile_visibility: boolean
  activity_tracking: boolean
  performance_sharing: boolean
  data_analytics: boolean
  research_participation: boolean
  marketing_communications: boolean
  data_retention_period: number
  consent_status: 'active' | 'withdrawn' | 'pending'
  consent_date?: string
  withdrawal_date?: string
  auto_archive_enabled: boolean
}

interface DataSummary {
  total_videos: number
  total_analyses: number
  data_size_mb: number
  oldest_record: string
  newest_record: string
}

export default function YouthPrivacy() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: false,
    activity_tracking: true,
    performance_sharing: false,
    data_analytics: true,
    research_participation: false,
    marketing_communications: false,
    data_retention_period: 365,
    consent_status: 'active',
    auto_archive_enabled: true
  })
  
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)

  useEffect(() => {
    loadPrivacySettings()
    loadDataSummary()
  }, [])

  const loadPrivacySettings = async () => {
    try {
      const response = await fetch('/api/youth/privacy')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings(data.data)
        }
      }
    } catch (error) {
      setError('فشل في تحميل إعدادات الخصوصية')
    } finally {
      setLoading(false)
    }
  }

  const loadDataSummary = async () => {
    try {
      const response = await fetch('/api/youth/data-summary')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDataSummary(data.data)
        }
      }
    } catch (error) {
      console.error('Error loading data summary:', error)
    }
  }

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/youth/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('تم حفظ إعدادات الخصوصية بنجاح')
      } else {
        setError(data.message || 'فشل في حفظ الإعدادات')
      }
    } catch (error) {
      setError('حدث خطأ أثناء حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const withdrawConsent = async () => {
    setWithdrawing(true)
    setError('')
    
    try {
      const response = await fetch('/api/youth/withdraw-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSettings(prev => ({
          ...prev,
          consent_status: 'withdrawn',
          withdrawal_date: new Date().toISOString()
        }))
        setSuccess('تم سحب الموافقة بنجاح. سيتم أرشفة بياناتك خلال 30 يوماً')
        setShowWithdrawConfirm(false)
      } else {
        setError(data.message || 'فشل في سحب الموافقة')
      }
    } catch (error) {
      setError('حدث خطأ أثناء سحب الموافقة')
    } finally {
      setWithdrawing(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/youth/export-data')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `youth-data-${user?.id}-${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess('تم تصدير البيانات بنجاح')
      } else {
        setError('فشل في تصدير البيانات')
      }
    } catch (error) {
      setError('حدث خطأ أثناء تصدير البيانات')
    }
  }

  const deleteAllData = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع بياناتك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }
    
    try {
      const response = await fetch('/api/youth/delete-data', {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('تم حذف جميع البيانات بنجاح')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.message || 'فشل في حذف البيانات')
      }
    } catch (error) {
      setError('حدث خطأ أثناء حذف البيانات')
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
            <p className="text-gray-600">جاري تحميل إعدادات الخصوصية...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={['youth']}>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/youth">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات الخصوصية</h1>
              <p className="text-gray-600">تحكم في خصوصيتك وإدارة بياناتك</p>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Consent Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                حالة الموافقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={settings.consent_status === 'active' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {settings.consent_status === 'active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : settings.consent_status === 'withdrawn' ? (
                        <UserX className="h-3 w-3" />
                      ) : (
                        <Archive className="h-3 w-3" />
                      )}
                      {settings.consent_status === 'active' ? 'نشطة' : 
                       settings.consent_status === 'withdrawn' ? 'مسحوبة' : 'معلقة'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {settings.consent_status === 'active' 
                      ? 'لديك موافقة نشطة على معالجة بياناتك'
                      : settings.consent_status === 'withdrawn'
                      ? 'تم سحب الموافقة. سيتم أرشفة البيانات قريباً'
                      : 'الموافقة معلقة'
                    }
                  </p>
                  {settings.consent_date && (
                    <p className="text-xs text-gray-500">
                      تاريخ الموافقة: {formatDate(settings.consent_date)}
                    </p>
                  )}
                  {settings.withdrawal_date && (
                    <p className="text-xs text-gray-500">
                      تاريخ السحب: {formatDate(settings.withdrawal_date)}
                    </p>
                  )}
                </div>
                {settings.consent_status === 'active' && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowWithdrawConfirm(true)}
                    disabled={withdrawing}
                  >
                    سحب الموافقة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Privacy Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    التحكم في الظهور
                  </CardTitle>
                  <CardDescription>
                    إدارة من يمكنه رؤية معلوماتك ونشاطك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">ظهور الملف الشخصي</p>
                      <p className="text-sm text-gray-600">السماح للآخرين برؤية ملفك الشخصي</p>
                    </div>
                    <Switch
                      checked={settings.profile_visibility}
                      onCheckedChange={(checked) => handleSettingChange('profile_visibility', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">تتبع النشاط</p>
                      <p className="text-sm text-gray-600">تسجيل وعرض نشاطك الرياضي</p>
                    </div>
                    <Switch
                      checked={settings.activity_tracking}
                      onCheckedChange={(checked) => handleSettingChange('activity_tracking', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">مشاركة الأداء</p>
                      <p className="text-sm text-gray-600">السماح بمشاركة نتائج أدائك</p>
                    </div>
                    <Switch
                      checked={settings.performance_sharing}
                      onCheckedChange={(checked) => handleSettingChange('performance_sharing', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    استخدام البيانات
                  </CardTitle>
                  <CardDescription>
                    التحكم في كيفية استخدام بياناتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">تحليل البيانات</p>
                      <p className="text-sm text-gray-600">استخدام بياناتك لتحسين الخدمة</p>
                    </div>
                    <Switch
                      checked={settings.data_analytics}
                      onCheckedChange={(checked) => handleSettingChange('data_analytics', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">المشاركة في البحث</p>
                      <p className="text-sm text-gray-600">استخدام بياناتك للأبحاث العلمية</p>
                    </div>
                    <Switch
                      checked={settings.research_participation}
                      onCheckedChange={(checked) => handleSettingChange('research_participation', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">التواصل التسويقي</p>
                      <p className="text-sm text-gray-600">تلقي رسائل تسويقية وإعلانات</p>
                    </div>
                    <Switch
                      checked={settings.marketing_communications}
                      onCheckedChange={(checked) => handleSettingChange('marketing_communications', checked)}
                      disabled={settings.consent_status !== 'active'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">الأرشفة التلقائية</p>
                      <p className="text-sm text-gray-600">أرشفة البيانات القديمة تلقائياً</p>
                    </div>
                    <Switch
                      checked={settings.auto_archive_enabled}
                      onCheckedChange={(checked) => handleSettingChange('auto_archive_enabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Management */}
            <div className="space-y-6">
              {/* Data Summary */}
              {dataSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle>ملخص البيانات</CardTitle>
                    <CardDescription>
                      نظرة عامة على بياناتك المحفوظة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الفيديوهات:</span>
                      <span className="font-medium">{dataSummary.total_videos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد التحليلات:</span>
                      <span className="font-medium">{dataSummary.total_analyses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حجم البيانات:</span>
                      <span className="font-medium">{dataSummary.data_size_mb} ميجابايت</span>
                    </div>
                    {dataSummary.oldest_record && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">أقدم سجل:</span>
                        <span className="font-medium">{formatDate(dataSummary.oldest_record)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Data Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>إدارة البيانات</CardTitle>
                  <CardDescription>
                    تصدير أو حذف بياناتك الشخصية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تصدير جميع البيانات
                  </Button>

                  <Button
                    onClick={deleteAllData}
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    حذف جميع البيانات
                  </Button>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card>
                <CardHeader>
                  <CardTitle>الاحتفاظ بالبيانات</CardTitle>
                  <CardDescription>
                    مدة الاحتفاظ بالبيانات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>مدة الاحتفاظ (بالأيام)</Label>
                    <select
                      value={settings.data_retention_period}
                      onChange={(e) => handleSettingChange('data_retention_period', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={settings.consent_status !== 'active'}
                    >
                      <option value={90}>3 أشهر</option>
                      <option value={180}>6 أشهر</option>
                      <option value={365}>سنة واحدة</option>
                      <option value={730}>سنتان</option>
                      <option value={1095}>3 سنوات</option>
                    </select>
                    <p className="text-sm text-gray-600">
                      سيتم حذف البيانات تلقائياً بعد انتهاء هذه المدة
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button
                onClick={saveSettings}
                disabled={saving || settings.consent_status !== 'active'}
                className="w-full"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ الإعدادات'
                )}
              </Button>
            </div>
          </div>

          {/* Withdraw Consent Confirmation */}
          {showWithdrawConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    سحب الموافقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    هل أنت متأكد من رغبتك في سحب الموافقة على معالجة بياناتك؟
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>تنبيه:</strong> سيؤدي هذا إلى:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                      <li>توقف جميع عمليات التحليل الجديدة</li>
                      <li>أرشفة بياناتك خلال 30 يوماً</li>
                      <li>عدم إمكانية الوصول لبعض المميزات</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={withdrawConsent}
                      disabled={withdrawing}
                      variant="destructive"
                      className="flex-1"
                    >
                      {withdrawing ? 'جاري السحب...' : 'نعم، سحب الموافقة'}
                    </Button>
                    <Button
                      onClick={() => setShowWithdrawConfirm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}