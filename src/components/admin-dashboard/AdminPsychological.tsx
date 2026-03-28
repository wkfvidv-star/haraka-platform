import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Smile, Frown, Sparkles, Navigation } from 'lucide-react';

export const AdminPsychological: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Brain className="w-8 h-8 text-indigo-500" />
                        الحالة النفسية والتحفيز
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">
                        متابعة مستويات التحفيز، المشاركة، والثقة بالنفس للطلاب
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-slate-900 border-indigo-500/20">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2">84%</h3>
                        <p className="font-bold text-slate-300">متوسط الثقة بالنفس</p>
                        <p className="text-xs text-indigo-400 mt-2 flex justify-center items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            أعلى بـ 5% من المتوقع
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border-emerald-500/20">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                            <Smile className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2">91%</h3>
                        <p className="font-bold text-slate-300">معدل المشاركة الإيجابية</p>
                        <p className="text-xs text-emerald-400 mt-2 flex justify-center items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            تفاعل ممتاز في الحصص
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-slate-900 border-amber-500/20">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                            <Frown className="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2">12</h3>
                        <p className="font-bold text-slate-300">حالة انخفاض تحفيز</p>
                        <p className="text-xs text-amber-400 mt-2 flex justify-center items-center gap-1 cursor-pointer hover:underline">
                            عرض التفاصيل والمتابعة
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <CardContent className="p-8">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center rotate-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                            <Brain className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white">توصيات المساعد المحلل الذكي</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            تشير البيانات إلى استقرار نفسي عام في فصول المرحلة الابتدائية.
                            ومع ذلك، يوجد انخفاض ملحوظ في التفاعل لطلاب الصف السادس خلال الفترات الصباحية.
                            يُوصى بإدراج أنشطة إحماء ذهنية حركية قبل الحصة الأولى.
                        </p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminPsychological;
