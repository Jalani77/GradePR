import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

/**
 * GradePilot - Grade Tracking Dashboard
 *
 * Built with:
 * - React (Vite)
 * - Tailwind CSS
 * - Supabase (auth + database)
 * - Uber "Base" Design System
 *
 * Features:
 * - Grade Forecast Engine (What-If Calculator + Safety Margin)
 * - Category Management with inline editing
 * - Visual Analytics (weight check, performance badges)
 * - Supabase-backed persistence with localStorage fallback
 * - Email/password & Google OAuth authentication
 */

const supabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  // If Supabase is not configured, render the Dashboard directly (local-only mode)
  if (!supabaseConfigured) {
    return (
      <ErrorBoundary>
        <div className="antialiased">
          <Dashboard />
        </div>
      </ErrorBoundary>
    );
  }

  // With Supabase: full routing + auth
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="antialiased">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
