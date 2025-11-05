'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleToggleMode = () => {
    router.push('/auth/login');
  };

  // Don't render the signup form if user is authenticated
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Start Your Free Trial</h1>
          <p className="text-white/80">Join 15,000+ SMBs growing their revenue</p>
        </div>

        {/* Signup Form with Google Auth */}
        <SignUpForm onToggleMode={handleToggleMode} />

        {/* Benefits Reminder */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-white/60 text-sm text-center mb-4">What you get with your free account:</p>
          <div className="space-y-2">
            {[
              '5MB data upload',
              'Basic revenue analysis',
              'Email support',
              'No credit card required'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting Links */}
        <div className="mt-4 text-center">
          <p className="text-white/60 text-sm mb-2">Having issues?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link 
              href="/firebase-test" 
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Test Firebase Connection
            </Link>
            <Link 
              href="/auth/signup-rest" 
              className="text-yellow-400 hover:text-yellow-300 text-sm underline"
            >
              Try Alternative Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}