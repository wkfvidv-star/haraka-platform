import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/audit/log - Log audit events from frontend
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()
    
    // Extract client information
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    
    // Validate required fields
    if (!eventData.action || !eventData.eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: action and eventType' },
        { status: 400 }
      )
    }
    
    // Determine user role and risk score
    const userRole = await getUserRole(eventData.userId)
    const riskScore = calculateRiskScore(eventData.action, eventData.eventType, userRole)
    
    // Prepare audit log entry
    const auditEntry = {
      user_id: eventData.userId || 'anonymous',
      user_role: userRole || 'unknown',
      action: eventData.action,
      resource_type: eventData.resourceType || 'unknown',
      resource_id: eventData.resourceId,
      old_values: null,
      new_values: eventData.metadata || {},
      ip_address: clientIP,
      user_agent: userAgent,
      session_id: eventData.sessionId,
      success: true,
      error_message: null,
      risk_score: riskScore,
      meta: {
        event_type: eventData.eventType,
        url: eventData.url,
        referrer: eventData.referrer,
        timestamp: eventData.timestamp,
        frontend_tracking: true
      }
    }
    
    // Log to database using the enhanced audit function
    const { data, error } = await supabase.rpc('log_audit_event', {
      p_user_id: auditEntry.user_id,
      p_user_role: auditEntry.user_role,
      p_action: auditEntry.action,
      p_resource_type: auditEntry.resource_type,
      p_resource_id: auditEntry.resource_id,
      p_old_values: auditEntry.old_values,
      p_new_values: auditEntry.new_values,
      p_ip_address: auditEntry.ip_address,
      p_user_agent: auditEntry.user_agent,
      p_session_id: auditEntry.session_id,
      p_success: auditEntry.success,
      p_error_message: auditEntry.error_message,
      p_risk_score: auditEntry.risk_score,
      p_meta: auditEntry.meta
    })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to log audit event' },
        { status: 500 }
      )
    }
    
    // For high-risk events, trigger additional security measures
    if (riskScore >= 7) {
      await triggerSecurityAlert(auditEntry)
    }
    
    return NextResponse.json({
      success: true,
      logId: data,
      riskScore: riskScore
    })
    
  } catch (error) {
    console.error('Audit logging error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get user role
async function getUserRole(userId: string): Promise<string> {
  if (!userId || userId === 'anonymous') {
    return 'anonymous'
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error || !data) {
      return 'unknown'
    }
    
    return data.role
  } catch (error) {
    console.error('Error fetching user role:', error)
    return 'unknown'
  }
}

// Helper function to calculate risk score
function calculateRiskScore(action: string, eventType: string, userRole: string): number {
  let baseScore = 1
  
  // Risk scoring based on action type
  const actionRiskMap: Record<string, number> = {
    'UPLOAD_VIDEO': 3,
    'CONSENT_GRANTED': 2,
    'CONSENT_REVOKED': 4,
    'DATA_DECRYPT': 6,
    'DATA_DELETE': 8,
    'VIEW_REPORT': 2,
    'ADMIN_ACTION': 5,
    'LOGIN_FAILED': 6,
    'UNAUTHORIZED_ACCESS': 9,
    'CLICK': 1,
    'PAGE_VIEW': 1,
    'FORM_SUBMIT': 2
  }
  
  baseScore = actionRiskMap[action] || 1
  
  // Adjust based on event type
  if (eventType === 'security_incident') {
    baseScore += 3
  } else if (eventType === 'data_access') {
    baseScore += 2
  } else if (eventType === 'consent_action') {
    baseScore += 1
  }
  
  // Adjust based on user role
  if (userRole === 'admin') {
    baseScore += 1 // Admin actions are inherently more sensitive
  } else if (userRole === 'anonymous') {
    baseScore += 2 // Anonymous actions are more suspicious
  }
  
  // Cap at 10
  return Math.min(baseScore, 10)
}

// Helper function to trigger security alerts for high-risk events
async function triggerSecurityAlert(auditEntry: any) {
  try {
    // Log to security events table
    await supabase.from('security_alerts').insert({
      alert_type: 'high_risk_activity',
      severity: 'high',
      user_id: auditEntry.user_id,
      action: auditEntry.action,
      resource_type: auditEntry.resource_type,
      risk_score: auditEntry.risk_score,
      ip_address: auditEntry.ip_address,
      user_agent: auditEntry.user_agent,
      metadata: auditEntry.meta,
      created_at: new Date().toISOString()
    })
    
    // In a real system, this would also:
    // - Send notifications to security team
    // - Trigger automated response measures
    // - Update threat intelligence feeds
    
    console.log(`Security alert triggered for high-risk activity: ${auditEntry.action}`)
  } catch (error) {
    console.error('Error triggering security alert:', error)
  }
}

// GET /api/audit/log - Get recent audit logs (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const riskLevel = searchParams.get('riskLevel')
    const timeRange = searchParams.get('timeRange') || '24h'
    
    // Calculate time filter
    let timeFilter = new Date()
    switch (timeRange) {
      case '1h':
        timeFilter.setHours(timeFilter.getHours() - 1)
        break
      case '24h':
        timeFilter.setDate(timeFilter.getDate() - 1)
        break
      case '7d':
        timeFilter.setDate(timeFilter.getDate() - 7)
        break
      case '30d':
        timeFilter.setDate(timeFilter.getDate() - 30)
        break
      default:
        timeFilter.setDate(timeFilter.getDate() - 1)
    }
    
    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', timeFilter.toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply risk level filter
    if (riskLevel && riskLevel !== 'all') {
      const riskThreshold = riskLevel === 'high' ? 7 : riskLevel === 'medium' ? 4 : 1
      query = query.gte('risk_score', riskThreshold)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        limit,
        offset,
        total: data?.length || 0
      }
    })
    
  } catch (error) {
    console.error('Audit fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}