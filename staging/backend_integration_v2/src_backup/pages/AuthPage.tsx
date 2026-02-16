import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, Environment } from '@/contexts/AuthContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowLeft,
  School,
  Dumbbell
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleEnvironmentSelect = (environment: Environment) => {
    setSelectedEnvironment(environment);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEnvironment) {
      setError('يرجى اختيار البيئة أولاً');
      return;
    }

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    const success = await login(email, password, selectedEnvironment);
    if (!success) {
      setError('بيانات الدخول غير صحيحة أو غير مخولة للبيئة المختارة');
    }
  };

  const handleBackToEnvironmentSelection = () => {
    setSelectedEnvironment(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  const getEnvironmentAccounts = (env: Environment) => {
    if (env === 'school') {
      return [
        { email: 'student@demo.com', role: 'التلميذ', name: 'أحمد محمد' },
        { email: 'parent@demo.com', role: 'الولي', name: 'محمد الأحمد' },
        { email: 'teacher@demo.com', role: 'المعلم', name: 'فاطمة الزهراء' },
        { email: 'principal@demo.com', role: 'المدير', name: 'عبد الله الصالح' },
        { email: 'directorate@demo.com', role: 'مديرية التربية', name: 'مديرية التعليم' },
        { email: 'ministry@demo.com', role: 'الوزارة', name: 'وزارة التربية' },
      ];
    } else {
      return [
        { email: 'youth@demo.com', role: 'الشاب', name: 'سارة علي' },
        { email: 'coach@demo.com', role: 'المدرب', name: 'خالد الرياضي' },
        { email: 'competition@demo.com', role: 'إدارة المسابقات', name: 'إدارة المسابقات' },
      ];
    }
  };

  // Show environment selector if no environment is selected
  if (!selectedEnvironment) {
    return <EnvironmentSelector onSelectEnvironment={handleEnvironmentSelect} />;
  }

  // Show login form for selected environment
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      selectedEnvironment === 'school' 
        ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-gray-900'
        : 'bg-gradient-to-br from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-gray-900'
    }`}>
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToEnvironmentSelection}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة لاختيار البيئة
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedEnvironment === 'school'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-orange-500 to-green-500'
              }`}>
                {selectedEnvironment === 'school' ? (
                  <School className="w-8 h-8 text-white" />
                ) : (
                  <Dumbbell className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className={`text-2xl ${
                selectedEnvironment === 'school' ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {selectedEnvironment === 'school' ? '🏫 البيئة المدرسية' : '💪 بيئة المجتمع'}
              </CardTitle>
              <CardDescription>
                {selectedEnvironment === 'school' 
                  ? 'دخول إلى منصة التعليم الذكية'
                  : 'دخول إلى منصة المجتمع الذكية'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@demo.com"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="demo123"
                    className="mt-1"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className={`w-full ${
                    selectedEnvironment === 'school'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الدخول...' : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      دخول
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">حسابات تجريبية</CardTitle>
              <CardDescription>
                استخدم هذه الحسابات للتجربة (كلمة المرور: demo123)
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {getEnvironmentAccounts(selectedEnvironment).map((account, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                      selectedEnvironment === 'school' 
                        ? 'hover:border-blue-300 hover:bg-blue-50'
                        : 'hover:border-orange-300 hover:bg-orange-50'
                    }`}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('demo123');
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className={`text-sm ${
                          selectedEnvironment === 'school' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {account.role}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {account.email}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Admin Account (available for both environments) */}
                <div 
                  className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all hover:border-purple-300 hover:bg-purple-50"
                  onClick={() => {
                    setEmail('admin@demo.com');
                    setPassword('demo123');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">مدير النظام</div>
                      <div className="text-sm text-purple-600">مدير (وصول لكلا البيئتين)</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      admin@demo.com
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;