import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError, validateFileSize, validateFileType, validateSession } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Validation schema
const CompleteSessionSchema = z.object({
  videoFilePath: z.string().min(1, 'مسار الفيديو مطلوب'),
  videoFileSize: z.number().min(1, 'حجم الملف يجب أن يكون أكبر من صفر').max(100 * 1024 * 1024, 'حجم الملف كبير جداً'),
  videoDuration: z.number().min(1, 'مدة الفيديو يجب أن تكون أكبر من صفر').max(300, 'مدة الفيديو طويلة جداً')
})

// POST /api/demo/sessions/{id}/complete - Mark session as uploaded and start processing
async function completeSession(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id
  const body = await request.json()
  
  // Validate session ID format
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    throw new AppError('معرف الجلسة غير صحيح', 400, 'INVALID_SESSION_ID')
  }

  // Validate input data
  const validatedData = CompleteSessionSchema.parse(body)
  const { videoFilePath, videoFileSize, videoDuration } = validatedData

  // Additional file validations
  validateFileSize(videoFileSize)
  
  // Check if session exists and is valid
  const { data: sessionCheck, error: sessionError } = await supabase
    .from('exercise_sessions_demo')
    .select('session_id, status, upload_expires_at')
    .eq('session_id', sessionId)
    .single()

  if (sessionError) {
    if (sessionError.code === 'PGRST116') {
      throw new AppError('الجلسة غير موجودة', 404, 'SESSION_NOT_FOUND')
    }
    throw new AppError('فشل في التحقق من الجلسة', 500, 'DATABASE_ERROR', sessionError)
  }

  // Validate session status
  if (sessionCheck.status !== 'pending') {
    throw new AppError('الجلسة تمت معالجتها مسبقاً', 400, 'SESSION_ALREADY_PROCESSED')
  }

  // Validate session expiration
  if (sessionCheck.upload_expires_at) {
    validateSession(sessionCheck.upload_expires_at)
  }

  // Complete demo session using database function
  const { data, error } = await supabase.rpc('complete_demo_session', {
    p_session_id: sessionId,
    p_video_file_path: videoFilePath,
    p_video_file_size: videoFileSize,
    p_video_duration: videoDuration
  })

  if (error) {
    console.error('Database error:', error)
    throw new AppError('فشل في إكمال الجلسة التجريبية', 500, 'DATABASE_ERROR', error)
  }

  if (!data) {
    throw new AppError('الجلسة غير موجودة أو تمت معالجتها مسبقاً', 404, 'SESSION_NOT_FOUND')
  }

  // Queue the analysis job with improved error handling
  queueAnalysisJob(sessionId).catch(error => {
    console.error('Failed to queue analysis job:', error)
    // Mark session as failed in background
    supabase
      .from('exercise_sessions_demo')
      .update({
        status: 'failed',
        error_message: 'فشل في بدء تحليل الفيديو',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .then(() => console.log(`Session ${sessionId} marked as failed`))
  })

  return NextResponse.json({
    success: true,
    message: 'تم رفع الفيديو بنجاح، بدأ التحليل',
    sessionId: sessionId,
    status: 'processing',
    progress: 10,
    estimatedCompletionTime: '15-30 ثانية',
    processingStarted: true
  })
}

// Improved analysis processing job
async function queueAnalysisJob(sessionId: string) {
  // Use setTimeout with Promise wrapper for better error handling
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(async () => {
      try {
        await processAnalysisJob(sessionId)
        resolve()
      } catch (error) {
        reject(error)
      }
    }, 1000) // 1 second delay

    // Cleanup timeout if needed
    process.on('exit', () => clearTimeout(timeoutId))
  })
}

// Enhanced analysis processing job
async function processAnalysisJob(sessionId: string) {
  try {
    // Update progress to show processing started
    await supabase
      .from('exercise_sessions_demo')
      .update({
        status: 'processing',
        processing_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    // Simulate realistic AI processing delay (2-5 seconds)
    const processingDelay = 2000 + Math.random() * 3000
    await new Promise(resolve => setTimeout(resolve, processingDelay))

    // Generate analysis report using database function
    const { data: reportId, error } = await supabase.rpc('generate_demo_analysis_report', {
      p_session_id: sessionId
    })

    if (error) {
      throw new Error(`فشل في توليد تقرير التحليل: ${error.message}`)
    }

    if (!reportId) {
      throw new Error('لم يتم إرجاع معرف التقرير من التحليل')
    }

    // Create notifications for all relevant roles
    const { data: notificationCount, error: notificationError } = await supabase.rpc('create_demo_notifications', {
      p_session_id: sessionId,
      p_report_id: reportId
    })

    if (notificationError) {
      console.error('Notification error:', notificationError)
      // Don't fail the whole process for notification errors
    }

    // Log successful completion
    console.log(`✅ Demo analysis completed for session ${sessionId}:`)
    console.log(`   📊 Report ID: ${reportId}`)
    console.log(`   📢 Notifications created: ${notificationCount || 0}`)
    console.log(`   ⏱️  Processing time: ${processingDelay.toFixed(0)}ms`)

    // Additional audit logging for completion
    await supabase.rpc('log_audit_event', {
      p_user_id: 'demo_system',
      p_user_role: 'system',
      p_action: 'DEMO_PROCESSING_COMPLETED',
      p_resource_type: 'exercise_session',
      p_resource_id: sessionId,
      p_old_values: null,
      p_new_values: {
        report_id: reportId,
        processing_time_ms: Math.round(processingDelay),
        notification_count: notificationCount
      },
      p_ip_address: null,
      p_user_agent: 'Demo Processing System',
      p_session_id: null,
      p_success: true,
      p_error_message: null,
      p_risk_score: 1,
      p_meta: { demo_mode: true, auto_processing: true }
    })

  } catch (error) {
    console.error('❌ Analysis processing error:', error)
    
    // Update session with failure details
    await supabase
      .from('exercise_sessions_demo')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'خطأ غير معروف في المعالجة',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    // Log the failure
    await supabase.rpc('log_audit_event', {
      p_user_id: 'demo_system',
      p_user_role: 'system',
      p_action: 'DEMO_PROCESSING_FAILED',
      p_resource_type: 'exercise_session',
      p_resource_id: sessionId,
      p_old_values: null,
      p_new_values: null,
      p_ip_address: null,
      p_user_agent: 'Demo Processing System',
      p_session_id: null,
      p_success: false,
      p_error_message: error instanceof Error ? error.message : 'Unknown processing error',
      p_risk_score: 3,
      p_meta: { demo_mode: true, auto_processing: true }
    })

    throw error
  }
}

// GET /api/demo/sessions/{id}/complete - Get completion status (enhanced)
async function getCompletionStatus(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id

  // Validate session ID format
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    throw new AppError('معرف الجلسة غير صحيح', 400, 'INVALID_SESSION_ID')
  }

  // Get comprehensive session details with optimized query
  const { data, error } = await supabase
    .from('exercise_sessions_demo')
    .select(`
      *,
      analysis_reports_demo (
        report_id,
        overall_score,
        confidence_score,
        processing_time_ms,
        created_at
      ),
      notifications_demo (
        notification_id,
        recipient_role,
        status,
        created_at
      )
    `)
    .eq('session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('الجلسة غير موجودة', 404, 'SESSION_NOT_FOUND')
    }
    throw new AppError('فشل في جلب تفاصيل الجلسة', 500, 'DATABASE_ERROR', error)
  }

  // Calculate processing progress
  let progress = 0
  let estimatedTimeRemaining = null

  if (data.processing_started_at) {
    const startTime = new Date(data.processing_started_at).getTime()
    const now = Date.now()
    const elapsed = now - startTime
    const estimatedTotal = 15000 // 15 seconds

    switch (data.status) {
      case 'processing':
        progress = Math.min(Math.floor((elapsed / estimatedTotal) * 100), 95)
        estimatedTimeRemaining = Math.max(0, estimatedTotal - elapsed)
        break
      case 'completed':
        progress = 100
        break
      case 'failed':
        progress = 0
        break
    }
  }

  return NextResponse.json({
    success: true,
    session: {
      sessionId: data.session_id,
      status: data.status,
      progress,
      estimatedTimeRemaining,
      studentName: data.demo_student_name,
      exerciseType: data.demo_exercise_type,
      videoFileSize: data.video_file_size,
      videoDuration: data.video_duration,
      processingStartedAt: data.processing_started_at,
      processingCompletedAt: data.processing_completed_at,
      errorMessage: data.error_message,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      report: data.analysis_reports_demo?.[0] ? {
        reportId: data.analysis_reports_demo[0].report_id,
        overallScore: data.analysis_reports_demo[0].overall_score,
        confidenceScore: data.analysis_reports_demo[0].confidence_score,
        processingTimeMs: data.analysis_reports_demo[0].processing_time_ms,
        createdAt: data.analysis_reports_demo[0].created_at,
        available: true
      } : null,
      notifications: {
        total: data.notifications_demo?.length || 0,
        sent: data.notifications_demo?.filter(n => n.status === 'sent').length || 0,
        byRole: data.notifications_demo?.reduce((acc, n) => {
          acc[n.recipient_role] = n.status
          return acc
        }, {} as Record<string, string>) || {}
      }
    }
  })
}

// Apply middleware
export const POST = withRateLimit(withErrorHandler(completeSession))
export const GET = withRateLimit(withErrorHandler(getCompletionStatus))