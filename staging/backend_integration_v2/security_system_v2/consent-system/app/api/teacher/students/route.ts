import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify teacher authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get query parameters with defaults
    const searchParams = request.nextUrl.searchParams
    const grade = searchParams.get('grade')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Mock students data - in real app, query with RLS to ensure teacher can only see their students
    const mockStudents = [
      {
        id: 'student-001',
        name: 'أحمد محمد',
        email: 'ahmed@student.edu.sa',
        grade: 'الصف العاشر',
        status: 'active',
        enrolledAt: '2024-09-01T08:00:00Z',
        lastActivity: '2025-01-08T10:30:00Z',
        totalSessions: 25,
        averageScore: 87.5,
        guardian: {
          name: 'محمد والد أحمد',
          email: 'guardian1@example.com',
          phone: '+966501234567'
        }
      },
      {
        id: 'student-002',
        name: 'فاطمة علي',
        email: 'fatima@student.edu.sa',
        grade: 'الصف التاسع',
        status: 'active',
        enrolledAt: '2024-09-15T09:00:00Z',
        lastActivity: '2025-01-07T14:20:00Z',
        totalSessions: 18,
        averageScore: 92.1,
        guardian: {
          name: 'علي والد فاطمة',
          email: 'guardian2@example.com',
          phone: '+966507654321'
        }
      },
      {
        id: 'student-003',
        name: 'يوسف خالد',
        email: 'youssef@student.edu.sa',
        grade: 'الصف الحادي عشر',
        status: 'inactive',
        enrolledAt: '2024-08-20T10:30:00Z',
        lastActivity: '2024-12-15T16:45:00Z',
        totalSessions: 42,
        averageScore: 78.9,
        guardian: {
          name: 'خالد والد يوسف',
          email: 'guardian3@example.com',
          phone: '+966502468135'
        }
      }
    ]

    // Apply filters
    let filteredStudents = mockStudents

    if (grade) {
      filteredStudents = filteredStudents.filter(s => s.grade === grade)
    }

    if (status) {
      filteredStudents = filteredStudents.filter(s => s.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredStudents = filteredStudents.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredStudents.length
    const paginatedStudents = filteredStudents.slice(offset, offset + limit)

    // Calculate class stats
    const stats = {
      totalStudents: total,
      activeStudents: filteredStudents.filter(s => s.status === 'active').length,
      averageClassScore: filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / (filteredStudents.length || 1),
      totalSessions: filteredStudents.reduce((sum, s) => sum + s.totalSessions, 0)
    }

    return NextResponse.json({
      success: true,
      students: paginatedStudents,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الطلاب' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify teacher authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, grade, guardianEmail, guardianPhone } = body

    // Validate required fields
    if (!name || !email || !grade || !guardianEmail) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والصف وبريد ولي الأمر مطلوبة' },
        { status: 400 }
      )
    }

    // In real app, create student in database with proper RLS
    const newStudent = {
      id: `student-${Date.now()}`,
      name,
      email,
      grade,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      lastActivity: null,
      totalSessions: 0,
      averageScore: 0,
      guardian: {
        email: guardianEmail,
        phone: guardianPhone || null
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الطالب بنجاح',
      student: newStudent
    })

  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة الطالب' },
      { status: 500 }
    )
  }
}