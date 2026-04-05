import { parentDataService, Child } from './parentDataService';
import { teacherDataService, TeacherStudent, TeacherEvaluation } from './teacherDataService';
import { youthDataService, YouthSession, YouthTask } from './youthDataService';
import { auditService } from './auditService';
import { eventBus, EVENTS } from './eventBus';
import { AIService } from './AIService';

export interface SystemKPIs {
  totalUsers: number;
  activeStudents: number;
  averagePerformance: number;
  improvementRate: number;
  teacherEngagement: number;
  completedTasks: number;
}

export interface Insight {
  id: string;
  type: 'recommendation' | 'alert' | 'success';
  targetRole: string;
  title: string;
  content: string;
  action?: string;
}

class UnifiedDataService {
  /**
   * Core Integration: Link Teacher evaluation to Student progress and Parent report
   */
  public async syncEvaluation(evaluation: TeacherEvaluation, studentName: string) {
    // 1. Log to Audit
    auditService.log(
      'مزامنة تقييم', 
      `تمت مزامنة تقييم الطالب ${studentName} مع لوحة ولي الأمر`, 
      'sync',
      { postState: evaluation }
    );

    // 2. Add to Parent Reports
    const children = parentDataService.getChildren();
    // In a real system we'd use studentId, here we match by name for simulation
    const child = children.find(c => c.name === studentName) || children[0];
    
    if (child) {
      // Add report to parent dashboard
      const report = {
        id: `r_sync_${Date.now()}`,
        from: 'الأستاذ (عبر النظام)',
        fromRole: 'أستاذ' as const,
        date: new Date().toISOString().split('T')[0],
        subject: `تقييم جديد: ${evaluation.teacherNotes?.substring(0, 20) || 'تحليل أداء'}`,
        content: evaluation.teacherNotes || 'تم تقييم أداء الطالب في المهمة المحددة.',
        score: evaluation.score,
        read: false
      };
      
      // We need to add a method to parentDataService to add a report, 
      // or we just modify the localStorage directly if we don't want to change parentDataService too much
      const reports = parentDataService.getReports();
      reports.unshift(report);
      localStorage.setItem('parent_data_reports', JSON.stringify(reports));
      
      // Update Child stats
      if (evaluation.score) {
        child.xp += evaluation.score * 10;
        child.performance.cognitive = Math.min(100, child.performance.cognitive + 2);
        localStorage.setItem('parent_data_children', JSON.stringify(children));
      }

      // Notify UI
      eventBus.emit(EVENTS.EVALUATION_CREATED, { childId: child.id, evaluation });
    }
  }

  /**
   * Decision Intelligence: Generate insights based on current data
   */
  public getInsights(role: string): Insight[] {
    const insights: Insight[] = [];
    
    if (role === 'teacher') {
      const students = teacherDataService.getData().students;
      const lagging = students.filter(s => s.progress < 70);
      if (lagging.length > 0) {
        insights.push({
          id: 'i1',
          type: 'alert',
          targetRole: 'teacher',
          title: 'تنبيه: انخفاض أداء',
          content: `هناك ${lagging.length} طلاب سجلوا تقدماً أقل من 70%. ينصح بمراجعة تمارين التوازن لهم.`
        });
      }
    }

    if (role === 'admin') {
      insights.push({
        id: 'i2',
        type: 'recommendation',
        targetRole: 'admin',
        title: 'فرصة تحسين',
        content: 'أداء القسم "الأول إبتدائي - أ" في الأنشطة المعرفية متفوق بنسبة 15% عن المتوسط. يمكن تعميم تجربتهم.'
      });
    }

    return insights;
  }

  /**
   * KPI Engine: Calculate institutional metrics
   */
  public getKPIs(): SystemKPIs {
    const teacherData = teacherDataService.getData();
    const parentData = parentDataService.getChildren();
    
    const totalStudents = teacherData.students.length;
    const avgProgress = totalStudents > 0 
      ? teacherData.students.reduce((acc, s) => acc + s.progress, 0) / totalStudents 
      : 85;

    return {
      totalUsers: totalStudents + parentData.length + 5, // Mock totals
      activeStudents: teacherData.students.filter(s => s.status === 'نشط').length,
      averagePerformance: Math.round(avgProgress),
      improvementRate: 12.5, // Mock logic: compare to last month
      teacherEngagement: 94,
      completedTasks: teacherData.evaluations.length + 15
    };
  }

  /**
   * Comparison Logic: Compare classes or groups
   */
  public getClassComparison() {
    const teacherData = teacherDataService.getData();
    return teacherData.classes.map(c => {
      const classStudents = teacherData.students.filter(s => s.classId === c.id);
      const avg = classStudents.length > 0 
        ? classStudents.reduce((acc, s) => acc + s.progress, 0) / classStudents.length 
        : 0;
      return {
        name: c.name,
        performance: Math.round(avg),
        activity: Math.round(avg * 0.8)
      };
    });
  }
}

export const unifiedDataService = new UnifiedDataService();
