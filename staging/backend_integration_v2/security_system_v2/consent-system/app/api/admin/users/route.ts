import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    // Parse pagination parameters with defaults
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 10
    const offset = (pageNum - 1) * limitNum

    // Mock users data - in real app, query from database
    const mockUsers = [
      {
        id: 'user-001',
        name: 'أحمد محمد الطالب',
        email: 'ahmed.student@example.com',
        phone: '+966501234567',
        role: 'student',
        status: 'active',
        lastLogin: '2025-01-08T10:30:00Z',
        createdAt: '2024-09-01T08:00:00Z',
        schoolName: 'مدرسة الملك فهد الثانوية',
        region: 'الرياض'
      },
      {
        id: 'user-002',
        name: 'فاطمة علي المعلمة',
        email: 'fatima.teacher@example.com',
        phone: '+966507654321',
        role: 'teacher',
        status: 'active',
        lastLogin: '2025-01-08T09:15:00Z',
        createdAt: '2024-08-15T10:00:00Z',
        schoolName: 'مدرسة الأميرة نورة',
        region: 'جدة'
      },
      {
        id: 'user-003',
        name: 'محمد سالم ولي الأمر',
        email: 'mohammed.guardian@example.com',
        phone: '+966502468135',
        role: 'guardian',
        status: 'active',
        lastLogin: '2025-01-07T20:45:00Z',
        createdAt: '2024-09-10T14:30:00Z',
        region: 'الرياض'
      }
    ]

    // Apply filters
    let filteredUsers = mockUsers

    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role)
    }

    if (status) {
      filteredUsers = filteredUsers.filter(u => u.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredUsers.length
    const paginatedUsers = filteredUsers.slice(offset, offset + limitNum)

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المستخدمين' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, role, phone, schoolName, region } = body

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والدور مطلوبة' },
        { status: 400 }
      )
    }

    // In real app, create user in database
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || null,
      role,
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
      schoolName: schoolName || null,
      region: region || null
    }

    return NextResponse.json({ 
      message: 'تم إنشاء المستخدم بنجاح',
      user: newUser 
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المستخدم' },
      { status: 500 }
    )
  }
}