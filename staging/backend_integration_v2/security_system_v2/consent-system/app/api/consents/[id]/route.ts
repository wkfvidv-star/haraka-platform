import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DELETE /api/consents/[id] - Revoke consent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consentId = params.id
    const { searchParams } = new URL(request.url)
    const guardianId = searchParams.get('guardianId')
    const reason = searchParams.get('reason') || 'Guardian revoked consent via web interface'

    if (!guardianId) {
      return NextResponse.json(
        { error: 'Guardian ID is required' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const clientIP = request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    const clientUserAgent = request.headers.get('user-agent') || 'Unknown'

    // First, get the consent to verify ownership and that it's active
    const { data: consent, error: fetchError } = await supabase
      .from('consents')
      .select('*')
      .eq('consent_id', consentId)
      .eq('guardian_id', guardianId)
      .is('revoked_at', null)
      .single()

    if (fetchError || !consent) {
      return NextResponse.json(
        { error: 'Consent not found or already revoked' },
        { status: 404 }
      )
    }

    // Revoke the consent
    const { data: revokedConsent, error: updateError } = await supabase
      .from('consents')
      .update({
        revoked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('consent_id', consentId)
      .eq('guardian_id', guardianId)
      .is('revoked_at', null)
      .select()
      .single()

    if (updateError) {
      console.error('Error revoking consent:', updateError)
      return NextResponse.json(
        { error: 'Failed to revoke consent' },
        { status: 500 }
      )
    }

    // Log consent revocation in audit system
    const { error: auditError } = await supabase
      .from('haraka_audit_logs')
      .insert({
        user_id: guardianId,
        user_role: 'guardian',
        action: 'CONSENT_REVOKED',
        table_name: 'consents',
        record_id: consentId,
        old_values: {
          revoked_at: null
        },
        new_values: {
          revoked_at: revokedConsent.revoked_at,
          reason
        },
        ip_address: clientIP,
        user_agent: clientUserAgent,
        session_id: `sess_${Date.now()}`,
        success: true,
        risk_score: 3,
        timestamp: new Date().toISOString()
      })

    if (auditError) {
      console.error('Error logging consent revocation audit:', auditError)
    }

    // Log consent history
    const { error: historyError } = await supabase
      .from('consent_history')
      .insert({
        consent_id: consentId,
        action: 'revoked',
        performed_by: guardianId,
        reason,
        old_values: {
          revoked_at: null
        },
        new_values: {
          revoked_at: revokedConsent.revoked_at
        },
        ip_address: clientIP,
        user_agent: clientUserAgent
      })

    if (historyError) {
      console.error('Error logging consent history:', historyError)
    }

    return NextResponse.json({
      success: true,
      consent: revokedConsent,
      message: 'Consent revoked successfully'
    })

  } catch (error) {
    console.error('Consent DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/consents/[id] - Get specific consent details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consentId = params.id
    const { searchParams } = new URL(request.url)
    const guardianId = searchParams.get('guardianId')

    // Get consent with related user information
    let query = supabase
      .from('consents')
      .select(`
        *,
        child:child_id(id, username, full_name, email),
        guardian:guardian_id(id, username, full_name, email)
      `)
      .eq('consent_id', consentId)

    // If guardianId is provided, filter by it (for security)
    if (guardianId) {
      query = query.eq('guardian_id', guardianId)
    }

    const { data: consent, error } = await query.single()

    if (error || !consent) {
      return NextResponse.json(
        { error: 'Consent not found' },
        { status: 404 }
      )
    }

    // Get consent history
    const { data: history, error: historyError } = await supabase
      .from('consent_history')
      .select('*')
      .eq('consent_id', consentId)
      .order('performed_at', { ascending: false })

    if (historyError) {
      console.error('Error fetching consent history:', historyError)
    }

    return NextResponse.json({
      consent,
      history: history || [],
      status: consent.revoked_at ? 'revoked' : 'active'
    })

  } catch (error) {
    console.error('Consent GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}