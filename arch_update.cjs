const fs = require('fs');

const fp = 'src/pages/dashboards/YouthDashboard.tsx';
let c = fs.readFileSync(fp, 'utf8');

// 1. REORGANIZE THE BENTO GRID 
// Remove AI Modules and Comprehensive Dev from their current positions, and inject them at the top.
// Identify chunks:
const startHero = c.indexOf(`{/* Hero Welcome */}`);
const endHero = c.indexOf(`{/* Coach Inbox → PDF Reports */}`);
const heroWelcomeChunk = c.substring(startHero, endHero).trim();

const startInbox = c.indexOf(`{/* Coach Inbox → PDF Reports */}`);
const endInbox = c.indexOf(`{/* AI Modules */}`);
const inboxChunk = c.substring(startInbox, endInbox).trim();

const startAI = c.indexOf(`{/* AI Modules */}`);
const endAI = c.indexOf(`{/* Comprehensive Development Widget */}`);
const aiChunk = c.substring(startAI, endAI).trim();

const startComp = c.indexOf(`{/* Comprehensive Development Widget */}`);
const endComp = c.indexOf(`{/* Quick Community Links */}`);
const compChunk = c.substring(startComp, endComp).trim();

const startOther = c.indexOf(`{/* Quick Community Links */}`);
const endOther = c.indexOf(`{/* ── RIGHT Sidebar`);
const otherChunk = c.substring(startOther, endOther).trim();

// Reconstruction of LEFT Col (8)
const leftColStartStr = `{/* ── LEFT Col (8) ── */}\n        <div className="lg:col-span-8 flex flex-col gap-5">`;
const leftColReconstruct = `${leftColStartStr}

          ${heroWelcomeChunk}

          {/* New Prominent Positioning for Important Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             ${aiChunk}
             ${compChunk}
          </div>

          ${inboxChunk}
          ${otherChunk}
`;

// Replace everything between leftColStartStr and endOther with leftColReconstruct
const oldLeftColContentStr = c.substring(c.indexOf(leftColStartStr), endOther);
c = c.replace(oldLeftColContentStr, leftColReconstruct);


// 2. MAIN LAYOUT RESTRUCTURE
// Replace the return block starting from <div className={`expert-dashboard-root...
const oldReturnStart = c.indexOf(`return (
    <div className={\`expert-dashboard-root selection:bg-orange-500/30 \${isRTL ? 'rtl' : 'ltr'}\`}>`);
const oldReturnEnd = c.indexOf(`}\n\n\n`) !== -1 ? c.indexOf(`}\n\n\n`, oldReturnStart) : c.lastIndexOf(`}`);

const newReturnHTML = `return (
    <div className={\`flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-arabic selection:bg-orange-500/30 \${isRTL ? 'rtl' : 'ltr'}\`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Image with Deep Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/youth_adults_active_bg.png')] bg-cover bg-center opacity-20 filter blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/80"></div>
      </div>

      {/* DYNAMIC SIDEBAR (RTL/LTR Adaptive) */}
      <aside className="w-80 shrink-0 border-x border-white/5 bg-slate-950/50 backdrop-blur-3xl relative z-40 flex flex-col shadow-2xl h-full">
        <div className="p-6 flex items-center gap-4 group cursor-pointer border-b border-white/5 bg-white/5">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10 shrink-0"
          >
            <Crown className="h-8 w-8 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter leading-none">
              منصة الشباب
            </h1>
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">Haraka Universe</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
          {/* Menu Sections mapped onto the prominent sidebar */}
          <div className="space-y-2">
             <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3 px-2">الرئيسية</div>
             <button
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-right",
                  activeTab === 'dashboard'
                    ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/50"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className={cn("p-2 rounded-xl", activeTab==='dashboard'? "bg-white/20": "bg-slate-800")}>
                    <Home className="h-4 w-4" />
                </div>
                لوحة القيادة الرئيسية
              </button>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3 px-2">التطوير والتدريب</div>
            {[...navigationGroups.training, ...navigationGroups.development].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-right",
                  activeTab === tab.id
                    ? "bg-white/10 text-orange-400 border border-white/10 shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className={cn("p-2 rounded-xl border", activeTab===tab.id? "bg-orange-500/20 border-orange-500/30 text-orange-400": "bg-slate-800/50 border-white/5")}>
                    <tab.icon className="h-4 w-4" />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3 px-2">مختبرات وإبداع</div>
            {[...navigationGroups.innovation, ...navigationGroups.community, ...navigationGroups.analysis].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-right",
                  activeTab === tab.id
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className={cn("p-2 rounded-xl border", activeTab===tab.id? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400": "bg-slate-800/50 border-white/5")}>
                    <tab.icon className="h-4 w-4" />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-md relative z-50">
           {/* Static Chatbot Widget Wrapper */}
           <div className="relative">
              <HarakaChatbot />
           </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Dynamic Nav Header */}
        <header className="h-24 bg-slate-900/30 backdrop-blur-md border-b border-white/5 flex flex-col justify-center px-8 shrink-0">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-black tracking-tight text-white mb-1 opacity-90">لوحة التحكم السحابية</h2>
                   <p className="text-xs text-slate-400">تابع مقاييسك، تواصل مع فريقك الطبي، واكتشف آفاقك.</p>
                </div>
                
                {/* User Info and Controls */}
                <div className="flex items-center gap-6">
                   <div className="hidden sm:block"><LanguageSwitcher /></div>
                   <div className="flex items-center gap-4 pl-4 border-l border-white/10 rtl:pr-4 rtl:pl-0 rtl:border-r rtl:border-l-0">
                      <div className="text-left rtl:text-right hidden md:block">
                         <div className="text-base font-black text-white leading-none">{user?.name}</div>
                         <div className="text-[11px] font-black text-orange-400 uppercase mt-1 tracking-widest">مشترك ألماسي</div>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-xl cursor-pointer" onClick={() => setActiveTab('profile')}>
                        <User className="h-7 w-7 text-slate-300" />
                      </motion.div>
                   </div>
                   <Button variant="ghost" size="icon" onClick={logout} className="w-12 h-12 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/10">
                        <LogOut className="h-6 w-6" />
                   </Button>
                </div>
            </div>
        </header>

        {/* Dash Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
           <div className="max-w-7xl mx-auto w-full">
              {renderContent()}
           </div>
        </div>

      </main>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-8 rtl:left-8 ltr:right-8 z-50">
        <QuickActionsFAB />
      </div>

      {/* Global Modals */}
      {showBooking && <CoachBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />}
      {showVideoAnalysis && <VideoAnalysisModal isOpen={showVideoAnalysis} onClose={() => setShowVideoAnalysis(false)} />}
    </div>
  );`;

const finalScript = c.substring(0, oldReturnStart) + newReturnHTML + '\n}\n\n';

fs.writeFileSync(fp, finalScript, 'utf8');
console.log('Sidebar Layout Update Step 1 Complete');
