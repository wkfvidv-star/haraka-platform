import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Trophy, 
  Dumbbell, 
  Lightbulb,
  School,
  Heart,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EnvironmentSelectorProps {
  onSelectEnvironment: (environment: 'school' | 'community') => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onSelectEnvironment }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Haraka Platform
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            منصة ذكية مزدوجة للتعليم والشباب - اختر البيئة المناسبة لك
          </p>
        </div>

        {/* Environment Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* School Environment */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <School className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">
                🏫 البيئة المدرسية
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
              Haraka Edu - منصة التعليم الذكية
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  بيئة تعليمية متكاملة تحت إشراف الوزارة التربوية
                </p>
              </div>

              {/* Target Users */}
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  المستخدمون المستهدفون
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">التلميذ</Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">الولي</Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">المعلم</Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">المدير</Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">مديرية التربية</Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">الوزارة</Badge>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  الميزات الرئيسية
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    أنشطة تربوية وتحديات أكاديمية
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    مسابقات مدرسية وولائية ووطنية
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    مساعد ذكي تربوي (AI_Teacher)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    إشراف رسمي ومتابعة إدارية
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => onSelectEnvironment('school')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg group-hover:scale-105 transition-transform"
              >
                دخول البيئة المدرسية
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Community Environment */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-300 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-orange-700 dark:text-orange-300">
                💪 بيئة الشباب والمدربين
              </CardTitle>
              <CardDescription className="text-orange-600 dark:text-orange-400 font-medium">
                Haraka Community - منصة المجتمع الذكية
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  بيئة مستقلة للشباب والمدربين تركز على الحركة والإبداع
                </p>
              </div>

              {/* Target Users */}
              <div>
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  المستخدمون المستهدفون
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">الشاب</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">المدرب</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">النوادي الرياضية</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">الشركاء</Badge>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  الميزات الرئيسية
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    تحديات رياضية ومشاريع إبداعية
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    مختبر الإبداع (Haraka) والواقع المعزز
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    مدرب ذكي تحفيزي (AI_Coach)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    مستقل عن الإشراف الوزاري
                  </li>
                </ul>
              </div>

              <Button 
                onClick={() => onSelectEnvironment('community')}
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white py-3 text-lg group-hover:scale-105 transition-transform"
              >
                دخول بيئة المجتمع
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>مصمم بحب للتعليم والشباب</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>نظام مكافآت ذكي</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              <span>مدعوم بالذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSelector;