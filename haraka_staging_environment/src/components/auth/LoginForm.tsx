import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToRegister, 
  onForgotPassword 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  const roleColors = {
    student: 'from-blue-500 to-blue-600',
    youth: 'from-blue-600 to-blue-700',
    parent: 'from-green-500 to-green-600',
    teacher: 'from-green-600 to-green-700',
    principal: 'from-orange-500 to-orange-600',
    coach: 'from-purple-500 to-purple-600',
    directorate: 'from-indigo-500 to-indigo-600',
    ministry: 'from-red-500 to-red-600',
    competition: 'from-pink-500 to-pink-600',
    admin: 'from-gray-500 to-gray-600'
  };

  const demoAccounts = [
    { email: 'student@demo.com', role: 'student' as UserRole, name: 'تلميذ تجريبي' },
    { email: 'youth@demo.com', role: 'youth' as UserRole, name: 'شاب تجريبي' },
    { email: 'parent@demo.com', role: 'parent' as UserRole, name: 'ولي أمر تجريبي' },
    { email: 'teacher@demo.com', role: 'teacher' as UserRole, name: 'معلم تجريبي' },
    { email: 'principal@demo.com', role: 'principal' as UserRole, name: 'مدير تجريبي' },
    { email: 'coach@demo.com', role: 'coach' as UserRole, name: 'مدرب تجريبي' },
    { email: 'directorate@demo.com', role: 'directorate' as UserRole, name: 'مديرية التعليم' },
    { email: 'ministry@demo.com', role: 'ministry' as UserRole, name: 'وزارة تجريبية' },
    { email: 'competition@demo.com', role: 'competition' as UserRole, name: 'مسابقات تجريبية' },
    { email: 'admin@demo.com', role: 'admin' as UserRole, name: 'مدير النظام' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('login')}
        </CardTitle>
        <CardDescription>
          اختر نوع الحساب وسجل الدخول
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Demo Accounts Quick Access */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">حسابات تجريبية (كلمة المرور: demo123)</Label>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.role}
                variant="outline"
                size="sm"
                className={`text-xs p-2 h-auto bg-gradient-to-r ${roleColors[account.role]} text-white border-0 hover:opacity-90`}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo123');
                  setSelectedRole(account.role);
                }}
              >
                <div className="text-center">
                  <div className="font-medium">{t(account.role)}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-right"
              dir="ltr"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('role')}</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{t('student')}</SelectItem>
                <SelectItem value="youth">{t('youth')}</SelectItem>
                <SelectItem value="parent">{t('parent')}</SelectItem>
                <SelectItem value="teacher">{t('teacher')}</SelectItem>
                <SelectItem value="principal">{t('principal')}</SelectItem>
                <SelectItem value="coach">{t('coach')}</SelectItem>
                <SelectItem value="directorate">مديرية التعليم</SelectItem>
                <SelectItem value="ministry">{t('ministry')}</SelectItem>
                <SelectItem value="competition">{t('competition')}</SelectItem>
                <SelectItem value="admin">مدير النظام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('login')
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button
            variant="link"
            onClick={onForgotPassword}
            className="text-sm"
          >
            {t('forgotPassword')}
          </Button>
          
          <div className="text-sm">
            ليس لديك حساب؟{' '}
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              className="p-0 h-auto font-medium"
            >
              {t('register')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};