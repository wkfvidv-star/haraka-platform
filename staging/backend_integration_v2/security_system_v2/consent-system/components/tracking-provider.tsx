'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAutoTracking } from '@/hooks/use-auto-tracking'

// Tracking context
interface TrackingContextType {
  trackPageView: (path?: string) => void
  trackClick: (element: HTMLElement, customData?: Record<string, any>) => void
  trackFormSubmission: (form: HTMLFormElement, formData?: Record<string, any>) => void
  trackVideoUpload: (videoData: any) => void
  trackConsentAction: (action: 'grant' | 'revoke', consentData: any) => void
  trackDataAccess: (accessData: any) => void
  trackCustomEvent: (eventData: any) => void
  sessionId?: string
  userId?: string
}

const TrackingContext = createContext<TrackingContextType | null>(null)

// Provider component
interface TrackingProviderProps {
  children: React.ReactNode
  config?: {
    enabled?: boolean
    userId?: string
    trackingRules?: {
      trackClicks?: boolean
      trackPageViews?: boolean
      trackFormSubmissions?: boolean
      trackVideoUploads?: boolean
      trackConsentActions?: boolean
      trackDataAccess?: boolean
    }
  }
}

export function TrackingProvider({ children, config = {} }: TrackingProviderProps) {
  const tracking = useAutoTracking({
    enabled: config.enabled ?? true,
    trackingRules: {
      trackClicks: config.trackingRules?.trackClicks ?? true,
      trackPageViews: config.trackingRules?.trackPageViews ?? true,
      trackFormSubmissions: config.trackingRules?.trackFormSubmissions ?? true,
      trackVideoUploads: config.trackingRules?.trackVideoUploads ?? true,
      trackConsentActions: config.trackingRules?.trackConsentActions ?? true,
      trackDataAccess: config.trackingRules?.trackDataAccess ?? true
    }
  })

  // Set user ID if provided
  useEffect(() => {
    if (config.userId && typeof window !== 'undefined') {
      localStorage.setItem('userId', config.userId)
    }
  }, [config.userId])

  return (
    <TrackingContext.Provider value={tracking}>
      {children}
    </TrackingContext.Provider>
  )
}

// Hook to use tracking context
export function useTracking() {
  const context = useContext(TrackingContext)
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider')
  }
  return context
}

// Higher-order component for automatic tracking
export function withTracking<T extends {}>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function TrackedComponent(props: T) {
    const tracking = useTracking()
    
    useEffect(() => {
      // Track component mount
      tracking.trackCustomEvent({
        action: 'COMPONENT_MOUNT',
        resourceType: 'component',
        resourceId: componentName,
        metadata: {
          component: componentName,
          props: Object.keys(props as any)
        }
      })
      
      return () => {
        // Track component unmount
        tracking.trackCustomEvent({
          action: 'COMPONENT_UNMOUNT',
          resourceType: 'component',
          resourceId: componentName,
          metadata: {
            component: componentName
          }
        })
      }
    }, [])
    
    return <Component {...props} />
  }
}

// Component for tracking specific UI interactions
interface TrackingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingData?: Record<string, any>
  children: React.ReactNode
}

export function TrackingButton({ trackingData, onClick, children, ...props }: TrackingButtonProps) {
  const tracking = useTracking()
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click
    tracking.trackClick(event.currentTarget, {
      ...trackingData,
      buttonText: event.currentTarget.textContent,
      buttonType: props.type || 'button'
    })
    
    // Call original onClick handler
    if (onClick) {
      onClick(event)
    }
  }
  
  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}

// Component for tracking form submissions
interface TrackingFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  trackingData?: Record<string, any>
  children: React.ReactNode
}

export function TrackingForm({ trackingData, onSubmit, children, ...props }: TrackingFormProps) {
  const tracking = useTracking()
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
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
    
    // Track the form submission
    tracking.trackFormSubmission(form, {
      ...trackingData,
      ...formDataObj
    })
    
    // Call original onSubmit handler
    if (onSubmit) {
      onSubmit(event)
    }
  }
  
  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

// Hook for tracking video upload events
export function useVideoUploadTracking() {
  const tracking = useTracking()
  
  const trackVideoUploadStart = (videoData: {
    fileName: string
    fileSize: number
    studentId?: string
    hasConsent?: boolean
  }) => {
    tracking.trackVideoUpload({
      ...videoData,
      uploadStatus: 'started'
    })
  }
  
  const trackVideoUploadSuccess = (videoData: {
    fileName: string
    fileSize: number
    duration?: number
    studentId?: string
    videoId?: string
  }) => {
    tracking.trackVideoUpload({
      ...videoData,
      uploadStatus: 'success'
    })
  }
  
  const trackVideoUploadError = (videoData: {
    fileName: string
    fileSize: number
    studentId?: string
    error: string
  }) => {
    tracking.trackVideoUpload({
      ...videoData,
      uploadStatus: 'error'
    })
  }
  
  return {
    trackVideoUploadStart,
    trackVideoUploadSuccess,
    trackVideoUploadError
  }
}

// Hook for tracking consent actions
export function useConsentTracking() {
  const tracking = useTracking()
  
  const trackConsentModalOpen = (studentData: { studentId: string, guardianId: string }) => {
    tracking.trackCustomEvent({
      action: 'CONSENT_MODAL_OPEN',
      resourceType: 'consent_modal',
      resourceId: `consent_${studentData.studentId}`,
      metadata: studentData
    })
  }
  
  const trackConsentModalClose = (studentData: { studentId: string, guardianId: string }, action: 'granted' | 'denied' | 'dismissed') => {
    tracking.trackCustomEvent({
      action: 'CONSENT_MODAL_CLOSE',
      resourceType: 'consent_modal',
      resourceId: `consent_${studentData.studentId}`,
      metadata: {
        ...studentData,
        modalAction: action
      }
    })
  }
  
  const trackConsentGrant = (consentData: {
    childId: string
    guardianId: string
    scope: string
    version: string
  }) => {
    tracking.trackConsentAction('grant', consentData)
  }
  
  const trackConsentRevoke = (consentData: {
    childId: string
    guardianId: string
    scope: string
    reason?: string
  }) => {
    tracking.trackConsentAction('revoke', consentData)
  }
  
  return {
    trackConsentModalOpen,
    trackConsentModalClose,
    trackConsentGrant,
    trackConsentRevoke
  }
}

// Hook for tracking data access events
export function useDataAccessTracking() {
  const tracking = useTracking()
  
  const trackReportView = (reportData: {
    reportId: string
    studentId: string
    reportType: string
    viewerRole: string
  }) => {
    tracking.trackDataAccess({
      dataType: 'student_report',
      resourceId: reportData.reportId,
      operation: 'read',
      studentId: reportData.studentId,
      reportType: reportData.reportType,
      viewerRole: reportData.viewerRole
    })
  }
  
  const trackVideoDecryption = (videoData: {
    videoId: string
    studentId: string
    requestedBy: string
    purpose: string
  }) => {
    tracking.trackDataAccess({
      dataType: 'encrypted_video',
      resourceId: videoData.videoId,
      operation: 'decrypt',
      studentId: videoData.studentId,
      requestedBy: videoData.requestedBy,
      purpose: videoData.purpose
    })
  }
  
  const trackDataExport = (exportData: {
    dataType: string
    recordCount: number
    exportFormat: string
    requestedBy: string
  }) => {
    tracking.trackDataAccess({
      dataType: exportData.dataType,
      resourceId: `export_${Date.now()}`,
      operation: 'read',
      recordCount: exportData.recordCount,
      exportFormat: exportData.exportFormat,
      requestedBy: exportData.requestedBy
    })
  }
  
  return {
    trackReportView,
    trackVideoDecryption,
    trackDataExport
  }
}