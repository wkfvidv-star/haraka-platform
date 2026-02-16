/**
 * إعدادات التشفير المتقدمة - منصة حركة
 * Advanced Encryption Configuration - Haraka Platform
 * 
 * يحتوي على جميع إعدادات التشفير والأمان
 * Contains all encryption and security configurations
 */

import { config } from 'dotenv';

// تحميل متغيرات البيئة
config();

/**
 * إعدادات KMS (Key Management System)
 */
export interface KMSConfig {
  provider: 'supabase_vault' | 'aws_kms' | 'google_kms' | 'azure_vault' | 'hashicorp_vault';
  region?: string;
  keyId?: string;
  endpoint?: string;
  credentials?: {
    accessKeyId?: string;
    secretAccessKey?: string;
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };
}

/**
 * إعدادات التشفير الأساسية
 */
export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
  keyDerivation: {
    iterations: number;
    saltLength: number;
    hashAlgorithm: string;
  };
}

/**
 * إعدادات تدوير المفاتيح
 */
export interface KeyRotationConfig {
  enabled: boolean;
  scheduleIntervalHours: number;
  defaultRotationDays: number;
  emergencyRotationEnabled: boolean;
  backupOldKeys: boolean;
  maxKeyVersions: number;
}

/**
 * إعدادات الملفات المشفرة
 */
export interface FileEncryptionConfig {
  maxFileSize: {
    video_analysis: number;
    student_reports: number;
    training_files: number;
    profile_images: number;
  };
  allowedMimeTypes: {
    video_analysis: string[];
    student_reports: string[];
    training_files: string[];
    profile_images: string[];
  };
  compressionEnabled: boolean;
  checksumAlgorithm: string;
  storageEncryption: boolean;
}

/**
 * إعدادات الوصول والأمان
 */
export interface SecurityConfig {
  signedUrlExpiration: {
    default: number;
    video_analysis: number;
    student_reports: number;
    training_files: number;
  };
  rateLimiting: {
    encryption: {
      windowMs: number;
      maxRequests: {
        admin: number;
        teacher: number;
        parent: number;
        student: number;
      };
    };
    fileAccess: {
      windowMs: number;
      maxRequests: {
        admin: number;
        teacher: number;
        parent: number;
        student: number;
      };
    };
  };
  ipRestrictions: {
    enabled: boolean;
    allowedRanges: string[];
    blockSuspiciousIPs: boolean;
  };
  auditLogging: {
    enabled: boolean;
    logLevel: 'minimal' | 'standard' | 'detailed';
    retentionDays: number;
  };
}

/**
 * إعدادات المراقبة والتنبيهات
 */
export interface MonitoringConfig {
  healthChecks: {
    enabled: boolean;
    intervalMinutes: number;
    endpoints: string[];
  };
  alerts: {
    enabled: boolean;
    channels: ('email' | 'sms' | 'webhook')[];
    thresholds: {
      failedDecryptions: number;
      keyRotationFailures: number;
      unusualAccess: number;
    };
  };
  metrics: {
    enabled: boolean;
    provider: 'prometheus' | 'cloudwatch' | 'datadog';
    customMetrics: boolean;
  };
}

/**
 * الفئة الرئيسية لإعدادات التشفير
 */
export class HarakaEncryptionConfig {
  public readonly kms: KMSConfig;
  public readonly encryption: EncryptionConfig;
  public readonly keyRotation: KeyRotationConfig;
  public readonly fileEncryption: FileEncryptionConfig;
  public readonly security: SecurityConfig;
  public readonly monitoring: MonitoringConfig;
  public readonly environment: 'development' | 'staging' | 'production';

  constructor() {
    this.environment = (process.env.NODE_ENV as any) || 'development';
    
    this.kms = this.initializeKMSConfig();
    this.encryption = this.initializeEncryptionConfig();
    this.keyRotation = this.initializeKeyRotationConfig();
    this.fileEncryption = this.initializeFileEncryptionConfig();
    this.security = this.initializeSecurityConfig();
    this.monitoring = this.initializeMonitoringConfig();

    this.validateConfiguration();
  }

  /**
   * تهيئة إعدادات KMS
   */
  private initializeKMSConfig(): KMSConfig {
    const provider = (process.env.KMS_PROVIDER as any) || 'supabase_vault';
    
    const config: KMSConfig = {
      provider,
      region: process.env.KMS_REGION,
      keyId: process.env.KMS_MASTER_KEY_ID,
      endpoint: process.env.KMS_ENDPOINT
    };

    // إعدادات خاصة بكل مزود KMS
    switch (provider) {
      case 'aws_kms':
        config.credentials = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        };
        break;
      
      case 'google_kms':
        config.credentials = {
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
          privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
        };
        break;
      
      case 'azure_vault':
        config.credentials = {
          // إعدادات Azure Key Vault
        };
        break;
      
      case 'supabase_vault':
      default:
        // استخدام Supabase Vault الافتراضي
        break;
    }

    return config;
  }

  /**
   * تهيئة إعدادات التشفير الأساسية
   */
  private initializeEncryptionConfig(): EncryptionConfig {
    return {
      algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
      keyLength: parseInt(process.env.ENCRYPTION_KEY_LENGTH || '32'), // 256 bits
      ivLength: parseInt(process.env.ENCRYPTION_IV_LENGTH || '16'),   // 128 bits
      tagLength: parseInt(process.env.ENCRYPTION_TAG_LENGTH || '16'), // 128 bits
      keyDerivation: {
        iterations: parseInt(process.env.KEY_DERIVATION_ITERATIONS || '100000'),
        saltLength: parseInt(process.env.KEY_DERIVATION_SALT_LENGTH || '32'),
        hashAlgorithm: process.env.KEY_DERIVATION_HASH || 'sha256'
      }
    };
  }

  /**
   * تهيئة إعدادات تدوير المفاتيح
   */
  private initializeKeyRotationConfig(): KeyRotationConfig {
    return {
      enabled: process.env.KEY_ROTATION_ENABLED === 'true',
      scheduleIntervalHours: parseInt(process.env.KEY_ROTATION_CHECK_INTERVAL_HOURS || '24'),
      defaultRotationDays: parseInt(process.env.KEY_ROTATION_DEFAULT_DAYS || '90'),
      emergencyRotationEnabled: process.env.EMERGENCY_KEY_ROTATION_ENABLED === 'true',
      backupOldKeys: process.env.BACKUP_OLD_KEYS === 'true',
      maxKeyVersions: parseInt(process.env.MAX_KEY_VERSIONS || '5')
    };
  }

  /**
   * تهيئة إعدادات تشفير الملفات
   */
  private initializeFileEncryptionConfig(): FileEncryptionConfig {
    return {
      maxFileSize: {
        video_analysis: parseInt(process.env.MAX_VIDEO_SIZE || '104857600'),    // 100 MB
        student_reports: parseInt(process.env.MAX_REPORT_SIZE || '10485760'),   // 10 MB
        training_files: parseInt(process.env.MAX_TRAINING_SIZE || '52428800'),  // 50 MB
        profile_images: parseInt(process.env.MAX_IMAGE_SIZE || '5242880')       // 5 MB
      },
      allowedMimeTypes: {
        video_analysis: (process.env.ALLOWED_VIDEO_TYPES || 'video/mp4,video/quicktime,video/x-msvideo').split(','),
        student_reports: (process.env.ALLOWED_REPORT_TYPES || 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document').split(','),
        training_files: (process.env.ALLOWED_TRAINING_TYPES || 'application/pdf,video/mp4,application/zip').split(','),
        profile_images: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',')
      },
      compressionEnabled: process.env.FILE_COMPRESSION_ENABLED === 'true',
      checksumAlgorithm: process.env.FILE_CHECKSUM_ALGORITHM || 'sha256',
      storageEncryption: process.env.STORAGE_ENCRYPTION_ENABLED !== 'false'
    };
  }

  /**
   * تهيئة إعدادات الأمان
   */
  private initializeSecurityConfig(): SecurityConfig {
    return {
      signedUrlExpiration: {
        default: parseInt(process.env.SIGNED_URL_DEFAULT_EXPIRATION || '3600'),      // 1 hour
        video_analysis: parseInt(process.env.SIGNED_URL_VIDEO_EXPIRATION || '7200'), // 2 hours
        student_reports: parseInt(process.env.SIGNED_URL_REPORT_EXPIRATION || '1800'), // 30 minutes
        training_files: parseInt(process.env.SIGNED_URL_TRAINING_EXPIRATION || '3600') // 1 hour
      },
      rateLimiting: {
        encryption: {
          windowMs: parseInt(process.env.ENCRYPTION_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
          maxRequests: {
            admin: parseInt(process.env.ENCRYPTION_RATE_LIMIT_ADMIN || '1000'),
            teacher: parseInt(process.env.ENCRYPTION_RATE_LIMIT_TEACHER || '100'),
            parent: parseInt(process.env.ENCRYPTION_RATE_LIMIT_PARENT || '20'),
            student: parseInt(process.env.ENCRYPTION_RATE_LIMIT_STUDENT || '10')
          }
        },
        fileAccess: {
          windowMs: parseInt(process.env.FILE_ACCESS_RATE_LIMIT_WINDOW || '300000'), // 5 minutes
          maxRequests: {
            admin: parseInt(process.env.FILE_ACCESS_RATE_LIMIT_ADMIN || '500'),
            teacher: parseInt(process.env.FILE_ACCESS_RATE_LIMIT_TEACHER || '200'),
            parent: parseInt(process.env.FILE_ACCESS_RATE_LIMIT_PARENT || '50'),
            student: parseInt(process.env.FILE_ACCESS_RATE_LIMIT_STUDENT || '20')
          }
        }
      },
      ipRestrictions: {
        enabled: process.env.IP_RESTRICTIONS_ENABLED === 'true',
        allowedRanges: (process.env.ALLOWED_IP_RANGES || '').split(',').filter(ip => ip.trim()),
        blockSuspiciousIPs: process.env.BLOCK_SUSPICIOUS_IPS === 'true'
      },
      auditLogging: {
        enabled: process.env.AUDIT_LOGGING_ENABLED !== 'false',
        logLevel: (process.env.AUDIT_LOG_LEVEL as any) || 'standard',
        retentionDays: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS || '365')
      }
    };
  }

  /**
   * تهيئة إعدادات المراقبة
   */
  private initializeMonitoringConfig(): MonitoringConfig {
    return {
      healthChecks: {
        enabled: process.env.HEALTH_CHECKS_ENABLED !== 'false',
        intervalMinutes: parseInt(process.env.HEALTH_CHECK_INTERVAL || '5'),
        endpoints: (process.env.HEALTH_CHECK_ENDPOINTS || '/health,/encryption/health').split(',')
      },
      alerts: {
        enabled: process.env.ALERTS_ENABLED === 'true',
        channels: (process.env.ALERT_CHANNELS || 'email').split(',') as any,
        thresholds: {
          failedDecryptions: parseInt(process.env.ALERT_THRESHOLD_FAILED_DECRYPTIONS || '10'),
          keyRotationFailures: parseInt(process.env.ALERT_THRESHOLD_KEY_ROTATION_FAILURES || '3'),
          unusualAccess: parseInt(process.env.ALERT_THRESHOLD_UNUSUAL_ACCESS || '50')
        }
      },
      metrics: {
        enabled: process.env.METRICS_ENABLED === 'true',
        provider: (process.env.METRICS_PROVIDER as any) || 'prometheus',
        customMetrics: process.env.CUSTOM_METRICS_ENABLED === 'true'
      }
    };
  }

  /**
   * التحقق من صحة الإعدادات
   */
  private validateConfiguration(): void {
    const errors: string[] = [];

    // التحقق من إعدادات KMS الأساسية
    if (!this.kms.provider) {
      errors.push('KMS provider is required');
    }

    // التحقق من إعدادات التشفير
    if (this.encryption.keyLength < 16) {
      errors.push('Encryption key length must be at least 16 bytes');
    }

    if (this.encryption.ivLength < 12) {
      errors.push('IV length must be at least 12 bytes');
    }

    // التحقق من إعدادات تدوير المفاتيح
    if (this.keyRotation.enabled && this.keyRotation.defaultRotationDays < 1) {
      errors.push('Key rotation days must be at least 1');
    }

    // التحقق من أحجام الملفات
    Object.values(this.fileEncryption.maxFileSize).forEach(size => {
      if (size <= 0) {
        errors.push('File size limits must be positive');
      }
    });

    // التحقق من إعدادات الأمان
    if (this.security.signedUrlExpiration.default <= 0) {
      errors.push('Signed URL expiration must be positive');
    }

    // في بيئة الإنتاج، التحقق من الإعدادات الحساسة
    if (this.environment === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        errors.push('JWT_SECRET must be at least 32 characters in production');
      }

      if (this.kms.provider !== 'supabase_vault' && !this.kms.credentials) {
        errors.push('KMS credentials are required in production');
      }

      if (!this.security.auditLogging.enabled) {
        errors.push('Audit logging must be enabled in production');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * الحصول على إعدادات KMS للمزود المحدد
   */
  getKMSConfig(provider?: string): KMSConfig {
    if (provider && provider !== this.kms.provider) {
      // إرجاع إعدادات مخصصة للمزود المطلوب
      return {
        ...this.kms,
        provider: provider as any
      };
    }
    return this.kms;
  }

  /**
   * الحصول على الحد الأقصى لحجم الملف حسب النوع
   */
  getMaxFileSize(fileType: string): number {
    return this.fileEncryption.maxFileSize[fileType as keyof typeof this.fileEncryption.maxFileSize] || 
           this.fileEncryption.maxFileSize.student_reports;
  }

  /**
   * الحصول على أنواع MIME المسموحة حسب نوع الملف
   */
  getAllowedMimeTypes(fileType: string): string[] {
    return this.fileEncryption.allowedMimeTypes[fileType as keyof typeof this.fileEncryption.allowedMimeTypes] || 
           [];
  }

  /**
   * الحصول على مدة انتهاء الرابط الموقع حسب نوع الملف
   */
  getSignedUrlExpiration(fileType: string): number {
    return this.security.signedUrlExpiration[fileType as keyof typeof this.security.signedUrlExpiration] || 
           this.security.signedUrlExpiration.default;
  }

  /**
   * الحصول على حد معدل الطلبات حسب نوع العملية والدور
   */
  getRateLimit(operation: 'encryption' | 'fileAccess', role: string): { windowMs: number; maxRequests: number } {
    const config = this.security.rateLimiting[operation];
    const maxRequests = config.maxRequests[role as keyof typeof config.maxRequests] || 
                       config.maxRequests.student;
    
    return {
      windowMs: config.windowMs,
      maxRequests
    };
  }

  /**
   * التحقق من تفعيل ميزة معينة
   */
  isFeatureEnabled(feature: string): boolean {
    switch (feature) {
      case 'keyRotation': return this.keyRotation.enabled;
      case 'compression': return this.fileEncryption.compressionEnabled;
      case 'auditLogging': return this.security.auditLogging.enabled;
      case 'healthChecks': return this.monitoring.healthChecks.enabled;
      case 'alerts': return this.monitoring.alerts.enabled;
      case 'metrics': return this.monitoring.metrics.enabled;
      default: return false;
    }
  }

  /**
   * إنشاء تقرير عن الإعدادات الحالية (بدون المعلومات الحساسة)
   */
  getConfigurationSummary(): any {
    return {
      environment: this.environment,
      kms: {
        provider: this.kms.provider,
        region: this.kms.region,
        hasCredentials: !!this.kms.credentials
      },
      encryption: {
        algorithm: this.encryption.algorithm,
        keyLength: this.encryption.keyLength
      },
      keyRotation: {
        enabled: this.keyRotation.enabled,
        defaultRotationDays: this.keyRotation.defaultRotationDays
      },
      security: {
        auditLogging: this.security.auditLogging.enabled,
        ipRestrictions: this.security.ipRestrictions.enabled
      },
      monitoring: {
        healthChecks: this.monitoring.healthChecks.enabled,
        alerts: this.monitoring.alerts.enabled,
        metrics: this.monitoring.metrics.enabled
      }
    };
  }
}

// إنشاء مثيل واحد من الإعدادات
export const encryptionConfig = new HarakaEncryptionConfig();

// تصدير الإعدادات كافتراضي
export default encryptionConfig;