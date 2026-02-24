import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode,
    ShieldCheck,
    User as UserIcon,
    Clock,
    MapPin,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DigitalIdentity() {
    const { user } = useAuth();
    const { language } = useTranslation();
    const navigate = useNavigate();
    const isRTL = language === 'ar';

    if (!user) return null;

    const qrValue = user.qrToken || user.id;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrValue}&color=000&bgcolor=fff`;

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white selection:bg-blue-500 overflow-x-hidden relative">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <Button
                        variant="ghost"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
                        {isRTL ? 'الرجوع' : 'Back'}
                    </Button>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-blue-400/80">Secure Access</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Identity Card */}
                    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl relative mb-8">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                            <Activity className="w-48 h-48 text-white" />
                        </div>

                        <CardHeader className="text-center border-b border-white/5 pb-8">
                            <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-600 mb-4 shadow-xl">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full rounded-full border-2 border-white/20 object-cover"
                                />
                            </div>
                            <CardTitle className="text-3xl font-black tracking-tight">{user.name}</CardTitle>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                    {user.role.toUpperCase()}
                                </Badge>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-400">{isRTL ? 'نشط' : 'Active'}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* QR Section */}
                                <div className="p-10 flex flex-col items-center justify-center bg-white/5 border-b md:border-b-0 md:border-l border-white/5">
                                    <div className="bg-white p-4 rounded-3xl shadow-2xl mb-6 relative group">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={qrImageUrl}
                                            alt="Identity QR"
                                            className="w-48 h-48 relative z-10"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Digital Identity ID</p>
                                        <code className="text-lg font-mono font-bold text-blue-400">{user.digitalId}</code>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="p-10 space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-white/30 uppercase tracking-widest">Access Privileges</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                </div>
                                                <span className="text-sm font-bold text-white/80">{isRTL ? 'دخول المرافق الرياضية' : 'Sports Facilities Access'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                </div>
                                                <span className="text-sm font-bold text-white/80">{isRTL ? 'تسجيل حضور ذكي' : 'Smart Attendance Sync'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 opacity-50">
                                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-white/40" />
                                                </div>
                                                <span className="text-sm font-bold text-white/40">{isRTL ? 'الدفع عن بعد (قريباً)' : 'Remote Pay (Coming Soon)'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/40">{isRTL ? 'تاريخ الانتهاء' : 'Expiry Date'}</span>
                                            <span className="font-bold text-orange-400">2026/12/31</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Logs (Mini Preview) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">{isRTL ? 'سجل العمليات الأخير' : 'Recent Access Logs'}</h3>
                            <Button variant="link" className="text-blue-400 text-xs font-bold p-0">
                                {isRTL ? 'عرض الكل' : 'View All'}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {[
                                { loc: 'Main Entrance - Zone A', time: '2 hours ago', status: 'Granted' },
                                { loc: 'Smart Gym - Floor 2', time: '5 hours ago', status: 'Granted' },
                                { loc: 'Education Hub', time: 'Yesterday', status: 'Denied', reason: 'Out of Hours' },
                            ].map((item, i) => (
                                <div key={i} className="glass-card flex items-center justify-between p-4 border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'Granted' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                            {item.status === 'Granted' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.loc}</p>
                                            <p className="text-[10px] text-white/40 font-mono italic">{item.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {item.reason && <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-400 bg-red-500/5">{item.reason}</Badge>}
                                        <ChevronRight className="w-4 h-4 text-white/20 ml-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Footer Info */}
                <div className="mt-16 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        <QrCode className="w-3 h-3" />
                        Scan for entry at any Haraka Hub
                    </div>
                    <p className="text-white/20 text-[10px] leading-relaxed max-w-xs mx-auto italic">
                        Esteem is protected by Haraka AGI Infrastructure.
                        Encrypted tokens refresh every 30 seconds.
                    </p>
                </div>
            </div>
        </div>
    );
}
