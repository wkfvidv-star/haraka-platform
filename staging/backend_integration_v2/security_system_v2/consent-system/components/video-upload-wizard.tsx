'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Video, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileVideo, 
  User, 
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { SupabaseStorage } from '@/lib/supabase'
import { ConsentManager } from '@/lib/consent-system'

interface UploadStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface VideoMetadata {
  sport_type: string
  session_notes: string
  duration?: number
  file_size?: number
}

const SPORT_TYPES = [
  'كرة القدم',
  'السباحة', 
  'الجري',
  'كرة السلة',
  'التنس',
  'الجمباز',
  'ألعاب القوى',
  'أخرى'
]

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']

export default function VideoUploadWizard() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [requiresConsent, setRequiresConsent] = useState(false)
  const [consentStatus, setConsentStatus] = useState<'checking' | 'required' | 'approved' | 'pending'>('checking')
  
  const [metadata, setMetadata] = useState<VideoMetadata>({
    sport_type: '',
    session_notes: ''
  })

  const steps: UploadStep[] = [
    {
      id: 'select',
      title: 'اختيار الفيديو',
      description: 'اختر الفيديو الرياضي للتحليل',
      completed: !!selectedFile
    },
    {
      id: 'details',
      title: 'تفاصيل الجلسة',
      description: 'أضف معلومات عن نوع الرياضة والملاحظات',
      completed: !!metadata.sport_type
    },
    {
      id: 'consent',
      title: 'الموافقات',
      description: 'التحقق من الموافقات المطلوبة',
      completed: consentStatus === 'approved' || consentStatus === 'checking'
    },
    {
      id: 'upload',
      title: 'الرفع والمعالجة',
      description: 'رفع الفيديو وبدء التحليل',
      completed: false
    }
  ]

  // Check consent requirements when component mounts
  useState(() => {
    if (user) {
      checkConsentRequirements()
    }
  })

  const checkConsentRequirements = async () => {
    if (!user) return
    
    try {
      const requires = await ConsentManager.requiresGuardianConsent(user.id)
      setRequiresConsent(requires)
      setConsentStatus(requires ? 'required' : 'approved')
    } catch (error) {
      console.error('Error checking consent:', error)
      setConsentStatus('required') // Default to requiring consent for safety
    }
  }

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('نوع الملف غير مدعوم. يرجى اختيار ملف فيديو (MP4, AVI, MOV, WMV, WebM)')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('حجم الملف كبير جداً. الحد الأقصى هو 500 ميجابايت')
      return
    }

    setSelectedFile(file)
    
    // Create video preview
    const url = URL.createObjectURL(file)
    setVideoPreview(url)
    
    // Get video duration
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      setMetadata(prev => ({
        ...prev,
        duration: video.duration,
        file_size: file.size
      }))
    }
    video.src = url
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      // Simulate file input change
      const event = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(event)
    }
  }, [handleFileSelect])

  const requestConsent = async () => {
    if (!user || !selectedFile) return

    try {
      setError('')
      const result = await ConsentManager.createConsentRequest({
        student_id: user.id,
        video_id: 'temp-' + Date.now(), // Temporary ID, will be updated after upload
        consent_type: 'video_analysis',
        additional_notes: metadata.session_notes
      })

      if (result.success) {
        setConsentStatus('pending')
        setSuccess('تم إرسال طلب الموافقة إلى ولي الأمر. ستتلقى إشعاراً عند الموافقة.')
      } else {
        setError(result.error || 'فشل في إرسال طلب الموافقة')
      }
    } catch (error) {
      setError('حدث خطأ أثناء طلب الموافقة')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    // Check consent one more time
    if (requiresConsent && consentStatus !== 'approved') {
      setError('يجب الحصول على موافقة ولي الأمر قبل رفع الفيديو')
      return
    }

    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 200)

      const result = await SupabaseStorage.uploadVideo(selectedFile, user.id, metadata)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.error) {
        throw new Error(result.error)
      }

      setSuccess('تم رفع الفيديو بنجاح! جاري بدء التحليل...')
      
      // Navigate to processing page
      setTimeout(() => {
        router.push(`/student/sessions/${result.data?.id}/status`)
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'فشل في رفع الفيديو')
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            رفع فيديو جديد للتحليل
          </CardTitle>
          <CardDescription>
            ارفع فيديو رياضي للحصول على تحليل مفصل للأداء والحركة
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-medium">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <FileVideo className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)}
                        {metadata.duration && ` • ${formatDuration(metadata.duration)}`}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                        setVideoPreview(null)
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      اختيار فيديو آخر
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium">اسحب الفيديو هنا أو انقر للاختيار</p>
                      <p className="text-sm text-gray-600">
                        الأنواع المدعومة: MP4, AVI, MOV, WMV, WebM
                      </p>
                      <p className="text-sm text-gray-600">
                        الحد الأقصى للحجم: 500 ميجابايت
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-96"
                    preload="metadata"
                  >
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sport_type">نوع الرياضة *</Label>
                  <select
                    id="sport_type"
                    value={metadata.sport_type}
                    onChange={(e) => setMetadata(prev => ({ ...prev, sport_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر نوع الرياضة</option>
                    {SPORT_TYPES.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                {selectedFile && (
                  <div className="space-y-2">
                    <Label>معلومات الملف</Label>
                    <div className="p-3 bg-gray-50 rounded-md space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>الحجم:</span>
                        <span>{formatFileSize(selectedFile.size)}</span>
                      </div>
                      {metadata.duration && (
                        <div className="flex justify-between text-sm">
                          <span>المدة:</span>
                          <span>{formatDuration(metadata.duration)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>النوع:</span>
                        <span>{selectedFile.type}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_notes">ملاحظات الجلسة</Label>
                <Textarea
                  id="session_notes"
                  placeholder="أضف أي ملاحظات حول الجلسة التدريبية، الأهداف، أو النقاط المحددة التي تريد التركيز عليها..."
                  value={metadata.session_notes}
                  onChange={(e) => setMetadata(prev => ({ ...prev, session_notes: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                {consentStatus === 'checking' && (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري التحقق من متطلبات الموافقة...</span>
                  </div>
                )}

                {consentStatus === 'approved' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-medium">تم استيفاء جميع الموافقات المطلوبة</span>
                    </div>
                    <p className="text-gray-600">يمكنك المتابعة لرفع الفيديو وبدء التحليل</p>
                  </div>
                )}

                {consentStatus === 'required' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                      <AlertCircle className="h-6 w-6" />
                      <span className="font-medium">مطلوب موافقة ولي الأمر</span>
                    </div>
                    <p className="text-gray-600">
                      نظراً لأنك تحت سن 18 عاماً، نحتاج موافقة ولي الأمر لتحليل الفيديو
                    </p>
                    <Button onClick={requestConsent} className="mx-auto">
                      <User className="h-4 w-4 mr-2" />
                      طلب موافقة ولي الأمر
                    </Button>
                  </div>
                )}

                {consentStatus === 'pending' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Clock className="h-6 w-6" />
                      <span className="font-medium">في انتظار موافقة ولي الأمر</span>
                    </div>
                    <p className="text-gray-600">
                      تم إرسال طلب الموافقة إلى ولي الأمر. ستتلقى إشعاراً عند الموافقة.
                    </p>
                    <Badge variant="outline" className="mx-auto">
                      <Calendar className="h-3 w-3 mr-1" />
                      مرسل اليوم
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">جاهز للرفع والتحليل</h3>
                <p className="text-gray-600 mb-6">
                  سيتم رفع الفيديو وبدء تحليل الحركة بالذكاء الاصطناعي
                </p>

                {isUploading && (
                  <div className="space-y-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-600">
                      {uploadProgress < 100 
                        ? `جاري الرفع... ${Math.round(uploadProgress)}%`
                        : 'اكتمل الرفع، جاري بدء التحليل...'
                      }
                    </p>
                  </div>
                )}

                {!isUploading && (
                  <Button
                    onClick={handleUpload}
                    size="lg"
                    disabled={consentStatus === 'required' || consentStatus === 'pending'}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    رفع الفيديو وبدء التحليل
                  </Button>
                )}
              </div>

              {/* Upload Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">ملخص الرفع:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">الملف:</span>
                    <span className="mr-2">{selectedFile?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">نوع الرياضة:</span>
                    <span className="mr-2">{metadata.sport_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الحجم:</span>
                    <span className="mr-2">{selectedFile && formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">المدة:</span>
                    <span className="mr-2">
                      {metadata.duration ? formatDuration(metadata.duration) : 'غير محدد'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isUploading}
            >
              السابق
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && !selectedFile) ||
                (currentStep === 1 && !metadata.sport_type) ||
                (currentStep === 2 && consentStatus !== 'approved') ||
                currentStep === steps.length - 1 ||
                isUploading
              }
            >
              {currentStep === steps.length - 1 ? 'اكتمل' : 'التالي'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}