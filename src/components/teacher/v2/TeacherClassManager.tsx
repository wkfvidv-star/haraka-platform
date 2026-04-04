import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreVertical, MessageSquare, AlertCircle, TrendingUp, ChevronDown, MapPin, Users, CheckCircle2, Activity, AlertTriangle, ChevronLeft, FileText, Video } from 'lucide-react';
import { useTeacherClassData } from '@/hooks/useTeacherClassData';

interface TeacherClassManagerProps {
  onNavigate?: (tab: string) => void;
}

export function TeacherClassManager({ onNavigate }: TeacherClassManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('الكل');
  const [messagingStudent, setMessagingStudent] = useState<any>(null);
  const [messageType, setMessageType] = useState<'text' | 'meeting'>('text');
  const [messageText, setMessageText] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any>(null);
  const [profileTab, setProfileTab] = useState('overview');
  const { activeClassStudents, stats } = useTeacherClassData();

  const filteredStudents = useMemo(() => {
    return activeClassStudents.filter(s => {
      const matchSearch = s.name.includes(searchTerm);
      const matchLevel = levelFilter === 'الكل' || (s.level && s.level.includes(levelFilter));
      return matchSearch && matchLevel;
    });
  }, [searchTerm, levelFilter, activeClassStudents]);

  const totalStudents = stats.totalStudents;
  const activeStudents = stats.activeStudents;
  const needsAttention = stats.inactiveStudents;
  const avgProgress = stats.averageProgress;

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 bg-[#F9F9F8] min-h-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
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
          <select 
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="h-12 px-4 text-base font-bold text-slate-700 bg-white border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 appearance-none pr-8 cursor-pointer relative"
          >
            <option value="الكل">جميع المستويات</option>
            <option value="ابتدائي">الابتدائي</option>
            <option value="متوسط">المتوسط</option>
            <option value="ثانوي">الثانوي</option>
          </select>
        </div>
      </div>

      {/* MESSAGING MODAL */}
      {messagingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-900 mb-2">التواصل مع ولي الأمر</h3>
            <p className="text-sm font-bold text-slate-500 mb-6">ولي التلميذ: {messagingStudent.name}</p>
            
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setMessageType('text')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${messageType === 'text' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>رسالة نصية</button>
              <button onClick={() => setMessageType('meeting')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${messageType === 'meeting' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-800'}`}>طلب اجتماع</button>
            </div>

            {messageType === 'text' ? (
              <textarea 
                placeholder="اكتب رسالتك لولي الأمر هنا..."
                className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl resize-none focus:ring-4 focus:ring-blue-50/50 outline-none transition-colors hover:border-blue-300 font-medium text-slate-800"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
              />
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800">
                <p className="font-bold mb-2">سيتم إرسال دعوة لاجتماع افتراضي:</p>
                <input type="datetime-local" className="w-full p-3 rounded-lg border border-emerald-200 bg-white font-medium text-sm mt-2" />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => {
                  setIsSendingMsg(true);
                  setTimeout(() => {
                    setIsSendingMsg(false);
                    setMessagingStudent(null);
                    setMessageText('');
                    // Mock Audit Log
                    const typeStr = messageType === 'text' ? 'رسالة نصية' : 'طلب اجتماع';
                    console.log(`[Audit Log] الأستاذ أرسل ${typeStr} لولي أمر التلميذ ${messagingStudent.name}`);
                  }, 1500);
                }}
                disabled={isSendingMsg || (messageType === 'text' && !messageText.trim())}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
              >
                {isSendingMsg ? 'جاري الإرسال...' : 'إرسال لولي الأمر'}
              </Button>
              <Button variant="outline" onClick={() => setMessagingStudent(null)} className="h-12 w-24 rounded-xl font-bold border-slate-200 text-slate-600">إلغاء</Button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE MODAL */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm rtl">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 shrink-0">
               <div className="flex gap-6 items-center">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-4xl shadow-xl shadow-blue-900/20">
                    {selectedStudentProfile.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedStudentProfile.name}</h2>
                    <div className="flex gap-3 mt-2">
                      <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm">{selectedStudentProfile.level}</span>
                      <span className={`font-bold px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                        selectedStudentProfile.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 
                        selectedStudentProfile.status === 'متأخر' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                         <div className={`w-2 h-2 rounded-full ${selectedStudentProfile.status === 'نشط' ? 'bg-emerald-500' : selectedStudentProfile.status === 'متأخر' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                         {selectedStudentProfile.status}
                      </span>
                    </div>
                 </div>
               </div>
               <Button variant="ghost" onClick={() => setSelectedStudentProfile(null)} className="rounded-xl w-12 h-12 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900">
                  <span className="text-xl">✕</span>
               </Button>
            </div>

            {/* Profile Tabs */}
            <div className="px-8 border-b border-slate-200 flex gap-6 shrink-0 bg-white">
              {['overview', 'activities', 'reports', 'evaluation'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`py-4 px-2 font-bold text-base transition-all border-b-4 ${
                    profileTab === tab 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab === 'overview' ? 'نظرة عامة' : tab === 'activities' ? 'النشاطات' : tab === 'reports' ? 'التقارير' : 'التقييم'}
                </button>
              ))}
            </div>

            {/* Profile Content */}
            <div className="p-8 flex-1 overflow-y-auto bg-slate-50/30">
              
              {/* --- OVERVIEW TAB --- */}
              {profileTab === 'overview' && (
                 <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-400 font-bold mb-1">التقدم المنهجي</p>
                        <h4 className={`text-4xl font-black ${selectedStudentProfile.progress > 75 ? 'text-emerald-600' : selectedStudentProfile.progress > 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {selectedStudentProfile.progress}%
                        </h4>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-400 font-bold mb-1">النقاط الكلية</p>
                        <h4 className="text-4xl font-black text-blue-600">{selectedStudentProfile.points}</h4>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <h4 className="text-emerald-800 font-black mb-3">نقاط القوة</h4>
                        <div className="flex flex-wrap gap-2">
                           {selectedStudentProfile.strengths.length > 0 ? selectedStudentProfile.strengths.map((s: string) => (
                             <span key={s} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">{s}</span>
                           )) : <span className="text-emerald-600/50 text-sm font-bold">لا يوجد بيانات</span>}
                        </div>
                     </div>
                     <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                        <h4 className="text-rose-800 font-black mb-3">نقاط الضعف</h4>
                        <div className="flex flex-wrap gap-2">
                           {selectedStudentProfile.weaknesses.length > 0 ? selectedStudentProfile.weaknesses.map((w: string) => (
                             <span key={w} className="bg-rose-100 text-rose-700 px-3 py-1 rounded-lg text-sm font-bold">{w}</span>
                           )) : <span className="text-rose-600/50 text-sm font-bold">لا توجد ملاحظات سلبية</span>}
                        </div>
                     </div>
                   </div>
                 </div>
              )}

              {/* --- ACTIVITIES TAB --- */}
              {profileTab === 'activities' && (
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">النشاطات الأخيرة</h3>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                           <h4 className="font-bold text-slate-900">تمرين التوازن - المستوى {i}</h4>
                           <p className="text-sm font-medium text-slate-500 mt-1">تم الإنجاز بنجاح</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">منذ {i} أيام</span>
                      </div>
                    ))}
                 </div>
              )}

              {/* --- REPORTS TAB --- */}
              {profileTab === 'reports' && (
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">التقارير الدورية</h3>
                    <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center">
                       <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                       <h4 className="font-bold text-slate-700 mb-1">توليد تقرير جديد</h4>
                       <p className="text-sm text-slate-500 mb-4">تصدير تقرير شامل لأداء التلميذ مع توصيات الذكاء الاصطناعي</p>
                       <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6">إنشاء الآن</Button>
                    </div>
                 </div>
              )}

              {/* --- EVALUATION TAB --- */}
              {profileTab === 'evaluation' && (
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">المهام قيد التقييم</h3>
                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
                       <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                             <Video className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900">اختبار التوازن والثبات (فيديو)</h4>
                             <p className="text-sm font-medium text-slate-500 mt-1">تم الرفع اليوم, بانتظار تقييمك وتسجيل الملاحظات.</p>
                          </div>
                       </div>
                       <Button onClick={() => {
                          setSelectedStudentProfile(null);
                          if (onNavigate) onNavigate('video-review');
                       }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 h-12 shadow-md">
                          مراجعة
                       </Button>
                    </div>
                 </div>
              )}

            </div>
          </div>
        </div>
      )}

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
                  <Button onClick={() => { setSelectedStudentProfile(student); setProfileTab('overview'); }} className="w-full bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors h-12 shadow-md">
                    الملف الشخصي
                  </Button>
                  <Button onClick={() => setMessagingStudent(student)} variant="outline" className="w-full font-bold rounded-xl border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors h-12">
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
