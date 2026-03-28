import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info, Zap, Target, Shield, Timer, Dumbbell, StretchHorizontal, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotorDimension {
    id: string;
    label: string;
    labelEn: string;
    score: number;
    percentile: number;
    trend: number; // positive = improvement
    icon: React.ElementType;
    color: string;
    gradient: string;
    description: string;
    unit: string;
    value: string;
}

const defaultDimensions: MotorDimension[] = [
    { id: 'speed', label: 'السرعة', labelEn: 'Speed', score: 82, percentile: 78, trend: 3.2, icon: Zap, color: 'text-yellow-500', gradient: 'from-yellow-400 to-orange-500', description: 'القدرة على تحريك الجسم بسرعة قصوى', unit: 'م/ثانية', value: '7.8' },
    { id: 'balance', label: 'التوازن', labelEn: 'Balance', score: 71, percentile: 65, trend: 1.1, icon: Shield, color: 'text-cyan-500', gradient: 'from-cyan-400 to-teal-500', description: 'الحفاظ على استقرار الجسم في أوضاع متغيرة', unit: 'نقطة', value: '71' },
    { id: 'agility', label: 'الرشاقة', labelEn: 'Agility', score: 89, percentile: 91, trend: 5.7, icon: Activity, color: 'text-blue-500', gradient: 'from-blue-400 to-indigo-500', description: 'القدرة على التغيير السريع للاتجاه', unit: 'ثانية', value: '9.2' },
    { id: 'coordination', label: 'التوافق الحركي', labelEn: 'Coordination', score: 68, percentile: 60, trend: -0.5, icon: Target, color: 'text-purple-500', gradient: 'from-purple-400 to-violet-500', description: 'تناسق حركة الأطراف وانسجامها', unit: 'نقطة', value: '68' },
    { id: 'reaction', label: 'رد الفعل', labelEn: 'Reaction', score: 77, percentile: 72, trend: 2.3, icon: Timer, color: 'text-rose-500', gradient: 'from-rose-400 to-pink-500', description: 'سرعة الاستجابة للمثيرات البصرية والصوتية', unit: 'مللي ثا', value: '220' },
    { id: 'power', label: 'القوة الانفجارية', labelEn: 'Power', score: 65, percentile: 58, trend: 2.0, icon: Dumbbell, color: 'text-orange-500', gradient: 'from-orange-400 to-red-500', description: 'القدرة على بذل قوة قصوى في وقت قصير', unit: 'سم', value: '42' },
    { id: 'flexibility', label: 'المرونة', labelEn: 'Flexibility', score: 80, percentile: 75, trend: 1.5, icon: StretchHorizontal, color: 'text-emerald-500', gradient: 'from-emerald-400 to-green-500', description: 'نطاق حركة المفاصل والعضلات', unit: 'سم', value: '18' },
];

// SVG Radar Chart
function RadarChart({ dimensions, size = 280 }: { dimensions: MotorDimension[]; size?: number }) {
    const center = size / 2;
    const maxRadius = size * 0.38;
    const levels = 5;
    const n = dimensions.length;
    const angleStep = (2 * Math.PI) / n;

    const getCoords = (angle: number, radius: number) => ({
        x: center + radius * Math.sin(angle),
        y: center - radius * Math.cos(angle),
    });

    const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * maxRadius);

    const dataPoints = dimensions.map((d, i) => {
        const angle = i * angleStep;
        const r = (d.score / 100) * maxRadius;
        return getCoords(angle, r);
    });
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    const avgScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            {/* Background grid levels */}
            {gridLevels.map((r, li) => {
                const pts = Array.from({ length: n }, (_, i) => {
                    const { x, y } = getCoords(i * angleStep, r);
                    return `${x},${y}`;
                }).join(' ');
                return (
                    <polygon
                        key={li}
                        points={pts}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={li === levels - 1 ? 1.5 : 0.8}
                        className={li === levels - 1 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-200 dark:text-slate-700/50'}
                        strokeDasharray={li < levels - 1 ? '2,3' : undefined}
                    />
                );
            })}

            {/* Axis lines & labels */}
            {dimensions.map((dim, i) => {
                const angle = i * angleStep;
                const outerPt = getCoords(angle, maxRadius + 8);
                const labelPt = getCoords(angle, maxRadius + 32);
                return (
                    <g key={dim.id}>
                        <line
                            x1={center} y1={center}
                            x2={outerPt.x} y2={outerPt.y}
                            stroke="currentColor" strokeWidth={0.8}
                            className="text-slate-300 dark:text-slate-600"
                        />
                        <text
                            x={labelPt.x} y={labelPt.y}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize="10" fontWeight="700"
                            className="fill-slate-500 dark:fill-slate-400"
                        >
                            {dim.label}
                        </text>
                    </g>
                );
            })}

            {/* Data fill */}
            <motion.path
                d={dataPath}
                fill="url(#motorGradient)"
                fillOpacity={0.25}
                stroke="url(#motorStrokeGradient)"
                strokeWidth={2.5}
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ transformOrigin: `${center}px ${center}px` }}
            />

            {/* Data points */}
            {dataPoints.map((p, i) => (
                <motion.circle
                    key={dimensions[i].id}
                    cx={p.x} cy={p.y} r={5}
                    fill="white" strokeWidth={2.5}
                    className="stroke-blue-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                />
            ))}

            {/* Center score */}
            <text x={center} y={center - 10} textAnchor="middle" fontSize="26" fontWeight="900" className="fill-slate-900 dark:fill-white">
                {avgScore}
            </text>
            <text x={center} y={center + 14} textAnchor="middle" fontSize="10" fontWeight="600" className="fill-slate-400 dark:fill-slate-500">
                نقطة مجمّعة
            </text>

            {/* Gradients */}
            <defs>
                <linearGradient id="motorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="motorStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function TrendBadge({ trend }: { trend: number }) {
    if (trend > 0) return (
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />+{trend}%
        </span>
    );
    if (trend < 0) return (
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full">
            <TrendingDown className="w-3 h-3" />{trend}%
        </span>
    );
    return (
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            <Minus className="w-3 h-3" /> ثابت
        </span>
    );
}

interface Props {
    dimensions?: MotorDimension[];
    loading?: boolean;
}

export function MotorProfileRadar({ dimensions = defaultDimensions, loading = false }: Props) {
    const [selectedDim, setSelectedDim] = useState<MotorDimension | null>(null);
    const [animatedScores, setAnimatedScores] = useState(dimensions.map(() => 0));

    useEffect(() => {
        // Animate bars on mount
        const timer = setTimeout(() => {
            setAnimatedScores(dimensions.map(d => d.score));
        }, 300);
        return () => clearTimeout(timer);
    }, [dimensions]);

    const avgScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);
    const topDim = [...dimensions].sort((a, b) => b.score - a.score)[0];
    const weakDim = [...dimensions].sort((a, b) => a.score - b.score)[0];

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-48" />
                <div className="h-[280px] bg-slate-200 dark:bg-slate-700 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">البصمة الحركية الرقمية</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">7 أبعاد لتحليل قدراتك الحركية الكاملة</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30 rounded-2xl px-4 py-2">
                    <span className="text-2xl font-black text-blue-700 dark:text-blue-300">{avgScore}</span>
                    <div className="text-left">
                        <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-semibold uppercase tracking-widest">النقاط</p>
                        <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-semibold uppercase tracking-widest">المجمّعة</p>
                    </div>
                </div>
            </div>

            {/* Main Layout: Radar + Dimension List */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Radar Chart */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-6 shadow-sm">
                    <RadarChart dimensions={dimensions} size={260} />

                    {/* Quick insights */}
                    <div className="mt-4 w-full grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30 p-3 text-center">
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold">الأقوى</p>
                            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{topDim.label}</p>
                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{topDim.score}</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 p-3 text-center">
                            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 font-semibold">للتطوير</p>
                            <p className="text-sm font-black text-amber-700 dark:text-amber-300">{weakDim.label}</p>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{weakDim.score}</p>
                        </div>
                    </div>
                </div>

                {/* Dimension Details */}
                <div className="lg:col-span-3 space-y-3">
                    {dimensions.map((dim, i) => (
                        <motion.button
                            key={dim.id}
                            onClick={() => setSelectedDim(selectedDim?.id === dim.id ? null : dim)}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.4 }}
                            className={cn(
                                'w-full text-right rounded-2xl border p-4 transition-all duration-200 group',
                                selectedDim?.id === dim.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300/50 dark:border-blue-600/30 shadow-sm'
                                    : 'bg-white dark:bg-white/5 border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-sm'
                            )}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={cn('p-2 rounded-xl flex-shrink-0',
                                        selectedDim?.id === dim.id ? 'bg-blue-100 dark:bg-blue-800/40' : 'bg-slate-100 dark:bg-white/5'
                                    )}>
                                        <dim.icon className={cn('w-4 h-4', dim.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{dim.label}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">{dim.labelEn}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendBadge trend={dim.trend} />
                                                <span className="text-base font-black text-slate-800 dark:text-slate-100">{dim.score}</span>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="relative h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className={cn('absolute inset-y-0 right-0 rounded-full bg-gradient-to-l', dim.gradient)}
                                                style={{ width: `${animatedScores[i]}%` }}
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${animatedScores[i]}%` }}
                                                transition={{ delay: 0.4 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-left">
                                    <p className="text-xs font-bold text-slate-400">{dim.value}</p>
                                    <p className="text-[10px] text-slate-400/70">{dim.unit}</p>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {selectedDim?.id === dim.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-700/30"
                                >
                                    <div className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{dim.description}</p>
                                            <div className="flex gap-4 mt-2">
                                                <div>
                                                    <p className="text-xs text-slate-400">الشريحة المئوية</p>
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">الـ {dim.percentile}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">التطور خلال شهر</p>
                                                    <p className={cn('text-sm font-bold', dim.trend > 0 ? 'text-emerald-600' : dim.trend < 0 ? 'text-rose-600' : 'text-slate-500')}>
                                                        {dim.trend > 0 ? '+' : ''}{dim.trend}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
