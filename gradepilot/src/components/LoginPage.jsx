import { useState } from 'react';
import { LogIn, Mail, Lock, BookOpen, TrendingUp, Target, Award } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../utils/supabase/client';

/**
 * Login/Signup Page Component
 */
export function LoginPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setError('Check your email for the confirmation link!');
      } else {
        await signInWithEmail(email, password);
        onAuthSuccess?.();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Google OAuth will redirect, so no onAuthSuccess needed here
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-[#000000] rounded-lg flex items-center justify-center">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">GradePilot</h1>
              <p className="text-[#545454] text-sm">Smart Grade Tracking</p>
            </div>
          </div>

          <h2 className="text-2xl font-black mb-6">
            Take Control of Your Academic Journey
          </h2>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-[#F0F7F4] rounded-lg">
              <div className="w-10 h-10 bg-[#05A357] rounded flex items-center justify-center flex-shrink-0">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm mb-1">Grade Forecasting</h3>
                <p className="text-sm text-[#545454]">
                  Calculate exactly what you need to achieve your target grade
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#F0F4FF] rounded-lg">
              <div className="w-10 h-10 bg-[#276EF1] rounded flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm mb-1">Category Management</h3>
                <p className="text-sm text-[#545454]">
                  Organize assignments by category with weighted averages
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#FAFAFA] rounded-lg">
              <div className="w-10 h-10 bg-[#000000] rounded flex items-center justify-center flex-shrink-0">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm mb-1">Real-Time Analytics</h3>
                <p className="text-sm text-[#545454]">
                  Track your performance and see best/worst case scenarios
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-col justify-center">
          <div className="card rounded p-8">
            <h2 className="text-2xl font-black mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[#545454] text-sm mb-6">
              {isSignUp 
                ? 'Start tracking your grades today' 
                : 'Sign in to access your dashboard'
              }
            </p>

            {/* Error Message */}
            {error && (
              <div className={`mb-4 p-3 rounded text-sm ${
                error.includes('Check your email') 
                  ? 'bg-[#F0F7F4] text-[#05A357]' 
                  : 'bg-[#FEF2F2] text-[#E11D48]'
              }`}>
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#545454]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#EEEEEE] rounded focus:border-[#000000] focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#545454]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-[#EEEEEE] rounded focus:border-[#000000] focus:outline-none transition-colors"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary rounded flex items-center justify-center gap-2"
                disabled={loading}
              >
                <LogIn size={16} />
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EEEEEE]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#545454]">OR</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 border border-[#EEEEEE] rounded font-semibold hover:bg-[#FAFAFA] transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            {/* Toggle Sign Up / Sign In */}
            <div className="mt-6 text-center text-sm">
              <span className="text-[#545454]">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              </span>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="font-semibold text-[#000000] hover:underline"
                type="button"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
