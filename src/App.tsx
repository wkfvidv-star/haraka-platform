import React, { Component } from 'react';
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

// ── Global Error Boundary ────────────────────────────────────────────────────
class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', padding: '40px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', background: '#1e293b', borderRadius: 24, padding: 32, border: '2px solid #ef4444' }}>
            <h1 style={{ color: '#ef4444', fontSize: 28, fontWeight: 900, marginBottom: 12 }}>⚠️ خطأ في التحميل</h1>
            <p style={{ color: '#94a3b8', marginBottom: 20 }}>حدث خطأ غير متوقع. يرجى مشاركة التفاصيل أدناه للدعم الفني.</p>
            <div style={{ background: '#0f172a', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
              <p style={{ color: '#f87171', fontWeight: 700, marginBottom: 8 }}>{this.state.error?.message}</p>
              <pre style={{ color: '#64748b', fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap', direction: 'ltr', textAlign: 'left' }}>
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              onClick={() => window.location.href = '/auth'}
              style={{ marginTop: 24, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, padding: '12px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
            >
              العودة لصفحة الدخول
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


function AppRoutes() {
  const { user, environment, selectedRole } = useAuth();

  const isRoleAuthorized = () => {
    if (!user || !selectedRole) return false;
    return user.role?.toLowerCase() === selectedRole.toLowerCase();
  };

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
      <Route path="/" element={(!user || !environment || !isRoleAuthorized()) ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={(!user || !environment || !isRoleAuthorized()) ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/onboarding" element={(user && environment && isRoleAuthorized()) ? <OnboardingPage /> : <Navigate to="/auth" replace />} />
      <Route path="/dashboard" element={(user && environment && isRoleAuthorized()) ? getDashboardComponent() : <Navigate to="/auth" replace />} />
      <Route path="/platform-owner" element={(user && environment && (user.role === 'superadmin' || user.role === 'platformowner')) ? <PlatformOwnerDashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/identity" element={(user && environment) ? <DigitalIdentity /> : <Navigate to="/auth" replace />} />
      <Route path="/student/exercise/:packId" element={(user && environment) ? <ExerciseSessionPage /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AIAnalyticsProvider>
              <PredictiveIntelligenceProvider>
                <AIControlCenterProvider>
                  <Router>
                    <div className="min-h-screen bg-background">
                      <AppErrorBoundary>
                        <AppRoutes />
                      </AppErrorBoundary>
                      <Toaster />
                    </div>
                  </Router>
                </AIControlCenterProvider>
              </PredictiveIntelligenceProvider>
            </AIAnalyticsProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;