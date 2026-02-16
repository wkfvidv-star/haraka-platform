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

    // Get privacy settings with RLS protection
    const { data: settings, error } = await supabase
      .from('youth_privacy_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching privacy settings:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في جلب إعدادات الخصوصية' },
        { status: 500 }
      )
    }

    // If no settings exist, create default ones
    if (!settings) {
      const defaultSettings = {
        user_id: user.id,
        profile_visibility: false,
        activity_tracking: true,
        performance_sharing: false,
        data_analytics: true,
        research_participation: false,
        marketing_communications: false,
        data_retention_period: 365,
        consent_status: 'active',
        consent_date: new Date().toISOString(),
        auto_archive_enabled: true,
        created_at: new Date().toISOString()
      }

      const { data: newSettings, error: createError } = await supabase
        .from('youth_privacy_settings')
        .insert([defaultSettings])
        .select()
        .single()

      if (createError) {
        console.error('Error creating privacy settings:', createError)
        return NextResponse.json(
          { success: false, message: 'خطأ في إنشاء إعدادات الخصوصية' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: newSettings
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error('Youth privacy API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()

    // Check if consent is withdrawn
    const { data: currentSettings } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status')
      .eq('user_id', user.id)
      .single()

    if (currentSettings?.consent_status === 'withdrawn') {
      return NextResponse.json(
        { success: false, message: 'لا يمكن تحديث الإعدادات بعد سحب الموافقة' },
        { status: 403 }
      )
    }

    const updateData = {
      profile_visibility: body.profile_visibility ?? false,
      activity_tracking: body.activity_tracking ?? true,
      performance_sharing: body.performance_sharing ?? false,
      data_analytics: body.data_analytics ?? true,
      research_participation: body.research_participation ?? false,
      marketing_communications: body.marketing_communications ?? false,
      data_retention_period: body.data_retention_period ?? 365,
      auto_archive_enabled: body.auto_archive_enabled ?? true,
      updated_at: new Date().toISOString()
    }

    // Update privacy settings with RLS protection
    const { data, error } = await supabase
      .from('youth_privacy_settings')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating privacy settings:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في تحديث إعدادات الخصوصية' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'تم تحديث إعدادات الخصوصية بنجاح'
    })

  } catch (error) {
    console.error('Youth privacy update API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}