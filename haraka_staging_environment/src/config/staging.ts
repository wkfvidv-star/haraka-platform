// إعدادات البيئة التجريبية لمنصة حركة
// ⚠️ هذه الإعدادات منفصلة تماماً عن النسخة الرسمية

export const STAGING_CONFIG = {
  // معلومات البيئة
  environment: 'staging',
  version: '2.0.0-staging',
  buildDate: '2024-10-08',
  
  // قاعدة البيانات التجريبية
  database: {
    url: import.meta.env.VITE_SUPABASE_URL_STAGING || 'https://staging-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_STAGING || 'staging-anon-key',
    serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY_STAGING || 'staging-service-key',
    schema: 'haraka_staging'
  },
  
  // واجهات API التجريبية
  api: {
    baseUrl: import.meta.env.VITE_API_URL_STAGING || 'http://localhost:3001/api/v2',
    uploadUrl: import.meta.env.VITE_UPLOAD_URL_STAGING || 'http://localhost:3001/upload/staging',
    analysisUrl: import.meta.env.VITE_ANALYSIS_URL_STAGING || 'http://localhost:3001/analysis/staging',
    timeout: 30000
  },
  
  // إعدادات التخزين
  storage: {
    videoBucket: 'haraka-staging-uploads',
    analysisBucket: 'haraka-staging-analysis',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFormats: ['mp4', 'mov', 'avi', 'webm']
  },
  
  // ميزات التجريب
  features: {
    videoUpload: true,
    aiAnalysis: true,
    realTimeNotifications: true,
    debugMode: true,
    mockData: true,
    stagingBanner: true
  },
  
  // إعدادات الأمان
  security: {
    accessToken: import.meta.env.VITE_STAGING_ACCESS_TOKEN || 'staging_secure_token_2024',
    corsOrigin: import.meta.env.VITE_CORS_ORIGIN_STAGING || 'http://localhost:5174',
    enableCSRF: false, // مُعطل في بيئة التجريب
    rateLimiting: false // مُعطل في بيئة التجريب
  },
  
  // رسائل التنبيه
  notices: {
    stagingBanner: 'هذه بيئة تجريبية - البيانات غير حقيقية',
    debugInfo: 'وضع التطوير مُفعل - معلومات إضافية متاحة',
    rollbackInfo: 'يمكن العودة للنسخة الرسمية بأمان'
  }
};

// التحقق من البيئة
export const isStaging = () => {
  return import.meta.env.VITE_ENVIRONMENT === 'staging' || 
         import.meta.env.MODE === 'staging';
};

// التحقق من تفعيل الميزات
export const isFeatureEnabled = (feature: keyof typeof STAGING_CONFIG.features) => {
  return STAGING_CONFIG.features[feature] && isStaging();
};

// معلومات النسخة
export const getVersionInfo = () => {
  return {
    version: STAGING_CONFIG.version,
    environment: STAGING_CONFIG.environment,
    buildDate: STAGING_CONFIG.buildDate,
    isStaging: isStaging()
  };
};

export default STAGING_CONFIG;