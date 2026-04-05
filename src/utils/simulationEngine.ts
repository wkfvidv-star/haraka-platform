import { teacherDataService } from './teacherDataService';
import { parentDataService } from './parentDataService';
import { youthDataService } from './youthDataService';
import { auditService } from './auditService';
import { eventBus, EVENTS } from './eventBus';
import { v4 as uuidv4 } from 'uuid';

class SimulationEngine {
  /**
   * Execute Scenario: "يوم كامل في المدرسة والنادي" (A Full Day Simulation)
   */
  public async executeFullDayScenario() {
    console.log('SimulationEngine: Starting Full Day Scenario...');
    auditService.log('بدء محاكاة', 'تم تفعيل سيناريو "يوم كامل" لتوليد بيانات مترابطة', 'simulation');

    // 1. Setup Phase: Clear old mock data if needed
    // In a real simulation for demo, we might want to clear, but here we just add.

    // 2. Teacher Scenario: Create a Task and Evaluate
    const teacherData = teacherDataService.getData();
    if (teacherData.classes.length === 0) {
      teacherDataService.seedData(); // Ensure we have teacher data
    }
    const currentClass = teacherData.classes[0];
    const student = teacherData.students.find(s => s.classId === currentClass.id) || teacherData.students[0];
    
    auditService.log('مرحلة المعلم', `المعلم يفتح لوحة التحكم ويختار الصف ${currentClass.name}`, 'simulation');
    
    const taskId = uuidv4();
    const evaluationId = uuidv4();

    // Create Evaluation in Teacher Service
    teacherData.evaluations.unshift({
        id: evaluationId,
        taskId: taskId,
        studentId: student.id,
        status: 'reviewed',
        score: 85,
        teacherNotes: 'أداء ممتاز في وضعية التوازن، أحسنت يا بطل!',
        submissionDate: new Date().toISOString()
    });
    
    localStorage.setItem('haraka_teacher_data', JSON.stringify(teacherData));
    auditService.log('تقييم معلم', `تم تقييم الطالب ${student.name} بنتيجة 85%`, 'teacher', { postState: teacherData.evaluations[0] });

    // 3. Parent Scenario: Receive Notification and Report
    // (This is bridged by UnifiedDataService, but we simulate it here too for completeness)
    const children = parentDataService.getChildren();
    // Match simulated student to parent's child
    let child = children.find(c => c.name.includes(student.name.split(' ')[0]));
    if (!child) {
        child = parentDataService.addChild({ name: student.name, age: 12, grade: student.level });
    }

    const reports = parentDataService.getReports();
    reports.unshift({
        id: `r_sim_${Date.now()}`,
        from: 'الأستاذ محمد الصالح',
        fromRole: 'أستاذ',
        date: new Date().toISOString().split('T')[0],
        subject: 'تقييم الأداء اليومي',
        content: `تم تقييم أداء ${student.name} في اختبار التوازن. النتيجة: 85%. ملاحظة المعلم: أداء ممتاز!`,
        score: 85,
        read: false
    });
    localStorage.setItem('parent_data_reports', JSON.stringify(reports));
    
    // Update Child Stats
    child.xp += 850;
    child.performance.physical = Math.min(100, child.performance.physical + 5);
    localStorage.setItem('parent_data_children', JSON.stringify(children));
    
    auditService.log('استلام تقرير', `ولي الأمر يستلم تقريراً عن أداء ${student.name}`, 'parent');

    // 4. Community/Coach Scenario: Schedule Session
    const sessions = youthDataService.getSessions();
    sessions.unshift({
        id: `s_sim_${Date.now()}`,
        title: 'تدريب كرة القدم (مسائي)',
        coach: 'المدرب كريم بوعلام',
        time: '05:00 م',
        date: new Date().toISOString().split('T')[0],
        type: 'group',
        category: 'physical',
        status: 'confirmed',
        duration: '90 دقيقة'
    });
    localStorage.setItem(`haraka_youth_default_youth_sessions`, JSON.stringify(sessions));
    auditService.log('مرحلة النادي', 'المدرب يؤكد حصة التدريب المسائية للشاب', 'simulation');

    // 5. Admin Scenario: Aggregation
    auditService.log('تحديث الإدارة', 'النظام يحدث مؤشرات الأداء (KPIs) بناءً على النشاطات الجديدة', 'simulation');
    
    // Final Audit & Event Notification
    auditService.log('إكمال محاكاة', 'تم تنفيذ سيناريو اليوم الكامل بنجاح وجميع البيانات مترابطة', 'simulation');
    
    eventBus.emit(EVENTS.KPI_UPDATED);
    eventBus.emit(EVENTS.SIMULATION_STEP, { step: 'COMPLETED' });

    console.log('SimulationEngine: Scenario Completed.');
    return true;
  }
}

export const simulationEngine = new SimulationEngine();
