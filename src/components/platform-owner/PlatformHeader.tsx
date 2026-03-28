import React from 'react';
import { Search, Bell, LogOut, Command, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function PlatformHeader() {
    const { logout } = useAuth();

    return (
        <header className="h-24 bg-[#0a0f24] border-b border-indigo-500/10 flex items-center justify-between px-8 relative z-20">

            {/* Decorative top pulse line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Left side - Search */}
            <div className="flex items-center flex-1 max-w-md">
                <div className="w-full relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="البحث الشامل في المنصة (Ctrl+K)..."
                        className="w-full bg-[#11172f] border border-white/5 rounded-2xl py-3 pr-12 pl-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                    <div className="absolute inset-y-0 left-4 flex items-center">
                        <div className="flex items-center gap-1 opacity-50">
                            <Command className="w-3 h-3 text-white" />
                            <span className="text-xs font-bold text-white uppercase font-sans">K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">

                {/* System Status Indicator */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mr-4">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Operational</span>
                </div>

                <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-[#0a0f24] rounded-full" />
                </button>

                <LanguageSwitcher />

                <div className="w-[1px] h-8 bg-white/10 mx-2" />

                <button
                    onClick={logout}
                    className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

        </header>
    );
}
