import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send, Paperclip, MoreVertical, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const contacts = [
  { id: 1, name: 'أمين بوعلام', lastMessage: 'كابتن هل يمكنني تغيير تمرين السكوات اليوم بسبب الركبة؟', time: '10:30 ص', unread: 2, online: true },
  { id: 2, name: 'رياض محرز', lastMessage: 'تم إنجاز حصة الإطالة بنجاح ✅', time: 'أمس', unread: 0, online: false },
  { id: 3, name: 'مجموعة المبتدئين (12)', lastMessage: 'تذكير: موعدنا اليوم الساعة 5 م.', time: 'أمس', unread: 0, online: true },
];

const mockHistory = [
  { id: 1, sender: 'coach', text: 'أهلاً أمين، تم إرسال برنامج هذا الأسبوع. ركز جيداً على تمارين الإطالة.', time: '09:12 ص' },
  { id: 2, sender: 'other', text: 'كابتن هل يمكنني تغيير تمرين السكوات اليوم بسبب الركبة؟ لدي ألم خفيف.', time: '10:30 ص' },
  { id: 3, sender: 'coach', text: 'ممتاز، استمر!', time: '10:35 ص' },
];

export default function CoachMessages() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(mockHistory);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { 
       id: Date.now(), 
       sender: 'coach', 
       text: inputText, 
       time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInputText('');
  };

  return (
    <div className="space-y-6 max-h-[800px] h-[calc(100vh-140px)] flex flex-col">
      {/* HEADER */}
      <div className="shrink-0 mb-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">المراسلات المباشرة</h2>
        <p className="text-lg text-slate-500 mt-2 font-medium">تواصل مع المتدربين، أرسل تعليقات على الفيديوهات، واستقبل أسئلتهم.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* INBOX (LEFT SIDEBAR) */}
        <Card className="w-1/3 bg-white border-slate-200 shadow-sm flex flex-col h-full overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
              <Input className="pl-4 pr-10 h-11 rounded-xl border-slate-200 bg-slate-50 font-semibold text-sm" placeholder="ابحث في المحادثات..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${activeContact.id === contact.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}
              >
                <div className="relative shrink-0">
                   <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-black text-lg text-slate-600">
                     {contact.name.charAt(0)}
                   </div>
                   {contact.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                     <h4 className="font-bold text-slate-900 truncate">{contact.name}</h4>
                     <span className="text-xs font-semibold text-slate-400 shrink-0">{contact.time}</span>
                  </div>
                  <p className={`text-sm truncate ${contact.unread > 0 ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ACTIVE CHAT WORKSPACE */}
        <Card className="flex-1 bg-white border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          {/* CHAT HEADER */}
          <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-slate-50/50">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-black text-lg text-slate-600">
                  {activeContact?.name.charAt(0)}
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-900">{activeContact?.name}</h3>
                   <span className="text-sm font-semibold text-green-500">متصل الآن</span>
                </div>
             </div>
             <Button variant="outline" className="rounded-xl font-bold text-slate-600 border-slate-200">
                عرض الملف الشخصي
             </Button>
          </div>

          {/* CHAT MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'coach' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.sender === 'coach' 
                    ? 'bg-blue-600 text-white rounded-tl-sm shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tr-sm shadow-sm'
                }`}>
                  <p className="font-medium text-sm md:text-base">{msg.text}</p>
                  <span className={`text-[10px] mt-2 block font-semibold ${msg.sender === 'coach' ? 'text-blue-200 flex items-center gap-1' : 'text-slate-400'}`}>
                    {msg.sender === 'coach' && <CheckCircle2 className="w-3.5 h-3.5"/>} {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CHAT INPUT */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center gap-3">
              {/* Input Area */}
              <div className="flex-1 bg-slate-100 rounded-xl flex items-center px-4 h-14 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`اكتب رسالة لـ ${activeContact?.name.split(' ')[0]}...`} 
                  className="border-none bg-transparent shadow-none px-0 h-full font-medium focus-visible:ring-0 placeholder:text-slate-400" 
                />
                <Button onClick={() => toast('سيتم إضافة مرفق قريباً')} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-full w-10 h-10 shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
              </div>

              {/* Send Button */}
              <Button onClick={handleSendMessage} className="h-14 w-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shrink-0 p-0 flex items-center justify-center -rotate-180">
                <Send className="w-6 h-6" />
              </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
