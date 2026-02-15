import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { DashboardSkeleton } from './components/LoadingSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './hooks/useAuth';

/**
 * GradePilot - Grade Tracking Dashboard
 * 
 * Built with:
 * - React (Vite)
 * - Tailwind CSS
 * - Uber "Base" Design System
 * - Supabase for authentication and data persistence
 * 
 * Features:
 * - Grade Forecast Engine (What-If Calculator)
 * - Category Management with inline editing
 * - Visual Analytics (weight check, performance badges)
 * - Real-time Supabase sync
 * - User authentication with Google OAuth
 */

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <ErrorBoundary>
      <div className="antialiased">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
