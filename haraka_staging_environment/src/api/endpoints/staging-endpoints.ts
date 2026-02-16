// واجهات API التجريبية الآمنة - المرحلة 3ب
// Safe Staging API Endpoints - Phase 3B

import express, { Request, Response } from 'express';
import { STAGING_CONFIG, isStaging } from '@/config/staging';
import { DatabaseServiceV2 } from '@/services/database_v2';

const router = express.Router();

// التأكد من البيئة التجريبية
if (!isStaging()) {
  throw new Error('🚫 هذه الواجهات متاحة فقط في البيئة التجريبية');
}

// Middleware للتحقق من البيئة التجريبية
router.use((req: Request, res: Response, next) => {
  res.setHeader('X-Environment', 'staging');
  res.setHeader('X-Staging-Mode', 'true');
  res.setHeader('X-Version', STAGING_CONFIG.version);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 1. واجهة جلب التحليلات العامة للمدرسة
router.get('/school-analytics', async (req: Request, res: Response) => {
  try {
    console.log('📊 طلب جلب التحليلات العامة للمدرسة - البيئة التجريبية');

    const analytics = await DatabaseServiceV2.getSchoolAnalytics();
    const classPerformance = await DatabaseServiceV2.getClassPerformance();
    const studentsNeedingFollowup = await DatabaseServiceV2.getStudentsNeedingFollowup();

    const response = {
      success: true,
      staging: true,
      data: {
        schoolStats: analytics,
        classBreakdown: classPerformance,
        studentsNeedingFollowup: studentsNeedingFollowup.length,
        studentsAtRisk: studentsNeedingFollowup,
        lastUpdated: new Date().toISOString(),
        totalAnalyses: 1234,
        averagePerformance: analytics.avg_overall_score,
        improvementRate: analytics.monthly_growth
      },
      metadata: {
        environment: 'staging',
        mockData: true,
        generatedAt: new Date().toISOString()
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في جلب التحليلات العامة:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب التحليلات العامة',
      staging: true,
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
});

// 2. واجهة جلب تحليلات الصفوف
router.get('/class-analytics/:className?', async (req: Request, res: Response) => {
  try {
    const { className } = req.params;
    console.log(`📚 طلب تحليلات الصف: ${className || 'جميع الصفوف'}`);

    const classPerformance = await DatabaseServiceV2.getClassPerformance();
    
    let filteredData = classPerformance;
    if (className) {
      filteredData = classPerformance.filter(cls => 
        cls.className.includes(className) || 
        cls.className.toLowerCase().includes(className.toLowerCase())
      );
    }

    const response = {
      success: true,
      staging: true,
      data: {
        classes: filteredData,
        totalClasses: filteredData.length,
        averageClassPerformance: filteredData.reduce((sum, cls) => sum + cls.avgScore, 0) / filteredData.length,
        bestPerformingClass: filteredData.reduce((best, current) => 
          current.avgScore > best.avgScore ? current : best, filteredData[0]
        ),
        classesNeedingAttention: filteredData.filter(cls => cls.avgScore < 70).length
      },
      metadata: {
        environment: 'staging',
        requestedClass: className,
        mockData: true
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في جلب تحليلات الصفوف:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب تحليلات الصفوف',
      staging: true
    });
  }
});

// 3. واجهة جلب الطلاب المحتاجين للمتابعة
router.get('/students-at-risk', async (req: Request, res: Response) => {
  try {
    console.log('⚠️ طلب جلب الطلاب المحتاجين للمتابعة');

    const studentsAtRisk = await DatabaseServiceV2.getStudentsNeedingFollowup();
    const threshold = parseFloat(req.query.threshold as string) || 60;

    const filteredStudents = studentsAtRisk.filter(student => 
      student.overall_score < threshold
    );

    const response = {
      success: true,
      staging: true,
      data: {
        studentsAtRisk: filteredStudents,
        totalCount: filteredStudents.length,
        threshold,
        riskLevels: {
          critical: filteredStudents.filter(s => s.overall_score < 50).length,
          moderate: filteredStudents.filter(s => s.overall_score >= 50 && s.overall_score < 60).length,
          mild: filteredStudents.filter(s => s.overall_score >= 60 && s.overall_score < 70).length
        },
        recommendations: filteredStudents.map(student => ({
          studentId: student.student_id,
          studentName: student.student_name,
          currentScore: student.overall_score,
          recommendation: student.overall_score < 50 ? 
            'يحتاج تدخل عاجل ومتابعة يومية' :
            student.overall_score < 60 ?
            'يحتاج برنامج تحسين مكثف' :
            'يحتاج متابعة إضافية'
        }))
      },
      metadata: {
        environment: 'staging',
        generatedAt: new Date().toISOString(),
        mockData: true
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في جلب الطلاب المحتاجين للمتابعة:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب الطلاب المحتاجين للمتابعة',
      staging: true
    });
  }
});

// 4. واجهة تصدير التقارير
router.post('/export-report', async (req: Request, res: Response) => {
  try {
    const { format, reportType, dateRange } = req.body;
    console.log(`📄 طلب تصدير تقرير: ${reportType} بصيغة ${format}`);

    // محاكاة تصدير التقرير
    await new Promise(resolve => setTimeout(resolve, 2000)); // تأخير وهمي

    const mockReportData = {
      reportId: `staging_report_${Date.now()}`,
      reportType,
      format,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: {
        totalStudents: 456,
        totalAnalyses: 1234,
        averagePerformance: 74.2,
        studentsNeedingFollowup: 23,
        classBreakdown: await DatabaseServiceV2.getClassPerformance()
      }
    };

    const response = {
      success: true,
      staging: true,
      message: 'تم إنشاء التقرير بنجاح (وضع المحاكاة)',
      data: {
        reportId: mockReportData.reportId,
        downloadUrl: `/api/v2/staging/download/${mockReportData.reportId}`,
        format,
        size: '2.3 MB (وهمي)',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 ساعة
        mockData: mockReportData
      },
      metadata: {
        environment: 'staging',
        mockGeneration: true
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في تصدير التقرير:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تصدير التقرير',
      staging: true
    });
  }
});

// 5. واجهة الإشعارات التجريبية
router.get('/notifications', async (req: Request, res: Response) => {
  try {
    console.log('🔔 طلب جلب الإشعارات التجريبية');

    const mockNotifications = [
      {
        id: 1,
        type: 'student_at_risk',
        title: 'طالب يحتاج متابعة عاجلة',
        message: 'الطالب عبدالرحمن طارق حصل على نتيجة 58.1% في آخر تحليل',
        priority: 'high',
        studentId: 5,
        className: 'الصف الرابع أ',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // منذ ساعتين
        isRead: false,
        isStaging: true
      },
      {
        id: 2,
        type: 'new_analysis',
        title: 'تحليل جديد مكتمل',
        message: 'تم إكمال تحليل جديد للطالبة سارة أحمد - النتيجة: 84.4%',
        priority: 'medium',
        studentId: 2,
        className: 'الصف الخامس أ',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // منذ 4 ساعات
        isRead: false,
        isStaging: true
      },
      {
        id: 3,
        type: 'monthly_report',
        title: 'التقرير الشهري جاهز',
        message: 'تقرير شهر أكتوبر متاح للمراجعة - متوسط الأداء العام: 74.2%',
        priority: 'low',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // منذ يوم
        isRead: true,
        isStaging: true
      }
    ];

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    const response = {
      success: true,
      staging: true,
      data: {
        notifications: mockNotifications,
        unreadCount,
        totalCount: mockNotifications.length,
        lastChecked: new Date().toISOString()
      },
      metadata: {
        environment: 'staging',
        mockData: true
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في جلب الإشعارات:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في جلب الإشعارات',
      staging: true
    });
  }
});

// 6. واجهة تحديث حالة الإشعار
router.put('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`📖 تحديث حالة الإشعار ${id} إلى مقروء`);

    // محاكاة تحديث الحالة
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = {
      success: true,
      staging: true,
      message: 'تم تحديث حالة الإشعار بنجاح (وضع المحاكاة)',
      data: {
        notificationId: parseInt(id),
        isRead: true,
        readAt: new Date().toISOString()
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ خطأ في تحديث حالة الإشعار:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في تحديث حالة الإشعار',
      staging: true
    });
  }
});

// 7. واجهة فحص صحة النظام التجريبي
router.get('/health', async (req: Request, res: Response) => {
  try {
    const healthCheck = {
      status: 'healthy',
      environment: 'staging',
      version: STAGING_CONFIG.version,
      timestamp: new Date().toISOString(),
      services: {
        database: true,
        api: true,
        storage: true,
        notifications: true
      },
      performance: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        responseTime: '< 100ms'
      },
      features: {
        mockMode: STAGING_CONFIG.features.mockData,
        debugMode: STAGING_CONFIG.features.debugMode,
        stagingBanner: STAGING_CONFIG.features.stagingBanner
      }
    };

    res.json(healthCheck);

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'خطأ غير معروف',
      staging: true
    });
  }
});

// معالج الأخطاء
router.use((error: any, req: Request, res: Response, next: any) => {
  console.error('❌ خطأ في واجهات API التجريبية:', error);
  
  res.status(500).json({
    success: false,
    error: 'خطأ في الخادم التجريبي',
    message: error.message,
    staging: true,
    timestamp: new Date().toISOString()
  });
});

export default router;