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
                <h2 className={cn("font-bold text-gray-800 dark:text-gray-100", isSimplified ? "text-2xl" : "text-xl")}>
                    📚 التعلم الذكي
                </h2>
                <p className={cn("text-gray-500", isSimplified ? "text-base" : "text-sm")}>
                    اربط تعلمك بالحركة والنشاط
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Challenge */}
                <Card className="md:col-span-2 bg-gradient-to-r from-teal-900/30 to-emerald-900/30 border-teal-500/20">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="bg-teal-500/20 p-4 rounded-full border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                            <Lightbulb className="w-8 h-8 text-teal-400" />
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                            <h3 className={cn("font-bold text-teal-300", isSimplified ? "text-xl" : "text-lg")}>سؤال اليوم: الفيزياء في الرياضة</h3>
                            <p className="text-teal-100/80 mt-1 mb-3">كيف تؤثر زاوية الركل على مسار الكرة؟ (تحليل المقذوفات)</p>
                            <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg text-white font-bold border-none">
                                شارك في التحدي
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/5 hover:border-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-blue-400", isSimplified ? "text-xl" : "text-base")}>
                            <Calculator className="w-5 h-5 text-blue-500" />
                            الرياضيات الحركية
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1 text-slate-300 font-medium">
                                    <span>تقدم الأسبوع</span>
                                    <span className="text-blue-400">80%</span>
                                </div>
                                <Progress value={80} className="h-2 bg-slate-800" />
                            </div>
                            <p className="text-sm text-slate-400">حل مسائل الحساب أثناء الجري في المكان</p>
                            <Button variant="outline" size="sm" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">تابع التعلم</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/5 hover:border-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2 text-indigo-400", isSimplified ? "text-xl" : "text-base")}>
                            <Globe className="w-5 h-5 text-indigo-500" />
                            لغات العالم
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1 text-slate-300 font-medium">
                                    <span>كلمات جديدة</span>
                                    <span className="text-indigo-400">5/10</span>
                                </div>
                                <Progress value={50} className="h-2 bg-slate-800" />
                            </div>
                            <p className="text-sm text-slate-400">تعلم مصطلحات رياضية بالإنجليزية والفرنسية</p>
                            <Button variant="outline" size="sm" className="w-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300">تابع التعلم</Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
