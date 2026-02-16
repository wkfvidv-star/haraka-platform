/**
 * محرك التشفير AES-256 - منصة حركة
 * AES-256 Encryption Engine - Haraka Platform
 * 
 * نظام تشفير شامل للملفات الحساسة مع إدارة المفاتيح
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');

/**
 * فئة محرك التشفير الرئيسية
 */
class AESEncryptionEngine {
    constructor(kmsProvider = 'vault') {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 16;  // 128 bits
        this.tagLength = 16; // 128 bits
        this.kmsProvider = kmsProvider;
        
        // إعداد مزود KMS
        this.kms = this.initializeKMS(kmsProvider);
    }

    /**
     * تشفير ملف فيديو
     */
    async encryptFile(inputPath, outputPath, metadata = {}) {
        try {
            console.log(`🔐 بدء تشفير الملف: ${path.basename(inputPath)}`);
            
            // 1. إنشاء مفتاح تشفير البيانات (DEK)
            const dataKey = crypto.randomBytes(this.keyLength);
            const iv = crypto.randomBytes(this.ivLength);
            
            // 2. الحصول على مفتاح التشفير الرئيسي من KMS
            const masterKeyId = await this.kms.getMasterKeyId(metadata.category || 'video');
            const encryptedDataKey = await this.kms.encryptDataKey(dataKey, masterKeyId);
            
            // 3. حساب checksum للملف الأصلي
            const originalChecksum = await this.calculateChecksum(inputPath);
            const originalSize = (await fs.stat(inputPath)).size;
            
            // 4. تشفير الملف
            const { authTag, encryptedSize } = await this.encryptFileStream(
                inputPath, 
                outputPath, 
                dataKey, 
                iv
            );
            
            // 5. حساب checksum للملف المشفر
            const encryptedChecksum = await this.calculateChecksum(outputPath);
            
            // 6. إنشاء معلومات التشفير
            const encryptionInfo = {
                algorithm: this.algorithm,
                keyId: masterKeyId,
                encryptedDataKey: encryptedDataKey.toString('base64'),
                iv: iv.toString('base64'),
                authTag: authTag.toString('base64'),
                originalSize: originalSize,
                encryptedSize: encryptedSize,
                originalChecksum: originalChecksum,
                encryptedChecksum: encryptedChecksum,
                timestamp: new Date().toISOString(),
                metadata: metadata
            };
            
            // 7. حفظ معلومات التشفير
            await this.saveEncryptionInfo(outputPath, encryptionInfo);
            
            console.log(`✅ تم تشفير الملف بنجاح`);
            console.log(`   الحجم الأصلي: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   الحجم المشفر: ${(encryptedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   معرف المفتاح: ${masterKeyId}`);
            
            return encryptionInfo;
            
        } catch (error) {
            console.error('❌ خطأ في تشفير الملف:', error.message);
            throw error;
        }
    }

    /**
     * فك تشفير ملف فيديو
     */
    async decryptFile(inputPath, outputPath, encryptionInfo) {
        try {
            console.log(`🔓 بدء فك تشفير الملف: ${path.basename(inputPath)}`);
            
            // 1. التحقق من معلومات التشفير
            if (!encryptionInfo || !encryptionInfo.encryptedDataKey) {
                throw new Error('معلومات التشفير مفقودة أو غير صحيحة');
            }
            
            // 2. فك تشفير مفتاح البيانات من KMS
            const encryptedDataKey = Buffer.from(encryptionInfo.encryptedDataKey, 'base64');
            const dataKey = await this.kms.decryptDataKey(encryptedDataKey, encryptionInfo.keyId);
            
            // 3. استخراج معلومات التشفير
            const iv = Buffer.from(encryptionInfo.iv, 'base64');
            const authTag = Buffer.from(encryptionInfo.authTag, 'base64');
            
            // 4. فك تشفير الملف
            await this.decryptFileStream(inputPath, outputPath, dataKey, iv, authTag);
            
            // 5. التحقق من سلامة الملف
            const decryptedChecksum = await this.calculateChecksum(outputPath);
            if (decryptedChecksum !== encryptionInfo.originalChecksum) {
                await fs.unlink(outputPath); // حذف الملف المعطوب
                throw new Error('فشل التحقق من سلامة الملف بعد فك التشفير');
            }
            
            console.log(`✅ تم فك تشفير الملف بنجاح`);
            console.log(`   الحجم: ${((await fs.stat(outputPath)).size / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   التحقق من السلامة: نجح`);
            
            return {
                decryptedPath: outputPath,
                originalSize: encryptionInfo.originalSize,
                verified: true
            };
            
        } catch (error) {
            console.error('❌ خطأ في فك تشفير الملف:', error.message);
            throw error;
        }
    }

    /**
     * تدوير المفاتيح
     */
    async rotateKeys(category = 'video') {
        try {
            console.log(`🔄 بدء تدوير مفاتيح فئة: ${category}`);
            
            // 1. إنشاء مفتاح جديد
            const newKeyId = await this.kms.createNewKey(category);
            
            // 2. الحصول على المفتاح القديم
            const oldKeyId = await this.kms.getCurrentKeyId(category);
            
            // 3. تحديث مرجع المفتاح الحالي
            await this.kms.setCurrentKey(category, newKeyId);
            
            // 4. وضع علامة على المفتاح القديم للتقاعد
            await this.kms.markKeyForRetirement(oldKeyId);
            
            console.log(`✅ تم تدوير المفاتيح بنجاح`);
            console.log(`   المفتاح القديم: ${oldKeyId}`);
            console.log(`   المفتاح الجديد: ${newKeyId}`);
            
            return {
                oldKeyId,
                newKeyId,
                category,
                rotatedAt: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ خطأ في تدوير المفاتيح:', error.message);
            throw error;
        }
    }

    // ===== الطرق المساعدة =====

    /**
     * تشفير ملف باستخدام stream للملفات الكبيرة
     */
    async encryptFileStream(inputPath, outputPath, key, iv) {
        return new Promise((resolve, reject) => {
            const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
            const input = createReadStream(inputPath);
            const output = createWriteStream(outputPath);
            
            let encryptedSize = 0;
            
            const encryptTransform = new Transform({
                transform(chunk, encoding, callback) {
                    const encrypted = cipher.update(chunk);
                    encryptedSize += encrypted.length;
                    callback(null, encrypted);
                }
            });

            pipeline(input, encryptTransform, output)
                .then(() => {
                    cipher.final();
                    const authTag = cipher.getAuthTag();
                    resolve({ authTag, encryptedSize });
                })
                .catch(reject);
        });
    }

    /**
     * فك تشفير ملف باستخدام stream
     */
    async decryptFileStream(inputPath, outputPath, key, iv, authTag) {
        return new Promise((resolve, reject) => {
            const decipher = crypto.createDecipherGCM(this.algorithm, key, iv);
            decipher.setAuthTag(authTag);
            
            const input = createReadStream(inputPath);
            const output = createWriteStream(outputPath);

            const decryptTransform = new Transform({
                transform(chunk, encoding, callback) {
                    try {
                        const decrypted = decipher.update(chunk);
                        callback(null, decrypted);
                    } catch (error) {
                        callback(error);
                    }
                }
            });

            pipeline(input, decryptTransform, output)
                .then(() => {
                    try {
                        decipher.final();
                        resolve();
                    } catch (error) {
                        reject(new Error('فشل التحقق من صحة التشفير'));
                    }
                })
                .catch(reject);
        });
    }

    /**
     * حساب checksum للملف
     */
    async calculateChecksum(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = createReadStream(filePath);
            
            stream.on('data', data => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    /**
     * حفظ معلومات التشفير
     */
    async saveEncryptionInfo(filePath, encryptionInfo) {
        const infoPath = filePath + '.info';
        await fs.writeFile(infoPath, JSON.stringify(encryptionInfo, null, 2));
    }

    /**
     * تحميل معلومات التشفير
     */
    async loadEncryptionInfo(filePath) {
        const infoPath = filePath + '.info';
        const data = await fs.readFile(infoPath, 'utf8');
        return JSON.parse(data);
    }

    /**
     * تهيئة مزود KMS
     */
    initializeKMS(provider) {
        switch (provider) {
            case 'vault':
                return new VaultKMSProvider();
            case 'aws':
                return new AWSKMSProvider();
            case 'supabase':
                return new SupabaseKMSProvider();
            default:
                return new MockKMSProvider(); // للاختبار
        }
    }
}

/**
 * مزود KMS وهمي للاختبار
 */
class MockKMSProvider {
    constructor() {
        this.keys = new Map();
        this.currentKeys = new Map();
        this.masterKey = crypto.randomBytes(32); // مفتاح رئيسي وهمي
    }

    async getMasterKeyId(category) {
        if (!this.currentKeys.has(category)) {
            const keyId = `haraka-${category}-${Date.now()}`;
            this.keys.set(keyId, {
                id: keyId,
                category: category,
                created: new Date(),
                status: 'active'
            });
            this.currentKeys.set(category, keyId);
        }
        return this.currentKeys.get(category);
    }

    async encryptDataKey(dataKey, keyId) {
        // تشفير بسيط باستخدام المفتاح الرئيسي الوهمي
        const cipher = crypto.createCipher('aes-256-cbc', this.masterKey);
        return Buffer.concat([cipher.update(dataKey), cipher.final()]);
    }

    async decryptDataKey(encryptedDataKey, keyId) {
        // فك تشفير باستخدام المفتاح الرئيسي الوهمي
        const decipher = crypto.createDecipher('aes-256-cbc', this.masterKey);
        return Buffer.concat([decipher.update(encryptedDataKey), decipher.final()]);
    }

    async createNewKey(category) {
        const keyId = `haraka-${category}-${Date.now()}`;
        this.keys.set(keyId, {
            id: keyId,
            category: category,
            created: new Date(),
            status: 'active'
        });
        return keyId;
    }

    async getCurrentKeyId(category) {
        return this.currentKeys.get(category);
    }

    async setCurrentKey(category, keyId) {
        this.currentKeys.set(category, keyId);
    }

    async markKeyForRetirement(keyId) {
        if (this.keys.has(keyId)) {
            this.keys.get(keyId).status = 'retired';
        }
    }
}

/**
 * مزود Vault KMS
 */
class VaultKMSProvider {
    constructor() {
        this.vaultUrl = process.env.VAULT_URL || 'http://localhost:8200';
        this.vaultToken = process.env.VAULT_TOKEN;
    }

    async getMasterKeyId(category) {
        // تنفيذ التكامل مع HashiCorp Vault
        return `vault://haraka/${category}/master`;
    }

    async encryptDataKey(dataKey, keyId) {
        // تنفيذ تشفير مع Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    async decryptDataKey(encryptedDataKey, keyId) {
        // تنفيذ فك تشفير مع Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    async createNewKey(category) {
        // تنفيذ إنشاء مفتاح جديد في Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    async getCurrentKeyId(category) {
        // تنفيذ جلب المفتاح الحالي من Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    async setCurrentKey(category, keyId) {
        // تنفيذ تحديث المفتاح الحالي في Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    async markKeyForRetirement(keyId) {
        // تنفيذ وضع علامة تقاعد في Vault
        throw new Error('Vault KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }
}

/**
 * مزود AWS KMS
 */
class AWSKMSProvider {
    constructor() {
        // تهيئة AWS KMS SDK
    }

    async getMasterKeyId(category) {
        // تنفيذ التكامل مع AWS KMS
        throw new Error('AWS KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    // ... باقي الطرق
}

/**
 * مزود Supabase KMS
 */
class SupabaseKMSProvider {
    constructor() {
        // تهيئة Supabase Vault
    }

    async getMasterKeyId(category) {
        // تنفيذ التكامل مع Supabase Vault
        throw new Error('Supabase KMS غير مُنفذ بعد - استخدم MockKMSProvider للاختبار');
    }

    // ... باقي الطرق
}

module.exports = {
    AESEncryptionEngine,
    MockKMSProvider,
    VaultKMSProvider,
    AWSKMSProvider,
    SupabaseKMSProvider
};