import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByEmail, createUser, generateToken } from '@/lib/auth'
import { withRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, AppError } from '@/lib/error-handler'

const RegisterSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  role: z.enum(['student', 'teacher', 'coach', 'guardian'], {
    errorMap: () => ({ message: 'الدور المحدد غير صحيح' })
  }),
  school_id: z.string().optional(),
  region_id: z.string().min(1, 'المنطقة مطلوبة')
})

async function registerHandler(request: NextRequest) {
  const body = await request.json()
  const validatedData = RegisterSchema.parse(body)
  
  const { name, email, password, role, school_id, region_id } = validatedData

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase())
    
    if (existingUser) {
      throw new AppError('البريد الإلكتروني مستخدم مسبقاً', 409, 'EMAIL_EXISTS')
    }

    // Create new user
    const newUser = await createUser({
      name,
      email: email.toLowerCase(),
      password,
      role,
      school_id,
      region_id
    })

    // Generate JWT token
    const token = await generateToken(newUser)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: newUser,
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
    throw new AppError('فشل في إنشاء الحساب', 500, 'REGISTRATION_ERROR', error)
  }
}

export const POST = withRateLimit(withErrorHandler(registerHandler))