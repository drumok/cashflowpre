'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuthModal } from './AuthModal';
import { useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Access Required
            </h1>
            <p className="text-gray-600">
              Please sign in to access the SMB Analytics platform
            </p>
          </div>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In to Continue
          </button>
          
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}