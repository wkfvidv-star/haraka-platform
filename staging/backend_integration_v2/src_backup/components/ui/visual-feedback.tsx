import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Activity,
  Zap
} from 'lucide-react';

interface PosePoint {
  x: number;
  y: number;
  confidence: number;
  isCorrect: boolean;
}

interface SkeletonData {
  keypoints: PosePoint[];
  connections: [number, number][];
  timestamp: number;
  overallCorrectness: number;
  errors: string[];
}

interface VisualFeedbackProps {
  isActive: boolean;
  onToggleCamera: () => void;
  exercise: string;
  language: 'ar' | 'ar-dz' | 'fr';
}

export const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  isActive,
  onToggleCamera,
  exercise,
  language
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [skeletonData, setSkeletonData] = useState<SkeletonData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [correctReps, setCorrectReps] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // رسائل التغذية الراجعة متعددة اللغات
  const feedbackMessages = {
    ar: {
      correct: ['ممتاز!', 'أحسنت!', 'حركة صحيحة!', 'واصل!'],
      backStraight: 'حافظ على استقامة الظهر!',
      kneesAlign: 'لا تدع الركبتين تتجاوزان أصابع القدمين!',
      goDeeper: 'انزل أكثر!',
      slowDown: 'ببطء أكثر!',
      goodForm: 'شكل ممتاز!',
      almostThere: 'تقريباً وصلت!'
    },
    'ar-dz': {
      correct: ['مليح!', 'هكا نيشان!', 'واعر!', 'كمل!'],
      backStraight: 'خلي ظهرك مستقيم!',
      kneesAlign: 'ما تخليش ركبتك تتقدم!',
      goDeeper: 'انزل أكثر!',
      slowDown: 'شوية شوية!',
      goodForm: 'شكل مليح!',
      almostThere: 'قريب توصل!'
    },
    fr: {
      correct: ['Excellent!', 'Bien joué!', 'Parfait!', 'Continue!'],
      backStraight: 'Garde le dos droit!',
      kneesAlign: 'Ne laisse pas les genoux dépasser!',
      goDeeper: 'Descends plus!',
      slowDown: 'Plus lentement!',
      goodForm: 'Excellente forme!',
      almostThere: 'Presque là!'
    }
  };

  // تشغيل الكاميرا
  useEffect(() => {
    if (isActive && videoRef.current) {
      startCamera();
    } else if (!isActive && videoRef.current) {
      stopCamera();
    }
  }, [isActive]);

  // معالجة الإطارات
  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || video.videoWidth === 0) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // تحديث حجم الكانفاس
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // رسم الفيديو
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // محاكاة تحليل الوضعية
      const mockSkeleton = generateMockSkeleton(canvas.width, canvas.height);
      setSkeletonData(mockSkeleton);

      // رسم الهيكل العظمي
      drawSkeleton(ctx, mockSkeleton);

      // تحديث الإحصائيات
      updateStats(mockSkeleton);

      // تشغيل التغذية الراجعة الصوتية
      if (mockSkeleton.errors.length === 0) {
        playPositiveFeedback();
      } else {
        playCorrectiveFeedback(mockSkeleton.errors[0]);
      }
    };

    const interval = setInterval(processFrame, 200); // 5 FPS للمعالجة
    return () => clearInterval(interval);
  }, [isActive, exercise, language]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // توليد بيانات هيكل عظمي وهمية
  const generateMockSkeleton = (width: number, height: number): SkeletonData => {
    setIsProcessing(true);
    
    // نقاط المفاصل الأساسية (17 نقطة حسب COCO)
    const keypoints: PosePoint[] = [
      // الرأس والرقبة
      { x: width * 0.5, y: height * 0.15, confidence: 0.9, isCorrect: true },
      { x: width * 0.48, y: height * 0.12, confidence: 0.8, isCorrect: true },
      { x: width * 0.52, y: height * 0.12, confidence: 0.8, isCorrect: true },
      { x: width * 0.46, y: height * 0.14, confidence: 0.7, isCorrect: true },
      { x: width * 0.54, y: height * 0.14, confidence: 0.7, isCorrect: true },
      
      // الكتفين
      { x: width * 0.4, y: height * 0.25, confidence: 0.9, isCorrect: true },
      { x: width * 0.6, y: height * 0.25, confidence: 0.9, isCorrect: true },
      
      // المرفقين
      { x: width * 0.35, y: height * 0.4, confidence: 0.8, isCorrect: true },
      { x: width * 0.65, y: height * 0.4, confidence: 0.8, isCorrect: true },
      
      // المعصمين
      { x: width * 0.32, y: height * 0.55, confidence: 0.7, isCorrect: true },
      { x: width * 0.68, y: height * 0.55, confidence: 0.7, isCorrect: true },
      
      // الوركين
      { x: width * 0.45, y: height * 0.6, confidence: 0.9, isCorrect: Math.random() > 0.3 },
      { x: width * 0.55, y: height * 0.6, confidence: 0.9, isCorrect: Math.random() > 0.3 },
      
      // الركبتين
      { x: width * 0.43, y: height * 0.8, confidence: 0.8, isCorrect: Math.random() > 0.4 },
      { x: width * 0.57, y: height * 0.8, confidence: 0.8, isCorrect: Math.random() > 0.4 },
      
      // الكاحلين
      { x: width * 0.41, y: height * 0.95, confidence: 0.7, isCorrect: true },
      { x: width * 0.59, y: height * 0.95, confidence: 0.7, isCorrect: true }
    ];

    // روابط الهيكل العظمي
    const connections: [number, number][] = [
      [0, 1], [0, 2], [1, 3], [2, 4], // الرأس
      [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], // الذراعين
      [5, 11], [6, 12], [11, 12], // الجذع
      [11, 13], [12, 14], [13, 15], [14, 16] // الساقين
    ];

    // تحديد الأخطاء بناءً على التمرين
    const errors: string[] = [];
    const incorrectPoints = keypoints.filter(p => !p.isCorrect);
    
    if (exercise === 'squat') {
      if (incorrectPoints.length > 2) {
        errors.push(feedbackMessages[language].backStraight);
      }
      if (Math.random() > 0.7) {
        errors.push(feedbackMessages[language].goDeeper);
      }
      if (Math.random() > 0.8) {
        errors.push(feedbackMessages[language].kneesAlign);
      }
    }

    const overallCorrectness = (keypoints.filter(p => p.isCorrect).length / keypoints.length) * 100;
    
    setTimeout(() => setIsProcessing(false), 100);

    return {
      keypoints,
      connections,
      timestamp: Date.now(),
      overallCorrectness,
      errors
    };
  };

  // رسم الهيكل العظمي
  const drawSkeleton = (ctx: CanvasRenderingContext2D, skeleton: SkeletonData) => {
    // رسم الروابط
    ctx.lineWidth = 3;
    skeleton.connections.forEach(([startIdx, endIdx]) => {
      const start = skeleton.keypoints[startIdx];
      const end = skeleton.keypoints[endIdx];
      
      if (start.confidence > 0.5 && end.confidence > 0.5) {
        ctx.strokeStyle = (start.isCorrect && end.isCorrect) ? '#10B981' : '#EF4444';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    });

    // رسم النقاط
    skeleton.keypoints.forEach((point, index) => {
      if (point.confidence > 0.5) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = point.isCorrect ? '#10B981' : '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // عرض نسبة الصحة
    ctx.fillStyle = skeleton.overallCorrectness > 70 ? '#10B981' : '#EF4444';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(
      `${Math.round(skeleton.overallCorrectness)}%`, 
      20, 
      40
    );
  };

  // تحديث الإحصائيات
  const updateStats = (skeleton: SkeletonData) => {
    if (skeleton.overallCorrectness > 70) {
      setCorrectReps(prev => prev + 1);
    }
    setTotalAttempts(prev => prev + 1);
  };

  // تشغيل التغذية الراجعة الإيجابية
  const playPositiveFeedback = () => {
    if (!soundEnabled) return;
    
    const messages = feedbackMessages[language].correct;
    const message = messages[Math.floor(Math.random() * messages.length)];
    setCurrentFeedback(message);
    speakMessage(message);
  };

  // تشغيل التغذية الراجعة التصحيحية
  const playCorrectiveFeedback = (error: string) => {
    if (!soundEnabled) return;
    
    setCurrentFeedback(error);
    speakMessage(error);
  };

  // تشغيل الصوت
  const speakMessage = (message: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(message);
    
    // تحديد اللغة
    if (language === 'ar' || language === 'ar-dz') {
      utterance.lang = 'ar-SA';
    } else if (language === 'fr') {
      utterance.lang = 'fr-FR';
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.7;
    
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      {/* منطقة الكاميرا والتحليل */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video">
            {!isActive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={onToggleCamera} size="lg" className="bg-primary hover:bg-primary/90">
                  <Camera className="w-5 h-5 mr-2" />
                  تشغيل الكاميرا
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
                
                {/* مؤشرات الحالة */}
                <div className="absolute top-4 left-4 space-y-2">
                  {isProcessing && (
                    <Badge className="bg-blue-500 text-white">
                      <Activity className="w-3 h-3 mr-1 animate-pulse" />
                      جاري التحليل
                    </Badge>
                  )}
                  
                  {skeletonData && (
                    <Badge className={`${
                      skeletonData.overallCorrectness > 70 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      <Target className="w-3 h-3 mr-1" />
                      {Math.round(skeletonData.overallCorrectness)}% دقة
                    </Badge>
                  )}
                </div>

                {/* التغذية الراجعة المرئية */}
                {currentFeedback && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-2 rounded-full text-white font-medium ${
                      skeletonData?.errors.length === 0 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}>
                      {currentFeedback}
                    </div>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onToggleCamera}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                  >
                    <CameraOff className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{correctReps}</div>
              <div className="text-sm text-muted-foreground">تكرارات صحيحة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{totalAttempts}</div>
              <div className="text-sm text-muted-foreground">إجمالي المحاولات</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {totalAttempts > 0 ? Math.round((correctReps / totalAttempts) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">معدل الدقة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {skeletonData ? Math.round(skeletonData.overallCorrectness) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">الدقة الحالية</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* دليل الألوان */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">دليل الألوان:</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>حركة صحيحة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>يحتاج تصحيح</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>يحتاج تعديل</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualFeedback;