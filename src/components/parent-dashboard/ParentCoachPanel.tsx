import React, { useState, useEffect } from 'react';
import { parentDataService, Coach, Report, NutritionPlan } from '@/services/parentDataService';
import { auditService } from '@/services/auditService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RatingSystem } from '@/components/shared/RatingSystem';
import {
  Star, Calendar, FileText, Apple, Clock, CheckCircle2,
  ChevronDown, ChevronUp, Dumbbell, User, Phone, MapPin, Award
} from 'lucide-react';

// Mock Data moved to parentDataService

// ─── Component ────────────────────────────────────────────────────────────────
export function ParentCoachPanel({ parentName }: { parentName: string }) {
  const [activeSection, setActiveSection] = useState<'booking' | 'rating' | 'reports' | 'nutrition'>('booking');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingDone, setBookingDone] = useState<string[]>([]);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);

  const [COACHES, setCoaches] = useState<Coach[]>([]);
  const [REPORTS, setReports] = useState<Report[]>([]);
  const [NUTRITION_PLANS, setNutritionPlans] = useState<NutritionPlan[]>([]);

  useEffect(() => {
    setCoaches(parentDataService.getCoaches());
    setReports(parentDataService.getReports());
    setNutritionPlans(parentDataService.getNutritionPlans());
    
    // Load existing bookings
    const existingBookings = parentDataService.getBookings();
    setBookingDone(existingBookings.map(b => `${b.coachId}-${b.slot}`));
  }, []);

  const handleReadReport = (report: Report) => {
    if (expandedReport === report.id) {
       setExpandedReport(null);
    } else {
       setExpandedReport(report.id);
       if (!report.read) {
          parentDataService.markReportAsRead(report.id);
          setReports(parentDataService.getReports());
       }
    }
  };

  const handleDownloadPDF = (report: Report) => {
    auditService.log(`تحميل تقرير`, `تم تحميل تقرير: ${report.subject}`);
    const printWindow = window.open('', '_blank');
    if(printWindow) {
      printWindow.document.write(`
        <html dir="rtl"><head><title>${report.subject}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: right;">
          <h1>${report.subject}</h1>
          <p><strong>من:</strong> ${report.from} (${report.fromRole})</p>
          <p><strong>التاريخ:</strong> ${report.date}</p>
          <hr/>
          <p>${report.content}</p>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const sections = [
    { id: 'booking', label: '📅 حجز حصص', icon: Calendar },
    { id: 'rating', label: '⭐ تقييم المدرب', icon: Star },
    { id: 'reports', label: '📋 تقارير واردة', icon: FileText },
    { id: 'nutrition', label: '🥗 التغذية', icon: Apple },
  ] as const;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Section Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 ${activeSection === sec.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
          >
            <sec.icon className="w-4 h-4" />
            {sec.label}
            {sec.id === 'reports' && REPORTS.filter(r => !r.read).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {REPORTS.filter(r => !r.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── BOOKING SECTION ─────────────────────────────────────────────────── */}
      {activeSection === 'booking' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg">
            <h3 className="text-white font-black text-xl">احجز حصة تدريبية لابنك 🏋️</h3>
            <p className="text-blue-200 text-sm font-medium mt-1">اختر المدرب المناسب وحدد الموعد</p>
          </div>
          <div className="space-y-4">
            {COACHES.map(coach => (
              <Card key={coach.id} className={`border-2 transition-all ${selectedCoach?.id === coach.id ? 'border-blue-500 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-black text-slate-900 text-base">{coach.name}</h4>
                        <Badge className="bg-amber-100 text-amber-700 border-none font-bold">⭐ {coach.rating}</Badge>
                      </div>
                      <p className="text-slate-500 font-bold text-sm mt-0.5">{coach.specialty}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400 font-bold">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{coach.location}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{coach.phone}</span>
                        <span className="flex items-center gap-1"><Award className="w-3 h-3" />{coach.sessions} جلسة مكتملة</span>
                      </div>
                      <p className="text-blue-600 font-black text-sm mt-2">{coach.price.toLocaleString()} دج / حصة</p>
                      <button
                        onClick={() => setSelectedCoach(selectedCoach?.id === coach.id ? null : coach)}
                        className="mt-3 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {selectedCoach?.id === coach.id ? '▲ إخفاء المواعيد' : '▼ عرض المواعيد المتاحة'}
                      </button>
                      {selectedCoach?.id === coach.id && (
                        <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">اختر موعداً</p>
                          <div className="flex flex-wrap gap-2">
                            {coach.available.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'}`}
                              >
                                <Clock className="w-3 h-3 inline ml-1" />{slot}
                              </button>
                            ))}
                          </div>
                          {selectedSlot && (
                            <button
                              onClick={() => {
                                parentDataService.addBooking(coach.id, coach.name, selectedSlot);
                                setBookingDone(b => [...b, `${coach.id}-${selectedSlot}`]);
                                setSelectedSlot('');
                                setSelectedCoach(null);
                              }}
                              className="w-full bg-blue-600 text-white font-black py-3 rounded-xl mt-2 hover:bg-blue-700 transition-colors shadow-md"
                            >
                              ✅ تأكيد الحجز
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {bookingDone.some(b => b.startsWith(coach.id)) && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-emerald-700 text-sm font-black">تم الحجز! ستتلقى إشعاراً قريباً.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── RATING SECTION ──────────────────────────────────────────────────── */}
      {activeSection === 'rating' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 shadow-lg">
            <h3 className="text-white font-black text-xl">⭐ قيّم مدرب ابنك</h3>
            <p className="text-amber-100 text-sm font-medium mt-1">مساهمتك تساعد في رفع جودة التدريب</p>
          </div>
          <RatingSystem
            raterRole="ولي الأمر"
            raterName={parentName}
            targets={COACHES.map(c => ({ id: c.id, name: c.name, role: c.specialty }))}
            mode="rate"
          />
        </div>
      )}

      {/* ── REPORTS SECTION ─────────────────────────────────────────────────── */}
      {activeSection === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-white font-black text-xl">📋 تقارير ابنك</h3>
              <p className="text-emerald-200 text-sm font-medium mt-1">من الأساتذة والمدربين</p>
            </div>
            <span className="bg-white/20 text-white font-black text-lg px-3 py-1.5 rounded-xl">{REPORTS.length}</span>
          </div>
          <div className="space-y-3">
            {REPORTS.map(report => (
              <Card key={report.id} className={`border-2 transition-all ${!report.read ? 'border-blue-300 bg-blue-50/30' : 'border-slate-100'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${report.fromRole === 'مدرب' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      {report.fromRole === 'مدرب' ? <Dumbbell className="w-5 h-5 text-orange-600" /> : <User className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-black text-slate-900 text-sm">{report.from}</span>
                          <Badge className={`mr-2 text-[10px] font-black border-none ${report.fromRole === 'مدرب' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {report.fromRole}
                          </Badge>
                          {!report.read && <Badge className="bg-red-500 text-white border-none text-[10px] font-black mr-1">جديد</Badge>}
                        </div>
                        <span className="text-xs text-slate-400 font-bold">{report.date}</span>
                      </div>
                      <p className="text-slate-700 font-black text-sm mt-1">{report.subject}</p>
                      {report.score && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-amber-600 font-black text-sm">{report.score}/20</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleReadReport(report)}
                        className="mt-2 text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        {expandedReport === report.id ? <><ChevronUp className="w-3 h-3" /> إخفاء</> : <><ChevronDown className="w-3 h-3" /> قراءة التقرير</>}
                      </button>
                      {expandedReport === report.id && (
                        <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 animate-in fade-in duration-200">
                          <p className="text-slate-600 text-sm font-medium leading-relaxed">{report.content}</p>
                          <button onClick={() => handleDownloadPDF(report)} className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg transition-colors border border-slate-200">⬇️ تحميل كـ PDF</button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── NUTRITION SECTION ────────────────────────────────────────────────── */}
      {activeSection === 'nutrition' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 shadow-lg">
            <h3 className="text-white font-black text-xl">🥗 البرامج الغذائية</h3>
            <p className="text-green-200 text-sm font-medium mt-1">خطط غذائية مخصصة لتعزيز أداء ابنك الرياضي</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {NUTRITION_PLANS.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                className={`text-right rounded-2xl border-2 p-5 transition-all ${selectedPlan?.id === plan.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-slate-200 bg-white hover:border-green-300'}`}
              >
                <p className="font-black text-slate-900 text-base">{plan.name}</p>
                <p className="text-green-600 text-sm font-bold mt-1">🎯 {plan.goal}</p>
                <p className="text-slate-400 text-xs font-bold mt-2">{plan.meals.length} وجبات يومياً</p>
              </button>
            ))}
          </div>
          {selectedPlan && (
            <Card className="border-2 border-green-300 animate-in fade-in duration-300">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  {selectedPlan.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPlan.meals.map((meal, i) => (
                    <div key={i} className="border-r-4 border-green-500 pr-4">
                      <p className="font-black text-slate-700 text-sm">{meal.time}</p>
                      <ul className="mt-1 space-y-0.5">
                        {meal.items.map(item => (
                          <li key={item} className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md">
                  📥 طلب هذه الخطة الغذائية لابني
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
