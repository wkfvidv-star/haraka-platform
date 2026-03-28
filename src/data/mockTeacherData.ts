export interface TeacherStudent {
  id: string;
  name: string;
  level: string;
  className: string; // The specific class, e.g. "الأول ابتدائي - أ"
  progress: number; // 0-100
  points: number; // XP
  lastActivity: string;
  status: 'نشط' | 'متأخر' | 'خامل';
  weaknesses: string[];
  strengths: string[];
}

export interface TeacherVideo {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'pending' | 'reviewed';
}

const firstNames = ['أحمد', 'ياسين', 'فاطمة', 'عمر', 'سارة', 'مريم', 'يوسف', 'علي', 'خالد', 'أمير', 'ليلى', 'نور', 'طارق', 'زياد', 'سلمى', 'زكريا', 'رائد', 'وليد'];
const lastNames = ['محمود', 'علي', 'المختار', 'خالد', 'وليد', 'حسن', 'إبراهيم', 'سليمان', 'عبدالله', 'منصور', 'صالح', 'فاروق', 'الحسيني', 'سعيد'];

export const AVAILABLE_CLASSES = [
  'الأول إبتدائي - أ', 'الأول إبتدائي - ب',
  'الثاني إبتدائي - أ', 'الثالث إبتدائي - أ',
  'الأول متوسط - أ', 'الأول متوسط - ب',
  'الثاني متوسط - أ',
  'الأول ثانوي - علوم', 'الأول ثانوي - أداب'
];

const generateStudents = (count: number): TeacherStudent[] => {
  const students: TeacherStudent[] = [];
  for (let i = 1; i <= count; i++) {
    const isExcellent = Math.random() > 0.7;
    const isBad = !isExcellent && Math.random() > 0.8;
    
    // Generate logical data
    const progress = isExcellent ? Math.floor(Math.random() * 15) + 85 : isBad ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 40) + 40;
    const points = progress * (Math.floor(Math.random() * 20) + 10);
    const status = isExcellent ? 'نشط' : isBad ? 'متأخر' : Math.random() > 0.2 ? 'نشط' : 'خامل';
    
    const weaknesses = [];
    const strengths = [];
    
    if (isExcellent) {
      strengths.push(Math.random() > 0.5 ? 'سرعة' : 'قوة', Math.random() > 0.5 ? 'مرونة' : 'دقة');
    } else if (isBad) {
      weaknesses.push(Math.random() > 0.5 ? 'تركيز' : 'تأخر في التسليم', Math.random() > 0.5 ? 'توازن' : 'عدم التفاعل');
    } else {
      if (Math.random() > 0.5) strengths.push('استجابة');
      if (Math.random() > 0.5) weaknesses.push('توازن');
    }

    const assignedClass = AVAILABLE_CLASSES[i % AVAILABLE_CLASSES.length];
    
    students.push({
      id: i.toString(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      level: assignedClass.includes('إبتدائي') ? 'إبتدائي' : assignedClass.includes('متوسط') ? 'متوسط' : 'ثانوي',
      className: assignedClass,
      progress,
      points,
      lastActivity: isExcellent ? 'الآن' : isBad ? 'قبل أسبوع' : 'قبل يومين',
      status,
      weaknesses,
      strengths
    });
  }
  
  // Guarantee specific students
  students[0] = { id: '1', name: 'ياسين محمود', level: 'إبتدائي', className: 'الأول إبتدائي - أ', progress: 85, points: 1250, lastActivity: 'الآن', status: 'نشط', weaknesses: ['توازن'], strengths: ['سرعة', 'استجابة'] };
  students[1] = { id: '2', name: 'فاطمة علي', level: 'متوسط', className: 'الأول متوسط - أ', progress: 40, points: 420, lastActivity: 'قبل 3 أيام', status: 'متأخر', weaknesses: ['تأخر في التسليم'], strengths: ['دقة'] };
  students[2] = { id: '3', name: 'أمير طارق', level: 'ثانوي', className: 'الأول ثانوي - علوم', progress: 98, points: 3100, lastActivity: 'الآن', status: 'نشط', weaknesses: [], strengths: ['مرونة', 'قوة'] };
  
  return students;
};

// All simulated students in the district/school
export const allDistrictStudents: TeacherStudent[] = generateStudents(120);

export const teacherVideos: TeacherVideo[] = [
  { id: 'v1', studentId: '1', studentName: 'ياسين محمود', class: 'الأول إبتدائي - أ', date: 'اليوم، 10:30 ص', status: 'pending' },
  { id: 'v2', studentId: '2', studentName: 'فاطمة علي', class: 'الأول متوسط - أ', date: 'أمس، 14:15 م', status: 'pending' },
  { id: 'v3', studentId: '3', studentName: 'أمير طارق', class: 'الأول ثانوي - علوم', date: 'أمس، 09:00 ص', status: 'reviewed' },
];

export const getTeacherStats = (students: TeacherStudent[]) => {
  const totalStudents = students.length;
  // if no students, avoid division by zero
  if (totalStudents === 0) {
    return { totalStudents: 0, activeStudents: 0, inactiveStudents: 0, averageProgress: 0, pendingVideosCount: 0 };
  }

  const activeStudents = students.filter(s => s.status === 'نشط').length;
  const inactiveStudents = students.filter(s => s.status !== 'نشط').length;
  const averageProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / totalStudents);
  const pendingVideosCount = teacherVideos.filter(v => students.some(s => s.id === v.studentId && v.status === 'pending')).length;

  return {
    totalStudents,
    activeStudents,
    inactiveStudents,
    averageProgress,
    pendingVideosCount
  };
};
