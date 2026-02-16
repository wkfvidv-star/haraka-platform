/**
 * خدمة التشفير المتقدمة - منصة حركة
 * Advanced Encryption Service - Haraka Platform
 * 
 * يوفر تشفير AES-256-GCM مع إدارة مفاتيح متقدمة
 * Provides AES-256-GCM encryption with advanced key management
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// أنواع البيانات المستخدمة
interface EncryptionKey {
  id: string;
  keyId: string;
  keyType: 'master' | 'data' | 'file' | 'backup';
  keyPurpose: string;
  encryptionAlgorithm: string;
  keyVersion: number;
  keyStatus: 'active' | 'rotating' | 'deprecated' | 'revoked';
  encryptedKeyData: string;
  kmsProvider: string;
  kmsKeyId?: string;
  createdAt: Date;
  expiresAt?: Date;
  lastRotatedAt?: Date;
  rotationScheduleDays: number;
}

interface EncryptedFile {
  id: string;
  fileId: string;
  originalFilename: string;
  fileType: string;
  encryptionKeyId: string;
  encryptedFilePath: string;
  fileHash: string;
  encryptionIv: string;
  originalSizeBytes: number;
  encryptedSizeBytes: number;
  mimeType?: string;
  ownerId: string;
  relatedStudentId?: number;
  accessLevel: 'public' | 'internal' | 'private' | 'restricted';
  allowedRoles: string[];
  createdAt: Date;
  expiresAt?: Date;
}

interface EncryptionResult {
  encryptedData: Buffer;
  iv: string;
  authTag: string;
  keyId: string;
}

interface DecryptionResult {
  decryptedData: Buffer;
  verified: boolean;
}

interface SignedUrlOptions {
  expiresIn: number; // seconds
  allowedOperations: string[];
  ipRestrictions?: string[];
}

/**
 * خدمة التشفير الرئيسية
 * Main Encryption Service
 */
export class HarakaEncryptionService {
  private supabase: any;
  private kmsProvider: string;
  private masterKeyCache: Map<string, Buffer> = new Map();
  private keyRotationInterval: NodeJS.Timeout | null = null;

  constructor(supabaseUrl: string, supabaseKey: string, kmsProvider: string = 'supabase_vault') {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.kmsProvider = kmsProvider;
    this.initializeKeyRotationScheduler();
  }

  /**
   * تشفير ملف باستخدام AES-256-GCM
   * Encrypt file using AES-256-GCM
   */
  async encryptFile(
    fileBuffer: Buffer,
    keyPurpose: string,
    metadata: any = {}
  ): Promise<EncryptionResult> {
    try {
      // الحصول على مفتاح التشفير المناسب
      const encryptionKey = await this.getEncryptionKey(keyPurpose);
      if (!encryptionKey) {
        throw new Error(`لم يتم العثور على مفتاح التشفير للغرض: ${keyPurpose}`);
      }

      // فك تشفير مفتاح البيانات باستخدام المفتاح الرئيسي
      const dataKey = await this.decryptDataKey(encryptionKey.encryptedKeyData, encryptionKey.keyId);

      // إنشاء IV عشوائي
      const iv = crypto.randomBytes(16);

      // إنشاء cipher
      const cipher = crypto.createCipherGCM('aes-256-gcm', dataKey);
      cipher.setAAD(Buffer.from(JSON.stringify(metadata)));

      // تشفير البيانات
      const encryptedChunks: Buffer[] = [];
      encryptedChunks.push(cipher.update(fileBuffer));
      encryptedChunks.push(cipher.final());

      const encryptedData = Buffer.concat(encryptedChunks);
      const authTag = cipher.getAuthTag();

      // تسجيل العملية
      await this.logEncryptionOperation('encrypt', encryptionKey.id, true, fileBuffer.length);

      return {
        encryptedData,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        keyId: encryptionKey.id
      };

    } catch (error) {
      console.error('خطأ في تشفير الملف:', error);
      throw new Error(`فشل في تشفير الملف: ${error.message}`);
    }
  }

  /**
   * فك تشفير ملف
   * Decrypt file
   */
  async decryptFile(
    encryptedData: Buffer,
    iv: string,
    authTag: string,
    keyId: string,
    userId: string,
    metadata: any = {}
  ): Promise<DecryptionResult> {
    const startTime = Date.now();
    
    try {
      // التحقق من صلاحيات المستخدم
      const hasAccess = await this.verifyUserAccess(userId, keyId);
      if (!hasAccess) {
        throw new Error('المستخدم غير مصرح له بفك تشفير هذا الملف');
      }

      // الحصول على مفتاح التشفير
      const encryptionKey = await this.getEncryptionKeyById(keyId);
      if (!encryptionKey || encryptionKey.keyStatus !== 'active') {
        throw new Error('مفتاح التشفير غير متاح أو غير نشط');
      }

      // فك تشفير مفتاح البيانات
      const dataKey = await this.decryptDataKey(encryptionKey.encryptedKeyData, encryptionKey.keyId);

      // إنشاء decipher
      const decipher = crypto.createDecipherGCM('aes-256-gcm', dataKey);
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      decipher.setAAD(Buffer.from(JSON.stringify(metadata)));

      // فك التشفير
      const decryptedChunks: Buffer[] = [];
      decryptedChunks.push(decipher.update(encryptedData));
      decryptedChunks.push(decipher.final());

      const decryptedData = Buffer.concat(decryptedChunks);
      const decryptionTime = Date.now() - startTime;

      // تسجيل العملية
      await this.logEncryptionOperation('decrypt', keyId, true, decryptedData.length, decryptionTime, userId);

      return {
        decryptedData,
        verified: true
      };

    } catch (error) {
      const decryptionTime = Date.now() - startTime;
      await this.logEncryptionOperation('decrypt', keyId, false, 0, decryptionTime, userId, error.message);
      
      console.error('خطأ في فك تشفير الملف:', error);
      throw new Error(`فشل في فك تشفير الملف: ${error.message}`);
    }
  }

  /**
   * إنشاء رابط موقع مؤقت للملف المشفر
   * Create temporary signed URL for encrypted file
   */
  async createSignedUrl(
    fileId: string,
    userId: string,
    options: SignedUrlOptions
  ): Promise<string> {
    try {
      // التحقق من وجود الملف وصلاحيات الوصول
      const file = await this.getEncryptedFileById(fileId);
      if (!file) {
        throw new Error('الملف غير موجود');
      }

      const hasAccess = await this.verifyFileAccess(userId, file);
      if (!hasAccess) {
        throw new Error('المستخدم غير مصرح له بالوصول لهذا الملف');
      }

      // إنشاء token مؤقت
      const payload = {
        fileId,
        userId,
        allowedOperations: options.allowedOperations,
        expiresAt: Date.now() + (options.expiresIn * 1000),
        ipRestrictions: options.ipRestrictions || []
      };

      const token = this.generateSecureToken(payload);
      
      // إنشاء الرابط الموقع
      const signedUrl = `${process.env.API_BASE_URL}/api/v1/encrypted-files/${fileId}/access?token=${token}`;

      // تسجيل إنشاء الرابط
      await this.logFileAccess(file.id, userId, 'signed_url', 'api_call', true);

      return signedUrl;

    } catch (error) {
      console.error('خطأ في إنشاء الرابط الموقع:', error);
      throw new Error(`فشل في إنشاء الرابط الموقع: ${error.message}`);
    }
  }

  /**
   * تدوير مفتاح التشفير
   * Rotate encryption key
   */
  async rotateEncryptionKey(keyId: string, userId: string, reason: string = 'scheduled'): Promise<boolean> {
    try {
      // بدء عملية التدوير
      const rotationId = await this.startKeyRotation(keyId, userId, reason);

      // الحصول على المفتاح الحالي
      const currentKey = await this.getEncryptionKeyById(keyId);
      if (!currentKey) {
        throw new Error('المفتاح غير موجود');
      }

      // إنشاء مفتاح جديد
      const newKeyData = crypto.randomBytes(32); // 256-bit key
      const newKeyVersion = currentKey.keyVersion + 1;

      // تشفير المفتاح الجديد باستخدام KMS
      const encryptedNewKey = await this.encryptWithKMS(newKeyData, currentKey.kmsKeyId);

      // تحديث المفتاح في قاعدة البيانات
      await this.updateEncryptionKey(keyId, {
        keyVersion: newKeyVersion,
        encryptedKeyData: encryptedNewKey,
        lastRotatedAt: new Date(),
        keyStatus: 'active'
      });

      // إعادة تشفير الملفات المرتبطة (إذا لزم الأمر)
      const affectedFiles = await this.getFilesByKeyId(keyId);
      let reEncryptedCount = 0;

      for (const file of affectedFiles) {
        try {
          await this.reEncryptFile(file, newKeyData);
          reEncryptedCount++;
        } catch (error) {
          console.error(`فشل في إعادة تشفير الملف ${file.fileId}:`, error);
        }
      }

      // إكمال عملية التدوير
      await this.completeKeyRotation(rotationId, {
        filesAffectedCount: affectedFiles.length,
        filesReEncryptedCount: reEncryptedCount,
        rotationStatus: 'completed'
      });

      console.log(`تم تدوير المفتاح ${keyId} بنجاح. تم إعادة تشفير ${reEncryptedCount} من ${affectedFiles.length} ملف`);
      return true;

    } catch (error) {
      console.error('خطأ في تدوير المفتاح:', error);
      await this.completeKeyRotation(keyId, {
        rotationStatus: 'failed',
        errorDetails: error.message
      });
      return false;
    }
  }

  /**
   * التحقق من صحة الملف المشفر
   * Verify encrypted file integrity
   */
  async verifyFileIntegrity(fileId: string): Promise<boolean> {
    try {
      const file = await this.getEncryptedFileById(fileId);
      if (!file) {
        return false;
      }

      // قراءة الملف المشفر
      const encryptedData = await this.readEncryptedFile(file.encryptedFilePath);
      
      // حساب hash الملف الحالي
      const currentHash = crypto.createHash('sha256').update(encryptedData).digest('hex');
      
      // مقارنة مع hash المحفوظ
      return currentHash === file.fileHash;

    } catch (error) {
      console.error('خطأ في التحقق من سلامة الملف:', error);
      return false;
    }
  }

  /**
   * حفظ ملف مشفر في قاعدة البيانات
   * Save encrypted file to database
   */
  async saveEncryptedFile(
    originalFilename: string,
    fileType: string,
    encryptionResult: EncryptionResult,
    encryptedFilePath: string,
    ownerId: string,
    metadata: any = {}
  ): Promise<string> {
    try {
      const fileId = crypto.randomUUID();
      const fileHash = crypto.createHash('sha256').update(encryptionResult.encryptedData).digest('hex');

      const { data, error } = await this.supabase
        .from('haraka_encrypted_files_v2')
        .insert({
          file_id: fileId,
          original_filename: originalFilename,
          file_type: fileType,
          encryption_key_id: encryptionResult.keyId,
          encrypted_file_path: encryptedFilePath,
          file_hash: fileHash,
          encryption_iv: encryptionResult.iv,
          original_size_bytes: metadata.originalSize || 0,
          encrypted_size_bytes: encryptionResult.encryptedData.length,
          mime_type: metadata.mimeType,
          owner_id: ownerId,
          related_student_id: metadata.relatedStudentId,
          access_level: metadata.accessLevel || 'private',
          allowed_roles: metadata.allowedRoles || ['admin'],
          metadata: metadata,
          description: metadata.description
        })
        .select()
        .single();

      if (error) {
        throw new Error(`فشل في حفظ معلومات الملف المشفر: ${error.message}`);
      }

      return fileId;

    } catch (error) {
      console.error('خطأ في حفظ الملف المشفر:', error);
      throw error;
    }
  }

  // ===== الدوال المساعدة الخاصة =====

  /**
   * الحصول على مفتاح التشفير حسب الغرض
   */
  private async getEncryptionKey(purpose: string): Promise<EncryptionKey | null> {
    try {
      const { data, error } = await this.supabase
        .from('haraka_encryption_keys_v2')
        .select('*')
        .eq('key_purpose', purpose)
        .eq('key_status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToEncryptionKey(data);
    } catch (error) {
      console.error('خطأ في الحصول على مفتاح التشفير:', error);
      return null;
    }
  }

  /**
   * الحصول على مفتاح التشفير بالمعرف
   */
  private async getEncryptionKeyById(keyId: string): Promise<EncryptionKey | null> {
    try {
      const { data, error } = await this.supabase
        .from('haraka_encryption_keys_v2')
        .select('*')
        .eq('id', keyId)
        .single();

      if (error || !data) {
        return null;
      }

      return this.mapToEncryptionKey(data);
    } catch (error) {
      console.error('خطأ في الحصول على مفتاح التشفير:', error);
      return null;
    }
  }

  /**
   * فك تشفير مفتاح البيانات باستخدام KMS
   */
  private async decryptDataKey(encryptedKeyData: string, keyId: string): Promise<Buffer> {
    // في بيئة حقيقية، هذا سيتصل بـ KMS الفعلي
    // In real environment, this would connect to actual KMS
    
    if (this.masterKeyCache.has(keyId)) {
      return this.masterKeyCache.get(keyId)!;
    }

    // محاكاة فك التشفير باستخدام KMS
    // Simulate KMS decryption
    const masterKey = await this.getMasterKeyFromKMS(keyId);
    const decryptedKey = this.simulateKMSDecryption(encryptedKeyData, masterKey);
    
    // حفظ في الكاش لفترة قصيرة
    this.masterKeyCache.set(keyId, decryptedKey);
    setTimeout(() => this.masterKeyCache.delete(keyId), 300000); // 5 دقائق

    return decryptedKey;
  }

  /**
   * التحقق من صلاحيات المستخدم للوصول للمفتاح
   */
  private async verifyUserAccess(userId: string, keyId: string): Promise<boolean> {
    try {
      // الحصول على دور المستخدم
      const { data: userData } = await this.supabase.auth.getUser(userId);
      if (!userData?.user) {
        return false;
      }

      const userRole = userData.user.user_metadata?.role;
      if (!userRole) {
        return false;
      }

      // المديرون لديهم وصول لجميع المفاتيح
      if (userRole === 'admin') {
        return true;
      }

      // التحقق من سياسة الوصول للمفتاح
      const key = await this.getEncryptionKeyById(keyId);
      if (!key) {
        return false;
      }

      const accessPolicy = JSON.parse(key.keyMetadata || '{}');
      const allowedRoles = accessPolicy.allowed_roles || [];

      return allowedRoles.includes(userRole);

    } catch (error) {
      console.error('خطأ في التحقق من صلاحيات الوصول:', error);
      return false;
    }
  }

  /**
   * تسجيل عملية التشفير/فك التشفير
   */
  private async logEncryptionOperation(
    operation: string,
    keyId: string,
    success: boolean,
    dataSize: number,
    duration?: number,
    userId?: string,
    errorDetails?: string
  ): Promise<void> {
    try {
      // تسجيل في جدول منفصل للعمليات
      const logData = {
        operation,
        key_id: keyId,
        success,
        data_size_bytes: dataSize,
        duration_ms: duration,
        user_id: userId,
        error_details: errorDetails,
        created_at: new Date().toISOString()
      };

      // يمكن إضافة جدول منفصل لسجل عمليات التشفير
      console.log('عملية التشفير:', logData);

    } catch (error) {
      console.error('خطأ في تسجيل عملية التشفير:', error);
    }
  }

  /**
   * تسجيل الوصول للملف
   */
  private async logFileAccess(
    fileId: string,
    userId: string,
    accessType: string,
    accessMethod: string,
    success: boolean,
    errorDetails?: string
  ): Promise<void> {
    try {
      await this.supabase.rpc('log_file_access_v2', {
        p_file_id: fileId,
        p_user_id: userId,
        p_access_type: accessType,
        p_access_method: accessMethod,
        p_success: success,
        p_error_details: errorDetails
      });
    } catch (error) {
      console.error('خطأ في تسجيل الوصول للملف:', error);
    }
  }

  /**
   * تهيئة جدولة تدوير المفاتيح
   */
  private initializeKeyRotationScheduler(): void {
    // فحص المفاتيح التي تحتاج تدوير كل ساعة
    this.keyRotationInterval = setInterval(async () => {
      try {
        await this.checkAndRotateExpiredKeys();
      } catch (error) {
        console.error('خطأ في جدولة تدوير المفاتيح:', error);
      }
    }, 3600000); // كل ساعة
  }

  /**
   * فحص وتدوير المفاتيح المنتهية الصلاحية
   */
  private async checkAndRotateExpiredKeys(): Promise<void> {
    try {
      const { data: expiredKeys } = await this.supabase.rpc('check_key_expiration_v2');
      
      if (expiredKeys && expiredKeys.length > 0) {
        console.log(`تم العثور على ${expiredKeys.length} مفتاح يحتاج تدوير`);
        
        for (const key of expiredKeys) {
          if (key.needs_rotation) {
            console.log(`بدء تدوير المفتاح: ${key.key_id}`);
            await this.rotateEncryptionKey(key.key_id, 'system', 'scheduled_rotation');
          }
        }
      }
    } catch (error) {
      console.error('خطأ في فحص المفاتيح المنتهية الصلاحية:', error);
    }
  }

  /**
   * محاكاة KMS - في بيئة حقيقية يجب استخدام KMS فعلي
   */
  private async getMasterKeyFromKMS(keyId: string): Promise<Buffer> {
    // في بيئة الإنتاج، هذا سيتصل بـ AWS KMS أو Google KMS أو Azure Key Vault
    // In production, this would connect to AWS KMS, Google KMS, or Azure Key Vault
    
    // محاكاة - استخدم مفتاح ثابت للتطوير فقط
    const simulatedMasterKey = Buffer.from(process.env.MASTER_KEY_SIMULATION || 'simulation-master-key-32-bytes!!', 'utf8');
    return simulatedMasterKey;
  }

  /**
   * محاكاة فك تشفير KMS
   */
  private simulateKMSDecryption(encryptedData: string, masterKey: Buffer): Buffer {
    // في بيئة حقيقية، هذا سيستخدم KMS API
    // In real environment, this would use KMS API
    
    // محاكاة بسيطة - في الواقع البيانات ستكون مشفرة فعلياً
    return crypto.randomBytes(32); // 256-bit key
  }

  /**
   * تشفير باستخدام KMS
   */
  private async encryptWithKMS(data: Buffer, kmsKeyId?: string): Promise<string> {
    // محاكاة تشفير KMS
    const masterKey = await this.getMasterKeyFromKMS(kmsKeyId || 'default');
    
    // في بيئة حقيقية، استخدم KMS API
    const cipher = crypto.createCipher('aes-256-cbc', masterKey);
    let encrypted = cipher.update(data, undefined, 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  }

  /**
   * تحويل بيانات قاعدة البيانات إلى كائن EncryptionKey
   */
  private mapToEncryptionKey(data: any): EncryptionKey {
    return {
      id: data.id,
      keyId: data.key_id,
      keyType: data.key_type,
      keyPurpose: data.key_purpose,
      encryptionAlgorithm: data.encryption_algorithm,
      keyVersion: data.key_version,
      keyStatus: data.key_status,
      encryptedKeyData: data.encrypted_key_data,
      kmsProvider: data.kms_provider,
      kmsKeyId: data.kms_key_id,
      createdAt: new Date(data.created_at),
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      lastRotatedAt: data.last_rotated_at ? new Date(data.last_rotated_at) : undefined,
      rotationScheduleDays: data.rotation_schedule_days
    };
  }

  // دوال إضافية للتنفيذ الكامل...
  private async getEncryptedFileById(fileId: string): Promise<EncryptedFile | null> {
    // تنفيذ الحصول على الملف المشفر
    return null; // placeholder
  }

  private async verifyFileAccess(userId: string, file: EncryptedFile): Promise<boolean> {
    // تنفيذ التحقق من صلاحيات الملف
    return false; // placeholder
  }

  private generateSecureToken(payload: any): string {
    // تنفيذ إنشاء token آمن
    return crypto.randomBytes(32).toString('hex'); // placeholder
  }

  private async startKeyRotation(keyId: string, userId: string, reason: string): Promise<string> {
    // تنفيذ بدء عملية التدوير
    return crypto.randomUUID(); // placeholder
  }

  private async updateEncryptionKey(keyId: string, updates: any): Promise<void> {
    // تنفيذ تحديث المفتاح
  }

  private async getFilesByKeyId(keyId: string): Promise<EncryptedFile[]> {
    // تنفيذ الحصول على الملفات المرتبطة بالمفتاح
    return []; // placeholder
  }

  private async reEncryptFile(file: EncryptedFile, newKey: Buffer): Promise<void> {
    // تنفيذ إعادة تشفير الملف
  }

  private async completeKeyRotation(rotationId: string, result: any): Promise<void> {
    // تنفيذ إكمال عملية التدوير
  }

  private async readEncryptedFile(filePath: string): Promise<Buffer> {
    // تنفيذ قراءة الملف المشفر
    return Buffer.alloc(0); // placeholder
  }

  /**
   * تنظيف الموارد
   */
  destroy(): void {
    if (this.keyRotationInterval) {
      clearInterval(this.keyRotationInterval);
    }
    this.masterKeyCache.clear();
  }
}

export default HarakaEncryptionService;