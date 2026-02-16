import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AcceptanceCriteria } from '@/components/testing/AcceptanceCriteria';
import { useTranslation } from '@/contexts/ThemeContext';

export default function TestingDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <AcceptanceCriteria />;
      case 'schools': 
        return <AcceptanceCriteria />;
      case 'competitions': 
        return <AcceptanceCriteria />;
      case 'reports': 
        return <AcceptanceCriteria />;
      case 'regions': 
        return <AcceptanceCriteria />;
      case 'notifications':
        return <AcceptanceCriteria />;
      default: 
        return <AcceptanceCriteria />;
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