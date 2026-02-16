import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme, useTranslation } from '@/contexts/ThemeContext';

interface LanguageSwitcherProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  showBackButton = false, 
  onBack 
}) => {
  const { language, theme, setLanguage, toggleTheme, isRTL } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="p-2"
      >
        <Globe className="h-4 w-4" />
        <span className="ml-1 text-xs">{language === 'ar' ? 'EN' : 'عر'}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="p-2"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};