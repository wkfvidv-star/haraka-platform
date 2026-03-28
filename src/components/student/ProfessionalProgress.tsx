import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { analyticsService, PerformanceMetric, WeeklyData, Achievement } from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Calendar,
  Award,
  Zap,
  Heart,
  Timer,
  Star,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

// Types moved to analyticsService

// Initial state will be loaded from service

export function ProfessionalProgress() {
  const [selectedPeriod, setSelectedPeriod] = useState('شهر');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyData[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [perf, weekly, achs] = await Promise.all([
            analyticsService.getStudentPerformance(user.id),
            analyticsService.getWeeklyData(user.id),
            analyticsService.getAchievements(user.id)
          ]);
          setMetrics(perf);
          setWeeklyStats(weekly);
          setUserAchievements(achs);
        }
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const periods = ['أسبوع', 'شهر', '3 أشهر', '6 أشهر', 'سنة'];
  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'التوازن', 'التناسق', 'السرعة'];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'decrease': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-400';
      case 'decrease': return 'text-red-400';
      case 'stable': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getMetricColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredMetrics = selectedCategory === 'الكل'
    ? metrics
    : metrics.filter(metric => metric.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="glass-card border-green-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-green-600/10 mix-blend-overlay pointer-events-none" />
        <CardHeader className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <CardTitle className="text-3xl font-black flex items-center gap-3 text-white">
                <div className="p-2 rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                  <BarChart3 className="h-7 w-7 text-green-400" />
                </div>
                <span>تحليل الأداء المتقدم (Pro Analytics)</span>
              </CardTitle>
              <CardDescription className="text-green-200/70 font-bold text-base mt-2">
                تتبع شامل ومفصل لتطورك الرياضي مع مؤشرات حيوية دقيقة وتحليلات أسبوعية
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-black h-11 px-6 rounded-xl">
                <Download className="h-4 w-4 ml-2" />
                تصدير التقرير
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-black h-11 px-6 rounded-xl">
                <Filter className="h-4 w-4 ml-2" />
                تخصيص العرض
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Period and Category Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card border-white/5 bg-white/[0.02]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-white">الفترة الزمنية (Period)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  onClick={() => setSelectedPeriod(period)}
                  className={`h-10 px-6 font-black rounded-lg transition-all ${selectedPeriod === period ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/[0.02]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-white">فئة المؤشرات (Category)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`h-10 px-6 font-black rounded-lg transition-all ${selectedCategory === category ? 'bg-green-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} className="glass-card group hover:scale-[1.03] transition-all duration-300 border-white/10 shadow-2xl relative overflow-hidden">
            <CardHeader className="pb-4 relative z-10 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black text-white group-hover:text-blue-300 transition-colors uppercase tracking-tight">{metric.name}</CardTitle>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-black ${getChangeColor(metric.changeType)}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 relative z-10">
              <div className="text-center relative">
                <div className="text-5xl font-black text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {metric.value}<span className="text-xl text-gray-500 mr-1">{metric.unit}</span>
                </div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  الهدف المخطط له: {metric.target}{metric.unit}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>نسبة الإنجاز (Completion)</span>
                  <span className="text-white">{Math.round((metric.value / metric.target) * 100)}%</span>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  className={`h-2.5 bg-white/5 border border-white/5 [&>div]:${getMetricColor(metric.color)}`}
                />
              </div>

              <div className="flex justify-center border-t border-white/5 pt-4">
                <Badge variant="outline" className="flex items-center gap-2 bg-white/5 text-gray-400 font-bold border-white/10 hover:text-white transition-colors cursor-default">
                  <div className={`w-2.5 h-2.5 rounded-full ${getMetricColor(metric.color)} shadow-inner`}></div>
                  {metric.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <Card className="glass-card border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <span>التطور الأسبوعي (Weekly Trends)</span>
          </CardTitle>
          <CardDescription className="text-gray-400 font-bold">
            تتبع الأنشطة المنجزة والسعرات المحروقة عبر الـ 6 أسابيع الماضية
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-10">
            <div className="h-72 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex items-end justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
              {weeklyStats.map((week, index) => (
                <div key={week.week} className="flex flex-col items-center gap-4 group/bar relative z-10 w-full">
                  <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">
                    {week.exercises} تمرين
                  </div>
                  <div
                    className="bg-blue-500/80 rounded-t-xl w-10 md:w-16 transition-all duration-500 hover:bg-blue-400 hover:scale-x-105 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    style={{
                      height: `${(week.exercises / Math.max(...weeklyStats.map(w => w.exercises), 1)) * 180}px`,
                      minHeight: '30px'
                    }}
                  ></div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mt-2">
                    {week.week}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="text-right p-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">الأسبوع</th>
                    <th className="text-center p-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">التمارين</th>
                    <th className="text-center p-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">النقاط</th>
                    <th className="text-center p-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">المدة (دقيقة)</th>
                    <th className="text-center p-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">السعرات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {weeklyStats.map((week, index) => (
                    <tr key={week.week} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 font-black text-white">{week.week}</td>
                      <td className="text-center p-4 text-blue-300 font-bold">{week.exercises}</td>
                      <td className="text-center p-4 text-yellow-500 font-bold">{week.points}</td>
                      <td className="text-center p-4 text-green-300 font-bold">{week.duration}</td>
                      <td className="text-center p-4 text-orange-400 font-bold">{week.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/20">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <span>تقدم الإنجازات (Milestones)</span>
          </CardTitle>
          <CardDescription className="text-gray-400 font-bold">
            شارة "خبير" تلوح في الأفق! تتبع تقدمك نحو أهدافك الرياضية الكبرى
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl group/ach hover:bg-white/10 transition-all shadow-xl">
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <div className="text-5xl group-hover/ach:scale-110 transition-transform drop-shadow-xl">{achievement.icon}</div>
                  <div>
                    <h4 className="text-lg font-black text-white">{achievement.name}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1">{achievement.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>التقدم الحالي</span>
                    <span className="text-white">{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress
                    value={(achievement.progress / achievement.total) * 100}
                    className="h-2 bg-white/5 [&>div]:bg-yellow-500 border border-white/5"
                  />
                  <div className="text-[10px] font-black text-yellow-500 text-center uppercase tracking-widest">
                    مكتمل بنسبة {Math.round((achievement.progress / achievement.total) * 100)}%
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="glass-card border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20">
                <PieChart className="h-5 w-5 text-purple-400" />
              </div>
              <span>خريطة الأداء الشاملة (Radar)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="relative h-72 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
              <div className="text-center relative z-10">
                <div className="text-6xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {metrics.length > 0 ? Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length) : 0}
                  <span className="text-2xl text-gray-500 mr-1">%</span>
                </div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">المستوى العام (Total Level)</div>
              </div>

              {[
                { label: 'القوة', color: 'bg-blue-500', pos: 'top-4 left-1/2 -translate-x-1/2' },
                { label: 'التحمل', color: 'bg-green-500', pos: 'top-1/2 right-4 -translate-y-1/2' },
                { label: 'المرونة', color: 'bg-purple-500', pos: 'bottom-4 right-12' },
                { label: 'التوازن', color: 'bg-orange-500', pos: 'bottom-4 left-12' },
                { label: 'التناسق', color: 'bg-pink-500', pos: 'top-1/2 left-4 -translate-y-1/2' }
              ].map((point, i) => (
                <div key={i} className={`absolute ${point.pos} flex flex-col items-center gap-2 group/point transition-all`}>
                  <div className={`w-3 h-3 ${point.color} rounded-full ring-4 ring-white/5 group-hover/point:scale-125 transition-transform`} />
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter group-hover/point:text-white transition-colors">{point.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl font-black flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
                <Target className="h-5 w-5 text-red-500" />
              </div>
              <span>الأهداف والتحديات المخطط لها</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {[
              { title: 'هدف الشهر', desc: 'إكمال 30 تمرين متنوع', current: 22, total: 30, color: 'bg-blue-600', text: 'text-blue-300', bg: 'bg-blue-500/10' },
              { title: 'تحدي الأسبوع', desc: 'حرق 2000 سعرة حرارية', current: 1200, total: 2000, color: 'bg-green-600', text: 'text-green-300', bg: 'bg-green-500/10' },
              { title: 'هدف طويل المدى', desc: 'الوصول لمستوى متقدم في جميع المؤشرات', current: 35, total: 100, color: 'bg-purple-600', text: 'text-purple-300', bg: 'bg-purple-500/10' }
            ].map((goal, i) => (
              <div key={i} className={`p-6 ${goal.bg} border border-white/5 rounded-3xl transition-all hover:bg-white/5 group/goal`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-white">{goal.title}</h4>
                  <Badge variant="outline" className={`border-white/10 ${goal.text} font-black uppercase text-[10px]`}>نشط</Badge>
                </div>
                <p className="text-sm font-bold text-gray-400 group-hover/goal:text-gray-300 transition-colors mb-6 leading-relaxed">
                  {goal.desc}
                </p>
                <div className="space-y-2">
                  <Progress value={(goal.current / goal.total) * 100} className={`h-2.5 bg-white/5 border border-white/5 [&>div]:${goal.color}`} />
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">
                    <span>نسبة الإنجاز (Status)</span>
                    <span className="text-white">{goal.current}/{goal.total} ({Math.round((goal.current / goal.total) * 100)}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}