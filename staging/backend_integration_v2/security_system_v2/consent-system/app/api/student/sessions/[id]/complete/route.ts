import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'
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

// POST /api/student/sessions/{id}/complete - Complete video upload
async function completeStudentSession(
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

  // Check if session exists and is valid
  const { data: sessionCheck, error: sessionError } = await supabase
    .from('exercise_sessions_demo')
    .select('session_id, status, upload_expires_at, demo_student_name')
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
  if (sessionCheck.upload_expires_at && new Date() > new Date(sessionCheck.upload_expires_at)) {
    throw new AppError('انتهت صلاحية الجلسة', 400, 'SESSION_EXPIRED')
  }

  // Update session with video details
  const { data, error } = await supabase
    .from('exercise_sessions_demo')
    .update({
      video_file_path: videoFilePath,
      video_file_size: videoFileSize,
      video_duration: videoDuration,
      status: 'processing',
      processing_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('session_id', sessionId)
    .select()
    .single()

  if (error) {
    throw new AppError('فشل في تحديث الجلسة', 500, 'DATABASE_ERROR', error)
  }

  // Start analysis process (async)
  processAnalysisJob(sessionId).catch(error => {
    console.error('Analysis job failed:', error)
    // Mark session as failed
    supabase
      .from('exercise_sessions_demo')
      .update({
        status: 'failed',
        error_message: 'فشل في تحليل الفيديو',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
  })

  // Log completion
  await supabase.rpc('log_audit_event', {
    p_user_id: 'student_user',
    p_user_role: 'student',
    p_action: 'VIDEO_UPLOADED',
    p_resource_type: 'exercise_session',
    p_resource_id: sessionId,
    p_old_values: { status: 'pending' },
    p_new_values: {
      status: 'processing',
      video_file_size: videoFileSize,
      video_duration: videoDuration
    },
    p_ip_address: null,
    p_user_agent: 'Student Interface',
    p_session_id: sessionId,
    p_success: true,
    p_error_message: null,
    p_risk_score: 1,
    p_meta: { interface: 'student', student_name: sessionCheck.demo_student_name }
  })

  return NextResponse.json({
    success: true,
    message: 'تم رفع الفيديو بنجاح، بدأ التحليل',
    sessionId: sessionId,
    status: 'processing',
    estimatedCompletionTime: '15-30 ثانية'
  })
}

// Analysis processing function
async function processAnalysisJob(sessionId: string) {
  // Simulate AI processing delay
  const processingDelay = 2000 + Math.random() * 3000
  await new Promise(resolve => setTimeout(resolve, processingDelay))

  try {
    // Generate analysis report
    const { data: reportId, error } = await supabase.rpc('generate_demo_analysis_report', {
      p_session_id: sessionId
    })

    if (error) {
      throw new Error(`فشل في توليد تقرير التحليل: ${error.message}`)
    }

    console.log(`✅ Student analysis completed for session ${sessionId}, report: ${reportId}`)

  } catch (error) {
    console.error('❌ Student analysis processing error:', error)
    throw error
  }
}

// Apply middleware
export const POST = withRateLimit(withErrorHandler(completeStudentSession))