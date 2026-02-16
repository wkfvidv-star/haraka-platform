import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByEmail, verifyPassword, generateToken } from '@/lib/auth'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'

const LoginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
})

async function loginHandler(request: NextRequest) {
  const body = await request.json()
  const validatedData = LoginSchema.parse(body)
  
  const { email, password } = validatedData

  try {
    // Find user by email
    const user = await findUserByEmail(email.toLowerCase())
    
    if (!user) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401, 'INVALID_CREDENTIALS')
    }

    if (!user.is_active) {
      throw new AppError('الحساب غير مفعل، يرجى التواصل مع الإدارة', 403, 'ACCOUNT_DISABLED')
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401, 'INVALID_CREDENTIALS')
    }

    // Generate JWT token
    const { password: _, ...userWithoutPassword } = user
    const token = await generateToken(userWithoutPassword)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword,
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError('فشل في تسجيل الدخول', 500, 'LOGIN_ERROR', error)
  }
}

export const POST = withRateLimit(withErrorHandler(loginHandler))