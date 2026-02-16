'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: User['role'][]
  fallbackUrl?: string
}

export function AuthGuard({ children, requiredRoles, fallbackUrl = '/login' }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        
        // Check role requirements
        if (requiredRoles && !requiredRoles.includes(data.user.role)) {
          router.push(getDashboardUrl(data.user.role))
          return
        }
      } else {
        router.push(fallbackUrl)
      }
    } catch (error) {
      router.push(fallbackUrl)
    } finally {
      setIsLoading(false)
    }
  }

  const getDashboardUrl = (role: string): string => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}