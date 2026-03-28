import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MessageCircle, HelpCircle, FileText, Send, Phone,
  PlayCircle, ChevronDown, ChevronUp, CheckCircle, Mail, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const FAQS = [
  {
    category: 'الحساب والتقييم',
    questions: [
      { q: 'كيف يمكنني إعادة تشخيص البصمة الحركية؟', a: 'يمكنك ذلك من خلال الضغط على زر "إعادة اختبار البصمة" في القائمة الرئيسية. يُنصح بإعادته كل 3 أشهر لتحديث بيانات المدرب الذكي.' },
      { q: 'أين أجد نقاط الخبرة (XP) الخاصة بي؟', a: 'مجموع نقاطك يظهر في أعلى القائمة الجانبية، كما يمكنك رؤية تقدمك المفصل في صفحة "التحديات والمنافسات".' }
    ]
  },
  {
    category: 'التمارين والمنافسات',
    questions: [
      { q: 'ما هو التحدي الأسبوعي؟', a: 'كل أسبوع يُطلق المدرب تحدياً جديداً بين طلاب المدرسة (مثل: أكبر عدد قفزات). تنال المراكز الثلاثة الأولى أوسمة حصرية.' },
      { q: 'كيف أرفع فيديو لأداء تمرين؟', a: 'اذهب إلى صفحة "الرصد والتقييم"، اضغط على أيقونة الكاميرا، وقم برفع الفيديو. سيقوم الذكاء الاصطناعي أو مدربك بتحليله وتقديم التغذية الراجعة.' }
    ]
  },
  {
    category: 'التقنية والمشاكل',
    questions: [
      { q: 'التطبيق لا يسجل خطواتي، ماذا أفعل؟', a: 'تأكد من إعطاء صلاحيات تتبع الحركة في إعدادات الهاتف (HealthKit للآيفون أو Google Fit للأندرويد).' },
      { q: 'لم تصلني إشعارات التمارين', a: 'قم بزيارة "إعدادات الحساب" > "الإعدادات العامة" وتأكد من تفعيل الإشعارات والتنبيهات.' }
    ]
  }
];

const VIDEO_TUTORIALS = [
  { title: 'دليل استخدام لوحة التحكم', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80', time: '02:45' },
  { title: 'كيف تصور أداءك بشكل صحيح', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80', time: '03:15' },
  { title: 'شرح أبعاد البصمة الحركية', thumb: 'https://images.unsplash.com/photo-1434493789847-2f02b0c36015?w=500&q=80', time: '05:20' }
];

const DATABASE_EXERCISES = [
  { title: 'القفز العمودي (Sargeant Jump)', category: 'القوة الانفجارية' },
  { title: 'اختبار T-Test للرشاقة وتغيير الاتجاه', category: 'الرشاقة' },
  { title: 'الجري المكوكي 10 متر × 4', category: 'السرعة' },
  { title: 'المرونة: مد الذراعين من الجلوس', category: 'المرونة' },
  { title: 'توازن الطائر الفلامنغو (Stork Stand)', category: 'التوازن' },
  { title: 'تمرين بلانك 45 ثانية', category: 'القوة التحملية' },
  { title: 'سكوات الجدار (Wall Sit)', category: 'القوة التحملية' },
  { title: 'رمي واستقبال الكرات (التوافق اليدوي-العيني)', category: 'التوافق الحركي' }
];

export function SupportHelpPage({ onBack }: { onBack?: () => void }) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketSuccess(true);
      toast({
        title: "تم استلام تذكرتك بنجاح!",
        description: "سيقوم فريق الدعم الفني بالرد عليك خلال 24 ساعة.",
        className: "bg-emerald-500 text-white border-none",
      });
      setTicketSubject('');
      setTicketMessage('');
      setTimeout(() => setTicketSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className={cn("space-y-8 pb-32", isRTL ? "rtl" : "ltr")}>
      
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2.5rem] overflow-hidden p-8 lg:p-12 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-start">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center mb-6 shadow-inner">
              <HelpCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">مركز المساعدة والدعم</h1>
            <p className="text-blue-200 text-base md:text-lg max-w-xl leading-relaxed">
              نحن هنا لمساعدتك على التفوق. استكشف قاعدة المعرفة، شاهد شروحات الفيديو، أو تواصل معنا مباشرة في أي وقت.
            </p>
          </div>
          <div className="w-full md:w-[400px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن تمرين، حل، أو مشكلة..."
                className="w-full bg-white/10 border-2 border-white/20 text-white placeholder-blue-200/50 rounded-2xl py-4 px-6 pr-14 font-bold text-lg focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all backdrop-blur-md shadow-2xl"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-300 pointer-events-none" />
              
              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showAutocomplete && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white dark:bg-[#1e2330] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 z-50 text-right"
                  >
                    {DATABASE_EXERCISES.filter(ex => !searchQuery || ex.title.includes(searchQuery.replace('أ', 'ا').replace('إ', 'ا'))).length > 0 ? (
                      <div className="max-h-60 overflow-y-auto py-2">
                        {DATABASE_EXERCISES.filter(ex => !searchQuery || ex.title.includes(searchQuery.replace('أ', 'ا').replace('إ', 'ا'))).map((ex, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setSearchQuery(ex.title);
                              setShowAutocomplete(false);
                              toast({ title: 'توجيه للتمرين', description: 'سيتم نقلك لصفحة التمارين للبدء بهذا النشاط.', className: 'bg-blue-600 text-white border-none' });
                            }}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-none flex items-center justify-between transition-colors"
                          >
                            <span className="font-bold text-slate-800 dark:text-slate-200">{ex.title}</span>
                            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">{ex.category}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm font-bold">لا توجد تمارين مطابقة للبحث داخل المنصة المدرسية!</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {['الرصد والتقييم', 'نقاط XP', 'تمرين', 'سرعة', 'إعدادات الحساب'].map(tag => (
                <span 
                  key={tag} 
                  onClick={() => setSearchQuery(tag)}
                  className="bg-white/5 border border-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-white/20 hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT COLUMN: FAQ & Video Tutorials */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Video Tutorials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">دروس مرئية سريعة</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIDEO_TUTORIALS.filter(v => v.title.includes(searchQuery)).map((vid, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/5 shadow-sm group cursor-pointer"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6 text-indigo-600 ml-1" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">{vid.time}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 leading-snug">{vid.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 shadow-sm p-6 md:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">الأسئلة الشائعة (FAQ)</h2>
            </div>
            
            <div className="space-y-6">
              {FAQS.map((category, idx) => {
                const filteredQuestions = category.questions.filter(
                  q => q.q.includes(searchQuery) || q.a.includes(searchQuery) || category.category.includes(searchQuery)
                );
                if (filteredQuestions.length === 0) return null;

                return (
                  <div key={idx}>
                    <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">{category.category}</h3>
                    <div className="space-y-3">
                      {filteredQuestions.map((item, qIdx) => {
                        const id = `faq-${idx}-${qIdx}`;
                        const isActive = activeFAQ === id;
                        return (
                          <div key={qIdx} className={cn("rounded-2xl border transition-all duration-300 overflow-hidden", isActive ? "border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm" : "border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-black/20")}>
                            <button
                              onClick={() => setActiveFAQ(isActive ? null : id)}
                              className="w-full flex items-center justify-between p-5 text-right focus:outline-none"
                            >
                              <span className={cn("font-bold text-base md:text-lg transition-colors text-right", isActive ? "text-indigo-700 dark:text-indigo-300 font-black" : "text-slate-700 dark:text-slate-300")}>{item.q}</span>
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0", isActive ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "bg-white dark:bg-white/5 text-slate-400")}>
                                {isActive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </button>
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                >
                                  <div className="px-5 pb-5 pt-0">
                                    <div className="w-full h-[1px] bg-slate-200/50 dark:bg-white/5 mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.a}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* LEFT COLUMN: Contact forms & Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Submit a Ticket Card */}
          <div className="rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 shadow-sm p-6 md:p-8 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">إنشاء تذكرة دعم</h2>
              </div>
            </div>
            
            <div className="relative z-10">
              {ticketSuccess ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-300 mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-emerald-600 dark:text-emerald-400/80 font-bold text-sm">سيتم معالجة طلبك قريباً والتواصل معك.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">موضوع المشكلة</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="مثال: مشكلة في رفع الفيديو..."
                      className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all placeholder:font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">وصف المشكلة</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="اشرح المشكلة بالتفصيل حتى نتمكن من مساعدتك بحلها بسرعة..."
                      className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all resize-none placeholder:font-normal"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !ticketSubject || !ticketMessage}
                    className="w-full bg-gradient-to-l from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> إرسال التذكرة
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Contact Direct Box */}
          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-8 shadow-xl relative overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5 backdrop-blur-md">
              <Phone className="w-8 h-8 text-indigo-100" />
            </div>
            <h3 className="text-2xl font-black mb-2">خط الدعم المباشر</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">احصل على مساعدة فورية من مستشارينا المعتمدين.</p>
            <div className="bg-black/20 rounded-xl p-4 font-black flex items-center justify-center gap-3 backdrop-blur-md mb-4 border border-white/10">
              <span className="tracking-widest text-lg">9200-HARAKA</span>
            </div>
            <button className="w-full bg-white text-indigo-900 font-black py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg shadow-black/10">
              اتصل الآن
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
