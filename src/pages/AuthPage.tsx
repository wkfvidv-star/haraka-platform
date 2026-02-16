import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, Environment } from '@/contexts/AuthContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { ProvinceSelector } from '@/components/directorate/ProvinceSelector';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  School,
  Dumbbell,
  ShieldCheck,
  Check
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, isLoading, environment, setEnvironment, province, setProvince } = useAuth();

  // Local state for form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSelectingProvince, setIsSelectingProvince] = useState(false); // New state

  // Clear errors when environment changes
  useEffect(() => {
    setError('');
  }, [environment, province]);

  const handleEnvironmentSelect = (env: Environment) => {
    setEnvironment(env);
    // If community, we don't need province, so ensure it's null
    if (env === 'community') {
      setProvince(null);
    }
  };

  const handleProvinceSelect = (selectedProv: any) => {
    setProvince(selectedProv);
    setIsSelectingProvince(false); // Exit selection mode
  };

  const handleBackToEnvironmentSelection = () => {
    setEnvironment(null);
    setProvince(null);
    setEmail('');
    setPassword('');
    setError('');
    setSelectedRole('');
    setIsSelectingProvince(false);
  };

  const handleOpenProvinceSelection = () => {
    setIsSelectingProvince(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!environment) {
      setError('يرجى اختيار البيئة أولاً');
      return;
    }

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    const success = await login(email, password, environment);
    if (!success) {
      setError('بيانات الدخول غير صحيحة أو غير مخولة للبيئة المختارة');
    }
  };

  const handleRoleSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    const accounts = getEnvironmentAccounts(environment!);
    const account = accounts.find(a => a.key === roleKey);
    if (account) {
      setEmail(account.email);
      setPassword('demo123');
    }
  };

  // ... (getTheme)

  const getEnvironmentAccounts = (env: Environment) => {
    if (env === 'school') {
      return [
        { key: 'student', label: 'تلميذ', email: 'student@demo.com' },
        { key: 'parent', label: 'ولي أمر', email: 'parent@demo.com' },
        { key: 'teacher', label: 'معلم', email: 'teacher@demo.com' },
        { key: 'principal', label: 'مدير', email: 'principal@demo.com' },
        { key: 'directorate', label: 'المديرية', email: 'directorate@demo.com' },
        { key: 'ministry', label: 'الوزارة', email: 'ministry@demo.com' },
      ];
    } else {
      return [
        { key: 'youth', label: 'شاب', email: 'youth@demo.com' },
        { key: 'coach', label: 'مدرب', email: 'coach@demo.com' },
        { key: 'competition', label: 'منظم', email: 'competition@demo.com' },
      ];
    }
  };

  const getTheme = () => {
    if (environment === 'school') {
      return {
        wrapper: 'from-blue-600 to-blue-900',
        cardBorder: 'border-blue-100',
        iconUser: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        ring: 'ring-blue-100',
        badge: 'bg-blue-50 text-blue-700'
      };
    }
    return {
      wrapper: 'from-orange-500 to-orange-800',
      cardBorder: 'border-orange-100',
      iconUser: 'text-orange-600',
      button: 'bg-orange-500 hover:bg-orange-600',
      ring: 'ring-orange-100',
      badge: 'bg-orange-50 text-orange-700'
    };
  };

  // 1. No Environment Selected -> Show Environment Selector
  if (!environment) {
    return <EnvironmentSelector onSelectEnvironment={handleEnvironmentSelect} />;
  }

  // 2. Province Selection Mode -> Show Province Selector
  if (isSelectingProvince) {
    return (
      <ProvinceSelector
        onProvinceSelect={handleProvinceSelect}
        onBack={() => setIsSelectingProvince(false)}
      />
    );
  }

  // 3. Environment Selected (and Province if School) -> Show Login Form
  const theme = getTheme();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-cairo" dir="rtl">

      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/auth_bg_kids_sports.png"
          alt="Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a high-quality Unsplash image if local image is missing
            e.currentTarget.src = "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.wrapper} opacity-90 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Back Button */}
        <div className="absolute -top-16 right-0">
          <Button
            variant="ghost"
            onClick={environment === 'school' ? handleOpenProvinceSelection : handleBackToEnvironmentSelection}
            className="text-white hover:bg-white/10 gap-2 px-3 group"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {environment === 'school' ? 'اختر الولاية' : 'تغيير البيئة'}
            </span>
          </Button>
        </div>

        {/* Floating Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">

          {/* Header Section */}
          <div className="pt-8 pb-6 px-8 text-center border-b border-gray-100 bg-white">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg ${environment === 'school' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
              {environment === 'school' ? <School className="w-8 h-8" /> : <Dumbbell className="w-8 h-8" />}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {environment === 'school' ? 'البيئة المدرسية' : 'بيئة المجتمع'}
            </h1>
            {province && (
              <p className="text-blue-600 font-bold mb-1">
                {province.arabicName}
              </p>
            )}
            <p className="text-sm text-gray-500 font-medium">
              منصة Haraka للتعليم الذكي
            </p>
          </div>

          <div className="p-8 space-y-6">

            {/* Role Tab Selector */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center block">
                تسجيل الدخول كـ
              </Label>
              <Tabs value={selectedRole} onValueChange={handleRoleSelect} className="w-full">
                <TabsList className="w-full grid grid-cols-3 gap-1 bg-gray-100/50 p-1.5 h-auto rounded-xl">
                  {getEnvironmentAccounts(environment).map((acc) => (
                    <TabsTrigger
                      key={acc.key}
                      value={acc.key}
                      className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium rounded-lg transition-all"
                    >
                      {acc.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </Label>
                <div className="relative group">
                  <Mail className={`absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:${theme.iconUser} transition-colors`} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:${theme.ring} focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    كلمة المرور
                  </Label>
                  <a href="#" className={`text-xs font-semibold ${environment === 'school' ? 'text-blue-600' : 'text-orange-600'} hover:underline`}>
                    هل نسيت كلمة المرور؟
                  </a>
                </div>
                <div className="relative group">
                  <Lock className={`absolute right-3 top-3 h-4 w-4 text-gray-400 group-focus-within:${theme.iconUser} transition-colors`} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:${theme.ring} focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className={`w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${theme.button}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  'جاري التحقق...'
                ) : (
                  <span className="flex items-center gap-2">
                    تسجيل الدخول
                    <LogIn className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span>نظام محمي ومشفر بالكامل</span>
            </div>
          </div>
        </div>

        <p className="text-center text-white/60 text-xs mt-8">
          © 2025 منصة Haraka. جميع الحقوق محفوظة لوزارة التربية.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;