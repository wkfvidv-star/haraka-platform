import React from 'react';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    Users,
    School,
    Activity,
    ShieldCheck,
    Medal,
    Settings,
    BellRing,
    LogOut,
    BrainCircuit,
    FileText,
    Map
} from 'lucide-react';
import { useTranslation } from '@/contexts/ThemeContext';

export type PlatformSection =
    | 'overview'
    | 'school_env'
    | 'community_env'
    | 'users'
    | 'analytics'
    | 'content'
    | 'national_challenges'
    | 'ai_manager'
    | 'announcements'
    | 'reports_settings';

interface PlatformSidebarProps {
    activeSection: PlatformSection;
    onSelectSection: (section: PlatformSection) => void;
}

export function PlatformSidebar({ activeSection, onSelectSection }: PlatformSidebarProps) {
    const { language } = useTranslation();
    const isRTL = language === 'ar';

    const menuItems: { id: PlatformSection; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'لوحة التحكم', icon: BarChart3 },
        { id: 'school_env', label: 'البيئة المدرسية', icon: School },
        { id: 'community_env', label: 'البيئة المجتمعية', icon: Activity },
        { id: 'users', label: 'إدارة المستخدمين', icon: Users },
        { id: 'analytics', label: 'التحليلات الشاملة', icon: BarChart3 },
        { id: 'content', label: 'إدارة المحتوى', icon: FileText },
        { id: 'national_challenges', label: 'التحديات الوطنية', icon: Medal },
        { id: 'ai_manager', label: 'إدارة الذكاء الاصطناعي', icon: BrainCircuit },
        { id: 'announcements', label: 'الإعلانات والإشعارات', icon: BellRing },
        { id: 'reports_settings', label: 'التقارير والإعدادات', icon: Settings },
    ];

    return (
        <div className="w-72 h-screen flex flex-col bg-[#070b19] border-l border-indigo-500/10 shadow-2xl z-40 relative">

            {/* Background glow effects */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-20%] w-[150%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Brand Header */}
            <div className="h-24 flex items-center justify-center border-b border-indigo-500/10 relative z-10 px-6">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-tight">
                            HARAKA <span className="text-indigo-400">OS</span>
                        </h1>
                        <span className="text-[10px] text-indigo-200/50 font-bold uppercase tracking-widest">Platform Command</span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 relative z-10 custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelectSection(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-500")} />
                            {item.label}

                            {isActive && (
                                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Footer Area */}
            <div className="p-4 border-t border-indigo-500/10 relative z-10">
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-inner shadow-white/20">
                        SA
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Super Admin</span>
                        <span className="text-xs text-slate-400">Owner Terminal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
