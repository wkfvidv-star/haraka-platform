// نظام إدارة الموافقة للأطفال
export interface ConsentRecord {
  id: string
  child_id: string
  guardian_id: string
  consent_type: 'video_upload' | 'data_analysis' | 'performance_tracking'
  granted: boolean
  granted_at?: Date
  revoked_at?: Date
  expires_at?: Date
  metadata?: Record<string, any>
}

export interface Child {
  id: string
  name: string
  date_of_birth: string
  guardian_id: string
  school_id?: string
  class_id?: string
}

export class ConsentManager {
  // التحقق من الحاجة لموافقة ولي الأمر
  static requiresParentalConsent(user: any): boolean {
    if (!user?.profile?.date_of_birth) {
      return true // افتراض الحاجة للموافقة إذا لم يكن التاريخ متوفراً
    }

    try {
      const birthDate = new Date(user.profile.date_of_birth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1
      }

      return age < 18
    } catch (error) {
      console.error('Error calculating age:', error)
      return true // افتراض الحاجة للموافقة في حالة الخطأ
    }
  }

  // التحقق من وجود موافقة صالحة
  static hasValidConsent(
    consents: ConsentRecord[], 
    childId: string, 
    consentType: string
  ): boolean {
    const consent = consents.find(c => 
      c.child_id === childId && 
      c.consent_type === consentType &&
      c.granted === true &&
      !c.revoked_at &&
      (!c.expires_at || new Date(c.expires_at) > new Date())
    )
    
    return !!consent
  }

  // إنشاء موافقة جديدة
  static createConsent(
    childId: string,
    guardianId: string,
    consentType: 'video_upload' | 'data_analysis' | 'performance_tracking',
    metadata?: Record<string, any>
  ): Omit<ConsentRecord, 'id'> {
    return {
      child_id: childId,
      guardian_id: guardianId,
      consent_type: consentType,
      granted: true,
      granted_at: new Date(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // سنة واحدة
      metadata: metadata || {}
    }
  }

  // سحب الموافقة
  static revokeConsent(consent: ConsentRecord): ConsentRecord {
    return {
      ...consent,
      granted: false,
      revoked_at: new Date()
    }
  }

  // التحقق من صلاحيات ولي الأمر
  static canManageChild(guardianId: string, child: Child): boolean {
    return child.guardian_id === guardianId
  }

  // الحصول على جميع الموافقات لطفل معين
  static getChildConsents(consents: ConsentRecord[], childId: string): ConsentRecord[] {
    return consents.filter(c => c.child_id === childId)
  }

  // التحقق من انتهاء صلاحية الموافقة
  static isConsentExpired(consent: ConsentRecord): boolean {
    if (!consent.expires_at) return false
    return new Date(consent.expires_at) <= new Date()
  }

  // الحصول على الموافقات المنتهية الصلاحية
  static getExpiredConsents(consents: ConsentRecord[]): ConsentRecord[] {
    return consents.filter(c => this.isConsentExpired(c))
  }

  // إحصائيات الموافقة
  static getConsentStats(consents: ConsentRecord[]) {
    const total = consents.length
    const granted = consents.filter(c => c.granted && !c.revoked_at).length
    const revoked = consents.filter(c => c.revoked_at).length
    const expired = consents.filter(c => this.isConsentExpired(c)).length

    return {
      total,
      granted,
      revoked,
      expired,
      active: granted - expired
    }
  }
}

// أنواع الموافقة المختلفة
export const CONSENT_TYPES = {
  VIDEO_UPLOAD: 'video_upload',
  DATA_ANALYSIS: 'data_analysis', 
  PERFORMANCE_TRACKING: 'performance_tracking'
} as const

// رسائل النظام
export const CONSENT_MESSAGES = {
  AR: {
    CONSENT_REQUIRED: 'مطلوب موافقة ولي الأمر',
    CONSENT_GRANTED: 'تم منح الموافقة بنجاح',
    CONSENT_REVOKED: 'تم سحب الموافقة',
    CONSENT_EXPIRED: 'انتهت صلاحية الموافقة',
    UNAUTHORIZED: 'غير مخول للوصول',
    MINOR_PROTECTION: 'حماية القاصرين مفعلة'
  },
  EN: {
    CONSENT_REQUIRED: 'Parental consent required',
    CONSENT_GRANTED: 'Consent granted successfully',
    CONSENT_REVOKED: 'Consent revoked',
    CONSENT_EXPIRED: 'Consent expired',
    UNAUTHORIZED: 'Unauthorized access',
    MINOR_PROTECTION: 'Minor protection enabled'
  }
}