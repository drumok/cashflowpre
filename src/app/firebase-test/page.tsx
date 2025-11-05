'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth, db, isFirebaseAvailable } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = [];

    // Test 1: Environment Variables
    results.push({
      test: 'Environment Variables',
      status: isFirebaseAvailable() ? 'pass' : 'fail',
      message: isFirebaseAvailable() ? 'All Firebase env vars are set' : 'Missing Firebase environment variables',
      details: {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }
    });

    // Test 2: Firebase Initialization
    try {
      const authInstance = auth;
      results.push({
        test: 'Firebase Initialization',
        status: authInstance ? 'pass' : 'fail',
        message: authInstance ? 'Firebase Auth initialized successfully' : 'Failed to initialize Firebase Auth',
        details: { authInstance: !!authInstance }
      });
    } catch (error) {
      results.push({
        test: 'Firebase Initialization',
        status: 'fail',
        message: `Firebase initialization failed: ${error}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    // Test 3: Domain Authorization Test
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      results.push({
        test: 'Domain Authorization',
        status: 'pass',
        message: 'Domain is authorized for Firebase authentication',
        details: { domain: window.location.hostname }
      });
    } catch (error: any) {
      let status = 'fail';
      let message = 'Domain authorization test failed';
      
      if (error.code === 'auth/unauthorized-domain') {
        message = 'Domain is NOT authorized in Firebase console';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error - likely domain authorization issue';
      } else if (error.code === 'auth/email-already-in-use') {
        status = 'pass';
        message = 'Domain is authorized (test email already exists)';
      }
      
      results.push({
        test: 'Domain Authorization',
        status,
        message,
        details: { 
          errorCode: error.code,
          errorMessage: error.message,
          domain: window.location.hostname
        }
      });
    }

    // Test 4: Firestore Connection
    try {
      const dbInstance = db;
      results.push({
        test: 'Firestore Connection',
        status: dbInstance ? 'pass' : 'fail',
        message: dbInstance ? 'Firestore initialized successfully' : 'Failed to initialize Firestore',
        details: { dbInstance: !!dbInstance }
      });
    } catch (error) {
      results.push({
        test: 'Firestore Connection',
        status: 'fail',
        message: `Firestore connection failed: ${error}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase Configuration Test</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              This page tests your Firebase configuration to identify any issues with authentication.
            </p>
            
            <button
              onClick={runTests}
              disabled={testing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {testing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Running Tests...
                </>
              ) : (
                'Run Firebase Tests'
              )}
            </button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Test Results</h2>
              
              {testResults.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  <div className="flex items-center mb-2">
                    {getStatusIcon(result.status)}
                    <h3 className="text-lg font-medium text-gray-900 ml-2">{result.test}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{result.message}</p>
                  
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}

              {/* Fix Instructions */}
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🔧 How to Fix Domain Authorization Issues</h3>
                <div className="space-y-2 text-blue-800">
                  <p><strong>1. Go to Firebase Console:</strong></p>
                  <a 
                    href="https://console.firebase.google.com/project/ocrcsvcap/authentication/settings" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    https://console.firebase.google.com/project/ocrcsvcap/authentication/settings
                  </a>
                  
                  <p><strong>2. Scroll to "Authorized domains"</strong></p>
                  <p><strong>3. Click "Add domain"</strong></p>
                  <p><strong>4. Add this domain:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.hostname : 'smb-analytics-platform-286114068697.us-central1.run.app'}</code></p>
                  <p><strong>5. Click "Save"</strong></p>
                  <p><strong>6. Wait 1-2 minutes for changes to propagate</strong></p>
                  <p><strong>7. Run tests again</strong></p>
                </div>
              </div>

              {/* Current Domain Info */}
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Current Domain Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</p>
                  <p><strong>Full URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                  <p><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}