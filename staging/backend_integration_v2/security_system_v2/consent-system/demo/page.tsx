'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye,
  Download,
  Sparkles,
  Video,
  BarChart3,
  Users,
  Trophy,
  Target,
  Zap,
  Activity
} from 'lucide-react'

interface DemoSession {
  sessionId: string
  studentName: string
  exerciseType: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  uploadUrl?: string
  expiresAt?: string
  statusMessage?: string
  estimatedTimeRemaining?: number
}

interface DemoReport {
  reportId: string
  sessionId: string
  student: {
    name: string
    exerciseType: string
  }
  analysis: {
    overallScore: number
    confidenceScore: number
    processingTimeMs: number
    metrics: any
    recommendations: any[]
    insights?: any[]
  }
  createdAt: string
}

export default function DemoModePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [session, setSession] = useState<DemoSession | null>(null)
  const [report, setReport] = useState<DemoReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form data
  const [studentName, setStudentName] = useState('أحمد محمد التجريبي')
  const [exerciseType, setExerciseType] = useState('كرة القدم')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Polling for status updates
  useEffect(() => {
    if (session && session.status === 'processing') {
      const interval = setInterval(async () => {
        await checkSessionStatus()
      }, 2000) // Check every 2 seconds

      return () => clearInterval(interval)
    }
  }, [session?.sessionId, session?.status])

  const createDemoSession = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/demo/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          exerciseType,
          uploadExpiresMinutes: 5
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'فشل في إنشاء الجلسة التجريبية')
      }

      setSession(result.session)
      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!session || !selectedFile) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate file upload (in real implementation, this would upload to the signed URL)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Complete the session
      const response = await fetch(`/api/demo/sessions/${session.sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoFilePath: `demo/videos/${session.sessionId}.mp4`,
          videoFileSize: selectedFile.size,
          videoDuration: 30 // Mock duration
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'فشل في رفع الفيديو')
      }

      setSession(prev => prev ? { ...prev, status: 'processing', progress: 10 } : null)
      setCurrentStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في رفع الفيديو')
    } finally {
      setIsLoading(false)
    }
  }

  const checkSessionStatus = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/demo/sessions/${session.sessionId}/status`)
      const result = await response.json()

      if (response.ok && result.session) {
        setSession(result.session)

        if (result.session.status === 'completed' && result.report) {
          // Fetch full report
          const reportResponse = await fetch(`/api/demo/reports/${result.report.reportId}`)
          const reportResult = await reportResponse.json()

          if (reportResponse.ok) {
            setReport(reportResult.report)
            setCurrentStep(4)
          }
        }
      }
    } catch (err) {
      console.error('Error checking status:', err)
    }
  }

  const generatePresetVideo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/demo/generate_preset_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoType: exerciseType === 'كرة القدم' ? 'football_demo' : 'basketball_demo',
          duration: 30,
          quality: 'medium',
          format: 'mp4'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'فشل في توليد الفيديو التجريبي')
      }

      // Create a mock file object
      const mockFile = new File(['mock video content'], 'demo_video.mp4', {
        type: 'video/mp4'
      })
      setSelectedFile(mockFile)

      alert(`تم توليد فيديو تجريبي بنجاح!\nالنوع: ${result.video.type}\nالحجم: ${(result.video.fileSize / 1024 / 1024).toFixed(2)} ميجابايت`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في توليد الفيديو')
    } finally {
      setIsLoading(false)
    }
  }

  const resetDemo = () => {
    setCurrentStep(1)
    setSession(null)
    setReport(null)
    setSelectedFile(null)
    setError(null)
    setStudentName('أحمد محمد التجريبي')
    setExerciseType('كرة القدم')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              الوضع التجريبي - منصة حركة
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            جرب منصة حركة للتحليل الرياضي بالذكاء الاصطناعي. ارفع فيديو تجريبي واحصل على تقرير مفصل للأداء خلال ثوانٍ!
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>إعداد الجلسة</span>
              <span>رفع الفيديو</span>
              <span>التحليل</span>
              <span>النتائج</span>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Session Setup */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                إعداد الجلسة التجريبية
              </CardTitle>
              <CardDescription>
                أدخل بيانات الطالب ونوع التمرين لبدء التجربة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studentName">اسم الطالب</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="أدخل اسم الطالب"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exerciseType">نوع التمرين</Label>
                  <Select value={exerciseType} onValueChange={setExerciseType}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التمرين" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="كرة القدم">كرة القدم</SelectItem>
                      <SelectItem value="كرة السلة">كرة السلة</SelectItem>
                      <SelectItem value="الجري">الجري</SelectItem>
                      <SelectItem value="الجمباز">الجمباز</SelectItem>
                      <SelectItem value="السباحة">السباحة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={createDemoSession} 
                disabled={isLoading || !studentName.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري إنشاء الجلسة...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 ml-2" />
                    بدء الجلسة التجريبية
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Video Upload */}
        {currentStep === 2 && session && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                رفع الفيديو التجريبي
              </CardTitle>
              <CardDescription>
                ارفع فيديو التمرين أو استخدم فيديو تجريبي جاهز
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Session Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">معلومات الجلسة:</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">رقم الجلسة:</span>
                    <span className="font-mono">{session.sessionId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">الطالب:</span>
                    <span>{session.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">نوع التمرين:</span>
                    <span>{session.exerciseType}</span>
                  </div>
                  {session.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">انتهاء صلاحية الرفع:</span>
                      <span>{new Date(session.expiresAt).toLocaleTimeString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">اختر ملف الفيديو</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    الحد الأقصى: 100 ميجابايت | الأنواع المدعومة: MP4, MOV, AVI
                  </p>
                  
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button asChild variant="outline">
                      <span>اختيار الفيديو</span>
                    </Button>
                  </label>
                </div>

                {/* Generate Preset Video */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">أو</p>
                  <Button 
                    onClick={generatePresetVideo}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Sparkles className="h-4 w-4 ml-2" />
                    توليد فيديو تجريبي جاهز
                  </Button>
                </div>

                {/* Selected File Info */}
                {selectedFile && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">الملف المحدد:</h4>
                    <div className="text-sm text-green-700">
                      <p><strong>الاسم:</strong> {selectedFile.name}</p>
                      <p><strong>الحجم:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} ميجابايت</p>
                      <p><strong>النوع:</strong> {selectedFile.type}</p>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button 
                  onClick={handleFileUpload}
                  disabled={isLoading || !selectedFile}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري رفع الفيديو...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 ml-2" />
                      رفع الفيديو وبدء التحليل
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && session && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 animate-pulse" />
                جاري التحليل بالذكاء الاصطناعي
              </CardTitle>
              <CardDescription>
                يتم الآن تحليل الفيديو باستخدام خوارزميات الذكاء الاصطناعي المتقدمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم:</span>
                  <span>{session.progress || 0}%</span>
                </div>
                <Progress value={session.progress || 0} className="w-full" />
              </div>

              {/* Status Message */}
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="font-medium text-blue-800">
                    {session.statusMessage || 'جاري المعالجة...'}
                  </span>
                </div>
                {session.estimatedTimeRemaining && (
                  <p className="text-sm text-blue-600">
                    الوقت المتبقي المتوقع: {Math.ceil(session.estimatedTimeRemaining / 1000)} ثانية
                  </p>
                )}
              </div>

              {/* Processing Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">تم رفع الفيديو بنجاح</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">استخراج الإطارات وتحليل الحركة</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">حساب مقاييس الأداء</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">توليد التوصيات المخصصة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && report && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  النتيجة الإجمالية
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">
                        {report.analysis.overallScore}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {report.analysis.overallScore >= 90 ? 'أداء ممتاز!' :
                   report.analysis.overallScore >= 75 ? 'أداء جيد جداً' :
                   report.analysis.overallScore >= 60 ? 'أداء جيد' : 'يحتاج تحسين'}
                </p>
                <p className="text-sm text-gray-500">
                  معدل الثقة: {Math.round((report.analysis.confidenceScore || 0.85) * 100)}%
                </p>
              </CardContent>
            </Card>

            {/* Metrics */}
            {report.analysis.metrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    مقاييس الأداء المفصلة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(report.analysis.metrics).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {key === 'balance' ? 'التوازن' :
                             key === 'speed' ? 'السرعة' :
                             key === 'accuracy' ? 'الدقة' :
                             key === 'technique' ? 'التقنية' : key}
                          </span>
                          <Badge variant="outline">
                            {value.score || 0}/100
                          </Badge>
                        </div>
                        <Progress value={value.score || 0} className="mb-2" />
                        <div className="text-xs text-gray-500 space-y-1">
                          {Object.entries(value).filter(([k]) => k !== 'score').map(([subKey, subValue]: [string, any]) => (
                            <div key={subKey} className="flex justify-between">
                              <span>{subKey}</span>
                              <span>{typeof subValue === 'number' ? subValue.toFixed(2) : subValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {report.analysis.recommendations && report.analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    التوصيات المخصصة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.analysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Badge variant={
                            rec.priority === 'high' ? 'destructive' :
                            rec.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {rec.priority === 'high' ? 'عالي' :
                             rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            {rec.exercises && rec.exercises.length > 0 && (
                              <div>
                                <p className="text-sm font-medium mb-1">التمارين المقترحة:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {rec.exercises.map((exercise: string, i: number) => (
                                    <li key={i}>{exercise}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            {report.analysis.insights && report.analysis.insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    رؤى الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {report.analysis.insights.map((insight: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        insight.type === 'excellent' ? 'bg-green-50 border-green-500' :
                        insight.type === 'good' ? 'bg-blue-50 border-blue-500' :
                        insight.type === 'strength' ? 'bg-purple-50 border-purple-500' :
                        insight.type === 'improvement_area' ? 'bg-orange-50 border-orange-500' :
                        'bg-gray-50 border-gray-500'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{insight.icon}</span>
                          <div>
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <p className="text-xs text-gray-600">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button onClick={resetDemo} variant="outline">
                <Play className="h-4 w-4 ml-2" />
                تجربة جديدة
              </Button>
              <Button onClick={() => window.print()}>
                <Download className="h-4 w-4 ml-2" />
                تحميل التقرير
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}