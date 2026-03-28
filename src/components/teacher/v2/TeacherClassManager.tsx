import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreVertical, MessageSquare, AlertCircle, TrendingUp, ChevronDown, MapPin, Users, CheckCircle2, Activity, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useTeacherClassData } from '@/hooks/useTeacherClassData';

export function TeacherClassManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const { students: teacherStudents, stats } = useTeacherClassData();

  const filteredStudents = useMemo(() => {
    return teacherStudents.filter(s => s.name.includes(searchTerm));
  }, [searchTerm, teacherStudents]);

  const totalStudents = stats.totalStudents;
  const activeStudents = stats.activeStudents;
  const needsAttention = stats.inactiveStudents;
  const avgProgress = stats.averageProgress;

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 bg-[#F9F9F8] min-h-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-blue-600" />
             إدارة القسم <span className="text-slate-400 font-medium">| النظرة الشاملة</span>
          </h2>
          <p className="text-base text-slate-500 mt-2 font-medium">متابعة دقيقة لمؤشرات أداء التلاميذ اللحظية، مستمدة من محرك الذكاء الاصطناعي.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute right-4 top-3.5 text-slate-400" />
            <Input 
              className="pr-12 h-12 text-base font-bold w-full bg-white border-slate-200 placeholder:text-slate-400 rounded-2xl shadow-sm focus-visible:ring-blue-500" 
              placeholder="ابحث عن اسم التلميذ..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 text-base font-bold text-slate-700 bg-white border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50">
            <Filter className="w-5 h-5 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* TOP KPI WIDGETS (BENTO GRID STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Widget 1 */}
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10 text-right">
               <p className="text-slate-500 font-extrabold text-sm uppercase tracking-widest mb-1">العدد الإجمالي</p>
               <h3 className="text-5xl font-black text-slate-900">{totalStudents}</h3>
               <p className="text-emerald-500 text-sm font-bold mt-2 flex items-center gap-1">
                 <CheckCircle2 className="w-4 h-4" /> {activeStudents} نشط حالياً
               </p>
            </div>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
               <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50"></div>
         </div>

         {/* Widget 2 */}
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10 text-right">
               <p className="text-slate-500 font-extrabold text-sm uppercase tracking-widest mb-1">متوسط إنجاز المناهج</p>
               <h3 className="text-5xl font-black text-emerald-600">{avgProgress}%</h3>
               <p className="text-slate-400 text-sm font-bold mt-2 flex items-center gap-1">
                 <TrendingUp className="w-4 h-4" /> معدل متقدم
               </p>
            </div>
            {/* Circular Progress mini */}
            <div className="relative w-24 h-24 flex items-center justify-center relative z-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={251} strokeDashoffset={251 - (251 * avgProgress) / 100}
                        className="text-emerald-500 transition-all duration-1000 ease-out" />
              </svg>
              <Activity className="absolute w-8 h-8 text-emerald-600" />
            </div>
         </div>

         {/* Widget 3 */}
         <div className="bg-gradient-to-br from-rose-500 to-red-600 p-6 rounded-[2rem] border border-red-400 shadow-md shadow-red-500/20 flex flex-col justify-between relative overflow-hidden text-white group">
            <div className="flex justify-between items-start relative z-10">
               <div>
                  <p className="text-red-100 font-extrabold text-sm uppercase tracking-widest mb-1">بحاجة للتدخل</p>
                  <h3 className="text-5xl font-black">{needsAttention} <span className="text-2xl font-bold opacity-80">تلاميذ</span></h3>
               </div>
               <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <AlertTriangle className="w-7 h-7 text-white" />
               </div>
            </div>
            <div className="relative z-10 mt-4">
              <Button className="w-full bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl h-10 text-sm">
                مراسلة المتأخرين فوراً
              </Button>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
         </div>
      </div>

      {/* STUDENT CARDS GRID */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-400" />
          البطاقات الفردية للتلاميذ (مباشر)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 && (
             <div className="col-span-full border-2 border-dashed border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center text-slate-500 bg-white/50">
               <Users className="w-16 h-16 mb-4 text-slate-300" />
               <span className="text-2xl font-black text-slate-400">لا توجد تطابقات للبحث</span>
             </div>
          )}
          
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
               {/* Header: Avatar, Name, Status */}
               <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                     <div className="relative">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-black text-2xl uppercase shadow-inner border border-blue-200/50">
                          {student.name.charAt(0)}
                       </div>
                       <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${student.status === 'نشط' ? 'bg-emerald-500' : student.status === 'متأخر' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">{student.name}</h4>
                        <p className="text-sm font-bold text-slate-500 mt-1">{student.level}</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
               </div>

               {/* Stats: XP & Last Active */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                     <p className="text-xs font-bold text-slate-400 mb-1">النقاط המكتسبة</p>
                     <p className="text-lg font-black text-slate-800">{student.points.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                     <p className="text-xs font-bold text-slate-400 mb-1">اليوم الأخير</p>
                     <p className="text-sm font-bold text-slate-700 mt-1">{student.lastActivity}</p>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="mb-6">
                  <div className="flex justify-between text-sm font-bold mb-2">
                     <span className="text-slate-600">الإنجاز المنهجي</span>
                     <span className={student.progress > 75 ? 'text-emerald-600' : student.progress > 40 ? 'text-amber-600' : 'text-rose-600'}>{student.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ${student.progress > 75 ? 'bg-emerald-500' : student.progress > 40 ? 'bg-amber-400' : 'bg-rose-500'}`}
                       style={{ width: `${student.progress}%` }}
                     ></div>
                  </div>
               </div>

               {/* Actions */}
               <div className="mt-auto grid grid-cols-2 gap-3">
                  <Button className="w-full bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors h-12 shadow-md">
                    الملف الشخصي
                  </Button>
                  <Button variant="outline" className="w-full font-bold rounded-xl border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors h-12">
                    <MessageSquare className="w-4 h-4 ml-2" /> مراسلة
                  </Button>
               </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
