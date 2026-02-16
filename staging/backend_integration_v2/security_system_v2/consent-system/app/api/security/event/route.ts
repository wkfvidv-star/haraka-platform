import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// POST /api/security/event - Log high-priority security events
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
    
    // Determine severity level
    const severity = determineSeverity(eventData.action, eventData.riskLevel)
    
    // Create security event entry
    const securityEvent = {
      event_type: eventData.eventType,
      severity: severity,
      action: eventData.action,
      user_id: eventData.userId || 'anonymous',
      resource_type: eventData.resourceType,
      resource_id: eventData.resourceId,
      ip_address: clientIP,
      user_agent: userAgent,
      session_id: eventData.sessionId,
      risk_score: eventData.riskLevel || 5,
      metadata: {
        ...eventData.metadata,
        url: eventData.url,
        referrer: eventData.referrer,
        timestamp: eventData.timestamp,
        requires_review: eventData.requiresReview || false
      },
      created_at: new Date().toISOString()
    }
    
    // Insert into security_events table
    const { data, error } = await supabase
      .from('security_events')
      .insert(securityEvent)
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to log security event' },
        { status: 500 }
      )
    }
    
    // Process based on severity
    await processSecurityEvent(securityEvent)
    
    return NextResponse.json({
      success: true,
      eventId: data.id,
      severity: severity,
      processed: true
    })
    
  } catch (error) {
    console.error('Security event logging error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/security/event - Get security events for dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const severity = searchParams.get('severity')
    const timeRange = searchParams.get('timeRange') || '24h'
    const eventType = searchParams.get('eventType')
    
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
    }
    
    // Build query
    let query = supabase
      .from('security_events')
      .select(`
        *,
        user:user_id(username, full_name, role)
      `)
      .gte('created_at', timeFilter.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)
    
    // Apply filters
    if (severity && severity !== 'all') {
      query = query.eq('severity', severity)
    }
    
    if (eventType && eventType !== 'all') {
      query = query.eq('event_type', eventType)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch security events' },
        { status: 500 }
      )
    }
    
    // Get statistics
    const statsQuery = await supabase
      .from('security_events')
      .select('severity, event_type, created_at')
      .gte('created_at', timeFilter.toISOString())
    
    const statistics = calculateSecurityStatistics(statsQuery.data || [])
    
    return NextResponse.json({
      success: true,
      events: data || [],
      statistics,
      timeRange,
      filters: { severity, eventType }
    })
    
  } catch (error) {
    console.error('Security events fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to determine event severity
function determineSeverity(action: string, riskLevel?: string | number): string {
  const riskScore = typeof riskLevel === 'string' ? 
    (riskLevel === 'high' ? 8 : riskLevel === 'medium' ? 5 : 2) : 
    (riskLevel || 5)
  
  // Critical severity actions
  const criticalActions = [
    'UNAUTHORIZED_ACCESS',
    'DATA_BREACH',
    'SYSTEM_COMPROMISE',
    'ADMIN_PRIVILEGE_ESCALATION'
  ]
  
  // High severity actions
  const highSeverityActions = [
    'MULTIPLE_FAILED_LOGINS',
    'SUSPICIOUS_IP_ACCESS',
    'DATA_EXPORT_BULK',
    'CONSENT_MASS_REVOCATION'
  ]
  
  // Medium severity actions
  const mediumSeverityActions = [
    'CONSENT_REVOKED',
    'DATA_DECRYPT',
    'ADMIN_ACTION',
    'UNUSUAL_ACCESS_PATTERN'
  ]
  
  if (criticalActions.includes(action) || riskScore >= 9) {
    return 'critical'
  } else if (highSeverityActions.includes(action) || riskScore >= 7) {
    return 'high'
  } else if (mediumSeverityActions.includes(action) || riskScore >= 4) {
    return 'medium'
  } else {
    return 'low'
  }
}

// Helper function to process security events based on severity
async function processSecurityEvent(event: any) {
  try {
    switch (event.severity) {
      case 'critical':
        await handleCriticalEvent(event)
        break
      case 'high':
        await handleHighSeverityEvent(event)
        break
      case 'medium':
        await handleMediumSeverityEvent(event)
        break
      default:
        // Low severity events are just logged
        break
    }
  } catch (error) {
    console.error('Error processing security event:', error)
  }
}

// Handle critical security events
async function handleCriticalEvent(event: any) {
  // 1. Create immediate alert
  await supabase.from('security_alerts').insert({
    alert_type: 'critical_security_incident',
    severity: 'critical',
    event_id: event.id,
    user_id: event.user_id,
    action: event.action,
    ip_address: event.ip_address,
    metadata: event.metadata,
    auto_generated: true,
    requires_immediate_action: true,
    created_at: new Date().toISOString()
  })
  
  // 2. In production, this would:
  // - Send immediate notifications to security team
  // - Trigger automated incident response
  // - Potentially block the user/IP temporarily
  // - Escalate to management
  
  console.log(`CRITICAL SECURITY EVENT: ${event.action} by ${event.user_id}`)
}

// Handle high severity events
async function handleHighSeverityEvent(event: any) {
  // 1. Create alert for review
  await supabase.from('security_alerts').insert({
    alert_type: 'high_priority_review',
    severity: 'high',
    event_id: event.id,
    user_id: event.user_id,
    action: event.action,
    ip_address: event.ip_address,
    metadata: event.metadata,
    auto_generated: true,
    requires_review: true,
    created_at: new Date().toISOString()
  })
  
  // 2. Check for patterns (e.g., multiple failed logins)
  if (event.action === 'MULTIPLE_FAILED_LOGINS') {
    await checkForBruteForcePattern(event.ip_address)
  }
  
  console.log(`HIGH SEVERITY EVENT: ${event.action} by ${event.user_id}`)
}

// Handle medium severity events
async function handleMediumSeverityEvent(event: any) {
  // 1. Log for monitoring
  await supabase.from('security_monitoring').insert({
    event_type: event.event_type,
    action: event.action,
    user_id: event.user_id,
    ip_address: event.ip_address,
    risk_score: event.risk_score,
    metadata: event.metadata,
    created_at: new Date().toISOString()
  })
  
  // 2. Update user risk profile
  await updateUserRiskProfile(event.user_id, event.risk_score)
  
  console.log(`MEDIUM SEVERITY EVENT: ${event.action} by ${event.user_id}`)
}

// Helper function to check for brute force patterns
async function checkForBruteForcePattern(ipAddress: string) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  const { data, error } = await supabase
    .from('security_events')
    .select('*')
    .eq('ip_address', ipAddress)
    .eq('action', 'LOGIN_FAILED')
    .gte('created_at', oneHourAgo.toISOString())
  
  if (!error && data && data.length >= 5) {
    // Potential brute force attack detected
    await supabase.from('security_alerts').insert({
      alert_type: 'brute_force_detected',
      severity: 'high',
      ip_address: ipAddress,
      metadata: {
        failed_attempts: data.length,
        time_window: '1_hour',
        pattern_detected: true
      },
      auto_generated: true,
      requires_immediate_action: true,
      created_at: new Date().toISOString()
    })
  }
}

// Helper function to update user risk profile
async function updateUserRiskProfile(userId: string, riskScore: number) {
  if (userId === 'anonymous') return
  
  // Update or create user risk profile
  await supabase.from('user_risk_profiles').upsert({
    user_id: userId,
    current_risk_score: riskScore,
    last_risk_event: new Date().toISOString(),
    risk_events_count: 1 // This would be incremented in a real implementation
  }, {
    onConflict: 'user_id'
  })
}

// Helper function to calculate security statistics
function calculateSecurityStatistics(events: any[]) {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  
  return {
    total_events: events.length,
    critical_events: events.filter(e => e.severity === 'critical').length,
    high_severity_events: events.filter(e => e.severity === 'high').length,
    medium_severity_events: events.filter(e => e.severity === 'medium').length,
    low_severity_events: events.filter(e => e.severity === 'low').length,
    recent_events: events.filter(e => new Date(e.created_at) >= oneHourAgo).length,
    unique_users: [...new Set(events.map(e => e.user_id))].length,
    unique_ips: [...new Set(events.map(e => e.ip_address))].length,
    event_types: events.reduce((acc: any, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {})
  }
}