import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalLayout } from './components/layout/PortalLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubmissionsListPage } from './pages/SubmissionsListPage';
import { NewSubmissionWizardPage } from './pages/NewSubmissionWizardPage';
import { SubmissionDetailPage } from './pages/SubmissionDetailPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { HelpPage } from './pages/HelpPage';
import { PublicVerifyCertificatePage } from './pages/PublicVerifyCertificatePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-xs text-muted-foreground">
        Memeriksa sesi pengguna...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Unauthenticated Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/verify/public/:certNumber" element={<PublicVerifyCertificatePage />} />

            {/* Authenticated Portal Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/submissions" element={<SubmissionsListPage />} />
              <Route path="/submissions/new" element={<NewSubmissionWizardPage />} />
              <Route path="/submissions/:id/edit" element={<NewSubmissionWizardPage />} />
              <Route path="/submissions/:id" element={<SubmissionDetailPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/profile" element={<CompanyProfilePage />} />
              <Route path="/portal/help" element={<HelpPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
