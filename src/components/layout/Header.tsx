'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BarChart3, User } from 'lucide-react';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, userProfile } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SMB Analytics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Free
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="block w-full px-3 py-2 text-gray-700 hover:text-blue-600 font-medium text-left"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="block w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                    >
                      Start Free
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </header>
  );
}