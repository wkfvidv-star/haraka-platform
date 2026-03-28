const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add Imports
const importsToAdd = `
import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';
import ComprehensiveExerciseLibrary from '@/components/youth-dashboard/ComprehensiveExerciseLibrary';
`;
if (!content.includes('CoachInboxWidget')) {
  content = content.replace(
    `import YouthOnboarding from '@/components/youth-dashboard/YouthOnboarding';`,
    `${importsToAdd}\nimport YouthOnboarding from '@/components/youth-dashboard/YouthOnboarding';`
  );
}

// 2. Add 'library' to navigationGroups
if (!content.includes(`id: 'library'`)) {
  content = content.replace(
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },`,
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },\n      { id: 'library', label: 'المكتبة الشاملة', icon: BookOpen },`
  );
}

// 3. Add to renderContent
if (!content.includes(`activeTab === 'library' && <ComprehensiveExerciseLibrary />`)) {
  content = content.replace(
    `{activeTab === 'body-analysis' && renderBodyAnalysis()}`,
    `{activeTab === 'body-analysis' && renderBodyAnalysis()}\n            {activeTab === 'library' && <ComprehensiveExerciseLibrary />}`
  );
}

// 4. Refactor renderDashboard
// We need to replace the entire body of renderDashboard
// It starts at "const renderDashboard = () => (" and ends just before "const renderTraining = () => ("

const startSentinel = 'const renderDashboard = () => (';
const endSentinel = 'const renderTraining = () => (';

const startIndex = content.indexOf(startSentinel);
const endIndex = content.indexOf(endSentinel);

if (startIndex !== -1 && endIndex !== -1) {
    const newRenderDashboard = `const renderDashboard = () => (
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

          {/* 🎯 New Feature: Coach Inbox Widget - directly placed here */}
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

          {/* Library Shortcut */}
          <div className="mt-2">
            <Button onClick={() => setActiveTab('library')} className="w-full h-14 rounded-2xl font-black bg-slate-900 border border-white/10 hover:bg-slate-800 text-white flex justify-between px-6 shadow-xl relative overflow-hidden group">
                <span className="flex items-center gap-3 relative z-10">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    استكشف المكتبة الشاملة للتمارين (4 أقسام)
                </span>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:-translate-x-2 transition-transform relative z-10" />
            </Button>
          </div>

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
              <Button onClick={() => setIsCoachModalOpen(true)} className="w-full text-right justify-start font-bold h-12 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-100 border border-indigo-500/30 rounded-xl">
                <User className="w-5 h-5 ml-3 text-indigo-400" /> حجز جلسة مع مدرب
              </Button>
              <Button onClick={() => setIsDietModalOpen(true)} className="w-full text-right justify-start font-bold h-12 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-500/30 rounded-xl">
                <HeartPulse className="w-5 h-5 ml-3 text-emerald-400" /> خطة تغذية ذكية
              </Button>
              <Button onClick={() => setIsVideoAnalysisOpen(true)} className="w-full text-right justify-start font-bold h-12 bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 border border-orange-500/30 rounded-xl">
                <Video className="w-5 h-5 ml-3 text-orange-400" /> تحليل فيديو مباشر
              </Button>
            </CardContent>
          </Card>

          {/* Daily Mission */}
          <DailyMissionCard />

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

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Grid layout refactoring successful!');
