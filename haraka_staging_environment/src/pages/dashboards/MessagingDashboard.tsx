import React, { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { MessagingSystem } from '@/components/messaging/MessagingSystem';
import { NotificationCenter } from '@/components/messaging/NotificationCenter';
import { useTranslation } from '@/contexts/ThemeContext';

export default function MessagingDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  // Get user role from context or props (demo purposes)
  const userRole = 'student'; // This would come from authentication context

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <MessagingSystem userRole={userRole} />;
      case 'schools': 
        return <MessagingSystem userRole={userRole} />;
      case 'competitions': 
        return <MessagingSystem userRole={userRole} />;
      case 'reports': 
        return <MessagingSystem userRole={userRole} />;
      case 'regions': 
        return <MessagingSystem userRole={userRole} />;
      case 'notifications':
        return <MessagingSystem userRole={userRole} />;
      default: 
        return <MessagingSystem userRole={userRole} />;
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

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        userRole={userRole}
      />
    </div>
  );
}