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
const CreateSessionSchema = z.object({
  studentName: z.string().min(1, 'اسم الطالب مطلوب'),
  exerciseType: z.string().min(1, 'نوع التمرين مطلوب'),
  studentId: z.string().optional()
})

// POST /api/student/sessions - Create new exercise session
async function createStudentSession(request: NextRequest) {
  const body = await request.json()
  const validatedData = CreateSessionSchema.parse(body)
  
  const { studentName, exerciseType, studentId } = validatedData
  
  // Generate session ID
  const sessionId = crypto.randomUUID()
  
  // Set expiration time (24 hours from now)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  // Create session in database
  const { data, error } = await supabase
    .from('exercise_sessions_demo')
    .insert({
      session_id: sessionId,
      demo_student_name: studentName,
      demo_exercise_type: exerciseType,
      student_id: studentId || null,
      status: 'pending',
      upload_expires_at: expiresAt.toISOString(),
      is_demo: true,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new AppError('فشل في إنشاء جلسة التمرين', 500, 'DATABASE_ERROR', error)
  }

  // Log session creation
  await supabase.rpc('log_audit_event', {
    p_user_id: studentId || 'anonymous_student',
    p_user_role: 'student',
    p_action: 'SESSION_CREATED',
    p_resource_type: 'exercise_session',
    p_resource_id: sessionId,
    p_old_values: null,
    p_new_values: {
      student_name: studentName,
      exercise_type: exerciseType,
      expires_at: expiresAt.toISOString()
    },
    p_ip_address: null,
    p_user_agent: 'Student Interface',
    p_session_id: sessionId,
    p_success: true,
    p_error_message: null,
    p_risk_score: 1,
    p_meta: { interface: 'student', demo_mode: true }
  })

  return NextResponse.json({
    success: true,
    message: 'تم إنشاء جلسة التمرين بنجاح',
    session: {
      sessionId: data.session_id,
      studentName: data.demo_student_name,
      exerciseType: data.demo_exercise_type,
      status: data.status,
      expiresAt: data.upload_expires_at,
      createdAt: data.created_at
    }
  }, { status: 201 })
}

// GET /api/student/sessions - Get student sessions
async function getStudentSessions(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('exercise_sessions_demo')
    .select(`
      session_id,
      demo_student_name,
      demo_exercise_type,
      status,
      created_at,
      updated_at,
      analysis_reports_demo (
        report_id,
        overall_score,
        created_at
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (studentId) {
    query = query.eq('student_id', studentId)
  }

  const { data, error } = await query

  if (error) {
    throw new AppError('فشل في جلب جلسات التمرين', 500, 'DATABASE_ERROR', error)
  }

  return NextResponse.json({
    success: true,
    sessions: data?.map(session => ({
      sessionId: session.session_id,
      studentName: session.demo_student_name,
      exerciseType: session.demo_exercise_type,
      status: session.status,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      report: session.analysis_reports_demo?.[0] ? {
        reportId: session.analysis_reports_demo[0].report_id,
        overallScore: session.analysis_reports_demo[0].overall_score,
        createdAt: session.analysis_reports_demo[0].created_at
      } : null
    })) || [],
    pagination: {
      limit,
      offset,
      total: data?.length || 0
    }
  })
}

// Apply middleware
export const POST = withRateLimit(withErrorHandler(createStudentSession))
export const GET = withRateLimit(withErrorHandler(getStudentSessions))