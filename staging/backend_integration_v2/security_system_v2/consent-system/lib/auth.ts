import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'guardian' | 'coach' | 'ministry' | 'admin' | 'competition_manager'
  school_id?: string
  region_id?: string
  created_at: string
  is_active: boolean
  profile?: {
    avatar?: string
    phone?: string
    date_of_birth?: string
    gender?: 'male' | 'female'
    grade?: string
    sport_preferences?: string[]
  }
}

export interface AuthSession {
  user: User
  token: string
  expires: Date
}

// Generate JWT token
export async function generateToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    school_id: user.school_id,
    region_id: user.region_id
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const payload = await verifyToken(token)
    
    // In real app, fetch user data from database
    const user: User = {
      id: payload.id as string,
      email: payload.email as string,
      name: 'المستخدم الحالي', // In real app, get from DB
      role: payload.role as User['role'],
      school_id: payload.school_id as string,
      region_id: payload.region_id as string,
      created_at: new Date().toISOString(),
      is_active: true
    }

    return user
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })
}

// Clear auth cookie
export function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete('auth-token')
}

// Check if user has required role
export function hasRole(user: User, requiredRoles: User['role'][]): boolean {
  return requiredRoles.includes(user.role)
}

// Check if user can access resource
export function canAccessResource(user: User, resourceOwnerId?: string, requiredRoles?: User['role'][]): boolean {
  // Admin can access everything
  if (user.role === 'admin') return true
  
  // Check role requirements
  if (requiredRoles && !hasRole(user, requiredRoles)) return false
  
  // Check resource ownership
  if (resourceOwnerId && user.id !== resourceOwnerId) {
    // Teachers can access their students
    if (user.role === 'teacher') return true
    // Coaches can access their athletes
    if (user.role === 'coach') return true
    // Ministry can access their region
    if (user.role === 'ministry') return true
    
    return false
  }
  
  return true
}

// Mock user database (in real app, use Supabase)
export const mockUsers: (User & { password: string })[] = [
  {
    id: 'user-001',
    email: 'student@haraka.sa',
    name: 'أحمد محمد الطالب',
    role: 'student',
    school_id: 'school-001',
    region_id: 'riyadh',
    created_at: '2025-01-01T00:00:00Z',
    is_active: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxnYxKK.', // password123
    profile: {
      phone: '+966501234567',
      date_of_birth: '2008-05-15',
      gender: 'male',
      grade: 'الصف العاشر',
      sport_preferences: ['كرة القدم', 'السباحة']
    }
  },
  {
    id: 'user-002',
    email: 'teacher@haraka.sa',
    name: 'فاطمة أحمد المعلمة',
    role: 'teacher',
    school_id: 'school-001',
    region_id: 'riyadh',
    created_at: '2025-01-01T00:00:00Z',
    is_active: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxnYxKK.', // password123
    profile: {
      phone: '+966507654321',
      gender: 'female'
    }
  },
  {
    id: 'user-003',
    email: 'coach@haraka.sa',
    name: 'خالد سعد المدرب',
    role: 'coach',
    school_id: 'school-001',
    region_id: 'riyadh',
    created_at: '2025-01-01T00:00:00Z',
    is_active: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxnYxKK.', // password123
    profile: {
      phone: '+966502345678',
      gender: 'male'
    }
  },
  {
    id: 'user-004',
    email: 'admin@haraka.sa',
    name: 'سارة عبدالله الإدارية',
    role: 'admin',
    region_id: 'riyadh',
    created_at: '2025-01-01T00:00:00Z',
    is_active: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxnYxKK.', // password123
    profile: {
      phone: '+966503456789',
      gender: 'female'
    }
  },
  {
    id: 'user-005',
    email: 'ministry@haraka.sa',
    name: 'عبدالرحمن محمد الوزارة',
    role: 'ministry',
    region_id: 'riyadh',
    created_at: '2025-01-01T00:00:00Z',
    is_active: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxnYxKK.', // password123
    profile: {
      phone: '+966504567890',
      gender: 'male'
    }
  }
]

// Find user by email
export async function findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  // In real app, query Supabase
  const user = mockUsers.find(u => u.email === email && u.is_active)
  return user || null
}

// Find user by ID
export async function findUserById(id: string): Promise<User | null> {
  // In real app, query Supabase
  const user = mockUsers.find(u => u.id === id && u.is_active)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

// Create new user
export async function createUser(userData: {
  email: string
  password: string
  name: string
  role: User['role']
  school_id?: string
  region_id?: string
}): Promise<User> {
  const hashedPassword = await hashPassword(userData.password)
  
  const newUser: User & { password: string } = {
    id: `user-${Date.now()}`,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    school_id: userData.school_id,
    region_id: userData.region_id,
    created_at: new Date().toISOString(),
    is_active: true,
    password: hashedPassword
  }
  
  // In real app, insert into Supabase
  mockUsers.push(newUser)
  
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}