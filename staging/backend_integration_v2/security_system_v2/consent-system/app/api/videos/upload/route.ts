import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'غير مخول' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json({ error: 'غير مخول للوصول' }, { status: 403 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('video') as File
    const exerciseType = formData.get('exerciseType') as string

    if (!file) {
      return NextResponse.json(
        { error: 'ملف الفيديو مطلوب' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى رفع ملف فيديو صحيح' },
        { status: 400 }
      )
    }

    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 100 ميجابايت' },
        { status: 400 }
      )
    }

    // Check if user is under 18 and requires consent
    const requiresConsent = user.profile?.date_of_birth ? 
      new Date().getFullYear() - new Date(user.profile.date_of_birth).getFullYear() < 18 : 
      true

    // Generate video ID and metadata
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const uploadData = {
      id: videoId,
      filename: `${videoId}_${file.name}`,
      originalFilename: file.name,
      fileSize: file.size,
      exerciseType: exerciseType || 'تمرين عام',
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      processingStatus: 'pending',
      consentStatus: requiresConsent ? 'pending' : 'not_required',
      requiresConsent
    }

    // In real app, upload to storage and save to database
    console.log('Video upload simulation:', uploadData)

    // Mock processing delay
    setTimeout(() => {
      console.log(`Processing video ${videoId}...`)
      // In real app, trigger video analysis pipeline
    }, 1000)

    return NextResponse.json({
      success: true,
      message: requiresConsent ? 
        'تم رفع الفيديو بنجاح. في انتظار موافقة ولي الأمر للمعالجة' :
        'تم رفع الفيديو بنجاح وبدأت المعالجة',
      video: {
        id: videoId,
        filename: uploadData.filename,
        status: uploadData.status,
        requiresConsent,
        consentStatus: uploadData.consentStatus
      }
    })

  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'فشل في رفع الفيديو' },
      { status: 500 }
    )
  }
}

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

    // Get user's uploaded videos
    const mockVideos = [
      {
        id: 'video-001',
        filename: 'football_training.mp4',
        originalFilename: 'تمرين كرة القدم.mp4',
        exerciseType: 'كرة القدم',
        uploadedAt: '2025-01-08T10:30:00Z',
        status: 'completed',
        processingStatus: 'completed',
        consentStatus: 'approved',
        analysisScore: 85.5
      },
      {
        id: 'video-002',
        filename: 'basketball_drill.mp4',
        originalFilename: 'تمرين كرة السلة.mp4',
        exerciseType: 'كرة السلة',
        uploadedAt: '2025-01-07T14:20:00Z',
        status: 'processing',
        processingStatus: 'analyzing',
        consentStatus: 'approved',
        analysisScore: null
      }
    ]

    return NextResponse.json({
      success: true,
      videos: mockVideos
    })

  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الفيديوهات' },
      { status: 500 }
    )
  }
}