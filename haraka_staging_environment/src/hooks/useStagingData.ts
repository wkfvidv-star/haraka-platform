// Hook لإدارة البيانات التجريبية
// Staging Data Management Hook

import { useState, useEffect, useCallback } from 'react';
import { stagingApi, StagingApiResponse } from '@/services/staging-api-client';
import { isStaging } from '@/config/staging';

export interface StagingDataState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isStaging: boolean;
}

export function useStagingData<T = any>(
  endpoint: string,
  options: {
    autoFetch?: boolean;
    refreshInterval?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const {
    autoFetch = true,
    refreshInterval,
    onSuccess,
    onError
  } = options;

  const [state, setState] = useState<StagingDataState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    isStaging: isStaging()
  });

  // جلب البيانات
  const fetchData = useCallback(async () => {
    if (!isStaging()) {
      setState(prev => ({
        ...prev,
        error: 'هذا الـ Hook متاح فقط في البيئة التجريبية',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response: StagingApiResponse<T>;

      // تحديد نوع الطلب بناءً على الـ endpoint
      switch (endpoint) {
        case 'school-analytics':
          response = await stagingApi.getSchoolAnalytics();
          break;
        case 'students-at-risk':
          response = await stagingApi.getStudentsAtRisk();
          break;
        case 'notifications':
          response = await stagingApi.getNotifications();
          break;
        case 'health':
          response = await stagingApi.healthCheck();
          break;
        default:
          throw new Error(`Endpoint غير مدعوم: ${endpoint}`);
      }

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          lastUpdated: new Date()
        }));

        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        throw new Error(response.error || 'فشل في جلب البيانات');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));

      if (onError) {
        onError(errorMessage);
      }

      console.error(`❌ خطأ في جلب البيانات التجريبية (${endpoint}):`, error);
    }
  }, [endpoint, onSuccess, onError]);

  // تحديث البيانات
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // إعادة تعيين الحالة
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
      isStaging: isStaging()
    });
  }, []);

  // جلب البيانات تلقائياً
  useEffect(() => {
    if (autoFetch && isStaging()) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // تحديث دوري
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0 && isStaging()) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  return {
    ...state,
    refetch,
    reset,
    fetchData
  };
}

// Hook متخصص للتحليلات العامة
export function useSchoolAnalytics(options?: {
  refreshInterval?: number;
  onDataUpdate?: (data: any) => void;
}) {
  return useStagingData('school-analytics', {
    autoFetch: true,
    refreshInterval: options?.refreshInterval || 30000, // كل 30 ثانية
    onSuccess: options?.onDataUpdate
  });
}

// Hook متخصص للطلاب المحتاجين للمتابعة
export function useStudentsAtRisk(threshold: number = 60) {
  const [currentThreshold, setCurrentThreshold] = useState(threshold);
  
  const result = useStagingData('students-at-risk', {
    autoFetch: true,
    refreshInterval: 60000 // كل دقيقة
  });

  const updateThreshold = useCallback((newThreshold: number) => {
    setCurrentThreshold(newThreshold);
    // يمكن إضافة منطق لإعادة جلب البيانات بالحد الجديد
  }, []);

  return {
    ...result,
    threshold: currentThreshold,
    updateThreshold
  };
}

// Hook متخصص للإشعارات
export function useStagingNotifications() {
  const result = useStagingData('notifications', {
    autoFetch: true,
    refreshInterval: 15000 // كل 15 ثانية
  });

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await stagingApi.markNotificationAsRead(notificationId);
      if (response.success) {
        // تحديث البيانات المحلية
        result.refetch();
      }
      return response;
    } catch (error) {
      console.error('❌ خطأ في تحديث حالة الإشعار:', error);
      return { success: false, error: 'فشل في تحديث الإشعار' };
    }
  }, [result]);

  const unreadCount = result.data?.unreadCount || 0;

  return {
    ...result,
    markAsRead,
    unreadCount
  };
}

// Hook لرفع الفيديوهات التجريبية
export function useStagingVideoUpload() {
  const [uploadState, setUploadState] = useState({
    uploading: false,
    progress: 0,
    result: null as any,
    error: null as string | null
  });

  const uploadVideo = useCallback(async (
    videoFile: File,
    studentData: {
      student_name: string;
      class_name: string;
      teacher_name?: string;
    }
  ) => {
    if (!isStaging()) {
      throw new Error('رفع الفيديو التجريبي متاح فقط في البيئة التجريبية');
    }

    setUploadState({
      uploading: true,
      progress: 0,
      result: null,
      error: null
    });

    try {
      // محاكاة تقدم الرفع
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      const response = await stagingApi.uploadVideo(videoFile, studentData);

      clearInterval(progressInterval);

      if (response.success) {
        setUploadState({
          uploading: false,
          progress: 100,
          result: response.data,
          error: null
        });
      } else {
        throw new Error(response.error || 'فشل في رفع الفيديو');
      }

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في رفع الفيديو';
      
      setUploadState({
        uploading: false,
        progress: 0,
        result: null,
        error: errorMessage
      });

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadState({
      uploading: false,
      progress: 0,
      result: null,
      error: null
    });
  }, []);

  return {
    ...uploadState,
    uploadVideo,
    reset
  };
}

export default useStagingData;