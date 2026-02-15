import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute - Acts as middleware (similar to Next.js Middleware)
 * Redirects unauthenticated users to /login
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#276EF1] mx-auto mb-3" />
          <p className="text-sm text-[#545454]">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * PublicRoute - Redirects authenticated users to /dashboard
 */
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#276EF1] mx-auto mb-3" />
          <p className="text-sm text-[#545454]">Loading…</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
