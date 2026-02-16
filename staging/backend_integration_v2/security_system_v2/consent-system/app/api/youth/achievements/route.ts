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

    // Mock achievements data
    const mockAchievements = [
      {
        id: 'achievement-001',
        title: 'أول فيديو',
        description: 'رفع أول فيديو تمرين',
        icon: 'video',
        points: 10,
        category: 'milestone',
        earned: true,
        earnedAt: '2025-01-08T10:30:00Z'
      },
      {
        id: 'achievement-002',
        title: 'نجم الأسبوع',
        description: 'حصل على أعلى نقاط في الأسبوع',
        icon: 'star',
        points: 50,
        category: 'performance',
        earned: true,
        earnedAt: '2025-01-07T14:20:00Z'
      },
      {
        id: 'achievement-003',
        title: 'مثابر',
        description: 'رفع 10 فيديوهات تمرين',
        icon: 'trophy',
        points: 100,
        category: 'consistency',
        earned: false,
        progress: 6,
        target: 10
      },
      {
        id: 'achievement-004',
        title: 'محسن الأداء',
        description: 'تحسن النقاط بنسبة 20%',
        icon: 'trending-up',
        points: 75,
        category: 'improvement',
        earned: false,
        progress: 15,
        target: 20
      }
    ]

    // Calculate stats
    const earnedAchievements = mockAchievements.filter(a => a.earned)
    const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0)
    
    const stats = {
      totalAchievements: mockAchievements.length,
      earnedAchievements: earnedAchievements.length,
      totalPoints,
      completionRate: Math.round((earnedAchievements.length / mockAchievements.length) * 100)
    }

    return NextResponse.json({
      success: true,
      achievements: mockAchievements,
      stats
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الإنجازات' },
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
    const { achievementId, userId } = body

    // Validate required fields
    if (!achievementId || !userId) {
      return NextResponse.json(
        { error: 'معرف الإنجاز ومعرف المستخدم مطلوبان' },
        { status: 400 }
      )
    }

    // In real app, award achievement to user
    const awardedAchievement = {
      id: achievementId,
      userId,
      awardedAt: new Date().toISOString(),
      points: 50 // Mock points
    }

    return NextResponse.json({
      success: true,
      message: 'تم منح الإنجاز بنجاح',
      achievement: awardedAchievement
    })

  } catch (error) {
    console.error('Error awarding achievement:', error)
    return NextResponse.json(
      { error: 'فشل في منح الإنجاز' },
      { status: 500 }
    )
  }
}