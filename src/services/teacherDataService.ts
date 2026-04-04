import { v4 as uuidv4 } from 'uuid';

export interface TeacherClass {
  id: string;
  name: string;
  level: string;
  schoolId?: string;
  createdAt: string;
}

export interface TeacherStudent {
  id: string;
  classId: string;
  name: string;
  level: string;
  progress: number;
  points: number;
  lastActivity: string;
  status: 'نشط' | 'متأخر' | 'خامل';
  weaknesses: string[];
  strengths: string[];
  avatar?: string;
}

export interface TeacherTask {
  id: string;
  title: string;
  description: string;
  targetId: string; // classId or studentId
  targetType: 'class' | 'student';
  taskType: 'cognitive' | 'physical' | 'psychological';
  dueDate: string;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

export interface TeacherEvaluation {
  id: string;
  taskId: string;
  studentId: string;
  status: 'pending' | 'reviewed';
  score?: number;
  teacherNotes?: string;
  submissionDate: string;
}

export interface TeacherDashboardData {
  classes: TeacherClass[];
  students: TeacherStudent[];
  tasks: TeacherTask[];
  evaluations: TeacherEvaluation[];
  activeClassId: string | null;
  hasSetup: boolean;
}

const STORAGE_KEY = 'haraka_teacher_data';

const defaultData: TeacherDashboardData = {
  classes: [],
  students: [],
  tasks: [],
  evaluations: [],
  activeClassId: null,
  hasSetup: false,
};

class TeacherDataService {
  private data: TeacherDashboardData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): TeacherDashboardData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load teacher data', e);
    }
    return { ...defaultData };
  }

  private saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    // Dispatch a custom event so hooks can react to changes
    window.dispatchEvent(new Event('teacherDataChanged'));
  }

  public getData() {
    return this.data;
  }

  public setActiveClassId(classId: string | null) {
    this.data.activeClassId = classId;
    this.saveData();
  }

  public createClass(name: string, level: string) {
    const newClass: TeacherClass = {
      id: uuidv4(),
      name,
      level,
      createdAt: new Date().toISOString(),
    };
    this.data.classes.push(newClass);
    if (!this.data.activeClassId) {
      this.data.activeClassId = newClass.id;
    }
    this.data.hasSetup = true;
    this.saveData();
    return newClass;
  }

  public seedData() {
    const classId1 = uuidv4();
    const classId2 = uuidv4();

    this.data.classes = [
      { id: classId1, name: 'الأول إبتدائي - أ', level: 'ابتدائي', createdAt: new Date().toISOString() },
      { id: classId2, name: 'الثاني متوسط - ب', level: 'متوسط', createdAt: new Date().toISOString() },
    ];

    this.data.activeClassId = classId1;
    this.data.hasSetup = true;

    // Seed Students
    const firstNames = ['أحمد', 'ياسين', 'فاطمة', 'عمر', 'سارة', 'مريم', 'يوسف', 'علي', 'خالد', 'أمير'];
    const lastNames = ['محمود', 'علي', 'المختار', 'خالد', 'وليد'];
    
    this.data.students = [];
    
    // Class 1 Students
    for(let i=0; i<8; i++) {
      this.data.students.push({
        id: uuidv4(),
        classId: classId1,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        level: 'ابتدائي',
        progress: Math.floor(Math.random() * 40) + 50,
        points: Math.floor(Math.random() * 1000) + 200,
        lastActivity: 'الآن',
        status: Math.random() > 0.2 ? 'نشط' : 'متأخر',
        weaknesses: Math.random() > 0.5 ? ['توازن'] : [],
        strengths: ['سرعة', 'استجابة']
      });
    }

    // specific target
    this.data.students[0].name = 'ياسين محمود';
    this.data.students[0].progress = 95;
    this.data.students[0].status = 'نشط';

    // Class 2 Students
    for(let i=0; i<6; i++) {
        this.data.students.push({
          id: uuidv4(),
          classId: classId2,
          name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
          level: 'متوسط',
          progress: Math.floor(Math.random() * 40) + 40,
          points: Math.floor(Math.random() * 1000) + 200,
          lastActivity: 'أمس',
          status: Math.random() > 0.3 ? 'نشط' : 'متأخر',
          weaknesses: ['تأخر في التسليم'],
          strengths: ['قوة']
        });
    }

    // Seed Tasks & Evaluations
    const taskId1 = uuidv4();
    this.data.tasks = [
      {
        id: taskId1,
        title: 'اختبار التوازن والثبات',
        description: 'مهمة تحليل حركي باستخدام الكاميرا',
        targetId: classId1,
        targetType: 'class',
        taskType: 'physical',
        dueDate: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    ];

    this.data.evaluations = [
      {
        id: uuidv4(),
        taskId: taskId1,
        studentId: this.data.students[0].id,
        status: 'pending',
        submissionDate: new Date().toISOString()
      }
    ];

    this.saveData();
  }

  public clearData() {
    this.data = { ...defaultData };
    this.saveData();
  }
}

export const teacherDataService = new TeacherDataService();
