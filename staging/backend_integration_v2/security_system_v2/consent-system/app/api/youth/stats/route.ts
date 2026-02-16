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

    // Check if user has withdrawn consent
    const { data: privacySettings } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status, activity_tracking')
      .eq('user_id', user.id)
      .single()

    if (privacySettings?.consent_status === 'withdrawn' || !privacySettings?.activity_tracking) {
      return NextResponse.json({
        success: true,
        data: {
          total_sessions: 0,
          this_month: 0,
          average_score: 0,
          improvement_rate: 0,
          best_sport: null,
          recent_activities: []
        }
      })
    }

    // Get total sessions count with RLS protection
    const { count: totalSessions, error: totalError } = await supabase
      .from('video_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('processing_status', 'completed')

    if (totalError) {
      console.error('Error fetching total sessions:', totalError)
    }

    // Get this month's sessions
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonth, error: monthError } = await supabase
      .from('video_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('processing_status', 'completed')
      .gte('created_at', startOfMonth.toISOString())

    if (monthError) {
      console.error('Error fetching monthly sessions:', monthError)
    }

    // Get analysis results for average score and best sport
    const { data: analyses, error: analysisError } = await supabase
      .from('analysis_results')
      .select('overall_score, sport_type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (analysisError) {
      console.error('Error fetching analyses:', analysisError)
    }

    let averageScore = 0
    let bestSport = null
    let improvementRate = 0

    if (analyses && analyses.length > 0) {
      // Calculate average score
      const totalScore = analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0)
      averageScore = Math.round(totalScore / analyses.length)

      // Find best sport by average score
      const sportScores: { [key: string]: { total: number; count: number } } = {}
      
      analyses.forEach(analysis => {
        if (analysis.sport_type && analysis.overall_score) {
          if (!sportScores[analysis.sport_type]) {
            sportScores[analysis.sport_type] = { total: 0, count: 0 }
          }
          sportScores[analysis.sport_type].total += analysis.overall_score
          sportScores[analysis.sport_type].count += 1
        }
      })

      let bestAverage = 0
      Object.entries(sportScores).forEach(([sport, scores]) => {
        const average = scores.total / scores.count
        if (average > bestAverage) {
          bestAverage = average
          bestSport = sport
        }
      })

      // Calculate improvement rate (comparing first half vs second half of recent analyses)
      if (analyses.length >= 4) {
        const halfPoint = Math.floor(analyses.length / 2)
        const recentHalf = analyses.slice(0, halfPoint)
        const olderHalf = analyses.slice(halfPoint)
        
        const recentAvg = recentHalf.reduce((sum, a) => sum + (a.overall_score || 0), 0) / recentHalf.length
        const olderAvg = olderHalf.reduce((sum, a) => sum + (a.overall_score || 0), 0) / olderHalf.length
        
        if (olderAvg > 0) {
          improvementRate = Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
        }
      }
    }

    // Get recent activities
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('video_uploads')
      .select(`
        id,
        sport_type,
        created_at,
        processing_status,
        analysis_results!inner(overall_score)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (activitiesError) {
      console.error('Error fetching recent activities:', activitiesError)
    }

    const formattedActivities = (recentActivities || []).map(activity => ({
      id: activity.id,
      sport_type: activity.sport_type || 'غير محدد',
      score: activity.analysis_results?.[0]?.overall_score || 0,
      date: activity.created_at,
      status: activity.processing_status === 'completed' ? 'completed' : 
              activity.processing_status === 'processing' ? 'processing' : 'failed'
    }))

    return NextResponse.json({
      success: true,
      data: {
        total_sessions: totalSessions || 0,
        this_month: thisMonth || 0,
        average_score: averageScore,
        improvement_rate: improvementRate,
        best_sport: bestSport,
        recent_activities: formattedActivities
      }
    })

  } catch (error) {
    console.error('Youth stats API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}