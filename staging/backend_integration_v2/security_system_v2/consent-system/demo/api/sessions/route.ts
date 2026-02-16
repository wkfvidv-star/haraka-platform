import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError, validateFileSize } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Validation schemas
const CreateSessionSchema = z.object({
  studentName: z.string().min(1, 'اسم الطالب مطلوب').max(100, 'اسم الطالب طويل جداً'),
  exerciseType: z.string().min(1, 'نوع التمرين مطلوب').max(50, 'نوع التمرين طويل جداً'),
  uploadExpiresMinutes: z.number().min(1, 'يجب أن تكون مدة انتهاء الصلاحية دقيقة واحدة على الأقل').max(60, 'مدة انتهاء الصلاحية لا يمكن أن تتجاوز 60 دقيقة')
})

const GetSessionsSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional()
})

// POST /api/demo/sessions - Create new demo session
async function createDemoSession(request: NextRequest) {
  const body = await request.json()
  
  // Validate input
  const validatedData = CreateSessionSchema.parse(body)
  const { studentName, exerciseType, uploadExpiresMinutes } = validatedData

  // Create demo session using database function
  const { data, error } = await supabase.rpc('create_demo_session', {
    p_student_name: studentName,
    p_exercise_type: exerciseType,
    p_upload_expires_minutes: uploadExpiresMinutes
  })

  if (error) {
    console.error('Database error:', error)
    throw new AppError('فشل في إنشاء الجلسة التجريبية', 500, 'DATABASE_ERROR', error)
  }

  if (!data || data.length === 0) {
    throw new AppError('لم يتم إرجاع بيانات الجلسة', 500, 'NO_SESSION_DATA')
  }

  const sessionData = data[0]

  // Return session details with progress field
  return NextResponse.json({
    success: true,
    session: {
      sessionId: sessionData.session_id,
      uploadUrl: sessionData.upload_url,
      expiresAt: sessionData.expires_at,
      studentName: studentName,
      exerciseType: exerciseType,
      status: 'pending',
      progress: 0 // Initialize progress
    },
    message: 'تم إنشاء الجلسة التجريبية بنجاح'
  }, { status: 201 })
}

// GET /api/demo/sessions - List recent demo sessions
async function getDemoSessions(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Validate query parameters
  const queryData = GetSessionsSchema.parse({
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    status: searchParams.get('status') || undefined
  })

  const { limit, status } = queryData

  // Build query
  let query = supabase
    .from('exercise_sessions_demo')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit!)

  // Apply status filter if provided
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Database error:', error)
    throw new AppError('فشل في جلب الجلسات التجريبية', 500, 'DATABASE_ERROR', error)
  }

  // Transform data for response
  const sessions = (data || []).map(session => ({
    sessionId: session.session_id,
    studentName: session.demo_student_name,
    exerciseType: session.demo_exercise_type,
    status: session.status,
    progress: session.status === 'pending' ? 0 : 
             session.status === 'processing' ? 50 : 
             session.status === 'completed' ? 100 : 0,
    uploadUrl: session.upload_url,
    expiresAt: session.upload_expires_at,
    videoFileSize: session.video_file_size,
    videoDuration: session.video_duration,
    processingStartedAt: session.processing_started_at,
    processingCompletedAt: session.processing_completed_at,
    errorMessage: session.error_message,
    createdAt: session.created_at,
    updatedAt: session.updated_at
  }))

  return NextResponse.json({
    success: true,
    sessions,
    count: sessions.length,
    filters: { status, limit }
  })
}

// Apply rate limiting and error handling
export const POST = withRateLimit(withErrorHandler(createDemoSession))
export const GET = withRateLimit(withErrorHandler(getDemoSessions))