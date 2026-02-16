import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Scan, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Info,
  Zap,
  Target,
  User,
  Trophy,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ARExercise {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  equipment: string[];
}

interface ARSession {
  id: string;
  exercise: ARExercise;
  startTime: Date;
  duration: number;
  score: number;
  accuracy: number;
  completed: boolean;
}

export const ARInterface: React.FC = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<ARExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionData, setSessionData] = useState<ARSession | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);

  const arExercises: ARExercise[] = [
    {
      id: '1',
      name: 'تمرين الضغط الموجه',
      description: 'تعلم الطريقة الصحيحة لأداء تمرين الضغط مع مدرب افتراضي ثلاثي الأبعاد',
      category: 'strength',
      difficulty: 'beginner',
      duration: 300, // 5 minutes
      calories: 50,
      equipment: []
    },
    {
      id: '2',
      name: 'تمارين التوازن التفاعلية',
      description: 'تحسين التوازن والثبات مع تحديات تفاعلية بالواقع المعزز',
      category: 'balance',
      difficulty: 'intermediate',
      duration: 600, // 10 minutes
      calories: 35,
      equipment: []
    },
    {
      id: '3',
      name: 'يوجا الصباح المعززة',
      description: 'جلسة يوجا هادئة مع إرشادات بصرية ثلاثية الأبعاد',
      category: 'flexibility',
      difficulty: 'beginner',
      duration: 900, // 15 minutes
      calories: 40,
      equipment: ['سجادة يوجا']
    },
    {
      id: '4',
      name: 'تحدي الحركة السريعة',
      description: 'تمارين كارديو عالية الكثافة مع تتبع الحركة في الوقت الفعلي',
      category: 'cardio',
      difficulty: 'advanced',
      duration: 1200, // 20 minutes
      calories: 150,
      equipment: []
    }
  ];

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      setCameraPermission('denied');
      return false;
    }
  };

  const startARSession = async (exercise: ARExercise) => {
    if (cameraPermission !== 'granted') {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    setCurrentExercise(exercise);
    setIsARActive(true);
    setIsPlaying(true);
    
    // إنشاء جلسة جديدة
    const newSession: ARSession = {
      id: Date.now().toString(),
      exercise,
      startTime: new Date(),
      duration: 0,
      score: 0,
      accuracy: 0,
      completed: false
    };
    
    setSessionData(newSession);
  };

  const stopARSession = () => {
    setIsARActive(false);
    setIsPlaying(false);
    setCurrentExercise(null);
    
    if (sessionData) {
      // حفظ بيانات الجلسة
      const completedSession = {
        ...sessionData,
        duration: Date.now() - sessionData.startTime.getTime(),
        completed: true,
        score: Math.floor(Math.random() * 100) + 70, // محاكاة النتيجة
        accuracy: Math.floor(Math.random() * 30) + 70 // محاكاة الدقة
      };
      setSessionData(completedSession);
    }
    
    // إيقاف الكاميرا
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-orange-100 text-orange-800',
      flexibility: 'bg-green-100 text-green-800',
      balance: 'bg-blue-100 text-blue-800'
    };
    return colors[category as keyof typeof colors] || colors.strength;
  };

  const getCategoryText = (category: string) => {
    const texts = {
      strength: 'القوة',
      cardio: 'الكارديو',
      flexibility: 'المرونة',
      balance: 'التوازن'
    };
    return texts[category as keyof typeof texts] || category;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم'
    };
    return texts[difficulty as keyof typeof texts] || difficulty;
  };

  if (isARActive && currentExercise) {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
        {/* واجهة الواقع المعزز */}
        <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* طبقة الواقع المعزز */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            {/* معلومات التمرين */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/70 text-white p-3 rounded-lg">
                <h3 className="font-semibold mb-1">{currentExercise.name}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span>⏱️ {Math.floor(currentExercise.duration / 60)} دقيقة</span>
                  <span>🔥 {currentExercise.calories} سعرة</span>
                  <span>🎯 دقة: {sessionData?.accuracy || 0}%</span>
                </div>
              </div>
            </div>

            {/* أدوات التحكم */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={togglePlayPause}
                  className="rounded-full w-16 h-16"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleMute}
                  className="rounded-full"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={toggleFullscreen}
                  className="rounded-full"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopARSession}
                  className="rounded-full"
                >
                  إنهاء
                </Button>
              </div>
            </div>

            {/* مؤشر الأداء */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <div className="bg-black/70 text-white p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">
                  {sessionData?.score || 0}
                </div>
                <div className="text-xs">النقاط</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🕹️ الواقع المعزز التفاعلي</h2>
        <p className="text-muted-foreground">تمارين تفاعلية مع مدرب افتراضي ثلاثي الأبعاد</p>
      </div>

      {/* تحقق من دعم الكاميرا */}
      {cameraPermission === 'denied' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            يتطلب الواقع المعزز الوصول إلى الكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح.
          </AlertDescription>
        </Alert>
      )}

      {/* قائمة التمارين */}
      <div className="grid md:grid-cols-2 gap-6">
        {arExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{exercise.name}</CardTitle>
                  <CardDescription className="mb-3">{exercise.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getCategoryColor(exercise.category)}>
                      {getCategoryText(exercise.category)}
                    </Badge>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {getDifficultyText(exercise.difficulty)}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor(exercise.duration / 60)} دقيقة
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {exercise.calories} سعرة
                  </span>
                </div>
                
                {exercise.equipment.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">المعدات المطلوبة:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={() => startARSession(exercise)}
                  disabled={cameraPermission === 'denied'}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  بدء التمرين بالواقع المعزز
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نتائج الجلسة الأخيرة */}
      {sessionData && sessionData.completed && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              نتائج الجلسة الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{sessionData.score}</div>
                <div className="text-sm text-muted-foreground">النقاط</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sessionData.accuracy}%</div>
                <div className="text-sm text-muted-foreground">الدقة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(sessionData.duration / 60000)}:{Math.floor((sessionData.duration % 60000) / 1000).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground">المدة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sessionData.exercise.calories}</div>
                <div className="text-sm text-muted-foreground">سعرة محروقة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            كيف يعمل الواقع المعزز؟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">تتبع الحركة</h4>
                <p className="text-sm text-muted-foreground">
                  يستخدم النظام الكاميرا لتتبع حركاتك في الوقت الفعلي
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">مدرب افتراضي</h4>
                <p className="text-sm text-muted-foreground">
                  شخصية ثلاثية الأبعاد تظهر أمامك لتوجيهك خلال التمرين
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-accent-orange" />
              </div>
              <div>
                <h4 className="font-medium mb-1">تقييم فوري</h4>
                <p className="text-sm text-muted-foreground">
                  احصل على تقييم فوري لأدائك ونصائح للتحسين
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARInterface;