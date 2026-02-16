import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get query parameters with defaults
    const searchParams = request.nextUrl.searchParams
    const sport = searchParams.get('sport')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Mock competitions data
    const mockCompetitions = [
      {
        id: 'comp-001',
        name: 'بطولة المدارس الثانوية لكرة القدم',
        sport: 'كرة القدم',
        type: 'school',
        status: 'active',
        startDate: '2025-02-01T09:00:00Z',
        endDate: '2025-02-15T18:00:00Z',
        location: 'الرياض',
        participants: 24,
        maxParticipants: 32,
        organizer: 'وزارة التعليم',
        description: 'بطولة سنوية لطلاب المدارس الثانوية',
        registrationDeadline: '2025-01-25T23:59:59Z',
        prizes: ['10000 ريال', '5000 ريال', '2500 ريال']
      },
      {
        id: 'comp-002',
        name: 'دوري كرة السلة الجامعي',
        sport: 'كرة السلة',
        type: 'university',
        status: 'upcoming',
        startDate: '2025-03-01T10:00:00Z',
        endDate: '2025-03-30T20:00:00Z',
        location: 'جدة',
        participants: 8,
        maxParticipants: 16,
        organizer: 'الاتحاد السعودي لكرة السلة',
        description: 'دوري الجامعات السعودية لكرة السلة',
        registrationDeadline: '2025-02-20T23:59:59Z',
        prizes: ['15000 ريال', '8000 ريال', '4000 ريال']
      },
      {
        id: 'comp-003',
        name: 'بطولة السباحة الوطنية',
        sport: 'سباحة',
        type: 'national',
        status: 'completed',
        startDate: '2024-12-01T08:00:00Z',
        endDate: '2024-12-10T18:00:00Z',
        location: 'الدمام',
        participants: 45,
        maxParticipants: 50,
        organizer: 'الاتحاد السعودي للسباحة',
        description: 'البطولة الوطنية للسباحة لجميع الأعمار',
        registrationDeadline: '2024-11-20T23:59:59Z',
        prizes: ['20000 ريال', '12000 ريال', '6000 ريال']
      }
    ]

    // Apply filters
    let filteredCompetitions = mockCompetitions

    if (sport) {
      filteredCompetitions = filteredCompetitions.filter(c => c.sport === sport)
    }

    if (status) {
      filteredCompetitions = filteredCompetitions.filter(c => c.status === status)
    }

    if (type) {
      filteredCompetitions = filteredCompetitions.filter(c => c.type === type)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCompetitions = filteredCompetitions.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredCompetitions.length
    const paginatedCompetitions = filteredCompetitions.slice(offset, offset + limit)

    // Calculate stats
    const stats = {
      totalCompetitions: total,
      activeCompetitions: filteredCompetitions.filter(c => c.status === 'active').length,
      upcomingCompetitions: filteredCompetitions.filter(c => c.status === 'upcoming').length,
      completedCompetitions: filteredCompetitions.filter(c => c.status === 'completed').length,
      totalParticipants: filteredCompetitions.reduce((sum, c) => sum + c.participants, 0)
    }

    return NextResponse.json({
      success: true,
      competitions: paginatedCompetitions,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching competitions:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المسابقات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (admin/ministry only)
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || !['admin', 'ministry'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      sport, 
      type, 
      startDate, 
      endDate, 
      location, 
      maxParticipants, 
      description,
      registrationDeadline,
      prizes 
    } = body

    // Validate required fields
    if (!name || !sport || !type || !startDate || !endDate || !location) {
      return NextResponse.json(
        { error: 'جميع الحقول الأساسية مطلوبة' },
        { status: 400 }
      )
    }

    // In real app, create competition in database
    const newCompetition = {
      id: `comp-${Date.now()}`,
      name,
      sport,
      type,
      status: 'upcoming',
      startDate,
      endDate,
      location,
      participants: 0,
      maxParticipants: maxParticipants || 50,
      organizer: user.profile?.name || 'منظم غير محدد',
      description: description || '',
      registrationDeadline: registrationDeadline || startDate,
      prizes: prizes || [],
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المسابقة بنجاح',
      competition: newCompetition
    })

  } catch (error) {
    console.error('Error creating competition:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المسابقة' },
      { status: 500 }
    )
  }
}