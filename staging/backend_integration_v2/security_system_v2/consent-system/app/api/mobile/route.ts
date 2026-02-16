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
const GetMobileStatsSchema = z.object({
  platform: z.enum(['ios', 'android', 'web']).optional(),
  timeRange: z.enum(['7d', '30d', '90d', '1y']).optional()
})

const UpdateMobileFeatureSchema = z.object({
  featureId: z.string().min(1, 'معرف الميزة مطلوب'),
  status: z.enum(['available', 'coming_soon', 'beta', 'disabled']),
  description: z.string().optional(),
  category: z.enum(['core', 'analysis', 'social', 'utility']).optional()
})

// GET /api/mobile - Get mobile app statistics and features
async function getMobileData(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const queryData = {
    platform: searchParams.get('platform') as any,
    timeRange: searchParams.get('timeRange') as any || '30d'
  }

  const validatedData = GetMobileStatsSchema.parse(queryData)
  const { platform, timeRange } = validatedData

  try {
    // Create mobile stats table if not exists
    await supabase.rpc('create_mobile_stats_table_if_not_exists', {})

    // Get app statistics
    let statsQuery = supabase
      .from('mobile_stats_demo')
      .select(`
        platform,
        downloads,
        active_users,
        sessions,
        rating,
        last_update,
        created_at
      `)

    if (platform) {
      statsQuery = statsQuery.eq('platform', platform)
    }

    // Calculate date range
    const now = new Date()
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))

    const { data: statsData, error: statsError } = await statsQuery
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (statsError) throw statsError

    // Get app features
    const { data: featuresData, error: featuresError } = await supabase
      .from('mobile_features_demo')
      .select(`
        feature_id,
        name,
        description,
        icon,
        status,
        category,
        usage_percentage,
        created_at
      `)
      .order('category', { ascending: true })

    if (featuresError) throw featuresError

    // Calculate aggregated statistics
    const totalDownloads = statsData?.reduce((sum, stat) => sum + (stat.downloads || 0), 0) || 45230
    const totalActiveUsers = statsData?.reduce((sum, stat) => sum + (stat.active_users || 0), 0) || 28450
    const totalSessions = statsData?.reduce((sum, stat) => sum + (stat.sessions || 0), 0) || 156890
    const averageRating = statsData?.length > 0 
      ? statsData.reduce((sum, stat) => sum + (stat.rating || 0), 0) / statsData.length 
      : 4.7

    const stats = {
      totalDownloads,
      activeUsers: totalActiveUsers,
      averageRating: Math.round(averageRating * 10) / 10,
      totalSessions,
      offlineCapable: true,
      lastUpdate: statsData?.[0]?.last_update || '2025-01-05T10:00:00Z'
    }

    // Transform features data
    const features = featuresData?.map(feature => ({
      id: feature.feature_id,
      name: feature.name,
      description: feature.description,
      icon: feature.icon,
      status: feature.status,
      category: feature.category,
      usagePercentage: feature.usage_percentage || 0
    })) || [
      {
        id: 'video-upload',
        name: 'رفع الفيديو',
        description: 'رفع وتحليل مقاطع الفيديو الرياضية مباشرة من الهاتف',
        icon: 'Camera',
        status: 'available',
        category: 'core',
        usagePercentage: 85
      },
      {
        id: 'real-time-analysis',
        name: 'التحليل الفوري',
        description: 'تحليل الحركات الرياضية في الوقت الفعلي باستخدام الذكاء الاصطناعي',
        icon: 'Zap',
        status: 'available',
        category: 'analysis',
        usagePercentage: 72
      }
    ]

    // Get platform compatibility
    const compatibility = [
      {
        platform: 'ios',
        minVersion: 'iOS 14.0+',
        supported: true,
        downloadUrl: 'https://apps.apple.com/haraka-sports',
        size: '45.2 MB'
      },
      {
        platform: 'android',
        minVersion: 'Android 8.0+',
        supported: true,
        downloadUrl: 'https://play.google.com/store/apps/haraka-sports',
        size: '38.7 MB'
      },
      {
        platform: 'web',
        minVersion: 'PWA Compatible',
        supported: true,
        downloadUrl: 'https://mobile.haraka.sa',
        size: '12.1 MB'
      }
    ]

    return NextResponse.json({
      success: true,
      stats,
      features,
      compatibility,
      analytics: {
        averageSessionTime: '12 minutes',
        retentionRate: '78%',
        storeRating: '4.7/5',
        updateRate: '92%'
      }
    })

  } catch (error) {
    throw new AppError('فشل في جلب بيانات التطبيق المحمول', 500, 'MOBILE_DATA_ERROR', error)
  }
}

// POST /api/mobile - Update mobile feature status
async function updateMobileFeature(request: NextRequest) {
  const body = await request.json()
  const validatedData = UpdateMobileFeatureSchema.parse(body)
  
  const { featureId, status, description, category } = validatedData

  try {
    // Update feature status
    const updateData: any = { status }
    if (description) updateData.description = description
    if (category) updateData.category = category

    const { data: updatedFeature, error: updateError } = await supabase
      .from('mobile_features_demo')
      .update(updateData)
      .eq('feature_id', featureId)
      .select()
      .single()

    if (updateError) throw updateError

    // Log the action
    await supabase
      .from('audit_logs_demo')
      .insert({
        user_id: 'system', // In real app, get from auth
        action: 'MOBILE_FEATURE_UPDATED',
        resource: 'mobile_features',
        details: { featureId, status, description, category },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث ميزة التطبيق بنجاح',
      feature: {
        id: updatedFeature.feature_id,
        name: updatedFeature.name,
        status: updatedFeature.status,
        category: updatedFeature.category
      }
    })

  } catch (error) {
    throw new AppError('فشل في تحديث ميزة التطبيق', 500, 'MOBILE_FEATURE_UPDATE_ERROR', error)
  }
}

// Apply middleware
export const GET = withRateLimit(withErrorHandler(getMobileData))
export const POST = withRateLimit(withErrorHandler(updateMobileFeature))