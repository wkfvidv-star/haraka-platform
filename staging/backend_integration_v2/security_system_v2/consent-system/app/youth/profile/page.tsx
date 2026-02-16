'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Save, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import Link from 'next/link'

interface YouthProfileForm {
  name: string
  email: string
  date_of_birth: string
  region: string
  preferred_sports: string[]
  bio: string
  privacy_level: 'public' | 'friends' | 'private'
  emergency_contact: string
  guardian_contact?: string
  phone_number?: string
}

const SAUDI_REGIONS = [
  'الرياض',
  'مكة المكرمة',
  'المنطقة الشرقية',
  'عسير',
  'تبوك',
  'القصيم',
  'حائل',
  'المدينة المنورة',
  'الباحة',
  'الحدود الشمالية',
  'جازان',
  'نجران',
  'الجوف'
]

const SPORTS_OPTIONS = [
  'كرة القدم',
  'السباحة',
  'الجري',
  'كرة السلة',
  'التنس',
  'الجمباز',
  'ألعاب القوى',
  'كرة الطائرة',
  'كرة اليد',
  'الكاراتيه',
  'التايكوندو',
  'رفع الأثقال'
]

export default function YouthProfile() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState<YouthProfileForm>({
    name: '',
    email: '',
    date_of_birth: '',
    region: '',
    preferred_sports: [],
    bio: '',
    privacy_level: 'private',
    emergency_contact: '',
    guardian_contact: '',
    phone_number: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/youth/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFormData({
            name: data.data.name || '',
            email: data.data.email || '',
            date_of_birth: data.data.date_of_birth || '',
            region: data.data.region || '',
            preferred_sports: data.data.preferred_sports || [],
            bio: data.data.bio || '',
            privacy_level: data.data.privacy_level || 'private',
            emergency_contact: data.data.emergency_contact || '',
            guardian_contact: data.data.guardian_contact || '',
            phone_number: data.data.phone_number || ''
          })
        }
      }
    } catch (error) {
      setError('فشل في تحميل بيانات الملف الشخصي')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof YouthProfileForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_sports: prev.preferred_sports.includes(sport)
        ? prev.preferred_sports.filter(s => s !== sport)
        : [...prev.preferred_sports, sport]
    }))
  }

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('الاسم مطلوب')
      return false
    }
    
    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب')
      return false
    }
    
    if (!formData.date_of_birth) {
      setError('تاريخ الميلاد مطلوب')
      return false
    }
    
    const age = calculateAge(formData.date_of_birth)
    if (age < 16 || age > 30) {
      setError('العمر يجب أن يكون بين 16 و 30 سنة')
      return false
    }
    
    if (!formData.region) {
      setError('المنطقة مطلوبة')
      return false
    }
    
    if (!formData.emergency_contact.trim()) {
      setError('جهة الاتصال في حالات الطوارئ مطلوبة')
      return false
    }
    
    return true
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      const response = await fetch('/api/youth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('تم حفظ الملف الشخصي بنجاح')
        setTimeout(() => {
          router.push('/youth')
        }, 2000)
      } else {
        setError(data.message || 'فشل في حفظ الملف الشخصي')
      }
    } catch (error) {
      setError('حدث خطأ أثناء حفظ البيانات')
    } finally {
      setSaving(false)
    }
  }

  const getPrivacyDescription = (level: string) => {
    switch (level) {
      case 'public':
        return 'يمكن لجميع المستخدمين رؤية ملفك الشخصي ونشاطك'
      case 'friends':
        return 'يمكن للأصدقاء فقط رؤية ملفك الشخصي ونشاطك'
      case 'private':
        return 'ملفك الشخصي مخفي عن الآخرين'
      default:
        return ''
    }
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
              <h1 className="text-2xl font-bold text-gray-900">تحديث الملف الشخصي</h1>
              <p className="text-gray-600">إدارة معلوماتك الشخصية وإعدادات الخصوصية</p>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الأساسية
                  </CardTitle>
                  <CardDescription>
                    معلوماتك الشخصية الأساسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">تاريخ الميلاد *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      />
                      {formData.date_of_birth && (
                        <p className="text-sm text-gray-600">
                          العمر: {calculateAge(formData.date_of_birth)} سنة
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">المنطقة *</Label>
                      <select
                        id="region"
                        value={formData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر المنطقة</option>
                        {SAUDI_REGIONS.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">رقم الهاتف</Label>
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        placeholder="+966XXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">جهة الاتصال للطوارئ *</Label>
                      <Input
                        id="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                        placeholder="اسم ورقم هاتف"
                      />
                    </div>
                  </div>

                  {formData.guardian_contact !== undefined && (
                    <div className="space-y-2">
                      <Label htmlFor="guardian_contact">ولي الأمر</Label>
                      <Input
                        id="guardian_contact"
                        value={formData.guardian_contact}
                        onChange={(e) => handleInputChange('guardian_contact', e.target.value)}
                        placeholder="بيانات ولي الأمر"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة شخصية</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="أخبرنا عن نفسك وأهدافك الرياضية..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sports Preferences */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>الرياضات المفضلة</CardTitle>
                  <CardDescription>
                    اختر الرياضات التي تمارسها أو تهتم بها
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SPORTS_OPTIONS.map(sport => (
                      <button
                        key={sport}
                        onClick={() => toggleSport(sport)}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          formData.preferred_sports.includes(sport)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    تم اختيار {formData.preferred_sports.length} رياضة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Settings */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    إعدادات الخصوصية
                  </CardTitle>
                  <CardDescription>
                    تحكم في من يمكنه رؤية معلوماتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>مستوى الخصوصية</Label>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleInputChange('privacy_level', 'public')}
                        className={`w-full p-3 text-right border rounded-lg transition-colors ${
                          formData.privacy_level === 'public'
                            ? 'bg-green-50 border-green-300'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="font-medium">عام</span>
                          </div>
                          {formData.privacy_level === 'public' && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          يمكن للجميع رؤية ملفك الشخصي
                        </p>
                      </button>

                      <button
                        onClick={() => handleInputChange('privacy_level', 'friends')}
                        className={`w-full p-3 text-right border rounded-lg transition-colors ${
                          formData.privacy_level === 'friends'
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">الأصدقاء فقط</span>
                          </div>
                          {formData.privacy_level === 'friends' && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          الأصدقاء فقط يمكنهم رؤية ملفك
                        </p>
                      </button>

                      <button
                        onClick={() => handleInputChange('privacy_level', 'private')}
                        className={`w-full p-3 text-right border rounded-lg transition-colors ${
                          formData.privacy_level === 'private'
                            ? 'bg-red-50 border-red-300'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-red-600" />
                            <span className="font-medium">خاص</span>
                          </div>
                          {formData.privacy_level === 'private' && (
                            <CheckCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          ملفك مخفي عن الآخرين
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {getPrivacyDescription(formData.privacy_level)}
                    </p>
                  </div>

                  <Link href="/youth/privacy">
                    <Button variant="outline" className="w-full">
                      إعدادات خصوصية متقدمة
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="mt-6">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}