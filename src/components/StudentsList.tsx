import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function StudentsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('student_profiles_v2')
        .select('*');
      if (error) console.error(error);
      else setStudents(data);
    }
    loadData();
  }, []);

  return (
    <div>
      <h2>قائمة التلاميذ</h2>
      <ul>
        {students.map((s) => (
          <li key={s.student_id}>{s.student_name} - {s.class_name}</li>
        ))}
      </ul>
    </div>
  );
}
