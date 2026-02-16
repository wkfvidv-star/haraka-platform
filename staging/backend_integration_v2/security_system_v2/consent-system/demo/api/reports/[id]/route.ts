import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Cache for report data to improve performance
const reportCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute cache for reports

// GET /api/demo/reports/{id} - Get detailed analysis report with caching
async function getAnalysisReport(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reportId = params.id

  // Validate report ID format
  if (!reportId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId)) {
    throw new AppError('معرف التقرير غير صحيح', 400, 'INVALID_REPORT_ID')
  }

  // Check cache first
  const cached = reportCache.get(reportId)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    // Log cache hit for analytics
    await logReportAccess(reportId, cached.data.report.sessionId, 'CACHE_HIT')
    return NextResponse.json(cached.data)
  }

  // Get report with comprehensive session data
  const { data, error } = await supabase
    .from('analysis_reports_demo')
    .select(`
      *,
      exercise_sessions_demo (
        session_id,
        demo_student_name,
        demo_exercise_type,
        video_file_size,
        video_duration,
        processing_started_at,
        processing_completed_at,
        created_at as session_created_at
      )
    `)
    .eq('report_id', reportId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('التقرير غير موجود', 404, 'REPORT_NOT_FOUND')
    }
    throw new AppError('فشل في جلب التقرير', 500, 'DATABASE_ERROR', error)
  }

  // Calculate processing metrics
  const processingMetrics = calculateProcessingMetrics(data)

  // Generate enhanced insights
  const insights = generateEnhancedInsights(data.overall_score, data.metrics)

  // Format comprehensive response
  const response = {
    success: true,
    report: {
      reportId: data.report_id,
      sessionId: data.session_id,
      
      // Student and exercise info
      student: {
        name: data.exercise_sessions_demo?.demo_student_name,
        exerciseType: data.exercise_sessions_demo?.demo_exercise_type
      },
      
      // Video info with enhanced metadata
      video: {
        fileSize: data.exercise_sessions_demo?.video_file_size,
        fileSizeFormatted: formatFileSize(data.exercise_sessions_demo?.video_file_size),
        duration: data.exercise_sessions_demo?.video_duration,
        durationFormatted: formatDuration(data.exercise_sessions_demo?.video_duration),
        uploadedAt: data.exercise_sessions_demo?.session_created_at,
        quality: determineVideoQuality(data.exercise_sessions_demo?.video_file_size, data.exercise_sessions_demo?.video_duration)
      },
      
      // Enhanced analysis results
      analysis: {
        overallScore: data.overall_score,
        confidenceScore: data.confidence_score,
        processingTimeMs: data.processing_time_ms,
        aiModelVersion: data.ai_model_version,
        
        // Performance grade
        performanceGrade: getPerformanceGrade(data.overall_score),
        
        // Detailed metrics with improvements
        metrics: enhanceMetrics(data.metrics || {}),
        
        // Enhanced recommendations
        recommendations: enhanceRecommendations(data.recommendations || []),
        
        // Generated insights
        insights: insights,
        
        // Processing metrics
        processing: processingMetrics
      },
      
      // Metadata
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDemo: data.is_demo,
      
      // Additional metadata
      metadata: {
        accessedAt: new Date().toISOString(),
        cacheStatus: 'FRESH',
        reportVersion: '2.0'
      }
    }
  }

  // Cache the response
  reportCache.set(reportId, { data: response, timestamp: now })

  // Clean up old cache entries periodically
  if (Math.random() < 0.05) { // 5% chance
    for (const [key, value] of reportCache.entries()) {
      if ((now - value.timestamp) > CACHE_TTL * 2) {
        reportCache.delete(key)
      }
    }
  }

  // Log report access for analytics
  await logReportAccess(reportId, data.session_id, 'DATABASE_FETCH')

  return NextResponse.json(response)
}

// Helper function to calculate processing metrics
function calculateProcessingMetrics(data: any) {
  const session = data.exercise_sessions_demo
  if (!session?.processing_started_at || !session?.processing_completed_at) {
    return null
  }

  const startTime = new Date(session.processing_started_at).getTime()
  const endTime = new Date(session.processing_completed_at).getTime()
  const totalTime = endTime - startTime

  return {
    totalProcessingTime: totalTime,
    totalProcessingTimeFormatted: formatDuration(Math.round(totalTime / 1000)),
    aiProcessingTime: data.processing_time_ms,
    aiProcessingTimeFormatted: `${data.processing_time_ms}ms`,
    efficiency: data.processing_time_ms / totalTime,
    startedAt: session.processing_started_at,
    completedAt: session.processing_completed_at
  }
}

// Enhanced metrics with additional calculations
function enhanceMetrics(metrics: any) {
  const enhanced = { ...metrics }

  // Add calculated fields for each metric
  Object.keys(enhanced).forEach(key => {
    if (enhanced[key] && typeof enhanced[key] === 'object' && enhanced[key].score) {
      enhanced[key] = {
        ...enhanced[key],
        grade: getGradeFromScore(enhanced[key].score),
        percentile: calculatePercentile(enhanced[key].score),
        improvement: calculateImprovementPotential(enhanced[key].score)
      }
    }
  })

  return enhanced
}

// Enhanced recommendations with priority and difficulty
function enhanceRecommendations(recommendations: any[]) {
  return recommendations.map((rec, index) => ({
    ...rec,
    id: `rec_${index + 1}`,
    difficulty: calculateDifficulty(rec.priority),
    estimatedTime: estimateTimeToImprove(rec.priority),
    category: rec.category || 'general',
    order: index + 1
  }))
}

// Enhanced insights generation
function generateEnhancedInsights(overallScore: number, metrics: any) {
  const insights = []

  // Overall performance insight with detailed analysis
  const performanceInsight = getPerformanceInsight(overallScore)
  insights.push(performanceInsight)

  // Metric-specific insights
  if (metrics) {
    Object.entries(metrics).forEach(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && value.score) {
        const metricInsight = getMetricInsight(key, value.score, value)
        if (metricInsight) {
          insights.push(metricInsight)
        }
      }
    })
  }

  // Comparative insights
  const comparativeInsight = getComparativeInsight(overallScore, metrics)
  if (comparativeInsight) {
    insights.push(comparativeInsight)
  }

  return insights
}

// Helper functions
function getPerformanceGrade(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'B+'
  if (score >= 80) return 'B'
  if (score >= 75) return 'C+'
  if (score >= 70) return 'C'
  if (score >= 65) return 'D+'
  if (score >= 60) return 'D'
  return 'F'
}

function getGradeFromScore(score: number): string {
  return getPerformanceGrade(score)
}

function calculatePercentile(score: number): number {
  // Simulate percentile calculation based on score
  return Math.min(Math.round(score * 0.85 + Math.random() * 10), 99)
}

function calculateImprovementPotential(score: number): number {
  return Math.max(0, 100 - score)
}

function calculateDifficulty(priority: string): string {
  switch (priority) {
    case 'high': return 'متوسط'
    case 'medium': return 'سهل'
    case 'low': return 'سهل جداً'
    default: return 'متوسط'
  }
}

function estimateTimeToImprove(priority: string): string {
  switch (priority) {
    case 'high': return '4-6 أسابيع'
    case 'medium': return '2-3 أسابيع'
    case 'low': return '1-2 أسبوع'
    default: return '2-4 أسابيع'
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 بايت'
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0 ثانية'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0) {
    return `${mins} دقيقة${secs > 0 ? ` و ${secs} ثانية` : ''}`
  }
  return `${secs} ثانية`
}

function determineVideoQuality(fileSize: number, duration: number): string {
  if (!fileSize || !duration) return 'غير محدد'
  const bitrate = (fileSize * 8) / duration // bits per second
  if (bitrate > 5000000) return 'عالية جداً'
  if (bitrate > 2000000) return 'عالية'
  if (bitrate > 1000000) return 'متوسطة'
  return 'منخفضة'
}

function getPerformanceInsight(score: number) {
  if (score >= 90) {
    return {
      type: 'excellent',
      title: 'أداء استثنائي! 🏆',
      description: 'أداء ممتاز في جميع المقاييس. أنت في المسار الصحيح للوصول للمستوى الاحترافي. استمر في هذا التميز!',
      icon: '🏆',
      color: 'gold',
      actionable: 'ركز على الحفاظ على هذا المستوى وتطوير مهارات متقدمة'
    }
  } else if (score >= 75) {
    return {
      type: 'good',
      title: 'أداء قوي ومتميز 👍',
      description: 'أداء جيد جداً مع إمكانيات كبيرة للتطوير. بقليل من التركيز يمكنك الوصول للمستوى الممتاز.',
      icon: '👍',
      color: 'green',
      actionable: 'ركز على تحسين النقاط الضعيفة للوصول للتميز'
    }
  } else if (score >= 60) {
    return {
      type: 'average',
      title: 'أداء متوسط - يحتاج تطوير 📈',
      description: 'أداء مقبول يظهر فهماً جيداً للأساسيات. مع التدريب المنتظم ستحقق تحسناً ملحوظاً.',
      icon: '📈',
      color: 'orange',
      actionable: 'ضع خطة تدريب منتظمة وركز على الأساسيات'
    }
  } else {
    return {
      type: 'needs_improvement',
      title: 'فرصة كبيرة للتطوير 💪',
      description: 'هناك مجال واسع للتحسن. ابدأ بالأساسيات وتدرب بانتظام، النتائج ستظهر قريباً!',
      icon: '💪',
      color: 'red',
      actionable: 'ابدأ ببرنامج تدريبي مكثف على الأساسيات'
    }
  }
}

function getMetricInsight(metricKey: string, score: number, metricData: any) {
  const metricNames = {
    balance: 'التوازن',
    speed: 'السرعة',
    accuracy: 'الدقة',
    technique: 'التقنية',
    endurance: 'التحمل',
    coordination: 'التناسق'
  }

  const metricName = metricNames[metricKey as keyof typeof metricNames] || metricKey

  if (score >= 85) {
    return {
      type: 'strength',
      title: `${metricName} ممتاز ⭐`,
      description: `مهارات ${metricName} قوية جداً وتساهم بشكل إيجابي في الأداء العام.`,
      icon: '⭐',
      color: 'green',
      metric: metricKey,
      score: score
    }
  } else if (score < 65) {
    return {
      type: 'improvement_area',
      title: `تطوير ${metricName} مطلوب 🎯`,
      description: `${metricName} يحتاج إلى تركيز إضافي. التحسن في هذا المجال سيرفع الأداء العام بشكل ملحوظ.`,
      icon: '🎯',
      color: 'orange',
      metric: metricKey,
      score: score
    }
  }
  return null
}

function getComparativeInsight(overallScore: number, metrics: any) {
  if (!metrics) return null

  const scores = Object.values(metrics)
    .filter((m: any) => m && typeof m === 'object' && m.score)
    .map((m: any) => m.score)

  if (scores.length < 2) return null

  const highest = Math.max(...scores)
  const lowest = Math.min(...scores)
  const difference = highest - lowest

  if (difference > 20) {
    return {
      type: 'balance_needed',
      title: 'تحتاج توازن في المهارات ⚖️',
      description: `هناك فجوة كبيرة بين أقوى وأضعف مهاراتك (${difference} نقطة). العمل على توازن المهارات سيحسن الأداء العام.`,
      icon: '⚖️',
      color: 'blue',
      difference: difference,
      recommendation: 'ركز على تطوير المهارات الأضعف مع الحفاظ على القوية'
    }
  }

  return null
}

// Enhanced audit logging
async function logReportAccess(reportId: string, sessionId: string, accessType: string) {
  try {
    await supabase.rpc('log_audit_event', {
      p_user_id: 'demo_viewer',
      p_user_role: 'user',
      p_action: 'DEMO_REPORT_VIEWED',
      p_resource_type: 'analysis_report',
      p_resource_id: reportId,
      p_old_values: null,
      p_new_values: { 
        access_type: accessType,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      },
      p_ip_address: null,
      p_user_agent: 'Demo Report API',
      p_session_id: sessionId,
      p_success: true,
      p_error_message: null,
      p_risk_score: 1,
      p_meta: { 
        demo_mode: true,
        access_type: accessType,
        report_version: '2.0'
      }
    })
  } catch (error) {
    console.error('Failed to log report access:', error)
    // Don't throw error for logging failures
  }
}

// Update report validation schema
const UpdateReportSchema = z.object({
  overallScore: z.number().min(0).max(100).optional(),
  metrics: z.record(z.any()).optional(),
  recommendations: z.array(z.any()).optional(),
  confidenceScore: z.number().min(0).max(1).optional()
})

// POST /api/demo/reports/{id} - Update report (enhanced)
async function updateAnalysisReport(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reportId = params.id
  const body = await request.json()
  
  // Validate report ID format
  if (!reportId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId)) {
    throw new AppError('معرف التقرير غير صحيح', 400, 'INVALID_REPORT_ID')
  }

  // Validate input
  const validatedData = UpdateReportSchema.parse(body)

  // Prepare update data
  const updateData: any = {
    updated_at: new Date().toISOString()
  }

  Object.assign(updateData, validatedData)

  // Update report
  const { data, error } = await supabase
    .from('analysis_reports_demo')
    .update(updateData)
    .eq('report_id', reportId)
    .select()
    .single()

  if (error) {
    throw new AppError('فشل في تحديث التقرير', 500, 'DATABASE_ERROR', error)
  }

  if (!data) {
    throw new AppError('التقرير غير موجود', 404, 'REPORT_NOT_FOUND')
  }

  // Clear cache for this report
  reportCache.delete(reportId)

  // Enhanced audit logging
  await supabase.rpc('log_audit_event', {
    p_user_id: 'demo_system',
    p_user_role: 'system',
    p_action: 'DEMO_REPORT_UPDATED',
    p_resource_type: 'analysis_report',
    p_resource_id: reportId,
    p_old_values: null,
    p_new_values: { 
      updated_fields: Object.keys(validatedData),
      overall_score: validatedData.overallScore,
      updated_at: updateData.updated_at
    },
    p_ip_address: null,
    p_user_agent: 'Demo Report API',
    p_session_id: data.session_id,
    p_success: true,
    p_error_message: null,
    p_risk_score: 1,
    p_meta: { 
      demo_mode: true, 
      manual_update: true,
      update_type: 'api_update'
    }
  })

  return NextResponse.json({
    success: true,
    message: 'تم تحديث التقرير بنجاح',
    report: {
      reportId: data.report_id,
      overallScore: data.overall_score,
      confidenceScore: data.confidence_score,
      updatedAt: data.updated_at
    },
    updatedFields: Object.keys(validatedData)
  })
}

// Apply middleware
export const GET = withRateLimit(withErrorHandler(getAnalysisReport))
export const POST = withRateLimit(withErrorHandler(updateAnalysisReport))