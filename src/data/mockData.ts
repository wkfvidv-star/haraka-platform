import { Trophy, Users, Star, MapPin, Calendar, Award } from 'lucide-react';

export const sportsClubs = [
    {
        id: 1,
        name: 'نادي الأبطال للسباحة',
        category: 'سباحة',
        rating: 4.8,
        members: 120,
        location: 'المركز الرياضي البلدي',
        image: '/images/clubs/swimming.jpg',
        description: 'تدريبات سباحة احترافية لجميع الأعمار',
        nextSession: 'اليوم، 16:00'
    },
    {
        id: 2,
        name: 'أكاديمية كرة القدم للمواهب',
        category: 'كرة قدم',
        rating: 4.9,
        members: 250,
        location: 'ملعب الشهداء',
        image: '/images/clubs/football.jpg',
        description: 'تطوير المهارات الكروية واكتشاف المواهب',
        nextSession: 'غداً، 17:30'
    },
    {
        id: 3,
        name: 'نادي المستقبل للتنس',
        category: 'تنس',
        rating: 4.7,
        members: 85,
        location: 'مجمع التنس الولائي',
        image: '/images/clubs/tennis.jpg',
        description: 'تعليم التنس من المبتدئين إلى المحترفين',
        nextSession: 'الأربعاء، 15:00'
    },
    {
        id: 4,
        name: 'صالة القوة واللياقة',
        category: 'لياقة بدنية',
        rating: 4.6,
        members: 300,
        location: 'وسط المدينة',
        image: '/images/clubs/fitness.jpg',
        description: 'أحدث المعدات الرياضية ومدربين معتمدين',
        nextSession: 'مفتوح الآن'
    }
];

export const partners = [
    {
        id: 1,
        name: 'Ooredoo',
        type: 'راعي رسمي',
        logo: '/images/partners/ooredoo.png',
        description: 'شريك التكنولوجيا والاتصالات',
        offer: 'خصم 50% على باقات الإنترنت للطلاب'
    },
    {
        id: 2,
        name: 'Decathlon',
        type: 'شريك رياضي',
        logo: '/images/partners/decathlon.png',
        description: 'تجهيزات رياضية عالية الجودة',
        offer: 'قسيمة شرائية بقيمة 2000 دج'
    },
    {
        id: 3,
        name: 'Ramy Food',
        type: 'شريك تغذية',
        logo: '/images/partners/ramy.png',
        description: 'مشروبات وعصائر صحية',
        offer: 'مشروب طاقة مجاني بعد كل تمرين'
    },
    {
        id: 4,
        name: 'Soummam',
        type: 'شريك صحي',
        logo: '/images/partners/soummam.png',
        description: 'منتجات ألبان صحية للرياضيين',
        offer: 'باقة منتجات بروتينية شهرية'
    }
];

export const leaderboardData = {
    class: [
        { id: 'user-2', rank: 1, name: 'أحمد محمد', points: 2800, level: 13, avatar: '/avatars/boy-1.png' },
        { id: 'user-1', rank: 2, name: 'أنت', points: 2450, level: 12, avatar: '/avatars/boy-2.png' },
        { id: 'user-3', rank: 3, name: 'سارة علي', points: 2300, level: 11, avatar: '/avatars/girl-1.png' },
        { id: 'user-4', rank: 4, name: 'عمر خالد', points: 2100, level: 11, avatar: '/avatars/boy-3.png' },
        { id: 'user-5', rank: 5, name: 'ليلى حسن', points: 1950, level: 10, avatar: '/avatars/girl-2.png' },
    ],
    school: [
        { id: 'user-10', rank: 1, name: 'ياسين براهيمي', points: 5400, level: 20, avatar: '/avatars/boy-4.png' },
        { id: 'user-11', rank: 2, name: 'فاطمة الزهراء', points: 5100, level: 19, avatar: '/avatars/girl-3.png' },
        { id: 'user-1', rank: 15, name: 'أنت', points: 2450, level: 12, avatar: '/avatars/boy-2.png' },
    ],
    global: [
        { id: 'user-100', rank: 1, name: 'رياض محرز', points: 15000, level: 50, avatar: '/avatars/pro-1.png' },
        { id: 'user-1', rank: 1240, name: 'أنت', points: 2450, level: 12, avatar: '/avatars/boy-2.png' },
    ]
};

export const rewardsData = [
    {
        id: 'r1',
        name: 'شعار النسر الذهبي',
        description: 'شعار مميز يظهر بجانب اسمك',
        cost: 500,
        category: 'avatar',
        unlocked: true,
        purchased: false,
        image: '🦅'
    },
    {
        id: 'r2',
        name: 'ثيم الوضع المظلم النيوني',
        description: 'تغيير ألوان التطبيق إلى ألوان النيون',
        cost: 1000,
        category: 'theme',
        unlocked: true,
        purchased: false,
        image: '🎨'
    },
    {
        id: 'r3',
        name: 'خصم 20% في Decathlon',
        description: 'قسيمة خصم صالحة لمدة شهر',
        cost: 2500,
        category: 'real-world',
        unlocked: false,
        purchased: false,
        image: '🏷️'
    },
    {
        id: 'r4',
        name: 'حزمة الأفاتار الرياضي',
        description: 'مجموعة صور رمزية رياضية حصرية',
        cost: 300,
        category: 'avatar',
        unlocked: true,
        purchased: true,
        image: '🏃'
    }
];
