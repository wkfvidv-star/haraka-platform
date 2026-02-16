import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/error-handler'

async function logoutHandler(request: NextRequest) {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  })

  // Clear auth cookie
  response.cookies.delete('auth-token')

  return response
}

export const POST = withErrorHandler(logoutHandler)