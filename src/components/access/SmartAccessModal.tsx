import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/ThemeContext';
import {
    QrCode,
    CheckCircle2,
    XCircle,
    Loader2,
    ShieldCheck,
    Wifi,
    Lock,
    Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SmartAccessModal: React.FC<SmartAccessModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { language } = useTranslation();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'granted' | 'denied'>('idle');
    const [message, setMessage] = useState('');
    const isRTL = language === 'ar';

    const qrValue = user?.qrToken || user?.id || 'DEMO-TOKEN';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrValue}&color=000&bgcolor=fff`;

    const simulateScan = async () => {
        setStatus('scanning');
        setMessage(isRTL ? 'جاري التحقق من الهوية...' : 'Verifying Identity...');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate Success/Failure (Random for demo, or based on user logic)
        const success = Math.random() > 0.1; // 90% success for demo

        if (success) {
            setStatus('granted');
            setMessage(isRTL ? 'تم السماح بالدخول. أهلاً بك!' : 'Access Granted. Welcome!');
        } else {
            setStatus('denied');
            setMessage(isRTL ? 'تم رفض الدخول. يرجى مراجعة الإدارة.' : 'Access Denied. Please contact admin.');
        }
    };

    const reset = () => {
        setStatus('idle');
        setMessage('');
    };

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-[#0b0f1a] border-white/10 text-white overflow-hidden p-0">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />

                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-400">Secure Entry Protocol</span>
                    </div>
                    <DialogTitle className="text-2xl font-black">{isRTL ? 'نظام الدخول الذكي' : 'Smart Access System'}</DialogTitle>
                    <DialogDescription className="text-white/40 text-xs">
                        {isRTL ? 'امسح الرمز ضوئياً عند البوابة للدخول' : 'Scan this code at the gate to enter'}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 flex flex-col items-center justify-center space-y-8">
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                className="relative group cursor-pointer"
                                onClick={simulateScan}
                            >
                                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="bg-white p-6 rounded-3xl relative z-10 shadow-2xl">
                                    <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
                                </div>
                                <div className="absolute top-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg -mr-2 -mt-2 animate-bounce">
                                    <QrCode className="w-4 h-4 text-white" />
                                </div>
                            </motion.div>
                        )}

                        {status === 'scanning' && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center space-y-6 py-12"
                            >
                                <div className="relative">
                                    <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />
                                    <Wifi className="absolute inset-0 m-auto w-8 h-8 text-blue-300 animate-pulse" />
                                </div>
                                <p className="font-bold text-blue-400 animate-pulse">{message}</p>
                            </motion.div>
                        )}

                        {status === 'granted' && (
                            <motion.div
                                key="granted"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center space-y-6 py-8"
                            >
                                <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                    <Unlock className="w-16 h-16 text-green-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-green-400 mb-2">{isRTL ? 'تم السماح' : 'Granted'}</h3>
                                    <p className="text-white/60 text-sm">{message}</p>
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-8"
                                >
                                    {isRTL ? 'إغلاق' : 'Close'}
                                </Button>
                            </motion.div>
                        )}

                        {status === 'denied' && (
                            <motion.div
                                key="denied"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center space-y-6 py-8"
                            >
                                <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center border-4 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                                    <Lock className="w-16 h-16 text-red-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-red-400 mb-2">{isRTL ? 'مرفوض' : 'Denied'}</h3>
                                    <p className="text-white/60 text-sm">{message}</p>
                                </div>
                                <Button
                                    onClick={reset}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-8"
                                >
                                    {isRTL ? 'إعادة المحاولة' : 'Try Again'}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-white/5 p-4 flex items-center justify-between text-[10px] font-mono text-white/30 tracking-widest uppercase">
                    <span>Token ID: {user?.digitalId}</span>
                    <span>v1.0.2-SECURE</span>
                </div>
            </DialogContent>
        </Dialog>
    );
};
