import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target,
  Plus,
  Edit,
  Eye,
  Share2,
  Copy,
  Users,
  Clock,
  Calendar,
  Activity,
  Award,
  BookOpen,
  Download,
  Upload,
  Star,
  Heart,
  Dumbbell,
  Zap
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: number;
  restTime: number;
  instructions: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
}

interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  category: 'قوة' | 'تحمل' | 'مرونة' | 'شامل' | 'إعادة تأهيل';
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  duration: number; // weeks
  sessionsPerWeek: number;
  sessionDuration: number; // minutes
  targetAudience: string[];
  goals: string[];
  exercises: Exercise[];
  createdDate: string;
  isPublic: boolean;
  isBookable: boolean;
  price?: number;
  enrolledClients: number;
  rating: number;
  reviews: number;
  tags: string[];
}

const mockPrograms: TrainingProgram[] = [
  {
    id: '1',
    name: 'برنامج بناء القوة للمبتدئين',
    description: 'برنامج تدريبي شامل لبناء القوة العضلية للمبتدئين مع التركيز على الحركات الأساسية',
    category: 'قوة',
    difficulty: 'مبتدئ',
    duration: 8,
    sessionsPerWeek: 3,
    sessionDuration: 60,
    targetAudience: ['المبتدئين', 'الرجال', 'النساء'],
    goals: ['بناء القوة الأساسية', 'تعلم التقنيات الصحيحة', 'زيادة الكتلة العضلية'],
    exercises: [
      {
        id: '1',
        name: 'القرفصاء',
        category: 'ساقين',
        sets: 3,
        reps: '8-12',
        weight: 'وزن الجسم أو أوزان خفيفة',
        restTime: 90,
        instructions: 'احرص على النزول حتى الزاوية 90 درجة مع الحفاظ على استقامة الظهر',
        difficulty: 'مبتدئ'
      },
      {
        id: '2',
        name: 'الضغط',
        category: 'صدر',
        sets: 3,
        reps: '5-10',
        weight: 'وزن الجسم',
        restTime: 60,
        instructions: 'ابدأ من وضعية البلانك واهبط حتى يلامس الصدر الأرض تقريباً',
        difficulty: 'مبتدئ'
      }
    ],
    createdDate: '2024-09-01',
    isPublic: true,
    isBookable: true,
    price: 500,
    enrolledClients: 12,
    rating: 4.8,
    reviews: 8,
    tags: ['قوة', 'مبتدئ', 'أساسي']
  },
  {
    id: '2',
    name: 'تحدي الكارديو المكثف',
    description: 'برنامج تدريبي عالي الكثافة لحرق الدهون وتحسين اللياقة القلبية الوعائية',
    category: 'تحمل',
    difficulty: 'متقدم',
    duration: 6,
    sessionsPerWeek: 4,
    sessionDuration: 45,
    targetAudience: ['المتقدمين', 'الرياضيين'],
    goals: ['حرق الدهون', 'تحسين التحمل', 'زيادة اللياقة القلبية'],
    exercises: [
      {
        id: '1',
        name: 'بيربي',
        category: 'كامل الجسم',
        sets: 4,
        reps: '10-15',
        restTime: 30,
        instructions: 'حركة متفجرة تجمع بين القرفصاء والقفز والضغط',
        difficulty: 'متقدم'
      }
    ],
    createdDate: '2024-09-15',
    isPublic: true,
    isBookable: true,
    price: 400,
    enrolledClients: 8,
    rating: 4.6,
    reviews: 5,
    tags: ['كارديو', 'حرق دهون', 'مكثف']
  }
];

export function TrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(mockPrograms);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterDifficulty, setFilterDifficulty] = useState('الكل');

  const categories = ['الكل', 'قوة', 'تحمل', 'مرونة', 'شامل', 'إعادة تأهيل'];
  const difficulties = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = filterCategory === 'الكل' || program.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'الكل' || program.difficulty === filterDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'قوة': return <Dumbbell className="h-4 w-4" />;
      case 'تحمل': return <Heart className="h-4 w-4" />;
      case 'مرونة': return <Activity className="h-4 w-4" />;
      case 'شامل': return <Target className="h-4 w-4" />;
      case 'إعادة تأهيل': return <Award className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'متقدم': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  if (selectedProgram) {
    return (
      <div className="space-y-6">
        {/* Program Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getCategoryIcon(selectedProgram.category)}
                  {selectedProgram.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedProgram.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getDifficultyColor(selectedProgram.difficulty)}>
                    {selectedProgram.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {selectedProgram.category}
                  </Badge>
                  {selectedProgram.isPublic && (
                    <Badge className="bg-blue-100 text-blue-800">
                      عام
                    </Badge>
                  )}
                  {selectedProgram.isBookable && (
                    <Badge className="bg-green-100 text-green-800">
                      قابل للحجز
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  مشاركة
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedProgram(null)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Program Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedProgram.duration}</div>
              <div className="text-sm text-gray-500">أسابيع</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedProgram.sessionDuration}</div>
              <div className="text-sm text-gray-500">دقيقة/جلسة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedProgram.enrolledClients}</div>
              <div className="text-sm text-gray-500">عميل مسجل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedProgram.rating}</div>
              <div className="text-sm text-gray-500">تقييم ({selectedProgram.reviews})</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercises List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              التمارين ({selectedProgram.exercises.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProgram.exercises.map((exercise) => (
                <div key={exercise.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">المجموعات: </span>
                      <span>{exercise.sets}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">التكرارات: </span>
                      <span>{exercise.reps}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">الراحة: </span>
                      <span>{exercise.restTime}ث</span>
                    </div>
                    <div>
                      <span className="text-gray-500">الفئة: </span>
                      <span>{exercise.category}</span>
                    </div>
                  </div>
                  {exercise.weight && (
                    <div className="text-sm mb-2">
                      <span className="text-gray-500">الوزن/المقاومة: </span>
                      <span>{exercise.weight}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{exercise.instructions}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6" />
            البرامج التدريبية
          </CardTitle>
          <CardDescription className="text-orange-100">
            إنشاء وإدارة البرامج التدريبية المخصصة والقابلة للمشاركة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{programs.length}</div>
                <div className="text-sm text-orange-100">إجمالي البرامج</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {programs.filter(p => p.isPublic).length}
                </div>
                <div className="text-sm text-orange-100">برامج عامة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {programs.reduce((acc, p) => acc + p.enrolledClients, 0)}
                </div>
                <div className="text-sm text-orange-100">إجمالي المشتركين</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء برنامج جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">مستوى الصعوبة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                استيراد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(program.category)}
                  <Badge className={getDifficultyColor(program.difficulty)}>
                    {program.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {program.category}
                  </Badge>
                </div>
                {program.price && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{program.price} ر.س</div>
                  </div>
                )}
              </div>
              
              <CardTitle className="text-lg">{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Program Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{program.duration}</div>
                  <div className="text-xs text-gray-500">أسابيع</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{program.enrolledClients}</div>
                  <div className="text-xs text-gray-500">مشترك</div>
                </div>
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <Star className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{program.rating}</div>
                  <div className="text-xs text-gray-500">تقييم</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {program.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Status Badges */}
              <div className="flex gap-2">
                {program.isPublic && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    عام
                  </Badge>
                )}
                {program.isBookable && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    قابل للحجز
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedProgram(program)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  عرض
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  مشاركة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                إنشاء برنامج تدريبي جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program-name">اسم البرنامج</Label>
                  <Input id="program-name" placeholder="اسم البرنامج..." />
                </div>
                <div>
                  <Label htmlFor="program-category">الفئة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="program-description">الوصف</Label>
                <Textarea 
                  id="program-description" 
                  placeholder="وصف مفصل للبرنامج..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Target className="h-4 w-4 mr-2" />
                  إنشاء البرنامج
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}