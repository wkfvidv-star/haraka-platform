const fs = require('fs');

// 1. Fix HarakaChatbot.tsx (Theme to Orange/Red, Fix RTL alignment)
const chatbotFp = 'src/components/youth-dashboard/HarakaChatbot.tsx';
let cb = fs.readFileSync(chatbotFp, 'utf8');

cb = cb.replace(/from-indigo-600 to-purple-600/g, 'from-orange-500 to-rose-600');
cb = cb.replace(/text-indigo-300/g, 'text-orange-300');
cb = cb.replace(/bg-indigo-500\/20/g, 'bg-orange-500/20');
cb = cb.replace(/border-indigo-500\/30/g, 'border-orange-500/30');
cb = cb.replace(/from-indigo-500 to-purple-500/g, 'from-orange-500 to-rose-500');
cb = cb.replace(/text-indigo-400/g, 'text-orange-400');
cb = cb.replace(/focus-within:border-indigo-500\/50/g, 'focus-within:border-orange-500/50');
cb = cb.replace(/bg-indigo-600/g, 'bg-orange-600');
cb = cb.replace(/shadow-\[0_0_30px_rgba\(79,70,229,0\.5\)\]/g, 'shadow-[0_0_30px_rgba(249,115,22,0.5)]');
cb = cb.replace(/shadow-indigo-500\/20/g, 'shadow-orange-500/20');
cb = cb.replace(/hover:bg-indigo-500/g, 'hover:bg-orange-500');

// Fix RTL flex alignment (in RTL, flex-row starts from Right, which is correct for User)
const botAlignTarget = `msg.role === 'user' ? "flex-row-reverse" : "flex-row"`;
const botAlignReplace = `msg.role === 'user' ? "flex-row" : "flex-row-reverse"`;
cb = cb.replace(botAlignTarget, botAlignReplace);

fs.writeFileSync(chatbotFp, cb, 'utf8');

// 2. Fix CoachInboxWidget.tsx
const inboxFp = 'src/components/youth-dashboard/CoachInboxWidget.tsx';
let inbox = fs.readFileSync(inboxFp, 'utf8');

// A. Make tabs strictly uniform without wrapping
const oldTabsTarget = `className={cn("flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2",`;
const newTabsReplace = `className={cn("flex-1 whitespace-nowrap overflow-hidden text-ellipsis py-2 text-[11px] sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2",`;
inbox = inbox.split(oldTabsTarget).join(newTabsReplace);

// B. Make the upload button much more pronounced and 'platform themed'
const uploadBtnTarget1 = `bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-lg group flex items-center justify-center gap-2 py-6 rounded-xl transition-all`;
const uploadBtnReplace1 = `bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-xl shadow-orange-500/20 shadow-lg group flex items-center justify-center gap-2 py-6 rounded-xl transition-all border-none`;
inbox = inbox.replace(uploadBtnTarget1, uploadBtnReplace1);

const uploadIconTarget = `text-indigo-400 group-hover:-translate-y-1 transition-transform`;
const uploadIconReplace = `text-white group-hover:-translate-y-1 transition-transform animate-bounce`;
inbox = inbox.replace(uploadIconTarget, uploadIconReplace);

fs.writeFileSync(inboxFp, inbox, 'utf8');

// 3. Fix YouthDashboard.tsx (Heights and Layout for AI Modules & Comprehensive Dev)
const ydFp = 'src/pages/dashboards/YouthDashboard.tsx';
let yd = fs.readFileSync(ydFp, 'utf8');

// Fix AI Modules text cramping and layout
const aiModuleTarget = `                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-right"\n                >\n                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0", item.color)}>\n                    <item.icon className="w-5 h-5" />\n                  </div>\n                  <span className="font-bold text-white text-sm">{item.title}</span>`;
const aiModuleReplace = `                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-center sm:text-right h-full justify-center sm:justify-start overflow-hidden"\n                >\n                  <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0", item.color)}>\n                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />\n                  </div>\n                  <span className="font-bold text-white text-[11px] sm:text-sm mt-1 sm:mt-0 leading-tight">{item.title}</span>`;
yd = yd.replace(aiModuleTarget, aiModuleReplace);

// Fix Comprehensive Development Card Heights
const compDevTarget = `                  className={cn("group text-right p-4 rounded-xl border bg-slate-900/50 transition-all flex flex-col gap-3 shadow-lg", item.bd)}`;
const compDevReplace = `                  className={cn("group text-right p-4 rounded-xl border bg-slate-900/50 transition-all flex flex-col gap-3 shadow-lg h-full justify-between items-start", item.bd)}`;
yd = yd.replace(compDevTarget, compDevReplace);

fs.writeFileSync(ydFp, yd, 'utf8');

console.log('UI Fixes Applied Safely: Chatbot Theme, Inbox Layout, Grid Uniformity.');
