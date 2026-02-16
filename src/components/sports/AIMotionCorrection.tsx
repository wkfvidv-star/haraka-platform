import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Timer,
  Volume2,
  VolumeX
} from 'lucide-react';

interface PosePoint {
  x: number;
  y: number;
  confidence: number;
}

interface PoseData {
  keypoints: PosePoint[];
  timestamp: number;
  exercise: string;
  isCorrect: boolean;
  errors: string[];
}

interface ExerciseSession {
  id: string;
  exercise: string;
  startTime: Date;
  endTime?: Date;
  correctReps: number;
  totalAttempts: number;
  errors: string[];
  accuracy: number;
}

interface Exercise {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keyPoints: string[];
}

export const AIMotionCorrection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [poseData, setPoseData] = useState<PoseData[]>([]);
  const [currentSession, setCurrentSession] = useState<ExerciseSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [correctReps, setCorrectReps] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const exercises: Exercise[] = [
    {
      id: 'squat',
      name: 'Squat',
      nameAr: 'القرفصاء',
      description: 'تمرين القرفصاء الأساسي لتقوية عضلات الفخذ والأرداف',
      targetMuscles: ['الفخذ الأمامي', 'الأرداف', 'عضلات الجذع'],
      difficulty: 'beginner',
      keyPoints: [
        'حافظ على استقامة الظهر',
        'انزل حتى تصبح الفخذان موازيتان للأرض',
        'حافظ على توازن الوزن على الكعبين',
        'لا تدع الركبتين تتجاوزان أصابع القدمين'
      ]
    },
    {
      id: 'pushup',
      name: 'Push-up',
      nameAr: 'الضغط',
      description: 'تمرين الضغط لتقوية عضلات الصدر والذراعين',
      targetMuscles: ['الصدر', 'الذراعين', 'الكتفين', 'عضلات الجذع'],
      difficulty: 'beginner',
      keyPoints: [
        'حافظ على استقامة الجسم',
        'انزل حتى يلامس الصدر الأرض تقريباً',
        'ادفع بقوة للعودة للوضع الأصلي',
        'لا تدع الوركين يرتفعان أو ينخفضان'
      ]
    },
    {
      id: 'jumping_jacks',
      name: 'Jumping Jacks',
      nameAr: 'القفز المفتوح',
      description: 'تمرين كارديو لتحسين اللياقة البدنية العامة',
      targetMuscles: ['الساقين', 'الذراعين', 'القلب والأوعية الدموية'],
      difficulty: 'beginner',
      keyPoints: [
        'اقفز مع فتح الساقين والذراعين',
        'حافظ على الإيقاع المنتظم',
        'اهبط بلطف على أطراف الأصابع',
        'حافظ على استقامة الظهر'
      ]
    }
  ];

  // محاكاة تحليل الوضعية باستخدام MediaPipe (في التطبيق الحقيقي)
  const analyzePose = useCallback((imageData: ImageData): PoseData | null => {
    if (!currentExercise) return null;
    
    setIsProcessing(true);
    
    // محاكاة تحليل الوضعية - في التطبيق الحقيقي سيتم استخدام MediaPipe أو TensorFlow
    const mockKeypoints: PosePoint[] = Array.from({ length: 17 }, (_, i) => ({
      x: Math.random() * imageData.width,
      y: Math.random() * imageData.height,
      confidence: 0.7 + Math.random() * 0.3
    }));

    // تحليل الحركة وتحديد الأخطاء
    const errors: string[] = [];
    const isCorrect = Math.random() > 0.3; // محاكاة دقة 70%

    if (!isCorrect) {
      const possibleErrors = [
        'حافظ على استقامة الظهر',
        'انزل أكثر',
        'حافظ على توازن الوزن',
        'لا تدع الركبتين تتقدمان'
      ];
      errors.push(possibleErrors[Math.floor(Math.random() * possibleErrors.length)]);
    }

    const poseData: PoseData = {
      keypoints: mockKeypoints,
      timestamp: Date.now(),
      exercise: currentExercise.id,
      isCorrect,
      errors
    };

    setIsProcessing(false);
    return poseData;
  }, [currentExercise]);

  // تشغيل الكاميرا
  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
      }
    } catch (error) {
      setCameraError('لا يمكن الوصول للكاميرا. تأكد من منح الإذن للتطبيق.');
      console.error('Camera error:', error);
    }
  };

  // إيقاف الكاميرا
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsRecording(false);
  };

  // بدء جلسة تدريب
  const startSession = (exercise: Exercise) => {
    const session: ExerciseSession = {
      id: Date.now().toString(),
      exercise: exercise.id,
      startTime: new Date(),
      correctReps: 0,
      totalAttempts: 0,
      errors: [],
      accuracy: 0
    };
    
    setCurrentSession(session);
    setCurrentExercise(exercise);
    setCorrectReps(0);
    setTotalAttempts(0);
    setPoseData([]);
    setIsRecording(true);
  };

  // إنهاء الجلسة
  const endSession = () => {
    if (currentSession) {
      const updatedSession: ExerciseSession = {
        ...currentSession,
        endTime: new Date(),
        correctReps,
        totalAttempts,
        accuracy: totalAttempts > 0 ? (correctReps / totalAttempts) * 100 : 0
      };
      
      // حفظ الجلسة في قاعدة البيانات المحلية
      const sessions = JSON.parse(localStorage.getItem('exerciseSessions') || '[]');
      sessions.push(updatedSession);
      localStorage.setItem('exerciseSessions', JSON.stringify(sessions));
    }
    
    setCurrentSession(null);
    setCurrentExercise(null);
    setIsRecording(false);
    setCorrectReps(0);
    setTotalAttempts(0);
  };

  // تشغيل التغذية الراجعة الصوتية
  const playAudioFeedback = (message: string, type: 'success' | 'error' | 'instruction') => {
    if (!soundEnabled) return;
    
    // في التطبيق الحقيقي، سيتم استخدام Web Speech API أو ملفات صوتية مسجلة
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    utterance.pitch = type === 'success' ? 1.2 : type === 'error' ? 0.8 : 1.0;
    
    speechSynthesis.speak(utterance);
  };

  // معالجة الإطارات من الكاميرا
  useEffect(() => {
    if (!isActive || !isRecording || !videoRef.current || !canvasRef.current) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // رسم الإطار الحالي
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // الحصول على بيانات الصورة لتحليل الوضعية
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pose = analyzePose(imageData);
      
      if (pose) {
        setPoseData(prev => [...prev.slice(-10), pose]); // الاحتفاظ بآخر 10 إطارات
        
        // تحديث الإحصائيات
        setTotalAttempts(prev => prev + 1);
        
        if (pose.isCorrect) {
          setCorrectReps(prev => prev + 1);
          setLastFeedback('ممتاز! حركة صحيحة');
          playAudioFeedback('أحسنت!', 'success');
        } else {
          const errorMessage = pose.errors[0] || 'تحقق من وضعيتك';
          setLastFeedback(errorMessage);
          playAudioFeedback(errorMessage, 'error');
        }
        
        // رسم نقاط المفاصل على الكانفاس
        drawPoseKeypoints(ctx, pose.keypoints, pose.isCorrect);
      }
    };

    const interval = setInterval(processFrame, 200); // تحليل كل 200ms
    return () => clearInterval(interval);
  }, [isActive, isRecording, analyzePose, soundEnabled]);

  // رسم نقاط المفاصل
  const drawPoseKeypoints = (ctx: CanvasRenderingContext2D, keypoints: PosePoint[], isCorrect: boolean) => {
    keypoints.forEach((point, index) => {
      if (point.confidence > 0.5) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = isCorrect ? '#10B981' : '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
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
    return texts[difficulty as keyof typeof texts] || 'مبتدئ';
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🎯 التصحيح الحركي الذكي</h2>
        <p className="text-muted-foreground">تحليل وتصحيح الحركة في الوقت الفعلي باستخدام الذكاء الاصطناعي</p>
      </div>

      {/* اختيار التمرين */}
      {!currentExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              اختر التمرين
            </CardTitle>
            <CardDescription>
              اختر التمرين الذي تريد التدرب عليه مع التصحيح الذكي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <Card 
                  key={exercise.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                  onClick={() => startSession(exercise)}
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold mb-2">{exercise.nameAr}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                      
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {getDifficultyText(exercise.difficulty)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">العضلات المستهدفة:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.map((muscle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* واجهة التدريب */}
      {currentExercise && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* الكاميرا والتحليل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  {currentExercise.nameAr}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={endSession}
                  >
                    إنهاء
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* منطقة الكاميرا */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                {!isActive ? (
                  <div className="aspect-video flex items-center justify-center">
                    <Button onClick={startCamera} size="lg">
                      <Camera className="w-5 h-5 mr-2" />
                      تشغيل الكاميرا
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full aspect-video object-cover"
                      muted
                      playsInline
                    />
                    <canvas
                      ref={canvasRef}
                      width={640}
                      height={480}
                      className="absolute inset-0 w-full h-full"
                    />
                    {isProcessing && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                        جاري التحليل...
                      </div>
                    )}
                  </>
                )}
              </div>

              {cameraError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{cameraError}</span>
                </div>
              )}

              {/* التحكم */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={isActive ? stopCamera : startCamera}
                  variant={isActive ? "destructive" : "default"}
                >
                  {isActive ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {isActive ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* الإحصائيات والتغذية الراجعة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                الأداء والتغذية الراجعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* الإحصائيات الحالية */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{correctReps}</div>
                  <div className="text-sm text-green-700">تكرارات صحيحة</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalAttempts}</div>
                  <div className="text-sm text-blue-700">إجمالي المحاولات</div>
                </div>
              </div>

              {/* نسبة الدقة */}
              {totalAttempts > 0 && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">دقة الأداء</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((correctReps / totalAttempts) * 100)}%
                    </span>
                  </div>
                  <Progress value={(correctReps / totalAttempts) * 100} className="h-2" />
                </div>
              )}

              {/* آخر تغذية راجعة */}
              {lastFeedback && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">التغذية الراجعة:</h4>
                  <p className="text-blue-800">{lastFeedback}</p>
                </div>
              )}

              {/* نقاط التمرين الأساسية */}
              <div>
                <h4 className="font-medium mb-3">نقاط مهمة للتمرين:</h4>
                <ul className="space-y-2">
                  {currentExercise.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* معلومات الجلسة */}
              {currentSession && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span>بدأت الجلسة: {currentSession.startTime.toLocaleTimeString('ar-SA')}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIMotionCorrection;