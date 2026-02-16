import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AIAnalyticsProvider } from '@/contexts/AIAnalyticsContext';
import { PredictiveIntelligenceProvider } from '@/contexts/PredictiveIntelligenceContext';
import { AIControlCenterProvider } from '@/contexts/AIControlCenterContext';
import { Toaster } from '@/components/ui/toaster';
import { AuthPage } from '@/pages/AuthPage';
import StudentDashboard from '@/pages/dashboards/StudentDashboard';
import YouthDashboard from '@/pages/dashboards/YouthDashboard';
import ParentDashboard from '@/pages/dashboards/ParentDashboard';
import TeacherDashboard from '@/pages/dashboards/TeacherDashboard';
import PrincipalDashboard from '@/pages/dashboards/PrincipalDashboard';
import CoachDashboard from '@/pages/dashboards/CoachDashboard';
import DirectorateDashboard from '@/pages/dashboards/DirectorateDashboard';
import MinistryDashboard from '@/pages/dashboards/MinistryDashboard';
import CompetitionDashboard from '@/pages/dashboards/CompetitionDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import { ExerciseSessionPage } from '@/pages/student/ExerciseSessionPage';

function AppRoutes() {
  const { user, environment } = useAuth();

  if (!user || !environment) {
    return <AuthPage />;
  }

  const getDashboardComponent = () => {
    // Environment-based routing with role validation
    if (environment === 'school') {
      switch (user.role) {
        case 'student':
          return <StudentDashboard />;
        case 'parent':
          return <ParentDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'principal':
          return <PrincipalDashboard />;
        case 'directorate':
          return <DirectorateDashboard />;
        case 'ministry':
          return <MinistryDashboard />;
        case 'admin':
          return <AdminDashboard />;
        default:
          return <StudentDashboard />;
      }
    } else if (environment === 'community') {
      switch (user.role) {
        case 'youth':
          return <YouthDashboard />;
        case 'coach':
          return <CoachDashboard />;
        case 'competition':
          return <CompetitionDashboard />;
        case 'admin':
          return <AdminDashboard />;
        default:
          return <YouthDashboard />;
      }
    }

    // Fallback
    return <StudentDashboard />;
  };

  return (
    <Routes>
      <Route path="/" element={getDashboardComponent()} />
      <Route path="/dashboard" element={getDashboardComponent()} />
      <Route path="/student/exercise/:packId" element={<ExerciseSessionPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AIAnalyticsProvider>
          <PredictiveIntelligenceProvider>
            <AIControlCenterProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <AppRoutes />
                  <Toaster />
                </div>
              </Router>
            </AIControlCenterProvider>
          </PredictiveIntelligenceProvider>
        </AIAnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;