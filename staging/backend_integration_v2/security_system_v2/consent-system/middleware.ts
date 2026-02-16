import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Define protected routes and their required roles
const protectedRoutes = {
  '/student': ['student'],
  '/teacher': ['teacher'],
  '/coach': ['coach'],
  '/guardian': ['guardian'],
  '/ministry': ['ministry'],
  '/admin': ['admin'],
  '/competitions': ['admin', 'competition_manager'],
  '/mobile': ['admin'],
  '/emergency': ['admin', 'teacher', 'coach']
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Allow static files and API routes (except auth)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Check authentication
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  try {
    const payload = await verifyToken(token)
    const userRole = payload.role as string
    
    // Check if route requires specific roles
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1]
    
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = getDashboardUrl(userRole)
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
    
    // Add user info to request headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.id as string)
    response.headers.set('x-user-role', userRole)
    response.headers.set('x-user-email', payload.email as string)
    
    return response
    
  } catch (error) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth-token')
    return response
  }
}

function getDashboardUrl(role: string): string {
  switch (role) {
    case 'student': return '/student'
    case 'teacher': return '/teacher'
    case 'coach': return '/coach'
    case 'guardian': return '/guardian'
    case 'ministry': return '/ministry'
    case 'admin': return '/admin'
    case 'competition_manager': return '/competitions'
    default: return '/login'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}