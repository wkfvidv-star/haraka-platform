import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

type AuthView = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        {currentView === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot')}
          />
        )}
        
        {currentView === 'register' && (
          <RegisterForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'forgot' && (
          <ForgotPassword
            onBackToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
}