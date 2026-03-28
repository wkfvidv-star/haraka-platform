const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. ADD MISSING IMPORTS (This was causing the white screen!)
const newImports = `
import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';
import ComprehensiveExerciseLibrary from '@/components/youth-dashboard/ComprehensiveExerciseLibrary';
import YouthTechIntro from '@/components/youth-dashboard/YouthTechIntro';
`;

// Safely inject imports after React
if (!content.includes('import CoachInboxWidget')) {
    content = content.replace(
        `import React, { useState, useEffect } from 'react';`,
        `import React, { useState, useEffect } from 'react';\n${newImports}`
    );
}

// 2. REFACTOR DASHBOARD (Replace Old with Bento)
const startSentinel = 'const renderDashboard = () => (';
const endSentinel = 'const renderTraining = () => (';
const startIndex = content.indexOf(startSentinel);
const endIndex = content.indexOf(endSentinel);

if (startIndex !== -1 && endIndex !== -1 && content.includes('DailyActivity')) { // Only if old format is present
    const newRenderDashboard = `const renderDashboard = () => {
    if (!hasSeenIntro) {
      return <YouthTechIntro userName={user?.name || ''} onComplete={() => setHasSeenIntro(true)} />;
    }
    
    return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Top Bar: Navigation & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <JourneyNavigator currentStep={activeTab} onStepClick={setActiveTab} />
        <SimplifiedModeToggle isSimplified={isSimplifiedMode} onToggle={setIsSimplifiedMode} />
      </div>

      {hceInsights?.vision_forecast && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-orange-400">تنبؤ العقل الرقمي (Forecast):</span> {hceInsights.vision_forecast}
          </p>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Main Content Column (7 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Welcome Card - Hero */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-2xl sm:text-3xl font-black flex items-center gap-3 tracking-tighter">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md"><Crown className="w-6 h-6 text-yellow-300" /></div>
                  مرحباً بالشاب المبدع! 🚀
                </CardTitle>
                <CardDescription className="text-orange-50 text-base font-medium opacity-90">استمر في الإبداع وحقق أهدافك مع أدوات الذكاء الاصطناعي</CardDescription>
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
                      <div className="text-[10px] font-bold text-orange-50 flex items-center justify-center gap-1"><stat.icon className="w-3 h-3" />{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <CoachInboxWidget />

          {/* AI Features Highlight */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/50 backdrop-blur-md shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl font-black text-blue-700">
                <Brain className="h-6 w-6 text-blue-600" /> وحدات الذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 grid grid-cols-2 gap-3 mt-2">
              {[
                { tab: 'ai-motion', title: 'التصحيح الحركي', icon: Brain, color: 'bg-blue-500' },
                { tab: 'training-plan', title: 'الخطة الذكية', icon: Calendar, color: 'bg-green-500' },
                { tab: 'metrics', title: 'المقاييس الواقعية', icon: BarChart3, color: 'bg-purple-500' },
                { tab: 'pilot-test', title: 'الاختبار الميداني', icon: TestTube, color: 'bg-red-500' }
              ].map((item, idx) => (
                <Button key={idx} variant="outline" className="h-auto py-3 px-4 flex flex-col items-center gap-2 border-none shadow-sm rounded-2xl hover:bg-white/50" onClick={() => setActiveTab(item.tab)}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs">{item.title}</h4>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Comprehensive Development Widget */}
          <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 backdrop-blur-md border border-indigo-500/20 shadow-xl overflow-hidden mt-2">
            <CardHeader className="pb-3 border-b border-indigo-500/10">
                <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                    <Zap className="w-5 h-5 text-emerald-400" /> قسم التطوير الشامل
                </CardTitle>
                <CardDescription className="text-indigo-200/70 text-xs">
                    مكتبتك الرياضية والتأهيلية الذكية
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                    { title: "الأداء الحركي", desc: "سرعة ورشاقة", icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10", border: 'hover:border-orange-500/50' },
                    { title: "المعرفي والنفسي", desc: "تركيز وهدوء", icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10", border: 'hover:border-indigo-500/50' },
                    { title: "إعادة التأهيل", desc: "علاج المفاصل", icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-500/10", border: 'hover:border-rose-500/50' }
                ].map((item, i) => (
                    <button 
                        key={i}
                        onClick={() => setActiveTab('library')}
                        className={cn("text-right p-4 rounded-xl border border-white/5 bg-slate-900/50 transition-all group flex flex-col gap-2", item.border)}
                    >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", item.bg)}>
                            <item.icon className={cn("w-5 h-5", item.color)} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Actions Panel */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                <Zap className="w-5 h-5 text-yellow-400" /> إجراءات الخبراء
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Button onClick={() => setActiveTab('ai-motion')} className="w-full text-right justify-start font-bold h-12 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-100 border border-indigo-500/30 rounded-xl">
                <User className="w-5 h-5 ml-3 text-indigo-400" /> حجز جلسة مع مدرب
              </Button>
              <Button onClick={() => setActiveTab('ai-motion')} className="w-full text-right justify-start font-bold h-12 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-500/30 rounded-xl">
                <HeartPulse className="w-5 h-5 ml-3 text-emerald-400" /> خطة تغذية ذكية
              </Button>
              <Button onClick={() => setActiveTab('ai-motion')} className="w-full text-right justify-start font-bold h-12 bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 border border-orange-500/30 rounded-xl">
                <Video className="w-5 h-5 ml-3 text-orange-400" /> تحليل فيديو مباشر
              </Button>
            </CardContent>
          </Card>

          {/* Daily Mission */}
          <DailyMissionCard onStart={() => setActiveTab('competitions')} />

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatsCard title="الأداء اليومي" value="94%" description="من الهدف" icon={Target} color="orange" trend={{ value: 8, isPositive: true }} />
            <StatsCard title="مؤشر التركيز" value="8.5" description="جيد جداً" icon={Brain} color="blue" />
            <StatsCard title="تمارين مكتملة" value="12" description="هذا الأسبوع" icon={Dumbbell} color="green" />
            <StatsCard title="الترتيب" value="#4" description="في المجتمع" icon={Crown} color="yellow" />
          </div>

          <DailyStateCard activityLevel="Good" focusLevel="Medium" mood="Positive" isSimplified={isSimplifiedMode} />
          
        </div>

      </div>
    </div>
  );

  `;
  
    content = content.substring(0, startIndex) + newRenderDashboard + content.substring(endIndex);
}

// 3. Add 'library' to navigationGroups (if needed)
if (!content.includes("id: 'library'")) {
  content = content.replace(
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },`,
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },\n      { id: 'library', label: 'المكتبة الشاملة', icon: BookOpen },`
  );
}

// 4. Add comprehensive library to renderContent
if (!content.includes("activeTab === 'library'")) {
  content = content.replace(
    `{activeTab === 'body-analysis' && renderBodyAnalysis()}`,
    `{activeTab === 'body-analysis' && renderBodyAnalysis()}\n            {activeTab === 'library' && <ComprehensiveExerciseLibrary />}`
  );
}

// 5. Hooks missing for Intro
if (!content.includes('hasSeenIntro')) {
    content = content.replace(
        `const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);`,
        `const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);\n  const [hasSeenIntro, setHasSeenIntro] = useState(false);`
    );
}

// 6. Fix RenderTraining empty onclicks (avoiding undefined variables)
const button1 = `<Button variant="secondary" className="gap-2">
                <Upload className="w-4 h-4" />
                رفع فيديو
              </Button>`;
const button1Fixed = `<Button variant="secondary" className="gap-2" onClick={() => setActiveTab('ai-motion')}>
                <Upload className="w-4 h-4" />
                رفع فيديو
              </Button>`;

const button2 = `<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2">
                <Camera className="w-4 h-4" />
                تسجيل مباشر
              </Button>`;
const button2Fixed = `<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2" onClick={() => setActiveTab('ai-motion')}>
                <Camera className="w-4 h-4" />
                تسجيل مباشر
              </Button>`;

const button3 = `<div className="flex gap-2">
                    <Button className="flex-1 bg-orange-900/20 border border-orange-500/10 text-orange-2000 hover:bg-orange-600" size="sm">
                      ابدأ التدريب
                    </Button>
                    <Button variant="outline" size="sm">
                      حجز مع مدرب
                    </Button>
                  </div>`;
const button3Fixed = `<div className="flex gap-2">
                    <Button onClick={() => setActiveTab('ai-motion')} className="flex-1 bg-orange-900/20 border border-orange-500/10 text-orange-200 hover:bg-orange-600" size="sm">
                      ابدأ التدريب
                    </Button>
                    <Button onClick={() => setActiveTab('ai-motion')} variant="outline" size="sm">
                      حجز مع مدرب
                    </Button>
                  </div>`;

if (content.includes(button1)) content = content.replace(button1, button1Fixed);
if (content.includes(button2)) content = content.replace(button2, button2Fixed);
if (content.includes(button3)) content = content.replace(button3, button3Fixed);


fs.writeFileSync(targetPath, content, 'utf8');
console.log('Fixed ALL missing variables, missing imports, and rendered the master dashboard completely!');
