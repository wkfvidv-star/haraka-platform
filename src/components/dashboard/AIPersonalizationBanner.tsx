import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AIPersonalizationBannerProps {
    className?: string;
    isSimplified?: boolean;
}

export function AIPersonalizationBanner({ className, isSimplified = false }: AIPersonalizationBannerProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-1",
            className
        )}>
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Sparkles className="w-24 h-24" />
            </div>

            <div className={cn("bg-white/10 backdrop-blur-sm rounded-md flex items-center justify-between gap-3", isSimplified ? "p-4" : "p-2 sm:p-3")}>
                <div className="flex items-center gap-3">
                    <div className={cn("bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse", isSimplified ? "w-12 h-12" : "w-8 h-8")}>
                        <Wand2 className={cn("text-yellow-300", isSimplified ? "w-6 h-6" : "w-4 h-4")} />
                    </div>
                    <div>
                        <p className={cn("font-medium text-white leading-tight", isSimplified ? "text-lg" : "text-xs sm:text-sm")}>
                            تم تخصيص برنامجك اليوم بناءً على نتائج الأمس
                        </p>
                        {isSimplified && <p className="text-white/80 text-sm mt-1">نظام ذكي يساعدك على التحسن</p>}
                    </div>
                </div>

                {!isSimplified && (
                    <Button variant="ghost" size="sm" className="text-xs text-white hover:bg-white/20 h-7 px-2">
                        عرض التفاصيل
                    </Button>
                )}
            </div>
        </div>
    );
}
