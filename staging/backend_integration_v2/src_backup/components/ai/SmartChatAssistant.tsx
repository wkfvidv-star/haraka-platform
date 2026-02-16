import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, MicOff, Volume2, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
  category?: 'exercise' | 'nutrition' | 'motivation' | 'general';
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  category: string;
}

export const SmartChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي في التعليم والحركة. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في التمارين، التغذية، التحفيز، أو أي سؤال تعليمي.',
      timestamp: new Date(),
      hasAudio: true,
      category: 'general'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { id: '1', label: 'تمرين اليوم', prompt: 'اقترح لي تمرين مناسب لليوم', icon: '🏃‍♂️', category: 'exercise' },
    { id: '2', label: 'نصائح تغذية', prompt: 'أعطني نصائح للتغذية الصحية', icon: '🥗', category: 'nutrition' },
    { id: '3', label: 'تحفيز وإلهام', prompt: 'أحتاج كلمات تحفيزية لممارسة الرياضة', icon: '💪', category: 'motivation' },
    { id: '4', label: 'شرح تمرين', prompt: 'اشرح لي كيفية أداء تمرين معين', icon: '📚', category: 'exercise' },
    { id: '5', label: 'خطة أسبوعية', prompt: 'ضع لي خطة تمارين أسبوعية', icon: '📅', category: 'exercise' },
    { id: '6', label: 'سؤال عام', prompt: '', icon: '❓', category: 'general' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // محاكاة رد المساعد الذكي
    setTimeout(() => {
      const assistantResponse = generateSmartResponse(message);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse.content,
        timestamp: new Date(),
        hasAudio: true,
        category: assistantResponse.category
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateSmartResponse = (userMessage: string): { content: string; category: string } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('تمرين') || message.includes('رياضة') || message.includes('تدريب')) {
      return {
        content: 'ممتاز! إليك تمرين رائع لك اليوم:\n\n🏃‍♂️ **تمرين القوة والتحمل (15 دقيقة)**\n\n1. إحماء: المشي في المكان (3 دقائق)\n2. تمرين الضغط: 3 مجموعات × 10 تكرارات\n3. القرفصاء: 3 مجموعات × 15 تكرار\n4. تمرين البلانك: 3 مجموعات × 30 ثانية\n5. تهدئة: تمارين الإطالة (3 دقائق)\n\n💡 **نصيحة**: ابدأ بوتيرة مريحة وزد التكرارات تدريجياً!',
        category: 'exercise'
      };
    }
    
    if (message.includes('تغذية') || message.includes('طعام') || message.includes('أكل')) {
      return {
        content: '🥗 **نصائح التغذية الصحية للرياضيين:**\n\n✅ **قبل التمرين (30-60 دقيقة):**\n- موزة + ملعقة عسل\n- كوب ماء\n\n✅ **بعد التمرين (30 دقيقة):**\n- بروتين (لبن، بيض، دجاج)\n- كربوهيدرات (أرز، خبز أسمر)\n\n✅ **يومياً:**\n- 8 أكواب ماء على الأقل\n- 5 حصص خضار وفواكه\n- تجنب السكريات المصنعة\n\n💪 التغذية الصحيحة = نتائج أفضل!',
        category: 'nutrition'
      };
    }
    
    if (message.includes('تحفيز') || message.includes('حماس') || message.includes('كسل')) {
      return {
        content: '💪 **رسالة تحفيزية خاصة لك:**\n\n🌟 "كل خطوة تخطوها اليوم تقربك من هدفك!"\n\n🔥 **تذكر:**\n- لست تتنافس مع أحد غيرك\n- التقدم البطيء أفضل من عدم التقدم\n- جسمك قادر على أكثر مما تتخيل\n- كل تمرين يجعلك أقوى\n\n✨ **اليوم هو اليوم المناسب للبداية!**\n\nما رأيك أن نبدأ بتمرين بسيط لمدة 5 دقائق فقط؟',
        category: 'motivation'
      };
    }
    
    return {
      content: 'شكراً لسؤالك! أنا هنا لمساعدتك في كل ما يتعلق بالتعليم والحركة. يمكنني مساعدتك في:\n\n🏃‍♂️ تخطيط التمارين وشرحها\n🥗 نصائح التغذية الصحية\n💪 التحفيز والدعم النفسي\n📚 الإجابة على الأسئلة التعليمية\n📊 تتبع التقدم وتحليل الأداء\n\nما الذي تود أن نتحدث عنه؟',
      category: 'general'
    };
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.prompt) {
      handleSendMessage(action.prompt);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // هنا يمكن إضافة منطق التعرف على الصوت
  };

  const playAudio = (messageId: string) => {
    // محاكاة تشغيل الصوت باستخدام ElevenLabs
    console.log('Playing audio for message:', messageId);
  };

  const getCategoryColor = (category?: string) => {
    const colors = {
      exercise: 'bg-primary/10 text-primary',
      nutrition: 'bg-green-500/10 text-green-600',
      motivation: 'bg-orange-500/10 text-orange-600',
      general: 'bg-gray-500/10 text-gray-600'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getCategoryLabel = (category?: string) => {
    const labels = {
      exercise: 'تمارين',
      nutrition: 'تغذية',
      motivation: 'تحفيز',
      general: 'عام'
    };
    return labels[category as keyof typeof labels] || 'عام';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* رأس المساعد */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/api/placeholder/48/48" alt="المساعد الذكي" />
              <AvatarFallback className="bg-primary text-white">
                <Bot className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                المساعد الذكي للتعليم والحركة
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </CardTitle>
              <CardDescription>متخصص في التمارين، التغذية، والتحفيز</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* الإجراءات السريعة */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction(action)}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* منطقة المحادثة */}
      <Card className="h-96">
        <CardContent className="p-0 h-full flex flex-col">
          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.category && message.type === 'assistant' && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(message.category)}`}>
                          {getCategoryLabel(message.category)}
                        </Badge>
                        {message.hasAudio && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => playAudio(message.id)}
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.type === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* منطقة الإدخال */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={toggleListening}
                className={isListening ? 'bg-red-50 text-red-600' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                size="sm"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartChatAssistant;