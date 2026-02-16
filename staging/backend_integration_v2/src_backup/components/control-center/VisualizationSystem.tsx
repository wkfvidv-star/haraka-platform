import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAIControlCenter } from '@/contexts/AIControlCenterContext';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Zap,
  Settings,
  Palette,
  RefreshCw,
  Maximize,
  Eye,
  Thermometer
} from 'lucide-react';

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  type: string;
}

export const VisualizationSystem: React.FC = () => {
  const { 
    heatmapData, 
    visualizationConfig, 
    updateVisualizationConfig,
    realTimeMetrics 
  } = useAIControlCenter();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedVisualization, setSelectedVisualization] = useState<'heatmap' | 'activity' | 'metrics'>('heatmap');

  // Draw heatmap on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !heatmapData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Create gradient for heatmap
    const createGradient = (x: number, y: number, intensity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      const alpha = intensity / 100;
      
      if (intensity > 80) {
        gradient.addColorStop(0, `rgba(220, 38, 127, ${alpha})`); // Hot pink
        gradient.addColorStop(1, `rgba(220, 38, 127, 0)`);
      } else if (intensity > 60) {
        gradient.addColorStop(0, `rgba(249, 115, 22, ${alpha})`); // Orange
        gradient.addColorStop(1, `rgba(249, 115, 22, 0)`);
      } else if (intensity > 40) {
        gradient.addColorStop(0, `rgba(234, 179, 8, ${alpha})`); // Yellow
        gradient.addColorStop(1, `rgba(234, 179, 8, 0)`);
      } else {
        gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`); // Blue
        gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
      }
      
      return gradient;
    };

    // Draw heatmap points
    heatmapData.forEach(point => {
      const x = (point.x / 100) * width;
      const y = (point.y / 100) * height;
      
      ctx.fillStyle = createGradient(x, y, point.value);
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add grid overlay
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

  }, [heatmapData, visualizationConfig.theme]);

  // Animation loop for real-time updates
  useEffect(() => {
    if (!isAnimating || !visualizationConfig.autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger re-render with slight variations
      if (canvasRef.current) {
        const event = new Event('update');
        canvasRef.current.dispatchEvent(event);
      }
    }, visualizationConfig.refreshRate);

    return () => clearInterval(interval);
  }, [isAnimating, visualizationConfig.autoRefresh, visualizationConfig.refreshRate]);

  const handleConfigChange = (key: keyof typeof visualizationConfig, value: any) => {
    updateVisualizationConfig({ [key]: value });
  };

  const getVisualizationTitle = () => {
    switch (selectedVisualization) {
      case 'heatmap': return 'خريطة النشاط الحرارية';
      case 'activity': return 'مؤشرات النشاط المباشر';
      case 'metrics': return 'المقاييس في الوقت الحقيقي';
      default: return 'التمثيل البصري';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">نظام التمثيل البصري</h2>
          <p className="text-muted-foreground">تصور البيانات بطريقة تفاعلية وديناميكية</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedVisualization === 'heatmap' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVisualization('heatmap')}
          >
            <Thermometer className="h-4 w-4 mr-2" />
            خريطة حرارية
          </Button>
          <Button
            variant={selectedVisualization === 'activity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVisualization('activity')}
          >
            <Activity className="h-4 w-4 mr-2" />
            النشاط
          </Button>
          <Button
            variant={selectedVisualization === 'metrics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedVisualization('metrics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            المقاييس
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {getVisualizationTitle()}
                  </CardTitle>
                  <CardDescription>
                    تحديث كل {visualizationConfig.refreshRate / 1000} ثانية
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isAnimating ? 'default' : 'secondary'}>
                    {isAnimating ? 'مباشر' : 'متوقف'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                  >
                    {isAnimating ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedVisualization === 'heatmap' && (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full h-96 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>منخفض (0-40)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>متوسط (40-60)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>عالي (60-80)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span>مكثف (80-100)</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedVisualization === 'activity' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">{realTimeMetrics.activeUsers}</div>
                      <div className="text-sm text-blue-700">مستخدم نشط</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">{realTimeMetrics.throughput.toFixed(1)}</div>
                      <div className="text-sm text-green-700">نقطة/دقيقة</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">{realTimeMetrics.dataProcessed}</div>
                      <div className="text-sm text-purple-700">بيانات معالجة</div>
                    </div>
                  </div>
                  
                  <div className="h-64 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>رسم بياني تفاعلي للنشاط</p>
                      <p className="text-xs">سيتم تطويره في التحديثات القادمة</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedVisualization === 'metrics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">زمن الاستجابة</span>
                        <span className="text-lg font-bold">{realTimeMetrics.responseTime.toFixed(0)}ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (realTimeMetrics.responseTime / 1000) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">معدل الخطأ</span>
                        <span className="text-lg font-bold">{realTimeMetrics.errorRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${realTimeMetrics.errorRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">حمولة النظام</span>
                        <span className="text-lg font-bold">{realTimeMetrics.systemLoad.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${realTimeMetrics.systemLoad}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">الإنتاجية</span>
                        <span className="text-lg font-bold">{realTimeMetrics.throughput.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, realTimeMetrics.throughput * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات العرض
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">معدل التحديث (ثانية)</label>
                <Slider
                  value={[visualizationConfig.refreshRate / 1000]}
                  onValueChange={([value]) => handleConfigChange('refreshRate', value * 1000)}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  {visualizationConfig.refreshRate / 1000} ثانية
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">التحديث التلقائي</label>
                <Switch
                  checked={visualizationConfig.autoRefresh}
                  onCheckedChange={(checked) => handleConfigChange('autoRefresh', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">الرسوم المتحركة</label>
                <Switch
                  checked={visualizationConfig.showAnimations}
                  onCheckedChange={(checked) => handleConfigChange('showAnimations', checked)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">سرعة الحركة</label>
                <select
                  value={visualizationConfig.animationSpeed}
                  onChange={(e) => handleConfigChange('animationSpeed', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="slow">بطيء</option>
                  <option value="normal">عادي</option>
                  <option value="fast">سريع</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">نظام الألوان</label>
                <select
                  value={visualizationConfig.colorScheme}
                  onChange={(e) => handleConfigChange('colorScheme', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="default">افتراضي</option>
                  <option value="colorblind">مناسب لعمى الألوان</option>
                  <option value="high-contrast">تباين عالي</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إحصائيات العرض
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>نقاط البيانات:</span>
                <span className="font-bold">{heatmapData.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>معدل الإطارات:</span>
                <span className="font-bold">{Math.round(1000 / visualizationConfig.refreshRate)} FPS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>آخر تحديث:</span>
                <span className="font-bold">{realTimeMetrics.lastUpdate.toLocaleTimeString('ar-SA')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizationSystem;