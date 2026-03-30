import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Globe, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface AcademicSectionProps {
    isSimplified?: boolean;
}

export function AcademicSection({ isSimplified = false }: AcademicSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className={cn("font-black tracking-tight text-white", isSimplified ? "text-3xl" : "text-2xl")}>
                    📚 التعلم الذكي
                </h2>
                <p className={cn("text-slate-400", isSimplified ? "text-lg" : "text-sm")}>
                    اربط تعلمك بالحركة والنشاط
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Challenge */}
                <Card className="md:col-span-2 bg-[#151928]/90 backdrop-blur-xl border border-teal-500/20 relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 pointer-events-none" />
                    <div className="absolute -left-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center relative z-10">
                        <div className="bg-teal-500/10 p-5 rounded-2xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)] flex-shrink-0">
                            <Lightbulb className="w-10 h-10 text-teal-400" />
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                            <h3 className={cn("font-black text-white tracking-tight", isSimplified ? "text-2xl" : "text-xl")}>سؤال اليوم: الفيزياء في الرياضة</h3>
                            <p className="text-slate-300 mt-2 mb-5 leading-relaxed text-sm sm:text-base">كيف تؤثر زاوية الركل على مسار الكرة؟ (تحليل المقذوفات)</p>
                            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(20,184,166,0.3)] text-white font-black border-none rounded-xl px-8 w-full sm:w-auto">
                                شارك في التحدي
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#151928]/80 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative z-10 pb-4">
                        <CardTitle className={cn("flex items-center gap-3 font-black text-white", isSimplified ? "text-xl" : "text-base")}>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-blue-400" />
                            </div>
                            الرياضيات الحركية
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-300 font-bold">
                                    <span>تقدم الأسبوع</span>
                                    <span className="text-blue-400">80%</span>
                                </div>
                                <Progress value={80} className="h-2 bg-white/10" />
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed min-h-[40px]">حل مسائل الحساب أثناء الجري في المكان</p>
                            <Button variant="ghost" className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 font-bold transition-colors rounded-xl h-11">
                                تابع التعلم
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#151928]/80 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative z-10 pb-4">
                        <CardTitle className={cn("flex items-center gap-3 font-black text-white", isSimplified ? "text-xl" : "text-base")}>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-indigo-400" />
                            </div>
                            لغات العالم
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm mb-2 text-slate-300 font-bold">
                                    <span>كلمات جديدة</span>
                                    <span className="text-indigo-400">5/10</span>
                                </div>
                                <Progress value={50} className="h-2 bg-white/10" />
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed min-h-[40px]">تعلم مصطلحات رياضية بالإنجليزية والفرنسية</p>
                            <Button variant="ghost" className="w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 font-bold transition-colors rounded-xl h-11">
                                تابع التعلم
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
