import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/ThemeContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { 
  Home, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Trophy, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Calendar,
  BarChart3,
  MessageSquare,
  Award,
  School,
  Activity,
  Heart
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const { t, language } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isRTL = language === 'ar';

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
          { id: 'exercises', label: 'التمارين', icon: Dumbbell },
          { id: 'games', label: 'التحديات', icon: Target },
          { id: 'progress', label: 'التقدم', icon: TrendingUp },
          { id: 'rewards', label: 'الجوائز', icon: Trophy },
          { id: 'body-analysis', label: 'تحليل الجسم', icon: Heart }
        ];
      case 'youth':
        return [
          { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
          { id: 'training', label: 'التدريب', icon: Dumbbell },
          { id: 'sports', label: 'الرياضات', icon: Activity },
          { id: 'progress', label: 'الأداء', icon: TrendingUp },
          { id: 'competitions', label: 'المسابقات', icon: Trophy },
          { id: 'body-analysis', label: 'تحليل الجسم', icon: Heart }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'المتابعة', icon: Home },
          { id: 'children', label: 'الأطفال', icon: Users },
          { id: 'reports', label: 'التقارير', icon: BarChart3 },
          { id: 'schedule', label: 'الجدولة', icon: Calendar },
          { id: 'messages', label: 'الرسائل', icon: MessageSquare }
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'الصف', icon: Home },
          { id: 'students', label: 'التلاميذ', icon: Users },
          { id: 'exercises', label: 'التمارين', icon: Dumbbell },
          { id: 'reports', label: 'التقارير', icon: BarChart3 },
          { id: 'videos', label: 'الفيديوهات', icon: BookOpen }
        ];
      case 'principal':
        return [
          { id: 'dashboard', label: 'المؤسسة', icon: Home },
          { id: 'classes', label: 'الأقسام', icon: School },
          { id: 'teachers', label: 'المعلمون', icon: Users },
          { id: 'reports', label: 'التقارير', icon: BarChart3 },
          { id: 'competitions', label: 'المسابقات', icon: Trophy }
        ];
      case 'coach':
        return [
          { id: 'dashboard', label: 'الحصص', icon: Home },
          { id: 'clients', label: 'المتدربون', icon: Users },
          { id: 'programs', label: 'البرامج', icon: Dumbbell },
          { id: 'schedule', label: 'الجدول', icon: Calendar },
          { id: 'reports', label: 'التقارير', icon: BarChart3 }
        ];
      case 'ministry':
        return [
          { id: 'dashboard', label: 'الإحصائيات', icon: Home },
          { id: 'schools', label: 'المدارس', icon: School },
          { id: 'regions', label: 'الولايات', icon: BarChart3 },
          { id: 'competitions', label: 'المسابقات', icon: Trophy },
          { id: 'reports', label: 'التقارير', icon: BookOpen }
        ];
      case 'competition':
        return [
          { id: 'dashboard', label: 'المسابقات', icon: Home },
          { id: 'schools', label: 'المدارس', icon: School },
          { id: 'events', label: 'الفعاليات', icon: Trophy },
          { id: 'results', label: 'النتائج', icon: Award },
          { id: 'reports', label: 'التقارير', icon: BarChart3 }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-bold text-lg">منصة الحركة</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`
        fixed lg:static inset-y-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isRTL ? 'right-0 lg:right-auto border-l lg:border-r lg:border-l-0' : 'left-0 border-r'}
        lg:block
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{user?.name}</h3>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 h-11 ${isRTL ? 'flex-row-reverse' : ''}`}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${isRTL ? 'flex-row-reverse' : ''}`}
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}