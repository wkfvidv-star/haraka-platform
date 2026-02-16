/**
 * اختبارات نظام التشفير الشامل - منصة حركة
 * Comprehensive Encryption System Tests - Haraka Platform
 * 
 * يتضمن اختبارات شاملة لجميع مكونات نظام التشفير
 * Includes comprehensive tests for all encryption system components
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/testing-library';
import crypto from 'crypto';
import { HarakaEncryptionService } from '../services/encryption-service_v2';
import { EncryptionMiddleware } from '../middleware/encryption-middleware_v2';
import { HarakaEncryptionConfig } from '../config/encryption-config_v2';

// إعداد البيئة للاختبار
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long';
process.env.KMS_PROVIDER = 'supabase_vault';
process.env.MASTER_KEY_SIMULATION = 'test-master-key-32-bytes-long!!!';

describe('نظام التشفير الشامل - Haraka Platform', () => {
  let encryptionService: HarakaEncryptionService;
  let encryptionMiddleware: EncryptionMiddleware;
  let encryptionConfig: HarakaEncryptionConfig;
  
  // بيانات اختبار
  const testFileBuffer = Buffer.from('هذا ملف اختبار للتشفير - Test file content for encryption', 'utf8');
  const testUserId = 'test-user-123';
  const testKeyPurpose = 'video_analysis';

  beforeAll(async () => {
    // تهيئة الخدمات للاختبار
    encryptionConfig = new HarakaEncryptionConfig();
    encryptionService = new HarakaEncryptionService(
      'https://test.supabase.co',
      'test-anon-key',
      'supabase_vault'
    );
    encryptionMiddleware = new EncryptionMiddleware(encryptionService);
  });

  afterAll(async () => {
    // تنظيف الموارد
    encryptionService?.destroy();
  });

  describe('🔧 إعدادات التشفير - Encryption Configuration', () => {
    test('يجب تحميل الإعدادات بشكل صحيح', () => {
      expect(encryptionConfig).toBeDefined();
      expect(encryptionConfig.environment).toBe('test');
      expect(encryptionConfig.kms.provider).toBe('supabase_vault');
      expect(encryptionConfig.encryption.algorithm).toBe('aes-256-gcm');
    });

    test('يجب التحقق من صحة الإعدادات', () => {
      expect(encryptionConfig.encryption.keyLength).toBeGreaterThanOrEqual(16);
      expect(encryptionConfig.encryption.ivLength).toBeGreaterThanOrEqual(12);
      expect(encryptionConfig.keyRotation.defaultRotationDays).toBeGreaterThan(0);
    });

    test('يجب الحصول على الحد الأقصى لحجم الملف بشكل صحيح', () => {
      const maxVideoSize = encryptionConfig.getMaxFileSize('video_analysis');
      const maxReportSize = encryptionConfig.getMaxFileSize('student_reports');
      
      expect(maxVideoSize).toBeGreaterThan(maxReportSize);
      expect(maxVideoSize).toBeGreaterThan(0);
    });

    test('يجب الحصول على أنواع MIME المسموحة بشكل صحيح', () => {
      const allowedVideoTypes = encryptionConfig.getAllowedMimeTypes('video_analysis');
      const allowedReportTypes = encryptionConfig.getAllowedMimeTypes('student_reports');
      
      expect(allowedVideoTypes).toContain('video/mp4');
      expect(allowedReportTypes).toContain('application/pdf');
    });

    test('يجب التحقق من تفعيل الميزات بشكل صحيح', () => {
      const isKeyRotationEnabled = encryptionConfig.isFeatureEnabled('keyRotation');
      const isAuditLoggingEnabled = encryptionConfig.isFeatureEnabled('auditLogging');
      
      expect(typeof isKeyRotationEnabled).toBe('boolean');
      expect(typeof isAuditLoggingEnabled).toBe('boolean');
    });
  });

  describe('🔐 خدمة التشفير الأساسية - Core Encryption Service', () => {
    test('يجب تشفير الملف بنجاح', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose,
        { originalName: 'test-file.mp4' }
      );

      expect(encryptionResult).toBeDefined();
      expect(encryptionResult.encryptedData).toBeInstanceOf(Buffer);
      expect(encryptionResult.iv).toBeDefined();
      expect(encryptionResult.authTag).toBeDefined();
      expect(encryptionResult.keyId).toBeDefined();
      expect(encryptionResult.encryptedData.length).toBeGreaterThan(0);
    });

    test('يجب فك تشفير الملف بنجاح', async () => {
      // تشفير الملف أولاً
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose,
        { originalName: 'test-file.mp4' }
      );

      // فك التشفير
      const decryptionResult = await encryptionService.decryptFile(
        encryptionResult.encryptedData,
        encryptionResult.iv,
        encryptionResult.authTag,
        encryptionResult.keyId,
        testUserId,
        { originalName: 'test-file.mp4' }
      );

      expect(decryptionResult).toBeDefined();
      expect(decryptionResult.verified).toBe(true);
      expect(decryptionResult.decryptedData).toEqual(testFileBuffer);
    });

    test('يجب رفض فك التشفير للبيانات المعدلة', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      // تعديل البيانات المشفرة
      const modifiedData = Buffer.from(encryptionResult.encryptedData);
      modifiedData[0] = modifiedData[0] ^ 1; // تغيير بت واحد

      await expect(
        encryptionService.decryptFile(
          modifiedData,
          encryptionResult.iv,
          encryptionResult.authTag,
          encryptionResult.keyId,
          testUserId
        )
      ).rejects.toThrow();
    });

    test('يجب إنشاء رابط موقع صحيح', async () => {
      const testFileId = 'test-file-123';
      const signedUrlOptions = {
        expiresIn: 3600,
        allowedOperations: ['view', 'download']
      };

      // محاكاة وجود الملف
      jest.spyOn(encryptionService as any, 'getEncryptedFileById')
        .mockResolvedValue({
          id: testFileId,
          fileId: testFileId,
          ownerId: testUserId,
          accessLevel: 'private'
        });

      jest.spyOn(encryptionService as any, 'verifyFileAccess')
        .mockResolvedValue(true);

      const signedUrl = await encryptionService.createSignedUrl(
        testFileId,
        testUserId,
        signedUrlOptions
      );

      expect(signedUrl).toBeDefined();
      expect(signedUrl).toContain(testFileId);
      expect(signedUrl).toContain('token=');
    });

    test('يجب حفظ الملف المشفر في قاعدة البيانات', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      const fileId = await encryptionService.saveEncryptedFile(
        'test-video.mp4',
        'video_analysis',
        encryptionResult,
        '/encrypted/test-path.enc',
        testUserId,
        {
          originalSize: testFileBuffer.length,
          mimeType: 'video/mp4'
        }
      );

      expect(fileId).toBeDefined();
      expect(typeof fileId).toBe('string');
    });
  });

  describe('🛡️ وسطاء التشفير - Encryption Middleware', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockReq = {
        headers: {
          authorization: 'Bearer valid-jwt-token'
        },
        user: {
          id: testUserId,
          role: 'teacher',
          permissions: ['read_files', 'upload_files']
        },
        params: {},
        query: {},
        ip: '127.0.0.1'
      };

      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };

      mockNext = jest.fn();
    });

    test('يجب التحقق من المصادقة بنجاح', async () => {
      const authMiddleware = encryptionMiddleware.authenticateAndAuthorize();
      
      // محاكاة التحقق من JWT
      jest.spyOn(encryptionMiddleware as any, 'getUserById')
        .mockResolvedValue(mockReq.user);

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    test('يجب رفض الطلب بدون توكن', async () => {
      mockReq.headers.authorization = undefined;
      
      const authMiddleware = encryptionMiddleware.authenticateAndAuthorize();
      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('يجب رفض الطلب للدور غير المصرح', async () => {
      const authMiddleware = encryptionMiddleware.authenticateAndAuthorize('admin');
      
      jest.spyOn(encryptionMiddleware as any, 'getUserById')
        .mockResolvedValue({
          ...mockReq.user,
          role: 'student' // دور غير مصرح
        });

      await authMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('يجب التحقق من الرابط الموقع بنجاح', async () => {
      const validToken = 'valid-signed-url-token';
      mockReq.query.token = validToken;

      // محاكاة فك تشفير التوكن
      jest.spyOn(encryptionMiddleware as any, 'decodeSignedUrlToken')
        .mockReturnValue({
          fileId: 'test-file-123',
          userId: testUserId,
          expiresAt: Date.now() + 3600000, // ساعة من الآن
          allowedOperations: ['view'],
          ipRestrictions: []
        });

      await encryptionMiddleware.verifySignedUrl(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.signedUrlPayload).toBeDefined();
    });

    test('يجب رفض الرابط المنتهي الصلاحية', async () => {
      const expiredToken = 'expired-signed-url-token';
      mockReq.query.token = expiredToken;

      jest.spyOn(encryptionMiddleware as any, 'decodeSignedUrlToken')
        .mockReturnValue({
          fileId: 'test-file-123',
          userId: testUserId,
          expiresAt: Date.now() - 3600000, // انتهت الصلاحية
          allowedOperations: ['view'],
          ipRestrictions: []
        });

      await encryptionMiddleware.verifySignedUrl(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('يجب التحقق من سلامة الملف', async () => {
      mockReq.params.fileId = 'test-file-123';

      jest.spyOn(encryptionService, 'verifyFileIntegrity')
        .mockResolvedValue(true);

      await encryptionMiddleware.verifyFileIntegrity(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('يجب رفض الملف التالف', async () => {
      mockReq.params.fileId = 'corrupted-file-123';

      jest.spyOn(encryptionService, 'verifyFileIntegrity')
        .mockResolvedValue(false);

      await encryptionMiddleware.verifyFileIntegrity(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(410);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('🔄 تدوير المفاتيح - Key Rotation', () => {
    test('يجب تدوير المفتاح بنجاح', async () => {
      const testKeyId = 'test-key-123';
      
      // محاكاة العمليات المطلوبة
      jest.spyOn(encryptionService as any, 'startKeyRotation')
        .mockResolvedValue('rotation-123');
      
      jest.spyOn(encryptionService as any, 'getEncryptionKeyById')
        .mockResolvedValue({
          id: testKeyId,
          keyId: testKeyId,
          keyVersion: 1,
          kmsKeyId: 'kms-key-123'
        });

      jest.spyOn(encryptionService as any, 'encryptWithKMS')
        .mockResolvedValue('encrypted-new-key');

      jest.spyOn(encryptionService as any, 'updateEncryptionKey')
        .mockResolvedValue(undefined);

      jest.spyOn(encryptionService as any, 'getFilesByKeyId')
        .mockResolvedValue([]);

      jest.spyOn(encryptionService as any, 'completeKeyRotation')
        .mockResolvedValue(undefined);

      const result = await encryptionService.rotateEncryptionKey(
        testKeyId,
        testUserId,
        'manual_rotation'
      );

      expect(result).toBe(true);
    });

    test('يجب التعامل مع فشل تدوير المفتاح', async () => {
      const testKeyId = 'failing-key-123';
      
      jest.spyOn(encryptionService as any, 'startKeyRotation')
        .mockRejectedValue(new Error('Key rotation failed'));

      const result = await encryptionService.rotateEncryptionKey(
        testKeyId,
        testUserId,
        'manual_rotation'
      );

      expect(result).toBe(false);
    });
  });

  describe('🔍 التحقق من سلامة الملفات - File Integrity', () => {
    test('يجب التحقق من سلامة الملف الصحيح', async () => {
      const testFileId = 'integrity-test-file';
      
      // محاكاة ملف صحيح
      jest.spyOn(encryptionService as any, 'getEncryptedFileById')
        .mockResolvedValue({
          id: testFileId,
          encryptedFilePath: '/test/path.enc',
          fileHash: 'correct-hash-value'
        });

      jest.spyOn(encryptionService as any, 'readEncryptedFile')
        .mockResolvedValue(Buffer.from('test file content'));

      // محاكاة hash صحيح
      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('correct-hash-value')
      } as any);

      const isValid = await encryptionService.verifyFileIntegrity(testFileId);
      expect(isValid).toBe(true);
    });

    test('يجب اكتشاف الملف التالف', async () => {
      const testFileId = 'corrupted-test-file';
      
      jest.spyOn(encryptionService as any, 'getEncryptedFileById')
        .mockResolvedValue({
          id: testFileId,
          encryptedFilePath: '/test/corrupted.enc',
          fileHash: 'original-hash-value'
        });

      jest.spyOn(encryptionService as any, 'readEncryptedFile')
        .mockResolvedValue(Buffer.from('corrupted file content'));

      // محاكاة hash مختلف
      jest.spyOn(crypto, 'createHash').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('different-hash-value')
      } as any);

      const isValid = await encryptionService.verifyFileIntegrity(testFileId);
      expect(isValid).toBe(false);
    });
  });

  describe('📊 اختبارات الأداء - Performance Tests', () => {
    test('يجب تشفير الملفات الكبيرة في وقت معقول', async () => {
      const largeBuffer = Buffer.alloc(1024 * 1024); // 1 MB
      largeBuffer.fill('A');

      const startTime = Date.now();
      
      const encryptionResult = await encryptionService.encryptFile(
        largeBuffer,
        testKeyPurpose
      );
      
      const encryptionTime = Date.now() - startTime;

      expect(encryptionResult).toBeDefined();
      expect(encryptionTime).toBeLessThan(5000); // أقل من 5 ثواني
    });

    test('يجب فك تشفير الملفات الكبيرة في وقت معقول', async () => {
      const largeBuffer = Buffer.alloc(1024 * 1024); // 1 MB
      largeBuffer.fill('B');

      const encryptionResult = await encryptionService.encryptFile(
        largeBuffer,
        testKeyPurpose
      );

      const startTime = Date.now();
      
      const decryptionResult = await encryptionService.decryptFile(
        encryptionResult.encryptedData,
        encryptionResult.iv,
        encryptionResult.authTag,
        encryptionResult.keyId,
        testUserId
      );
      
      const decryptionTime = Date.now() - startTime;

      expect(decryptionResult.verified).toBe(true);
      expect(decryptionTime).toBeLessThan(5000); // أقل من 5 ثواني
    });

    test('يجب معالجة عدة عمليات تشفير متزامنة', async () => {
      const concurrentOperations = 10;
      const smallBuffer = Buffer.from('concurrent test data');

      const promises = Array(concurrentOperations).fill(null).map(() =>
        encryptionService.encryptFile(smallBuffer, testKeyPurpose)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(concurrentOperations);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.encryptedData).toBeInstanceOf(Buffer);
      });
    });
  });

  describe('🚨 اختبارات الأمان - Security Tests', () => {
    test('يجب رفض الوصول للمستخدم غير المصرح', async () => {
      const unauthorizedUserId = 'unauthorized-user';
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      // محاكاة مستخدم غير مصرح
      jest.spyOn(encryptionService as any, 'verifyUserAccess')
        .mockResolvedValue(false);

      await expect(
        encryptionService.decryptFile(
          encryptionResult.encryptedData,
          encryptionResult.iv,
          encryptionResult.authTag,
          encryptionResult.keyId,
          unauthorizedUserId
        )
      ).rejects.toThrow('المستخدم غير مصرح له بفك تشفير هذا الملف');
    });

    test('يجب رفض IV غير صحيح', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      const invalidIv = crypto.randomBytes(16).toString('hex');

      await expect(
        encryptionService.decryptFile(
          encryptionResult.encryptedData,
          invalidIv,
          encryptionResult.authTag,
          encryptionResult.keyId,
          testUserId
        )
      ).rejects.toThrow();
    });

    test('يجب رفض AuthTag غير صحيح', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      const invalidAuthTag = crypto.randomBytes(16).toString('hex');

      await expect(
        encryptionService.decryptFile(
          encryptionResult.encryptedData,
          encryptionResult.iv,
          invalidAuthTag,
          encryptionResult.keyId,
          testUserId
        )
      ).rejects.toThrow();
    });

    test('يجب حماية من هجمات Timing', async () => {
      const encryptionResult = await encryptionService.encryptFile(
        testFileBuffer,
        testKeyPurpose
      );

      // قياس وقت فك التشفير للبيانات الصحيحة
      const validStart = Date.now();
      try {
        await encryptionService.decryptFile(
          encryptionResult.encryptedData,
          encryptionResult.iv,
          encryptionResult.authTag,
          encryptionResult.keyId,
          testUserId
        );
      } catch (error) {
        // تجاهل الخطأ للقياس
      }
      const validTime = Date.now() - validStart;

      // قياس وقت فك التشفير للبيانات غير الصحيحة
      const invalidStart = Date.now();
      try {
        await encryptionService.decryptFile(
          Buffer.from('invalid data'),
          encryptionResult.iv,
          encryptionResult.authTag,
          encryptionResult.keyId,
          testUserId
        );
      } catch (error) {
        // متوقع
      }
      const invalidTime = Date.now() - invalidStart;

      // الفرق في الوقت يجب أن يكون قليل (حماية من Timing attacks)
      const timeDifference = Math.abs(validTime - invalidTime);
      expect(timeDifference).toBeLessThan(100); // أقل من 100ms فرق
    });
  });

  describe('🧹 اختبارات التنظيف والذاكرة - Cleanup and Memory Tests', () => {
    test('يجب تنظيف كاش المفاتيح', async () => {
      // إضافة مفاتيح للكاش
      await encryptionService.encryptFile(testFileBuffer, testKeyPurpose);
      
      // التحقق من وجود الكاش
      const cacheSize = (encryptionService as any).masterKeyCache.size;
      expect(cacheSize).toBeGreaterThan(0);

      // تنظيف الكاش
      encryptionService.destroy();
      
      // التحقق من تنظيف الكاش
      const cacheSizeAfter = (encryptionService as any).masterKeyCache.size;
      expect(cacheSizeAfter).toBe(0);
    });

    test('يجب عدم تسريب الذاكرة في العمليات المتكررة', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // تشغيل عدة عمليات تشفير
      for (let i = 0; i < 50; i++) {
        const result = await encryptionService.encryptFile(
          Buffer.from(`test data ${i}`),
          testKeyPurpose
        );
        
        await encryptionService.decryptFile(
          result.encryptedData,
          result.iv,
          result.authTag,
          result.keyId,
          testUserId
        );
      }

      // فرض garbage collection
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // الزيادة في الذاكرة يجب أن تكون معقولة (أقل من 10 MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});

// اختبارات التكامل مع قاعدة البيانات
describe('🗄️ اختبارات التكامل مع قاعدة البيانات - Database Integration Tests', () => {
  // هذه الاختبارات تتطلب اتصال فعلي بقاعدة البيانات
  // These tests require actual database connection
  
  test.skip('يجب إنشاء مفتاح تشفير جديد في قاعدة البيانات', async () => {
    // اختبار إنشاء مفتاح جديد
  });

  test.skip('يجب حفظ الملف المشفر في قاعدة البيانات', async () => {
    // اختبار حفظ ملف مشفر
  });

  test.skip('يجب تسجيل الوصول للملفات في قاعدة البيانات', async () => {
    // اختبار تسجيل الوصول
  });

  test.skip('يجب تدوير المفاتيح وتحديث قاعدة البيانات', async () => {
    // اختبار تدوير المفاتيح
  });
});

// اختبارات الأداء تحت الضغط
describe('⚡ اختبارات الأداء تحت الضغط - Stress Tests', () => {
  test.skip('يجب التعامل مع 1000 عملية تشفير متزامنة', async () => {
    // اختبار الأداء تحت الضغط
  });

  test.skip('يجب التعامل مع ملفات كبيرة جداً (100+ MB)', async () => {
    // اختبار الملفات الكبيرة
  });
});