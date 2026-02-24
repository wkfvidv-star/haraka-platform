import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Wifi,
    WifiOff,
    Unlock,
    Lock,
    Activity,
    Users,
    Clock,
    AlertTriangle,
    MapPin,
    RefreshCcw,
    Search,
    MoreVertical,
    ChevronRight,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartAccessControl() {
    const [logs, setLogs] = useState([
        { id: '1', user: 'أحمد محمد', role: 'STUDENT', time: '10:45:22', location: 'Gate A', status: 'GRANTED' },
        { id: '2', user: 'سارة علي', role: 'YOUTH', time: '10:43:10', location: 'Smart Gym', status: 'GRANTED' },
        { id: '3', user: 'خالد الرياضي', role: 'COACH', time: '10:41:05', location: 'Main Entrance', status: 'GRANTED' },
        { id: '4', user: 'مجهول', role: 'UNKNOWN', time: '10:38:45', location: 'Gate B', status: 'DENIED', reason: 'Invalid Token' },
        { id: '5', user: 'يوسف عبدالله', role: 'STUDENT', time: '10:35:12', location: 'Education Hub', status: 'GRANTED' },
    ]);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeGates, setActiveGates] = useState({
        'Gate A': true,
        'Gate B': true,
        'Main Entrance': true,
        'Smart Gym': true
    });

    const refreshLogs = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const toggleGate = (gate: string) => {
        setActiveGates(prev => ({ ...prev, [gate as keyof typeof prev]: !prev[gate as keyof typeof prev] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Entries', value: '428', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Active Gates', value: '4/4', icon: Wifi, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Security Alerts', value: '3', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Avg Hold Time', value: '1.2s', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card border-white/5 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <Badge variant="outline" className="border-white/5 text-white/40 text-[10px]">LIVE</Badge>
                            </div>
                            <div className="text-2xl font-black text-white">{stat.value}</div>
                            <div className="text-xs font-bold text-white/30 uppercase tracking-widest">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Monitoring Feed */}
                <Card className="lg:col-span-2 glass-card border-white/5 shadow-2xl flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                Live Access Monitoring
                            </CardTitle>
                            <CardDescription className="text-xs text-white/40 font-medium">Real-time stream of facility entry/exit events</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <Input
                                    placeholder="Search users..."
                                    className="bg-white/5 border-white/10 text-xs w-48 pl-9 rounded-xl h-9"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className={`rounded-xl bg-white/5 border-white/10 text-white/60 ${isRefreshing ? 'animate-spin' : ''}`}
                                onClick={refreshLogs}
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="divide-y divide-white/5">
                            <AnimatePresence>
                                {logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${log.status === 'GRANTED' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                                {log.status === 'GRANTED' ? <ShieldCheck className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{log.user}</span>
                                                    <Badge className="bg-white/5 text-[9px] h-4 font-black border-white/10 uppercase">{log.role}</Badge>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] items-center flex gap-1 text-white/40">
                                                        <MapPin className="w-3 h-3" /> {log.location}
                                                    </span>
                                                    <span className="text-[10px] items-center flex gap-1 text-white/40 font-mono italic">
                                                        <Clock className="w-3 h-3" /> {log.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <Badge className={log.status === 'GRANTED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                                    {log.status}
                                                </Badge>
                                                {log.reason && <p className="text-[9px] text-red-400 mt-1">{log.reason}</p>}
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-white/20 group-hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                        <Button variant="link" className="text-blue-400 text-xs font-bold gap-2">
                            Open Full Security Logs <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>

                {/* Remote Control Panel */}
                <div className="space-y-8">
                    <Card className="glass-card border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                            <Zap className="w-32 h-32 text-white" />
                        </div>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-green-500" />
                                Remote Gate Control
                            </CardTitle>
                            <CardDescription className="text-xs text-white/40">Manual override for connected gates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            {Object.entries(activeGates).map(([gate, isOpen]) => (
                                <div key={gate} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                                            {isOpen ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-orange-400" />}
                                        </div>
                                        <span className="text-sm font-bold text-white/80">{gate}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={isOpen ? "outline" : "default"}
                                        className={isOpen ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/40"}
                                        onClick={() => toggleGate(gate)}
                                    >
                                        {isOpen ? <Lock className="w-3 h-3 mr-2" /> : <Unlock className="w-3 h-3 mr-2" />}
                                        {isOpen ? 'LOCK' : 'OPEN'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5 shadow-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                Security Protocol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="w-10 h-10 text-blue-400 mt-1" />
                                    <div>
                                        <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-1">Notice</p>
                                        <p className="text-[11px] text-blue-200/60 leading-relaxed font-medium">
                                            AI-Powered Security is active. Anomaly detection will flag multiple failed attempts automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full bg-white text-blue-900 hover:bg-white/90 font-black rounded-xl h-12">
                                Generate Incident Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
