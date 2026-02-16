import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    // Check current consent status
    const { data: currentSettings, error: fetchError } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status, consent_date')
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching current consent:', fetchError)
      return NextResponse.json(
        { success: false, message: 'خطأ في جلب حالة الموافقة' },
        { status: 500 }
      )
    }

    if (currentSettings?.consent_status === 'withdrawn') {
      return NextResponse.json(
        { success: false, message: 'تم سحب الموافقة مسبقاً' },
        { status: 400 }
      )
    }

    const withdrawalDate = new Date().toISOString()
    const archiveDate = new Date()
    archiveDate.setDate(archiveDate.getDate() + 30) // Archive after 30 days

    // Update consent status to withdrawn
    const { error: updateError } = await supabase
      .from('youth_privacy_settings')
      .update({
        consent_status: 'withdrawn',
        withdrawal_date: withdrawalDate,
        scheduled_archive_date: archiveDate.toISOString(),
        profile_visibility: false,
        activity_tracking: false,
        performance_sharing: false,
        data_analytics: false,
        research_participation: false,
        marketing_communications: false,
        updated_at: withdrawalDate
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error withdrawing consent:', updateError)
      return NextResponse.json(
        { success: false, message: 'خطأ في سحب الموافقة' },
        { status: 500 }
      )
    }

    // Log the withdrawal for audit trail
    const { error: logError } = await supabase
      .from('consent_audit_log')
      .insert([{
        user_id: user.id,
        user_type: 'youth',
        action: 'consent_withdrawn',
        timestamp: withdrawalDate,
        details: {
          withdrawal_reason: 'user_initiated',
          scheduled_archive_date: archiveDate.toISOString(),
          original_consent_date: currentSettings?.consent_date
        }
      }])

    if (logError) {
      console.error('Error logging consent withdrawal:', logError)
      // Don't fail the request if logging fails
    }

    // Schedule archive job (in a real system, this would trigger a background job)
    const { error: scheduleError } = await supabase
      .from('archive_jobs')
      .insert([{
        user_id: user.id,
        user_type: 'youth',
        scheduled_date: archiveDate.toISOString(),
        status: 'scheduled',
        job_type: 'data_archive',
        created_at: withdrawalDate
      }])

    if (scheduleError) {
      console.error('Error scheduling archive job:', scheduleError)
      // Don't fail the request if scheduling fails
    }

    return NextResponse.json({
      success: true,
      message: 'تم سحب الموافقة بنجاح. سيتم أرشفة البيانات خلال 30 يوماً',
      data: {
        withdrawal_date: withdrawalDate,
        archive_date: archiveDate.toISOString()
      }
    })

  } catch (error) {
    console.error('Consent withdrawal API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}