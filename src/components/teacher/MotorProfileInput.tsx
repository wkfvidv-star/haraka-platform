import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Search, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for classes and students
const mockClasses = [
    { id: 'c1', name: 'الثالثة متوسط أ' },
    { id: 'c2', name: 'الثالثة متوسط ب' },
    { id: 'c3', name: 'الرابعة متوسط أ' },
];

const mockStudents = [
    { id: 's1', classId: 'c1', name: 'أحمد محمد علي', hasProfile: false },
    { id: 's2', classId: 'c1', name: 'فاطمة الزهراء', hasProfile: true },
    { id: 's3', classId: 'c1', name: 'يوسف بن بلقاسم', hasProfile: false },
    { id: 's4', classId: 'c2', name: 'ياسين براهيمي', hasProfile: false },
];

export function MotorProfileInput() {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        speed50m: '',
        pushups: '',
        flexibility: '',
        agility: '',
        motivation: '5',
    });

    const filteredStudents = mockStudents.filter(s => s.classId === selectedClass);
    const activeStudent = mockStudents.find(s => s.id === selectedStudent);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "تم حفظ البصمة الحركية بنجاح",
                description: `تم تحديث ملف الطالب ${activeStudent?.name}`,
            });
            // Reset after save
            setSelectedStudent('');
            setFormData({
                height: '',
                weight: '',
                speed50m: '',
                pushups: '',
                flexibility: '',
                agility: '',
                motivation: '5',
            });
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Card className="flex-1 border-blue-100 dark:border-blue-900/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-500" />
                            اختيار الطالب للتقييم
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>القسم / الصف</Label>
                                <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedStudent(''); }}>
                                    <SelectTrigger dir="rtl">
                                        <SelectValue placeholder="اختر القسم..." />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                        {mockClasses.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>الطالب</Label>
                                <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedClass}>
                                    <SelectTrigger dir="rtl">
                                        <SelectValue placeholder="اختر الطالب..." />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                        {filteredStudents.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{s.name}</span>
                                                    {s.hasProfile && <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {selectedStudent && (
                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-500" />
                            إدخال القياسات الميدانية
                        </CardTitle>
                        <CardDescription>
                            يتم إدخال هذه البيانات من قبل أستاذ التربية البدنية لتحديث "الملف الرقمي الشامل" وتوجيه التدريب المتكيف للطالب: <strong className="text-primary">{activeStudent?.name}</strong>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Biometrics */}
                        <div>
                            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b">القياسات الحيوية المورفولوجية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>الطول (سم)</Label>
                                    <Input 
                                        type="number" 
                                        dir="ltr" 
                                        placeholder="مثال: 165" className="text-right" 
                                        value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>الوزن (كغ)</Label>
                                    <Input 
                                        type="number" 
                                        dir="ltr" 
                                        placeholder="مثال: 55" className="text-right"
                                        value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Motor Tests */}
                        <div>
                            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b">الاختبارات البدنية (البصمة الحركية)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>السرعة 50م (ثواني)</Label>
                                    <Input 
                                        type="number" step="0.1" dir="ltr" placeholder="مثال: 7.8" className="text-right"
                                        value={formData.speed50m} onChange={e => setFormData({...formData, speed50m: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>القوة (تكرارات الانبطاح المائل)</Label>
                                    <Input 
                                        type="number" dir="ltr" placeholder="مثال: 20" className="text-right"
                                        value={formData.pushups} onChange={e => setFormData({...formData, pushups: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>المرونة (ثني الجذع - سم)</Label>
                                    <Input 
                                        type="number" dir="ltr" placeholder="مثال: +5" className="text-right"
                                        value={formData.flexibility} onChange={e => setFormData({...formData, flexibility: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>الرشاقة (جري مكوك - ثواني)</Label>
                                    <Input 
                                        type="number" step="0.1" dir="ltr" placeholder="مثال: 12.5" className="text-right"
                                        value={formData.agility} onChange={e => setFormData({...formData, agility: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cognitive/Psychological */}
                        <div>
                            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b">التقييم النفسي والمعرفي (الملاحظة الميدانية)</h3>
                            <div className="space-y-2 w-full md:w-1/2">
                                <Label>مستوى الدافعية والمشاركة (من 1 إلى 10)</Label>
                                <Select value={formData.motivation} onValueChange={(val) => setFormData({...formData, motivation: val})}>
                                    <SelectTrigger dir="rtl">
                                        <SelectValue placeholder="اختر التقييم" />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                            <SelectItem key={n} value={n.toString()}>{n} - {n > 7 ? 'ممتاز' : n > 4 ? 'متوسط' : 'ضعيف'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedStudent('')}>إلغاء</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                                {isSaving ? 'جاري الحفظ...' : (
                                    <>
                                        <Save className="w-4 h-4 ml-2" />
                                        حفظ واعتماد البصمة
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
