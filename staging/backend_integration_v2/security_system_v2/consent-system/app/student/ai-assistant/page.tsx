'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  BookOpen,
  Star,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  MessageCircle,
  Headphones
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { StudentAIServices, type LearningRecommendation, type VoiceInteraction } from '@/lib/integrations/student-ai-services'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

interface AIConfig {
  huggingFaceToken: string
  supabaseUrl: string
  supabaseKey: string
}

export default function StudentAIAssistant() {
  const { user } = useAuth()
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Voice interaction state
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  
  // AI Services
  const [aiServices, setAiServices] = useState<StudentAIServices | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    initializeAIServices()
    loadRecommendations()
    addWelcomeMessage()
  }, [user])

  const initializeAIServices = async () => {
    try {
      const config: AIConfig = {
        huggingFaceToken: process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN || '',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      }
      
      const services = new StudentAIServices(config)
      setAiServices(services)
    } catch (error) {
      console.error('Failed to initialize AI services:', error)
    }
  }

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `مرحباً ${user?.name || 'عزيزي الطالب'}! 👋\n\nأنا مساعدك التعليمي الذكي. يمكنني مساعدتك في:\n• الإجابة على أسئلتك الدراسية\n• اقتراح محتوى تعليمي مناسب لك\n• التفاعل معك صوتياً\n• تقديم شروحات مبسطة\n\nكيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const loadRecommendations = async () => {
    if (!user?.id || !aiServices) return
    
    setLoadingRecommendations(true)
    try {
      const recs = await aiServices.generateLearningRecommendations(user.id)
      setRecommendations(recs)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const sendTextMessage = async () => {
    if (!inputText.trim() || !aiServices || !user?.id) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await aiServices.generatePersonalizedResponse(user.id, inputText)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data])
      }
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await handleVoiceMessage(audioBlob)
        setAudioChunks([])
      }
      
      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('لا يمكن الوصول إلى الميكروفون. يرجى التأكد من الأذونات.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const handleVoiceMessage = async (audioBlob: Blob) => {
    if (!aiServices || !user?.id) return

    setIsLoading(true)
    
    try {
      const voiceInteraction: VoiceInteraction = await aiServices.handleVoiceInteraction(user.id, audioBlob)
      
      // Add user voice message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: voiceInteraction.transcription || 'رسالة صوتية',
        timestamp: new Date()
      }

      // Add assistant response with audio
      const audioUrl = URL.createObjectURL(voiceInteraction.audioResponse)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: voiceInteraction.response,
        timestamp: new Date(),
        audioUrl
      }

      setMessages(prev => [...prev, userMessage, assistantMessage])
    } catch (error) {
      console.error('Failed to process voice message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'عذراً، لم أتمكن من معالجة الرسالة الصوتية.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)
      
      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800'
    if (difficulty <= 4) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return 'سهل'
    if (difficulty <= 4) return 'متوسط'
    return 'صعب'
  }

  return (
    <AuthGuard requiredRoles={['student']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Bot className="h-8 w-8 text-blue-600" />
              المساعد التعليمي الذكي
            </h1>
            <p className="text-gray-600">مدعوم بالذكاء الاصطناعي لتجربة تعلم شخصية ومتفاعلة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    المحادثة التفاعلية
                  </CardTitle>
                  <CardDescription>
                    تحدث مع المساعد الذكي نصياً أو صوتياً
                  </CardDescription>
                </CardHeader>
                
                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          {message.type === 'assistant' && (
                            <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          )}
                          {message.type === 'user' && (
                            <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.audioUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => playAudio(message.audioUrl!)}
                                className="mt-2 p-1 h-auto"
                              >
                                {isPlaying ? (
                                  <VolumeX className="h-4 w-4" />
                                ) : (
                                  <Volume2 className="h-4 w-4" />
                                )}
                                <span className="mr-1 text-xs">استمع للرد</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">جاري الكتابة...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendTextMessage}
                        disabled={!inputText.trim() || isLoading}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        disabled={isLoading}
                      >
                        {isRecording ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isRecording && (
                    <div className="mt-2 flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">جاري التسجيل... اضغط على الميكروفون للتوقف</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Recommendations Sidebar */}
            <div className="space-y-6">
              
              {/* AI Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    حالة الذكاء الاصطناعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Llama 2 Chat</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">متصل</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Whisper STT</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">متصل</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Coqui TTS</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">متصل</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Recommender</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">نشط</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-orange-600" />
                      اقتراحات تعليمية
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={loadRecommendations}
                      disabled={loadingRecommendations}
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingRecommendations ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  <CardDescription>
                    محتوى مخصص لك بناءً على تفضيلاتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRecommendations ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">
                                {Math.round(rec.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {rec.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={getDifficultyColor(rec.difficulty)}
                              >
                                {getDifficultyText(rec.difficulty)}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {rec.estimatedTime} دقيقة
                              </div>
                            </div>
                            
                            <Button size="sm" variant="outline" className="text-xs">
                              ابدأ التعلم
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">لا توجد اقتراحات متاحة حالياً</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Voice Controls */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Headphones className="h-4 w-4 text-green-600" />
                    التحكم الصوتي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 ml-2" />
                          إيقاف التسجيل
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 ml-2" />
                          ابدأ التحدث
                        </>
                      )}
                    </Button>
                    
                    <div className="text-xs text-gray-600 text-center">
                      اضغط واتحدث للحصول على إجابات صوتية فورية
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Hidden audio element for playback */}
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>
    </AuthGuard>
  )
}