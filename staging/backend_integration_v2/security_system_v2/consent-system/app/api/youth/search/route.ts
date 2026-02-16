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

    // Check privacy settings
    const { data: privacySettings } = await supabase
      .from('youth_privacy_settings')
      .select('consent_status')
      .eq('user_id', user.id)
      .single()

    if (privacySettings?.consent_status === 'withdrawn') {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.trim()
    const region = url.searchParams.get('region')
    const sport = url.searchParams.get('sport')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50)
    
    const offset = (page - 1) * limit

    if (!query && !region && !sport) {
      return NextResponse.json(
        { success: false, message: 'معايير البحث مطلوبة' },
        { status: 400 }
      )
    }

    // Build search query
    let searchQuery = supabase
      .from('youth_profiles')
      .select(`
        user_id,
        name,
        region,
        preferred_sports,
        privacy_level,
        profile_visibility,
        created_at
      `)
      .neq('user_id', user.id) // Exclude self
      .or('privacy_level.eq.public,and(privacy_level.eq.friends,profile_visibility.eq.true)') // Only visible profiles

    // Apply search filters
    if (query) {
      searchQuery = searchQuery.ilike('name', `%${query}%`)
    }

    if (region) {
      searchQuery = searchQuery.eq('region', region)
    }

    if (sport) {
      searchQuery = searchQuery.contains('preferred_sports', [sport])
    }

    // Get results with pagination
    const { data: profiles, error, count } = await searchQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error searching youth profiles:', error)
      return NextResponse.json(
        { success: false, message: 'خطأ في البحث' },
        { status: 500 }
      )
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      })
    }

    // Get existing friendships to show current status
    const profileIds = profiles.map(p => p.user_id)
    const { data: friendships } = await supabase
      .from('youth_friendships')
      .select('requester_id, friend_id, status')
      .or(`and(requester_id.eq.${user.id},friend_id.in.(${profileIds.join(',')})),and(friend_id.eq.${user.id},requester_id.in.(${profileIds.join(',')}))`)

    // Create friendship status map
    const friendshipMap = new Map()
    friendships?.forEach(f => {
      const otherUserId = f.requester_id === user.id ? f.friend_id : f.requester_id
      const isRequester = f.requester_id === user.id
      
      friendshipMap.set(otherUserId, {
        status: f.status,
        is_requester: isRequester
      })
    })

    // Format results
    const formattedProfiles = profiles.map(profile => {
      const friendship = friendshipMap.get(profile.user_id)
      
      return {
        user_id: profile.user_id,
        name: profile.name,
        region: profile.region,
        preferred_sports: profile.preferred_sports || [],
        privacy_level: profile.privacy_level,
        profile_visibility: profile.profile_visibility,
        friendship_status: friendship?.status || 'none',
        is_request_sent: friendship?.is_requester || false,
        can_send_request: !friendship && profile.privacy_level !== 'private'
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedProfiles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Youth search API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}