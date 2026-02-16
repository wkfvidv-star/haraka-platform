'use client'

import { AuthGuard } from '@/components/auth-guard'
import VideoUploadWizard from '@/components/video-upload-wizard'

export default function UploadPage() {
  return (
    <AuthGuard requiredRoles={['student']}>
      <div className="min-h-screen bg-gray-50">
        <VideoUploadWizard />
      </div>
    </AuthGuard>
  )
}