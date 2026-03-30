import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Play, TrendingUp, Users, Target, Clock, Plus, CheckSquare, 
  FileText, ArrowDownToLine, Printer, Edit3, Save, Send, ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { coachClients } from '@/data/mockCoachData';

const programs = [
  { id: 1, title: 'برنامج الضخامة العضلية', level: 'متقدم', duration: '8 أسابيع', activeUsers: 45, color: 'from-blue-600 to-indigo-700' },
  { id: 2, title: 'حرق الدهون السريع', level: 'متوسط', duration: '4 أسابيع', activeUsers: 112, color: 'from-orange-500 to-red-600' },
  { id: 3, title: 'تأهيل إصابات الركبة', level: 'خاص', duration: 'مفتوح', activeUsers: 18, color: 'from-emerald-500 to-teal-600' },
  { id: 4, title: 'تأسيس اللياقة', level: 'مبتدئ', duration: '6 أسابيع', activeUsers: 89, color: 'from-purple-600 to-pink-600' },
];

const mockChartData = [
  { week: 'الأسبوع 1', volume: 4000, intensity: 60 },
  { week: 'الأسبوع 2', volume: 4500, intensity: 65 },
  { week: 'الأسبوع 3', volume: 5200, intensity: 70 },
  { week: 'الأسبوع 4', volume: 5800, intensity: 75 },
  { week: 'الأسبوع 5', volume: 4800, intensity: 60 }, // Deload
  { week: 'الأسبوع 6', volume: 6200, intensity: 80 },
  { week: 'الأسبوع 7', volume: 6800, intensity: 85 },
  { week: 'الأسبوع 8', volume: 7500, intensity: 90 },
];

export default function CoachPrograms() {
  const [openNew, setOpenNew] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<typeof programs[0] | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Assignment states
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([]);
  
  const [docContent, setDocContent] = useState({
    description: 'تم تصميم هذا البرنامج خصيصاً لزيادة الكتلة العضلية وتحسين القوة العامة باستخدام نظام الزيادة التدريجية للحمل (Progressive Overload).',
    notes: 'يفضل شرب 3-4 لتر ماء يومياً والالتزام بجودة النوم 8 ساعات للحصول على أقصى استفادة من هذا البرنامج المتقدم.'
  });

  const handleOpenViewer = (prog: typeof programs[0]) => {
    setSelectedProgram(prog);
    setViewerOpen(true);
    setIsEditing(false);
    setSelectedTrainees([]);
  };

  const toggleTrainee = (id: string) => {
    setSelectedTrainees(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">مكتبة البرامج التدريبية</h2>
          <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">إدارة الخطط والمستندات التدريبية وإسنادها كملفات تفاعلية.</p>
        </div>
        
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button className="h-12 w-full md:w-auto px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="w-5 h-5 ml-2" /> إنشاء مستند برنامج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-none rounded-3xl p-8 bg-white text-right font-sans" dir="rtl">
             <h3 className="text-2xl font-black text-slate-900 mb-6">إنشاء وتخصيص مستند جديد</h3>
             <div className="space-y-4">
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">عنوان البرنامج</label>
                  <Input placeholder="مثال: القوة الانفجارية للرياضيين" className="h-12 bg-slate-50 font-bold border-slate-200" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-bold text-slate-500 mb-2 block">المدة (أسبوع)</label>
                    <Input type="number" defaultValue={8} className="h-12 bg-slate-50 font-bold border-slate-200" />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-500 mb-2 block">المستوى المطلوب</label>
                    <select className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none">
                       <option>مبتدئ</option>
                       <option>متوسط</option>
                       <option>متقدم</option>
                       <option>خاص (تأهيلي)</option>
                    </select>
                 </div>
               </div>
               
               <Button onClick={() => { toast.success('تمت إضافة البرنامج للمكتبة بنجاح!'); setOpenNew(false); }} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl mt-4 shadow-md">
                 حفظ في المكتبة
               </Button>
             </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {programs.map((program) => (
          <Card key={program.id} className="border-none shadow-md hover:shadow-xl transition-all overflow-hidden group bg-white flex flex-col">
            <div className={`h-32 bg-gradient-to-r ${program.color} relative p-6 flex flex-col justify-end shrink-0`}>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> {program.level}
              </div>
              <div className="absolute top-4 right-4 text-white/50">
                <FileText className="w-16 h-16 transform rotate-12" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white relative z-10 w-[80%] leading-tight">{program.title}</h3>
            </div>
            
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-slate-500">
                <div className="flex items-center gap-1.5 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Clock className="w-4 h-4 text-blue-500" /> {program.duration}
                </div>
                <div className="flex items-center gap-1.5 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Users className="w-4 h-4 text-emerald-500" /> {program.activeUsers} متدرب
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <Button onClick={() => handleOpenViewer(program)} className="flex-1 h-12 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 transition-colors">
                  <FileText className="w-5 h-5 ml-2 text-slate-500" /> استعراض وتعديل البرنامج
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF VIEWER DIALOG */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="sm:max-w-[95vw] lg:max-w-[1000px] h-[90vh] md:h-[85vh] p-0 overflow-hidden border-none text-right font-sans rounded-2xl flex flex-col bg-slate-100 !fixed !inset-x-0 !top-[5vh] !mx-auto !translate-x-0 !translate-y-0" dir="rtl">
           
           {/* Document Viewer Toolbar */}
           <div className="h-16 bg-slate-900 shrink-0 flex items-center justify-between px-4 md:px-6 shadow-xl relative z-20">
              <div className="flex items-center gap-4 text-white">
                 <FileText className="w-6 h-6 text-blue-400" />
                 <span className="font-bold text-lg hidden sm:inline">{selectedProgram?.title}.pdf</span>
                 <span className="bg-slate-800 text-xs px-2 py-1 rounded font-mono text-slate-300">100% v</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-3">
                 <Button onClick={() => setIsEditing(!isEditing)} variant="ghost" size="sm" className={`text-white hover:bg-slate-800 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                    {isEditing ? <Save className="w-4 h-4 ml-2" /> : <Edit3 className="w-4 h-4 ml-2" />}
                    <span className="hidden sm:inline">{isEditing ? 'حفظ التعديلات' : 'وضع التعديل'}</span>
                 </Button>
                 
                 {/* PDF Download mockup */}
                 <Button onClick={() => toast.success('جاري تصدير الملف كـ PDF...')} variant="ghost" size="icon" className="text-white hover:bg-slate-800 hidden md:flex">
                    <ArrowDownToLine className="w-5 h-5" />
                 </Button>
                 <Button onClick={() => toast.success('جاري التحضير للطباعة...')} variant="ghost" size="icon" className="text-white hover:bg-slate-800 hidden md:flex">
                    <Printer className="w-5 h-5" />
                 </Button>

                 <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>

                 {/* Assign Button with Popover */}
                 <Popover open={assignOpen} onOpenChange={setAssignOpen}>
                   <PopoverTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-9">
                         <Send className="w-4 h-4 ml-2" /> إسناد للمتدرب <ChevronDown className="w-4 h-4 mr-1 opacity-70" />
                      </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-none overflow-hidden" align="end" dir="rtl">
                      <div className="bg-slate-50 font-bold p-3 border-b border-slate-100 text-slate-700">
                        اختر المتدربين (إرسال البرنامج)
                      </div>
                      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {coachClients.map(client => (
                          <div 
                            key={client.id} 
                            onClick={() => toggleTrainee(client.id)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors"
                          >
                            <input 
                               type="checkbox" 
                               checked={selectedTrainees.includes(client.id)}
                               readOnly
                               className="w-4 h-4 rounded text-blue-600 shadow-sm"
                            />
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {client.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">{client.name}</p>
                              <p className="text-xs text-slate-500 font-medium">{client.goal}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-white border-t border-slate-100">
                         <Button 
                           disabled={selectedTrainees.length === 0}
                           onClick={() => {
                             toast.success(`تم إسقاط وتخصيص البرنامج التدريبي لعدد ${selectedTrainees.length} متدرب.`);
                             setAssignOpen(false);
                           }} 
                           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                         >
                           تأكيد الإرسال
                         </Button>
                      </div>
                   </PopoverContent>
                 </Popover>
              </div>
           </div>

           {/* PDF Document Container */}
           <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center custom-scrollbar w-full bg-slate-100 relative">
              
              {/* Actual Document Page */}
              <div className="w-[800px] bg-white min-h-[1100px] shadow-2xl rounded-sm p-8 md:p-12 mb-8 relative outline outline-1 outline-slate-200 shrink-0 mx-auto my-auto">
                 
                 {/* Print Watermark */}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center overflow-hidden">
                    <span className="text-[150px] font-black tracking-tighter text-slate-900 -rotate-45 block transform scale-150">HARAKA PRO</span>
                 </div>

                 <header className="border-b-2 border-slate-900 mb-8 pb-4 flex justify-between items-end relative z-10">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                        {isEditing ? (
                          <input type="text" className="w-full font-black border-b border-dashed border-blue-400 focus:outline-none" defaultValue={selectedProgram?.title} />
                        ) : selectedProgram?.title}
                      </h1>
                      <div className="text-slate-500 font-bold flex gap-4 mt-2">
                         <span>المستوى: {selectedProgram?.level}</span>
                         <span>•</span>
                         <span>المدة: {selectedProgram?.duration}</span>
                      </div>
                    </div>
                    <div className="text-left w-24">
                       {/* Placeholder for coach/org logo */}
                       <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ml-auto">
                         PRO
                       </div>
                    </div>
                 </header>

                 <main className="space-y-10 relative z-10">
                    
                    {/* Intro Section */}
                    <section>
                       <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2"><Target className="w-6 h-6 text-blue-600" /> الهدف والوصف العام</h3>
                       {isEditing ? (
                         <textarea 
                            className="w-full min-h-[100px] text-lg text-slate-700 leading-relaxed font-medium bg-blue-50 p-4 rounded-xl border border-blue-200 outline-none resize-none"
                            value={docContent.description}
                            onChange={(e) => setDocContent({...docContent, description: e.target.value})}
                         />
                       ) : (
                         <p className="text-lg text-slate-700 leading-relaxed font-medium">{docContent.description}</p>
                       )}
                    </section>

                    {/* Chart Section */}
                    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-emerald-600" /> منحنى الحمل التدريبي المقترح (أسبوعياً)</h3>
                       <div className="h-[300px] w-full" dir="ltr">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontWeight: 'bold' }}
                                itemStyle={{ fontWeight: 'black' }}
                              />
                              <Area type="monotone" dataKey="volume" name="الحجم التدريبي (Volume)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                              <Area type="monotone" dataKey="intensity" name="الكثافة / الشدة (%)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIntensity)" />
                            </AreaChart>
                          </ResponsiveContainer>
                       </div>
                       <p className="text-sm font-semibold text-slate-500 mt-4 text-center">يمثل الرسم البياني تموج الأحمال بين الحجم التدريبي وشدته لضمان الاستشفاء ومنع الإصابات.</p>
                    </section>

                    {/* Workouts Table Mockup */}
                    <section>
                       <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><Play className="w-6 h-6 text-orange-500" /> هيكل التدريبات اليومية (عينة)</h3>
                       
                       <div className="overflow-hidden border border-slate-200 rounded-xl">
                         <table className="w-full text-right bg-white">
                            <thead className="bg-slate-900 text-white">
                               <tr>
                                 <th className="py-4 px-4 font-black w-24">اليوم</th>
                                 <th className="py-4 px-4 font-black">العضلة المستهدفة</th>
                                 <th className="py-4 px-4 font-black">عدد التمارين</th>
                                 <th className="py-4 px-4 font-black">الملاحظات التكتيكية</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                               <tr className="hover:bg-slate-50">
                                 <td className="py-4 px-4 font-black text-slate-900">اليوم الأول</td>
                                 <td className="py-4 px-4 text-slate-600">الصدر والترايسيبس</td>
                                 <td className="py-4 px-4 text-slate-600">6 تمارين رئيسية</td>
                                 <td className="py-4 px-4 text-slate-500">التركيز على الانقباض السلبي</td>
                               </tr>
                               <tr className="hover:bg-slate-50">
                                 <td className="py-4 px-4 font-black text-slate-900">اليوم الثاني</td>
                                 <td className="py-4 px-4 text-slate-600">الظهر والبايسيبس</td>
                                 <td className="py-4 px-4 text-slate-600">5 تمارين رئيسية</td>
                                 <td className="py-4 px-4 text-slate-500">حمل وزن ثقيل في الرفعة الميتة</td>
                               </tr>
                               <tr className="hover:bg-slate-50 bg-emerald-50/50">
                                 <td className="py-4 px-4 font-black text-emerald-700">اليوم الثالث</td>
                                 <td className="py-4 px-4 text-emerald-600" colSpan={3}>استشفاء نشط (Active Recovery) / إطالات</td>
                               </tr>
                            </tbody>
                         </table>
                       </div>
                    </section>

                    {/* Notes Section */}
                    <section>
                        <h3 className="text-lg font-black text-slate-900 mb-2">ملاحظات والتزامات عامة</h3>
                        {isEditing ? (
                         <textarea 
                            className="w-full min-h-[80px] text-base text-slate-700 leading-relaxed font-medium bg-blue-50 p-4 rounded-xl border border-blue-200 outline-none resize-none"
                            value={docContent.notes}
                            onChange={(e) => setDocContent({...docContent, notes: e.target.value})}
                         />
                       ) : (
                        <div className="bg-amber-50 border-r-4 border-amber-400 p-4 rounded-l-xl text-slate-700 font-medium leading-relaxed">
                          {docContent.notes}
                        </div>
                       )}
                    </section>

                 </main>

                 {/* Page Footer */}
                 <footer className="absolute bottom-12 left-12 right-12 border-t border-slate-200 pt-4 flex justify-between text-sm font-bold text-slate-400">
                    <span>وثيقة تدريب رسمية - من إنشاء Haraka Pro</span>
                    <span>الصفحة 1 من 15</span>
                 </footer>
              </div>
           </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
