import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { useTranslation } from '@/contexts/ThemeContext';

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  // Get user role from context or props (demo purposes)
  const userRole = 'admin'; // This would come from authentication context

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <ReportGenerator userRole={userRole} />;
      case 'schools': 
        return <ReportGenerator userRole={userRole} />;
      case 'competitions': 
        return <ReportGenerator userRole={userRole} />;
      case 'reports': 
        return <ReportGenerator userRole={userRole} />;
      case 'regions': 
        return <ReportGenerator userRole={userRole} />;
      case 'notifications':
        return <ReportGenerator userRole={userRole} />;
      default: 
        return <ReportGenerator userRole={userRole} />;
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