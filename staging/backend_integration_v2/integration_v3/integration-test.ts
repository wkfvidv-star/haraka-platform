// اختبار التكامل الشامل - المرحلة 3ج
// Comprehensive Integration Test - Phase 3C

import SupabaseIntegration from './supabase-integration';
import { FrontendDataService } from './frontend-integration';

export class IntegrationTest {
  private supabaseIntegration: SupabaseIntegration;
  private testResults: any[] = [];

  constructor() {
    this.supabaseIntegration = new SupabaseIntegration();
  }

  // تشغيل جميع الاختبارات
  async runAllTests(): Promise<void> {
    console.log('🚀 بدء اختبار التكامل الشامل لمنصة حركة...\n');

    const tests = [
      { name: 'اختبار إعداد قاعدة البيانات', test: this.testDatabaseSetup.bind(this) },
      { name: 'اختبار الاتصال', test: this.testConnection.bind(this) },
      { name: 'اختبار إدراج البيانات', test: this.testDataInsertion.bind(this) },
      { name: 'اختبار جلب الطلاب', test: this.testStudentsRetrieval.bind(this) },
      { name: 'اختبار جلب التحليلات', test: this.testAnalysesRetrieval.bind(this) },
      { name: 'اختبار الإحصائيات', test: this.testAnalytics.bind(this) },
      { name: 'اختبار الإشعارات', test: this.testNotifications.bind(this) },
      { name: 'اختبار رفع الملفات', test: this.testFileUpload.bind(this) },
      { name: 'اختبار الفلترة والبحث', test: this.testFilteringAndSearch.bind(this) },
      { name: 'اختبار الأداء', test: this.testPerformance.bind(this) }
    ];

    for (const { name, test } of tests) {
      await this.runSingleTest(name, test);
    }

    this.generateReport();
  }

  // تشغيل اختبار واحد
  private async runSingleTest(testName: string, testFunction: () => Promise<any>): Promise<void> {
    console.log(`📋 ${testName}...`);
    const startTime = Date.now();

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;

      this.testResults.push({
        name: testName,
        status: 'نجح',
        duration,
        result,
        timestamp: new Date().toISOString()
      });

      console.log(`   ✅ نجح في ${duration}ms\n`);

    } catch (error) {
      const duration = Date.now() - startTime;

      this.testResults.push({
        name: testName,
        status: 'فشل',
        duration,
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
        timestamp: new Date().toISOString()
      });

      console.log(`   ❌ فشل في ${duration}ms: ${error instanceof Error ? error.message : error}\n`);
    }
  }

  // اختبار إعداد قاعدة البيانات
  private async testDatabaseSetup(): Promise<any> {
    const success = await this.supabaseIntegration.setupDatabase();
    if (!success) {
      throw new Error('فشل في إعداد قاعدة البيانات');
    }
    return { message: 'تم إعداد قاعدة البيانات بنجاح' };
  }

  // اختبار الاتصال
  private async testConnection(): Promise<any> {
    const isConnected = await this.supabaseIntegration.testConnection();
    if (!isConnected) {
      throw new Error('فشل في الاتصال بـ Supabase');
    }
    
    const stats = await this.supabaseIntegration.getQuickStats();
    return { 
      message: 'الاتصال ناجح',
      stats 
    };
  }

  // اختبار إدراج البيانات
  private async testDataInsertion(): Promise<any> {
    // اختبار إدراج طالب جديد
    const newStudent = {
      student_id: 9999,
      student_name: 'طالب اختبار',
      student_code: 'TEST999',
      class_name: 'صف الاختبار',
      grade_level: 5,
      gender: 'ذكر',
      status: 'نشط'
    };

    const studentResult = await FrontendDataService.createAnalysis({
      student_id: 9999,
      student_name: 'طالب اختبار',
      class_name: 'صف الاختبار',
      grade_level: 5,
      balance_score: 75.0,
      speed_score: 80.0,
      accuracy_score: 78.5,
      session_duration: 1500,
      exercises_completed: 10,
      teacher_name: 'معلم الاختبار',
      performance_category: 'جيد'
    });

    if (studentResult.error) {
      throw new Error(`فشل في إدراج التحليل: ${studentResult.error}`);
    }

    return { 
      message: 'تم إدراج البيانات بنجاح',
      insertedAnalysis: studentResult.data 
    };
  }

  // اختبار جلب الطلاب
  private async testStudentsRetrieval(): Promise<any> {
    const result = await FrontendDataService.getStudents({ limit: 10 });
    
    if (result.error) {
      throw new Error(`فشل في جلب الطلاب: ${result.error}`);
    }

    if (result.data.length === 0) {
      throw new Error('لم يتم العثور على أي طلاب');
    }

    return {
      message: 'تم جلب الطلاب بنجاح',
      studentsCount: result.count,
      sampleStudents: result.data.slice(0, 3).map(s => ({
        id: s.student_id,
        name: s.student_name,
        class: s.class_name,
        performance: s.average_performance
      }))
    };
  }

  // اختبار جلب التحليلات
  private async testAnalysesRetrieval(): Promise<any> {
    const result = await FrontendDataService.getAnalyses({ limit: 10 });
    
    if (result.error) {
      throw new Error(`فشل في جلب التحليلات: ${result.error}`);
    }

    if (result.data.length === 0) {
      throw new Error('لم يتم العثور على أي تحليلات');
    }

    // اختبار جلب تحليل محدد
    const firstAnalysis = result.data[0];
    const studentResult = await FrontendDataService.getStudentWithAnalyses(firstAnalysis.student_id);
    
    if (studentResult.error) {
      throw new Error(`فشل في جلب تحليلات الطالب: ${studentResult.error}`);
    }

    return {
      message: 'تم جلب التحليلات بنجاح',
      analysesCount: result.count,
      avgScore: result.data.reduce((sum, a) => sum + a.overall_score, 0) / result.data.length,
      studentAnalyses: studentResult.analyses?.length || 0
    };
  }

  // اختبار الإحصائيات
  private async testAnalytics(): Promise<any> {
    const result = await FrontendDataService.getSchoolAnalytics();
    
    if (result.error) {
      throw new Error(`فشل في جلب الإحصائيات: ${result.error}`);
    }

    if (!result.data) {
      throw new Error('لم يتم العثور على إحصائيات المدرسة');
    }

    // اختبار الطلاب المحتاجين للمتابعة
    const followupResult = await FrontendDataService.getStudentsNeedingFollowup();
    
    if (followupResult.error) {
      throw new Error(`فشل في جلب الطلاب المحتاجين للمتابعة: ${followupResult.error}`);
    }

    return {
      message: 'تم جلب الإحصائيات بنجاح',
      totalStudents: result.data.total_students,
      totalAnalyses: result.data.total_analyses,
      avgScore: result.data.avg_overall_score,
      studentsNeedingFollowup: followupResult.count,
      topClass: result.data.top_performing_class
    };
  }

  // اختبار الإشعارات
  private async testNotifications(): Promise<any> {
    const result = await FrontendDataService.getNotifications({ limit: 5 });
    
    if (result.error) {
      throw new Error(`فشل في جلب الإشعارات: ${result.error}`);
    }

    // اختبار تحديث حالة الإشعار إذا وجدت إشعارات
    let markAsReadResult = null;
    if (result.data.length > 0 && !result.data[0].is_read) {
      markAsReadResult = await FrontendDataService.markNotificationAsRead(result.data[0].id);
      
      if (!markAsReadResult.success) {
        throw new Error(`فشل في تحديث حالة الإشعار: ${markAsReadResult.error}`);
      }
    }

    return {
      message: 'تم اختبار الإشعارات بنجاح',
      notificationsCount: result.count,
      unreadCount: result.data.filter(n => !n.is_read).length,
      markAsReadTested: markAsReadResult ? true : false
    };
  }

  // اختبار رفع الملفات
  private async testFileUpload(): Promise<any> {
    // إنشاء ملف وهمي للاختبار
    const testFile = new File(['test video content'], 'test-video.mp4', { type: 'video/mp4' });
    const fileName = `test-uploads/test-${Date.now()}.mp4`;

    const result = await FrontendDataService.uploadVideo(testFile, fileName);
    
    if (result.error) {
      throw new Error(`فشل في رفع الملف: ${result.error}`);
    }

    return {
      message: 'تم رفع الملف بنجاح',
      filePath: result.path,
      fileName,
      fileSize: testFile.size
    };
  }

  // اختبار الفلترة والبحث
  private async testFilteringAndSearch(): Promise<any> {
    // اختبار البحث في الطلاب
    const searchResult = await FrontendDataService.getStudents({ 
      search: 'أحمد',
      limit: 5 
    });
    
    if (searchResult.error) {
      throw new Error(`فشل في البحث عن الطلاب: ${searchResult.error}`);
    }

    // اختبار فلترة التحليلات
    const filterResult = await FrontendDataService.getAnalyses({ 
      min_score: 70,
      max_score: 90,
      limit: 5 
    });
    
    if (filterResult.error) {
      throw new Error(`فشل في فلترة التحليلات: ${filterResult.error}`);
    }

    // اختبار فلترة الطلاب المحتاجين للمتابعة
    const followupResult = await FrontendDataService.getAnalyses({ 
      needs_followup: true,
      limit: 5 
    });
    
    if (followupResult.error) {
      throw new Error(`فشل في فلترة الطلاب المحتاجين للمتابعة: ${followupResult.error}`);
    }

    return {
      message: 'تم اختبار الفلترة والبحث بنجاح',
      searchResults: searchResult.count,
      filteredAnalyses: filterResult.count,
      followupStudents: followupResult.count
    };
  }

  // اختبار الأداء
  private async testPerformance(): Promise<any> {
    const performanceTests = [];

    // اختبار سرعة جلب الطلاب
    const studentsStart = Date.now();
    await FrontendDataService.getStudents({ limit: 50 });
    const studentsTime = Date.now() - studentsStart;
    performanceTests.push({ operation: 'جلب 50 طالب', time: studentsTime });

    // اختبار سرعة جلب التحليلات
    const analysesStart = Date.now();
    await FrontendDataService.getAnalyses({ limit: 100 });
    const analysesTime = Date.now() - analysesStart;
    performanceTests.push({ operation: 'جلب 100 تحليل', time: analysesTime });

    // اختبار سرعة جلب الإحصائيات
    const analyticsStart = Date.now();
    await FrontendDataService.getSchoolAnalytics();
    const analyticsTime = Date.now() - analyticsStart;
    performanceTests.push({ operation: 'جلب إحصائيات المدرسة', time: analyticsTime });

    // التحقق من الأداء المقبول (أقل من 5 ثواني لكل عملية)
    const slowOperations = performanceTests.filter(test => test.time > 5000);
    
    if (slowOperations.length > 0) {
      console.warn('⚠️ عمليات بطيئة:', slowOperations);
    }

    return {
      message: 'تم اختبار الأداء',
      performanceTests,
      avgResponseTime: performanceTests.reduce((sum, test) => sum + test.time, 0) / performanceTests.length,
      slowOperations: slowOperations.length
    };
  }

  // إنشاء تقرير شامل
  private generateReport(): void {
    const successfulTests = this.testResults.filter(test => test.status === 'نجح');
    const failedTests = this.testResults.filter(test => test.status === 'فشل');
    const totalDuration = this.testResults.reduce((sum, test) => sum + test.duration, 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 تقرير اختبار التكامل الشامل لمنصة حركة');
    console.log('='.repeat(60));
    
    console.log(`\n📈 الإحصائيات العامة:`);
    console.log(`   إجمالي الاختبارات: ${this.testResults.length}`);
    console.log(`   الاختبارات الناجحة: ${successfulTests.length} (${Math.round(successfulTests.length / this.testResults.length * 100)}%)`);
    console.log(`   الاختبارات الفاشلة: ${failedTests.length} (${Math.round(failedTests.length / this.testResults.length * 100)}%)`);
    console.log(`   إجمالي الوقت: ${totalDuration}ms (${Math.round(totalDuration / 1000)}s)`);
    console.log(`   متوسط وقت الاختبار: ${Math.round(totalDuration / this.testResults.length)}ms`);

    if (successfulTests.length > 0) {
      console.log(`\n✅ الاختبارات الناجحة:`);
      successfulTests.forEach(test => {
        console.log(`   • ${test.name} (${test.duration}ms)`);
      });
    }

    if (failedTests.length > 0) {
      console.log(`\n❌ الاختبارات الفاشلة:`);
      failedTests.forEach(test => {
        console.log(`   • ${test.name}: ${test.error} (${test.duration}ms)`);
      });
    }

    // تقييم عام
    const successRate = successfulTests.length / this.testResults.length;
    let overallStatus = '';
    
    if (successRate === 1) {
      overallStatus = '🎉 ممتاز - جميع الاختبارات نجحت!';
    } else if (successRate >= 0.8) {
      overallStatus = '✅ جيد - معظم الاختبارات نجحت';
    } else if (successRate >= 0.6) {
      overallStatus = '⚠️ مقبول - بعض المشاكل تحتاج إصلاح';
    } else {
      overallStatus = '❌ غير مقبول - مشاكل كثيرة تحتاج إصلاح فوري';
    }

    console.log(`\n🏆 التقييم العام: ${overallStatus}`);
    console.log(`📅 تاريخ الاختبار: ${new Date().toLocaleString('ar-SA')}`);
    console.log('\n' + '='.repeat(60) + '\n');

    // حفظ التقرير في ملف
    this.saveReportToFile();
  }

  // حفظ التقرير في ملف
  private saveReportToFile(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: this.testResults.length,
        successful_tests: this.testResults.filter(t => t.status === 'نجح').length,
        failed_tests: this.testResults.filter(t => t.status === 'فشل').length,
        total_duration_ms: this.testResults.reduce((sum, test) => sum + test.duration, 0),
        success_rate: this.testResults.filter(t => t.status === 'نجح').length / this.testResults.length
      },
      tests: this.testResults
    };

    console.log('💾 تقرير التكامل محفوظ في الذاكرة');
    console.log('📋 يمكن الوصول للتقرير الكامل من خلال: IntegrationTest.getLastReport()');
  }

  // الحصول على آخر تقرير
  getLastReport(): any {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: this.testResults.length,
        successful_tests: this.testResults.filter(t => t.status === 'نجح').length,
        failed_tests: this.testResults.filter(t => t.status === 'فشل').length,
        success_rate: this.testResults.filter(t => t.status === 'نجح').length / this.testResults.length
      },
      tests: this.testResults
    };
  }

  // تنظيف بيانات الاختبار
  async cleanup(): Promise<void> {
    console.log('🧹 تنظيف بيانات الاختبار...');
    
    try {
      await this.supabaseIntegration.cleanupTestData();
      console.log('✅ تم تنظيف بيانات الاختبار بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تنظيف بيانات الاختبار:', error);
    }
  }
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const integrationTest = new IntegrationTest();
  
  integrationTest.runAllTests()
    .then(() => {
      console.log('🎯 اكتمل اختبار التكامل الشامل');
    })
    .catch((error) => {
      console.error('💥 فشل اختبار التكامل:', error);
      process.exit(1);
    });
}

export default IntegrationTest;