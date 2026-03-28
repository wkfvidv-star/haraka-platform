const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

// ── STEP 1: Inject imports if missing ──
if (!content.includes("import CoachInboxWidget")) {
  content = content.replace(
    `import React, { useState, useEffect } from 'react';`,
    `import React, { useState, useEffect } from 'react';
import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';
import ComprehensiveExerciseLibrary from '@/components/youth-dashboard/ComprehensiveExerciseLibrary';`
  );
  console.log('✓ Imports injected');
}

// ── STEP 2: Inject library tab ──
if (!content.includes("id: 'library'")) {
  content = content.replace(
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },`,
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },
      { id: 'library', label: 'المكتبة الشاملة', icon: BookOpen },`
  );
  console.log('✓ Library tab added');
}

// ── STEP 3: REPLACE renderDashboard precisely ──
const START_MARKER = `  const renderDashboard = () => (`;
const END_MARKER = `  const renderTraining = () => (`;

const startIdx = content.indexOf(START_MARKER);
const endIdx = content.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find renderDashboard boundaries!');
  process.exit(1);
}

const newRenderDashboard = `  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6 animate-in">

      {hceInsights?.vision_forecast && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-orange-400">تنبؤ العقل الرقمي:</span> {hceInsights.vision_forecast}
          </p>
        </div>
      )}

      {/* ═══ BENTO GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── LEFT COLUMN (8 cols) ── */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* Hero Welcome Card */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-2xl sm:text-3xl font-black flex items-center gap-3 tracking-tighter">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md"><Crown className="w-6 h-6 text-yellow-300" /></div>
                  مرحباً بالشاب المبدع! 🚀
                </CardTitle>
                <CardDescription className="text-orange-50 text-base font-medium opacity-90">
                  استمر في الإبداع وحقق أهدافك مع أدوات الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'المستوى', value: user?.level || 1, icon: Star, color: 'bg-yellow-400' },
                    { label: 'نقاط الخبرة', value: user?.xp || 0, icon: Zap, color: 'bg-blue-400' },
                    { label: 'العملات', value: user?.playCoins || 0, icon: Coins, color: 'bg-emerald-400' },
                    { label: 'الشارات', value: user?.badges?.length || 0, icon: Award, color: 'bg-purple-400' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                      <div className="text-2xl font-black mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold text-orange-50 flex items-center justify-center gap-1">
                        <stat.icon className="w-3 h-3" />{stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coach Inbox – wired to PDF Reports */}
          <CoachInboxWidget />

          {/* AI Modules */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-white">
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30"><Brain className="h-5 w-5 text-white" /></div>
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

          {/* ⭐ Comprehensive Development Widget – 4 pillars */}
          <Card className="bg-gradient-to-br from-indigo-900/60 to-slate-900/80 backdrop-blur-md border border-indigo-500/30 shadow-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-indigo-500/10">
              <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                قسم التطوير الشامل
              </CardTitle>
              <CardDescription className="text-indigo-200/60 text-xs font-bold">
                مكتبتك الرياضية والتأهيلية الذكية — اضغط لفتح المكتبة مباشرة
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

        </div>

        {/* ── RIGHT SIDEBAR (4 cols) ── */}
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
                { label: 'حجز جلسة مع مدرب', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-100', tab: 'ai-motion' },
                { label: 'خطة تغذية ذكية', icon: HeartPulse, color: 'text-emerald-400', bg: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-100', tab: 'training-plan' },
                { label: 'تحليل فيديو مباشر', icon: Video, color: 'text-orange-400', bg: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-100', tab: 'ai-motion' },
              ].map((a, i) => (
                <button key={i} onClick={() => setActiveTab(a.tab)}
                  className={cn("w-full text-right flex items-center gap-3 font-bold h-12 px-4 border rounded-xl transition-all group", a.bg)}
                >
                  <a.icon className={cn("w-5 h-5 shrink-0 group-hover:scale-110 transition-transform", a.color)} />
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

content = content.substring(0, startIdx) + newRenderDashboard + content.substring(endIdx);

// ── STEP 4: Add library case to renderContent switch ──
if (!content.includes("case 'library'")) {
  content = content.replace(
    `case 'body-analysis': return renderBodyAnalysis();`,
    `case 'body-analysis': return renderBodyAnalysis();
      case 'library': return <ComprehensiveExerciseLibrary />;`
  );
  console.log('✓ Library case added to switch');
}

// ── STEP 5: Safety check ──
const finalLines = content.split('\n').length;
console.log('Final lines:', finalLines);
if (!content.includes('const renderTraining')) {
  console.error('ERROR: renderTraining missing after patch!');
  process.exit(1);
}
if (!content.includes('const renderContent')) {
  console.error('ERROR: renderContent missing after patch!');
  process.exit(1);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('\n✅ BENTO GRID applied successfully!');
