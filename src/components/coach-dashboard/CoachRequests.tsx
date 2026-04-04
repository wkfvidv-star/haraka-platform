import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { CheckCircle2, XCircle, Send, Users, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CoachRequests() {
  const { trainingRequests, acceptTrainingRequest, rejectTrainingRequest, sendOffer } = useCoachDashboard();

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
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 px-3 py-1 font-bold">بانتظار الرد</Badge>
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

                <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-auto pt-4 border-t border-slate-100">
                  <Button 
                    onClick={() => acceptTrainingRequest(request.id)}
                    className="flex-1 h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5 ml-2" /> قبول
                  </Button>
                  <Button 
                    onClick={() => sendOffer(request.id)}
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl font-bold border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Send className="w-4 h-4 ml-2" /> إرسال عرض
                  </Button>
                  <Button 
                    onClick={() => rejectTrainingRequest(request.id)}
                    variant="ghost" 
                    className="w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <XCircle className="w-5 h-5 ml-2" /> رفض
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
