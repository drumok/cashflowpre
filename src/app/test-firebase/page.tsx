'use client';

import { useState } from 'react';
import { auth, db, isFirebaseAvailable } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function TestFirebasePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConfig = () => {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing',
    };

    setResult(`Firebase Available: ${isFirebaseAvailable()}
    
Config Status:
${Object.entries(config).map(([key, value]) => `${key}: ${value}`).join('\n')}

Actual Values:
API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20)}...
Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
`);
  };

  const testFirebaseAuth = async () => {
    setLoading(true);
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      console.log('Testing Firebase auth with:', testEmail);
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      const user = userCredential.user;
      
      console.log('User created:', user.uid);
      
      // Test Firestore
      await setDoc(doc(db, 'test', user.uid), {
        email: testEmail,
        createdAt: new Date().toISOString(),
        test: true
      });
      
      console.log('Firestore write successful');
      
      setResult(`✅ SUCCESS!
User created: ${user.uid}
Email: ${user.email}
Firestore write: Success`);
      
    } catch (error: any) {
      console.error('Firebase test error:', error);
      setResult(`❌ ERROR:
Code: ${error.code}
Message: ${error.message}
Stack: ${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testFirebaseConfig}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Test Firebase Config
          </button>
          
          <button
            onClick={testFirebaseAuth}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Firebase Auth & Firestore'}
          </button>
        </div>
        
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Test Results:</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}