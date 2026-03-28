import prisma from './prisma/client.js';

const exercises = [
    // Motor Exercises
    {
        title: 'توازن القطب الواحد',
        description: 'تدريب متقدم لتحسين التوازن الثابت وتقوية عضلات الكاحل والركبة.',
        category: 'motor',
        subCategory: 'Balance',
        difficulty: 'Intermediate',
        duration: '5 min',
        instructions: ['قف على قدم واحدة', 'حافظ على استقامة الظهر', 'اثبت لمدة 30 ثانية لكل قدم']
    },
    {
        title: 'الرشاقة السلمية',
        description: 'تحسين سرعة القدمين والتنسيق الحركي باستخدام سلم الرشاقة.',
        category: 'motor',
        subCategory: 'Agility',
        difficulty: 'Beginner',
        duration: '10 min',
        instructions: ['تحرك عبر السلم بخطوات سريعة', 'ارفع الركبتين عالياً', 'كرر 5 مرات']
    },
    {
        title: 'السرعة الانفجارية',
        description: 'تدريب على الانطلاق السريع لتطوير القوة الانفجارية في الساقين.',
        category: 'motor',
        subCategory: 'Speed',
        difficulty: 'Advanced',
        duration: '15 min',
        instructions: ['ابدأ من وضعية الاستعداد', 'انطلق بأقصى سرعة لمسافة 20 متر', 'ارتاح لمدة دقيقة وكرر']
    },
    {
        title: 'التوافق العضلي العصبي',
        description: 'تمرين يجمع بين حركات اليدين والقدمين لتحسين التنسيق العام.',
        category: 'motor',
        subCategory: 'Coordination',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['استخدم الكرة أثناء الحركة', 'مرر الكرة حول الخصر أثناء المشي', 'زد السرعة تدريجياً']
    },
    {
        title: 'قفز الحواجز المنخفضة',
        description: 'تطوير قوة القفز والتحكم في الهبوط الآمن.',
        category: 'motor',
        subCategory: 'Plyometrics',
        difficulty: 'Intermediate',
        duration: '12 min',
        instructions: ['اقفز فوق سلسلة من الحواجز المنخفضة', 'اهبط بنعومة على مشط القدم', 'حافظ على توازنك عند كل هبوط']
    },
    // Cognitive Exercises
    {
        title: 'تتبع الأهداف المتعددة',
        description: 'تمرين لزيادة سعة الانتباه وتتبع عدة عناصر متحركة في وقت واحد.',
        category: 'cognitive',
        subCategory: 'Attention',
        difficulty: 'Advanced',
        duration: '5 min',
        instructions: ['راقب العناصر المتحركة على الشاشة', 'حدد العناصر المطلوبة عند توقف الحركة', 'زد عدد العناصر تدريجياً']
    },
    {
        title: 'الذاكرة المكانية التكتيكية',
        description: 'حفظ مواقع اللاعبين وتوزيعهم في الملعب وإعادة تمثيلها.',
        category: 'cognitive',
        subCategory: 'Memory',
        difficulty: 'Intermediate',
        duration: '7 min',
        instructions: ['شاهد صورة لتوزيع اللاعبين لمدة 10 ثوانٍ', 'حاول تحديد مواقعهم على مخطط خالٍ', 'قارن إجابتك بالصورة الأصلية']
    },
    {
        title: 'سرعة معالجة المعلومات',
        description: 'الاستجابة لإشارات بصرية مختلفة بأفعال محددة في وقت قياسي.',
        category: 'cognitive',
        subCategory: 'Processing',
        difficulty: 'Beginner',
        duration: '4 min',
        instructions: ['اضغط على الزر الموافق للون الظاهر', 'حاول تقليل وقت الاستجابة', 'تجنب الأخطاء عند زيادة السرعة']
    },
    {
        title: 'اتخاذ القرار تحت الضغط',
        description: 'اختيار الخيار الأفضل في سيناريوهات رياضية معقدة ووقت محدود.',
        category: 'cognitive',
        subCategory: 'Decision Making',
        difficulty: 'Advanced',
        duration: '10 min',
        instructions: ['شاهد مقطع فيديو لهجمة رياضية', 'اختر التمريرة أو الحركة الأنسب فوراً', 'حلل قرارك مع المدرب']
    },
    {
        title: 'التعرف على الأنماط البصرية',
        description: 'اكتشف النمط التكتيكي المتكرر في تحركات الخصم.',
        category: 'cognitive',
        subCategory: 'Pattern Recognition',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['لاحظ تحركات الفريق الخصم', 'حدد النمط المتكرر في دفاعهم', 'اقترح طريقة لاختراق هذا النمط']
    },
    // Psychological Exercises
    {
        title: 'التنفس الصدري العميق',
        description: 'تقنية للتحكم في القلق وزيادة تدفق الأكسجين للدماغ.',
        category: 'psychological',
        subCategory: 'Emotional Regulation',
        difficulty: 'Beginner',
        duration: '5 min',
        instructions: ['استنشق بعمق من الأنف لمدة 4 ثوانٍ', 'احبس النفس لمدة 4 ثوانٍ', 'azfer bbot\' min al-fam limiddat 6 tawanin']
    },
    {
        title: 'التصور الذهني للأداء',
        description: 'بناء الثقة من خلال تخيل أداء الحركات الرياضية بامتياز.',
        category: 'psychological',
        subCategory: 'Confidence',
        difficulty: 'Intermediate',
        duration: '10 min',
        instructions: ['أغمض عينيك وتخيل نفسك في الملعب', 'شاهد نفسك تؤدي الحركة الصعبة بنجاح', 'ash\'ur bil-fakhr wal-najah al-murtabit bil-ada\'']
    },
    {
        title: 'إدارة التوتر قبل المنافسة',
        description: 'تمارين استرخاء لتقليل التوتر العضلي والذهني قبل البطولات.',
        category: 'psychological',
        subCategory: 'Stress Management',
        difficulty: 'Advanced',
        duration: '15 min',
        instructions: ['قم بشد وإرخاء مجموعات عضلية معينة بالترتيب', 'ركز على الإحساس بالراحة بعد الإرخاء', 'astakhdim \'ibarat tahfiziyah ijjabiyah']
    },
    {
        title: 'التركيز الذهني الموجه',
        description: 'تثبيت الانتباه على نقطة معينة وتجاهل المشتتات الخارجية.',
        category: 'psychological',
        subCategory: 'Focus',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['اختر نقطة ثابتة أمامك لتركيز النظر', 'ab\'id ayy fikrah mushtatitah ta\'ud lizihnik', 'astamir fī al-tarkīz limiddat daqīqatayn mutawāṣilatayn']
    },
    {
        title: 'الحديث الذاتي الإيجابي',
        description: 'تحويل الأفكار السلبية إلى رسائل دعم قوية لتعزيز الإصرار.',
        category: 'psychological',
        subCategory: 'Resilience',
        difficulty: 'Beginner',
        duration: '5 min',
        instructions: ['haddid fikrah salbiyah tarawuduk athna\' al-fashal', 'astabdilha bi-\'ibarab zihniyah ijjabiyah bi-\'annak qadir \'ala al-ta\'alum wal-muhawalah marrah ukhra', 'karrir al-\'ibarah bisawt murtafi\'']
    },
    // Rehabilitation Exercises
    {
        title: 'إطالة عضلات خلف الفخذ',
        description: 'تحسين المرونة وتقليل خطر الإصابات العضلية في الساقين.',
        category: 'rehabilitation',
        subCategory: 'Flexibility',
        difficulty: 'Beginner',
        duration: '6 min',
        instructions: ['ajlis \'ala al-ard ma\' madd al-saqin', 'hawil lams asabi\' qadamik bbot\'', 'itbit fi wad\' al-italah limiddat 20 thaniyah']
    }
];

async function seed() {
    console.log('Starting seeding exercises...');
    try {
        const count = await prisma.exercise.count();
        if (count > 0) {
            console.log('Exercises already exist. Skipping seed.');
            process.exit(0);
        }

        for (const ex of exercises) {
            await prisma.exercise.create({
                data: ex
            });
        }
        console.log(`Successfully seeded ${exercises.length} exercises!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding exercises:', error);
        process.exit(1);
    }
}

seed();
