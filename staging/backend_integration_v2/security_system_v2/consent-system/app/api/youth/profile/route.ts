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

    // Get youth profile with RLS protection
    const { data: profile, error } = await supabase
      .from('youth_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching youth profile:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في جلب البيانات' },
        { status: 500 }
      )
    }

    // If no profile exists, create default one
    if (!profile) {
      const defaultProfile = {
        user_id: user.id,
        name: user.name,
        email: user.email,
        age: null,
        date_of_birth: null,
        region: '',
        preferred_sports: [],
        bio: '',
        privacy_level: 'private',
        emergency_contact: '',
        guardian_contact: '',
        phone_number: '',
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      }

      const { data: newProfile, error: createError } = await supabase
        .from('youth_profiles')
        .insert([defaultProfile])
        .select()
        .single()

      if (createError) {
        console.error('Error creating youth profile:', createError)
        return NextResponse.json(
          { success: false, message: 'خطأ في إنشاء الملف الشخصي' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: newProfile
      })
    }

    return NextResponse.json({
      success: true,
      data: profile
    })

  } catch (error) {
    console.error('Youth profile API error:', error)
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
    
    // Validate required fields
    if (!body.name || !body.email || !body.date_of_birth || !body.region || !body.emergency_contact) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      )
    }

    // Calculate age from date_of_birth
    const birthDate = new Date(body.date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Validate age range for youth (16-30)
    if (age < 16 || age > 30) {
      return NextResponse.json(
        { success: false, message: 'العمر يجب أن يكون بين 16 و 30 سنة' },
        { status: 400 }
      )
    }

    const updateData = {
      name: body.name,
      email: body.email,
      age: age,
      date_of_birth: body.date_of_birth,
      region: body.region,
      preferred_sports: body.preferred_sports || [],
      bio: body.bio || '',
      privacy_level: body.privacy_level || 'private',
      emergency_contact: body.emergency_contact,
      guardian_contact: body.guardian_contact || '',
      phone_number: body.phone_number || '',
      updated_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    }

    // Update profile with RLS protection
    const { data, error } = await supabase
      .from('youth_profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating youth profile:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في تحديث الملف الشخصي' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'تم تحديث الملف الشخصي بنجاح'
    })

  } catch (error) {
    console.error('Youth profile update API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}