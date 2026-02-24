-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('motor', 'cognitive', 'psychological', 'rehabilitation')),
    sub_category TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    instructions TEXT[],
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Real Exercises (20 Total)

-- 1. Motor Exercises (حركية)
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('توازن القطب الواحد', 'تدريب متقدم لتحسين التوازن الثابت وتقوية عضلات الكاحل والركبة.', 'motor', 'Balance', 'Intermediate', '5 min', ARRAY['قف على قدم واحدة', 'حافظ على استقامة الظهر', 'اثبت لمدة 30 ثانية لكل قدم']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('الرشاقة السلمية', 'تحسين سرعة القدمين والتنسيق الحركي باستخدام سلم الرشاقة.', 'motor', 'Agility', 'Beginner', '10 min', ARRAY['تحرك عبر السلم بخطوات سريعة', 'ارفع الركبتين عالياً', 'كرر 5 مرات']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('السرعة الانفجارية', 'تدريب على الانطلاق السريع لتطوير القوة الانفجارية في الساقين.', 'motor', 'Speed', 'Advanced', '15 min', ARRAY['ابدأ من وضعية الاستعداد', 'انطلق بأقصى سرعة لمسافة 20 متر', 'ارتاح لمدة دقيقة وكرر']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التوافق العضلي العصبي', 'تمرين يجمع بين حركات اليدين والقدمين لتحسين التنسيق العام.', 'motor', 'Coordination', 'Intermediate', '8 min', ARRAY['استخدم الكرة أثناء الحركة', 'مرر الكرة حول الخصر أثناء المشي', 'زد السرعة تدريجياً']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('قفز الحواجز المنخفضة', 'تطوير قوة القفز والتحكم في الهبوط الآمن.', 'motor', 'Plyometrics', 'Intermediate', '12 min', ARRAY['اقفز فوق سلسلة من الحواجز المنخفضة', 'اهبط بنعومة على مشط القدم', 'حافظ على توازنك عند كل هبوط']);

-- 2. Cognitive Exercises (إدراكية)
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('تتبع الأهداف المتعددة', 'تمرين لزيادة سعة الانتباه وتتبع عدة عناصر متحركة في وقت واحد.', 'cognitive', 'Attention', 'Advanced', '5 min', ARRAY['راقب العناصر المتحركة على الشاشة', 'حدد العناصر المطلوبة عند توقف الحركة', 'زد عدد العناصر تدريجياً']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('الذاكرة المكانية التكتيكية', 'حفظ مواقع اللاعبين وتوزيعهم في الملعب وإعادة تمثيلها.', 'cognitive', 'Memory', 'Intermediate', '7 min', ARRAY['شاهد صورة لتوزيع اللاعبين لمدة 10 ثوانٍ', 'حاول تحديد مواقعهم على مخطط خالٍ', 'قارن إجابتك بالصورة الأصلية']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('سرعة معالجة المعلومات', 'الاستجابة لإشارات بصرية مختلفة بأفعال محددة في وقت قياسي.', 'cognitive', 'Processing', 'Beginner', '4 min', ARRAY['اضغط على الزر الموافق للون الظاهر', 'حاول تقليل وقت الاستجابة', 'تجنب الأخطاء عند زيادة السرعة']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('اتخاذ القرار تحت الضغط', 'اختيار الخيار الأفضل في سيناريوهات رياضية معقدة ووقت محدود.', 'cognitive', 'Decision Making', 'Advanced', '10 min', ARRAY['شاهد مقطع فيديو لهجمة رياضية', 'اختر التمريرة أو الحركة الأنسب فوراً', 'حلل قرارك مع المدرب']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التعرف على الأنماط البصرية', 'اكتشاف الثغرات في دفاع الخصم من خلال مراقبة أنماط حركته.', 'cognitive', 'Pattern Recognition', 'Intermediate', '8 min', ARRAY['لاحظ تحركات الفريق الخصم', 'حدد النمط المتكرر في دفاعهم', 'اقترح طريقة لاختراق هذا النمط']);

-- 3. Psychological Exercises (نفسية)
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التنفس الصدري العميق', 'تقنية للتحكم في القلق وزيادة تدفق الأكسجين للدماغ.', 'psychological', 'Emotional Regulation', 'Beginner', '5 min', ARRAY['استنشق بعمق من الأنف لمدة 4 ثوانٍ', 'احبس النفس لمدة 4 ثوانٍ', 'ازفر ببطء من الفم لمدة 6 ثوانٍ']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التصور الذهني للأداء', 'بناء الثقة من خلال تخيل أداء الحركات الرياضية بامتياز.', 'psychological', 'Confidence', 'Intermediate', '10 min', ARRAY['أغمض عينيك وتخيل نفسك في الملعب', 'شاهد نفسك تؤدي الحركة الصعبة بنجاح', 'اشعر بالفخر والنجاح المرتبط بالأداء']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('إدارة التوتر قبل المنافسة', 'تمارين استرخاء لتقليل التوتر العضلي والذهني قبل البطولات.', 'psychological', 'Stress Management', 'Advanced', '15 min', ARRAY['قم بشد وإرخاء مجموعات عضلية معينة بالترتيب', 'ركز على الإحساس بالراحة بعد الإرخاء', 'استخدم عبارات تحفيزية إيجابية']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التركيز الذهني الموجه', 'تثبيت الانتباه على نقطة معينة وتجاهل المشتتات الخارجية.', 'psychological', 'Focus', 'Intermediate', '8 min', ARRAY['اختر نقطة ثابتة أمامك لتركيز النظر', 'ابعد أي فكرة مشتتة تعود لذهنك', 'استمر في التركيز لمدة دقيقتين متواصلتين']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('الحديث الذاتي الإيجابي', 'تحويل الأفكار السلبية إلى رسائل دعم قوية لتعزيز الإصرار.', 'psychological', 'Resilience', 'Beginner', '5 min', ARRAY['حدد فكرة سلبية تراودك أثناء الفشل', 'استبدلها بعبارة ذهنبة إيجابية بأنك قادر على التعلم والمحاولة مرة أخرى', 'كرر العبارة بصوت مرتفع']);

-- 4. Rehabilitation Exercises (تأهيل)
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('إطالة عضلات خلف الفخذ', 'تحسين المرونة وتقليل خطر الإصابات العضلية في الساقين.', 'rehabilitation', 'Flexibility', 'Beginner', '6 min', ARRAY['اجلس على الأرض مع مد الساقين', 'حاول لمس أصابع قدميك ببطء', 'اثبت في وضع الإطالة لمدة 20 ثانية']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('تقوية الكاحل بالرباط المطاطي', 'إعادة تأهيل مفصل الكاحل بعد الإصابات وزيادة استقراره.', 'rehabilitation', 'Stability', 'Intermediate', '12 min', ARRAY['ثبت الرباط المطاطي حول قدمك', 'حرك قدمك للخارج والداخل عكس مقاومة الرباط', 'نفذ 3 مجموعات من 15 تكراراً']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('تحسين مدى حركة الكتف', 'تمارين لطيفة لزيادة ليونة مفصل الكتف وتخفيف الألم.', 'rehabilitation', 'Mobility', 'Beginner', '10 min', ARRAY['قف بجانب حائط وحرك أصابعك للأعلى عليه ببطء', 'توقف عند الشعور ببداية شد بسيط', 'كرر التمرين 10 مرات']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('التوازن العلاجي على وسادة هوائية', 'تحسين التوازن الحركي والتوافق بعد إصابات الركبة.', 'rehabilitation', 'Neuromotor', 'Advanced', '15 min', ARRAY['قف على وسادة التوازن الهوائية', 'حاول الحفاظ على ثبات جسمك دون مساعدة', 'استمر لمدة دقيقة لكل قدم']);
INSERT INTO exercises (title, description, category, sub_category, difficulty, duration, instructions) VALUES ('تقوية عضلات الظهر السفلي', 'تمارين لتقوية الجذع وحماية العمود الفقري.', 'rehabilitation', 'Strength', 'Intermediate', '10 min', ARRAY['استلقِ على بطنك وارفع الصدر قليلاً عن الأرض', 'حافظ على استقامة الرقبة', 'كرر التمرين 12 مرة لثلاث مجموعات']);
