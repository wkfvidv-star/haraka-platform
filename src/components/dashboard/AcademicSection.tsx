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
                <Card className="md:col-span-2 bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-100">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="bg-white p-4 rounded-full shadow-sm">
                            <Lightbulb className="w-8 h-8 text-teal-600" />
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                            <h3 className={cn("font-bold text-teal-900", isSimplified ? "text-xl" : "text-lg")}>سؤال اليوم: الفيزياء في الرياضة</h3>
                            <p className="text-teal-700 mt-1 mb-3">كيف تؤثر زاوية الركل على مسار الكرة؟ (تحليل المقذوفات)</p>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                                شارك في التحدي
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2", isSimplified ? "text-xl" : "text-base")}>
                            <Calculator className="w-5 h-5 text-blue-500" />
                            الرياضيات الحركية
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>تقدم الأسبوع</span>
                                    <span>80%</span>
                                </div>
                                <Progress value={80} className="h-2" />
                            </div>
                            <p className="text-sm text-gray-500">حل مسائل الحساب أثناء الجري في المكان</p>
                            <Button variant="outline" size="sm" className="w-full">تابع التعلم</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className={cn("flex items-center gap-2", isSimplified ? "text-xl" : "text-base")}>
                            <Globe className="w-5 h-5 text-indigo-500" />
                            لغات العالم
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>كلمات جديدة</span>
                                    <span>5/10</span>
                                </div>
                                <Progress value={50} className="h-2" />
                            </div>
                            <p className="text-sm text-gray-500">تعلم مصطلحات رياضية بالإنجليزية والفرنسية</p>
                            <Button variant="outline" size="sm" className="w-full">تابع التعلم</Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
