'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Bot,
  Mic,
  Volume2,
  Sparkles
} from 'lucide-react'
import { checkAIServicesHealth } from '@/lib/config/ai-services-config'

interface ServiceStatus {
  llama2: boolean
  whisper: boolean
  tts: boolean
  supabase: boolean
}

interface AIStatusIndicatorProps {
  className?: string
  showDetails?: boolean
}

export function AIStatusIndicator({ className = '', showDetails = false }: AIStatusIndicatorProps) {
  const [status, setStatus] = useState<ServiceStatus>({
    llama2: false,
    whisper: false,
    tts: false,
    supabase: false
  })
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    checkServices()
    // Check every 5 minutes
    const interval = setInterval(checkServices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const checkServices = async () => {
    setIsChecking(true)
    try {
      const health = await checkAIServicesHealth()
      setStatus(health)
      setLastCheck(new Date())
    } catch (error) {
      console.error('Failed to check AI services health:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const getOverallStatus = () => {
    const services = Object.values(status)
    const activeCount = services.filter(Boolean).length
    const totalCount = services.length

    if (activeCount === totalCount) return 'excellent'
    if (activeCount >= totalCount * 0.75) return 'good'
    if (activeCount >= totalCount * 0.5) return 'fair'
    return 'poor'
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-3 w-3 text-green-600" />
    ) : (
      <XCircle className="h-3 w-3 text-red-600" />
    )
  }

  const overallStatus = getOverallStatus()

  if (!showDetails) {
    // Compact indicator
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {overallStatus === 'excellent' ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : overallStatus === 'poor' ? (
          <WifiOff className="h-4 w-4 text-red-600" />
        ) : (
          <Wifi className="h-4 w-4 text-yellow-600" />
        )}
        <Badge 
          variant={overallStatus === 'excellent' ? 'default' : 'secondary'}
          className={
            overallStatus === 'excellent' ? 'bg-green-100 text-green-800' :
            overallStatus === 'poor' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }
        >
          {overallStatus === 'excellent' ? 'ممتاز' :
           overallStatus === 'good' ? 'جيد' :
           overallStatus === 'fair' ? 'مقبول' : 'ضعيف'}
        </Badge>
      </div>
    )
  }

  // Detailed status card
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-purple-600" />
            حالة الذكاء الاصطناعي
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={checkServices}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          
          {/* Llama 2 Chat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700">Llama 2 Chat</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.llama2)}
              <Badge className={getStatusColor(status.llama2)}>
                {status.llama2 ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </div>

          {/* Whisper STT */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">Whisper STT</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.whisper)}
              <Badge className={getStatusColor(status.whisper)}>
                {status.whisper ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </div>

          {/* Coqui TTS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-700">Coqui TTS</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.tts)}
              <Badge className={getStatusColor(status.tts)}>
                {status.tts ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </div>

          {/* Supabase Database */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700">قاعدة البيانات</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.supabase)}
              <Badge className={getStatusColor(status.supabase)}>
                {status.supabase ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </div>

          {/* Overall Status */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">الحالة العامة:</span>
              <Badge 
                className={
                  overallStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                  overallStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                  overallStatus === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }
              >
                {overallStatus === 'excellent' ? '🟢 ممتاز' :
                 overallStatus === 'good' ? '🔵 جيد' :
                 overallStatus === 'fair' ? '🟡 مقبول' : '🔴 يحتاج إصلاح'}
              </Badge>
            </div>
          </div>

          {/* Last Check Time */}
          {lastCheck && (
            <div className="text-xs text-gray-500 text-center pt-2">
              آخر فحص: {lastCheck.toLocaleTimeString('ar-SA')}
            </div>
          )}

          {/* Connection Issues Alert */}
          {overallStatus === 'poor' && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">
                ⚠️ هناك مشاكل في الاتصال ببعض الخدمات. قد تتأثر جودة التفاعل.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AIStatusIndicator