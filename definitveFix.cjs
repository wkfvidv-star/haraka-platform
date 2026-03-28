/**
 * DEFINITIVE FIX — Replaces renderDashboard using LINE NUMBERS
 * Lines 225..660 = old renderDashboard → replace with Bento Grid
 */
const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
const lines = fs.readFileSync(fp, 'utf8').split('\n');
console.log('Total lines:', lines.length);

// Find exact boundaries
let rdStart = -1, rdEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const renderDashboard = () => (') && rdStart === -1) rdStart = i;
  if (lines[i].includes('const renderTraining = () => (') && rdEnd === -1) rdEnd = i;
}
console.log(`renderDashboard: ${rdStart} → ${rdEnd - 1}`);
if (rdStart === -1 || rdEnd === -1) { process.exit(1); }

// NEW BENTO GRID renderDashboard
const newFn = `  const renderDashboard = () => (
    <div className="space-y-6 animate-in" dir="rtl">

      {hceInsights?.vision_forecast && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-orange-400">تنبؤ العقل الرقمي:</span> {hceInsights.vision_forecast}
          </p>
        </div>
      )}

      {/* ═══ BENTO GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── LEFT Col (8) ── */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* Hero Welcome */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-2xl sm:text-3xl font-black flex items-center gap-3 tracking-tighter">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Crown className="w-6 h-6 text-yellow-300" />
                  </div>
                  مرحباً {user?.name || 'أيها البطل'} 🚀
                </CardTitle>
                <CardDescription className="text-orange-50 text-base font-medium opacity-90">
                  ابدأ رحلتك نحو التميز مع منصة الشباب الذكية
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'المستوى', value: user?.level || 1, icon: Star },
                    { label: 'نقاط XP', value: user?.xp || 0, icon: Zap },
                    { label: 'العملات', value: user?.playCoins || 0, icon: Coins },
                    { label: 'الشارات', value: user?.badges?.length || 0, icon: Award },
                  ].map((s, i) => (
                    <div key={i} className="text-center p-3 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                      <div className="text-2xl font-black mb-1">{s.value}</div>
                      <div className="text-[10px] font-bold text-orange-50 flex items-center justify-center gap-1">
                        <s.icon className="w-3 h-3" />{s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coach Inbox → PDF Reports */}
          <CoachInboxWidget />

          {/* AI Modules */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden group relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-white">
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                وحدات الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 grid grid-cols-2 gap-3 pt-4">
              {[
                { tab: 'ai-motion', title: 'التصحيح الحركي', icon: Brain, color: 'bg-blue-500' },
                { tab: 'training-plan', title: 'الخطة الذكية', icon: Calendar, color: 'bg-green-500' },
                { tab: 'metrics', title: 'المقاييس الحقيقية', icon: BarChart3, color: 'bg-purple-500' },
                { tab: 'pilot-test', title: 'الاختبار الميداني', icon: TestTube, color: 'bg-red-500' }
              ].map((item, idx) => (
                <button key={idx} onClick={() => setActiveTab(item.tab)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-right"
                >
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-sm">{item.title}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Comprehensive Development Widget */}
          <Card className="bg-gradient-to-br from-indigo-900/60 to-slate-900/80 backdrop-blur-md border border-indigo-500/30 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-indigo-500/10">
              <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                قسم التطوير الشامل
              </CardTitle>
              <CardDescription className="text-indigo-200/60 text-xs font-bold">
                مكتبتك الرياضية والتأهيلية — اضغط لاكتشاف التمارين
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "الأداء الحركي", desc: "سرعة · رشاقة · قوة", icon: Activity, clr: "text-orange-400", bg: "bg-orange-500/10", bd: "border-orange-500/20 hover:border-orange-400/50" },
                { title: "المعرفي والنفسي", desc: "تركيز · هدوء · وعي", icon: Brain, clr: "text-indigo-400", bg: "bg-indigo-500/10", bd: "border-indigo-500/20 hover:border-indigo-400/50" },
                { title: "إعادة التأهيل", desc: "مفاصل · علاج · استعادة", icon: HeartPulse, clr: "text-rose-400", bg: "bg-rose-500/10", bd: "border-rose-500/20 hover:border-rose-400/50" }
              ].map((item, i) => (
                <button key={i} onClick={() => setActiveTab('library')}
                  className={cn("group text-right p-4 rounded-xl border bg-slate-900/50 transition-all flex flex-col gap-3 shadow-lg", item.bd)}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.bg)}>
                    <item.icon className={cn("w-6 h-6", item.clr)} />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm mb-0.5">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Community Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'Haraka', label: 'مختبر الإبداع', icon: Gamepad2, color: 'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:border-purple-400' },
              { id: 'ar-training', label: 'الواقع المعزز', icon: Camera, color: 'bg-orange-500/20 border-orange-500/30 text-orange-300 hover:border-orange-400' },
              { id: 'competitions', label: 'المسابقات', icon: Trophy, color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:border-yellow-400' },
              { id: 'rewards', label: 'المكافآت', icon: Gift, color: 'bg-green-500/20 border-green-500/30 text-green-300 hover:border-green-400' }
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border backdrop-blur-md transition-all font-bold text-sm", item.color)}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── RIGHT Sidebar (4) ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Expert Quick Actions */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white text-base flex items-center gap-2 font-black">
                <Sparkles className="w-4 h-4 text-yellow-400" /> إجراءات الخبراء
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {[
                { label: 'حجز جلسة مع مدرب', icon: User, cls: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-200', action: () => setShowBooking(true) },
                { label: 'خطة تغذية ذكية', icon: HeartPulse, cls: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-200', action: () => setActiveTab('training-plan') },
                { label: 'تحليل فيديو مباشر', icon: Video, cls: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-200', action: () => setShowVideoAnalysis(true) },
                { label: 'طلب برنامج تدريبي', icon: Dumbbell, cls: 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/30 text-blue-200', action: () => setActiveTab('training') },
              ].map((a, i) => (
                <button key={i} onClick={a.action}
                  className={cn("w-full text-right flex items-center gap-3 font-bold h-12 px-4 border rounded-xl transition-all group", a.cls)}
                >
                  <a.icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{a.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Daily Mission */}
          <DailyMissionCard onStart={() => setActiveTab('competitions')} />

          {/* Daily State */}
          <DailyStateCard activityLevel="Good" focusLevel="Medium" mood="Positive" isSimplified={isSimplifiedMode} />

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatsCard title="الأداء اليومي" value="94%" description="من الهدف" icon={Target} color="orange" trend={{ value: 8, isPositive: true }} />
            <StatsCard title="مؤشر التركيز" value="8.5" description="جيد جداً" icon={Brain} color="blue" />
            <StatsCard title="تمارين مكتملة" value="12" description="هذا الأسبوع" icon={Dumbbell} color="green" />
            <StatsCard title="الترتيب" value="#4" description="في المجتمع" icon={Crown} color="yellow" />
          </div>

        </div>
      </div>
    </div>
  );

`;

// Splice: remove old renderDashboard lines, insert new
lines.splice(rdStart, rdEnd - rdStart, ...newFn.split('\n'));
console.log('✓ renderDashboard replaced with Bento Grid');

// Verify all critical functions are still present
const result = lines.join('\n');
const ok = ['renderTraining', 'renderContent', 'export default', 'CoachInboxWidget', 'DailyMissionCard', 'ComprehensiveExerciseLibrary'].every(s => {
  const has = result.includes(s);
  console.log((has ? '  ✓' : '  ✗') + ' ' + s);
  return has;
});

if (!ok) { console.error('SAFETY FAIL'); process.exit(1); }

fs.writeFileSync(fp, result, 'utf8');
console.log('\n[DONE] Lines:', result.split('\n').length);
console.log('✅ BENTO GRID APPLIED!');
