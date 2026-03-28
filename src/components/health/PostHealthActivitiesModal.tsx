import React from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Flame, Brain, Shield, HeartPulse, Play, Sparkles, AlertCircle, ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PostHealthActivitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectActivity: (sectionId: string) => void;
}

export const PostHealthActivitiesModal: React.FC<PostHealthActivitiesModalProps> = ({ isOpen, onClose, onSelectActivity }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // Mock data for assignments and library categories (This would come from API in production)
    const teacherAssignments = [
        { id: '1', title: 'اختبار الاستجابة العصبية الحركية', type: 'معرفي حركي', duration: '15 دقيقة', urgency: 'عالي', xp: 250 },
        { id: '2', title: 'تمارين الثبات التكتيكي', type: 'بدني', duration: '20 دقيقة', urgency: 'متوسط', xp: 150 }
    ];

    const trainingZones = [
        { id: 'motor', title: 'البدنية والحركية', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', gradient: 'from-orange-600 to-red-600', desc: 'تمارين القوة، السرعة، والمرونة لبناء أساس رياضي متين.' },
        { id: 'cognitive', title: 'المعرفية والذهنية', icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', gradient: 'from-blue-600 to-indigo-600', desc: 'تدريبات التركيز، سرعة رد الفعل، والتوافق العضلي العصبي.' },
        { id: 'mental', title: 'النفسية والتحفيز', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', gradient: 'from-purple-600 to-fuchsia-600', desc: 'جلسات تصفية الذهن، التغلب على التوتر، ورفع الدافعية.' },
        { id: 'rehab', title: 'الحماية وإعادة التأهيل', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', gradient: 'from-emerald-600 to-teal-600', desc: 'تدريبات تصحيحية وتعافي لتجنب الإصابات وبناء القوة العميقة.' },
    ];

    const handleStartActivity = (sectionId: string) => {
        onSelectActivity(sectionId);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-[98vw] max-h-[95vh] glass-card border-white/10 text-white overflow-hidden p-0 flex flex-col shadow-2xl rounded-[2rem] sm:rounded-[3rem] !translate-x-[-50%] !translate-y-[-50%] !top-1/2 !left-1/2" style={{ background: '#070b14' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-[#070b14] to-cyan-900/10 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="p-8 md:p-12 pb-6 flex-shrink-0 text-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/20 blur-[100px] pointer-events-none" />
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-slate-400 mb-4 drop-shadow-sm">
                            خطوتك القادمة يا بطل؟
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-2xl mx-auto">
                            لقد قمنا بتحليل ملفك الصحي.. اختر الآن مسار تدريبك المخصص لاحتياجاتك الفورية.
                        </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 md:px-12 md:py-8 custom-scrollbar">
                        <div className="max-w-5xl mx-auto space-y-12">

                            {/* Section 1: Teacher's Priority Assignments */}
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">توصيات المدرب العاجلة</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {teacherAssignments.map((assignment, idx) => (
                                        <div key={idx} className="relative group p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer overflow-hidden backdrop-blur-md"
                                            onClick={() => handleStartActivity('coach-exercises')}>
                                            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-bold mb-3 border border-red-500/20">تكليف عاجل</span>
                                                        <h4 className="text-2xl font-black text-white mb-2">{assignment.title}</h4>
                                                    </div>
                                                    <span className="text-xl font-black text-yellow-400">+{assignment.xp} XP</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-400 font-bold">
                                                    <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" /> {assignment.type}</span>
                                                    <span>•</span>
                                                    <span>{assignment.duration}</span>
                                                </div>
                                            </div>
                                            <div className="absolute left-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40">
                                                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Section 2: Library Exploration */}
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <HeartPulse className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">المكتبة الذكية</h3>
                                    <p className="mr-4 text-slate-400 font-bold text-lg hidden sm:block">بناءً على ملفك، ننصحك بالبدء من هنا</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {trainingZones.map((zone, idx) => {
                                        const Icon = zone.icon;
                                        return (
                                            <div key={idx} onClick={() => handleStartActivity(`zone-${zone.id}`)}
                                                className={`group p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden relative min-h-[250px] flex flex-col`}>
                                                
                                                {/* Hover Gradient Overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${zone.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                                
                                                <div className={`w-16 h-16 rounded-[1.5rem] ${zone.bg} border ${zone.border} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
                                                    <Icon className={`w-8 h-8 ${zone.color}`} />
                                                </div>
                                                
                                                <h4 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-white group-hover:to-slate-300 transition-all">
                                                    {zone.title}
                                                </h4>
                                                
                                                <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6 flex-grow">
                                                    {zone.desc}
                                                </p>

                                                <div className="mt-auto flex justify-end">
                                                    <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-${zone.color.split('-')[1]}-500 transition-colors`}>
                                                        <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.section>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 md:p-8 border-t border-white/5 bg-[#070b14]/90 backdrop-blur-xl shrink-0 flex justify-center">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="text-slate-400 hover:text-white hover:bg-white/5 text-xl font-bold rounded-2xl h-14 px-8"
                        >
                            تصفح المنصة الرئيسية أولاً
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};
