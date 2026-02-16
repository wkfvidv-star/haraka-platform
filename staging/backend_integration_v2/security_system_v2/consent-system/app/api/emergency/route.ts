import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify emergency personnel authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'emergency') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get query parameters with defaults
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    // Mock emergency incidents data
    const mockIncidents = [
      {
        id: 'incident-001',
        type: 'injury',
        severity: 'high',
        status: 'active',
        title: 'إصابة أثناء التمرين',
        description: 'إصابة في الركبة أثناء تمرين كرة القدم',
        location: 'ملعب المدرسة الثانوية',
        reportedBy: 'أحمد المدرب',
        reportedAt: '2025-01-08T14:30:00Z',
        respondedBy: 'فريق الإسعاف الأول',
        estimatedArrival: '2025-01-08T14:45:00Z',
        patient: {
          name: 'محمد الطالب',
          age: 16,
          condition: 'واعي ومستقر'
        },
        coordinates: {
          lat: 24.7136,
          lng: 46.6753
        }
      },
      {
        id: 'incident-002',
        type: 'medical',
        severity: 'medium',
        status: 'resolved',
        title: 'حالة إغماء',
        description: 'طالبة فقدت الوعي أثناء حصة الرياضة',
        location: 'صالة الألعاب الرياضية',
        reportedBy: 'فاطمة المعلمة',
        reportedAt: '2025-01-08T11:15:00Z',
        respondedBy: 'الممرضة المدرسية',
        resolvedAt: '2025-01-08T11:30:00Z',
        patient: {
          name: 'سارة الطالبة',
          age: 15,
          condition: 'تم إنعاشها بنجاح'
        },
        coordinates: {
          lat: 24.7200,
          lng: 46.6800
        }
      },
      {
        id: 'incident-003',
        type: 'equipment',
        severity: 'low',
        status: 'pending',
        title: 'عطل في معدات السلامة',
        description: 'تلف في حاجز الأمان في ملعب كرة السلة',
        location: 'ملعب كرة السلة الخارجي',
        reportedBy: 'خالد المشرف',
        reportedAt: '2025-01-08T09:00:00Z',
        coordinates: {
          lat: 24.7100,
          lng: 46.6700
        }
      }
    ]

    // Apply filters
    let filteredIncidents = mockIncidents

    if (type) {
      filteredIncidents = filteredIncidents.filter(i => i.type === type)
    }

    if (severity) {
      filteredIncidents = filteredIncidents.filter(i => i.severity === severity)
    }

    if (status) {
      filteredIncidents = filteredIncidents.filter(i => i.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredIncidents = filteredIncidents.filter(i => 
        i.title.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower) ||
        i.location.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredIncidents.length
    const paginatedIncidents = filteredIncidents.slice(offset, offset + limit)

    // Calculate stats
    const stats = {
      totalIncidents: total,
      activeIncidents: filteredIncidents.filter(i => i.status === 'active').length,
      resolvedIncidents: filteredIncidents.filter(i => i.status === 'resolved').length,
      pendingIncidents: filteredIncidents.filter(i => i.status === 'pending').length,
      highSeverity: filteredIncidents.filter(i => i.severity === 'high').length,
      averageResponseTime: '12 دقيقة' // Mock data
    }

    return NextResponse.json({
      success: true,
      incidents: paginatedIncidents,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching emergency incidents:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الحوادث الطارئة' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { 
      type, 
      severity, 
      title, 
      description, 
      location, 
      patientName, 
      patientAge,
      coordinates 
    } = body

    // Validate required fields
    if (!type || !severity || !title || !description || !location) {
      return NextResponse.json(
        { error: 'جميع الحقول الأساسية مطلوبة' },
        { status: 400 }
      )
    }

    // In real app, create incident in database and notify emergency services
    const newIncident = {
      id: `incident-${Date.now()}`,
      type,
      severity,
      status: 'active',
      title,
      description,
      location,
      reportedBy: user.profile?.name || 'مستخدم غير محدد',
      reportedAt: new Date().toISOString(),
      patient: patientName ? {
        name: patientName,
        age: patientAge,
        condition: 'في انتظار التقييم'
      } : null,
      coordinates: coordinates || null
    }

    // Mock emergency service notification
    console.log('Emergency incident reported:', newIncident)

    return NextResponse.json({
      success: true,
      message: 'تم الإبلاغ عن الحادث بنجاح وإشعار فرق الطوارئ',
      incident: newIncident,
      estimatedResponse: '10-15 دقيقة'
    })

  } catch (error) {
    console.error('Error creating emergency incident:', error)
    return NextResponse.json(
      { error: 'فشل في الإبلاغ عن الحادث' },
      { status: 500 }
    )
  }
}