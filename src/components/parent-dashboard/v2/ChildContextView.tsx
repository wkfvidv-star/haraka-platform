import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Activity, BarChart3, Users, 
  ChevronRight, Calendar, Star, MessageSquare,
  ArrowUpRight, Clock, Target, Trophy, Flame, Award, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { parentDataService, Child } from '@/services/parentDataService';

// Import existing modules - assuming they can be adapted or wrapped
import { FamilyActivityHub } from '@/components/parent-dashboard/v2/FamilyActivityHub';
import { NotificationCenter } from '@/components/parent-dashboard/v2/NotificationCenter';
import { ParentCoachPanel } from '@/components/parent-dashboard/ParentCoachPanel';
import StudentAnalysisCard from '@/components/parent/StudentAnalysisCard';
import { RatingSystem } from '@/components/shared/RatingSystem';

interface ChildContextViewProps {
  child: Child;
  parentName: string;
}

export const ChildContextView: React.FC<ChildContextViewProps> = ({ child, parentName }) => {
  const [activeInternalTab, setActiveInternalTab] = useState('overview');
  const [currentChild, setCurrentChild] = useState<Child>(child);

  // Sync with prop changes
  React.useEffect(() => {
    setCurrentChild(child);
  }, [child]);

  const handleUpdateMood = (mood: Child['mood']) => {
    parentDataService.updateMood(currentChild.id, mood);
    setCurrentChild({ ...currentChild, mood });
  };

  const handleToggleTask = (taskId: string) => {
    parentDataService.toggleTask(currentChild.id, taskId);
    // Deep clone is needed for nested tasks
    const updatedTasks = currentChild.dailyTasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setCurrentChild({ ...currentChild, dailyTasks: updatedTasks });
  };

  const internalTabs = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, color: 'blue' },
    { id: 'activities', label: 'الأنشطة والتمارين', icon: Activity, color: 'emerald' },
    { id: 'reports', label: 'التقارير التفصيلية', icon: BarChart3, color: 'indigo' },
    { id: 'coach', label: 'المدرب والمتابعة', icon: Users, color: 'amber' },
  ];

  const renderTabContent = () => {
    switch (activeInternalTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'نسبة التقدم', value: `${child.currentStats.stepsGoal ? Math.round((child.currentStats.steps / child.currentStats.stepsGoal) * 100) : 0}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'النشاط الأخير', value: child.lastActivity, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'المستوى الصحي', value: child.healthStatus, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: 'الجلسة القادمة', value: child.upcomingSchedule[0]?.time || 'لا يوجد', icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] flex items-center gap-4 group hover:border-white/20 transition-all">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-black text-white mt-0.5">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  {/* Mood Check Card - Read Only for Parent */}
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                     <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                           <div>
                              <h3 className="font-black text-xl text-white">تحليل الحالة المزاجية لـ {currentChild.name}</h3>
                              <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">يُسجلها الطفل يومياً</p>
                           </div>
                           {currentChild.mood && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                                 الحالة الحالية: {currentChild.mood}
                              </Badge>
                           )}
                        </div>
                        <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-5xl">
                              {currentChild.mood === 'سعيد' ? '😊' : 
                               currentChild.mood === 'متحمس' ? '🤩' : 
                               currentChild.mood === 'هادئ' ? '😌' : 
                               currentChild.mood === 'متعب' ? '😴' : 
                               currentChild.mood === 'قلق' ? '😟' : '😶'}
                           </div>
                           <div className="flex-1">
                              <p className="text-white font-bold mb-1">
                                 {currentChild.mood ? `يشعر بـ ${currentChild.mood} اليوم` : "لم يتم تسجيل الحالة بعد"}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                 <Info className="w-3.5 h-3.5" />
                                 تظهر هذه الحالة بناءً على إدخال الطفل في واجهته الخاصة لتعزيز المصداقية والخصوصية.
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Daily Tasks Card */}
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
                     <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                             <Target className="w-5 h-5" />
                           </div>
                           <h3 className="font-black text-xl text-white">مهام اليوم</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                           {currentChild.dailyTasks.filter(t => t.completed).length} / {currentChild.dailyTasks.length} مكتملة
                        </span>
                     </div>
                     <div className="p-6 space-y-4">
                        {currentChild.dailyTasks.length > 0 ? (
                           currentChild.dailyTasks.map((task) => (
                              <button
                                 key={task.id}
                                 onClick={() => handleToggleTask(task.id)}
                                 className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group
                                    ${task.completed 
                                       ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                                       : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
                                       ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                       {task.completed && <Star className="w-3.5 h-3.5 text-white fill-white" />}
                                    </div>
                                    <div className="text-right">
                                       <span className={`font-bold block ${task.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                          {task.title}
                                       </span>
                                       <Badge variant="outline" className="text-[10px] h-4 px-1 px-1 mt-1 border-white/10 text-slate-500">
                                          {task.category}
                                       </Badge>
                                    </div>
                                 </div>
                                 <ArrowUpRight className={`w-4 h-4 transition-transform ${task.completed ? 'text-emerald-500' : 'text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                              </button>
                           ))
                        ) : (
                           <div className="py-10 text-center space-y-3">
                              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
                                 <Activity className="w-8 h-8" />
                              </div>
                              <p className="text-slate-500 font-bold">لا يوجد مهام محددة لهذا اليوم</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-1 space-y-6">
                  {/* Progress Snapshot */}
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-6 shadow-xl relative overflow-hidden group">
                     <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                     
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                              <Trophy className="w-6 h-6 text-white" />
                           </div>
                           <div className="text-right">
                              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">المستوى الحالي</p>
                              <p className="text-2xl font-black text-white leading-none mt-1">{currentChild.level}</p>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-black text-white/80">التقدم نحو المستوى التالى</span>
                              <span className="text-sm font-black text-white">{currentChild.xp} / {currentChild.level * 500} XP</span>
                           </div>
                           <Progress value={(currentChild.xp / (currentChild.level * 500)) * 100} className="h-2 bg-black/20" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                           <div>
                              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">تتابع الأيام</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                                 <span className="text-xl font-black text-white">{currentChild.streak}</span>
                              </div>
                           </div>
                           <div>
                              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">الرتبة</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <Award className="w-5 h-5 text-amber-400" />
                                 <span className="text-xl font-black text-white">ممتاز</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <NotificationCenter targetChildName={currentChild.name} />
               </div>
            </div>
          </div>
        );
      case 'activities':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-[24px] flex items-center justify-center text-emerald-500">
                   <Activity className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">جدول التمارين للأسبوع الحالي</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                   يتم مزامنة هذه البيانات تلقائياً مع الجهاز القابل للارتداء الخاص بـ {child.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                   {child.upcomingSchedule.map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                         <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            <div className="text-right">
                               <p className="font-bold text-white">{item.activity}</p>
                               <p className="text-xs text-slate-500">{item.time}</p>
                            </div>
                         </div>
                         <Badge>{item.type}</Badge>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
      case 'reports':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
             <StudentAnalysisCard />
          </div>
        );
      case 'coach':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <ParentCoachPanel parentName={parentName} childName={child.name} />
             <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8">
                <h3 className="font-black text-xl text-white mb-6">تقييم الأداء من المدربين</h3>
                <RatingSystem 
                  raterRole="مدرب"
                  raterName="كريم بوعلام"
                  receiverId={child.id}
                  receiverName={child.name}
                  mode="view"
                />
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* 🧭 Internal Child-Context Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[24px] overflow-x-auto no-scrollbar scroll-smooth">
        {internalTabs.map((tab) => {
          const isActive = activeInternalTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveInternalTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-[20px] font-black text-sm whitespace-nowrap transition-all duration-300 relative group
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 hover:text-slate-300'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeInternalTab"
                  className={`absolute inset-0 bg-gradient-to-tr ${
                    tab.id === 'overview' ? 'from-blue-600 to-indigo-600 shadow-blue-500/20' :
                    tab.id === 'activities' ? 'from-emerald-600 to-teal-600 shadow-emerald-500/20' :
                    tab.id === 'reports' ? 'from-indigo-600 to-violet-600 shadow-indigo-500/20' :
                    'from-amber-500 to-orange-600 shadow-amber-500/20'
                  } rounded-[18px] shadow-lg`}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 📄 Content Area with Progressive Disclosure Focus */}
      <main className="min-h-[400px]">
        {renderTabContent()}
      </main>
    </div>
  );
};
