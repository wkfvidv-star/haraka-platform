import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    User, Bell, Shield, Wallet, Watch, ChevronLeft,
    LogOut, Moon, Globe, Smartphone, HeartPulse,
    Camera, Edit3, Check, Mail, Phone, MapPin,
    Lock, Eye, EyeOff, Key, CreditCard, Crown,
    Star, Zap, BarChart3, Target, ChevronRight,
    Sun, Wifi, X, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type SettingsPage = 'main' | 'profile' | 'notifications' | 'privacy' | 'subscription' | 'security';

export function ProfileSettings() {
    const { user, logout } = useAuth();
    const [page, setPage] = useState<SettingsPage>('main');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        push: true, email: true, sms: false, training: true, coach: true, achievements: true, tips: false
    });
    const [saved, setSaved] = useState(false);

    const triggerSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // --- MAIN MENU ---
    const mainGroups = [
        {
            title: 'الحساب',
            items: [
                { id: 'profile', icon: User, label: 'المعلومات الشخصية', value: user?.name || 'Redha', iconBg: 'bg-blue-50 text-blue-600', badge: null },
                { id: 'subscription', icon: Crown, label: 'خطة الاشتراك والفوائد', value: 'Pro 🏆', iconBg: 'bg-amber-50 text-amber-600', badge: 'Pro' },
                { id: 'security', icon: Lock, label: 'الأمان وكلمة المرور', value: 'محمي ✓', iconBg: 'bg-green-50 text-green-600', badge: null },
            ]
        },
        {
            title: 'التفضيلات',
            items: [
                { id: 'notifications', icon: Bell, label: 'الإشعارات', value: 'مفعلة', iconBg: 'bg-orange-50 text-orange-600', badge: null },
                { id: 'privacy', icon: Shield, label: 'الخصوصية', value: 'عامة', iconBg: 'bg-purple-50 text-purple-600', badge: null },
                { id: 'devices', icon: Watch, label: 'الأجهزة الذكية', value: 'Apple Watch', iconBg: 'bg-slate-100 text-slate-600', badge: null },
            ]
        }
    ];

    if (page !== 'main') {
        return (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-300 pb-20 font-arabic" dir="rtl">
                <button
                    onClick={() => setPage('main')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 group"
                >
                    <ArrowRightIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>الإعدادات</span>
                </button>

                {page === 'profile' && <ProfilePage user={user} onSave={triggerSave} saved={saved} />}
                {page === 'subscription' && <SubscriptionPage />}
                {page === 'security' && <SecurityPage onSave={triggerSave} saved={saved} />}
                {page === 'notifications' && (
                    <NotificationsPage notifications={notifications} setNotifications={setNotifications} onSave={triggerSave} saved={saved} />
                )}
                {page === 'privacy' && <PrivacyPage onSave={triggerSave} saved={saved} />}
                {page === 'devices' && <DevicesPage />}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20 font-arabic" dir="rtl">
            {/* Profile Hero Card */}
            <div className="bg-slate-900 rounded-[2rem] p-7 relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
                <div className="flex items-center gap-5 relative z-10">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 cursor-pointer hover:bg-slate-50 transition">
                            <Camera className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-white">{user?.name || 'Redha'}</h2>
                            <Badge className="bg-amber-500/20 text-amber-400 border-0 flex items-center gap-1 text-xs font-bold"><Crown className="w-3 h-3" /> Pro</Badge>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">{user?.email || 'redha@haraka.dz'}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-500 text-sm font-medium">الشلف، الجزائر</span>
                        </div>
                    </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
                    {[
                        { icon: Star, label: 'المستوى', value: user?.level || 5 },
                        { icon: Zap, label: 'نقاط XP', value: user?.xp || 2480 },
                        { icon: Target, label: 'الإنجازات', value: user?.badges?.length || 12 },
                    ].map((s, i) => (
                        <div key={i} className="bg-slate-800/70 rounded-2xl p-3 text-center border border-slate-700/50 backdrop-blur-sm">
                            <s.icon className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                            <p className="text-white font-black text-lg">{s.value}</p>
                            <p className="text-slate-500 text-xs font-bold">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dark Mode Quick Toggle */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                        {darkMode ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">الوضع الداكن</p>
                        <p className="text-slate-400 text-sm font-medium">تفعيل الثيم الداكن للتطبيق</p>
                    </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Settings Groups */}
            {mainGroups.map((group, gIdx) => (
                <div key={gIdx} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50">
                        <p className="font-black text-slate-500 text-xs tracking-widest uppercase">{group.title}</p>
                    </div>
                    {group.items.map((item, iIdx) => (
                        <button
                            key={iIdx}
                            onClick={() => setPage(item.id as SettingsPage)}
                            className="flex items-center justify-between w-full px-6 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors group text-right"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-800 text-base">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {item.badge && <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-0 text-xs font-bold">{item.badge}</Badge>}
                                {item.value && <span className="text-sm font-bold text-slate-400 hidden sm:block">{item.value}</span>}
                                <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            ))}

            {/* Logout */}
            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-[1.5rem] bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-black text-base transition-all group"
            >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                تسجيل الخروج
            </button>
        </div>
    );
}

// ---- SUB PAGES ----

function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );
}

function SaveBar({ saved, onSave }: { saved: boolean; onSave: () => void }) {
    return (
        <div className="mt-8">
            <Button
                onClick={onSave}
                className={`w-full h-14 rounded-2xl font-black text-base transition-all ${saved ? 'bg-green-500 hover:bg-green-500' : 'bg-orange-500 hover:bg-orange-600'} text-white shadow-lg`}
            >
                {saved ? <><CheckCircle2 className="w-5 h-5 ml-2" /> تم الحفظ!</> : 'حفظ التغييرات'}
            </Button>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-2xl font-black text-slate-900 mb-6">{children}</h2>;
}

function SettingRow({ label, value, inputType = 'text' }: { label: string; value: string; inputType?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</label>
            <input
                type={inputType}
                defaultValue={value}
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
        </div>
    );
}

function ProfilePage({ user, onSave, saved }: any) {
    return (
        <div className="space-y-5">
            <SectionTitle>المعلومات الشخصية</SectionTitle>
            <div className="flex flex-col items-center mb-8">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30 mb-4 relative">
                    <User className="w-14 h-14 text-white" />
                    <div className="absolute -bottom-1 -left-1 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer border border-slate-100">
                        <Camera className="w-4 h-4 text-slate-700" />
                    </div>
                </div>
                <p className="text-slate-400 text-sm font-bold">اضغط للتغيير</p>
            </div>
            <SettingRow label="الاسم الكامل" value={user?.name || 'Redha Benmansour'} />
            <SettingRow label="البريد الإلكتروني" value={user?.email || 'redha@haraka.dz'} inputType="email" />
            <SettingRow label="رقم الهاتف" value="+213 550 000 000" inputType="tel" />
            <SettingRow label="المدينة" value="الشلف، الجزائر" />
            <div className="grid grid-cols-2 gap-4">
                <SettingRow label="العمر" value="18" inputType="number" />
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">الجنس</label>
                    <select className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all">
                        <option>ذكر</option>
                        <option>أنثى</option>
                    </select>
                </div>
            </div>
            <SaveBar saved={saved} onSave={onSave} />
        </div>
    );
}

function SubscriptionPage() {
    const plans = [
        { id: 'free', name: 'مجاني', price: 'مجاناً', period: '', features: ['وصول محدود للتمارين', '3 جلسات شهرياً', 'تقييم أولي'], current: false },
        { id: 'pro', name: 'Pro', price: '1,200', period: 'دج/شهر', features: ['وصول كامل للمكتبة', 'جلسات غير محدودة', 'تحليل الفيديو', 'المدرب الذكي'], current: true },
        { id: 'elite', name: 'Elite', price: '3,500', period: 'دج/شهر', features: ['كل مزايا Pro', 'مدرب شخصي + حجوزات', 'برامج غذائية مخصصة', 'تقارير أسبوعية'], current: false },
    ];
    return (
        <div className="space-y-5">
            <SectionTitle>خطة الاشتراك</SectionTitle>
            <div className="space-y-4">
                {plans.map(p => (
                    <div key={p.id} className={`rounded-[1.5rem] border-2 p-6 transition-all ${p.current ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100' : 'border-slate-100 bg-white'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Crown className={`w-6 h-6 ${p.current ? 'text-orange-500' : 'text-slate-400'}`} />
                                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                                {p.current && <Badge className="bg-orange-500 text-white border-0 text-xs font-bold">خطتك الحالية</Badge>}
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-black text-slate-900">{p.price}</span>
                                <span className="text-slate-400 text-sm font-bold mr-1">{p.period}</span>
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${p.current ? 'text-orange-500' : 'text-slate-300'}`} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        {!p.current && (
                            <Button className="w-full mt-4 h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white">الترقية إلى {p.name}</Button>
                        )}
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 mt-2">
                <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                    <p className="font-black text-slate-900">وسيلة الدفع</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-black">VISA</span>
                        </div>
                        <span className="font-bold text-slate-600">**** **** **** 4242</span>
                    </div>
                    <button className="text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors">تغيير</button>
                </div>
            </div>
        </div>
    );
}

function SecurityPage({ onSave, saved }: any) {
    const [showPass, setShowPass] = useState(false);
    return (
        <div className="space-y-5">
            <SectionTitle>الأمان وكلمة المرور</SectionTitle>
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">كلمة المرور الحالية</label>
                <div className="relative">
                    <input
                        type={showPass ? 'text' : 'password'}
                        defaultValue="••••••••"
                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 pr-12 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <SettingRow label="كلمة المرور الجديدة" value="" inputType="password" />
            <SettingRow label="تأكيد كلمة المرور" value="" inputType="password" />

            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden mt-4">
                <div className="px-6 py-4 border-b border-slate-50">
                    <p className="font-black text-slate-500 text-xs tracking-widest uppercase">الأجهزة النشطة</p>
                </div>
                {[
                    { name: 'iPhone 15 Pro', location: 'الشلف, الجزائر', active: true },
                    { name: 'MacBook Air', location: 'الشلف, الجزائر', active: false },
                ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{d.name}</p>
                                <p className="text-slate-400 text-xs font-medium">{d.location}</p>
                            </div>
                        </div>
                        {d.active ? (
                            <Badge className="bg-green-50 text-green-600 border-0 font-bold text-xs">هذا الجهاز</Badge>
                        ) : (
                            <button className="text-red-500 text-sm font-bold hover:text-red-600 transition-colors">إلغاء الجلسة</button>
                        )}
                    </div>
                ))}
            </div>
            <SaveBar saved={saved} onSave={onSave} />
        </div>
    );
}

function NotificationsPage({ notifications, setNotifications, onSave, saved }: any) {
    const notifItems = [
        { id: 'push', label: 'الإشعارات الفورية (Push)', desc: 'تنبيهات مباشرة على هاتفك' },
        { id: 'email', label: 'البريد الإلكتروني', desc: 'ملخصات وتقارير الأداء الأسبوعية' },
        { id: 'training', label: 'تذكير التدريب اليومي', desc: 'تذكير بموعد جلسة التدريب' },
        { id: 'coach', label: 'رسائل المدرب', desc: 'حين يرد المدرب أو يرسل خطة' },
        { id: 'achievements', label: 'الإنجازات والشارات', desc: 'عند فتح إنجاز جديد' },
        { id: 'sms', label: 'رسائل SMS', desc: 'تنبيهات عبر رسائل قصيرة' },
        { id: 'tips', label: 'نصائح الصحة والتغذية', desc: 'توصيات يومية مخصصة' },
    ];

    return (
        <div className="space-y-4">
            <SectionTitle>إعدادات الإشعارات</SectionTitle>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
                {notifItems.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0">
                        <div>
                            <p className="font-bold text-slate-900 text-base">{item.label}</p>
                            <p className="text-slate-400 text-sm font-medium mt-0.5">{item.desc}</p>
                        </div>
                        <Switch
                            checked={notifications[item.id]}
                            onCheckedChange={(v) => setNotifications((prev: any) => ({ ...prev, [item.id]: v }))}
                        />
                    </div>
                ))}
            </div>
            <SaveBar saved={saved} onSave={onSave} />
        </div>
    );
}

function PrivacyPage({ onSave, saved }: any) {
    const [visibility, setVisibility] = useState('public');
    const privacyItems = [
        { id: 'profile', label: 'رؤية الملف الشخصي', opts: ['عام', 'أصدقاء', 'خاص'] },
        { id: 'progress', label: 'مشاركة التقدم', opts: ['عام', 'أصدقاء', 'خاص'] },
    ];
    return (
        <div className="space-y-5">
            <SectionTitle>إعدادات الخصوصية</SectionTitle>
            <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
                {privacyItems.map((item, i) => (
                    <div key={item.id} className="px-6 py-5 border-b border-slate-50 last:border-0">
                        <p className="font-black text-slate-900 mb-3">{item.label}</p>
                        <div className="flex gap-2">
                            {item.opts.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setVisibility(opt)}
                                    className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-all ${visibility === opt ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <p className="font-bold text-slate-900 text-base">مشاركة بيانات الصحة</p>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">السماح للمدرب بمشاهدة مقاييسك الحيوية</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>
            <SaveBar saved={saved} onSave={onSave} />
        </div>
    );
}

function DevicesPage() {
    return (
        <div className="space-y-5">
            <SectionTitle>الأجهزة الذكية</SectionTitle>
            {[
                { name: 'Apple Watch Series 9', type: 'Smartwatch', connected: true, battery: 82 },
                { name: 'Garmin Forerunner 955', type: 'GPS Watch', connected: false, battery: 0 }
            ].map((d, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${d.connected ? 'bg-green-50' : 'bg-slate-100'}`}>
                            <Watch className={`w-7 h-7 ${d.connected ? 'text-green-600' : 'text-slate-400'}`} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900">{d.name}</p>
                            <p className="text-slate-400 text-sm font-medium">{d.type}</p>
                            {d.connected && <p className="text-green-600 text-xs font-bold mt-1">متصل • البطارية {d.battery}%</p>}
                        </div>
                    </div>
                    <button className={`px-5 py-2 rounded-xl font-bold text-sm border-2 transition-all ${d.connected ? 'border-red-100 text-red-500 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {d.connected ? 'قطع الاتصال' : 'ربط'}
                    </button>
                </div>
            ))}
            <button className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-orange-300 hover:text-orange-500 font-bold transition-all">
                + إضافة جهاز جديد
            </button>
        </div>
    );
}
