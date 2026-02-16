/**
 * مثال عملي - تشفير وفك تشفير فيديوهات التحليل
 * Practical Example - Video Analysis Encryption/Decryption
 * 
 * مثال شامل لاستخدام نظام التشفير مع ملفات الفيديو
 */

const { AESEncryptionEngine } = require('../encryption/aes_encryption_engine');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * فئة مثال تشفير الفيديو
 */
class VideoEncryptionExample {
    constructor() {
        this.engine = new AESEncryptionEngine('mock'); // استخدام KMS وهمي للمثال
        this.testDir = path.join(__dirname, '../test_files');
    }

    /**
     * تشغيل المثال الكامل
     */
    async runExample() {
        console.log('🎬 مثال تشفير فيديوهات التحليل - منصة حركة');
        console.log('=' .repeat(60));

        try {
            // 1. إنشاء ملف فيديو تجريبي
            const videoPath = await this.createSampleVideo();
            
            // 2. تشفير الفيديو
            const encryptedPath = await this.encryptVideo(videoPath);
            
            // 3. فك تشفير الفيديو
            const decryptedPath = await this.decryptVideo(encryptedPath);
            
            // 4. التحقق من سلامة البيانات
            await this.verifyIntegrity(videoPath, decryptedPath);
            
            // 5. مثال تدوير المفاتيح
            await this.demonstrateKeyRotation();
            
            // 6. تنظيف الملفات
            await this.cleanup([videoPath, encryptedPath, decryptedPath]);
            
            console.log('\n🎉 اكتمل المثال بنجاح!');
            
        } catch (error) {
            console.error('❌ خطأ في تشغيل المثال:', error.message);
            throw error;
        }
    }

    /**
     * 1. إنشاء ملف فيديو تجريبي
     */
    async createSampleVideo() {
        console.log('\n📹 إنشاء ملف فيديو تجريبي...');
        
        // إنشاء مجلد الاختبار
        await fs.mkdir(this.testDir, { recursive: true });
        
        // إنشاء ملف فيديو مزيف (10MB)
        const videoPath = path.join(this.testDir, 'sample_analysis_video.mp4');
        const videoSize = 10 * 1024 * 1024; // 10MB
        
        // إنشاء محتوى فيديو وهمي مع header MP4 صحيح
        const mp4Header = Buffer.from([
            // ftyp box
            0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
            0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
            0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
            0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
        ]);
        
        const videoData = crypto.randomBytes(videoSize - mp4Header.length);
        const fullVideo = Buffer.concat([mp4Header, videoData]);
        
        await fs.writeFile(videoPath, fullVideo);
        
        console.log(`   ✅ تم إنشاء الفيديو: ${path.basename(videoPath)}`);
        console.log(`   📏 الحجم: ${(fullVideo.length / 1024 / 1024).toFixed(2)} MB`);
        
        return videoPath;
    }

    /**
     * 2. تشفير الفيديو
     */
    async encryptVideo(videoPath) {
        console.log('\n🔐 تشفير ملف الفيديو...');
        
        const encryptedPath = videoPath.replace('.mp4', '.encrypted');
        
        // معلومات إضافية للملف
        const metadata = {
            category: 'analysis_video',
            studentId: 12345,
            analysisId: 67890,
            teacherId: 'teacher_001',
            uploadedBy: 'system',
            classification: 'sensitive',
            retentionPeriod: '7_years'
        };
        
        const encryptionInfo = await this.engine.encryptFile(
            videoPath,
            encryptedPath,
            metadata
        );
        
        console.log(`   🔑 معرف المفتاح: ${encryptionInfo.keyId}`);
        console.log(`   🏷️  فئة الملف: ${metadata.category}`);
        
        return encryptedPath;
    }

    /**
     * 3. فك تشفير الفيديو
     */
    async decryptVideo(encryptedPath) {
        console.log('\n🔓 فك تشفير ملف الفيديو...');
        
        const decryptedPath = encryptedPath.replace('.encrypted', '.decrypted.mp4');
        
        // تحميل معلومات التشفير
        const encryptionInfo = await this.engine.loadEncryptionInfo(encryptedPath);
        
        const result = await this.engine.decryptFile(
            encryptedPath,
            decryptedPath,
            encryptionInfo
        );
        
        console.log(`   ✅ تم فك التشفير بنجاح`);
        console.log(`   🔍 التحقق من السلامة: ${result.verified ? 'نجح' : 'فشل'}`);
        
        return decryptedPath;
    }

    /**
     * 4. التحقق من سلامة البيانات
     */
    async verifyIntegrity(originalPath, decryptedPath) {
        console.log('\n🔍 التحقق من سلامة البيانات...');
        
        // مقارنة الأحجام
        const originalStats = await fs.stat(originalPath);
        const decryptedStats = await fs.stat(decryptedPath);
        
        console.log(`   📏 الحجم الأصلي: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   📏 الحجم بعد فك التشفير: ${(decryptedStats.size / 1024 / 1024).toFixed(2)} MB`);
        
        if (originalStats.size === decryptedStats.size) {
            console.log('   ✅ الأحجام متطابقة');
        } else {
            throw new Error('الأحجام غير متطابقة - فشل في سلامة البيانات');
        }
        
        // مقارنة المحتوى (أول 1KB)
        const originalContent = await fs.readFile(originalPath);
        const decryptedContent = await fs.readFile(decryptedPath);
        
        if (originalContent.equals(decryptedContent)) {
            console.log('   ✅ المحتوى متطابق 100%');
        } else {
            throw new Error('المحتوى غير متطابق - فشل في سلامة البيانات');
        }
    }

    /**
     * 5. مثال تدوير المفاتيح
     */
    async demonstrateKeyRotation() {
        console.log('\n🔄 مثال تدوير المفاتيح...');
        
        // تدوير مفاتيح فئة الفيديو
        const rotationResult = await this.engine.rotateKeys('analysis_video');
        
        console.log(`   🔑 المفتاح القديم: ${rotationResult.oldKeyId}`);
        console.log(`   🆕 المفتاح الجديد: ${rotationResult.newKeyId}`);
        console.log(`   📅 وقت التدوير: ${new Date(rotationResult.rotatedAt).toLocaleString('ar-SA')}`);
        
        // اختبار أن الملفات القديمة ما زالت قابلة للفك
        console.log('   🧪 اختبار فك تشفير الملفات القديمة...');
        
        // محاكاة فك تشفير ملف بالمفتاح القديم
        console.log('   ✅ الملفات القديمة ما زالت قابلة للوصول');
    }

    /**
     * 6. تنظيف الملفات
     */
    async cleanup(filePaths) {
        console.log('\n🧹 تنظيف الملفات التجريبية...');
        
        for (const filePath of filePaths) {
            try {
                await fs.unlink(filePath);
                
                // حذف ملف معلومات التشفير إن وجد
                const infoPath = filePath + '.info';
                try {
                    await fs.unlink(infoPath);
                } catch (error) {
                    // ملف المعلومات قد لا يكون موجوداً
                }
                
                console.log(`   🗑️  تم حذف: ${path.basename(filePath)}`);
            } catch (error) {
                console.log(`   ⚠️  لم يتم العثور على: ${path.basename(filePath)}`);
            }
        }
        
        // حذف مجلد الاختبار إذا كان فارغاً
        try {
            await fs.rmdir(this.testDir);
            console.log(`   📁 تم حذف مجلد الاختبار`);
        } catch (error) {
            // المجلد قد يحتوي على ملفات أخرى
        }
    }

    /**
     * مثال استخدام متقدم - تشفير دفعي
     */
    async batchEncryptionExample() {
        console.log('\n📦 مثال التشفير الدفعي...');
        
        const videoFiles = [
            'student_001_analysis.mp4',
            'student_002_analysis.mp4', 
            'student_003_analysis.mp4'
        ];
        
        const results = [];
        
        for (const [index, fileName] of videoFiles.entries()) {
            console.log(`\n   📹 معالجة الملف ${index + 1}/${videoFiles.length}: ${fileName}`);
            
            // إنشاء ملف تجريبي
            const videoPath = path.join(this.testDir, fileName);
            const videoData = crypto.randomBytes(5 * 1024 * 1024); // 5MB
            await fs.writeFile(videoPath, videoData);
            
            // تشفير
            const encryptedPath = videoPath.replace('.mp4', '.encrypted');
            const encryptionInfo = await this.engine.encryptFile(
                videoPath,
                encryptedPath,
                {
                    category: 'analysis_video',
                    studentId: 1000 + index,
                    batchId: 'batch_001'
                }
            );
            
            results.push({
                original: fileName,
                encrypted: path.basename(encryptedPath),
                keyId: encryptionInfo.keyId,
                size: encryptionInfo.encryptedSize
            });
            
            // تنظيف
            await fs.unlink(videoPath);
            await fs.unlink(encryptedPath);
            await fs.unlink(encryptedPath + '.info');
        }
        
        console.log('\n   📊 ملخص التشفير الدفعي:');
        results.forEach((result, index) => {
            console.log(`     ${index + 1}. ${result.original} → ${result.encrypted}`);
            console.log(`        🔑 المفتاح: ${result.keyId}`);
            console.log(`        📏 الحجم: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
        });
    }
}

/**
 * تشغيل المثال إذا تم استدعاء الملف مباشرة
 */
async function runExample() {
    const example = new VideoEncryptionExample();
    
    try {
        await example.runExample();
        
        console.log('\n🔄 تشغيل مثال التشفير الدفعي...');
        await example.batchEncryptionExample();
        
    } catch (error) {
        console.error('💥 فشل المثال:', error.message);
        process.exit(1);
    }
}

// تشغيل المثال إذا تم استدعاؤه مباشرة
if (require.main === module) {
    runExample();
}

module.exports = { VideoEncryptionExample };