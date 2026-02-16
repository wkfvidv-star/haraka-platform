import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/consents - Get consent status for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    const guardianId = searchParams.get('guardianId')
    const scope = searchParams.get('scope') || 'video_upload_analysis'

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      )
    }

    // Check if consent exists
    const { data: consent, error } = await supabase
      .from('consents')
      .select('*')
      .eq('child_id', childId)
      .eq('scope', scope)
      .is('revoked_at', null)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching consent:', error)
      return NextResponse.json(
        { error: 'Failed to fetch consent status' },
        { status: 500 }
      )
    }

    const hasConsent = !!consent
    
    return NextResponse.json({
      hasConsent,
      consent: consent || null,
      status: hasConsent ? 'active' : 'none'
    })

  } catch (error) {
    console.error('Consent GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/consents - Create new consent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      childId, 
      guardianId, 
      scope = 'video_upload_analysis',
      version = 'v1.0',
      consentText,
      ipAddress,
      userAgent 
    } = body

    // Validate required fields
    if (!childId || !guardianId) {
      return NextResponse.json(
        { error: 'Child ID and Guardian ID are required' },
        { status: 400 }
      )
    }

    // Get client IP if not provided
    const clientIP = ipAddress || 
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'

    // Get user agent if not provided
    const clientUserAgent = userAgent || 
      request.headers.get('user-agent') || 
      'Unknown'

    // Check if active consent already exists
    const { data: existingConsent } = await supabase
      .from('consents')
      .select('consent_id')
      .eq('child_id', childId)
      .eq('scope', scope)
      .is('revoked_at', null)
      .single()

    if (existingConsent) {
      return NextResponse.json(
        { error: 'Active consent already exists for this student and scope' },
        { status: 409 }
      )
    }

    // Create new consent
    const { data: newConsent, error: insertError } = await supabase
      .from('consents')
      .insert({
        child_id: childId,
        guardian_id: guardianId,
        scope,
        version,
        consent_text: consentText,
        ip_address: clientIP,
        user_agent: clientUserAgent,
        accepted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating consent:', insertError)
      return NextResponse.json(
        { error: 'Failed to create consent' },
        { status: 500 }
      )
    }

    // Log consent creation in audit system
    const { error: auditError } = await supabase
      .from('haraka_audit_logs')
      .insert({
        user_id: guardianId,
        user_role: 'guardian',
        action: 'CONSENT_GRANTED',
        table_name: 'consents',
        record_id: newConsent.consent_id,
        new_values: {
          child_id: childId,
          scope,
          version,
          granted_at: newConsent.accepted_at
        },
        ip_address: clientIP,
        user_agent: clientUserAgent,
        session_id: `sess_${Date.now()}`,
        success: true,
        risk_score: 2,
        timestamp: new Date().toISOString()
      })

    if (auditError) {
      console.error('Error logging consent audit:', auditError)
      // Don't fail the request for audit logging errors
    }

    // Log consent history
    const { error: historyError } = await supabase
      .from('consent_history')
      .insert({
        consent_id: newConsent.consent_id,
        action: 'granted',
        performed_by: guardianId,
        reason: 'Guardian consent granted via web interface',
        new_values: {
          scope,
          version,
          granted_at: newConsent.accepted_at
        },
        ip_address: clientIP,
        user_agent: clientUserAgent
      })

    if (historyError) {
      console.error('Error logging consent history:', historyError)
    }

    return NextResponse.json({
      success: true,
      consent: newConsent,
      message: 'Consent granted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Consent POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}