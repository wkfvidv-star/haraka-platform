import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, FileText, TrendingUp, TrendingDown, Activity, Brain, ShieldCheck, CheckCircle2, SlidersHorizontal, Settings2, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useTeacherClassData } from '@/hooks/useTeacherClassData';

// Mock historical data for charts
const performanceHistory = [
  { month: 'سبتمبر', progress: 40, effort: 50 },
  { month: 'أكتوبر', progress: 55, effort: 65 },
  { month: 'نوفمبر', progress: 68, effort: 70 },
  { month: 'ديسمبر', progress: 85, effort: 88 },
  { month: 'جانفي', progress: 92, effort: 95 },
];

const biomechanicsData = [
  { subject: 'التوازن', A: 120, fullMark: 150 },
  { subject: 'المرونة', A: 98, fullMark: 150 },
  { subject: 'السرعة', A: 86, fullMark: 150 },
  { subject: 'التوافق', A: 130, fullMark: 150 },
  { subject: 'الصلابة', A: 110, fullMark: 150 },
  { subject: 'الدقة', A: 105, fullMark: 150 },
];

export function TeacherReports() {
  const { students: teacherStudents, settings } = useTeacherClassData();
  const [selectedStudentId, setSelectedStudentId] = useState(teacherStudents.length > 0 ? teacherStudents[0].id : '');
  const [reportType, setReportType] = useState('شامل');
  const [timePeriod, setTimePeriod] = useState('الفصل الأول');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportRecipient, setExportRecipient] = useState<'parent' | 'principal'>('parent');

  // If the selected ID is no longer in the list (or empty), fallback to the first student
  const selectedStudent = teacherStudents.find(s => s.id === selectedStudentId) || teacherStudents[0];

  // If no students exist, show placeholder
  if (!selectedStudent || teacherStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
           <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-800">لا توجد بيانات للتقارير</h3>
        <p className="text-slate-500 font-medium">الرجاء ضبط الفصول الدراسية وتحديد الأقسام.</p>
      </div>
    );
  }

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast({
         title: "تم بناء التقرير",
         description: `اكتمل توليد التقرير (${reportType}) للطالب ${selectedStudent.name}.`,
         className: "bg-blue-50 border-blue-200 text-blue-900"
      });
    }, 1500);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      // Save report to localStorage simulate backend transmission
      try {
        const existing = JSON.parse(localStorage.getItem('haraka_sent_reports') || '[]');
        existing.push({
          id: Date.now().toString(),
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          class: selectedStudent.className || selectedStudent.level,
          type: reportType,
          period: timePeriod,
          recipient: exportRecipient,
          progress: selectedStudent.progress,
          date: new Date().toISOString()
        });
        localStorage.setItem('haraka_sent_reports', JSON.stringify(existing));
        
        // Audit Log
        console.log(`[Audit Log] ${new Date().toISOString()} - الأستاذ استخرج تقريراً (${reportType}) للتلميذ ${selectedStudent.name}`);
        console.log(`[Audit Log] ${new Date().toISOString()} - إرسال التقرير بنجاح عبر إشعار PDF للجهة: ${exportRecipient === 'parent' ? 'ولي الأمر' : 'الإدارة'}`);
        
      } catch(e) {}

      toast({
        title: "تم الإرسال والحفظ",
        description: exportRecipient === 'parent' ? 'تم إرسال التقرير بنجاح لواجهة ولي الأمر مع رابط PDF.' : 'تم إرسال التقرير بنجاح لواجهة مدير المؤسسة مع رابط PDF.',
        className: "bg-emerald-50 border-emerald-200 text-emerald-900"
      });
    }, 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10 min-h-full">
      
      {/* 
        REPORT GENERATION FORM (نموذج إنشاء التقارير)
      */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
           <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shadow-inner font-black">
              <SlidersHorizontal className="w-7 h-7" />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">مولد التقارير (Report Builder)</h2>
             <p className="text-sm font-bold text-slate-500 mt-1">قم بتحديد المعايير المطلوبة لإنشاء تقرير أداء مخصص</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
           {/* Student Selection */}
           <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700">تحديد التلميذ</label>
              <select 
                value={selectedStudentId}
                onChange={e => {
                   setSelectedStudentId(e.target.value);
                   setIsGenerated(false); // Reset when changing student
                }}
                className="w-full h-14 border-2 border-slate-200 rounded-xl px-4 bg-slate-50 text-base font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-50/50 cursor-pointer appearance-none transition-colors hover:border-blue-300"
              >
                {teacherStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.className || s.level}</option>
                ))}
              </select>
           </div>

           {/* Report Type */}
           <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700">نوع التقرير</label>
              <select 
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full h-14 border-2 border-slate-200 rounded-xl px-4 bg-slate-50 text-base font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-50/50 cursor-pointer appearance-none transition-colors hover:border-blue-300"
              >
                <option value="شامل">تقرير شامل (أكاديمي + حركي)</option>
                <option value="أكاديمي">تقرير أكاديمي فقط</option>
                <option value="بيوميكانيكي">فحص بيوميكانيكي (طبي/رياضي)</option>
              </select>
           </div>

           {/* Time Period */}
           <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700">الفترة الزمنية</label>
              <select 
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value)}
                className="w-full h-14 border-2 border-slate-200 rounded-xl px-4 bg-slate-50 text-base font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-50/50 cursor-pointer appearance-none transition-colors hover:border-blue-300"
              >
                <option value="الفصل الأول">تراكمي - الفصل الأول</option>
                <option value="الفصل الثاني">تراكمي - الفصل الثاني</option>
                <option value="تاريخي">تاريخي - السنة الماضية</option>
                <option value="مخصص">مخصص (حسب المحور)</option>
              </select>
           </div>
        </div>

        <div className="mt-8 flex justify-end">
           <Button 
             onClick={handleGenerate}
             disabled={isGenerating}
             className="bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-10 rounded-xl w-full md:w-auto shadow-lg shadow-blue-600/20 text-lg transition-transform active:scale-95"
           >
             {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 ml-2 animate-spin" /> 
                  جاري التوليد من الذكاء الاصطناعي...
                </>
             ) : (
                <>
                  <Settings2 className="w-5 h-5 ml-2" />
                  إنشاء التقرير الآن
                </>
             )}
           </Button>
        </div>
      </div>

      {/* REPORT EXPORT CONTROLS & PRINT VIEW */}
      {isGenerated && (
        <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards] space-y-6">
          
          {/* Action Bar */}
          <div className="bg-slate-900 rounded-[2rem] p-4 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-slate-900/10">
             <div className="text-white font-bold text-sm px-4">
                تقرير جاهز للطباعة | مسودة تلقائية غير مشفرة
             </div>
             
             <div className="flex gap-2 w-full md:w-auto">
               <div className="bg-slate-800 rounded-xl p-1 flex font-bold text-sm w-full md:w-auto h-12">
                 <button 
                   onClick={() => setExportRecipient('parent')}
                   className={`px-6 flex items-center justify-center rounded-lg transition-colors flex-1 ${exportRecipient === 'parent' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 >
                   للعائلة
                 </button>
                 <button 
                   onClick={() => setExportRecipient('principal')}
                   className={`px-6 flex items-center justify-center rounded-lg transition-colors flex-1 ${exportRecipient === 'principal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 >
                   للمدير
                 </button>
               </div>
               
               <Button 
                 onClick={handleExport}
                 disabled={isExporting}
                 className="h-12 bg-white text-slate-900 font-black px-8 rounded-xl shrink-0 border border-slate-200 shadow-md transition-transform hover:scale-105"
               >
                 {isExporting ? <span className="animate-pulse flex items-center gap-2">جاري الإرسال...</span> : <><DownloadCloud className="w-5 h-5 ml-2 text-blue-600" /> إرسال إلكتروني (Sync)</>}
               </Button>
             </div>
          </div>

          {/* REPORT PREVIEW (A4 Style Canvas) */}
          <div className="bg-slate-200/50 p-6 md:p-12 rounded-[2rem] shadow-inner flex justify-center">
            
            <div className="bg-white w-full max-w-[850px] rounded-none md:rounded-xl shadow-2xl border border-slate-300 p-8 md:p-14 text-slate-800 relative">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">تقرير الأداء | {reportType}</h1>
                    <p className="text-lg font-bold text-slate-500 mt-2 tracking-widest">
                      {settings?.schoolName ? settings.schoolName : 'أكاديمية حركــــة للرياضة المدرسية الذكية'} | {timePeriod}
                    </p>
                  </div>
                </div>
                <div className="text-left bg-slate-50 p-5 border-l-4 border-slate-900 w-64">
                  <p className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">بيانات التلميذ</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">{selectedStudent.name}</p>
                  <p className="text-base font-bold text-slate-600 mt-3 flex justify-between">
                    <span>القسم:</span> <span>{selectedStudent.className || selectedStudent.level}</span>
                  </p>
                  <p className="text-base font-bold text-slate-600 mt-1 flex justify-between">
                    <span>المعرف:</span> <span className="font-mono">{selectedStudent.id}-2026/A</span>
                  </p>
                </div>
              </div>

              {/* Quick Stats Banner */}
              <div className="flex gap-4 mb-10 w-full">
                <div className="flex-1 bg-blue-50/80 p-5 border-t-4 border-blue-600 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-extrabold text-blue-900/60 uppercase tracking-widest mb-1">الرتبة الأكاديمية</div>
                    <div className="text-3xl font-black text-blue-700">٣ <span className="text-base font-bold text-blue-500">متقدم</span></div>
                  </div>
                  <Activity className="w-12 h-12 text-blue-200 opacity-50" />
                </div>
                <div className="flex-1 bg-emerald-50/80 p-5 border-t-4 border-emerald-500 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-extrabold text-emerald-900/60 uppercase tracking-widest mb-1">معدل الإنجاز العام</div>
                    <div className="text-3xl font-black text-emerald-700">{selectedStudent.progress}%</div>
                  </div>
                  <TrendingUp className="w-12 h-12 text-emerald-200 opacity-50" />
                </div>
                <div className="flex-1 bg-purple-50/80 p-5 border-t-4 border-purple-600 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-extrabold text-purple-900/60 uppercase tracking-widest mb-1">مجموع النقاط المكتسبة</div>
                    <div className="text-3xl font-black text-purple-700">{selectedStudent.points.toLocaleString()} XP</div>
                  </div>
                  <Brain className="w-12 h-12 text-purple-200 opacity-50" />
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                {/* Custom Bar Chart for Progress */}
                <div className="border border-slate-200 p-6 bg-white relative">
                  <div className="absolute top-0 right-0 w-2 h-full bg-slate-900"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    مؤشر النمو الزمني (التراكمي)
                  </h3>
                  <div className="h-64 flex items-end justify-between gap-2 pt-10">
                    {performanceHistory.map((data, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                        <div className="w-full flex justify-center items-end h-40 gap-1 relative">
                            {/* Tooltip */}
                            <div className="absolute -top-10 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              الإنجاز: {data.progress}%
                            </div>
                            {/* Effort Bar */}
                            <div className="w-1/3 bg-slate-200 rounded-t-md relative" style={{ height: `${data.effort}%` }}></div>
                            {/* Progress Bar */}
                            <div className="w-2/3 bg-blue-600 rounded-t-md relative hover:bg-blue-500 transition-colors" style={{ height: `${data.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 mt-3">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div><span className="text-xs font-bold text-slate-500">الإنجاز المنهجي</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200 rounded"></div><span className="text-xs font-bold text-slate-500">المواظبة</span></div>
                  </div>
                </div>

                {/* Custom Horizontal Bar Chart for Biomechanics */}
                <div className="border border-slate-200 p-6 bg-white relative">
                  <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    البصمة الحركية (Biomechanics)
                  </h3>
                  <div className="h-64 flex flex-col justify-between pt-2">
                    {biomechanicsData.map((data, i) => {
                      const MathVal = Math.round((data.A / data.fullMark) * 100);
                      const isWeak = MathVal < 70;
                      return (
                        <div key={i} className="flex flex-col gap-1 w-full">
                          <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-800">{data.subject}</span>
                            <span className={`text-xs font-extrabold ${isWeak ? 'text-rose-600' : 'text-emerald-600'}`}>{MathVal}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isWeak ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${MathVal}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Detailed */}
              <div className="bg-slate-50 p-8 border border-slate-200 mb-10">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                      <h4 className="text-lg font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b-2 border-emerald-200 pb-2">
                        <CheckCircle2 className="w-5 h-5" /> المكتسبات العلمية والبدنية
                      </h4>
                      <ul className="space-y-4">
                        {selectedStudent.strengths.map((str, i) => (
                          <li key={i} className="flex gap-4">
                              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">{i+1}</span>
                              <span className="text-slate-700 font-bold leading-relaxed pt-1">تميز بنقطة قوة في {str} (نجاح &gt;90%)</span>
                          </li>
                        ))}
                        {selectedStudent.strengths.length === 0 && (
                          <li className="text-slate-500 font-bold italic">لا توجد نقاط تميز واضحة لهذه الفترة.</li>
                        )}
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-lg font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b-2 border-rose-200 pb-2">
                        <TrendingDown className="w-5 h-5" /> ملاحظات التأخر الحركي
                      </h4>
                      <ul className="space-y-4">
                        {selectedStudent.weaknesses.map((wk, i) => (
                          <li key={i} className="flex gap-4">
                              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">{i+1}</span>
                              <span className="text-slate-700 font-bold leading-relaxed pt-1">شُخّص تأخر ملحوظ في تدريبات: {wk}</span>
                          </li>
                        ))}
                        {selectedStudent.weaknesses.length === 0 && (
                          <li className="text-slate-500 font-bold italic">التلميذ لا يعاني من ثغرات واضحة.</li>
                        )}
                      </ul>
                  </div>
                </div>
              </div>

              {/* Teacher Opinion & Signatures */}
              <div className="flex gap-10">
                <div className="flex-1">
                    <h4 className="font-extrabold text-slate-900 text-lg mb-3">
                      الفضفصة الإدراكية والتوصيات (Target: {exportRecipient === 'parent' ? 'Family/Parents' : 'School Admin'})
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-bold border-r-4 border-slate-300 pr-4 text-justify">
                      {exportRecipient === 'parent' 
                        ? `استناداً للمخرجات الأكاديمية والبيوميكانيكية للفترة (${timePeriod})، نوصي الأسرة الكريمة بالمتابعة الحثيثة لاستجابة ${selectedStudent.name}. يتمتع التلميذ بإمكانيات واضحة، ولكن يرجى الالتزام بتكرار "التمارين التأهيلية" المرسلة عبر المنصة لتحسين المردود العام وتقليل التأخر الملحوظ في الأداء الممنهج.`
                        : `نحيط السيد المدير علماً بأن التلميذ ${selectedStudent.name} أظهر مستوى استجابة بحوالي ${selectedStudent.progress}% خلال (${timePeriod}). سجلت المنصة الذكية اختلالات بيوميكانيكية طفيفة تستوجب متابعة استثنائية. تم إرفاق حزمة مقترحة من التمارين المصححة لضمان توافق التلميذ مع مؤشرات الأداء الخاصة بالقسم.`}
                    </p>
                </div>
                <div className="w-64 flex flex-col items-center justify-end text-center shrink-0">
                    <div className="w-full border-b-2 border-slate-900 border-dashed mb-2 pb-6 relative">
                        <span className="font-brand absolute bottom-1 right-1/2 translate-x-1/2 text-2xl text-blue-900/40 -rotate-12 italic">Verified by AI</span>
                    </div>
                    <p className="font-extrabold text-slate-900 uppercase tracking-widest">توقيع أستاذ المادة</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">المحرك المعتمد للذكاء الاصطناعي</p>
                    <div className="text-[10px] text-slate-300 font-mono mt-2 tracking-widest">{new Date().getTime().toString(16).toUpperCase()}-AUTH</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
