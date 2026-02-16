import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
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

    const deletionDate = new Date().toISOString()

    // Log the deletion request for audit trail
    await supabase
      .from('data_deletion_log')
      .insert([{
        user_id: user.id,
        user_type: 'youth',
        deletion_date: deletionDate,
        deletion_reason: 'user_requested',
        initiated_by: user.id
      }])

    // Delete video files from storage first
    const { data: videos } = await supabase
      .from('video_uploads')
      .select('file_path')
      .eq('user_id', user.id)

    if (videos && videos.length > 0) {
      const filePaths = videos.map(video => video.file_path).filter(Boolean)
      
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('student-videos')
          .remove(filePaths)

        if (storageError) {
          console.error('Error deleting video files:', storageError)
          // Continue with database deletion even if storage deletion fails
        }
      }
    }

    // Delete analysis results
    const { error: analysisError } = await supabase
      .from('analysis_results')
      .delete()
      .eq('user_id', user.id)

    if (analysisError) {
      console.error('Error deleting analysis results:', analysisError)
    }

    // Delete video uploads
    const { error: videoError } = await supabase
      .from('video_uploads')
      .delete()
      .eq('user_id', user.id)

    if (videoError) {
      console.error('Error deleting video uploads:', videoError)
    }

    // Delete notifications
    const { error: notificationError } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)

    if (notificationError) {
      console.error('Error deleting notifications:', notificationError)
    }

    // Delete privacy settings
    const { error: privacyError } = await supabase
      .from('youth_privacy_settings')
      .delete()
      .eq('user_id', user.id)

    if (privacyError) {
      console.error('Error deleting privacy settings:', privacyError)
    }

    // Delete youth profile
    const { error: profileError } = await supabase
      .from('youth_profiles')
      .delete()
      .eq('user_id', user.id)

    if (profileError) {
      console.error('Error deleting youth profile:', profileError)
    }

    // Finally, delete the user account
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (userError) {
      console.error('Error deleting user account:', userError)
      return NextResponse.json(
        { success: false, message: 'خطأ في حذف الحساب' },
        { status: 500 }
      )
    }

    // Clear the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'تم حذف جميع البيانات والحساب بنجاح'
    })

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('Youth data deletion API error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ داخلي في الخادم' },
      { status: 500 }
    )
  }
}