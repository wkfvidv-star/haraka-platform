'use client'

import { useState, useEffect } from 'react'
import { ConsentModal } from './consent-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Video, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileVideo,
  User
} from 'lucide-react'

interface VideoUploadWithConsentProps {
  studentId: string
  studentName: string
  guardianId?: string
  guardianName?: string
  onUploadComplete?: (uploadId: string) => void
}

interface ConsentStatus {
  hasConsent: boolean
  consent: any
  status: 'none' | 'active' | 'revoked'
}

export function VideoUploadWithConsent({
  studentId,
  studentName,
  guardianId,
  guardianName,
  onUploadComplete
}: VideoUploadWithConsentProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    hasConsent: false,
    consent: null,
    status: 'none'
  })
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [isCheckingConsent, setIsCheckingConsent] = useState(true)
  const [isProcessingConsent, setIsProcessingConsent] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Check consent status on component mount
  useEffect(() => {
    checkConsentStatus()
  }, [studentId])

  const checkConsentStatus = async () => {
    setIsCheckingConsent(true)
    try {
      const response = await fetch(`/api/consents?childId=${studentId}&guardianId=${guardianId}`)
      const data = await response.json()
      
      setConsentStatus(data)
    } catch (error) {
      console.error('Error checking consent status:', error)
    } finally {
      setIsCheckingConsent(false)
    }
  }

  const handleConsentDecision = async (granted: boolean) => {
    if (!granted) {
      setShowConsentModal(false)
      return
    }

    setIsProcessingConsent(true)
    try {
      const response = await fetch('/api/consents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: studentId,
          guardianId: guardianId,
          scope: 'video_upload_analysis',
          version: 'v1.0',
          consentText: `أوافق على قيام ${studentName} برفع مقاطع الفيديو لتحليل الأداء الرياضي على منصة حركة`
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setConsentStatus({
          hasConsent: true,
          consent: data.consent,
          status: 'active'
        })
        setShowConsentModal(false)
        
        // Log successful consent
        await logAuditEvent('CONSENT_GRANTED', 'consents', data.consent.consent_id)
      } else {
        console.error('Error granting consent:', data.error)
      }
    } catch (error) {
      console.error('Error processing consent:', error)
    } finally {
      setIsProcessingConsent(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const handleVideoUpload = async () => {
    if (!uploadFile || !consentStatus.hasConsent) return

    setIsUploading(true)
    try {
      // Log upload attempt
      await logAuditEvent('VIDEO_UPLOAD_STARTED', 'exercise_session', null, {
        file_name: uploadFile.name,
        file_size: uploadFile.size,
        file_type: uploadFile.type
      })

      // Simulate video upload (replace with actual upload logic)
      const formData = new FormData()
      formData.append('video', uploadFile)
      formData.append('studentId', studentId)
      formData.append('sessionId', `session_${Date.now()}`)

      // In a real implementation, this would upload to your video service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const uploadId = `upload_${Date.now()}`
      
      // Log successful upload
      await logAuditEvent('VIDEO_UPLOADED', 'exercise_session', uploadId, {
        file_name: uploadFile.name,
        file_size: uploadFile.size,
        duration_seconds: 0, // Would be extracted from video
        device_type: 'web'
      })

      setUploadFile(null)
      onUploadComplete?.(uploadId)
      
    } catch (error) {
      console.error('Error uploading video:', error)
      
      // Log failed upload
      await logAuditEvent('VIDEO_UPLOAD_FAILED', 'exercise_session', null, {
        error: error instanceof Error ? error.message : 'Unknown error',
        file_name: uploadFile.name
      })
    } finally {
      setIsUploading(false)
    }
  }

  const logAuditEvent = async (action: string, resourceType: string, resourceId: string | null, metadata?: any) => {
    try {
      // In a real implementation, this would call your audit logging API
      console.log('Audit Event:', {
        action,
        resourceType,
        resourceId,
        userId: studentId,
        metadata,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error logging audit event:', error)
    }
  }

  const initiateUpload = () => {
    if (!consentStatus.hasConsent) {
      setShowConsentModal(true)
    } else {
      document.getElementById('video-file-input')?.click()
    }
  }

  if (isCheckingConsent) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p>جاري التحقق من حالة الموافقة...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Consent Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            حالة موافقة ولي الأمر
          </CardTitle>
          <CardDescription>
            الموافقة مطلوبة قبل رفع الفيديوهات لتحليل الأداء الرياضي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{studentName}</p>
                <p className="text-sm text-muted-foreground">الطالب</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {consentStatus.hasConsent ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  موافقة نشطة
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <AlertTriangle className="h-3 w-3 ml-1" />
                  مطلوب موافقة
                </Badge>
              )}
            </div>
          </div>
          
          {consentStatus.hasConsent && consentStatus.consent && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                تم منح الموافقة في: {new Date(consentStatus.consent.accepted_at).toLocaleDateString('ar-SA')}
              </p>
              <p className="text-xs text-green-600 mt-1">
                النطاق: رفع وتحليل الفيديوهات الرياضية
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            رفع فيديو التمرين
          </CardTitle>
          <CardDescription>
            ارفع فيديو لتحليل الأداء الرياضي والحصول على تقرير مفصل
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!consentStatus.hasConsent && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">موافقة ولي الأمر مطلوبة</AlertTitle>
              <AlertDescription className="text-orange-700">
                يجب الحصول على موافقة ولي الأمر قبل رفع أي فيديوهات. 
                سيتم عرض نموذج الموافقة عند النقر على "رفع فيديو".
              </AlertDescription>
            </Alert>
          )}

          {uploadFile && (
            <Alert className="border-blue-200 bg-blue-50">
              <FileVideo className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">ملف محدد للرفع</AlertTitle>
              <AlertDescription className="text-blue-700">
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="font-medium">{uploadFile.name}</p>
                    <p className="text-sm">الحجم: {(uploadFile.size / (1024 * 1024)).toFixed(2)} ميجابايت</p>
                  </div>
                  <Button
                    onClick={() => setUploadFile(null)}
                    variant="outline"
                    size="sm"
                  >
                    إلغاء
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <input
              id="video-file-input"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!uploadFile ? (
              <Button
                onClick={initiateUpload}
                className="flex-1"
                size="lg"
              >
                <Upload className="h-4 w-4 ml-2" />
                {consentStatus.hasConsent ? 'اختيار فيديو للرفع' : 'رفع فيديو (سيتم طلب الموافقة)'}
              </Button>
            ) : (
              <Button
                onClick={handleVideoUpload}
                disabled={isUploading || !consentStatus.hasConsent}
                className="flex-1"
                size="lg"
              >
                {isUploading ? 'جاري الرفع...' : 'رفع الفيديو'}
              </Button>
            )}
          </div>

          {consentStatus.hasConsent && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                سيتم تحليل الفيديو تلقائياً بعد الرفع وإنشاء تقرير مفصل عن الأداء
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsentDecision}
        studentName={studentName}
        guardianName={guardianName || 'ولي الأمر'}
        isLoading={isProcessingConsent}
      />
    </div>
  )
}