'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = () => {
    setMode('forgot');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="mt-4">
            {mode === 'login' && (
              <LoginForm 
                onToggleMode={handleToggleMode}
                onForgotPassword={handleForgotPassword}
              />
            )}
            {mode === 'signup' && (
              <SignUpForm onToggleMode={handleToggleMode} />
            )}
            {mode === 'forgot' && (
              <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}