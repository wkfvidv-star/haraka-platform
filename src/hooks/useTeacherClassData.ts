import { useState, useEffect, useMemo } from 'react';
import { teacherDataService, TeacherDashboardData } from '@/services/teacherDataService';

export function useTeacherClassData() {
  const [data, setData] = useState<TeacherDashboardData>(teacherDataService.getData());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleDataChange = () => {
      setData({ ...teacherDataService.getData() });
    };

    window.addEventListener('teacherDataChanged', handleDataChange);
    return () => {
      window.removeEventListener('teacherDataChanged', handleDataChange);
    };
  }, []);

  const setActiveClassId = (classId: string | null) => {
    teacherDataService.setActiveClassId(classId);
  };

  const activeClass = useMemo(() => {
    return data.classes.find(c => c.id === data.activeClassId) || null;
  }, [data.classes, data.activeClassId]);

  const activeClassStudents = useMemo(() => {
    if (!data.activeClassId) return [];
    return data.students.filter(s => s.classId === data.activeClassId);
  }, [data.students, data.activeClassId]);

  const stats = useMemo(() => {
    const students = activeClassStudents;
    const totalStudents = students.length;
    
    if (totalStudents === 0) {
      return { totalStudents: 0, activeStudents: 0, inactiveStudents: 0, averageProgress: 0, pendingVideosCount: 0 };
    }

    const activeStudents = students.filter(s => s.status === 'نشط').length;
    const inactiveStudents = students.filter(s => s.status !== 'نشط').length;
    const averageProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / totalStudents);
    
    // For pending videos, we look at evaluations related to these students
    const studentIds = new Set(students.map(s => s.id));
    const pendingVideosCount = data.evaluations.filter(e => studentIds.has(e.studentId) && e.status === 'pending').length;

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      averageProgress,
      pendingVideosCount
    };
  }, [activeClassStudents, data.evaluations]);

  return {
    isLoaded,
    hasSetup: data.hasSetup,
    classes: data.classes,
    activeClassId: data.activeClassId,
    activeClass,
    students: data.students,
    evaluations: data.evaluations,
    activeClassStudents,
    stats,
    setActiveClassId,
    createClass: (name: string, level: string) => teacherDataService.createClass(name, level),
    seedData: () => teacherDataService.seedData()
  };
}
