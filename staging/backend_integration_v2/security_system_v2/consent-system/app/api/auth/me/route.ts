import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { withErrorHandler, AppError } from '@/lib/error-handler'

async function meHandler(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      throw new AppError('غير مصرح بالوصول', 401, 'UNAUTHORIZED')
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('فشل في جلب بيانات المستخدم', 500, 'USER_FETCH_ERROR', error)
  }
}

export const GET = withErrorHandler(meHandler)