import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json(
        { success: false, message: 'صلاحيات غير كافية' },
        { status: 403 }
      )
    }

    // Check privacy settings
    const { data: privacySettings } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status, activity_tracking')
      .eq('user_id', user.id)
      .single()

    if (privacySettings?.consent_status === 'withdrawn' || !privacySettings?.activity_tracking) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'لا يمكن عرض الجلسات بسبب إعدادات الخصوصية'
      })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const sport = url.searchParams.get('sport')
    const status = url.searchParams.get('status')
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('video_uploads')
      .select(`
        id,
        filename,
        sport_type,
        file_size,
        processing_status,
        created_at,
        updated_at,
        analysis_results (
          id,
          overall_score,
          balance_score,
          speed_score,
          accuracy_score,
          technique_score,
          created_at
        )
      `)
      .eq('user_id', user.id)

    // Apply filters
    if (sport && sport !== 'all') {
      query = query.eq('sport_type', sport)
    }

    if (status && status !== 'all') {
      query = query.eq('processing_status', status)
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('video_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get paginated results
    const { data: sessions, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching youth sessions:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في جلب الجلسات' },
        { status: 500 }
      )
    }

    // Format the response
    const formattedSessions = (sessions || []).map(session => ({
      id: session.id,
      filename: session.filename,
      sport_type: session.sport_type || 'غير محدد',
      file_size: session.file_size,
      processing_status: session.processing_status,
      created_at: session.created_at,
      updated_at: session.updated_at,
      analysis: session.analysis_results?.[0] || null,
      has_analysis: !!session.analysis_results?.[0]
    }))

    return NextResponse.json({
      success: true,
      data: formattedSessions,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasNext: page * limit < (totalCount || 0),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Youth sessions API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json(
        { success: false, message: 'صلاحيات غير كافية' },
        { status: 403 }
      )
    }

    // Check privacy settings
    const { data: privacySettings } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status, activity_tracking')
      .eq('user_id', user.id)
      .single()

    if (privacySettings?.consent_status === 'withdrawn') {
      return NextResponse.json(
        { success: false, message: 'لا يمكن إنشاء جلسات جديدة بعد سحب الموافقة' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    if (!body.sport_type || !body.session_notes) {
      return NextResponse.json(
        { success: false, message: 'نوع الرياضة وملاحظات الجلسة مطلوبة' },
        { status: 400 }
      )
    }

    // Create a new training session
    const sessionData = {
      user_id: user.id,
      user_type: 'youth',
      sport_type: body.sport_type,
      session_notes: body.session_notes,
      session_goals: body.session_goals || [],
      planned_duration: body.planned_duration || null,
      status: 'planned',
      created_at: new Date().toISOString()
    }

    const { data: session, error } = await supabase
      .from('training_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) {
      console.error('Error creating training session:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في إنشاء الجلسة' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session,
      message: 'تم إنشاء الجلسة بنجاح'
    })

  } catch (error) {
    console.error('Youth session creation API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}