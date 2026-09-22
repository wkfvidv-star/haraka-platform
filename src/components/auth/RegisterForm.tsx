import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/ThemeContext';
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole
  });
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    const result = await register(formData);
    if (!result.success) {
      setError(result.error || 'حدث خطأ أثناء إنشاء الحساب');
    } else {
      // Show confirmation screen after any successful registration
      setEmailSent(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ── شاشة تأكيد الإيميل ──────────────────────────────────────────────
  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <MailCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            تم إنشاء حسابك بنجاح! ✅
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            أُرسلت رسالة تأكيد إلى بريدك الإلكتروني
          </p>
          <p className="font-semibold text-foreground dir-ltr">{formData.email}</p>
          <p className="text-sm text-muted-foreground">
            يرجى فتح بريدك والنقر على رابط التأكيد لتفعيل حسابك
          </p>

          <Button
            className="w-full mt-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 gap-2"
            onClick={onSwitchToLogin}
          >
            <ArrowLeft className="h-4 w-4" />
            العودة لتسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {t('register')}
        </CardTitle>
        <CardDescription>
          أنشئ حساباً جديداً للمنصة التعليمية
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="text-right"
              dir="ltr"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              className="text-right"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('role')}</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleInputChange('role', value)}
            >
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
                <SelectItem value="ministry">{t('ministry')}</SelectItem>
                <SelectItem value="competition">{t('competition')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('register')
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <div className="text-sm">
            لديك حساب بالفعل؟{' '}
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="p-0 h-auto font-medium"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};