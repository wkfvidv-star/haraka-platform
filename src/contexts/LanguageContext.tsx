import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en' | 'fr';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation & Sidedar
  'brand_name': { ar: 'منصة حركة', en: 'Haraka Platform', fr: 'Plateforme Haraka' },
  'student_portal': { ar: 'بوابة الطالب', en: 'STUDENT PORTAL', fr: 'PORTAIL ÉTUDIANT' },
  'menu_main': { ar: 'القائمة الرئيسية', en: 'MAIN MENU', fr: 'MENU PRINCIPAL' },
  'menu_support': { ar: 'الدعم', en: 'SUPPORT', fr: 'SOUTIEN' },

  // Tabs
  'tab_home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
  'tab_training': { ar: 'الأنشطة والتدريب', en: 'Training & Activities', fr: 'Entraînement et Activités' },
  'tab_fingerprint': { ar: 'البصمة الحركية', en: 'Motion Fingerprint', fr: 'Empreinte Motrice' },
  'tab_progress': { ar: 'الإنجازات والمستوى', en: 'Progress & Achievements', fr: 'Progrès et Réalisations' },
  'tab_videos': { ar: 'الرصد والتقييم', en: 'Video Evaluation', fr: 'Évaluation Vidéo' },
  'tab_health': { ar: 'الرفاه والملف الصحي', en: 'Health Profile', fr: 'Profil de Santé' },
  'tab_help': { ar: 'عن النظام والمساعدة', en: 'Help & Support', fr: 'Aide et Support' },
  'tab_settings': { ar: 'الإعدادات', en: 'Settings', fr: 'Paramètres' },

  // Buttons
  'btn_retake_test': { ar: 'إعادة اختبار البصمة', en: 'Retake Engine Test', fr: 'Repasser le Test' },
  'btn_settings': { ar: 'إعدادات الحساب', en: 'Account Settings', fr: 'Paramètres du Compte' },
  'btn_help': { ar: 'المساعدة', en: 'Help & Support', fr: 'Aide et Support' },
  'btn_logout': { ar: 'تسجيل الخروج', en: 'Sign Out', fr: 'Se Déconnecter' },
  'btn_edit': { ar: 'تعديل', en: 'Edit', fr: 'Modifier' },

  // Header
  'search_placeholder': { ar: 'ابحث عن تمرين...', en: 'Search for exercise...', fr: 'Rechercher un exercice...' },
  'ai_assistant': { ar: 'AI مساعد', en: 'AI Assistant', fr: 'Assistant IA' },

  // Settings Page
  'settings_title': { ar: 'الملف الشخصي والإعدادات', en: 'Profile & Settings', fr: 'Profil et Paramètres' },
  'settings_subtitle': { ar: 'إدارة الهوية الرقمية وتفضيلات النظام', en: 'Manage your digital identity and preferences', fr: 'Gérez votre identité numérique et vos préférences' },
  'tab_my_profile': { ar: 'حسابي الشخصي', en: 'My Profile', fr: 'Mon Profil' },
  'tab_general_settings': { ar: 'الإعدادات العامة', en: 'General Settings', fr: 'Paramètres Généraux' },

  'student_badge': { ar: 'طالب (مرحلة متوسطة)', en: 'Student (Middle School)', fr: 'Élève (Collège)' },
  'stat_points': { ar: 'النقاط', en: 'Points', fr: 'Points' },
  'stat_level': { ar: 'المستوى', en: 'Level', fr: 'Niveau' },
  'stat_activity': { ar: 'النشاط', en: 'Activity', fr: 'Activité' },
  'stat_blood': { ar: 'فصيلة الدم', en: 'Blood Type', fr: 'Groupe Sanguin' },

  'pref_title': { ar: 'تفضيلات النظام الواسعة', en: 'Global System Preferences', fr: 'Préférences Système Globales' },
  'pref_desc': { ar: 'خصص تجربتك في المنصة لتلائم احتياجاتك بدقة.', en: 'Customize your platform experience precisely to your needs.', fr: 'Personnalisez précisément votre expérience sur la plateforme.' },

  'opt_notifs': { ar: 'الإشعارات والتنبيهات', en: 'Notifications & Alerts', fr: 'Notifications et Alertes' },
  'opt_notifs_desc': { ar: 'تفعيل إشعارات التمارين ورسائل المدرسين.', en: 'Enable alerts for workouts and teacher messages.', fr: 'Activer les alertes pour les entraînements et messages.' },
  'opt_darkmode': { ar: 'الوضع الليلي (Dark Mode)', en: 'Dark Mode', fr: 'Mode Sombre' },
  'opt_darkmode_desc': { ar: 'تفعيل واجهة الألوان الداكنة لمحة بصرية أفضل.', en: 'Enable dark theme for better visibility.', fr: 'Activer le thème sombre pour une meilleure visibilité.' },
  'opt_privacy': { ar: 'الخصوصية ومشاركة البيانات', en: 'Privacy & Data Sharing', fr: 'Confidentialité et Données' },
  'opt_privacy_desc': { ar: 'مشاركة البصمة الحركية بصورة مجهولة لتطوير الذكاء الاصطناعي.', en: 'Share anonymous data to improve AI.', fr: 'Partager des données anonymes pour améliorer l\'IA.' },
  'opt_lang': { ar: 'لغة الواجهة', en: 'Interface Language', fr: 'Langue de l\'Interface' },
  'opt_lang_desc': { ar: 'العربية (الحالية)', en: 'English (Active)', fr: 'Français (Actif)' },
  'opt_pass': { ar: 'تغيير كلمة المرور', en: 'Change Password', fr: 'Changer le Mot de Passe' },
  'opt_pass_desc': { ar: 'تحديث بيانات الدخول الحماية.', en: 'Update security login credentials.', fr: 'Mettre à jour les informations de sécurité.' },

  'danger_title': { ar: 'تسجيل الخروج الآمن', en: 'Secure Sign Out', fr: 'Déconnexion Sécurisée' },
  'danger_desc': { ar: 'إنهاء الجلسة الحالية وتأمين بياناتك.', en: 'End current session and secure data.', fr: 'Mettre fin à la session et sécuriser les données.' },

  // Dashboard Home
  'role_explorer': { ar: 'مستكشف الحركة', en: 'Motion Explorer', fr: 'Explorateur de Mouvement' },

  // Activities Page (Mini)
  'smart_training_title': { ar: 'توصيات الذكاء الاصطناعي', en: 'AI Smart Recommendations', fr: 'Recommandations Intelligentes IA' },
  'smart_training_desc': { ar: 'بناءً على البصمة الحركية، هذه أفضل 3 تمارين لك اليوم', en: 'Based on your footprint, here are your top 3 workouts today', fr: 'Basé sur votre empreinte, voici vos 3 meilleurs entraînements aujourd\'hui' }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'ar',
  setLanguage: () => { },
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('haraka_lang') as Language;
    if (saved && ['ar', 'en', 'fr'].includes(saved)) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('haraka_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
