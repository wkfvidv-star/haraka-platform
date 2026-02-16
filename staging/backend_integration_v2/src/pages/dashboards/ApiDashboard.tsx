import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { ApiDocumentation } from '@/components/api/ApiDocumentation';
import { useTranslation } from '@/contexts/ThemeContext';

export default function ApiDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <ApiDocumentation />;
      case 'schools': 
        return <ApiDocumentation />;
      case 'competitions': 
        return <ApiDocumentation />;
      case 'reports': 
        return <ApiDocumentation />;
      case 'regions': 
        return <ApiDocumentation />;
      case 'notifications':
        return <ApiDocumentation />;
      default: 
        return <ApiDocumentation />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className={`lg:ml-64 ${isRTL ? 'lg:mr-64 lg:ml-0' : ''}`}>
        <div className="pt-16 lg:pt-0 p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}