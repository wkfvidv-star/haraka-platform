import { useState, useEffect, useMemo } from 'react';
import { allDistrictStudents, TeacherStudent, getTeacherStats } from '@/data/mockTeacherData';

export interface TeacherSettings {
  schoolName: string;
  classes: string[];
  skipped?: boolean;
}

export function useTeacherClassData() {
  const [settings, setSettings] = useState<TeacherSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('haraka_teacher_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse teacher settings', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveSettings = (newSettings: TeacherSettings) => {
    localStorage.setItem('haraka_teacher_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  // Filter students: if no classes chosen or skipped, return all defaults to avoid blank screens.
  const filteredStudents = useMemo(() => {
    if (!settings || !settings.classes || settings.classes.length === 0 || settings.skipped) {
      return allDistrictStudents.slice(0, 34); // Default to seeing 34 students
    }
    return allDistrictStudents.filter(s => settings.classes.includes(s.className));
  }, [settings]);

  const stats = useMemo(() => {
    return getTeacherStats(filteredStudents);
  }, [filteredStudents]);

  return {
    settings,
    isLoaded,
    saveSettings,
    students: filteredStudents,
    stats,
    hasSetup: !!settings && (settings.classes.length > 0 || settings.skipped === true)
  };
}
