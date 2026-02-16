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

    // Mock friends data - in real app, query from database with RLS
    const mockFriends = [
      {
        id: 'friend-001',
        name: 'سارة أحمد',
        region: 'الرياض',
        preferredSports: ['كرة القدم', 'كرة السلة'],
        privacyLevel: 'friends',
        profileVisibility: 'public',
        friendshipStatus: 'accepted',
        friendsSince: '2024-12-15T10:00:00Z'
      },
      {
        id: 'friend-002',
        name: 'محمد علي',
        region: 'جدة',
        preferredSports: ['السباحة', 'التنس'],
        privacyLevel: 'public',
        profileVisibility: 'public',
        friendshipStatus: 'accepted',
        friendsSince: '2024-11-20T14:30:00Z'
      }
    ]

    const mockFriendRequests = [
      {
        id: 'request-001',
        fromUserId: 'user-003',
        fromUserName: 'فاطمة خالد',
        region: 'الدمام',
        requestedAt: '2025-01-07T16:20:00Z',
        status: 'pending'
      }
    ]

    return NextResponse.json({
      success: true,
      friends: mockFriends,
      friendRequests: mockFriendRequests,
      stats: {
        totalFriends: mockFriends.length,
        pendingRequests: mockFriendRequests.length,
        mutualSports: 3
      }
    })

  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json(
      { error: 'فشل في جلب قائمة الأصدقاء' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { action, friendId, requestId } = body

    if (action === 'send_request') {
      // Send friend request
      const newRequest = {
        id: `request-${Date.now()}`,
        fromUserId: user.id,
        toUserId: friendId,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      }

      return NextResponse.json({
        success: true,
        message: 'تم إرسال طلب الصداقة بنجاح',
        request: newRequest
      })
    }

    if (action === 'accept_request') {
      // Accept friend request
      return NextResponse.json({
        success: true,
        message: 'تم قبول طلب الصداقة',
        friendshipId: `friendship-${Date.now()}`
      })
    }

    if (action === 'reject_request') {
      // Reject friend request
      return NextResponse.json({
        success: true,
        message: 'تم رفض طلب الصداقة'
      })
    }

    return NextResponse.json(
      { error: 'إجراء غير صحيح' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error managing friends:', error)
    return NextResponse.json(
      { error: 'فشل في إدارة الأصدقاء' },
      { status: 500 }
    )
  }
}