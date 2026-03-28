import api from './api';
import { BaseExercise, UserProgress } from '@/types/ExerciseTypes';

const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            return JSON.parse(user).id;
        } catch (e) { }
    }
    return null;
}

export const AIService = {
    /**
     * Recommends exercises via backend
     */
    getRecommendations: async (userProgress: UserProgress): Promise<BaseExercise[]> => {
        try {
            const response = await api.post('/ai/recommend', {
                userId: getUserId(),
                level: userProgress.level,
                recentScore: 85 // placeholder 
            });
            if (response.data.success) {
                return response.data.recommendations;
            }
        } catch (error) {
            console.error('Failed to get recommendations', error);
        }
        return [];
    },

    /**
     * Advanced Analysis using YOLOv8 via Backend Worker
     */
    analyzeVideoSubmission: async (videoFile: File): Promise<{ score: number, feedback: string[] }> => {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            const userId = getUserId();
            if (userId) formData.append('userId', userId);

            const response = await api.post('/ai/vision-analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                return { score: response.data.score, feedback: response.data.feedback };
            }
        } catch (error) {
            console.error('Vision analysis error', error);
        }
        return { score: 0, feedback: ['عذراً، حدث خطأ أثناء تحليل الفيديو المرفق.'] };
    },

    /**
     * Speech-to-Text integration (Whisper)
     */
    transcribeSpeech: async (audioBlob: Blob): Promise<string> => {
        // Mock Whisper as it requires complex audio file conversions
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "أريد تحسين قفزي العمودي";
    },

    /**
     * Virtual Coach (Simulated Advanced Domain Expert)
     */
    getAICoachResponse: async (query: string): Promise<string> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Normalize Arabic text perfectly
            const normalize = (text: string) => {
                return text.replace(/[أإآ]/g, 'ا')
                           .replace(/[ة]/g, 'ه')
                           .replace(/[ى]/g, 'ي')
                           .replace(/[ًٌٍَُِّْ]/g, '') // remove diacritics
                           .toLowerCase();
            };
            
            const q = normalize(query);

            // ── 1. Rehabilitation & Rest (إعادة التأهيل والإصابات) ──
            const rehabKeywords = ['الم', 'وجع', 'اصاب', 'تمزق', 'شد عضلي', 'مفصل', 'ركبه', 'كاحل', 'ظهر', 'كتف', 'ساق', 'كسر', 'تاهيل', 'عور', 'التهاب'];
            if (rehabKeywords.some(k => q.includes(k))) {
                return "سلامتك يا بطل! الألم أو الشد العضلي هو إشارة من جسمك للحاجة إلى الراحة. كمدربك وخبير إعادة التأهيل، أنصحك بالتوقف الفوري عن أداء التمارين القاسية لتجنب تفاقم الإصابة. قم بتطبيق مبدأ R.I.C.E (الراحة، الثلج، الضغط، الرفع) على المنطقة المصابة. إذا استمر الألم لأكثر من 48 ساعة، يرجى التوجه فوراً لعيادة المدرسة أو طبيب مختص. الصحة أولاً!";
            }

            // ── 2. Psychological & Wellbeing (المجال النفسي والرفاه) ──
            const psychKeywords = ['توتر', 'قلق', 'ضغط', 'نوم', 'ارهاق', 'تعب', 'طاقه', 'دافع', 'حافز', 'اكتئاب', 'مزاج', 'نفسي', 'خايف'];
            if (psychKeywords.some(k => q.includes(k))) {
                return "الصحة النفسية هي الأساس المتين للأداء العالي! إذا كنت تشعر بالإرهاق أو التوتر، فهذا طبيعي جداً. أنصحك بالتركيز على جودة نومك (7-8 ساعات)، وممارسة تمارين التنفس العميق (4-7-8) لخفض مستوى الكورتيزول. منصة حركة توفر لك 'تمارين الرفاه واليقظة الذهنية'، هل ترغب في أن أرشدك لجلسة استرخاء حالاً؟";
            }

            // ── 3. Cognitive & Brain Function (المجال المعرفي والذهني) ──
            const cogKeywords = ['تركيز', 'انتباه', 'ذاكره', 'تفكير', 'استجابه', 'رد فعل', 'قرار', 'ذهن', 'عقل'];
            if (cogKeywords.some(k => q.includes(k))) {
                return "المجال المعرفي هو ما يميز النخبة من الرياضيين والطلاب. لتعزيز سرعة الاستجابة والتركيز، يتطلب الأمر دمج التمارين الحركية بالمهام الذهنية المزدوجة (Dual-tasking). لدينا في المنصة سلسلة ألعاب معرفية تركز على 'تثبيط الاستجابة' و'الذاكرة العاملة'. أنصحك بإدراج 10 دقائق يومياً من هذه الألعاب قبل المذاكرة أو التمرين لرفع كفاءة النواقل العصبية.";
            }

            // ── 4. Specific Motor Skills (المجال الحركي المتخصص) ──
            const speedKeywords = ['سرعه', 'ركض', 'تسارع', 'انفجار', 'جري'];
            if (speedKeywords.some(k => q.includes(k))) {
                return "لتطوير السرعة والقوة الانفجارية، نحتاج للعمل على تجنيد الألياف العضلية السريعة (Type II). أفضل التمارين لذلك هي الجري المكوكي (Shuttle Run) وقفز الصناديق (Box Jumps). ادمج 3 جولات منها في تدريبك، واحرص على راحة كاملة بين الجولات (دقيقة إلى دقيقتين) لضمان استرجاع الـ ATP بالكامل. استعد لتحطيم أرقامك القياسية!";
            }
            const balanceKeywords = ['توازن', 'ثبات', 'استقرار', 'مركز', 'كور'];
            if (balanceKeywords.some(k => q.includes(k))) {
                return "التوازن هو حجر الزاوية لكل حركة رياضية معقدة. يبدأ التوازن من قوة منطقة الجذع (Core). جرب تمرين الوقوف على قدم واحدة (Stork Stand) مع إغلاق العينين لزيادة التحدي على الجهاز الدهليزي (Vestibular System)، بالإضافة لتمارين البلانك المتنوعة. استمر والممارسات اليومية ستصنع الفارق!";
            }
            const strengthKeywords = ['قوه', 'عضل', 'مقاومه', 'وزن', 'ضخامه'];
            if (strengthKeywords.some(k => q.includes(k))) {
                return "تنمية القوة العضلية تعتمد بشكل أساسي على مبدأ 'الزيادة التدريجية للحمل' (Progressive Overload). ركز في بداياتك على تمارين وزن الجسم المركبة مثل السكوات العميق (Squats) والضغط (Push-ups). لا تنسَ تناول كمية كافية من البروتين بعد التمرين لدعم عملية الاستشفاء وبناء الأنسجة (Hypertrophy).";
            }
            const flexKeywords = ['مرونه', 'اطاله', 'تمطط', 'مد'];
            if (flexKeywords.some(k => q.includes(k))) {
                return "المرونة تحميك من الإصابات وتزيد من المدى الحركي لمفاصلك (ROM). قم بتمارين الإطالة الحركية (Dynamic Stretching) قبل البدء بأي مجهود لتسخين العضلات، واحتفظ بتمارين الإطالة الثابتة (Static Stretching) لما بعد التمرين لتهدئة العضلات. ممتاز جداً اهتمامك بهذا الجانب الأساسي!";
            }

            // ── 5. System Navigation & Planning (توجيه النظام) ──
            const planKeywords = ['تمرين', 'نشاط', 'مهمه', 'خطه', 'جدول', 'كيف ابدا', 'ماذا افعل', 'العب'];
            if (planKeywords.some(k => q.includes(k))) {
                return "بناءً على نتائج بصمتك الحركية الأخيرة التي تم تحليلها، قمت بإعداد 3 تمارين ديناميكية حديثة لك اليوم في صفحة (الأنشطة والتدريب). خطتك مصممة لدمج المهارات الحركية بالقدرات المعرفية. توجه الآن للقسم وابدأ التحدي، أنا بانتظار رفعك للفيديو حتى أقيمه برفقة أستاذك!";
            }
            
            // ── 6. Advanced Expert Fallbacks (ردود الخبراء العشوائية للأسئلة العامة) ──
            const fallbacks = [
                "هذا استفسار مثير للاهتمام! أنا كمدربك الذكي المدمج في بيئة تعليمية، أحلل بصمتك الحركية والذهنية باستمرار. لكي أقدم لك إجابة موجهة، هل يمكنك تحديد ما إذا كنت تسأل عن (القوة، السرعة، التوازن، الرفاه النفسي، أو التركيز الذهني)؟",
                "أنا أتعلم من أدائك يومياً عبر خوارزميات المنصة. استمر في رفع فيديوهاتك وتحديث ملف الرفاه الصحي الخاص بك، وسأدمج هذه المتغيرات لأمنحك تدريباً دقيقاً يعزز قدراتك الأكاديمية والرياضية بآن واحد.",
                "بصفتي خبيراً متخصصاً في التأهيل والتدريب، أستند إلى المعايير العالمية في تطوير الرياضيين والطلاب. يرجى سؤالي بدقة عن القدرات الحركية (الرشاقة، المرونة)، المعرفية (الذاكرة الاستجابية)، أو حتى كيفية التعافي من إجهاد الدراسة والتدريب وسأرشدك فوراً.",
                "تفكير رائع وروح قتالية! الاستمرارية ومراقبة الجهد هما مفاتيح الوصول لـ 'منطقة التدفق الذهني' (Flow State). راقب طاقاتك في شريط الطاقة بالمنصة واسألني عن أي قدرة (حركية، نفسية، ذهنية) تريد استهدافها اليوم."
            ];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        } catch (error) {
            console.error('Coach Error', error);
        }
        return "عذراً، أواجه ضغطاً عصبياً في الشبكة حالياً. دعنا نحاول لاحقاً!";
    }
};
