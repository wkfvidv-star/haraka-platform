import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen,
  Plus,
  Upload,
  Video,
  FileText,
  Image,
  Download,
  Edit,
  Trash2,
  Eye,
  Play,
  Clock,
  Target,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Dumbbell,
  Heart,
  Activity,
  Zap
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  duration: number;
  points: number;
  description: string;
  objectives: string[];
  equipment?: string;
  muscleGroups: string[];
  caloriesBurn: number;
  videoUrl?: string;
  documentUrl?: string;
  imageUrl?: string;
  createdBy: 'system' | 'teacher';
  teacherName?: string;
  assignedToClasses: string[];
  completionRate: number;
  averageRating: number;
  totalAssignments: number;
}

const systemExercises: Exercise[] = [
  {
    id: 'ex_1',
    name: 'تدريب القوة الوظيفية الأساسية',
    category: 'القوة',
    difficulty: 'مبتدئ',
    duration: 15,
    points: 25,
    description: 'تمرين شامل لتطوير القوة الوظيفية باستخدام وزن الجسم',
    objectives: [
      'تقوية العضلات الأساسية',
      'تحسين التوازن والاستقرار',
      'تطوير القوة الوظيفية',
      'بناء الثقة بالنفس'
    ],
    equipment: 'بساط تمرين، كرة توازن',
    muscleGroups: ['العضلات الأساسية', 'الذراعين', 'الساقين'],
    caloriesBurn: 120,
    createdBy: 'system',
    assignedToClasses: ['class_1', 'class_2'],
    completionRate: 85,
    averageRating: 4.2,
    totalAssignments: 156
  },
  {
    id: 'ex_2',
    name: 'تدريب التحمل القلبي الوعائي',
    category: 'التحمل',
    difficulty: 'متوسط',
    duration: 20,
    points: 35,
    description: 'تمارين متنوعة لتحسين اللياقة القلبية الوعائية والتحمل',
    objectives: [
      'تحسين الدورة الدموية',
      'زيادة القدرة على التحمل',
      'تقوية القلب والرئتين',
      'حرق السعرات الحرارية'
    ],
    equipment: 'حبل قفز، أقماع',
    muscleGroups: ['القلب', 'الساقين', 'الذراعين'],
    caloriesBurn: 180,
    createdBy: 'system',
    assignedToClasses: ['class_1'],
    completionRate: 78,
    averageRating: 4.0,
    totalAssignments: 89
  }
];

const teacherExercises: Exercise[] = [
  {
    id: 'ex_teacher_1',
    name: 'تمرين التنفس العميق والاسترخاء',
    category: 'الاسترخاء',
    difficulty: 'مبتدئ',
    duration: 10,
    points: 15,
    description: 'تمرين مخصص للاسترخاء وتحسين التركيز من إعداد الأستاذ محمد',
    objectives: [
      'تعلم تقنيات التنفس الصحيح',
      'تقليل التوتر والقلق',
      'تحسين التركيز',
      'الاسترخاء العضلي'
    ],
    equipment: 'بساط، موسيقى هادئة',
    muscleGroups: ['الحجاب الحاجز'],
    caloriesBurn: 30,
    createdBy: 'teacher',
    teacherName: 'الأستاذ محمد الصالح',
    assignedToClasses: ['class_1'],
    completionRate: 92,
    averageRating: 4.8,
    totalAssignments: 28,
    videoUrl: '/videos/breathing_exercise.mp4',
    documentUrl: '/docs/breathing_guide.pdf'
  }
];

export function ExerciseManagement() {
  const [exercises] = useState<Exercise[]>([...systemExercises, ...teacherExercises]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedDifficulty, setSelectedDifficulty] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSystemExercises, setShowSystemExercises] = useState(true);
  const [showTeacherExercises, setShowTeacherExercises] = useState(true);

  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'التوازن', 'التناسق', 'السرعة', 'الاسترخاء'];
  const difficulties = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'الكل' || exercise.difficulty === selectedDifficulty;
    const matchesSource = (exercise.createdBy === 'system' && showSystemExercises) || 
                         (exercise.createdBy === 'teacher' && showTeacherExercises);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesSource;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'القوة': return <Dumbbell className="h-4 w-4" />;
      case 'التحمل': return <Heart className="h-4 w-4" />;
      case 'المرونة': return <Activity className="h-4 w-4" />;
      case 'التوازن': return <Target className="h-4 w-4" />;
      case 'التناسق': return <Star className="h-4 w-4" />;
      case 'السرعة': return <Zap className="h-4 w-4" />;
      case 'الاسترخاء': return <Heart className="h-4 w-4" />;
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

  const renderUploadForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة تمرين تعليمي جديد
          </CardTitle>
          <CardDescription>
            قم بإنشاء تمرين مخصص مع مواد تعليمية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exercise-name">اسم التمرين</Label>
              <Input id="exercise-name" placeholder="اسم التمرين..." />
            </div>
            <div>
              <Label htmlFor="exercise-category">الفئة</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exercise-difficulty">الصعوبة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصعوبة" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.slice(1).map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exercise-duration">المدة (دقيقة)</Label>
              <Input id="exercise-duration" type="number" placeholder="15" />
            </div>
            <div>
              <Label htmlFor="exercise-points">النقاط</Label>
              <Input id="exercise-points" type="number" placeholder="25" />
            </div>
          </div>

          <div>
            <Label htmlFor="exercise-description">الوصف</Label>
            <Textarea 
              id="exercise-description" 
              placeholder="وصف مفصل للتمرين..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="exercise-objectives">الأهداف التدريبية</Label>
            <Textarea 
              id="exercise-objectives" 
              placeholder="اكتب كل هدف في سطر منفصل..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exercise-equipment">المعدات المطلوبة</Label>
              <Input id="exercise-equipment" placeholder="بساط، كرة توازن..." />
            </div>
            <div>
              <Label htmlFor="exercise-calories">السعرات المحروقة</Label>
              <Input id="exercise-calories" type="number" placeholder="120" />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">المواد التعليمية</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">رفع فيديو تعليمي</p>
                <p className="text-xs text-gray-500">MP4, AVI, MOV</p>
                <input type="file" className="hidden" accept="video/*" />
              </div>
              
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">رفع وثيقة</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX</p>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
              </div>
              
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">رفع صور توضيحية</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
                <input type="file" className="hidden" accept="image/*" multiple />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="assign-classes">تعيين للصفوف</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر الصفوف..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class_1">السنة الثالثة متوسط - أ</SelectItem>
                <SelectItem value="class_2">السنة الثالثة متوسط - ب</SelectItem>
                <SelectItem value="class_3">السنة الثانية متوسط - أ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              حفظ ونشر التمرين
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowUploadForm(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            إدارة التمارين التعليمية
          </CardTitle>
          <CardDescription className="text-green-100">
            مكتبة شاملة من التمارين مع إمكانية إضافة مواد تعليمية مخصصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{exercises.length}</div>
                <div className="text-sm text-green-100">إجمالي التمارين</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{teacherExercises.length}</div>
                <div className="text-sm text-green-100">تمارين مخصصة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(exercises.reduce((acc, ex) => acc + ex.completionRate, 0) / exercises.length)}%
                </div>
                <div className="text-sm text-green-100">معدل الإكمال</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowUploadForm(true)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة تمرين جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن تمرين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            <CardTitle className="text-sm">الصعوبة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
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
            <CardTitle className="text-sm">المصدر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={showSystemExercises}
                  onChange={(e) => setShowSystemExercises(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">تمارين النظام</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={showTeacherExercises}
                  onChange={(e) => setShowTeacherExercises(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">تمارين المعلمين</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-1" />
                مرشحات متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(exercise.category)}
                  <Badge variant="outline">{exercise.category}</Badge>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                {exercise.createdBy === 'teacher' && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200">
                    مخصص
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
              
              {exercise.teacherName && (
                <p className="text-sm text-gray-500">بواسطة: {exercise.teacherName}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {exercise.description}
              </p>

              {/* Exercise Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{exercise.duration}</div>
                  <div className="text-xs text-gray-500">دقيقة</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <Star className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{exercise.points}</div>
                  <div className="text-xs text-gray-500">نقطة</div>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <Zap className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                  <div className="text-sm font-bold">{exercise.caloriesBurn}</div>
                  <div className="text-xs text-gray-500">سعرة</div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>معدل الإكمال</span>
                  <span>{exercise.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${exercise.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Media Indicators */}
              {(exercise.videoUrl || exercise.documentUrl || exercise.imageUrl) && (
                <div className="flex gap-2">
                  {exercise.videoUrl && (
                    <Badge variant="outline" className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      فيديو
                    </Badge>
                  )}
                  {exercise.documentUrl && (
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      وثيقة
                    </Badge>
                  )}
                  {exercise.imageUrl && (
                    <Badge variant="outline" className="text-xs">
                      <Image className="h-3 w-3 mr-1" />
                      صور
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  عرض
                </Button>
                {exercise.createdBy === 'teacher' && (
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  تعيين
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد تمارين</h3>
            <p className="text-gray-500">جرب تغيير المرشحات أو إضافة تمرين جديد</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Form Modal */}
      {showUploadForm && renderUploadForm()}
    </div>
  );
}