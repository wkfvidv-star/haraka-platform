import React, { useState } from 'react';
import { useTranslation } from '@/contexts/ThemeContext';
import { PlatformSidebar, PlatformSection } from '@/components/platform-owner/PlatformSidebar';
import { PlatformHeader } from '@/components/platform-owner/PlatformHeader';
import { GlobalDashboard } from '@/components/platform-owner/overview/GlobalDashboard';

// Placeholder components for the other sections (to be implemented in subsequent phases)
const PlaceholderView = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-indigo-500/20 rounded-3xl bg-indigo-500/5">
        <h2 className="text-2xl font-black text-indigo-400 mb-2">{title}</h2>
        <p className="text-slate-400 font-medium">هذا القسم قيد الإنشاء في المرحلة القادمة...</p>
    </div>
);

export default function PlatformOwnerDashboard() {
    const { language } = useTranslation();
    const isRTL = language === 'ar';

    // State to track which section of the huge dashboard is active
    const [activeSection, setActiveSection] = useState<PlatformSection>('overview');

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'overview': return <GlobalDashboard />;
            case 'school_env': return <PlaceholderView title="إدارة البيئة المدرسية (School Environment)" />;
            case 'community_env': return <PlaceholderView title="إدارة البيئة المجتمعية (Community Environment)" />;
            case 'users': return <PlaceholderView title="إدارة المستخدمين الشاملة (Global Users)" />;
            case 'analytics': return <PlaceholderView title="التحليلات الشاملة (Global Analytics)" />;
            case 'content': return <PlaceholderView title="إدارة المحتوى المركزي (Content Manager)" />;
            case 'national_challenges': return <PlaceholderView title="التحديات الوطنية (National Tournaments)" />;
            case 'ai_manager': return <PlaceholderView title="إدارة الذكاء الاصطناعي (AI & Virtual Coach)" />;
            case 'announcements': return <PlaceholderView title="نموذج الإعلانات والإشعارات (Comms Hub)" />;
            case 'reports_settings': return <PlaceholderView title="التقارير والإعدادات (System Config)" />;
            default: return <GlobalDashboard />;
        }
    };

    return (
        <div className={`flex h-screen w-full bg-[#030614] overflow-hidden ${isRTL ? 'rtl font-cairo' : 'ltr font-sans'}`}>

            {/* 1. Static Sidebar */}
            <PlatformSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(67,56,202,0.05),transparent_50%)] pointer-events-none" />

                {/* Top Header */}
                <PlatformHeader />

                {/* Scrollable Viewport */}
                <main className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
                    {renderActiveSection()}
                </main>

            </div>
        </div>
    );
}
