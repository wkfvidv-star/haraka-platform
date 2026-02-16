import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { scientificDomains } from '@/data/ScientificExerciseData';
import { ArrowRight, Microscope, Info } from 'lucide-react';
import { DomainDetails } from './DomainDetails';
import { VideoAnalysisUpload } from './VideoAnalysisUpload';

export function ScientificTrainingHub() {
    const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

    const handleDomainClick = (id: string) => {
        setSelectedDomainId(id);
    };

    const selectedDomain = scientificDomains.find(d => d.id === selectedDomainId);

    if (selectedDomainId === 'ai-analysis') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" onClick={() => setSelectedDomainId(null)} className="gap-2">
                        <ArrowRight className="w-4 h-4" /> العودة
                    </Button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <selectedDomain.icon className={`w-6 h-6 text-${selectedDomain.color}-600`} />
                        {selectedDomain.title}
                    </h2>
                </div>
                <VideoAnalysisUpload />
            </div>
        )
    }

    if (selectedDomain) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" onClick={() => setSelectedDomainId(null)} className="gap-2">
                        <ArrowRight className="w-4 h-4" /> العودة للتصنيفات
                    </Button>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <selectedDomain.icon className={`w-6 h-6 text-${selectedDomain.color}-600`} />
                        {selectedDomain.title}
                    </h2>
                </div>
                <DomainDetails domain={selectedDomain} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                            <Microscope className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-blue-400 font-medium tracking-wide text-sm">Haraka Science Lab</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        منظومة التدريب العلمي المتقدم
                    </h1>
                    <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                        منهجية علمية متكاملة لتطوير المهارات الحركية، المعرفية، والاجتماعية باستخدام أحدث تقنيات التحليل والذكاء الاصطناعي.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none px-3 py-1">
                            7 مجالات تخصصية
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none px-3 py-1">
                            تحليل AI
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none px-3 py-1">
                            مسارات تكيفية
                        </Badge>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scientificDomains.map((domain) => (
                    <Card
                        key={domain.id}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden relative"
                        onClick={() => handleDomainClick(domain.id)}
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${domain.color}-500 transition-all group-hover:w-2`}></div>
                        <CardHeader className="pb-4">
                            <div className={`w-12 h-12 rounded-xl bg-${domain.color}-50 dark:bg-${domain.color}-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <domain.icon className={`w-6 h-6 text-${domain.color}-600 dark:text-${domain.color}-400`} />
                            </div>
                            <CardTitle className="text-lg leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                {domain.title}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-slate-500 mt-1">
                                {domain.titleEn}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                                {domain.description}
                            </p>

                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {domain.benefits.slice(0, 2).map((benefit, idx) => (
                                        <Badge key={idx} variant="outline" className="text-[10px] py-0 h-5 bg-slate-50 dark:bg-slate-900 border-slate-200">
                                            {benefit}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-semibold text-slate-400">KPI: {domain.kpi}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all transform rtl:rotate-180" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
