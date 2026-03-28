export interface TeacherAssignment {
    id: string;
    title: string;
    descriptionLines: string[];
    teacherName: string;
    dueDate: string;
}

export const COACH_EXERCISES = [
    {
        id: 'ce-1',
        coachName: 'الأستاذ أحمد',
        exerciseName: 'القفز بين الخطوط',
        description: 'قم بالقفز بين خطين بأقصى سرعة لمدة 30 ثانية',
        rating: 4,
        note: 'حاول تحسين التوازن عند الهبوط وعدم الميل للأمام',
        completedAt: null as string | null,
    },
    {
        id: 'ce-2',
        coachName: 'الأستاذة فاطمة',
        exerciseName: 'تمرين الاستجابة الصوتية',
        description: 'عند سماع الصافرة، انتقل بسرعة 3 أمتار يساراً ثم عد',
        rating: null as number | null,
        note: 'تمرين جديد لمعالجة بطء رد الفعل الذي لاحظناه',
        completedAt: 'أمس',
    }
];

export const MOCK_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
    {
        id: 'assign-1',
        title: 'تمرين الجلوس والقيام (Squat)',
        descriptionLines: [
            'قف معتدلاً مع مباعدة القدمين بعرض الكتفين.',
            'انزل ببطء كأنك تجلس على كرسي وهمي.',
            'حافظ على ظهرك مستقيماً والركبتين خلف أصابع القدم.',
            'استمر لمدة 30 ثانية لتطوير القوة والمرونة.'
        ],
        teacherName: 'الكابتن أحمد',
        dueDate: 'اليوم'
    },
    {
        id: 'assign-2',
        title: 'القفز الجانبي (Agility)',
        descriptionLines: [
            'قف مع ضم القدمين ووضع اليدين على الخصر.',
            'اقفز بخفة إلى اليمين ثم بسرعة إلى اليسار.',
            'حافظ على مسافة القفز واستمر بالإيقاع السريع.',
            'سجل أداءك لمدة 15 ثانية للتقييم.'
        ],
        teacherName: 'الكابتن سارة',
        dueDate: 'غداً'
    }
];
