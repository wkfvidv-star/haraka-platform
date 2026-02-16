import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, 
  Brain, 
  Puzzle, 
  Target, 
  Users, 
  Clock,
  Star,
  Play,
  Share2,
  Settings,
  Sparkles,
  Trophy,
  Zap,
  LucideIcon
} from 'lucide-react';

interface GameTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  features: string[];
}

interface CreatedGame {
  id: string;
  name: string;
  template: string;
  difficulty: string;
  createdAt: Date;
  plays: number;
  rating: number;
  status: 'draft' | 'published' | 'pending_approval';
}

export const HarakaCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [gameName, setGameName] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [createdGames, setCreatedGames] = useState<CreatedGame[]>([
    {
      id: '1',
      name: 'تحدي الرياضيات السريع',
      template: 'quiz',
      difficulty: 'medium',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      plays: 156,
      rating: 4.5,
      status: 'published'
    },
    {
      id: '2',
      name: 'ذاكرة الألوان',
      template: 'memory',
      difficulty: 'easy',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      plays: 89,
      rating: 4.2,
      status: 'published'
    }
  ]);

  const gameTemplates: GameTemplate[] = [
    {
      id: 'quiz',
      name: 'اختبار تفاعلي',
      description: 'أنشئ اختبارات ممتعة مع أسئلة متنوعة وتقييم فوري',
      icon: Brain,
      difficulty: 'easy',
      estimatedTime: 10,
      features: ['أسئلة متعددة الخيارات', 'تقييم فوري', 'مستويات صعوبة']
    },
    {
      id: 'memory',
      name: 'لعبة الذاكرة',
      description: 'تحدي الذاكرة مع بطاقات وصور تفاعلية',
      icon: Puzzle,
      difficulty: 'medium',
      estimatedTime: 15,
      features: ['بطاقات تفاعلية', 'مستويات متدرجة', 'نظام نقاط']
    },
    {
      id: 'obstacle',
      name: 'مسار العقبات',
      description: 'أنشئ مسارات تحدي تتطلب مهارات حركية ومعرفية',
      icon: Target,
      difficulty: 'hard',
      estimatedTime: 20,
      features: ['تحديات حركية', 'عقبات ذكية', 'توقيت زمني']
    }
  ];

  const createGame = async () => {
    if (!selectedTemplate || !gameName.trim()) return;

    setIsCreating(true);
    setCreationProgress(0);

    // محاكاة عملية الإنشاء بالذكاء الاصطناعي
    const steps = [
      'تحليل المتطلبات...',
      'توليد المحتوى بالذكاء الاصطناعي...',
      'تصميم واجهة اللعبة...',
      'إضافة التفاعلات...',
      'اختبار الجودة...',
      'إنهاء الإنشاء...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCreationProgress(((i + 1) / steps.length) * 100);
    }

    // إضافة اللعبة الجديدة
    const newGame: CreatedGame = {
      id: Date.now().toString(),
      name: gameName,
      template: selectedTemplate,
      difficulty: 'medium',
      createdAt: new Date(),
      plays: 0,
      rating: 0,
      status: 'pending_approval'
    };

    setCreatedGames(prev => [newGame, ...prev]);
    setIsCreating(false);
    setCreationProgress(0);
    setGameName('');
    setGameDescription('');
    setSelectedTemplate(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب'
    };
    return texts[difficulty as keyof typeof texts] || 'سهل';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      pending_approval: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: 'مسودة',
      published: 'منشور',
      pending_approval: 'في انتظار الموافقة'
    };
    return texts[status as keyof typeof texts] || 'مسودة';
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🧪 مختبر الإبداع Haraka</h2>
        <p className="text-muted-foreground">أنشئ ألعابك التعليمية الخاصة بمساعدة الذكاء الاصطناعي</p>
      </div>

      {/* اختيار القالب */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            اختر قالب اللعبة
          </CardTitle>
          <CardDescription>
            ابدأ بقالب جاهز وخصصه حسب احتياجاتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {gameTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {getDifficultyText(template.difficulty)}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.estimatedTime} دقيقة
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">الميزات:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* تخصيص اللعبة */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-secondary" />
              تخصيص اللعبة
            </CardTitle>
            <CardDescription>
              أضف التفاصيل الخاصة بلعبتك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم اللعبة</label>
              <Input
                placeholder="مثال: تحدي الرياضيات المثير"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">وصف اللعبة</label>
              <Textarea
                placeholder="اكتب وصفاً مختصراً عن لعبتك وأهدافها التعليمية..."
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* شريط تقدم الإنشاء */}
            {isCreating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">جاري إنشاء اللعبة بالذكاء الاصطناعي...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(creationProgress)}%</span>
                </div>
                <Progress value={creationProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={createGame}
              disabled={!gameName.trim() || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  إنشاء اللعبة بالذكاء الاصطناعي
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* الألعاب المنشأة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-orange" />
            ألعابي المنشأة
          </CardTitle>
          <CardDescription>
            إدارة ومشاركة الألعاب التي أنشأتها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {createdGames.map((game) => (
              <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{game.name}</h4>
                    <Badge className={getStatusColor(game.status)}>
                      {getStatusText(game.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>نوع: {game.template}</span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {game.plays} مرة لعب
                    </span>
                    {game.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {game.rating}
                      </span>
                    )}
                    <span>{game.createdAt.toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  {game.status === 'published' && (
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarakaCreator;
