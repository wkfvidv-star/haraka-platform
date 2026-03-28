import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIPersonalizationBannerProps {
    className?: string;
    isSimplified?: boolean;
}

export function AIPersonalizationBanner({ className, isSimplified = false }: AIPersonalizationBannerProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-lg border border-slate-800",
            className
        )}>
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10", isSimplified ? "p-6" : "p-4 px-5")}>
                <div className="flex items-center gap-4">
                    <div className={cn("bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 group", isSimplified ? "w-14 h-14" : "w-10 h-10")}>
                        <Wand2 className={cn("text-white group-hover:rotate-12 transition-transform duration-500", isSimplified ? "w-7 h-7" : "w-5 h-5")} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-white/10 text-orange-400 border-none text-[10px] font-black uppercase tracking-widest px-2 py-0">ذكاء اصطناعي</Badge>
                            {isSimplified && <span className="text-slate-400 font-bold text-[10px] uppercase">تخصيص مباشر</span>}
                        </div>
                        <p className={cn("font-black text-white leading-tight tracking-tight", isSimplified ? "text-xl" : "text-sm")}>
                            تم تخصيص برنامجك اليوم بناءً على نتائج الأمس
                        </p>
                        {isSimplified && <p className="text-slate-400 font-medium text-sm mt-1">نظام Haraka الذكي يرافقك خطوة بخطوة</p>}
                    </div>
                </div>

                {!isSimplified && (
                    <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto font-bold text-slate-300 border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white rounded-xl h-9 px-4 transition-colors">
                        عرض التفاصيل والمقاييس
                    </Button>
                )}
            </div>
        </div>
    );
}
