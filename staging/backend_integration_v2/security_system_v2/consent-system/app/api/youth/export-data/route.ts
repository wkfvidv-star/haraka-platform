import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify youth authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Mock user data export - in real app, fetch from database with RLS
    const userData = {
      profile: {
        id: user.id,
        name: user.profile?.name || 'المستخدم',
        email: user.email,
        createdAt: user.created_at,
        lastLogin: new Date().toISOString()
      },
      sessions: [
        {
          id: 'session-001',
          exerciseType: 'كرة القدم',
          score: 85.5,
          createdAt: '2025-01-08T10:30:00Z'
        },
        {
          id: 'session-002',
          exerciseType: 'كرة السلة',
          score: 92.1,
          createdAt: '2025-01-07T14:20:00Z'
        }
      ],
      achievements: [
        {
          id: 'achievement-001',
          title: 'أول فيديو',
          points: 10,
          earnedAt: '2025-01-08T10:30:00Z'
        }
      ],
      privacySettings: {
        consentStatus: 'active',
        dataSharing: true,
        notifications: true
      }
    }

    // Create JSON export
    const exportData = JSON.stringify(userData, null, 2)
    const buffer = Buffer.from(exportData, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user_data_${user.id}.json"`,
        'Content-Length': buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'فشل في تصدير البيانات' },
      { status: 500 }
    )
  }
}