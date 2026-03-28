import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Watch, Smartphone, Activity, Heart, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Device {
    id: string;
    name: string;
    provider: string;
    icon: string;
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync?: string;
    batteryLevel?: number;
    color: string;
}

const DEVICE_PROVIDERS = [
    {
        id: 'apple_health',
        name: 'Apple Watch',
        provider: 'Apple Health',
        icon: '🍎',
        color: 'from-gray-700 to-black',
        textColor: 'text-gray-900 dark:text-gray-100',
        borderColor: 'border-gray-500/20'
    },
    {
        id: 'garmin_connect',
        name: 'Garmin Fenix/Forerunner',
        provider: 'Garmin Connect',
        icon: '⌚',
        color: 'from-slate-700 to-slate-900',
        textColor: 'text-slate-800 dark:text-slate-200',
        borderColor: 'border-slate-500/20'
    },
    {
        id: 'fitbit',
        name: 'Fitbit Sense/Versa',
        provider: 'Fitbit',
        icon: '💠',
        color: 'from-teal-600 to-teal-800',
        textColor: 'text-teal-700 dark:text-teal-400',
        borderColor: 'border-teal-500/20'
    },
    {
        id: 'xiaomi_mi_band',
        name: 'Xiaomi Mi Band',
        provider: 'Zepp Life',
        icon: '📱',
        color: 'from-orange-500 to-orange-700',
        textColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-500/20'
    }
];

export function WearablesSyncPanel() {
    const [devices, setDevices] = useState<Device[]>([
        {
            id: 'apple_health',
            name: 'Apple Watch Series 9',
            provider: 'Apple Health',
            icon: '🍎',
            status: 'connected',
            lastSync: new Date().toLocaleTimeString('ar-DZ'),
            batteryLevel: 84,
            color: 'from-gray-700 to-black'
        }
    ]);

    const [isSyncingAll, setIsSyncingAll] = useState(false);

    const toggleConnection = (providerId: string) => {
        const existing = devices.find(d => d.id === providerId);
        if (existing) {
            // Disconnect
            setDevices(devices.filter(d => d.id !== providerId));
        } else {
            // Connect (Simulate)
            const provider = DEVICE_PROVIDERS.find(p => p.id === providerId)!;
            const newDevice: Device = {
                id: provider.id,
                name: provider.name,
                provider: provider.provider,
                icon: provider.icon,
                status: 'syncing',
                color: provider.color
            };
            setDevices([...devices, newDevice]);

            // Simulate sync delay
            setTimeout(() => {
                setDevices(prev => prev.map(d => 
                    d.id === providerId 
                        ? { ...d, status: 'connected', lastSync: new Date().toLocaleTimeString('ar-DZ'), batteryLevel: Math.floor(Math.random() * 40 + 60) }
                        : d
                ));
            }, 2000);
        }
    };

    const syncAll = () => {
        setIsSyncingAll(true);
        setDevices(prev => prev.map(d => ({ ...d, status: 'syncing' })));
        
        setTimeout(() => {
            setDevices(prev => prev.map(d => ({ 
                ...d, 
                status: 'connected', 
                lastSync: new Date().toLocaleTimeString('ar-DZ') 
            })));
            setIsSyncingAll(false);
        }, 3000);
    };

    return (
        <Card className="border-indigo-500/20 bg-white/50 dark:bg-[#0B0E14]/80 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
            <CardHeader className="relative z-10 border-b border-indigo-500/10 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Watch className="w-5 h-5 text-indigo-500" />
                            مركز مزامنة الأجهزة القابلة للارتداء
                        </CardTitle>
                        <CardDescription className="text-slate-500 mt-1">
                            قم بربط ساعتك الذكية لاستيراد بيانات النبض، النوم، والنشاط تلقائياً لدقة أعلى في التقييم.
                        </CardDescription>
                    </div>
                    {devices.length > 0 && (
                        <Button 
                            variant="outline" 
                            className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            onClick={syncAll}
                            disabled={isSyncingAll}
                        >
                            <RefreshCw className={`w-4 h-4 ml-2 ${isSyncingAll ? 'animate-spin' : ''}`} />
                            {isSyncingAll ? 'جاري المزامنة...' : 'مزامنة الكل'}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative z-10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DEVICE_PROVIDERS.map((provider) => {
                        const connectedDevice = devices.find(d => d.id === provider.id);
                        const isConnected = !!connectedDevice && connectedDevice.status === 'connected';
                        const isSyncing = !!connectedDevice && connectedDevice.status === 'syncing';

                        return (
                            <div 
                                key={provider.id} 
                                className={`rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
                                    isConnected 
                                        ? 'bg-white dark:bg-white/5 border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.1)]' 
                                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/30'
                                }`}
                            >
                                {/* Background Gradient for connected devices */}
                                {isConnected && (
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${provider.color} opacity-5 rounded-full -mr-10 -mt-10`} />
                                )}

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border items-center justify-center flex text-2xl shadow-sm">
                                            {provider.icon}
                                        </div>
                                        {isConnected ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/20 gap-1 px-2">
                                                <CheckCircle2 className="w-3 h-3" /> متصل
                                            </Badge>
                                        ) : isSyncing ? (
                                            <Badge variant="outline" className="border-indigo-500/20 text-indigo-500 gap-1 px-2">
                                                <Loader2 className="w-3 h-3 animate-spin" /> جاري الربط
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-slate-700">
                                                غير متصل
                                            </Badge>
                                        )}
                                    </div>

                                    <h4 className={`font-bold text-sm mb-1 ${provider.textColor}`}>
                                        {provider.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-medium mb-4">
                                        عبر {provider.provider}
                                    </p>

                                    {isConnected && connectedDevice && (
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">آخر مزامنة:</span>
                                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{connectedDevice.lastSync}</span>
                                            </div>
                                            {connectedDevice.batteryLevel !== undefined && (
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">البطارية:</span>
                                                    <span className={`font-bold ${connectedDevice.batteryLevel > 20 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {connectedDevice.batteryLevel}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Button 
                                        onClick={() => toggleConnection(provider.id)}
                                        disabled={isSyncing}
                                        variant={isConnected ? "outline" : "default"}
                                        className={`w-full mt-auto ${
                                            isConnected 
                                                ? 'border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' 
                                                : isSyncing
                                                    ? 'bg-slate-200 text-slate-500'
                                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                        }`}
                                    >
                                        {isConnected ? 'إلغاء الربط' : isSyncing ? 'يرجى الانتظار...' : 'ربط الجهاز'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>ملاحظة الخصوصية:</strong> جميع البيانات المستوردة من الأجهزة القابلة للارتداء مشفرة بالكامل وتستخدم حصرياً لتحسين تجربتك في التدريب والتأهيل ولا تتم مشاركتها مع أطراف ثالثة.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
