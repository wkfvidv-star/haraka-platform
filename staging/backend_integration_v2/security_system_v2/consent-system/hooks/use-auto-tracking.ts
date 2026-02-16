'use client'

import { useEffect, useRef } from 'react'

// Auto-tracking configuration
interface TrackingConfig {
  enabled: boolean
  endpoints: {
    audit: string
    security: string
  }
  trackingRules: {
    trackClicks: boolean
    trackPageViews: boolean
    trackFormSubmissions: boolean
    trackVideoUploads: boolean
    trackConsentActions: boolean
    trackDataAccess: boolean
  }
  sensitiveActions: string[]
  excludeElements: string[]
}

const defaultConfig: TrackingConfig = {
  enabled: true,
  endpoints: {
    audit: '/api/audit/log',
    security: '/api/security/event'
  },
  trackingRules: {
    trackClicks: true,
    trackPageViews: true,
    trackFormSubmissions: true,
    trackVideoUploads: true,
    trackConsentActions: true,
    trackDataAccess: true
  },
  sensitiveActions: [
    'video-upload',
    'consent-grant',
    'consent-revoke',
    'data-decrypt',
    'report-view',
    'user-login',
    'user-logout',
    'admin-action'
  ],
  excludeElements: [
    '.no-track',
    '[data-no-track]',
    '.tracking-exclude'
  ]
}

// Event data interface
interface TrackingEvent {
  eventType: string
  action: string
  resourceType?: string
  resourceId?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
  timestamp: string
  userAgent: string
  url: string
  referrer?: string
}

export function useAutoTracking(config: Partial<TrackingConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }
  const sessionId = useRef<string>()
  const userId = useRef<string>()

  // Initialize session
  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Get user ID from auth context or localStorage
    const storedUserId = localStorage.getItem('userId') || 
                        document.cookie.split(';').find(c => c.trim().startsWith('userId='))?.split('=')[1]
    if (storedUserId) {
      userId.current = storedUserId
    }
  }, [])

  // Send tracking event to backend
  const sendTrackingEvent = async (event: TrackingEvent) => {
    if (!finalConfig.enabled) return

    try {
      // Add session and user context
      const enrichedEvent = {
        ...event,
        sessionId: sessionId.current,
        userId: userId.current || 'anonymous',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }

      // Send to audit endpoint
      await fetch(finalConfig.endpoints.audit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedEvent)
      })

      // Send high-risk events to security endpoint
      if (finalConfig.sensitiveActions.includes(event.action)) {
        await fetch(finalConfig.endpoints.security, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...enrichedEvent,
            riskLevel: 'high',
            requiresReview: true
          })
        })
      }
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }

  // Track page view
  const trackPageView = (path?: string) => {
    if (!finalConfig.trackingRules.trackPageViews) return

    sendTrackingEvent({
      eventType: 'page_view',
      action: 'PAGE_VIEW',
      resourceType: 'page',
      resourceId: path || window.location.pathname,
      metadata: {
        title: document.title,
        path: path || window.location.pathname,
        search: window.location.search
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track click events
  const trackClick = (element: HTMLElement, customData?: Record<string, any>) => {
    if (!finalConfig.trackingRules.trackClicks) return

    // Check if element should be excluded
    const shouldExclude = finalConfig.excludeElements.some(selector => {
      if (selector.startsWith('.')) {
        return element.classList.contains(selector.slice(1))
      } else if (selector.startsWith('[') && selector.endsWith(']')) {
        const attrName = selector.slice(1, -1).split('=')[0]
        return element.hasAttribute(attrName)
      }
      return false
    })

    if (shouldExclude) return

    const elementInfo = {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.slice(0, 100),
      href: element.getAttribute('href'),
      type: element.getAttribute('type'),
      name: element.getAttribute('name')
    }

    sendTrackingEvent({
      eventType: 'user_interaction',
      action: 'CLICK',
      resourceType: 'ui_element',
      resourceId: element.id || `${element.tagName}_${Date.now()}`,
      metadata: {
        ...elementInfo,
        ...customData
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track form submission
  const trackFormSubmission = (form: HTMLFormElement, formData?: Record<string, any>) => {
    if (!finalConfig.trackingRules.trackFormSubmissions) return

    const formInfo = {
      formId: form.id,
      formName: form.name,
      action: form.action,
      method: form.method,
      fieldCount: form.elements.length
    }

    sendTrackingEvent({
      eventType: 'form_submission',
      action: 'FORM_SUBMIT',
      resourceType: 'form',
      resourceId: form.id || `form_${Date.now()}`,
      metadata: {
        ...formInfo,
        formData: formData || {}
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track video upload
  const trackVideoUpload = (videoData: {
    fileName: string
    fileSize: number
    duration?: number
    studentId?: string
    hasConsent?: boolean
  }) => {
    if (!finalConfig.trackingRules.trackVideoUploads) return

    sendTrackingEvent({
      eventType: 'video_upload',
      action: 'UPLOAD_VIDEO',
      resourceType: 'exercise_session',
      resourceId: `video_${Date.now()}`,
      metadata: {
        ...videoData,
        uploadTimestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track consent actions
  const trackConsentAction = (action: 'grant' | 'revoke', consentData: {
    childId: string
    guardianId: string
    scope: string
    reason?: string
  }) => {
    if (!finalConfig.trackingRules.trackConsentActions) return

    sendTrackingEvent({
      eventType: 'consent_action',
      action: action === 'grant' ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
      resourceType: 'consent',
      resourceId: `consent_${consentData.childId}_${Date.now()}`,
      metadata: consentData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track data access
  const trackDataAccess = (accessData: {
    dataType: string
    resourceId: string
    operation: 'read' | 'write' | 'delete' | 'decrypt'
    studentId?: string
  }) => {
    if (!finalConfig.trackingRules.trackDataAccess) return

    sendTrackingEvent({
      eventType: 'data_access',
      action: `DATA_${accessData.operation.toUpperCase()}`,
      resourceType: accessData.dataType,
      resourceId: accessData.resourceId,
      metadata: accessData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Track custom events
  const trackCustomEvent = (eventData: Partial<TrackingEvent>) => {
    sendTrackingEvent({
      eventType: 'custom',
      action: 'CUSTOM_EVENT',
      ...eventData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Auto-setup click tracking
  useEffect(() => {
    if (!finalConfig.trackingRules.trackClicks) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target) {
        trackClick(target, {
          clickX: event.clientX,
          clickY: event.clientY,
          button: event.button,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey
        })
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [finalConfig.trackingRules.trackClicks])

  // Auto-setup form tracking
  useEffect(() => {
    if (!finalConfig.trackingRules.trackFormSubmissions) return

    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement
      if (form) {
        const formData = new FormData(form)
        const formDataObj: Record<string, any> = {}
        
        // Convert FormData to object (excluding sensitive fields)
        for (const [key, value] of formData.entries()) {
          if (!key.toLowerCase().includes('password') && 
              !key.toLowerCase().includes('secret') &&
              !key.toLowerCase().includes('token')) {
            formDataObj[key] = value
          }
        }
        
        trackFormSubmission(form, formDataObj)
      }
    }

    document.addEventListener('submit', handleFormSubmit, true)
    return () => document.removeEventListener('submit', handleFormSubmit, true)
  }, [finalConfig.trackingRules.trackFormSubmissions])

  // Track page view on mount and route changes
  useEffect(() => {
    trackPageView()

    // Listen for route changes (for SPA)
    const handlePopState = () => trackPageView()
    window.addEventListener('popstate', handlePopState)
    
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return {
    trackPageView,
    trackClick,
    trackFormSubmission,
    trackVideoUpload,
    trackConsentAction,
    trackDataAccess,
    trackCustomEvent,
    sessionId: sessionId.current,
    userId: userId.current,
    config: finalConfig
  }
}

// Higher-order component for auto-tracking
export function withAutoTracking<T extends {}>(
  Component: React.ComponentType<T>,
  trackingConfig?: Partial<TrackingConfig>
) {
  return function TrackedComponent(props: T) {
    const tracking = useAutoTracking(trackingConfig)
    
    return <Component {...props} tracking={tracking} />
  }
}

// Hook for tracking specific component interactions
export function useComponentTracking(componentName: string) {
  const tracking = useAutoTracking()
  
  const trackComponentEvent = (action: string, metadata?: Record<string, any>) => {
    tracking.trackCustomEvent({
      action: `${componentName.toUpperCase()}_${action.toUpperCase()}`,
      resourceType: 'component',
      resourceId: componentName,
      metadata: {
        component: componentName,
        ...metadata
      }
    })
  }
  
  return {
    ...tracking,
    trackComponentEvent
  }
}