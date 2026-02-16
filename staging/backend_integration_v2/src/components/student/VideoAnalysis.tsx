import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  Target,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';

interface AnalysisReport {
  id: string;
  sessionId: string;
  userId: string;
  videoUrl: string;
  overallScore: number;
  metrics: {
    balance: number;
    speed: number;
    accuracy: number;
  };
  recommendation: string;
  status: 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
  coachReviewRequested: boolean;
}

interface VideoAnalysisProps {
  exerciseId: string;
  exerciseName: string;
}

export const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ exerciseId, exerciseName }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReports, setAnalysisReports] = useState<AnalysisReport[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisReport | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('video/')) {
      alert('يرجى اختيار ملف فيديو صالح');
      return;
    }

    // Check file duration (we'll simulate this check)
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      if (video.duration > 20) {
        alert('يجب أن يكون الفيديو 20 ثانية أو أقل');
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    };
    
    video.src = URL.createObjectURL(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setIsAnalyzing(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new analysis session
      const newAnalysis: AnalysisReport = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: `session_${Date.now()}`,
        userId: user.id,
        videoUrl: videoPreview || '',
        overallScore: 0,
        metrics: { balance: 0, speed: 0, accuracy: 0 },
        recommendation: '',
        status: 'processing',
        createdAt: new Date(),
        coachReviewRequested: false
      };

      setCurrentAnalysis(newAnalysis);
      setAnalysisReports(prev => [newAnalysis, ...prev]);
      setIsUploading(false);

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate random but realistic analysis results
      const balance = 75 + Math.random() * 20;
      const speed = 70 + Math.random() * 25;
      const accuracy = 80 + Math.random() * 15;
      const overallScore = Math.round((balance + speed + accuracy) / 3);

      const recommendations = [
        'جرّب تمارين التوازن 10 دقائق يوميًا لتحسين الثبات',
        'ركز على السرعة المتدرجة في الحركات للحصول على نتائج أفضل',
        'حافظ على وضعية الجسم المستقيمة أثناء التمرين',
        'تنفس بعمق وانتظام خلال أداء التمرين',
        'زد من مدة التمرين تدريجياً لبناء القوة والتحمل'
      ];

      const completedAnalysis: AnalysisReport = {
        ...newAnalysis,
        overallScore,
        metrics: {
          balance: Math.round(balance),
          speed: Math.round(speed),
          accuracy: Math.round(accuracy)
        },
        recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
        status: 'completed',
        completedAt: new Date()
      };

      setCurrentAnalysis(completedAnalysis);
      setAnalysisReports(prev => 
        prev.map(report => 
          report.id === newAnalysis.id ? completedAnalysis : report
        )
      );

      // Save to Supabase (simulated)
      console.log('Saving to Supabase analysis_reports table:', completedAnalysis);

    } catch (error) {
      console.error('Error during analysis:', error);
      alert('حدث خطأ أثناء تحليل الفيديو. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRequestCoachReview = async (analysisId: string) => {
    setAnalysisReports(prev =>
      prev.map(report =>
        report.id === analysisId
          ? { ...report, coachReviewRequested: true }
          : report
      )
    );

    if (currentAnalysis?.id === analysisId) {
      setCurrentAnalysis(prev => 
        prev ? { ...prev, coachReviewRequested: true } : null
      );
    }

    // Simulate sending notification to coach
    console.log('Sending coach review request for analysis:', analysisId);
    alert('تم إرسال طلب المراجعة للمدرب بنجاح');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'قيد المعالجة';
      case 'completed': return 'مكتملة';
      case 'rejected': return 'مرفوضة';
      default: return status;
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setCurrentAnalysis(null);
    setShowFullAnalysis(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            تحليل الفيديو التجريبي - {exerciseName}
          </CardTitle>
          <CardDescription>
            ارفع فيديو تمرينك (20 ثانية كحد أقصى) للحصول على تحليل ذكي وتوصيات مخصصة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!selectedFile && !isAnalyzing && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">اختر فيديو التمرين</p>
              <p className="text-sm text-muted-foreground mb-4">
                MP4, MOV, AVI - حد أقصى 20 ثانية
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                اختيار فيديو
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {selectedFile && videoPreview && !isAnalyzing && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 object-contain"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>الملف: {selectedFile.name}</p>
                  <p>الحجم: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetUpload}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    إعادة اختيار
                  </Button>
                  <Button onClick={handleUploadAndAnalyze} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        جاري الرفع...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        تحليل الفيديو
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">⏳ يتم تحليل الفيديو بالخوارزمية التجريبية</h3>
              <p className="text-muted-foreground">يُرجى الانتظار، قد يستغرق الأمر بضع دقائق...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {currentAnalysis && currentAnalysis.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              نتائج التحليل
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentAnalysis.overallScore / 100)}`}
                    className={getScoreColor(currentAnalysis.overallScore)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(currentAnalysis.overallScore)}`}>
                      {currentAnalysis.overallScore}
                    </div>
                    <div className="text-xs text-muted-foreground">النتيجة العامة</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-blue-600">{currentAnalysis.metrics.balance}%</div>
                <div className="text-sm text-muted-foreground">التوازن</div>
                <Progress value={currentAnalysis.metrics.balance} className="mt-2 h-2" />
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-green-600">{currentAnalysis.metrics.speed}%</div>
                <div className="text-sm text-muted-foreground">السرعة</div>
                <Progress value={currentAnalysis.metrics.speed} className="mt-2 h-2" />
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-bold text-purple-600">{currentAnalysis.metrics.accuracy}%</div>
                <div className="text-sm text-muted-foreground">الدقة</div>
                <Progress value={currentAnalysis.metrics.accuracy} className="mt-2 h-2" />
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">💡 توصية ذكية</h4>
              <p className="text-yellow-700">{currentAnalysis.recommendation}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowFullAnalysis(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                عرض التحليل الكامل
              </Button>
              
              <Button 
                onClick={() => handleRequestCoachReview(currentAnalysis.id)}
                disabled={currentAnalysis.coachReviewRequested}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {currentAnalysis.coachReviewRequested ? 'تم طلب المراجعة' : 'اطلب مراجعة مدرّب'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Analysis Modal */}
      {showFullAnalysis && currentAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>التحليل الكامل للجلسة</CardTitle>
            <CardDescription>
              تفاصيل شاملة عن أداءك في التمرين
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">معلومات الجلسة</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>معرف الجلسة:</strong> {currentAnalysis.sessionId}</p>
                  <p><strong>تاريخ التحليل:</strong> {currentAnalysis.createdAt.toLocaleString('ar-SA')}</p>
                  <p><strong>وقت الإكمال:</strong> {currentAnalysis.completedAt?.toLocaleString('ar-SA')}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">تفاصيل المقاييس</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>التوازن:</strong> {currentAnalysis.metrics.balance}% - {currentAnalysis.metrics.balance >= 80 ? 'ممتاز' : currentAnalysis.metrics.balance >= 60 ? 'جيد' : 'يحتاج تحسين'}</p>
                  <p><strong>السرعة:</strong> {currentAnalysis.metrics.speed}% - {currentAnalysis.metrics.speed >= 80 ? 'ممتاز' : currentAnalysis.metrics.speed >= 60 ? 'جيد' : 'يحتاج تحسين'}</p>
                  <p><strong>الدقة:</strong> {currentAnalysis.metrics.accuracy}% - {currentAnalysis.metrics.accuracy >= 80 ? 'ممتاز' : currentAnalysis.metrics.accuracy >= 60 ? 'جيد' : 'يحتاج تحسين'}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFullAnalysis(false)}>
                إغلاق
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analysisReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سجل التحليلات</CardTitle>
            <CardDescription>
              جميع جلسات التحليل السابقة
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {analysisReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <p className="font-medium text-sm">{report.sessionId}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.createdAt.toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {getStatusLabel(report.status)}
                    </Badge>
                    
                    {report.status === 'completed' && (
                      <div className="text-sm font-medium">
                        النتيجة: <span className={getScoreColor(report.overallScore)}>{report.overallScore}%</span>
                      </div>
                    )}
                    
                    {report.coachReviewRequested && (
                      <Badge variant="secondary">
                        طُلبت مراجعة
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoAnalysis;