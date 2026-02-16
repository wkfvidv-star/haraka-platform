/**
 * مجدول تدوير المفاتيح التلقائي - منصة حركة
 * Automatic Key Rotation Scheduler - Haraka Platform
 * 
 * نظام تدوير المفاتيح التلقائي مع جدولة وتنبيهات
 */

const { AESEncryptionEngine } = require('../encryption/aes_encryption_engine');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

/**
 * فئة مجدول تدوير المفاتيح
 */
class KeyRotationScheduler {
    constructor(options = {}) {
        this.engine = new AESEncryptionEngine(options.kmsProvider || 'mock');
        this.rotationSchedule = options.schedule || '0 2 * * 0'; // كل أحد الساعة 2 صباحاً
        this.logPath = options.logPath || path.join(__dirname, '../logs/key_rotation.log');
        this.categories = options.categories || ['analysis_video', 'student_reports', 'training_materials'];
        this.maxRetries = options.maxRetries || 3;
        this.retryDelay = options.retryDelay || 5000; // 5 ثواني
        
        this.isRunning = false;
        this.lastRotation = null;
        this.rotationHistory = [];
    }

    /**
     * بدء مجدول تدوير المفاتيح
     */
    start() {
        console.log('🔄 بدء مجدول تدوير المفاتيح التلقائي...');
        console.log(`📅 الجدولة: ${this.rotationSchedule}`);
        console.log(`🏷️  الفئات: ${this.categories.join(', ')}`);
        
        // جدولة تدوير المفاتيح
        this.scheduledTask = cron.schedule(this.rotationSchedule, async () => {
            await this.performScheduledRotation();
        }, {
            scheduled: false,
            timezone: 'Asia/Riyadh'
        });
        
        this.scheduledTask.start();
        console.log('✅ تم بدء المجدول بنجاح');
        
        // تحميل سجل التدوير السابق
        this.loadRotationHistory();
    }

    /**
     * إيقاف المجدول
     */
    stop() {
        if (this.scheduledTask) {
            this.scheduledTask.stop();
            console.log('⏹️  تم إيقاف مجدول تدوير المفاتيح');
        }
    }

    /**
     * تنفيذ تدوير مجدول
     */
    async performScheduledRotation() {
        if (this.isRunning) {
            console.log('⚠️  تدوير المفاتيح قيد التشغيل بالفعل - تم تخطي هذه الدورة');
            return;
        }

        this.isRunning = true;
        const rotationId = `rotation_${Date.now()}`;
        
        console.log(`\n🔄 بدء تدوير المفاتيح المجدول - ${rotationId}`);
        console.log(`📅 الوقت: ${new Date().toLocaleString('ar-SA')}`);
        
        const rotationResults = {
            id: rotationId,
            startTime: new Date(),
            categories: {},
            totalSuccess: 0,
            totalFailed: 0,
            errors: []
        };

        try {
            // تدوير مفاتيح كل فئة
            for (const category of this.categories) {
                console.log(`\n🔑 تدوير مفاتيح فئة: ${category}`);
                
                const categoryResult = await this.rotateKeysWithRetry(category);
                rotationResults.categories[category] = categoryResult;
                
                if (categoryResult.success) {
                    rotationResults.totalSuccess++;
                    console.log(`   ✅ نجح تدوير ${category}`);
                } else {
                    rotationResults.totalFailed++;
                    rotationResults.errors.push(`${category}: ${categoryResult.error}`);
                    console.log(`   ❌ فشل تدوير ${category}: ${categoryResult.error}`);
                }
                
                // انتظار قصير بين التدويرات
                await this.sleep(1000);
            }
            
            rotationResults.endTime = new Date();
            rotationResults.duration = rotationResults.endTime - rotationResults.startTime;
            
            // حفظ النتائج
            await this.saveRotationResult(rotationResults);
            
            // إرسال تقرير
            await this.sendRotationReport(rotationResults);
            
            this.lastRotation = rotationResults;
            this.rotationHistory.push(rotationResults);
            
            console.log(`\n📊 ملخص التدوير:`);
            console.log(`   ✅ نجح: ${rotationResults.totalSuccess}`);
            console.log(`   ❌ فشل: ${rotationResults.totalFailed}`);
            console.log(`   ⏱️  المدة: ${rotationResults.duration}ms`);
            
        } catch (error) {
            console.error('💥 خطأ فادح في تدوير المفاتيح:', error.message);
            rotationResults.fatalError = error.message;
            await this.saveRotationResult(rotationResults);
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * تدوير مفاتيح مع إعادة المحاولة
     */
    async rotateKeysWithRetry(category) {
        let lastError = null;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`   🔄 محاولة ${attempt}/${this.maxRetries} لتدوير ${category}`);
                
                const result = await this.engine.rotateKeys(category);
                
                return {
                    success: true,
                    attempt: attempt,
                    oldKeyId: result.oldKeyId,
                    newKeyId: result.newKeyId,
                    rotatedAt: result.rotatedAt
                };
                
            } catch (error) {
                lastError = error;
                console.log(`   ⚠️  فشلت المحاولة ${attempt}: ${error.message}`);
                
                if (attempt < this.maxRetries) {
                    console.log(`   ⏳ انتظار ${this.retryDelay}ms قبل المحاولة التالية...`);
                    await this.sleep(this.retryDelay);
                }
            }
        }
        
        return {
            success: false,
            error: lastError.message,
            attempts: this.maxRetries
        };
    }

    /**
     * تدوير فوري لفئة محددة
     */
    async rotateNow(category) {
        if (this.isRunning) {
            throw new Error('تدوير المفاتيح قيد التشغيل بالفعل');
        }

        console.log(`🔄 تدوير فوري لفئة: ${category}`);
        
        this.isRunning = true;
        try {
            const result = await this.rotateKeysWithRetry(category);
            
            if (result.success) {
                console.log(`✅ تم التدوير الفوري بنجاح`);
                
                // حفظ سجل التدوير الفوري
                await this.saveManualRotation(category, result);
            } else {
                throw new Error(`فشل التدوير الفوري: ${result.error}`);
            }
            
            return result;
            
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * الحصول على حالة المجدول
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            schedule: this.rotationSchedule,
            categories: this.categories,
            lastRotation: this.lastRotation,
            nextRotation: this.scheduledTask ? this.scheduledTask.nextDate() : null,
            rotationCount: this.rotationHistory.length
        };
    }

    /**
     * الحصول على سجل التدوير
     */
    getRotationHistory(limit = 10) {
        return this.rotationHistory
            .slice(-limit)
            .reverse(); // الأحدث أولاً
    }

    /**
     * حفظ نتيجة التدوير
     */
    async saveRotationResult(result) {
        try {
            // إنشاء مجلد السجلات
            const logDir = path.dirname(this.logPath);
            await fs.mkdir(logDir, { recursive: true });
            
            // إضافة السجل
            const logEntry = `${new Date().toISOString()} - ${JSON.stringify(result)}\n`;
            await fs.appendFile(this.logPath, logEntry);
            
            // حفظ نسخة JSON مفصلة
            const detailedLogPath = path.join(
                logDir, 
                `rotation_${result.id}.json`
            );
            await fs.writeFile(
                detailedLogPath, 
                JSON.stringify(result, null, 2)
            );
            
        } catch (error) {
            console.error('خطأ في حفظ سجل التدوير:', error.message);
        }
    }

    /**
     * حفظ سجل التدوير اليدوي
     */
    async saveManualRotation(category, result) {
        const manualRotation = {
            id: `manual_${Date.now()}`,
            type: 'manual',
            category: category,
            result: result,
            timestamp: new Date(),
            triggeredBy: 'admin' // يمكن تخصيصه
        };
        
        await this.saveRotationResult(manualRotation);
    }

    /**
     * تحميل سجل التدوير السابق
     */
    async loadRotationHistory() {
        try {
            const logDir = path.dirname(this.logPath);
            const files = await fs.readdir(logDir);
            
            const rotationFiles = files
                .filter(file => file.startsWith('rotation_') && file.endsWith('.json'))
                .sort()
                .slice(-50); // آخر 50 تدوير
            
            for (const file of rotationFiles) {
                try {
                    const filePath = path.join(logDir, file);
                    const data = await fs.readFile(filePath, 'utf8');
                    const rotation = JSON.parse(data);
                    this.rotationHistory.push(rotation);
                } catch (error) {
                    console.warn(`تحذير: فشل تحميل سجل ${file}:`, error.message);
                }
            }
            
            if (this.rotationHistory.length > 0) {
                this.lastRotation = this.rotationHistory[this.rotationHistory.length - 1];
                console.log(`📚 تم تحميل ${this.rotationHistory.length} سجل تدوير سابق`);
            }
            
        } catch (error) {
            console.log('📝 لا يوجد سجل تدوير سابق');
        }
    }

    /**
     * إرسال تقرير التدوير
     */
    async sendRotationReport(result) {
        // يمكن تخصيص هذه الطريقة لإرسال التقارير عبر:
        // - البريد الإلكتروني
        // - Slack/Teams
        // - نظام التنبيهات الداخلي
        // - SMS للحالات الحرجة
        
        console.log('📧 إرسال تقرير التدوير...');
        
        const report = this.generateRotationReport(result);
        
        // مثال: حفظ التقرير في ملف
        const reportPath = path.join(
            path.dirname(this.logPath),
            `report_${result.id}.txt`
        );
        
        await fs.writeFile(reportPath, report);
        console.log(`📄 تم حفظ التقرير: ${reportPath}`);
        
        // TODO: إضافة إرسال فعلي للتقرير
    }

    /**
     * إنشاء تقرير التدوير
     */
    generateRotationReport(result) {
        const lines = [
            '🔐 تقرير تدوير المفاتيح - منصة حركة',
            '=' .repeat(50),
            '',
            `📅 التاريخ: ${result.startTime.toLocaleString('ar-SA')}`,
            `🆔 معرف التدوير: ${result.id}`,
            `⏱️  المدة: ${result.duration}ms`,
            '',
            '📊 النتائج:',
            `   ✅ نجح: ${result.totalSuccess} فئة`,
            `   ❌ فشل: ${result.totalFailed} فئة`,
            ''
        ];
        
        // تفاصيل كل فئة
        lines.push('🔍 تفاصيل الفئات:');
        for (const [category, categoryResult] of Object.entries(result.categories)) {
            lines.push(`   📂 ${category}:`);
            if (categoryResult.success) {
                lines.push(`      ✅ نجح`);
                lines.push(`      🔑 المفتاح القديم: ${categoryResult.oldKeyId}`);
                lines.push(`      🆕 المفتاح الجديد: ${categoryResult.newKeyId}`);
            } else {
                lines.push(`      ❌ فشل: ${categoryResult.error}`);
                lines.push(`      🔄 عدد المحاولات: ${categoryResult.attempts}`);
            }
            lines.push('');
        }
        
        // الأخطاء إن وجدت
        if (result.errors.length > 0) {
            lines.push('⚠️  الأخطاء:');
            result.errors.forEach(error => {
                lines.push(`   • ${error}`);
            });
            lines.push('');
        }
        
        lines.push('🔐 منصة حركة - نظام إدارة المفاتيح الآمن');
        
        return lines.join('\n');
    }

    /**
     * انتظار لمدة محددة
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * تشغيل المجدول إذا تم استدعاء الملف مباشرة
 */
async function runScheduler() {
    const scheduler = new KeyRotationScheduler({
        schedule: '*/30 * * * * *', // كل 30 ثانية للاختبار
        categories: ['analysis_video', 'student_reports'],
        kmsProvider: 'mock'
    });
    
    // بدء المجدول
    scheduler.start();
    
    // إيقاف بعد دقيقتين للاختبار
    setTimeout(() => {
        scheduler.stop();
        console.log('🏁 انتهى اختبار المجدول');
        process.exit(0);
    }, 120000);
    
    // عرض الحالة كل 10 ثواني
    setInterval(() => {
        const status = scheduler.getStatus();
        console.log(`\n📊 حالة المجدول:`);
        console.log(`   🔄 قيد التشغيل: ${status.isRunning}`);
        console.log(`   📅 آخر تدوير: ${status.lastRotation ? status.lastRotation.startTime.toLocaleString('ar-SA') : 'لا يوجد'}`);
        console.log(`   📈 عدد التدويرات: ${status.rotationCount}`);
    }, 10000);
}

// تشغيل المجدول إذا تم استدعاؤه مباشرة
if (require.main === module) {
    runScheduler().catch(console.error);
}

module.exports = { KeyRotationScheduler };