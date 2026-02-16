import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, MessageCircle, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuickActionsFAB() {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { label: 'تمرين سريع', icon: Dumbbell, color: 'bg-orange-500' },
        { label: 'اسأل الذكاء', icon: MessageCircle, color: 'bg-blue-500' },
        { label: 'تحليل AR', icon: Camera, color: 'bg-purple-500' },
    ];

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3">
            {/* Actions Menu */}
            <div className={cn(
                "flex flex-col gap-3 transition-all duration-300 ease-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}>
                {actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
                            {action.label}
                        </span>
                        <Button
                            size="icon"
                            className={cn("rounded-full shadow-lg hover:scale-110 transition-transform", action.color)}
                        >
                            <action.icon className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Main Toggle Button */}
            <Button
                size="lg"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-transform duration-300 hover:scale-105",
                    isOpen ? "bg-red-500 hover:bg-red-600 rotate-45" : "bg-educational-primary hover:bg-educational-primary/90"
                )}
            >
                <Plus className="w-8 h-8 text-white" />
            </Button>
        </div>
    );
}
