import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify student authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Mock student profile data
    const studentProfile = {
      id: user.id,
      name: user.profile?.name || 'الطالب',
      email: user.email,
      dateOfBirth: user.profile?.date_of_birth || '2008-01-01',
      school: 'مدرسة الملك فهد الثانوية',
      grade: 'الصف العاشر',
      guardianId: user.profile?.guardian_id,
      profileImage: null,
      stats: {
        totalSessions: 15,
        averageScore: 85.2,
        improvement: 12.5,
        lastSession: '2025-01-08T10:30:00Z'
      },
      recentReports: [
        {
          reportId: 'report-001',
          overallScore: 88.5,
          exerciseType: 'كرة القدم',
          createdAt: '2025-01-08T10:30:00Z'
        },
        {
          reportId: 'report-002',
          overallScore: 82.1,
          exerciseType: 'كرة السلة',
          createdAt: '2025-01-07T14:20:00Z'
        },
        {
          reportId: 'report-003',
          overallScore: 85.7,
          exerciseType: 'سباحة',
          createdAt: '2025-01-06T16:45:00Z'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      profile: studentProfile
    })

  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الملف الشخصي' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify student authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const body = await request.json()
    const { name, school, grade, profileImage } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'الاسم مطلوب' },
        { status: 400 }
      )
    }

    // In real app, update profile in database
    const updatedProfile = {
      id: user.id,
      name,
      email: user.email,
      school: school || 'مدرسة الملك فهد الثانوية',
      grade: grade || 'الصف العاشر',
      profileImage: profileImage || null,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Error updating student profile:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الملف الشخصي' },
      { status: 500 }
    )
  }
}