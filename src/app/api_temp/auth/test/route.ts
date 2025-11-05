import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await auth().verifyIdToken(token);
    
    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
      message: 'Firebase authentication is working!'
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Firebase Admin SDK is configured',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  });
}