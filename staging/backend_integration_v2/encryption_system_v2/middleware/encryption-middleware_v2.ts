/**
 * وسطاء التشفير المتقدم - منصة حركة
 * Advanced Encryption Middleware - Haraka Platform
 * 
 * يوفر طبقات حماية متعددة للملفات الحساسة
 * Provides multiple protection layers for sensitive files
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { HarakaEncryptionService } from '../services/encryption-service_v2';

// أنواع البيانات المستخدمة
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
  encryptionContext?: {
    keyPurpose: string;
    accessLevel: string;
    allowedOperations: string[];
  };
}

interface FileUploadRequest extends AuthenticatedRequest {
  encryptedFile?: {
    originalName: string;
    encryptedPath: string;
    encryptionResult: any;
    metadata: any;
  };
}

interface SignedUrlRequest extends AuthenticatedRequest {
  signedUrlPayload?: {
    fileId: string;
    userId: string;
    expiresAt: number;
    allowedOperations: string[];
    ipRestrictions: string[];
  };
}

/**
 * فئة وسطاء التشفير الرئيسية
 * Main Encryption Middleware Class
 */
export class EncryptionMiddleware {
  private encryptionService: HarakaEncryptionService;
  private allowedFileTypes: Map<string, string[]>;
  private maxFileSizes: Map<string, number>;

  constructor(encryptionService: HarakaEncryptionService) {
    this.encryptionService = encryptionService;
    this.initializeFileRestrictions();
  }

  /**
   * تهيئة قيود الملفات
   * Initialize file restrictions
   */
  private initializeFileRestrictions(): void {
    this.allowedFileTypes = new Map([
      ['video_analysis', ['mp4', 'mov', 'avi', 'mkv']],
      ['student_reports', ['pdf', 'docx', 'xlsx']],
      ['training_files', ['pdf', 'pptx', 'mp4', 'zip']],
      ['profile_images', ['jpg', 'jpeg', 'png', 'webp']]
    ]);

    this.maxFileSizes = new Map([
      ['video_analysis', 100 * 1024 * 1024], // 100 MB
      ['student_reports', 10 * 1024 * 1024],  // 10 MB
      ['training_files', 50 * 1024 * 1024],   // 50 MB
      ['profile_images', 5 * 1024 * 1024]     // 5 MB
    ]);
  }

  /**
   * وسطاء المصادقة والتحقق من الصلاحيات
   * Authentication and authorization middleware
   */
  authenticateAndAuthorize = (requiredRole?: string, requiredPermissions?: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // التحقق من وجود التوكن
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'مطلوب تسجيل الدخول للوصول لهذا المورد',
            errorCode: 'AUTHENTICATION_REQUIRED'
          });
        }

        const token = authHeader.substring(7);
        
        // التحقق من صحة التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if (!decoded || !decoded.sub) {
          return res.status(401).json({
            success: false,
            error: 'توكن المصادقة غير صحيح',
            errorCode: 'INVALID_TOKEN'
          });
        }

        // الحصول على معلومات المستخدم
        const user = await this.getUserById(decoded.sub);
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'المستخدم غير موجود',
            errorCode: 'USER_NOT_FOUND'
          });
        }

        // التحقق من الدور المطلوب
        if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            error: 'ليس لديك صلاحية للوصول لهذا المورد',
            errorCode: 'INSUFFICIENT_ROLE'
          });
        }

        // التحقق من الصلاحيات المطلوبة
        if (requiredPermissions && !this.hasRequiredPermissions(user.permissions, requiredPermissions)) {
          return res.status(403).json({
            success: false,
            error: 'ليس لديك الصلاحيات المطلوبة',
            errorCode: 'INSUFFICIENT_PERMISSIONS'
          });
        }

        req.user = user;
        next();

      } catch (error) {
        console.error('خطأ في المصادقة:', error);
        return res.status(401).json({
          success: false,
          error: 'فشل في التحقق من المصادقة',
          errorCode: 'AUTHENTICATION_FAILED'
        });
      }
    };
  };

  /**
   * وسطاء رفع الملفات مع التشفير التلقائي
   * File upload middleware with automatic encryption
   */
  encryptedFileUpload = (keyPurpose: string, fieldName: string = 'file') => {
    // إعداد multer للتخزين المؤقت
    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      limits: {
        fileSize: this.maxFileSizes.get(keyPurpose) || 10 * 1024 * 1024
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = this.allowedFileTypes.get(keyPurpose) || [];
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        
        if (allowedTypes.includes(fileExtension || '')) {
          cb(null, true);
        } else {
          cb(new Error(`نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`));
        }
      }
    });

    return [
      upload.single(fieldName),
      async (req: FileUploadRequest, res: Response, next: NextFunction) => {
        try {
          if (!req.file) {
            return res.status(400).json({
              success: false,
              error: 'لم يتم رفع أي ملف',
              errorCode: 'NO_FILE_UPLOADED'
            });
          }

          // تشفير الملف
          const encryptionResult = await this.encryptionService.encryptFile(
            req.file.buffer,
            keyPurpose,
            {
              originalName: req.file.originalname,
              mimeType: req.file.mimetype,
              uploadedBy: req.user?.id,
              uploadedAt: new Date().toISOString()
            }
          );

          // إنشاء مسار الملف المشفر
          const encryptedFileName = `${crypto.randomUUID()}.enc`;
          const encryptedPath = `/encrypted/${keyPurpose}/${encryptedFileName}`;

          // حفظ الملف المشفر (في بيئة حقيقية، سيتم حفظه في التخزين السحابي)
          await this.saveEncryptedFile(encryptedPath, encryptionResult.encryptedData);

          // إضافة معلومات الملف المشفر للطلب
          req.encryptedFile = {
            originalName: req.file.originalname,
            encryptedPath,
            encryptionResult,
            metadata: {
              originalSize: req.file.size,
              mimeType: req.file.mimetype,
              keyPurpose
            }
          };

          next();

        } catch (error) {
          console.error('خطأ في تشفير الملف:', error);
          return res.status(500).json({
            success: false,
            error: 'فشل في تشفير الملف',
            errorCode: 'ENCRYPTION_FAILED',
            details: error.message
          });
        }
      }
    ];
  };

  /**
   * وسطاء التحقق من الروابط الموقعة
   * Signed URL verification middleware
   */
  verifySignedUrl = async (req: SignedUrlRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'مطلوب توكن الوصول',
          errorCode: 'ACCESS_TOKEN_REQUIRED'
        });
      }

      // فك تشفير التوكن
      const payload = this.decodeSignedUrlToken(token);
      if (!payload) {
        return res.status(401).json({
          success: false,
          error: 'توكن الوصول غير صحيح',
          errorCode: 'INVALID_ACCESS_TOKEN'
        });
      }

      // التحقق من انتهاء الصلاحية
      if (Date.now() > payload.expiresAt) {
        return res.status(401).json({
          success: false,
          error: 'انتهت صلاحية رابط الوصول',
          errorCode: 'ACCESS_TOKEN_EXPIRED'
        });
      }

      // التحقق من قيود IP (إذا كانت موجودة)
      if (payload.ipRestrictions.length > 0) {
        const clientIp = this.getClientIp(req);
        if (!payload.ipRestrictions.includes(clientIp)) {
          return res.status(403).json({
            success: false,
            error: 'الوصول مقيد من هذا العنوان',
            errorCode: 'IP_RESTRICTED'
          });
        }
      }

      req.signedUrlPayload = payload;
      next();

    } catch (error) {
      console.error('خطأ في التحقق من الرابط الموقع:', error);
      return res.status(401).json({
        success: false,
        error: 'فشل في التحقق من رابط الوصول',
        errorCode: 'SIGNED_URL_VERIFICATION_FAILED'
      });
    }
  };

  /**
   * وسطاء تحديد معدل الطلبات للتشفير
   * Rate limiting middleware for encryption operations
   */
  encryptionRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: (req: AuthenticatedRequest) => {
      // حدود مختلفة حسب دور المستخدم
      switch (req.user?.role) {
        case 'admin': return 1000;
        case 'teacher': return 100;
        case 'parent': return 20;
        default: return 10;
      }
    },
    message: {
      success: false,
      error: 'تم تجاوز الحد المسموح من طلبات التشفير',
      errorCode: 'ENCRYPTION_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: AuthenticatedRequest) => {
      return `encryption_${req.user?.id || req.ip}`;
    }
  });

  /**
   * وسطاء تحديد معدل الوصول للملفات
   * File access rate limiting middleware
   */
  fileAccessRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 دقائق
    max: (req: AuthenticatedRequest) => {
      switch (req.user?.role) {
        case 'admin': return 500;
        case 'teacher': return 200;
        case 'parent': return 50;
        default: return 20;
      }
    },
    message: {
      success: false,
      error: 'تم تجاوز الحد المسموح من طلبات الوصول للملفات',
      errorCode: 'FILE_ACCESS_RATE_LIMIT_EXCEEDED'
    },
    keyGenerator: (req: AuthenticatedRequest) => {
      return `file_access_${req.user?.id || req.ip}`;
    }
  });

  /**
   * وسطاء التحقق من سلامة الملف
   * File integrity verification middleware
   */
  verifyFileIntegrity = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const fileId = req.params.fileId;
      if (!fileId) {
        return res.status(400).json({
          success: false,
          error: 'معرف الملف مطلوب',
          errorCode: 'FILE_ID_REQUIRED'
        });
      }

      // التحقق من سلامة الملف
      const isValid = await this.encryptionService.verifyFileIntegrity(fileId);
      if (!isValid) {
        return res.status(410).json({
          success: false,
          error: 'الملف تالف أو تم تعديله',
          errorCode: 'FILE_INTEGRITY_COMPROMISED'
        });
      }

      next();

    } catch (error) {
      console.error('خطأ في التحقق من سلامة الملف:', error);
      return res.status(500).json({
        success: false,
        error: 'فشل في التحقق من سلامة الملف',
        errorCode: 'INTEGRITY_CHECK_FAILED'
      });
    }
  };

  /**
   * وسطاء تسجيل عمليات الوصول
   * Access logging middleware
   */
  logFileAccess = (accessType: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // تسجيل بداية العملية
      const originalSend = res.send;
      res.send = function(data) {
        const duration = Date.now() - startTime;
        const success = res.statusCode >= 200 && res.statusCode < 300;
        
        // تسجيل العملية (بشكل غير متزامن)
        setImmediate(() => {
          try {
            // هنا يمكن إضافة تسجيل مفصل للعمليات
            console.log(`File Access Log: ${accessType}`, {
              userId: req.user?.id,
              fileId: req.params.fileId,
              success,
              duration,
              statusCode: res.statusCode,
              ip: req.ip,
              userAgent: req.get('User-Agent')
            });
          } catch (error) {
            console.error('خطأ في تسجيل الوصول:', error);
          }
        });

        return originalSend.call(this, data);
      };

      next();
    };
  };

  /**
   * وسطاء معالجة الأخطاء المتقدم
   * Advanced error handling middleware
   */
  errorHandler = (error: Error, req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.error('Encryption Middleware Error:', error);

    // تحديد نوع الخطأ وإرسال استجابة مناسبة
    if (error.name === 'MulterError') {
      if (error.message.includes('File too large')) {
        return res.status(413).json({
          success: false,
          error: 'حجم الملف كبير جداً',
          errorCode: 'FILE_TOO_LARGE',
          maxSize: this.getMaxFileSize(req.body.keyPurpose)
        });
      }
    }

    if (error.message.includes('نوع الملف غير مدعوم')) {
      return res.status(400).json({
        success: false,
        error: error.message,
        errorCode: 'UNSUPPORTED_FILE_TYPE'
      });
    }

    // خطأ عام
    return res.status(500).json({
      success: false,
      error: 'حدث خطأ داخلي في الخادم',
      errorCode: 'INTERNAL_SERVER_ERROR'
    });
  };

  // ===== الدوال المساعدة الخاصة =====

  /**
   * الحصول على معلومات المستخدم
   */
  private async getUserById(userId: string): Promise<any> {
    // في بيئة حقيقية، سيتم الحصول على المستخدم من قاعدة البيانات
    // In real environment, get user from database
    return {
      id: userId,
      role: 'teacher', // placeholder
      permissions: ['read_files', 'upload_files'] // placeholder
    };
  }

  /**
   * التحقق من الصلاحيات المطلوبة
   */
  private hasRequiredPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * حفظ الملف المشفر
   */
  private async saveEncryptedFile(path: string, data: Buffer): Promise<void> {
    // في بيئة حقيقية، سيتم حفظ الملف في التخزين السحابي
    // In real environment, save to cloud storage
    console.log(`حفظ الملف المشفر في: ${path}, الحجم: ${data.length} بايت`);
  }

  /**
   * فك تشفير توكن الرابط الموقع
   */
  private decodeSignedUrlToken(token: string): any {
    try {
      // في بيئة حقيقية، استخدم مكتبة JWT أو تشفير مخصص
      // In real environment, use JWT library or custom encryption
      const decoded = jwt.verify(token, process.env.SIGNED_URL_SECRET || 'default-secret');
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * الحصول على عنوان IP للعميل
   */
  private getClientIp(req: Request): string {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
           'unknown';
  }

  /**
   * الحصول على الحد الأقصى لحجم الملف
   */
  private getMaxFileSize(keyPurpose: string): string {
    const sizeInBytes = this.maxFileSizes.get(keyPurpose) || 0;
    return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
  }
}

/**
 * إنشاء مثيل من وسطاء التشفير
 * Create encryption middleware instance
 */
export const createEncryptionMiddleware = (encryptionService: HarakaEncryptionService): EncryptionMiddleware => {
  return new EncryptionMiddleware(encryptionService);
};

export default EncryptionMiddleware;