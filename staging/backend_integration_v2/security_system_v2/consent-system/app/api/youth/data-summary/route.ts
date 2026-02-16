import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user || user.role !== 'youth') {
      return NextResponse.json(
        { success: false, message: 'صلاحيات غير كافية' },
        { status: 403 }
      )
    }

    // Get video count
    const { count: videoCount, error: videoError } = await supabase
      .from('video_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (videoError) {
      console.error('Error counting videos:', videoError)
    }

    // Get analysis count
    const { count: analysisCount, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (analysisError) {
      console.error('Error counting analyses:', analysisError)
    }

    // Get file sizes and dates
    const { data: videos, error: videosError } = await supabase
      .from('video_uploads')
      .select('file_size, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (videosError) {
      console.error('Error fetching video details:', videosError)
    }

    let totalSizeMB = 0
    let oldestRecord = null
    let newestRecord = null

    if (videos && videos.length > 0) {
      // Calculate total size in MB
      totalSizeMB = Math.round(
        videos.reduce((sum, video) => sum + (video.file_size || 0), 0) / (1024 * 1024)
      )

      // Get oldest and newest records
      oldestRecord = videos[0].created_at
      newestRecord = videos[videos.length - 1].created_at
    }

    return NextResponse.json({
      success: true,
      data: {
        total_videos: videoCount || 0,
        total_analyses: analysisCount || 0,
        data_size_mb: totalSizeMB,
        oldest_record: oldestRecord,
        newest_record: newestRecord
      }
    })

  } catch (error) {
    console.error('Youth data summary API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}