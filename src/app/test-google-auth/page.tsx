'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, isFirebaseAvailable } from '@/lib/firebase';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function TestGoogleAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (!isFirebaseAvailable()) {
        throw new Error('Firebase is not available');
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      setResult({
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      });
    } catch (error: any) {
      console.error('Google Auth test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <Link 
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Test Google Authentication</h1>
            <p className="text-white/80">Verify Google Sign-In is working</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm font-medium">Error:</p>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-400 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 text-sm font-medium">Success!</p>
                  <div className="text-green-400 text-sm mt-2">
                    <p><strong>UID:</strong> {result.user.uid}</p>
                    <p><strong>Email:</strong> {result.user.email}</p>
                    <p><strong>Name:</strong> {result.user.displayName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Test Google Sign-In</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              This will test if Google Authentication is properly configured in Firebase.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-white font-medium mb-2">Configuration Checklist:</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>✓ Firebase project configured</p>
              <p>✓ Google Auth provider enabled in Firebase Console</p>
              <p>✓ Authorized domains configured</p>
              <p>✓ OAuth consent screen configured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}