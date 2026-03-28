import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Apple, Dumbbell, Video, Printer, Camera, Brain, PlayCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportProps {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
}

function PrintHeader() {
    return (
        <div className="border-b-2 border-slate-700 pb-4 mb-6 flex justify-between items-start">
            <div className="flex flex-col">
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1 drop-shadow-md">HARAKA SPORTS TECH</h1>
                <p className="text-sm font-bold text-slate-400">Official Coach Prescription Document</p>
                <p className="text-xs text-orange-400 font-mono mt-1">Ref: {Math.random().toString(36).substring(7).toUpperCase()}-{new Date().getFullYear()}</p>
            </div>
            <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg flex items-center justify-center ms-auto mb-2 shadow-lg shadow-orange-500/20">
                    <span className="text-white font-black text-xl">H</span>
                </div>
                <p className="text-sm font-bold text-slate-400 font-mono">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
        </div>
    );
}

function PatientInfo({ title, coach }: { title: string, coach: string }) {
    return (
        <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 border border-slate-700 rounded-lg mb-8 shadow-inner">
            <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Athlete Details</span>
                <p className="font-bold text-white text-lg">طالب الأكاديمية</p>
                <p className="text-sm text-slate-400 font-mono">ID: STU-2024-891</p>
            </div>
            <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prescription Details</span>
                <p className="font-bold text-orange-400 text-lg">{title}</p>
                <p className="text-sm text-slate-400">Assigned by: <span className="text-white">{coach}</span></p>
            </div>
        </div>
    );
}

function PrintFooter({ coach }: { coach: string }) {
    return (
        <div className="mt-12 pt-8 border-t border-slate-700 flex justify-between items-end">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Digital Signature</p>
                <div className="font-[Brush_Script_MT,cursive] text-3xl text-orange-400 italic opacity-80">{coach}</div>
                <p className="text-xs text-slate-500 font-bold mt-1 tracking-widest uppercase">Certified Professional</p>
            </div>
            <div className="text-right">
                <div className="w-24 h-24 border-4 border-slate-700 rounded-full flex items-center justify-center rotate-[-15deg] opacity-70">
                    <span className="text-sm font-black text-slate-600 uppercase leading-none text-center tracking-widest">APPROVED<br/>HARAKA<br/>SYSTEM</span>
                </div>
            </div>
        </div>
    );
}

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

// ── Shared Wrapper using React Portal to escape ANY CSS transforms ──
function ExpandingModalOverlay({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 h-screen w-screen overflow-hidden left-0 top-0">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
                        onClick={onClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-slate-900 border border-white/10 w-full max-w-4xl h-[90vh] rounded-[2rem] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden printable-document"
                        dir="rtl"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}


export function DeepTrainingReportSheet({ isOpen, onClose, data }: ReportProps) {
    const printDoc = () => window.print();

    return (
        <ExpandingModalOverlay isOpen={isOpen} onClose={onClose}>
                {/* PDF Toolbar */}
                <div className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center shadow-md no-print sticky top-0 z-50">
                    <div className="flex items-center gap-3 text-white px-2">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                           <Dumbbell className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="font-black text-lg tracking-wide text-white">مستند البرنامج التدريبي.pdf</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Button onClick={printDoc} variant="outline" className="gap-2 font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                            <Printer className="w-4 h-4" /> تصدير PDF 
                        </Button>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    {/* Dark Paper Container */}
                    <div className="bg-slate-900 mx-auto shadow-2xl shadow-black sm:max-w-[850px] w-full my-6 p-6 sm:p-12 border border-slate-800 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <PrintHeader />
                            <PatientInfo title="البرنامج الأسبوعي للقوة والتحمل" coach="الكابتن أحمد" />

                            <div className="mb-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 border-b-2 border-indigo-500 inline-block pb-1">1. Objective & Notes</h3>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium bg-indigo-500/10 p-5 border-r-4 border-indigo-500 rounded-l-lg shadow-inner">
                                    ركز هذا الأسبوع على رفع الأوزان بثبات مع إطالة فترة الراحة لـ 90 ثانية. القاعدة الذهبية: إحماء المفاصل ضرورة لتجنب الإصابة وتعظيم الإستفادة من مرحلة التحمل.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b-2 border-indigo-500 inline-block pb-1">2. Prescribed Exercises</h3>
                                <div className="border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-800 text-indigo-300">
                                                <th className="border-b border-l border-slate-700/50 p-4 text-right font-black w-[15%]">اليوم</th>
                                                <th className="border-b border-l border-slate-700/50 p-4 text-right font-black w-[45%]">التمرين (التفاصيل)</th>
                                                <th className="border-b border-l border-slate-700/50 p-4 text-center font-black w-[20%]">المجموعات</th>
                                                <th className="border-b border-slate-700/50 p-4 text-center font-black w-[20%]">الراحة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-slate-900/50">
                                            {[
                                                { day: 'الأول', exercise: 'سكوات كامل (Full Squat - زاوية 90)', sets: '4 × 10', rest: '90 ث.' },
                                                { day: 'الثاني', exercise: 'ضغط صدر مستوي (Bench Press)', sets: '3 × 12', rest: '60 ث.' },
                                                { day: 'الثالث', exercise: 'تأهيل ومرونة للمفاصل (Mobility Flow)', sets: '15 دقيقة', rest: 'مستمر' },
                                                { day: 'الرابع', exercise: 'سحب ظهري (Lat Pulldown - قبضة واسعة)', sets: '4 × 10', rest: '90 ث.' },
                                                { day: 'الخامس', exercise: 'جري سريع (Sprints 50m)', sets: '5 جولات', rest: '120 ث.' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-800/70 transition-colors">
                                                    <td className="border-b border-l border-slate-700/50 p-4 font-bold text-orange-400">{row.day}</td>
                                                    <td className="border-b border-l border-slate-700/50 p-4 font-medium text-slate-200">{row.exercise}</td>
                                                    <td className="border-b border-l border-slate-700/50 p-4 text-center text-slate-300 font-mono font-bold bg-slate-800/30">{row.sets}</td>
                                                    <td className="border-b border-slate-700/50 p-4 text-center text-slate-400 font-mono">{row.rest}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <PrintFooter coach="Coach Ahmed (Strength Team)" />
                        </div>
                    </div>
                </div>
        </ExpandingModalOverlay>
    );
}

export function DeepDietReportSheet({ isOpen, onClose, data }: ReportProps) {
    const printDoc = () => window.print();

    return (
        <ExpandingModalOverlay isOpen={isOpen} onClose={onClose}>
                <div className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center shadow-md no-print sticky top-0 z-50">
                    <div className="flex items-center gap-3 text-white px-2">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <Apple className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-black text-lg tracking-wide text-white">البروتوكول الغذائي.pdf</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Button onClick={printDoc} variant="outline" className="gap-2 font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                            <Printer className="w-4 h-4" /> تصدير PDF
                        </Button>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    <div className="bg-slate-900 mx-auto shadow-2xl shadow-black sm:max-w-[850px] w-full my-6 p-6 sm:p-12 border border-slate-800 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <PrintHeader />
                            <PatientInfo title="البروتوكول الغذائي: عجز 300 سعرة (Fat Loss)" coach="د. سارة (التغذية العلاجية)" />

                            <div className="mb-10">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b-2 border-emerald-500 inline-block pb-1">1. Nutritional Targets (Macros)</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg bg-slate-800/30">
                                    <div className="text-center border-l flex flex-col items-center justify-center border-b lg:border-b-0 border-slate-700/50 p-6 bg-slate-800/60">
                                        <span className="block text-4xl font-black text-white mb-2 shadow-sm drop-shadow">2100</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-700/50">Daily Kcal</span>
                                    </div>
                                    <div className="text-center flex flex-col items-center justify-center border-l lg:border-b-0 border-b border-slate-700/50 p-6">
                                        <span className="block text-3xl font-black text-slate-200 mb-2">150g</span>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Protein (30%)</span>
                                    </div>
                                    <div className="text-center flex flex-col items-center justify-center border-l border-slate-700/50 p-6">
                                        <span className="block text-3xl font-black text-slate-200 mb-2">200g</span>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Carbs (40%)</span>
                                    </div>
                                    <div className="text-center flex flex-col items-center justify-center p-6">
                                        <span className="block text-3xl font-black text-slate-200 mb-2">70g</span>
                                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Fat (30%)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b-2 border-emerald-500 inline-block pb-1">2. Prescribed Daily Meals</h3>
                                <div className="border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-800 text-emerald-300">
                                                <th className="border-b border-l border-slate-700/50 p-4 text-right font-black w-[20%] lg:w-[15%]">الوجبة</th>
                                                <th className="border-b border-l border-slate-700/50 p-4 text-right font-black w-[50%] lg:w-[60%]">المكونات وتفاصيل التقديم</th>
                                                <th className="border-b border-slate-700/50 p-4 text-center font-black w-[30%] lg:w-[25%]">ملاحظات وقائية</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-slate-900/50">
                                            {[
                                                { title: 'الإفطار (AM)', desc: 'شوفان 60غ + حليب منزوع الدسم + نصف تفاحة + ملعقة بذور شيا', notes: 'تؤكل قبل التدريب بساعتين' },
                                                { title: 'غداء (Noon)', desc: 'صدر دجاج مشوي 150غ + كينوا 100غ (مطبوخ) + سلطة ورقيات', notes: 'يمنع إضافة المايونيز' },
                                                { title: 'سناك (PM)', desc: 'زبادي يوناني 150غ + حبات لوز (15غ)', notes: 'مصدر بروتين بطيء' },
                                                { title: 'العشاء (Night)', desc: 'سلطة تونة بالماء (علبة كاملة) + خيار وطماطم وعصرة ليمون', notes: 'يؤكل قبل النوم بـ 3 ساعات' },
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-800/70 transition-colors">
                                                    <td className="border-b border-l border-slate-700/50 p-4 font-black text-emerald-400 bg-slate-800/30">{row.title}</td>
                                                    <td className="border-b border-l border-slate-700/50 p-4 font-medium text-slate-200 leading-relaxed">{row.desc}</td>
                                                    <td className="border-b border-slate-700/50 p-4 text-xs text-rose-300 italic">{row.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/30 rounded-xl shadow-inner">
                                    <strong className="font-black text-rose-400 uppercase text-[11px] tracking-widest flex items-center gap-2 mb-2"><Brain className="w-4 h-4"/> تحذير الالتزام (Warning): </strong>
                                    <p className="text-slate-300 text-sm leading-relaxed font-bold">يجب الالتزام بالحصص بدقة للحفاظ على الكتلة العضلية مع تخفيض نسبة الدهون المخزنة. يمنع تناول السكر المضاف نهائياً طوال فترة هذا البرتوكول وإلا ستفقد الفعالية الكيميائية.</p>
                                </div>
                            </div>

                            <PrintFooter coach="Dr. Sara (Dietitian)" />
                        </div>
                    </div>
                </div>
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        .printable-document, .printable-document * { visibility: visible; }
                        .printable-document { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0; padding: 0;}
                        .no-print { display: none !important; }
                    }
                `}</style>
        </ExpandingModalOverlay>
    );
}

export function DeepVideoReportSheet({ isOpen, onClose, data }: ReportProps) {
    return (
        <ExpandingModalOverlay isOpen={isOpen} onClose={onClose}>
                <div className="absolute top-4 left-4 z-[100]">
                     <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-rose-500/80 hover:text-white text-slate-200 transition-colors backdrop-blur-md border border-white/20 shadow-xl">
                         <X className="w-5 h-5" />
                     </button>
                </div>
                <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    <div className="relative h-[300px] sm:h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-800">
                        <img 
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=60" 
                            alt="Video Frame" 
                            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        <div className="relative z-20 flex flex-col items-center">
                            <button className="w-20 h-20 bg-orange-500/90 hover:bg-orange-500 hover:scale-110 transition-all rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_40px_rgba(249,115,22,0.4)] border border-orange-400/50">
                                <PlayCircle className="w-10 h-10 text-white ml-2 drop-shadow-lg" />
                            </button>
                            <Badge className="mt-6 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 text-sm border-white/10 text-slate-200 font-mono tracking-widest shadow-xl">2:15 • COACH NOTES</Badge>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-8 bg-slate-950">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-rose-600/20 rounded-xl border border-orange-500/30 shadow-inner">
                                    <Video className="w-6 h-6 text-orange-400" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">تصحيح زاوية النزول في السكوات</h2>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900 px-3 py-1 font-bold">المشرف: الكابتن أحمد</Badge>
                                <span className="text-slate-700 font-black">•</span>
                                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30">مهمة تصحيحية حركية</Badge>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-500 to-transparent rounded-full" />
                                <p className="text-slate-300 font-bold leading-relaxed bg-slate-900/50 p-6 rounded-l-2xl border-y border-l border-slate-700 shadow-inner text-base">
                                    "لقد قمت بتحليل الفيديو الأخير الذي أرسلته بدقة. ركبتك تتجاوز مستوى أصابع قدمك مما يضع تقوساً على زاوية الحوض والرضفة. يرجى مشاهدة هذا الفيديو التوضيحي الذي سجلته لك لمعرفة التمركز الحركي الصحيح للظهر."
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-orange-400" /> مقارنة نظام الذكاء الاصطناعي
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl overflow-hidden border border-rose-500/30 relative group shadow-lg shadow-black">
                                    <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/0 transition-colors z-10" />
                                    <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=60" className="w-full h-40 object-cover opacity-60 grayscale scale-105 group-hover:scale-100 transition-transform duration-700" alt="Wrong" />
                                    <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm shadow-lg text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-lg z-20 border border-white/20">الأداء الخاطئ</div>
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-emerald-500/40 relative group shadow-lg shadow-black">
                                    <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/0 transition-colors z-10" />
                                    <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60" className="w-full h-40 object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="Correct" />
                                    <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm shadow-lg text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-lg z-20 border border-white/20">الأداء الصحيح</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0 flex gap-3 shadow-[0_-20px_30px_rgba(0,0,0,0.5)] z-50">
                        <Button className="flex-1 h-16 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 font-bold text-base sm:text-lg rounded-2xl gap-3 shadow-xl shadow-orange-900/50 text-white border border-orange-500/50">
                            <Camera className="w-6 h-6" /> تسجيل التطبيق باستخدام العقل الرقمي
                        </Button>
                    </div>
                </div>
        </ExpandingModalOverlay>
    );
}
