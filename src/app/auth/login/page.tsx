'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleToggleMode = () => {
    router.push('/auth/signup');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Don't render the login form if user is authenticated
  if (!loading && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Login Form with Google Auth */}
        <LoginForm 
          onToggleMode={handleToggleMode}
          onForgotPassword={handleForgotPassword}
        />

        {showForgotPassword && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
            <p className="text-blue-400 text-sm text-center">
              Password reset functionality is available in the login form above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}