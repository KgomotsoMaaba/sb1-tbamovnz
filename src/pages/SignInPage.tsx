import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw error;
      }
      
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      setError('Check your email for the password reset link.');
      setEmail('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: ['https://www.googleapis.com/auth/calendar'],
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl text-textPrimary dark:text-white text-center font-heading mb-2">
          {showResetPassword ? "Reset Password" : "Welcome to OpenCalendar"}
        </h1>
        <p className="text-textSecondary dark:text-gray-400 text-center text-sm mb-8">
          {showResetPassword 
            ? "Enter your email to receive a reset link" 
            : "Sign in to your account"}
        </p>

        {!showResetPassword && (
          <>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 mb-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-textPrimary dark:text-white"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-textSecondary dark:text-gray-400 text-sm">Or continue with Email</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </>
        )}

        <form 
          onSubmit={showResetPassword ? handlePasswordReset : handleEmailSignIn}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-textPrimary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            required
          />
          {!showResetPassword && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-textPrimary dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            />
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-600 hover:bg-accent-700 text-white rounded-lg py-3 transition-colors disabled:opacity-50"
          >
            {loading 
              ? "Loading..." 
              : showResetPassword 
                ? "Send Reset Link" 
                : "Sign In"}
          </button>
        </form>

        {!showResetPassword && (
          <button
            onClick={() => setShowResetPassword(true)}
            className="mt-4 w-full text-sm text-textSecondary dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400"
          >
            Forgot password?
          </button>
        )}

        {showResetPassword ? (
          <button
            onClick={() => setShowResetPassword(false)}
            className="mt-4 w-full text-sm text-textSecondary dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400"
          >
            Back to Sign In
          </button>
        ) : (
          <p className="mt-4 text-center text-sm text-textSecondary dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignInPage;