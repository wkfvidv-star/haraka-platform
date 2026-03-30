import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain, Zap, TrendingUp, TrendingDown, ArrowRight, Star,
  Dumbbell, Route, Target, AlertCircle, CheckCircle, Repeat, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StudentRec {
  id: string;
  name: string;
  avatar: string;
  class: string;
  color: string;
  category: 'elite' | 'average' | 'weak' | 'avoidant';
  pattern: string;
  patternDesc: string;
  recommendations: { type: 'exercise' | 'route' | 'behavior' | 'social'; title: string; desc: string; priority: 'high' | 'medium' | 'low' }[];
  behaviorFlags: string[];
}

const RECS: StudentRec[] = [
  {
    id: 'st1', name: 'نور حمداني', avatar: 'ن', class: 'القسم 5أ', color: '#8b5cf6',
    category: 'elite',
    pattern: 'متسق دائماً',
    patternDesc: 'يؤدي نفس الأنماط عالية الأداء في كل جلسة. ملتزم تماماً بالمسارات.',
    behaviorFlags: ['⚡ أداء استثنائي', '📍 التزام كامل بالمسار', '🏆 دائماً في المقدمة'],
    recommendations: [
      { type: 'route', title: 'مسار متقدم جبلي', desc: 'يحتاج تحديات أصعب — مسار 6 كم بارتفاعات متغيرة.', priority: 'high' },
      { type: 'social', title: 'تعيينه قائداً', desc: 'إشراكه كمرشد لمساعدة التلاميذ الضعفاء.', priority: 'medium' },
      { type: 'exercise', title: 'برنامج تنافسي', desc: 'تقديمه لبطولات محلية لاكتشاف قدراته الكاملة.', priority: 'medium' },
    ],
  },
  {
    id: 'st2', name: 'ياسين محمود', avatar: 'ي', class: 'القسم 4أ', color: '#3b82f6',
    category: 'average',
    pattern: 'أداء متصاعد',
    patternDesc: 'يتحسن أسبوعياً مع وجود بعض التوقفات غير المبررة. إمكانية كبيرة غير مستغلة.',
    behaviorFlags: ['📈 تحسن مستمر', '⏸ بعض التوقفات', '💪 إمكانيات متميزة'],
    recommendations: [
      { type: 'exercise', title: 'تمارين استقرار السرعة', desc: 'فترات جري ثابتة 5 دقائق بدون توقف للتدرج.', priority: 'high' },
      { type: 'route', title: 'مسار متوسط مع تحديات', desc: 'زيادة طول المسار بـ 500 م كل أسبوع.', priority: 'medium' },
      { type: 'behavior', title: 'متابعة دورية', desc: 'اجتماع أسبوعي قصير لمراجعة التوقفات وأسبابها.', priority: 'low' },
    ],
  },
  {
    id: 'st3', name: 'سارة بوزيد', avatar: 'س', class: 'القسم 4ب', color: '#f59e0b',
    category: 'weak',
    pattern: 'نشاط خفيف متكرر',
    patternDesc: 'تكرر نفس النمط الضعيف في كل جلسة. لا تتجاوز حدود المريح.',
    behaviorFlags: ['🐢 بطء منتظم', '🔁 نفس النمط الضعيف', '😔 لا مبادرة'],
    recommendations: [
      { type: 'exercise', title: 'مشي جماعي محفز', desc: 'إشراكها في مجموعة صغيرة مع مرافقة شخصية.', priority: 'high' },
      { type: 'route', title: 'مسار مبتدئ قصير', desc: 'بدء بـ 1 كم مريح لبناء الثقة تدريجياً.', priority: 'high' },
      { type: 'behavior', title: 'نظام مكافآت', desc: 'منحها نقاط مميزة عند تجاوز مسافة 1.5 كم.', priority: 'medium' },
    ],
  },
  {
    id: 'st4', name: 'كريم معروف', avatar: 'ك', class: 'القسم 4ب', color: '#ef4444',
    category: 'avoidant',
    pattern: 'تجنب النشاط',
    patternDesc: 'يتجنب النشاط بشكل منتظم. مسجّل GPS يظهر بقاء في مكان ثابت أو خروج عن النطاق.',
    behaviorFlags: ['🚫 رفض متكرر', '📍 خروج عن المسار', '🆘 يحتاج تدخلاً عاجلاً'],
    recommendations: [
      { type: 'behavior', title: 'تدخل أخصائي نفسي', desc: 'التحقيق في أسباب تجنب النشاط الجسدي بشكل عميق.', priority: 'high' },
      { type: 'social', title: 'اجتماع ولي الأمر', desc: 'إشراك الأسرة في برنامج تشجيع منزلي موازٍ.', priority: 'high' },
      { type: 'exercise', title: 'نشاط بديل محفز', desc: 'تقديم خيارات لعبة ممتعة بدلاً من الجري المباشر.', priority: 'medium' },
    ],
  },
];

const categoryConfig = {
  elite:    { label: 'نجم متقدم',   color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Star,      iconColor: 'text-purple-500' },
  average:  { label: 'متوسط صاعد', color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: TrendingUp, iconColor: 'text-blue-500' },
  weak:     { label: 'يحتاج تنمية', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-500' },
  avoidant: { label: 'يتجنب النشاط', color: 'bg-red-100 text-red-700 border-red-200',        icon: TrendingDown, iconColor: 'text-red-500' },
};

const recTypeConfig = {
  exercise: { icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  route:    { icon: Route,    color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  behavior: { icon: Brain,    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  social:   { icon: Users,   color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
};

const priorityBadge = {
  high:   'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  low:    'bg-slate-50 text-slate-500 border-slate-200',
};

const priorityLabel = { high: 'عاجل', medium: 'مهم', low: 'اختياري' };

export function GPSRecommendations() {
  const [selectedId, setSelectedId] = useState<string>('st1');
  const [appliedRecs, setAppliedRecs] = useState<Set<string>>(new Set());

  const selected = RECS.find(r => r.id === selectedId)!;

  const toggleApply = (key: string) => {
    setAppliedRecs(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">

      {/* ─ Header ─ */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">التوصيات الذكية للأستاذ</h2>
          <p className="text-sm text-slate-500 font-semibold">اقتراحات مخصصة بناءً على تحليل سلوك GPS لكل تلميذ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* ─ Student Selector ─ */}
        <div className="xl:col-span-1 space-y-3">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">اختر التلميذ</p>
          {RECS.map(rec => {
            const cfg = categoryConfig[rec.category];
            const Icon = cfg.icon;
            return (
              <motion.button
                key={rec.id}
                onClick={() => setSelectedId(rec.id)}
                whileHover={{ scale: 1.01 }}
                className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                  selectedId === rec.id
                    ? 'border-indigo-400 bg-indigo-50/50 shadow-indigo-100 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ backgroundColor: rec.color }}>
                    {rec.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-900 truncate">{rec.name}</p>
                    <Badge className={`mt-1 text-[9px] px-1.5 py-0 border rounded-full ${cfg.color}`}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ─ Recommendations Panel ─ */}
        <div className="xl:col-span-3 space-y-5">
          {/* Student Summary */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md"
                  style={{ backgroundColor: selected.color }}>
                  {selected.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-black text-xl text-slate-900">{selected.name}</span>
                    <span className="text-sm text-slate-400 font-semibold">{selected.class}</span>
                    <Badge className={`text-xs px-2 py-0.5 border rounded-full ${categoryConfig[selected.category].color}`}>
                      {categoryConfig[selected.category].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{selected.pattern}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed">{selected.patternDesc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selected.behaviorFlags.map((flag, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              التوصيات المقترحة ({selected.recommendations.length})
            </h3>
            <div className="space-y-3">
              {selected.recommendations.map((rec, idx) => {
                const cfg = recTypeConfig[rec.type];
                const Icon = cfg.icon;
                const key = `${selected.id}-${idx}`;
                const applied = appliedRecs.has(key);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                  >
                    <Card className={`border shadow-sm transition-all ${applied ? 'border-green-300 bg-green-50/30' : `border ${cfg.border}`}`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-black text-sm text-slate-900">{rec.title}</span>
                            <Badge className={`text-[9px] px-2 py-0 border rounded-full ${priorityBadge[rec.priority]}`}>
                              {priorityLabel[rec.priority]}
                            </Badge>
                            {applied && (
                              <Badge className="text-[9px] px-2 py-0 bg-green-50 text-green-700 border-green-200 border rounded-full">
                                ✅ تم التطبيق
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 font-semibold">{rec.desc}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => toggleApply(key)}
                          className={`shrink-0 h-9 text-xs font-bold gap-1.5 transition-all ${
                            applied
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 shadow-none'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {applied ? (
                            <><CheckCircle className="w-3.5 h-3.5" />مطبّق</>
                          ) : (
                            <><ArrowRight className="w-3.5 h-3.5" />تطبيق</>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Global AI Insight */}
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-black text-sm text-indigo-800 mb-1">تحليل السلوك الشامل</p>
                <p className="text-sm text-indigo-700 font-semibold leading-relaxed">
                  {selected.category === 'avoidant'
                    ? 'هذا التلميذ يظهر نمطاً ثابتاً من تجنب النشاط. التدخل الفوري مع ولي الأمر والأخصائي النفسي ضروري قبل مواصلة أي برنامج رياضي.'
                    : selected.category === 'elite'
                    ? 'هذا التلميذ يتجاوز الأهداف المحددة باستمرار. استثمر طاقته بتحديات أكبر وأدوار قيادية لتنمية مهاراته القيادية.'
                    : selected.category === 'weak'
                    ? 'التلميذ يحتاج بيئة داعمة آمنة. ابدأ بأهداف صغيرة قابلة التحقيق لبناء الثقة بالنفس قبل رفع مستوى الصعوبة.'
                    : 'التلميذ على المسار الصحيح مع إمكانيات غير مستغلة. زيادة التحديات التدريجية ستساعده في تحقيق أداء متميز.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
