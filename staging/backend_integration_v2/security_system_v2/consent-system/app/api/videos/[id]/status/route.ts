import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const videoId = params.id

    // Mock video status data - in real app, query from database
    const mockVideoStatus = {
      id: videoId,
      filename: 'exercise_video.mp4',
      status: 'completed',
      uploadedAt: '2025-01-08T10:30:00Z',
      processedAt: '2025-01-08T10:35:00Z',
      duration: 120, // seconds
      fileSize: 25600000, // bytes
      thumbnailUrl: `/api/videos/${videoId}/thumbnail`,
      videoUrl: `/api/videos/${videoId}/stream`,
      analysis: {
        status: 'completed',
        overallScore: 85.5,
        completedAt: '2025-01-08T10:40:00Z'
      },
      consent: {
        required: user.role === 'youth',
        status: 'approved',
        approvedAt: '2025-01-08T10:32:00Z'
      }
    }

    // Check if user has permission to view this video (RLS simulation)
    if (user.role === 'youth' && mockVideoStatus.id !== videoId) {
      return NextResponse.json({ error: 'غير مخول لعرض هذا الفيديو' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      video: mockVideoStatus
    })

  } catch (error) {
    console.error('Error fetching video status:', error)
    return NextResponse.json(
      { error: 'فشل في جلب حالة الفيديو' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify authentication (admin/system only)
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || !['admin', 'system'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    const videoId = params.id
    const body = await request.json()
    const { status, analysisResults, error: processingError } = body

    // Validate status
    const validStatuses = ['uploading', 'processing', 'completed', 'failed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صحيحة' },
        { status: 400 }
      )
    }

    // In real app, update video status in database
    const updatedVideo = {
      id: videoId,
      status,
      updatedAt: new Date().toISOString(),
      analysisResults: analysisResults || null,
      error: processingError || null
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الفيديو بنجاح',
      video: updatedVideo
    })

  } catch (error) {
    console.error('Error updating video status:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث حالة الفيديو' },
      { status: 500 }
    )
  }
}