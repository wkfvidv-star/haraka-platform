import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Save, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVAILABLE_CLASSES } from '@/data/mockTeacherData';
import { useTeacherClassData } from '@/hooks/useTeacherClassData';

export function TeacherSetupModal() {
  const { hasSetup, isLoaded, saveSettings } = useTeacherClassData();
  const [schoolName, setSchoolName] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // If we haven't checked localstorage yet, or if they already set up, don't show
  if (!isLoaded || hasSetup) return null;

  const toggleClass = (className: string) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(prev => prev.filter(c => c !== className));
    } else {
      setSelectedClasses(prev => [...prev, className]);
    }
  };

  const handleSave = () => {
    if (!schoolName.trim() || selectedClasses.length === 0) return;
    setIsSaving(true);
    
    // Simulate API save delay
    setTimeout(() => {
      saveSettings({
        schoolName: schoolName.trim(),
        classes: selectedClasses,
        skipped: false
      });
      setIsSaving(false);
    }, 1500);
  };

  const handleSkip = () => {
    setIsSaving(true);
    // Faster skip simulation
    setTimeout(() => {
      saveSettings({
        schoolName: '',
        classes: [],
        skipped: true
      });
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md rtl">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-2xl border border-slate-200"
      >
        <div className="bg-gradient-to-l from-blue-700 to-indigo-800 p-8 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <GraduationCap className="w-8 h-8 text-white" />
             </div>
             <div>
               <h2 className="text-3xl font-black tracking-tight">إعداد محيط العمل</h2>
               <p className="text-blue-100 font-bold mt-1 text-base opacity-90">يُرجى إدخال بيانات مؤسستك لترشيح البيانات تلقائياً</p>
             </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          
          {/* School Name */}
          <div className="space-y-3 relative">
            <label className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> اسم المؤسسة التربوية
            </label>
            <Input 
              placeholder="مثال: إبتدائية ابن خلدون الذكية..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="h-14 text-lg font-bold border-2 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 rounded-xl pr-4 shadow-sm"
              autoFocus
            />
          </div>

          {/* Classes Selection */}
          <div className="space-y-3 relative">
            <label className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> الأقسام المُسندة لك
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_CLASSES.map(cls => {
                const isSelected = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`h-12 border-2 rounded-xl text-sm font-bold transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cls}
                  </button>
                )
              })}
            </div>
            {selectedClasses.length === 0 && (
              <p className="text-sm font-bold text-rose-500 mt-2">* يجب اختيار قسم واحد على الأقل.</p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between gap-3">
           <button 
             onClick={handleSkip}
             disabled={isSaving}
             className="text-slate-500 hover:text-slate-800 font-extrabold text-base transition-colors px-4 py-2"
           >
             تخطي الإعداد الآن
           </button>

           <Button 
             onClick={handleSave}
             disabled={isSaving || !schoolName.trim() || selectedClasses.length === 0}
             className="bg-slate-900 hover:bg-slate-800 text-white font-black h-12 px-8 rounded-xl min-w-[200px] transition-transform active:scale-95 shadow-lg flex items-center gap-2"
           >
             {isSaving ? (
               <span className="flex items-center gap-2 animate-pulse">جاري المزامنة...</span>
             ) : (
               <>حفظ وإنشاء المحيط <Save className="w-4 h-4" /></>
             )}
           </Button>
        </div>

      </motion.div>
    </div>
  );
}
