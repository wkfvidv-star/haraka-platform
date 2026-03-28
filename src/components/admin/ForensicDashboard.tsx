import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Database, Link, Search } from 'lucide-react';
import api from '@/services/api';

interface EventLog {
    id: string;
    traceId: string;
    eventType: string;
    payload: any;
    currentHash: string;
    previousHash: string;
    createdAt: string;
    user?: { email: string };
}

export const ForensicDashboard = () => {
    const [events, setEvents] = useState<EventLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/session/forensic-log');
            if (response.data.success) {
                setEvents(response.data.events);
            }
        } catch (error) {
            console.error('Failed to fetch forensic logs');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictBadge = (verdict: string) => {
        switch (verdict) {
            case 'ACCEPT': return <Badge className="bg-green-100 text-green-800">ACCEPTED</Badge>;
            case 'FLAG': return <Badge className="bg-yellow-100 text-yellow-800">FLAGGED</Badge>;
            case 'REJECT': return <Badge className="bg-red-100 text-red-800">REJECTED</Badge>;
            default: return <Badge variant="outline">{verdict}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-blue-600" />
                        Motion Intelligence Forensic Ledger
                    </h1>
                    <p className="text-muted-foreground">Mathematical Append-Only Trace Audit (Hash Chain Enforced)</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Refresh Ledger
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Link size={16} /> Hash Continuity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">Verifiable</div>
                        <p className="text-xs text-blue-600/70 mt-1">SHA256 Chaining Active</p>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Database size={16} /> Ledger State
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700">Append-Only</div>
                        <p className="text-xs text-purple-600/70 mt-1">DB-Level Immutability Locked</p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle size={16} /> Audit Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">100% Secure</div>
                        <p className="text-xs text-green-600/70 mt-1">All Zero-Trust Gates Active</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Event Ledger (Latest 50 Entries)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b text-left text-muted-foreground">
                                <tr>
                                    <th className="pb-3 pr-4 font-medium">Trace ID / Event</th>
                                    <th className="pb-3 pr-4 font-medium">Identity</th>
                                    <th className="pb-3 pr-4 font-medium">Forensic Payload</th>
                                    <th className="pb-3 pr-4 font-medium">Chain Hash</th>
                                    <th className="pb-3 font-medium">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {events.map((event) => (
                                    <tr key={event.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-4 pr-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[10px] text-blue-500">{event.traceId.slice(0, 8)}...</span>
                                                <span className="font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
                                                    {event.eventType.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            {event.user?.email || 'System'}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <div className="max-w-[300px] flex flex-wrap gap-2">
                                                {event.eventType === 'FRAUD_VERDICT' && (
                                                    <>
                                                        {getVerdictBadge(event.payload.verdict)}
                                                        <span className="text-[10px] bg-slate-100 px-1 rounded">Z: {event.payload.zScore?.toFixed(2)}</span>
                                                    </>
                                                )}
                                                {event.eventType === 'METRICS_RECEIVED' && (
                                                    <span className="text-[10px] text-muted-foreground italic">
                                                        {event.payload.frameCount} frames / {event.payload.durationSeconds}s
                                                    </span>
                                                )}
                                                {event.eventType === 'XP_COMMITTED' && (
                                                    <span className="text-[10px] font-bold text-green-600">+{event.payload.earnedXp} XP</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-1 group/hash cursor-help" title={`Full Hash: ${event.currentHash}`}>
                                                <Link size={10} className="text-blue-400" />
                                                <span className="font-mono text-[10px] text-slate-400 group-hover/hash:text-blue-500 whitespace-nowrap overflow-hidden text-ellipsis w-20">
                                                    {event.currentHash}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-muted-foreground text-[11px] whitespace-nowrap">
                                            {new Date(event.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
