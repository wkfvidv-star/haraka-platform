import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'
import { z } from 'zod'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Validation schemas
const GetNationalStatsSchema = z.object({
  timeframe: z.enum(['week', 'month', 'quarter', 'year']).optional(),
  region: z.string().optional()
})

// GET /api/ministry/national-stats - Get national statistics
async function getNationalStats(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const queryData = {
    timeframe: searchParams.get('timeframe') as 'week' | 'month' | 'quarter' | 'year' || 'month',
    region: searchParams.get('region') || undefined
  }

  const validatedData = GetNationalStatsSchema.parse(queryData)
  const { timeframe, region } = validatedData

  // Calculate date range based on timeframe
  const now = new Date()
  let startDate: Date
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default: // month
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get total schools count
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('students')
      .select('school_name')
      .not('school_name', 'is', null)

    if (schoolsError) throw schoolsError

    const uniqueSchools = new Set(schoolsData?.map(s => s.school_name) || [])
    const totalSchools = uniqueSchools.size

    // Get sessions in timeframe
    const { count: totalSessions, error: sessionsError } = await supabase
      .from('exercise_sessions_demo')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())

    if (sessionsError) throw sessionsError

    // Get average scores
    const { data: reportsData, error: reportsError } = await supabase
      .from('analysis_reports_demo')
      .select('overall_score')
      .gte('created_at', startDate.toISOString())

    if (reportsError) throw reportsError

    const nationalAverage = reportsData && reportsData.length > 0
      ? Math.round(reportsData.reduce((sum, r) => sum + r.overall_score, 0) / reportsData.length)
      : 0

    // Get regional data
    const { data: regionalData, error: regionalError } = await supabase
      .from('students')
      .select(`
        region,
        school_name,
        exercise_sessions_demo (
          session_id,
          created_at
        ),
        analysis_reports_demo (
          overall_score,
          created_at
        )
      `)

    if (regionalError) throw regionalError

    // Process regional statistics
    const regionStats = new Map()
    
    regionalData?.forEach(student => {
      const studentRegion = student.region || 'غير محدد'
      
      if (!regionStats.has(studentRegion)) {
        regionStats.set(studentRegion, {
          name: studentRegion,
          schools: new Set(),
          students: 0,
          sessions: 0,
          totalScore: 0,
          reportCount: 0
        })
      }
      
      const stats = regionStats.get(studentRegion)
      stats.students += 1
      stats.schools.add(student.school_name)
      
      // Count sessions in timeframe
      const sessions = student.exercise_sessions_demo || []
      const recentSessions = sessions.filter(s => 
        new Date(s.created_at) >= startDate
      )
      stats.sessions += recentSessions.length
      
      // Calculate average scores
      const reports = student.analysis_reports_demo || []
      const recentReports = reports.filter(r => 
        new Date(r.created_at) >= startDate
      )
      
      recentReports.forEach(report => {
        stats.totalScore += report.overall_score
        stats.reportCount += 1
      })
    })

    // Convert to array and calculate averages
    const regions = Array.from(regionStats.values()).map(stats => ({
      id: stats.name.toLowerCase().replace(/\s+/g, '_'),
      name: stats.name,
      schools: stats.schools.size,
      students: stats.students,
      teachers: Math.round(stats.students * 0.05), // Estimate: 1 teacher per 20 students
      coaches: Math.round(stats.students * 0.008), // Estimate: 1 coach per 125 students
      averageScore: stats.reportCount > 0 ? Math.round(stats.totalScore / stats.reportCount) : 0,
      sessionsThisMonth: stats.sessions,
      growth: Math.floor(Math.random() * 20) + 1, // Mock growth data
      status: stats.reportCount > 0 && (stats.totalScore / stats.reportCount) >= 80 ? 'excellent' :
              stats.reportCount > 0 && (stats.totalScore / stats.reportCount) >= 70 ? 'good' : 'needs_improvement'
    }))

    // Calculate monthly growth (mock calculation)
    const monthlyGrowth = Math.floor(Math.random() * 15) + 5

    const nationalStats = {
      totalUsers: totalUsers || 0,
      totalSchools,
      totalSessions: totalSessions || 0,
      nationalAverage,
      activeRegions: regions.length,
      monthlyGrowth
    }

    return NextResponse.json({
      success: true,
      nationalStats,
      regions,
      timeframe,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    throw new AppError('فشل في جلب الإحصائيات الوطنية', 500, 'DATABASE_ERROR', error)
  }
}

// Apply middleware
export const GET = withRateLimit(withErrorHandler(getNationalStats))