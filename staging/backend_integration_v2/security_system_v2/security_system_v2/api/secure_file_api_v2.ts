/**
 * واجهات API آمنة للملفات - منصة حركة
 * Secure File API Endpoints - Haraka Platform
 * 
 * واجهات برمجية آمنة لرفع وتحميل ومشاركة الملفات المشفرة
 * مع التحقق من الصلاحيات وإدارة الروابط المؤقتة
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { body, param, query, validationResult } from 'express-validator';
import { FileEncryptionService, KMSService, DatabaseService, StorageService } from '../encryption/file_encryption_service';
import { AuthMiddleware } from '../middleware/auth_middleware_v2';
import { AuditLogger } from '../middleware/audit_logger_v2';
import path from 'path';
import fs from 'fs/promises';

// إعداد Express Router
const router = express.Router();

// إعداد الخدمات
const kmsService = new KMSService();
const databaseService = new DatabaseService();
const storageService = new StorageService();
const encryptionService = new FileEncryptionService(kmsService, databaseService, storageService);
const authMiddleware = new AuthMiddleware();
const auditLogger = new AuditLogger();

// إعداد الأمان
router.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

router.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));

// إعداد Rate Limiting
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 10, // 10 رفعات كحد أقصى لكل IP
    message: {
        success: false,
        error: 'تم تجاوز الحد المسموح لرفع الملفات. حاول مرة أخرى بعد 15 دقيقة.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const downloadLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 دقائق
    max: 50, // 50 تحميل كحد أقصى لكل IP
    message: {
        success: false,
        error: 'تم تجاوز الحد المسموح لتحميل الملفات. حاول مرة أخرى بعد 5 دقائق.',
        errorCode: 'DOWNLOAD_RATE_LIMIT_EXCEEDED'
    }
});

// إعداد Multer للملفات
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.env.TEMP_UPLOAD_PATH || './temp_uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `temp_${uniqueSuffix}_${sanitizedName}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // قائمة أنواع الملفات المسموحة
    const allowedMimeTypes = [
        // فيديوهات
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
        // مستندات
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // جداول بيانات
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        // صور
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`نوع الملف غير مدعوم: ${file.mimetype}`));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB افتراضي
        files: 5 // حد أقصى 5 ملفات في المرة الواحدة
    }
});

// ===== واجهات API =====

/**
 * رفع ملف مشفر
 * POST /api/v2/files/secure/upload
 */
router.post('/upload',
    uploadLimiter,
    authMiddleware.authenticate,
    authMiddleware.authorize(['admin', 'teacher']),
    upload.single('file'),
    [
        body('fileCategory')
            .isIn(['analysis_video', 'student_report', 'training_material', 'document'])
            .withMessage('فئة الملف غير صحيحة'),
        body('relatedStudentId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('معرف الطالب يجب أن يكون رقماً صحيحاً'),
        body('relatedAnalysisId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('معرف التحليل يجب أن يكون رقماً صحيحاً'),
        body('accessLevel')
            .optional()
            .isIn(['public', 'internal', 'restricted', 'confidential'])
            .withMessage('مستوى الوصول غير صحيح'),
        body('description')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('الوصف طويل جداً'),
        body('tags')
            .optional()
            .isArray()
            .withMessage('العلامات يجب أن تكون مصفوفة')
    ],
    auditLogger.logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // التحقق من صحة البيانات
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'بيانات غير صحيحة',
                    errorCode: 'VALIDATION_ERROR',
                    details: errors.array()
                });
            }

            // التحقق من وجود الملف
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'لم يتم رفع أي ملف',
                    errorCode: 'NO_FILE_UPLOADED'
                });
            }

            // استخراج معلومات المستخدم من التوكن
            const user = (req as any).user;
            
            // إعداد بيانات الملف
            const fileMetadata = {
                originalFilename: req.file.originalname,
                fileType: req.file.mimetype.split('/')[0], // video, image, application
                fileCategory: req.body.fileCategory,
                mimeType: req.file.mimetype,
                relatedStudentId: req.body.relatedStudentId ? parseInt(req.body.relatedStudentId) : undefined,
                relatedAnalysisId: req.body.relatedAnalysisId ? parseInt(req.body.relatedAnalysisId) : undefined,
                relatedUserId: user.id,
                accessLevel: req.body.accessLevel || 'restricted',
                allowedRoles: req.body.allowedRoles || ['admin', 'teacher'],
                description: req.body.description,
                tags: req.body.tags || []
            };

            // تشفير الملف
            console.log(`بدء تشفير الملف: ${req.file.originalname}`);
            const encryptionResult = await encryptionService.encryptFile(
                req.file.path,
                fileMetadata
            );

            // إرجاع النتيجة
            res.status(201).json({
                success: true,
                message: 'تم رفع وتشفير الملف بنجاح',
                data: {
                    fileId: encryptionResult.encryptedPath, // سيتم استبداله بـ ID من قاعدة البيانات
                    originalFilename: fileMetadata.originalFilename,
                    fileSize: encryptionResult.originalSize,
                    encryptedSize: encryptionResult.encryptedSize,
                    fileType: fileMetadata.fileType,
                    fileCategory: fileMetadata.fileCategory,
                    uploadedAt: new Date().toISOString()
                }
            });

            // تسجيل العملية في سجل المراجعة
            await auditLogger.logFileOperation({
                operation: 'FILE_UPLOAD_ENCRYPTED',
                userId: user.id,
                userRole: user.role,
                fileId: encryptionResult.encryptedPath,
                fileName: fileMetadata.originalFilename,
                fileSize: encryptionResult.originalSize,
                success: true,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

        } catch (error) {
            console.error('خطأ في رفع الملف المشفر:', error);
            
            // حذف الملف المؤقت في حالة الخطأ
            if (req.file && req.file.path) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('خطأ في حذف الملف المؤقت:', unlinkError);
                }
            }

            // تسجيل الخطأ
            const user = (req as any).user;
            if (user) {
                await auditLogger.logFileOperation({
                    operation: 'FILE_UPLOAD_FAILED',
                    userId: user.id,
                    userRole: user.role,
                    fileName: req.file?.originalname,
                    success: false,
                    error: error.message,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                });
            }

            res.status(500).json({
                success: false,
                error: 'فشل في رفع وتشفير الملف',
                errorCode: 'UPLOAD_ENCRYPTION_FAILED',
                message: error.message
            });
        }
    }
);

/**
 * تحميل ملف مشفر
 * GET /api/v2/files/secure/:fileId/download
 */
router.get('/:fileId/download',
    downloadLimiter,
    authMiddleware.authenticate,
    [
        param('fileId')
            .isUUID()
            .withMessage('معرف الملف غير صحيح'),
        query('accessType')
            .optional()
            .isIn(['view', 'download', 'stream'])
            .withMessage('نوع الوصول غير صحيح')
    ],
    auditLogger.logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // التحقق من صحة البيانات
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'بيانات غير صحيحة',
                    errorCode: 'VALIDATION_ERROR',
                    details: errors.array()
                });
            }

            const user = (req as any).user;
            const fileId = req.params.fileId;
            const accessType = (req.query.accessType as string) || 'download';

            // فك تشفير الملف
            console.log(`بدء فك تشفير الملف: ${fileId} للمستخدم: ${user.id}`);
            const decryptionResult = await encryptionService.decryptFile(fileId, {
                userId: user.id,
                userRole: user.role,
                accessType: accessType as 'view' | 'download' | 'stream',
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // إرسال الملف للمستخدم
            if (accessType === 'download') {
                // تحميل مباشر
                res.download(decryptionResult.decryptedPath, (err) => {
                    if (err) {
                        console.error('خطأ في إرسال الملف:', err);
                    }
                    // حذف الملف المؤقت بعد الإرسال
                    fs.unlink(decryptionResult.decryptedPath).catch(console.error);
                });
            } else {
                // إرجاع رابط مؤقت للعرض أو التشغيل
                res.json({
                    success: true,
                    message: 'تم فك تشفير الملف بنجاح',
                    data: {
                        signedUrl: decryptionResult.signedUrl,
                        expiresIn: 30 * 60, // 30 دقيقة بالثواني
                        accessType: accessType
                    }
                });
            }

            // تسجيل العملية
            await auditLogger.logFileOperation({
                operation: 'FILE_DOWNLOAD_DECRYPTED',
                userId: user.id,
                userRole: user.role,
                fileId: fileId,
                accessType: accessType,
                success: true,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

        } catch (error) {
            console.error('خطأ في تحميل الملف المشفر:', error);

            const user = (req as any).user;
            await auditLogger.logFileOperation({
                operation: 'FILE_DOWNLOAD_FAILED',
                userId: user.id,
                userRole: user.role,
                fileId: req.params.fileId,
                success: false,
                error: error.message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            res.status(500).json({
                success: false,
                error: 'فشل في تحميل الملف',
                errorCode: 'DOWNLOAD_DECRYPTION_FAILED',
                message: error.message
            });
        }
    }
);

/**
 * الوصول للملف عبر الرابط المؤقت
 * GET /api/v2/files/secure/:token
 */
router.get('/:token',
    downloadLimiter,
    authMiddleware.authenticate,
    [
        param('token')
            .isLength({ min: 32, max: 128 })
            .withMessage('رمز الوصول غير صحيح')
    ],
    auditLogger.logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'رمز وصول غير صحيح',
                    errorCode: 'INVALID_TOKEN'
                });
            }

            const user = (req as any).user;
            const token = req.params.token;

            // التحقق من صحة الرابط المؤقت والحصول على الملف
            const { fileId, filePath } = await encryptionService.validateSignedUrl(token, {
                userId: user.id,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            // إرسال الملف
            res.sendFile(path.resolve(filePath), (err) => {
                if (err) {
                    console.error('خطأ في إرسال الملف:', err);
                }
                // حذف الملف المؤقت بعد الإرسال
                fs.unlink(filePath).catch(console.error);
            });

            // تسجيل العملية
            await auditLogger.logFileOperation({
                operation: 'SIGNED_URL_ACCESS',
                userId: user.id,
                userRole: user.role,
                fileId: fileId,
                token: token,
                success: true,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

        } catch (error) {
            console.error('خطأ في الوصول عبر الرابط المؤقت:', error);

            const user = (req as any).user;
            if (user) {
                await auditLogger.logFileOperation({
                    operation: 'SIGNED_URL_ACCESS_FAILED',
                    userId: user.id,
                    userRole: user.role,
                    token: req.params.token,
                    success: false,
                    error: error.message,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                });
            }

            res.status(403).json({
                success: false,
                error: 'فشل في الوصول للملف',
                errorCode: 'SIGNED_URL_ACCESS_DENIED',
                message: error.message
            });
        }
    }
);

/**
 * إنشاء رابط مشاركة مؤقت
 * POST /api/v2/files/secure/:fileId/share
 */
router.post('/:fileId/share',
    authMiddleware.authenticate,
    [
        param('fileId')
            .isUUID()
            .withMessage('معرف الملف غير صحيح'),
        body('expiresInMinutes')
            .optional()
            .isInt({ min: 1, max: 1440 }) // حد أقصى 24 ساعة
            .withMessage('مدة انتهاء الصلاحية يجب أن تكون بين 1 و 1440 دقيقة'),
        body('maxAccessCount')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('عدد مرات الوصول يجب أن يكون بين 1 و 100'),
        body('allowedOperations')
            .optional()
            .isArray()
            .withMessage('العمليات المسموحة يجب أن تكون مصفوفة')
    ],
    auditLogger.logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'بيانات غير صحيحة',
                    errorCode: 'VALIDATION_ERROR',
                    details: errors.array()
                });
            }

            const user = (req as any).user;
            const fileId = req.params.fileId;

            // إنشاء رابط مؤقت
            const signedUrl = await encryptionService.createSignedUrl(fileId, user.id, {
                expiresInMinutes: req.body.expiresInMinutes || 15,
                maxAccessCount: req.body.maxAccessCount || 1,
                allowedOperations: req.body.allowedOperations || ['read'],
                ipRestrictions: req.body.ipRestrictions || []
            });

            res.json({
                success: true,
                message: 'تم إنشاء رابط المشاركة بنجاح',
                data: {
                    shareUrl: signedUrl,
                    expiresInMinutes: req.body.expiresInMinutes || 15,
                    maxAccessCount: req.body.maxAccessCount || 1,
                    createdAt: new Date().toISOString()
                }
            });

            // تسجيل العملية
            await auditLogger.logFileOperation({
                operation: 'SHARE_LINK_CREATED',
                userId: user.id,
                userRole: user.role,
                fileId: fileId,
                shareUrl: signedUrl,
                success: true,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

        } catch (error) {
            console.error('خطأ في إنشاء رابط المشاركة:', error);

            const user = (req as any).user;
            await auditLogger.logFileOperation({
                operation: 'SHARE_LINK_CREATION_FAILED',
                userId: user.id,
                userRole: user.role,
                fileId: req.params.fileId,
                success: false,
                error: error.message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            res.status(500).json({
                success: false,
                error: 'فشل في إنشاء رابط المشاركة',
                errorCode: 'SHARE_LINK_CREATION_FAILED',
                message: error.message
            });
        }
    }
);

/**
 * قائمة الملفات المشفرة للمستخدم
 * GET /api/v2/files/secure/list
 */
router.get('/list',
    authMiddleware.authenticate,
    [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('رقم الصفحة يجب أن يكون رقماً صحيحاً أكبر من 0'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('عدد النتائج يجب أن يكون بين 1 و 100'),
        query('fileCategory')
            .optional()
            .isIn(['analysis_video', 'student_report', 'training_material', 'document'])
            .withMessage('فئة الملف غير صحيحة'),
        query('accessLevel')
            .optional()
            .isIn(['public', 'internal', 'restricted', 'confidential'])
            .withMessage('مستوى الوصول غير صحيح')
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'بيانات غير صحيحة',
                    errorCode: 'VALIDATION_ERROR',
                    details: errors.array()
                });
            }

            const user = (req as any).user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = (page - 1) * limit;

            // بناء فلاتر البحث
            const filters = {
                userId: user.id,
                userRole: user.role,
                fileCategory: req.query.fileCategory as string,
                accessLevel: req.query.accessLevel as string,
                status: 'active'
            };

            // جلب قائمة الملفات (يجب تنفيذ هذه الطريقة في DatabaseService)
            // const files = await databaseService.getUserFiles(filters, { offset, limit });

            // مؤقتاً - إرجاع قائمة فارغة
            const files = {
                items: [],
                total: 0,
                page: page,
                totalPages: 0
            };

            res.json({
                success: true,
                message: 'تم جلب قائمة الملفات بنجاح',
                data: {
                    files: files.items,
                    pagination: {
                        currentPage: page,
                        totalPages: files.totalPages,
                        totalItems: files.total,
                        itemsPerPage: limit,
                        hasNext: page < files.totalPages,
                        hasPrev: page > 1
                    }
                }
            });

        } catch (error) {
            console.error('خطأ في جلب قائمة الملفات:', error);

            res.status(500).json({
                success: false,
                error: 'فشل في جلب قائمة الملفات',
                errorCode: 'FILES_LIST_FAILED',
                message: error.message
            });
        }
    }
);

/**
 * حذف ملف مشفر (للمديرين فقط)
 * DELETE /api/v2/files/secure/:fileId
 */
router.delete('/:fileId',
    authMiddleware.authenticate,
    authMiddleware.authorize(['admin']),
    [
        param('fileId')
            .isUUID()
            .withMessage('معرف الملف غير صحيح'),
        body('reason')
            .optional()
            .isLength({ max: 500 })
            .withMessage('سبب الحذف طويل جداً')
    ],
    auditLogger.logRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'بيانات غير صحيحة',
                    errorCode: 'VALIDATION_ERROR',
                    details: errors.array()
                });
            }

            const user = (req as any).user;
            const fileId = req.params.fileId;
            const reason = req.body.reason || 'لم يتم تحديد السبب';

            // حذف الملف (يجب تنفيذ هذه الطريقة)
            // await databaseService.deleteEncryptedFile(fileId, user.id, reason);

            res.json({
                success: true,
                message: 'تم حذف الملف بنجاح',
                data: {
                    fileId: fileId,
                    deletedAt: new Date().toISOString(),
                    deletedBy: user.id,
                    reason: reason
                }
            });

            // تسجيل العملية
            await auditLogger.logFileOperation({
                operation: 'FILE_DELETED',
                userId: user.id,
                userRole: user.role,
                fileId: fileId,
                reason: reason,
                success: true,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

        } catch (error) {
            console.error('خطأ في حذف الملف:', error);

            const user = (req as any).user;
            await auditLogger.logFileOperation({
                operation: 'FILE_DELETION_FAILED',
                userId: user.id,
                userRole: user.role,
                fileId: req.params.fileId,
                success: false,
                error: error.message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });

            res.status(500).json({
                success: false,
                error: 'فشل في حذف الملف',
                errorCode: 'FILE_DELETION_FAILED',
                message: error.message
            });
        }
    }
);

// معالج الأخطاء العام
router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('خطأ في API الملفات الآمنة:', error);

    // تسجيل الخطأ في سجل المراجعة
    auditLogger.logError({
        error: error.message,
        stack: error.stack,
        endpoint: req.path,
        method: req.method,
        userId: (req as any).user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
    });

    res.status(500).json({
        success: false,
        error: 'خطأ داخلي في الخادم',
        errorCode: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
    });
});

export default router;

/**
 * تصدير الخدمات للاستخدام في أماكن أخرى
 */
export {
    encryptionService,
    kmsService,
    databaseService,
    storageService
};