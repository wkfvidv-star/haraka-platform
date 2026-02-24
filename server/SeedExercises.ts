import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from frontend .env
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const exercises = [
    // Motor Exercises
    {
        title: 'توازن القطب الواحد',
        description: 'تدريب متقدم لتحسين التوازن الثابت وتقوية عضلات الكاحل والركبة.',
        category: 'motor',
        sub_category: 'Balance',
        difficulty: 'Intermediate',
        duration: '5 min',
        instructions: ['قف على قدم واحدة', 'حافظ على استقامة الظهر', 'اثبت لمدة 30 ثانية لكل قدم']
    },
    {
        title: 'الرشاقة السلمية',
        description: 'تحسين سرعة القدمين والتنسيق الحركي باستخدام سلم الرشاقة.',
        category: 'motor',
        sub_category: 'Agility',
        difficulty: 'Beginner',
        duration: '10 min',
        instructions: ['تحرك عبر السلم بخطوات سريعة', 'ارفع الركبتين عالياً', 'كرر 5 مرات']
    },
    {
        title: 'السرعة الانفجارية',
        description: 'تدريب على الانطلاق السريع لتطوير القوة الانفجارية في الساقين.',
        category: 'motor',
        sub_category: 'Speed',
        difficulty: 'Advanced',
        duration: '15 min',
        instructions: ['ابدأ من وضعية الاستعداد', 'انطلق بأقصى سرعة لمسافة 20 متر', 'ارتاح لمدة دقيقة وكرر']
    },
    {
        title: 'التوافق العضلي العصبي',
        description: 'تمرين يجمع بين حركات اليدين والقدمين لتحسين التنسيق العام.',
        category: 'motor',
        sub_category: 'Coordination',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['استخدم الكرة أثناء الحركة', 'مرر الكرة حول الخصر أثناء المشي', 'زد السرعة تدريجياً']
    },
    {
        title: 'قفز الحواجز المنخفضة',
        description: 'تطوير قوة القفز والتحكم في الهبوط الآمن.',
        category: 'motor',
        sub_category: 'Plyometrics',
        difficulty: 'Intermediate',
        duration: '12 min',
        instructions: ['اقفز فوق سلسلة من الحواجز المنخفضة', 'اهبط بنعومة على مشط القدم', 'حافظ على توازنك عند كل هبوط']
    },
    // Cognitive Exercises
    {
        title: 'تتبع الأهداف المتعددة',
        description: 'تمرين لزيادة سعة الانتباه وتتبع عدة عناصر متحركة في وقت واحد.',
        category: 'cognitive',
        sub_category: 'Attention',
        difficulty: 'Advanced',
        duration: '5 min',
        instructions: ['راقب العناصر المتحركة على الشاشة', 'حدد العناصر المطلوبة عند توقف الحركة', 'زد عدد العناصر تدريجياً']
    },
    {
        title: 'الذاكرة المكانية التكتيكية',
        description: 'حفظ مواقع اللاعبين وتوزيعهم في الملعب وإعادة تمثيلها.',
        category: 'cognitive',
        sub_category: 'Memory',
        difficulty: 'Intermediate',
        duration: '7 min',
        instructions: ['شاهد صورة لتوزيع اللاعبين لمدة 10 ثوانٍ', 'حاول تحديد مواقعهم على مخطط خالٍ', 'قارن إجابتك بالصورة الأصلية']
    },
    {
        title: 'سرعة معالجة المعلومات',
        description: 'الاستجابة لإشارات بصرية مختلفة بأفعال محددة في وقت قياسي.',
        category: 'cognitive',
        sub_category: 'Processing',
        difficulty: 'Beginner',
        duration: '4 min',
        instructions: ['اضغط على الزر الموافق للون الظاهر', 'حاول تقليل وقت الاستجابة', 'تجنب الأخطاء عند زيادة السرعة']
    },
    {
        title: 'اتخاذ القرار تحت الضغط',
        description: 'اختيار الخيار الأفضل في سيناريوهات رياضية معقدة ووقت محدود.',
        category: 'cognitive',
        sub_category: 'Decision Making',
        difficulty: 'Advanced',
        duration: '10 min',
        instructions: ['شاهد مقطع فيديو لهجمة رياضية', 'اختر التمريرة أو الحركة الأنسب فوراً', 'حلل قرارك مع المدرب']
    },
    {
        title: 'التعرف على الأنماط البصرية',
        description: 'اكتشف النمط التكتيكي المتكرر في تحركات الخصم.',
        category: 'cognitive',
        sub_category: 'Pattern Recognition',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['لاحظ تحركات الفريق الخصم', 'حدد النمط المتكرر في دفاعهم', 'اقترح طريقة لاختراق هذا النمط']
    },
    // Psychological Exercises
    {
        title: 'التنفس الصدري العميق',
        description: 'تقنية للتحكم في القلق وزيادة تدفق الأكسجين للدماغ.',
        category: 'psychological',
        sub_category: 'Emotional Regulation',
        difficulty: 'Beginner',
        duration: '5 min',
        instructions: ['استنشق بعمق من الأنف لمدة 4 ثوانٍ', 'احبس النفس لمدة 4 ثوانٍ', 'ازفر ببطء من الفم لمدة 6 ثوانٍ']
    },
    {
        title: 'التصور الذهني للأداء',
        description: 'بناء الثقة من خلال تخيل أداء الحركات الرياضية بامتياز.',
        category: 'psychological',
        sub_category: 'Confidence',
        difficulty: 'Intermediate',
        duration: '10 min',
        instructions: ['أغمض عينيك وتخيل نفسك في الملعب', 'شاهد نفسك تؤدي الحركة الصعبة بنجاح', 'اشعر بالفخر والنجاح المرتبط بالأداء']
    },
    {
        title: 'إدارة التوتر قبل المنافسة',
        description: 'تمارين استرخاء لتقليل التوتر العضلي والذهني قبل البطولات.',
        category: 'psychological',
        sub_category: 'Stress Management',
        difficulty: 'Advanced',
        duration: '15 min',
        instructions: ['قم بشد وإرخاء مجموعات عضلية معينة بالترتيب', 'ركز على الإحساس بالراحة بعد الإرخاء', 'استخدم عبارات تحفيزية إيجابية']
    },
    {
        title: 'التركيز الذهني الموجه',
        description: 'تثبيت الانتباه على نقطة معينة وتجاهل المشتتات الخارجية.',
        category: 'psychological',
        sub_category: 'Focus',
        difficulty: 'Intermediate',
        duration: '8 min',
        instructions: ['اختر نقطة ثابتة أمامك لتركيز النظر', 'ابعد أي فكرة مشتتة تعود لذهنك', 'استمر في التركيز لمدة دقيقتين متواصلتين']
    },
    {
        title: 'الحديث الذاتي الإيجابي',
        description: 'تحويل الأفكار السلبية إلى رسائل دعم قوية لتعزيز الإصرار.',
        category: 'psychological',
        sub_category: 'Resilience',
        difficulty: 'Beginner',
        duration: '5 min',
        instructions: ['حدد فكرة سلبية تراودك أثناء الفشل', 'استبدلها بعبارة ذهنبة إيجابية بأنك قادر على التعلم والمحاولة مرة أخرى', 'كرر العبارة بصوت مرتفع']
    },
    // Rehabilitation Exercises
    {
        title: 'إطالة عضلات خلف الفخذ',
        description: 'تحسين المرونة وتقليل خطر الإصابات العضلية في الساقين.',
        category: 'rehabilitation',
        sub_category: 'Flexibility',
        difficulty: 'Beginner',
        duration: '6 min',
        instructions: ['اجلس على الأرض مع مد الساقين', 'حاول لمس أصابع قدميك ببطء', 'اثبت في وضع الإطالة لمدة 20 ثانية']
    },
    {
        title: 'تقوية الكاحل بالرباط المطاطي',
        description: 'إعادة تأهيل مفصل الكاحل بعد الإصابات وزيادة استقراره.',
        category: 'rehabilitation',
        sub_category: 'Stability',
        difficulty: 'Intermediate',
        duration: '12 min',
        instructions: ['ثبت الرباط المطاطي حول قدمك', 'حرك قدمك للخارج والداخل عكس مقاومة الرباط', 'نفذ 3 مجموعات من 15 تكراراً']
    },
    {
        title: 'تحسين مدى حركة الكتف',
        description: 'تمارين لطيفة لزيادة ليونة مفصل الكتف وتخفيف الألم.',
        category: 'rehabilitation',
        sub_category: 'Mobility',
        difficulty: 'Beginner',
        duration: '10 min',
        instructions: ['قف ببحانب حائط وحرك أصابعك للأعلى عليه ببطء', 'توقف عند الشعور ببداية شد بسيط', 'كرر التمرين 10 مرات']
    },
    {
        title: 'التوازن العلاجي على وسادة هوائية',
        description: 'تحسين التوازن الحركي والتوافق بعد إصابات الركبة.',
        category: 'rehabilitation',
        sub_category: 'Neuromotor',
        difficulty: 'Advanced',
        duration: '15 min',
        instructions: ['قف على وسادة التوازن الهوائية', 'حاول الحفاظ على ثبات جسمك دون مساعدة', 'استمر لمدة دقيقة لكل قدم']
    },
    {
        title: 'تقوية عضلات الظهر السفلي',
        description: 'تمارين لتقوية الجذع وحماية العمود الفقري.',
        category: 'rehabilitation',
        sub_category: 'Strength',
        difficulty: 'Intermediate',
        duration: '10 min',
        instructions: ['استلقِ على بطنك وارفع الصدر قليلاً عن الأرض', 'حافظ على استقامة الرقبة', 'كرر التمرين 12 مرة لثلاث مجموعات']
    }
];

async function seed() {
    console.log('Starting seeding exercises...');

    // Clear existing if any (optional, but keep it production safe)
    // const { error: deleteError } = await supabase.from('exercises').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { data, error } = await supabase
        .from('exercises')
        .insert(exercises);

    if (error) {
        console.error('Error seeding exercises:', error);
    } else {
        console.log('Successfully seeded 20 exercises!');
    }
}

seed();
