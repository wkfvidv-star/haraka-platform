import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify coach authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'coach') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const sport = searchParams.get('sport')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Mock athletes data - in real app, query from database with RLS
    const mockAthletes = [
      {
        id: 'athlete-001',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        sport: 'كرة القدم',
        level: 'متقدم',
        status: 'active',
        joinedAt: '2024-09-01T08:00:00Z',
        lastSession: '2025-01-08T10:30:00Z',
        totalSessions: 45,
        averageScore: 85.5,
        guardian: {
          name: 'محمد والد أحمد',
          email: 'guardian1@example.com',
          phone: '+966501234567'
        }
      },
      {
        id: 'athlete-002',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        sport: 'كرة السلة',
        level: 'مبتدئ',
        status: 'active',
        joinedAt: '2024-10-15T09:00:00Z',
        lastSession: '2025-01-07T14:20:00Z',
        totalSessions: 23,
        averageScore: 78.2,
        guardian: {
          name: 'علي والد فاطمة',
          email: 'guardian2@example.com',
          phone: '+966507654321'
        }
      },
      {
        id: 'athlete-003',
        name: 'يوسف خالد',
        email: 'youssef@example.com',
        sport: 'كرة القدم',
        level: 'متوسط',
        status: 'inactive',
        joinedAt: '2024-08-20T10:30:00Z',
        lastSession: '2024-12-15T16:45:00Z',
        totalSessions: 67,
        averageScore: 92.1,
        guardian: {
          name: 'خالد والد يوسف',
          email: 'guardian3@example.com',
          phone: '+966502468135'
        }
      }
    ]

    // Apply filters
    let filteredAthletes = mockAthletes

    if (sport) {
      filteredAthletes = filteredAthletes.filter(a => a.sport === sport)
    }

    if (status) {
      filteredAthletes = filteredAthletes.filter(a => a.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAthletes = filteredAthletes.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredAthletes.length
    const paginatedAthletes = filteredAthletes.slice(offset, offset + limit)

    // Calculate stats
    const stats = {
      totalAthletes: total,
      activeAthletes: filteredAthletes.filter(a => a.status === 'active').length,
      averageScore: filteredAthletes.reduce((sum, a) => sum + a.averageScore, 0) / (filteredAthletes.length || 1),
      totalSessions: filteredAthletes.reduce((sum, a) => sum + a.totalSessions, 0)
    }

    return NextResponse.json({
      success: true,
      athletes: paginatedAthletes,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching athletes:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الرياضيين' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify coach authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'coach') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, sport, level, guardianEmail, guardianPhone } = body

    // Validate required fields
    if (!name || !email || !sport || !guardianEmail) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والرياضة وبريد ولي الأمر مطلوبة' },
        { status: 400 }
      )
    }

    // In real app, create athlete in database with proper RLS
    const newAthlete = {
      id: `athlete-${Date.now()}`,
      name,
      email,
      sport,
      level: level || 'مبتدئ',
      status: 'active',
      joinedAt: new Date().toISOString(),
      lastSession: null,
      totalSessions: 0,
      averageScore: 0,
      guardian: {
        email: guardianEmail,
        phone: guardianPhone || null
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الرياضي بنجاح',
      athlete: newAthlete
    })

  } catch (error) {
    console.error('Error creating athlete:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة الرياضي' },
      { status: 500 }
    )
  }
}