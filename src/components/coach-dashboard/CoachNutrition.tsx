import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Apple, Plus, Flame, Beef, Users, Target, Droplets, FileText, Edit3, Save, Send, ChevronDown, ArrowDownToLine, Printer, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { coachClients } from '@/data/mockCoachData';

const nutritionPlans = [
  { id: 1, title: 'التنشيف وتقليل الدهون', calories: '1800 kcal', protein: '160g', carbs: '120g', fat: '75g', users: 32, color: 'bg-emerald-50 text-emerald-600' },
  { id: 2, title: 'تضخيم وبناء عضلي', calories: '3200 kcal', protein: '200g', carbs: '350g', fat: '110g', users: 15, color: 'bg-orange-50 text-orange-600' },
  { id: 3, title: 'الكيتو دايت للرياضيين', calories: '2200 kcal', protein: '140g', carbs: '30g', fat: '170g', users: 8, color: 'bg-purple-50 text-purple-600' },
  { id: 4, title: 'الصيام المتقطع التنافسي', calories: '2400 kcal', protein: '180g', carbs: '200g', fat: '80g', users: 44, color: 'bg-blue-50 text-blue-600' },
];

const MACRO_COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Carbs(Blue), Protein(Green), Fat(Orange)

export default function CoachNutrition() {
  const [selectedPlan, setSelectedPlan] = useState<typeof nutritionPlans[0] | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Assignment states
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([]);
  
  const [docContent, setDocContent] = useState({
    title: '',
    description: 'تم بناء هذا النظام الغذائي لتلبية احتياجات الرياضي المحترف بناءً على معدل الأيض الأساسي (BMR) وحجم النشاط البدني لتحقيق الهدف المرجو بكفاءة عالية.',
    notes: 'يفضل تناول وجبة غنية بالكربوهيدرات المعقدة قبل التمرين بساعتين، ووجبة غنية بالبروتين السريع الامتصاص بعد التمرين مباشرة للتعافي. تجنب السكريات المضافة والمقالي تماماً.'
  });

  const handleOpenViewer = (plan: typeof nutritionPlans[0]) => {
    setSelectedPlan(plan);
    setDocContent(prev => ({ ...prev, title: plan.title }));
    setViewerOpen(true);
    setIsEditing(false);
    setSelectedTrainees([]);
  };

  const getChartData = (plan: typeof nutritionPlans[0] | null) => {
    if (!plan) return [];
    return [
      { name: 'الكربوهيدرات (g)', value: parseInt(plan.carbs.replace('g', '')) },
      { name: 'البروتين (g)', value: parseInt(plan.protein.replace('g', '')) },
      { name: 'الدهون (g)', value: parseInt(plan.fat.replace('g', '')) },
    ];
  };

  const currentChartData = getChartData(selectedPlan);

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
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">التغذية والأنظمة الصحية</h2>
          <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">إدارة المستندات الغذائية والمكملات وتوزيع الماكروز.</p>
        </div>
        <Button onClick={() => toast.success('إضافة نظام جديد لم تُفعل برمجياً في هذه المعاينة بعد')} className="h-12 w-full md:w-auto px-6 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md">
          <Plus className="w-5 h-5 ml-2" /> مستند خطة غذائية
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CREATE NEW MACRO CALC CARD */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-all group col-span-1">
          <CardContent className="p-8 h-full flex flex-col justify-between z-10 relative space-y-4">
            <div className="p-4 bg-white/20 rounded-2xl w-fit backdrop-blur-sm mb-2">
              <Apple className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">حاسبة السعرات (Macros)</h3>
              <p className="text-blue-100 font-medium text-sm md:text-base mb-6 leading-relaxed">أداة حساب احتياج المتدرب بناءً على الطول والوزن وتوليد مستند نظام تلقائي.</p>
              <Button onClick={() => toast.success('تم تشغيل الحاسبة وبناء النظام بنجاح!')} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-md mt-auto">
                <Target className="w-5 h-5 ml-2" /> تشغيل الحاسبة
              </Button>
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        </Card>

        {/* MOCK PLANS */}
        {nutritionPlans.map((plan) => (
          <Card key={plan.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${plan.color}`}>
                  <Beef className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <Users className="w-4 h-4" /> {plan.users} متدرب
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6">{plan.title}</h3>
              
              <div className="space-y-3 mb-6 mt-auto">
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500"/> السعرات (Calories)</span>
                  <span className="text-slate-900 font-black text-base">{plan.calories}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 font-bold mb-1">PRO</span>
                    <span className="text-emerald-600 font-black">{plan.protein}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 font-bold mb-1">CARB</span>
                    <span className="text-blue-600 font-black">{plan.carbs}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 font-bold mb-1">FAT</span>
                    <span className="text-orange-500 font-black">{plan.fat}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleOpenViewer(plan)} className="w-full rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 h-12 shadow-md">
                <FileText className="w-4 h-4 ml-2" /> استعراض وإسناد المستند
              </Button>
            </CardContent>
          </Card>
        ))}

      </div>

      {/* PDF VIEWER DIALOG FOR NUTRITION */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="sm:max-w-[95vw] lg:max-w-[1000px] h-[90vh] md:h-[85vh] p-0 overflow-hidden border-none text-right font-sans rounded-2xl flex flex-col bg-[#eef2f6] !fixed !inset-x-0 !top-[5vh] !mx-auto !translate-x-0 !translate-y-0" dir="rtl">
           
           {/* Document Viewer Toolbar */}
           <div className="h-16 bg-slate-900 shrink-0 flex items-center justify-between px-4 md:px-6 shadow-xl relative z-20">
              <div className="flex items-center gap-4 text-white">
                 <Apple className="w-6 h-6 text-emerald-400" />
                 <span className="font-bold text-lg hidden sm:inline">{docContent.title}.pdf</span>
                 <span className="bg-slate-800 text-xs px-2 py-1 rounded font-mono text-slate-300">Scale 95%</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-3">
                 <Button onClick={() => setIsEditing(!isEditing)} variant="ghost" size="sm" className={`text-white hover:bg-slate-800 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                    {isEditing ? <Save className="w-4 h-4 ml-2" /> : <Edit3 className="w-4 h-4 ml-2" />}
                    <span className="hidden sm:inline">{isEditing ? 'حفظ التعديلات' : 'وضع التعديل'}</span>
                 </Button>
                 
                 <Button onClick={() => toast.success('جاري تصدير الملف كـ PDF...')} variant="ghost" size="icon" className="text-white hover:bg-slate-800 hidden md:flex">
                    <ArrowDownToLine className="w-5 h-5" />
                 </Button>
                 <Button onClick={() => toast.success('جاري التحضير للطباعة...')} variant="ghost" size="icon" className="text-white hover:bg-slate-800 hidden md:flex">
                    <Printer className="w-5 h-5" />
                 </Button>

                 <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>

                 <Popover open={assignOpen} onOpenChange={setAssignOpen}>
                   <PopoverTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9">
                         <Send className="w-4 h-4 ml-2" /> إسناد للمتدرب <ChevronDown className="w-4 h-4 mr-1 opacity-70" />
                      </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-none overflow-hidden" align="end" dir="rtl">
                      <div className="bg-slate-50 font-bold p-3 border-b border-slate-100 text-slate-700">
                        لائحة المتابعين (تخصيص الخطة)
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
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              {client.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">{client.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-white border-t border-slate-100">
                         <Button 
                           disabled={selectedTrainees.length === 0}
                           onClick={() => {
                             toast.success(`تم تخصيص وإسناد الخطة الغذائية لعدد ${selectedTrainees.length} متدرب.`);
                             setAssignOpen(false);
                           }} 
                           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                         >
                           تأكيد الإرسال
                         </Button>
                      </div>
                   </PopoverContent>
                 </Popover>
              </div>
           </div>

           {/* PDF Document Container */}
           <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center custom-scrollbar w-full relative">
              
              {/* Actual Document Page */}
              <div className="w-[800px] bg-white min-h-[1050px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm p-8 md:p-12 mb-8 relative outline outline-1 outline-slate-200 shrink-0 mx-auto my-auto">
                 
                 {/* Print Watermark */}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
                    <span className="text-[120px] font-black tracking-tighter text-emerald-900 -rotate-45 block transform scale-150">NUTRITION DOC</span>
                 </div>

                 <header className="border-b-4 border-emerald-500 mb-8 pb-6 flex justify-between items-end relative z-10">
                    <div>
                      <h4 className="text-emerald-600 font-black tracking-widest text-sm mb-2 uppercase">وثيقة تغذية معتمدة</h4>
                      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {isEditing ? (
                          <input type="text" className="w-full font-black border-b border-dashed border-emerald-400 focus:outline-none" value={docContent.title} onChange={e => setDocContent({...docContent, title: e.target.value})} />
                        ) : docContent.title}
                      </h1>
                      <div className="text-slate-500 font-bold flex gap-4 mt-3 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100 inline-block w-fit shadow-inner">
                         <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> الاحتياج اليومي: <span className="text-slate-900 font-black">{selectedPlan?.calories}</span></span>
                      </div>
                    </div>
                    <div className="text-left w-24">
                       <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 shadow-md ml-auto">
                         <Apple className="w-10 h-10" />
                       </div>
                    </div>
                 </header>

                 <main className="space-y-12 relative z-10">
                    
                    {/* Intro Section */}
                    <section>
                       {isEditing ? (
                         <textarea 
                            className="w-full min-h-[80px] text-lg text-slate-700 leading-relaxed font-medium bg-emerald-50 p-4 rounded-xl border border-emerald-200 outline-none resize-none"
                            value={docContent.description}
                            onChange={(e) => setDocContent({...docContent, description: e.target.value})}
                         />
                       ) : (
                         <p className="text-lg text-slate-700 leading-relaxed font-medium pl-6 border-l-4 border-slate-200 rtl:border-r-4 rtl:border-l-0 rtl:pr-6">{docContent.description}</p>
                       )}
                    </section>

                    {/* Chart Section */}
                    <section className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                       <div className="flex-1 w-full">
                         <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><Target className="w-6 h-6 text-emerald-600" /> تحليل العناصر الكبرى (Macros)</h3>
                         
                         <div className="space-y-6">
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><Droplets className="w-6 h-6 text-blue-600" /></div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-400">الكربوهيدرات (طاقة)</p>
                                <p className="text-2xl font-black text-slate-900">{selectedPlan?.carbs}</p>
                              </div>
                           </div>
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Beef className="w-6 h-6 text-emerald-600" /></div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-400">البروتين (بناء واستشفاء)</p>
                                <p className="text-2xl font-black text-slate-900">{selectedPlan?.protein}</p>
                              </div>
                           </div>
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"><Flame className="w-6 h-6 text-orange-500" /></div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-400">الدهون الصحية (هرمونات)</p>
                                <p className="text-2xl font-black text-slate-900">{selectedPlan?.fat}</p>
                              </div>
                           </div>
                         </div>
                       </div>
                       
                       <div className="h-[280px] w-full md:w-[350px] shrink-0 pointer-events-none" dir="ltr">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={currentChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                              >
                                {currentChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={MACRO_COLORS[index % MACRO_COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontWeight: 'bold' }}
                                itemStyle={{ fontWeight: 'black', color: '#000' }}
                                formatter={(value: number) => [`${value} جرام`, 'الكمية']}
                              />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                       </div>
                    </section>

                    {/* Meal Schedule Mockup */}
                    <section>
                       <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3"><Clock className="w-6 h-6 text-blue-500" /> الجدول الزمني للوجبات</h3>
                       
                       <div className="space-y-4">
                          <div className="border border-slate-200 rounded-2xl p-5 bg-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>
                             <h4 className="font-black text-lg text-slate-900 mb-1">وجبة الإفطار (7:30 صباحاً)</h4>
                             <p className="text-slate-600 font-medium">4 حبات بيض مسلوق + 100 جرام شوفان مع ملعقة عسل ومكسرات + كوب قهوة سوداء.</p>
                          </div>
                          <div className="border border-slate-200 rounded-2xl p-5 bg-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                             <h4 className="font-black text-lg text-slate-900 mb-1">وجبة الغداء (قبل التمرين بـ 3 ساعات)</h4>
                             <p className="text-slate-600 font-medium">200 جرام صدر دجاج مشوي + 150 جرام أرز أبيض مسلوق + سلطة خضراء مع زيت الزيتون.</p>
                          </div>
                          <div className="border border-slate-200 rounded-2xl p-5 bg-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                             <h4 className="font-black text-lg text-slate-900 mb-1">وجبة العشاء (توصية ليلية)</h4>
                             <p className="text-slate-600 font-medium">150 جرام تونة مصفاة من الزيت أو سمك مشوي + 50 جرام بطاطا مشوية.</p>
                          </div>
                       </div>
                    </section>

                    {/* Notes Section */}
                    <section className="pt-6">
                        <h3 className="text-lg font-black text-slate-900 mb-3">توصيات المشروبات والمكملات</h3>
                        {isEditing ? (
                         <textarea 
                            className="w-full min-h-[100px] text-base text-slate-700 leading-relaxed font-medium bg-emerald-50 p-4 rounded-xl border border-emerald-200 outline-none resize-none"
                            value={docContent.notes}
                            onChange={(e) => setDocContent({...docContent, notes: e.target.value})}
                         />
                       ) : (
                        <div className="bg-slate-900 text-white p-6 rounded-2xl font-medium leading-relaxed shadow-lg">
                          <div className="flex gap-4">
                            <span className="text-3xl">💡</span>
                            <p className="text-slate-200">{docContent.notes}</p>
                          </div>
                        </div>
                       )}
                    </section>

                 </main>

                 {/* Page Footer */}
                 <footer className="absolute bottom-12 left-12 right-12 border-t border-slate-200 pt-4 flex justify-between text-sm font-bold text-slate-400">
                    <span>مخصص بواسطة المنصة الاحترافية</span>
                    <span>صفحة التغذية - النظام {selectedPlan?.id}</span>
                 </footer>
              </div>
           </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
