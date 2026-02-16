import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // max requests per window
}

export function withRateLimit<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    // Clean up expired entries
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key)
      }
    }
    
    // Get or create request count for this IP
    const requestData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT.windowMs }
    
    // Check if rate limit exceeded
    if (requestData.count >= RATE_LIMIT.maxRequests) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد المسموح من الطلبات' },
        { status: 429 }
      )
    }
    
    // Increment count
    requestData.count++
    requestCounts.set(ip, requestData)
    
    // Call the original handler
    return handler(request, ...args)
  }
}