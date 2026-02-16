import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface ThemeContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isRTL: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Load saved preferences
    const savedLang = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      language,
      theme,
      setLanguage,
      setTheme,
      toggleTheme,
      isRTL: language === 'ar'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Translation helper
export const translations = {
  ar: {
    // Authentication
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    forgotPassword: 'نسيت كلمة المرور؟',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    role: 'الدور',
    
    // Roles
    student: 'تلميذ',
    youth: 'شاب',
    parent: 'ولي أمر',
    teacher: 'معلم',
    principal: 'مدير',
    coach: 'مدرب',
    ministry: 'وزارة',
    competition: 'مسابقات',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    exercises: 'التمارين',
    progress: 'التقدم',
    reports: 'التقارير',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Common
    welcome: 'مرحباً',
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    back: 'رجوع',
    next: 'التالي',
    start: 'ابدأ',
    continue: 'واصل',
  },
  en: {
    // Authentication
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    role: 'Role',
    
    // Roles
    student: 'Student',
    youth: 'Youth',
    parent: 'Parent',
    teacher: 'Teacher',
    principal: 'Principal',
    coach: 'Coach',
    ministry: 'Ministry',
    competition: 'Competition',
    
    // Navigation
    dashboard: 'Dashboard',
    exercises: 'Exercises',
    progress: 'Progress',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    start: 'Start',
    continue: 'Continue',
  }
};

export const useTranslation = () => {
  const { language } = useTheme();
  return {
    t: (key: keyof typeof translations.ar) => translations[language][key] || key,
    language
  };
};