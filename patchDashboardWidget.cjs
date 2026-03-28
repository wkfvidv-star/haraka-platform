const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Replace the single "Library Shortcut" button with ComprehensiveDevelopmentWidget
const oldButton = `<div className="mt-2">
            <Button onClick={() => setActiveTab('library')} className="w-full h-14 rounded-2xl font-black bg-slate-900 border border-white/10 hover:bg-slate-800 text-white flex justify-between px-6 shadow-xl relative overflow-hidden group">
                <span className="flex items-center gap-3 relative z-10">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    استكشف المكتبة الشاملة للتمارين (4 أقسام)
                </span>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:-translate-x-2 transition-transform relative z-10" />
            </Button>
          </div>`;

const newWidget = `{/* Comprehensive Development Widget */}
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
          </Card>`;

if (content.includes(oldButton)) {
    content = content.replace(oldButton, newWidget);
}

// 2. Fix the missing onClick handlers in renderTraining
const button1 = `<Button variant="secondary" className="gap-2">
                <Upload className="w-4 h-4" />
                رفع فيديو
              </Button>`;
const button1Fixed = `<Button variant="secondary" className="gap-2" onClick={() => setIsVideoAnalysisOpen(true)}>
                <Upload className="w-4 h-4" />
                رفع فيديو
              </Button>`;

const button2 = `<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2">
                <Camera className="w-4 h-4" />
                تسجيل مباشر
              </Button>`;
const button2Fixed = `<Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 gap-2" onClick={() => setIsVideoAnalysisOpen(true)}>
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
                    <Button onClick={() => setActiveTab('library')} className="flex-1 bg-orange-900/20 border border-orange-500/10 text-orange-200 hover:bg-orange-600" size="sm">
                      ابدأ التدريب
                    </Button>
                    <Button onClick={() => setIsCoachModalOpen(true)} variant="outline" size="sm">
                      حجز مع مدرب
                    </Button>
                  </div>`;

if (content.includes(button1)) content = content.replace(button1, button1Fixed);
if (content.includes(button2)) content = content.replace(button2, button2Fixed);
if (content.includes(button3)) content = content.replace(button3, button3Fixed);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Final dashboard patches applied successfully');
