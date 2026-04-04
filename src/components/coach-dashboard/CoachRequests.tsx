import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { CheckCircle2, XCircle, Send, Users, Target, MessageCircle, FileText, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function CoachRequests() {
  const { trainingRequests, acceptTrainingRequest, rejectTrainingRequest, sendOffer } = useCoachDashboard();

  // Offer modal state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | number | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDuration, setOfferDuration] = useState('');
  const [offerProgram, setOfferProgram] = useState('');

  const handleOpenOfferModal = (id: string | number) => {
    setSelectedRequestId(id);
    setOfferModalOpen(true);
  };

  const handleConfirmOffer = () => {
    if (selectedRequestId) {
      sendOffer(selectedRequestId, { price: offerPrice, duration: offerDuration, program: offerProgram });
      setOfferModalOpen(false);
      setSelectedRequestId(null);
      setOfferPrice('');
      setOfferDuration('');
      setOfferProgram('');
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">طلبات التدريب الواردة</h2>
          <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">قم بإدارة عروض التدريب والطلبات المباشرة من أولياء الأمور والشباب.</p>
        </div>
        {trainingRequests.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-black px-4 py-2 text-sm rounded-xl">
            {trainingRequests.length} طلبات جديدة
          </Badge>
        )}
      </div>

      {trainingRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-3xl border border-slate-200 shadow-sm h-[50vh]">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد طلبات جديدة</h3>
          <p className="text-slate-500 font-medium text-center">لقد قمت بالرد على كافة طلبات التدريب المعلقة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trainingRequests.map((request) => (
            <Card key={request.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-3xl overflow-hidden group">
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${request.senderType === 'parent' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                      {request.senderType === 'parent' ? <Users className="w-7 h-7" /> : request.senderName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{request.senderName}</h3>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-1 mt-1">
                        {request.senderType === 'parent' ? 'طلب من ولي أمر' : 'طلب من الشاب مباشرة'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1 font-bold">بانتظار الرد</Badge>
                    <div className="flex items-center gap-1">
                      {request.tags && request.tags.map(tag => (
                         <Badge key={tag} className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-bold px-2 py-0.5 text-[10px]">
                           {tag === 'Urgent' ? 'عاجل' : tag === 'High Potential' ? 'قدرات عالية' : tag === 'Rehab' ? 'تأهيل إصابات' : tag}
                         </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-2">
                       <Target className="w-4 h-4 text-blue-500" /> الهدف من التدريب
                    </h4>
                    <p className="text-slate-700 font-medium text-sm leading-relaxed">{request.goal}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-2 px-1">تفاصيل إضافية:</h4>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed px-1 bg-white">{request.details}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-black text-slate-400">إجراءات ذكية:</span>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                      <FileText className="w-3.5 h-3.5 ml-1" /> اقتراح برنامج ذكي
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" onClick={() => acceptTrainingRequest(request.id)}>
                      <Play className="w-3.5 h-3.5 ml-1" /> بدء تدريب فوري
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                      <MessageCircle className="w-3.5 h-3.5 ml-1" /> تواصل مباشر
                    </Button>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <Button 
                      onClick={() => handleOpenOfferModal(request.id)}
                      className="flex-1 h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                    >
                      <Send className="w-4 h-4 ml-2" /> إعداد عرض مخصص
                    </Button>
                    <Button 
                      onClick={() => rejectTrainingRequest(request.id)}
                      variant="ghost" 
                      className="w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                    >
                       رفض الطلب
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Offer Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-md p-6 border-none text-right font-sans lg:rounded-3xl bg-white shadow-2xl" dir="rtl">
           <DialogHeader className="mb-4">
             <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
               <Send className="w-5 h-5 text-blue-600" /> إعداد عرض للرياضي
             </DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">السعر (ريال/شهرياً)</label>
               <Input value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} type="number" placeholder="مثال: 500" className="h-12 rounded-xl border-slate-200 font-bold" />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">المدة (رقمية)</label>
               <Input value={offerDuration} onChange={(e) => setOfferDuration(e.target.value)} placeholder="مثال: 3 أشهر" className="h-12 rounded-xl border-slate-200 font-bold" />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1.5">البرنامج المقترح</label>
               <Input value={offerProgram} onChange={(e) => setOfferProgram(e.target.value)} placeholder="مثال: تدريب عن بعد - لياقة شاملة" className="h-12 rounded-xl border-slate-200 font-bold" />
             </div>
           </div>
           
           <div className="pt-4 flex gap-3 mt-4">
             <Button variant="outline" onClick={() => setOfferModalOpen(false)} className="flex-1 rounded-xl font-bold border-slate-200 text-slate-600">إلغاء</Button>
             <Button disabled={!offerPrice || !offerDuration || !offerProgram} onClick={handleConfirmOffer} className="flex-1 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md">إرسال العرض</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
