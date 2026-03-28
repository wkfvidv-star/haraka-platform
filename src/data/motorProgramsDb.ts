import { ExerciseStage } from '@/components/training/InteractiveTrainingPlayer';

type CustomExerciseStage = Omit<ExerciseStage, 'id'>;

export const MOTOR_PROGRAMS_DB: Record<string, CustomExerciseStage[]> = {
    response_speed: [
        {
            name: "المجموعة الأولى: سرعة الاستجابة الحركية ⚡",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070",
        },
        {
            name: "الاستجابة متعددة المحفزات",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1566241134883-13eb2393a3f5?q=80&w=2099",
            description: [
                "انتبه جيداً… القرار الصحيح في الوقت المناسب هو الفرق 👀",
                "الأحمر → اضغط يمين | الأخضر → اضغط يسار | السهم ↑ → اضغط أعلى",
                "القواعد تُعرض في البداية ثم تختفي. تبدأ الإشارات بالظهور بسرعة متزايدة.",
                "يجب عليك الاستجابة فوراً وبدون خطأ."
            ],
            motivation: "يميز بين الشخص العادي وصاحب القرار السريع (مهم في الرياضة والقيادة) 🔥",
        },
        {
            name: "الاستجابة الاتجاهية السريعة",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069",
            description: [
                "لا تفكر… استجب فوراً ⚡",
                "يظهر سهم بشكل مفاجئ. عليك الضغط في نفس الاتجاه.",
                "السرعة تزداد تدريجياً. أحياناً يظهر سهم مضلل لاختبار تركيزك.",
            ],
            motivation: "زمن الاستجابة ونسبة الخطأ يحددان مهارتك الحقيقية 🎯",
        }
    ],
    control_accuracy: [
        {
            name: "المجموعة الثانية: التحكم الحركي والدقة 🎯",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070",
        },
        {
            name: "التحكم الدقيق في المسار",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070",
            description: [
                "تحكم في حركتك… كل انحراف يُحسب 🎯",
                "يظهر مسار ضيق ومتعرج، عليك تحريك مؤشر داخله.",
                "أي خروج يُسجل خطأ. السرعة تزيد تدريجياً، مع وجود اهتزازات صناعية مستفزة.",
            ],
            motivation: "يكشف التحكم العصبي الدقيق (مهم للرياضيين المحترفين) 🔥",
        },
        {
            name: "التحكم البطيء المتقدم",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999",
            description: [
                "البطء أصعب من السرعة… جرّب 👇",
                "حرك المؤشر ببطء شديد نحو هدف. ممنوع الارتعاش أو التوقف المفاجئ.",
                "كل اهتزاز يُحسب، ويقيم هذا التمرين ثبات الحركة والتحكم العصبي الحقيقي."
            ],
            motivation: "الجودة العالية تحتاج إلى هدوء تام وقوة عصبية 🧠",
        }
    ],
    advanced_balance: [
        {
            name: "المجموعة الثالثة: التوازن الحركي المتقدم ⚖️",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020",
        },
        {
            name: "الثبات تحت التشويش",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
            description: [
                "حافظ على توازنك… مهما حدث ⚖️",
                "مؤشر في منتصف دائرة. تظهر اهتزازات وتأثيرات بصرية مفاجئة.",
                "عليك إبقاؤه في المركز. زيادة شدة التشويش وتغييرات الاتجاه تزيد التحدي."
            ],
            motivation: "مدة الثبات وقوة الانحراف تحدد مدى استقرارك الداخلي 🛡️",
        },
        {
            name: "التوازن الديناميكي التفاعلي",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2074",
            description: [
                "الهدف يتحرك بسرعة... يجب أن توازن نفسك معه باستمرار.",
                "تتغير وتيرة الحركة بشكل عشوائي ومباغت. الهروب ليس خياراً.",
            ],
            motivation: "التوازن المتحرك هو مفتاح السيطرة في المواقف المفاجئة ⚡",
        }
    ],
    agility_change: [
        {
            name: "المجموعة الرابعة: الرشاقة والتغيير السريع 🌀",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1599058917212-97d150016a54?q=80&w=2070",
        },
        {
            name: "التنقل بين الأهداف المتغيرة",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1925",
            description: [
                "تحرك بسرعة… الهدف يتغير!",
                "تظهر عدة أهداف، والهدف الصحيح يتغير فجأة.",
                "عليك الانتقال السريع وتخطي الأهداف الخاطئة بأعلى سرعة اختيار ممكنة."
            ],
            motivation: "دقة الاختيار وسرعة الانتقال تكشف الموهبة الحركية الصافية 🌪️",
        },
        {
            name: "تفادي العوائق التفاعلي",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2069",
            description: [
                "تتحرك داخل مساحة محددة وتقفز. تظهر عوائق افتراضية فجأة في طريقك.",
                "يجب تفاديها بسرعة وتغيير وضعية جسمك في أجزاء من الثانية."
            ],
            motivation: "أعظم الرياضيين هم الأسرع في الهروب من المأزق 🚀",
        }
    ],
    advanced_coordination: [
        {
            name: "المجموعة الخامسة: التناسق الحركي المتقدم 🧠",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1566241134883-13eb2393a3f5?q=80&w=2099",
        },
        {
            name: "التنسيق بين اليدين",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999",
            description: [
                "هل تستطيع التحكم بكلتا يديك ببراعة مطلقة؟ 🤝",
                "كل يد تتحكم في مؤشر، وكل مؤشر له مسار مختلف ومعاكس تماماً للآخر.",
                "يجب التحكم بهما معاً بدون إبطاء أحدهما على حساب الآخر."
            ],
            motivation: "التحكم المزدوج يعزز الاتصال العصبي القوي بين نصفي الدماغ 🧠⚡",
        },
        {
            name: "التسلسل الحركي المعقد",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
            description: [
                "يظهر تسلسل حركات (يمين، فوق، دوران، يسار).",
                "يختفي فجأة. يطلب منك إعادة تنفيذه بنفس السرعة القصوى بالترتيب العكسي أو الطردي."
            ],
            motivation: "الذاكرة العضلية المرتبطة بالتناسق هي سر عبقرية الرياضيين 🏅",
        }
    ],
    motor_anticipation: [
        {
            name: "المجموعة السادسة: التوقع الحركي 👁️",
            durationSeconds: 20,
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020",
        },
        {
            name: "التتبع التنبؤي",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070",
            description: [
                "لا تتبع فقط… توقّع 👁️",
                "هدف يتحرك بسرعة شديدة نحو زاوية معينة، ويختفي فجأة.",
                "وفقاً لسرعته ومساره، اضغط في المكان الذي تتوقع ظهوره فيه."
            ],
            motivation: "هذا التمرين بالذات يكشف المواهب الرياضية الفائقة بشكل دراماتيكي 🔥",
        },
        {
            name: "توقع المسار الشبح",
            durationSeconds: 120,
            imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070",
            description: [
                "مسار معقد غير مكتمل، يظهر ويتلاشى بسرعة.",
                "أكمل المسار المعقد ذهنياً ثم أشر إلى النقطة النهائية الصحيحة متجاهلاً الأفخاخ المشتتة."
            ],
            motivation: "سرعة التحليل ودقة التوقع هما الحاسة السادسة لموهبتك 👁️✨",
        }
    ],
    strength: [
        { name: "تنمية القوة البدنية 💪", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070" },
        { name: "تمرين الضغط الأرضي (Push-ups)", durationSeconds: 45, description: ["انزل بجسمك ببطء مستخدماً ذراعيك.", "حافظ على استقامة ظهرك."], motivation: "القوة تُبنى بالصبر وعدم الاستسلام!", imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070" },
        { name: "تمرين القرفصاء (Squats)", durationSeconds: 45, description: ["انزل وكأنك تجلس على كرسي وهمي."], motivation: "استمر! العضلات تستجيب للجهد المستمر.", imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069" },
        { name: "تمرين الثبات الأمامي (Plank)", durationSeconds: 60, description: ["استند على ساعديك وأصابع قدميك.", "شد عضلات بطنك قدر الإمكان."], motivation: "الصلابة تأتي من الكور!", imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=2070" }
    ],
    endurance: [
        { name: "تنمية التحمل التنفسي 🫁", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2069" },
        { name: "الركض في المكان", durationSeconds: 90, description: ["ارفع ركبتيك بالتبادل بأسرع ما يمكن.", "تنفس بعمق وبشكل منتظم."], motivation: "رئتاك تصبحان أقوى مع كل ثانية!", imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2069" },
        { name: "قفزات النجمة (Jumping Jacks)", durationSeconds: 60, description: ["اقفز مع فتح القدمين ورفع الذراعين."], motivation: "قلبك ينبض بالقوة، لا تتوقف!", imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=2074" }
    ],
    speed: [
        { name: "الانفجار الحركي والسرعة ⚡", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070" },
        { name: "الانطلاقات العكسية القصيرة", durationSeconds: 30, description: ["اركض بأقصى سرعة للأمام 5 أمتار.", "توقف فجأة ثم ارجع للخلف."], motivation: "السرعة تفصل بين العادي والمميز!", imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070" }
    ],
    balance: [
        { name: "التوازن الثابت والحركي ⚖️", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020" },
        { name: "الوقوف على قدم واحدة المفرود", durationSeconds: 60, description: ["ارفع قدمك اليسرى وافرد ذراعيك للجانبين."], motivation: "التوازن هو أساس الحركات المعقدة.", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020" }
    ],
    agility: [
        { name: "الرشاقة وتغيير الاتجاه 🌀", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1599058917212-97d150016a54?q=80&w=2070" },
        { name: "القفز الجانبي الديناميكي", durationSeconds: 45, description: ["اقفز للجانب الأيمن هبوطاً على قدم واحدة.", "اقفز للجانب الأيسر فوراً كالمتزلج."], motivation: "حركة خفيفة، ارتداد سريع!", imageUrl: "https://images.unsplash.com/photo-1599058917212-97d150016a54?q=80&w=2070" }
    ],
    flexibility: [
        { name: "المرونة وإطالة العضلات 🧘", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" },
        { name: "إطالة أوتار الركبة", durationSeconds: 60, description: ["المس أصابع قدميك مع الحفاظ على الركبة شبه مفرودة."], motivation: "المرونة تمنع الإصابات وتعزز الآداء.", imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" }
    ],
    coordination: [
        { name: "التوافق العضلي العصبي 🧠", durationSeconds: 20, imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" },
        { name: "التنسيق التبادلي المتقاطع", durationSeconds: 60, description: ["المس كوعك الأيمن بركبتك اليسرى والعكس.", "أداء سريع ومتواصل."], motivation: "عقلك وجسدك يعملان بتناغم تام!", imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" }
    ]
};
