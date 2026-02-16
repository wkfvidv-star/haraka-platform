// عميل API التجريبي للواجهة الأمامية
// Staging API Client for Frontend

import { STAGING_CONFIG, isStaging } from '@/config/staging';

export interface StagingApiResponse<T = any> {
  success: boolean;
  staging: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    environment: string;
    mockData?: boolean;
    generatedAt?: string;
  };
}

export class StagingApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    if (!isStaging()) {
      throw new Error('🚫 عميل API التجريبي متاح فقط في البيئة التجريبية');
    }

    this.baseUrl = STAGING_CONFIG.api.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Staging-Mode': 'true',
      'X-Environment': 'staging'
    };

    console.log('🔧 تم تهيئة عميل API التجريبي:', this.baseUrl);
  }

  // طريقة عامة لإرسال الطلبات
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<StagingApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`📡 طلب API تجريبي: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error('❌ خطأ في طلب API التجريبي:', error);
      return {
        success: false,
        staging: true,
        error: error instanceof Error ? error.message : 'خطأ في الشبكة'
      };
    }
  }

  // جلب التحليلات العامة للمدرسة
  async getSchoolAnalytics(): Promise<StagingApiResponse> {
    return this.request('/school-analytics');
  }

  // جلب تحليلات صف معين
  async getClassAnalytics(className?: string): Promise<StagingApiResponse> {
    const endpoint = className ? `/class-analytics/${encodeURIComponent(className)}` : '/class-analytics';
    return this.request(endpoint);
  }

  // جلب الطلاب المحتاجين للمتابعة
  async getStudentsAtRisk(threshold: number = 60): Promise<StagingApiResponse> {
    return this.request(`/students-at-risk?threshold=${threshold}`);
  }

  // تصدير تقرير
  async exportReport(reportConfig: {
    format: 'pdf' | 'csv' | 'excel';
    reportType: 'school' | 'class' | 'student';
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<StagingApiResponse> {
    return this.request('/export-report', {
      method: 'POST',
      body: JSON.stringify(reportConfig)
    });
  }

  // جلب الإشعارات
  async getNotifications(): Promise<StagingApiResponse> {
    return this.request('/notifications');
  }

  // تحديث حالة الإشعار
  async markNotificationAsRead(notificationId: number): Promise<StagingApiResponse> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  // فحص صحة النظام
  async healthCheck(): Promise<StagingApiResponse> {
    return this.request('/health');
  }

  // رفع فيديو تجريبي
  async uploadVideo(videoFile: File, studentData: {
    student_name: string;
    class_name: string;
    teacher_name?: string;
  }): Promise<StagingApiResponse> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('student_name', studentData.student_name);
      formData.append('class_name', studentData.class_name);
      if (studentData.teacher_name) {
        formData.append('teacher_name', studentData.teacher_name);
      }

      console.log('📤 رفع فيديو تجريبي:', videoFile.name);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'X-Staging-Mode': 'true',
          'X-Environment': 'staging'
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في رفع الفيديو');
      }

      return data;

    } catch (error) {
      console.error('❌ خطأ في رفع الفيديو التجريبي:', error);
      return {
        success: false,
        staging: true,
        error: error instanceof Error ? error.message : 'خطأ في رفع الفيديو'
      };
    }
  }

  // تنظيف البيانات التجريبية
  async cleanStagingData(): Promise<StagingApiResponse> {
    return this.request('/clean', {
      method: 'DELETE'
    });
  }

  // الحصول على معلومات البيئة التجريبية
  async getStagingInfo(): Promise<StagingApiResponse> {
    return this.request('/');
  }
}

// إنشاء مثيل واحد للاستخدام العام
export const stagingApi = new StagingApiClient();

// Hook لاستخدام API التجريبي في React
export function useStagingApi() {
  if (!isStaging()) {
    throw new Error('🚫 هذا الـ Hook متاح فقط في البيئة التجريبية');
  }

  return {
    api: stagingApi,
    isStaging: true,
    config: STAGING_CONFIG
  };
}

export default StagingApiClient;