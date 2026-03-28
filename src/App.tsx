import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
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
import PlatformOwnerDashboard from '@/pages/dashboards/PlatformOwnerDashboard';
import { ExerciseSessionPage } from '@/pages/student/ExerciseSessionPage';
import DigitalIdentity from '@/pages/DigitalIdentity';
import LandingPage from '@/pages/Index';
import OnboardingPage from '@/pages/OnboardingPage';

function AppRoutes() {
  const { user, environment } = useAuth();

  const getDashboardComponent = () => {
    // Environment-based routing with role validation
    const normalizedRole = user.role?.toLowerCase() || '';

    if (environment === 'school') {
      switch (normalizedRole) {
        case 'student':
          return <StudentDashboard />;
        case 'parent':
          return <ParentDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'principal':
          return <AdminDashboard />; // Re-mapped to AdminDashboard to show the Admin UI to the user
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
      switch (normalizedRole) {
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

    // Super Admin Level
    if (normalizedRole === 'superadmin' || normalizedRole === 'platformowner') {
      return <PlatformOwnerDashboard />;
    }

    // Fallback
    return <StudentDashboard />;
  };

  return (
    <Routes>
      <Route path="/" element={(!user || !environment) ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={(!user || !environment) ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/onboarding" element={(user && environment) ? <OnboardingPage /> : <Navigate to="/auth" replace />} />
      <Route path="/dashboard" element={(user && environment) ? getDashboardComponent() : <Navigate to="/auth" replace />} />
      <Route path="/platform-owner" element={(user && environment) ? <PlatformOwnerDashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/identity" element={(user && environment) ? <DigitalIdentity /> : <Navigate to="/auth" replace />} />
      <Route path="/student/exercise/:packId" element={(user && environment) ? <ExerciseSessionPage /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;