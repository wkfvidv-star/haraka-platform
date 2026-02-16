import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import StudentDashboard from '@/pages/dashboards/StudentDashboard';
import CoachDashboard from '@/pages/dashboards/CoachDashboard';
import ParentDashboard from '@/pages/dashboards/ParentDashboard';
import MinistryDashboard from '@/pages/dashboards/MinistryDashboard';
import PrincipalDashboard from '@/pages/dashboards/PrincipalDashboard';
import AIAnalyticsPage from '@/pages/AIAnalyticsPage';
import PredictiveIntelligencePage from '@/pages/PredictiveIntelligencePage';
import AIControlCenterPage from '@/pages/AIControlCenterPage';
import StagingBanner from '@/components/staging/StagingBanner';
import { isStaging } from '@/config/staging';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          {/* شريط التنبيه للبيئة التجريبية */}
          {isStaging() && <StagingBanner />}
          
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/coach" element={<CoachDashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/ministry" element={<MinistryDashboard />} />
            <Route path="/principal" element={<PrincipalDashboard />} />
            <Route path="/ai-analytics" element={<AIAnalyticsPage />} />
            <Route path="/predictive-intelligence" element={<PredictiveIntelligencePage />} />
            <Route path="/ai-control-center" element={<AIControlCenterPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;