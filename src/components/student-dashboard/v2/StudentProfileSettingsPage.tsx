import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, User, Shield, Bell, Key, CreditCard,
    Smartphone, Moon, Globe, LogOut, ChevronRight,
    Camera, Flame, Trophy, Heart, Activity, Verified, Upload, X, Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export function StudentProfileSettingsPage({ onBack, fullProfile }: { onBack?: () => void, fullProfile?: any }) {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [activeSection, setActiveSection] = useState<'profile' | 'settings'>('profile');
    const { toast } = useToast();

    const uid = user?.id || 'default';

    // Image Upload States
    const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem(`haraka_profile_img_${uid}`));
    const [coverImage, setCoverImage] = useState<string | null>(() => localStorage.getItem(`haraka_cover_img_${uid}`));
    
    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                
                // Compress image to avoid LocalStorage Quota Exceeded
                const img = new Image();
                img.src = base64String;
                img.onload = () => {
                    let { width, height } = img;
                    const max = 1000;
                    if (width > max) { height *= max / width; width = max; }
                    if (height > max) { width *= max / height; height = max; }
                    const canvas = document.createElement('canvas');
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL('image/jpeg', 0.8);

                    try {
                        if (type === 'profile') {
                            setProfileImage(compressed);
                            localStorage.setItem(`haraka_profile_img_${uid}`, compressed);
                            window.dispatchEvent(new Event('haraka_profile_updated'));
                            toast({ title: 'نجاح', description: 'تم تحديث الصورة الشخصية بنجاح' });
                        } else {
                            setCoverImage(compressed);
                            localStorage.setItem(`haraka_cover_img_${uid}`, compressed);
                            window.dispatchEvent(new Event('haraka_cover_updated'));
                            toast({ title: 'نجاح', description: 'تم تحديث صورة الغلاف بنجاح' });
                        }
                    } catch (err) {
                        toast({ title: 'خطأ', description: 'حجم الصورة كبير جداً للاحتفاظ به، يرجى اختيار صورة أصغر.', variant: 'destructive' });
                    }
                };
            };
            // Read as Data URL to store locally
            reader.readAsDataURL(file);
        }
    };

    const studentName = fullProfile?.firstName ? `${fullProfile.firstName} ${fullProfile.lastName || ''}`.trim() : user?.name || 'بطل المرحلة';
    const xp = fullProfile?.xp || 0;
    const level = Math.floor(xp / 500) + 1;

    // Parse Survey Bio Data
    let bio: any = {};
    try { bio = JSON.parse(fullProfile?.bio || '{}'); } catch (e) {}
    
    // Activity mapping from HealthSurveyModal
    const activityMap: Record<string, string> = { low: 'خفيف', medium: 'متوسط', high: 'عالي', pro: 'مكثف' };
    const activityDisplay = activityMap[bio.activityLevel] || 'متوسط';
    const bloodTypeDisplay = bio.bloodType || 'O+';

    // Settings State with LocalStorage
    const [settings, setSettings] = useState({
        notifs: localStorage.getItem('haraka_notifs') !== 'false',
        darkmode: localStorage.getItem('haraka_darkmode') !== 'false',
        privacy: localStorage.getItem('haraka_privacy') === 'true'
    });

    const updateSetting = (key: keyof typeof settings, val: boolean) => {
        setSettings(prev => ({ ...prev, [key]: val }));
        localStorage.setItem(`haraka_${key}`, val.toString());
        if (key === 'darkmode') {
            document.documentElement.classList.toggle('dark', val as boolean);
        }
    };

    const navItems = [
        { id: 'profile', label: t('tab_my_profile'), icon: User },
        { id: 'settings', label: t('tab_general_settings'), icon: Settings },
    ] as const;

    const langName = language === 'ar' ? 'العربية' : language === 'en' ? 'English' : 'Français';

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Header Area */}
            <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="w-12 h-12 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors ml-2 shadow-sm border border-slate-200 dark:border-white/10 shrink-0"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300 transform rotate-180 md:rotate-0" />
                    </button>
                )}
                <div className="relative w-16 h-16 shrink-0 rounded-[1.5rem] overflow-hidden group">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-2xl font-black text-white">
                            {studentName.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        {t('settings_title')} <Verified className="w-6 h-6 text-blue-500 fill-white" />
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold">{t('settings_subtitle')}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={cn(
                                    'w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] font-bold text-lg transition-all duration-300 group',
                                    active
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                )}
                            >
                                <Icon className={cn('w-6 h-6 transition-transform group-hover:scale-110', active ? 'text-white' : 'text-slate-400')} />
                                <span>{item.label}</span>
                                {active && <ChevronRight className="w-5 h-5 mr-auto" />}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {activeSection === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {/* Personal Info Card (Facebook Style) */}
                                <div className="rounded-[2.5rem] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group/cover">
                                    {/* Cover Photo Area */}
                                    <div className="h-48 md:h-64 w-full relative bg-slate-100 dark:bg-slate-800 transition-all duration-500">
                                        {coverImage ? (
                                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                                        )}
                                        {/* Edit Cover Overlay */}
                                        <label className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all opacity-0 group-hover/cover:opacity-100 border border-white/10">
                                            <Camera className="w-4 h-4" />
                                            <span className="hidden sm:block">{language === 'ar' ? 'تعديل الغلاف' : 'Edit Cover'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'cover')} />
                                        </label>
                                    </div>

                                    {/* Profile Avatar & Info Overlay */}
                                    <div className="px-6 md:px-10 pb-8 relative z-10">
                                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-8">
                                            {/* Avatar Box */}
                                            <div className="relative group/avatar shrink-0">
                                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-white dark:border-[#0f172a] shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all duration-300">
                                                    {profileImage ? (
                                                        <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-5xl md:text-6xl font-black text-white">
                                                            {studentName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer border-4 border-transparent">
                                                    <Camera className="w-10 h-10 text-white" />
                                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'profile')} />
                                                </label>
                                            </div>

                                            {/* Name & Badge */}
                                            <div className={`text-center md:text-right pb-2 flex-1 ${language === 'ar' ? '' : 'md:text-left'}`}>
                                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{studentName}</h3>
                                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-sm">
                                                    <Verified className="w-4 h-4" /> {t('student_badge')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Survey & Gamification Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: t('stat_points'), value: xp, unit: 'XP', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                                { label: t('stat_level'), value: level, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                                                { label: t('stat_activity'), value: activityDisplay, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                                { label: t('stat_blood'), value: bloodTypeDisplay, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                            ].map((stat, i) => {
                                                const SIcon = stat.icon;
                                                return (
                                                    <div key={i} className="p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex flex-col gap-3">
                                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                                                            <SIcon className={cn('w-5 h-5', stat.color)} />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{stat.label}</p>
                                                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                                                {stat.value} {stat.unit && <span className="text-sm text-slate-400">{stat.unit}</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {/* Advanced Settings List Card */}
                                <div className="rounded-[2rem] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 dark:border-white/5">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('pref_title')}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold mt-1">{t('pref_desc')}</p>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                                        {[
                                            { id: 'notifs', label: t('opt_notifs'), desc: t('opt_notifs_desc'), icon: Bell, type: 'switch' },
                                            { id: 'darkmode', label: t('opt_darkmode'), desc: t('opt_darkmode_desc'), icon: Moon, type: 'switch' },
                                            { id: 'privacy', label: t('opt_privacy'), desc: t('opt_privacy_desc'), icon: Shield, type: 'switch' },
                                            { id: 'lang', label: t('opt_lang'), desc: langName, icon: Globe, type: 'button' },
                                            { id: 'pass', label: t('opt_pass'), desc: t('opt_pass_desc'), icon: Key, type: 'button' },
                                        ].map((opt, i) => {
                                            const OptIcon = opt.icon;
                                            const settingKey = opt.id as keyof typeof settings;
                                            return (
                                                <div key={opt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                                            <OptIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-lg text-slate-900 dark:text-slate-100">{opt.label}</h4>
                                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{opt.desc}</p>
                                                        </div>
                                                    </div>
                                                    {opt.type === 'switch' ? (
                                                        <Switch 
                                                            checked={settings[settingKey] as boolean} 
                                                            onCheckedChange={(v) => updateSetting(settingKey, v)} 
                                                            className="scale-110" 
                                                        />
                                                    ) : (
                                                        <button 
                                                            onClick={() => {
                                                                if (opt.id === 'lang') {
                                                                    // Cycle language ar -> en -> fr -> ar
                                                                    const next = language === 'ar' ? 'en' : language === 'en' ? 'fr' : 'ar';
                                                                    setLanguage(next);
                                                                } else if (opt.id === 'pass') {
                                                                    setShowPasswordModal(true);
                                                                }
                                                            }}
                                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-black text-sm transition-colors"
                                                        >
                                                            {t('btn_edit')}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="p-8 rounded-[2rem] border-2 border-red-500/20 bg-red-500/5 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-red-500 font-black text-xl mb-1">{t('danger_title')}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 font-bold">{t('danger_desc')}</p>
                                    </div>
                                    <button 
                                        onClick={logout}
                                        className="flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all hover:scale-105 transform hover:-translate-x-1"
                                    >
                                        {t('btn_logout')} <LogOut className={`w-5 h-5 ${language === 'ar' ? '-scale-x-100' : ''}`} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className={`w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 ${language === 'ar' ? 'rtl' : 'ltr'}`}
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                                </h3>
                                <button onClick={() => setShowPasswordModal(false)} className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                                    <input 
                                        type="password" 
                                        value={passData.current}
                                        onChange={e => setPassData({...passData, current: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                    <input 
                                        type="password" 
                                        value={passData.new}
                                        onChange={e => setPassData({...passData, new: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                                    <input 
                                        type="password" 
                                        value={passData.confirm}
                                        onChange={e => setPassData({...passData, confirm: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                                >
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button 
                                    onClick={() => {
                                        if (passData.new && passData.new === passData.confirm) {
                                            toast({ title: language === 'ar' ? 'نجاح' : 'Success', description: language === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully' });
                                            setShowPasswordModal(false);
                                            setPassData({current: '', new: '', confirm: ''});
                                        } else {
                                            toast({ title: language === 'ar' ? 'خطأ' : 'Error', description: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match', variant: 'destructive' });
                                        }
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
