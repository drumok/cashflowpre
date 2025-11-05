'use client';

import { isFirebaseAvailable } from '@/lib/firebase';

export function FirebaseDebug() {
  const firebaseAvailable = isFirebaseAvailable();
  
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Firebase Debug Info:</h3>
      <p>Firebase Available: {firebaseAvailable ? '✅ Yes' : '❌ No'}</p>
      <div className="mt-2">
        <p><strong>Environment Variables:</strong></p>
        {Object.entries(config).map(([key, value]) => (
          <p key={key}>{key}: {value}</p>
        ))}
      </div>
      <div className="mt-2">
        <p><strong>Actual Values (first 10 chars):</strong></p>
        <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10)}...</p>
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
      </div>
    </div>
  );
}