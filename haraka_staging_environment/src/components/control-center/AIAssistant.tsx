import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIControlCenter } from '@/contexts/AIControlCenterContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  Brain,
  Lightbulb
} from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const { 
    aiAssistant, 
    sendMessageToAssistant, 
    updateAssistantConfig 
  } = useAIControlCenter();
  const { user } = useAuth();
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiAssistant.conversationHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await sendMessageToAssistant(userMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsTyping(true);
    try {
      await sendMessageToAssistant(action);
    } finally {
      setIsTyping(false);
    }
  };

  const togglePersonality = () => {
    const personalities = ['helpful', 'professional', 'friendly', 'formal'] as const;
    const currentIndex = personalities.indexOf(aiAssistant.personality);
    const nextPersonality = personalities[(currentIndex + 1) % personalities.length];
    updateAssistantConfig({ personality: nextPersonality });
  };

  const getPersonalityLabel = (personality: string) => {
    switch (personality) {
      case 'helpful': return 'مساعد';
      case 'professional': return 'مهني';
      case 'friendly': return 'ودود';
      case 'formal': return 'رسمي';
      default: return personality;
    }
  };

  const getPersonalityColor = (personality: string) => {
    switch (personality) {
      case 'helpful': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'professional': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'friendly': return 'text-green-600 bg-green-50 border-green-200';
      case 'formal': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const quickActions = [
    { label: 'عرض الإحصائيات', action: 'اعرض لي إحصائيات النظام الحالية' },
    { label: 'التنبيهات النشطة', action: 'ما هي التنبيهات النشطة؟' },
    { label: 'أداء النظام', action: 'كيف أداء النظام الآن؟' },
    { label: 'المساعدة', action: 'كيف يمكنك مساعدتي؟' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المساعد الذكي</h2>
          <p className="text-muted-foreground">مساعد ذكي تفاعلي لمساعدتك في استخدام المنصة</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getPersonalityColor(aiAssistant.personality)}>
            <Bot className="w-3 h-3 mr-1" />
            {getPersonalityLabel(aiAssistant.personality)}
          </Badge>
          <Button variant="outline" size="sm" onClick={togglePersonality}>
            <Settings className="h-4 w-4 mr-2" />
            تغيير الشخصية
          </Button>
        </div>
      </div>

      {/* Assistant Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              القدرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{aiAssistant.capabilities.length}</div>
            <p className="text-xs text-muted-foreground">مهارة متاحة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              المحادثات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{aiAssistant.conversationHistory.length}</div>
            <p className="text-xs text-muted-foreground">رسالة في التاريخ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500" />
              الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                {aiAssistant.isActive ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">جاهز للمساعدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                {aiAssistant.name}
              </CardTitle>
              <CardDescription>
                اسأل أي سؤال حول النظام أو اطلب المساعدة
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {aiAssistant.conversationHistory.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>مرحباً! أنا مساعد حركة الذكي</p>
                      <p className="text-sm">كيف يمكنني مساعدتك اليوم؟</p>
                    </div>
                  )}
                  
                  {aiAssistant.conversationHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {msg.timestamp.toLocaleTimeString('ar-SA')}
                        </p>
                      </div>
                      
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    size="sm"
                  >
                    {isTyping ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isTyping}
                >
                  <Lightbulb className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">قدرات المساعد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiAssistant.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">إعدادات المساعد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">تفعيل المساعد</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAssistantConfig({ isActive: !aiAssistant.isActive })}
                >
                  {aiAssistant.isActive ? 'إيقاف' : 'تفعيل'}
                </Button>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs">الشخصية الحالية:</span>
                <Badge className={getPersonalityColor(aiAssistant.personality)}>
                  {getPersonalityLabel(aiAssistant.personality)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs">اللغة:</span>
                <Badge variant="outline">العربية</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;