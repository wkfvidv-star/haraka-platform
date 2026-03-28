import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart4, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function CoachAnalytics() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">التحليلات ومعدلات النمو</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">نظرة شاملة باستخدام الرسوم البيانية لأداء النادي المالي والتدريبي.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <Button onClick={() => toast('جاري عرض إحصائيات العام...')} variant="ghost" className="rounded-lg font-bold text-slate-500 hover:text-slate-900">هذا العام</Button>
          <Button onClick={() => toast('جاري عرض إحصائيات الشهر...')} className="rounded-lg font-bold bg-blue-50 text-blue-700 shadow-none">هذا الشهر</Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">نمو المشتركين الجدد</h3>
            <div className="flex items-end justify-between">
              <h4 className="text-4xl font-black text-slate-900">+42</h4>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" /> 12%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">معدل التزام التدريب الحضور</h3>
            <div className="flex items-end justify-between">
              <h4 className="text-4xl font-black text-slate-900">89%</h4>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" /> 4%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">طلبات الإلغاء (Churn Rate)</h3>
            <div className="flex items-end justify-between">
              <h4 className="text-4xl font-black text-slate-900">2%</h4>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowDownRight className="w-4 h-4" /> 1.5%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS AREA (Visual Mocks showing layout for Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART */}
        <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BarChart4 className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-slate-900">مؤشر فقدان المتدربين للوزن الإجمالي</h3>
              </div>
              <Button onClick={() => toast.success('جاري تصدير التقرير بصيغة PDF وسيتم تحميله فوراً.')} variant="outline" className="rounded-xl font-bold text-slate-600">تصدير التقرير PDF</Button>
            </div>
            
            {/* Mock Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-100 pb-4 pl-4 pt-10">
              {[40, 55, 45, 70, 65, 80, 75, 95, 85, 100, 90, 110].map((h, i) => (
                <div key={i} className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-600 cursor-pointer transition-colors relative group" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {h} KG
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
               <span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span><span>يوليو</span><span>أغسطس</span><span>سبتمبر</span><span>أكتوبر</span><span>نوفمبر</span><span>ديسمبر</span>
            </div>
          </CardContent>
        </Card>

        {/* SECONDARY CHART */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-8 h-full flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900">توزيع كثافة التمرين</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Mock Donut Chart */}
              <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 relative flex items-center justify-center">
                 <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-blue-600 border-r-blue-600 transform rotate-45"></div>
                 <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-orange-500 transform -rotate-45"></div>
                 <div className="text-center">
                    <span className="text-3xl font-black text-slate-900">140</span>
                    <p className="text-sm font-bold text-slate-400">جلسة نشطة</p>
                 </div>
              </div>
              <div className="w-full space-y-3 mt-4">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span> قوة عضلية</div>
                   <span>60%</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> حرق ومقاومة (HIIT)</div>
                   <span>25%</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200"></span> استرخاء</div>
                   <span>15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
