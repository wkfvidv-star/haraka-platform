import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Cache for session data to reduce database calls
const sessionCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5000 // 5 seconds cache

// GET /api/demo/sessions/{id}/status - Get session status with caching
async function getSessionStatus(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id

  // Validate session ID format
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    throw new AppError('معرف الجلسة غير صحيح', 400, 'INVALID_SESSION_ID')
  }

  // Check cache first for completed sessions
  const cached = sessionCache.get(sessionId)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    // Only use cache for completed/failed sessions to avoid stale processing data
    if (cached.data.status === 'completed' || cached.data.status === 'failed') {
      return NextResponse.json(cached.data)
    }
  }

  // Get session with related data using optimized query
  const { data, error } = await supabase
    .from('exercise_sessions_demo')
    .select(`
      session_id,
      demo_student_name,
      demo_exercise_type,
      status,
      video_file_size,
      video_duration,
      processing_started_at,
      processing_completed_at,
      error_message,
      created_at,
      updated_at,
      upload_expires_at,
      analysis_reports_demo (
        report_id,
        overall_score,
        confidence_score,
        processing_time_ms,
        created_at
      )
    `)
    .eq('session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('الجلسة غير موجودة', 404, 'SESSION_NOT_FOUND')
    }
    throw new AppError('فشل في جلب حالة الجلسة', 500, 'DATABASE_ERROR', error)
  }

  // Calculate enhanced processing progress
  let progress = 0
  let estimatedTimeRemaining = null
  let processingStage = ''

  switch (data.status) {
    case 'pending':
      progress = 0
      processingStage = 'في انتظار رفع الفيديو'
      break
      
    case 'processing':
      if (data.processing_started_at) {
        const startTime = new Date(data.processing_started_at).getTime()
        const now = Date.now()
        const elapsed = now - startTime
        const estimatedTotal = 20000 // 20 seconds for more realistic timing
        
        // Create realistic progress stages
        if (elapsed < 3000) {
          progress = Math.min(Math.floor((elapsed / 3000) * 25), 25)
          processingStage = 'استخراج الإطارات من الفيديو...'
        } else if (elapsed < 8000) {
          progress = 25 + Math.min(Math.floor(((elapsed - 3000) / 5000) * 35), 35)
          processingStage = 'تحليل الحركات والوضعيات...'
        } else if (elapsed < 15000) {
          progress = 60 + Math.min(Math.floor(((elapsed - 8000) / 7000) * 25), 25)
          processingStage = 'حساب مقاييس الأداء...'
        } else {
          progress = 85 + Math.min(Math.floor(((elapsed - 15000) / 5000) * 10), 10)
          processingStage = 'توليد التوصيات المخصصة...'
        }
        
        progress = Math.min(progress, 95) // Cap at 95% until actually completed
        estimatedTimeRemaining = Math.max(0, estimatedTotal - elapsed)
      } else {
        progress = 5
        processingStage = 'بدء المعالجة...'
      }
      break
      
    case 'completed':
      progress = 100
      processingStage = 'تم إكمال التحليل بنجاح'
      break
      
    case 'failed':
      progress = 0
      processingStage = 'فشل في معالجة الفيديو'
      break
  }

  // Prepare enhanced response
  const response = {
    success: true,
    session: {
      sessionId: data.session_id,
      studentName: data.demo_student_name,
      exerciseType: data.demo_exercise_type,
      status: data.status,
      progress: progress,
      processingStage: processingStage,
      estimatedTimeRemaining: estimatedTimeRemaining,
      videoFileSize: data.video_file_size,
      videoDuration: data.video_duration,
      processingStartedAt: data.processing_started_at,
      processingCompletedAt: data.processing_completed_at,
      errorMessage: data.error_message,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expiresAt: data.upload_expires_at,
      isExpired: data.upload_expires_at ? new Date() > new Date(data.upload_expires_at) : false
    },
    report: null as any,
    metadata: {
      lastChecked: new Date().toISOString(),
      processingDuration: data.processing_started_at && data.processing_completed_at 
        ? new Date(data.processing_completed_at).getTime() - new Date(data.processing_started_at).getTime()
        : null
    }
  }

  // Include report data if available
  if (data.analysis_reports_demo && data.analysis_reports_demo.length > 0) {
    const report = data.analysis_reports_demo[0]
    response.report = {
      reportId: report.report_id,
      overallScore: report.overall_score,
      confidenceScore: report.confidence_score,
      processingTimeMs: report.processing_time_ms,
      createdAt: report.created_at,
      available: true
    }
  }

  // Cache the response for completed/failed sessions
  if (data.status === 'completed' || data.status === 'failed') {
    sessionCache.set(sessionId, { data: response, timestamp: now })
    
    // Clean up old cache entries periodically
    if (Math.random() < 0.1) { // 10% chance
      for (const [key, value] of sessionCache.entries()) {
        if ((now - value.timestamp) > CACHE_TTL * 2) {
          sessionCache.delete(key)
        }
      }
    }
  }

  return NextResponse.json(response)
}

// Validation schema for status updates
const UpdateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed'], {
    errorMap: () => ({ message: 'الحالة يجب أن تكون: pending, processing, completed, أو failed' })
  }),
  errorMessage: z.string().optional()
})

// POST /api/demo/sessions/{id}/status - Update session status (enhanced)
async function updateSessionStatus(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id
  const body = await request.json()
  
  // Validate session ID format
  if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    throw new AppError('معرف الجلسة غير صحيح', 400, 'INVALID_SESSION_ID')
  }

  // Validate input
  const { status, errorMessage } = UpdateStatusSchema.parse(body)

  // Get current session state
  const { data: currentSession, error: fetchError } = await supabase
    .from('exercise_sessions_demo')
    .select('status, processing_started_at')
    .eq('session_id', sessionId)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('الجلسة غير موجودة', 404, 'SESSION_NOT_FOUND')
    }
    throw new AppError('فشل في جلب الجلسة', 500, 'DATABASE_ERROR', fetchError)
  }

  // Prepare update data with business logic
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  }

  // Handle status-specific updates
  switch (status) {
    case 'processing':
      if (!currentSession.processing_started_at) {
        updateData.processing_started_at = new Date().toISOString()
      }
      updateData.error_message = null // Clear any previous errors
      break
      
    case 'completed':
      updateData.processing_completed_at = new Date().toISOString()
      updateData.error_message = null
      break
      
    case 'failed':
      if (errorMessage) {
        updateData.error_message = errorMessage
      }
      break
      
    case 'pending':
      // Reset processing timestamps if going back to pending
      updateData.processing_started_at = null
      updateData.processing_completed_at = null
      updateData.error_message = null
      break
  }

  // Update session
  const { data, error } = await supabase
    .from('exercise_sessions_demo')
    .update(updateData)
    .eq('session_id', sessionId)
    .select()
    .single()

  if (error) {
    throw new AppError('فشل في تحديث حالة الجلسة', 500, 'DATABASE_ERROR', error)
  }

  if (!data) {
    throw new AppError('الجلسة غير موجودة', 404, 'SESSION_NOT_FOUND')
  }

  // Clear cache for this session
  sessionCache.delete(sessionId)

  // Enhanced audit logging
  await supabase.rpc('log_audit_event', {
    p_user_id: 'demo_system',
    p_user_role: 'system',
    p_action: 'DEMO_STATUS_UPDATED',
    p_resource_type: 'exercise_session',
    p_resource_id: sessionId,
    p_old_values: { status: currentSession.status },
    p_new_values: { 
      status, 
      error_message: errorMessage,
      updated_at: updateData.updated_at 
    },
    p_ip_address: null,
    p_user_agent: 'Demo Status API',
    p_session_id: null,
    p_success: true,
    p_error_message: null,
    p_risk_score: status === 'failed' ? 3 : 1,
    p_meta: { 
      demo_mode: true, 
      manual_update: true,
      previous_status: currentSession.status,
      status_transition: `${currentSession.status} -> ${status}`
    }
  })

  return NextResponse.json({
    success: true,
    message: 'تم تحديث حالة الجلسة بنجاح',
    session: {
      sessionId: data.session_id,
      status: data.status,
      errorMessage: data.error_message,
      processingStartedAt: data.processing_started_at,
      processingCompletedAt: data.processing_completed_at,
      updatedAt: data.updated_at
    },
    transition: {
      from: currentSession.status,
      to: status,
      timestamp: updateData.updated_at
    }
  })
}

// Apply middleware
export const GET = withRateLimit(withErrorHandler(getSessionStatus))
export const POST = withRateLimit(withErrorHandler(updateSessionStatus))