import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Activity, ArrowUpRight } from 'lucide-react';

const ActivityStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5 text-[#0ea5e9]" />
            إحصائيات النشاط
          </CardTitle>
          <CardDescription>
            تحليل شامل لنشاط المستخدمين وتفاعلهم مع النظام في الوقت الحقيقي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'إجمالي المستخدمين', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
              { label: 'مستخدمين نشطين', value: '892', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%' },
              { label: 'معدل التفاعل', value: '85%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+2%' },
              { label: 'جلسات اليوم', value: '2,341', icon: BarChart3, color: 'text-sky-600', bg: 'bg-sky-50', trend: '+18%' }
            ].map((stat, idx) => (
              <div key={idx} className="relative overflow-hidden group p-5 bg-white/80 border border-blue-50/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 ${stat.bg} ${stat.color} rounded-xl`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-xs font-bold text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/30">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              تفصيل النشاط حسب الفئة
            </h3>

            <div className="grid gap-6">
              {[
                { label: 'الطلاب', value: 75, color: 'bg-blue-500' },
                { label: 'المعلمون', value: 65, color: 'bg-indigo-500' },
                { label: 'أولياء الأمور', value: 45, color: 'bg-sky-500' },
                { label: 'المدربون', value: 85, color: 'bg-[#0ea5e9]' }
              ].map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700">{category.label}</span>
                    <span className="font-black text-blue-600">{category.value}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-700 rounded-full`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityStatistics;
