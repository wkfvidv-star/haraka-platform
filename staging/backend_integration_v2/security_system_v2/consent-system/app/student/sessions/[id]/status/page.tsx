'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  FileVideo,
  Loader2,
  RefreshCw,
  Download,
  Share,
  ArrowLeft
} from 'lucide-react'

interface SessionStatus {
  sessionId: string
  studentName: string
  exerciseType: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  processingStage: string
  estimatedTimeRemaining: number | null
  createdAt: string
  report?: {
    reportId: string
    overallScore: number
    available: boolean
  }
}

export default function SessionStatusPage() {
  const params = useParams()
  const sessionId = params.id as string
  
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/demo/sessions/${sessionId}/status`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'فشل في جلب حالة الجلسة')
      }
      
      setSessionStatus({
        sessionId: data.session.sessionId,
        studentName: data.session.studentName,
        exerciseType: data.session.exerciseType,
        status: data.session.status,
        progress: data.session.progress,
        processingStage: data.session.processingStage || 'جاري المعالجة...',
        estimatedTimeRemaining: data.session.estimatedTimeRemaining,
        createdAt: data.session.createdAt,
        report: data.report
      })
      
      // Stop auto-refresh if completed or failed
      if (data.session.status === 'completed' || data.session.status === 'failed') {
        setAutoRefresh(false)
      }
      
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
      setAutoRefresh(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [sessionId])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchStatus, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, sessionId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'processing': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'processing': return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTimeRemaining = (ms: number | null) => {
    if (!ms) return null
    const seconds = Math.ceil(ms / 1000)
    return `${seconds} ثانية متبقية`
  }

  if (isLoading && !sessionStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل حالة الجلسة...</p>
        </div>
      </div>
    )
  }

  if (error && !sessionStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">خطأ في التحميل</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchStatus} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">حالة تحليل الفيديو</h1>
          <p className="text-gray-600">متابعة تقدم تحليل الفيديو بالذكاء الاصطناعي</p>
        </div>

        {sessionStatus && (
          <>
            {/* Session Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileVideo className="h-5 w-5 text-blue-600" />
                    معلومات الجلسة
                  </span>
                  <Badge variant={sessionStatus.status === 'completed' ? 'default' : 'secondary'}>
                    {sessionStatus.status === 'completed' ? 'مكتمل' :
                     sessionStatus.status === 'processing' ? 'قيد المعالجة' :
                     sessionStatus.status === 'failed' ? 'فاشل' : 'في الانتظار'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">اسم الطالب</p>
                    <p className="font-medium">{sessionStatus.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">نوع التمرين</p>
                    <p className="font-medium">{sessionStatus.exerciseType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">معرف الجلسة</p>
                    <p className="font-mono text-sm">{sessionStatus.sessionId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(sessionStatus.status)}
                  حالة المعالجة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">التقدم</span>
                      <span className="text-sm text-gray-600">{sessionStatus.progress}%</span>
                    </div>
                    <Progress value={sessionStatus.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${getStatusColor(sessionStatus.status)}`}>
                      {sessionStatus.processingStage}
                    </p>
                    {sessionStatus.estimatedTimeRemaining && (
                      <p className="text-sm text-gray-600">
                        {formatTimeRemaining(sessionStatus.estimatedTimeRemaining)}
                      </p>
                    )}
                  </div>

                  {sessionStatus.status === 'processing' && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertTitle>جاري المعالجة</AlertTitle>
                      <AlertDescription>
                        يتم تحليل الفيديو باستخدام الذكاء الاصطناعي. يرجى عدم إغلاق النافذة.
                      </AlertDescription>
                    </Alert>
                  )}

                  {sessionStatus.status === 'failed' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>فشل في المعالجة</AlertTitle>
                      <AlertDescription>
                        حدث خطأ أثناء تحليل الفيديو. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {sessionStatus.status === 'completed' && sessionStatus.report && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    النتائج جاهزة!
                  </CardTitle>
                  <CardDescription>
                    تم إكمال تحليل الفيديو بنجاح. يمكنك الآن عرض التقرير المفصل.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">النتيجة الإجمالية</h3>
                        <p className="text-sm text-green-600">تحليل شامل للأداء الرياضي</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-800">
                        {sessionStatus.report.overallScore}%
                      </div>
                      <div className="text-sm text-green-600">من 100</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => window.location.href = `/student/reports/${sessionStatus.report?.reportId}`}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <BarChart3 className="h-4 w-4 ml-2" />
                      عرض التقرير المفصل
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 ml-2" />
                      تحميل التقرير
                    </Button>
                    <Button variant="outline">
                      <Share className="h-4 w-4 ml-2" />
                      مشاركة النتائج
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Refresh Button */}
            {(sessionStatus.status === 'processing' || sessionStatus.status === 'pending') && (
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={fetchStatus}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                  تحديث الحالة
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}