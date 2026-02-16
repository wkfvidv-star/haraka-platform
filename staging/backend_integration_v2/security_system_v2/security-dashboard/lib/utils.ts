import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'منذ لحظات'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `منذ ${minutes} دقيقة`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `منذ ${hours} ساعة`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `منذ ${days} يوم`
  }
}

export function getThreatLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 8) return 'high'
  if (score >= 5) return 'medium'
  return 'low'
}

export function getThreatLevelText(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'high': return 'عالي'
    case 'medium': return 'متوسط'
    case 'low': return 'منخفض'
  }
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    'student': 'طالب',
    'youth': 'شاب',
    'guardian': 'ولي أمر',
    'teacher': 'معلم',
    'trainer': 'مدرب',
    'education_directorate': 'مديرية التربية',
    'ministry': 'الوزارة',
    'competition_organizer': 'منظم مسابقات',
    'admin': 'مدير النظام',
    'anonymous': 'مجهول'
  }
  return roleNames[role] || role
}

export function getActionDisplayName(action: string): string {
  const actionNames: Record<string, string> = {
    'SELECT': 'قراءة',
    'INSERT': 'إضافة',
    'UPDATE': 'تحديث',
    'DELETE': 'حذف',
    'LOGIN': 'تسجيل دخول',
    'LOGOUT': 'تسجيل خروج',
    'ACCESS_DENIED': 'وصول مرفوض'
  }
  return actionNames[action] || action
}