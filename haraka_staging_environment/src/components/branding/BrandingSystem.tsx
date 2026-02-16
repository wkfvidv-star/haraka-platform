import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Crown, 
  Shield, 
  Sparkles,
  Heart,
  Target,
  Zap
} from 'lucide-react';

interface BrandingSystemProps {
  variant?: 'header' | 'card' | 'badge' | 'full';
  size?: 'sm' | 'md' | 'lg';
  showEnvironment?: boolean;
}

export const BrandingSystem: React.FC<BrandingSystemProps> = ({ 
  variant = 'card', 
  size = 'md',
  showEnvironment = true 
}) => {
  const { environment, user } = useAuth();

  const brandColors = {
    school: {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'from-blue-50 to-indigo-50',
      accent: 'text-blue-600',
      background: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    community: {
      primary: 'from-orange-500 to-green-600',
      secondary: 'from-orange-50 to-green-50',
      accent: 'text-orange-600',
      background: 'bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20',
      border: 'border-orange-200 dark:border-orange-800'
    }
  };

  const currentBrand = brandColors[environment || 'school'];

  const environmentConfig = {
    school: {
      name: 'المنصة التربوية الذكية',
      subtitle: 'وزارة التربية الوطنية',
      icon: GraduationCap,
      description: 'منصة تعليمية متطورة للتلاميذ والمعلمين',
      features: ['تعلم تفاعلي', 'متابعة الأولياء', 'تقييم ذكي', 'محتوى معتمد']
    },
    community: {
      name: 'منصة المجتمع الذكية',
      subtitle: 'للشباب والمدربين',
      icon: Users,
      description: 'مجتمع رياضي ذكي للجميع',
      features: ['تدريب شخصي', 'مسابقات مفتوحة', 'مجتمع نشط', 'تقنيات متطورة']
    }
  };

  const config = environmentConfig[environment || 'school'];
  const Icon = config.icon;

  if (variant === 'header') {
    return (
      <div className={`bg-gradient-to-r ${currentBrand.primary} text-white`}>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className={`font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}>
              {config.name}
            </h1>
            {showEnvironment && (
              <p className="text-sm opacity-90">{config.subtitle}</p>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="opacity-75 text-xs">
                  {user.userType === 'student' ? 'تلميذ' : 
                   user.userType === 'teacher' ? 'معلم' :
                   user.userType === 'parent' ? 'ولي' :
                   user.userType === 'youth' ? 'شاب' : 'مدرب'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge className={`${currentBrand.background} ${currentBrand.accent} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {environment === 'school' ? 'تربوي' : 'مجتمعي'}
      </Badge>
    );
  }

  if (variant === 'full') {
    return (
      <Card className={`${currentBrand.background} ${currentBrand.border} overflow-hidden`}>
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${currentBrand.primary} text-white p-6`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{config.name}</h2>
                <p className="opacity-90">{config.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-lg opacity-95 mb-4">{config.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className={`w-12 h-12 ${currentBrand.background} rounded-lg flex items-center justify-center mx-auto`}>
                  <Heart className={`w-6 h-6 ${currentBrand.accent}`} />
                </div>
                <div className="text-sm font-medium">صحة ذكية</div>
              </div>
              
              <div className="space-y-2">
                <div className={`w-12 h-12 ${currentBrand.background} rounded-lg flex items-center justify-center mx-auto`}>
                  <Target className={`w-6 h-6 ${currentBrand.accent}`} />
                </div>
                <div className="text-sm font-medium">أهداف واضحة</div>
              </div>
              
              <div className="space-y-2">
                <div className={`w-12 h-12 ${currentBrand.background} rounded-lg flex items-center justify-center mx-auto`}>
                  <Zap className={`w-6 h-6 ${currentBrand.accent}`} />
                </div>
                <div className="text-sm font-medium">تقنية متطورة</div>
              </div>
              
              <div className="space-y-2">
                <div className={`w-12 h-12 ${currentBrand.background} rounded-lg flex items-center justify-center mx-auto`}>
                  <Shield className={`w-6 h-6 ${currentBrand.accent}`} />
                </div>
                <div className="text-sm font-medium">أمان عالي</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card variant
  return (
    <Card className={`${currentBrand.background} ${currentBrand.border}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${currentBrand.primary} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${currentBrand.accent}`}>{config.name}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingSystem;