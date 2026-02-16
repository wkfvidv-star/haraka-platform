import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const friendshipId = params.id
    const body = await request.json()
    const { action } = body

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'إجراء غير صالح' },
        { status: 400 }
      )
    }

    // Get the friendship request
    const { data: friendship, error: fetchError } = await supabase
      .from('youth_friendships')
      .select('*')
      .eq('id', friendshipId)
      .eq('friend_id', user.id) // Only the recipient can accept/reject
      .eq('status', 'pending')
      .single()

    if (fetchError || !friendship) {
      return NextResponse.json(
        { success: false, message: 'طلب الصداقة غير موجود أو غير صالح' },
        { status: 404 }
      )
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    let message = ''
    let notificationMessage = ''

    if (action === 'accept') {
      updateData.status = 'accepted'
      updateData.accepted_at = new Date().toISOString()
      message = 'تم قبول طلب الصداقة'
      notificationMessage = `${user.name} قبل طلب صداقتك`
    } else {
      updateData.status = 'rejected'
      updateData.rejected_at = new Date().toISOString()
      message = 'تم رفض طلب الصداقة'
      notificationMessage = `${user.name} رفض طلب صداقتك`
    }

    // Update friendship status
    const { data: updatedFriendship, error: updateError } = await supabase
      .from('youth_friendships')
      .update(updateData)
      .eq('id', friendshipId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating friendship:', updateError)
      return NextResponse.json(
        { success: false, message: 'خطأ في تحديث طلب الصداقة' },
        { status: 500 }
      )
    }

    // Create notification for the requester
    await supabase
      .from('notifications')
      .insert([{
        user_id: friendship.requester_id,
        type: action === 'accept' ? 'friend_accepted' : 'friend_rejected',
        title: action === 'accept' ? 'تم قبول طلب الصداقة' : 'تم رفض طلب الصداقة',
        message: notificationMessage,
        data: {
          friendship_id: friendshipId,
          responder_id: user.id,
          responder_name: user.name
        },
        created_at: new Date().toISOString()
      }])

    return NextResponse.json({
      success: true,
      message: message,
      data: updatedFriendship
    })

  } catch (error) {
    console.error('Youth friendship response API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const friendshipId = params.id

    // Get the friendship
    const { data: friendship, error: fetchError } = await supabase
      .from('youth_friendships')
      .select('*')
      .eq('id', friendshipId)
      .or(`requester_id.eq.${user.id},friend_id.eq.${user.id}`)
      .single()

    if (fetchError || !friendship) {
      return NextResponse.json(
        { success: false, message: 'الصداقة غير موجودة' },
        { status: 404 }
      )
    }

    // Delete the friendship
    const { error: deleteError } = await supabase
      .from('youth_friendships')
      .delete()
      .eq('id', friendshipId)

    if (deleteError) {
      console.error('Error deleting friendship:', deleteError)
      return NextResponse.json(
        { success: false, message: 'خطأ في حذف الصداقة' },
        { status: 500 }
      )
    }

    // Notify the other user
    const otherUserId = friendship.requester_id === user.id 
      ? friendship.friend_id 
      : friendship.requester_id

    await supabase
      .from('notifications')
      .insert([{
        user_id: otherUserId,
        type: 'friendship_ended',
        title: 'انتهت الصداقة',
        message: `${user.name} أنهى الصداقة معك`,
        data: {
          ended_by: user.id,
          ended_by_name: user.name
        },
        created_at: new Date().toISOString()
      }])

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصداقة بنجاح'
    })

  } catch (error) {
    console.error('Youth friendship deletion API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}