import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key'

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface VideoUpload {
  id: string
  user_id: string
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  storage_path: string
  upload_status: 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed'
  processing_status?: 'pending' | 'analyzing' | 'completed' | 'failed'
  analysis_results?: AnalysisResults
  consent_status: 'required' | 'pending' | 'approved' | 'rejected'
  guardian_id?: string
  created_at: string
  updated_at: string
  metadata?: {
    duration?: number
    resolution?: string
    sport_type?: string
    session_notes?: string
  }
}

export interface AnalysisResults {
  overall_score: number
  balance_score: number
  speed_score: number
  accuracy_score: number
  technique_score: number
  recommendations: string[]
  key_moments: {
    timestamp: number
    description: string
    score: number
  }[]
  biomechanics: {
    joint_angles: Record<string, number>
    center_of_mass: { x: number; y: number; z: number }[]
    velocity_profile: number[]
  }
  comparison_data?: {
    previous_sessions: number[]
    peer_average: number
    improvement_trend: 'improving' | 'stable' | 'declining'
  }
}

export interface ConsentRecord {
  id: string
  student_id: string
  guardian_id: string
  video_id: string
  consent_type: 'video_analysis' | 'data_sharing' | 'research_participation'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  guardian_signature?: string
  consent_date?: string
  expiry_date?: string
  created_at: string
  updated_at: string
}

// Storage buckets configuration
export const STORAGE_BUCKETS = {
  VIDEOS: 'student-videos',
  THUMBNAILS: 'video-thumbnails',
  REPORTS: 'analysis-reports',
  CONSENT_DOCS: 'consent-documents'
} as const

// File upload helpers
export class SupabaseStorage {
  static async uploadVideo(
    file: File,
    userId: string,
    metadata?: { sport_type?: string; session_notes?: string }
  ): Promise<{ data: VideoUpload | null; error: string | null }> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Create database record
      const videoRecord: Partial<VideoUpload> = {
        user_id: userId,
        filename: fileName,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: uploadData.path,
        upload_status: 'uploaded',
        processing_status: 'pending',
        consent_status: 'required',
        metadata: {
          sport_type: metadata?.sport_type,
          session_notes: metadata?.session_notes
        }
      }

      const { data: dbData, error: dbError } = await supabase
        .from('video_uploads')
        .insert(videoRecord)
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from(STORAGE_BUCKETS.VIDEOS).remove([fileName])
        throw new Error(`Database error: ${dbError.message}`)
      }

      return { data: dbData, error: null }

    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    }
  }

  static async getVideoUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .createSignedUrl(path, expiresIn)
      
      return data?.signedUrl || null
    } catch (error) {
      console.error('Error getting video URL:', error)
      return null
    }
  }

  static async deleteVideo(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.VIDEOS)
        .remove([path])
      
      return !error
    } catch (error) {
      console.error('Error deleting video:', error)
      return false
    }
  }

  static async generateThumbnail(videoPath: string): Promise<string | null> {
    // In a real implementation, this would use a video processing service
    // For demo purposes, we'll return a placeholder
    try {
      const thumbnailPath = videoPath.replace(/\.[^/.]+$/, '_thumb.jpg')
      
      // This would typically involve:
      // 1. Extract frame from video at specific timestamp
      // 2. Resize and optimize image
      // 3. Upload to thumbnails bucket
      
      return thumbnailPath
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      return null
    }
  }
}

// Real-time subscriptions
export class SupabaseRealtime {
  static subscribeToVideoUpdates(
    userId: string, 
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('video-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_uploads',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToConsentUpdates(
    studentId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('consent-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consent_records',
          filter: `student_id=eq.${studentId}`
        },
        callback
      )
      .subscribe()
  }
}

// Database initialization
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    const { error: videoTableError } = await supabaseAdmin.rpc('create_video_uploads_table')
    const { error: consentTableError } = await supabaseAdmin.rpc('create_consent_records_table')
    
    // Create storage buckets
    const buckets = Object.values(STORAGE_BUCKETS)
    for (const bucket of buckets) {
      const { error } = await supabaseAdmin.storage.createBucket(bucket, {
        public: false,
        allowedMimeTypes: bucket === STORAGE_BUCKETS.VIDEOS 
          ? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
          : undefined
      })
      
      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucket}:`, error)
      }
    }

    // Set up Row Level Security policies
    await setupRLSPolicies()
    
    return { success: true }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, error }
  }
}

async function setupRLSPolicies() {
  // Enable RLS on tables
  await supabaseAdmin.rpc('enable_rls_video_uploads')
  await supabaseAdmin.rpc('enable_rls_consent_records')
  
  // Create policies for video uploads
  await supabaseAdmin.rpc('create_video_upload_policies')
  
  // Create policies for consent records
  await supabaseAdmin.rpc('create_consent_record_policies')
}