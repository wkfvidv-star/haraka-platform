import { NextRequest, NextResponse } from 'next/server'

export class AppError extends Error {
  public statusCode: number
  public errorCode: string
  public details?: any

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR', details?: any) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details
    this.name = 'AppError'
  }
}

export function withErrorHandler<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('API Error:', error)

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            errorCode: error.errorCode,
            details: error.details
          },
          { status: error.statusCode }
        )
      }

      // Handle Zod validation errors
      if (error && typeof error === 'object' && 'issues' in error) {
        return NextResponse.json(
          {
            success: false,
            error: 'بيانات غير صحيحة',
            errorCode: 'VALIDATION_ERROR',
            details: error
          },
          { status: 400 }
        )
      }

      // Generic error
      return NextResponse.json(
        {
          success: false,
          error: 'حدث خطأ في الخادم',
          errorCode: 'INTERNAL_ERROR'
        },
        { status: 500 }
      )
    }
  }
}