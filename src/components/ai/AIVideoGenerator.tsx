import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Mic, User, Play, Download, Share2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoResult {
  id: string;
  type: 'avatar' | 'animation' | 'voice';
  url: string;
  title: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
  verified?: boolean;
}

type VideoType = 'avatar' | 'animation' | 'voice';

export const AIVideoGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<VideoType | null>(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<VideoResult[]>([]);
  const { toast } = useToast();

  const videoTypes = [
    {
      id: 'avatar' as VideoType,
      title: 'أفاتار متحدث',
      description: 'إنشاء شخصية افتراضية تتحدث بالنص المكتوب',
      icon: User,
      color: 'bg-primary',
      api: 'HeyGen / D-ID'
    },
    {
      id: 'animation' as VideoType,
      title: 'فيديو حركي / تمرين',
      description: 'إنشاء فيديو متحرك للتمارين والأنشطة الرياضية',
      icon: Video,
      color: 'bg-secondary',
      api: 'Runway Gen-2 / Pika Labs'
    },
    {
      id: 'voice' as VideoType,
      title: 'صوت واقعي متعدد اللغات',
      description: 'تحويل النص إلى صوت طبيعي بلغات متعددة',
      icon: Mic,
      color: 'bg-accent-orange',
      api: 'ElevenLabs'
    }
  ];

  const handleGenerate = async () => {
    if (!selectedType || !inputText.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار نوع الفيديو وإدخال النص",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // محاكاة استدعاء API
      const newVideo: VideoResult = {
        id: Date.now().toString(),
        type: selectedType,
        url: '#', // سيتم استبداله برابط حقيقي من API
        title: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
        createdAt: new Date(),
        status: 'generating'
      };

      setGeneratedVideos(prev => [newVideo, ...prev]);

      // محاكاة وقت المعالجة
      setTimeout(() => {
        setGeneratedVideos(prev =>
          prev.map(video =>
            video.id === newVideo.id
              ? { ...video, status: 'completed' as const, url: 'https://example.com/video.mp4' }
              : video
          )
        );

        toast({
          title: "تم بنجاح!",
          description: "تم إنشاء الفيديو بنجاح",
        });
      }, 3000);

      setInputText('');
      setSelectedType(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الفيديو",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap = {
      avatar: 'أفاتار',
      animation: 'فيديو حركي',
      voice: 'صوت'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      generating: 'bg-yellow-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500'
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      generating: 'جاري الإنشاء...',
      completed: 'مكتمل',
      failed: 'فشل'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🎬 فيديو بالذكاء الاصطناعي</h2>
        <p className="text-muted-foreground">أنشئ محتوى تعليمي تفاعلي باستخدام أحدث تقنيات الذكاء الاصطناعي</p>
      </div>

      {/* اختيار نوع الفيديو */}
      <div className="grid md:grid-cols-3 gap-4">
        {videoTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedType === type.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
                <CardDescription className="text-sm">{type.description}</CardDescription>
                <Badge variant="outline" className="mt-2">{type.api}</Badge>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* إدخال النص */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle>إدخال المحتوى</CardTitle>
            <CardDescription>
              اكتب النص أو وصف الدرس/التمرين الذي تريد تحويله إلى {getTypeLabel(selectedType)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="مثال: شرح تمرين الضغط بطريقة صحيحة للمبتدئين..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !inputText.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  إنشاء {getTypeLabel(selectedType)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* النتائج المحفوظة */}
      {generatedVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الفيديوهات المنشأة</CardTitle>
            <CardDescription>يمكنك الوصول إلى جميع الفيديوهات التي أنشأتها سابقاً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{getTypeLabel(video.type)}</Badge>
                      {video.verified && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1">
                          <CheckCircle className="w-3 h-3" />
                          تم التحقق منه بواسطة المعلم
                        </Badge>
                      )}
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(video.status)}`}></div>
                      <span className="text-sm text-muted-foreground">{getStatusText(video.status)}</span>
                    </div>
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {video.createdAt.toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  {video.status === 'completed' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {video.status === 'generating' && (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIVideoGenerator;