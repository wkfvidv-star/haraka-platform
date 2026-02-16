/**
 * تشغيل اختبارات التشفير الشاملة - منصة حركة
 * Run Comprehensive Encryption Tests - Haraka Platform
 */

import EncryptionTestSuite from './encryption_test_suite';

/**
 * تشغيل جميع الاختبارات وطباعة النتائج
 */
async function runEncryptionTests(): Promise<void> {
    console.log('🔐 منصة حركة - اختبارات نظام التشفير الشامل');
    console.log('=' .repeat(80));
    console.log('📅 التاريخ:', new Date().toLocaleString('ar-SA'));
    console.log('🏗️  الإصدار: v2.0.0 - نظام التشفير المتقدم');
    console.log('=' .repeat(80));
    console.log();

    try {
        // إنشاء مجموعة الاختبارات
        const testSuite = new EncryptionTestSuite();
        
        // تشغيل جميع الاختبارات
        const startTime = Date.now();
        const results = await testSuite.runAllTests();
        const totalTime = Date.now() - startTime;
        
        // طباعة التقرير النهائي
        testSuite.printFinalReport();
        
        console.log(`\n⏱️  إجمالي وقت التنفيذ: ${totalTime}ms (${(totalTime / 1000).toFixed(2)} ثانية)`);
        console.log('=' .repeat(80));
        
        // تحديد حالة الخروج
        const failedTests = results.filter(r => r.status === 'فشل ❌').length;
        if (failedTests > 0) {
            console.log(`❌ فشل ${failedTests} اختبار من أصل ${results.length}`);
            process.exit(1);
        } else {
            console.log(`✅ نجح جميع الاختبارات (${results.length}/${results.length})`);
            process.exit(0);
        }
        
    } catch (error) {
        console.error('💥 خطأ فادح في تشغيل الاختبارات:', error);
        process.exit(1);
    }
}

// تشغيل الاختبارات إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    runEncryptionTests().catch(console.error);
}

export { runEncryptionTests };